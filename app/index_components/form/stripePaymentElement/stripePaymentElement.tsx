"use client";

import {
  PaymentElement,
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

export default function StripePaymentElement() {
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: MessageType;
    text: string;
  } | null>(null);

  const returnUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URL("/pago/exito", window.location.origin).toString();
  }, []);

  const handlePayClick = async () => {
    if (!stripe || !elements) {
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

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
      setIsSubmitting(false);
      setMessage({
        type: "error",
        text:
          error.message ??
          "No se pudo confirmar el pago. Intenta de nuevo o usa otro método de pago.",
      });
      return;
    }

    // If Stripe didn't redirect, we still send the user to the success page,
    // which will verify the PaymentIntent status.
    window.location.assign(returnUrl);
  };

  const isDisabled = isSubmitting || !stripe || !elements;

  return (
    <section aria-label="Pago con Stripe">
      <div id="payment-element-container">
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
