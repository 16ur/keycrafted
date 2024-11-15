import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Import des icônes
import { useNavigate } from "react-router-dom"; // Pour la navigation
import UserAvatar from "../../assets/userAvatar.svg?react";
import CartUser from "../../assets/cart.svg?react";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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
        <div className="navbar-left">
          <button>Qui sommes-nous ?</button>
        </div>

        <div className="navbar-center">
          <a href="/" className="navbar-logo">
            KeyCrafted
          </a>
        </div>

        <div className="navbar-right">
          <button>Français</button>
          <button>EUR €</button>
          <button>
            <UserAvatar
              className="icon"
              onClick={handleUserIconClick}
              width="24px"
              height="24px"
            />
          </button>
          <button>
            <CartUser className="icon" width="24px" height="24px" />
          </button>
        </div>
      </nav>

      <div className="navbar-buttons">
        <button>Claviers</button>
        <button>Keycaps</button>
        <button>Switchs</button>
        <button>Accessoires</button>
        <button>Ventes flash</button>
      </div>
    </>
  );
}

export default Navbar;
