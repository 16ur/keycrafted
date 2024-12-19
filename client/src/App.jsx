import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar.jsx";
import LoginPage from "./Components/LoginPage/LoginPage.jsx";
import RegisterPage from "./Components/RegisterPage/RegisterPage.jsx";
import CorePage from "./Components/CorePage/CorePage.jsx";
import UserAccount from "./Components/UserAccount/UserAccount.jsx";
import ProductsPage from "./Components/ProductsPage/ProductsPage.jsx";
import ProductDetails from "./Components/ProductDetails/ProductDetails.jsx";
import CartPage from "./Components/CartPage/CartPage.jsx";
import AdminPage from "./Components/AdminPage/AdminPage.jsx";

import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setArray(response.data.products);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <>
      <CartProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<CorePage />} />
              <Route path="/auth/user/register" element={<RegisterPage />} />
              <Route path="/auth/user/login" element={<LoginPage />} />
              <Route path="/user/account" element={<UserAccount />} />
              <Route path="/products/:category" element={<ProductsPage />} />
              <Route
                path="/products/:category/:id"
                element={<ProductDetails />}
              />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
