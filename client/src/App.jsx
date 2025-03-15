import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import Footer from "./Components/Footer/Footer.jsx";
import CheckoutPage from "./Components/CheckoutPage/CheckoutPage.jsx";
import ConfirmationPage from "./Components/ConfirmationPage/ConfirmationPage.jsx";
import UserOrders from "./Components/UserOrders/UserOrders.jsx";
import AboutUs from "./Components/AboutUs/AboutUs.jsx";
import BrandPage from "./Components/BrandPage/BrandPage.jsx";
import AdminOrders from "./Components/AdminOrders/AdminOrders.jsx";
import UserOrdersAdmin from "./Components/UserOrdersAdmin/UserOrdersAdmin.jsx";
import SearchResults from "./Components/SearchResults/SearchResults";
import UserProfile from "./Components/UserProfile/UserProfile";
import AdminPromo from "./Components/AdminPromo/AdminPromo";

import axios from "axios";

function App() {
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
    <div id="app-container">
      <CartProvider>
        <Router>
          <div className="main-content">
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
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route
                path="/admin/user/:userId/orders"
                element={<UserOrdersAdmin />}
              />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/user/orders" element={<UserOrders />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/brand/:brand" element={<BrandPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/admin/promo-codes" element={<AdminPromo />} />
            </Routes>
          </div>
          <ConditionalFooter />
        </Router>
      </CartProvider>
    </div>
  );
}

const ConditionalFooter = () => {
  const location = useLocation();
  const noFooterRoutes = ["/auth/user/login", "/auth/user/register"];
  return !noFooterRoutes.includes(location.pathname) ? <Footer /> : null;
};

export default App;
