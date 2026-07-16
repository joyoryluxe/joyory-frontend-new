import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FaArrowLeft, FaStar, FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import { CartContext } from "../Context/Cartcontext";
import { UserContext } from "../context/UserContext.jsx";
import BrandFilter from "../components/common/BrandFilter";
import axios from "axios";
import { toast } from "react-toastify";
import updownarrow from "../assets/updownarrow.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../components/common/Loader";
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";

const API_BASE = "https://beauty.joyory.com/api/user/cart";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// Helper functions from ProductPage
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

const DiscountProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coupon, activeCouponTab } = location.state || {};

  // ===================== STATES =====================
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loadingDiscountProducts, setLoadingDiscountProducts] = useState(false);
  const [error, setError] = useState(null);

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

  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // Infinite Scroll Pagination States
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const loaderRef = useRef(null);

  // ProductPage functionality states
  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // Filtering states - EXACTLY MATCHING ProductPage structure
  const [filters, setFilters] = useState({
    brandIds: [],
    categoryIds: [],
    skinTypes: [],
    formulations: [],
    finishes: [],
    ingredients: [],
    priceRange: null,
    discountMin: null,
    minRating: "",
    sort: "recent",
  });

  const [filterData, setFilterData] = useState(null);
  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
  const [showDesktopSortDropdown, setShowDesktopSortDropdown] = useState(false);

  const sortedDiscountProducts = useMemo(() => {
    if (!discountProducts || !Array.isArray(discountProducts)) return [];
    const getProductPrice = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
      return displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
    };
    const getProductDiscount = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
      const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
      const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
      return orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
    };
    const getProductRating = (prod) => {
      return prod.avgRating || prod.rating || 0;
    };
    const sorted = [...discountProducts];
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
  }, [discountProducts, filters.sort, selectedVariants, tempSelectedVariants]);

  // Trending categories for pills (like ProductPage)
  const [trendingCategories, setTrendingCategories] = useState([]);
  const lastCouponRef = useRef(null);

  const activeCategorySlug = useMemo(() => {
    return filters.categoryIds?.[0] || null;
  }, [filters.categoryIds]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategorySlug) return "";
    const found = trendingCategories.find((c) => c.slug === activeCategorySlug)
      || filterData?.categories?.find((c) => c.slug === activeCategorySlug || c._id === activeCategorySlug);
    return found ? found.name : "";
  }, [activeCategorySlug, trendingCategories, filterData]);

  // Context
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // ===================== TOAST UTILITY =====================
  const showToastMsg = (message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "info") {
      toast.info(message, { autoClose: duration });
    } else {
      toast.error(message, { autoClose: duration });
    }
  };

  // ===================== WISHLIST FUNCTIONS =====================
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
        const response = await axios.get(
          "https://beauty.joyory.com/api/user/wishlist",
          { withCredentials: true }
        );
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
        await axios.delete(
          `https://beauty.joyory.com/api/user/wishlist/${productId}`,
          {
            withCredentials: true,
            data: { sku: sku }
          }
        );
        showToastMsg("Removed from wishlist!", "success");
      } else {
        await axios.post(
          `https://beauty.joyory.com/api/user/wishlist/${productId}`,
          { sku: sku },
          { withCredentials: true }
        );
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

  // ===================== FILTER HELPERS (SAME AS PRODUCTPAGE) =====================
  const makeEmptyFilters = () => ({
    brandIds: [],
    categoryIds: [],
    skinTypes: [],
    formulations: [],
    finishes: [],
    ingredients: [],
    priceRange: null,
    discountMin: null,
    minRating: "",
    sort: "recent",
  });

  const isAnyFilterActive = () => {
    return (
      filters.brandIds.length > 0 ||
      filters.categoryIds.length > 0 ||
      filters.skinTypes.length > 0 ||
      filters.formulations.length > 0 ||
      filters.finishes.length > 0 ||
      filters.ingredients.length > 0 ||
      filters.priceRange ||
      filters.discountMin ||
      filters.minRating ||
      filters.sort !== "recent" ||
      !!activeCategorySlug
    );
  };

  const handleClearAllFilters = () => {
    setFilters(makeEmptyFilters());
  };

  // Sidebar checkbox toggle handler (multi-select, like BrandPage)
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

  // Top category pills single-select toggle handler (like BrandPage)
  const handleTopCategoryClick = useCallback((cat) => {
    setFilters(prev => {
      const current = prev.categoryIds || [];
      const value = cat.slug || cat._id;
      const isActive = current.includes(value);
      return {
        ...prev,
        categoryIds: isActive ? [] : [value]
      };
    });
  }, []);

  const handleClearCategory = useCallback(() => {
    setFilters(prev => ({ ...prev, categoryIds: [] }));
  }, []);

  // Skin type click handler
  const handleSkinTypeClick = useCallback((skin) => {
    setFilters(prev => {
      const current = prev.skinTypes || [];
      const isActive = current.includes(skin.slug);
      return {
        ...prev,
        skinTypes: isActive ? current.filter(s => s !== skin.slug) : [...current, skin.slug]
      };
    });
  }, []);

  // Build query parameters - EXACTLY MATCHING ProductPage
  const buildQueryParams = (cursor = null) => {
    const params = new URLSearchParams();

    // Add discount code
    if (coupon?.code) {
      params.append('discountCode', coupon.code);
    }

    // Add filters to query params - MATCHING ProductPage structure exactly
    filters.brandIds?.forEach((id) => params.append("brandIds", id));
    filters.categoryIds?.forEach((id) => params.append("categoryIds", id));
    filters.skinTypes?.forEach((n) => params.append("skinTypes", n.replace(/\+/g, " ")));
    filters.formulations?.forEach((id) => params.append("formulations", id));
    filters.finishes?.forEach((s) => params.append("finishes", s));
    filters.ingredients?.forEach((s) => params.append("ingredients", s));

    if (filters.minRating) params.append("minRating", filters.minRating);

    // Add price range if exists
    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange.min);
      if (filters.priceRange.max != null) params.append("maxPrice", filters.priceRange.max);
    }

    // Add discount filter - using discountMin parameter (same as ProductPage)
    if (filters.discountMin && filters.discountMin > 0) {
      params.append("discountMin", filters.discountMin);
    }

    // Add sorting
    // Do not pass sort to backend API due to cursor pagination limitation (nextCursor is null when sorting)
    // if (filters.sort) params.append("sort", filters.sort);

    // Add cursor and limit
    if (cursor) params.append("cursor", cursor);
    params.append("limit", "9");

    return params.toString();
  };

  // ===================== DISCOUNT PRODUCTS FETCH (INFINITE SCROLL API) =====================
  const fetchDiscountProducts = async (cursor = null, reset = false, clearProducts = false) => {
    try {
      if (reset) {
        setLoadingDiscountProducts(true);
        if (clearProducts) {
          setDiscountProducts([]);
        }
        setNextCursor(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const discountCode = coupon?.code;
      if (!discountCode) return;

      const queryString = buildQueryParams(cursor);
      console.log("Discount Products API Query →", `${PRODUCT_ALL_API}?${queryString}`);

      const response = await fetch(
        `${PRODUCT_ALL_API}?${queryString}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch discount products");
      }

      const data = await response.json();
      console.log("Discount Products API Response:", data);

      const prods = data.products || [];
      const pg = data.pagination || {};

      if (reset) {
        setDiscountProducts(prods);
      } else {
        setDiscountProducts((prev) => [...prev, ...prods]);
      }

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);

      // Set filter data if available
      if (clearProducts) {
        if (data.filters) {
          setFilterData(data.filters);
        }

        // Set trending categories if available
        if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
          setTrendingCategories(data.trendingCategories);
        }
      }

    } catch (error) {
      console.error("Error fetching discount products:", error);
      setError(error.message);
    } finally {
      setLoadingDiscountProducts(false);
      setLoadingMore(false);
    }
  };

  // ===================== INFINITE SCROLL OBSERVER ==========================
  const loadMore = useCallback(() => {
    if (nextCursor && hasMore && !loadingMore) {
      fetchDiscountProducts(nextCursor, false);
    }
  }, [nextCursor, hasMore, loadingMore, coupon, filters]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && loadMore(),
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) obs.observe(el);
    return () => {
      if (el) obs.unobserve(el);
    };
  }, [loadMore, hasMore, loadingMore]);

  // ===================== PRODUCT PAGE FUNCTIONALITY =====================
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

  const getProductSlug = (product) => {
    if (product.slugs && product.slugs.length > 0) return product.slugs[0];
    return product._id;
  };

  const handleAddToCart = async (prod, forceVariant = null) => {
    setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = variants.length > 0;

      // Check if user has explicitly selected a variant
      const isVariantSelected = !!(forceVariant || selectedVariants[prod._id]);

      // Used for display (image, price). Defaults to explicitly selected OR first available OR first
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

      // Build payload same as ProductPage
      let payload;
      if (hasVar) {
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(displayVariant), quantity: 1 }],
        };
        // Cache selected variant
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = displayVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        payload = { productId: prod._id, quantity: 1 };
      }

      const { data } = await axios.post(`${API_BASE}/add`, payload, { withCredentials: true });
      if (!data.success) throw new Error(data.message || "Cart add failed");

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (err) {
      console.error("Add to Cart error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to add to cart";
      showToastMsg(msg, "error");
      if (err.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
    } finally {
      setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
    }
  };

  const getCurrentSortText = () => {
    if (filters.sort === "priceHighToLow") return "Price: High to Low";
    if (filters.sort === "priceLowToHigh") return "Price: Low to High";
    if (filters.sort === "rating") return "Top Rated";
    if (filters.sort === "discountHighToLow") return "Discount: High to Low";
    if (filters.sort === "discountLowToHigh") return "Discount: Low to High";
    return "Newest First";
  };

  // ===================== RENDER PRODUCT CARD - MATCHING ProductPage DESIGN =====================
  const renderProductCard = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    const hasVar = vars.length > 0;

    // Check if user has explicitly selected a variant
    const isVariantSelected = !!selectedVariants[prod._id];

    // Used for display (image, price). Defaults to explicitly selected OR first available OR first
    const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find(v => v.stock > 0) || vars[0]) : null);

    const grouped = groupVariantsByType(vars);
    const totalVars = vars.length;
    const sku = displayVariant ? getSku(displayVariant) : null;
    const inWl = sku ? isInWishlist(prod._id, sku) : false;
    const slugPr = getProductSlug(prod);
    const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";

    const isAdding = addingToCart[prod._id];

    // Check if product is completely out of stock (all variants OOS)
    const isCompletelyOutOfStock = hasVar && vars.every(v => v.stock <= 0);

    // Check if current selected variant is out of stock
    const isCurrentVariantOutOfStock = displayVariant ? displayVariant.stock <= 0 : prod.stock <= 0;

    // Determine if we should show out of stock state
    const showOutOfStock = isCompletelyOutOfStock && !hasVar;

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
      <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
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
            <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
              <div className="justify-content-between d-flex flex-column"
                style={{ height: '200px' }}>

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

  // ===================== USE EFFECTS =====================
  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  useEffect(() => {
    if (coupon) {
      const discountCode = coupon.code;
      if (discountCode) {
        const isCouponChanged = lastCouponRef.current !== discountCode;
        lastCouponRef.current = discountCode;
        fetchDiscountProducts(null, true, isCouponChanged);
      } else {
        setError("Error: Invalid coupon data");
      }
    } else {
      navigate("/cartpage");
    }
  }, [coupon, navigate, filters]); // Refetch on filters change

  // ===================== LOADING STATE =====================
  // if (loadingDiscountProducts) {
  //   return (
  //     <>
  //       <Header />
  //       <div className="fullscreen-loader page-title-main-name">
  //         <div className="spinner" />
  //         <p className="text-black">Loading products...</p>
  //       </div>
  //       <Footer />
  //     </>
  //   );
  // }


  // Loader logic handled in JSX return

  // ===================== ERROR STATE =====================
  if (error) {
    return (
      <>
        <Header />
        <div className="container mt-4 page-title-main-name">
          <div className="alert alert-danger mt-4">
            <h5>Error Loading Discount Products</h5>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => fetchDiscountProducts(null, true)}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ===================== BRAND FILTER PROPS (SAME AS PRODUCTPAGE) =====================
  const brandFilterProps = {
    filters,
    setFilters,
    filterData,
    trendingCategories,
    activeCategorySlug,
    activeCategoryName,
    onClearCategory: handleClearCategory,
    onCategoryPillClick: handleCategoryCheckboxToggle,
  };

  return (
    <>
      {loadingDiscountProducts && discountProducts.length === 0 && (
        <div
          className="d-flex flex-column align-items-center justify-content-center bg-white"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div className="text-center">
            <DotLottieReact
              src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
              loop
              autoplay
            />
            <p className="text-muted mb-0">
              Please wait while we prepare the best products for you...
            </p>
          </div>
        </div>
      )}
      <Header />

      {/* Banner Image Section - MATCHING ProductPage */}
      <div className="banner-images text-center mt-xl-5 pt-xl-4">
        {/* <img
          src="/banner-placeholder.jpg"
          alt="Discount Products Banner"
          className="w-100 hero-slider-image-responsive"
          style={{ maxHeight: 400, objectFit: "cover" }}
        /> */}
      </div>

      {/* Trending Categories - MATCHING ProductPage */}
      {trendingCategories.length > 0 && (
        <div className="container-lg mt-5">
          <h2 className="mt-5 pt-5 page-title-main-name text-center">Shop By Category</h2>

          <div className="d-flex mt-4 overflow-auto align-items-center cat-wrap"
            style={{ whiteSpace: "nowrap", scrollbarWidth: "none" }}>
            {trendingCategories.map((cat) => {
              const isActive = (filters.categoryIds || []).includes(cat._id) ||
                (filters.categoryIds || []).includes(cat.slug) ||
                ((filters.categoryIds || []).length === 0 && activeCategorySlug === cat.slug);
              return (
                <button key={cat.slug}
                  onClick={() => handleTopCategoryClick(cat)}
                  className={`btn px-4  page-title-main-name flex-shrink-0 ${isActive ? "btn-dark custom-pill" : "custom-pill"}`}
                  style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, transition: "all 0.18s ease", transform: isActive ? "scale(1.04)" : "scale(1)" }}
                  title={`Filter by ${cat.name}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="padding-left-rightss ms-lg-0 ms-4 mx-4">
        {/* Page Title - MATCHING ProductPage */}
        {/* <h2 className="mb-4 d-none d-lg-block page-title-main-name">
          {coupon?.code || 'Discount Products'}
        </h2> */}

        <div className="row">
          {/* Desktop Sidebar - EXACTLY LIKE PRODUCTPAGE */}
          <div className="d-none d-lg-block col-lg-3">
            <BrandFilter {...brandFilterProps} />
          </div>

          {/* Mobile Filter + Sort Buttons - EXACTLY LIKE PRODUCTPAGE */}
          <div className="d-lg-none mb-3">
            <h2 className="mb-4 text-center">{coupon?.code || 'Discount Products'}</h2>
            <div className="w-100 filter-responsive rounded shadow-sm">
              <div className="container-fluid p-0">
                <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
                  <div className="col-6">
                    <button
                      className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                      onClick={() => setShowFilterOffcanvas(true)}
                      style={{ gap: 12 }}
                    >
                      <img src={filtering} alt="Filter" style={{ width: 25 }} />
                      <div className="text-start">
                        <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
                        <span className="text-muted small page-title-main-name">Tap to apply</span>
                      </div>
                    </button>
                  </div>
                  <div className="col-6 border-end">
                    <button
                      className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                      onClick={() => setShowSortOffcanvas(true)}
                      style={{ gap: 12 }}
                    >
                      <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
                      <div className="text-start">
                        <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
                        <span className="text-muted small">{getCurrentSortText()}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Offcanvas - EXACTLY LIKE PRODUCTPAGE */}
          {showFilterOffcanvas && (
            <>
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                style={{ opacity: 0.5, zIndex: 1040 }}
                onClick={() => setShowFilterOffcanvas(false)}
              />
              <div
                className="position-fixed start-0 bottom-0 w-100 bg-white"
                style={{
                  zIndex: 1050,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: "85vh",
                  boxShadow: "0 -4px 20px rgba(0,0,0,.2)",
                }}
              >
                <div className="text-center py-3 position-relative">
                  <h5 className="mb-0 fw-bold">Filters</h5>
                  <button
                    className="btn-close position-absolute end-0 me-3"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                    onClick={() => setShowFilterOffcanvas(false)}
                  />
                  <div
                    className="mx-auto mt-2 bg-secondary"
                    style={{ height: 5, width: 50, borderRadius: 3 }}
                  />
                </div>
                <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
                  <BrandFilter
                    {...brandFilterProps}
                    onClose={() => setShowFilterOffcanvas(false)}
                    onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Mobile Sort Offcanvas - EXACTLY LIKE PRODUCTPAGE */}
          {showSortOffcanvas && (
            <>
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                style={{ opacity: 0.5, zIndex: 1040 }}
                onClick={() => setShowSortOffcanvas(false)}
              />
              <div
                className="position-fixed start-0 bottom-0 w-100 bg-white"
                style={{
                  zIndex: 1050,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: "60vh",
                  boxShadow: "0 -4px 12px rgba(0,0,0,.15)",
                }}
              >
                <div className="text-center py-3 position-relative">
                  <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
                  <button
                    className="btn-close position-absolute end-0 me-3"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                    onClick={() => setShowSortOffcanvas(false)}
                  />
                  <div
                    className="mx-auto mt-2 bg-secondary"
                    style={{ height: 5, width: 50, borderRadius: 3 }}
                  />
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
                        <input
                          className="form-check-input me-3"
                          type="radio"
                          name="sort"
                          checked={filters.sort === value}
                          onChange={() => {
                            setFilters((p) => ({ ...p, sort: value }));
                            setShowSortOffcanvas(false);
                          }}
                        />
                        <span className="page-title-main-name">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Product Grid - MATCHING ProductPage structure exactly */}
          <div className="col-12 col-lg-9">
            <div className="mb-3 d-flex justify-content-between align-items-center mt-5">
              <span className="text-muted page-title-main-name mt-5">
                {coupon?.code || `Showing ${discountProducts.length} products`}
                {/* {hasMore && " (Scroll for more)"} */}
              </span>
              <div className="d-flex align-items-center gap-3">
                {/* {isAnyFilterActive() && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleClearAllFilters}
                  >
                    Clear Filters
                  </button>
                )} */}
                {/* Desktop Sort Dropdown */}
                <div className="d-none d-lg-flex align-items-center position-relative mt-5" style={{ gap: '6px' }}>
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


            <div className="row g-4" style={{ opacity: loadingDiscountProducts ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
              {sortedDiscountProducts.length > 0 ? (
                sortedDiscountProducts.map(renderProductCard)
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>No products found</h4>
                  <p className="text-muted">Try adjusting your filters or check back later.</p>
                  <button className="btn btn-primary" onClick={() => navigate("/cartpage")}>
                    Back to Cart
                  </button>
                </div>
              )}
            </div>

            {/* Infinite Scroll Loading - MATCHING ProductPage */}
            {loadingMore && (
              <Loader text="Loading more products..." height={100} />
            )}

            {/* Sentinel Element for Observer */}
            <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

            {/* End Message - MATCHING ProductPage */}
            {!hasMore && discountProducts.length > 0 && (
              <div className="text-center mt-4 py-4 border-top">
                <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
      {showVariantOverlay && (() => {
        const item = discountProducts.find(p => p._id === showVariantOverlay);
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
                    navigate(`/product/${getProductSlug(item)}`);
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

      <Footer />
    </>
  );
};

export default DiscountProductsPage;