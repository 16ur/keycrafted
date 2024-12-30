import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>KeyCrafted</h2>
          <p>
            Découvrez le meilleur des claviers mécaniques et des accessoires de
            qualité.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Liens Utiles</h3>
          <ul>
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/user/account">Votre profil</a>
            </li>
          </ul>
        </div>

        <div className="footer-section social"></div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 KeyCrafted | Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
