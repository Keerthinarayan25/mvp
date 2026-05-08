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