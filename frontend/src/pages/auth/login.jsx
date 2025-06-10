import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { email, password } = formData;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", { email, password });

  
      localStorage.setItem("token", response.data.access_token);
      const decoded = jwtDecode(response.data.access_token);

      if (!decoded.user.is_email_verified) {
        await api.post("/auth/send-otp", { email: formData.email });
        navigate("/verify-email", { state: { email: formData.email } });
      } else {
        navigate("/home");
      }

    } catch (err) {
      console.error("Login error:", err);

      const data = err.response?.data;
      let msg = "Login failed. Please check your credentials.";

      if (typeof data === "string") {
        msg = data;
      } else if (data?.detail) {
        msg = data.detail;
      } else if (data?.message) {
        msg = data.message;
      } else if (Array.isArray(data?.errors)) {
        msg = data.errors.map(e => e.msg || e.message).join(" ");
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}

          <label>
            Email
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              required
              value={formData.email}
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                required
                value={formData.password}
                autoComplete="current-password"
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowPassword((prev) => !prev);
                  }
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </label>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don’t have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
