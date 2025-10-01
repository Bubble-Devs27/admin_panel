import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.js";
// <-- change to your API origin

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);
   const baseURL = useAuth((s)=>s.baseURL)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/admin-login`, { username, password });

      if (res.status === 200 && res.data?.token) {
        setAuth({ token: res.data.token, details: res.data.details || null });
        navigate("/home", { replace: true });
      } else {
        setErr(res.data?.message || "Invalid credentials");
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card">
        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="form">
          <label className="label">Username</label>
          <input
            className="input"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />

          <label className="label">Password</label>
          <input
            className="input"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="error">{err}</div>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="btn-loader" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
