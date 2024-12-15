const express = require("express");
const router = express.Router();
const validateTokenHandler = require("../middleware/validateTokenHandler");
const Cart = require("../models/Cart");

router.post("/add", validateTokenHandler, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Produit ajouté au panier", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/clear", validateTokenHandler, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOneAndDelete({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Panier introuvable pour cet utilisateur." });
    }

    res
      .status(200)
      .json({ message: "Votre panier a été supprimé avec succès." });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du panier.",
      error: error.message,
    });
  }
});

router.delete("/remove/:itemId", validateTokenHandler, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Panier introuvable pour cet utilisateur." });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.status(200).json({ message: "Produit supprimé du panier", cart });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du produit du panier.",
      error: error.message,
    });
  }
});

router.get("/", validateTokenHandler, async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Panier vide" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
