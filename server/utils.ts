import fs from 'fs';
import path from 'path';
// 1. ADICIONEI OS TIPOS DO EXPRESS
import { Request, Response, NextFunction, RequestHandler } from 'express';

const USERS_PATH = path.join(__dirname, 'users.json');

export const readUsers = (): any[] => {
  try {
    const data = fs.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

export const writeUsers = (users: any[]) => {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
};

// --- CÓDIGO DO ASYNC HANDLER ADICIONADO ---

// 2. Defina o tipo da função async
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// 3. Exporte a função
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};