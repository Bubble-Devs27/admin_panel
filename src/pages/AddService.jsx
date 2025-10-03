// AddService.jsx
import axios from "axios";
import React, { useMemo, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
const AddService = () => {
  const [values, setValues] = useState({
    name: "",
    imageLink: "",
    serviceID: "",
    location: "",
    priceSmall: "",
    priceMid: "",
    priceLarge: "",
  });
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const [imgOk, setImgOk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const baseURL = useAuth((s)=>s.baseURL)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSave = async () => {
    // mark everything as touched so errors show
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

      // TODO: replace this with your API call
      // await api.createService(payload)
      console.log("Saving service payload:", payload);
      const response = await axios.post(`${baseURL}/add-app-service` , {...payload})
      if(response.status == 200){alert("Service added Successfully") ;navigate(`/home`)}
      else {
        alert(response.data.message)
      }
    } catch (err) {
      setSubmitError(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const showError = (key) => touched[key] && errors[key];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Add New Service</h1>
        <p style={styles.subtitle}>Fill in the details and click Save.</p>

        <div style={styles.grid}>
          {/* Left column — form */}
          <div>
            <Field label="Name" required error={showError("name")}>
              <input
                style={{
                  ...styles.input,
                  ...(showError("name") ? styles.inputError : {}),
                }}
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
              hint="Paste a direct image URL (JPG/PNG/WebP)."
              error={showError("imageLink")}
            >
              <input
                style={{
                  ...styles.input,
                  ...(showError("imageLink") ? styles.inputError : {}),
                }}
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
                style={{
                  ...styles.input,
                  ...(showError("serviceID") ? styles.inputError : {}),
                }}
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
                style={{
                  ...styles.input,
                  ...(showError("location") ? styles.inputError : {}),
                }}
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
                  style={{
                    ...styles.input,
                    ...(showError("priceSmall") ? styles.inputError : {}),
                  }}
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
                  style={{
                    ...styles.input,
                    ...(showError("priceMid") ? styles.inputError : {}),
                  }}
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
                  style={{
                    ...styles.input,
                    ...(showError("priceLarge") ? styles.inputError : {}),
                  }}
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
                {saving ? "Saving…" : "Save"}
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
                    style={{
                      ...styles.previewImg,
                      opacity: imgOk ? 1 : 0,
                    }}
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

/* ---------- Presentational helpers ---------- */
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

/* ---------- Styles (no Tailwind, styles only) ---------- */
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
    color: "black",
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
  inlineNote: {
    marginTop: 16,
    padding: "10px 12px",
    border: "1px solid #fde68a",
    background: "#fffbeb",
    color: "#92400e",
    borderRadius: 10,
    fontSize: 13,
  },
  submitError: {
    marginTop: 8,
    padding: "10px 12px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#991b1b",
    borderRadius: 10,
    fontSize: 13,
  },
};

export default AddService;
