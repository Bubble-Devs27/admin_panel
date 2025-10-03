import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function WhyUsCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imgOk, setImgOk] = useState(true);
 const baseURL = useAuth((s)=>s.baseURL)
  const canAdd = title.trim().length > 0 && image.trim().length > 0 && imgOk;

  const onAdd = async() => {
    // If you want to POST later, do it here, then navigate.
    try {
        if(!title || !image){
            return alert("Please fill all details")
        }
        const response = await axios.post(`${baseURL}/add-whyus`, {title : title , image : image})
        if(response.status == 200){
            alert(response.data.message)
            navigate("/home");
        }
        else {alert(response.data.message)}
    }
    catch(err){
        console.log("Internal server error")
    }
    
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add “Why Us”</h2>

        <div style={styles.field}>
          <label htmlFor="title" style={styles.label}>Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a short title"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="image" style={styles.label}>Image Link</label>
          <input
            id="image"
            type="url"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              setImgOk(true); // reset validity on change
            }}
            placeholder="https://example.com/image.jpg"
            style={styles.input}
          />
          {image.trim() ? (
            <div style={styles.previewWrap}>
              <div style={styles.previewHeader}>
                <span style={styles.previewLabel}>Preview</span>
                {!imgOk && (
                  <span style={styles.previewError}>Couldn't load image</span>
                )}
              </div>
              <div style={styles.previewBox}>
                {/* simple preview */}
                <img
                  src={image}
                  alt="Preview"
                  style={{
                    ...styles.previewImg,
                    opacity: imgOk ? 1 : 0.4,
                    filter: imgOk ? "none" : "grayscale(100%)",
                  }}
                  onError={() => setImgOk(false)}
                  onLoad={() => setImgOk(true)}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div style={styles.actions}>
          <button style={styles.btnGhost} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            style={{ ...styles.btn, ...(canAdd ? {} : styles.btnDisabled) }}
            disabled={!canAdd}
            onClick={onAdd}
            aria-disabled={!canAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Inline Styles ===== */
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    color: "#111827",
    width : '100vw'
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    padding: 20,
  },
  heading: {
    margin: 0,
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
    padding: "10px 12px",
    fontSize: 14,
    background: "#ffffff",
    color :'black'
  },
  previewWrap: {
    marginTop: 12,
  },
  previewHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 600,
  },
  previewError: {
    fontSize: 12,
    color: "#b91c1c",
    fontWeight: 600,
  },
  previewBox: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    overflow: "hidden",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  actions: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  btn: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 12,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  btnGhost: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
  },
};
