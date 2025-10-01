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
 const update = async() =>{
    try { 
        const response = await axios.post(`${baseURL}/update-whyus` , {_id : id , title : title , image : image})
        console.log(response.status)
        if(response.status == 200){
            navigate("/home");
        }
        else {
            alert(response.data.message)
        }
    } 
    catch(err){
        console.log(err)
    }
 }
  const openModal = () => {
    setTempImageUrl(image || "");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const confirmImageChange = () => {
    setImage(tempImageUrl.trim());
    setIsModalOpen(false);
  };

  // NOTE: You only asked to navigate back on save. If you later want to persist:
  // await axios.put(`${baseURL}/update-whyUs/${id}`, { title, image })
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
              <button style={styles.modalClose} onClick={closeModal} aria-label="Close">×</button>
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

/* ===== Inline Styles ===== */
const surface = "rgba(255,255,255,0.06)";
const border = "1px solid rgba(255,255,255,0.14)";

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(1200px 600px at 10% -10%, rgba(255,255,255,0.05), rgba(0,0,0,0))",
    color: "#eaeaea",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans"',
    display: "flex",
    flexDirection: "column",
    
    
  },
  container: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 20px 120px",
    
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  pageTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.3,
  },

  contentRow: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 380px) 1fr",
    gap: 22,
    alignItems: "start",
  },

  /* Image Card */
  imageCard: {
    position: "relative",
    background: surface,
    border,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },
  imageWrap: {
    width: "100%",
    height: 260,
    background: "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imagePlaceholder: {
    color: "#bbb",
    fontSize: 14,
  },
  editImageBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    fontSize: 18,
    lineHeight: "34px",
    textAlign: "center",
    cursor: "pointer",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  },

  /* Right side form */
  formArea: {
    background: surface,
    border,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },
  label: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    outline: "none",
  },

  /* Footer (Save) */
  footerBar: {
    position: "sticky",
    bottom: 0,
    width: "100%",
    padding: "12px 20px",
    background: "rgba(10,10,10,0.65)",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  btn: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  btnSecondary: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 50,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    background: "rgba(20,20,20,0.9)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
    color: "#eaeaea",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },
  modalTitle: { fontSize: 16, fontWeight: 700 },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 18,
    lineHeight: "30px",
    textAlign: "center",
    cursor: "pointer",
  },
  modalBody: {
    padding: 16,
  },
  previewWrap: { marginTop: 12 },
  previewLabel: { fontSize: 12, opacity: 0.8, marginBottom: 8 },
  previewBox: {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    height: 180,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  modalFooter: {
    padding: 12,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    borderTop: "1px solid rgba(255,255,255,0.12)",
  },

  /* Loaders */
  titleSkeleton: {
    width: 180,
    height: 24,
    borderRadius: 8,
    background: "rgba(255,255,255,0.09)",
  },
  imageSkeleton: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  inputSkeleton: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  /* Errors */
  errorBox: {
    marginTop: 24,
    padding: 18,
    borderRadius: 12,
    border: "1px solid rgba(255,86,86,0.4)",
    background: "rgba(255,86,86,0.08)",
    color: "#ffb0b0",
  },
};
