const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Veuillez ajouter votre nom d'utilisateur"],
    },
    email: {
      type: String,
      required: [true, "Veuillez ajouter votre email"],
      unique: [true, "Cet email est déjà utilisé"],
    },
    password: {
      type: String,
      required: [true, "Veuillez ajouter un mot de passe"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    fullName: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "France",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
