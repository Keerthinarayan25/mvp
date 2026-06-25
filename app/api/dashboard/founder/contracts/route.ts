import { db } from "@/db";
import { contracts, escrows, projects, users } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq, ne } from "drizzle-orm";
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

    const user =
      verifyToken(token);

    if (user.activeRole !== "founder") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const result = await db
      .select({

        contractId: contracts.id,
        projectTitle: projects.title,
        developerName: users.name,
        status: contracts.status,
        budget: contracts.agreedprice,
        currency: contracts.currency,
        escrowStatus: escrows.status,

      })

      .from(contracts)

      .innerJoin(projects, eq(projects.id, contracts.projectId))

      .innerJoin(users, eq(users.id, contracts.developerId))

      .leftJoin(escrows, eq(escrows.contractId, contracts.id)
      )

      .where(

        and(

          eq(contracts.founderId, user.id),

          ne(contracts.status, "completed"),

        )

      );

    return NextResponse.json(

      result.map(contract => ({
        ...contract,
        escrowStatus: contract.escrowStatus ?? "not_created",

      }))

    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );

  }

}