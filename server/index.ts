import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs';
// uuid not used here
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

import { pool } from "./db";

import rankRoutes from "./rankRoutes";
import anotacoesRoutes from "./anotacoesRoutes";
import progressRoutes from "./progressRoutes";
import { asyncHandler } from './utils';

dotenv.config();

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const PORT = 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// const USERS_FILE = path.join(__dirname, 'users.json'); // not used

interface User { id: number; [key: string]: unknown }
type AuthenticatedRequest = Request & { isAuthenticated?: () => boolean; user?: User };

interface UsuarioRow extends RowDataPacket { id: number; senha?: string; [key: string]: unknown }

const recalculateRankingQuery = `
  UPDATE usuario u
  JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY pontos DESC, id ASC) AS posicao
    FROM usuario
  ) ranked ON ranked.id = u.id
  SET u.colocacao = ranked.posicao
`;

const DEFAULT_BANNER = "/img/nebulosaBanner.jpg";

const uploadBufferToCloudinary = (fileBuffer: Buffer, folder: string) => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload falhou"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};




// index.ts

// Defina o tipo da função async

// Middlewares
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-muito-secreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 dia
    httpOnly: true,
  }
}));

const allowedOrigins = [CLIENT_URL];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Rotas de ranking
app.use("/api", rankRoutes);

app.use("/api/anotacoes", anotacoesRoutes);
app.use('/api/progress', progressRoutes);

// Config Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0].value || '';
    const photo = profile.photos?.[0].value || '';

    // Verifica se já existe no banco
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuario WHERE email = ?", [email]);
    if (rows.length > 0) {
      return done(null, rows[0]);
    }

    // Cria novo usuário
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO usuario (username, user, pontos, colocacao, icon, banner, biografia,
        progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, seguidores, seguindo, provider)
       VALUES (?, ?, 0, ?, ?, ?, ?, 0, 0, 0, ?, NULL, '', 'pt-br', 'dark', 0, 0, 'google')`,
      [
        profile.displayName,
        `@${profile.displayName.replace(/\s/g, '')}${Date.now()}`,
        0,
  photo || "https://images.vexels.com/media/users/3/235233/isolated/preview/be93f74201bee65ad7f8678f0869143a-cracha-de-perfil-de-capacete-de-astronauta.png",
  DEFAULT_BANNER,
        "...",
        email
      ]
    );

    const newUserId = result.insertId;
    const [newUserRows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuario WHERE id = ?", [newUserId]);
    done(null, newUserRows[0]);
  } catch (error) {
    done(error as Error);
  }

}));



passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    const u = user as User;
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuario WHERE id = ?", [u.id]);
    if (rows.length > 0) {
      done(null, rows[0]);
    } else {
      done(new Error("Usuário não encontrado"), null);
    }
  } catch (error) {
    done(error as Error, null);
  }
});

// Rotas

// Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(CLIENT_URL);
  }
);

// Obter usuário logado
app.get('/auth/me', asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.isAuthenticated || !authReq.isAuthenticated() || !authReq.user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const connection = await pool.getConnection();
  let userRow: RowDataPacket | null = null;

  try {
    await connection.beginTransaction();

    await connection.query(recalculateRankingQuery);

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM usuario WHERE id = ?",
      [authReq.user.id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    userRow = rows[0];
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  if (!userRow) {
    return;
  }

  res.json(userRow);
}));

// Logout
app.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err2 => {
      if (err2) return next(err2);
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout bem-sucedido' });
    });
  });
});

// Cadastro local

app.post('/auth/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Verifica se email já existe
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuario WHERE email = ?", [email]);
  if (rows.length > 0) {
    res.status(409).json({ error: 'Email já cadastrado' });
    return;
  }

  // Gera hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Gera user único
  const userTag = `@${name.replace(/\s/g, '')}${Date.now()}`;

  // Busca próxima colocacao disponível
  const [colRows] = await pool.query<RowDataPacket[]>("SELECT MAX(colocacao) as maxCol FROM usuario");
  const maxCol = Number(colRows[0]?.maxCol) || 0;
  const nextColocacao = maxCol + 1;

  try {
    await pool.query<ResultSetHeader>(
      `INSERT INTO usuario (username, user, pontos, colocacao, icon, banner, biografia,
        progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, provider, seguidores, seguindo)
       VALUES (?, ?, 0, ?, ?, ?, '', 0, 0, 0, ?, ?, '', 'pt-br', 'dark','local', 0, 0)`,
      [
        name,
        userTag,
        nextColocacao,
  "https://images.vexels.com/media/users/3/235233/isolated/preview/be93f74201bee65ad7f8678f0869143a-cracha-de-perfil-de-capacete-de-astronauta.png",
  DEFAULT_BANNER,
        email,
        hashedPassword
      ]
    );
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Usuário ou colocação já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao registrar usuário', details: e.message });
    }
  }
}));


// Login local
app.post('/auth/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuario WHERE email = ?", [email]);
  if (rows.length === 0){ 
    res.status(401).json({ error: 'Usuário não encontrado' });
    return;
  }
  const user = rows[0] as UsuarioRow;
  const isMatch = await bcrypt.compare(password, user.senha || '');
  if (!isMatch) {
    res.status(401).json({ error: 'Senha incorreta' });
    return;
  }

  req.login(user, (err: unknown) => {
    if (err) return res.status(500).json({ error: 'Erro ao autenticar' });
    res.json({ message: 'Login bem-sucedido', user });
  });
}));


// Atualizar perfil

app.put(
  "/auth/update",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "banner", maxCount: 1 }
  ]),
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.isAuthenticated || !authReq.isAuthenticated() || !authReq.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

  const { name, bio, idUser, curso, idioma, tema, progresso1, progresso2, progresso3, bannerUrl: bannerBodyUrl } = req.body;
  const files = req.files as Record<string, Array<{ buffer: Buffer }>> | undefined;
    const photoFile = files?.photo?.[0];
    const bannerFile = files?.banner?.[0];
    const userId = authReq.user.id;

    let photoUrl: string | undefined;
    if (photoFile) {
      try {
        photoUrl = await uploadBufferToCloudinary(photoFile.buffer, "NEBULA_PFP_IMGS");
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no upload do Cloudinary" });
        return;
      }
    }

    const normalizedBannerBodyUrl =
      typeof bannerBodyUrl === "string" && bannerBodyUrl.trim().length > 0
        ? bannerBodyUrl.trim()
        : undefined;
    let bannerUrl: string | undefined = normalizedBannerBodyUrl;
    if (bannerFile) {
      try {
        bannerUrl = await uploadBufferToCloudinary(bannerFile.buffer, "NEBULA_BANNER_IMGS");
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no upload do Cloudinary" });
        return;
      }
    }

    // Monta query dinâmica
    const fields = [];
    const values = [];
    if (name) {
      fields.push("username = ?");
      values.push(name);
    }
    if (idUser) {
      fields.push("user = ?");
      values.push(idUser);
    }
    if (bio) {
      fields.push("biografia = ?");
      values.push(bio);
    }
    if (curso) {
      fields.push("curso = ?");
      values.push(curso);
    }
    if (idioma) {
      fields.push("idioma = ?");
      values.push(idioma);
    }
    if (tema) {
      fields.push("tema = ?");
      values.push(tema);
    }
    if (typeof progresso1 !== 'undefined') {
      fields.push("progresso1 = ?");
      values.push(Number(progresso1));
    }
    if (typeof progresso2 !== 'undefined') {
      fields.push("progresso2 = ?");
      values.push(Number(progresso2));
    }
    if (typeof progresso3 !== 'undefined') {
      fields.push("progresso3 = ?");
      values.push(Number(progresso3));
    }
    if (photoUrl) {
      fields.push("icon = ?");
      values.push(photoUrl);
    }
    if (bannerUrl) {
      fields.push("banner = ?");
      values.push(bannerUrl);
    }

    if (fields.length === 0) {
      res.status(400).json({ error: "Nenhuma informação para atualizar" });
      return;
    }

    try {
      await pool.query(
        `UPDATE usuario SET ${fields.join(", ")} WHERE id = ?`,
        [...values, userId]
      );
      // Retorna usuário atualizado
      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuario WHERE id = ?", [userId]);
      res.json({ success: true, user: rows[0] });
    } catch (err) {
      const e = err as { code?: string; message?: string };
      if (e.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Nome de usuário já existe' });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar perfil', details: e.message });
      }
    }
  })
);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Loga o erro completo no console do *servidor* para você depurar
  void _next;
  console.error("--- ERRO INESPERADO NO BACKEND ---");
  console.error(err.stack);
  console.error("---------------------------------");
  
  // Envia uma resposta JSON padronizada para o frontend
  res.status(500).json({ error: "Erro interno do servidor", details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor backend em http://localhost:${PORT}`);
});
