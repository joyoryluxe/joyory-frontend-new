/**
 * BuildCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Sub-component for Skin Quiz Feature Banner card with responsive picture tag.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import quizMobileBanner from "../../../../assets/quiz_mobile_banner.png";

const BuildCard = ({ banner, onClick }) => {
  if (!banner) return null;

  const getBannerImage = (b) => {
    if (b.image?.[0]?.url) return b.image[0].url;
    if (typeof b.image === "string") return b.image;
    return "/placeholder-banner.jpg";
  };

  return (
    <div
      className="feature-banner-card mb-5 mobile-responsive-code"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="border-0 overflow-hidden">
        <div className="row g-0">
          <div className="col-12">
            <div className="quiz-banner-image-wrapper d-flex justify-content-center">
              <picture className="w-100 h-100">
                <source media="(max-width: 768px)" srcSet={quizMobileBanner} />
                <img
                  src={getBannerImage(banner)}
                  alt={banner.title || "Feature"}
                  className="w-100 img-fluid quiz-banner-image"
                  onError={(e) => {
                    e.target.src = "/placeholder-banner.jpg";
                    e.target.style.objectFit = "contain";
                    e.target.style.padding = "40px";
                    e.target.style.background = "#f8f9fa";
                  }}
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildCard;
