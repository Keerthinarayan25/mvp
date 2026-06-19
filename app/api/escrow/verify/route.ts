import crypto from "crypto";
import { db } from "@/db";
import { contracts, escrows, } from "@/db/schema";
import { eq, } from "drizzle-orm";
import { NextRequest, NextResponse, } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;



    const generatedSignature =
      crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");


    console.log("BODY", body);

    console.log("ORDER", razorpay_order_id);

    console.log("PAYMENT", razorpay_payment_id);
    console.log("SIGNATURE", razorpay_signature);

    console.log("GENERATED", generatedSignature);


    if (generatedSignature !== razorpay_signature) {

      return NextResponse.json(
        { error: "Invalid signature", },
        { status: 400, }
      );

    }

    const escrow =
      await db.query.escrows.findFirst({
        where: eq(escrows.razorpayOrderId, razorpay_order_id),
      });

    if (!escrow) {
      return NextResponse.json(
        { error: "Escrow not found" },
        { status: 404 }
      );

    }

    await db
      .update(escrows)
      .set({
        razorpayPaymentId: razorpay_payment_id,
        status: "funded",
        fundedAt: new Date(),
      })
      .where(eq(escrows.id, escrow.id)
      );

    await db
      .update(contracts)
      .set({ status: "active", })
      .where(
        eq(contracts.id, escrow.contractId)
      );

    return NextResponse.json({ success: true });

  } catch {

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );

  }
}