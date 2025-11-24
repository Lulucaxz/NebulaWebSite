// Retorna todos os usuários do banco, ordenados por ordem de criação (id crescente)
import { Router, Request } from 'express';
import { pool } from '../db';
import { RowDataPacket } from 'mysql2';
import { asyncHandler } from '../utils';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}


// Limita o ranking a no máximo 50 usuários
router.get('/rank', asyncHandler(async (_req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(`
      UPDATE usuario u
      JOIN (
        SELECT id, ROW_NUMBER() OVER (ORDER BY pontos DESC, id ASC) AS posicao
        FROM usuario
      ) ranked ON ranked.id = u.id
      SET u.colocacao = ranked.posicao
    `);

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT id, username, user, icon, pontos, colocacao
       FROM usuario
       ORDER BY colocacao ASC
       LIMIT 50`
    );

    await connection.commit();

    const users = rows.map((u) => ({
      id: u.id,
      username: u.username,
      user: u.user,
      icon: u.icon,
      pontos: u.pontos,
      colocacao: Number(u.colocacao),
    }));

    res.json(users);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}));

router.get('/rank/profile', asyncHandler(async (req, res) => {
  const { user, id } = req.query as { user?: string; id?: string };
  const authReq = req as AuthenticatedRequest;

  if (!user && !id) {
    res.status(400).json({ error: 'Parâmetro "user" ou "id" é obrigatório' });
    return;
  }

  let column: 'user' | 'id' = 'user';
  let value: string | number;

  if (id) {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    column = 'id';
    value = parsedId;
  } else {
    const trimmedUser = user!.trim();
    if (!trimmedUser) {
      res.status(400).json({ error: 'Usuário inválido' });
      return;
    }
    column = 'user';
    value = trimmedUser;
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, username, user, icon, banner, biografia, colocacao, pontos,
            progresso1, progresso2, progresso3, seguidores, seguindo
     FROM usuario
     WHERE ${column} = ?
     LIMIT 1`,
    [value]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  const row = rows[0];
  let isFollowing = false;
  let isSelf = false;

  if (authReq.isAuthenticated && authReq.isAuthenticated() && authReq.user) {
    isSelf = authReq.user.id === row.id;
    if (!isSelf) {
      const [relationRows] = await pool.query<RowDataPacket[]>(
        `SELECT 1 FROM usuario_follow WHERE seguidor_id = ? AND seguido_id = ? LIMIT 1`,
        [authReq.user.id, row.id]
      );
      isFollowing = relationRows.length > 0;
    }
  }

  res.json({
    id: row.id,
    username: row.username,
    user: row.user,
    icon: row.icon,
    banner: row.banner,
    biografia: row.biografia ?? '',
    colocacao: Number(row.colocacao),
    pontos: row.pontos,
    progresso1: row.progresso1 ?? 0,
    progresso2: row.progresso2 ?? 0,
    progresso3: row.progresso3 ?? 0,
    seguidores: row.seguidores ?? 0,
    seguindo: row.seguindo ?? 0,
    isFollowing,
    isSelf,
  });
}));

export default router;
