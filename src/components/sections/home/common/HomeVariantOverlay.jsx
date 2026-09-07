/**
 * HomeVariantOverlay.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable Variant Selection Modal & Mobile Bottom-Sheet for
 * Home Page product sliders (BestSellers & ForYou).
 * Includes desktop popup modal and mobile bottom sheet drawer.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { FaCheck } from "react-icons/fa";
import bagIcon from "../../../../assets/bag.svg";
import { formatPrice } from "../../../../utils/priceHelpers";
import {
  getVariantDisplayText,
  getSku,
  groupVariantsByType,
} from "../../../../utils/variantHelpers";

// Helper to safely check if a variant is explicitly out of stock
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

const HomeVariantOverlay = ({
  isOpen,
  product,
  allVariants = [],
  displayVariant = {},
  tempSelectedVariant = null,
  isAdding = false,
  onVariantSelect,
  onTempVariantSelect,
  onAddToCart,
  onProductClick,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const groupedVariants = groupVariantsByType(allVariants);
  const activeVariant =
    tempSelectedVariant ||
    displayVariant ||
    allVariants.find((v) => !isOOS(v)) ||
    allVariants[0] ||
    {};
  const isCurrentVariantOutOfStock = isOOS(activeVariant);

  const hasColorVariants = groupedVariants.color.length > 0;
  const hasTextVariants = groupedVariants.text.length > 0;

  const handleSelect = (v) => {
    if (onVariantSelect) onVariantSelect(product._id, v);
    if (onTempVariantSelect) onTempVariantSelect(product._id, v);
  };

  const handleConfirmAddToCart = async (e) => {
    e.stopPropagation();
    const chosen =
      tempSelectedVariant ||
      displayVariant ||
      allVariants.find((v) => v.stock > 0) ||
      allVariants[0];

    if (chosen && onVariantSelect) {
      onVariantSelect(product._id, chosen);
    }
    if (onAddToCart) {
      await onAddToCart(product, chosen);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* ── 1. DESKTOP VARIANT OVERLAY ── */}
      <div
        className="variant-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          className="variant-overlay-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="m-0 page-title-main-name">Select Variant</h5>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "40px",
                lineHeight: "1",
                cursor: "pointer",
              }}
              aria-label="Close variant selector"
            >
              ×
            </button>
          </div>

          {/* Body Content */}
          <div className="variant-overlay-body">
            {/* Color Swatches */}
            {hasColorVariants && (
              <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center mb-3">
                {groupedVariants.color.map((v) => {
                  const isSelected = activeVariant.sku === v.sku;
                  const isOutOfStock = isOOS(v);

                  return (
                    <div
                      key={getSku(v) || v._id}
                      style={{
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(v);
                      }}
                      title={v.shadeName || v.name}
                    >
                      {isOutOfStock ? (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "6px",
                            backgroundColor: "#fde8e8",
                            border: isSelected
                              ? "2px solid #000"
                              : "1px solid #f8b4b4",
                            color: "#e02424",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          ✕
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "6px",
                            backgroundColor: v.hex || "#ccc",
                            border: isSelected
                              ? "3px solid #000"
                              : "1px solid #ddd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSelected && (
                            <span
                              style={{
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: 14,
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Text Variants */}
            {hasTextVariants && (
              <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center mb-3">
                {groupedVariants.text.map((v) => {
                  const isSelected = activeVariant.sku === v.sku;
                  const isOutOfStock = isOOS(v);

                  return (
                    <div
                      key={getSku(v) || v._id}
                      className="variant-text-item"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(v);
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: isSelected
                            ? "2px solid #000"
                            : isOutOfStock
                            ? "1px solid #f8b4b4"
                            : "1px solid #ddd",
                          backgroundColor: isOutOfStock
                            ? "#fde8e8"
                            : isSelected
                            ? "#f8f9fa"
                            : "#fff",
                          color: isOutOfStock ? "#e02424" : "#333",
                          fontWeight: isSelected ? "600" : "400",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {getVariantDisplayText(v)}
                        {isOutOfStock && <span>✕</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="variant-overlay-footer">
            <div className="small text-muted fw-semibold">
              Selected:{" "}
              <span className="text-dark fw-bold">
                {getVariantDisplayText(activeVariant)}
              </span>
            </div>
            <div className="mt-1 mb-2 text-start">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (onProductClick) onProductClick(product);
                  onClose();
                }}
                className="text-decoration-none fw-semibold"
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                View Details
              </span>
            </div>
            {isCurrentVariantOutOfStock ? (
              <button
                className="btn w-100 d-flex align-items-center justify-content-center"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onProductClick) onProductClick(product);
                  if (onClose) onClose();
                }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d0d0",
                  color: "#888888",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Out of Stock
              </button>
            ) : (
              <button
                className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${
                  isAdding ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={handleConfirmAddToCart}
                disabled={isAdding}
                style={{
                  transition: "background-color 0.3s ease, color 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {isAdding ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Adding...
                  </>
                ) : (
                  <>
                    Add to Bag
                    <img
                      src={bagIcon}
                      className="img-fluid ms-1"
                      style={{ marginTop: "-3px", height: "20px" }}
                      alt="Bag-icon"
                    />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. MOBILE BOTTOM-SHEET DRAWER ── */}
      <div
        className="mobile-sheet-backdrop"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        className="mobile-sheet-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag grabber */}
        <div
          className="mobile-sheet-grabber"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        />

        {/* Header */}
        <div className="mobile-sheet-header">
          <h3 className="mobile-sheet-title">
            {hasColorVariants ? "Select Shade" : "Select Variant"}
          </h3>
          <button className="mobile-sheet-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body content with scrolling swatches */}
        <div className="mobile-sheet-body">
          {hasColorVariants && (
            <div className="mobile-sheet-variants-grid">
              {groupedVariants.color.map((v) => {
                const isSelected = activeVariant.sku === v.sku;
                const isOutOfStock = isOOS(v);
                const variantText = getVariantDisplayText(v);

                return (
                  <div
                    key={getSku(v) || v._id}
                    className={`mobile-sheet-variant-item ${
                      isSelected ? "selected" : ""
                    } ${isOutOfStock ? "oos" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(v);
                    }}
                  >
                    <div
                      className={`mobile-sheet-color-circle ${
                        isSelected ? "selected" : ""
                      } ${isOutOfStock ? "oos" : ""}`}
                      style={{
                        backgroundColor: v.hex || "#ccc",
                        position: "relative",
                      }}
                    >
                      {isSelected && (
                        <FaCheck className="mobile-sheet-check-icon" />
                      )}
                      {isOutOfStock && (
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "14px",
                            pointerEvents: "none",
                          }}
                        >
                          ✕
                        </span>
                      )}
                    </div>
                    <span className="mobile-sheet-variant-text">
                      {variantText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {hasTextVariants && !hasColorVariants && (
            <div className="mobile-sheet-variants-grid">
              {groupedVariants.text.map((v) => {
                const isSelected = activeVariant.sku === v.sku;
                const isOutOfStock = isOOS(v);
                const variantText = getVariantDisplayText(v);

                return (
                  <div
                    key={getSku(v) || v._id}
                    className="mobile-sheet-variant-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(v);
                    }}
                  >
                    <button
                      className={`mobile-sheet-text-pill ${
                        isSelected ? "selected" : ""
                      } ${isOutOfStock ? "oos" : ""}`}
                    >
                      <span>{variantText}</span>
                      {isSelected && <FaCheck style={{ fontSize: "10px" }} />}
                      {isOutOfStock && (
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            marginLeft: "6px",
                            fontSize: "12px",
                          }}
                        >
                          ✕
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mobile-sheet-footer">
          <div className="mobile-sheet-footer-left">
            <span className="mobile-sheet-selected-label">
              {getVariantDisplayText(activeVariant)}
            </span>
            <div className="mobile-sheet-price-row">
              <span className="mobile-sheet-current-price">
                {formatPrice(activeVariant.displayPrice)}
              </span>
              {activeVariant.originalPrice > activeVariant.displayPrice && (
                <>
                  <span className="mobile-sheet-original-price">
                    {formatPrice(activeVariant.originalPrice)}
                  </span>
                  <span className="mobile-sheet-discount">
                    ({activeVariant.discountPercent || 0}% OFF)
                  </span>
                </>
              )}
            </div>
          </div>
          <span
            className="mobile-sheet-view-details"
            onClick={(e) => {
              e.stopPropagation();
              if (onProductClick) onProductClick(product);
              onClose();
            }}
          >
            View Details
          </span>
        </div>

        {/* Action button */}
        <div className="mobile-sheet-action-wrap">
          <button
            className="mobile-sheet-btn-add"
            disabled={isAdding || isCurrentVariantOutOfStock}
            onClick={handleConfirmAddToCart}
          >
            {isAdding ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>{" "}
                Adding...
              </>
            ) : isCurrentVariantOutOfStock ? (
              "Out of Stock"
            ) : (
              "Add to Bag"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default HomeVariantOverlay;
