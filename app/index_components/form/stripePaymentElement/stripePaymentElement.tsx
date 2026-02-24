import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react'

export default function StripePaymentElement() {

  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);


    setTimeout(() => {
      setIsLoading(false);

    }, 2000);
  };
  
    const paymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    }
  };

  return (
    <div id="payment-form">
      <PaymentElement id="payment-element" options={paymentElementOptions as any} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </div>
  )
}
