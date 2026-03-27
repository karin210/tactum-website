import { NextResponse } from "next/server";
import Stripe from "stripe";

const SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

export async function POST(req: Request) {
  const stripe = new Stripe(SECRET_KEY);

  // 1. Get the data from your frontend form
  const { userId, email, totalPrice, depositAmount, city, reservationDate } =
    await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 30000, // 300.00 MXN
    currency: "mxn",
    receipt_email: email, // This sends the Stripe receipt automatically
    automatic_payment_methods: { enabled: true },
    metadata: {
      type: "deposit",
      userId: userId, // Link to the Lead
      email: email,
      totalPrice: totalPrice.toString(),
      depositAmount: depositAmount.toString(),
      city: city,
      reservationDate: reservationDate, // e.g., "2026-05-15"
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
