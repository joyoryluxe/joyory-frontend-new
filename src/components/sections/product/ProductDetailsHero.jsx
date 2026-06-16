// src/components/ProductDetailsHero.jsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar, FaHeart, FaRegHeart, FaShoppingBag,
  FaChevronUp, FaChevronDown, FaTimes, FaCheck,
  FaExclamationTriangle, FaShareAlt
} from "react-icons/fa";
import "../../../styles/ProductDetailsHero.css";
import "../../../styles/ForYou.css";
import { ingredientScan, getProductSafetyScore } from "../../../api/ingredientApi";
import IngredientDetailsDrawer from "../../../pages/IngredientDetailsDrawer";
import axiosInstance from "../../../utils/axiosInstance";

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
const ProductDetailDescription = ({ product, scannedIngredients, onIngredientClick }) => {
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
            <div className="mt-3 text-start">
              {scannedIngredients && scannedIngredients.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {scannedIngredients.map((ing, idx) => {
                    let badgeClass = "badge bg-light text-dark border p-2";
                    if (ing.isAllergen) badgeClass = "badge bg-danger text-white p-2";
                    else if (ing.isSensitive) badgeClass = "badge bg-warning text-dark p-2";

                    return (
                      <span
                        key={idx}
                        className={badgeClass}
                        style={{ cursor: "pointer", borderRadius: "12px", transition: "all 0.15s ease", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        onClick={() => onIngredientClick(ing)}
                        title={ing.isAllergen ? "High Allergen Alert!" : ing.isSensitive ? "Sensitivity Alert" : "Click to view description"}
                      >
                        {ing.name} {ing.isAllergen && "⚠️"} {ing.isSensitive && "⚠️"}
                      </span>
                    );
                  })}
                </div>
              ) : product.ingredients?.length > 0 ? (
                <p>{product.ingredients.join(", ")}</p>
              ) : (
                <p>Ingredients not provided.</p>
              )}
            </div>
          </details>
          <details>
            <summary>How To Use</summary>
            <p className="mt-3">{product.howToUse?.length > 0 ? product.howToUse.join(" • ") : "Usage instructions not provided."}</p>
          </details>
          <details>
            <summary>Special Features</summary>
            <p className="mt-3">{product.features?.length > 0 ? product.features.join(" • ") : "No special features listed."}</p>
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
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [showVariantOverlay, setShowVariantOverlay] = useState(false);
  const [selectedVariantType, setSelectedVariantType] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [mainImageIndex, setMainImageIndex] = useState(0);

  // 🧪 Ingredient Intelligence & Scan States
  const [scanResult, setScanResult] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [safetyScore, setSafetyScore] = useState(null);
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  const [dbSupportsVTO, setDbSupportsVTO] = useState(() => {
    if (product?.supportsVTO) return true;
    const nameLower = (product?.name || "").toLowerCase();
    const slugLower = (product?.slug || "").toLowerCase();
    const slugs = (product?.slugs || []).map(s => s.toLowerCase());

    const knownVtoPrefixes = [
      "modern-matte-lipstick",
      "modern matte lipstick",
      "peptide-glaws-gloss",
      "peptide glaws gloss",
      "stay-on-matte-liquid-lipstick",
      "stay on matte liquid lipstick",
      "dip-tint-lip-oil",
      "dip tint lip oil",
      "smooth-glide-kajal",
      "smooth glide kajal",
      "xtraordin-airy-lip-mousse",
      "xtraordin airy lip mousse",
      "beyond-matte-lip-liquid",
      "beyond matte lip liquid",
      "cc-mousse",
      "cc mousse"
    ];

    const matchNameOrSlug = (str) => {
      if (!str) return false;
      const clean = str.replace(/[–—_]/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
      return knownVtoPrefixes.some(prefix => {
        const cleanPrefix = prefix.replace(/[–—_]/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
        return clean.startsWith(cleanPrefix) || cleanPrefix.startsWith(clean);
      });
    };

    if (matchNameOrSlug(nameLower) || matchNameOrSlug(slugLower)) return true;
    if (slugs.some(s => matchNameOrSlug(s))) return true;

    return false;
  });

  useEffect(() => {
    if (!product?._id) return;
    axiosInstance.get("/api/vto/enabled")
      .then((res) => {
        const productsList = res.data.products || res.data || [];
        const isVtoEnabled = productsList.some((p) => p._id === product._id);
        if (isVtoEnabled) {
          setDbSupportsVTO(true);
        }
      })
      .catch((err) => console.error("Error fetching VTO status:", err));
  }, [product?._id]);

  useEffect(() => {
    const fetchScanResult = async () => {
      if (!product?._id) return;
      try {
        const res = await ingredientScan(product._id);
        if (res.data.success) {
          setScanResult(res.data);
        }
      } catch (err) {
        console.error("Error performing ingredient scan:", err);
      }
    };

    const fetchSafetyScore = async () => {
      if (!product?._id) return;
      try {
        const res = await getProductSafetyScore(product._id);
        if (res.data.success) {
          setSafetyScore(res.data);
        }
      } catch (err) {
        console.error("Error fetching safety score:", err);
      }
    };

    fetchScanResult();
    fetchSafetyScore();
  }, [product?._id]);

  const handleIngredientClick = (ing) => {
    setSelectedIngredient(ing);
    setIsDrawerOpen(true);
  };

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

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setLightboxImageIndex((prev) => 
          prev === 0 ? initialDisplayImages.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setLightboxImageIndex((prev) => 
          prev === initialDisplayImages.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, initialDisplayImages.length]);

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

  const handleShareClick = async () => {
    const shareData = {
      title: product?.name || "Product",
      text: `Check out ${product?.name || "this product"} on Joyory!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (toast && typeof toast.success === 'function') {
          toast.success("Product link copied to clipboard!");
        } else {
          alert("Product link copied to clipboard!");
        }
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  useEffect(() => {
    setIsExpanded(false);
  }, [product?._id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleVariantClick = (variant) => {
    if (isOutOfStock(variant)) {
      toast.warn("This variant is out of stock");
      return;
    }
    handleVariantSelect(variant);
  };

  const handleMoreVariantsClick = () => {
    if (window.innerWidth > 768) {
      setIsExpanded(true);
    } else {
      setSelectedVariantType("color");
      setShowVariantOverlay(true);
    }
  };

  const visibleThumbnails = initialDisplayImages.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + thumbnailsPerView
  );

  const canScrollUp = thumbnailStartIndex > 0;
  const canScrollDown = thumbnailStartIndex + thumbnailsPerView < initialDisplayImages.length;

  const currentMainImage = initialDisplayImages[mainImageIndex] || initialDisplayImages[0] || "/placeholder.png";

  const originalPrice = selectedShade?.originalPrice || product.originalPrice;
  const displayPrice = selectedShade?.displayPrice || product.price;

  let discountPercent = parseFloat(selectedShade?.discountPercent || product.discountPercent || 0);
  if (!discountPercent && originalPrice > displayPrice) {
    discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
  }

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
              style={{ cursor: "zoom-in" }}
              onClick={() => {
                setLightboxImageIndex(mainImageIndex);
                setIsLightboxOpen(true);
              }}
              onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
            />

            {(product?.supportsVTO || dbSupportsVTO) && (
              <div 
                className="support-beauty-badge" 
                title="Try It On" 
                onClick={(e) => {
                  e.stopPropagation();
                  const sku = selectedShade ? getSku(selectedShade) : null;
                  navigate(`/Mainvirtualtryon?productId=${product.slug || product._id}${sku ? `&sku=${sku}` : ''}`);
                }}
                onTouchStart={(e) => e.stopPropagation()}
                style={{ cursor: "pointer" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
        <p className="product-brand-name">
          {product.brand?.name || product.brand || "Brand Name"}
        </p>
        <div className="product-title-wrapper">
          {(() => {
            const varText = selectedShade ? getVariantDisplayText(selectedShade) : "";
            const mainTitleName = varText && varText.toUpperCase() !== "DEFAULT" ? `${product.name} - ${varText}` : product.name;
            return <h1 className="product-title-text">{mainTitleName}</h1>;
          })()}
          <button 
            type="button" 
            className="product-share-btn" 
            onClick={handleShareClick}
            title="Share Product"
            aria-label="Share Product"
          >
            <FaShareAlt />
          </button>
        </div>

        <div className="product-rating-container d-flex align-items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              color={i < Math.round(reviewSummary.avgRating || 0) ? "#ffc107" : "#e4e5e9"}
            />
          ))}
          <span className="ms-2">
            ({reviewSummary.totalReviews || 0} reviews)
          </span>
        </div>

        {/* Clean Beauty Safety Score Widget */}
        {/* {safetyScore && (
          <div className="clean-beauty-widget-card p-3 mb-4 border rounded bg-white text-start shadow-sm" style={{ border: "1px solid #fae5e9 !important" }}>
            <div className="d-flex align-items-center gap-3">
            
              <div className="position-relative flex-shrink-0" style={{ width: "55px", height: "55px" }}>
                <svg width="55" height="55" viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke="#f3f4f6"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke={
                      safetyScore.score >= 85
                        ? "#10b981" // Green
                        : safetyScore.score >= 65
                          ? "#f59e0b" // Yellow
                          : "#ef4444" // Red
                    }
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="157"
                    strokeDashoffset={157 - (157 * safetyScore.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  className="position-absolute top-50 start-50 translate-middle fw-bold text-dark"
                  style={{ fontSize: "11px" }}
                >
                  {safetyScore.score}%
                </div>
              </div>

             
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-muted fw-semibold" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>CLEAN BEAUTY INDEX</span>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-muted small border-0 text-decoration-none"
                    onClick={() => setShowScoreInfo(!showScoreInfo)}
                    style={{ fontSize: "10.5px" }}
                  >
                    {showScoreInfo ? "Hide Details" : "What is this?"}
                  </button>
                </div>
                <h5 className="fw-bold mb-1" style={{ fontSize: "14px", color: "#1f2937" }}>
                  {safetyScore.ratingLabel}{" "}
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor:
                        safetyScore.score >= 85
                          ? "#10b981"
                          : safetyScore.score >= 65
                            ? "#f59e0b"
                            : "#ef4444",
                      marginLeft: "4px",
                    }}
                  />
                </h5>
              
                <div className="d-flex gap-3 mt-1" style={{ fontSize: "11px" }}>
                  <span className="d-flex align-items-center gap-1 text-success fw-medium">
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                      }}
                    />{" "}
                    {safetyScore.greenCount} Safe
                  </span>
                  <span className="d-flex align-items-center gap-1 text-warning fw-medium">
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#f59e0b",
                      }}
                    />{" "}
                    {safetyScore.yellowCount} Mild
                  </span>
                  <span className="d-flex align-items-center gap-1 text-danger fw-medium">
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                      }}
                    />{" "}
                    {safetyScore.redCount} Harsh
                  </span>
                </div>
              </div>
            </div>

        
            {showScoreInfo && (
              <div className="mt-3 pt-3 border-top bg-light p-2 rounded text-muted" style={{ fontSize: "11px", lineHeight: "1.4" }}>
                <p className="mb-2">
                  Our algorithm cross-references each ingredient with our clinical skincare library:
                </p>
                <ul className="ps-3 mb-0 d-flex flex-column gap-1">
                  <li>
                    <strong className="text-success">Safe:</strong> Standard organic conditioning agents, botanical extracts, or clinical moisturizers.
                  </li>
                  <li>
                    <strong className="text-warning">Mild/Caution:</strong> Exfoliating actives, essential oil preservatives, or filters (use carefully on sensitive skin).
                  </li>
                  <li>
                    <strong className="text-danger">Harsh/Avoid:</strong> Sulfates, common parabens, formaldehyde releasers, or synthetic fragrances.
                  </li>
                </ul>
              </div>
            )}
          </div>
        )} */}

        <div className="product-price-container">
          <span className="product-current-price">
            Rs {displayPrice}
          </span>
          {originalPrice > displayPrice && (
            <span className="product-original-price">Rs {originalPrice}</span>
          )}
          {discountPercent > 0 && (
            <span className="product-discount-label">({discountPercent}% off)</span>
          )}
        </div>

        {/* Selected Variant Display */}
        {selectedShade && (
          <div className="text-muted small text-start mb-3">
            Selected: <span className="fw-bold text-dark">{getVariantDisplayText(selectedShade)}</span>
          </div>
        )}

        {/* Color Variants */}
        <div className="mb-4 text-start">
          <p className="fw-bold mb-2">Color</p>
          <div className="d-flex flex-wrap align-items-center gap-2">
            {((!isMobile || isExpanded) ? groupedVariants.color : groupedVariants.color.slice(0, 4)).map((v, i) => {
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
            {groupedVariants.color.length > 4 && isMobile && !isExpanded && (
              <div
                className="btn border fw-normal more-variants-btn"
                onClick={handleMoreVariantsClick}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              >
                +{groupedVariants.color.length - 4}
              </div>
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

        {/* Allergen Alerts Banner */}
        {scanResult && (scanResult.allergenWarnings?.length > 0 || scanResult.sensitiveWarnings?.length > 0) && (
          <div className="alert alert-danger p-3 rounded mb-4 text-start border-0" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "12px" }}>
            <h5 className="fw-bold fs-6 mb-1 d-flex align-items-center gap-2" style={{ color: "#991b1b" }}>
              <FaExclamationTriangle /> Ingredient Warning
            </h5>
            <ul className="ps-3 mb-0 small" style={{ color: "#991b1b" }}>
              {scanResult.allergenWarnings.map((w, idx) => (
                <li key={idx} className="fw-semibold">
                  Contains <strong>{w.ingredient}</strong> — matches your allergen profile!
                </li>
              ))}
              {scanResult.sensitiveWarnings.map((w, idx) => (
                <li key={idx}>
                  Contains <strong>{w.ingredient}</strong> — sensitive skin concern.
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-3 mb-4">
          <button
            className="btn btn-dark flex-grow-1 py-3 fw-normal action-btn page-title-main-name details-action"
            onClick={handleAddToCartClick}
            disabled={addingToCart || !selectedShade || isOutOfStock(selectedShade)}
          >
            {addingToCart ? "Adding..." : isOutOfStock(selectedShade) ? "Out of Stock" : "Add To Bag"}
            <FaShoppingBag className="ms-2" />
          </button>

          <button
            className="btn btn-outline-dark flex-grow-1 py-3 fw-normal action-btn details-action"
            onClick={toggleWishlist}
            disabled={wishlistLoading}
          >
            Wishlist <FaRegHeart className="ms-2" />
          </button>
        </div>

        <ProductDetailDescription
          product={product}
          scannedIngredients={scanResult?.ingredients}
          onIngredientClick={handleIngredientClick}
        />
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
                          borderRadius: "4px",
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
                            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
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
                          <div
                            className={`mobile-sheet-color-circle ${isSelected ? "selected" : ""} ${outOfStock ? "oos" : ""}`}
                            style={{
                              backgroundColor: v.hex || "#ccc",
                              border: isSelected ? "3px solid #000" : "1px solid #e0e0e0",
                              width: "32px",
                              height: "32px",
                              borderRadius: "20%",
                              position: "relative",
                              cursor: outOfStock ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
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
                          </div>
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
      <IngredientDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ingredient={selectedIngredient}
      />

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <button 
            className="lightbox-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            aria-label="Close"
          >
            &times;
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImageIndex((prev) => 
                  prev === 0 ? initialDisplayImages.length - 1 : prev - 1
                );
              }}
              aria-label="Previous image"
            >
              &#10094;
            </button>
            
            <div className="lightbox-image-wrapper">
              <img
                src={initialDisplayImages[lightboxImageIndex] || "/placeholder.png"}
                alt={`product-large-${lightboxImageIndex}`}
                onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
              />
            </div>
            
            <button
              className="lightbox-nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImageIndex((prev) => 
                  prev === initialDisplayImages.length - 1 ? 0 : prev + 1
                );
              }}
              aria-label="Next image"
            >
              &#10095;
            </button>
          </div>

          {/* Thumbnail list at the bottom */}
          {initialDisplayImages.length > 1 && (
            <div className="lightbox-thumbnails-container" onClick={(e) => e.stopPropagation()}>
              {initialDisplayImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`lightbox-thumb-${idx}`}
                  className={`lightbox-thumbnail ${idx === lightboxImageIndex ? 'active' : ''}`}
                  onClick={() => setLightboxImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default ProductDetailsHero;