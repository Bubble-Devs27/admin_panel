import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.js";

export function AuthGate() {
  const navigate = useNavigate();
  const token = useAuth((s) => s.token);

  useEffect(() => {
    if (token) navigate("/home", { replace: true });
    else navigate("/login", { replace: true });
  }, [token, navigate]);

  // tiny splash
  return (
    <div className="center-wrap">
      <div className="spinner" />
    </div>
  );
}
