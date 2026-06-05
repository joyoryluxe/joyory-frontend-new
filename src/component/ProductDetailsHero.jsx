// src/components/ProductDetailsHero.jsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  FaStar, FaHeart, FaRegHeart, FaShoppingBag,
  FaChevronUp, FaChevronDown, FaTimes, FaCheck
} from "react-icons/fa";
import "../css/ProductDetailsHero.css";
import "../css/Foryou.css";

// --- Helper Functions ---
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const normalized = hex.trim().toLowerCase();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
};

const getVariantDisplayText = (variant) => {
  return (
    variant.shadeName ||
    variant.name ||
    variant.size ||
    variant.ml ||
    variant.weight ||
    "Default"
  ).toUpperCase();
};

// Check if variant is out of stock
const isOutOfStock = (variant) => {
  if (variant.stock === undefined || variant.stock === null) return false;
  return Number(variant.stock) <= 0;
};

const formatPrice = (price) => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return "₹0";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numPrice);
};

// Description Accordion
const ProductDetailDescription = ({ product }) => {
  return (
    <section className="product-extra-section mt-5 border-none">
      <div className="details-section border-none">
        <div className="accordion border-none">
          <details>
            <summary>Description</summary>
            <p className="mt-3">{product.description || "No description available."}</p>
          </details>
          <details>
            <summary>Ingredients</summary>
            <p className="mt-3">
              {product.ingredients?.length > 0
                ? product.ingredients.join(", ")
                : "Ingredients not provided."}
            </p>
          </details>
          <details>
            <summary>How To Use</summary>
            <p className="mt-3">
              {product.howToUse?.length > 0
                ? product.howToUse.join(" • ")
                : "Usage instructions not provided."}
            </p>
          </details>
          <details>
            <summary>Special Features</summary>
            <p className="mt-3">
              {product.features?.length > 0
                ? product.features.join(" • ")
                : "No special features listed."}
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

const ProductDetailsHero = ({
  product,
  selectedShade,
  displayImages: initialDisplayImages,
  reviewSummary,
  variantsList,
  isInWishlist,
  wishlistLoading,
  handleVariantSelect,
  toggleWishlist,
  handleAddToCart,
  setDisplayImages,
  toast
}) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [showVariantOverlay, setShowVariantOverlay] = useState(false);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  const [mainImageIndex, setMainImageIndex] = useState(0);

  const thumbnailsPerView = 4;

  useEffect(() => {
    setMainImageIndex(0);
    setThumbnailStartIndex(0);
  }, [initialDisplayImages]);

  const groupedVariants = useMemo(() => {
    const grouped = { color: [], text: [] };
    variantsList.forEach((v) => {
      if (v.hex && isValidHexColor(v.hex)) {
        grouped.color.push(v);
      } else {
        grouped.text.push(v);
      }
    });
    return grouped;
  }, [variantsList]);

  const showPrevThumbnails = () => setThumbnailStartIndex(prev => Math.max(0, prev - 1));
  const showNextThumbnails = () => setThumbnailStartIndex(prev =>
    Math.min(initialDisplayImages.length - thumbnailsPerView, prev + 1)
  );

  const handleThumbnailClick = (index) => {
    setMainImageIndex(index);
  };

  const handleAddToCartClick = async () => {
    if (!selectedShade) {
      toast.warn("Please select a variant first");
      return;
    }
    if (isOutOfStock(selectedShade)) {
      toast.error("This variant is currently out of stock");
      return;
    }
    setAddingToCart(true);
    try {
      await handleAddToCart();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleVariantClick = (variant) => {
    if (isOutOfStock(variant)) {
      toast.warn("This variant is out of stock");
      return;
    }
    handleVariantSelect(variant);
  };

  const visibleThumbnails = initialDisplayImages.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + thumbnailsPerView
  );

  const canScrollUp = thumbnailStartIndex > 0;
  const canScrollDown = thumbnailStartIndex + thumbnailsPerView < initialDisplayImages.length;

  const currentMainImage = initialDisplayImages[mainImageIndex] || initialDisplayImages[0] || "/placeholder.png";

  return (
    <article className="product-hero-container pb-lg-0 pb-0">

      {/* LEFT: THUMBNAILS + MAIN IMAGE */}
      <div className="product-hero-left">
        <div className="product-hero-image-wrapper">
          <div className="product-hero-thumbnails">
            {initialDisplayImages.length > thumbnailsPerView && (
              <button className="btn btn-link p-0 thumbnail-nav-btn right-sides"
                onClick={showPrevThumbnails} disabled={!canScrollUp}>
                <FaChevronUp color={canScrollUp ? "#333" : "#ccc"} />
              </button>
            )}

            <div className="product-hero-thumbnails-list">
              {visibleThumbnails.map((img, idx) => {
                const absoluteIndex = thumbnailStartIndex + idx;
                const isActive = absoluteIndex === mainImageIndex;
                return (
                  <img
                    key={absoluteIndex}
                    src={img}
                    onClick={() => handleThumbnailClick(absoluteIndex)}
                    className={`product-hero-thumbnail ${isActive ? 'active-thumbnail' : ''}`}
                    alt={`thumb-${absoluteIndex}`}
                    loading="lazy"
                  />
                );
              })}
            </div>

            {initialDisplayImages.length > thumbnailsPerView && (
              <button className="btn btn-link p-0 thumbnail-nav-btn left-side"
                onClick={showNextThumbnails} disabled={!canScrollDown}>
                <FaChevronDown color={canScrollDown ? "#333" : "#ccc"} />
              </button>
            )}
          </div>

          <div className="product-hero-main-image">
            <img
              src={currentMainImage}
              alt={product?.name || "Product"}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
            />
            <button
              className="product-hero-wishlist-btn"
              onClick={toggleWishlist}
              disabled={wishlistLoading}
            >
              {isInWishlist ? <FaHeart color="#dc3545" size={22} /> : <FaRegHeart color="#ccc" size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - INFO */}
      <div className="product-hero-right">
        <p className="text-muted mb-1 text-start mt-lg-2 mt-4">
          {product.brand?.name || product.brand || "Brand Name"}
        </p>
        {(() => {
          const varText = selectedShade ? getVariantDisplayText(selectedShade) : "";
          const mainTitleName = varText && varText.toUpperCase() !== "DEFAULT" ? `${product.name} - ${varText}` : product.name;
          return <h1 className="fs-3 fw-bold mb-2 text-start">{mainTitleName}</h1>;
        })()}

        <div className="d-flex align-items-center gap-1 mb-3 text-start">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              color={i < Math.round(reviewSummary.avgRating || 0) ? "#ffc107" : "#e4e5e9"}
            />
          ))}
          <span className="text-muted ms-2">
            ({reviewSummary.totalReviews || 0} reviews)
          </span>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4 text-start">
          <span className="fs-2 fw-bold text-dark">
            Rs {selectedShade?.displayPrice || product.price}
          </span>
          {selectedShade?.originalPrice > selectedShade?.displayPrice && (
            <del className="text-muted fs-5">Rs {selectedShade.originalPrice}</del>
          )}
          <span className="text-success fw-bold">10% off</span>
        </div>

        {/* Selected Variant Display */}
        {selectedShade && (
          <div className="text-muted small text-start mb-3">
            Selected Option: <span className="fw-bold text-dark">{getVariantDisplayText(selectedShade)}</span>
          </div>
        )}

        {/* Color Variants */}
        <div className="mb-4 text-start">
          <p className="fw-bold mb-2">Color</p>
          <div className="d-flex flex-wrap gap-2">
            {groupedVariants.color.slice(0, 4).map((v, i) => {
              const isSelected = selectedShade?.sku === getSku(v);
              const outOfStock = isOutOfStock(v);
              return (
                <div
                  key={i}
                  onClick={() => !outOfStock && handleVariantClick(v)}
                  className={`color-swatch ${outOfStock ? 'out-of-stock-swatch' : ''}`}
                  style={{
                    backgroundColor: v.hex,
                    border: isSelected ? '2px solid #000' : '1px solid #ddd',
                    cursor: outOfStock ? 'not-allowed' : 'pointer',
                    opacity: outOfStock ? 0.5 : 1,
                  }}
                  title={outOfStock ? `${v.shadeName || v.name} - Out of Stock` : v.shadeName || v.name}
                >
                  {isSelected && !outOfStock && <span className="color-swatch-check">✓</span>}
                  {outOfStock && <span className="color-swatch-cross">✕</span>}
                </div>
              );
            })}
            {groupedVariants.color.length > 4 && (
              <button
                className="btn border fw-normal more-variants-btn"
                onClick={() => {
                  setSelectedVariantType("color");
                  setShowVariantOverlay(true);
                }}
              >
                +{groupedVariants.color.length - 4}
              </button>
            )}
          </div>
        </div>

        {/* Text Variants */}
        <div className="mb-4 d-flex gap-2">
          {groupedVariants.text.slice(0, 2).map((v, i) => {
            const isSelected = selectedShade?.sku === getSku(v);
            const outOfStock = isOutOfStock(v);
            return (
              <button
                key={i}
                className={`btn text-variant-btn ${outOfStock ? 'out-of-stock-text-btn' : (isSelected ? "btn-dark" : "btn-outline-secondary")}`}
                onClick={() => !outOfStock && handleVariantClick(v)}
                disabled={outOfStock}
                title={outOfStock ? `${getVariantDisplayText(v)} - Out of Stock` : getVariantDisplayText(v)}
              >
                {outOfStock && <span className="text-cross me-1">✕</span>}
                {getVariantDisplayText(v)}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3 mb-4">
          <button
            className="btn btn-dark flex-grow-1 py-3 fw-normal action-btn page-title-main-name"
            onClick={handleAddToCartClick}
            disabled={addingToCart || !selectedShade || isOutOfStock(selectedShade)}
          >
            {addingToCart ? "Adding..." : isOutOfStock(selectedShade) ? "Out of Stock" : "Add To Bag"}
            <FaShoppingBag className="ms-2" />
          </button>

          <button
            className="btn btn-outline-dark flex-grow-1 py-3 fw-normal action-btn"
            onClick={toggleWishlist}
            disabled={wishlistLoading}
          >
            Wishlist <FaRegHeart className="ms-2" />
          </button>
        </div>

        <ProductDetailDescription product={product} />
      </div>

      {/* Desktop Variant Overlay */}
      {showVariantOverlay && (
        <div className="variant-overlay" onClick={() => setShowVariantOverlay(false)}>
          <div
            className="variant-overlay-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="m-0 page-title-main-name">Select Variant</h5>
              <button
                onClick={() => setShowVariantOverlay(false)}
                style={{ background: 'none', border: 'none', fontSize: '40px' }}
              >
                &times;
              </button>
            </div>

            <div className="variant-overlay-body">
              {/* Color Variants Grid */}
              {groupedVariants.color.length > 0 && (
                <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                  {groupedVariants.color.map((v, i) => {
                    const isSelected = selectedShade?.sku === getSku(v);
                    const outOfStock = isOutOfStock(v);
                    return (
                      <div
                        key={getSku(v) || i}
                        style={{ cursor: outOfStock ? "not-allowed" : "pointer", position: "relative" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!outOfStock) {
                            handleVariantClick(v);
                          }
                        }}
                        title={v.shadeName || v.name}
                      >
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "20%",
                          backgroundColor: v.hex || "#ccc",
                          border: isSelected ? "3px solid #000" : "1px solid #ddd",
                          opacity: outOfStock ? 0.4 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {isSelected && (
                            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                              ✓
                            </span>
                          )}
                        </div>
                        {outOfStock && (
                          <span style={{
                            position: "absolute", top: 0, left: 8, right: 0, bottom: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "red", fontWeight: "bold", fontSize: 16, pointerEvents: "none"
                          }}>✕</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Size/Text Variants Grid */}
              {groupedVariants.text.length > 0 && (
                <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                  {groupedVariants.text.map((v, i) => {
                    const isSelected = selectedShade?.sku === getSku(v);
                    const outOfStock = isOutOfStock(v);
                    return (
                      <div
                        key={getSku(v) || i}
                        className="variant-text-item"
                        style={{ cursor: outOfStock ? "not-allowed" : "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!outOfStock) {
                            handleVariantClick(v);
                          }
                        }}
                      >
                        <div style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid #000" : "1px solid #ddd",
                          background: isSelected ? "#f8f9fa" : "#fff",
                          opacity: outOfStock ? 0.4 : 1,
                          textDecoration: outOfStock ? "line-through" : "none"
                        }}>
                          {getVariantDisplayText(v)}
                          {outOfStock && <span className="text-danger small ms-1">(OOS)</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="variant-overlay-footer">
              {selectedShade && (
                <div className="small text-muted fw-semibold">
                  Selected: <span className="text-dark fw-bold">{getVariantDisplayText(selectedShade)}</span>
                </div>
              )}
              <button
                className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${addingToCart ? "btn-dark" : "btn-outline-dark"}`}
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleAddToCartClick();
                  setShowVariantOverlay(false);
                }}
                disabled={addingToCart || !selectedShade || isOutOfStock(selectedShade)}
                style={{
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Adding...
                  </>
                ) : (selectedShade && isOutOfStock(selectedShade)) ? (
                  "Out of Stock"
                ) : (
                  <>
                    Add to Bag
                    <FaShoppingBag />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
      {showVariantOverlay && (() => {
        const item = product;
        if (!item) return null;

        const allVariants = variantsList || [];
        const displayVariant = selectedShade || {};
        const isCurrentVariantOutOfStock = isOutOfStock(displayVariant);

        const hasColorVariants = groupedVariants.color.length > 0;
        const hasTextVariants = groupedVariants.text.length > 0;

        return (
          <>
            <div
              className="mobile-sheet-backdrop"
              onClick={(e) => { e.stopPropagation(); setShowVariantOverlay(false); }}
            />
            <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
              {/* Drag grabber */}
              <div className="mobile-sheet-grabber" onClick={() => setShowVariantOverlay(false)} style={{ cursor: 'pointer' }} />

              {/* Header */}
              <div className="mobile-sheet-header">
                <h3 className="mobile-sheet-title">
                  {hasColorVariants ? "Select Shade" : "Select Variant"}
                </h3>
                <button className="mobile-sheet-close-btn" onClick={() => setShowVariantOverlay(false)}>
                  &times;
                </button>
              </div>

              {/* Body content with scrolling swatches */}
              <div className="mobile-sheet-body">
                {hasColorVariants && (
                  <div className="mobile-sheet-variants-grid">
                    {groupedVariants.color.map((v, i) => {
                      const isSelected = displayVariant.sku === v.sku;
                      const outOfStock = isOutOfStock(v);

                      return (
                        <div
                          key={getSku(v) || i}
                          className="mobile-sheet-variant-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!outOfStock) {
                              handleVariantClick(v);
                            }
                          }}
                        >
                          <button
                            className={`mobile-sheet-color-circle ${isSelected ? "selected" : ""} ${outOfStock ? "oos" : ""}`}
                            style={{
                              backgroundColor: v.hex || "#ccc",
                              border: isSelected ? "3px solid #000" : "1px solid #e0e0e0",
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              position: "relative",
                              cursor: outOfStock ? "not-allowed" : "pointer"
                            }}
                          >
                            {isSelected && <FaCheck style={{ color: "#fff", fontSize: "14px" }} />}
                            {outOfStock && (
                              <span style={{
                                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "red", fontWeight: "bold", fontSize: 18, pointerEvents: "none"
                              }}>✕</span>
                            )}
                          </button>
                          <span className="mobile-sheet-variant-name" style={{ fontSize: "11px", marginTop: "4px" }}>
                            {v.shadeName || v.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {hasTextVariants && (
                  <div className="mobile-sheet-text-variants" style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px" }}>
                    {groupedVariants.text.map((v, i) => {
                      const isSelected = displayVariant.sku === v.sku;
                      const outOfStock = isOutOfStock(v);
                      const variantText = getVariantDisplayText(v);

                      return (
                        <div
                          key={getSku(v) || i}
                          className="mobile-sheet-variant-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!outOfStock) {
                              handleVariantClick(v);
                            }
                          }}
                        >
                          <button className={`mobile-sheet-text-pill ${isSelected ? "selected" : ""} ${outOfStock ? "oos" : ""}`}>
                            <span>{variantText}</span>
                            {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
                            {outOfStock && (
                              <span style={{
                                color: 'red',
                                fontWeight: 'bold',
                                marginLeft: '6px',
                                fontSize: '12px',
                              }}>✕</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Price & Info */}
              <div className="mobile-sheet-footer">
                <div className="mobile-sheet-footer-left">
                  <span className="mobile-sheet-selected-label">
                    {getVariantDisplayText(displayVariant)}
                  </span>
                  <div className="mobile-sheet-price-row">
                    <span className="mobile-sheet-current-price">
                      {formatPrice(displayVariant.displayPrice || item.price)}
                    </span>
                    {(displayVariant.originalPrice || item.originalPrice) > (displayVariant.displayPrice || item.price) && (
                      <>
                        <span className="mobile-sheet-original-price">
                          {formatPrice(displayVariant.originalPrice || item.originalPrice)}
                        </span>
                        <span className="mobile-sheet-discount">
                          ({displayVariant.discountPercent || item.discountPercent || 0}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Bag Button */}
              <div className="mobile-sheet-action-wrap">
                <button
                  className="mobile-sheet-btn-add"
                  disabled={addingToCart || isCurrentVariantOutOfStock}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleAddToCartClick();
                    setShowVariantOverlay(false);
                  }}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
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
      })()}
    </article>
  );
};

export default ProductDetailsHero;