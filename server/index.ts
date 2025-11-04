import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import multer from "multer";
import { v2 as cloudinary, UploadStream } from "cloudinary";

import { pool } from "./db";

import rankRoutes from "./rankRoutes";
import anotacoesRoutes from "./anotacoesRoutes";
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
const USERS_FILE = path.join(__dirname, 'users.json');




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
    const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
    const users = rows as any[];
    if (users.length > 0) {
      return done(null, users[0]);
    }

    // Cria novo usuário
    const [result] = await pool.query(
      `INSERT INTO usuario (username, user, pontos, colocacao, icon, biografia,
        progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, seguidores, seguindo, provider)
       VALUES (?, ?, 0, ?, ?, ?, 0, 0, 0, ?, NULL, '', 'pt-br', 'dark', 0, 0, 'google')`,
      [
        profile.displayName,
        `@${profile.displayName.replace(/\s/g, '')}${Date.now()}`,
        0,
        photo || "https://images.vexels.com/media/users/3/235233/isolated/preview/be93f74201bee65ad7f8678f0869143a-cracha-de-perfil-de-capacete-de-astronauta.png",
        "...",
        email
      ]
    );

    const newUserId = (result as any).insertId;
    const [newUserRows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [newUserId]);
    done(null, (newUserRows as any[])[0]);
  } catch (error) {
    done(error);
  }

}));



passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async (user: any, done) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [user.id]);
    const users = rows as any[];
    if (users.length > 0) {
      done(null, users[0]);
    } else {
      done(new Error("Usuário não encontrado"), null);
    }
  } catch (error) {
    done(error, null);
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
app.get('/auth/me', asyncHandler(async (req: any, res: any) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const [rows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [(req.user as any).id]);
  const users = rows as any[];

  if (users.length === 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(users[0]);
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

app.post('/auth/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Verifica se email já existe
  const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
  if ((rows as any[]).length > 0) {
    res.status(409).json({ error: 'Email já cadastrado' });
    return;
  }

  // Gera hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Gera user único
  const userTag = `@${name.replace(/\s/g, '')}${Date.now()}`;

  // Busca próxima colocacao disponível
  const [colRows] = await pool.query("SELECT MAX(colocacao) as maxCol FROM usuario");
  const maxCol = (colRows as any[])[0]?.maxCol || 0;
  const nextColocacao = maxCol + 1;

  try {
    await pool.query(
      `INSERT INTO usuario (username, user, pontos, colocacao, icon, biografia,
        progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, provider, seguidores, seguindo)
       VALUES (?, ?, 0, ?, ?, '', 0, 0, 0, ?, ?, '', 'pt-br', 'dark','local', 0, 0)`,
      [name, userTag, nextColocacao, "https://images.vexels.com/media/users/3/235233/isolated/preview/be93f74201bee65ad7f8678f0869143a-cracha-de-perfil-de-capacete-de-astronauta.png", email, hashedPassword]
    );
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Usuário ou colocação já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao registrar usuário', details: err.message });
    }
  }
}));


// Login local
app.post('/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
  const users = rows as any[];
  if (users.length === 0){ 
    res.status(401).json({ error: 'Usuário não encontrado' });
    return
  }
  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.senha);
  if (!isMatch) {
    res.status(401).json({ error: 'Senha incorreta' });
    return
  }

  req.login(user, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao autenticar' });
    res.json({ message: 'Login bem-sucedido', user });
  });
}));


// Atualizar perfil

app.put(
  "/auth/update",
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

  const { name, bio, idUser, curso, idioma, tema, progresso1, progresso2, progresso3 } = req.body;
    const photoFile = req.file;
    const userId = (req.user as any).id;

    let photoUrl: string | undefined;
    if (photoFile) {
      const uploadToCloudinary = (fileBuffer: Buffer) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "NEBULA_PFP_IMGS" },
            (error, result) => {
              if (error || !result) return reject(error || new Error("Upload falhou"));
              resolve(result.secure_url);
            }
          );
          uploadStream.end(fileBuffer);
        });
      };
      try {
        photoUrl = await uploadToCloudinary(photoFile.buffer);
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
      const [rows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [userId]);
      res.json({ success: true, user: (rows as any[])[0] });
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Nome de usuário já existe' });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar perfil', details: err.message });
      }
    }
  })
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Loga o erro completo no console do *servidor* para você depurar
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
