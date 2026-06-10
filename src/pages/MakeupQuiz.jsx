import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/VirtualTryOn.css"; // Your custom CSS
import Header from "../components/common/Header";

export default function Virtualtryon() {
  const navigate = useNavigate();

  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMakeupGuide = async () => {
      try {
        const response = await fetch("https://beauty.joyory.com/api/user/for-you/makeup-guide");
        const result = await response.json();

        if (result.success && result.data) {
          setGuideData(result.data);
        } else {
          setError("Failed to load makeup guide data");
        }
      } catch (err) {
        setError("Error fetching makeup guide");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMakeupGuide();
  }, []);

  const handleNextClick = () => {
    navigate("/shadefinder"); // your next page
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="virtualtryon-container pt-5 mt-2 text-center">
          <p>Loading makeup guide...</p>
        </div>
      </>
    );
  }

  if (error || !guideData) {
    return (
      <>
        <Header />
        <div className="virtualtryon-container pt-5 mt-2 text-center">
          <p style={{ color: "red" }}>{error || "No data available"}</p>
        </div>
      </>
    );
  }

  const { title, description, heroImage, steps } = guideData;

  return (
    <>
      <Header />

      <div className="virtualtryon-container pt-5 mt-2">

        {/* Hero Section – now dynamic */}
        <header className="hero-sections mt-lg-5 pt-lg-5 mt-2">
          <img
            src={heroImage}
            alt={title || "Makeup Guide"}
            className="hero-image"
            style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
          />
          {/* <div className="hero-content">
            <h1 className="hero-title page-title-main-name">{title}</h1>
            <p className="hero-description page-title-main-name">{description}</p>
          </div> */}
        </header>

        {/* How It Works Section – dynamic steps */}
        <section className="how-it-works-section">
          <h2 className="section-title page-title-main-name">
            Start Your Makeup By
          </h2>

          <div className="steps-container">
            <div className="row mb-lg-5 gaps-for-responsive">
              {steps
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((step) => (

                  <div className="col-lg-4 col-md-6">

                    <div className="" key={step._id}>
                      <img
                        src={step.image}
                        alt={step.stepTitle}
                        className="step-image img-fluid"
                      />
                      <h3 className="step-number page-title-main-name">
                        {step.stepTitle}
                      </h3>
                      <p className="step-description page-title-main-name">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                ))}
            </div>
          </div>
        </section>

        {/* Next Button – unchanged */}
        <div className="next-button-makeupquiz margin-bottomsss-virtus-truon">
          <div className="next-button-makupbtns">
            <button className="page-title-main-name" onClick={handleNextClick}>
              Let's Go  <FaArrowRight className="next-icon ms-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}