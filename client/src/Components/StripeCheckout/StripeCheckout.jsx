import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import "./StripeCheckout.css";

const StripeCheckout = ({
  amount,
  orderId,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentInitialized, setPaymentIntentInitialized] =
    useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (paymentIntentInitialized) return; 

      try {
        setPaymentIntentInitialized(true); 

        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8080/api/stripe/create-payment-intent",
          { amount, orderId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error(
          "Erreur lors de la création de l'intention de paiement:",
          error
        );
        setError("Une erreur est survenue lors de la préparation du paiement.");
        if (onPaymentError) {
          onPaymentError(error);
        }
        setPaymentIntentInitialized(false);
      }
    };

    if (orderId && amount && !paymentIntentInitialized) {
      createPaymentIntent();
    }
  }, [amount, orderId, onPaymentError, paymentIntentInitialized]);

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (payload.error) {
        setError(`Paiement échoué: ${payload.error.message}`);
        if (onPaymentError) {
          onPaymentError(payload.error);
        }
      } else {
        setError(null);
        setSucceeded(true);

        if (onPaymentSuccess) {
          onPaymentSuccess(payload);
        }
      }
    } catch (error) {
      console.error("Erreur lors du traitement du paiement:", error);
      setError("Une erreur est survenue lors du traitement du paiement.");
      if (onPaymentError) {
        onPaymentError(error);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="stripe-checkout">
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="card-container">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  color: "#32325d",
                  fontFamily: "Arial, sans-serif",
                  fontSmoothing: "antialiased",
                  fontSize: "16px",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                  iconColor: "#fa755a",
                },
              },
            }}
            onChange={handleChange}
          />
        </div>

        {error && <div className="card-error">{error}</div>}

        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
          id="submit"
        >
          <span id="button-text">
            {processing ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Payer maintenant"
            )}
          </span>
        </button>

        {succeeded && (
          <div className="payment-success">
            Paiement réussi ! Merci pour votre achat.
          </div>
        )}
      </form>
    </div>
  );
};

export default StripeCheckout;
