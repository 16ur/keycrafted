const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const validateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ message: "Accès interdit : Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.email !== "axel@admin.fr") {
      return res
        .status(403)
        .json({ message: "Accès interdit : Vous n'êtes pas administrateur." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = validateAdmin;
