import React, { useEffect, useState } from "react";
import "./CorePage.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import KeyboardsMain from "../../assets/images/keyboards_main.png";
import KeycapsMain from "../../assets/images/keycaps_main.jpg";
import SwitchesMain from "../../assets/images/switches_main.jpg";
import AccessoriesMain from "../../assets/images/accessories_main.jpg";
import axios from "axios";

function CorePage() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/products/recent"
        );
        setRecentProducts(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des produits récents.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

  return (
    <div className="core-page">
      <Navbar />

      <section className="categories">
        <h2>Nos Catégories Populaires</h2>
        <div className="categories-grid">
          <div className="category-card">
            <button
              className="category-card-button"
              onClick={() => handleCategoryClick("keyboards")}
            >
              <img src={KeyboardsMain} alt="Claviers" />
              <h3>Claviers</h3>
            </button>
          </div>
          <div className="category-card">
            <button
              className="category-card-button"
              onClick={() => handleCategoryClick("keycaps")}
            >
              <img src={KeycapsMain} alt="Keycaps" />
              <h3>Keycaps</h3>
            </button>
          </div>
          <div className="category-card">
            <button
              className="category-card-button"
              onClick={() => handleCategoryClick("switches")}
            >
              <img src={SwitchesMain} alt="Switches" />
              <h3>Switches</h3>
            </button>
          </div>
          <div className="category-card">
            <button
              className="category-card-button"
              onClick={() => handleCategoryClick("accessories")}
            >
              <img src={AccessoriesMain} alt="Accessoires" />
              <h3>Accessoires</h3>
            </button>
          </div>
        </div>
      </section>

      <section className="featured">
        <h2>Récemment ajoutés</h2>
        {loading ? (
          <p>Chargement des produits...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="products-grid-main">
            {recentProducts.map((product) => (
              <div
                key={product._id}
                className="product-card-main"
                onClick={() =>
                  navigate(`/products/${product.category}/${product._id}`)
                }
              >
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                <p>{`€${product.price.toFixed(2)}`}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CorePage;
