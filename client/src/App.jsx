import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar.jsx";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/products");
    setArray(response.data.products);
    console.log(response.data.products);
  };

  useEffect(() => {
    fetchAPI();
  });

  return (
    <>
      <Navbar />
      {array.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.stock}</p>
          <p>Category: {product.category}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </>
  );
  <Navbar />;
}

export default App;
