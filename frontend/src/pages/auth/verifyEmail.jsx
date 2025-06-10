import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axios";
import './verifyEmail.css'

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const email = decoded.email;
      console.log("email: ", email)

      const res = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.access_token); 
      navigate("/home");
    } catch (err) { 
      console.error("Error: ", err)
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <form onSubmit={handleSubmit}>
        <h2>Enter OTP sent to your email</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default VerifyEmail;
