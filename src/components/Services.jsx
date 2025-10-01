// Services.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../store/auth";

const Services = () => {
  const [services, setServices] = useState([]);   // always an array
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();
  const baseURL = useAuth((s) => s.baseURL);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${baseURL}/fetch-admin-app-services`, {
          headers: { Accept: "application/json" },
        });
        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        if (mounted) setServices(list);
      } catch (err) {
        console.error("Error fetching services:", err);
        if (mounted) setFetchError("Failed to load services.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [baseURL]);

  const handleToggle = async (id, value) => {
   
    // Optimistically update local UI so the switch reflects the change
    setServices((prev) =>
      prev.map((s) =>
        (s._id === id || s.serviceID === id)
          ? { ...s, status: value ? 200 : 0 }
          : s
      )
    );

    // TODO: Add your API call here to persist the new status
    try {
      console.log("In button")
      const response = await axios.post(`${baseURL}/change-service-status`, {
        _id : id,
        status: value ? 200 : 0,
      });
      if(response.status ==200){
        alert(response.data.message)
      }
    } catch (e) {
      // rollback on failure (optional)
      setServices((prev) =>
        prev.map((s) =>
          (s._id === id || s.serviceID === id)
            ? { ...s, status: value ? 0 : 200 }
            : s
        )
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>App Services</h1>
        <div style={styles.cardSkeleton} />
        <div style={styles.cardSkeleton} />
        <div style={styles.cardSkeleton} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>App Services</h1>
        <div style={styles.errorBox}>{fetchError}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>App Services</h1>
      {Array.isArray(services) && services.length > 0 ? (
        services.map((service) => {
          const id = service._id || service.serviceID;
          const isOn = Number(service?.status) === 200;

          return (
            <div key={id} style={styles.card}>
              {/* Name */}
              <span style={styles.name}>{service?.name ?? "Untitled"}</span>

              {/* Right side */}
              <div style={styles.rightSection}>
                {/* Controlled switch */}
                <Switch
                  checked={isOn}
                  onChange={(next) => handleToggle(id, next)}
                />

                {/* Chevron */}
                <button
                  style={styles.chevButton}
                  onClick={() => navigate(`/serviceDetail/${id}`)}
                  aria-label="View details"
                >
                View
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div style={styles.emptyBox}>No services found.</div>
      )}
    </div>
  );
};

export default Services;

/** Controlled switch (no CSS files, no libs) */
const Switch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      style={{
        ...styles.switchTrack,
        backgroundColor: checked ? "#2563eb" : "#cbd5e1",
        borderColor: checked ? "#1e40af" : "#cbd5e1",
      }}
    >
      <span
        style={{
          ...styles.switchThumb,
          transform: checked ? "translateX(18px)" : "translateX(0)",
        }}
      />
    </button>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    minHeight: "100vh",
    padding: 16,
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },
  heading: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 16,
    color: "#111827",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
    color: "#374151",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  chevButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
   color :'black',
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    cursor: "pointer",
  },
  // Switch styles (track + thumb)
  switchTrack: {
    position: "relative",
    width: 40,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "solid",
    cursor: "pointer",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  },
  switchThumb: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 18,
    height: 18,
    borderRadius: "50%",
    backgroundColor: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease",
  },
  // Skeleton / empty / error
  cardSkeleton: {
    height: 56,
    borderRadius: 12,
    marginBottom: 12,
    background:
      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%)",
    backgroundSize: "400% 100%",
    animation: "skeleton 1.4s ease infinite",
  },
  emptyBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    color: "#6b7280",
  },
  errorBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#fecaca",
    color: "#991b1b",
  },
};
