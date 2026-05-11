import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { email, password } = body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const activeRole = user.activeRole === "founder"
        ? "founder"
        : "developer";

    const token = signToken({id: user.id,
      roles: user.roles as (
        | "developer"
        | "founder"
      )[],
      activeRole,
    });

    // const token = signToken({
    //   id: user.id,
    //   roles: user.roles,
    //   activeRole: user.activeRole,
    // });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        roles: user.roles,
        activeRole: user.activeRole,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch {

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}