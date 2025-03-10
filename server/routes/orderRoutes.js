const express = require("express");
const router = express.Router();
const validateTokenHandler = require("../middleware/validateTokenHandler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderConfirmationEmail } = require("../mailer");

router.post("/", validateTokenHandler, async (req, res) => {
  const { items, address, phoneNumber, fullName, email, additionalNotes } =
    req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Le panier est vide." });
  }

  try {
    // Peupler les produits dans les items
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item,
          productId: product,
        };
      })
    );

    const newOrder = new Order({
      userId: req.user.id,
      items: populatedItems,
      address,
      phoneNumber,
      fullName,
      email,
      additionalNotes,
      status: "pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    sendOrderConfirmationEmail(email, newOrder);
    res
      .status(201)
      .json({ message: "Commande créée avec succès.", order: newOrder });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

router.get("/user-orders", validateTokenHandler, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).populate("items.productId");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

module.exports = router;
