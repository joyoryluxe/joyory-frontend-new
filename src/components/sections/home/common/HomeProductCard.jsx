/**
 * HomeProductCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable Product Card for Home Page Sliders (BestSellers & ForYou).
 * Renders product image, VTO badge, wishlist toggle, pricing,
 * discount message, and Add to Bag / Select Variant / Out of Stock buttons.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import bagIcon from "../../../../assets/bag.svg";
import { formatPrice } from "../../../../utils/priceHelpers";
import { getVariantDisplayText } from "../../../../utils/variantHelpers";
import HomeVariantOverlay from "./HomeVariantOverlay";

// Helper to safely check if a product/variant is explicitly out of stock
const isOOS = (obj) => {
  if (!obj) return false;
  if (obj.isCompletelyOutOfStock === true) return true;
  if (obj.status === "outOfStock" || obj.status === "out-of-stock") return true;
  if (obj.stock !== undefined && obj.stock !== null) {
    const num = Number(obj.stock);
    return !isNaN(num) && num <= 0;
  }
  return false;
};

const HomeProductCard = ({
  item,
  displayVariant,
  tempSelectedVariant,
  showVariantOverlay,
  isProductInWishlist,
  isWishlistLoading,
  isAddingToCart,
  onProductClick,
  onToggleWishlist,
  onAddToCart,
  onOpenVariantOverlay,
  onCloseVariantOverlay,
  onVariantSelect,
  onTempVariantSelect,
}) => {
  if (!item) return null;

  const allVariants = item.allVariants || item.variants || [];
  const currentVariant = displayVariant || item.variant || {};

  // STRICT RULE: A product HAS variants ONLY if there are MORE THAN 1 variant (2 or more to choose between)!
  // Single-variant products (1 variant) are treated as single products without variant overlay.
  const hasVariants = allVariants.length > 1;

  const isCompletelyOutOfStock =
    item.isCompletelyOutOfStock === true ||
    (hasVariants
      ? allVariants.every((v) => isOOS(v))
      : isOOS(item) || isOOS(currentVariant));

  const isCurrentVariantOutOfStock = isOOS(currentVariant);

  let buttonText = "Add to Bag";
  let buttonClass = "btn-outline-dark";
  let isNoVarOos = false;

  if (isAddingToCart) {
    buttonText = "Adding...";
  } else if (hasVariants) {
    // Multiple variants product
    if (isCompletelyOutOfStock || isCurrentVariantOutOfStock) {
      buttonText = "Select Variant";
      buttonClass = "btn-outline-dark";
    } else {
      buttonText = "Add to Bag";
      buttonClass = "btn-outline-dark";
    }
  } else {
    // Single product / No variants
    if (isCompletelyOutOfStock || isCurrentVariantOutOfStock) {
      isNoVarOos = true;
      buttonText = "Out of Stock";
      buttonClass = "btn-dark"; // Solid black button for out of stock
    } else {
      buttonText = "Add to Bag";
      buttonClass = "btn-outline-dark";
    }
  }

  let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
  const variantImg = currentVariant?.images?.[0] || currentVariant?.image;
  const itemImg = item.image || item.displayImage || item.images?.[0];
  const targetImg = variantImg || itemImg;
  if (targetImg) {
    imageUrl = targetImg.startsWith("http")
      ? targetImg
      : `https://res.cloudinary.com/dekngswix/image/upload/${targetImg}`;
  }

  const isOverlayOpen = showVariantOverlay === item._id;

  return (
    <div className="foryou-card-wrapper">
      <div className="foryou-card" style={{ position: "relative" }}>
        {/* Product Image */}
        <div
          className="foryou-img-wrapper"
          onClick={() => onProductClick(item)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <img
            src={imageUrl}
            alt={item.name || "Product"}
            className="foryou-img img-fluid"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/400x300/ffffff/cccccc?text=Product";
            }}
          />

          {/* VTO TRY IT ON Badge */}
          {item?.supportsVTO && (
            <div
              className="support-beauty-badge"
              title="Try It On"
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(item);
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <path d="M8 10a4 4 0 1 1 8 0c0 2.2-1.8 4-4 4s-4-1.8-4-4z" />
                <path d="M10 10h.01" />
                <path d="M14 10h.01" />
                <path d="M10 13c.5.5 1.5.7 2 .7s1.5-.2 2-.7" />
                <path d="M6 19c0-1.5 1.5-2.5 6-2.5s6 1 6 2.5" />
              </svg>
              <span className="vto-text">TRY IT ON</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            className={`product-card-wishlist-btn ${
              isProductInWishlist ? "in-wishlist" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (currentVariant) {
                onToggleWishlist(item, currentVariant, e);
              }
            }}
            disabled={isWishlistLoading}
            title={
              isProductInWishlist
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            {isWishlistLoading ? (
              <div
                className="spinner-border spinner-border-sm"
                role="status"
              ></div>
            ) : isProductInWishlist ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
          <div
            className="justify-content-between d-flex flex-column"
            style={{ height: "200px" }}
          >
            {/* Brand Name */}
            <div className="brand-name small text-muted text-start mb-1 mt-2">
              {typeof item.brandName === "string"
                ? item.brandName
                : "Unknown Brand"}
            </div>

            {/* Product Title */}
            <div className="product-card-title-wrap">
              <h6
                className="foryou-name m-0 p-0"
                onClick={() => onProductClick(item)}
                style={{ cursor: "pointer" }}
              >
                {(() => {
                  const varText = currentVariant
                    ? getVariantDisplayText(currentVariant)
                    : "";
                  const nameStr = item.name || "Unnamed Product";
                  return hasVariants && varText && varText.toUpperCase() !== "DEFAULT"
                    ? `${nameStr} - ${varText}`
                    : nameStr;
                })()}
              </h6>
            </div>

            {/* Price Section */}
            <div className="price-section mb-3 mt-auto">
              <div className="d-flex align-items-baseline flex-wrap">
                <span className="current-price fw-400 fs-5">
                  {formatPrice(currentVariant.displayPrice)}
                </span>

                {currentVariant.originalPrice > currentVariant.displayPrice && (
                  <>
                    <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                      {formatPrice(currentVariant.originalPrice)}
                    </span>
                    <span className="discount-percent fw-bold ms-2">
                      ({currentVariant.discountPercent || 0}% OFF)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Next Order Discount Message Tag */}
            {item.nextOrderDiscountMessage && (
              <div
                className="next-order-discount-tag"
                title={item.nextOrderDiscountMessage}
                onClick={(e) => {
                  e.stopPropagation();
                  window.showDiscountPopup &&
                    window.showDiscountPopup(
                      item.nextOrderDiscountMessage,
                      e.currentTarget
                    );
                }}
              >
                <span className="text-truncate">
                  {item.nextOrderDiscountMessage}
                </span>
              </div>
            )}

            {/* Action Button */}
            <div className="cart-section">
              <div className="d-flex align-items-center justify-content-between">
                <button
                  className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${buttonClass}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasVariants) {
                      onOpenVariantOverlay(item._id, "all", e);
                    } else if (isNoVarOos) {
                      onProductClick(item);
                    } else {
                      onAddToCart(item, currentVariant);
                    }
                  }}
                  disabled={isAddingToCart}
                  style={{
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  {isAddingToCart ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      {buttonText}
                      <img
                        src={bagIcon}
                        className="img-fluid ms-1"
                        style={{ marginTop: "-3px", height: "20px" }}
                        alt="Bag-icon"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Render Bounded Variant Overlay INSIDE the product card container */}
        {isOverlayOpen && hasVariants && (
          <HomeVariantOverlay
            isOpen={true}
            product={item}
            allVariants={allVariants}
            displayVariant={currentVariant}
            tempSelectedVariant={tempSelectedVariant}
            isAdding={isAddingToCart}
            onVariantSelect={onVariantSelect}
            onTempVariantSelect={onTempVariantSelect}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
            onClose={onCloseVariantOverlay}
          />
        )}
      </div>
    </div>
  );
};

export default HomeProductCard;
