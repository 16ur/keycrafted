import React from "react";
import Navbar from "../Navbar/Navbar";
import "./AboutUs.css";
import Ceo from "../../assets/TeamMembers/CEO.jpg";
import JohnDoe from "../../assets/TeamMembers/JohnDoe_2.jpg";
import JonnaDoe from "../../assets/TeamMembers/JonnaDoe.jpg";
import Quality from "../../assets/Illustrations/quality.png";
import Innovation from "../../assets/Illustrations/innovation.png";
import Client from "../../assets/Illustrations/client.png";
import OurMissions from "../../assets/Illustrations/our_missions.png";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className="about-us-container">
        <section className="hero-section">
          <h1>Qui sommes-nous ?</h1>
          <p>
            Bienvenue chez <strong>KeyCrafted</strong>, votre destination
            principale pour trouver tout ce dont vous avez besoin pour réaliser
            le clavier qui vous correspond ! 🎉
          </p>
        </section>

        <section className="mission-section">
          <div className="mission-content">
            <h2>Notre Mission</h2>
            <p>
              Nous croyons que chaque utilisateur mérite une expérience unique
              lorsqu'il interagit avec son clavier. <br /> Qu'il soit débutant
              ou expert, nous accompagnerons chaque utilisateur dans la création
              de son clavier idéal. 🌟
            </p>
          </div>
          <img src={OurMissions} alt="Mission illustration" />
        </section>

        <section className="values-section">
          <h2>Nos Valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <img src={Quality} alt="Qualité" />
              <h3>Qualité</h3>
              <p>
                Nous garantissons des produits de qualités pour répondre aux
                attentes de nos clients.
              </p>
            </div>
            <div className="value-card">
              <img src={Innovation} alt="Innovation" />
              <h3>Innovation</h3>
              <p>
                Nous intégrons les dernières technologies pour améliorer votre
                expérience utilisateur à travers le site.
              </p>
            </div>
            <div className="value-card">
              <img src={Client} alt="Client" />
              <h3>Client</h3>
              <p>
                La satisfaction client est au cœur de toutes nos décisions et
                actions.
              </p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Notre Équipe</h2>
          <div className="team-grid">
            <div className="team-card">
              <img src={JohnDoe} alt="Team member" />
              <h3>John Doe</h3>
              <p>Responsable commande</p>
            </div>
            <div className="team-card">
              <img src={Ceo} alt="Team member" />
              <h3>Axel Manguian</h3>
              <p>Fondateur et CEO</p>
            </div>
            <div className="team-card">
              <img src={JonnaDoe} alt="Team member" />
              <h3>Jonna Doe</h3>
              <p>Comptable</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
