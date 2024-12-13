import React from "react";
import { useCart } from "../../contexts/CartContext";
import Navbar from "../Navbar/Navbar";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, loading } = useCart();

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="cart-page">
          <h1>Mon Panier</h1>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <h1>Mon Panier</h1>
        {cart.items.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <>
            <ul>
              {cart.items.map((item) => (
                <li key={item._id} className="cart-item">
                  <img
                    src={`http://localhost:8080${item.productId.imageUrl}`}
                    alt={item.productId.name}
                    className="cart-item-image"
                  />
                  <div>
                    <h3>{item.productId.name}</h3>
                    <p>Prix : €{item.productId.price}</p>
                    <p>Quantité : {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item._id)}>
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
            <button className="clear-cart-button" onClick={clearCart}>
              Vider le panier
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
