import "./Filter.css";
import FilterIcon from "../../assets/filterIcon.svg?react";


const Filter = () => {
  return (
    <>
      <div className="filter-container">
        <button className="filter-button">
        <FilterIcon className="icon" width="24px" height="24px" />
        Filtres
        </button>
      </div>
    </>
  );
};

export default Filter;
