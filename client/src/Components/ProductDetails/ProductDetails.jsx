import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { category } = useParams(); // Récupère la catégorie de l'URL

  const { id } = useParams(); // Récupérer l'ID du produit depuis l'URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

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
    return <p></p>;
  }

  return (
    <div>
      <Navbar />
      <div className="product-details-container">
        <img
          src={`http://localhost:8080${product.imageUrl}`}
          alt={product.name}
          className="product-image-details"
        />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="productPrice">€{product.price}</p>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
