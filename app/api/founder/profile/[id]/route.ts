import { and, eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { founderProfiles, projects, users } from "@/db/schema";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params;
    const userId = Number(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const founderProfile = await db.query.founderProfiles.findFirst({
      where: eq(founderProfiles.userId, userId),
    });

    const userProjects = await db.query.projects.findMany({
      where: eq(projects.founderId, userId),
    });

    return NextResponse.json({
      user,
      founderProfile,
      projects: userProjects,
    });


  } catch (err) {
    console.error("Founder PROFILE API ERROR:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }

}




export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    console.log("USER FOUNDER DETAILS:", user);
    const { id } = await params;

    if (user.role !== "founder") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    console.log("BODY OF FOUNDER PROFILE:", body);

    const existing = await db.query.founderProfiles.findFirst({
      where: eq(founderProfiles.userId, user.id),
    });
    console.log("EXISING PROFILE:", existing);

    if (existing) {
      const result = await db
        .update(founderProfiles)
        .set({
          bio: body.bio,
          companyName: body.companyName,
          companyDescription: body.companyDescription,
          website: body.website,
          linkedIn: body.linkedin,
          profileImage: body.profileImage,
        })
        .where(
          and(
            eq(founderProfiles.userId, user.id),
            eq(founderProfiles.id, Number(id))
          )
        )
        .returning();
      console.log("RESULT:", result);

      return NextResponse.json(result[0]);

    }
    const created = await db
      .insert(founderProfiles)
      .values({
        userId: user.id,
        bio: body.bio,
        companyName: body.companyName,
        companyDescription: body.companyDescription,
        website: body.website,
        linkedIn: body.linkedin,
        profileImage: body.profileImage,
      })
      .returning();


    console.log("RESULT:", created);


    return NextResponse.json(created[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}