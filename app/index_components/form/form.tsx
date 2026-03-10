"use client";

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createReservation } from "@/app/actions/create_reservation";
import "./form.css";
import StripeElementsProvider from "./stripetElementsProvider/stripeElementsProvider";
import { createLead, FormState } from "@/app/actions/action";

type ActionValue = "reserve" | "news";

export default function Form() {
  const [selectedActions, setSelectedActions] = useState<ActionValue[]>([
    "news",
  ]);

  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction, isPending] = useActionState<
    FormState,
    FormData
  >(createLead, {
    success: null,
    message: "",
  });

  const isReserveSelected = useMemo(
    () => selectedActions.includes("reserve"),
    [selectedActions],
  );
  const isNewsSelected = useMemo(
    () => selectedActions.includes("news"),
    [selectedActions],
  );

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !formState.success) return;

    // 1. Show the non-modal dialog
    dialog.show();

    // 2. Set the timer to close it
    const timer = setTimeout(() => {
      dialog.close();
    }, 4000);

    // 3. Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, [formState.success]);

  const legendId = useId();
  const hintId = useId();
  const validationId = useId();

  const handleActionChange = (value: ActionValue, checked: boolean) => {
    setSelectedActions((prev) => {
      if (checked) return Array.from(new Set([...prev, value]));
      return prev.filter((v) => v !== value);
    });
  };

  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const phoneId = useId();

  const contactLegend = isReserveSelected
    ? "Tus datos para apartar"
    : "Tus datos para recibir noticias";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Check if the form is valid using the native browser API
    if (!formRef.current?.reportValidity()) {
      // If invalid, stop the Server Action from firing
      event.preventDefault();
    }
  };

  return (
    <form
      id="form-cta"
      onSubmit={handleSubmit}
      action={createReservation}
      ref={formRef}
      aria-labelledby="form-cta-heading"
    >
      <h3 id="form-cta-heading">Sé parte de nuestros usuarios</h3>

      <fieldset
        aria-describedby={`${hintId} ${validationId}`}
        aria-labelledby={legendId}
      >
        <legend id={legendId}>
          ¿Cómo te gustaría continuar tu contacto con nosotros?
        </legend>

        <p id={hintId}>
          Puedes elegir una o ambas opciones. Si eliges <strong>apartar</strong>
          , te pediremos más información para el seguimiento de tu compra.
        </p>

        <div role="group" aria-label="Opciones de contacto">
          <label htmlFor="action-reserve">
            Apartar por $300 MXN y obtener un 25% de descuento
          </label>{" "}
          <input
            id="action-reserve"
            type="checkbox"
            name="action"
            value="reserve"
            checked={isReserveSelected}
            onChange={(e) => handleActionChange("reserve", e.target.checked)}
          />
          <br />
          <label htmlFor="action-news">
            Recibe las noticias más importantes de Interfaz Humana por e-mail
          </label>{" "}
          <input
            id="action-news"
            type="checkbox"
            name="action"
            value="news"
            checked={isNewsSelected}
            onChange={(e) => handleActionChange("news", e.target.checked)}
          />
        </div>
      </fieldset>

      <section aria-label="Datos de contacto" id="user-data-fields">
        <fieldset>
          <legend>{contactLegend}</legend>

          <label htmlFor={firstNameId}>
            Nombre:
            <br />
            <input
              id={firstNameId}
              className="user-data-input"
              type="text"
              name="first_name"
              defaultValue=""
              autoComplete="given-name"
              required
            />
          </label>

          {isReserveSelected && (
            <label htmlFor={lastNameId}>
              Apellidos:
              <br />
              <input
                id={lastNameId}
                className="user-data-input"
                type="text"
                name="last_name"
                defaultValue=""
                autoComplete="family-name"
                required
              />
            </label>
          )}

          <label htmlFor={emailId}>
            Correo electrónico:
            <br />
            <input
              id={emailId}
              className="user-data-input"
              type="email"
              name="email"
              placeholder="ejemplo@mail.com"
              defaultValue=""
              autoComplete="email"
              inputMode="email"
              required
            />
          </label>

          {isReserveSelected && (
            <label htmlFor={phoneId}>
              Teléfono:
              <br />
              <input
                id={phoneId}
                className="user-data-input"
                type="tel"
                name="phone"
                defaultValue=""
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </label>
          )}
        </fieldset>
      </section>

      {isReserveSelected ? (
        <section id="deposit-container" aria-label="Pago de depósito">
          <h3>Depósito de: $300</h3>

          <table border={1} cellPadding="8" cellSpacing="0">
            <caption>Resumen de pago</caption>
            <thead>
              <tr>
                <th scope="col" colSpan={2}>
                  GG-Gloves
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Precio</td>
                <td>$1,500.00</td>
              </tr>
              <tr>
                <td>Descuento (25%)</td>
                <td>-$375</td>
              </tr>
              <tr>
                <td>Depósito</td>
                <td>$300.00</td>
              </tr>
              <tr>
                <td>Total restante</td>
                <td>$825</td>
              </tr>
            </tbody>
          </table>

          <div id="patyment-element-slot" aria-label="Formulario de pago">
            <StripeElementsProvider />
          </div>

          <p id="follow-up-text">
            Guardaremos tus datos y recibirás el seguimiento de tu compra por
            e-mail y WhatsApp para finalizar los detalles de tus productos
            (talla, color, envío, etc.) y liquidar el pago. Si tienes dudas{" "}
            <a href="">contáctanos</a>.
          </p>
        </section>
      ) : null}

      {!isReserveSelected && (
        <button
          id="register-to-news-btn"
          type="submit"
          aria-label="Registrarme"
          formAction={formAction}
        >
          {isPending ? "Guardando..." : "Registrarme"}
        </button>
      )}
      {/* El botón de envío puede vivir dentro del componente de Stripe o habilitarse aquí según el flujo */}
      <dialog ref={dialogRef} role="status" className="dialog-popover">
        <p>{formState.message}</p>
      </dialog>
    </form>
  );
}
