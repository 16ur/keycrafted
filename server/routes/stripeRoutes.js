const express = require("express");
const router = express.Router();
const validateTokenHandler = require("../middleware/validateTokenHandler");
const stripe = require("../stripe");
const Order = require("../models/Order");

router.post(
  "/create-payment-intent",
  validateTokenHandler,
  async (req, res) => {
    try {
      const { amount, orderId } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        userId: req.user.id,
      });

      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), 
        currency: "eur",
        metadata: {
          orderId: orderId,
          userId: req.user.id,
        },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'intention de paiement:",
        error
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Erreur de signature webhook: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      try {
        const order = await Order.findById(orderId);
        if (order) {
          order.payment = {
            method: "card",
            status: "completed",
            transactionId: paymentIntent.id,
            paidAt: new Date(),
          };
          await order.save();
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la commande:", error);
      }
    }

    res.json({ received: true });
  }
);

router.post(
  "/create-payment-intent",
  validateTokenHandler,
  async (req, res) => {
    try {
      const { amount, orderId } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        userId: req.user.id,
      });

      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }

      if (order.payment && order.payment.stripePaymentIntentId) {
        try {
          const existingIntent = await stripe.paymentIntents.retrieve(
            order.payment.stripePaymentIntentId
          );

          if (
            existingIntent &&
            existingIntent.status !== "canceled" &&
            existingIntent.status !== "failed"
          ) {
            return res.status(200).json({
              clientSecret: existingIntent.client_secret,
            });
          }
        } catch (err) {
          console.log(
            "L'intention de paiement précédente n'existe plus ou est invalide"
          );
        }
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), 
        currency: "eur",
        metadata: {
          orderId: orderId,
          userId: req.user.id,
        },
      });

      order.payment.stripePaymentIntentId = paymentIntent.id;
      await order.save();

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'intention de paiement:",
        error
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

module.exports = router;
