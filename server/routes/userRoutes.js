const express = require("express");
const Product = require("../models/Product");
const {
  registerUser,
  loginUser,
  currentUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const router = express.Router();
const User = require("../models/userModel");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateTokenHandler, currentUser);
router.get("/profile", validateTokenHandler, getUserProfile);
router.put("/profile", validateTokenHandler, updateUserProfile);

router.post("/products", async (req, res) => {
  const { name, price, brand, category, stock, description, imageUrl } =
    req.body;
  try {
    const product = new Product({
      name,
      price,
      brand,
      category,
      stock,
      description,
      imageUrl,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/products/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/all", validateTokenHandler, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:userId", validateTokenHandler, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user._id.toString() === req.user.id && user.role === "admin") {
      return res.status(400).json({
        message: "Vous ne pouvez pas supprimer votre propre compte admin",
      });
    }

    await User.findByIdAndDelete(userId);

    await Cart.deleteMany({ userId });

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:userId", validateTokenHandler, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { userId } = req.params;
    const {
      username,
      email,
      fullName,
      phoneNumber,
      address,
      city,
      postalCode,
      country,
      role,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (city) user.city = city;
    if (postalCode) user.postalCode = postalCode;
    if (country) user.country = country;
    if (role && (role === "user" || role === "admin")) user.role = role;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      city: updatedUser.city,
      postalCode: updatedUser.postalCode,
      country: updatedUser.country,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
