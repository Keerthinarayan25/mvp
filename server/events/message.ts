import { Server, Socket } from "socket.io";
import { and, eq, or } from "drizzle-orm";

import { db } from "../db";
import { contracts } from "@/db/schema";
import { createMessage } from "../services/message.service";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../types/socket";

interface SendMessagePayload {
  contractId: number;
  message: string;
}

export function registerMessageEvents(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  console.log("registerMessageEvents called");
  socket.on("send_message", async (
    { contractId, message }: SendMessagePayload) => {
    try {
      const user = socket.data.user;
      console.log("Socket user:", user);
      console.log("send_message event received");
      console.log({ contractId, message });

      if (!user) {
        socket.emit("message_error", {
          message: "Unauthorized",
        });
        return;
      }

      if (!Number.isInteger(contractId) || contractId <= 0) {
        socket.emit("message_error", {
          message: "Invalid contract.",
        });
        return;
      }

      if (typeof message !== "string" || !message.trim()) {
        socket.emit("message_error", {
          message: "Message cannot be empty.",
        });
        return;
      }

      const contract = await db.query.contracts.findFirst({
        where: and(
          eq(contracts.id, contractId),
          or(
            eq(contracts.developerId, user.id),
            eq(contracts.founderId, user.id)
          )
        ),
      });

      if (!contract) {
        socket.emit("message_error", { message: "Unauthorized contract." });
        return;
      }

      const savedMessage = await createMessage(
        contractId,
        user.id,
        message
      );
      
      console.log("Emitting new_message", savedMessage);
      io.to(`contract_${contractId}`).emit("new_message", savedMessage);
    } catch (error) {
      console.error("SEND_MESSAGE_ERROR", error);

      socket.emit("message_error", { message: "Failed to send message." });
    }
  }
  );
}