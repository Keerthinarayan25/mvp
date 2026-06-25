import { db } from "@/db";
import { escrows } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { sql } from "drizzle-orm";
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

    if (user.activeRole !== "developer") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const funded = await db
      .select({ total: sql<number>`coalesce(sum(${escrows.amount}),0)` })
      .from(escrows)
      .where(
        sql`
          ${escrows.developerId}=${user.id}
          and
          ${escrows.status}='funded'
        `
      );

    const released = await db
      .select({ total: sql<number>`coalesce(sum(${escrows.amount}),0)` })
      .from(escrows)
      .where(
        sql`
          ${escrows.developerId}=${user.id}
          and
          ${escrows.status}='released'
        `
      );

    const pending = await db
      .select({ total: sql<number>`coalesce(sum(${escrows.amount}),0)` })
      .from(escrows)
      .where(
        sql`
          ${escrows.developerId}=${user.id}
          and
          ${escrows.status}='pending'
        `
      );

    return NextResponse.json({

      funded: funded[0]?.total ?? 0,
      released: released[0]?.total ?? 0,
      pending: pending[0]?.total ?? 0,

    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to load escrow" },
      { status: 500 }
    );

  }

}