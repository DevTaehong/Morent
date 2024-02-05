import { NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get("paymentIntentId");
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const latestChargeId = paymentIntent.latest_charge;

  const latestCharge = await stripe.charges.retrieve(latestChargeId);

  const receiptUrl = latestCharge.receipt_url;

  return NextResponse.json({
    receiptUrl,
  });
}
