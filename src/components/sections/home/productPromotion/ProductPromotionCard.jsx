/**
 * ProductPromotionCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Individual Promotional Campaign Banner card with overlay text,
 * discount badge, and action button for ProductPromotion slider.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const ProductPromotionCard = ({ slide }) => {
  const navigate = useNavigate();

  if (!slide) return null;

  const handlePromotionClick = () => {
    const { scope, targetSlug, slug, _id } = slide;

    if (scope === "category" && targetSlug) {
      navigate(`/Products/category/${targetSlug}`);
    } else if (scope === "brand" && targetSlug) {
      navigate(`/brand/${targetSlug}`);
    } else if (scope === "product" && targetSlug) {
      navigate(`/product/${targetSlug}`);
    } else {
      const param = slug || _id;
      navigate(`/productpage/${param}`, {
        state: {
          pageTitle: slide.campaignName || slide.title || "Promotion",
        },
      });
    }
  };

  const imageUrl =
    slide.bannerImage ||
    slide.image ||
    slide.desktopBanner ||
    "https://placehold.co/600x400/f5f5f5/333333?text=Special+Promotion";

  return (
    <div
      className="overflow-hidden position-relative"
      style={{ cursor: "pointer" }}
      onClick={handlePromotionClick}
    >
      <div className="product-promotion-card">
        <img
          src={imageUrl}
          alt={slide.campaignName || slide.title || "Promotion"}
          className="product-promotion-img responsive-imagesss"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/f5f5f5/333333?text=Special+Promotion";
          }}
        />
        <div className="product-promotion-overlay">
          <div className="product-promotion-content">
            <span className="product-promotion-badge">
              {slide.badgeText || "Special Offer"}
            </span>
            <h3 className="product-promotion-title">
              {slide.campaignName || slide.title || "Limited Time Deal"}
            </h3>
            <p className="product-promotion-desc">
              {slide.description ||
                "Discover exclusive beauty products at unbeatable prices"}
            </p>
            <button className="product-promotion-btn">
              {slide.buttonText || "Shop Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPromotionCard;
