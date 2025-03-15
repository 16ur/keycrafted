const express = require("express");
const {
  createPromoCode,
  applyPromoCode,
  getAllPromoCodes,
} = require("../controllers/promoCodeController");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(validateTokenHandler);
router.post("/", adminMiddleware, createPromoCode);
router.get("/", adminMiddleware, getAllPromoCodes);

router.post("/apply", applyPromoCode);

module.exports = router;
