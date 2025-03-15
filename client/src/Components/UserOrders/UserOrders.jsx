import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserOrders.css";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("pending"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

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
        setFilteredOrders(response.data);
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();

      const filtered = orders.filter((order) => {
        if (searchFilter === "all") {
          return (
            order._id.toLowerCase().includes(lowerCaseSearch) ||
            order.address.toLowerCase().includes(lowerCaseSearch) ||
            order.phoneNumber.toLowerCase().includes(lowerCaseSearch) ||
            order.items.some(item => 
              item.productId.name.toLowerCase().includes(lowerCaseSearch)
            )
          );
        }

        if (searchFilter === "orderId") {
          return order._id.toLowerCase().includes(lowerCaseSearch);
        }

        if (searchFilter === "product") {
          return order.items.some(item => 
            item.productId.name.toLowerCase().includes(lowerCaseSearch)
          );
        }

        if (searchFilter === "address") {
          return order.address.toLowerCase().includes(lowerCaseSearch);
        }

        return false;
      });

      setFilteredOrders(filtered);
    }
  }, [searchTerm, searchFilter, orders]);

  useEffect(() => {
    const pending = filteredOrders.filter(order => order.status === "pending");
    const shipped = filteredOrders.filter(order => order.status === "shipped");
    const delivered = filteredOrders.filter(order => order.status === "delivered");
    
    setPendingOrders(pending);
    setShippedOrders(shipped);
    setDeliveredOrders(delivered);
  }, [filteredOrders]);

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

      <div className="order-status-info">
        <p>
          <strong>Progression:</strong>
        </p>
        <div className="status-indicators">
          <div className={`status-step ${order.status === "pending" ? "active" : ""}`}>
            <div className="status-circle"></div>
            <span>En attente</span>
          </div>
          <div className="status-line"></div>
          <div className={`status-step ${order.status === "shipped" ? "active" : ""}`}>
            <div className="status-circle"></div>
            <span>Expédiée</span>
          </div>
          <div className="status-line"></div>
          <div className={`status-step ${order.status === "delivered" ? "active" : ""}`}>
            <div className="status-circle"></div>
            <span>Livrée</span>
          </div>
        </div>
      </div>
    </div>
  );

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

      {/* Barre de recherche */}
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
            <option value="product">Produit</option>
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

      {/* Onglets pour filtrer par statut */}
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

      {orders.length === 0 ? (
        <p className="no-orders">Vous n'avez pas encore passé de commande.</p>
      ) : (
        <>
          {/* Affichage des commandes selon l'onglet sélectionné */}
          {viewMode === "pending" ? (
            pendingOrders.length === 0 ? (
              <p className="no-orders">
                {searchTerm ? "Aucune commande en attente ne correspond à votre recherche" : "Aucune commande en attente"}
              </p>
            ) : (
              <div className="orders-list">
                {pendingOrders.map(order => renderOrder(order))}
              </div>
            )
          ) : viewMode === "shipped" ? (
            shippedOrders.length === 0 ? (
              <p className="no-orders">
                {searchTerm ? "Aucune commande expédiée ne correspond à votre recherche" : "Aucune commande expédiée"}
              </p>
            ) : (
              <div className="orders-list">
                {shippedOrders.map(order => renderOrder(order))}
              </div>
            )
          ) : deliveredOrders.length === 0 ? (
            <p className="no-orders">
              {searchTerm ? "Aucune commande livrée ne correspond à votre recherche" : "Aucune commande livrée"}
            </p>
          ) : (
            <div className="orders-list">
              {deliveredOrders.map(order => renderOrder(order))}
            </div>
          )}

          {/* Résumé en bas de page */}
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
        </>
      )}
    </div>
  );
};

export default UserOrders;