import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaCity,
  FaMapPin,
  FaGlobe,
  FaArrowLeft,
} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/user/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
          fullName: response.data.fullName || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
          city: response.data.city || "",
          postalCode: response.data.postalCode || "",
          country: response.data.country || "France",
          password: "",
          confirmPassword: "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        toast.error("Impossible de récupérer vos informations de profil.");
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      if (formData.confirmPassword && formData.password !== value) {
        setPasswordError("Les mots de passe ne correspondent pas");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      country: user.country || "France",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) delete dataToUpdate.password;
      delete dataToUpdate.confirmPassword;

      const response = await axios.put(
        "http://localhost:8080/api/users/profile",
        dataToUpdate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès!");

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du profil"
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" />
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-left">
            <button
              className="return-button"
              onClick={() => navigate("/user/account")}
              aria-label="Retour au compte"
            >
              <FaArrowLeft /> <span>Retour</span>
            </button>
            <h1>Mon Profil</h1>
          </div>
          {!isEditing && (
            <button className="edit-button" onClick={handleEditClick}>
              Modifier mon profil
            </button>
          )}
        </div>

        <div className="profile-content">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Informations personnelles</h2>
              <div className="form-group">
                <label>
                  <FaUser /> Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <FaUser /> Nom complet
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Votre nom complet"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaPhone /> Téléphone
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Votre numéro de téléphone"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Adresse de livraison</h2>
              <div className="form-group">
                <label>
                  <FaMapMarkerAlt /> Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Votre adresse"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaCity /> Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Votre ville"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaMapPin /> Code postal
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Votre code postal"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaGlobe /> Pays
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-section">
                <h2>Changer le mot de passe</h2>
                <div className="form-group">
                  <label>
                    <FaLock /> Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Laisser vide pour ne pas modifier"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaLock /> Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  {passwordError && (
                    <p className="error-text">{passwordError}</p>
                  )}
                </div>
              </div>
            )}

            {isEditing && (
              <div className="form-buttons">
                <button type="submit" className="save-button">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelClick}
                >
                  Annuler
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
