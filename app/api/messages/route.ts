import { db } from "@/db";
import { messages } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = verifyToken(token);
  const body = await req.json();

  if (!body.messageText || !body.messageText.trim()) {
    return NextResponse.json(
      { error: "Message cannot be empty" },
      { status: 400 }
    );
  }

  const msg = await db.insert(messages).values({
    contractId: Number(body.contractId),
    senderId: user.id,
    message_text: body.messageText,
  }).returning();

  return NextResponse.json(msg);
}