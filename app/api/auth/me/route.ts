import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
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

    if (!user) return NextResponse.json(null);

    console.log("Auth ME:",user);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
    });

  } catch {

    return NextResponse.json(null);
  }
}