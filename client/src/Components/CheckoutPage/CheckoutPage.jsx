import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./CheckoutPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const { cart } = useCart();
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

      console.log("Commande réussie :", response.data);
      toast.success("Commande réussie !");
      navigate("/confirmation", {
        state: {
          order: {
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
      console.error(
        "Erreur lors de la commande :",
        error.response?.data || error.message
      );
      toast.error("Une erreur est survenue lors de la commande.");
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      <div className="checkout-container">
        <h2>Informations de Commande</h2>
        <form onSubmit={handleSubmit} className="checkout-form">
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
            Valider la commande
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
