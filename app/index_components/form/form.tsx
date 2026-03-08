"use client";

import { useId, useMemo, useState } from "react";
import { createReservation } from "@/app/actions/create_reservation";
import "./form.css";
import StripeElementsProvider from "./stripetElementsProvider/stripeElementsProvider";

type ActionValue = "reserve" | "news";

export default function Form() {
  const [selectedActions, setSelectedActions] = useState<ActionValue[]>([
    "news",
  ]);

  const isReserveSelected = useMemo(
    () => selectedActions.includes("reserve"),
    [selectedActions],
  );
  const isNewsSelected = useMemo(
    () => selectedActions.includes("news"),
    [selectedActions],
  );

  // Priority: if both selected, treat as reserve (shows the superset of fields).
  const showReserveFields = isReserveSelected;
  const showNewsFields = !isReserveSelected && isNewsSelected;

  const showAnyFields = showReserveFields || showNewsFields;

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

  const contactLegend = showReserveFields
    ? "Tus datos para apartar"
    : "Tus datos para recibir noticias";

  const selectionRequired = !isReserveSelected && !isNewsSelected;

  return (
    <form
      id="form-cta"
      action={createReservation}
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

        <p id={validationId} aria-live="polite">
          {selectionRequired
            ? "Selecciona al menos una opción para continuar."
            : null}
        </p>
      </fieldset>

      <section aria-label="Datos de contacto">
        {showAnyFields ? (
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

            {showReserveFields ? (
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
            ) : null}

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

            {showReserveFields ? (
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
            ) : null}
          </fieldset>
        ) : (
          <p>Selecciona una opción arriba para ver los campos necesarios.</p>
        )}
      </section>

      {showReserveFields ? (
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

      {/* El botón de envío puede vivir dentro del componente de Stripe o habilitarse aquí según el flujo */}
    </form>
  );
}
