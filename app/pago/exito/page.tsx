"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

type PaymentIntentStatus =
  | "succeeded"
  | "processing"
  | "requires_payment_method"
  | "requires_action"
  | "canceled"
  | string;

type UiState =
  | { state: "loading" }
  | { state: "missing_secret" }
  | { state: "error"; message: string }
  | {
      state: "ready";
      status: PaymentIntentStatus;
      amount?: number | null;
      currency?: string | null;
      id?: string | null;
    };

function formatMoney(amountMinor: number, currency: string) {
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amountMinor / 100);
  } catch {
    // Fallback (in case currency is unknown)
    return `${(amountMinor / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export default function PagoExitoPage() {
  const [ui, setUi] = useState<UiState>({ state: "loading" });

  const clientSecret = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    // Stripe sends this when using return_url with PaymentIntents
    return params.get("payment_intent_client_secret");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!clientSecret) {
        setUi({ state: "missing_secret" });
        return;
      }

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        setUi({
          state: "error",
          message:
            "Falta configurar la clave pública de Stripe (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).",
        });
        return;
      }

      try {
        const stripe = await loadStripe(publishableKey);
        if (!stripe) {
          setUi({
            state: "error",
            message:
              "No se pudo inicializar Stripe. Recarga la página e inténtalo de nuevo.",
          });
          return;
        }

        const result = await stripe.retrievePaymentIntent(clientSecret);

        if (cancelled) return;

        if (result.error) {
          setUi({
            state: "error",
            message:
              result.error.message ??
              "No se pudo recuperar el estado del pago. Intenta de nuevo.",
          });
          return;
        }

        const pi = result.paymentIntent;
        if (!pi) {
          setUi({
            state: "error",
            message:
              "No se encontró información del pago. Verifica tu conexión e inténtalo de nuevo.",
          });
          return;
        }

        setUi({
          state: "ready",
          status: pi.status,
          amount: pi.amount ?? null,
          currency: pi.currency ?? null,
          id: pi.id ?? null,
        });
      } catch (err) {
        setUi({
          state: "error",
          message:
            err instanceof Error
              ? err.message
              : "Ocurrió un error inesperado al verificar el pago.",
        });
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [clientSecret]);

  const content = useMemo(() => {
    if (ui.state === "loading") {
      return {
        title: "Verificando tu pago…",
        body: (
          <p role="status" aria-live="polite">
            Estamos confirmando el estado de tu depósito. Esto puede tardar unos
            segundos.
          </p>
        ),
      };
    }

    if (ui.state === "missing_secret") {
      return {
        title: "No pudimos verificar tu pago",
        body: (
          <>
            <p role="alert">
              Falta información para verificar el pago. Si acabas de pagar y no
              fuiste redirigido correctamente, vuelve a intentarlo desde el
              formulario.
            </p>
            <p>
              Si necesitas ayuda, contáctanos e indícanos que no se generó el
              enlace de confirmación.
            </p>
          </>
        ),
      };
    }

    if (ui.state === "error") {
      return {
        title: "No pudimos verificar tu pago",
        body: (
          <>
            <p role="alert">{ui.message}</p>
            <p>
              Puedes recargar esta página. Si el problema persiste, contáctanos.
            </p>
          </>
        ),
      };
    }

    // ready
    const amountText =
      ui.amount != null && ui.currency
        ? formatMoney(ui.amount, ui.currency)
        : null;

    switch (ui.status) {
      case "succeeded":
        return {
          title: "Pago confirmado",
          body: (
            <>
              <p role="status" aria-live="polite">
                Tu depósito se registró correctamente.
              </p>
              {amountText ? (
                <p>
                  Monto: <strong>{amountText}</strong>
                </p>
              ) : null}
              <p>
                En breve recibirás seguimiento por correo electrónico y WhatsApp
                para confirmar detalles (talla, color, envío, etc.).
              </p>
            </>
          ),
        };

      case "processing":
        return {
          title: "Pago en proceso",
          body: (
            <>
              <p role="status" aria-live="polite">
                Tu pago está en proceso. En algunos métodos puede tardar un poco
                en confirmarse.
              </p>
              {amountText ? (
                <p>
                  Monto: <strong>{amountText}</strong>
                </p>
              ) : null}
              <p>
                Puedes dejar esta página abierta o volver más tarde para
                verificar el estado.
              </p>
            </>
          ),
        };

      case "requires_payment_method":
      case "canceled":
        return {
          title: "No se pudo completar el pago",
          body: (
            <>
              <p role="alert">
                El pago no se completó. Intenta de nuevo con otro método de pago.
              </p>
              {amountText ? (
                <p>
                  Monto intentado: <strong>{amountText}</strong>
                </p>
              ) : null}
              <p>
                Si crees que esto es un error, contáctanos para ayudarte a
                revisarlo.
              </p>
            </>
          ),
        };

      default:
        return {
          title: "Estado de pago actualizado",
          body: (
            <>
              <p role="status" aria-live="polite">
                Estado actual: <strong>{ui.status}</strong>
              </p>
              {amountText ? (
                <p>
                  Monto: <strong>{amountText}</strong>
                </p>
              ) : null}
              <p>
                Si necesitas ayuda, contáctanos con esta referencia:
                <br />
                <code>{ui.id ?? "—"}</code>
              </p>
            </>
          ),
        };
    }
  }, [ui]);

  return (
    <main style={{ padding: "min(10vh, 64px) 10%", maxWidth: 860 }}>
      <header>
        <h1>{content.title}</h1>
      </header>

      <section aria-label="Resultado del pago">{content.body}</section>

      <nav aria-label="Acciones">
        <a href="/" style={{ display: "inline-block", marginTop: 24 }}>
          Volver al inicio
        </a>
      </nav>
    </main>
  );
}
