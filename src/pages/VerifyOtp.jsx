import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOTP = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // If no email found in state, go to ForgotPassword
    if (!state?.email) {
      navigate("/ForgotPassword");
    }
  }, [state, navigate]);

  // ✅ Send OTP
  const handleGetOTP = async () => {
    if (!email.trim()) return toast.error("Please enter your email");
    try {
      setLoading(true);
      await axios.post(
        "https://beauty.joyory.com/api/security/send-otp",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerify = async () => {
    if (!otp.trim()) return toast.error("Please enter the OTP");

    try {
      setLoading(true);
      await axios.post(
        "https://beauty.joyory.com/api/security/verify-otp",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h4 className="mb-3 text-center">Verify OTP</h4>
        <p className="text-muted text-center">
          {!otpSent
            ? "Enter your email to get the OTP"
            : `Enter the OTP sent to ${email}`}
        </p>

        {!otpSent ? (
          <>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleGetOTP}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              className="btn btn-success w-100"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </div>
  );
};

export default VerifyOTP;
