import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./ProductDetails.css";

import { useCart } from "../../contexts/CartContext";

const ProductDetails = () => {
  const { category, id } = useParams(); // Récupérer la catégorie et l'ID du produit depuis l'URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

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

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Chargement des détails du produit...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="product-details-page">
        <div className="product-image-container">
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="product-image-details"
          />
          <p className="badge">Nouveau</p>
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">€{product.price}</p>
          <p className="product-description">{product.description}</p>

          <div className="product-thumbnails">
            <img
              src={`http://localhost:8080${product.imageUrl}`}
              alt="Thumbnail"
              className="product-thumbnail"
            />
            <img
              src={`http://localhost:8080${product.imageUrl}`}
              alt="Thumbnail"
              className="product-thumbnail"
            />
          </div>

          <button
            onClick={() => addToCart(product)}
            className="add-to-cart-button"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
