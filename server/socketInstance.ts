import { Server } from "socket.io";

let io: Server | null = null;

export const setSocketServerInstance = (instance: Server) => {
  io = instance;
};

export const getSocketServerInstance = () => io;
