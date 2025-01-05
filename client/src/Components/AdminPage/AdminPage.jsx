import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminPage.css";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
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
        }
      } catch (error) {
        toast.error("Erreur lors de la vérification de l'utilisateur.");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/products/categories"
        );
        setCategories(response.data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des catégories.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/admin/products",
        { name, price, brand, category, stock, imageUrl, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Produit ajouté avec succès !");
      setName("");
      setPrice("");
      setBrand("");
      setCategory("");
      setStock("");
      setImageUrl("");
      setDescription("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      toast.error("Erreur lors de l'ajout du produit.");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="admin-container">
        <h1>Ajouter un Produit</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom du produit</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Prix</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Marque</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Stock disponible</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>URL de l'image</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajoutez une description avec des sauts de ligne en utilisant 'Entrée'."
              rows={5}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Ajouter le produit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
