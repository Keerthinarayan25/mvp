import { db } from "@/db";
import { contracts, deliveries, } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse, } from "next/server";

export async function POST(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {

  const token =    req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);

  if (user.activeRole !== "developer") {
    return NextResponse.json(
      { error: "Switch to developer mode" },
      { status: 403 }
    );
  }

  const { id } = await params;

  const contractId = Number(id);

  const contract =
    await db.query.contracts
      .findFirst({
        where: eq(contracts.id, contractId),
      });

  if (!contract) {
    return NextResponse.json(
      { error: "Contract not found" },
      { status: 404 }
    );
  }

  if (contract.developerId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const result =
    await db
      .insert(deliveries)
      .values({
        contractId,
        liveUrl: body.liveUrl,
        notes: body.notes,
      })
      .returning();

  await db
    .update(contracts)
    .set({ status: "submitted" })
    .where(eq(contracts.id, contractId));

  return NextResponse.json(result[0]);
}


export async function GET(req: NextRequest, { params, }: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params;

  const result = await db
    .select()
    .from(deliveries)
    .where(
      eq(deliveries.contractId, Number(id))
    );

  return NextResponse.json(result);
}