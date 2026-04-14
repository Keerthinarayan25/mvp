import { db } from "@/db";
import { contracts, projects, users } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest) {

  const token = req.cookies.get("token")?.value;
  if(!token){
    return NextResponse.json({error: "Unauthorized"},{status:401});
  }

  const user = verifyToken(token);

  const developer = alias(users, "developer");
  const founder = alias(users, "founder");

  const result = await db
  .select({
    contractId: contracts.id,
    projectTitle: projects.title,
    status: contracts.status,
    developerId: contracts.developerId,
    developerName: developer.name,
    founderId: contracts.founderId,
    founderName: founder.name
  })
  .from(contracts)
  .innerJoin(projects, eq(contracts.projectId, projects.id))
  .innerJoin(developer, eq(contracts.developerId, developer.id))
  .innerJoin(founder, eq(contracts.founderId, founder.id))
  .where(
    or(
      eq(contracts.developerId, user.id),
      eq(contracts.founderId, user.id)
    )
  )
  console.log("Contract GET founction result:", result);

  return NextResponse.json(result);
  
}