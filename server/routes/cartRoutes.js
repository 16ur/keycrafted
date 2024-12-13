const express = require("express");
const router = express.Router();
const validateTokenHandler = require("../middleware/validateTokenHandler");
const Cart = require("../models/Cart");

// Route pour ajouter un produit au panier
router.post("/add", validateTokenHandler, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur depuis le token

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Si l'utilisateur n'a pas de panier, on le crée
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // Si le panier existe, on ajoute ou met à jour le produit
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Si le produit est déjà dans le panier, on met à jour la quantité
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Sinon, on ajoute le produit au panier
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Produit ajouté au panier", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", validateTokenHandler, async (req, res) => {
  const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId"); // Utilisez populate pour inclure les détails des produits
    if (!cart) {
      return res.status(404).json({ message: "Panier vide" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
