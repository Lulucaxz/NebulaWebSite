import express, { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import OpenAI from 'openai';
import { pool } from '../db';
import { asyncHandler } from '../utils';

const router = express.Router();

const openAiKey = process.env.OPENAI_API_KEY;
const graderModel = process.env.OPENAI_GRADER_MODEL || 'gpt-4.1-mini';
const openaiClient = openAiKey ? new OpenAI({ apiKey: openAiKey }) : null;

class RateLimitExceededError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitExceededError';
    this.statusCode = 429;
  }
}

type EssayGradePayload = {
  questionIndex: number;
  question: string;
  referenceAnswer: string;
  studentAnswer: string;
};

interface User { id: number }
type AuthenticatedRequest = Request & { isAuthenticated?: () => boolean; user?: User };

const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  const r = req as AuthenticatedRequest;
  if (!r.isAuthenticated || !r.isAuthenticated() || !r.user) {
    res.status(401).json({ error: 'Não autenticado' });
    return;
  }
  next();
};

const clamp01 = (value: number) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const normalizeExplanation = (text: string | undefined) => {
  if (!text) return '';
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length > 120) {
    return `${normalized.slice(0, 117)}...`;
  }
  return normalized;
};

const isRateLimitError = (error: unknown) => {
  const err = error as { status?: number; code?: string } | undefined;
  return err?.status === 429 || err?.code === 'rate_limit_exceeded';
};

const truncate = (text: string, max = 1200) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
};

const tryParseJson = (raw: string) => {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const extractResponseText = (completion: unknown): string | undefined => {
  const c = completion as { output_text?: unknown; output?: unknown } | undefined;
  if (Array.isArray(c?.output_text) && c.output_text.length > 0) {
    const text = c.output_text.join('\n').trim();
    if (text.length > 0) {
      return text;
    }
  }

  if (Array.isArray((c as Record<string, unknown>)?.output)) {
    const chunks: string[] = [];
    (c as { output: unknown[] }).output.forEach((item) => {
      const message = item as { content?: unknown[] };
      if (!Array.isArray(message?.content)) {
        return;
      }
      message.content.forEach((block) => {
        const b = block as { text?: unknown };
        if (typeof b.text === 'string') {
          chunks.push(b.text);
          return;
        }
        if (b.text && typeof (b.text as { value?: unknown }).value === 'string') {
          chunks.push((b.text as { value: string }).value);
        }
      });
    });

    const fallback = chunks.join('\n').trim();
    if (fallback.length > 0) {
      return fallback;
    }
  }

  return undefined;
};

const gradeEssayAnswer = async (payload: EssayGradePayload) => {
  if (!openaiClient) {
    throw new Error('Serviço de avaliação indisponível.');
  }

  const systemPrompt = `Você é um avaliador automático extremamente objetivo.
Compare a resposta do aluno com o gabarito e avalie com imparcialidade.
Retorne somente um JSON com dois campos: "score" (número entre 0 e 1) e "explanation" (texto em português com até 15 palavras).
Na explicação, descreva apenas o que foi atendido ou faltou, sem revelar detalhes do gabarito.
Use nota abaixo de 0.5 quando a resposta não cobre os pontos principais.`;

  const userPrompt = `Pergunta: ${truncate(payload.question, 600) || 'N/A'}
Gabarito referência: ${truncate(payload.referenceAnswer, 1200)}
Resposta do aluno: ${truncate(payload.studentAnswer, 1200)}

Avalie a resposta do aluno.`;

  const fullPrompt = `${systemPrompt}

${userPrompt}

Formato esperado do JSON: { "score": number entre 0 e 1, "explanation": "texto" }`;

  try {
    const completion = await openaiClient.responses.create({
      model: graderModel,
      temperature: 0,
      max_output_tokens: 400,
      input: fullPrompt
    });

    const rawText = extractResponseText(completion);
    if (!rawText) {
      throw new Error('Resposta inválida do OpenAI');
    }

    const parsed = tryParseJson(rawText);
    if (!parsed || typeof parsed.score === 'undefined') {
      throw new Error('Não foi possível interpretar a nota retornada.');
    }

    const explanation = normalizeExplanation(typeof parsed.explanation === 'string' ? parsed.explanation : '');
    return {
      score: clamp01(Number(parsed.score)),
      explanation
    };
  } catch (error) {
    if (isRateLimitError(error)) {
      throw new RateLimitExceededError('Limite de correções atingido. Aguarde alguns segundos e tente novamente.');
    }
    console.error('Erro ao avaliar questão dissertativa com OpenAI', error);
    throw new Error('Não foi possível consultar o OpenAI Graders no momento.');
  }
};

// GET / -> { modules: [...], activities: [...] }
router.get('/', ensureAuth, asyncHandler(async (req: Request, res: Response) => {
  const r = req as AuthenticatedRequest;
  const userId = r.user!.id;

  const [modRows] = await pool.query<RowDataPacket[]>(
    'SELECT assinatura, modulo_id FROM modulos_concluidos WHERE usuario_id = ?', [userId]
  );
  const [actRows] = await pool.query<RowDataPacket[]>(
    'SELECT assinatura, modulo_id, atividade_id FROM atividades_concluidas WHERE usuario_id = ?', [userId]
  );

  res.json({ modules: modRows.map(r => ({ assinatura: r.assinatura, modulo_id: Number(r.modulo_id) })),
               activities: actRows.map(a => ({ assinatura: a.assinatura, modulo_id: Number(a.modulo_id), atividade_id: Number(a.atividade_id) })) });
}));

// Helpers to map assinatura to progresso column and points per activity
const getProgressoCol = (assinatura: string) => {
  const lower = (assinatura || '').toLowerCase();
  if (lower.includes('galax')) return 'progresso2';
  if (lower.includes('univers')) return 'progresso3';
  return 'progresso1'; // default: órbita
};

const getPointsPerActivity = (assinatura: string) => {
  const lower = (assinatura || '').toLowerCase();
  if (lower.includes('galax')) return 10; // galáxia
  if (lower.includes('univers')) return 20; // universo
  return 5; // órbita
};

const normalizeScore = (value: unknown): number | undefined => {
  if (value === null || value === undefined) return undefined;
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return Math.min(Math.max(numeric, 0), 10);
};

// Module completion
router.post('/module/:assinatura/:moduloId', ensureAuth, asyncHandler(async (req: Request, res: Response) => {
  const r = req as AuthenticatedRequest;
  const userId = r.user!.id;
  const { assinatura, moduloId } = req.params;
  const mod = Number(moduloId);
  const [ins] = await pool.query<ResultSetHeader>('INSERT IGNORE INTO modulos_concluidos (usuario_id, assinatura, modulo_id) VALUES (?, ?, ?)', [userId, assinatura, mod]);
  if (ins.affectedRows && ins.affectedRows > 0) {
    const progressoCol = getProgressoCol(assinatura);
    await pool.query<ResultSetHeader>(`UPDATE usuario SET ${progressoCol} = ${progressoCol} + 1 WHERE id = ?`, [userId]);
  }
  res.status(201).json({ success: true, moduleInserted: Boolean(ins.affectedRows && ins.affectedRows > 0) });
}));

router.delete('/module/:assinatura/:moduloId', ensureAuth, asyncHandler(async (req: Request, res: Response) => {
  const r = req as AuthenticatedRequest;
  const userId = r.user!.id;
  const { assinatura, moduloId } = req.params;
  const mod = Number(moduloId);
  const [del] = await pool.query<ResultSetHeader>('DELETE FROM modulos_concluidos WHERE usuario_id = ? AND assinatura = ? AND modulo_id = ?', [userId, assinatura, mod]);
  if (del.affectedRows && del.affectedRows > 0) {
    const progressoCol = getProgressoCol(assinatura);
    await pool.query<ResultSetHeader>(`UPDATE usuario SET ${progressoCol} = CASE WHEN ${progressoCol} > 0 THEN ${progressoCol} - 1 ELSE 0 END WHERE id = ?`, [userId]);
  }
  res.json({ success: true, moduleDeleted: Boolean(del.affectedRows && del.affectedRows > 0) });
}));

router.post('/activity/dissertativas/avaliar', ensureAuth, asyncHandler(async (req: Request, res: Response) => {
  if (!openaiClient) {
    res.status(503).json({ error: 'OpenAI Graders não está configurado no servidor.' });
    return;
  }

  const items = Array.isArray(req.body?.items) ? (req.body.items as Array<Record<string, unknown>>) : [];
  if (items.length === 0) {
    res.status(400).json({ error: 'Nenhuma questão foi enviada para avaliação.' });
    return;
  }

  const sanitized: EssayGradePayload[] = items
    .map((item: Record<string, unknown>) => ({
      questionIndex: Number(item?.questionIndex),
      question: String(item?.question ?? ''),
      referenceAnswer: String(item?.referenceAnswer ?? ''),
      studentAnswer: String(item?.studentAnswer ?? ''),
    }))
    .filter((item: EssayGradePayload) => Number.isFinite(item.questionIndex));

  if (sanitized.length === 0) {
    res.status(400).json({ error: 'Formato das questões inválido.' });
    return;
  }

  if (sanitized.some((item) => !item.referenceAnswer.trim())) {
    res.status(400).json({ error: 'Existe questão dissertativa sem gabarito configurado.' });
    return;
  }

  if (sanitized.some((item) => !item.studentAnswer.trim())) {
    res.status(400).json({ error: 'Preencha todas as respostas dissertativas antes de enviar.' });
    return;
  }

  const limited = sanitized.slice(0, 10); // segurança
  const results: Array<{ questionIndex: number; score: number; isCorrect: boolean; explanation: string }> = [];

  for (const item of limited) {
    try {
      const grade = await gradeEssayAnswer(item);
      results.push({
        questionIndex: item.questionIndex,
        score: grade.score,
        isCorrect: grade.score >= 0.5,
        explanation: grade.explanation,
      });
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        res.status(429).json({ error: error.message });
        return;
      }
      throw error;
    }
  }

  res.json({ results });
}));

// Activity completion
router.post('/activity/:assinatura/:moduloId/:atividadeId', ensureAuth, asyncHandler(async (req: Request, res: Response) => {
  const r = req as AuthenticatedRequest;
  const userId = r.user!.id;
  const { assinatura, moduloId, atividadeId } = req.params;
  // accept optional totalActivities in body to determine module completion
  const totalActivities = typeof req.body?.totalActivities === 'number' ? Number(req.body.totalActivities) : undefined;
  const score = normalizeScore(req.body?.score);

  const [result] = await pool.query<ResultSetHeader>('INSERT IGNORE INTO atividades_concluidas (usuario_id, assinatura, modulo_id, atividade_id) VALUES (?, ?, ?, ?)', [userId, assinatura, Number(moduloId), Number(atividadeId)]);

  let addedPoints = false;
  let pointsAwarded = 0;
  if (result.affectedRows && result.affectedRows > 0) {
    addedPoints = true;
    const basePoints = getPointsPerActivity(assinatura);
    const scaledPoints = typeof score === 'number'
      ? Math.round(basePoints * (score / 10))
      : basePoints;
    const safePoints = Math.max(0, scaledPoints);
    if (safePoints > 0) {
      await pool.query<ResultSetHeader>(
        `UPDATE usuario SET pontos = pontos + ? WHERE id = ?`,
        [safePoints, userId]
      );
      pointsAwarded = safePoints;
    }
  }

  // If caller provided totalActivities, check whether the module is now complete
  let moduleCompleted = false;
  if (typeof totalActivities === 'number') {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(DISTINCT atividade_id) AS cnt FROM atividades_concluidas WHERE usuario_id = ? AND assinatura = ? AND modulo_id = ?', [userId, assinatura, Number(moduloId)]);
    const cnt = rows && rows[0] ? Number(rows[0].cnt) : 0;
    if (cnt >= totalActivities) {
      // mark module completed
      const [ins] = await pool.query<ResultSetHeader>('INSERT IGNORE INTO modulos_concluidos (usuario_id, assinatura, modulo_id) VALUES (?, ?, ?)', [userId, assinatura, Number(moduloId)]);
      if (ins.affectedRows && ins.affectedRows > 0) {
        const progressoCol = getProgressoCol(assinatura);
        await pool.query<ResultSetHeader>(`UPDATE usuario SET ${progressoCol} = ${progressoCol} + 1 WHERE id = ?`, [userId]);
      }
      moduleCompleted = true;
    }
  }

  res.status(201).json({ success: true, addedPoints, pointsAwarded, moduleCompleted });
}));

router.delete('/activity/:assinatura/:moduloId/:atividadeId', ensureAuth, asyncHandler(async (req: Request, res: Response) => {
  const r = req as AuthenticatedRequest;
  const userId = r.user!.id;
  const { assinatura, moduloId, atividadeId } = req.params;
  await pool.query<ResultSetHeader>('DELETE FROM atividades_concluidas WHERE usuario_id = ? AND assinatura = ? AND modulo_id = ? AND atividade_id = ?', [userId, assinatura, Number(moduloId), Number(atividadeId)]);

  // If caller provided totalActivities in body, and now the count is below total, remove module completion
  const totalActivities = typeof req.body?.totalActivities === 'number' ? Number(req.body.totalActivities) : undefined;
  if (typeof totalActivities === 'number') {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(DISTINCT atividade_id) AS cnt FROM atividades_concluidas WHERE usuario_id = ? AND assinatura = ? AND modulo_id = ?', [userId, assinatura, Number(moduloId)]);
    const cnt = rows && rows[0] ? Number(rows[0].cnt) : 0;
    if (cnt < totalActivities) {
      const [del] = await pool.query<ResultSetHeader>('DELETE FROM modulos_concluidos WHERE usuario_id = ? AND assinatura = ? AND modulo_id = ?', [userId, assinatura, Number(moduloId)]);
      if (del.affectedRows && del.affectedRows > 0) {
        const progressoCol = getProgressoCol(assinatura);
        await pool.query<ResultSetHeader>(`UPDATE usuario SET ${progressoCol} = CASE WHEN ${progressoCol} > 0 THEN ${progressoCol} - 1 ELSE 0 END WHERE id = ?`, [userId]);
      }
    }
  }

  res.json({ success: true });
}));

export default router;
