import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./CheckoutPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    additionalNotes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/orders",
        {
          items: cart.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          address: formData.address,
          phoneNumber: formData.phone,
          fullName: formData.fullName,
          email: formData.email,
          additionalNotes: formData.additionalNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Commande réussie !");
      clearCart();

      navigate("/confirmation", {
        state: {
          order: {
            _id: response.data.order._id,
            items: cart.items,
            total: cart.items.reduce(
              (acc, item) => acc + item.productId.price * item.quantity,
              0
            ),
            fullName: formData.fullName,
            address: formData.address,
            phoneNumber: formData.phone,
          },
        },
      });
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      toast.error("Une erreur est survenue lors de la commande.");
    }
  };

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
            <h3 className="checkout-total">
              Total : €
              {cart.items
                .reduce(
                  (acc, item) => acc + item.productId.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </h3>
          </div>

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
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                name="address"
                maxLength={50}
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Numéro de téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Notes supplémentaires</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button type="submit" className="checkout-button">
              Valider ma commande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
