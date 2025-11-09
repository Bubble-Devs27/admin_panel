import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import axios from 'axios';
import { FiTrash } from "react-icons/fi";

const AddPackage = () => {
  const navigate = useNavigate();
  const baseURL = useAuth((s)=>s.baseURL);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState([""]);

  const handleAddLine = () => {
    if (description.length < 5) {
      setDescription([...description, ""]);
    }
  };

  const handleDeleteLine = (index) => {
    const updated = description.filter((_, i) => i !== index);
    setDescription(updated);
  };

  const handleDescriptionChange = (value, index) => {
    const updated = [...description];
    updated[index] = value;
    setDescription(updated);
  };

  const handleAddPackage = async () => {
    try {
      await axios.post(`${baseURL}/add-package`, {
        name,
        price,
        description
      });

      alert("Package Added Successfully!");
      navigate(-1);
    } catch (err) {
      console.log("Error adding package:", err);
      alert("Error adding package");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={title}>Add New Package</h2>

        <label style={label}>Name</label>
        <input
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={label}>Price</label>
        <input
          style={input}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label style={label}>Description</label>
        {description.map((line, index) => (
          <div key={index} style={descRow}>
            <input
              style={{ ...input, flex: 1 }}
              value={line}
              onChange={(e) => handleDescriptionChange(e.target.value, index)}
            />
            {description.length > 1 && (
              <button style={trashBtn} onClick={() => handleDeleteLine(index)}>
                <FiTrash size={18}/>
              </button>
            )}
          </div>
        ))}

        {description.length < 5 && (
          <button style={addLineBtn} onClick={handleAddLine}>
            + Add Line
          </button>
        )}

        <div style={footer}>
          <button style={saveBtn} onClick={handleAddPackage}>
            Add
          </button>
          <button style={backBtn} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusing same styles as ViewPackage
const pageWrapper = {
  width: "100vw",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8f9fa"
};

const card = {
  width: "100%",
  maxWidth: "600px",
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
  color: "#222"
};

const title = {
  marginBottom: "20px",
  fontSize: "22px",
  fontWeight: "600",
  color: "#111"
};

const label = {
  fontSize: "14px",
  fontWeight: 500,
  marginBottom: "6px",
  display: "block",
  color: "#333"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "#ffffff",
  color: "#111",
  fontSize: "14px"
};

const descRow = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px"
};

const trashBtn = {
  background: "transparent",
  border: "none",
  marginLeft: "8px",
  cursor: "pointer",
  color: "#d9534f"
};

const addLineBtn = {
  background: "#28a745",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  marginTop: "8px"
};

const footer = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "30px"
};

const saveBtn = {
  background: "#007bff",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px"
};

const backBtn = {
  background: "#6c757d",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px"
};

export default AddPackage;
