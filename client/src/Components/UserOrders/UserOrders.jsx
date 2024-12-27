import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
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

  if (loading) {
    return <p>Chargement des commandes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="orders-container">
        <h2 className="h2-orders">Mes Commandes</h2>
        {orders.length === 0 ? (
          <p>Vous n'avez pas encore passé de commande.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Commande #{order._id}</h3>
              <p>Date : {new Date(order.createdAt).toLocaleString()}</p>
              <p>Adresse : {order.address}</p>
              <p>Téléphone : {order.phoneNumber}</p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.productId.name} - {item.quantity} x €
                    {item.productId.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total :</strong> €
                {order.items
                  .reduce(
                    (acc, item) => acc + item.quantity * item.productId.price,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
