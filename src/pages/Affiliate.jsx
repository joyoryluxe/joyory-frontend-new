import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Affiliate.css";
import affiliatehero from "../assets/affiliate-hero.png";
import { useNavigate } from "react-router-dom";

const Affiliate = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/Affiliatelogin"); // redirect page
  };

  return (
    <>
      <div className="mb-3">
        <img
          src={affiliatehero}
          alt="Affiliate Program"
          className="img-fluid rounded affiliate-img"
        />
      </div>

      <div className="affiliate-banner container-fluid py-5 px-4 px-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9 text-center">
            <h3 className="display-5 fw-bold mb-4">
              Join the Joyory Affiliate Program
            </h3>

            <div className="description mb-4 mx-auto px-lg-5">
              <p className="lead text-secondary">
                Our exclusive affiliate program is a great fit for publishers, bloggers, media networks, influencers and industry leaders with large audience. Sign up today and you’ll get industry-leading commissions, a 30-day cookie, real time tracking and reporting, full access to Joyory’s creative library and a dedicated support staff.
              </p>
            </div>

            <div className="mb-5" style={{ opacity: "0.5" }}>
              <span className="badge bg-light text-dark fs-4 fw-bold shadow-sm" style={{ display: "contents" }}>
                5 min to complete
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              className="btn get-start-button btn-lg fw-bold px-5 py-3 w-50"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Affiliate;
