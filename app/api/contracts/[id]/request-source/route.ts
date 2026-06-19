import { db } from "@/db";
import { contracts } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
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

    const contract =
      await db.query.contracts.findFirst({
        where: eq(contracts.id, Number(id)),
      });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    if (user.activeRole !== "founder") {
      return NextResponse.json(
        { error: "Switch to founder mode" },
        { status: 403 }
      );
    }

    if (contract.founderId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await db
      .update(contracts)
      .set({ status: "awaiting_handoff", })
      .where(eq(contracts.id, contract.id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to request source" },
      { status: 500 }
    );
  }
}