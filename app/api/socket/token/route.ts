import jwt from "jsonwebtoken";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    const socketToken = jwt.sign(
      {
        id: user.id,
        roles: user.roles,
        activeRole: user.activeRole,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "5m",
      }
    );

    return NextResponse.json({
      token: socketToken,
    });

  } catch {

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  }

}