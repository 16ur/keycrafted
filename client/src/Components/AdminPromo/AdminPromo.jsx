import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import "./AdminPromo.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const AdminPromo = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    maxUses: "",
    expirationDate: "",
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/user/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/users/current",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.role !== "admin") {
          toast.error("Vous n'êtes pas autorisé à accéder à cette page.");
          navigate("/");
        } else {
          setIsAdmin(true);
          fetchPromoCodes();
        }
      } catch (error) {
        toast.error("Erreur lors de la vérification de l'utilisateur.");
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchPromoCodes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/promo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPromoCodes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des codes promo:", error);
      toast.error("Erreur lors de la récupération des codes promo.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.code ||
      !formData.discountPercentage ||
      !formData.expirationDate
    ) {
      toast.error("Tous les champs obligatoires doivent être remplis");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Envoi des données:", formData);

      await axios.post("http://localhost:8080/api/promo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Code promo créé avec succès!");
      setFormData({
        code: "",
        discountPercentage: "",
        maxUses: "",
        expirationDate: "",
      });
      setShowForm(false);
      fetchPromoCodes();
    } catch (error) {
      console.error("Erreur lors de la création du code promo:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la création du code promo."
      );
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce code promo ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/promo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Code promo supprimé avec succès!");
      fetchPromoCodes();
    } catch (error) {
      console.error("Erreur lors de la suppression du code promo:", error);
      toast.error("Erreur lors de la suppression du code promo.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (!isAdmin) return null;

  return (
    <div>
      <Navbar />
      <div className="admin-promo-container">
        <ToastContainer position="top-right" />
        <h1>Gestion des codes promotionnels</h1>

        <div className="admin-actions">
          <button
            className="add-promo-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              "Annuler"
            ) : (
              <>
                <FaPlus /> Créer un nouveau code
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="promo-form-container">
            <h2>Créer un nouveau code promo</h2>
            <form onSubmit={handleSubmit} className="promo-form">
              <div className="form-group">
                <label>
                  Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="ex: SUMMER2023"
                />
              </div>

              <div className="form-group">
                <label>
                  Pourcentage de réduction <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  required
                  min="1"
                  max="100"
                  placeholder="ex: 10"
                />
              </div>

              <div className="form-group">
                <label>Nombre maximum d'utilisations</label>
                <input
                  type="number"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  min="1"
                  placeholder="ex: 100"
                />
                <small className="form-info">Par défaut: 100</small>
              </div>

              <div className="form-group">
                <label>
                  Date d'expiration <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <button type="submit" className="submit-button">
                Créer le code promo
              </button>
            </form>
          </div>
        )}

        <div className="promo-codes-list">
          <h2>Codes promo existants</h2>

          {loading ? (
            <p>Chargement des codes promo...</p>
          ) : promoCodes.length > 0 ? (
            <table className="promo-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Réduction</th>
                  <th>Utilisations</th>
                  <th>Max. utilisations</th>
                  <th>Date d'expiration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((promo) => (
                  <tr key={promo._id}>
                    <td>{promo.code}</td>
                    <td>{promo.discountPercentage}%</td>
                    <td>{promo.usageCount}</td>
                    <td>{promo.usageLimit}</td>
                    <td>{formatDate(promo.validUntil)}</td>
                    <td className="actions-cell">
                      <button
                        className="delete-button"
                        title="Supprimer"
                        onClick={() => handleDeletePromo(promo._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-promos">Aucun code promo disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPromo;
