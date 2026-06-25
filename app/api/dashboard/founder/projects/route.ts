import { db } from "@/db";
import { applications, projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {

      return NextResponse.json(
        {
          error: "Unauthorized"
        },
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

    const result = await db

      .select({
        id: projects.id,
        title: projects.title,
        status: projects.status,
        createdAt: projects.createdAt,
        applicants: sql<number>`count(${applications.id})`,

      })

      .from(projects)

      .leftJoin(applications, eq(applications.projectId, projects.id)
      )

      .where(eq(projects.founderId, user.id))

      .groupBy(
        projects.id,
        projects.title,
        projects.status,
        projects.createdAt
      )

      .orderBy(
        desc(projects.createdAt))

      .limit(5);

    return NextResponse.json(result);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );

  }

}