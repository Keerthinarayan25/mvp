import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { developerProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

function getUserIdFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return null;

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: number
  }
  return decoded.id;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthroized" }, { status: 401 })
    }

    const body = await req.json();

    const profile = await db.insert(developerProfiles).values({
      userId,
      bio: body.bio,
      skills: body.skills,
      techStack: body.techStack,
      portfolioLinks: body.portfolioLinks,
      pricingModel: body.pricingModel,
      availability: body.availability,
    }).returning()

    return NextResponse.json(profile);

  } catch {
    return NextResponse.json({ error: "Failed to create profile" })

  }
}


export async function GET(req: NextRequest) {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthroized" }, { status: 401 })
  }

  const profile = await db.query.developerProfiles.findFirst({
    where: eq(developerProfiles.userId, userId),
  })

  return NextResponse.json(profile)

}

export async function PUT(req:NextRequest) {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthroized" }, { status: 401 })
  }

  const body = await req.json();
  
  const updated = await db.update(developerProfiles).set({
    bio: body.bio,
    skills: body.skills,
    techStack: body.techStack,
    portfolioLinks: body.portfolioLinks,
    pricingModel: body.pricingModel,
    availability: body.availability,
  }).where(eq(developerProfiles.userId, userId)).returning()

  return NextResponse.json(updated);
}