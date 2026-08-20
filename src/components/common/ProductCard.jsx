// src/components/common/ProductCard.jsx
// Universal reusable product card — accurately implementing old variant selection & card behavior.
// Handles: variant display, swatch selection, wishlist toggle, add-to-cart, variant overlay (desktop + mobile sheet).

import React, { useState, useCallback, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { addToCart as apiAddToCart } from '../../api/cartApi';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  getSku,
  getVariantDisplayText,
  groupVariantsByType,
  formatPrice,
  getProductSlug,
} from '../../utils/productHelpers';
import bagIcon from '../../assets/bag.svg';

/**
 * ProductCard — universal product card.
 *
 * Props:
 *  - item {object}                  — product object (from getProductDisplayData or raw product)
 *  - wishlistData {Array}           — current wishlist items array
 *  - wishlistLoading {object}       — map of productId → boolean
 *  - toggleWishlist {Function}      — (product, variant) => void
 *  - onVariantSelect {Function}     — optional (productId, variant) => void
 *  - onOutOfStockClick {Function}   — optional (productName) => void
 *  - onProductClick {Function}      — optional (product) => void
 *  - onAddToCartSuccess {Function}  — optional callback after successful cart add
 *  - wrapperClassName {string}      — optional outer wrapper class override
 *  - cardClassName {string}         — optional card class override
 */
const ProductCard = ({
  item,
  wishlistData = [],
  wishlistLoading = {},
  toggleWishlist,
  onVariantSelect,
  onOutOfStockClick,
  onProductClick,
  onAddToCartSuccess,
  wrapperClassName = 'foryou-card-wrapper',
  cardClassName = 'foryou-card',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [addingToCart, setAddingToCart] = useState(false);
  const [showVariantOverlay, setShowVariantOverlay] = useState(false);
  const [tempSelectedVariant, setTempSelectedVariant] = useState(null);

  if (!item) return null;

  // ─── Variants resolution ───────────────────────────────────────────────────
  const allVariants = useMemo(() => {
    if (Array.isArray(item.allVariants) && item.allVariants.length > 0) return item.allVariants;
    if (Array.isArray(item.variants) && item.variants.length > 0) return item.variants;
    if (Array.isArray(item.shadeOptions) && item.shadeOptions.length > 0) return item.shadeOptions;
    return [];
  }, [item]);

  const hasVariants = allVariants.length > 0;

  // Currently active variant (local temp selection > passed variant > default in-stock/first variant)
  const displayVariant = useMemo(() => {
    if (tempSelectedVariant) return tempSelectedVariant;
    if (item.variant && (item.variant.sku || item.variant.name || item.variant._id)) return item.variant;
    if (hasVariants) {
      const inStockVar = allVariants.find((v) => (v.stock ?? 0) > 0);
      return inStockVar || allVariants[0] || {};
    }
    return item.variant || {};
  }, [tempSelectedVariant, item.variant, hasVariants, allVariants]);

  // ─── Image resolution ──────────────────────────────────────────────────────
  const rawImage =
    displayVariant?.images?.[0] ||
    displayVariant?.image ||
    item.image ||
    item.displayImage ||
    (Array.isArray(item.images) && item.images[0]) ||
    '';

  const imageUrl = rawImage
    ? rawImage.startsWith('http') || rawImage.startsWith('/')
      ? rawImage
      : `https://res.cloudinary.com/dekngswix/image/upload/${rawImage}`
    : 'https://placehold.co/400x300/ffffff/cccccc?text=Product';

  // ─── SKU & Wishlist ────────────────────────────────────────────────────────
  const selectedSku = getSku(displayVariant);

  const isProductInWishlist = wishlistData.some(
    (w) =>
      (w.productId === item._id || w._id === item._id) &&
      (w.sku === selectedSku || (!selectedSku && !w.sku))
  );

  // ─── Prices & Stock ────────────────────────────────────────────────────────
  const displayPrice = parseFloat(
    displayVariant.displayPrice ??
    displayVariant.discountedPrice ??
    displayVariant.price ??
    item.price ??
    0
  );

  const originalPrice = parseFloat(
    displayVariant.originalPrice ??
    displayVariant.mrp ??
    item.originalPrice ??
    item.mrp ??
    displayPrice
  );

  let discountPercent = parseFloat(
    displayVariant.discountPercent ??
    item.discountPercent ??
    0
  );
  if (!discountPercent && originalPrice > displayPrice) {
    discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
  }

  const groupedVariants = groupVariantsByType(allVariants);

  // Check out of stock status (matching original logic)
  const isCompletelyOutOfStock = hasVariants
    ? allVariants.every((v) => (v.stock ?? 0) <= 0)
    : (item.stock ?? 0) <= 0;

  const isCurrentVariantOutOfStock = hasVariants
    ? (displayVariant.stock ?? 0) <= 0
    : (item.stock ?? 0) <= 0;

  // Show out of stock if completely out AND it has NO variants
  const showOutOfStock = isCompletelyOutOfStock && !hasVariants;
  const showSelectVariantButton = hasVariants && allVariants.length > 1;
  const buttonDisabled = addingToCart || showOutOfStock;

  let buttonText = 'Add to Bag';
  if (addingToCart) {
    buttonText = 'Adding...';
  } else if (showOutOfStock) {
    buttonText = 'Out of Stock';
  } else if (showSelectVariantButton) {
    buttonText = 'Select Variant';
  } else if (isCurrentVariantOutOfStock) {
    buttonText = 'Out of Stock';
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleProductClick = useCallback(() => {
    if (onProductClick) {
      onProductClick(item);
      return;
    }
    const slug = getProductSlug(item);
    if (slug) navigate(`/product/${slug}`);
  }, [item, onProductClick, navigate]);

  const handleOutOfStockAction = useCallback(() => {
    if (onOutOfStockClick) {
      onOutOfStockClick(item.name || 'This product');
    } else {
      toast.info(`Oops! ${item.name || 'This product'} is out of stock right now. Check back soon!`);
    }
  }, [item, onOutOfStockClick]);

  const handleVariantSelect = useCallback(
    (v) => {
      setTempSelectedVariant(v);
      if (onVariantSelect && item._id) {
        onVariantSelect(item._id, v);
      }
    },
    [onVariantSelect, item._id]
  );

  const handleAddToCart = useCallback(
    async (forceVariant = null) => {
      setAddingToCart(true);
      try {
        let payload;

        if (hasVariants) {
          const chosen =
            forceVariant ||
            tempSelectedVariant ||
            displayVariant ||
            allVariants.find((v) => (v.stock ?? 0) > 0) ||
            allVariants[0];

          if (!chosen || (chosen.stock ?? 0) <= 0) {
            toast.error('Please select an in-stock variant.');
            return;
          }

          payload = {
            productId: item._id,
            variants: [{ variantSku: getSku(chosen), quantity: 1 }],
          };

          // Cache selected variant
          const cache = JSON.parse(localStorage.getItem('cartVariantCache') || '{}');
          cache[item._id] = chosen;
          localStorage.setItem('cartVariantCache', JSON.stringify(cache));
        } else {
          if ((item.stock ?? 0) <= 0) {
            toast.error('Product is out of stock.');
            return;
          }
          payload = { productId: item._id, quantity: 1 };

          const cache = JSON.parse(localStorage.getItem('cartVariantCache') || '{}');
          delete cache[item._id];
          localStorage.setItem('cartVariantCache', JSON.stringify(cache));
        }

        const response = await apiAddToCart(payload);
        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Failed to add to cart');
        }

        toast.success('Product added to cart!');
        if (onAddToCartSuccess) {
          onAddToCartSuccess(item);
        } else {
          navigate('/cartpage');
        }
      } catch (err) {
        console.error('Add to Cart error:', err);
        const msg = getErrorMessage(err) || 'Failed to add product to cart';
        toast.error(msg);
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: location.pathname } });
        }
      } finally {
        setAddingToCart(false);
      }
    },
    [
      hasVariants,
      tempSelectedVariant,
      displayVariant,
      allVariants,
      item,
      onAddToCartSuccess,
      navigate,
      location.pathname,
    ]
  );

  const openOverlay = useCallback((e) => {
    if (e) e.stopPropagation();
    setShowVariantOverlay(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setShowVariantOverlay(false);
  }, []);

  // ─── Display name with variant text ────────────────────────────────────────
  const variantText = displayVariant ? getVariantDisplayText(displayVariant) : '';
  const displayName =
    variantText && variantText.toUpperCase() !== 'DEFAULT'
      ? `${item.name || 'Unnamed Product'} - ${variantText}`
      : item.name || 'Unnamed Product';

  return (
    <div className={wrapperClassName}>
      <div className={cardClassName}>
        {/* ── Product Image with overlays ── */}
        <div
          className="foryou-img-wrapper"
          onClick={() => {
            if (showOutOfStock) {
              handleOutOfStockAction();
            } else {
              handleProductClick();
            }
          }}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <img
            src={imageUrl}
            alt={item.name || 'Product'}
            className="foryou-img img-fluid"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.png';
            }}
            style={{
              opacity: showOutOfStock ? 0.6 : 1,
              filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
            }}
          />

          {/* VTO badge */}
          {item?.supportsVTO && (
            <div
              className="support-beauty-badge"
              title="Try It On"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick();
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

          {/* Out-of-stock overlay on image */}
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

          {/* Wishlist button */}
          {!showOutOfStock && (
            <button
              className={`product-card-wishlist-btn ${isProductInWishlist ? 'in-wishlist' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (toggleWishlist && displayVariant) {
                  toggleWishlist(item, displayVariant);
                }
              }}
              disabled={wishlistLoading[item._id]}
              title={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlistLoading[item._id] ? (
                <div className="spinner-border spinner-border-sm" role="status" />
              ) : isProductInWishlist ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </button>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
          <div
            className="justify-content-between d-flex flex-column"
            style={{ height: '200px' }}
          >
            {/* Brand */}
            <div className="brand-name small text-muted text-start mb-1 mt-2">
              {typeof item.brandName === 'string'
                ? item.brandName
                : typeof item.brand === 'object' && item.brand?.name
                ? item.brand.name
                : typeof item.brand === 'string'
                ? item.brand
                : 'Unknown Brand'}
            </div>

            {/* Product name */}
            <div className="product-card-title-wrap">
              <h6
                className="foryou-name m-0 p-0"
                onClick={() => {
                  if (showOutOfStock) {
                    handleOutOfStockAction();
                  } else {
                    handleProductClick();
                  }
                }}
                style={{
                  cursor: 'pointer',
                  opacity: showOutOfStock ? 0.6 : 1,
                }}
              >
                {displayName}
              </h6>
            </div>

            {/* OOS inline message */}
            {showOutOfStock && (
              <div className="mt-2 mb-2">
                <span style={{ color: '#dc3545', fontSize: '13px', fontWeight: 500 }}>
                  <FaTimes style={{ fontSize: '11px', marginRight: '4px' }} />
                  Currently unavailable
                </span>
              </div>
            )}

            {/* Price */}
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
                    <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="discount-percent fw-bold ms-2">
                      ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Next-order discount tag */}
            {item.nextOrderDiscountMessage && (
              <div
                className="next-order-discount-tag"
                title={item.nextOrderDiscountMessage}
                onClick={(e) => {
                  e.stopPropagation();
                  window.showDiscountPopup &&
                    window.showDiscountPopup(item.nextOrderDiscountMessage, e.currentTarget);
                }}
              >
                <span className="text-truncate">{item.nextOrderDiscountMessage}</span>
              </div>
            )}

            {/* Add to Bag / Select Variant / Out of Stock button */}
            <div className="cart-section">
              <div className="d-flex align-items-center justify-content-between">
                <button
                  className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${
                    showOutOfStock ? 'btn-secondary' : addingToCart ? '' : 'btn-outline-dark'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showOutOfStock) {
                      handleOutOfStockAction();
                    } else if (showSelectVariantButton) {
                      openOverlay(e);
                    } else {
                      handleAddToCart();
                    }
                  }}
                  disabled={buttonDisabled && !showOutOfStock}
                  style={{
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    opacity: showOutOfStock ? 0.8 : 1,
                    cursor: showOutOfStock ? 'pointer' : buttonDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
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
                      {!buttonDisabled && !addingToCart && !showSelectVariantButton && (
                        <img
                          src={bagIcon}
                          className="img-fluid ms-1"
                          style={{ marginTop: '-3px', height: '20px' }}
                          alt="Bag-icon"
                        />
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop Variant Overlay ── */}
        {showVariantOverlay && !showOutOfStock && (
          <div
            className="variant-overlay"
            onClick={(e) => {
              e.stopPropagation();
              closeOverlay();
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
                    closeOverlay();
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '40px', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {/* Variant options */}
              <div className="variant-overlay-body">
                {groupedVariants.color.length > 0 && (
                  <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                    {groupedVariants.color.map((v) => {
                      const isSelected = displayVariant.sku
                        ? displayVariant.sku === v.sku
                        : displayVariant._id === v._id;
                      const isOos = (v.stock ?? 0) <= 0;
                      return (
                        <div
                          key={v.sku || v._id}
                          style={{
                            cursor: isOos ? 'not-allowed' : 'pointer',
                            position: 'relative',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOos) handleVariantSelect(v);
                          }}
                          title={v.shadeName || v.name}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '20%',
                              backgroundColor: v.hex || '#ccc',
                              border: isSelected ? '3px solid #000' : '1px solid #ddd',
                              opacity: isOos ? 0.4 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {isSelected && (
                              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                                ✓
                              </span>
                            )}
                          </div>
                          {isOos && (
                            <span
                              style={{
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
                                fontSize: 16,
                                pointerEvents: 'none',
                              }}
                            >
                              ✕
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {groupedVariants.text.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                    {groupedVariants.text.map((v) => {
                      const isSelected = displayVariant.sku
                        ? displayVariant.sku === v.sku
                        : displayVariant._id === v._id;
                      const isOos = (v.stock ?? 0) <= 0;
                      return (
                        <div
                          key={v.sku || v._id}
                          className="variant-text-item"
                          style={{ cursor: isOos ? 'not-allowed' : 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOos) handleVariantSelect(v);
                          }}
                        >
                          <div
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid #000' : '1px solid #ddd',
                              background: isSelected ? '#f8f9fa' : '#fff',
                              opacity: isOos ? 0.4 : 1,
                              textDecoration: isOos ? 'line-through' : 'none',
                            }}
                          >
                            {getVariantDisplayText(v)}
                            {isOos && <span className="text-danger small ms-1">(OOS)</span>}
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
                  Selected:{' '}
                  <span className="text-dark fw-bold">{getVariantDisplayText(displayVariant)}</span>
                </div>
                <div className="mt-1 mb-2 text-start">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick();
                    }}
                    className="text-decoration-none fw-semibold"
                    style={{ cursor: 'pointer', fontSize: '12px' }}
                  >
                    View Details
                  </span>
                </div>
                <button
                  className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${
                    addingToCart ? 'btn-dark' : 'btn-outline-dark'
                  }`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    const chosen =
                      tempSelectedVariant ||
                      displayVariant ||
                      allVariants.find((v) => (v.stock ?? 0) > 0) ||
                      allVariants[0];
                    if (chosen) {
                      handleVariantSelect(chosen);
                    }
                    await handleAddToCart(chosen);
                    closeOverlay();
                  }}
                  disabled={addingToCart || isCurrentVariantOutOfStock}
                  style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Adding...
                    </>
                  ) : isCurrentVariantOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      Add to Bag
                      {!addingToCart && !isCurrentVariantOutOfStock && (
                        <img
                          src={bagIcon}
                          className="img-fluid ms-1"
                          style={{ marginTop: '-3px', height: '20px' }}
                          alt="Bag-icon"
                        />
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Bottom Sheet ── */}
      {showVariantOverlay && !showOutOfStock && (
        <>
          <div
            className="mobile-sheet-backdrop"
            onClick={(e) => {
              e.stopPropagation();
              closeOverlay();
            }}
          />
          <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
            <div
              className="mobile-sheet-grabber"
              onClick={closeOverlay}
              style={{ cursor: 'pointer' }}
            />
            <div className="mobile-sheet-header">
              <h3 className="mobile-sheet-title">
                {groupedVariants.color.length > 0 ? 'Select Shade' : 'Select Variant'}
              </h3>
              <button className="mobile-sheet-close-btn" onClick={closeOverlay}>
                &times;
              </button>
            </div>

            <div className="mobile-sheet-body">
              {/* Color variants */}
              {groupedVariants.color.length > 0 && (
                <div className="mobile-sheet-variants-grid">
                  {groupedVariants.color.map((v) => {
                    const isSelected = displayVariant.sku
                      ? displayVariant.sku === v.sku
                      : displayVariant._id === v._id;
                    const isOos = (v.stock ?? 0) <= 0;
                    return (
                      <div
                        key={v.sku || v._id}
                        className={`mobile-sheet-variant-item ${isSelected ? 'selected' : ''} ${isOos ? 'oos' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOos) handleVariantSelect(v);
                        }}
                      >
                        <div
                          className={`mobile-sheet-color-circle ${isSelected ? 'selected' : ''} ${isOos ? 'oos' : ''}`}
                          style={{ backgroundColor: v.hex || '#ccc', position: 'relative' }}
                        >
                          {isSelected && <FaCheck className="mobile-sheet-check-icon" />}
                          {isOos && (
                            <span
                              style={{
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
                              }}
                            >
                              ✕
                            </span>
                          )}
                        </div>
                        <span className="mobile-sheet-variant-text">
                          {getVariantDisplayText(v)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Text variants */}
              {groupedVariants.text.length > 0 && groupedVariants.color.length === 0 && (
                <div className="mobile-sheet-variants-grid">
                  {groupedVariants.text.map((v) => {
                    const isSelected = displayVariant.sku
                      ? displayVariant.sku === v.sku
                      : displayVariant._id === v._id;
                    const isOos = (v.stock ?? 0) <= 0;
                    return (
                      <div
                        key={v.sku || v._id}
                        className="mobile-sheet-variant-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOos) handleVariantSelect(v);
                        }}
                      >
                        <button
                          className={`mobile-sheet-text-pill ${isSelected ? 'selected' : ''} ${isOos ? 'oos' : ''}`}
                        >
                          <span>{getVariantDisplayText(v)}</span>
                          {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
                          {isOos && (
                            <span
                              style={{
                                color: 'red',
                                fontWeight: 'bold',
                                marginLeft: '6px',
                                fontSize: '12px',
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

            {/* Mobile sheet footer */}
            <div className="mobile-sheet-footer">
              <div className="mobile-sheet-footer-left">
                <span className="mobile-sheet-selected-label">
                  {getVariantDisplayText(displayVariant)}
                </span>
                <div className="mobile-sheet-price-row">
                  <span className="mobile-sheet-current-price">
                    {formatPrice(displayPrice)}
                  </span>
                  {originalPrice > displayPrice && (
                    <>
                      <span className="mobile-sheet-original-price">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="mobile-sheet-discount">
                        ({discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span
                className="mobile-sheet-view-details"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick();
                  closeOverlay();
                }}
              >
                View Details
              </span>
            </div>

            <div className="mobile-sheet-action-wrap">
              <button
                className="mobile-sheet-btn-add"
                disabled={addingToCart || isCurrentVariantOutOfStock}
                onClick={async (e) => {
                  e.stopPropagation();
                  const chosen =
                    tempSelectedVariant ||
                    displayVariant ||
                    allVariants.find((v) => (v.stock ?? 0) > 0) ||
                    allVariants[0];
                  if (chosen) {
                    handleVariantSelect(chosen);
                  }
                  await handleAddToCart(chosen);
                  closeOverlay();
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    Adding...
                  </>
                ) : isCurrentVariantOutOfStock ? (
                  'Out of Stock'
                ) : (
                  'Add to Bag'
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
