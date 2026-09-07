/**
 * BannerCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Sub-component for Shade Finder banner slide with responsive picture tag.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import shadeFinderMobileBanner from "../../../../assets/shade_finder_mobile_banner.png";

const BannerCard = ({ banner, onClick }) => {
  if (!banner) return null;

  return (
    <div
      className="banner-slide position-relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="shade-banner-image-wrapper d-flex justify-content-center">
        <picture className="w-100 h-100">
          <source media="(max-width: 768px)" srcSet={shadeFinderMobileBanner} />
          <img
            src={banner.image}
            alt={banner.title || "Shade Finder"}
            className="img-fluid w-100 margin-left-for-Virtualtryonhome shade-banner-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/1920x600/764ba2/ffffff?text=Shade+Finder";
            }}
          />
        </picture>
      </div>
    </div>
  );
};

export default BannerCard;
