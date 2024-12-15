import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCart({ items: [] });
      } else {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/cart/add",
        { productId: product._id, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCart(response.data);
      setIsAdded(true);
      console.log("Produit ajouté au panier");
      fetchCart();
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
      fetchCart();
      console.log("Produit supprimé du panier");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du produit du panier :",
        error
      );
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
      setCart({ items: [] });
      alert(response.data.message);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
      alert("Une erreur est survenue lors de la suppression de votre panier.");
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
