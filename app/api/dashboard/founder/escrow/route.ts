import { db } from "@/db";
import { escrows, contracts, } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, sql, } from "drizzle-orm";
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

    if (user.activeRole !== "founder") {

      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );

    }

    const funded =
      await db
        .select({
          total: sql<number>`coalesce(sum(${escrows.amount}),0)`,
        })
        .from(escrows)
        .where(eq(escrows.founderId, user.id)
        );

    const released =
      await db
        .select({
          total: sql<number>`coalesce(sum(${escrows.amount}),0)`,
        })
        .from(escrows)
        .where(
          sql`${escrows.founderId} = ${user.id} and 
          ${escrows.status} = 'released'`
        );

    const pending =
      await db
        .select({
          total: sql<number>`coalesce(sum(${escrows.amount}),0) `,
        })
        .from(escrows)
        .where(
          sql`${escrows.founderId} = ${user.id} and 
          ${escrows.status} = 'pending'`);

    const completedContracts =
      await db.query.contracts.findMany({
        where: eq(
          contracts.founderId,
          user.id
        ),
      });

    return NextResponse.json({

      totalEscrowFunded: funded[0]?.total ?? 0,

      totalReleased: released[0]?.total ?? 0,

      pendingRelease: pending[0]?.total ?? 0,

      completedContracts:
        completedContracts.filter(
          (contract) => contract.status === "completed").length,
    });
  } catch (error) {

    console.log("ESCROW DASHBOARD ERROR", error);

    return NextResponse.json(
      { error: "Failed to load escrow stats", },
      { status: 500 }
    );

  }

}