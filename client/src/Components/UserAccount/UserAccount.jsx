import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccount.css";
import Navbar from "../Navbar/Navbar";

const UserAccount = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Si pas de token, redirige l'utilisateur vers la page de connexion
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
        setError("Erreur lors de la récupération de l'utilisateur");
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
      <div className="user-account">
        <h1>Mon compte</h1>
        {error && <p className="error">{error}</p>}
        <p>Nom d'utilisateur: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Historique d'achats</p>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
};

export default UserAccount;
