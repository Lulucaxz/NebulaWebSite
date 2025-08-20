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

// Tipos
interface UserType {
  idsite: number;
  id: string;
  name: string;
  email: string;
  photo: string;
  password: string;
  provider: 'google' | 'local';
  prf_user: string;
  bio?: string;
  /*orbita_pontos: number;
  galaxia_pontos: number;
  universo_pontos: number;
  rank: string;*/
}

// Funções utilitárias
function readUsers(): UserType[] {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveUsers(users: UserType[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function getNextIdSite(): number {
  const users = readUsers();
  if (users.length === 0) return 1;
  const maxId = Math.max(...users.map(u => u.idsite));
  return maxId + 1;
}

// Async handler para tratar erros em async routes
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => (req, res, next) => {
  fn(req, res, next).catch(next);
};

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

// Config Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  const users = readUsers();

  const existingUser = users.find(u => u.id === profile.id || u.email === profile.emails?.[0].value);
  if (existingUser) {
    return done(null, existingUser);
  }

  const newUser: UserType = {
    idsite: getNextIdSite(),
    id: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0].value || '',
    photo: profile.photos?.[0].value || '',
    password: '',
    provider: 'google',
    prf_user: `@${profile.displayName.replace(/\s/g, '')}${getNextIdSite()}`,
    bio: "..."
  };

  users.push(newUser);
  saveUsers(users);

  return done(null, newUser);
}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  if (user && user.id) {
    done(null, user);
  } else {
    done(new Error('Usuário inválido'), null);
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
app.get('/auth/me', (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const users = readUsers();
  const userId = (req.user as UserType).id;
  const userAtualizado = users.find(u => u.id === userId);
  if (!userAtualizado) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }

  res.json(userAtualizado);
});

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

  const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
  if ((rows as any[]).length > 0) {
    res.status(409).json({ error: 'Email já cadastrado' });
    return 
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO usuario (username, user, pontos, colocacao, icon, biografia,
      progresso1, progresso2, progresso3, email, senha, curso, idioma, tema, seguidores, seguindo)
     VALUES (?, ?, 0, ?, ?, '', 0, 0, 0, ?, ?, 'Astronomia', 'pt-br', 'dark', 0, 0)`,
    [name, `@${name}${Date.now()}`, 0, "https://images.vexels.com/media/users/3/235233/isolated/preview/be93f74201bee65ad7f8678f0869143a-cracha-de-perfil-de-capacete-de-astronauta.png", email, hashedPassword]
  );

  res.status(201).json({ message: 'Usuário registrado com sucesso' });
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

    const { name, bio, idUser } = req.body;
    const photoFile = req.file;

    const users = readUsers();
    const userId = (req.user as UserType).id;
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    if (name) users[index].name = name;
    if (idUser) users[index].prf_user = idUser;
    if (bio) users[index].bio = bio;

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
        const photoUrl = await uploadToCloudinary(photoFile.buffer);
        users[index].photo = photoUrl;
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no upload do Cloudinary" });
        return;
      }
    }

    saveUsers(users);
    res.json({ success: true, user: users[index] });
  })
);

// Start server
app.listen(PORT, () => {
  console.log(`Servidor backend em http://localhost:${PORT}`);
});
