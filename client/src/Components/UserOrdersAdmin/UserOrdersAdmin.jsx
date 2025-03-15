import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import "./UserOrdersAdmin.css";

const UserOrdersAdmin = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userEmail } = location.state || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: userName || "Utilisateur",
    email: userEmail || "",
  });

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
          toast.error("Accès non autorisé");
          navigate("/");
          return;
        }

        fetchUserOrders();
      } catch (err) {
        setError("Erreur lors de la vérification des droits d'administration");
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate, userId]);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/orders/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);

      if (!userName && response.data.length > 0) {
        setUserDetails({
          name: response.data[0].fullName,
          email: response.data[0].email,
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
      setError("Erreur lors de la récupération des commandes de l'utilisateur");
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
      fetchUserOrders();
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

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="user-orders-admin-container">
          <h2>Chargement des commandes...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="user-orders-admin-container">
          <h2>Erreur</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="user-orders-admin-container">
        <ToastContainer position="top-right" />

        {/* Bouton de retour en dehors du header */}
        <button
          onClick={() => navigate("/admin/orders")}
          className="back-button"
        >
          &larr; Retour à toutes les commandes
        </button>

        {/* Header séparé pour les infos utilisateur */}
        <div className="user-details">
          <h1>Commandes de {userDetails.name}</h1>
          {userDetails.email && (
            <p className="user-email">{userDetails.email}</p>
          )}
        </div>

        {orders.length === 0 ? (
          <p className="no-orders">
            Aucune commande trouvée pour cet utilisateur
          </p>
        ) : (
          <>
            <div className="orders-summary">
              <div className="summary-card">
                <h3>Total de commandes</h3>
                <p className="summary-number">{orders.length}</p>
              </div>
              <div className="summary-card">
                <h3>Montant total</h3>
                <p className="summary-number">
                  {orders
                    .reduce((total, order) => {
                      const orderTotal = order.items.reduce(
                        (sum, item) =>
                          sum + item.productId.price * item.quantity,
                        0
                      );
                      return total + orderTotal;
                    }, 0)
                    .toFixed(2)}
                  €
                </p>
              </div>
              <div className="summary-card">
                <h3>Date dernière commande</h3>
                <p className="summary-date">
                  {orders.length > 0 && formatDate(orders[0].createdAt)}
                </p>
              </div>
            </div>

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
                              {(item.productId.price * item.quantity).toFixed(
                                2
                              )}
                              €
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
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrdersAdmin;
