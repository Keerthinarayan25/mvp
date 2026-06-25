import { db } from "@/db";
import { contracts, projects, } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq, ne, } from "drizzle-orm";
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

    const result = await db
      .select({

        contractId: contracts.id,
        title: projects.title,
        status: contracts.status,
        budget: contracts.agreedprice,
        currency: contracts.currency,

      })

      .from(contracts)

      .innerJoin(projects, eq(projects.id, contracts.projectId))

      .where(
        and(
          eq(contracts.developerId, user.id),
          ne(contracts.status, "completed"),
          ne(contracts.status, "cancelled"),
        )
      );

    return NextResponse.json(result);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to load contracts" },
      { status: 500 }
    );

  }

}