import React from "react";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, loading } =
    useCart();
  const navigate = useNavigate();

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

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const taxRate = 0.2;
  const taxes = totalPrice * taxRate;
  const finalPrice = totalPrice + taxes;

  return (
    <div>
      <Navbar />
      <div className="cart-container">
        <div className="cart-products">
          <h2>Votre panier 🛒</h2>
          {cart.items.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <>
              {cart.items.map((item) => (
                <div key={item._id} className="cart-product">
                  <img
                    src={`http://localhost:8080${item.productId.imageUrl}`}
                    alt={item.productId.name}
                    className="product-image-cart"
                  />
                  <div className="product-details">
                    <h3>{item.productId.name}</h3>
                    <p>€{item.productId.price}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item._id, item.quantity - 1)
                            : removeFromCart(item._id)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-product"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Supprimer
                    </button>
                  </div>
                  <p className="product-total">
                    €{(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="cart-summary">
          <h2>Récapitulatif</h2>
          <div className="summary-details">
            <p>
              Sous-total: <span>€{totalPrice.toFixed(2)}</span>
            </p>
            <p>
              TVA (20%): <span>€{taxes.toFixed(2)}</span>
            </p>
            <p className="summary-final">
              Total: <span>€{finalPrice.toFixed(2)}</span>
            </p>
          </div>
          <button className="clear-cart" onClick={clearCart}>
            Vider le panier
          </button>
          <button className="checkout" onClick={() => navigate("/checkout")}>
            Passer à la caisse
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
