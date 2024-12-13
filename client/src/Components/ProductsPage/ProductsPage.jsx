import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductsPage.css";
import "../Filter/Filter.css";
import Navbar from "../Navbar/Navbar";
import Filter from "../Filter/Filter";

const ProductsPage = () => {
  const { category } = useParams(); // Récupère la catégorie de l'URL
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleImageClick = (id) => {
    navigate(`/products/${category}/${id}`); 
  };

  return (
    <div>
      <Navbar />
      {error && <p>{error}</p>}
          <Filter />
          <p className="filter-container">{products.length > 1 ? products.length + " " +"résultats" :  products.length + " " + "résultat" } </p>

      <div className="page-container">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <button
                className="imageButton"
                onClick={() => handleImageClick(product._id)}
              >
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={"Ce produit n'a pas d'image"}
                  className="product-image"
                />
              </button>
              <strong>
                <p>{product.name}</p>
              </strong>
              <p className="productPrice">€{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
