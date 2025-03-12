import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Filter from "../Filter/Filter";
import "../ProductsPage/ProductsPage.css";
import "../Filter/Filter.css";

const BrandPage = () => {
  const { brand } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsByBrand = async () => {
      try {
        console.log(`Fetching products for brand: ${brand}`);
        const response = await axios.get(
          `http://localhost:8080/api/products/brand/${brand}`
        );
        console.log("Réponse de l'API :", response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error(
          "Erreur détaillée :",
          err.response ? err.response.data : err.message
        );
        setError("Erreur lors de la récupération des produits par marque.");
      }
    };

    fetchProductsByBrand();
  }, [brand]);

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
      <div className="brand-title-container">
        <h1 className="brand-title">Produits de la marque {brand}</h1>
      </div>
      {error && <p>{error}</p>}
      <Filter onApplyFilters={applyFilters} />
      <p className="filter-container">
        {filteredProducts.length > 1
          ? filteredProducts.length + " " + "résultats"
          : filteredProducts.length + " " + "résultat"}{" "}
      </p>

      <div className="page-container">
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
                  alt={"Ce produit n'a pas d'image"}
                  className="product-image"
                />
              </button>
              <strong>
                <p>{product.name}</p>
              </strong>
              <p className="productPrice">€{product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
