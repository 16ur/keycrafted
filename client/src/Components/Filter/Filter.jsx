import { useState } from "react";
import "./Filter.css";
import FilterIcon from "../../assets/filterIcon.svg?react";

const Filter = ({ onApplyFilters }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    availability: "",
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    setIsDropdownOpen(false);
  };

  return (
    <div className="filter-container">
      <button className="filter-button" onClick={toggleDropdown}>
        <FilterIcon className="icon" width="24px" height="24px" />
        Filtres
      </button>

      {isDropdownOpen && (
        <div className="filter-dropdown">
          <div className="filter-option">
            <label htmlFor="priceRange">Prix :</label>
            <select
              id="priceRange"
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

          <div className="filter-option">
            <label htmlFor="availability">Disponibilité :</label>
            <select
              id="availability"
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
            >
              <option value="">Tous</option>
              <option value="inStock">En stock</option>
              <option value="outOfStock">Rupture de stock</option>
            </select>
          </div>

          <button className="apply-filters-button" onClick={applyFilters}>
            Appliquer
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;
