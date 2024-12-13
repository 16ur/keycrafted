import React from "react";
import { useCart } from "../../contexts/CartContext";
import Navbar from "../Navbar/Navbar";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <h1>Mon Panier</h1>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item._id} className="cart-item">
                  <img
                    src={`http://localhost:8080${item.imageUrl}`}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Prix : €{item.price}</p>
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
