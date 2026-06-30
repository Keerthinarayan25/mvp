import { db } from "@/db";

import {
  contracts,
  projects,
  users,
} from "@/db/schema";

import {
  eq,
} from "drizzle-orm";

import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET(req: NextRequest, { params,
}: {
  params: Promise<{
    id: string;
  }>;
}
) {

  const { id } =
    await params;

  const contract =
    await db.query.contracts.findFirst({
      where: eq(
        contracts.id,
        Number(id)
      ),
    });

  if (!contract) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  const project =
    await db.query.projects.findFirst({
      where: eq(
        projects.id,
        contract.projectId
      ),
    });

  const founder =
    await db.query.users.findFirst({
      where: eq(
        users.id,
        contract.founderId
      ),
    });

  const developer =
    await db.query.users.findFirst({
      where: eq(
        users.id,
        contract.developerId
      ),
    });

  // console.log("CONTRACT, PROJECT, FOUNDER, DEVELOPER", contract,
  //   project,
  //   founder,
  //   developer,);

  return NextResponse.json({
    contract,
    project,
    founder,
    developer,
  });
}