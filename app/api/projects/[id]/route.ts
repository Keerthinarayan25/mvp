import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, Number(id)))

    console.log("project id is ",id);
    if (!project.length) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(project[0])


  } catch (error) {
    console.error("Fetch project error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}