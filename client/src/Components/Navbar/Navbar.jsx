import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../../assets/userAvatar.svg?react";
import CartUser from "../../assets/cart.svg?react";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token", token);
    setIsLoggedIn(!!token);
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/user/account");
    } else {
      navigate("/auth/user/login");
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button onClick={() => navigate("/about-us")}>
            Qui sommes-nous ?
          </button>
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
          <button onClick={() => navigate("/cart")}>
            <CartUser className="icon" width="24px" height="24px" />
          </button>
        </div>
      </nav>

      <div className="navbar-buttons">
        <button onClick={() => handleCategoryClick("keyboards")}>
          Claviers
        </button>
        <button onClick={() => handleCategoryClick("keycaps")}>Keycaps</button>
        <button>Switchs</button>
        <button>Accessoires</button>
        <button>Ventes flash</button>
      </div>
    </>
  );
}

export default Navbar;
