const asyncHandler = require("express-async-handler");
const PromoCode = require("../models/PromoCode");

//@desc Create a new promo code (admin only)
//@route POST /api/promo
//@access private (admin)
const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discountPercentage, maxUses, expirationDate } = req.body;

  if (!code || !discountPercentage || !expirationDate) {
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
    discountPercentage: Number(discountPercentage),
    validUntil: new Date(expirationDate),
    usageLimit: maxUses || 100,
  });

  if (promoCode) {
    res.status(201).json(promoCode);
  } else {
    res.status(400);
    throw new Error("Données de code promo invalides");
  }
});

//@desc Get all promo codes (admin only)
//@route GET /api/promo
//@access private (admin)
const getAllPromoCodes = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
  res.status(200).json(promoCodes);
});

//@desc Delete a promo code (admin only)
//@route DELETE /api/promo/:id
//@access private (admin)
const deletePromoCode = asyncHandler(async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id);

  if (!promoCode) {
    res.status(404);
    throw new Error("Code promo non trouvé");
  }

  await PromoCode.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Code promo supprimé avec succès" });
});

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

  res.status(200).json({
    code: promoCode.code,
    discountPercentage: promoCode.discountPercentage,
    message: "Code promo appliqué avec succès",
  });
});

module.exports = {
  createPromoCode,
  applyPromoCode,
  getAllPromoCodes,
  deletePromoCode,
};
