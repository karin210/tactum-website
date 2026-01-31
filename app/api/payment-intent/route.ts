import { NextResponse } from "next/server";
import Stripe from "stripe";

const SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

export async function POST() {
  const stripe = new Stripe(SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 30000,
    currency: "mxn",
    automatic_payment_methods: {
    enabled: true,
  },
  metadata: {
    type: "deposit"
  }
  });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}