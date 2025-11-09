import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.js"; // remove or adjust if not using zustand
import WhyUs from "../components/WhyUs.jsx";
import Services from "../components/Services.jsx";
import Review from "../components/Review.jsx";
import Packages from "../components/Packages.js";
import { label } from "framer-motion/client";

// Single-file React page with LEFT tab bar (inline CSS, no Tailwind)

const TABS = [
  { key: "whyus", label: "Whyus" },
  { key: "services", label: "Services" },
  { key: "review", label: "Review" },
  {key : "packages" , label : "Packages"}
];

export default function HomeInline() {
  const [active, setActive] = useState("whyus");
  const navigate = useNavigate();
  const clearAuth = useAuth((S) => S.clearAuth);

  const onLogout = () => {
    try {
      clearAuth?.();
    } catch {}
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.appWrap}>
      {/* Top Bar */}
      <header style={styles.topbar}>
        <div style={styles.brandWrap}>
          <div style={styles.brandLogo} />
          <div style={styles.brandText}>BubbleX</div>
        </div>
        <div style={styles.topRightHint}>Admin Panel</div>
      </header>

      <main style={styles.mainGrid}>
        {/* Left Tab Bar */}
        <aside style={styles.sidebar}>
          <nav style={styles.navList}>
            {TABS.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  style={{
                    ...styles.navBtn,
                    ...(isActive ? styles.navBtnActive : {}),
                  }}
                >
                  <span style={styles.navDot} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>

          <button onClick={onLogout} style={styles.logoutBtn}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: 8 }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </aside>

        {/* Content */}
        <section style={styles.contentWrap}>
          <TabHeader label={TABS.find((t) => t.key === active)?.label ?? ""} />
          <div style={styles.card}>
            {active === "whyus" && <WhyUs />}
            {active === "services" && <Services />}
            {active === "review" && <Review />}
            {active == "packages" && <Packages/>}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} BubbleX. All rights reserved.
      </footer>
    </div>
  );
}

function TabHeader({ label }) {
  return (
  <></>
  );
}



// Inline style objects
const styles = {
  appWrap: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #f8fafc, #ffffff, #f1f5f9)",
    color: "#0f172a",
  },
  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    borderBottom: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
  },
  brandWrap: { display: "flex", alignItems: "center", gap: 10 },
  brandLogo: { width: 28, height: 28, borderRadius: 10, background: "#0f172a" },
  brandText: { fontSize: 18, fontWeight: 700, letterSpacing: 0.2 },
  topRightHint: { fontSize: 12, color: "#64748b" },

  // Sidebar sticks to the LEFT (no decorative left column)
  mainGrid: {
    maxWidth: "100%",
    margin: 0,
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 16,
    padding: "0 20px",
  },

  sidebar: {
    position: "sticky",
    top: 64,
    height: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.70)",
    backdropFilter: "blur(8px)",
    borderRadius: 16,
    padding: 10,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  navList: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    border: "1px solid transparent",
    borderRadius: 12,
    background: "transparent",
    color: "#334155",
    cursor: "pointer",
    transition: "all 160ms ease",
  },
  navBtnActive: {
    background: "#ffffff",
    borderColor: "rgba(15,23,42,0.15)",
    color: "#0f172a",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "#0f172a",
  },
  logoutBtn: {
    marginTop: "auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.18)",
    background: "#ffffff",
    color: "#0f172a",
    padding: "10px 12px",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  },
  contentWrap: { padding: "24px 0 32px 0" },
  headerRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between" },
  h2: { margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: 0.2 },
  subtleText: { margin: 0, marginTop: 6, fontSize: 13, color: "#64748b" },
  pill: {
    display: "none",
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.70)",
    padding: "6px 10px",
    borderRadius: 12,
    fontSize: 12,
    color: "#475569",
  },
  card: {
    marginTop: 16,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.82)", // readable light glass
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  h3: { margin: 0, fontSize: 20, fontWeight: 700 },
  bodyText: { marginTop: 8, color: "#475569", lineHeight: 1.6 },
  ul: { marginTop: 12, paddingLeft: 18, color: "#475569" },
  grid: {
    marginTop: 12,
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  },
  serviceCard: {
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#ffffff",
    borderRadius: 14,
    padding: 14,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  serviceTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a" },
  serviceBlurb: { marginTop: 6, fontSize: 14, color: "#475569" },
  reviewCard: {
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#ffffff",
    borderRadius: 14,
    padding: 14,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  footer: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "8px 20px 24px",
    textAlign: "center",
    fontSize: 12,
    color: "#64748b",
  },
};
