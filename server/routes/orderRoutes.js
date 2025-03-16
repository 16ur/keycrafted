const express = require("express");
const router = express.Router();
const validateTokenHandler = require("../middleware/validateTokenHandler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderConfirmationEmail } = require("../mailer");


router.post("/", validateTokenHandler, async (req, res) => {
  const {
    items,
    address,
    phoneNumber,
    fullName,
    email,
    additionalNotes,
    promoCode,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Le panier est vide." });
  }

  try {
    console.log("Début de la création de la commande");

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Produit non trouvé: ${item.productId}`);
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
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
      payment: {
        method: "card",
        status: "pending",
      },
      promoCode: promoCode,
    });

    await newOrder.save();

    try {
      await sendOrderConfirmationEmail(email, {
        orderId: newOrder._id,
        items: newOrder.items,
        total: 0,
        address,
        fullName,
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
    }

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

router.get("/all", validateTokenHandler, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const orders = await Order.find()
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.patch("/:id/status", validateTokenHandler, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/user/:userId", validateTokenHandler, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
