// Retorna todos os usuários do banco, ordenados por ordem de criação (id crescente)
import { Router } from 'express';
import { pool } from './db';

const router = Router();


// Limita o ranking a no máximo 50 usuários
router.get('/rank', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, user, icon FROM usuario ORDER BY id ASC LIMIT 50'
    );
    // Adiciona posição (rank) manualmente
    const users = (rows as any[]).map((u, i) => ({
      ...u,
      posicaoRank: (i + 1).toString(),
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar ranking', details: (err as any).message });
  }
});

export default router;
