import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import axios from "axios";

export default function WhyUsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = useAuth((s) => s.baseURL);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/fetch-whyUs-ById?_id=${id}`);
        if (response.status === 200) {
          const data = response.data || {};
          if (!isMounted) return;
          setTitle(data.title || "");
          setImage(data.image || "");
          setError("");
        } else {
          if (!isMounted) return;
          setError(response.data?.message || "Failed to load item.");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Something went wrong while fetching the item.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [baseURL, id]);

  const update = async() => {
    try { 
        const response = await axios.post(`${baseURL}/update-whyus`, {_id : id , title : title , image : image})
        console.log(response.status);
        if(response.status === 200){
            navigate("/home");
        }
        else {
            alert(response.data.message);
        }
    } 
    catch(err){
        console.log(err);
    }
  };

  const openModal = () => {
    setTempImageUrl(image || "");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const confirmImageChange = () => {
    setImage(tempImageUrl.trim());
    setIsModalOpen(false);
  };

  const onSave = async () => {
    update();
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <div style={styles.titleSkeleton} />
          </div>
          <div style={styles.contentRow}>
            <div style={styles.imageSkeleton} />
            <div style={styles.formArea}>
              <div style={styles.label}>Name</div>
              <div style={styles.inputSkeleton} />
            </div>
          </div>
        </div>
        <div style={styles.footerBar}>
          <button style={{ ...styles.btn, ...styles.btnDisabled }} disabled>Save</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <h2 style={styles.pageTitle}>Why Us — Details</h2>
          </div>
          <div style={styles.errorBox}>{error}</div>
        </div>
        <div style={styles.footerBar}>
          <button style={styles.btnSecondary} onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.pageTitle}>Why Us — Details</h2>
        </div>

        <div style={styles.contentRow}>
          <div style={styles.imageCard}>
            <div style={styles.imageWrap}>
              {image ? (
                <img src={image} alt={title || "Why Us item"} style={styles.image} />
              ) : (
                <div style={styles.imagePlaceholder}>No Image</div>
              )}
            </div>
            <button
              style={styles.editImageBtn}
              onClick={openModal}
              aria-label="Edit image"
              title="Edit image"
            >
              ✎
            </button>
          </div>

          <div style={styles.formArea}>
            <label style={styles.label} htmlFor="title-input">Name</label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter name"
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Footer Save */}
      <div style={styles.footerBar}>
        <button style={styles.btnSecondary} onClick={() => navigate(-1)}>Cancel</button>
        <button style={styles.btn} onClick={onSave}>Save</button>
      </div>

      {/* Image URL Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} role="dialog" aria-modal="true">
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Update Image</div>
              
            </div>
            <div style={styles.modalBody}>
              <label style={styles.label} htmlFor="image-url-input">Image URL</label>
              <input
                id="image-url-input"
                type="url"
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={styles.input}
              />
              {tempImageUrl ? (
                <div style={styles.previewWrap}>
                  <div style={styles.previewLabel}>Preview</div>
                  <div style={styles.previewBox}>
                    <img
                      src={tempImageUrl}
                      alt="Preview"
                      style={styles.previewImage}
                      onError={(e) => (e.currentTarget.style.opacity = 0.4)}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnSecondary} onClick={closeModal}>Cancel</button>
              <button style={styles.btn} onClick={confirmImageChange}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Updated Styles ===== */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f5f5f5", // White background for a modern look
    color: "#333",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans"',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    flexDirection :'column'
  },
  container: {
    width: "100%",
    maxWidth: 850,
    backgroundColor: "#fff", // White background for the container
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#333",
  },
  contentRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 20,
    alignItems: "center",
  },
  imageCard: {
    position: "relative",
    background: "#eaeaea", // Subtle background for the image area
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  imageWrap: {
    width: "100%",
    height: 200,
    background: "#f0f0f0", // Placeholder background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    color: "#bbb",
    fontSize: 14,
  },
  editImageBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: "8px",
    background: "#007bff",
    color: "#fff",
    fontSize: 14,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  formArea: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  input: {
    padding: "12px 16px",
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginBottom: 16,
    outline: "none",
    backgroundColor: "#fafafa",
    color: "#333",
  },
  footerBar: {
    marginTop: 30,
    display: "flex",
    justifyContent: "flex-end",
    gap: 20,
  },
  btn: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  btnSecondary: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    border: "1px solid #007bff",
    backgroundColor: "transparent",
    color: "#007bff",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    background: "#fff",
    padding: 20,
    width: "80%",
    maxWidth: 500,
    borderRadius: 8,
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
  },
  modalClose: {
    background: "transparent",
    border: "none",
    fontSize: 20,
    color: "#999",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
};

