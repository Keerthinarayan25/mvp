import { db } from "@/db";
import { contracts, developerProfiles, portfolios, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";



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

    const profile = await db.query.developerProfiles.findFirst({
      where: eq(developerProfiles.userId, userId),
    });

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const portfolio = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.developerId, userId));

    const contractCount = await db
      .select()
      .from(contracts)
      .where(eq(contracts.developerId, userId));

    return NextResponse.json({
      user: user,
      profile,
      portfolio,
      contractCount: contractCount.length
    });

  } catch (err) {
    console.error("Developer PROFILE API ERROR:", err);

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
    const { id } = await params;

    if (user.activeRole !== "developer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    console.log("BODY OF DEVEOPER PROFILE:",body);

    const existing = await db.query.developerProfiles.findFirst({
      where: eq(developerProfiles.userId, user.id),
    });

    let result;

    if (existing) {
      result = await db
        .update(developerProfiles)
        .set({
          bio: body.bio,
          skills: body.skills,
          github: body.github,
          linkedin: body.linkedin,
          profileImage: body.profileImage,
        })
        .where(
          and(
            eq(developerProfiles.userId, user.id),
            eq(developerProfiles.id, Number(id))
          )
        )
        .returning();
    } else {
      result = await db
        .insert(developerProfiles)
        .values({
          userId: user.id,
          bio: body.bio,
          skills: body.skills,
          github: body.github,
          linkedin: body.linkedin,
          profileImage: body.profileImage,
        })
        .returning();
    }

    // console.log(result[0]);
    // console.log(typeof result[0].id);

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("PROFILE UPSERT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}