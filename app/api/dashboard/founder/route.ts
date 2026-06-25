import { db } from "@/db";
import { contracts, escrows, projects } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = verifyToken(token);

  if (user.activeRole !== "founder") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const allProjects = await db.query.projects.findMany({
    where: eq(projects.founderId, user.id),
  });

  const activeContracts = await db.query.contracts.findMany({
    where: eq(contracts.founderId, user.id),
  });

  const funded = await db
    .select({
      total: sql<number>`coalesce(sum(${escrows.amount}),0)`
    })
    .from(escrows)
    .where(eq(escrows.founderId, user.id));

  return NextResponse.json({
    projectsPosted: allProjects.length,
    openProjects: allProjects.filter(p => p.status === "open").length,
    activeContracts: activeContracts.filter(c => c.status !== "completed" && c.status !== "cancelled").length,
    escrowFunded: funded[0]?.total ?? 0,
  });
}