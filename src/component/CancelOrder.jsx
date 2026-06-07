import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Alert, Badge, Spinner } from "react-bootstrap";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { UserContext } from "./UserContext.jsx";
import { CartContext } from "../Context/Cartcontext";
import { FaTimes, FaHeart, FaRegHeart, FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import bagIcon from "../assets/bag.svg";

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ordersuccess.css";
import "../css/cancelorder.css";
import "../css/cartpage.css";
import "../css/Foryou.css";

const API_BASE = "https://beauty.joyory.com/api/user/cart";
const RECOMMENDATIONS_API = "https://beauty.joyory.com/api/user/recommendations/cart";
const WISHLIST_CACHE_KEY = "guestWishlist";

// ─── Variant helpers ────────────────────────────────────
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
};

const getVariantDisplayText = (variant) =>
  (
    variant?.shadeName ||
    variant?.name ||
    variant?.size ||
    variant?.ml ||
    variant?.weight ||
    "Default"
  ).toUpperCase();

const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [] };
  (variants || []).forEach((v) => {
    if (!v) return;
    if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
    else grouped.text.push(v);
  });
  return grouped;
};

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

const RecoProductCard = ({ product, navigate, user, onAddToCartSuccess }) => {
  const allVariants = useMemo(
    () => product?.variants || product?.product?.variants || product?.shadeOptions || product?.product?.shadeOptions || [],
    [product]
  );

  const hasVariants = allVariants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState(
    () => product?.selectedVariant || product?.product?.selectedVariant || allVariants.find((v) => v.stock > 0) || allVariants[0] || {}
  );
  const [tempSelectedVariant, setTempSelectedVariant] = useState(null);
  const [variantSelected, setVariantSelected] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(false);

  // ===================== OUT OF STOCK POPUP STATE =====================
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  const handleOutOfStockClick = (productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => setShowOutOfStockPopup(false), 3000);
  };

  const closeOutOfStockPopup = () => setShowOutOfStockPopup(false);
  // ===================== END OUT OF STOCK POPUP STATE =====================

  const location = useLocation();

  /* wishlist helpers */
  const isInWishlist = useCallback(
    (productId, sku) =>
      wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
    [wishlistData]
  );

  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
        if (res.data.success) setWishlistData(res.data.wishlist || []);
      } else {
        const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
      }
    } catch { setWishlistData([]); }
  }, [user]);

  useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

  /* computed */
  const displayVariant = tempSelectedVariant || selectedVariant || {};

  const displayPrice = parseFloat(
    displayVariant?.displayPrice || displayVariant?.discountedPrice || displayVariant?.price || product?.price || product?.product?.price || 0
  );
  const originalPrice = parseFloat(
    displayVariant?.originalPrice || displayVariant?.mrp || product?.mrp || product?.product?.mrp || displayPrice
  );
  let discountPercent = parseFloat(displayVariant?.discountPercent || product?.discountPercent || product?.product?.discountPercent || 0);
  if (!discountPercent && originalPrice > displayPrice)
    discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

  const activeVar = displayVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
  const stock = parseInt((hasVariants ? activeVar?.stock : (product?.stock || product?.product?.stock)) || 0);
  const outOfStock = stock <= 0;

  // Check if ALL variants are out of stock
  const isCompletelyOutOfStock = hasVariants
    ? allVariants.every(v => parseInt(v.stock || 0) <= 0)
    : parseInt(product?.stock || product?.product?.stock || 0) <= 0;

  const showSelectVariantBtn = hasVariants && allVariants.length > 1;

  const imageUrl = useMemo(() => {
    let rawImage = displayVariant?.images?.[0] || displayVariant?.image ||
      product?.selectedVariant?.images?.[0] || product?.product?.selectedVariant?.images?.[0] ||
      product?.images?.[0] || product?.product?.images?.[0] ||
      product?.image || product?.product?.image ||
      '';
    if (rawImage) {
      return rawImage.startsWith("http")
        ? rawImage
        : `https://res.cloudinary.com/dekngswix/image/upload/${rawImage}`;
    }
    return 'https://placehold.co/400x300/ffffff/cccccc?text=Product';
  }, [displayVariant, product]);

  const sku = getSku(displayVariant);
  const productId = product?.product?._id || product?._id;
  const productInWishlist = isInWishlist(productId, sku);
  const groupedVariants = groupVariantsByType(allVariants);

  const getBrandName = () => {
    const brand = product?.brand || product?.product?.brand;
    if (!brand) return 'Unknown Brand';
    if (typeof brand === 'object' && brand.name) return brand.name;
    return typeof brand === 'string' ? brand : 'Unknown Brand';
  };

  const getProductSlug = () =>
    product?.slugs?.[0] || product?.product?.slugs?.[0] ||
    product?.slug || product?.product?.slug ||
    productId;

  /* actions */
  const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(false);
    setTempSelectedVariant(null);
  };

  const handleAddToCart = async (forceVariant = null) => {
    setAddingToCart(true);
    try {
      let payload;
      if (hasVariants) {
        const sel = forceVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
        if (!sel || (sel.stock ?? 0) <= 0) { toast.error('Please select an in-stock variant.'); return; }
        payload = { productId: productId, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
      } else {
        if (outOfStock) { toast.error('Product is out of stock.'); return; }
        payload = { productId: productId, quantity: 1 };
      }

      // Cache selected variant
      const chosen = forceVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
      if (hasVariants && chosen) {
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[productId] = chosen;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[productId];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      const res = await axios.post(`${API_BASE}/add`, payload, {
        withCredentials: true,
      });
      if (!res.data.success) throw new Error(res.data.message || 'Failed');
      toast.success('Product added to cart!');
      if (onAddToCartSuccess) {
        onAddToCartSuccess();
      } else {
        navigate('/cartpage');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add product');
      if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!selectedVariant) { toast.error('Please select a variant first'); return; }
    setWishlistLoading(true);
    try {
      const inWl = isInWishlist(productId, sku);
      if (user && !user.guest) {
        if (inWl) {
          await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { withCredentials: true, data: { sku } });
          toast.success('Removed from wishlist!');
        } else {
          await axios.post(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { sku }, { withCredentials: true });
          toast.success('Added to wishlist!');
        }
        await fetchWishlistData();
      } else {
        const local = JSON.parse(localStorage.getItem('guestWishlist')) || [];
        if (inWl) {
          localStorage.setItem('guestWishlist', JSON.stringify(local.filter((i) => !(i._id === productId && i.sku === sku))));
          toast.success('Removed from wishlist!');
        } else {
          const pName = product?.product?.name || product?.name || 'Unnamed Product';
          local.push({ _id: productId, name: pName, sku, image: imageUrl, displayPrice, originalPrice });
          localStorage.setItem('guestWishlist', JSON.stringify(local));
          toast.success('Added to wishlist!');
        }
        await fetchWishlistData();
      }
    } catch (err) {
      if (err.response?.status === 401) { toast.error('Please login to use wishlist'); navigate('/login'); }
      else toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Determine if we should show out of stock state (entirely OOS)
  const showOutOfStock = isCompletelyOutOfStock && !hasVariants;

  const buttonDisabled = addingToCart || showOutOfStock;

  let buttonText = "Add to Bag";
  if (addingToCart) {
    buttonText = "Adding...";
  } else if (showOutOfStock) {
    buttonText = "Out of Stock";
  } else if (showSelectVariantBtn) {
    buttonText = "Select Variant";
  } else if (outOfStock) {
    buttonText = "Out of Stock";
  }

  const pName = product?.product?.name || product?.name || 'Unnamed Product';

  return (
    <div className="foryou-card-wrapper" style={{ flex: "0 0 auto" }}>
      <div className="foryou-card">
        {/* Product Image with Overlays */}
        <div
          className="foryou-img-wrapper"
          onClick={() => {
            if (showOutOfStock) {
              handleOutOfStockClick(pName);
            } else {
              navigate(`/product/${getProductSlug()}`);
            }
          }}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <img
            src={imageUrl}
            alt={pName}
            className="foryou-img img-fluid"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
            style={{
              opacity: showOutOfStock ? 0.6 : 1,
              filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
            }}
          />

          {/* OUT OF STOCK OVERLAY */}
          {showOutOfStock && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
              }}
            >
              <div
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <FaTimes />
                Out of Stock
              </div>
            </div>
          )}

          {/* Wishlist Icon - Hidden when out of stock */}
          {!showOutOfStock && (
            <button className='bg-transparent'
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                color: productInWishlist ? '#dc3545' : '#ccc',
                fontSize: '22px',
                zIndex: 2,
                backgroundColor: 'transparent !important',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                border: 'none',
                outline: 'none',
              }}
              title={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlistLoading ? (
                <div className="spinner-border spinner-border-sm" role="status" />
              ) : productInWishlist ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
          <div className="justify-content-between d-flex flex-column" style={{ height: '200px' }}>
            {/* Brand Name */}
            <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

            {/* Product Name */}
            <h6
              className="foryou-name font-family-Poppins m-0 p-0"
              onClick={() => {
                if (showOutOfStock) {
                  handleOutOfStockClick(pName);
                } else {
                  navigate(`/product/${getProductSlug()}`);
                }
              }}
              style={{
                cursor: 'pointer',
                opacity: showOutOfStock ? 0.6 : 1,
              }}
            >
              {(() => {
                const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                return varText && varText.toUpperCase() !== "DEFAULT" ? `${pName} - ${varText}` : pName;
              })()}
            </h6>

            {/* Show out of stock message in variant area */}
            {showOutOfStock && (
              <div className="mt-2 mb-2">
                <span
                  style={{
                    color: '#dc3545',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  <FaTimes style={{ fontSize: '11px', marginRight: '4px' }} />
                  Currently unavailable
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="price-section mb-3 mt-auto">
              <div className="d-flex align-items-baseline flex-wrap">
                <span
                  className="current-price fw-400 fs-5"
                  style={{
                    textDecoration: showOutOfStock ? 'line-through' : 'none',
                    opacity: showOutOfStock ? 0.6 : 1,
                  }}
                >
                  {formatPrice(displayPrice)}
                </span>
                {originalPrice > displayPrice && !showOutOfStock && (
                  <>
                    <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
                    <span className="discount-percent text-danger fw-bold ms-2">({discountPercent}% OFF)</span>
                  </>
                )}
              </div>
            </div>

            {/* Add to Cart / Select Variant / Out of Stock Button */}
            <div className="cart-section">
              <div className="d-flex align-items-center justify-content-between">
                <button
                  className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${showOutOfStock
                    ? "btn-secondary"
                    : addingToCart
                      ? ""
                      : "btn-outline-dark"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showOutOfStock) {
                      handleOutOfStockClick(pName);
                    } else if (showSelectVariantBtn) {
                      setShowVariantOverlay(true);
                    } else {
                      handleAddToCart();
                    }
                  }}
                  disabled={buttonDisabled && !showOutOfStock}
                  style={{
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    opacity: showOutOfStock ? 0.8 : 1,
                    cursor: showOutOfStock ? 'pointer' : (buttonDisabled ? 'not-allowed' : 'pointer'),
                  }}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Adding...
                    </>
                  ) : showOutOfStock ? (
                    <>
                      <FaTimes style={{ fontSize: '14px' }} />
                      Out of Stock
                    </>
                  ) : (
                    <>
                      {buttonText}
                      {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
                        <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Variant Overlay */}
      {showVariantOverlay && !showOutOfStock && (
        <div className="variant-overlay" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}>
          <div
            className="variant-overlay-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="m-0 page-title-main-name">Select Variant</h5>
              <button onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }} style={{ background: 'none', border: 'none', fontSize: '40px' }}>×</button>
            </div>

            <div className="variant-overlay-body">
              {groupedVariants.color.length > 0 && (
                <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                  {groupedVariants.color.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    return (
                      <div
                        key={getSku(v) || v._id}
                        style={{ cursor: isOOS ? "not-allowed" : "pointer", position: "relative" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                        title={v.shadeName}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "20%",
                            backgroundColor: v.hex || "#ccc",
                            border: isSel ? "3px solid #000" : "1px solid #ddd",
                            opacity: isOOS ? 0.4 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSel && (
                            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                              ✓
                            </span>
                          )}
                        </div>
                        {isOOS && (
                          <span style={{
                            position: "absolute", top: 0, left: 8, right: 0, bottom: 0,
                            display: "flex", alignItems: "center", justifyCorner: "center",
                            color: "red", fontWeight: "bold", fontSize: 16, pointerEvents: "none"
                          }}>✕</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {groupedVariants.text.length > 0 && (
                <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                  {groupedVariants.text.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    return (
                      <div
                        key={getSku(v) || v._id}
                        className="variant-text-item"
                        style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: isSel ? "2px solid #000" : "1px solid #ddd",
                            background: isSel ? "#f8f9fa" : "#fff",
                            opacity: isOOS ? 0.4 : 1,
                            textDecoration: isOOS ? "line-through" : "none"
                          }}
                        >
                          {getVariantDisplayText(v)}
                          {isOOS && <span className="text-danger small ms-1">(OOS)</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="variant-overlay-footer">
              <div className="small text-muted fw-semibold">
                Selected: <span className="text-dark fw-bold">{getVariantDisplayText(displayVariant)}</span>
              </div>
              <div className="mt-1 mb-2 text-start">
                <span
                  onClick={(e) => { e.stopPropagation(); navigate(`/product/${getProductSlug()}`); }}
                  className="text-decoration-none fw-semibold"
                  style={{ cursor: 'pointer', fontSize: '12px' }}
                >
                  View Details
                </span>
              </div>
              <button
                className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${addingToCart ? "btn-dark" : "btn-outline-dark"}`}
                onClick={async (e) => {
                  e.stopPropagation();
                  const chosen = tempSelectedVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                  if (chosen) {
                    handleVariantSelect(chosen);
                  }
                  await handleAddToCart(chosen);
                  closeVariantOverlay();
                }}
                disabled={addingToCart || (displayVariant && displayVariant.stock <= 0)}
                style={{
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adding...
                  </>
                ) : displayVariant?.stock <= 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    Add to Bag
                    {!addingToCart && displayVariant?.stock > 0 && (
                      <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Drawer using React Portal */}
      {showVariantOverlay && !showOutOfStock && createPortal(
        <>
          <div
            className="mobile-sheet-backdrop"
            onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}
          />
          <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
            {/* Drag grabber */}
            <div className="mobile-sheet-grabber" onClick={closeVariantOverlay} style={{ cursor: 'pointer' }} />

            {/* Header */}
            <div className="mobile-sheet-header">
              <h3 className="mobile-sheet-title">
                {groupedVariants.color.length > 0 ? "Select Shade" : "Select Variant"}
              </h3>
              <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
                &times;
              </button>
            </div>

            {/* Body content */}
            <div className="mobile-sheet-body">
              {groupedVariants.color.length > 0 && (
                <div className="mobile-sheet-variants-grid">
                  {groupedVariants.color.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    const variantText = getVariantDisplayText(v);

                    return (
                      <div
                        key={getSku(v) || v._id}
                        className={`mobile-sheet-variant-item ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                      >
                        <div
                          className={`mobile-sheet-color-circle ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}
                          style={{ backgroundColor: v.hex || "#ccc", position: "relative" }}
                        >
                          {isSel && (
                            <FaCheck className="mobile-sheet-check-icon" />
                          )}
                          {isOOS && (
                            <span style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'red',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              pointerEvents: 'none',
                            }}>✕</span>
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

              {groupedVariants.text.length > 0 && (
                <div className="mobile-sheet-variants-grid">
                  {groupedVariants.text.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    const variantText = getVariantDisplayText(v);

                    return (
                      <div
                        key={getSku(v) || v._id}
                        className="mobile-sheet-variant-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                      >
                        <button className={`mobile-sheet-text-pill ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}>
                          <span>{variantText}</span>
                          {isSel && <FaCheck style={{ fontSize: '10px' }} />}
                          {isOOS && (
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
                    {formatPrice(displayVariant.displayPrice)}
                  </span>
                  {displayVariant.originalPrice > displayVariant.displayPrice && (
                    <>
                      <span className="mobile-sheet-original-price">
                        {formatPrice(displayVariant.originalPrice)}
                      </span>
                      <span className="mobile-sheet-discount">
                        ({displayVariant.discountPercent || 0}% OFF)
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span
                className="mobile-sheet-view-details"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${getProductSlug()}`);
                  closeVariantOverlay();
                }}
              >
                View Details
              </span>
            </div>

            {/* Add to Bag Button */}
            <div className="mobile-sheet-action-wrap">
              <button
                className="mobile-sheet-btn-add"
                disabled={addingToCart || (displayVariant && displayVariant.stock <= 0)}
                onClick={async (e) => {
                  e.stopPropagation();
                  const chosen = tempSelectedVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                  if (chosen) {
                    handleVariantSelect(chosen);
                  }
                  await handleAddToCart(chosen);
                  closeVariantOverlay();
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    Adding...
                  </>
                ) : (displayVariant && displayVariant.stock <= 0) ? (
                  "Out of Stock"
                ) : (
                  "Add to Bag"
                )}
              </button>
            </div>
          </div>
        </>
        , document.body
      )}

      {/* Out of stock popup using React Portal */}
      {showOutOfStockPopup && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeOutOfStockPopup}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '30px 40px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeOutOfStockPopup}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              &times;
            </button>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>😢</div>
            <h4 style={{ fontWeight: 600, marginBottom: '10px' }}>Out of Stock</h4>
            <p style={{ color: '#666', margin: 0 }}>
              Oops! {outOfStockProductName} is out of stock right now. We are working hard to restock it as soon as possible!
            </p>
          </div>
        </div>
        , document.body
      )}
    </div>
  );
};

const CancelOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { user } = useContext(UserContext);
  const { syncCartFromBackend } = useContext(CartContext);
  const [recommendations, setRecommendations] = useState([]);
  const [recoLoading, setRecoLoading] = useState(false);

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setRecoLoading(true);
      const res = await fetch(RECOMMENDATIONS_API, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.sections)) {
        setRecommendations(data.sections);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setRecoLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAddToCartSuccess = async () => {
    await syncCartFromBackend();
  };


  // Get order from location state or fetch from sessionStorage
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [refundOptions, setRefundOptions] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Extract data from order
  const items = order?.products || [];
  const shippingAddress = order?.shipping?.address || {};
  const paymentMethod = order?.payment?.method || "Not Available";
  const orderIdToUse = order?._id || orderId;

  // Use order.amount for calculations
  const subtotal = order?.amount?.subtotal || 0;
  const discount = order?.amount?.discount || 0;
  const shippingCharge = order?.amount?.shipping || 0;
  const grandTotal = order?.amount?.grandTotal || 0;

  // ✅ Handle back button prevention
  useEffect(() => {
    // Clear order success data from sessionStorage
    sessionStorage.removeItem("orderSuccessData");
    sessionStorage.removeItem("lastOrderId");

    // Push current state to history to prevent going back
    window.history.pushState(null, "", window.location.href);

    // Handle popstate event (back button)
    const handlePopState = (event) => {
      // Prevent going back to order success page
      window.history.pushState(null, "", window.location.href);

      // Show confirmation or redirect
      const confirmLeave = window.confirm(
        "You cannot go back to the order confirmation page. Would you like to go to My Orders?"
      );

      if (confirmLeave) {
        // First remove the event listener to prevent infinite loop
        window.removeEventListener("popstate", handlePopState);
        navigate("/myorders", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // ✅ Prevent going back via browser back button
  useEffect(() => {
    // Disable browser back button by manipulating history
    const disableBackButton = () => {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
        // Optionally show a message
        alert("Please use the navigation buttons provided to leave this page.");
      };
    };

    disableBackButton();

    return () => {
      window.onpopstate = null;
    };
  }, []);

  // Fetch order details if not in state
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order && orderId) {
        try {
          setLoading(true);
          // Try to get from sessionStorage first
          const storedOrder = sessionStorage.getItem(`cancelledOrder_${orderId}`);
          if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
            setLoading(false);
            return;
          }

          // Fetch from API
          const response = await fetch(
            `https://beauty.joyory.com/api/user/orders/${orderId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.order) {
              setOrder(data.order);
              sessionStorage.setItem(`cancelledOrder_${orderId}`, JSON.stringify(data.order));
            }
          }
        } catch (err) {
          console.error("Error fetching order details:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [order, orderId]);

  // ✅ Fetch refund options
  useEffect(() => {
    const fetchRefundOptions = async () => {
      try {
        // If order has refund methods, use them
        if (order?.refund?.availableMethods?.length > 0) {
          setRefundOptions(order.refund.availableMethods);
          return;
        }

        // Otherwise fetch from API
        const res = await fetch("https://beauty.joyory.com/api/payment/refund-methods", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("🟩 Refund Methods Response:", data);

          if (data?.success && Array.isArray(data.methods)) {
            setRefundOptions(data.methods);
          } else {
            // Fallback to default options
            setRefundOptions([
              { key: "razorpay", label: "Original Payment Method" },
              { key: "wallet", label: "Joyory Wallet" },
            ]);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching refund methods:", err);
        setRefundOptions([
          { key: "razorpay", label: "Original Payment Method" },
          { key: "wallet", label: "Joyory Wallet" },
        ]);
      }
    };

    if (order) {
      fetchRefundOptions();
    }
  }, [order]);

  // ✅ Handle refund method selection
  const handleRefund = async () => {
    if (!selectedMethod) {
      alert("Please select a refund method!");
      return;
    }

    if (!orderIdToUse) {
      setError("Order ID not found");
      return;
    }

    setProcessing(true);
    setError("");
    setSuccessMsg("");

    try {
      console.log("📤 Sending Refund Request:", {
        orderId: orderIdToUse,
        method: selectedMethod,
      });

      const res = await fetch("https://beauty.joyory.com/api/payment/refund-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderIdToUse,
          method: selectedMethod,
        }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("🟩 Refund Response:", data);

      if (data.success) {
        setSuccessMsg(data.message || "✅ Refund method submitted successfully!");
        setShowRefundPopup(false);

        // Update order in state and sessionStorage
        const updatedOrder = {
          ...order,
          refund: {
            ...order?.refund,
            selectedMethod: selectedMethod,
            selectedMethodLabel: refundOptions.find(opt => opt.key === selectedMethod)?.label,
            status: "processing",
          },
        };

        setOrder(updatedOrder);
        sessionStorage.setItem(`cancelledOrder_${orderIdToUse}`, JSON.stringify(updatedOrder));
      } else {
        setError(data.message || "Refund submission failed. Please try again later.");
      }
    } catch (err) {
      console.error("❌ Refund error:", err);
      setError("Something went wrong while processing your refund.");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Safe navigation function
  const safeNavigate = (path) => {
    // Remove the popstate listener before navigating
    window.onpopstate = null;
    navigate(path, { replace: true });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger mb-3">No Cancel Order Details Found</h4>
        <button className="btn btn-primary" onClick={() => safeNavigate("/myorders")}>
          Go to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* ✅ Premium Cancelled Banner */}
      <div className="cancel-banner">
        <div className="cancel-banner-title-wrap">
          <h2 className="cancel-banner-title">Your Order Is Cancelled Successfully</h2>
          <span className="cancel-banner-icon-container">
            <i className="bi bi-x-circle-fill text-danger ms-2" style={{ fontSize: "32px", verticalAlign: "middle" }}></i>
          </span>
        </div>
        <p className="cancel-banner-subtext">
          We've received your order and it's now being cancelled.
        </p>
        <button className="cancel-banner-btn" onClick={() => safeNavigate("/")}>
          Continue Shopping &rarr;
        </button>
      </div>



      {/* ✅ You May Also Like Recommendations */}
      {!recoLoading && recommendations.length > 0 && (
        <div className="mt-5">
          {recommendations.map((section) => {
            const filteredProducts = (section.products || []).filter((product) => {
              if (!product) return false;
              const variants = product.variants || [];
              if (variants.length > 0) {
                return variants.some((v) => (v.stock ?? 0) > 0);
              }
              return (product.stock ?? 0) > 0;
            });

            if (filteredProducts.length === 0) return null;

            return (
              <div key={section.key} className="mb-5">
                <h3
                  className="font-familys text-start foryou-heading ms-0 mt-3 mb-4 fw-normal"
                  style={{ fontSize: "1.6rem" }}
                >
                  {section.title || "You May Also Like"}
                </h3>

                <Swiper
                  spaceBetween={20}
                  slidesPerView={2}
                  breakpoints={{
                    576: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    992: { slidesPerView: 4 },
                    1200: { slidesPerView: 4 },
                    1400: { slidesPerView: 4 },
                  }}
                >
                  {filteredProducts.map((product) => (
                    <SwiperSlide key={`${section.key}-${product._id}`}>
                      <RecoProductCard
                        product={product}
                        navigate={navigate}
                        user={user}
                        onAddToCartSuccess={handleAddToCartSuccess}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />


    </div>
  );
};

export default CancelOrder;