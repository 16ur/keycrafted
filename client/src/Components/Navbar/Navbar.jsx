import React from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa"; // Import des icônes
import "./Navbar.css";

function Navbar() {
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
          <FaUserCircle className="icon" />
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
