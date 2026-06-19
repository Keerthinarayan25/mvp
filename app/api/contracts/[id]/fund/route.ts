import { db } from "@/db";
import { contracts, escrows, } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";
import { eq, } from "drizzle-orm";
import { NextRequest, NextResponse, } from "next/server";

export async function POST(req: NextRequest,
  { params, }: { params: Promise<{ id: string }> }) {

  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", },
        { status: 401, }
      );
    }

    const user = verifyToken(token);

    const { id } = await params;

    const contract =
      await db.query.contracts.findFirst({
        where: eq(contracts.id, Number(id)),
      });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found", },
        { status: 404, }
      );
    }

    console.log("AGREED PRICE:", contract.agreedprice);

    const existingEscrow =
      await db.query.escrows.findFirst({
        where: eq(escrows.contractId, contract.id),
      });

    if (existingEscrow && existingEscrow.status === "funded") {
      return NextResponse.json(
        { error: "Escrow already exists" },
        { status: 400 }
      );
    }

    if (existingEscrow && existingEscrow.status === "pending") {
      return NextResponse.json({
        orderId: existingEscrow.razorpayOrderId,
        amount: existingEscrow.amount * 100,
        currency: existingEscrow.currency,
      });

    }

    if (contract.founderId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden", },
        { status: 403, }
      );
    }


    const order =
      await razorpay.orders.create({
        amount: contract.agreedprice! * 100,
        currency: contract.currency ?? "INR",
      });

    await db.insert(escrows)
      .values({
        contractId: contract.id,
        founderId: contract.founderId,
        developerId: contract.developerId,
        amount: contract.agreedprice!,
        currency: contract.currency,
        razorpayOrderId: order.id,
        status: "pending",
      });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {

    console.error("FUND ESCROW ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create escrow", },
      { status: 500, }
    );
  }
}