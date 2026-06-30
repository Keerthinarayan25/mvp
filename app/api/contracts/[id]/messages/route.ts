import { db } from "@/db";
import { contracts, messages, users, } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { asc, eq, } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: {
  params: Promise<{ id: string }>;
}
) {

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    const { id } = await params;

    const contractId = Number(id);

    if (isNaN(contractId)) {
      return NextResponse.json(
        { error: "Invalid Contract ID", },
        { status: 400, }
      );
    }

    const contract =
      await db.query.contracts.findFirst(
        {
          where: eq(contracts.id, contractId),
        }
      );

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    const isParticipant = contract.founderId === user.id ||
      contract.developerId === user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const rows = await db
      .select({
        id: messages.id,
        contractId: messages.contractId,
        senderId: messages.senderId,
        message: messages.message_text,
        createdAt: messages.createdAt,
        senderName: users.name,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.contractId, contractId))
      .orderBy(asc(messages.createdAt));

    const msgs = rows.map((row) => ({
      id: row.id,
      contractId: row.contractId,
      senderId: row.senderId,
      message: row.message,
      createdAt: row.createdAt,
      sender: {
        id: row.senderId,
        name: row.senderName,
      },
    }));

    return NextResponse.json(msgs);

  } catch (error) {

    console.error("GET MESSAGE ERROR:", error
    );

    return NextResponse.json(
      { error: "Failed to fetch messages", },
      { status: 500, }
    );
  }
}

