import fs from 'fs';
import path from 'path';

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
