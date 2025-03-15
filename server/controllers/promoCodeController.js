const asyncHandler = require("express-async-handler");
const PromoCode = require("../models/PromoCode");

//@desc Create a new promo code (admin only)
//@route POST /api/promo
//@access private (admin)
const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discountPercentage, validUntil, usageLimit } = req.body;

  if (!code || !discountPercentage || !validUntil) {
    res.status(400);
    throw new Error("Veuillez fournir tous les champs requis");
  }

  const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
  if (existingCode) {
    res.status(400);
    throw new Error("Ce code promo existe déjà");
  }

  const promoCode = await PromoCode.create({
    code: code.toUpperCase(),
    discountPercentage,
    validUntil: new Date(validUntil),
    usageLimit: usageLimit || 100,
  });

  if (promoCode) {
    res.status(201).json(promoCode);
  } else {
    res.status(400);
    throw new Error("Données de code promo invalides");
  }
});

//@desc Verify and apply a promo code
//@route POST /api/promo/apply
//@access public
const applyPromoCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Veuillez fournir un code promo");
  }

  const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

  if (!promoCode) {
    res.status(404);
    throw new Error("Code promo invalide");
  }

  if (!promoCode.isActive) {
    res.status(400);
    throw new Error("Ce code promo n'est plus actif");
  }

  if (new Date() > promoCode.validUntil) {
    res.status(400);
    throw new Error("Ce code promo a expiré");
  }

  if (promoCode.usageCount >= promoCode.usageLimit) {
    res.status(400);
    throw new Error("Ce code promo a atteint sa limite d'utilisation");
  }

  promoCode.usageCount += 1;
  await promoCode.save();

  res.status(200).json({
    code: promoCode.code,
    discountPercentage: promoCode.discountPercentage,
    message: "Code promo appliqué avec succès",
  });
});

//@desc Get all promo codes (admin only)
//@route GET /api/promo
//@access private (admin)
const getAllPromoCodes = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
  res.status(200).json(promoCodes);
});

module.exports = {
  createPromoCode,
  applyPromoCode,
  getAllPromoCodes,
};
