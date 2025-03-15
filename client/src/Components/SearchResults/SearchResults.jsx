import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Filter from "../Filter/Filter";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/products/search?q=${encodeURIComponent(
            query
          )}`
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        setError("Une erreur est survenue lors de la recherche de produits.");
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleProductClick = (category, id) => {
    navigate(`/products/${category}/${id}`);
  };

  const applyFilters = (filters) => {
    let filtered = products;

    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        if (filters.priceRange === "low") return product.price <= 50;
        if (filters.priceRange === "medium")
          return product.price > 50 && product.price <= 100;
        if (filters.priceRange === "high") return product.price > 100;
        return true;
      });
    }

    if (filters.availability) {
      filtered = filtered.filter((product) =>
        filters.availability === "inStock"
          ? product.stock > 0
          : product.stock === 0
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div>
      <Navbar />
      <div className="search-results-container">
        <h1 className="search-results-title">Résultats pour "{query}"</h1>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Recherche en cours...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <Filter onApplyFilters={applyFilters} />

            <div className="results-info">
              {filteredProducts.length > 0 ? (
                <p className="results-count">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length > 1 ? "résultats" : "résultat"}{" "}
                  trouvé{filteredProducts.length > 1 ? "s" : ""}
                </p>
              ) : (
                <p className="no-results">
                  Aucun produit correspondant à "{query}"
                </p>
              )}
            </div>

            {filteredProducts.length > 0 && (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <button
                      className="imageButton"
                      onClick={() =>
                        handleProductClick(product.category, product._id)
                      }
                    >
                      <img
                        src={`http://localhost:8080${product.imageUrl}`}
                        alt={product.name}
                        className="product-image"
                      />
                    </button>
                    <div className="product-info">
                      <strong>
                        <p className="product-name">{product.name}</p>
                      </strong>
                      <p className="product-category">{product.category}</p>
                      <p className="product-price">
                        €{product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
