"use client";

import { createLead } from "@/app/actions/action";
import { createReservation } from "@/app/actions/create_reservation";
import "./form.css";
import StripeElementsProvider from "./stripetElementsProvider/stripeElementsProvider";


export default function Form() {

  return (
     <form id="form-cta" action={createReservation}>
      <h3>Sé parte de nuestros usuarios</h3>
      <fieldset>
        <legend>¿Cómo te gustaría continuar tu contacto con nosotros?</legend>
        <label>
          Apartar por $300MXN y obtener un 25% de descuento
          <input type="checkbox" name="action" value="reserve"/>
        </label>
        <label>
          Recibe las noticias más importantes de Interfaz Humana por e-mail
          <input type="checkbox" name="action" value="news" defaultChecked/>
        </label>
      </fieldset>

      <div>
        <fieldset>
          <label>
            Nombre: 
            <br />
            <input className="user-data-input" type="text" name="first_name" defaultValue="" />
          </label>
          <label> 
            Apellidos:
            <br />
            <input className="user-data-input" type="text" name="last_name" defaultValue="" />
          </label>
          <label>
            Email:
            <br />
            <input className="user-data-input" type="email" name="email" placeholder="ejemplo@mail.com" defaultValue="" required/>
          </label>
          <label>
            Teléfono:
            <br />
            <input className="user-data-input" type="tel" name="phone" defaultValue=""/>
          </label>
        </fieldset>

        <div id="deposit-container">
          <h3>Depósito de: $300</h3>
          <table border={1} cellPadding="8" cellSpacing="0">
            <caption>Resumen de pago</caption>
            <thead>
              <tr>
                <th colSpan={2}>GG-Gloves</th>
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
          <div id="patyment-element-slot">
            <StripeElementsProvider>

            </StripeElementsProvider>
          </div>
          <p id="follow-up-text">
            Guardaremos tus datos y recibirás el seguimiento de tu compra por e-mail y Whatsapp para finalizar los detalles de tus productos 
            &#40;talla, color, envío etc.&#41; y liquidar el pago. Si tienes dudas <a href="">contáctanos</a>
          </p>
        </div>
      </div>

      {/* <button type="submit">Continuar</button>  */}
    </form>
  )

}