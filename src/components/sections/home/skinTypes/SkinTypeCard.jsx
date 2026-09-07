/**
 * SkinTypeCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Individual Skin Type card for SkinTypes section slider.
 * Navigates to products page with active skin type filter.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SkinTypeCard = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!type) return null;

  const handleSkinTypeClick = () => {
    navigate(`/products/skintype/${type.slug}`, {
      state: {
        activeSkinTypeSlug: type.slug,
        activeSkinTypeName: type.name,
        fromSkinTypes: true,
        ...location.state,
      },
    });
  };

  return (
    <div
      className="p-2"
      onClick={handleSkinTypeClick}
      style={{ cursor: "pointer" }}
    >
      <div className="skin-card">
        <img
          src={type.image || "https://via.placeholder.com/400x250"}
          alt={type.name}
          className="img-fluid"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default SkinTypeCard;
