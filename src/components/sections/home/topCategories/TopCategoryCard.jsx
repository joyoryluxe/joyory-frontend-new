/**
 * TopCategoryCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Individual Category Card item for TopCategories slider.
 * Handles sub-category routing, image error fallbacks, and text styling.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const TopCategoryCard = ({ category, index = 0 }) => {
  const navigate = useNavigate();

  if (!category) return null;

  const handleClick = () => {
    if (category.subCategories && category.subCategories.length > 0) {
      navigate(`/category/${category.slug}`);
    } else {
      navigate(`/Products/category/${category.slug}`);
    }
  };

  return (
    <div
      className="slide-item"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="border-0 top-cat-card">
        <img
          src={
            category.thumbnailImage ||
            `https://picsum.photos/400/200?random=${index}`
          }
          alt={category.name || "Category"}
          className="top-cat-img top-category-image responsive-imagesss"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/400/200?random=${index}`;
          }}
        />
        <div className="top-cat-body text-start">
          <h5 className="top-cat-title mb-0 mt-3 font-weightss top-category-name-font text-start">
            {category.name || "Unnamed"}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default TopCategoryCard;
