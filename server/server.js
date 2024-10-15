const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
};

mongoose.connect("mongodb://localhost:27017/smtp_bd", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors(corsOptions));

const Product = require("./models/Product");

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json({ products });
});

app.use(express.json()); // Pour traiter les données JSON envoyées dans les requêtes POST

// Route POST pour ajouter un nouveau produit
app.post("/api/products", async (req, res) => {
  const { name, price, category, stock, description, imageUrl } = req.body;

  // Créer un nouveau produit
  const newProduct = new Product({
    name,
    price,
    category,
    stock,
    description,
    imageUrl,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
