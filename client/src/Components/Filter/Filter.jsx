import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaTimes } from "react-icons/fa";
import "./Filter.css";

const Filter = ({ onApplyFilters, category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "",
    availability: "",
    brand: "",
    color: "",
    switchType: "",
    keycapProfile: "",
    keyboardSize: "",
    connectivity: "",
  });
  const [brands, setBrands] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        let url = "http://localhost:8080/api/products/brands";
        if (category) {
          url += `/${category}`;
        }
        const response = await axios.get(url);
        setBrands(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des marques:", error);
      }
    };

    fetchBrands();
  }, [category]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    onApplyFilters(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "",
      availability: "",
      brand: "",
      color: "",
      switchType: "",
      keycapProfile: "",
      keyboardSize: "",
      connectivity: "",
    });
    onApplyFilters({});
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const getCategorySpecificFilters = () => {
    switch (category) {
      case "keyboards":
        return (
          <>
            <div className="filter-section">
              <div
                className="filter-section-header"
                onClick={() => toggleSection("keyboardSize")}
              >
                <h3>Taille</h3>
                <span>{expandedSection === "keyboardSize" ? "−" : "+"}</span>
              </div>
              {expandedSection === "keyboardSize" && (
                <div className="filter-section-content">
                  <select
                    name="keyboardSize"
                    value={filters.keyboardSize}
                    onChange={handleFilterChange}
                  >
                    <option value="">Toutes les tailles</option>
                    <option value="60%">60%</option>
                    <option value="65%">65%</option>
                    <option value="75%">75%</option>
                    <option value="TKL">TKL</option>
                    <option value="full">Full-size</option>
                  </select>
                </div>
              )}
            </div>
          </>
        );
      case "switches":
        return (
          <>
            <div className="filter-section">
              <div
                className="filter-section-header"
                onClick={() => toggleSection("switchType")}
              >
                <h3>Type de switch</h3>
                <span>{expandedSection === "switchType" ? "−" : "+"}</span>
              </div>
              {expandedSection === "switchType" && (
                <div className="filter-section-content">
                  <select
                    name="switchType"
                    value={filters.switchType}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous les types</option>
                    <option value="linear">Linéaire</option>
                    <option value="tactile">Tactile</option>
                    <option value="clicky">Clicky</option>
                  </select>
                </div>
              )}
            </div>
          </>
        );
      case "keycaps":
        return (
          <>
            <div className="filter-section">
              <div
                className="filter-section-header"
                onClick={() => toggleSection("keycapProfile")}
              >
                <h3>Profil</h3>
                <span>{expandedSection === "keycapProfile" ? "−" : "+"}</span>
              </div>
              {expandedSection === "keycapProfile" && (
                <div className="filter-section-content">
                  <select
                    name="keycapProfile"
                    value={filters.keycapProfile}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous les profils</option>
                    <option value="OEM">OEM</option>
                    <option value="Cherry">Cherry</option>
                    <option value="SA">SA</option>
                    <option value="DSA">DSA</option>
                    <option value="XDA">XDA</option>
                    <option value="KAT">KAT</option>
                  </select>
                </div>
              )}
            </div>
            <div className="filter-section">
              <div
                className="filter-section-header"
                onClick={() => toggleSection("color")}
              >
                <h3>Couleur principale</h3>
                <span>{expandedSection === "color" ? "−" : "+"}</span>
              </div>
              {expandedSection === "color" && (
                <div className="filter-section-content color-filter">
                  <select
                    name="color"
                    value={filters.color}
                    onChange={handleFilterChange}
                  >
                    <option value="">Toutes les couleurs</option>
                    <option value="black">Noir</option>
                    <option value="white">Blanc</option>
                    <option value="gray">Gris</option>
                    <option value="blue">Bleu</option>
                    <option value="red">Rouge</option>
                    <option value="green">Vert</option>
                    <option value="yellow">Jaune</option>
                    <option value="pink">Rose</option>
                    <option value="purple">Violet</option>
                    <option value="orange">Orange</option>
                    <option value="multicolor">Multicolore</option>
                  </select>
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h2>
          <FaFilter /> Filtres
        </h2>
        <button className="filter-clear-all" onClick={clearFilters}>
          <FaTimes /> Tout effacer
        </button>
      </div>

      <div className="filter-section">
        <div
          className="filter-section-header"
          onClick={() => toggleSection("price")}
        >
          <h3>Prix</h3>
          <span>{expandedSection === "price" ? "−" : "+"}</span>
        </div>
        {expandedSection === "price" && (
          <div className="filter-section-content">
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="">Tous les prix</option>
              <option value="low">0 - 50€</option>
              <option value="medium">50€ - 100€</option>
              <option value="high">100€+</option>
            </select>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-section-header"
          onClick={() => toggleSection("brand")}
        >
          <h3>Marque</h3>
          <span>{expandedSection === "brand" ? "−" : "+"}</span>
        </div>
        {expandedSection === "brand" && (
          <div className="filter-section-content">
            <select
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">Toutes les marques</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div
          className="filter-section-header"
          onClick={() => toggleSection("availability")}
        >
          <h3>Disponibilité</h3>
          <span>{expandedSection === "availability" ? "−" : "+"}</span>
        </div>
        {expandedSection === "availability" && (
          <div className="filter-section-content">
            <select
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
            >
              <option value="">Tous</option>
              <option value="inStock">En stock</option>
              <option value="outOfStock">Rupture de stock</option>
            </select>
          </div>
        )}
      </div>

      {getCategorySpecificFilters()}

      <button className="apply-filters-button" onClick={applyFilters}>
        Appliquer les filtres
      </button>
    </div>
  );
};

export default Filter;
