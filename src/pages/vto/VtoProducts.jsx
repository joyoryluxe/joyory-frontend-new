import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { UserContext } from "../../context/UserContext.jsx";
import BrandFilter from "../../components/common/BrandFilter";
import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import axiosInstance from "../../utils/axiosInstance.js";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../../components/common/Loader";
import updownarrow from "../../assets/updownarrow.svg";
import filtering from "../../assets/filtering.svg";
import { toast } from "react-toastify";
import SEOMeta from "../../components/common/SEOMeta";
import { getProductDisplayData } from "../../utils/productHelpers";
import "../../styles/BrandPage.css";
import "../../styles/BestSellers.css";

const PRODUCT_ALL_API = "/api/user/products/all";

const parseFiltersFromSearchParams = (searchParams) => {
    const initialFilters = {
        brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
        finishes: [], ingredients: [], priceRange: null, discountMin: null,
        minRating: "", sort: "recent"
    };

    const getMultiParam = (key) => {
        let values = searchParams.getAll(key);
        if (values.length === 0) {
            const commaValue = searchParams.get(key);
            if (commaValue) values = commaValue.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (key === "skinTypes") {
            return values.map(v => v.replace(/\s+/g, "+"));
        }
        return values;
    };

    ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
        initialFilters[key] = getMultiParam(key);
    });

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice !== null || maxPrice !== null) {
        initialFilters.priceRange = {
            min: minPrice ? parseFloat(minPrice) : 0,
            max: maxPrice ? parseFloat(maxPrice) : null,
        };
    }

    const discountMin = searchParams.get('discountMin');
    if (discountMin !== null) initialFilters.discountMin = parseFloat(discountMin);

    const minRating = searchParams.get('minRating');
    if (minRating !== null) initialFilters.minRating = minRating;

    const sortParam = searchParams.get('sort');
    if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh', 'rating', 'discountHighToLow', 'discountLowToHigh'].includes(sortParam)) {
        initialFilters.sort = sortParam;
    }

    return initialFilters;
};

export default function VtoProducts() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useContext(UserContext);

    /* ── state ──────────────────────────────────────────────────────────────── */
    const [allProducts, setAllProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filterData, setFilterData] = useState(null);
    const lastContextRef = useRef("");

    const [selectedVariants, setSelectedVariants] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);

    // ── Wishlist (shared hook) ────────────────────────────────────────────────
    const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

    const [filters, setFilters] = useState(() => parseFiltersFromSearchParams(searchParams));

    const currentUrlKey = `${location.pathname}${location.search}`;
    const [prevUrlKey, setPrevUrlKey] = useState(currentUrlKey);

    if (currentUrlKey !== prevUrlKey) {
        setPrevUrlKey(currentUrlKey);
        const parsed = parseFiltersFromSearchParams(searchParams);
        if (JSON.stringify(filters) !== JSON.stringify(parsed)) {
            setFilters(parsed);
        }
    }

    const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
    const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
    const [showDesktopSortDropdown, setShowDesktopSortDropdown] = useState(false);

    const sortedProducts = useMemo(() => {
        if (!allProducts || !Array.isArray(allProducts)) return [];
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
        const sorted = [...allProducts];
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
    }, [allProducts, filters.sort, selectedVariants]);

    const loaderRef = useRef(null);

    /* ── fetch ──────────────────────────────────────────────────────────────── */
    const buildQueryParams = (cursor = null) => {
        const p = new URLSearchParams();

        // Enforce Virtual Try-On products
        p.append("supportsVTO", "true");

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

        if (filters.discountMin && filters.discountMin > 0) {
            p.append("discountMin", filters.discountMin);
        }

        if (cursor) p.append("cursor", cursor);
        p.append("limit", "9");

        return p.toString();
    };

    const fetchProducts = async (cursor = null, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                setNextCursor(null);
                setHasMore(true);
            } else {
                setLoadingMore(true);
            }

            const { data } = await axiosInstance.get(
                `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`
            );

            const newProducts = data.products || [];
            const pg = data.pagination || {};

            if (reset) {
                setAllProducts(newProducts);
                setTotalCount(data.totalProducts || newProducts.length);
            } else {
                setAllProducts((prev) => [...prev, ...newProducts]);
            }

            setHasMore(pg.hasMore || false);
            setNextCursor(pg.nextCursor || null);

            const currentContext = `${location.pathname}-${searchParams.get("q") || searchParams.get("search") || ""}`;
            const isContextChanged = lastContextRef.current !== currentContext;

            if (isContextChanged) {
                if (reset && data.filters) {
                    setFilterData(data.filters);
                }
                lastContextRef.current = currentContext;
            }

            // Default variant selection
            const def = {};
            newProducts.forEach((pr) => {
                const av = (pr.variants || []).find((v) => v.stock > 0) || pr.variants?.[0];
                if (av) def[pr._id] = av;
            });
            setSelectedVariants((prev) => ({ ...prev, ...def }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    /* ── Sync URL query parameters when filters change ──────────────────── */
    useEffect(() => {
        const newParams = new URLSearchParams();

        const addArrayParam = (key, arr) => {
            if (arr && arr.length) {
                arr.forEach(v => newParams.append(key, v));
            }
        };

        addArrayParam('brandIds', filters.brandIds);
        addArrayParam('categoryIds', filters.categoryIds);
        addArrayParam('skinTypes', filters.skinTypes);
        addArrayParam('formulations', filters.formulations);
        addArrayParam('finishes', filters.finishes);
        addArrayParam('ingredients', filters.ingredients);

        if (filters.priceRange) {
            if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
            if (filters.priceRange.max != null && filters.priceRange.max !== undefined) newParams.set('maxPrice', filters.priceRange.max);
        }
        if (filters.discountMin) newParams.set('discountMin', filters.discountMin);
        if (filters.minRating) newParams.set('minRating', filters.minRating);
        if (filters.sort !== 'recent') newParams.set('sort', filters.sort);

        // Preserve search queries
        const q = searchParams.get("q") || searchParams.get("search");
        if (q) newParams.set("q", q);

        const currentQuery = searchParams.toString();
        const newQuery = newParams.toString();
        if (currentQuery !== newQuery) {
            setSearchParams(newParams, { replace: true });
        }
    }, [filters, setSearchParams, searchParams]);

    useEffect(() => {
        fetchProducts(null, true);
    }, [filters]);

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

    const handleClearCategory = useCallback(() => {
        setFilters((prev) => ({ ...prev, categoryIds: [] }));
    }, []);

    /* ── infinite scroll ────────────────────────────────────────────────────── */
    const loadMore = useCallback(() => {
        if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
    }, [nextCursor, hasMore, loadingMore]);

    useEffect(() => {
        if (!hasMore || loadingMore) return;
        const obs = new IntersectionObserver(
            ([e]) => e.isIntersecting && loadMore(),
            { root: null, rootMargin: "100px", threshold: 0.1 }
        );
        const el = loaderRef.current;
        if (el) obs.observe(el);
        return () => el && obs.unobserve(el);
    }, [loadMore, hasMore, loadingMore]);

    const handleClearAllFilters = () => {
        setFilters({
            brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
            finishes: [], ingredients: [], priceRange: null, discountMin: null,
            minRating: "", sort: "recent"
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
        filters.discountMin ||
        filters.minRating ||
        filters.sort !== "recent";

    const brandFilterProps = {
        filters,
        setFilters,
        filterData,
        trendingCategories: [],
        activeCategorySlug: null,
        activeCategoryName: "",
        onClearCategory: handleClearCategory,
        onCategoryPillClick: handleCategoryCheckboxToggle,
    };

    /* ── product card ───────────────────────────────────────────────────────── */
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

    /* ── render ─────────────────────────────────────────────────────────────── */
    return (
        <>
            <SEOMeta type="vto" />
            <Header />

            {/* Main Content Area */}
            <div className="padding-left-rightss brand-page-responsive-code my-4 mt-lg-5">
                <div className="row">
                    {/* Desktop Filter Sidebar */}
                    <div className="d-none d-lg-block col-lg-3">
                        <BrandFilter {...brandFilterProps} />
                    </div>

                    {/* Mobile Filter + Sort */}
                    <div className="d-lg-none mb-3">
                        <div className="w-100 filter-responsive rounded shadow-sm">
                            <div className="container-fluid p-0">
                                <div
                                    className="row g-0"
                                    style={{ flexDirection: "row-reverse" }}
                                >
                                    <div className="col-6">
                                        <button
                                            className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                                            onClick={() => setShowFilterOffcanvas(true)}
                                            style={{ gap: 12 }}
                                        >
                                            <img src={filtering} alt="Filter" style={{ width: 25 }} />
                                            <div className="text-start">
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">
                                                    Filter
                                                </p>
                                                <span className="text-muted small page-title-main-name">
                                                    Tap to apply
                                                </span>
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
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">
                                                    Sort by
                                                </p>
                                                <span className="text-muted small">
                                                    {filters.sort === "recent"
                                                        ? "Relevance"
                                                        : filters.sort}
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
                                <div
                                    className="px-3 pb-4 overflow-auto"
                                    style={{ maxHeight: "70vh" }}
                                >
                                    <BrandFilter
                                        {...brandFilterProps}
                                        onClose={() => setShowFilterOffcanvas(false)}
                                        onClearCategory={() => {
                                            handleClearCategory();
                                            setShowFilterOffcanvas(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Mobile Sort Bottom Drawer */}
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
                                {totalCount > 0 ? `Showing ${totalCount} products` : "No products found"}
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

                        <div className="row g-4 position-relative">
                            {/* Loading overlay when filters change */}
                            {loading && allProducts.length > 0 && (
                                <div
                                    className="position-absolute w-100 h-100 d-flex justify-content-center align-items-start pt-5"
                                    style={{
                                        background: "rgba(255,255,255,0.6)",
                                        zIndex: 10,
                                        borderRadius: "15px",
                                    }}
                                >
                                    <div className="text-center sticky-top" style={{ top: "200px" }}>
                                        <DotLottieReact
                                            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                            loop
                                            autoplay
                                            style={{ width: "150px", height: "150px" }}
                                        />
                                        <p className="page-title-main-name fw-bold">Refining selection...</p>
                                    </div>
                                </div>
                            )}

                            {sortedProducts.length > 0 ? (
                                sortedProducts.map(renderProductCard)
                            ) : loading ? (
                                <div className="col-12 text-center py-5">
                                    <DotLottieReact
                                        src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                        loop
                                        autoplay
                                        style={{ width: "200px", height: "200px", margin: "0 auto" }}
                                    />
                                    <p className="text-muted">Loading Virtual Try-On products...</p>
                                </div>
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <h4>No Virtual Try-On products found</h4>
                                    <p className="text-muted">Try adjusting your filters.</p>
                                </div>
                            )}
                        </div>

                        {loadingMore && (
                            <Loader text="Loading more products..." height={100} />
                        )}

                        <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

                        {!hasMore && allProducts.length > 0 && (
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
}
