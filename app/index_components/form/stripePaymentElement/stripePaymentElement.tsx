"use client";

import {
  PaymentElement,
  LinkAuthenticationElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useMemo, useState } from "react";

type MessageType = "info" | "error" | "success";

function Message({
  type,
  children,
}: {
  type: MessageType;
  children: React.ReactNode;
}) {
  const style = useMemo(() => {
    switch (type) {
      case "error":
        return { borderColor: "#b42318", background: "#fef3f2" };
      case "success":
        return { borderColor: "#027a48", background: "#ecfdf3" };
      default:
        return { borderColor: "#98a2b3", background: "#f2f4f7" };
    }
  }, [type]);

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      style={{
        marginTop: 12,
        padding: 12,
        border: "1px solid",
        borderRadius: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function StripePaymentElement({
  paymentIntentId,
}: {
  paymentIntentId: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: MessageType;
    text: string;
  } | null>(null);

  const returnUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL("/pago/exito", window.location.origin).toString();
  }, []);

  const handlePayClick = async () => {
    if (!stripe || !elements || !paymentIntentId) {
      setMessage({
        type: "info",
        text: "Cargando el sistema de pago. Espera un momento e intenta de nuevo.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Trigger Payment Element validation UI
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setIsSubmitting(false);
      setMessage({
        type: "error",
        text:
          submitError.message ??
          "Revisa los datos del pago e inténtalo de nuevo.",
      });
      return;
    }

    // 2. Extract Name, Phone, and City from the AddressElement
    const addressElement = elements.getElement(AddressElement);
    const { value: addressValue } = await addressElement!.getValue();

    try {
      // 3. Create the Intent with the data from Stripe Elements
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntentId, // THIS TRIGGERS THE UPDATE LOGIC
          email: email, // From LinkAuthenticationElement state
          name: addressValue.name,
          phone: addressValue.phone,
          city: addressValue.address.city,
        }),
      });

      const { clientSecret } = await response.json();

      // 4. Confirm Payment (Using the clientSecret we just got)
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret, // CRITICAL: This was missing in your code
        confirmParams: {
          return_url: returnUrl,
        },
      });

      // 5. Handle Stripe Confirmation Errors
      if (error) {
        setMessage({
          type: "error",
          text: error.message ?? "No se pudo confirmar el pago.",
        });
      } else {
        // If no error and no redirect happened, force redirect
        window.location.assign(returnUrl);
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      // We only stop the loading state if there was an error
      // (otherwise the page redirects anyway)
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !stripe || !elements;

  return (
    <section aria-label="Pago con Stripe">
      <div id="payment-element-container">
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />

        {/* 2. Address & Name Element */}
        <AddressElement
          options={{
            mode: "shipping", // 'shipping' collects name/phone/address
            fields: { phone: "always" }, // Force phone number collection
            validation: { phone: { required: "always" } },
          }}
        />
        <PaymentElement
          id="payment-element"
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
            },
          }}
        />
      </div>

      <div>
        <button
          type="button"
          id="submit"
          onClick={handlePayClick}
          disabled={isDisabled}
          aria-disabled={isDisabled}
        >
          <span id="button-text">
            {isSubmitting ? "Procesando pago..." : "Pagar depósito"}
          </span>
        </button>
      </div>

      {message ? <Message type={message.type}>{message.text}</Message> : null}
    </section>
  );
}
