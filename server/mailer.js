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
            <img src="http://localhost:5173/public/kc_logo.png" alt="KeyCrafted Logo" width="150">
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

module.exports = { sendWelcomeEmail };
