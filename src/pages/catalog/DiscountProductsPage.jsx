import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";
import { UserContext } from "../../context/UserContext.jsx";
import BrandFilter from "../../components/common/BrandFilter";
import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import { getAllProducts } from "../../api/productApi";
import Loader from "../../components/common/Loader";
import SectionError from "../../components/common/SectionError";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from "react-toastify";
import filtering from "../../assets/filtering.svg";
import updownarrow from "../../assets/updownarrow.svg";
import {
  getProductDisplayData,
  formatPrice,
} from "../../utils/productHelpers";

const DiscountProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coupon, activeCouponTab } = location.state || {};
  const { user } = useContext(UserContext);

  // ===================== STATES =====================
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loadingDiscountProducts, setLoadingDiscountProducts] = useState(false);
  const [error, setError] = useState(null);

  // Infinite Scroll Pagination States
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const loaderRef = useRef(null);

  const [selectedVariants, setSelectedVariants] = useState({});

  // ── Wishlist (shared hook) ────────────────────────────────────────────────
  const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

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
  }, [discountProducts, filters.sort, selectedVariants]);

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
      const { data } = await getAllProducts(queryString);

      const prods = data.products || [];
      const pg = data.pagination || {};

      if (reset) {
        setDiscountProducts(prods);
      } else {
        setDiscountProducts((prev) => [...prev, ...prods]);
      }

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);

      if (clearProducts) {
        if (data.filters) {
          setFilterData(data.filters);
        }

        if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
          setTrendingCategories(data.trendingCategories);
        }
      }

    } catch (err) {
      console.error("Error fetching discount products:", err);
      setError(err);
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

  // Initial Fetch Effect
  useEffect(() => {
    const couponChanged = lastCouponRef.current !== coupon?.code;
    lastCouponRef.current = coupon?.code;

    if (coupon?.code) {
      fetchDiscountProducts(null, true, couponChanged);
    } else {
      navigate('/cartpage');
    }
  }, [coupon?.code, filters]);

  const brandFilterProps = {
    filters,
    setFilters,
    filterData,
    trendingCategories,
    activeCategorySlug,
    activeCategoryName,
    onClearCategory: handleClearCategory,
    onCategoryPillClick: handleCategoryCheckboxToggle,
    isSubCategoryView: !!activeCategorySlug,
  };

  const renderProductCard = (prod) => {
    if (!prod) return null;
    const displayData = getProductDisplayData(prod, selectedVariants);
    if (!displayData) return null;
    return (
      <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
        <ProductCard
          item={displayData}
          wishlistData={wishlistData}
          wishlistLoading={wishlistLoading}
          toggleWishlist={toggleWishlist}
        />
      </div>
    );
  };

  // ===================== RENDER =====================
  return (
    <>
      <Header />

      {/* Hero Banner Section */}
      <div className="bg-light py-4 border-bottom mb-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              onClick={() => navigate('/cartpage')}
            >
              <FaArrowLeft /> Back to Cart
            </button>
            <span className="badge bg-danger fs-6 px-3 py-2">
              {coupon?.code} Applied
            </span>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="h3 mb-2 fw-bold">
                Products Eligible for {coupon?.title || coupon?.code}
              </h1>
              <p className="text-muted mb-0">
                {coupon?.description || 'Add eligible items to your bag to apply this offer at checkout'}
              </p>
            </div>
            {coupon?.discount && (
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <span className="display-6 fw-bold text-danger">
                  {coupon.discount}% OFF
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container my-4">
        <div className="row">
          {/* Mobile Filter & Sort Buttons */}
          <div className="col-12 d-lg-none mb-3">
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 py-2 page-title-main-name filter-button-mobile"
                onClick={() => setShowFilterOffcanvas(true)}
              >
                <img src={filtering} alt="Filter" style={{ width: '16px', height: '16px' }} />
                <span>Filters</span>
                {isAnyFilterActive() && (
                  <span className="badge bg-danger rounded-pill ms-1">Active</span>
                )}
              </button>
              <button
                className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 py-2 page-title-main-name filter-button-mobile"
                onClick={() => setShowSortOffcanvas(true)}
              >
                <img src={updownarrow} alt="Sort" style={{ width: '16px', height: '16px' }} />
                <span>
                  {
                    filters.sort === 'priceHighToLow' ? 'Price: High to Low' :
                      filters.sort === 'priceLowToHigh' ? 'Price: Low to High' :
                        filters.sort === 'rating' ? 'Top Rated' :
                          filters.sort === 'discountHighToLow' ? 'Discount: High to Low' :
                            filters.sort === 'discountLowToHigh' ? 'Discount: Low to High' :
                              'Newest First'
                  }
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="filter-sidebar p-3 border rounded">
              <BrandFilter {...brandFilterProps} />
            </div>
          </div>

          {/* Mobile Filter Offcanvas */}
          {showFilterOffcanvas && (
            <>
              <div
                className="modal-backdrop fade show"
                style={{ opacity: 0.5, zIndex: 1040 }}
                onClick={() => setShowFilterOffcanvas(false)}
              />
              <div
                className="offcanvas offcanvas-start show"
                tabIndex="-1"
                style={{
                  zIndex: 1050,
                  visibility: "visible",
                  width: "85%",
                  maxWidth: 360,
                }}
              >
                <div className="offcanvas-header border-bottom">
                  <h5 className="offcanvas-title fw-bold page-title-main-name">Filters</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFilterOffcanvas(false)}
                  />
                </div>
                <div className="offcanvas-body">
                  <BrandFilter
                    {...brandFilterProps}
                    onClose={() => setShowFilterOffcanvas(false)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Mobile Sort Bottom Drawer */}
          {showSortOffcanvas && (
            <>
              <div
                className="modal-backdrop fade show"
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
                      <label
                        key={value}
                        className="list-group-item py-3 d-flex align-items-center"
                      >
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

          {/* Product Grid */}
          <div className="col-12 col-lg-9">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="text-muted page-title-main-name mt-lg-3">
                {discountProducts.length > 0 ? `Showing ${discountProducts.length} products` : "No products found"}
              </span>
              <div className="d-flex align-items-center gap-3">
                {/* Desktop Sort Dropdown */}
                <div className="d-none d-lg-flex align-items-center position-relative mt-lg-3" style={{ gap: '6px' }}>
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
              {error && sortedDiscountProducts.length === 0 ? (
                <div className="col-12 py-4">
                  <SectionError
                    error={error}
                    message="Failed to load discount products. Please try again."
                    onRetry={() => fetchDiscountProducts(null, true, false)}
                  />
                </div>
              ) : sortedDiscountProducts.length > 0 ? (
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

            {/* Infinite Scroll Loading */}
            {loadingMore && (
              <Loader text="Loading more products..." height={100} />
            )}

            {/* Sentinel Element for Observer */}
            <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

            {!hasMore && discountProducts.length > 0 && (
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

export default DiscountProductsPage;
