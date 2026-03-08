"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import StripePaymentElement from "../stripePaymentElement/stripePaymentElement";

export default function StripeElementsProvider() {
  const [clientSecret, setClientSecret] = useState("");
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  ).then((res) => res);

  useEffect(() => {
    fetch("/api/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);
  if (!clientSecret) {
    return <div></div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentElement></StripePaymentElement>
    </Elements>
  );
}
