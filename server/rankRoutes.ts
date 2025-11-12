// Retorna todos os usuários do banco, ordenados por ordem de criação (id crescente)
import { Router } from 'express';
import { pool } from './db';
import { RowDataPacket } from 'mysql2';
import { asyncHandler } from './utils';

const router = Router();


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

export default router;
