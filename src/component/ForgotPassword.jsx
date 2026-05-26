import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ForgotPassword.css"; // your styles
import "../css/Login.css"; // your styles
import Logo from "../assets/logos.webp";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=Email, 2=OTP, 3=Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate(); // ✅ add navigate

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://beauty.joyory.com/api/security/send-otp",
        { email }
      );
      setMessage(res.data.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://beauty.joyory.com/api/security/reset-password",
        { email, otp, newPassword: password, confirmPassword: password }
      );

      setMessage(res.data.message || "Password reset successfully ✅");

      // ✅ redirect after 2 sec to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (


    <div className="login-bg page-title-main-name">

      <div className="d-flex justify-content-center align-items-center vh-100 auth-bg">






        <div className=" p-4" style={{ maxWidth: "400px", width: "100%" }}>

          {step === 1 && (
            <>
              <h4 className="text-white fs-2 mt-5 ">Forgot Password</h4>
              <p className="text-light mt-1 fw-normal" style={{ fontSize: '12px' }}>Enter your email to get an OTP.</p>
              <form onSubmit={handleSendOtp}>
                <input
                  type="email"
                  className="form-control mb-3 text-white"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-primary w-100 fw-normal" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              {/* Logo + Title */}
              <div className="text-center mb-4">
                <img src={Logo} className="img-fluid" alt="Joyory Logo" />
              </div>

              <h4 className="text-white text-center mb-2 mt-5 fs-1">Verify OTP</h4>
              <p className="text-white text-center mb-4 mt-4" style={{ fontSize: "14px", opacity: 0.9 }}>
                Enter your OTP sent on your email
              </p>

              {/* 4-Digit OTP Input Boxes */}
              <form onSubmit={handleVerifyOtp}>
                <div className="d-flex justify-content-center gap-3 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className="form-control text-center otp-input-box"
                      style={{
                        width: "60px",        // Slightly larger for 4 digits
                        height: "60px",
                        fontSize: "24px",
                        borderRadius: "12px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        background: "transparent",
                        color: "white",
                      }}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Only digits
                        if (value.length <= 1) {
                          const newOtp = otp.split("");
                          newOtp[i] = value;
                          setOtp(newOtp.join("").slice(0, 4));

                          // Auto-focus next
                          if (value && i < 3) {
                            e.target.nextSibling?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !e.target.value && i > 0) {
                          e.target.previousSibling?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        const paste = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
                        if (paste.length > 0) {
                          e.preventDefault();
                          const digits = paste.slice(0, 4).split("");
                          setOtp(digits.join("").padEnd(4, ""));
                          // Focus last filled or last box
                          const lastIndex = Math.min(digits.length - 1, 3);
                          e.target.parentNode.children[lastIndex]?.querySelector("input")?.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Send OTP Button */}
                <button
                  className="btn w-100 text-white fw-medium"
                  style={{
                    backgroundColor: "#4A9EFF",
                    borderRadius: "12px",
                    height: "50px",
                    fontSize: "16px",
                  }}
                  type="submit"
                  disabled={loading || otp.length !== 4}
                >
                  {loading ? "Verifying..." : "Send OTP"}
                </button>
              </form>

              {/* Resend OTP Link */}
              <div className="text-center mt-3">
                <button
                  className="btn btn-link text-white text-decoration-none"
                  style={{ fontSize: "14px" }}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>

              {message && <p className="mt-3 text-success text-center text-white fs-5">{message}</p>}
              {/* {error && <p className="mt-3 text-danger text-center bg-white bg-opacity-10 p-2 rounded">{error}</p>} */}
            </>
          )}

          {/* {step === 3 && (
            <>
              <div className="text-center mb-5">
                <img src={Logo} className="img-fluid" alt="Joyory Logo" />
              </div>
              <h4 className="text-white text-center mt-5 mb-5 fs-2">Reset Password</h4>
              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  className="form-control mb-3 text-white"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-3 text-white"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="btn btn-warning w-100 fw-normal text-white" type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )} */}

          {step === 3 && (
            <>
              {/* Logo */}
              <div className="text-center mb-5">
                <img src={Logo} className="img-fluid" alt="Joyory Logo" style={{ width: "80px" }} />
              </div>

              <h4 className="text-white text-center mt-5 mb-5 fs-2 fw-bold">Reset Password</h4>

              <form onSubmit={handleResetPassword}>
                {/* New Password Field */}
                <div className="position-relative mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control text-white pe-5"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "12px", height: "50px" }}
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y pe-3"
                    style={{ cursor: "pointer", zIndex: 10 }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash-fill text-white opacity-75"></i>
                    ) : (
                      <i className="bi bi-eye-fill text-white opacity-75"></i>
                    )}
                  </span>
                </div>

                {/* Confirm Password Field */}
                <div className="position-relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control text-white pe-5"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "12px", height: "50px" }}
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y pe-3"
                    style={{ cursor: "pointer", zIndex: 10 }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <i className="bi bi-eye-slash-fill text-white opacity-75"></i>
                    ) : (
                      <i className="bi bi-eye-fill text-white opacity-75"></i>
                    )}
                  </span>
                </div>

                {/* Reset Button */}
                <button
                  className="btn w-100 text-white fw-medium"
                  style={{
                    backgroundColor: "#4285AC",
                    borderRadius: "5px",
                    height: "50px",
                    fontSize: "16px",
                  }}
                  type="submit"
                  disabled={loading || !password || password !== confirmPassword}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              {message && <p className="mt-3 text-success text-center fw-medium">{message}</p>}
              {error && <p className="mt-3 text-danger text-center bg-white bg-opacity-10 p-3 rounded">{error}</p>}
            </>
          )}

          {/* {message && <p className="mt-3 success-message">{message}</p>} */}
          {error && <p className="mt-3 text-white bg-danger p-2 rounded">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

