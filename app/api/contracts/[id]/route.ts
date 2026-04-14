import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params } : { params: Promise<{ id: string }>}
) {
  const { id } = await params;
  console.log("RAW ID:",id);
  const contractId = Number(id);

  if (isNaN(contractId)) {
    return NextResponse.json(
      { error: "Invalid contract ID" },
      { status: 400 }
    );
  }

  const msgs = await db
  .select({
    id: messages.id,
    text: messages.message_text,
    createdAt: messages.createdAt,
    senderId: users.id,
    senderName: users.name,
  })
  .from(messages)
  .innerJoin(users, eq(messages.senderId, users.id))
  .where(eq(messages.contractId, contractId))
  .orderBy(asc(messages.createdAt));

  return NextResponse.json(msgs);
}