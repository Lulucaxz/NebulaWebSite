import express, { Request, Response, NextFunction } from 'express';
import { pool } from './db';
import { asyncHandler } from './utils';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

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

// Activity completion
router.post('/activity/:assinatura/:moduloId/:atividadeId', ensureAuth, asyncHandler(async (req: Request, res: Response) => {
  const r = req as AuthenticatedRequest;
  const userId = r.user!.id;
  const { assinatura, moduloId, atividadeId } = req.params;
  // accept optional totalActivities in body to determine module completion
  const totalActivities = typeof req.body?.totalActivities === 'number' ? Number(req.body.totalActivities) : undefined;

  const [result] = await pool.query<ResultSetHeader>('INSERT IGNORE INTO atividades_concluidas (usuario_id, assinatura, modulo_id, atividade_id) VALUES (?, ?, ?, ?)', [userId, assinatura, Number(moduloId), Number(atividadeId)]);

  let addedPoints = false;
  if (result.affectedRows && result.affectedRows > 0) {
    addedPoints = true;
    const pointsToAdd = getPointsPerActivity(assinatura);
    // Only update pontos on activity completion
    await pool.query<ResultSetHeader>(
      `UPDATE usuario SET pontos = pontos + ? WHERE id = ?`,
      [pointsToAdd, userId]
    );
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

  res.status(201).json({ success: true, addedPoints, moduleCompleted });
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
