import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";

export async function POST(req: Request){
  const body = await req.json();
  const { name, email, password, role } = body;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return NextResponse.json({message: "User created"});

}