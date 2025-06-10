// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const isVerified = decoded?.user?.is_email_verified;

    if (!isVerified) {
      api.post('/auth/send-otp', {email: decoded.user.email})
      return <Navigate to="/verify-email" />;
    }

    return children;
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
