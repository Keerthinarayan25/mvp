import { db } from "@/db";
import { applications, projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    const user = verifyToken(token);

    if (user.activeRole !=="developer") {

      return NextResponse.json(
        {
          error:
            "Only developers can apply",
        },
        {
          status: 403,
        }
      );
    }
    const body = await req.json();
    const projectId = Number(body.projectId);

    if (!projectId) {

      return NextResponse.json(
        {
          error:
            "Invalid project",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Application poject ID:", projectId);


    const project =
      await db.query.projects.findFirst({
        where: eq(
          projects.id,
          projectId
        ),
      });

    if (!project) {

      return NextResponse.json(
        {
          error:
            "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    if (project.founderId === user.id) {

      return NextResponse.json(
        {
          error:
            "You cannot apply to your own project",
        },
        {
          status: 403,
        }
      );
    }

    const existingApplication =
      await db.query.applications.findFirst({
        where: and(
          eq(applications.projectId,projectId),

          eq(applications.developerId,user.id)
        ),
      });

    if (existingApplication) {

      return NextResponse.json(
        {
          error:
            "You already applied to this project",
        },
        {
          status: 400,
        }
      );
    }


    
    const newApplication = await db
      .insert(applications)
      .values({
        projectId,
        developerId: user.id,
        proposalMessage: body.proposalMessage,
        proposedPrice: body.proposedPrice,
        deliveryTime: body.deliveryTime,
      })
      .returning()
    
    return NextResponse.json(newApplication[0]);

  } catch (error) {

    console.log("Error in application route:",error)

    return NextResponse.json(
      { error: "Failed to submit proposal" },
      { status: 500 }
    )

  }

}