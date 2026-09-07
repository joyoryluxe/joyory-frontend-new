/**
 * VirtualTryOnCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Sub-component for Virtual Try-On Banner slide with responsive picture tag.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import vtoMobileBanner from "../../../../assets/vto_mobile_banner.png";

const VirtualTryOnCard = ({ banner, onClick }) => {
  if (!banner) return null;

  return (
    <div
      className="banner-slide position-relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="vto-banner-image-wrapper d-flex justify-content-center">
        <picture className="w-100 h-100">
          <source media="(max-width: 768px)" srcSet={vtoMobileBanner} />
          <img
            src={banner.image}
            alt={banner.title || "Virtual Try On"}
            className="img-fluid w-100 margin-left-for-Virtualtryonhome vto-banner-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/1920x600/667eea/ffffff?text=Virtual+Try+On";
            }}
          />
        </picture>
      </div>
    </div>
  );
};

export default VirtualTryOnCard;
