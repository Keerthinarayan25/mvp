import { db } from "@/db";
import { applications, projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { desc, eq, } from "drizzle-orm";
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
        id: applications.id,
        projectTitle: projects.title,
        status: applications.status,
        price: applications.proposedPrice,
        currency: applications.currency,

      })

      .from(applications)

      .innerJoin(projects, eq(projects.id, applications.projectId))

      .where(eq(applications.developerId, user.id))

      .orderBy(desc(applications.createdAt))

      .limit(5);

    return NextResponse.json(result);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to load applications" },
      { status: 500 }
    );

  }

}