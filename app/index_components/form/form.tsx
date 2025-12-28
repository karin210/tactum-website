"use client";

import { createLead } from "@/app/actions/action";
import "./form.css";

export default function Form() {

  return (
     <form id="form-cta" action={createLead}>
      <fieldset>
        <label>
          Apartar por $200MXN y obtener un 20% de descuento
          <input type="checkbox" name="action" value="reserve"/>
        </label>
        <p>Guardaremos tus datos y recibirás un seguimiento de tu compra por e-mail y Whatsapp para finalizar los detalles de tus productos &#40;talla, color, envío etc.&#41; y liquidar el pago. Si tienes dudas <a href="">contáctanos</a></p>
        <label>
          Recibe las noticias más importantes de Interfaz Humana por e-mail
          <input type="checkbox" name="action" value="news" defaultChecked/>
        </label>
      </fieldset>

      <fieldset>
         <label>
          Nombre:
          <input type="text" name="first_name" defaultValue="" />
        </label>
        <label>
          Apellidos:
          <input type="text" name="last_name" defaultValue="" />
        </label>
        <label>
          Email:
          <input type="email" name="email" placeholder="ejemplo@mail.com" defaultValue="" required/>
        </label>
        <label>
          Teléfono:
          <input type="tel" name="phone" defaultValue=""/>
        </label>
      </fieldset>

      <button type="submit">Continuar</button> 
    </form>
  )

}