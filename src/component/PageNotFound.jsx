// src/pages/PageNotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import "../css/404.css"; // We'll create this CSS file

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Header /> */}

      <div className="not-found-container mt-0">
        <div className="not-found-content">
          {/* Big 404 Number */}
          <div className="error-code">
            <h1>404</h1>
          </div>

          {/* Illustration / Emoji */}
          <div className="not-found-illustration">
            <span className="sad-face">😕</span>
          </div>

          {/* Message */}
          <h2 className="not-found-title">Oops! Page Not Found</h2>
          <p className="not-found-subtitle">
            The page you're looking for seems to have wandered off into the beauty aisle.
            <br />
            Don't worry, we've got plenty of great products waiting for you!
          </p>

          {/* Action Buttons */}
          <div className="not-found-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate("/")}
            >
              <FaHome className="me-2" />
              Go Back Home
            </button>

            <button 
              className="btn-primary"
              onClick={() => navigate("/search")}
            >
              <FaSearch className="me-2" />
              Search Products
            </button>

            {/* <button 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="me-2" />
              Go Back
            </button> */}
          </div>

          {/* Popular Links */}
          <div className="popular-links">
            <p className="mb-3 fw-bold text-white">Or try these popular pages:</p>
            <div className="link-grid">
              <a href="/category/makeup" className="quick-link">Makeup</a>
              <a href="/category/skincare" className="quick-link">Skincare</a>
              <a href="/shadefinder" className="quick-link">Shade Finder</a>
              <a href="/foryoulanding" className="quick-link">For You</a>
              <a href="/virtualtryon" className="quick-link">Virtual Try-On</a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="decorative-elements">
          <div className="beauty-dot dot1"></div>
          <div className="beauty-dot dot2"></div>
          <div className="beauty-dot dot3"></div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default PageNotFound;