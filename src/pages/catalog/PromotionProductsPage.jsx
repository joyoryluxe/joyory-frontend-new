/* PromotionProductsPage.jsx — Refactored
 * - Removed: getSku, isValidHexColor, getVariantDisplayText, groupVariantsByType, getBrandName (local defs)
 * - Removed: inline wishlist state/fetch/toggle logic → useWishlist hook
 * - Removed: inline handleAddToCart logic → useCart hook
 * - Removed: inline renderProductCard JSX → shared ProductCard component
 * - Removed: inline mobile filter offcanvas JSX → MobileFilterDrawer component
 * - Removed: inline desktop sort dropdown JSX → SortDropdown component
 * - Removed: inline IntersectionObserver → useInfiniteScroll hook
 */
import React, { useEffect, useState, useContext, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { CartContext } from "../../context/CartContext.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import BrandFilter from "../../components/common/BrandFilter.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";
import OutOfStockPopup from "../../components/common/OutOfStockPopup.jsx";
import SortDropdown from "../../components/filters/SortDropdown";
import MobileFilterDrawer from "../../components/filters/MobileFilterDrawer";
import InfiniteScrollLoader from "../../components/ui/InfiniteScrollLoader";
import EmptyState from "../../components/ui/EmptyState";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../../components/common/Loader";
import SectionError from "../../components/common/SectionError";
import updownarrow from "../../assets/updownarrow.svg";
import filtering from "../../assets/filtering.svg";
import { getAllProducts } from "../../api/productApi";
import { getErrorMessage } from "../../utils/errorHandler";
import { getProductDisplayData } from "../../utils/productHelpers";
import useWishlist from "../../hooks/useWishlist";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { toast } from "react-toastify";
import { SORT_LABELS } from "../../hooks/useProductFilters";

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
  const [fetchError, setFetchError] = useState(null);

  const [selectedVariants, setSelectedVariants] = useState({});
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  // ── Wishlist (shared hook) ────────────────────────────────────────────────
  const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

  // ── Unified Filters ───────────────────────────────────────────────────────
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

  // ── Sorted Products (client-side sort on top of cursor pagination) ────────
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const getProductPrice = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const dv = selectedVariants[prod._id] || (vars.length > 0 ? vars.find((v) => v.stock > 0) || vars[0] : null);
      return dv?.displayPrice || dv?.discountedPrice || prod.price || 0;
    };
    const getProductDiscount = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const dv = selectedVariants[prod._id] || (vars.length > 0 ? vars.find((v) => v.stock > 0) || vars[0] : null);
      const price = dv?.displayPrice || dv?.discountedPrice || prod.price || 0;
      const orig = dv?.originalPrice || dv?.mrp || prod.mrp || price;
      return orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
    };
    const getProductRating = (prod) => prod.avgRating || prod.rating || 0;

    const sorted = [...products];
    if (filters.sort === 'priceHighToLow') sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    else if (filters.sort === 'priceLowToHigh') sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    else if (filters.sort === 'rating') sorted.sort((a, b) => getProductRating(b) - getProductRating(a));
    else if (filters.sort === 'discountHighToLow') sorted.sort((a, b) => getProductDiscount(b) - getProductDiscount(a));
    else if (filters.sort === 'discountLowToHigh') sorted.sort((a, b) => getProductDiscount(a) - getProductDiscount(b));
    return sorted;
  }, [products, filters.sort, selectedVariants]);

  // ── Build API Query ───────────────────────────────────────────────────────
  const buildQueryParams = (cursor = null) => {
    const p = new URLSearchParams();
    if (slug) p.append("promoSlug", slug);
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
      const res = await getAllProducts(query);
      const data = res.data;

      if (data.promoMeta) setPromotionMeta(data.promoMeta);
      if (data.trendingCategories) setTrendingCategories(data.trendingCategories);
      if (reset && data.filters) setFilterData(data.filters);

      const newProducts = data.products || [];
      const pg = data.pagination || {};

      if (reset) setProducts(newProducts);
      else setProducts((prev) => [...prev, ...newProducts]);

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);
      setFetchError(null);

      // Default variant selection (first in-stock or first variant)
      const def = {};
      newProducts.forEach((pr) => {
        const av = (pr.variants || []).find((v) => v.stock > 0) || pr.variants?.[0];
        if (av) def[pr._id] = av;
      });
      setSelectedVariants((prev) => ({ ...prev, ...def }));

    } catch (err) {
      console.error(err);
      setFetchError(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPromotionProducts(null, true);
  }, [slug, filters]);

  // ── Infinite Scroll (shared hook) ────────────────────────────────────────
  const loadMoreProducts = useCallback(() => {
    if (nextCursor && hasMore && !loadingMore) {
      fetchPromotionProducts(nextCursor, false);
    }
  }, [nextCursor, hasMore, loadingMore]);

  const { loaderRef } = useInfiniteScroll({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMoreProducts,
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleVariantSelect = useCallback((pid, v) => {
    setSelectedVariants((p) => ({ ...p, [pid]: v }));
  }, []);

  const handleOutOfStockClick = useCallback((productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => setShowOutOfStockPopup(false), 3000);
  }, []);

  const handleCategoryCheckboxToggle = useCallback((cat) => {
    setFilters((prev) => {
      const current = prev.categoryIds || [];
      const value = cat.slug || cat._id;
      const isActive = current.includes(value);
      return {
        ...prev,
        categoryIds: isActive ? current.filter((id) => id !== value) : [...current, value],
      };
    });
  }, []);

  const handleClearAllFilters = () => {
    setFilters({
      brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
      finishes: [], ingredients: [], priceRange: null, discountRange: null,
      minRating: "", sort: "recent",
    });
  };

  // ── BrandFilter props ─────────────────────────────────────────────────────
  const brandFilterProps = {
    filters,
    setFilters,
    filterData,
    trendingCategories,
    activeCategorySlug: null,
    activeCategoryName: "",
    onClearCategory: () => {},
    onCategoryPillClick: handleCategoryCheckboxToggle,
    onClose: () => setShowFilterOffcanvas(false),
  };

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fullscreen-loader page-title-main-name" style={{ minHeight: "100vh", width: "100%" }}>
        <div className="text-center">
          <DotLottieReact className='foryoulanding-css'
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop autoplay
          />
          <p className="text-muted mb-0">Please wait while we prepare the best products for you...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* Promotion Banner */}
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

          {/* Mobile Filter + Sort trigger buttons */}
          <div className="d-lg-none mb-3">
            <h2 className="mb-4 text-center">{promotionMeta?.name || "Promotion Products"}</h2>
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
                        <span className="text-muted small">{SORT_LABELS[filters.sort] || 'Newest First'}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shared Mobile Filter + Sort Drawers */}
          <MobileFilterDrawer
            showFilter={showFilterOffcanvas}
            showSort={showSortOffcanvas}
            onCloseFilter={() => setShowFilterOffcanvas(false)}
            onCloseSort={() => setShowSortOffcanvas(false)}
            currentSort={filters.sort}
            onSortChange={(val) => setFilters((p) => ({ ...p, sort: val }))}
          >
            <BrandFilter {...brandFilterProps} onClose={() => setShowFilterOffcanvas(false)} />
          </MobileFilterDrawer>

          {/* Product Grid */}
          <div className="col-12 col-lg-9">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="text-muted page-title-main-name">
                {promotionMeta?.name || `Showing ${products.length} products`}
              </span>

              {/* Desktop Sort Dropdown (shared component) */}
              <SortDropdown
                currentSort={filters.sort}
                onSortChange={(val) => setFilters((p) => ({ ...p, sort: val }))}
              />
            </div>

            <div className="row g-4">
              {fetchError && sortedProducts.length === 0 ? (
                <div className="col-12 py-4">
                  <SectionError
                    error={fetchError}
                    message="Failed to load promotion products. Please try again."
                    onRetry={() => fetchPromotionProducts(null, true)}
                  />
                </div>
              ) : sortedProducts.length > 0 ? (
                sortedProducts.map((prod) => {
                  const displayData = getProductDisplayData(prod, selectedVariants);
                  if (!displayData) return null;
                  return (
                    <div key={prod._id} className="col-6 col-md-4 col-lg-4">
                      <ProductCard
                        item={displayData}
                        wishlistData={wishlistData}
                        wishlistLoading={wishlistLoading}
                        toggleWishlist={toggleWishlist}
                        onVariantSelect={handleVariantSelect}
                        onOutOfStockClick={handleOutOfStockClick}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="col-12">
                  <EmptyState title="No products found" message="Try adjusting your filters." />
                </div>
              )}
            </div>

            {/* Infinite scroll loader sentinel */}
            <InfiniteScrollLoader ref={loaderRef} loading={loadingMore} hasMore={hasMore} />

            {!hasMore && products.length > 0 && (
              <div className="text-center mt-4 py-4 border-top">
                <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Out of stock popup */}
      <OutOfStockPopup
        show={showOutOfStockPopup}
        productName={outOfStockProductName}
        onClose={() => setShowOutOfStockPopup(false)}
      />

      <Footer />
    </>
  );
};

export default PromotionProducts;
