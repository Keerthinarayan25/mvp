import { Server, Socket } from "socket.io";
import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { contracts } from "@/db/schema";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../types/socket";


export function registerContractEvents(
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
  socket.on("join_contract", async (contractId: number) => {
    try {
      const user = socket.data.user;

      if (!user) {
        socket.emit("contract_error", {
          message: "Unauthorized",
        });
        return;
      }

      if (!Number.isInteger(contractId) || contractId <= 0) {
        socket.emit("contract_error", {
          message: "Invalid contract.",
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
        socket.emit("contract_error", {
          message: "Unauthorized contract.",
        });
        return;
      }

      const room = `contract_${contractId}`;

      await socket.join(room);

      console.log(`[Socket] User ${user.id} joined ${room}`);

      socket.emit("joined_contract", {
        room,
      });
    } catch (error) {
      console.error("JOIN_CONTRACT_ERROR", error);

      socket.emit("contract_error", {
        message: "Failed to join contract.",
      });
    }
  });

  socket.on("leave_contract", async (contractId: number) => {
    try {
      const user = socket.data.user;

      const room = `contract_${contractId}`;

      await socket.leave(room);

      console.log(`[Socket] User ${user?.id} left ${room}`);

      socket.emit("left_contract", {
        room,
      });
    } catch (error) {
      console.error("LEAVE_CONTRACT_ERROR", error);

      socket.emit("contract_error", {
        message: "Failed to leave contract.",
      });
    }
  });
}