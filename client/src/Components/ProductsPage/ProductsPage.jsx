import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductsPage.css";
import "../Filter/Filter.css";
import Navbar from "../Navbar/Navbar";
import Filter from "../Filter/Filter";
import { FaFilter, FaEye } from "react-icons/fa";

const ProductsPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/category/${category}`
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des produits.");
      }
    };

    fetchProducts();
  }, [category]);

  const handleProductClick = (id) => {
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

    if (filters.brand) {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    if (category === "keyboards") {
      if (filters.keyboardSize) {
        filtered = filtered.filter(
          (product) => product.keyboardSize === filters.keyboardSize
        );
      }
      if (filters.connectivity) {
        filtered = filtered.filter(
          (product) => product.connectivity === filters.connectivity
        );
      }
    } else if (category === "switches") {
      if (filters.switchType) {
        filtered = filtered.filter(
          (product) => product.switchType === filters.switchType
        );
      }
    } else if (category === "keycaps") {
      if (filters.keycapProfile) {
        filtered = filtered.filter(
          (product) => product.keycapProfile === filters.keycapProfile
        );
      }
      if (filters.color) {
        filtered = filtered.filter(
          (product) => product.color === filters.color
        );
      }
    }

    setFilteredProducts(filtered);
  };

  const toggleFilterOnMobile = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const formatCategoryName = (cat) => {
    switch (cat) {
      case "keyboards":
        return "Claviers";
      case "keycaps":
        return "Keycaps";
      case "switches":
        return "Switchs";
      case "accessories":
        return "Accessoires";
      default:
        return cat;
    }
  };

  return (
    <div>
      <Navbar />
      {error && <p className="error-message">{error}</p>}
      <div className="category-title-container">
        <h1 className="category-title">{formatCategoryName(category)}</h1>
      </div>

      <button className="filter-toggle-mobile" onClick={toggleFilterOnMobile}>
        <FaFilter />{" "}
        {isFilterOpen ? "Masquer les filtres" : "Afficher les filtres"}
      </button>

      <div className="products-page-container">
        <div
          className={`filter-container-sidebar ${isFilterOpen ? "open" : ""}`}
        >
          <Filter onApplyFilters={applyFilters} category={category} />
        </div>

        <div className="products-main">
          <div className="products-header">
            <p className="products-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length > 1 ? "résultats" : "résultat"}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Badge de stock */}
                  {product.stock > 0 ? (
                    <div className="stock-badge in-stock">En stock</div>
                  ) : (
                    <div className="stock-badge out-of-stock">Rupture</div>
                  )}

                  {/* Image du produit */}
                  <div className="imageButton">
                    <img
                      src={`http://localhost:8080${product.imageUrl}`}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>

                  {/* Informations du produit */}
                  {/* Informations du produit */}
                  <div className="product-info">
                    <div className="product-category">
                      {product.brand || ""}
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price-container">
                      <div className="productPrice">
                        €{product.price.toFixed(2)}
                      </div>
                      {/* Retirer ce bouton vide */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>Aucun produit ne correspond à vos critères de recherche.</p>
              <button
                className="clear-filters-btn"
                onClick={() => applyFilters({})}
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
