import { db } from "@/db";
import { applications, projects, users, } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse, } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const { id } = await params;

    const projectId = Number(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project id", },
        { status: 400, }
      );
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", },
        { status: 401, }
      );
    }

    const user = verifyToken(token);

    // ONLY FOUNDERS
    if (user.activeRole !== "founder") {

      return NextResponse.json(
        { error: "Forbidden", },
        { status: 403, }
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found", },
        { status: 404, }
      );
    }

    if (project.founderId !== user.id) {
      return NextResponse.json(
        { error: "Not your project", },
        { status: 403, }
      );
    }
    const projectApplications =
      await db.query.applications.findMany({
        where: eq(applications.projectId, projectId),
      });


    const formattedApplications =
      await Promise.all(
        projectApplications.map(
          async (app) => {
            const developer =
              await db.query.users.findFirst({
                where: eq(users.id, app.developerId),
              });

            return {
              id: app.id,
              proposalMessage: app.proposalMessage,
              proposedPrice: app.proposedPrice,
              currency: app.currency,
              deliveryValue: app.deliveryValue,
              deliveryUnit: app.deliveryUnit,
              status: app.status,
              developer: {
                id: developer?.id,
                name: developer?.name,
              },
            };
          }
        )
      );

    return NextResponse.json({
      id: project.id,
      title: project.title,
      description: project.description,
      applications: formattedApplications,
    });

  } catch (error) {
    console.log("APPLICATION FETCH ERROR:", error
    );

    return NextResponse.json(
      { error: "Failed to fetch applications", },
      { status: 500, }
    );
  }
}