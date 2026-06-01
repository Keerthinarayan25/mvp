import { db } from "@/db";
import { contracts, projects, users } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
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


    const developer = alias(users, "developer");
    const founder = alias(users, "founder");

    let data;

    if (user.activeRole === "founder") {
      data = await db
        .select({
          id: contracts.id,
          projectId: projects.id,
          projectTitle: projects.title,

          developerId: contracts.developerId,
          developerName: developer.name,

          founderId: contracts.founderId,
          founderName: founder.name,

          agreedprice: contracts.agreedprice,
          currency: contracts.currency,

          deliveryValue: contracts.deliveryValue,
          deliveryUnit: contracts.deliveryUnit,

          status: contracts.status,
          deadline: contracts.deadline,
          createdAt: contracts.createdAt,
        })
        .from(contracts)
        .innerJoin(
          projects,
          eq(contracts.projectId, projects.id)
        )
        .innerJoin(
          developer,
          eq(contracts.developerId, developer.id)
        )
        .innerJoin(
          founder,
          eq(contracts.founderId, founder.id)
        )
        .where(eq(contracts.founderId, user.id));
    } else {
      data = await db
        .select({
          id: contracts.id,
          projectId: projects.id,
          projectTitle: projects.title,

          developerId: contracts.developerId,
          developerName: developer.name,

          founderId: contracts.founderId,
          founderName: founder.name,

          agreedprice: contracts.agreedprice,
          currency: contracts.currency,

          deliveryValue: contracts.deliveryValue,
          deliveryUnit: contracts.deliveryUnit,

          status: contracts.status,
          deadline: contracts.deadline,
          createdAt: contracts.createdAt,
        })
        .from(contracts)
        .innerJoin(
          projects,
          eq(contracts.projectId, projects.id)
        )
        .innerJoin(
          developer,
          eq(contracts.developerId, developer.id)
        )
        .innerJoin(
          founder,
          eq(contracts.founderId, founder.id)
        )
        .where(eq(contracts.developerId, user.id));
    }
    return NextResponse.json(data);

  } catch (error) {
    console.error("Contracts API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  }
}