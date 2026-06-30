import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/server/types/socket";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export async function connectSocket() {
  if (socket?.connected) {
    return socket;
  }

  const response = await fetch("/api/socket/token", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch socket token.");
  }

  const { token } = await response.json();

  socket = io("http://localhost:4000", {
    transports: ["websocket"],
    auth: {
      token,
    },
    withCredentials: true,
    autoConnect: true,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
}

export function joinContract(contractId: number) {
  socket?.emit("join_contract", contractId);
}

export function leaveContract(contractId: number) {
  socket?.emit("leave_contract", contractId);
}