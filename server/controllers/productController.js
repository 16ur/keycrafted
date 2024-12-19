const Product = require("../models/Product");

// @desc Get recently added products
// @route GET /api/products/recent
// @access Public
const getRecentProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des produits récents.",
    });
  }
};

module.exports = { getRecentProducts };
