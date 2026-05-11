import { db } from "@/db";
import { contracts, developerProfiles, portfolios, users } from "@/db/schema";
// import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/auth";


export async function POST(req: NextRequest) {

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);

    const user =
      await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
      });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404, }
      );
    }

    const body = await req.json();


    const existing = await db.query.developerProfiles.findFirst({
      where: eq(developerProfiles.userId, user.id),
    });

    if (existing) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 })
    }

    const profile = await db.insert(developerProfiles).values({
      userId: user.id,
      ...body,
    }).returning();

    let updatedRoles = user.roles;
    if (!updatedRoles.includes("developer")) {
      updatedRoles = [
        ...updatedRoles,
        "developer",
      ];

      await db.update(users).set({
        roles: updatedRoles,
        activeRole: "developer",
      }).where(eq(users.id, user.id));
    }

    const newToken =
      signToken({
        id: user.id,
        roles: updatedRoles as (
          | "developer"
          | "founder"
        )[],
        activeRole: "developer",
      });

      
    const response = NextResponse.json(profile[0]);

    response.cookies.set("token", newToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;

  } catch (error) {

    console.log(
      "Developer profile error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create profile",
      },
      {
        status: 500,
      }
    );

  }
}