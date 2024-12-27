import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        {
          username,
          email,
          password,
        }
      );

      if (response.status === 201) {
        setMessage(
          "Inscription réussie ! Vous pouvez maintenant vous connecter."
        );
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      setMessage("");
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <button className="backLobby" onClick={() => navigate("/")}>
        Retour à l'accueil
      </button>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
          S'inscrire
        </button>
      </form>
      <button
        className="login-button"
        onClick={() => navigate("/auth/user/login")}
      >
        Retour à la page de connexion
      </button>
    </div>
  );
};

export default RegisterPage;
