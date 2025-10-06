// ServiceDetail.jsx
import axios from "axios";
import { color } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
 

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = useAuth((s)=>s.baseURL)
  const [values, setValues] = useState({
    name: "",
    imageLink: "",
    serviceID: "",
    location: "",
    priceSmall: "",
    priceMid: "",
    priceLarge: "",
  });

  const [touched, setTouched] = useState({});
  const [imgOk, setImgOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");

  // ---------- Validation ----------
  const errors = useMemo(() => {
    const e = {};
    if (!values.name.trim()) e.name = "Required";
    if (!values.imageLink.trim()) e.imageLink = "Required";
    if (!values.serviceID.trim()) e.serviceID = "Required";
    if (!values.location.trim()) e.location = "Required";

    const priceFields = [
      ["priceSmall", "Small vehicle price"],
      ["priceMid", "Mid vehicle price"],
      ["priceLarge", "Large vehicle price"],
    ];
    priceFields.forEach(([key, label]) => {
      const v = values[key];
      if (v === "" || v === null) e[key] = "Required";
      else if (Number.isNaN(Number(v)) || Number(v) < 0)
        e[key] = `${label} must be ≥ 0`;
    });

    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  // ---------- Fetch existing service by id ----------
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchService() {
      try {
        setFetchError("");
        setLoading(true);

        const url = `${baseURL}/fetch-service-by-id?id=${encodeURIComponent(
          id || ""
        )}`;

        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        // Expecting payload like:
        // { name, imageLink, serviceID, location, prices: { small, mid, large } }
        const payload = await res.json();
        console.log(payload)
        if (!isMounted) return;

        setValues({
          name: payload?.name ?? "",
          imageLink: payload?.image?? "",
          serviceID: payload?.serviceID ?? "",
          location: payload?.location ?? "",
          priceSmall:
            payload?.prices?.small !== undefined ? String(payload.prices.small) : "",
          priceMid:
            payload?.prices?.mid !== undefined ? String(payload.prices.mid) : "",
          priceLarge:
            payload?.prices?.large !== undefined ? String(payload.prices.large) : "",
        });

        // reset preview state for new image
        setImgOk(false);
        // mark untouched on initial load
        setTouched({});
      } catch (err) {
        if (err.name !== "AbortError") {
          setFetchError(err.message || "Failed to fetch service.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchService();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSave = async () => {
    // mark all fields as touched
    setTouched({
      name: true,
      imageLink: true,
      serviceID: true,
      location: true,
      priceSmall: true,
      priceMid: true,
      priceLarge: true,
    });
    setSubmitError("");

    if (!isValid) return;

    try {
      setSaving(true);

      const payload = {
        name: values.name.trim(),
        image: values.imageLink.trim(),
        serviceID: values.serviceID.trim(),
        location: values.location.trim(),
        prices: {
          small: Number(values.priceSmall),
          mid: Number(values.priceMid),
          large: Number(values.priceLarge),
        },
      };
      const response = await axios.post(`${baseURL}/update-service-by-id` , {id , payload})
      if(response.status ==200){
        alert(response.data.message)
        navigate("/home")
      }
      else {
        alert("error" , response.data.message)
      }
  
    } catch (err) {
      setSubmitError(err?.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const showError = (key) => touched[key] && errors[key];

  // ---------- UI ----------
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.skeletonTitle} />
          <div style={{ height: 16 }} />
          <div style={styles.grid}>
            <div>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={styles.skeletonLabel} />
                  <div style={styles.skeletonInput} />
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...styles.previewCard, padding: 14 }}>
                <div style={styles.skeletonLabel} />
                <div style={styles.skeletonPreview} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Service Details</h1>
          <div style={styles.submitError}>
            Error loading service: {fetchError}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button style={styles.button} onClick={() => navigate(-1)}>Go Back</button>
            <button
              style={styles.buttonSecondary}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Service Details</h1>
        <p style={styles.subtitle}>
          ID: <span style={{ fontWeight: 600 }}>{id}</span>
        </p>

        <div style={styles.grid}>
          {/* Left column — editable fields */}
          <div>
            <Field label="Name" required error={showError("name")}>
              <input
                style={{ ...styles.input, ...(showError("name") ? styles.inputError : {}) }}
                type="text"
                name="name"
                placeholder="e.g., Premium Wash"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            <Field
              label="Image link"
              required
              hint="Direct URL to an image (JPG/PNG/WebP)."
              error={showError("imageLink")}
            >
              <input
                style={{ ...styles.input, ...(showError("imageLink") ? styles.inputError : {}) }}
                type="url"
                name="imageLink"
                placeholder="https://example.com/image.jpg"
                value={values.imageLink}
                onChange={(e) => {
                  setImgOk(false);
                  handleChange(e);
                }}
                onBlur={handleBlur}
              />
            </Field>

            <Field label="Service ID" required error={showError("serviceID")}>
              <input
                style={{ ...styles.input, ...(showError("serviceID") ? styles.inputError : {}) }}
                type="text"
                name="serviceID"
                placeholder="e.g., SRV-00123"
                value={values.serviceID}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            <Field label="Location" required error={showError("location")}>
              <input
                style={{ ...styles.input, ...(showError("location") ? styles.inputError : {}) }}
                type="text"
                name="location"
                placeholder="e.g., Mumbai, Andheri"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            <div style={styles.groupHeader}>Prices (₹)</div>
            <div style={styles.priceRow}>
              <Field compact label="Small" required error={showError("priceSmall")}>
                <input
                  style={{ ...styles.input, ...(showError("priceSmall") ? styles.inputError : {}) }}
                  type="number"
                  min="0"
                  step="0.01"
                  name="priceSmall"
                  placeholder="0.00"
                  value={values.priceSmall}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field>

              <Field compact label="Mid" required error={showError("priceMid")}>
                <input
                  style={{ ...styles.input, ...(showError("priceMid") ? styles.inputError : {}) }}
                  type="number"
                  min="0"
                  step="0.01"
                  name="priceMid"
                  placeholder="0.00"
                  value={values.priceMid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field>

              <Field compact label="Large" required error={showError("priceLarge")}>
                <input
                  style={{ ...styles.input, ...(showError("priceLarge") ? styles.inputError : {}) }}
                  type="number"
                  min="0"
                  step="0.01"
                  name="priceLarge"
                  placeholder="0.00"
                  value={values.priceLarge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field>
            </div>

            {submitError ? (
              <div style={styles.submitError} role="alert" aria-live="assertive">
                {submitError}
              </div>
            ) : null}

            <div style={styles.actions}>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{ ...styles.button, ...(saving ? styles.buttonDisabled : {}) }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={styles.buttonSecondary}
              >
                Cancel
              </button>
            </div>

            {!isValid && (
              <div style={styles.inlineNote} role="status" aria-live="polite">
                Please fill all required fields highlighted in red.
              </div>
            )}
          </div>

          {/* Right column — image preview */}
          <div>
            <div style={styles.previewCard}>
              <div style={styles.previewHeader}>Preview</div>
              <div style={styles.previewBody}>
                {values.imageLink ? (
                  <img
                    key={values.imageLink}
                    src={values.imageLink}
                    alt="Service preview"
                    style={{ ...styles.previewImg, opacity: imgOk ? 1 : 0 }}
                    onLoad={() => setImgOk(true)}
                    onError={() => setImgOk(false)}
                    referrerPolicy="no-referrer"
                  />
                ) : null}

                {!values.imageLink ? (
                  <div style={styles.previewPlaceholder}>
                    Paste an image URL to preview
                  </div>
                ) : !imgOk ? (
                  <div style={styles.previewPlaceholder}>
                    Unable to load image. Check the URL.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Small presentational helpers ---------- */
function Field({ label, hint, error, required, compact, children }) {
  return (
    <div style={{ ...styles.field, ...(compact ? styles.fieldCompact : {}) }}>
      <label style={styles.label}>
        {label} {required && <span style={styles.req}>*</span>}
      </label>
      {children}
      {hint && <div style={styles.hint}>{hint}</div>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

/* ---------- Styles (no Tailwind—styles only) ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    color: "#0f172a",
    minWidth : '100vw'
  },
  card: {
    width: "100%",
    maxWidth: 980,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(15,23,42,0.06)",
    padding: 28,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "6px 0 20px",
    color: "#475569",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 24,
  },
  field: {
    marginBottom: 14,
  },
  fieldCompact: {
    marginBottom: 0,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
  },
  req: { color: "#ef4444" },
  input: {
    width: "100%",
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    transition: "box-shadow 120ms ease, border-color 120ms ease",
    boxShadow: "0 1px 0 rgba(2,6,23,0.03) inset",
    color :'black'
  },
  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.15)",
  },
  hint: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 6,
  },
  error: {
    fontSize: 12,
    color: "#b91c1c",
    marginTop: 6,
  },
  groupHeader: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#64748b",
  },
  priceRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 10,
  },
  actions: {
    marginTop: 18,
    display: "flex",
    gap: 12,
  },
  button: {
    border: "1px solid #e2e8f0",
    background: "#0ea5e9",
    color: "#fff",
    fontWeight: 700,
    borderRadius: 12,
    padding: "12px 18px",
    fontSize: 14,
    cursor: "pointer",
    transition: "transform 120ms ease, box-shadow 120ms ease, opacity 120ms",
    boxShadow: "0 6px 16px rgba(14,165,233,0.25)",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  buttonSecondary: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#0f172a",
    fontWeight: 600,
    borderRadius: 12,
    padding: "12px 18px",
    fontSize: 14,
    cursor: "pointer",
    transition: "background 120ms ease, box-shadow 120ms ease",
  },
  previewCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
  },
  previewHeader: {
    padding: "10px 14px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    background: "#f8fafc",
  },
  previewBody: {
    padding: 14,
    minHeight: 240,
    display: "grid",
    placeItems: "center",
  },
  previewImg: {
    maxWidth: "100%",
    maxHeight: 320,
    borderRadius: 12,
    display: "block",
    transition: "opacity 160ms ease",
  },
  previewPlaceholder: {
    width: "100%",
    minHeight: 200,
    border: "1px dashed #d1d5db",
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    color: "#94a3b8",
    fontSize: 13,
    padding: 12,
    textAlign: "center",
    background:
      "repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #fafafa 10px, #fafafa 20px)",
  },

  /* Skeletons */
  skeletonTitle: {
    width: 240,
    height: 28,
    borderRadius: 8,
    background:
      "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)",
    backgroundSize: "400% 100%",
    animation: "shine 1.2s linear infinite",
  },
  skeletonLabel: {
    width: 120,
    height: 12,
    borderRadius: 6,
    background:
      "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)",
    backgroundSize: "400% 100%",
    animation: "shine 1.2s linear infinite",
  },
  skeletonInput: {
    height: 44,
    borderRadius: 10,
    background:
      "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)",
    backgroundSize: "400% 100%",
    animation: "shine 1.2s linear infinite",
  },
  skeletonPreview: {
    height: 240,
    borderRadius: 12,
    background:
      "linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)",
    backgroundSize: "400% 100%",
    animation: "shine 1.2s linear infinite",
    marginTop: 12,
  },
};

export default ServiceDetail;
