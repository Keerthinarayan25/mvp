import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

interface JwtPayload {
  id: number;
  role: "developer" | "founder";
}

export async function GET(req: NextRequest){
  const token = req.cookies.get("token")?.value;

  if(!token){
    return NextResponse.json({ error: "Unauthorzed"}, { status: 401});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    return NextResponse.json(user);    
  } catch {

    return NextResponse.json({ error: "Invalid token"}, { status: 401});
    
  }
}