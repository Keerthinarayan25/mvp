import { db } from "@/db";
import { contracts, escrows, handoffs, projects, } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse, } from "next/server";

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
        {
          error:
            "Forbidden",
        },
        { status: 403 }
      );
    }

    const escrow =
      await db.query.escrows.findFirst({
        where: eq(escrows.contractId, contract.id),
      });

    const handoff =
      await db.query.handoffs.findFirst({
        where: eq(handoffs.contractId, contract.id),
      });

    if (!escrow || !handoff) {
      return NextResponse.json(
        { error: "Missing escrow or handoff" },
        { status: 400 }
      );
    }

    await db
      .update(escrows)
      .set({
        status: "released",
        releasedAt: new Date(),
      })
      .where(eq(escrows.id, escrow.id)
      );

    await db
      .update(handoffs)
      .set({
        unlocked: true,
        releasedAt: new Date(),
      })
      .where(eq(handoffs.id, handoff.id));

    await db
      .update(contracts)
      .set({ status: "completed", })
      .where(eq(contracts.id, contract.id));

    await db
      .update(projects)
      .set({ status: "completed" })
      .where(eq(projects.id, contract.projectId));

    return NextResponse.json({ success: true });

  } catch {

    return NextResponse.json(
      { error: "Failed to unlock source" },
      { status: 500 }
    );
  }
}