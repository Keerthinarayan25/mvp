import { db } from "@/db";
import { applications } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
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
    const body = await req.json();

    console.log("Application poject ID:", body.project_id)
    const newApplication = await db
      .insert(applications)
      .values({
        projectId: Number(body.projectId),
        developerId: user.id,
        proposalMessage: body.proposalMessage,
        proposedPrice: body.proposedPrice,
        deliveryTime: body.deliveryTime,
      })
      .returning()
    
    return NextResponse.json(newApplication);

  } catch (error) {

    console.log("Error in application route:",error)

    return NextResponse.json(
      { error: "Failed to submit proposal" },
      { status: 500 }
    )

  }

}