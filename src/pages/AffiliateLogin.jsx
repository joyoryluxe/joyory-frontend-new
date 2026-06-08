import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/login-image.png";
import Logo from "../assets/Logo.png";
import "../styles/AffiliateLogin.css";

const Affiliatelogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const API_LOGIN_URL = "https://beauty.joyory.com/api/affiliate/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("joyoryAffiliateToken", data.token);
        localStorage.setItem("joyoryAffiliateUser", JSON.stringify(data.user));

        navigate("/Affiliatedashboard");
      } else {
        setApiError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Network error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* LEFT SIDE - IMAGE */}
        <div className="col-12 col-lg-6 d-none d-lg-block">
          <img
            src={loginImg}
            alt="Login Banner"
            className="img-fluid w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: "410px" }}>

            {/* LOGO */}
            <div className="text-center mb-3">
              <img src={Logo} alt="Joyory Logo" style={{ width: "90px" }} />
            </div>

            {/* TITLE */}
            <h2 className="fw-bold text-center mb-4" style={{ color: "#3c7aa2" }}>
              Login
            </h2>

            {/* ERROR MESSAGE */}
            {apiError && (
              <div className="alert alert-danger py-2 text-center">
                {apiError}
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit}>
              <label className="form-label fw-semibold mb-1">Email address</label>
              <input
                type="email"
                className="form-control mb-3"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label className="form-label fw-semibold mb-1">Password</label>
              <input
                type="password"
                className="form-control mb-2"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {/* Remember + Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="form-check-input me-2"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </div>

                <Link className="text-danger" style={{ fontSize: "14px" }}>
                  Forgot password ?
                </Link>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="btn w-100 text-white fw-bold"
                disabled={loading}
                style={{
                  background: "#3c7aa2",
                  padding: "12px",
                  fontSize: "18px",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* REGISTER */}
            <p className="text-center mt-3">
              Don’t have an account?{" "}
              <Link to="/affiliatesignup" className="fw-bold" style={{ color: "#3c7aa2" }}>
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Affiliatelogin;
