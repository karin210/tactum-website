import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongoDBConnection";
import User from "@/lib/models/users";
import Reservation from "@/lib/models/reservations";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!, // The whsec_... key
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // Extract all data from the metadata you sent when creating the PaymentIntent
    const { type, totalPrice, depositAmount, reservationDate, city } =
      paymentIntent.metadata;

    const emailToUse =
      paymentIntent.metadata.email || paymentIntent.receipt_email;

    await connectDB();

    if (type === "deposit") {
      // 1. Ensure the user is upgraded or created
      const user = await User.findOneAndUpdate(
        { email: emailToUse },
        { $set: { userType: "customer", email: emailToUse } },
        { upsert: true, new: true },
      );

      // 2. Create the Reservation from scratch
      // We use findOneAndUpdate to prevent duplicate records if the webhook fires twice
      await Reservation.findOneAndUpdate(
        { depositPaymentIntentId: paymentIntent.id }, // Unique identifier
        {
          $set: {
            user: user._id,
            status: "confirmed",
            totalPrice: Number(totalPrice),
            depositAmount: Number(depositAmount),
            balanceAmount: Number(totalPrice) - Number(depositAmount),
            paymentStatus: "deposit_paid",
            reservationDate: new Date(reservationDate),
            city: city,
          },
        },
        { upsert: true, new: true },
      );

      console.log(`Reservation created for customer: ${emailToUse}`);
    }
  }

  // ... handle "payoff" type similarly

  return NextResponse.json({ received: true });
}
