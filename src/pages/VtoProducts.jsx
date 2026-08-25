import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { UserContext } from "../context/UserContext.jsx";
import BrandFilter from "../components/common/BrandFilter";
import axiosInstance from "../utils/axiosInstance.js";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../components/common/Loader";
import updownarrow from "../assets/updownarrow.svg";
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";
import { toast } from "react-toastify";
import "../styles/ProductPage.css";
import "../styles/BestSellers.css";
import "../styles/ForYou.css";
import SEOMeta from "../components/common/SEOMeta"; // Add import at top
const CART_API_BASE = "/api/user/cart";
const PRODUCT_ALL_API = "/api/user/products/all";

/* ─── helpers ───────────────────────────────────────────────────────────── */
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

    /* ── state ──────────────────────────────────────────────────────────────── */
    const [allProducts, setAllProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [filterData, setFilterData] = useState(null);
    const lastContextRef = useRef("");

    const [selectedVariants, setSelectedVariants] = useState({});
    const [tempSelectedVariants, setTempSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
    const [outOfStockProductName, setOutOfStockProductName] = useState("");

    const handleOutOfStockClick = (productName) => {
        setOutOfStockProductName(productName || "This product");
        setShowOutOfStockPopup(true);
        setTimeout(() => {
            setShowOutOfStockPopup(false);
        }, 3000);
    };

    const closeOutOfStockPopup = () => {
        setShowOutOfStockPopup(false);
    };

    const isCompletelyOutOfStock = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        if (vars.length === 0) {
            return (prod.stock || 0) <= 0;
        }
        return vars.every(v => (v.stock || 0) <= 0);
    };

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);

    const [wishlistLoading, setWishlistLoading] = useState({});
    const [wishlistData, setWishlistData] = useState([]);

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
    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("all");

    const sortedProducts = useMemo(() => {
        if (!allProducts || !Array.isArray(allProducts)) return [];
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
    }, [allProducts, filters.sort, selectedVariants, tempSelectedVariants]);

    const { user } = useContext(UserContext);
    const loaderRef = useRef(null);

    /* ── wishlist ───────────────────────────────────────────────────────────── */
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
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchWishlistData(); }, [user]);

    const toggleWishlist = async (prod, variant) => {
        if (!prod || !variant) return toast.error("Select a variant first");
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

        // Do not pass sort to backend API due to cursor pagination limitation (nextCursor is null when sorting)
        // if (filters.sort) p.append("sort", filters.sort);
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

    /* ── cart ───────────────────────────────────────────────────────────────── */
    const handleAddToCart = async (prod, forceVariant = null) => {
        setAddingToCart((p) => ({ ...p, [prod._id]: true }));
        try {
            const vars = Array.isArray(prod.variants) ? prod.variants : [];
            const hasVar = vars.length > 0;
            let payload;
            if (hasVar) {
                const sel = forceVariant || selectedVariants[prod._id] || vars.find((v) => v.stock > 0) || vars[0];
                if (!sel || sel.stock <= 0) { toast.warning("Please select an in-stock variant."); return; }
                payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
                const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
                cache[prod._id] = sel;
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            } else {
                if (prod.stock <= 0) { toast.warning("Product is out of stock."); return; }
                payload = { productId: prod._id, quantity: 1 };
            }
            const { data } = await axiosInstance.post(`${CART_API_BASE}/add`, payload);
            if (!data.success) throw new Error(data.message || "Cart add failed");
            toast.success("Product added to cart!");
            navigate("/cartpage");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to add to cart");
            if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
        } finally {
            setAddingToCart((p) => ({ ...p, [prod._id]: false }));
        }
    };

    const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
    const openVariantOverlay = (pid, t = "all", e = null) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setSelectedVariantType(t);
        setShowVariantOverlay(pid);
    };
    const closeVariantOverlay = () => {
        setShowVariantOverlay(null);
        setSelectedVariantType("all");
        setTempSelectedVariants({});
    };

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

    const getProductSlug = (pr) => pr.slugs?.[0] || pr._id;

    /* ── product card ───────────────────────────────────────────────────────── */
    const renderProductCard = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        const hasVar = vars.length > 0;

        const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null) || {};

        const grouped = groupVariantsByType(vars);
        const totalVars = vars.length;
        const sku = displayVariant ? getSku(displayVariant) : null;
        const inWl = sku ? isInWishlist(prod._id, sku) : false;
        const slugPr = getProductSlug(prod);
        const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
        const isAdding = addingToCart[prod._id];

        const completelyOutOfStock = isCompletelyOutOfStock(prod);
        const currentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
        const showOutOfStock = completelyOutOfStock && !hasVar;

        const showSelectVariantButton = hasVar && vars.length > 1;
        const buttonDisabled = isAdding || showOutOfStock;

        let btnText = "Add to Bag";
        if (isAdding) btnText = "Adding...";
        else if (showOutOfStock) btnText = "Out of Stock";
        else if (showSelectVariantButton) btnText = "Select Variant";
        else if (currentVariantOutOfStock) btnText = "Out of Stock";

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
                                style={{
                                    opacity: showOutOfStock ? 0.6 : 1,
                                    filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
                                }}
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
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

                            {/* Wishlist button */}
                            {!showOutOfStock && (
                                <button
                                    className={`product-card-wishlist-btn ${inWl ? 'in-wishlist' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (displayVariant || !hasVar)
                                            toggleWishlist(prod, displayVariant || {});
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
                                    className="foryou-name m-0 p-0"
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
                                        const varName = displayVariant ? getVariantDisplayText(displayVariant) : "";
                                        return varName && varName.toUpperCase() !== "DEFAULT" ? `${prod.name} - ${varName}` : prod.name;
                                    })()}
                                </h6></div>{showOutOfStock && (
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
                                        {(() => {
                                            const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
                                            const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
                                            const disc = orig > price;
                                            const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
                                            return (
                                                <>
                                                    <span
                                                        className="current-price fw-400 fs-5"
                                                        style={{
                                                            textDecoration: showOutOfStock ? 'line-through' : 'none',
                                                            opacity: showOutOfStock ? 0.6 : 1,
                                                        }}
                                                    >
                                                        ₹{price}
                                                    </span>
                                                    {disc && !showOutOfStock && (
                                                        <>
                                                            <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                                                ₹{orig}
                                                            </span>
                                                            <span className="discount-percent fw-bold ms-2">
                                                                ({pct}% OFF)
                                                            </span>
                                                        </>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                                {prod.nextOrderDiscountMessage && (
                                    <div className="next-order-discount-tag" title={prod.nextOrderDiscountMessage} onClick={(e) => { e.stopPropagation(); window.showDiscountPopup && window.showDiscountPopup(prod.nextOrderDiscountMessage, e.currentTarget); }}>
                                        <span className="text-truncate">{prod.nextOrderDiscountMessage}</span>
                                    </div>
                                )}

                                {/* Cart Button */}
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
                                                    openVariantOverlay(prod._id, "all", e);
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
                                                    {btnText}
                                                    {!buttonDisabled && !isAdding && !showSelectVariantButton && (
                                                        <img src={Bag} alt="Bag" className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} />
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
                        <div className="variant-overlay" onClick={closeVariantOverlay}>
                            <div
                                className="variant-overlay-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                    <h5 className="m-0 page-title-main-name">Select Variant</h5>
                                    <button
                                        onClick={closeVariantOverlay}
                                        style={{ background: "none", border: "none", fontSize: "40px" }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="variant-overlay-body">
                                    {grouped.color.length > 0 && (
                                        <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                                            {grouped.color.map((v) => {
                                                const sel = tempSelectedVariants[prod._id]?.sku === v.sku || displayVariant.sku === v.sku;
                                                const oosV = v.stock <= 0;
                                                return (
                                                    <div
                                                        key={v.sku || v._id}
                                                        style={{ cursor: oosV ? "not-allowed" : "pointer", position: "relative" }}
                                                        onClick={() => {
                                                            if (!oosV) {
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
                                                                border: sel ? "3px solid #000" : "1px solid #ddd",
                                                                opacity: oosV ? 0.4 : 1,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            {sel && (
                                                                <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
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
                                                const sel = tempSelectedVariants[prod._id]?.sku === v.sku || displayVariant.sku === v.sku;
                                                const oosV = v.stock <= 0;
                                                return (
                                                    <div
                                                        key={v.sku || v._id}
                                                        className="variant-text-item"
                                                        style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                                                        onClick={() => {
                                                            if (!oosV) {
                                                                handleVariantSelect(prod._id, v);
                                                                setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
                                                            }
                                                        }}
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
                                    >
                                        {isAdding ? "Adding..." : "Add to Bag"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    /* ── BRANDFILTER PROPS ────────────────────────────────────────────────── */
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

    if (loading && allProducts.length === 0) {
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
                        src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                        loop
                        autoplay
                    />
                    <p className="text-muted mb-0">
                        Please wait while we prepare the best products for you...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEOMeta type="vtoproducts" /> {/* Add this */}
            <Header />

            <div className="padding-left-rightss ms-lg-0 mt-0">
                <div className="row mt-0">
                    {/* Sidebar Filter on Left for Desktop */}
                    <div className="d-none d-lg-block col-lg-3 mt-5">
                        <BrandFilter {...brandFilterProps} />
                    </div>

                    {/* Mobile Filters and Layout Header */}
                    <div className="d-lg-none mb-lg-3 mt-4">
                        <h2 className="mb-4 text-center mt-lg-0 mt-3 page-upper-case-first">VTO Products</h2>
                        <div className="w-100 filter-responsive rounded shadow-sm">
                            <div className="container-fluid p-0">
                                <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
                                    <div className="col-6">
                                        <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                                            onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
                                            <img src={filtering} alt="Filter" style={{ width: 25 }} />
                                            <div className="text-start">
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
                                                <span className="text-muted small page-title-main-name">Tap to apply</span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="col-6 border-end">
                                        <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                                            onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
                                            <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
                                            <div className="text-start">
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
                                                <span className="text-muted small">{filters.sort === "recent" ? "Relevance" : filters.sort}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Offcanvas Drawer Filters */}
                    {showFilterOffcanvas && (
                        <>
                            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark mt-5"
                                style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
                            <div className="position-fixed start-0 bottom-0 w-100 bg-white"
                                style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
                                <div className="text-center py-3 position-relative">
                                    <h5 className="mb-0 fw-bold">Filters</h5>
                                    <button className="btn-close position-absolute end-0 me-3"
                                        style={{ top: "50%", transform: "translateY(-50%)" }}
                                        onClick={() => setShowFilterOffcanvas(false)} />
                                    <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
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
                                                    onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }} />
                                                <span className="page-title-main-name">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Products Grid Column */}
                    <div className="col-12 col-lg-9 mt-lg-5">
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <span className="text-muted page-title-main-name d-lg-block d-none mt-0">
                                Showing {totalCount} products
                            </span>
                            <div className="d-flex align-items-center gap-3">
                                {/* {isAnyFilterActive && (
                                    <button className="btn btn-sm btn-outline-danger mt-5" onClick={handleClearAllFilters}>
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


                        <div className="row g-4 position-relative">
                            {sortedProducts.length > 0 ? (
                                sortedProducts.map(renderProductCard)
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <h4>No products found</h4>
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

            {/* Out of Stock Popup */}
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
                            <FaTimes style={{ color: '#dc3545', fontSize: '30px' }} />
                        </div>

                        <h5 className="page-title-main-name" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', color: '#333' }}>
                            Out of Stock
                        </h5>

                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            "Oops! {outOfStockProductName} is out of stock right now. Check back soon or discover similar items."
                        </p>

                        <button onClick={closeOutOfStockPopup} className="btn btn-dark w-100" style={{ borderRadius: '8px', padding: '10px' }}>
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
            {showVariantOverlay && (() => {
                const item = allProducts.find(p => p._id === showVariantOverlay);
                if (!item) return null;

                const vars = Array.isArray(item.variants) ? item.variants : [];
                const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || (vars.find((v) => v.stock > 0) || vars[0]) || {};
                const groupedVariants = groupVariantsByType(vars);
                const isAdding = addingToCart[item._id];
                const isCurrentVariantOutOfStock = displayVariant.stock <= 0;

                const hasColorVariants = groupedVariants.color.length > 0;
                const hasTextVariants = groupedVariants.text.length > 0;

                // Price calculations
                const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || item.price || 0;
                const orig = displayVariant?.originalPrice || displayVariant?.mrp || item.mrp || price;
                const disc = orig > price;
                const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;

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
                                            ₹{price}
                                        </span>
                                        {disc && (
                                            <>
                                                <span className="mobile-sheet-original-price">
                                                    ₹{orig}
                                                </span>
                                                <span className="mobile-sheet-discount">
                                                    ({pct}% OFF)
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
                                        const chosen = tempSelectedVariants[item._id] || selectedVariants[item._id] || (vars.find((v) => v.stock > 0) || vars[0]);
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
