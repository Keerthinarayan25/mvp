import { db } from "@/db";
import { founderProfiles } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "unauthorized " }, { status: 401 });
    }

    const user = verifyToken(token);
    const body = await req.json();

    const newProfile = await db
      .insert(founderProfiles)
      .values({
        userId: user.id,
        bio: body.bio,
        companyName: body.companyName,
        companyDescription: body.companyDescription,
        website: body.website,
        linkedIn: body.linkedIn,
        profileImage: body.profileImage
      })
      .returning();

    return NextResponse.json(newProfile[0]);

  } catch (err) {
    console.error("Founder PROFILE API ERROR:", err);

    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
