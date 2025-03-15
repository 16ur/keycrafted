import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import des icônes
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        { email, password }
      );

      if (response.status === 200) {
        const { accessToken } = response.data;
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

  const handleRegisterClick = () => {
    navigate("/auth/user/register");
  };

  return (
    <div>
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
              placeholder="Votre email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Se connecter
          </button>
        </form>

        <div className="register-link">
          <button className="register-button" onClick={handleRegisterClick}>
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
