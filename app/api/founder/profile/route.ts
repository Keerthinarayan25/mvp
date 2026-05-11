import { db } from "@/db";
import { founderProfiles, users } from "@/db/schema";
import { signToken, verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "unauthorized " }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
      },
        { status: 404, }
      );
    }

    const body = await req.json();

    const existingProfile = await db.query.founderProfiles.findFirst({
      where: eq(founderProfiles.userId, user.id),
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Founder profile already exists", },
        { status: 400, }
      );
    }


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

    let updatedRoles = user.roles;

    if (!updatedRoles.includes("founder")) {

      updatedRoles = [...updatedRoles, "founder",];

      await db
        .update(users)
        .set({
          roles: updatedRoles,
          activeRole: "founder",
        })
        .where(
          eq(users.id, user.id)
        );
    }

    const newToken = signToken({
      id: user.id,
      roles: updatedRoles as (
        | "developer"
        | "founder"
      )[],
      activeRole: "founder",
    });

    // RESPONSE
    const response = NextResponse.json(
      newProfile[0]
    );

    // UPDATE COOKIE
    response.cookies.set("token", newToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;

  } catch (err) {
    console.error("Founder PROFILE API ERROR:", err);

    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
