const express = require("express");
const router = express.Router();
const validateTokenHandler = require("../middleware/validateTokenHandler");
const Order = require("../models/Order");

router.post("/", validateTokenHandler, async (req, res) => {
  const { items, address, phoneNumber, fullName, email, additionalNotes } =
    req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Le panier est vide." });
  }

  try {
    const newOrder = new Order({
      userId: req.user.id,
      items,
      address,
      phoneNumber,
      fullName,
      email,
      additionalNotes,
      status: "pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Commande créée avec succès.", order: newOrder });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

module.exports = router;
