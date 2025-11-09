import React, { useEffect, useState, useMemo, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../store/auth";
interface Package {
    _id: any;
    name : string,
    status : number, 
    price : number,
    description : any,
}
export default function Packages() {
  const navigate = useNavigate();
  const baseURL = useAuth((s) => s.baseURL);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);

  // Fetch packages
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${baseURL}/get-all-packages`);
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setPackages(list);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load packages. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [baseURL]);

  // Optimistic toggle (adjust to your backend if you have a real endpoint)
  // const handleToggle = async (pkg : Package) => {
  //   // If your API supports it, replace with a request like:
  //   // await axios.post(`${baseURL}/update-package-status`, { id: pkg._id, active: !pkg.active })
  //   // For now, optimistic local toggle:
  //   setPackages((prev) =>
  //     prev.map((p) => (p._id === pkg._id ? { ...p, active: !p.active } : p))
  //   );
  // };

  const onView = (pkg: Package) => {
    // Navigate to a details page; change route as per your app
    navigate(`/package/${pkg._id}`);
  };

  const onAdd = () => {
    // Navigate to a create form; change route as per your app
    navigate(`/addpackage`);
  };

  const body = useMemo(() => {
    if (loading) {
      return (
        <div style={styles.listWrap}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={styles.cardSkeleton} />
          ))}
        </div>
      );
    }

    if (error) {
      return <div style={styles.errorBox}>{error}</div>;
    }

    if (!packages.length) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyTitle}>No packages found</div>
          <div style={styles.emptySub}>Click “Add” to create your first package.</div>
        </div>
      );
    }

    return (
      <div style={styles.listWrap}>
        {packages.map((pkg) => (
          <div key={pkg._id } style={styles.card}>
            <div style={styles.cardLeft}>
              <div style={styles.pkgName} title={pkg.name}>
                {pkg.name || "Untitled Package"}
              </div>
              {/* Optional secondary info (keep minimal and clean) */}
              {/* {pkg.description ? (
                <div style={styles.pkgSub}>{pkg.description}</div>
              ) : null} */}
            </div>
            <div style={styles.cardRight}>
              {/* <label style={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={!!(pkg.status==200)}
                  // onChange={() => handleToggle(pkg)}
                  style={styles.switchInput}
                />
                <span style={styles.switchTrack} />
                <span style={styles.switchText}>{pkg.status==200 ? "On" : "Off"}</span>
              </label> */}
              <button style={styles.viewBtn} onClick={() => onView(pkg)}>
                View & Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [loading, error, packages]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Packages</h1>
          <button style={styles.addBtn} onClick={onAdd} aria-label="Add package">
            + Add
          </button>
        </div>
        {body}
      </div>
    </div>
  );
}

/* ========= Styles (modern, clean, white) ========= */

const styles :Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "32px 16px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans"',
    color: "#1f2937",
  },
  container: {
    width: "100%",
    maxWidth: 920,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 0.2,
    color: "#111827",
  },
  addBtn: {
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  listWrap: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 10px rgba(17,24,39,0.04)",
  },
  cardSkeleton: {
    height: 70,
    background: "linear-gradient(90deg,#f3f4f6 0%,#f9fafb 50%,#f3f4f6 100%)",
    borderRadius: 12,
    border: "1px solid #eef2f7",
    animation: "pulse 1.2s ease-in-out infinite",
  },

  cardLeft: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  pkgName: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 520,
  },
  pkgSub: {
    fontSize: 13,
    color: "#6b7280",
    maxWidth: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  cardRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  // Toggle switch (pure CSS)
  switchLabel: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    userSelect: "none",
  },
  switchInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  switchTrack: {
    // we’ll style using a CSS trick with :has in inline style is not possible,
    // so we simulate with a small JS trick using sibling span and checked state via default styling:
    // Instead, we'll define as a neutral track and update text label beside to show state.
    display: "inline-block",
    width: 42,
    height: 24,
    background: "#e5e7eb",
    borderRadius: 999,
    position: "relative",
    boxShadow: "inset 0 0 0 1px #e5e7eb",
  },
  switchText: {
    fontSize: 12,
    color: "#374151",
    minWidth: 28,
    textAlign: "left",
  },

  // View button
  viewBtn: {
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    transition: "background 120ms ease, border-color 120ms ease",
  },

  errorBox: {
    padding: 14,
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,0.35)",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 14,
  },

  emptyState: {
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    borderRadius: 12,
    padding: 28,
    textAlign: "center",
    color: "#6b7280",
  },
  emptyTitle: { fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 6 },
  emptySub: { fontSize: 13 },

  // Keyframes (note: only works if you add as global CSS; optional)
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.6 },
    "100%": { opacity: 1 },
  },
};
