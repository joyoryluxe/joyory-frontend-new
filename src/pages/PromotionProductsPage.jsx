import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../context/UserContext.jsx";
import BrandFilter from "../components/common/BrandFilter";
import axiosInstance from "../utils/axiosInstance.js";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import updownarrow from "../assets/updownarrow.svg";
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";
const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
};

const getVariantDisplayText = (v) =>
  (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

const groupVariantsByType = (variants) => {
  const g = { color: [], text: [] };
  (variants || []).forEach((v) => {
    if (!v) return;
    v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
  });
  return g;
};

const getBrandName = (p) => {
  if (!p?.brand) return "Unknown Brand";
  if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
  if (typeof p.brand === "string") return p.brand;
  return "Unknown Brand";
};

const PromotionProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [promotionMeta, setPromotionMeta] = useState(null);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [filterData, setFilterData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});

  // Unified Filters (same structure as ProductPage)
  const [filters, setFilters] = useState({
    brandIds: [],
    categoryIds: [],
    skinTypes: [],
    formulations: [],
    finishes: [],
    ingredients: [],
    priceRange: null,
    discountRange: null,
    minRating: "",
    sort: "recent",
  });

  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
  const [showDesktopSortDropdown, setShowDesktopSortDropdown] = useState(false);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  const sortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    const getProductPrice = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
      return displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
    };
    const getProductDiscount = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
      const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
      const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
      return orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
    };
    const getProductRating = (prod) => {
      return prod.avgRating || prod.rating || 0;
    };
    const sorted = [...products];
    if (filters.sort === 'priceHighToLow') {
      sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    } else if (filters.sort === 'priceLowToHigh') {
      sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (filters.sort === 'rating') {
      sorted.sort((a, b) => getProductRating(b) - getProductRating(a));
    } else if (filters.sort === 'discountHighToLow') {
      sorted.sort((a, b) => getProductDiscount(b) - getProductDiscount(a));
    } else if (filters.sort === 'discountLowToHigh') {
      sorted.sort((a, b) => getProductDiscount(a) - getProductDiscount(b));
    }
    return sorted;
  }, [products, filters.sort, selectedVariants]);

  const loaderRef = useRef(null);

  /* ===================== WISHLIST ===================== */
  const isInWishlist = (pid, sku) => {
    if (!pid || !sku) return false;
    return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const { data } = await axiosInstance.get("/api/user/wishlist");
        if (data.success) setWishlistData(data.wishlist || []);
      } else {
        const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const toggleWishlist = async (prod, variant) => {
    if (!prod || !variant) return toast.warn("Please select a variant first");
    const pid = prod._id;
    const sku = getSku(variant);

    if (!user || user.guest) {
      toast.error("Please login to use wishlist");
      localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId: pid, sku }));
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    setWishlistLoading((p) => ({ ...p, [pid]: true }));

    try {
      const inWl = isInWishlist(pid, sku);
      if (inWl) {
        await axiosInstance.delete(`/api/user/wishlist/${pid}`, { data: { sku } });
        toast.success("Removed from wishlist!");
      } else {
        await axiosInstance.post(`/api/user/wishlist/${pid}`, { sku });
        toast.success("Added to wishlist!");
      }
      await fetchWishlistData();
    } catch (e) {
      toast.error(e.response?.data?.message || "Wishlist error");
    } finally {
      setWishlistLoading((p) => ({ ...p, [pid]: false }));
    }
  };

  /* ===================== FETCH PRODUCTS ===================== */
  const buildQueryParams = (cursor = null) => {
    const p = new URLSearchParams();

    // Promotion filter
    if (slug) p.append("promoSlug", slug);

    // Multi-select filters
    filters.brandIds?.forEach((id) => p.append("brandIds", id));
    filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
    filters.skinTypes?.forEach((n) => p.append("skinTypes", n.replace(/\+/g, " ")));
    filters.formulations?.forEach((id) => p.append("formulations", id));
    filters.finishes?.forEach((s) => p.append("finishes", s));
    filters.ingredients?.forEach((s) => p.append("ingredients", s));

    if (filters.minRating) p.append("minRating", filters.minRating);
    if (filters.priceRange) {
      p.append("minPrice", filters.priceRange.min);
      if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
    }
    if (filters.discountRange) p.append("minDiscount", filters.discountRange.min);
    // Do not pass sort to backend API due to cursor pagination limitation (nextCursor is null when sorting)
    // if (filters.sort) p.append("sort", filters.sort);

    if (cursor) p.append("cursor", cursor);
    p.append("limit", "9");

    return p.toString();
  };

  const fetchPromotionProducts = async (cursor = null, reset = false) => {
    if (!slug) return;

    try {
      if (reset) {
        setLoading(true);
        setProducts([]);
        setNextCursor(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const query = buildQueryParams(cursor);
      const url = `${PRODUCT_ALL_API}?${query}`;

      const res = await axiosInstance.get(url);
      const data = res.data;

      // Promotion metadata
      if (data.promoMeta) setPromotionMeta(data.promoMeta);

      // Trending categories & filter data (scoped by backend)
      if (data.trendingCategories) setTrendingCategories(data.trendingCategories);
      if (reset && data.filters) setFilterData(data.filters);

      const newProducts = data.products || [];
      const pg = data.pagination || {};

      if (reset) setProducts(newProducts);
      else setProducts((prev) => [...prev, ...newProducts]);

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);

      // Default variant selection
      const def = {};
      newProducts.forEach((pr) => {
        const av = (pr.variants || []).find((v) => v.stock > 0) || pr.variants?.[0];
        if (av) def[pr._id] = av;
      });
      setSelectedVariants((prev) => ({ ...prev, ...def }));

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPromotionProducts(null, true);
  }, [slug, filters]);

  const loadMoreProducts = useCallback(() => {
    if (nextCursor && hasMore && !loadingMore) {
      fetchPromotionProducts(nextCursor, false);
    }
  }, [nextCursor, hasMore, loadingMore]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore || loadingMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMoreProducts(),
      { rootMargin: "100px", threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMoreProducts, hasMore, loadingMore]);

  /* ===================== HANDLERS ===================== */
  const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
  const openVariantOverlay = (pid, t = "all") => {
    setSelectedVariantType(t);
    setShowVariantOverlay(pid);
  };
  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };

  const handleAddToCart = async (prod) => {
    // Same logic as your original + ProductPage
    setAddingToCart((p) => ({ ...p, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = variants.length > 0;
      let payload;

      if (hasVar) {
        const sel = selectedVariants[prod._id] || (variants.find((v) => v.stock > 0) || variants[0]);
        if (!sel || sel.stock <= 0) {
          toast.warning("Please select an in-stock variant.");
          return;
        }
        payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = sel;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          toast.warning("Product is out of stock.");
          return;
        }
        payload = { productId: prod._id, quantity: 1 };
      }

      const { data } = await axiosInstance.post(`${CART_API_BASE}/add`, payload);
      if (!data.success) throw new Error(data.message || "Cart add failed");

      toast.success("Product added to cart!");
      navigate("/cartpage");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add to cart");
      if (e.response?.status === 401) navigate("/login");
    } finally {
      setAddingToCart((p) => ({ ...p, [prod._id]: false }));
    }
  };

  const handleClearAllFilters = () => {
    setFilters({
      brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
      finishes: [], ingredients: [], priceRange: null, discountRange: null,
      minRating: "", sort: "recent",
    });
  };

  const isAnyFilterActive =
    filters.brandIds.length > 0 ||
    filters.categoryIds.length > 0 ||
    filters.skinTypes.length > 0 ||
    filters.formulations.length > 0 ||
    filters.finishes.length > 0 ||
    filters.ingredients.length > 0 ||
    filters.priceRange ||
    filters.discountRange ||
    filters.minRating ||
    filters.sort !== "recent";

  const getProductSlug = (pr) => pr.slugs?.[0] || pr._id;

  /* ===================== RENDER PRODUCT CARD ===================== */
  const renderProductCard = (prod) => {
    const variants = Array.isArray(prod.variants) ? prod.variants : [];
    const hasVar = variants.length > 0;
    const displayVariant = selectedVariants[prod._id] || (hasVar ? variants.find((v) => v.stock > 0) || variants[0] : null);
    const grouped = groupVariantsByType(variants);
    const totalVars = variants.length;
    const sku = displayVariant ? getSku(displayVariant) : null;
    const inWl = sku ? isInWishlist(prod._id, sku) : false;
    const slugPr = getProductSlug(prod);
    const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
    const isAdding = addingToCart[prod._id];
    const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
    const showSelectVariantButton = hasVar && variants.length > 1 && !selectedVariants[prod._id];
    const disabled = isAdding || (!showSelectVariantButton && oos);

    let btnText = "Add to Cart";
    if (isAdding) btnText = "Adding...";
    else if (showSelectVariantButton) btnText = "Select Variant";
    else if (oos) btnText = "Out of Stock";

    return (
      <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative">
        {/* Wishlist Button */}
        <button
          className={`product-card-wishlist-btn ${inWl ? 'in-wishlist' : ''}`}
          onClick={() => toggleWishlist(prod, displayVariant || {})}
          disabled={wishlistLoading[prod._id]}
        >
          {wishlistLoading[prod._id] ? (
            <div className="spinner-border spinner-border-sm" role="status" />
          ) : inWl ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </button>

        <img
          src={img}
          alt={prod.name}
          className="card-img-top"
          style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
          onClick={() => navigate(`/product/${slugPr}`)}
        />

        <div className="card-body p-0 d-flex flex-column" style={{ height: 265 }}>
          <div className="brand-name text-muted small mb-1 fw-medium mt-2">{getBrandName(prod)}</div><div className="product-card-title-wrap"><h5
            className="card-title mt-2 page-title-main-name"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/product/${slugPr}`)}
          >
            {(() => {
              const varName = displayVariant ? getVariantDisplayText(displayVariant) : "";
              return varName && varName.toUpperCase() !== "DEFAULT" ? `${prod.name} - ${varName}` : prod.name;
            })()}
          </h5></div><p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
            {(() => {
              const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
              const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
              const disc = orig > price;
              const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
              return disc ? (
                <>
                  ₹{price}
                  <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
                  <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
                </>
              ) : (
                <>₹{orig}</>
              );
            })()}
          </p>
                  {prod.nextOrderDiscountMessage && (
                    <div className="next-order-discount-tag" title={prod.nextOrderDiscountMessage} onClick={(e) => { e.stopPropagation(); window.showDiscountPopup && window.showDiscountPopup(prod.nextOrderDiscountMessage, e.currentTarget); }}>
                      <span className="text-truncate">{prod.nextOrderDiscountMessage}</span>
                    </div>
                  )}

          <div className="mt-auto">
            <button
              className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
              onClick={() => (showSelectVariantButton ? openVariantOverlay(prod._id) : handleAddToCart(prod))}
              disabled={disabled}
            >
              {isAdding ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Adding...
                </>
              ) : (
                <>
                  {btnText}
                  {!disabled && !isAdding && <img src={Bag} alt="Bag" style={{ height: 20 }} />}
                </>
              )}
            </button>
          </div>
        </div>

        {showVariantOverlay === prod._id && (
          <div className="variant-overlay" onClick={closeVariantOverlay}>
            <div
              className="variant-overlay-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="m-0 page-title-main-name">Select Variant</h5>
                <button
                  onClick={closeVariantOverlay}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '40px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <div className="variant-overlay-body">
                {grouped.color.length > 0 && (
                  <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                    {grouped.color.map((v) => {
                      const sel = selectedVariants[prod._id]?.sku === v.sku || displayVariant.sku === v.sku;
                      const oosV = v.stock <= 0;

                      return (
                        <div
                          key={getSku(v) || v._id}
                          style={{ cursor: oosV ? "not-allowed" : "pointer", position: "relative" }}
                          onClick={() =>
                            !oosV &&
                            handleVariantSelect(prod._id, v)
                          }
                          title={v.shadeName}
                        >
                          <div className="page-title-main-name"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "20%",
                              backgroundColor: v.hex || "#ccc",
                              border: sel ? "3px solid #000" : "1px solid #ddd",
                              opacity: oosV ? 0.4 : 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {sel && (
                              <span style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                                ✓
                              </span>
                            )}
                          </div>
                          {oosV && (
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
                      const sel = selectedVariants[prod._id]?.sku === v.sku || displayVariant.sku === v.sku;
                      const oosV = v.stock <= 0;

                      return (
                        <div
                          key={getSku(v) || v._id}
                          className="variant-text-item"
                          style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                          onClick={() =>
                            !oosV &&
                            handleVariantSelect(prod._id, v)
                          }
                        >
                          <div
                            style={{
                              padding: "8px 16px",
                              borderRadius: "8px",
                              border: sel ? "2px solid #000" : "1px solid #ddd",
                              background: sel ? "#f8f9fa" : "#fff",
                              opacity: oosV ? 0.4 : 1,
                              textDecoration: oosV ? "line-through" : "none"
                            }}
                          >
                            {getVariantDisplayText(v)}
                            {oosV && <span className="text-danger small ms-1">(OOS)</span>}
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
                <button
                  className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleAddToCart(prod);
                    closeVariantOverlay();
                  }}
                  disabled={isAdding || (displayVariant && displayVariant.stock <= 0)}
                  style={{
                    transition: "background-color 0.3s ease, color 0.3s ease",
                  }}
                >
                  {isAdding ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Adding...
                    </>
                  ) : displayVariant?.stock <= 0 ? (
                    "Out of Stock"
                  ) : (
                    <>
                      Add to Bag
                      {!isAdding && displayVariant?.stock > 0 && (
                        <img src={Bag} alt="Bag" style={{ height: 20 }} />
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCategoryCheckboxToggle = useCallback((cat) => {
    setFilters(prev => {
      const current = prev.categoryIds || [];
      const value = cat.slug || cat._id;
      const isActive = current.includes(value);
      return {
        ...prev,
        categoryIds: isActive
          ? current.filter(id => id !== value)
          : [...current, value]
      };
    });
  }, []);

  /* ===================== BRANDFILTER PROPS ===================== */
  const brandFilterProps = {
    filters,
    setFilters,
    filterData,
    trendingCategories,
    activeCategorySlug: null,        // Not used in promotion usually
    activeCategoryName: "",
    onClearCategory: () => { },       // Not needed for promotion
    onCategoryPillClick: handleCategoryCheckboxToggle,
    onClose: () => setShowFilterOffcanvas(false),
  };

  if (loading)
    return (
      <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact className='foryoulanding-css'
            src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />


          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      {promotionMeta?.bannerImage && (
        <div className="banner-images text-center">
          <img
            src={promotionMeta.bannerImage}
            alt={promotionMeta.name}
            className="w-100"
            style={{ maxHeight: 400, objectFit: "cover" }}
          />
        </div>
      )}

      <div className="container-lg py-4">
        <h2 className="mb-4 d-none d-lg-block page-title-main-name">
          {promotionMeta?.name || "Promotion Products"}
        </h2>

        <div className="row">
          {/* Desktop Sidebar */}
          <div className="d-none d-lg-block col-lg-3">
            <BrandFilter {...brandFilterProps} />
          </div>

          {/* Mobile Filter + Sort Buttons */}
          <div className="d-lg-none mb-3">
            <h2 className="mb-4 text-center">{promotionMeta?.name || "Promotion Products"}</h2>
            <div className="w-100 filter-responsive rounded shadow-sm">
              <div className="container-fluid p-0">
                <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
                  <div className="col-6">
                    <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
                      <img src={filtering} alt="Filter" style={{ width: 25 }} />
                      <div className="text-start">
                        <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
                        <span className="text-muted small page-title-main-name">Tap to apply</span>
                      </div>
                    </button>
                  </div>
                  <div className="col-6 border-end">
                    <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
                      <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
                      <div className="text-start">
                        <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
                        <span className="text-muted small">
                          {
                            filters.sort === 'priceHighToLow' ? 'Price: High to Low' : 
                            filters.sort === 'priceLowToHigh' ? 'Price: Low to High' : 
                            filters.sort === 'rating' ? 'Top Rated' :
                            filters.sort === 'discountHighToLow' ? 'Discount: High to Low' :
                            filters.sort === 'discountLowToHigh' ? 'Discount: Low to High' :
                            'Newest First'
                          }
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Offcanvas */}
          {showFilterOffcanvas && (
            <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
              <div className="text-center py-3 position-relative">
                <h5 className="mb-0 fw-bold">Filters</h5>
                <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowFilterOffcanvas(false)} />
                <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
              </div>
              <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
                <BrandFilter {...brandFilterProps} />
              </div>
            </div>
          )}

          {/* Mobile Sort Offcanvas */}
          {showSortOffcanvas && (
            <>
              <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
              <div className="position-fixed start-0 bottom-0 w-100 bg-white"
                style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
                <div className="text-center py-3 position-relative">
                  <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
                  <button className="btn-close position-absolute end-0 me-3"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                    onClick={() => setShowSortOffcanvas(false)} />
                  <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
                </div>
                <div className="px-4 pb-4">
                  <div className="list-group">
                    {[
                      { value: "recent", label: "Newest First" },
                      { value: "priceLowToHigh", label: "Price: Low to High" },
                      { value: "priceHighToLow", label: "Price: High to Low" },
                      { value: "rating", label: "Top Rated" },
                      { value: "discountHighToLow", label: "Discount: High to Low" },
                      { value: "discountLowToHigh", label: "Discount: Low to High" }
                    ].map(({ value, label }) => (
                      <label key={value} className="list-group-item py-3 d-flex align-items-center">
                        <input className="form-check-input me-3" type="radio" name="sort"
                          checked={filters.sort === value}
                          onChange={() => {
                            setFilters(prev => ({ ...prev, sort: value }));
                            setShowSortOffcanvas(false);
                          }} />
                        <span className="page-title-main-name">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Product Grid */}
          <div className="col-12 col-lg-9">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="text-muted page-title-main-name">
                {promotionMeta?.name || `Showing ${products.length} products`}
              </span>
              <div className="d-flex align-items-center gap-3">
                {/* {isAnyFilterActive && (
                  <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
                    Clear Filters
                  </button>
                )} */}
                {/* Desktop Sort Dropdown */}
                <div className="d-none d-lg-flex align-items-center position-relative" style={{ gap: '6px'}}>
                  <span className="text-muted page-title-main-name" style={{ fontSize: '14px' }}>Sort by:</span>
                  <div className="position-relative">
                    <button 
                      type="button"
                      className="btn btn-link text-decoration-none p-0 page-title-main-name fw-semibold text-dark d-inline-flex align-items-center gap-1"
                      onClick={() => setShowDesktopSortDropdown(!showDesktopSortDropdown)}
                      style={{ border: 'none', background: 'none', boxShadow: 'none', fontSize: '14px' }}
                    >
                      {
                        filters.sort === 'priceHighToLow' ? 'Price: High to Low' : 
                        filters.sort === 'priceLowToHigh' ? 'Price: Low to High' : 
                        filters.sort === 'rating' ? 'Top Rated' :
                        filters.sort === 'discountHighToLow' ? 'Discount: High to Low' :
                        filters.sort === 'discountLowToHigh' ? 'Discount: Low to High' :
                        'Newest First'
                      }
                      <FaChevronDown style={{ fontSize: '10px', transition: 'transform 0.2s', transform: showDesktopSortDropdown ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    {showDesktopSortDropdown && (
                      <>
                        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 998 }} onClick={() => setShowDesktopSortDropdown(false)} />
                        <ul className="dropdown-menu show dropdown-menu-end shadow-sm" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 999, border: '1px solid #eee', borderRadius: '8px', minWidth: '170px', display: 'block', marginTop: '5px', background: '#fff', padding: '5px 0' }}>
                          {[
                            { value: "recent", label: "Newest First" },
                            { value: "priceLowToHigh", label: "Price: Low to High" },
                            { value: "priceHighToLow", label: "Price: High to Low" },
                            { value: "rating", label: "Top Rated" },
                            { value: "discountHighToLow", label: "Discount: High to Low" },
                            { value: "discountLowToHigh", label: "Discount: Low to High" }
                          ].map(({ value, label }) => (
                            <li key={value}>
                              <button 
                                type="button"
                                className={`dropdown-item page-title-main-name py-2 custom-sort-item ${filters.sort === value ? 'active' : ''}`}
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, sort: value }));
                                  setShowDesktopSortDropdown(false);
                                }}
                                style={{ 
                                  fontSize: '13px', 
                                  border: 'none', 


                                  width: '100%', 
                                  textAlign: 'left', 
                                  cursor: 'pointer',
                                  padding: '8px 16px'
                                }}
                              >
                                {label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>


            <div className="row g-4">
              {sortedProducts.length > 0 ? sortedProducts.map(renderProductCard) : (
                <div className="col-12 text-center py-5">
                  <h4>No products found</h4>
                  <p className="text-muted">Try adjusting your filters.</p>
                </div>
              )}
            </div>

            {loadingMore && (
              <div className="text-center mt-4 py-4">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Loading more products...</p>
              </div>
            )}

            <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

            {!hasMore && products.length > 0 && (
              <div className="text-center mt-4 py-4 border-top">
                <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PromotionProducts;