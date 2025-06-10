import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import './forgot-password.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) return setError("Please enter your email first.");

    try {
      await api.post("/auth/send-otp", { email });
      setOtpSent(true);
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP.");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp || !password) {
      return setError("All fields are required.");
    }

    try {
      await api.post("/auth/update-password", {
        email,
        otp,
        new_password: password,
      });
      setSuccess("Password reset successful.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password.");
    }
  };

  return (
    <div className="forgot-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleResetSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <button type="button" onClick={sendOtp}>
          {otpSent ? "Resend OTP" : "Send OTP"}
        </button>

        <label>
          OTP:
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </label>

        <label>
          New Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Reset Password</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default ForgotPassword;
