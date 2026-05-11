import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { developerProfiles, founderProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {

  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(null);
    }

    const decoded = verifyToken(token);

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return NextResponse.json(
        null
      );
    }

    let profileImage = null;

    if (user.activeRole === "developer") {

      const profile =
        await db.query.developerProfiles.findFirst({
          where: eq(
            developerProfiles.userId,
            user.id
          ),
        });

      profileImage = profile?.profileImage || null;

    } else if (user.activeRole === "founder") {

      const profile =
        await db.query.founderProfiles.findFirst({
          where: eq(
            founderProfiles.userId,
            user.id
          ),
        });

      profileImage = profile?.profileImage || null;
    }

    console.log("Auth ME:", user);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      roles: user.roles,
      activeRole: user.activeRole,
      profileImage,
    });

  } catch(error) {
    console.log(
      "Auth me error:",error);

    return NextResponse.json(null);
  }
}