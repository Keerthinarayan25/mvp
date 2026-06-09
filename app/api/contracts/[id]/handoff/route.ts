import { db } from "@/db";
import { contracts, handoffs, } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }:
  { params: Promise<{ id: string }> }) {

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

    const contract =
      await db.query.contracts.findFirst({
        where: eq(contracts.id, contractId),
      });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    if (user.activeRole !== "developer") {
      return NextResponse.json(
        { error: "Developer only" },
        { status: 403 }
      );
    }

    if (contract.developerId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (contract.status !== "awaiting_handoff") {
      return NextResponse.json(
        { error: "Contract not ready for handoff" },
        { status: 400 }
      );
    }

    const existing =
      await db.query.handoffs.findFirst({
        where: eq(handoffs.contractId, contractId),
      });

    if (existing) {
      return NextResponse.json(
        { error: "Handoff already submitted" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const handoff =
      await db
        .insert(handoffs)
        .values({
          contractId,
          sourceCodeUrl: body.sourceCodeUrl,
          documentationUrl: body.documentationUrl,
          notes: body.notes,
        })
        .returning();

    return NextResponse.json(handoff[0]);

  } catch {
    return NextResponse.json(
      { error: "Failed to upload handoff" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }:
  { params: Promise<{ id: string }> }) {

  const { id } = await params;

  const handoff =
    await db.query.handoffs.findFirst({
      where: eq(handoffs.contractId, Number(id)),
    });

  return NextResponse.json(handoff ?? null);
}