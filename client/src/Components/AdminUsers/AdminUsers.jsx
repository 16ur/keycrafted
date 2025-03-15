import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";
import "./AdminUsers.css";
import {
  FaUserEdit,
  FaTrash,
  FaSearch,
  FaUserShield,
  FaUser,
} from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    role: "",
  });

  const navigate = useNavigate();

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
          navigate("/");
          return;
        }

        fetchUsers();
      } catch (err) {
        setError("Erreur lors de la vérification des droits d'administration");
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    const filtered = users.filter((user) => {
      if (searchFilter === "all") {
        return (
          user.username.toLowerCase().includes(lowerCaseSearch) ||
          user.email.toLowerCase().includes(lowerCaseSearch) ||
          (user.fullName &&
            user.fullName.toLowerCase().includes(lowerCaseSearch))
        );
      }

      if (searchFilter === "username") {
        return user.username.toLowerCase().includes(lowerCaseSearch);
      }

      if (searchFilter === "email") {
        return user.email.toLowerCase().includes(lowerCaseSearch);
      }

      if (searchFilter === "fullName") {
        return (
          user.fullName && user.fullName.toLowerCase().includes(lowerCaseSearch)
        );
      }

      return false;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, searchFilter, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      setError("Erreur lors de la récupération des utilisateurs");
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur ${username} ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`Utilisateur ${username} supprimé avec succès`);
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de la suppression de l'utilisateur"
      );
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      country: user.country || "",
      role: user.role || "user",
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/users/${currentUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Utilisateur ${formData.username} mis à jour avec succès`);
      setIsEditing(false);
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour de l'utilisateur"
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchFilter("all");
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const viewUserOrders = (userId, username) => {
    navigate(`/admin/user/${userId}/orders`, {
      state: {
        userName: username,
      },
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="admin-users-container">
          <h2>Chargement des utilisateurs...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="admin-users-container">
          <h2>Erreur</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-users-container">
        <h1>Gestion des Utilisateurs</h1>
        <ToastContainer position="top-right" />

        <div className="search-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <select
              value={searchFilter}
              onChange={handleFilterChange}
              className="search-filter"
            >
              <option value="all">Tous les champs</option>
              <option value="username">Nom d'utilisateur</option>
              <option value="email">Email</option>
              <option value="fullName">Nom complet</option>
            </select>
            {searchTerm && (
              <button className="clear-search-btn" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="search-results">
              <span className="results-count">
                {filteredUsers.length} utilisateur(s) trouvé(s)
              </span>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="edit-user-form">
            <h2>Modifier l'utilisateur</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Code Postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Pays</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rôle</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelEdit}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="users-list">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Nom complet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={user.role === "admin" ? "admin-user" : ""}
                  >
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === "admin" ? (
                        <span className="user-role admin">
                          <FaUserShield /> Admin
                        </span>
                      ) : (
                        <span className="user-role user">
                          <FaUser /> Utilisateur
                        </span>
                      )}
                    </td>
                    <td>{user.fullName || "-"}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEditUser(user)}
                        title="Modifier l'utilisateur"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        className="view-orders-button"
                        onClick={() => viewUserOrders(user._id, user.username)}
                        title="Voir les commandes"
                      >
                        📦
                      </button>
                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteUser(user._id, user.username)
                        }
                        title="Supprimer l'utilisateur"
                        disabled={user.role === "admin"}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="users-summary">
          <div className="summary-card">
            <h3>Total des utilisateurs</h3>
            <p className="summary-number">{users.length}</p>
          </div>
          <div className="summary-card">
            <h3>Administrateurs</h3>
            <p className="summary-number">
              {users.filter((user) => user.role === "admin").length}
            </p>
          </div>
          <div className="summary-card">
            <h3>Utilisateurs standards</h3>
            <p className="summary-number">
              {users.filter((user) => user.role === "user").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
