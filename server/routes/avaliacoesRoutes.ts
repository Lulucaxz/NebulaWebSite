import { Router, Request } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db';
import { asyncHandler } from '../utils';

const router = Router();

type MaybeAuthenticatedRequest = Request & {
	isAuthenticated?: () => boolean;
	user?: {
		id: number;
	};
};

const normalizarCurso = (curso?: string | null): string => {
	if (!curso) {
		return 'UNIVERSO';
	}

	const valor = curso.trim().toUpperCase();
	if (valor.includes('GAL')) {
		return 'GALÁXIA';
	}
	if (valor.includes('ÓRBITA') || valor.includes('ORBITA')) {
		return 'ÓRBITA';
	}
	return 'UNIVERSO';
};

router.get('/', asyncHandler(async (req, res) => {
	const limitParam = Number(req.query.limit);
	const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 60;

	const [rows] = await pool.query<RowDataPacket[]>(
		`SELECT a.id, a.estrelas, a.texto, a.created_at, a.curso, u.username, u.icon
		 FROM avaliacao a
		 JOIN usuario u ON u.id = a.usuario_id
		 ORDER BY a.created_at DESC
		 LIMIT ?`,
		[limit]
	);

	const payload = rows.map((row) => ({
		id: row.id,
		nome: row.username,
		curso: normalizarCurso(row.curso as string | null),
		estrelas: Number(row.estrelas),
		foto: row.icon,
		texto: row.texto,
		createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
	}));

	res.json(payload);
}));

router.post('/', asyncHandler(async (req, res) => {
	const authReq = req as MaybeAuthenticatedRequest;
	if (!authReq.isAuthenticated || !authReq.isAuthenticated() || !authReq.user) {
		res.status(401).json({ error: 'É necessário estar autenticado para enviar uma avaliação.' });
		return;
	}

	const { estrelas, texto } = req.body as { estrelas?: number; texto?: string };
	const rating = Number(estrelas);
	const comentario = typeof texto === 'string' ? texto.trim() : '';

	if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
		res.status(400).json({ error: 'Informe uma avaliação entre 1 e 5 estrelas.' });
		return;
	}

	if (comentario.length < 10) {
		res.status(400).json({ error: 'Conte pelo menos 10 caracteres sobre sua experiência.' });
		return;
	}

	if (comentario.length > 1000) {
		res.status(400).json({ error: 'O feedback pode ter no máximo 1000 caracteres.' });
		return;
	}

	const [userRows] = await pool.query<RowDataPacket[]>(
		'SELECT username, icon, curso FROM usuario WHERE id = ? LIMIT 1',
		[authReq.user.id]
	);

	if (userRows.length === 0) {
		res.status(404).json({ error: 'Usuário não encontrado.' });
		return;
	}

	const usuario = userRows[0];

	const [result] = await pool.query<ResultSetHeader>(
		'INSERT INTO avaliacao (usuario_id, estrelas, texto, curso) VALUES (?, ?, ?, ?)',
		[authReq.user.id, rating, comentario, usuario.curso ?? null]
	);

	const createdAt = new Date().toISOString();
	const payload = {
		id: result.insertId,
		nome: usuario.username,
		curso: normalizarCurso(usuario.curso as string | null),
		estrelas: rating,
		foto: usuario.icon,
		texto: comentario,
		createdAt,
	};

	res.status(201).json(payload);
}));

export default router;
