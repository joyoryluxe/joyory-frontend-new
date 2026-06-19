// CategoryLandingPage.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaHeart,
    FaRegHeart,
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaCheck,
} from "react-icons/fa";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../context/UserContext.jsx";
import "../styles/CategoryLandingPage.css";
import "../styles/BestSellers.css";
import Bag from "../assets/Bag.svg";
import { ToastContainer, toast } from "react-toastify";
import SEOMeta from "../components/common/SEOMeta"; // Add import at top

// Import Swiper and its styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Certificate from "../components/sections/home/Certificate.jsx";

const API_BASE = "https://beauty.joyory.com/api/user";
const CART_API_BASE = `${API_BASE}/cart`;
const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

/* ---------- helpers ---------- */
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
    if (!hex || typeof hex !== "string") return false;
    const n = hex.trim().toLowerCase();
    return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(n);
};

const getVariantDisplayText = (v) =>
    (
        v.shadeName ||
        v.name ||
        v.size ||
        v.ml ||
        v.weight ||
        "Default"
    ).toUpperCase();

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

/**
 * Custom Section Slider Component
 */
const SectionSlider = ({
    children,
    slidesPerView = 4,
    spaceBetween = 20,
    breakpoints = {},
}) => {
    const swiperRef = useRef(null);

    const defaultBreakpoints = {
        320: { slidesPerView: 2, spaceBetween: 10 },
        576: { slidesPerView: 3, spaceBetween: 15 },
        768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
    };

    const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

    return (
        <div className="position-relative margintop-sss">
            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={spaceBetween}
                breakpoints={mergedBreakpoints}
                navigation={false}
                className="section-slider"
            >
                {children}
            </Swiper>
        </div>
    );
};

// ===================== 404 NOT FOUND PAGE COMPONENT =====================
const NotFoundPage = ({ message, onGoHome }) => (
    <>
        <Header />
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 text-center">
                    <div className="mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
                            style={{ width: '120px', height: '120px' }}
                        >
                            <span style={{ fontSize: '60px' }}>🔍</span>
                        </div>
                    </div>

                    <h1 className="display-4 fw-bold mb-3 page-title-main-name">
                        404
                    </h1>

                    <h2 className="h4 mb-4 page-title-main-name text-muted">
                        Page Not Found
                    </h2>

                    <p className="lead mb-4 page-title-main-name text-secondary">
                        {message || "The page you're looking for doesn't exist or has been moved."}
                    </p>

                    <div className="mb-5">
                        <p className="text-muted mb-4 page-title-main-name">
                            Here are some helpful links instead:
                        </p>

                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                            <button
                                className="btn btn-dark px-4 py-2 page-title-main-name"
                                onClick={onGoHome || (() => window.location.href = '/')}
                            >
                                <i className="bi bi-house me-2"></i>
                                Go to Homepage
                            </button>

                            <button
                                className="btn btn-outline-dark px-4 py-2 page-title-main-name"
                                onClick={() => window.history.back()}
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Go Back
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
        <Footer />
    </>
);

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

export default function CategoryLandingPage() {
    const swiperRef = useRef(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // ========== ADDED: Effective slug for handling nested routes ==========
    const effectiveSlug = slug?.includes("/")
        ? slug.split("/").pop()
        : slug;
    // ========== END ADDED ==========

    // State
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show404, setShow404] = useState(false); // NEW: 404 state
    const [errorMessage, setErrorMessage] = useState(""); // NEW: custom error message

    // Wishlist state
    const [wishlistData, setWishlistData] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState({});

    // Cart & variant selection
    const [selectedVariants, setSelectedVariants] = useState({});
    const [tempSelectedVariants, setTempSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("all");

    // ===================== OUT OF STOCK POPUP STATE =====================
    const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
    const [outOfStockProductName, setOutOfStockProductName] = useState("");

    /* ---------- Toast ---------- */
    // const showToastMsg = (msg, type = "error", dur = 3000) => {
    //     const t = document.createElement("div");
    //     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
    //     t.style.cssText = `
    //   z-index: 9999;
    //   background: ${type === "error" ? "#dc3545" : "#198754"};
    //   box-shadow: 0 4px 12px rgba(0,0,0,.15);
    // `;
    //     t.textContent = msg;
    //     document.body.appendChild(t);
    //     setTimeout(() => t.remove(), dur);
    // };


    const showToastMsg = (message, type = "error", duration = 3000) => {
        if (type === "success") {
            toast.success(message, { autoClose: duration });
        } else if (type === "error") {
            toast.error(message, { autoClose: duration });
        } else {
            toast.info(message, { autoClose: duration });
        }
    };

    // ===================== OUT OF STOCK POPUP HANDLER =====================
    const handleOutOfStockClick = (productName) => {
        setOutOfStockProductName(productName || "This product");
        setShowOutOfStockPopup(true);

        // Auto hide after 3 seconds
        setTimeout(() => {
            setShowOutOfStockPopup(false);
        }, 3000);
    };

    const closeOutOfStockPopup = () => {
        setShowOutOfStockPopup(false);
    };

    /* ========== FETCH LANDING DATA ========== */
    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                setLoading(true);
                setShow404(false); // Reset 404 state
                setError(null);

                const { data } = await axios.get(
                    `${API_BASE}/categories/category/${effectiveSlug}/landing`,
                );
                setData(data);
            } catch (err) {
                console.error("Failed to load category landing:", err);

                const status = err.response?.status;
                const responseMessage = err.response?.data?.message;
                const isLandingPage = err.response?.data?.isLandingPage;

                // ========== ENHANCED ERROR HANDLING ==========

                // Check if it's a 400 error with isLandingPage: false (sub-category blocked)
                if (status === 400 && isLandingPage === false) {
                    setErrorMessage(
                        responseMessage ||
                        "This page is only available for top-level parent categories. Sub-categories are not accessible directly."
                    );
                    setShow404(true);
                }
                // Check if it's a 404 error (category not found)
                else if (status === 404) {
                    setErrorMessage(
                        responseMessage ||
                        "The category you're looking for doesn't exist or has been removed."
                    );
                    setShow404(true);
                }
                // Check if it's a 500 error (server error)
                else if (status === 500) {
                    setErrorMessage(
                        "We're experiencing technical difficulties. Please try again later."
                    );
                    setShow404(true);
                }
                // Network error (no response)
                else if (err.code === 'ERR_NETWORK' || !err.response) {
                    setErrorMessage(
                        "Unable to connect to the server. Please check your internet connection and try again."
                    );
                    setShow404(true);
                }
                // Any other error
                else {
                    setError(responseMessage || "Failed to load page");
                    setErrorMessage(
                        responseMessage ||
                        "An unexpected error occurred. Please try again or contact support."
                    );
                    setShow404(true);
                }
            } finally {
                setLoading(false);
            }
        };

        if (effectiveSlug) {
            fetchLandingData();
        } else {
            // If no slug provided, show 404
            setErrorMessage("No category specified. Please select a valid category.");
            setShow404(true);
            setLoading(false);
        }
    }, [slug, effectiveSlug]);

    /* ========== WISHLIST LOGIC ========== */
    const isInWishlist = (pid, sku) => {
        if (!pid || !sku) return false;
        return wishlistData.some(
            (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
        );
    };

    const fetchWishlistData = async () => {
        try {
            if (user && !user.guest) {
                const { data } = await axios.get(WISHLIST_API_BASE, {
                    withCredentials: true,
                });
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
        if (!prod || !variant)
            return showToastMsg("Select a variant first", "error");
        const pid = prod._id;
        const sku = getSku(variant);

        if (!user || user.guest) {
            showToastMsg("Please login to use wishlist", "error");
            localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId: pid, sku }));
            navigate("/login", { state: { from: "/wishlist" } });
            return;
        }

        setWishlistLoading((p) => ({ ...p, [pid]: true }));
        try {
            const inWl = isInWishlist(pid, sku);
            if (inWl) {
                await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
                    withCredentials: true,
                    data: { sku },
                });
                showToastMsg("Removed from wishlist!", "success");
            } else {
                await axios.post(
                    `${WISHLIST_API_BASE}/${pid}`,
                    { sku },
                    { withCredentials: true },
                );
                showToastMsg("Added to wishlist!", "success");
            }
            await fetchWishlistData();
        } catch (e) {
            if (e.response?.status === 401) {
                showToastMsg("Please login to use wishlist", "error");
                localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId: pid, sku }));
                navigate("/login", { state: { from: "/wishlist" } });
            } else {
                showToastMsg(e.response?.data?.message || "Wishlist error", "error");
            }
        } finally {
            setWishlistLoading((p) => ({ ...p, [pid]: false }));
        }
    };

    /* ========== CART LOGIC ========== */
    const handleAddToCart = async (prod, forceVariant = null) => {
        setAddingToCart((p) => ({ ...p, [prod._id]: true }));
        try {
            const vars = Array.isArray(prod.variants) ? prod.variants : [];
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
                const cache = JSON.parse(
                    localStorage.getItem("cartVariantCache") || "{}",
                );
                cache[prod._id] = sel;
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            } else {
                if (prod.stock <= 0) {
                    showToastMsg("Product is out of stock.", "error");
                    return;
                }
                payload = { productId: prod._id, quantity: 1 };
            }

            const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
                withCredentials: true,
            });
            if (!data.success) throw new Error(data.message || "Cart add failed");

            showToastMsg("Product added to cart!", "success");
            navigate("/cartpage");
        } catch (e) {
            const msg =
                e.response?.data?.message || e.message || "Failed to add to cart";
            showToastMsg(msg, "error");
            if (e.response?.status === 401)
                navigate("/login", { state: { from: location.pathname } });
        } finally {
            setAddingToCart((p) => ({ ...p, [prod._id]: false }));
        }
    };

    const handleVariantSelect = (pid, v) =>
        setSelectedVariants((p) => ({ ...p, [pid]: v }));

    const openVariantOverlay = (pid, t = "all") => {
        setSelectedVariantType(t);
        setShowVariantOverlay(pid);
    };
    const closeVariantOverlay = () => {
        setShowVariantOverlay(null);
        setSelectedVariantType("all");
    };
    const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

    /* Video play/pause when slide changes */
    const handleSlideChange = () => {
        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;
        document.querySelectorAll(".slide-video").forEach((v) => v.pause());
        const activeSlide = swiper.slides[swiper.activeIndex];
        const video = activeSlide?.querySelector("video");
        if (video) video.play().catch(() => { });
    };

    /* ========== LINK NAVIGATION HANDLER ========== */
    const handleLinkNavigation = (link) => {
        if (!link) return;
        if (link.startsWith("http://") || link.startsWith("https://")) {
            window.location.href = link;
        } else {
            navigate(link);
        }
    };

    /* ========== CHECK IF PRODUCT IS COMPLETELY OUT OF STOCK ========== */
    const isCompletelyOutOfStock = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        if (vars.length === 0) {
            return (prod.stock || 0) <= 0;
        }
        return vars.every(v => (v.stock || 0) <= 0);
    };

    /* ========== RENDER PRODUCT CARD ========== */
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
            <div key={prod._id} className="col position-relative">
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

    /* ========== RENDER SECTIONS ========== */
    if (loading)
        return (
            <div
                className="d-flex flex-column align-items-center justify-content-center bg-white"
                style={{
                    minHeight: "100vh",
                    width: "100%",
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
        );

    // ========== NEW: Show 404 page if error condition met ==========
    if (show404) {
        return (
            <NotFoundPage
                message={errorMessage}
                onGoHome={() => navigate('/', { replace: true })}
            />
        );
    }

    // ========== FALLBACK: Show error in page with header/footer ==========
    if (error || !data)
        return (
            <>
                <Header />
                <div className="container text-center py-5">
                    <h3 className="text-danger">Error</h3>
                    <p className="text-muted">{error || "Category not found"}</p>
                    <button
                        className="btn btn-dark mt-3"
                        onClick={() => navigate('/', { replace: true })}
                    >
                        Go to Homepage
                    </button>
                </div>
                <Footer />
            </>
        );

    const {
        category,
        subCategoriesTitle,
        subCategories,
        promotionsTitle,
        promotions,
        brandsTitle,
        brands,
        topSellersTitle,
        topSellers,
        skinTypesTitle,
        skinTypes,
        shopByIngredientsTitle,
        shopByIngredients,
        findsForYou,
        featureBanners,
        totalProducts,
        inFocusTitle,
        inFocus,
    } = data;

    return (
        <>
            <SEOMeta type="category" slug={effectiveSlug} />
            <Header />

            {/* ===================== OUT OF STOCK POPUP ===================== */}
            <OutOfStockPopup
                isOpen={showOutOfStockPopup}
                onClose={closeOutOfStockPopup}
                productName={outOfStockProductName}
            />

            {/* Hero Banner Slider */}
            {category.bannerImage?.length > 0 ? (
                <section className="hero-slider">
                    <Swiper
                        ref={swiperRef}
                        modules={[Autoplay, Pagination, Navigation]}
                        onSlideChange={handleSlideChange}
                        loop
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{
                            clickable: true,
                            bulletClass: 'custom-swiper-bullet',
                            bulletActiveClass: 'custom-swiper-bullet-active',
                        }}
                        navigation
                        speed={800}
                        className="mt-lg-5"
                        style={{ height: "auto", width: "100%" }}
                    >
                        {category.bannerImage.map((banner, index) => {
                            const imgUrl = typeof banner === "string" ? banner : banner.url;
                            const targetLink =
                                typeof banner === "object" ? banner.link : null;

                            return (
                                <SwiperSlide key={index} className="">
                                    <div
                                        className="position-relative w-100 h-100 mt-xl-4 mt-3 padding-left-rightss"
                                        style={{ cursor: targetLink ? "pointer" : "default" }}
                                        onClick={() =>
                                            targetLink && handleLinkNavigation(targetLink)
                                        }
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`${category.name} banner ${index + 1}`}
                                            className="slide-media hero-slider-image-responsive mt-5 pt-0"
                                            style={{ height: '100%' }}
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

            {/* Main Content Container */}
            <div className="container-fluid p-md-5 p-lg-2 py-lg-4 ps-4 px-4 pt-lg-2">
                {/* Category Title */}
                <div
                    className="mb-0 cursor-pointer"
                    onClick={() => navigate(`/category/${category.slug}`)}
                >
                </div>

                {/* Sub Categories (Top Category) - Slider */}
                {subCategories?.length > 0 && (
                    <section className="mb padding-left-right-sub-category">
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                            <h2 className="top-categories-title mb-0 page-title-main-name fw-normal">
                                {subCategoriesTitle || "Top Categories"}
                            </h2>
                        </div>
                        <SectionSlider slidesPerView={3} spaceBetween={10}>
                            {subCategories.map((sub) => (
                                <SwiperSlide key={sub._id}>
                                    <div
                                        className="h-100 border-0 text-center cursor-pointer mt-1"
                                        onClick={() => navigate(`/category/${slug}/${sub.slug}`)}
                                    >
                                        {sub.thumbnailImage?.[0] && (
                                            <img
                                                src={sub.thumbnailImage[0]}
                                                alt={sub.name}
                                                className="mx-auto mt-3 img-fluid object-fit-contain"
                                            />
                                        )}
                                        <div className="card-body p-2">
                                            <h6 className="mt-3 text-start ms-1 page-title-main-name">
                                                {sub.name}
                                            </h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* Quiz Banner Section */}
                {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
                    <section className="mb-5 padding-left-right-sub-category">
                        <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-5 mt-3">
                            {featureBanners?.find((b) => b.type === "quiz")?.title ||
                                "Beauty Quiz"}
                        </h3>
                        <div>
                            {featureBanners
                                .filter((banner) => banner.type === "quiz")
                                .map((banner) => {
                                    const bannerImage = banner.image?.[0]?.url || banner.image;
                                    const bannerLink = banner.image?.[0]?.link || banner.link;
                                    return (
                                        <div key={banner._id} className="h-100 row mt-lg-4 mt-3">
                                            <div className="col-md-6 h-100 w-100">
                                                {bannerImage && (
                                                    <img
                                                        src={bannerImage}
                                                        alt={banner.title}
                                                        className="img-fluid banner-image-quiz"
                                                        style={{ height: "auto", objectFit: "cover" }}
                                                    />
                                                )}
                                            </div>
                                            {/* <div className="col-md-6 d-lg-flex align-items-center">
                                                <div>
                                                    <h5 className="card-title fs-4 description-responsive description-responsivess page-title-main-name mt-lg-0 mt-4 ms-lg-5 ">
                                                        {banner.description}
                                                    </h5>
                                                    {banner.buttonText && (
                                                        <p
                                                            className="quize-btn mb-0 cursor-pointer mt-2 mt-lg-5 page-title-main-name ms-lg-5 ms-0 mt-4 quize-btn-responsive"
                                                            onClick={() => {
                                                                if (bannerLink) {
                                                                    handleLinkNavigation(bannerLink);
                                                                } else {
                                                                    navigate("/quiz");
                                                                }
                                                            }}
                                                        >
                                                            {banner.buttonText}
                                                        </p>
                                                    )}
                                                </div>
                                            </div> */}
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                )}

                {/* Promotions (Offers for You) */}
                {promotions?.length > 0 && (
                    <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
                        <div className="m-0 p-0">
                            <h3 className="top-categories-title p-0 m-0 page-title-main-name fw-normal mt-4" style={{
                                marginLeft: "-10px !important",
                            }}>
                                {promotionsTitle || "Offers For You"}
                            </h3>
                        </div>

                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 10 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {promotions.map((promo) => {
                                const isBrandPromo = promo.scope === "brand" && promo.targetSlug;
                                const isCategoryPromo = promo.scope === "category" && promo.targetSlug;

                                return (
                                    <SwiperSlide key={promo._id}>
                                        <div
                                            className="border-0 h-100 cursor-pointer mt-lg-4 mt-3"
                                            onClick={() => {
                                                if (isBrandPromo) {
                                                    navigate(`/brand/${promo.targetSlug}`);
                                                } else if (isCategoryPromo) {
                                                    navigate(`/category/${promo.targetSlug}`);
                                                } else {
                                                    navigate(`/promotion/${promo.slug}`);
                                                }
                                            }}
                                            style={{
                                                transition: "all 0.3s ease",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {promo.images?.[0] && (
                                                <img
                                                    src={promo.images[0]}
                                                    alt={promo.title}
                                                    className="m-0 p-0 img-fluid mt-lg-0 mt-1"
                                                    style={{
                                                        height: "auto",
                                                        padding: "10px",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.png";
                                                    }}
                                                />
                                            )}

                                            <div className="pt-3 ps-0">
                                                <div className="page-title-main-name">
                                                    <p className="mb-3">{promo.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </SectionSlider>
                    </section>
                )}

                {/* Shade Finder Banner Section */}
                {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
                    <section className="mb-5 padding-left-right-sub-category">
                        <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            Shade Finder
                        </h3>
                        <div>
                            {featureBanners
                                .filter((banner) => banner.type === "shadeFinder")
                                .map((banner) => {
                                    const bannerImage = banner.image?.[0]?.url || banner.image;
                                    const bannerLink = banner.image?.[0]?.link || banner.link;
                                    return (
                                        <div
                                            key={banner._id}
                                            className="h-100 cursor-pointer"
                                            onClick={() => {
                                                if (bannerLink) {
                                                    handleLinkNavigation(bannerLink);
                                                } else {
                                                    navigate("/shade-finder");
                                                }
                                            }}
                                        >
                                            {bannerImage && (
                                                <img
                                                    src={bannerImage}
                                                    alt={banner.title}
                                                    className="img-fluid"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                )}

                {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
                {findsForYou?.map((section) => (
                    <section key={section._id} className="mb-lg-5 mb-4 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                                {section.title}
                            </h3>
                            {section.products?.length > 4 && (
                                <button
                                    className="btn btn-link text-decoration-none text-dark page-title-main-name"
                                    onClick={() => navigate(`/section/${section._id}`)}
                                >
                                    View All
                                </button>
                            )}
                        </div>

                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 4, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {section.products?.map((prod) => (
                                <SwiperSlide key={prod._id} className="page-title-main-name">
                                    {renderProductCard(prod)}
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                ))}

                {/* Virtual Try On Banner Section */}
                {featureBanners?.filter((b) => b.type === "virtualTryOn").length > 0 && (
                    <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
                        <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            Virtual Try On
                        </h3>

                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{
                                clickable: true,
                                bulletClass: 'custom-swiper-bullet',
                                bulletActiveClass: 'custom-swiper-bullet-active',
                            }}
                            navigation={true}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 10 },
                                480: { slidesPerView: 1, spaceBetween: 15 },
                                576: { slidesPerView: 1, spaceBetween: 15 },
                                768: { slidesPerView: 1, spaceBetween: 20 },
                                992: { slidesPerView: 1, spaceBetween: 20 },
                                1200: { slidesPerView: 1, spaceBetween: 25 },
                                1400: { slidesPerView: 1, spaceBetween: 30 },
                            }}
                            className="virtual-tryon-swiper"
                        >
                            {featureBanners
                                .filter((banner) => banner.type === "virtualTryOn")
                                .map((banner) => {
                                    const bannerImage = banner.image?.[0]?.url || banner.image;
                                    const bannerLink = banner.image?.[0]?.link || banner.link;
                                    return (
                                        <SwiperSlide key={banner._id}>
                                            <div
                                                className="card border-0 shadow-sm h-100 cursor-pointer mt-lg-3 mt-0"
                                                onClick={() => {
                                                    if (bannerLink) {
                                                        handleLinkNavigation(bannerLink);
                                                    } else {
                                                        navigate("/virtual-try-on");
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {bannerImage && (
                                                    <img
                                                        src={bannerImage}
                                                        alt={banner.title}
                                                        className="img-fluid w-100"
                                                        style={{
                                                            height: "auto",
                                                            borderRadius: '12px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                        </Swiper>
                    </section>
                )}

                {/* shopByIngredients - FIXED NAVIGATION */}
                {shopByIngredients?.length > 0 && (
                    <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-0 mt-3">
                                {shopByIngredientsTitle || "Shop by Ingredients"}
                            </h3>
                        </div>

                        <SectionSlider
                            slidesPerView={6}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 12 },
                                576: { slidesPerView: 3, spaceBetween: 12 },
                                768: { slidesPerView: 4, spaceBetween: 12 },
                                1024: { slidesPerView: 4, spaceBetween: 10 },
                                1280: { slidesPerView: 4, spaceBetween: 10 },
                            }}
                        >
                            {shopByIngredients.map((ing) => {
                                if (!ing || !ing.slug) {
                                    return null;
                                }

                                return (
                                    <SwiperSlide key={ing._id || ing.slug}>
                                        <div
                                            className="text-center cursor-pointer ingredient-card mt-3 p-0 "
                                            onClick={() => {
                                                if (!ing.slug) return;
                                                navigate(`/products?ingredients=${encodeURIComponent(ing.slug)}`);
                                            }}
                                            style={{
                                                padding: "12px",
                                                borderRadius: "12px",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            {ing.image && (
                                                <img
                                                    src={ing.image}
                                                    alt={ing.name}
                                                    className="img-fluid"
                                                    style={{
                                                        width: "100%",
                                                        aspectRatio: "1 / 1",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.png";
                                                    }}
                                                />
                                            )}
                                            <p className="mt-2 mb-0 small fw-medium page-title-main-name text-start ms-1">
                                                {ing.name || "Unknown"}
                                            </p>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </SectionSlider>
                    </section>
                )}

                {/* In Focus Section - Slider */}
                {inFocus?.length > 0 && (
                    <section className="in-focus-section padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {inFocusTitle || "In Focus"}
                            </h3>
                        </div>

                        <div className="in-focus-wrapper">
                            {inFocus.map((product) => (
                                <div key={product._id} className="in-focus-card">
                                    <div className="in-focus-row">
                                        <div className="in-focus-image-col">
                                            <div className="in-focus-image-container">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="in-focus-image"
                                                    onClick={() => navigate(`/product/${product.slug}`)}
                                                />
                                            </div>
                                        </div>

                                        <div className="in-focus-content-col">
                                            <div className="in-focus-content">
                                                <span className="in-focus-subtitle">IN FOCUS</span>
                                                <h4 className="in-focus-title">
                                                    {product.brandName && (
                                                        <span className="brand-highlight">{product.brandName}</span>
                                                    )}
                                                    {product.brandName && product.name && " : "}
                                                    {product.name && (
                                                        <span className="product-name-highlight">{product.name}</span>
                                                    )}
                                                </h4>
                                                <button
                                                    onClick={() => navigate(`/product/${product.slug}`)}
                                                    className="in-focus-btn"
                                                >
                                                    Shop Now <span className="arrow">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}


                {/* Top Brands - Slider */}
                {brands?.length > 0 && (
                    <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {brandsTitle || "Top Brands"}
                            </h3>
                        </div>
                        <SectionSlider slidesPerView={8} spaceBetween={15}>
                            {brands.map((brand) => (
                                <SwiperSlide key={brand._id}>
                                    <div
                                        className="text-center cursor-pointer"
                                        onClick={() => navigate(`/brand/${brand.slug}`)}
                                    >
                                        {brand.thumbnailImage && (
                                            <img
                                                className="img-fluid"
                                                src={brand.thumbnailImage}
                                                alt={brand.name}
                                            />
                                        )}
                                        <div className="mt-2 text-start fs-6 page-title-main-name">
                                            {brand.name}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* Skin Types - Slider - FIXED NAVIGATION */}
                {skinTypes?.length > 0 && (
                    <section className="mb-5 padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {skinTypesTitle || "Shop by Skin Type"}
                            </h3>
                        </div>

                        <SectionSlider
                            slidesPerView={3}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 10 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 15 },
                                1280: { slidesPerView: 4, spaceBetween: 15 },
                            }}
                        >
                            {skinTypes.map((st) => {
                                if (!st || !st.slug) {
                                    return null;
                                }

                                return (
                                    <SwiperSlide key={st._id || st.slug}>
                                        <div
                                            className="text-center cursor-pointer ingredient-card"
                                            onClick={() => {
                                                if (!st.slug) return;
                                                navigate(`/products?skinTypes=${encodeURIComponent(st.slug)}`);
                                            }}
                                            style={{
                                                padding: "12px",
                                                borderRadius: "12px",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            {st.image && (
                                                <img
                                                    src={st.image}
                                                    alt={st.name}
                                                    className="img-fluid rounded"
                                                    style={{
                                                        width: "100%",
                                                        aspectRatio: "1 / 1",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.png";
                                                    }}
                                                />
                                            )}
                                            {/* <p className="mt-2 mb-0 small fw-medium page-title-main-name text-center">
                        {st.name || "Unknown"}
                      </p> */}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </SectionSlider>
                    </section>
                )}

                {/* Top Sellers - Slider */}
                {topSellers?.length > 0 && (
                    <section className="mb-lg-5 mb-3 page-title-main-name padding-left-right-sub-category">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                                {topSellersTitle || "Top Sellers"}
                            </h3>
                        </div>

                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            autoplay={5}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 4, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {topSellers.map((prod) => (
                                <SwiperSlide key={prod._id}>
                                    {renderProductCard(prod)}
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}
            </div>
            <Certificate />

            {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
            {showVariantOverlay && (() => {
                // Search in topSellers
                let item = topSellers?.find(p => p._id === showVariantOverlay);

                // Search in findsForYou sections
                if (!item && findsForYou) {
                    for (const section of findsForYou) {
                        item = section.products?.find(p => p._id === showVariantOverlay);
                        if (item) break;
                    }
                }

                // Search in inFocus
                if (!item && inFocus) {
                    item = inFocus.find(p => p._id === showVariantOverlay);
                }

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










