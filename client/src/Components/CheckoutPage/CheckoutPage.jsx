import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import { useCart } from "../../contexts/CartContext";
import "./CheckoutPage.css";
import StripeWrapper from "../../StripeWrapper";
import StripeCheckout from "../StripeCheckout/StripeCheckout";

const CheckoutPage = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    additionalNotes: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [showStripeForm, setShowStripeForm] = useState(false);

  const { cart, clearCart, promoCode } = useCart();
  const navigate = useNavigate();

  const totalPrice =
    cart?.items?.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    ) || 0;
  const taxes = totalPrice * 0.2;

  const discount = promoCode
    ? (totalPrice * promoCode.discountPercentage) / 100
    : 0;
  const finalPrice = totalPrice + taxes - discount;

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/user/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;

        setFormData({
          fullName: userData.fullName || "",
          address: userData.address
            ? `${userData.address}, ${userData.postalCode || ""} ${
                userData.city || ""
              }`
            : "",
          phone: userData.phoneNumber || "",
          additionalNotes: "",
        });

        setUserEmail(userData.email);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations utilisateur:",
          error
        );
        toast.error("Erreur lors de la récupération de vos informations.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const orderResponse = await axios.post(
        "http://localhost:8080/api/orders",
        {
          items: cart.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          address: formData.address,
          phoneNumber: formData.phone,
          fullName: formData.fullName,
          email: userEmail,
          additionalNotes: formData.additionalNotes,
          promoCode: promoCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderId(orderResponse.data.order._id);
      setShowStripeForm(true);
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      toast.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la commande."
      );
    }
  };

  const handlePaymentSuccess = (payload) => {
    toast.success("Paiement traité avec succès!");
    clearCart();

    navigate("/confirmation", {
      state: {
        order: {
          _id: orderId,
          items: cart.items,
          total: finalPrice,
          fullName: formData.fullName,
          address: formData.address,
          phoneNumber: formData.phone,
          paymentInfo: {
            transactionId: payload.paymentIntent.id,
            paymentMethod: "card",
            date: new Date(),
          },
        },
      },
    });
  };

  const handlePaymentError = (error) => {
    console.error("Erreur de paiement:", error);
    toast.error("Échec du paiement. Veuillez réessayer.");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de vos informations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="checkout-page">
        <h1 className="checkout-title">Finaliser ma commande</h1>
        <div className="checkout-content">
          <div className="checkout-summary">
            <h2>Résumé de votre panier</h2>
            {cart.items.map((item) => (
              <div key={item.productId._id} className="checkout-item">
                <img
                  src={`http://localhost:8080${item.productId.imageUrl}`}
                  alt={item.productId.name}
                  className="checkout-item-image"
                />
                <div className="checkout-item-details">
                  <h3>{item.productId.name}</h3>
                  <p>Quantité : {item.quantity}</p>
                  <p>
                    Prix : €{(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="checkout-pricing">
              <p>
                Sous-total : <span>€{totalPrice.toFixed(2)}</span>
              </p>
              <p>
                Taxes (20%) : <span>€{taxes.toFixed(2)}</span>
              </p>
              {promoCode && (
                <p className="discount-info">
                  Remise ({promoCode.discountPercentage}%) :{" "}
                  <span>-€{discount.toFixed(2)}</span>
                </p>
              )}
              <h3 className="checkout-total">
                Total : <span>€{finalPrice.toFixed(2)}</span>
              </h3>
            </div>
          </div>

          {showStripeForm && orderId ? (
            <div className="payment-section">
              <h2>Paiement sécurisé</h2>
              <StripeWrapper>
                <StripeCheckout
                  amount={finalPrice}
                  orderId={orderId}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </StripeWrapper>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2>Informations de livraison</h2>
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre nom complet"
                />
                <small className="form-info">
                  {!formData.fullName &&
                    "Remplissez votre profil pour sauvegarder ces informations"}
                </small>
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  name="address"
                  maxLength={100}
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Adresse complète: rue, code postal, ville"
                />
                <small className="form-info">
                  {!formData.address &&
                    "Remplissez votre profil pour sauvegarder ces informations"}
                </small>
              </div>
              <div className="form-group">
                <label>Numéro de téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre numéro de téléphone"
                />
                <small className="form-info">
                  {!formData.phone &&
                    "Remplissez votre profil pour sauvegarder ces informations"}
                </small>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="readonly-input"
                />
                <small className="form-info">
                  Email associé à votre compte
                </small>
              </div>
              <div className="form-group">
                <label>Notes supplémentaires</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Instructions spéciales pour la livraison (optionnel)"
                ></textarea>
              </div>

              <button type="submit" className="checkout-button">
                Continuer vers le paiement
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
