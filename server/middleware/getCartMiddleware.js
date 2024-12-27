const Cart = require("../models/Cart");

const getCartMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Votre panier est vide." });
    }
    req.cart = cart;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du panier." });
  }
};

module.exports = getCartMiddleware;
