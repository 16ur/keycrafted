import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier :", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/cart/add",
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCart(response.data);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/cart/remove/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCart(response.data);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8080/api/cart/clear",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCart(response.data); // état du panier
    } catch (error) {
      console.error("Erreur lors du vidage du panier :", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
