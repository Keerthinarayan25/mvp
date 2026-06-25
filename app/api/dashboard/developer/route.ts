import { db } from "@/db";
import { applications, contracts, escrows, } from "@/db/schema";
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

    if (user.activeRole !== "developer") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const allApplications =
      await db.query.applications.findMany({
        where: eq(applications.developerId, user.id),
      });

    const allContracts =
      await db.query.contracts.findMany({
        where: eq(contracts.developerId, user.id),
      });

    const earnings =
      await db
        .select({
          total: sql<number>`coalesce(sum(${escrows.amount}),0)`,
        })
        .from(escrows)
        .where(
          sql`${escrows.developerId} = ${user.id}
            and
            ${escrows.status} = 'released'
          `
        );

    return NextResponse.json({

      applicationsSent: allApplications.length,

      activeContracts:
        allContracts.filter(
          contract =>
            contract.status !== "completed" &&
            contract.status !== "cancelled"
        ).length,

      completedContracts:
        allContracts.filter(
          contract => contract.status === "completed"
        ).length,

      earnings: earnings[0]?.total ?? 0,

    });

  } catch (error) {

    console.log("DEVELOPER DASHBOARD ERROR", error
    );

    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );

  }

}