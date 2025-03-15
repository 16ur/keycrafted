import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import Navbar from "../Navbar/Navbar";
import {
  FaTrash,
  FaArrowLeft,
  FaShoppingCart,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import "./CartPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    promoCode,
    applyPromoCode,
    removePromoCode,
    calculatePrices,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const { subtotal, discount, discountedSubtotal, taxes, finalPrice } =
    calculatePrices();

  const handleApplyPromoCode = async () => {
    if (!promoInput.trim()) {
      toast.error("Veuillez entrer un code promo");
      return;
    }

    setIsApplyingPromo(true);
    try {
      const result = await applyPromoCode(promoInput);
      if (result.success) {
        toast.success(result.message);
        setPromoInput("");
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsApplyingPromo(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="cart-container">
          <h1 className="cart-title">Mon Panier</h1>
          <div className="cart-empty">
            <p>Votre panier est vide.</p>
            <button
              className="cart-empty-button"
              onClick={() => navigate("/products/keyboards")}
            >
              <FaShoppingCart style={{ marginRight: "8px" }} />
              Découvrir nos produits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" />
      <div className="cart-container">
        <h1 className="cart-title">Mon Panier</h1>
        <div className="cart-content">
          <div className="cart-products">
            <h2>Articles ({cart.items.length})</h2>
            {cart.items.map((item) => (
              <div key={item._id} className="cart-product">
                <img
                  src={`http://localhost:8080${item.productId.imageUrl}`}
                  alt={item.productId.name}
                  className="product-image-cart"
                  onClick={() =>
                    navigate(
                      `/products/${item.productId.category}/${item.productId._id}`
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
                <div className="product-details">
                  <h3>{item.productId.name}</h3>
                  <p>€{item.productId.price.toFixed(2)}</p>
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
                    <FaTrash /> Supprimer
                  </button>
                </div>
                <p className="product-total">
                  €{(item.productId.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <Link to="/" className="continue-shopping">
              <FaArrowLeft /> Continuer mes achats
            </Link>
          </div>

          <div className="cart-summary">
            <h2>Récapitulatif</h2>
            <div className="summary-details">
              <p>
                Sous-total: <span>€{subtotal.toFixed(2)}</span>
              </p>

              {promoCode && (
                <p className="discount-line">
                  Remise ({promoCode.discountPercentage}%):{" "}
                  <span>-€{discount.toFixed(2)}</span>
                </p>
              )}

              <p>
                TVA (20%): <span>€{taxes.toFixed(2)}</span>
              </p>
              <p className="summary-final">
                Total: <span>€{finalPrice.toFixed(2)}</span>
              </p>
            </div>

            <div className="promo-code">
              {promoCode ? (
                <div className="active-promo">
                  <h3>Code promo appliqué</h3>
                  <div className="promo-badge">
                    <FaTag className="promo-icon" />
                    <span>
                      {promoCode.code} (-{promoCode.discountPercentage}%)
                    </span>
                    <button
                      className="remove-promo-btn"
                      onClick={removePromoCode}
                      aria-label="Retirer le code promo"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>Code promo</h3>
                  <div className="promo-form">
                    <input
                      type="text"
                      placeholder="Entrez votre code"
                      className="promo-input"
                      value={promoInput}
                      onChange={(e) =>
                        setPromoInput(e.target.value.toUpperCase())
                      }
                    />
                    <button
                      className={`apply-promo ${
                        isApplyingPromo ? "loading" : ""
                      }`}
                      onClick={handleApplyPromoCode}
                      disabled={isApplyingPromo}
                    >
                      {isApplyingPromo ? "..." : "Appliquer"}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="cart-actions">
              <button
                className="checkout"
                onClick={() => navigate("/checkout")}
              >
                Passer à la caisse
              </button>
              <button className="clear-cart" onClick={clearCart}>
                <FaTrash /> Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
