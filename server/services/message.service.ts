import { db } from "../db";
import { messages, users } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function createMessage(
  contractId: number,
  senderId: number,
  message: string
) {
  const [savedMessage] = await db
    .insert(messages)
    .values({
      contractId,
      senderId,
      message_text: message.trim(),
    })
    .returning();

  if (!savedMessage) {
    throw new Error("Failed to create message.");
  }

  const [messageWithSender] = await db
    .select({
      id: messages.id,
      contractId: messages.contractId,
      senderId: messages.senderId,
      message: messages.message_text,
      createdAt: messages.createdAt,

      sender: {
        id: users.id,
        name: users.name,
      },
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.id, savedMessage.id));

  return messageWithSender;
}

export async function getContractMessages(contractId: number) {
  return db
    .select({
      id: messages.id,
      contractId: messages.contractId,
      senderId: messages.senderId,
      message: messages.message_text,
      createdAt: messages.createdAt,

      sender: {
        id: users.id,
        name: users.name,
      },
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.contractId, contractId))
    .orderBy(asc(messages.createdAt));
}

export async function getLatestMessages(
  contractId: number,
  limit = 50
) {
  return db
    .select({
      id: messages.id,
      contractId: messages.contractId,
      senderId: messages.senderId,
      message: messages.message_text,
      createdAt: messages.createdAt,

      sender: {
        id: users.id,
        name: users.name,
      },
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.contractId, contractId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}