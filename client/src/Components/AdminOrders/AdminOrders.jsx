import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [viewMode, setViewMode] = useState("pending"); 
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

  useEffect(() => {
    const pending = filteredOrders.filter(
      (order) => order.status === "pending"
    );
    const shipped = filteredOrders.filter(
      (order) => order.status === "shipped"
    );
    const delivered = filteredOrders.filter(
      (order) => order.status === "delivered"
    );

    setPendingOrders(pending);
    setShippedOrders(shipped);
    setDeliveredOrders(delivered);
  }, [filteredOrders]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    const filtered = orders.filter((order) => {
      if (searchFilter === "all") {
        return (
          order._id.toLowerCase().includes(lowerCaseSearch) ||
          order.fullName.toLowerCase().includes(lowerCaseSearch) ||
          order.email.toLowerCase().includes(lowerCaseSearch) ||
          order.address.toLowerCase().includes(lowerCaseSearch) ||
          order.phoneNumber.toLowerCase().includes(lowerCaseSearch)
        );
      }

      if (searchFilter === "orderId") {
        return order._id.toLowerCase().includes(lowerCaseSearch);
      }

      if (searchFilter === "clientName") {
        return order.fullName.toLowerCase().includes(lowerCaseSearch);
      }

      if (searchFilter === "email") {
        return order.email.toLowerCase().includes(lowerCaseSearch);
      }

      if (searchFilter === "address") {
        return order.address.toLowerCase().includes(lowerCaseSearch);
      }

      return false;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, searchFilter, orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchFilter("all");
  };

  const renderOrder = (order) => (
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
          <strong>Client:</strong>{" "}
          <a
            href={`/admin/user/${order.userId}/orders`}
            className="user-link"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/admin/user/${order.userId}/orders`, {
                state: {
                  userName: order.fullName,
                  userEmail: order.email,
                },
              });
            }}
          >
            {order.fullName}
          </a>
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
                <td>{(item.productId.price * item.quantity).toFixed(2)}€</td>
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
                    (acc, item) => acc + item.productId.price * item.quantity,
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
  );

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

        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <select
              value={searchFilter}
              onChange={handleFilterChange}
              className="search-filter"
            >
              <option value="all">Tous les champs</option>
              <option value="orderId">ID de commande</option>
              <option value="clientName">Nom du client</option>
              <option value="email">Email</option>
              <option value="address">Adresse</option>
            </select>
            {searchTerm && (
              <button className="clear-search-btn" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>

          <div className="search-results">
            {searchTerm && (
              <span className="results-count">
                {filteredOrders.length} commande(s) trouvée(s)
              </span>
            )}
          </div>
        </div>

        <div className="order-tabs">
          <button
            className={`tab-button ${viewMode === "pending" ? "active" : ""}`}
            onClick={() => setViewMode("pending")}
          >
            En attente ({pendingOrders.length})
          </button>
          <button
            className={`tab-button ${viewMode === "shipped" ? "active" : ""}`}
            onClick={() => setViewMode("shipped")}
          >
            Expédiées ({shippedOrders.length})
          </button>
          <button
            className={`tab-button ${viewMode === "delivered" ? "active" : ""}`}
            onClick={() => setViewMode("delivered")}
          >
            Livrées ({deliveredOrders.length})
          </button>
        </div>

        {viewMode === "pending" ? (
          pendingOrders.length === 0 ? (
            <p className="no-orders">
              {searchTerm
                ? "Aucune commande en attente ne correspond à votre recherche"
                : "Aucune commande en attente"}
            </p>
          ) : (
            <div className="orders-list">
              {pendingOrders.map((order) => renderOrder(order))}
            </div>
          )
        ) : viewMode === "shipped" ? (
          shippedOrders.length === 0 ? (
            <p className="no-orders">
              {searchTerm
                ? "Aucune commande expédiée ne correspond à votre recherche"
                : "Aucune commande expédiée"}
            </p>
          ) : (
            <div className="orders-list">
              {shippedOrders.map((order) => renderOrder(order))}
            </div>
          )
        ) : deliveredOrders.length === 0 ? (
          <p className="no-orders">
            {searchTerm
              ? "Aucune commande livrée ne correspond à votre recherche"
              : "Aucune commande livrée"}
          </p>
        ) : (
          <div className="orders-list">
            {deliveredOrders.map((order) => renderOrder(order))}
          </div>
        )}

        <div className="orders-summary">
          <div className="summary-card">
            <div className="summary-badge pending"></div>
            <h3>En attente</h3>
            <p className="summary-number">{pendingOrders.length}</p>
          </div>
          <div className="summary-card">
            <div className="summary-badge shipped"></div>
            <h3>Expédiées</h3>
            <p className="summary-number">{shippedOrders.length}</p>
          </div>
          <div className="summary-card">
            <div className="summary-badge delivered"></div>
            <h3>Livrées</h3>
            <p className="summary-number">{deliveredOrders.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
