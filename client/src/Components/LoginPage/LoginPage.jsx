import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import Navbar from "../Navbar/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialiser useNavigate
  const navigate = useNavigate();

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          email,
          password,
        }
      );

      // Si connexion réussie
      if (response.status === 200) {
        const { accessToken } = response.data;
        // Sauvegarde du token dans le localStorage
        localStorage.setItem("token", accessToken);
        setIsLoggedIn(true);

        setMessage("Connexion réussie !");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setError("");
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
      setMessage("");
    }
  };

  // Fonction pour rediriger vers la page d'inscription
  const handleRegisterClick = () => {
    navigate("/auth/user/register");
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <button className="backLobby" onClick={() => navigate("/")}>
        Retour à l'accueil
      </button>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Se connecter
        </button>
      </form>

      {/* Bouton pour rediriger vers la page d'inscription */}
      <div className="register-link">
        <button className="register-button" onClick={handleRegisterClick}>
          S'inscrire
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
