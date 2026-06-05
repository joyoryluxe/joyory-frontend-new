/* ProductPage – Unified API & Full Feature Edition with Multi-Filter Support */
import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
import { UserContext } from "./UserContext.jsx";
import BrandFilter from "./BrandFilter";
import "../css/ProductPage.css";
import "../css/BestSellers.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import updownarrow from "../assets/updownarrow.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";

// ===================== OUT OF STOCK POPUP COMPONENT =====================
const OutOfStockPopup = ({ isOpen, onClose, productName }) => {
    if (!isOpen) return null;

    return (
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
            onClick={onClose}
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
                    onClick={onClose}
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
                    "Oops! {productName} is out of stock right now. Check back soon or discover similar items."
                </p>

                <button
                    onClick={onClose}
                    className="btn btn-dark w-100"
                    style={{
                        borderRadius: '8px',
                        padding: '10px',
                    }}
                >
                    Got it
                </button>
            </div>
            <style>{`
        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

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

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug || params["*"];
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    let effectiveSlug = slug;
    if (slug && slug.includes("/")) {
        const segments = slug.split("/");
        effectiveSlug = segments[segments.length - 1];
    }

    /* ── state ──────────────────────────────────────────────────────────────── */
    const [allProducts, setAllProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState("Products");
    const [bannerImages, setBannerImages] = useState([]); // 🔥 Changed to array
    const swiperRef = useRef(null); // 🔥 Added for Swiper

    const [trendingCategories, setTrendingCategories] = useState([]);
    const [shopBySkinTypes, setShopBySkinTypes] = useState([]);
    const [shopByIngredients, setShopByIngredients] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [filterData, setFilterData] = useState(null);

    const activeCategorySlug = useMemo(() => {
        return location.pathname.includes("/category/") && effectiveSlug ? effectiveSlug : null;
    }, [location.pathname, effectiveSlug]);
    const [activeCategoryName, setActiveCategoryName] = useState("");

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

    const [filters, setFilters] = useState(() => {
        const initial = {
            brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
            finishes: [], ingredients: [], priceRange: null, discountMin: null,
            minRating: "", sort: "recent"
        };
        const getMultiParam = (key) => {
            const values = searchParams.getAll(key);
            if (values.length > 0) return values;
            const commaValue = searchParams.get(key);
            if (commaValue) return commaValue.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };
        ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
            initial[key] = getMultiParam(key);
        });
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice !== null || maxPrice !== null) {
            initial.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : null,
            };
        }
        const discountMin = searchParams.get('discountMin');
        if (discountMin !== null) initial.discountMin = parseFloat(discountMin);
        const minRating = searchParams.get('minRating');
        if (minRating !== null) initial.minRating = minRating;
        const sortParam = searchParams.get('sort');
        if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
            initial.sort = sortParam;
        }
        return initial;
    });

    const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
    const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("all");

    const { user } = useContext(UserContext);
    const loaderRef = useRef(null);

    /* ── toast ──────────────────────────────────────────────────────────────── */
    const showToastMsg = (msg, type = "error", dur = 3000) => {
        if (type === "success") {
            toast.success(msg, { autoClose: dur });
        } else if (type === "info") {
            toast.info(msg, { autoClose: dur });
        } else {
            toast.error(msg, { autoClose: dur });
        }
    };

    /* ── wishlist ───────────────────────────────────────────────────────────── */
    const isInWishlist = (pid, sku) => {
        if (!pid || !sku) return false;
        return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
    };

    const fetchWishlistData = async () => {
        try {
            if (user && !user.guest) {
                const { data } = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
                if (data.success) setWishlistData(data.wishlist || []);
            } else {
                const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
                setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchWishlistData(); }, [user]);

    const toggleWishlist = async (prod, variant) => {
        if (!user || user.guest) {
            showToastMsg("Please login to use wishlist", "error");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        if (!prod || !variant) return showToastMsg("Select a variant first", "error");
        const pid = prod._id;
        const sku = getSku(variant);
        setWishlistLoading((p) => ({ ...p, [pid]: true }));
        try {
            const inWl = isInWishlist(pid, sku);
            if (user && !user.guest) {
                if (inWl) {
                    await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { withCredentials: true, data: { sku } });
                    showToastMsg("Removed from wishlist!", "success");
                } else {
                    await axios.post(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { sku }, { withCredentials: true });
                    showToastMsg("Added to wishlist!", "success");
                }
                await fetchWishlistData();
            } else {
                let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
                if (inWl) {
                    g = g.filter((it) => !(it._id === pid && it.sku === sku));
                    showToastMsg("Removed from wishlist!", "success");
                } else {
                    g.push({
                        _id: pid, name: prod.name, brand: getBrandName(prod),
                        displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
                        originalPrice: variant.originalPrice || variant.mrp || prod.price,
                        image: variant.images?.[0] || prod.images?.[0],
                        sku, variantName: variant.shadeName || "Default", stock: variant.stock,
                    });
                    showToastMsg("Added to wishlist!", "success");
                }
                localStorage.setItem("guestWishlist", JSON.stringify(g));
                await fetchWishlistData();
            }
        } catch (e) {
            showToastMsg(e.response?.data?.message || "Wishlist error", "error");
        } finally {
            setWishlistLoading((p) => ({ ...p, [pid]: false }));
        }
    };

    /* ── fetch products ─────────────────────────────────────────────────────── */
    const buildQueryParams = (cursor = null) => {
        const p = new URLSearchParams();
        const path = location.pathname.toLowerCase();

        if (activeCategorySlug) {
            p.append("categoryIds", activeCategorySlug);
        } else if (path.includes("/category/")) {
            p.append("categoryIds", effectiveSlug);
        } else if (path.includes("/skintype/")) {
            p.append("skinTypes", effectiveSlug);
        } else if (path.includes("/ingredients/")) {
            p.append("ingredients", effectiveSlug);
        } else if (path.includes("/promotion/")) {
            p.append("promoSlug", effectiveSlug);
        }

        const q = searchParams.get("q") || searchParams.get("search");
        if (q) p.append("q", q);

        filters.brandIds?.forEach((id) => p.append("brandIds", id));
        filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
        filters.skinTypes?.forEach((n) => p.append("skinTypes", n));
        filters.formulations?.forEach((id) => p.append("formulations", id));
        filters.finishes?.forEach((s) => p.append("finishes", s));
        filters.ingredients?.forEach((s) => p.append("ingredients", s));
        if (filters.minRating) p.append("minRating", filters.minRating);

        // Handle price range filter
        if (filters.priceRange) {
            p.append("minPrice", filters.priceRange.min);
            if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
        }

        // Handle discount filter - using discountMin parameter
        if (filters.discountMin && filters.discountMin > 0) {
            p.append("discountMin", filters.discountMin);
        }

        if (filters.sort) p.append("sort", filters.sort);
        if (cursor) p.append("cursor", cursor);
        p.append("limit", "9");

        const queryString = p.toString();
        console.log("API Query →", `${PRODUCT_ALL_API}?${queryString}`);
        return queryString;
    };

    const fetchProducts = async (cursor = null, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                // Keep allProducts as is until fetch completes for a smoother feel
                setNextCursor(null);
                setHasMore(true);
            } else {
                setLoadingMore(true);
            }

            const { data } = await axios.get(
                `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
                { withCredentials: true }
            );

            // title & banner
            const q = searchParams.get("q") || searchParams.get("search");
            if (q) setPageTitle(`Search Results for "${q}"`);
            else if (data.titleMessage) setPageTitle(data.titleMessage);
            else if (data.category?.name) setPageTitle(data.category.name);
            else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
            else if (data.skinType?.name) setPageTitle(data.skinType.name);
            else setPageTitle("Products");

            // 🔥 CHANGED: Extract banner array
            let extractedBanners = [];
            if (data.bannerImage && Array.isArray(data.bannerImage)) {
                extractedBanners = data.bannerImage;
            } else if (data.category?.bannerImage && Array.isArray(data.category.bannerImage)) {
                extractedBanners = data.category.bannerImage;
            } else if (data.promoMeta?.bannerImage && Array.isArray(data.promoMeta.bannerImage)) {
                extractedBanners = data.promoMeta.bannerImage;
            } else if (data.skinType?.bannerImage && Array.isArray(data.skinType.bannerImage)) {
                extractedBanners = data.skinType.bannerImage;
            } else if (data.bannerImage) {
                extractedBanners = [data.bannerImage];
            } else if (data.category?.bannerImage) {
                extractedBanners = [data.category.bannerImage];
            } else if (data.promoMeta?.bannerImage) {
                extractedBanners = [data.promoMeta.bannerImage];
            } else if (data.skinType?.bannerImage) {
                extractedBanners = [data.skinType.bannerImage];
            }

            setBannerImages(extractedBanners);

            // Shop By Sections
            if (data.skinTypes && Array.isArray(data.skinTypes)) {
                setShopBySkinTypes(data.skinTypes);
            }
            if (data.shopByIngredients && Array.isArray(data.shopByIngredients)) {
                setShopByIngredients(data.shopByIngredients);
            }
            if (data.promotions && Array.isArray(data.promotions)) {
                setPromotions(data.promotions);
            }

            if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
                setTrendingCategories(data.trendingCategories);
                if (effectiveSlug && !activeCategoryName) {
                    const found = data.trendingCategories.find((c) => c.slug === effectiveSlug);
                    if (found) setActiveCategoryName(found.name);
                }
            } else {
                setTrendingCategories([]);
            }

            if (data.category?.name && !activeCategoryName && effectiveSlug) {
                setActiveCategoryName(data.category.name);
            }

            if (reset && data.filters) {
                setFilterData(data.filters);
            }

            const prods = data.products || [];
            const pg = data.pagination || {};

            if (reset) setAllProducts(prods);
            else setAllProducts((prev) => [...prev, ...prods]);

            setHasMore(pg.hasMore || false);
            setNextCursor(pg.nextCursor || null);
        } catch (e) {
            console.error(e);
            showToastMsg("Failed to fetch products", "error");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (location.pathname.includes("/category/") && effectiveSlug) {
            if (trendingCategories.length > 0) {
                const found = trendingCategories.find(c => c.slug === effectiveSlug);
                if (found) setActiveCategoryName(found.name);
            }
        } else {
            setActiveCategoryName("");
        }
    }, [effectiveSlug, location.pathname, trendingCategories]);

    /* ── Parse URL query parameters on mount (FIXED) ────────────────────────────── */
    useEffect(() => {
        const initialFilters = {
            brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
            finishes: [], ingredients: [], priceRange: null, discountMin: null,
            minRating: "", sort: "recent"
        };

        const getMultiParam = (key) => {
            const values = searchParams.getAll(key);
            if (values.length > 0) return values;
            const commaValue = searchParams.get(key);
            if (commaValue) return commaValue.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
            initialFilters[key] = getMultiParam(key);
        });

        // Restore price range
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice !== null || maxPrice !== null) {
            initialFilters.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : null,
            };
        }

        // Restore discountMin
        const discountMin = searchParams.get('discountMin');
        if (discountMin !== null) initialFilters.discountMin = parseFloat(discountMin);

        // Restore minRating
        const minRating = searchParams.get('minRating');
        if (minRating !== null) initialFilters.minRating = minRating;

        // Restore sort
        const sortParam = searchParams.get('sort');
        if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
            initialFilters.sort = sortParam;
        }

        setFilters(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(initialFilters)) {
                console.log("✅ Filters restored from URL:", initialFilters);
                return initialFilters;
            }
            return prev;
        });
    }, [searchParams]);

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

        const currentQuery = searchParams.toString();
        const newQuery = newParams.toString();
        if (currentQuery !== newQuery) {
            setSearchParams(newParams, { replace: true });
        }
    }, [filters, setSearchParams, searchParams]);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts(null, true);
    }, [effectiveSlug, location.pathname, filters, activeCategorySlug]);

    const pageDefault = location.pathname.includes("/category/") ? effectiveSlug : null;

    const makeEmptyFilters = () => ({
        brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
        finishes: [], ingredients: [], priceRange: null, discountMin: null,
        minRating: "", sort: "recent"
    });

    /* ── CATEGORY PILL CLICK ────────────────────────────────────────────────── */
    const handleCategoryPillClick = useCallback(
        (cat) => {
            if (activeCategorySlug === cat.slug) {
                navigate("/products");
            } else {
                navigate(`/category/${cat.slug}`);
            }
        },
        [activeCategorySlug, navigate]
    );

    const handleClearCategory = useCallback(() => {
        navigate("/products");
    }, [navigate]);

    /* ── NEW: Skin Type & Ingredient Click Handlers ─────────────────────────── */
    const handleSkinTypeClick = useCallback((skin) => {
        setFilters(prev => {
            const current = prev.skinTypes || [];
            const isActive = current.includes(skin.slug);
            return {
                ...prev,
                skinTypes: isActive
                    ? current.filter(s => s !== skin.slug)
                    : [...current, skin.slug]
            };
        });
    }, []);

    const handleIngredientClick = useCallback((ing) => {
        setFilters(prev => {
            const current = prev.ingredients || [];
            const isActive = current.includes(ing.slug);
            return {
                ...prev,
                ingredients: isActive
                    ? current.filter(i => i !== ing.slug)
                    : [...current, ing.slug]
            };
        });
    }, []);

    /* ── SPECIAL PROMOTION CLICK ────────────────────────────────────────────── */
    const handlePromotionClick = useCallback((promo) => {
        if (promo.slug) {
            navigate(`/promotion/${promo.slug}`);
        }
    }, [navigate]);

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
                if (!sel || sel.stock <= 0) { showToastMsg("Please select an in-stock variant.", "error"); return; }
                payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
                const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
                cache[prod._id] = sel;
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            } else {
                if (prod.stock <= 0) { showToastMsg("Product is out of stock.", "error"); return; }
                payload = { productId: prod._id, quantity: 1 };
            }
            const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
            if (!data.success) throw new Error(data.message || "Cart add failed");
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

    /* ── ui handlers ────────────────────────────────────────────────────────── */
    const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
    const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
    const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
    const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

    const isAnyFilterActive =
        filters.brandIds.length > 0 || filters.categoryIds.length > 0 ||
        filters.skinTypes.length > 0 || filters.formulations.length > 0 ||
        filters.finishes.length > 0 || filters.ingredients.length > 0 ||
        filters.priceRange || filters.discountMin || filters.minRating ||
        filters.sort !== "recent" ||
        (activeCategorySlug && activeCategorySlug !== pageDefault);

    const handleClearAllFilters = () => {
        setFilters(makeEmptyFilters());
        if (slug && slug.includes("/")) {
            const segments = slug.split("/");
            segments.pop(); // Go up one level
            const newPath = segments.join("/");
            if (newPath) {
                navigate(`/category/${newPath}`);
            } else {
                navigate("/products");
            }
        } else {
            navigate("/products");
        }
    };

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
        const img =
            displayVariant?.images?.[0] ||
            displayVariant?.image ||
            prod.images?.[0] ||
            "/placeholder.png";

        const isAdding = addingToCart[prod._id];

        // Check out of stock status
        const completelyOutOfStock = isCompletelyOutOfStock(prod);
        const currentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;

        // Show out of stock if completely out AND it has NO variants
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
                            style={{ cursor: showOutOfStock ? 'pointer' : 'pointer', position: 'relative' }}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (displayVariant || !hasVar)
                                            toggleWishlist(prod, displayVariant || {});
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
                                <div className="brand-name small text-muted text-start mb-1 mt-2">
                                    {getBrandName(prod)}
                                </div>

                                {/* Product Name */}
                                <h6
                                    className="foryou-name font-family-Poppins m-0 p-0"
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
                                </h6>

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
                                        {(() => {
                                            const price =
                                                displayVariant?.displayPrice ||
                                                displayVariant?.discountedPrice ||
                                                prod.price ||
                                                0;
                                            const orig =
                                                displayVariant?.originalPrice ||
                                                displayVariant?.mrp ||
                                                prod.mrp ||
                                                price;
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
                                                            <span className="discount-percent text-danger fw-bold ms-2">
                                                                ({pct}% OFF)
                                                            </span>
                                                        </>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

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
                                                    <img src={Bag} alt="Bag" className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} />
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

    const brandFilterProps = {
        filters,
        setFilters,
        filterData,
        trendingCategories,
        activeCategorySlug,
        activeCategoryName,
        onClearCategory: handleClearCategory,
        onCategoryPillClick: handleCategoryPillClick,
    };

    // Keep your OLD loader for initial loading
    if (loading && allProducts.length === 0)
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

    /* ── render ─────────────────────────────────────────────────────────────── */
    return (
        <>
            <Header />

            {/* 🔥 UPDATED: HERO BANNER REPLACED WITH SWIPER SLIDER 🔥 */}
            {bannerImages?.length > 0 &&
                !location.pathname.toLowerCase().includes("/skintype") &&
                !(filters.skinTypes && filters.skinTypes.length > 0) ? (
                <section className="hero-slider text-center mt-xl-5 pt-xl-4 padding-left-rightss">
                    <Swiper
                        ref={swiperRef}
                        modules={[Autoplay, Pagination, Navigation]}
                        onSlideChange={() => {
                            const swiper = swiperRef.current?.swiper;
                            if (!swiper) return;
                            document.querySelectorAll(".slide-video").forEach((v) => v.pause());
                            const activeSlide = swiper.slides[swiper.activeIndex];
                            const video = activeSlide?.querySelector("video");
                            if (video) video.play().catch(() => { });
                        }}
                        loop={bannerImages.length > 1}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{
                            clickable: true,
                            bulletClass: 'custom-swiper-bullet',
                            bulletActiveClass: 'custom-swiper-bullet-active',
                        }}
                        navigation={bannerImages.length > 1}
                        speed={800}
                        style={{ height: "auto", width: "100%" }}
                    >
                        {bannerImages.map((banner, index) => {
                            const imgUrl = typeof banner === "string" ? banner : banner.url;
                            const targetLink = typeof banner === "object" ? banner.link : null;

                            return (
                                <SwiperSlide key={index}>
                                    <div
                                        className="position-relative w-100 h-100 mt-5 pt-4 hero-slider-image-responsive"
                                        style={{ cursor: targetLink ? "pointer" : "default" }}
                                        onClick={() => {
                                            if (!targetLink) return;
                                            if (targetLink.startsWith("http")) window.open(targetLink, "_blank");
                                            else navigate(targetLink);
                                        }}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={pageTitle || `Banner ${index + 1}`}
                                            className="w-100 h-100"
                                            style={{ maxHeight: "100%" }}
                                            onError={(e) => { e.currentTarget.src = "/banner-placeholder.jpg"; }}
                                        />
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </section>
            ) : (
                <div className="non-hero-spacer" />
            )}

            {/* Trending Categories */}
            {trendingCategories.length > 0 && (
                <div className="container-lg mt-4 mb-4">
                    <h2 className="text-center" style={{ marginBottom: "30px", textAlign: "center" }}>Top Catagories</h2>
                    <div
                        className="category-swiper-outer"
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={10}
                            slidesPerView="auto"
                            navigation
                            style={{
                                padding: "5px 0",
                                width: "auto" // Swiper ko sirf apne slides ke hisab se width lene do
                            }}
                        >
                            {trendingCategories.map((cat) => {
                                const isActive = activeCategorySlug === cat.slug;

                                return (
                                    <SwiperSlide key={cat.slug} className="mx-auto" style={{ width: "auto" }}>
                                        {/* <button
                                        onClick={() => handleCategoryPillClick(cat)}
                                        className={`btn px-4 py-2 page-title-main-name ${isActive ? "btn-dark" : "btn-outline-secondary"
                                            }`}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                            transition: "all 0.18s ease",
                                            transform: isActive ? "scale(1.04)" : "scale(1)",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={`Filter by ${cat.name}`}
                                    >
                                        {cat.name}
                                    </button> */}

                                        <button
                                            onClick={() => handleCategoryPillClick(cat)}
                                            className={`btn px-4 py-2 page-title-main-name ${isActive ? "btn-dark custom-pill" : "custom-pill"}`}
                                            style={{
                                                fontSize: 13,
                                                fontWeight: isActive ? 600 : 400,
                                                transition: "all 0.18s ease",
                                                transform: isActive ? "scale(1.04)" : "scale(1)",
                                                whiteSpace: "nowrap",
                                                margin: "0 15px",
                                            }}
                                            title={`Filter by ${cat.name}`}
                                        >
                                            {cat.name}
                                        </button>
                                    </SwiperSlide>
                                );
                            })}

                        </Swiper>

                    </div>
                </div>
            )}

            {/* Shop By Skin Types */}
            {shopBySkinTypes.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Shop by Skin Type</h5>
                    <div className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
                        {shopBySkinTypes.map((skin) => {
                            const isActive = filters.skinTypes.includes(skin.slug);
                            return (
                                <button
                                    key={skin.slug}
                                    onClick={() => handleSkinTypeClick(skin)}
                                    className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                                    style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
                                >
                                    {skin.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Shop By Ingredients */}
            {shopByIngredients.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Shop by Ingredients</h5>
                    <div className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
                        {shopByIngredients.map((ing) => {
                            const isActive = filters.ingredients.includes(ing.slug);
                            return (
                                <button
                                    key={ing.slug}
                                    onClick={() => handleIngredientClick(ing)}
                                    className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                                    style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
                                >
                                    {ing.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Special Offers / Promotions */}
            {promotions.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Special Offers</h5>
                    <div className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
                        {promotions.map((promo) => (
                            <button
                                key={promo._id}
                                onClick={() => handlePromotionClick(promo)}
                                className="btn px-4 py-2 page-title-main-name flex-shrink-0 btn-outline-danger"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                {promo.title} {promo.discountLabel && `(${promo.discountLabel})`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="padding-left-rightss ms-lg-0 ms-3 mx-3">
                {/* <h2 className="mb-4 d-none d-lg-block page-title-main-name page-upper-case-first">{pageTitle}</h2> */}

                <div className="row">
                    <div className="d-none d-lg-block col-lg-3">
                        <BrandFilter {...brandFilterProps} />
                    </div>

                    <div className="d-lg-none mb-lg-3">
                        <h2 className="mb-4 text-center mt-lg-0 mt-3 page-upper-case-first">{pageTitle}</h2>
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

                    {/* Filter & Sort Offcanvas */}
                    {showFilterOffcanvas && (
                        <>
                            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
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
                                        onCategoryPillClick={(cat) => {
                                            handleCategoryPillClick(cat);
                                            setShowFilterOffcanvas(false);
                                        }}
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
                                            { value: "recent", label: "Relevance" },
                                            { value: "priceHighToLow", label: "Price High to Low" },
                                            { value: "priceLowToHigh", label: "Price Low to High" },
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

                    <div className="col-12 col-lg-9">
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <span className="text-muted page-title-main-name d-lg-block d-none">
                                {pageTitle || `Showing ${allProducts.length} products`}
                                {/* {hasMore && pageTitle && " (Scroll for more)"} */}
                            </span>
                        </div>

                        <div className="row g-4 position-relative">
                            {/* NEW Loading Overlay - shown when loading but products exist */}
                            {/* {loading && allProducts.length > 0 && (
                                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-start pt-5"
                                    style={{ background: 'rgba(255,255,255,0.6)', zIndex: 10, borderRadius: '15px' }}>
                                    <div className="text-center sticky-top" style={{ top: '200px' }}>
                                        <DotLottieReact className='foryoulanding-css'
                                            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                            loop
                                            autoplay
                                            style={{ width: '150px', height: '150px' }}
                                        />
                                        <p className="page-title-main-name fw-bold">Refining selection...</p>
                                    </div>
                                </div>
                            )} */}


                            {loading && (
                                <div
                                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.97)',
                                        zIndex: 9999,
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <div className="text-center">
                                        <DotLottieReact
                                            className="mb-4"
                                            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                            loop
                                            autoplay
                                            style={{ width: '200px', height: '200px' }}
                                        />

                                        <p className="text-muted mb-0">
                                            Finding the perfect products just for you
                                        </p>

                                        {/* Optional loading dots */}
                                        <div className="d-flex justify-content-center gap-1 mt-4">
                                            <div className="dot-pulse"></div>
                                            <div className="dot-pulse"></div>
                                            <div className="dot-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {allProducts.length > 0
                                ? allProducts.map(renderProductCard)
                                : loading
                                    ? (
                                        // NEW Loading state when no products yet
                                        <div className="col-12 text-center py-5">
                                            <DotLottieReact className='foryoulanding-css'
                                                src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                                                loop
                                                autoplay
                                                style={{ width: '200px', height: '200px', margin: '0 auto' }}
                                            />
                                            <p className="text-muted">Loading products...</p>
                                        </div>
                                    )
                                    : <div className="col-12 text-center py-5"><h4>No products found</h4><p className="text-muted">Try adjusting your filters.</p></div>
                            }
                        </div>

                        {loadingMore && (
                            <div className="text-center mt-4 py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading more products...</span>
                                </div>
                                <p className="mt-2">Loading more products...</p>
                            </div>
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
            {/* ===================== OUT OF STOCK POPUP ===================== */}
            <OutOfStockPopup
                isOpen={showOutOfStockPopup}
                onClose={closeOutOfStockPopup}
                productName={outOfStockProductName}
            />

            {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
            {showVariantOverlay && (() => {
                const item = allProducts.find(p => p._id === showVariantOverlay);
                if (!item) return null;

                const allVariants = item.variants || [];
                const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.find((v) => v.stock > 0) || allVariants[0]) || {};
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
                                            ₹{displayVariant.displayPrice}
                                        </span>
                                        {displayVariant.originalPrice > displayVariant.displayPrice && (
                                            <>
                                                <span className="mobile-sheet-original-price">
                                                    ₹{displayVariant.originalPrice}
                                                </span>
                                                <span className="mobile-sheet-discount">
                                                    ({Math.round(((displayVariant.originalPrice - displayVariant.displayPrice) / displayVariant.originalPrice) * 100)}% OFF)
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

            <Footer />
        </>
    );
}


//===========================================================================Done-Code(End)========================================================================================== 
