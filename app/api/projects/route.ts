import { db } from "@/db";
import { projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mine = url.searchParams.get("mine");

    if (mine === "true") {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }

      const user = verifyToken(token);
      const myProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.founderId, user.id));

      return NextResponse.json(myProjects);
    }

    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.status, "open"));

    console.log("Route of projects list", allProjects);

    return NextResponse.json(allProjects)

  } catch (error) {

    console.error("PROJECT GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )

  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = verifyToken(token);
    if (user.activeRole !== "founder") {
      return NextResponse.json(
        { error: "Only founders can create projects" },
        { status: 403 },
      );
    }
    const body = await req.json();
    if (!body.title || !body.description || !body.budgetMin ||
      !body.budgetMax) {
      return NextResponse.json(
        { error: "Missing required fields", },
        { status: 400, }
      );
    }

    const newProject = await db
      .insert(projects)
      .values({
        founderId: user.id,
        title: body.title,
        description: body.description,
        budgetMin: Number(body.budgetMin),
        budgetMax: Number(body.budgetMax),
        currency: body.currency || "USD",
        timelineValue: Number(body.timelineValue),
        timelineUnit: body.timelineUnit,
        experienceLevel: body.experienceLevel,
        techStack: body.techStack || [],
        status: "open",
      })
      .returning()

    return NextResponse.json(newProject[0]);
  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create Project" },
      { status: 500 }
    )
  }
}