import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../context/UserContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Recommendations.css";
import bagIcon from "../assets/bag.svg";

// Helper functions (same as Foryou)
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

const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [], default: [] };
  variants?.forEach((v) => {
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

export default function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const {
    shade = null,
    undertoneKey = null,
    family = null,
    formulation = null,
    recommendations = [],
    suggestions = [],
  } = location.state || {};

  // States for product functionality
  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  const handleOutOfStockClick = (name) => {
    setOutOfStockProductName(name);
    setShowOutOfStockPopup(true);
  };
  const closeOutOfStockPopup = () => {
    setShowOutOfStockPopup(false);
    setOutOfStockProductName("");
  };

  // Toast Utility
  const showToastMsg = (message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "error") {
      toast.error(message, { autoClose: duration });
    } else {
      toast.info(message, { autoClose: duration });
    }
  };

  // Wishlist functions
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item =>
      (item.productId === productId || item._id === productId) &&
      item.sku === sku
    );
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axiosInstance.get("/api/user/wishlist");
        if (response.data.success) {
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
    if (!user || user.guest) {
      showToastMsg("Please login to use wishlist", "error");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!prod || !variant) {
      showToastMsg("Please select a variant first", "error");
      return;
    }

    const productId = prod._id;
    const sku = getSku(variant);
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
            data: { sku: sku }
          });
          showToastMsg("Removed from wishlist!", "success");
        } else {
          await axiosInstance.post(`/api/user/wishlist/${productId}`, { sku: sku });
          showToastMsg("Added to wishlist!", "success");
        }
        await fetchWishlistData();
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
        if (currentlyInWishlist) {
          const updatedWishlist = guestWishlist.filter(item =>
            !(item._id === productId && item.sku === sku)
          );
          localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
          showToastMsg("Removed from wishlist!", "success");
        } else {
          const productData = {
            _id: productId,
            name: prod.name,
            brand: getBrandName(prod),
            price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            images: variant.images || prod.images || ["/placeholder.png"],
            image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
            slug: prod.slugs?.[0] || prod.slug || prod._id,
            sku: sku,
            variantSku: sku,
            variantId: sku,
            variantName: variant.shadeName || variant.name || "Default",
            shadeName: variant.shadeName || variant.name || "Default",
            variant: variant.shadeName || variant.name || "Default",
            hex: variant.hex || "#cccccc",
            stock: variant.stock || 0,
            status: variant.stock > 0 ? "inStock" : "outOfStock",
            avgRating: prod.avgRating || 0,
            totalRatings: prod.totalRatings || 0,
            commentsCount: prod.totalRatings || 0,
            discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
              ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
              : 0
          };

          guestWishlist.push(productData);
          localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
          showToastMsg("Added to wishlist!", "success");
        }
        await fetchWishlistData();
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        showToastMsg("Please login to use wishlist", "error");
        navigate("/login");
      } else {
        showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
      }
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Variant overlay helpers
  const openVariantOverlay = (productId, type = "all", e) => {
    if (e) e.stopPropagation();
    setSelectedVariantType(type);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
    setTempSelectedVariants({});
  };

  // UPDATED: Variant selection - same as ProductPage
  const handleVariantSelect = useCallback((pid, v) => {
    setSelectedVariants((p) => ({ ...p, [pid]: v }));
  }, []);

  // Product navigation
  const handleProductClick = (product) => {
    const productSlug = product.slugs?.[0] || product.slug || product._id;
    navigate(`/product/${productSlug}`);
  };

  // UPDATED: Add to Cart - same logic as ProductPage
  const handleAddToCart = async (prod, forceVariant = null) => {
    setAddingToCart((p) => ({ ...p, [prod._id]: true }));
    try {
      const vars = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
      const hasVar = vars.length > 0;
      let payload;

      if (hasVar) {
        const sel = forceVariant || selectedVariants[prod._id] || (vars.find((v) => v.stock > 0) || vars[0]);
        if (!sel || sel.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(sel), quantity: 1 }],
        };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = sel;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }
        payload = { productId: prod._id, quantity: 1 };
      }

      const response = await axiosInstance.post("/api/user/cart/add", payload);
      if (!response.data.success) throw new Error(response.data.message || "Cart add failed");

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to add to cart";
      showToastMsg(msg, "error");
      if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
    } finally {
      setAddingToCart((p) => ({ ...p, [prod._id]: false }));
    }
  };

  // Format price
  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // Fetch wishlist
  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const handleBack = () => navigate(-1);

  const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
  const hasSuggestions = Array.isArray(suggestions) && suggestions.some((s) => Array.isArray(s.products) && s.products.length > 0);

  const displayProducts = hasRecommendations
    ? recommendations
    : hasSuggestions
      ? suggestions.flatMap((s) => s.products || [])
      : [];

  // UPDATED: Render product card - same logic as ProductPage
  const renderProductCard = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : (Array.isArray(prod.shades) ? prod.shades : []);
    const hasVar = vars.length > 0;

    // Check if variant is selected (same as ProductPage)
    const isVariantSelected = !!selectedVariants[prod._id];
    const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);

    const grouped = groupVariantsByType(vars);
    const totalVars = vars.length;
    const sku = displayVariant ? getSku(displayVariant) : null;
    const inWl = sku ? isInWishlist(prod._id, sku) : false;
    const slugPr = prod.slugs?.[0] || prod.slug || prod._id;
    const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
    const isAdding = addingToCart[prod._id];
    
    // Check if product is completely out of stock (all variants OOS)
    const isCompletelyOutOfStock = hasVar ? vars.every(v => v.stock <= 0) : prod.stock <= 0;

    // Check if current selected variant is out of stock
    const isCurrentVariantOutOfStock = displayVariant ? displayVariant.stock <= 0 : prod.stock <= 0;

    // Determine if we should show out of stock state
    const showOutOfStock = isCompletelyOutOfStock;

    // Show select variant button if product has variants but user hasn't selected one yet
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

    // Get price information
    const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
    const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
    const disc = orig > price;
    const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;

    return (
      <div key={prod._id} className="col-6 col-md-4 col-lg-3 mb-4">
        <div className="foryou-card-wrapper recommendations-card">
          <div className="foryou-card">
            {/* Product Image with Overlays */}
            <div
              className="foryou-img-wrapper"
              onClick={() => {
                if (showOutOfStock) {
                  handleOutOfStockClick(prod.name);
                } else {
                  handleProductClick(prod);
                }
              }}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img
                src={img}
                alt={prod.name || "Product"}
                className="foryou-img img-fluid"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
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
                <button className="bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (displayVariant || !hasVar) {
                      toggleWishlist(prod, displayVariant || {});
                    }
                  }}
                  disabled={wishlistLoading[prod._id]}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
                    color: inWl ? '#dc3545' : '#ccc',
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
                    outline: 'none'
                  }}
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
                <div className="brand-name small text-muted mb-1 mt-2 text-start">
                  {getBrandName(prod)}
                </div>

                {/* Product Name */}
                <h6
                  className="foryou-name font-family-Poppins m-0 p-0 text-start"
                  onClick={() => {
                    if (showOutOfStock) {
                      handleOutOfStockClick(prod.name);
                    } else {
                      handleProductClick(prod);
                    }
                  }}
                  style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '500', opacity: showOutOfStock ? 0.6 : 1 }}
                >
                  {(() => {
                    const varName = displayVariant ? getVariantDisplayText(displayVariant) : "";
                    return varName && varName.toUpperCase() !== "DEFAULT" ? `${prod.name} - ${varName}` : prod.name;
                  })()}
                </h6>

                {/* Show out of stock message in variant area */}
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
                <div className="price-section mb-3 text-start">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <span className="current-price fw-400 fs-5" style={{ fontSize: '16px', fontWeight: '600', textDecoration: showOutOfStock ? 'line-through' : 'none', opacity: showOutOfStock ? 0.6 : 1 }}>
                      {formatPrice(price)}
                    </span>
                    {disc && !showOutOfStock && (
                      <>
                        <span className="original-price text-muted text-decoration-line-through ms-2 fs-6" style={{ fontSize: '13px' }}>
                          {formatPrice(orig)}
                        </span>
                        <span className="discount-percent text-danger fw-bold ms-2" style={{ fontSize: '13px' }}>
                          ({pct}% OFF)
                        </span>
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
                      onClick={(e) => { e.stopPropagation(); handleProductClick(prod); }}
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
                          <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
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

  return (
    <>
      <Header />

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
              borderRadius: '12px',
              padding: '30px 40px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              animation: 'popupSlideIn 0.3s ease-out',
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
              <FaTimes />
            </button>

            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
              }}
            >
              <FaTimes
                style={{
                  color: '#dc3545',
                  fontSize: '30px',
                }}
              />
            </div>

            <h5
              className="page-title-main-name"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '10px',
                color: '#333',
              }}
            >
              Out of Stock
            </h5>

            <p
              style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px',
              }}
            >
              "Oops! {outOfStockProductName} is out of stock right now. Check back soon or discover similar items."
            </p>

            <button
              onClick={closeOutOfStockPopup}
              className="btn btn-dark w-100"
              style={{
                borderRadius: '8px',
                padding: '10px',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="container-lg py-4 page-title-main-name">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="recommendations-title mb-3 " style={{ fontSize: '28px', fontWeight: '400' }}>
            {hasRecommendations
              ? "Your Recommended Products"
              : hasSuggestions
                ? "No Exact Match Found – Showing Related Products"
                : "No Products Found"}
          </h1>

          {/* User Selections Summary */}
          {(shade || undertoneKey || family || formulation) && (
            <div className="selection-summary selection-summary-content">
              {shade?.name && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Shade</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {shade.name}</span>
                </div>
              )}
              {undertoneKey && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Undertone</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {undertoneKey}</span>
                </div>
              )}
              {family?.name && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Family</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {family.name}</span>
                </div>
              )}
              {formulation?.name && (
                <div className="selection-item" style={{ textAlign: 'center' }}>
                  <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Formulation</span>
                  <span className="selection-value" style={{ fontWeight: '500' }}>- {formulation.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-5">
            <div className="no-products-icon mb-3" style={{ fontSize: '48px' }}>😔</div>
            <h3 className="mb-3">No products found</h3>
            <p className="text-muted mb-4">
              We couldn't find any products matching your selection. Please try different options.
            </p>
            <button className="btn btn-secondary" onClick={handleBack}>
              Go Back
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {displayProducts.map(renderProductCard)}
            </div>

            <div className="text-center mt-5 pt-4 border-top">
              <button className="btn btn-for-shadetones rounded-pill px-5 py-2" onClick={handleBack}>
                ← Back to Foundation Type
              </button>
            </div>
          </>
        )}
      </div>

      {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
      {showVariantOverlay && (() => {
        const item = displayProducts.find(p => p._id === showVariantOverlay);
        if (!item) return null;

        const allVariants = Array.isArray(item.variants) ? item.variants : (Array.isArray(item.shades) ? item.shades : []);
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
            />
            <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
              {/* Drag grabber */}
              <div className="mobile-sheet-grabber" onClick={closeVariantOverlay} style={{ cursor: 'pointer' }} />

              {/* Header */}
              <div className="mobile-sheet-header">
                <h3 className="mobile-sheet-title">
                  {hasColorVariants ? "Select Shade" : "Select Variant"}
                </h3>
                <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
                  &times;
                </button>
              </div>

              {/* Body content with scrolling swatches */}
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

              {/* Footer Price & Info */}
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
                    handleProductClick(item);
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
      {/* ===================== END MOBILE BOTTOM SHEET DRAWER ===================== */}

      <Footer />
    </>
  );
}




//==============================================================Done_code(Start)=========================================================================================
