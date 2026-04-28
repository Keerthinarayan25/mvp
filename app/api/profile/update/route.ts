import { db } from "@/db";
import { developerProfiles } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(req: NextRequest){
  try{
    const token = req.cookies.get("token")?.value;

    if(!token){
      return NextResponse.json({ error: "Unauthorized"}, {status: 401});
    }
    
    const user = verifyToken(token);

    if(user.role !== "developer"){
      return NextResponse.json( { error: "Forbidden"}, { status: 403});
    }

    const body = await req.json();

    const updated = await db
    .update(developerProfiles)
    .set({
      bio: body.bio,
      skills: body.skills,
      languages: body.languages,
      github: body.github,
      linkedin: body.linkedin,
      profileImage: body.profileImage,      
    })
    .where(eq(developerProfiles.userId, user.id))
    .returning();

    return NextResponse.json(updated[0]);

  }catch (error){
    console.log("Updated profile failed:", error);

    return NextResponse.json(
      {error: "Failed to update profile"},
      { status: 500}
    );
  }
}