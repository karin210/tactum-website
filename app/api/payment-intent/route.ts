import { NextResponse } from "next/server";
import Stripe from "stripe";

const SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

export async function POST(req: Request) {
  const stripe = new Stripe(SECRET_KEY);

  try {
    // 1. Get the data from your frontend form
    const { userId, email, city, paymentIntentId } = await req.json();
    // 1. Define the metadata separately to keep things clean
    const metadata = {
      type: "deposit",
      userId: userId || "guest",
      email: email || "pending",
      totalPrice: "875",
      depositAmount: "300",
      city: city || "pending",
      reservationDate: new Date().toISOString(),
    };

    let paymentIntent;

    if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: 30000,
        currency: "mxn",
        receipt_email: email || undefined,
        metadata: metadata,
      });
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount: 30000,
        currency: "mxn",
        receipt_email: email || undefined,
        metadata: metadata,
        automatic_payment_methods: { enabled: true },
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id, // Send ID back so the frontend can store it
    });
  } catch (error: any) {
    console.error("Stripe API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
