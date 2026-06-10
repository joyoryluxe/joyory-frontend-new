import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import "../styles/Login.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Logo from "../assets/logos.webp";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
    promo: "",
  });

  const [selectedOption, setSelectedOption] = useState(""); // "", "referral", "promo"
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ TOGGLE LOGIC (MAIN FIX)
  const handleOptionChange = (value) => {
    if (selectedOption === value) {
      // same clicked again → unselect
      setSelectedOption("");
    } else {
      // select new one
      setSelectedOption(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        referralCode:
          selectedOption === "referral"
            ? formData.referralCode.trim()
            : undefined,
        promo:
          selectedOption === "promo"
            ? formData.promo.trim()
            : undefined,
      };

      const res = await fetch(
        "https://beauty.joyory.com/api/user/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Signup successful! OTP sent to your email.");
        setTimeout(
          () => navigate("/otp", { state: { email: formData.email } }),
          1500
        );
      } else {
        setErrorMsg(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg page-title-main-name">
      <div className="signup-wrapper auth-bg">
        <div className="signup-right">
          <div className="signup-card glass">

            <img
              src={Logo}
              alt="Logo"
              className="img-fluid w-50 mx-auto d-block mb-5"
              style={{ marginTop: "-25px" }}
            />

            <form onSubmit={handleSubmit}>
              
              {/* Name */}
              <label className="text-white ms-2 fs-5">User name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter User Name"
                className="form-control mb-3 mt-3"
                value={formData.name}
                onChange={handleChange}
                required
              />

              {/* Email */}
              <label className="text-white ms-2 fs-5">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                className="form-control mb-3 mt-3"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {/* Password */}
              <label className="text-white ms-2 fs-5">Password</label>

              <div className="password-field position-relative">
                <input
                  type={passwordType}
                  name="password"
                  placeholder="**********"
                  className="form-control mb-3 mt-3"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <span
                  onClick={togglePassword}
                  className="password-toggle"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {passwordType === "password" ? (
                    <i className="bi bi-eye-slash text-white"></i>
                  ) : (
                    <i className="bi bi-eye text-white"></i>
                  )}
                </span>
              </div>

              {/* ✅ Toggle Options */}
              <label className="text-white ms-2 fs-5">Choose Option</label>

              <div className="d-flex align-items-center gap-4 mt-2 mb-3 ms-2">

                <div>
                  <input
                    type="checkbox"
                    checked={selectedOption === "referral"}
                    onChange={() => handleOptionChange("referral")}
                    className="me-2"
                  />
                  <label className="text-white">Referral Code</label>
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={selectedOption === "promo"}
                    onChange={() => handleOptionChange("promo")}
                    className="me-2"
                  />
                  <label className="text-white">Promo Code</label>
                </div>

              </div>

              {/* Conditional Inputs */}
              {selectedOption === "referral" && (
                <input
                  type="text"
                  name="referralCode"
                  placeholder="Enter Referral Code"
                  className="form-control mb-4"
                  value={formData.referralCode}
                  onChange={handleChange}
                />
              )}

              {selectedOption === "promo" && (
                <input
                  type="text"
                  name="promo"
                  placeholder="Enter Promo Code"
                  className="form-control mb-4"
                  value={formData.promo}
                  onChange={handleChange}
                />
              )}

              {/* Messages */}
              {errorMsg && <p className="text-danger">{errorMsg}</p>}
              {successMsg && <p className="color-change">{successMsg}</p>}

              <button className="submit-btn mb-3" disabled={loading}>
                {loading ? "Creating..." : "Register"}
              </button>

              <Link
                to="/login"
                className="text-center d-block text-white text-decoration-none"
              >
                Already Have An Account? Login
              </Link>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;