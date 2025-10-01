import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGate } from "./components/AuthGate.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import './index.css'
import WhyUsDetail from "./pages/WhyUsDetail.jsx";
import AddWhyUs from "./components/AddWhyUs.js";
import ServiceDetail from "./pages/ServiceDetail.jsx";
export default function App() {
  return (
    <Routes>
      {/* Landing route decides where to go based on token */}
      <Route path="/" element={<AuthGate />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/whyus/new" element={<AddWhyUs />} />
      

      {/* Private (simple guard) */}
      <Route path="/home" element={<Home />} />
    // in your router
    <Route path="/whyus/:id" element={<WhyUsDetail />} />
    <Route path="/serviceDetail/:id" element={<ServiceDetail />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
