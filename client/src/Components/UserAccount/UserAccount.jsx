import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import UserOrders from "../UserOrders/UserOrders";
import "./UserAccount.css";
import { FaUser, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const UserAccount = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
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

        setUser(response.data);
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

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div>
      <Navbar />
      <div className="user-account-container">
        <div className="user-info-card">
          <div className="user-avatar-container">
            <div className="user-avatar">{getInitial(user.username)}</div>
          </div>
          <h1>Bienvenue, {user.username || "Utilisateur"} !</h1>
          <div className="user-details">
            <div className="user-detail-item">
              <FaUser className="user-detail-icon" />
              <span>{user.username}</span>
            </div>
            <div className="user-detail-item">
              <FaEnvelope className="user-detail-icon" />
              <span>{user.email}</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            Se déconnecter
          </button>
        </div>
        <UserOrders />
      </div>
    </div>
  );
};

export default UserAccount;
