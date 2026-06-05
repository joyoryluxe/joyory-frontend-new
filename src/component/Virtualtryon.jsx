import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/Virtualtryon.css"; // Custom CSS for styling
import Header from "./Header";
import virtualTryOnHero from "../assets/Virtual-tryon.webp";
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import step3 from "../assets/step3.png";

export default function Virtualtryon() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Set loading to false after component mounts or after a timeout
  useEffect(() => {
    // Option 1: Set loading to false after a short delay (for animation visibility)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show loader for 2 seconds

    // Option 2: If you want to hide loader immediately after mount
    // setLoading(false);

    return () => clearTimeout(timer);
  }, []);

  const handleNextClick = () => {
    navigate("/Mainvirtualtryon"); // Navigate to your main virtual try-on page
  };

  if (loading) {
    return (
      <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact 
            style={{ height: '80%', width: '100%' }}
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="virtualtryon-container">
        {/* Hero Section */}
        <header className="hero-sections mt-lg-5 pt-lg-5 mt-2 w-100">
          <img
            src={virtualTryOnHero}
            alt="Virtual Try-On"
            className="hero-image img-fluid"
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
          />
        </header>

        {/* How It Works Section */}
        <section className="how-it-works-section container">
          <h2 className="section-title page-title-main-name mb-4 text-start">How It Works</h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 col-12">
              <img
                src={step1}
                alt="Step 1"
                className="step-image img-fluid w-100"
              />
              <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                Step <span style={{ color: '#b5845a' }}>1</span>
              </h3>
              <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                Use the Live Camera, upload a photo, or select a model to begin.
              </p>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <img
                src={step2}
                alt="Step 2"
                className="step-image img-fluid w-100"
              />
              <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                Step <span style={{ color: '#b5845a' }}>2</span>
              </h3>
              <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                Browse makeup categories and select the products you'd like to try on.
              </p>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <img
                src={step3}
                alt="Step 3"
                className="step-image img-fluid w-100"
              />
              <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                Step <span style={{ color: '#b5845a' }}>3</span>
              </h3>
              <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                Use the slider to compare before and after to find your ideal combination.
              </p>
            </div>
          </div>
        </section>

        {/* Next Button */}
        <div className="next-button-makeupquiz margin-bottomsss-virtus-truon d-flex justify-content-center w-100">
          <div className="next-button-makupbtns">
            <button className="page-title-main-name" onClick={handleNextClick}>
              Let's Go <FaArrowRight className="next-icon ms-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}