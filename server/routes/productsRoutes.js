const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { getRecentProducts } = require("../controllers/productController");

router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/similar/:category/:id", async (req, res) => {
  const { category, id } = req.params;

  try {
    const similarProducts = await Product.find({
      category: category,
      _id: { $ne: id },
    }).limit(3);
    res.status(200).json(similarProducts);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits similaires :",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des produits similaires.",
    });
  }
});

router.get("/recent", getRecentProducts);

router.get("/brand/:brand", async (req, res) => {
  const { brand } = req.params;
  try {
    const products = await Product.find({ brand });
    res.status(200).json(products);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits par marque :",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ message: "Le paramètre de recherche est requis" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur lors de la recherche de produits :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
