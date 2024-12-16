import React from "react";
import "./CorePage.css";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import KeyboardsMain from "../../assets/images/keyboards_main.png";
import KeycapsMain from "../../assets/images/keycaps_main.jpg";
import SwitchesMain from "../../assets/images/switches_main.jpg";
import AccessoriesMain from "../../assets/images/accessories_main.jpg";

function CorePage() {
  const navigate = useNavigate();

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
            <button onClick={() => handleCategoryClick("keyboards")}>
              <img src={KeyboardsMain} alt="Claviers" />
              <h3>Claviers</h3>
            </button>
          </div>
          <div className="category-card">
            <button onClick={() => handleCategoryClick("keycaps")}>
              <img src={KeycapsMain} alt="Keycaps" />
              <h3>Keycaps</h3>
            </button>
          </div>
          <div className="category-card">
            <img src={SwitchesMain} alt="Switches" />
            <h3>Switches</h3>
          </div>
          <div className="category-card">
            <img src={AccessoriesMain} alt="Accessoires" />
            <h3>Accessoires</h3>
          </div>
        </div>
      </section>

      <section className="featured">
        <h2>Récemment ajoutés</h2>
        <div className="products-grid-main">
          <div className="product-card-main">
            <img src="/images/product1.jpg" alt="Product 1" />
            <h3>Clavier Ducky One 3</h3>
            <p>€149.99</p>
          </div>
          <div className="product-card-main">
            <img src="/images/product2.jpg" alt="Product 2" />
            <h3>Keycaps GMK Red Samurai</h3>
            <p>€99.99</p>
          </div>
          <div className="product-card-main">
            <img src="/images/product3.jpg" alt="Product 3" />
            <h3>Switches Gateron Pro</h3>
            <p>€34.99</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} KeyCrafted. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

export default CorePage;
