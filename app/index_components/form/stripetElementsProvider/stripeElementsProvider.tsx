"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentElement from "../stripePaymentElement/stripePaymentElement";

// loadStripe should be called outside of the component's render to avoid re-initializing Stripe on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function StripeElementsProvider({
  clientSecret,
  paymentIntentId,
}: {
  clientSecret: string;
  paymentIntentId: string | null;
}) {
  if (!clientSecret) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Cargando sistema de pago...
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentElement
        paymentIntentId={paymentIntentId}
      ></StripePaymentElement>
    </Elements>
  );
}
