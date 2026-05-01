import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


function normalizeUrl(url: string) {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }
  return url;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    const portfolioId = Number(id);

    await db
      .delete(portfolios)
      .where(
        and(
          eq(portfolios.id, portfolioId),
          eq(portfolios.developerId, user.id)
        )
      )

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete portfolio error:", error);

    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("API received id:", id);
    console.log("type of API received id:", typeof id);

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    const portfolioId = Number(id);
    console.log("Parsed id:", portfolioId);
    console.log("type of parsed id:", typeof portfolioId);

    if (isNaN(portfolioId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updateData: Record<string, string> = {};

    if (body.title?.trim()) updateData.title = body.title;
    if (body.description?.trim()) updateData.description = body.description;
    if (body.projectLink?.trim()) updateData.projectLink = normalizeUrl(body.projectLink);
    if (body.githubLink?.trim()) updateData.githubLink = normalizeUrl(body.githubLink);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(portfolios)
      .set(updateData)
      .where(
        and(
          eq(portfolios.id, portfolioId),
          eq(portfolios.developerId, user.id) 
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Not allowed" },
        { status: 403 }
      );
    }

    return NextResponse.json(updated[0]);

  } catch (error) {
    console.error("Update portfolio error:", error);

    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}