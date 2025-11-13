
import express, { Request, Response, NextFunction } from 'express';
import { pool } from "./db";
import { asyncHandler } from "./utils"; 
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface AnotacaoRow extends RowDataPacket {
  id: string;
  usuario_id: number;
  conteudo: string;
  img: string | null;
  hasPdf: number;
  coluna: number;
  pdfNome?: string | null;
  created_at: string;
  posicao: number;
}
interface MaxPosRow extends RowDataPacket { maxPos: number | null }

type AnotacaoResponse = {
  id: string;
  usuario_id: number;
  conteudo: string;
  img: string | null;
  pdf: string | null;
  coluna: number;
  pdfNome: string | null;
  created_at: string;
  posicao: number;
};

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const resolveBaseUrl = (req: Request) => {
  const forwardedProto = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0]?.trim();
  const protocol = forwardedProto || req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

const mapAnotacaoResponse = (req: Request, row: AnotacaoRow): AnotacaoResponse => ({
  id: row.id,
  usuario_id: row.usuario_id,
  conteudo: row.conteudo,
  img: row.img,
  pdf: row.hasPdf ? `${resolveBaseUrl(req)}/api/anotacoes/${row.id}/pdf` : null,
  coluna: row.coluna,
  pdfNome: row.pdfNome ?? null,
  created_at: row.created_at,
  posicao: row.posicao,
});

// Helper: Função de Upload para o Cloudinary (copiada do seu index.ts)
const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "NEBULA_ANOTACOES" }, // Pasta dedicada
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload falhou"));
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

interface User { id: number }
type AuthenticatedRequest = Request & { isAuthenticated?: () => boolean; user?: User };

// Middleware: Checar se está autenticado
const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.isAuthenticated || !authReq.isAuthenticated() || !authReq.user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  next();
};

// --- ROTAS CRUD PARA ANOTAÇÕES ---

// [READ] Obter todas as anotações do usuário logado
router.get('/', isAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.id;
  // Ordena primeiro pela coluna (1,2,3) para agrupar por coluna,
  // e depois por posicao DESC (maior posicao aparece primeiro). Posicao
  // é gerenciada no backend e salva no banco.
  const [rows] = await pool.query<AnotacaoRow[]>(
    "SELECT id, usuario_id, conteudo, img, (pdf IS NOT NULL) AS hasPdf, coluna, pdfNome, created_at, posicao FROM anotacoes WHERE usuario_id = ? ORDER BY coluna ASC, posicao DESC",
    [userId]
  );
  const response = rows.map((row) => mapAnotacaoResponse(req, row));
  res.json(response);
}));

// [CREATE] Criar uma nova anotação
router.post('/', isAuthenticated, upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), asyncHandler(async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.id;
  const { conteudo, coluna } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let imgUrl: string | null = null;
  let pdfBuffer: Buffer | null = null;
  let pdfNome: string | null = null;

  // Upload da Imagem (se existir)
  if (files['imagem'] && files['imagem'][0]) {
    imgUrl = await uploadToCloudinary(files['imagem'][0].buffer);
  }

  // Upload do PDF (se existir)
  if (files['pdf'] && files['pdf'][0]) {
    pdfBuffer = files['pdf'][0].buffer;
    pdfNome = files['pdf'][0].originalname; // Salva o nome original
  }

  // Validar se há conteúdo
  if (!imgUrl && !pdfBuffer && !conteudo) {
    return res.status(400).json({ error: "Anotação não pode estar vazia" });
  }
  
  const newId = uuidv4(); // Gera um UUID para o ID

  // Define posicao para ficar no topo da coluna: max(posicao)+1
  const [maxRows] = await pool.query<MaxPosRow[]>(
    "SELECT MAX(posicao) as maxPos FROM anotacoes WHERE usuario_id = ? AND coluna = ?",
    [userId, Number(coluna)]
  );
  const maxPos = (maxRows && maxRows[0] && Number(maxRows[0].maxPos)) || 0;
  const newPos = Number(maxPos) + 1;

  await pool.query<ResultSetHeader>(
    "INSERT INTO anotacoes (id, usuario_id, coluna, conteudo, img, pdf, pdfNome, posicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [newId, userId, Number(coluna), conteudo || '', imgUrl, pdfBuffer, pdfNome, newPos]
  );

  // Retorna a anotação recém-criada
  const [rows] = await pool.query<AnotacaoRow[]>(
    "SELECT id, usuario_id, conteudo, img, (pdf IS NOT NULL) AS hasPdf, coluna, pdfNome, created_at, posicao FROM anotacoes WHERE id = ?",
    [newId]
  );
  const anotacao = rows[0];
  res.status(201).json(mapAnotacaoResponse(req, anotacao));
}));

// [UPDATE] Atualizar uma anotação existente
router.put('/:id', isAuthenticated, upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), asyncHandler(async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.id;
  const { id } = req.params;
  const { conteudo, coluna, pdfNome: bodyPdfNome } = req.body; // Pega os dados
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let imgUrl: string | undefined;
  let pdfBuffer: Buffer | undefined;
  let pdfNome: string | undefined = bodyPdfNome; // Nome vindo do body

  // Upload de nova Imagem
  if (files['imagem'] && files['imagem'][0]) {
    imgUrl = await uploadToCloudinary(files['imagem'][0].buffer);
  }

  // Upload de novo PDF
  if (files['pdf'] && files['pdf'][0]) {
    pdfBuffer = files['pdf'][0].buffer;
    pdfNome = files['pdf'][0].originalname; // Salva o novo nome
  }
  
  // Monta a query dinâmica (baseado no seu /auth/update)
  const fields = [];
  const values = [];

  if (typeof conteudo !== 'undefined') {
    fields.push("conteudo = ?");
    values.push(conteudo);
  }
  let colunaMudou = false;
  if (typeof coluna !== 'undefined') {
    fields.push("coluna = ?");
    values.push(Number(coluna));
    colunaMudou = true;
  }
  if (imgUrl) { // Se fez upload de nova imagem
    fields.push("img = ?");
    values.push(imgUrl);
  }
  if (pdfBuffer) { // Se fez upload de novo PDF
    fields.push("pdf = ?");
    values.push(pdfBuffer);
    fields.push("pdfNome = ?");
    values.push(pdfNome);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Nenhuma informação para atualizar" });
  }

  // If column changed, assign a new posicao at top of target column
  if (colunaMudou) {
    // compute new posicao in the new column
    const targetCol = Number(coluna);
    const [maxRows2] = await pool.query<MaxPosRow[]>(
      "SELECT MAX(posicao) as maxPos FROM anotacoes WHERE usuario_id = ? AND coluna = ?",
      [userId, targetCol]
    );
    const maxPos2 = (maxRows2 && maxRows2[0] && Number(maxRows2[0].maxPos)) || 0;
    const newPos2 = Number(maxPos2) + 1;
    fields.push("posicao = ?");
    values.push(newPos2);
  }

  values.push(id);
  values.push(userId);

  await pool.query<ResultSetHeader>(
    `UPDATE anotacoes SET ${fields.join(", ")} WHERE id = ? AND usuario_id = ?`,
    values
  );

  // Retorna a anotação atualizada
  const [rows] = await pool.query<AnotacaoRow[]>(
    "SELECT id, usuario_id, conteudo, img, (pdf IS NOT NULL) AS hasPdf, coluna, pdfNome, created_at, posicao FROM anotacoes WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: "Anotação não encontrada" });
  }
  res.json(mapAnotacaoResponse(req, rows[0]));
}));

// [READ] Baixar PDF armazenado no banco
router.get('/:id/pdf', isAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.id;
  const { id } = req.params;

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT pdf, pdfNome FROM anotacoes WHERE id = ? AND usuario_id = ?",
    [id, userId]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: 'Anotação não encontrada' });
    return;
  }

  const row = rows[0] as { pdf: Buffer | null; pdfNome: string | null };

  if (!row.pdf) {
    res.status(404).json({ error: 'Nenhum PDF associado a esta anotação' });
    return;
  }

  const filename = row.pdfNome?.trim().length ? row.pdfNome!.trim() : `${id}.pdf`;
  const asciiFallback = filename.replace(/[^\w\-. ]/g, '_') || `${id}.pdf`;
  const encodedName = encodeURIComponent(filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedName}`);
  res.send(row.pdf);
}));

// [MOVE] Mover anotação para cima ou para baixo (swap de posicao)
router.post('/:id/move', isAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.id;
  const { id } = req.params;
  const { direction } = req.body as { direction?: 'up' | 'down' };
  if (!direction || (direction !== 'up' && direction !== 'down')) {
    return res.status(400).json({ error: 'Direção inválida. Use "up" ou "down".' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [currRows] = await conn.query("SELECT id, coluna, posicao FROM anotacoes WHERE id = ? AND usuario_id = ?", [id, userId]);
    const currRowsArr = currRows as RowDataPacket[];
    if (!currRowsArr || currRowsArr.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ error: 'Anotação não encontrada' });
    }
    const curr = currRowsArr[0] as unknown as { id: string; coluna: number; posicao: number };
    const currPos = Number(curr.posicao);
    const currCol = Number(curr.coluna);

    let neighborQuery = '';
    if (direction === 'up') {
      // find the item with the smallest posicao greater than current
      neighborQuery = "SELECT id, posicao FROM anotacoes WHERE usuario_id = ? AND coluna = ? AND posicao > ? ORDER BY posicao ASC LIMIT 1";
    } else {
      // down: find the item with the largest posicao less than current
      neighborQuery = "SELECT id, posicao FROM anotacoes WHERE usuario_id = ? AND coluna = ? AND posicao < ? ORDER BY posicao DESC LIMIT 1";
    }

    const [neighborRows] = await conn.query(neighborQuery, [userId, currCol, currPos]);
    const neighborArr = neighborRows as RowDataPacket[];
    if (!neighborArr || neighborArr.length === 0) {
      await conn.rollback();
      conn.release();
      // nothing to swap (already at edge)
      return res.json({ success: true, message: 'No swap needed' });
    }
    const neighbor = neighborArr[0] as unknown as { id: string; posicao: number };

    // Swap posicoes
      await conn.query("UPDATE anotacoes SET posicao = ? WHERE id = ?", [neighbor.posicao, curr.id]);
      await conn.query("UPDATE anotacoes SET posicao = ? WHERE id = ?", [curr.posicao, neighbor.id]);

    await conn.commit();
    conn.release();

    // return updated rows for both ids
    const [updatedRows] = await pool.query<AnotacaoRow[]>(
      "SELECT id, usuario_id, conteudo, img, (pdf IS NOT NULL) AS hasPdf, coluna, pdfNome, created_at, posicao FROM anotacoes WHERE id IN (?, ?)",
      [curr.id, neighbor.id]
    );
    const formatted = updatedRows.map((row) => mapAnotacaoResponse(req, row));
    res.json({ success: true, swapped: formatted });
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}));


// [DELETE] Deletar uma anotação
router.delete('/:id', isAuthenticated, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.id;
  const { id } = req.params;

  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM anotacoes WHERE id = ? AND usuario_id = ?",
    [id, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Anotação não encontrada ou não pertence a você" });
  }

  res.json({ message: "Anotação deletada com sucesso" });
}));

export default router;