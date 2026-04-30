import { db } from "@/db";
import { contracts, developerProfiles, portfolios, users } from "@/db/schema";
// import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";


// function getUserIdFromToken(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) return null;

//   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//     id: number
//   }
//   return decoded.id;
// }


export async function GET(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const userId = Number(idParam);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const profile = await db.query.developerProfiles.findFirst({
      where: eq(developerProfiles.userId, userId),
    });

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
      .where(eq(contracts.developerId, userId));

    return NextResponse.json({
      user: user[0],
      profile,
      portfolio,
      contractCount: contractCount.length
    });

  } catch (err) {
    console.error("PROFILE API ERROR:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest){
  const token =  req.cookies.get("token")?.value;

  if(!token) return NextResponse.json({ error: "Unauthorized" }, {status: 401});
  
  const user = verifyToken(token);
  const body = await req.json();

  const existing = await db.query.developerProfiles.findFirst({
    where: eq(developerProfiles.userId, user.id),
  });

  if(existing){
    return NextResponse.json({error:"Profile already exists"}, {status:400})
  }

  const profile  = await db.insert(developerProfiles).values({
    userId: user.id,
    ...body,
  }).returning();

  return NextResponse.json(profile[0]);
}

export async function PATCH(req: NextRequest){
  try{
    const token = req.cookies.get("token")?.value;

    if(!token){
      return NextResponse.json({ error: "Unauthorized"}, {status: 401});
    }
    
    const user = verifyToken(token);

    if(user.role !== "developer"){
      return NextResponse.json( { error: "Forbidden"}, { status: 403});
    }

    const body = await req.json();

    const existing = await db.query.developerProfiles.findFirst({
      where: eq(developerProfiles.userId, user.id),
    });

    let result;

    if(existing) {
      result = await db
      .update(developerProfiles)
      .set({
        bio: body.bio,
        skills: body.skills,
        github: body.github,
        linkedin: body.linkedin,
        profileImage:body.profileImage,
      })
      .where(eq(developerProfiles.userId, user.id))
      .returning();
    } else {
      result = await db
      .insert(developerProfiles)
      .values({
        userId: user.id,
        bio:body.bio,
        skills:body.skills,
        github:body.github,
        linkedin:body.linkedin,
        profileImage:body.profileImage,
      })
      .returning();
    }

    return NextResponse.json(result[0]);

  }catch (error){
    console.error("PROFILE UPSERT ERROR:", error);

    return NextResponse.json(
      {error: "Failed to update profile"},
      { status: 500}
    );
  }
}