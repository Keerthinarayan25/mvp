import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {

  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    return NextResponse.json(user);

  } catch {

    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}