// src/pages/IngredientDetail.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getIngredientByName, getProductsByIngredient } from "../api/ingredientApi";
import {
  FaSun, FaMoon, FaCheckCircle, FaExclamationTriangle, FaHourglassHalf, FaExternalLinkAlt,
  FaStar, FaHeart, FaRegHeart, FaTimes, FaCheck
} from "react-icons/fa";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlistApi";
import { addToCart as apiAddToCart } from "../api/cartApi";
import { getErrorMessage } from "../utils/errorHandler";
import { CartContext } from "../context/CartContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import SectionError from "../components/common/SectionError";
import { toast } from "react-toastify";
import Bag from "../assets/Bag.svg";
import "../styles/IngredientDetail.css";
import "../styles/BestSellers.css";

// Lottie loader
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Helper functions (same as BestSellers)
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const normalized = hex.trim().toLowerCase();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
};

const getVariantDisplayText = (variant) => {
  if (!variant) return "";
  return (
    variant.shadeName ||
    variant.name ||
    variant.size ||
    variant.ml ||
    variant.weight ||
    "Default"
  ).toUpperCase();
};

const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [] };
  variants.forEach((v) => {
    if (!v) return;
    if (v.hex && isValidHexColor(v.hex)) {
      grouped.color.push(v);
    } else {
      grouped.text.push(v);
    }
  });
  return grouped;
};

const getBrandName = (product) => {
  if (!product?.brand) return "Unknown Brand";
  if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
  if (typeof product.brand === "string") return product.brand;
  return "Unknown Brand";
};

export default function IngredientDetail() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [ingredient, setIngredient] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states matching BestSellers logic
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [nextProductsCursor, setNextProductsCursor] = useState(null);

  // Wishlist and Cart context/states
  const { syncCartFromBackend } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  const formatPrice = (price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const getProductSlug = (product) => {
    if (product.slugs && product.slugs.length > 0) return product.slugs[0];
    return product.slug || product._id;
  };

  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item =>
      (item.productId === productId || item._id === productId) &&
      item.sku === sku
    );
  };

  const showToastMsg = (message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "info") {
      toast.info(message, { autoClose: duration });
    } else {
      toast.error(message, { autoClose: duration });
    }
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await getWishlist();
        if (response.data?.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
        const formattedWishlist = localWishlist.map(item => ({
          productId: item._id,
          _id: item._id,
          sku: item.sku,
          name: item.name,
          variant: item.variantName,
          image: item.image,
          displayPrice: item.displayPrice,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          status: item.status,
          avgRating: item.avgRating,
          totalRatings: item.totalRatings
        }));
        setWishlistData(formattedWishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWishlistData([]);
    }
  };

  const toggleWishlist = async (prod, variant) => {
    if (!prod || !variant) {
      showToastMsg("Please select a variant first", "error");
      return;
    }

    const productId = prod._id;
    const sku = getSku(variant);

    if (!user || user.guest) {
      showToastMsg("Please login to use wishlist", "error");
      localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId, sku }));
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (currentlyInWishlist) {
        await removeFromWishlist(productId, { sku });
        showToastMsg("Removed from wishlist!", "success");
      } else {
        await addToWishlist(productId, { sku });
        showToastMsg("Added to wishlist!", "success");
      }
      await fetchWishlistData();
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        showToastMsg("Please login to use wishlist", "error");
        localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId, sku }));
        navigate("/login", { state: { from: "/wishlist" } });
      } else {
        showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
      }
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (prod, forceVariant = null) => {
    setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = variants.length > 0;

      const displayVariant = forceVariant || selectedVariants[prod._id] || (hasVar ? (variants.find(v => v.stock > 0) || variants[0]) : null);

      if (hasVar) {
        if (!displayVariant || displayVariant.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }
      }

      let payload;
      if (hasVar) {
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(displayVariant), quantity: 1 }],
        };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = displayVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        payload = { productId: prod._id, quantity: 1 };
      }

      const { data } = await apiAddToCart(payload);
      if (!data?.success) throw new Error(data?.message || "Cart add failed");

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (err) {
      console.error("Add to Cart error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to add to cart";
      showToastMsg(msg, "error");
      if (err.response?.status === 401) navigate("/login", { state: { from: `/ingredient/${name}` } });
    } finally {
      setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
    }
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Load details
      const detailRes = await getIngredientByName(name);
      if (detailRes.data && detailRes.data.success) {
        setIngredient(detailRes.data.ingredient);
      }

      // Load catalog products containing this ingredient
      setProdLoading(true);
      const prodRes = await getProductsByIngredient(name, null, 8);
      if (prodRes.data && prodRes.data.products) {
        setProducts(prodRes.data.products || []);
        const total = prodRes.data.pagination?.total || prodRes.data.products.length || 0;
        setTotalProducts(total);
        setHasMoreProducts(prodRes.data.pagination?.hasMore || false);
        setNextProductsCursor(prodRes.data.pagination?.nextCursor || null);
      }
    } catch (err) {
      console.error("Error fetching ingredient data:", err);
      if (err.response?.status === 404) {
        navigate("/404");
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
      setProdLoading(false);
    }
  }, [name, navigate]);

  useEffect(() => {
    if (name) {
      fetchAllData();
    }
  }, [name, fetchAllData]);

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const loadMoreProducts = async () => {
    if (!nextProductsCursor || !hasMoreProducts || prodLoading) return;
    setProdLoading(true);
    try {
      const prodRes = await getProductsByIngredient(name, nextProductsCursor, 8);
      if (prodRes.data && prodRes.data.products) {
        setProducts(prev => [...prev, ...(prodRes.data.products || [])]);
        setHasMoreProducts(prodRes.data.pagination?.hasMore || false);
        setNextProductsCursor(prodRes.data.pagination?.nextCursor || null);
      }
    } catch (err) {
      console.error("Error fetching more products:", err);
    } finally {
      setProdLoading(false);
    }
  };

  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const openVariantOverlay = (productId, type = "all") => {
    setSelectedVariantType(type);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
    setTempSelectedVariants({});
  };

  const handleOutOfStockClick = (name) => {
    setOutOfStockProductName(name);
    setShowOutOfStockPopup(true);
  };

  const closeOutOfStockPopup = () => {
    setShowOutOfStockPopup(false);
    setOutOfStockProductName("");
  };

  const renderProductCard = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    const hasVar = vars.length > 0;

    const isVariantSelected = !!selectedVariants[prod._id];
    const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find(v => v.stock > 0) || vars[0]) : null);

    const grouped = groupVariantsByType(vars);
    const totalVars = vars.length;
    const sku = displayVariant ? getSku(displayVariant) : null;
    const inWl = sku ? isInWishlist(prod._id, sku) : false;
    const slugPr = prod.slugs?.[0] || prod.slug || prod._id;

    const rawImage = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0];
    const img = rawImage
      ? (rawImage.startsWith("http") ? rawImage : `https://res.cloudinary.com/dekngswix/image/upload/${rawImage}`)
      : "/placeholder.png";

    const isAdding = addingToCart[prod._id];
    const isCompletelyOutOfStock = hasVar && vars.every(v => v.stock <= 0);
    const isCurrentVariantOutOfStock = displayVariant ? displayVariant.stock <= 0 : prod.stock <= 0;
    const showOutOfStock = isCompletelyOutOfStock && !hasVar;
    const showSelectVariantButton = hasVar && vars.length > 1;
    const buttonDisabled = isAdding || showOutOfStock;

    let buttonText = "Add to Bag";
    if (isAdding) {
      buttonText = "Adding...";
    } else if (showOutOfStock) {
      buttonText = "Out of Stock";
    } else if (showSelectVariantButton) {
      buttonText = "Select Variant";
    } else if (isCurrentVariantOutOfStock) {
      buttonText = "Out of Stock";
    }

    const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
    const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
    const disc = orig > price;
    const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;

    return (
      <div key={prod._id} className="col-6 col-md-4 col-lg-3 position-relative page-title-main-name">
        <div className="foryou-card-wrapper">
          <div className="foryou-card">
            {/* Product Image with Overlays */}
            <div
              className="foryou-img-wrapper"
              onClick={() => {
                if (showOutOfStock) {
                  handleOutOfStockClick(prod.name);
                } else {
                  navigate(`/product/${slugPr}`);
                }
              }}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img
                src={img}
                alt={prod.name}
                className="foryou-img img-fluid"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
                style={{
                  opacity: showOutOfStock ? 0.6 : 1,
                  filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
                  height: 200,
                  objectFit: "contain",
                }}
              />

              {prod?.supportsVTO && (
                <div
                  className="support-beauty-badge"
                  title="Try It On"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${slugPr}`);
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
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
                <button
                  className={`product-card-wishlist-btn ${inWl ? 'in-wishlist' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (displayVariant || !hasVar) {
                      toggleWishlist(prod, displayVariant || {});
                    }
                  }}
                  disabled={wishlistLoading[prod._id]}
                  title={inWl ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlistLoading[prod._id] ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : inWl ? (
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
                <div className="brand-name small text-muted text-start mb-1 mt-2">
                  {getBrandName(prod)}
                </div>

                {/* Product Name */}<div className="product-card-title-wrap"><h6
                  className="foryou-name m-0 p-0 text-start"
                  onClick={() => {
                    if (showOutOfStock) {
                      handleOutOfStockClick(prod.name);
                    } else {
                      navigate(`/product/${slugPr}`);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    opacity: showOutOfStock ? 0.6 : 1,
                  }}
                >
                  {(() => {
                    const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                    const nameStr = prod.name || "Unnamed Product";
                    return varText && varText.toUpperCase() !== "DEFAULT" ? `${nameStr} - ${varText}` : nameStr;
                  })()}
                </h6></div>{/* Show out of stock message in variant area */}
                {showOutOfStock && (
                  <div className="mt-2 mb-2 text-start">
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
                <div className="price-section mb-3 mt-auto text-start">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <span
                      className="current-price fw-400 fs-5"
                      style={{
                        textDecoration: showOutOfStock ? 'line-through' : 'none',
                        opacity: showOutOfStock ? 0.6 : 1,
                      }}
                    >
                      {formatPrice(price)}
                    </span>

                    {disc && !showOutOfStock && (
                      <>
                        <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                          {formatPrice(orig)}
                        </span>
                        <span className="discount-percent fw-bold ms-2">
                          ({pct}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                  {prod.nextOrderDiscountMessage && (
                    <div className="next-order-discount-tag" title={prod.nextOrderDiscountMessage} onClick={(e) => { e.stopPropagation(); window.showDiscountPopup && window.showDiscountPopup(prod.nextOrderDiscountMessage, e.currentTarget); }}>
                      <span className="text-truncate">{prod.nextOrderDiscountMessage}</span>
                    </div>
                  )}

                {/* Add to Cart / Select Variant / Out of Stock Button */}
                <div className="cart-section">
                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${showOutOfStock
                        ? "btn-secondary"
                        : isAdding
                          ? ""
                          : "btn-outline-dark"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (showOutOfStock) {
                          handleOutOfStockClick(prod.name);
                        } else if (showSelectVariantButton) {
                          openVariantOverlay(prod._id, "all");
                        } else {
                          handleAddToCart(prod);
                        }
                      }}
                      disabled={buttonDisabled && !showOutOfStock}
                      style={{
                        transition: "background-color 0.3s ease, color 0.3s ease",
                        opacity: showOutOfStock ? 0.8 : 1,
                        cursor: showOutOfStock ? 'pointer' : (buttonDisabled ? 'not-allowed' : 'pointer'),
                      }}
                    >
                      {isAdding ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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
                          {!buttonDisabled && !isAdding && !showSelectVariantButton && (
                            <img src={Bag} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variant Overlay */}
          {showVariantOverlay === prod._id && !showOutOfStock && (
            <div className="variant-overlay" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}>
              <div
                className="variant-overlay-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                  <h5 className="m-0 page-title-main-name">Select Variant</h5>
                  <button
                    onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '40px',
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="variant-overlay-body">
                  {grouped.color.length > 0 && (
                    <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                      {grouped.color.map((v) => {
                        const isSelected = displayVariant.sku === v.sku;
                        const isOutOfStock = (v.stock ?? 0) <= 0;

                        return (
                          <div
                            key={getSku(v) || v._id}
                            style={{ cursor: isOutOfStock ? "not-allowed" : "pointer", position: "relative" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isOutOfStock) {
                                handleVariantSelect(prod._id, v);
                                setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
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
                                border: isSelected ? "3px solid #000" : "1px solid #ddd",
                                opacity: isOutOfStock ? 0.4 : 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {isSelected && (
                                <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                                  ✓
                                </span>
                              )}
                            </div>
                            {isOutOfStock && (
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

                  {grouped.text.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                      {grouped.text.map((v) => {
                        const isSelected = displayVariant.sku === v.sku;
                        const isOutOfStock = (v.stock ?? 0) <= 0;

                        return (
                          <div
                            key={getSku(v) || v._id}
                            className="variant-text-item"
                            style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isOutOfStock) {
                                handleVariantSelect(prod._id, v);
                                setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
                              }
                            }}
                          >
                            <div
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                background: isSelected ? "#f8f9fa" : "#fff",
                                opacity: isOutOfStock ? 0.4 : 1,
                                textDecoration: isOutOfStock ? "line-through" : "none"
                              }}
                            >
                              {getVariantDisplayText(v)}
                              {isOutOfStock && <span className="text-danger small ms-1">(OOS)</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="variant-overlay-footer">
                  <div className="small text-muted fw-semibold ">
                    Selected: <span className="text-dark fw-bold ">{getVariantDisplayText(displayVariant)}</span>
                  </div>
                  <div className="mt-1 mb-2 text-start">
                    <span
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/${slugPr}`); }}
                      className="text-decoration-none fw-semibold"
                      style={{ cursor: 'pointer', fontSize: '12px' }}
                    >
                      View Details
                    </span>
                  </div>
                  <button
                    className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const chosen = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (vars.find((v) => v.stock > 0) || vars[0]);
                      if (chosen) {
                        handleVariantSelect(prod._id, chosen);
                      }
                      await handleAddToCart(prod, chosen);
                      closeVariantOverlay();
                    }}
                    disabled={isAdding || (displayVariant && displayVariant.stock <= 0)}
                    style={{
                      transition: "background-color 0.3s ease, color 0.3s ease",
                    }}
                  >
                    {isAdding ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding...
                      </>
                    ) : displayVariant?.stock <= 0 ? (
                      "Out of Stock"
                    ) : (
                      <>
                        Add to Bag
                        {!isAdding && displayVariant?.stock > 0 && (
                          <img src={Bag} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error && !ingredient) {
    return (
      <>
        <Header />
        <div className="container my-5 py-5">
          <SectionError
            error={error}
            message="Failed to load ingredient details."
            variant="full"
            onRetry={fetchAllData}
          />
        </div>
        <Footer />
      </>
    );
  }

  if (loading || !ingredient) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "rgba(255,255,255,0.97)", zIndex: 9999, backdropFilter: "blur(10px)" }}
      >
        <div className="text-center">
          <DotLottieReact
            className="mb-4"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
            style={{ width: "100px", height: "100px" }}
          />
          <p className="text-muted mb-0 page-title-main-name">Fetching Ingredient Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="ing-detail-page page-title-main-name">
        {/* Ingredient Header Hero */}
        <section className="ing-hero-card mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="ing-category-badge mb-2">
                {typeof ingredient.category === "string" ? ingredient.category : (ingredient.category?.name || "Active")}
              </span>
              <h1 className="fw-bold text-dark mb-1 page-title-main-name text-capitalize">{ingredient.name.toLowerCase()}</h1>
              {ingredient.aliases?.length > 0 && (
                <p className="text-muted small mb-0">Also known as: {ingredient.aliases.join(", ")}</p>
              )}
            </div>

            {/* Quick Profile Badges */}
            <div className="d-flex flex-wrap gap-2 gap-md-3">
              {ingredient.timeOfDay && (
                <div className="ing-profile-badge">
                  <div className="ing-badge-icon">
                    {ingredient.timeOfDay.includes("AM") && <FaSun style={{ color: "#0077b6" }} className="me-1" />}
                    {ingredient.timeOfDay.includes("PM") && <FaMoon style={{ color: "#0077b6" }} />}
                  </div>
                  <div className="ing-badge-info">
                    <span className="d-block">Best Used At</span>
                    <strong>{ingredient.timeOfDay}</strong>
                  </div>
                </div>
              )}
              {ingredient.concentration && (
                <div className="ing-profile-badge">
                  <div className="ing-badge-icon">🧬</div>
                  <div className="ing-badge-info">
                    <span className="d-block">Recommended Conc.</span>
                    <strong>{ingredient.concentration}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Analysis Grid */}
        <div className="row g-4 text-start mb-5">

          {/* Left Column: Properties & Safety */}
          <div className="col-lg-7">
            <div className="ing-card p-4 h-100">

              {/* Description */}
              <div className="mb-4">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-2 text-capitalize" style={{ fontSize: "16px" }}>What is {ingredient.name.toLowerCase()}?</h4>
                <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                  {ingredient.description || "A premium active cosmetic ingredient featured in upscale skincare and cosmetics. It is widely recognized for its clinical effectiveness and capability to deliver targeted skin improvements."}
                </p>
              </div>

              {/* Benefits */}
              {ingredient.benefits?.length > 0 && (
                <div className="mb-4">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Skin Benefits</h4>
                  <ul className="ps-3 text-muted" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                    {ingredient.benefits.map((benefit, idx) => (
                      <li key={idx} className="mb-1">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suitability */}
              <div className="mb-2 row">
                <div className="col-md-6 mb-3">
                  <h5 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "15px" }}>Good For Skin Types</h5>
                  {ingredient.goodForSkinTypes?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {ingredient.goodForSkinTypes.map((t, idx) => (
                        <span key={idx} className="ing-skin-badge text-capitalize">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted small">All Skin Types</span>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <h5 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "15px" }}>Avoid For Skin Types</h5>
                  {ingredient.avoidForSkinTypes?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {ingredient.avoidForSkinTypes.map((t, idx) => (
                        <span key={idx} className="ing-skin-badge-avoid text-capitalize">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted small">No specific skins to avoid.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layering & Pairing */}
          <div className="col-lg-5">
            <div className="ing-card p-4 h-100">

              {/* Incompatible Layers (Conflicts) */}
              <div className="mb-4">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Avoid Direct Layering (Conflicts)</h4>
                {ingredient.incompatibleWith?.length > 0 ? (
                  <div className="d-flex flex-column gap-2 mt-2">
                    {ingredient.incompatibleWith.map((conflict, idx) => (
                      <div key={idx} className="ing-conflict-card">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong style={{ color: "#0077b6" }}>+{conflict.ingredient}</strong>
                          <span className={conflict.severity === "high" ? "ing-severity-high" : "ing-severity-medium"}>
                            {conflict.severity?.toUpperCase()} RISK
                          </span>
                        </div>
                        <span className="text-muted d-block mb-3" style={{ lineHeight: "1.4" }}>
                          {conflict.reason}
                        </span>
                        <div className="ing-conflict-advice">
                          <strong>Advice:</strong> {conflict.severity === "high" ? "Avoid mixing together" : "Alternate usage times"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted small p-3 bg-white rounded border" style={{ borderColor: "#e2e8f0" }}>No severe direct layering conflicts documented. Safe to use with caution.</div>
                )}
              </div>

              {/* Compatible pairings */}
              {ingredient.compatibleWith?.length > 0 && (
                <div className="mb-4">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Pairs Perfectly With</h4>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {ingredient.compatibleWith.map((c, idx) => (
                      <span key={idx} className="ing-compatible-badge">
                        +{c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Tips */}
              {ingredient.usageTips?.length > 0 && (
                <div>
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "16px" }}>Usage Guidelines</h4>
                  <ul className="ps-3 text-muted small" style={{ lineHeight: "1.6" }}>
                    {ingredient.usageTips.map((tip, idx) => (
                      <li key={idx} className="mb-1">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Products shelf containing this ingredient */}
        <section className="catalog-shelf mt-5">
          <div className="border-bottom pb-2 mb-4 text-start">
            <h3 className="fw-bold text-dark mb-1 text-capitalize">Catalog Products containing {ingredient.name.toLowerCase()}</h3>
            <p className="text-muted small mb-0">Shop Joyory products formulated with active <span className="text-capitalize">{ingredient.name.toLowerCase()}</span> ({totalProducts} match{totalProducts !== 1 && "es"} found)</p>
          </div>

          {products.length === 0 ? (
            <div className="p-5 border rounded text-center text-muted bg-light">
              🧴 Currently, no products in our catalog match this specific ingredient. Check back soon!
            </div>
          ) : (
            <>
              <div className="row g-4 text-start">
                {products.map(renderProductCard)}
              </div>

              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="mt-4 text-center">
                  <button
                    className="btn btn-outline-dark px-4 py-2"
                    onClick={loadMoreProducts}
                    disabled={prodLoading}
                    style={{ borderRadius: "24px", fontSize: "13px" }}
                  >
                    {prodLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading more products...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Footer />

      {/* Mobile and Out of Stock elements rendered inside page structure */}
      {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
      {showVariantOverlay && (() => {
        const item = products.find(p => p._id === showVariantOverlay);
        if (!item) return null;

        const allVariants = Array.isArray(item.variants) ? item.variants : [];
        const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.length > 0 ? (allVariants.find(v => v.stock > 0) || allVariants[0]) : null) || {};
        const groupedVariants = groupVariantsByType(allVariants);
        const isAdding = addingToCart[item._id];
        const isCurrentVariantOutOfStock = displayVariant.stock <= 0;

        const hasColorVariants = groupedVariants.color.length > 0;
        const hasTextVariants = groupedVariants.text.length > 0;

        return (
          <>
            <div
              className="mobile-sheet-backdrop"
              onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}
              style={{ display: "block" }}
            />
            <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()} style={{ display: "flex" }}>
              <div className="mobile-sheet-grabber" onClick={closeVariantOverlay} style={{ cursor: 'pointer' }} />

              <div className="mobile-sheet-header">
                <h3 className="mobile-sheet-title">
                  {hasColorVariants ? "Select Shade" : "Select Variant"}
                </h3>
                <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
                  &times;
                </button>
              </div>

              <div className="mobile-sheet-body">
                {hasColorVariants && (
                  <div className="mobile-sheet-variants-grid">
                    {groupedVariants.color.map((v) => {
                      const isSelected = displayVariant.sku === v.sku;
                      const isOutOfStock = (v.stock ?? 0) <= 0;
                      const variantText = getVariantDisplayText(v);

                      return (
                        <div
                          key={getSku(v) || v._id}
                          className={`mobile-sheet-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) {
                              handleVariantSelect(item._id, v);
                              setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
                            }
                          }}
                        >
                          <div
                            className={`mobile-sheet-color-circle ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}
                            style={{ backgroundColor: v.hex || "#ccc", position: "relative" }}
                          >
                            {isSelected && (
                              <FaCheck className="mobile-sheet-check-icon" />
                            )}
                            {isOutOfStock && (
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

                {hasTextVariants && !hasColorVariants && (
                  <div className="mobile-sheet-variants-grid">
                    {groupedVariants.text.map((v) => {
                      const isSelected = displayVariant.sku === v.sku;
                      const isOutOfStock = (v.stock ?? 0) <= 0;
                      const variantText = getVariantDisplayText(v);

                      return (
                        <div
                          key={getSku(v) || v._id}
                          className="mobile-sheet-variant-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) {
                              handleVariantSelect(item._id, v);
                              setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
                            }
                          }}
                        >
                          <button className={`mobile-sheet-text-pill ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}>
                            <span>{variantText}</span>
                            {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
                            {isOutOfStock && (
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

              <div className="mobile-sheet-footer">
                <div className="mobile-sheet-footer-left">
                  <span className="mobile-sheet-selected-label">
                    {getVariantDisplayText(displayVariant)}
                  </span>
                  <div className="mobile-sheet-price-row">
                    <span className="mobile-sheet-current-price">
                      {formatPrice(displayVariant.displayPrice || displayVariant.discountedPrice)}
                    </span>
                    {displayVariant.originalPrice > (displayVariant.displayPrice || displayVariant.discountedPrice) && (
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
                    navigate(`/product/${getProductSlug(item)}`);
                    closeVariantOverlay();
                  }}
                >
                  View Details
                </span>
              </div>

              <div className="mobile-sheet-action-wrap">
                <button
                  className="mobile-sheet-btn-add"
                  disabled={isAdding || isCurrentVariantOutOfStock}
                  onClick={async (e) => {
                    e.stopPropagation();
                    const chosen = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                    if (chosen) {
                      handleVariantSelect(item._id, chosen);
                    }
                    await handleAddToCart(item, chosen);
                    closeVariantOverlay();
                  }}
                >
                  {isAdding ? (
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

      {/* ===================== OUT OF STOCK POPUP ===================== */}
      {showOutOfStockPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeOutOfStockPopup}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ fontWeight: 600, marginBottom: '15px' }}>Out of Stock</h4>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '25px' }}>
              We apologize, but <strong>{outOfStockProductName}</strong> is currently out of stock. We are working hard to restock it as soon as possible.
            </p>
            <button
              className="btn btn-dark w-100"
              onClick={closeOutOfStockPopup}
              style={{ padding: '10px 0', fontWeight: 600 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
