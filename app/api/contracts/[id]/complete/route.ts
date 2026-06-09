import { db } from "@/db";
import { contracts, projects, } from "@/db/schema";
import { eq, } from "drizzle-orm";
import { verifyToken, } from "@/lib/auth";
import { NextRequest, NextResponse, } from "next/server";

export async function POST(req: NextRequest,
  { params, }: { params: Promise<{ id: string }> }
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

    const contract =
      await db.query.contracts.findFirst({
        where: eq(contracts.id, Number(id)),
      });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract Not found" },
        { status: 404 }
      );
    }

    if (user.activeRole !== "founder") {
      return NextResponse.json(
        { error: "Founder only" },
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
      .set({ status: "completed", })
      .where(eq(contracts.id, contract.id));

    await db
      .update(projects)
      .set({ status: "completed", })
      .where(
        eq(projects.id, contract.projectId)
      );

    return NextResponse.json({ success: true, });

  } catch {

    return NextResponse.json(
      { error: "Failed to complete contract" },
      { status: 500 }
    );
  }
}