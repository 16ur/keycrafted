import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./ProductDetails.css";
import { useCart } from "../../contexts/CartContext";

const ProductDetails = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${category}/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des détails du produit.");
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/similar/${category}/${id}`
        );
        setRecommendedProducts(response.data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des produits similaires :",
          err
        );
      }
    };

    fetchRecommendedProducts();
  }, [category, id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Chargement des détails du produit...</p>;
  }

  const isInStock = product.stock > 0;

  return (
    <div>
      <Navbar />
      <div className="product-details-container">
        <div className="product-thumbnails-container">
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="product-thumbnail"
          />
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="product-thumbnail"
          />
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="product-thumbnail"
          />
        </div>

        <div className="product-main-container">
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="product-main-image"
          />

          <div className="product-info">
            <p
              className="product-brand"
              onClick={() => navigate(`/brand/${product.brand}`)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              {product.brand}
            </p>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">€{product.price}</p>
            <p className="product-tax">TVA non incluses.</p>

            <div className="stock-info">
              <strong>Stock disponible : </strong>
              {isInStock ? (
                <span className="in-stock-text">{product.stock}</span>
              ) : (
                <span className="out-of-stock-text">Rupture de stock</span>
              )}
            </div>

            <div className="quantityAndCartAdd">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  className="quantity-button"
                  disabled={!isInStock}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-button"
                  disabled={!isInStock || quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className={`add-to-cart-button ${!isInStock ? "disabled" : ""}`}
                disabled={!isInStock}
              >
                {isInStock ? "Ajouter au panier" : "Indisponible"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="product-description-container">
        <h2>À propos</h2>
        <p className="description-title">Description</p>
        <ul className="product-description-list">
          {product.description?.split("\n").map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>{" "}
      <div className="recommendations">
        <h2>Vous pourriez aussi aimer 👍</h2>
        <div className="recommendations-grid">
          {recommendedProducts.map((item) => (
            <div
              key={item._id}
              className="recommended-product"
              onClick={() => navigate(`/products/${item.category}/${item._id}`)}
            >
              <div className="recommended-image-container">
                <img
                  src={`http://localhost:8080${item.imageUrl}`}
                  alt={item.name}
                  className="recommended-image"
                />
                <div className="image-overlay">
                  <h3 className="overlay-title">{item.name}</h3>
                  <button
                    className="overlay-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${item.category}/${item._id}`);
                    }}
                  >
                    Voir le produit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
