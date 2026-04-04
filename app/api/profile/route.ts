import { db } from "@/db";
import { contracts, developerProfiles, portfolios, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const userId = Number(req.nextUrl.searchParams.get("id"));

  const profile = await db
    .select({
      id: developerProfiles.id,
      userId: users.id,
      name: users.name,
      bio: developerProfiles.bio,
      skills: developerProfiles.skills,
      techStack: developerProfiles.techStack,
      // profileImage: developerProfiles.profileImage,
    })
    .from(developerProfiles)
    .innerJoin(users, eq(developerProfiles.userId, users.id))
    .where(eq(users.id, userId));

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  const portfolio = await db
    .select()
    .from(portfolios)
    .where(eq(portfolios.developerId, userId));

  const contractCount = await db
    .select()
    .from(contracts)
    .where(eq(contracts.developerId, userId))

  return NextResponse.json({
    user: user[0],
    profile: profile[0],
    portfolio,
    contractCount: contractCount.length
  })

}