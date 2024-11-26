import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProductsPage.css";
import Navbar from "../Navbar/Navbar";
import Filter from "../Filter/Filter";

const ProductsPage = () => {
  const { category } = useParams(); // Récupère la catégorie de l'URL
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/category/${category}`
        );
        setProducts(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des produits.");
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div>
      <Navbar />
      {error && <p>{error}</p>}
      <div className="page-container">
        {/* Filtre à gauche */}
        <Filter />

        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <strong>
                <p>{product.name}</p>
              </strong>
              <p>{product.price} €</p>
              <img src={product.imageUrl} alt={product.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
