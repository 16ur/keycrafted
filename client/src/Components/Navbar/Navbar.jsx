import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaChevronDown,
  FaTimes,
  FaCog,
  FaBox,
  FaShoppingBag,
  FaTicketAlt,
} from "react-icons/fa";
import UserAvatar from "../../assets/userAvatar.svg?react";
import CartUser from "../../assets/cart.svg?react";
import { useCart } from "../../contexts/CartContext";
import KCLogo from "../../../public/kc_logo.png";
import "./Navbar.css";
import axios from "axios";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const { cart, getTotalItems } = useCart();

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const categoriesRef = useRef(null);
  const adminMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const fetchUserRole = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/users/current",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.role === "admin") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du rôle de l'utilisateur :",
            error
          );
        }
      };

      fetchUserRole();
    }

    const handleClickOutside = (event) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?q=${encodeURIComponent(
            searchQuery
          )}`
        );
        setSearchResults(response.data.slice(0, 5));
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (isSearchOpen && searchQuery.trim()) {
        searchProducts();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isSearchOpen]);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/user/account");
    } else {
      navigate("/auth/user/login");
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
    setIsCategoryOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const handleProductClick = (category, id) => {
    navigate(`/products/${category}/${id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const navigateToAdminPage = (page) => {
    navigate(page);
    setIsAdminMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="navbar-container">
        <nav className="navbar">
          <div className="navbar-brand" onClick={() => navigate("/")}>
            <img src={KCLogo} alt="KeyCrafted" className="navbar-logo" />
          </div>

          <div className="navbar-links">
            <div className="navbar-link" onClick={() => navigate("/")}>
              Accueil
            </div>
            <div className="navbar-link" onClick={() => navigate("/about-us")}>
              À propos
            </div>

            <div className="navbar-link category-dropdown" ref={categoriesRef}>
              <div
                className="dropdown-toggle"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                Produits{" "}
                <FaChevronDown
                  className={`chevron ${isCategoryOpen ? "rotate" : ""}`}
                />
              </div>

              {isCategoryOpen && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => handleCategoryClick("keyboards")}
                  >
                    Claviers
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleCategoryClick("keycaps")}
                  >
                    Keycaps
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleCategoryClick("switches")}
                  >
                    Switchs
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleCategoryClick("accessories")}
                  >
                    Accessoires
                  </div>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="navbar-link admin-dropdown" ref={adminMenuRef}>
                <div className="dropdown-toggle" onClick={toggleAdminMenu}>
                  Administration{" "}
                  <FaChevronDown
                    className={`chevron ${isAdminMenuOpen ? "rotate" : ""}`}
                  />
                </div>

                {isAdminMenuOpen && (
                  <div className="dropdown-menu admin-dropdown-menu">
                    <div
                      className="dropdown-item"
                      onClick={() => navigateToAdminPage("/admin")}
                    >
                      <FaBox className="dropdown-icon" />
                      Gestion des produits
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => navigateToAdminPage("/admin/orders")}
                    >
                      <FaShoppingBag className="dropdown-icon" />
                      Gestion des commandes
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => navigateToAdminPage("/admin/promo-codes")}
                    >
                      <FaTicketAlt className="dropdown-icon" />
                      Codes promotionnels
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="navbar-actions">
            <div className="search-container" ref={searchContainerRef}>
              <button
                className={`action-button search-toggle ${
                  isSearchOpen ? "active" : ""
                }`}
                onClick={toggleSearch}
                aria-label="Rechercher"
              >
                <FaSearch />
              </button>

              {isSearchOpen && (
                <div className="search-dropdown">
                  <form onSubmit={handleSearchSubmit} className="search-form">
                    <div className="search-input-wrapper">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          className="search-clear-button"
                          onClick={clearSearch}
                          aria-label="Effacer la recherche"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </form>

                  {searchQuery.trim().length > 1 && (
                    <div className="search-results">
                      {isLoading ? (
                        <div className="search-loading">
                          <div className="search-spinner"></div>
                          <p>Recherche en cours...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <div className="search-results-list">
                            {searchResults.map((product) => (
                              <div
                                key={product._id}
                                className="search-result-item"
                                onClick={() =>
                                  handleProductClick(
                                    product.category,
                                    product._id
                                  )
                                }
                              >
                                <div className="search-result-image">
                                  <img
                                    src={`http://localhost:8080${product.imageUrl}`}
                                    alt={product.name}
                                  />
                                </div>
                                <div className="search-result-info">
                                  <div className="search-result-name">
                                    {product.name}
                                  </div>
                                  <div className="search-result-price">
                                    €{product.price.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {searchResults.length >= 5 && (
                            <div
                              className="view-all-results"
                              onClick={handleSearchSubmit}
                            >
                              Voir tous les résultats
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="no-search-results">
                          Aucun produit trouvé pour "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="action-button user-button"
              onClick={handleUserIconClick}
              aria-label={isLoggedIn ? "Mon compte" : "Se connecter"}
            >
              <UserAvatar className="icon" />
            </button>

            <button
              className="action-button cart-button"
              onClick={() => navigate("/cart")}
              aria-label="Panier"
            >
              <CartUser className="icon" />
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
