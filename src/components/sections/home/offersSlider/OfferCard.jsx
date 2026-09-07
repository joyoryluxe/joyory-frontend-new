/**
 * OfferCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Individual Offer/Promotion slide card for OffersSlider.
 * Supports scope-based routing (category, brand, product, promo).
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const OfferCard = ({ promotion }) => {
  const navigate = useNavigate();

  if (!promotion) return null;

  const handlePromotionClick = () => {
    const { scope, targetSlug, slug, _id } = promotion;

    if (scope === "category" && targetSlug) {
      navigate(`/Products/category/${targetSlug}`);
    } else if (scope === "brand" && targetSlug) {
      navigate(`/brand/${targetSlug}`);
    } else if (scope === "product" && targetSlug) {
      navigate(`/product/${targetSlug}`);
    } else {
      const param = slug || _id;
      navigate(`/promotion/${param}`);
    }
  };

  const imageUrl =
    Array.isArray(promotion.images) && promotion.images.length > 0
      ? promotion.images[0]
      : "/assets/images/placeholder-offer.jpg";

  return (
    <div
      className="offer-card"
      style={{ cursor: "pointer" }}
      onClick={handlePromotionClick}
    >
      <div className="offer-image-container">
        <img
          src={imageUrl}
          alt={promotion.title || "Promotion"}
          className="img-fluid offer-image"
          onError={(e) => {
            e.target.src = "/assets/images/placeholder-offer.jpg";
          }}
        />
      </div>

      <div className="offer-details mt-3 text-start">
        <h3 className="offer-title offer-title-responsie-title font-weightss page-title-main-name">
          {promotion.title}
        </h3>
      </div>
    </div>
  );
};

export default OfferCard;
