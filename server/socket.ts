import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

import { createServer } from "http";
import { Server } from "socket.io";

import { verifySocketToken } from "./auth";
import { registerContractEvents } from "./events/contract";
import { registerMessageEvents } from "./events/message";
import {ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData,} from "./types/socket";

const httpServer = createServer();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  const user = verifySocketToken(token);

  if (!user) {
    return next(new Error("Unauthorized"));
  }

  socket.data.user = user;

  next();
});

io.on("connection", (socket) => {
  
  const user = socket.data.user;

  console.log(`[Socket] User ${user.id} connected`);

  registerContractEvents(io, socket);

  registerMessageEvents(io, socket);

  socket.on("disconnect", () => {
    console.log(`[Socket] User ${user.id} disconnected`);
  });
});

httpServer.listen(4000, () => {
  console.log("Socket running on :4000");
});