const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Entrez un nom d'utilisateur"],
      unique: [true, "Ce nom d'utilisateur est déjà utilisé"],
    },
    email: {
      type: String,
      required: [true, "Entrez une adresse email"],
      unique: [true, "Cette adresse email est déjà utilisée"],
    },
    password: {
      type: String,
      required: [true, "Entrez un mot de passe"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
