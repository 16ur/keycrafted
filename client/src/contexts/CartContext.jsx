// Ajoutez la fonction getTotalItems et assurez-vous qu'elle est exportée dans le contexte

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState(null);

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
      fetchCart();
      toast.success("Produit ajouté au panier");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCart();
      toast.success("Produit supprimé du panier");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du produit du panier :",
        error
      );
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:8080/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart({ items: [] });
      toast.success("Panier vidé !");
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
      toast.error(
        "Une erreur est survenue lors de la suppression de votre panier."
      );
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/cart/update-quantity`,
        { itemId, quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCart();
      toast.success("Quantité mise à jour !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la quantité :", err);
      toast.error("Impossible de mettre à jour la quantité.");
    }
  };

  const getTotalItems = () => {
    if (!cart || !cart.items) {
      return 0;
    }
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const applyPromoCode = async (code) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/promo/apply",
        { code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPromoCode(response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Erreur lors de l'application du code promo:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erreur lors de l'application du code promo",
      };
    } finally {
      setLoading(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
  };

  // Calculer les prix avec la réduction
  const calculatePrices = () => {
    const subtotal =
      cart?.items?.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
      ) || 0;

    let discount = 0;
    if (promoCode) {
      discount = (subtotal * promoCode.discountPercentage) / 100;
    }

    const discountedSubtotal = subtotal - discount;
    const taxes = discountedSubtotal * 0.2;
    const finalPrice = discountedSubtotal + taxes;

    return {
      subtotal,
      discount,
      discountedSubtotal,
      taxes,
      finalPrice,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        promoCode,
        applyPromoCode,
        removePromoCode,
        calculatePrices,
        getTotalItems, // Assurez-vous d'exporter cette fonction
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
