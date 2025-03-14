const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel.js");
require("dotenv").config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email non trouvé." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Envoyer l'email
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    await transporter.sendMail(
      {
        to: user.email,
        subject: "Réinitialisation du mot de passe",
        html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien : <a href="${resetLink}">${resetLink}</a></p>`,
      },
      (error, info) => {
        if (error) {
          console.error("Erreur lors de l'envoi de l'email :", error);
          return res
            .status(500)
            .json({ message: "Erreur lors de l'envoi de l'email." });
        } else {
          console.log("Email envoyé :", info.response);
          return res.json({ message: "Email de réinitialisation envoyé." });
        }
      }
    );

    res.json({ message: "Email de réinitialisation envoyé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
