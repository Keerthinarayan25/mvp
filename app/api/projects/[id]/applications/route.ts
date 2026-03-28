import { db } from "@/db";
import { applications, developerProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const {id} = await params;
  try {
    const projectId = Number(id);
    const result = await db
    .select({
      applicationId: applications.id,
      proposalMessage: applications.proposalMessage,
      proposedPrice: applications.proposedPrice,
      deliveryTime: applications.deliveryTime,

      developerId: users.id,
      developerName: users.name,
    })
    .from(applications)
    .innerJoin(users, eq(applications.developerId,users.id))
    .leftJoin(developerProfiles,
      eq(developerProfiles.userId, users.id)
    )
    .where(eq(applications.projectId, projectId));

    return NextResponse.json(result);


  } catch (error) {

    console.log("Error in application fetch:",error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
    
  }

}