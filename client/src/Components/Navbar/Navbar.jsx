import React, { useEffect, useState } from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa"; // Import des icônes
import { useNavigate } from "react-router-dom"; // Pour la navigation

import "./Navbar.css";

function Navbar() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/user/account");
    } else {
      navigate("/auth/user/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Vous avez été déconnecté");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="/">KeyCrafted</a>
        </div>

        {/* Barre de recherche */}
        <div className="navbar-search">
          <input type="text" placeholder="Search for products..." />
        </div>

        {/* Icônes utilisateur et panier à la suite de la barre de recherche */}
        <div className="navbar-icons">
          <FaUserCircle className="icon" onClick={handleUserIconClick} />
          <FaShoppingCart className="icon" />
        </div>

        {isLoggedIn && (
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        )}
      </nav>
      <br />
      <hr className="bottomNavbar" />
      <div className="navbar-buttons">
        <button>Keyboards</button>
        <button>Accessories</button>
        <button>Custom</button>
        <button>About</button>
      </div>
    </>
  );
}

export default Navbar;
