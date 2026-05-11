import { db } from "@/db";
import { users } from "@/db/schema";
import { signToken, UserRole, verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {

  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    console.log("DECODED;",decoded);

    const body = await req.json();

    const role = body.role as UserRole;

    // SECURITY
    if (!decoded.roles.includes(role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await db.update(users).set({ activeRole: role }).where(eq(users.id, decoded.id));


    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, }
      );
    }

    const newToken = signToken({
      id: updatedUser.id,
      roles: updatedUser.roles as UserRole[],
      activeRole: updatedUser.activeRole as UserRole,
    });

    console.log("NEW TOKEN:",verifyToken(newToken));

    // RESPONSE
    const response = NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      roles: updatedUser.roles,
      activeRole: updatedUser.activeRole,
    });

    // OVERWRITE COOKIE
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
    );

    return response;

  } catch (error) {
    console.error("Switch role error:", error);

    return NextResponse.json(
      { error: "Failed to switch role", },
      { status: 500, }
    );
  }




}