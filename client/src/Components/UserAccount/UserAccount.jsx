import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccount.css";
import Navbar from "../Navbar/Navbar";

const UserAccount = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/user/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/users/current",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    const confirmed = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (confirmed) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="user-account-container">
        <div className="user-info-card">
          <h1>Bienvenue, {user.username || "Utilisateur"} !</h1>
          <div className="user-details">
            <p>
              <strong>Nom d'utilisateur :</strong> {user.username}
            </p>
            <p>
              <strong>Email :</strong> {user.email}
            </p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
