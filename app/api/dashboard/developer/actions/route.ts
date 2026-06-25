import { db } from "@/db";
import { contracts, deliveries, escrows, handoffs } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse, } from "next/server";

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

    if (user.activeRole !== "developer") {

      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );

    }

    const latestDeliveries = db
      .select({
        contractId: deliveries.contractId,
        deliveryId: sql<number>`max(${deliveries.id})`.as("delivery_id"),
      })
      .from(deliveries)
      .groupBy(deliveries.contractId)
      .as("latest_deliveries");

    const rows = await db
      .select({
        contractId: contracts.id,
        contractStatus: contracts.status,
        escrowStatus: escrows.status,
        deliveryId: latestDeliveries.deliveryId,
        handoffId: handoffs.id,
      })
      .from(contracts)

      .leftJoin(escrows, eq(escrows.contractId, contracts.id))

      .leftJoin(latestDeliveries,
        eq(latestDeliveries.contractId, contracts.id))

      .leftJoin(handoffs, eq(handoffs.contractId, contracts.id))

      .where(eq(contracts.developerId, user.id));

    const actions = [];

    for (const row of rows) {

      if (
        row.contractStatus === "active" &&
        row.escrowStatus === "funded" &&
        !row.deliveryId
      ) {

        actions.push({
          type: "submit_demo",
          contractId: row.contractId,

        });

      }

      if (row.contractStatus === "awaiting_handoff" && !row.handoffId) {

        actions.push({
          type: "upload_source",
          contractId: row.contractId,
        });
      }

    }
    console.log("ACTIONS OF DEVELOPER DASHBOARD ", actions);

    return NextResponse.json(actions);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to load actions" },
      {
        status: 500
      }
    );

  }

}