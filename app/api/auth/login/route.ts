import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request){
  const body = await req.json();
  const { email, password } = body;
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if(!user){
    return NextResponse.json({ error : "Invalid credentials"}, { status: 400});
  }

  const isValid = await bcrypt.compare(password, user.password);

  if(!isValid){
    return NextResponse.json({ error : "Invalid credentials"}, { status: 400});
  }

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  const response = NextResponse.json({ message: "Login successful "});

  response.cookies.set("token", token,{
    httpOnly: true,
  });
  return response;
}