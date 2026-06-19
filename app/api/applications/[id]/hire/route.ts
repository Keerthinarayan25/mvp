import { db } from "@/db";
import { applications, contracts, projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq, ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

//hire developer

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token);

    if (user.activeRole !== "founder") {
      return NextResponse.json({ error: "Only founders can hire" }, { status: 403 })
    }

    const { id } = await params;
    const applicationId = Number(id);


    const application = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const project = await db.query.projects.findFirst(
      { where: eq(projects.id, application.projectId) }
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" }, { status: 404 }
      );
    }

    // SECURITY
    if (project.founderId !== user.id) {
      return NextResponse.json(
        { error: "Not your project" }, { status: 403 }
      );
    }

    if (project.status !== "open") {
      return NextResponse.json({
        error: "Project already assigned"
      })
    }

    // Prevent double hiring
    // const existingContract = await db.query.contracts.findFirst(
    //   { where: eq(contracts.projectId, project.id) }
    // );

    // if (existingContract) {
    //   return NextResponse.json(
    //     { error: "Developer already hired" }, { status: 400 }
    //   );
    // }

    // Create Contract
    const contract = await db.insert(contracts)
      .values({
        projectId: project.id,
        founderId: project.founderId,
        developerId: application.developerId,
        agreedprice: application.proposedPrice,
        currency: application.currency,
        deliveryValue: application.deliveryValue,
        deliveryUnit: application.deliveryUnit,
        status: "pending_funding",
      })
      .returning();

    // Accept hired application
    await db.update(applications)
      .set({ status: "accepted" })
      .where(eq(applications.id, application.id));

    // Reject all remaining applications
    await db.update(applications)
      .set({ status: "rejected" })
      .where(
        and(eq(applications.projectId, project.id),
          ne(applications.id, application.id))
      );

    //close project
    await db.update(projects)
      .set({ status: "in_progress" })
      .where(eq(projects.id, project.id));

    return NextResponse.json({
      success: true,
      contract:contract[0],
    });



  } catch (error) {
    console.log("Error in Applications[id] hire  route:", error);

    return NextResponse.json(
      { error: "Failed to accept proposal" },
      { status: 500 }
    )

  }
}