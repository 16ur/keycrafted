import React from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa"; // Import des icônes
import { useNavigate } from "react-router-dom"; // Pour la navigation
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // Fonction pour naviguer vers la page de connexion/inscription
  const handleUserIconClick = () => {
    navigate("/auth/user"); // Redirige vers la page de connexion/inscription
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
