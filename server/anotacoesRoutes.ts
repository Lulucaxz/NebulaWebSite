
import express, { Request, Response, NextFunction } from 'express';
import { pool } from "./db";
import { asyncHandler } from "./utils"; 
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Middleware: Checar se está autenticado
const isAuthenticated = (req: Request, res: Response, next: NextFunction): any => { // <--- ADICIONE ": any" AQUI
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  next();
};

// --- ROTAS CRUD PARA ANOTAÇÕES ---

// [READ] Obter todas as anotações do usuário logado
router.get('/', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = (req.user as any).id;
  const [rows] = await pool.query(
    "SELECT * FROM anotacoes WHERE usuario_id = ? ORDER BY id DESC", // Mudei o ID para ser string
    [userId]
  );
  res.json(rows);
}));

// [CREATE] Criar uma nova anotação
router.post('/', isAuthenticated, upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), asyncHandler(async (req, res) => {
  
  const userId = (req.user as any).id;
  const { conteudo, coluna } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let imgUrl: string | null = null;
  let pdfUrl: string | null = null;
  let pdfNome: string | null = null;

  // Upload da Imagem (se existir)
  if (files['imagem'] && files['imagem'][0]) {
    imgUrl = await uploadToCloudinary(files['imagem'][0].buffer);
  }

  // Upload do PDF (se existir)
  if (files['pdf'] && files['pdf'][0]) {
    pdfUrl = await uploadToCloudinary(files['pdf'][0].buffer);
    pdfNome = files['pdf'][0].originalname; // Salva o nome original
  }

  // Validar se há conteúdo
  if (!imgUrl && !pdfUrl && !conteudo) {
    return res.status(400).json({ error: "Anotação não pode estar vazia" });
  }
  
  const newId = uuidv4(); // Gera um UUID para o ID

  const [result] = await pool.query(
    "INSERT INTO anotacoes (id, usuario_id, coluna, conteudo, img, pdf, pdfNome) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [newId, userId, Number(coluna), conteudo || '', imgUrl, pdfUrl, pdfNome]
  );
  
  // Retorna a anotação recém-criada
  const [rows] = await pool.query("SELECT * FROM anotacoes WHERE id = ?", [newId]);
  res.status(201).json((rows as any[])[0]);
}));

// [UPDATE] Atualizar uma anotação existente
router.put('/:id', isAuthenticated, upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), asyncHandler(async (req, res) => {
  
  const userId = (req.user as any).id;
  const { id } = req.params;
  const { conteudo, coluna, imagem, pdfNome: bodyPdfNome } = req.body; // Pega os dados
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let imgUrl: string | undefined;
  let pdfUrl: string | undefined;
  let pdfNome: string | undefined = bodyPdfNome; // Nome vindo do body

  // Upload de nova Imagem
  if (files['imagem'] && files['imagem'][0]) {
    imgUrl = await uploadToCloudinary(files['imagem'][0].buffer);
  }

  // Upload de novo PDF
  if (files['pdf'] && files['pdf'][0]) {
    pdfUrl = await uploadToCloudinary(files['pdf'][0].buffer);
    pdfNome = files['pdf'][0].originalname; // Salva o novo nome
  }
  
  // Monta a query dinâmica (baseado no seu /auth/update)
  const fields = [];
  const values = [];

  if (typeof conteudo !== 'undefined') {
    fields.push("conteudo = ?");
    values.push(conteudo);
  }
  if (typeof coluna !== 'undefined') {
    fields.push("coluna = ?");
    values.push(Number(coluna));
  }
  if (imgUrl) { // Se fez upload de nova imagem
    fields.push("img = ?");
    values.push(imgUrl);
  }
  if (pdfUrl) { // Se fez upload de novo PDF
    fields.push("pdf = ?");
    values.push(pdfUrl);
    fields.push("pdfNome = ?");
    values.push(pdfNome);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Nenhuma informação para atualizar" });
  }
  
  values.push(id);
  values.push(userId);

  await pool.query(
    `UPDATE anotacoes SET ${fields.join(", ")} WHERE id = ? AND usuario_id = ?`,
    values
  );

  // Retorna a anotação atualizada
  const [rows] = await pool.query("SELECT * FROM anotacoes WHERE id = ?", [id]);
  if ((rows as any[]).length === 0) {
    return res.status(404).json({ error: "Anotação não encontrada" });
  }
  res.json((rows as any[])[0]);
}));


// [DELETE] Deletar uma anotação
router.delete('/:id', isAuthenticated, asyncHandler(async (req, res) => {
  const userId = (req.user as any).id;
  const { id } = req.params;

  const [result] = await pool.query(
    "DELETE FROM anotacoes WHERE id = ? AND usuario_id = ?",
    [id, userId]
  );

  if ((result as any).affectedRows === 0) {
    return res.status(404).json({ error: "Anotação não encontrada ou não pertence a você" });
  }

  res.json({ message: "Anotação deletada com sucesso" });
}));

export default router;