import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserOrders.css";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/orders/user-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        setError(
          "Une erreur est survenue lors de la récupération des commandes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <div className="user-orders-container">
        <h2>Chargement des commandes...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-orders-container">
        <h2>Erreur</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="user-orders-container">
      <ToastContainer position="top-right" />
      <h2 className="user-orders-title">Mes commandes</h2>
      {orders.length === 0 ? (
        <p className="no-orders">Vous n'avez pas encore passé de commande.</p>
      ) : (
        <div className="orders-list">
          {[...orders].reverse().map((order) => (
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
                  <strong>Adresse de livraison:</strong> {order.address}
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
                    {order.items.map((item, index) => {
                      const isValidProduct =
                        item.productId && typeof item.productId === "object";
                      return (
                        <tr key={index}>
                          <td>
                            {isValidProduct
                              ? item.productId.name
                              : "Produit indisponible"}
                          </td>
                          <td>
                            {isValidProduct
                              ? `${item.productId.price.toFixed(2)}€`
                              : "N/A"}
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            {isValidProduct
                              ? `${(
                                  item.productId.price * item.quantity
                                ).toFixed(2)}€`
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">
                        Total
                      </td>
                      <td className="order-total">
                        {order.items
                          .reduce((acc, item) => {
                            if (
                              item.productId &&
                              typeof item.productId === "object" &&
                              item.productId.price
                            ) {
                              return acc + item.productId.price * item.quantity;
                            }
                            return acc;
                          }, 0)
                          .toFixed(2)}
                        €
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="order-status-info">
                <p>
                  <strong>Statut de la commande:</strong>
                </p>
                <div className="status-indicators">
                  <div
                    className={`status-step ${
                      order.status === "pending" ? "active" : ""
                    }`}
                  >
                    <div className="status-circle"></div>
                    <span>En attente</span>
                  </div>
                  <div className="status-line"></div>
                  <div
                    className={`status-step ${
                      order.status === "shipped" ? "active" : ""
                    }`}
                  >
                    <div className="status-circle"></div>
                    <span>Expédiée</span>
                  </div>
                  <div className="status-line"></div>
                  <div
                    className={`status-step ${
                      order.status === "delivered" ? "active" : ""
                    }`}
                  >
                    <div className="status-circle"></div>
                    <span>Livrée</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
