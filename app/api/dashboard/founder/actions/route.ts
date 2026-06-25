import { db } from "@/db";
import { contracts, handoffs, projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (user.activeRole !== "founder") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const rows = await db
      .select({
        contractId: contracts.id,
        contractStatus: contracts.status,
        projectTitle: projects.title,
        unlocked: handoffs.unlocked,
        handoffId: handoffs.id,
      })
      .from(contracts)
      .innerJoin(projects, eq(projects.id, contracts.projectId))
      .leftJoin(handoffs, eq(handoffs.contractId, contracts.id))
      .where(
        and(
          eq(contracts.founderId, user.id),
          or(
            eq(contracts.status, "submitted"),
            eq(contracts.status, "awaiting_handoff")
          )
        )
      );

    const actions = [];

    for (const row of rows) {

      if (row.contractStatus === "submitted") {

        actions.push({
          type: "delivery_review",
          contractId: row.contractId,
          projectTitle: row.projectTitle,
        });

      }

      if (
        row.contractStatus === "awaiting_handoff" &&
        row.handoffId && !row.unlocked
      ) {

        actions.push({
          type: "source_unlock",
          contractId: row.contractId,
          projectTitle: row.projectTitle,
        });

      }

    }

    return NextResponse.json(actions);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to load actions" },
      { status: 500 }
    );

  }

}