import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/user/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/users/current",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.role !== "admin") {
          navigate("/");
          return;
        }

        fetchOrders();
      } catch (err) {
        setError("Erreur lors de la vérification des droits d'administration");
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
      setError("Erreur lors de la récupération des commandes");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Statut de la commande mis à jour: ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut de la commande");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="admin-orders-container">
          <h2>Chargement des commandes...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <Navbar />
        <div className="admin-orders-container">
          <h2>Erreur</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="admin-orders-container">
        <h1 className="admin-orders-title">Gestion des commandes</h1>
        <ToastContainer position="top-right" />

        {orders.length === 0 ? (
          <p className="no-orders">Aucune commande trouvée</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Commande #{order._id}</h3>
                  <span className={`status-badge ${order.status}`}>
                    {order.status === "pending" && "En attente"}
                    {order.status === "shipped" && "Expédiée"}
                    {order.status === "delivered" && "Livrée"}
                  </span>
                </div>

                <div className="order-info">
                  <p>
                    <strong>Date:</strong> {formatDate(order.createdAt)}
                  </p>
                  <p>
                    <strong>Client:</strong> {order.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>Adresse:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Téléphone:</strong> {order.phoneNumber}
                  </p>
                  {order.additionalNotes && (
                    <p>
                      <strong>Notes:</strong> {order.additionalNotes}
                    </p>
                  )}
                </div>

                <div className="order-items">
                  <h4>Produits commandés</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productId.name}</td>
                          <td>{item.productId.price.toFixed(2)}€</td>
                          <td>{item.quantity}</td>
                          <td>
                            {(item.productId.price * item.quantity).toFixed(2)}€
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="total-label">
                          Total
                        </td>
                        <td className="order-total">
                          {order.items
                            .reduce(
                              (acc, item) =>
                                acc + item.productId.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                          €
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="order-actions">
                  <button
                    className={`status-button pending ${
                      order.status === "pending" ? "active" : ""
                    }`}
                    onClick={() => updateOrderStatus(order._id, "pending")}
                    disabled={order.status === "pending"}
                  >
                    En attente
                  </button>
                  <button
                    className={`status-button shipped ${
                      order.status === "shipped" ? "active" : ""
                    }`}
                    onClick={() => updateOrderStatus(order._id, "shipped")}
                    disabled={order.status === "shipped"}
                  >
                    Expédiée
                  </button>
                  <button
                    className={`status-button delivered ${
                      order.status === "delivered" ? "active" : ""
                    }`}
                    onClick={() => updateOrderStatus(order._id, "delivered")}
                    disabled={order.status === "delivered"}
                  >
                    Livrée
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
