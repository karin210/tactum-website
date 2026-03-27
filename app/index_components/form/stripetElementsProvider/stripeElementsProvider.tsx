"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import StripePaymentElement from "../stripePaymentElement/stripePaymentElement";

export default function StripeElementsProvider() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const hasCreatedIntent = useRef(false);
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  ).then((res) => res);

  useEffect(() => {
    if (hasCreatedIntent.current) return;
    hasCreatedIntent.current = true;
    fetch("/api/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // CRITICAL: Tells the server to expect JSON
      },
      body: JSON.stringify({
        email: "pending@example.com",
        name: "unknown",
        phone: "unknown",
        city: "unknown",
        totalPrice: 875,
        depositAmount: 300,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      });
  }, []);

  if (!clientSecret) {
    return <div></div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentElement
        paymentIntentId={paymentIntentId}
      ></StripePaymentElement>
    </Elements>
  );
}
