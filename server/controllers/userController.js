const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendWelcomeEmail } = require("../mailer");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Veuillez remplir tous les champs");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("Email déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const userRole = role || "user";

  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: userRole,
  });

  await user.save();

  sendWelcomeEmail(email, username);

  console.log(user);
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Log a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Veuillez remplir tous les champs");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({
      accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Current user
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur introuvable");
  }
  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
});

//@desc Get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur non trouvé");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    throw new Error("Erreur lors de la récupération du profil utilisateur");
  }
});

//@desc Update user profile
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("Utilisateur non trouvé");
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        res.status(400);
        throw new Error("Cet email est déjà utilisé");
      }
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.fullName = req.body.fullName || user.fullName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.postalCode = req.body.postalCode || user.postalCode;
    user.country = req.body.country || user.country;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      city: updatedUser.city,
      postalCode: updatedUser.postalCode,
      country: updatedUser.country,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Erreur lors de la mise à jour du profil");
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getUserProfile,
  updateUserProfile,
};
