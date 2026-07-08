import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { UserContext } from "../context/UserContext.jsx";
import Bag from "../assets/Bag.svg";
import "../styles/OfferLanding.css";
import "../styles/BestSellers.css";
import { ToastContainer, toast } from "react-toastify";

// Import Swiper and its styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Certificate from "../components/sections/home/Certificate.jsx";

const API_BASE = "https://beauty.joyory.com/api/user";
const CART_API_BASE = `${API_BASE}/cart`;
const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

/* ---------- helpers ---------- */
const formatPrice = (price) => "₹" + parseFloat(price || 0).toLocaleString("en-IN");
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
    if (!hex || typeof hex !== "string") return false;
    const n = hex.trim().toLowerCase();
    return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(n);
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

// Custom Section Slider Component
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
        768: { slidesPerView: Math.min(slidesPerView, 4), spaceBetween: 20 },
    };

    const baseBreakpoints = { ...defaultBreakpoints, ...breakpoints };
    const finalBreakpoints = {};

    Object.keys(baseBreakpoints).forEach((key) => {
        const width = parseInt(key, 10);
        const bp = baseBreakpoints[key];
        if (width >= 992) {
            finalBreakpoints[key] = {
                ...bp,
                slidesPerView: slidesPerView,
            };
        } else {
            finalBreakpoints[key] = {
                ...bp,
                slidesPerView: Math.min(bp.slidesPerView, slidesPerView),
            };
        }
    });

    return (
        <div className="position-relative margintop-sss py-2">
            <button
                onClick={() => swiperRef.current?.swiper?.slidePrev()}
                className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
                style={{
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #dee2e6",
                }}
            >
                <FaChevronLeft size={16} />
            </button>

            <button
                onClick={() => swiperRef.current?.swiper?.slideNext()}
                className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
                style={{
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #dee2e6",
                }}
            >
                <FaChevronRight size={16} />
            </button>

            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={spaceBetween}
                breakpoints={finalBreakpoints}
                navigation={false}
                className="section-slider px-1"
            >
                {children}
            </Swiper>
        </div>
    );
};

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

export default function OffersPage() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // State
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Wishlist state
    const [wishlistData, setWishlistData] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState({});

    // Cart & variant selection
    const [selectedVariants, setSelectedVariants] = useState({});
    const [tempSelectedVariants, setTempSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("all");
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

    /* ---------- Toast ---------- */
    const showToastMsg = (message, type = "error", duration = 3000) => {
        if (type === "success") {
            toast.success(message, { autoClose: duration });
        } else if (type === "error") {
            toast.error(message, { autoClose: duration });
        } else {
            toast.info(message, { autoClose: duration });
        }
    };


    /* ========== FETCH OFFERS DATA ========== */
    useEffect(() => {
        const fetchOffersData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_BASE}/promotions/offers-page`);
                setData(data);
            } catch (err) {
                console.error("Failed to load offers page:", err);
                setError(err.response?.data?.message || "Failed to load offers page");
            } finally {
                setLoading(false);
            }
        };
        fetchOffersData();
    }, []);

    /* ========== WISHLIST LOGIC ========== */
    const isInWishlist = (pid, sku) =>
        wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);

    const fetchWishlistData = async () => {
        try {
            if (user && !user.guest) {
                const { data } = await axios.get(WISHLIST_API_BASE, { withCredentials: true });
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
        if (!prod || !variant) return showToastMsg("Select a variant first", "error");
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
                await axios.delete(`${WISHLIST_API_BASE}/${pid}`, { withCredentials: true, data: { sku } });
                showToastMsg("Removed from wishlist!", "success");
            } else {
                await axios.post(`${WISHLIST_API_BASE}/${pid}`, { sku }, { withCredentials: true });
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

            const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
            if (!data.success) throw new Error(data.message || "Cart add failed");

            showToastMsg("Product added to cart!", "success");
            navigate("/cartpage");
        } catch (e) {
            showToastMsg(e.response?.data?.message || e.message || "Failed to add to cart", "error");
            if (e.response?.status === 401) navigate("/login");
        } finally {
            setAddingToCart((p) => ({ ...p, [prod._id]: false }));
        }
    };

    const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
    const openVariantOverlay = (pid, t = "all") => {
        setSelectedVariantType(t);
        setShowVariantOverlay(pid);
    };
    const closeVariantOverlay = () => {
        setShowVariantOverlay(null);
        setSelectedVariantType("all");
        setTempSelectedVariants({});
    };
    const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

    /* ========== LINK NAVIGATION HANDLER ========== */
    const handleLinkNavigation = (link) => {
        if (!link) return;
        try {
            const currentHost = window.location.host;
            const linkUrl = new URL(link, window.location.origin);
            if (linkUrl.host === currentHost) {
                navigate(linkUrl.pathname + linkUrl.search + linkUrl.hash);
            } else {
                window.location.href = link;
            }
        } catch (e) {
            navigate(link);
        }
    };

    /* ========== RENDER PRODUCT CARD - SAME AS CATEGORYLANDINGPAGE ========== */
    const renderProductCard = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        const hasVar = vars.length > 0;
        const displayVariant =
            tempSelectedVariants[prod._id] ||
            selectedVariants[prod._id] ||
            (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);
        const imageUrl = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";

        const hasVariants = vars.length > 0;
        const sku = displayVariant ? getSku(displayVariant) : null;
        const isProductInWishlist = sku ? isInWishlist(prod._id, sku) : false;

        const groupedVariants = groupVariantsByType(vars);
        const totalVariants = vars.length;
        const isVariantSelected = !!selectedVariants[prod._id];
        const isCompletelyOos = isCompletelyOutOfStock(prod);
        const isCurrentVariantOutOfStock = displayVariant ? displayVariant.stock <= 0 : prod.stock <= 0;

        const isAdding = addingToCart[prod._id];
        const showOutOfStock = isCompletelyOos && !hasVar;
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

        const slugPr = getProductSlug(prod);

        return (
            <div key={prod._id} className="foryou-card-wrapper">
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
                            src={imageUrl}
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
                                className={`product-card-wishlist-btn ${isProductInWishlist ? 'in-wishlist' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (displayVariant || !hasVar) {
                                        toggleWishlist(prod, displayVariant || {});
                                    }
                                }}
                                disabled={wishlistLoading[prod._id]}
                                title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                {wishlistLoading[prod._id] ? (
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                ) : isProductInWishlist ? (
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
                                    const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                                    const nameStr = prod.name || "Unnamed Product";
                                    return varText && varText.toUpperCase() !== "DEFAULT" ? `${nameStr} - ${varText}` : nameStr;
                                })()}
                            </h6></div>{/* Show out of stock message in variant area */}
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
                                    <span
                                        className="current-price fw-400 fs-5"
                                        style={{
                                            textDecoration: showOutOfStock ? 'line-through' : 'none',
                                            opacity: showOutOfStock ? 0.6 : 1,
                                        }}
                                    >
                                        {formatPrice(displayVariant ? displayVariant.displayPrice || displayVariant.discountedPrice || prod.price : prod.price)}
                                    </span>

                                    {displayVariant && displayVariant.originalPrice > (displayVariant.displayPrice || displayVariant.discountedPrice) && !showOutOfStock && (
                                        <>
                                            <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                                {formatPrice(displayVariant.originalPrice)}
                                            </span>
                                            <span className="discount-percent text-danger fw-bold ms-2">
                                                ({displayVariant.discountPercent || Math.round(((displayVariant.originalPrice - (displayVariant.displayPrice || displayVariant.discountedPrice)) / displayVariant.originalPrice) * 100)}% OFF)
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
                                        className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2  ${showOutOfStock
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
                                {groupedVariants.color.length > 0 && (
                                    <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                                        {groupedVariants.color.map((v) => {
                                            const isSelected = displayVariant?.sku === v.sku;
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

                                {groupedVariants.text.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                                        {groupedVariants.text.map((v) => {
                                            const isSelected = displayVariant?.sku === v.sku;
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
                                    Selected: <span className="text-dark fw-bold ">{displayVariant ? getVariantDisplayText(displayVariant) : "None"}</span>
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
                                    ) : (displayVariant && displayVariant.stock <= 0) ? (
                                        "Out of Stock"
                                    ) : (
                                        <>
                                            Add to Bag
                                            {!isAdding && displayVariant && displayVariant.stock > 0 && (
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
        );
    };

    // if (loading)
    //     return (
    //         <>
    //             <Header />
    //             <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
    //                 <div className="spinner-border text-dark mb-3" role="status" />
    //                 <p className="text-dark fw-medium">Loading offers...</p>
    //             </div>
    //             <Footer />
    //         </>
    //     );



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
                    <DotLottieReact className="foryoulanding-css"
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

    if (error || !data)
        return (
            <>
                <Header />
                <div className="container text-center py-5">
                    <h3 className="text-danger">Error</h3>
                    <p className="text-muted">{error || "Failed to load"}</p>
                </div>
                <Footer />
            </>
        );

    const { banner, joyBanner, brandPromotions, categoryPromotions, cantMissThis, discountRanges, offerProducts } = data;

    return (
        <>
            <Header />
            <style>{`
        .cursor-pointer { cursor: pointer; }
        .hover-lift { transition: transform 0.3s ease; }
        .ticket-card { background: #E6EEF2; }
        .ticket-card:hover { background: #E6EEF2; }
      `}</style>

            {/* 1. Main Top Banner - Now a slider with multiple images */}
            {banner?.image?.length > 0 && (
                <section className="hero-slider w-100 mt-lg-0 pt-lg-4 pt-0">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        loop
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        // pagination={{ clickable: true }}
                        pagination={{
                            clickable: true,
                            bulletClass: 'custom-swiper-bullet',
                            bulletActiveClass: 'custom-swiper-bullet-active',
                        }}
                        navigation
                        speed={800}
                        className="mt-lg-5 mt-2"
                        style={{ height: "auto", width: "100%" }}
                    >
                        {banner.image.map((bannerItem, index) => (
                            <SwiperSlide key={bannerItem._id || index} className="mt-5">
                                <div
                                    className="position-relative w-100 h-100 cursor-pointer offerces-banner-sections"
                                    style={{ cursor: bannerItem.link ? "pointer" : "default" }}
                                    onClick={() => handleLinkNavigation(bannerItem.link)}
                                >
                                    <img
                                        src={bannerItem.url}
                                        alt={banner.title || "banner"}
                                        className="w-100 img-fluid"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            )}

            <div className="container-fluid px-md-5 pt-0 mt-0 bg-white">
                {/* 2. Manual Products Mapping (Offer Products) - WITH SAME DESIGN AS CATEGORYLANDINGPAGE */}
                {offerProducts?.length > 0 &&
                    offerProducts.map((section) => (
                        <section key={section._id} className="pt-2 pb-lg-3 mb-3">
                            <h3 className="top-categories-title mb-lg-2 mb-3 p-0 ms-md-0  page-title-main-name fw-normal mt-4">
                                {section.title}
                            </h3>
                            <SectionSlider
                                slidesPerView={4}
                                spaceBetween={20}
                                breakpoints={{
                                    320: { slidesPerView: 2, spaceBetween: 10 },
                                    576: { slidesPerView: 2.5, spaceBetween: 15 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    992: { slidesPerView: 4, spaceBetween: 20 },
                                    1200: { slidesPerView: 4, spaceBetween: 20 },
                                }}
                            >
                                {section.products?.map((prod) => (
                                    <SwiperSlide key={prod._id} className="h-auto page-title-main-name">
                                        {renderProductCard(prod)}
                                    </SwiperSlide>
                                ))}
                            </SectionSlider>
                        </section>
                    ))}

                {/* 3. Brand Promotions */}
                {brandPromotions?.items?.length > 0 && (
                    <section className="page-title-main-name">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            {brandPromotions.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 15 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {brandPromotions.items.map((promo) => (
                                <SwiperSlide key={promo._id}>
                                    <div
                                        className="h-100 cursor-pointer hover-lift rounded-3 overflow-hidden"
                                        onClick={() => navigate(`/brand/${promo.targetSlug}`)}
                                    >
                                        <img
                                            src={promo.image}
                                            alt={promo.title}
                                            className="card-img-top w-100 mt-lg-3 mt-2"
                                            style={{ height: "auto", objectFit: "cover" }}
                                        />
                                        <div className="pt-3 text-center">
                                            <h6 className="card-title text-start text-truncate m-0 mb-1">
                                                {promo.title}
                                            </h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 4. Discount Ranges (Offers In Focus) */}

                {discountRanges?.items?.length > 0 && (
                    <section className="mb-lg-5 mb-4" style={{ height: "auto" }}>
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-4 mt-3">
                            {discountRanges.title}
                        </h3>

                        <SectionSlider
                            slidesPerView={3}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 2.5, spaceBetween: 12 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                992: { slidesPerView: 3, spaceBetween: 18 },
                                1200: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {discountRanges.items.map((range, index) => (
                                <SwiperSlide key={index}>
                                    <div
                                        className="mt-lg-3 mt-1 ticket-card p-4 text-center cursor-pointer hover-lift d-lg-flex flex-row justify-content-center gap-2 page-title-main-name align-items-center"
                                        style={{
                                            height: "120px",
                                            borderRadius: "0"
                                        }}

                                        onClick={() => {
                                            // Extract discount percentage from subLabel (e.g., "25% Off" -> 25)
                                            const discountPercent = parseInt(range.subLabel);
                                            if (!isNaN(discountPercent)) {
                                                // Navigate to ProductPage with discountMin parameter
                                                navigate(`/products/category/?discountMin=${discountPercent}`);
                                            } else {
                                                // Fallback navigation
                                                navigate('/products');
                                            }
                                        }}
                                    >
                                        <span
                                            className="text-black pt-lg-0 pt-3 d-block text-uppercase offer-font-weight-500"
                                            style={{ fontSize: "16px", letterSpacing: "1px" }}
                                        >
                                            {range.label}
                                        </span>
                                        <h4 className="m-0 text-black offer-font-weight-500" style={{ fontSize: "16px" }}>
                                            {range.subLabel}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 5. Category Promotions */}
                {categoryPromotions?.items?.length > 0 && (
                    <section className="mb-4 mt-lg-5">
                        <h3 className="top-categories-title mb-0 ms-lg-1 ms-1 ms-md-0 page-title-main-name fw-normal">
                            {categoryPromotions.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 15 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {categoryPromotions.items.map((promo) => (
                                <SwiperSlide key={promo._id}>
                                    <div
                                        className="h-100 cursor-pointer hover-lift overflow-hidden page-title-main-name mt-3 mb-3"
                                        // onClick={() => navigate(`products/category/${promo.slug}`)}
                                        onClick={() => navigate(`/Products/category/${promo.targetSlug}`)}
                                    >
                                        <img
                                            src={promo.image}
                                            alt={promo.title}
                                            className="card-img-top w-100"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <div className="pt-3">
                                            <p className="text-start mobile-responsive-design-text text-truncate m-0">{promo.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 6. Joy Rewards Banner */}
                {joyBanner && (
                    <div
                        className="page-title-main-name row overflow-hidden mb-lg-5 mb-3 ms-lg-0 align-items-center hover-lift cursor-pointer"
                        onClick={() => handleLinkNavigation(joyBanner.link)}
                    >
                        <div className="col-md-5 p-0">
                            <img
                                src={joyBanner.image?.[0]?.url || joyBanner.image}
                                alt={joyBanner.title}
                                className="img-fluid w-100 h-100 px-lg-0 px-3"
                                style={{ objectFit: "cover", minHeight: "250px" }}
                            />
                        </div>
                        <div className="col-md-7 p-2 mt-3 p-md-5 d-flex flex-column justify-content-center">
                            <h2 className="fw-bold mb-3 reword-heading-responsive page-title-main-name text-black">{joyBanner.title}</h2>
                            {joyBanner.description && (
                                <p
                                    className="page-title-main-name fs-6 offers-line-height"
                                    dangerouslySetInnerHTML={{ __html: joyBanner.description }}
                                />
                            )}
                            {joyBanner.buttonText && (
                                // <button className="btn btn-dark btn-lg px-5 py-2 align-self-start start-shopping-btnsa">
                                //   {joyBanner.buttonText}
                                // </button>

                                <button
                                    className="btn btn-dark btn-lg mt-lg-3 px-5 py-2 align-self-start start-shopping-btnsa"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent double trigger from parent
                                        const link = joyBanner.image?.[0]?.link || joyBanner.link;
                                        if (link) handleLinkNavigation(link);
                                    }}
                                >
                                    {joyBanner.buttonText}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 7. Can't Miss This (Pricing & Combo Deals) */}
                {/* {cantMissThis?.items?.length > 0 && (
                    <section className="mb-5">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            {cantMissThis.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={5}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {cantMissThis.items.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <div
                                        className="offersss ticket-card text-white text-center border-0 shadow-sm cursor-pointer hover-lift py-4 px-2 rounded-3 d-lg-flex flex-lg-row justify-content-center align-items-center gap-2 page-title-main-name"
                                        style={{ height: "140px" }}
                                    >
                                        <span className="text-black d-block pt-lg-0 pt-3  offersssfonts offer-font-weight-500">
                                            {item.subLabel}
                                        </span>
                                        <h4 className="m-0 text-black offersssfonts offer-font-weight-500">
                                            {item.label}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )} */}


                {cantMissThis?.items?.length > 0 && (
                    <section className="mb-5">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 mb-lg-3 mb-2 page-title-main-name fw-normal">
                            {cantMissThis.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={3}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {cantMissThis.items.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <div
                                        className="offersss ticket-card text-white text-center border-0 shadow-sm cursor-pointer hover-lift py-4 px-2 rounded-3 d-lg-flex flex-lg-row justify-content-center align-items-center gap-2 page-title-main-name"
                                        style={{ height: "140px" }}
                                        onClick={() => navigate(`/products/category/?maxPrice=${item.maxPrice}`)}
                                    >
                                        <span className="text-black d-block pt-lg-0 pt-3 offersssfonts offer-font-weight-500">
                                            {item.subLabel}
                                        </span>
                                        <h4 className="m-0 text-black offersssfonts offer-font-weight-500">
                                            {item.label}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                <Certificate />
            </div>

            {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
            {showVariantOverlay && (() => {
                const item = offerProducts?.flatMap(section => section.products || []).find(p => p._id === showVariantOverlay);
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
                                            {formatPrice(displayVariant.displayPrice || displayVariant.discountedPrice || item.price)}
                                        </span>
                                        {displayVariant.originalPrice > (displayVariant.displayPrice || displayVariant.discountedPrice) && (
                                            <>
                                                <span className="mobile-sheet-original-price">
                                                    {formatPrice(displayVariant.originalPrice)}
                                                </span>
                                                <span className="mobile-sheet-discount">
                                                    ({displayVariant.discountPercent || Math.round(((displayVariant.originalPrice - (displayVariant.displayPrice || displayVariant.discountedPrice)) / displayVariant.originalPrice) * 100)}% OFF)
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
            <OutOfStockPopup
                isOpen={showOutOfStockPopup}
                onClose={closeOutOfStockPopup}
                productName={outOfStockProductName}
            />

            <Footer />
        </>
    );
}



















