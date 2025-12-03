import express, { NextFunction, Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db';
import { asyncHandler } from '../utils';
import {
  CUSTOM_ACTIVITY_ID_OFFSET,
  CUSTOM_MODULE_ID_OFFSET,
  CUSTOM_VIDEO_ID_OFFSET,
  ALLOWED_ASSINATURAS,
} from '../courseConstants';

const router = express.Router();

type AuthenticatedUser = { id: number; role?: string | null };
type AuthenticatedRequest = Request & { isAuthenticated?: () => boolean; user?: AuthenticatedUser };

const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  const r = req as AuthenticatedRequest;
  if (!r.isAuthenticated || !r.isAuthenticated() || !r.user) {
    res.status(401).json({ error: 'Não autenticado' });
    return;
  }
  next();
};

const ensureProfessor = (req: Request, res: Response, next: NextFunction) => {
  const r = req as AuthenticatedRequest;
  if (!r.user || (r.user.role ?? 'aluno') !== 'professor') {
    res.status(403).json({ error: 'Acesso restrito aos professores.' });
    return;
  }
  next();
};

interface ModuleRow extends RowDataPacket {
  id: number;
  assinatura: string;
  titulo: string;
  descricao: string;
  introducao_descricao: string;
  introducao_video: string;
  introducao_background: string;
  ordem: number;
}

interface ActivityRow extends RowDataPacket {
  id: number;
  modulo_id: number;
  titulo: string;
  descricao: string;
  questoes: string | null;
  ordem: number;
}

interface VideoRow extends RowDataPacket {
  id: number;
  modulo_id: number;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  video_url: string;
  background_url: string | null;
  ordem: number;
}

interface QuestaoPayload {
  questao: string;
  dissertativa?: boolean;
  alternativas?: string[];
  respostaCorreta?: string;
}

const parseQuestoes = (raw: unknown): QuestaoPayload[] => {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return (parsed as unknown[])
      .map((item): QuestaoPayload | null => {
        if (!item || typeof item !== 'object') {
          return null;
        }
        const data = item as Record<string, unknown>;
        const questao = sanitizeText(data.questao, 2000);
        if (!questao) {
          return null;
        }
        const dissertativa = Boolean(data.dissertativa);
        const alternativasRaw = Array.isArray(data.alternativas) ? data.alternativas : undefined;
        const alternativas = alternativasRaw
          ?.map((alt) => sanitizeText(alt, 255))
          .filter((alt): alt is string => Boolean(alt));
        const respostaCorreta = sanitizeText(data.respostaCorreta, 500) || undefined;
        return {
          questao,
          dissertativa,
          alternativas,
          respostaCorreta,
        };
      })
      .filter((item): item is QuestaoPayload => Boolean(item));
  } catch (error) {
    console.warn('Falha ao interpretar questões armazenadas', error);
    return [];
  }
};

const toPublicModuleId = (id: number) => CUSTOM_MODULE_ID_OFFSET + id;
const toPublicActivityId = (id: number) => CUSTOM_ACTIVITY_ID_OFFSET + id;
const toPublicVideoId = (id: number) => CUSTOM_VIDEO_ID_OFFSET + id;

const fromPublicModuleId = (publicId: number) => {
  if (!Number.isInteger(publicId) || publicId < CUSTOM_MODULE_ID_OFFSET) {
    return null;
  }
  return publicId - CUSTOM_MODULE_ID_OFFSET;
};

const MAX_VIDEO_URL_LENGTH = 1024;
const MAX_BACKGROUND_URL_LENGTH = 64000;

const sanitizeText = (value: unknown, maxLength: number) => {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) : text;
};

const normalizeAssinatura = (value: unknown) => {
  const option = String(value ?? '').trim().toLowerCase();
  return ALLOWED_ASSINATURAS.has(option) ? option : null;
};

const fetchModulesByRows = async (rows: ModuleRow[]) => {
  if (!rows.length) {
    return [];
  }
  const moduleIds = rows.map((row) => row.id);
  const placeholders = moduleIds.map(() => '?').join(',');

  const [activityRowsRaw] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM curso_modulo_atividade WHERE modulo_id IN (${placeholders}) ORDER BY ordem ASC, id ASC`,
    moduleIds
  );
  const [videoRowsRaw] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM curso_modulo_video WHERE modulo_id IN (${placeholders}) ORDER BY ordem ASC, id ASC`,
    moduleIds
  );
  const activityRows = activityRowsRaw as ActivityRow[];
  const videoRows = videoRowsRaw as VideoRow[];

  const activityMap = new Map<number, ActivityRow[]>();
  activityRows.forEach((row) => {
    const list = activityMap.get(row.modulo_id) ?? [];
    list.push(row);
    activityMap.set(row.modulo_id, list);
  });

  const videoMap = new Map<number, VideoRow[]>();
  videoRows.forEach((row) => {
    const list = videoMap.get(row.modulo_id) ?? [];
    list.push(row);
    videoMap.set(row.modulo_id, list);
  });

  return rows.map((row) => {
    const publicId = toPublicModuleId(row.id);
    const atividades = (activityMap.get(row.id) ?? []).map((act) => ({
      id: toPublicActivityId(act.id),
      template: {
        titulo: act.titulo,
        descricao: act.descricao,
      },
      questoes: parseQuestoes(act.questoes),
    }));

    const videoAulas = (videoMap.get(row.id) ?? []).map((video) => ({
      id: toPublicVideoId(video.id),
      titulo: video.titulo,
      subtitulo: video.subtitulo ?? undefined,
      descricao: video.descricao ?? undefined,
      video: video.video_url,
      backgroundImage: video.background_url ?? undefined,
    }));

    return {
      id: publicId,
      assinatura: row.assinatura,
      template: {
        titulo: row.titulo,
        descricao: row.descricao,
      },
      introducao: {
        id: publicId,
        descricao: row.introducao_descricao,
        videoBackground: row.introducao_background,
        video: row.introducao_video,
      },
      atividades,
      videoAulas,
      ordem: row.ordem,
    };
  });
};

const sanitizeQuestaoPayload = (payload: unknown): QuestaoPayload | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const data = payload as Record<string, unknown>;
  const questao = sanitizeText(data.questao, 2000);
  if (!questao) {
    return null;
  }
  const alternativasValue = data.alternativas;
  const alternativas = Array.isArray(alternativasValue)
    ? alternativasValue
        .map((alt) => sanitizeText(alt, 255))
        .filter((alt) => alt.length > 0)
    : undefined;
  const respostaCorreta = sanitizeText(data.respostaCorreta, 500);
  const dissertativa = Boolean(data.dissertativa);
  return {
    questao,
    dissertativa,
    alternativas: alternativas && alternativas.length > 0 ? alternativas : undefined,
    respostaCorreta: respostaCorreta || undefined,
  };
};

const sanitizeActivity = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const data = payload as Record<string, unknown>;
  const titulo = sanitizeText(data.titulo, 255);
  const descricao = sanitizeText(data.descricao, 2000);
  if (!titulo || !descricao) {
    return null;
  }
  const questoesInput = Array.isArray(data.questoes) ? data.questoes : [];
  const questoes = questoesInput
    .map((item) => sanitizeQuestaoPayload(item))
    .filter((item): item is QuestaoPayload => Boolean(item));
  const ordem = Number.isFinite(Number(data.ordem)) ? Number(data.ordem) : 0;
  return { titulo, descricao, questoes, ordem };
};

const sanitizeVideo = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const data = payload as Record<string, unknown>;
  const titulo = sanitizeText(data.titulo, 255);
  const video = sanitizeText(data.videoUrl ?? data.video, MAX_VIDEO_URL_LENGTH);
  if (!titulo || !video) {
    return null;
  }
  const subtitulo = sanitizeText(data.subtitulo, 255) || undefined;
  const descricao = sanitizeText(data.descricao, 2000) || undefined;
  const background = sanitizeText(
    data.backgroundUrl ?? data.backgroundImage,
    MAX_BACKGROUND_URL_LENGTH
  ) || undefined;
  const ordem = Number.isFinite(Number(data.ordem)) ? Number(data.ordem) : 0;
  return { titulo, video, subtitulo, descricao, background, ordem };
};

const isSanitizedActivity = (
  item: ReturnType<typeof sanitizeActivity>
): item is NonNullable<ReturnType<typeof sanitizeActivity>> => Boolean(item);

const isSanitizedVideo = (
  item: ReturnType<typeof sanitizeVideo>
): item is NonNullable<ReturnType<typeof sanitizeVideo>> => Boolean(item);

router.get(
  '/assinaturas/:assinatura',
  asyncHandler(async (req: Request, res: Response) => {
    const assinatura = normalizeAssinatura(req.params.assinatura);
    if (!assinatura) {
      res.json({ modules: [] });
      return;
    }
    const [rows] = await pool.query<ModuleRow[]>(
      'SELECT * FROM curso_modulo_custom WHERE assinatura = ? ORDER BY ordem ASC, id ASC',
      [assinatura]
    );
    const modules = await fetchModulesByRows(rows);
    res.json({ modules });
  })
);

router.get(
  '/modules/:moduleId',
  asyncHandler(async (req: Request, res: Response) => {
    const modulePublicId = Number(req.params.moduleId);
    if (!Number.isFinite(modulePublicId)) {
      res.status(400).json({ error: 'Identificador inválido.' });
      return;
    }
    const dbId = fromPublicModuleId(modulePublicId);
    if (!dbId) {
      res.status(404).json({ error: 'Módulo não encontrado.' });
      return;
    }
    const [rows] = await pool.query<ModuleRow[]>(
      'SELECT * FROM curso_modulo_custom WHERE id = ? LIMIT 1',
      [dbId]
    );
    if (!rows.length) {
      res.status(404).json({ error: 'Módulo não encontrado.' });
      return;
    }
    const modules = await fetchModulesByRows(rows);
    res.json({ module: modules[0] });
  })
);

router.get(
  '/professor/modules',
  ensureAuth,
  ensureProfessor,
  asyncHandler(async (req: Request, res: Response) => {
    const r = req as AuthenticatedRequest;
    const [rows] = await pool.query<ModuleRow[]>(
      'SELECT * FROM curso_modulo_custom WHERE created_by = ? ORDER BY updated_at DESC',
      [r.user!.id]
    );
    const modules = rows.map((row) => ({
      id: toPublicModuleId(row.id),
      assinatura: row.assinatura,
      titulo: row.titulo,
      descricao: row.descricao,
      ordem: row.ordem,
    }));
    res.json({ modules });
  })
);

router.post(
  '/modules',
  ensureAuth,
  ensureProfessor,
  asyncHandler(async (req: Request, res: Response) => {
    const assinatura = normalizeAssinatura(req.body?.assinatura);
    const titulo = sanitizeText(req.body?.titulo, 255);
    const descricao = sanitizeText(req.body?.descricao, 2000);
    const introDescricao = sanitizeText(req.body?.introducaoDescricao, 4000);
    const introVideo = sanitizeText(req.body?.introducaoVideo, MAX_VIDEO_URL_LENGTH);
    const introBackground = sanitizeText(
      req.body?.introducaoBackground,
      MAX_BACKGROUND_URL_LENGTH
    );
    const ordem = Number.isFinite(Number(req.body?.ordem)) ? Number(req.body?.ordem) : 0;

    if (!assinatura || !titulo || !descricao || !introDescricao || !introVideo || !introBackground) {
      res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    const atividadesInput: unknown[] = Array.isArray(req.body?.atividades) ? req.body.atividades : [];
    const videosInput: unknown[] = Array.isArray(req.body?.videoAulas) ? req.body.videoAulas : [];

    const atividades = atividadesInput
      .map((item: unknown) => sanitizeActivity(item))
      .filter(isSanitizedActivity);

    const videos = videosInput
      .map((item: unknown) => sanitizeVideo(item))
      .filter(isSanitizedVideo);

    const r = req as AuthenticatedRequest;
    const connection = await pool.getConnection();
    let moduleId = 0;

    try {
      await connection.beginTransaction();
      const [moduleResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO curso_modulo_custom
          (assinatura, titulo, descricao, introducao_descricao, introducao_video, introducao_background, ordem, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [assinatura, titulo, descricao, introDescricao, introVideo, introBackground, ordem, r.user!.id, r.user!.id]
      );
      moduleId = moduleResult.insertId;

      for (const atividade of atividades) {
        await connection.query<ResultSetHeader>(
          `INSERT INTO curso_modulo_atividade (modulo_id, titulo, descricao, questoes, ordem)
           VALUES (?, ?, ?, ?, ?)`,
          [moduleId, atividade.titulo, atividade.descricao, JSON.stringify(atividade.questoes ?? []), atividade.ordem]
        );
      }

      for (const video of videos) {
        await connection.query<ResultSetHeader>(
          `INSERT INTO curso_modulo_video (modulo_id, titulo, subtitulo, descricao, video_url, background_url, ordem)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [moduleId, video.titulo, video.subtitulo ?? null, video.descricao ?? null, video.video, video.background ?? null, video.ordem]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const [rows] = await pool.query<ModuleRow[]>(
      'SELECT * FROM curso_modulo_custom WHERE id = ? LIMIT 1',
      [moduleId]
    );
    const modules = await fetchModulesByRows(rows);
    res.status(201).json({ module: modules[0] });
  })
);

const ensureModuleOwnership = async (modulePublicId: number, userId: number) => {
  const dbId = fromPublicModuleId(modulePublicId);
  if (!dbId) {
    return { dbId: null, error: 'Módulo inválido.' };
  }
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT created_by FROM curso_modulo_custom WHERE id = ? LIMIT 1',
    [dbId]
  );
  if (!rows.length) {
    return { dbId: null, error: 'Módulo não encontrado.' };
  }
  if (Number(rows[0].created_by) !== userId) {
    return { dbId: null, error: 'Você não pode editar este módulo.' };
  }
  return { dbId, error: null };
};

router.post(
  '/modules/:moduleId/activities',
  ensureAuth,
  ensureProfessor,
  asyncHandler(async (req: Request, res: Response) => {
    const modulePublicId = Number(req.params.moduleId);
    if (!Number.isFinite(modulePublicId)) {
      res.status(400).json({ error: 'Identificador inválido.' });
      return;
    }
    const r = req as AuthenticatedRequest;
    const ownership = await ensureModuleOwnership(modulePublicId, r.user!.id);
    if (ownership.error || !ownership.dbId) {
      res.status(ownership.error === 'Você não pode editar este módulo.' ? 403 : 404).json({ error: ownership.error });
      return;
    }

    const atividade = sanitizeActivity(req.body);
    if (!atividade) {
      res.status(400).json({ error: 'Dados da atividade inválidos.' });
      return;
    }

    await pool.query<ResultSetHeader>(
      `INSERT INTO curso_modulo_atividade (modulo_id, titulo, descricao, questoes, ordem)
       VALUES (?, ?, ?, ?, ?)`,
      [ownership.dbId, atividade.titulo, atividade.descricao, JSON.stringify(atividade.questoes ?? []), atividade.ordem]
    );

    res.status(201).json({ message: 'Atividade criada com sucesso.' });
  })
);

router.post(
  '/modules/:moduleId/videos',
  ensureAuth,
  ensureProfessor,
  asyncHandler(async (req: Request, res: Response) => {
    const modulePublicId = Number(req.params.moduleId);
    if (!Number.isFinite(modulePublicId)) {
      res.status(400).json({ error: 'Identificador inválido.' });
      return;
    }
    const r = req as AuthenticatedRequest;
    const ownership = await ensureModuleOwnership(modulePublicId, r.user!.id);
    if (ownership.error || !ownership.dbId) {
      res.status(ownership.error === 'Você não pode editar este módulo.' ? 403 : 404).json({ error: ownership.error });
      return;
    }

    const video = sanitizeVideo(req.body);
    if (!video) {
      res.status(400).json({ error: 'Dados do vídeo inválidos.' });
      return;
    }

    await pool.query<ResultSetHeader>(
      `INSERT INTO curso_modulo_video (modulo_id, titulo, subtitulo, descricao, video_url, background_url, ordem)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ownership.dbId, video.titulo, video.subtitulo ?? null, video.descricao ?? null, video.video, video.background ?? null, video.ordem]
    );

    res.status(201).json({ message: 'Vídeo cadastrado com sucesso.' });
  })
);

export default router;
