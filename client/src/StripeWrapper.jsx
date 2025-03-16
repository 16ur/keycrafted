import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripeKey) {
  console.error(
    "La clé publique Stripe n'est pas définie dans les variables d'environnement. " +
      "Assurez-vous de créer un fichier .env dans le dossier client avec VITE_STRIPE_PUBLIC_KEY."
  );
}

const stripePromise = loadStripe(stripeKey);

const StripeWrapper = ({ children }) => {
  if (!stripeKey) {
    return (
      <div className="stripe-error">
        <p>
          Configuration Stripe incomplète. Veuillez contacter l'administrateur.
        </p>
      </div>
    );
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;
