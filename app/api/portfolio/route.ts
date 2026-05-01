import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


function normalizeUrl(url: string) {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}


export async function POST(req: NextRequest) {
  try{
    const token = req.cookies.get("token")?.value;
    if(!token) {
      return NextResponse.json({ error: "Unauthorized"}, {status: 401})
    }

    const user = verifyToken(token);

    const body = await req.json();

    const newPortfolio = await db.insert(portfolios).values({
      developerId: user.id,
      title: body.title,
      description: body.description,
      projectLink: normalizeUrl(body.projectLink),
      githubLink: normalizeUrl(body.githubLink),
    }).returning()

    return NextResponse.json(newPortfolio);
  } catch(error){
    console.log("Error in portfolio route:",error);
    return NextResponse.json({error: "Failed to add project"});
  }
}