import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { color } from "framer-motion";

const WhyUs = () => {
  const baseURL = useAuth((s) => s.baseURL);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [whyUs, setWhyUS] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await axios.get(`${baseURL}/fetch-whyUs`);
        if (response.status === 200) {
          if (isMounted) setWhyUS(Array.isArray(response.data) ? response.data : []);
        } else {
          if (isMounted) setError("Failed to load content.");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Something went wrong while fetching Why Us.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [baseURL]);

  const onCardClick = (id) => navigate(`/whyus/${id}`);
  const onCreateClick = () => navigate("/whyus/new");

  if (loading) {
    return (
      <div style={styles.wrap}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Why Us</h2>
          <div
          style={styles.addBtn}
          onClick={onCreateClick}
          aria-label="Add new Why Us"
        >
          Add
        </div>
        </div>
        <div style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={styles.cardSkeleton} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.wrap}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Why Us</h2>
          <button
            style={styles.addBtn}
            onClick={onCreateClick}
            aria-label="Add new Why Us"
          >
            +
          </button>
        </div>
        <div style={styles.errorBox}>{error}</div>
      </div>
    );
  }

  if (!whyUs || whyUs.length === 0) {
    return (
      <div style={styles.wrap}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Why Us</h2>
           <div
          style={styles.addBtn}
          onClick={onCreateClick}
          aria-label="Add new Why Us"
        >
          Add
        </div>
        </div>
        <div style={styles.emptyBox}>No items to display.</div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Why Us</h2>
        <div
          style={styles.addBtn}
          onClick={onCreateClick}
          aria-label="Add new Why Us"
        >
          Add
        </div>
      </div>

      <div style={styles.grid}>
        {whyUs.map((item) => (
          <article
            key={item._id || item.image || item.title}
            style={styles.card}
            onClick={() => onCardClick(item._id)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick(item._id);
              }
            }}
          >
            <div style={styles.imageWrap}>
              <img
                src={item.image}
                alt={item.title || "Why Us"}
                style={styles.image}
                loading="lazy"
              />
            </div>
            <div style={styles.cardBody}>
              <div style={styles.cardTitle} title={item.title}>
                {item.title}
              </div>
              <div style={styles.chevron} aria-hidden>›</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrap: {
    padding: 20,
    color: "#eaeaea",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
    background:
      "radial-gradient(1200px 600px at 10% -10%, rgba(255,255,255,0.05), rgba(0,0,0,0))",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.3,
    color : 'black'
  },
  addBtn: {
    width : 100,
    borderRadius: 5,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "black",
    fontSize: 15,
    fontWeight: 600,
    lineHeight: "34px",
    textAlign: "center",
    cursor: "pointer",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    transition: "transform 140ms ease, box-shadow 140ms ease, background 140ms ease",

  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 160ms ease, box-shadow 160ms ease",
    cursor: "pointer",
    outline: "none",
  },
  imageWrap: {
    width: "100%",
    height: 160,
    overflow: "hidden",
    background: "rgba(255,255,255,0.04)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardBody: {
    padding: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color : 'black'
  },
  chevron: {
    fontSize: 22,
    lineHeight: 1,
    opacity: 0.7,
    color :'black'
  },
  cardSkeleton: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    height: 220,
  },
  emptyBox: {
    marginTop: 24,
    padding: 18,
    borderRadius: 12,
    border: "1px dashed rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.04)",
    color: "#cfcfcf",
    textAlign: "center",
  },
  errorBox: {
    marginTop: 24,
    padding: 18,
    borderRadius: 12,
    border: "1px solid rgba(255,86,86,0.4)",
    background: "rgba(255,86,86,0.08)",
    color: "#ffb0b0",
  },
};

export default WhyUs;
