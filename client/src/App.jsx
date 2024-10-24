import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar.jsx";
import LoginPage from "./Components/LoginPage/LoginPage.jsx";
import RegisterPage from "./Components/RegisterPage/RegisterPage.jsx";
import AuthPage from "./Components/AuthPage/AuthPage.jsx";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  // Fonction pour récupérer les produits de l'API
  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setArray(response.data.products);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits", error);
    }
  };

  // useEffect pour appeler fetchAPI seulement une fois lors du premier rendu
  useEffect(() => {
    fetchAPI();
  }, []); // [] empêche l'appel répété à chaque rendu

  return (
    <>
      {/* Exemple pour afficher les produits récupérés */}
      {/* {array.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.stock}</p>
          <p>Category: {product.category}</p>
          <p>{product.description}</p>
        </div>
      ))} */}

      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/auth/user" element={<AuthPage />} />
            <Route path="/auth/user/register" element={<RegisterPage />} />
            <Route path="/auth/user/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
