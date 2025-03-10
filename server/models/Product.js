const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Unnamed Product" },
  price: { type: Number, required: true },
  brand: { type: String, default: "No brand" },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
