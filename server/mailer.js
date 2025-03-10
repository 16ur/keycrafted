const nodemailer = require("nodemailer");
require("dotenv").config();

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

const sendWelcomeEmail = (to, username) => {
  const mailOptions = {
    from: `"KeyCrafted" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Bienvenue chez KeyCrafted !",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; padding: 10px 0;">
            <img src="http://localhost:5173/kc_logo.png" alt="KeyCrafted Logo" width="150">
          </div>
          <h2 style="color: #333; text-align: center;">Bienvenue, ${username} !</h2>
          <p style="color: #555; font-size: 16px; text-align: center;">
            Merci de vous être inscrit chez <strong>KeyCrafted</strong>. Nous sommes ravis de vous accueillir dans notre communauté !
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://axelmanguian.fr" style="background: #007bff; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block;">
              Découvrez KeyCrafted 🚀
            </a>
          </div>
          <p style="color: #777; font-size: 14px; text-align: center;">
            À bientôt,<br>
            L'équipe <strong>KeyCrafted</strong>
          </p>
        </div>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
    } else {
      console.log("Email envoyé :", info.response);
    }
  });
};

const sendOrderConfirmationEmail = (to, order) => {
  const itemsList = order.items
    .map(
      (item) => `
      <li>
        ${item.productId.name} - ${
        item.quantity
      } x €${item.productId.price.toFixed(2)}
      </li>
    `
    )
    .join("");

  const mailOptions = {
    from: `"KeyCrafted" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Confirmation de votre commande KeyCrafted",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; padding: 10px 0;">
          <img src="http://localhost:5173/kc_logo.png" alt="KeyCrafted Logo" width="150">
        </div>
        <h2 style="color: #333; text-align: center;">Merci pour votre commande, ${
          order.fullName
        } !</h2>
        <p style="color: #555; font-size: 16px; text-align: center;">
          Votre commande a été enregistrée avec succès. Voici les détails de votre commande :
        </p>
        <ul style="color: #555; font-size: 16px;">
          ${itemsList}
        </ul>
        <p style="color: #555; font-size: 16px;">
          <strong>Total :</strong> €${order.items
            .reduce(
              (acc, item) => acc + item.quantity * item.productId.price,
              0
            )
            .toFixed(2)}
        </p>
        <p style="color: #777; font-size: 14px; text-align: center;">
          À bientôt,<br>
          L'équipe <strong>KeyCrafted</strong>
        </p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
    } else {
      console.log("Email envoyé :", info.response);
    }
  });
};

module.exports = { sendWelcomeEmail, sendOrderConfirmationEmail };
