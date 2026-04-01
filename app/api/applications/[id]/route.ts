import { db } from "@/db";
import { applications, contracts, projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token);
    const applicationId = Number(id);

    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId))

    if (!application) {
      return NextResponse.json({ error: "Application not found" })
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, application.projectId))

    if (project.status !== "open") {
      return NextResponse.json({
        error: "Project already assigned"
      })
    }

    await db
      .update(applications)
      .set({ status: "accepted" })
      .where(eq(applications.id, applicationId))

    await db
      .update(applications)
      .set({ status: "accepted" })
      .where(eq(applications.projectId, application.projectId))

    await db
      .insert(contracts).values({
        projectId: application.projectId,
        developerId: application.developerId,
        founderId: user.id,
        agreedprice: application.proposedPrice,
        deadline: application.deliveryTime,
      })

    await db
      .update(projects)
      .set({ status: "in_progress" })
      .where(eq(projects.id, application.projectId))

    return NextResponse.json({ success: true })



  } catch (error) {
    console.log("Error in Applications[id] route:", error);

    return NextResponse.json(
      { error: "Failed to accept proposal" },
      { status: 500 }
    )

  }
}