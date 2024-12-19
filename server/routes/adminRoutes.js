const express = require("express");
const router = express.Router();
const validateTokenHandler = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");
const Product = require("../models/Product");

router.post("/products", validateTokenHandler, async (req, res) => {
  const { name, price, brand, category, stock, imageUrl } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      brand,
      category,
      stock,
      imageUrl,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Produit ajouté avec succès", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'ajout du produit." });
  }
});

module.exports = router;
