import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./ConfirmationPage.css";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrderDetails(location.state.order);
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  if (!orderDetails) {
    return null;
  }

  const { items, total, fullName, address, phoneNumber } = orderDetails;

  return (
    <div>
      <Navbar />
      <div className="confirmation-container">
        <h2 className="h2Confirm">
          Merci pour votre commande, {fullName} ! 🎉
        </h2>
        <p>
          Votre commande a été enregistrée avec succès. Un email de confirmation
          vous sera envoyé sous peu.
        </p>

        <div className="confirmation-details">
          <h3>Détails de la commande</h3>
          <ul className="order-items">
            {items.map((item, index) => (
              <li key={index} className="order-item">
                <img
                  src={`http://localhost:8080${item.productId.imageUrl}`}
                  alt={item.productId.name}
                  className="order-item-image"
                />
                <div>
                  <p>{item.productId.name}</p>
                  <p>Quantité : {item.quantity}</p>
                  <p>Prix unitaire : €{item.productId.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>

          <h3>Informations de livraison</h3>
          <p>
            <strong>Adresse :</strong> {address}
          </p>
          <p>
            <strong>Téléphone :</strong> {phoneNumber}
          </p>

          <h3>Total de la commande</h3>
          <p className="order-total">€{total.toFixed(2)}</p>
        </div>

        <button onClick={() => navigate("/")} className="return-home-button">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
