import React, { useEffect, useState, useCallback, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../styles/BestSellers.css";
import "../../../App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import bagIcon from "../../../assets/bag.svg";
import tick from "../../../assets/tick.svg";
import { FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import { UserContext } from "../../../context/UserContext";

const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";
const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// Helper functions
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

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [tempSelectedVariants, setTempSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});

    // ===================== WISHLIST STATES =====================
    const [wishlistLoading, setWishlistLoading] = useState({});
    const [wishlistData, setWishlistData] = useState([]);
    // ===================== END WISHLIST STATES =====================

    // ===================== OUT OF STOCK POPUP STATE =====================
    const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
    const [outOfStockProductName, setOutOfStockProductName] = useState("");
    // ===================== END OUT OF STOCK POPUP STATE =====================

    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("color");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

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
    // ===================== END OUT OF STOCK POPUP HANDLER =====================

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

    useEffect(() => {
        fetchWishlistData();
    }, [user]);

    // ===================== HELPER FUNCTIONS =====================

    const getProductSlug = useCallback((product) => {
        if (!product) return null;
        if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
            return product.slugs[0];
        }
        if (product.slug) return product.slug;
        return product._id;
    }, []);

    const getBrandName = useCallback((product) => {
        if (!product?.brand) return "Unknown Brand";
        if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
        if (typeof product.brand === "string") return product.brand;
        return "Unknown Brand";
    }, []);

    const getVariantName = useCallback((variant) => {
        if (!variant) return "Default";
        const nameSources = [
            variant.shadeName,
            variant.name,
            variant.variantName,
            variant.size,
            variant.ml,
            variant.weight
        ];
        for (const source of nameSources) {
            if (source && typeof source === 'string') {
                return source;
            }
        }
        return "Default";
    }, []);

    const getVariantType = useCallback((variant) => {
        if (!variant) return 'default';
        if (variant.hex && isValidHexColor(variant.hex)) return 'color';
        if (variant.shadeName) return 'shade';
        if (variant.size) return 'size';
        if (variant.ml) return 'ml';
        if (variant.weight) return 'weight';
        return 'default';
    }, []);

    const getProductDisplayData = useCallback((product) => {
        if (!product) return null;

        const allVariants = Array.isArray(product.variants) ? product.variants :
            Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

        const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
        const defaultVariant = allVariants[0] || {};

        const storedVariant = selectedVariants[product._id];

        let selectedVariant = storedVariant ||
            (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

        if (storedVariant) {
            const storedStock = parseInt(storedVariant.stock || 0);
            if (storedStock <= 0 && availableVariants.length > 0) {
                selectedVariant = availableVariants[0];
            }
        }

        let image = "";
        const getVariantImage = (variant) => {
            return variant?.images?.[0] || variant?.image;
        };

        image = getVariantImage(selectedVariant) ||
            getVariantImage(availableVariants[0]) ||
            getVariantImage(defaultVariant) ||
            product.image ||
            product.displayImage ||
            "";

        const displayPrice = parseFloat(
            selectedVariant.displayPrice ||
            selectedVariant.discountedPrice ||
            selectedVariant.price ||
            product.price ||
            0
        );

        const originalPrice = parseFloat(
            selectedVariant.originalPrice ||
            selectedVariant.mrp ||
            product.mrp ||
            displayPrice
        );

        const discountAmount = parseFloat(
            selectedVariant.discountAmount ||
            product.discountAmount ||
            0
        );

        let discountPercent = parseFloat(
            selectedVariant.discountPercent ||
            product.discountPercent ||
            0
        );

        if (!discountPercent && originalPrice > displayPrice) {
            discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
        }

        const variantName = getVariantName(selectedVariant);
        const variantType = getVariantType(selectedVariant);
        const variantDisplayText = getVariantDisplayText(selectedVariant);

        const stock = parseInt(selectedVariant.stock || product.stock || 0);
        const status = stock > 0 ? "inStock" : "outOfStock";
        const sku = selectedVariant.sku || product.sku || "";
        const sales = parseInt(selectedVariant.sales || product.sales || 0);

        const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
        const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

        const brandName = getBrandName(product);
        const hexColor = selectedVariant.hex || product.hex || "#000000";
        const productSlug = getProductSlug(product);

        return {
            ...product,
            _id: product._id || "",
            name: product.name || "Unnamed Product",
            brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
            slug: productSlug,
            variant: {
                ...selectedVariant,
                variantName,
                variantDisplayText,
                displayPrice,
                originalPrice,
                discountPercent,
                discountAmount,
                stock,
                status,
                sku,
                sales,
                promoApplied,
                promoMessage,
                hex: hexColor,
                variantType,
                _id: selectedVariant._id || ""
            },
            image,
            brandId: product.brand,
            description: product.description || "",
            avgRating: parseFloat(product.avgRating || 0),
            totalRatings: parseInt(product.totalRatings || 0),
            allVariants: [...allVariants].filter(v => v),
            variants: allVariants,
            // Check if ALL variants are out of stock
            isCompletelyOutOfStock: allVariants.length > 0 && availableVariants.length === 0
        };
    }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

    // ===================== VARIANT HANDLING =====================
    const handleVariantSelect = useCallback((productId, variant) => {
        if (!productId || !variant) return;

        setSelectedVariants(prev => ({
            ...prev,
            [productId]: variant
        }));

        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product._id === productId) {
                    const stock = parseInt(variant.stock || 0);
                    const displayPrice = parseFloat(
                        variant.displayPrice ||
                        variant.discountedPrice ||
                        variant.price ||
                        product.price ||
                        0
                    );

                    const originalPrice = parseFloat(
                        variant.originalPrice ||
                        variant.mrp ||
                        product.mrp ||
                        displayPrice
                    );

                    let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
                    if (!discountPercent && originalPrice > displayPrice) {
                        discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
                    }

                    const variantName = getVariantName(variant);
                    const variantType = getVariantType(variant);
                    const variantDisplayText = getVariantDisplayText(variant);
                    const hexColor = variant.hex || product.hex || "#000000";

                    return {
                        ...product,
                        variant: {
                            ...variant,
                            variantName,
                            variantDisplayText,
                            displayPrice,
                            originalPrice,
                            discountPercent,
                            stock,
                            status: stock > 0 ? "inStock" : "outOfStock",
                            sku: variant.sku || "",
                            hex: hexColor,
                            variantType,
                            _id: variant._id || variant.sku || `variant-${Date.now()}`
                        },
                        image: variant.images?.[0] || variant.image || product.image
                    };
                }
                return product;
            })
        );
    }, [getVariantName, getVariantType]);

    const openVariantOverlay = (productId, variantType = "all", e) => {
        if (e) e.stopPropagation();
        setSelectedVariantType(variantType);
        setShowVariantOverlay(productId);
    };

    const closeVariantOverlay = () => {
        setShowVariantOverlay(null);
        setSelectedVariantType("all");
        setTempSelectedVariants({});
    };

    const handleProductClick = useCallback((product) => {
        if (!product) return;
        const slug = product.slugs?.[0] || product.slug || product._id;
        if (slug) {
            navigate(`/product/${slug}`);
        }
    }, [navigate]);

    // ===================== ADD TO CART ====================
    const handleAddToCart = async (prod, forceVariant = null) => {
        setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
        try {
            const variants = Array.isArray(prod.variants) ? prod.variants : [];
            const hasVariants = variants.length > 0;
            let payload;

            if (hasVariants) {
                const selectedVariant = forceVariant || selectedVariants[prod._id] || (variants.find((v) => v.stock > 0) || variants[0]);
                if (!selectedVariant || selectedVariant.stock <= 0) {
                    showToastMsg("Please select an in-stock variant.", "error");
                    return;
                }

                payload = {
                    productId: prod._id,
                    variants: [
                        {
                            variantSku: getSku(selectedVariant),
                            quantity: 1,
                        },
                    ],
                };

                const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
                cache[prod._id] = selectedVariant;
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            } else {
                if (prod.stock <= 0) {
                    showToastMsg("Product is out of stock.", "error");
                    return;
                }

                payload = {
                    productId: prod._id,
                    quantity: 1,
                };

                const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
                delete cache[prod._id];
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            }

            const response = await axios.post(
                `${CART_API_BASE}/add`,
                payload,
                { withCredentials: true }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to add to cart");
            }

            showToastMsg("Product added to cart!", "success");
            navigate("/cartpage");
        } catch (err) {
            console.error("Add to Cart error:", err);
            const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
            showToastMsg(msg, "error");

            if (err.response?.status === 401) {
                navigate("/login", { state: { from: location.pathname } });
            }
        } finally {
            setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
        }
    };

    const formatPrice = useCallback((price) => {
        const numPrice = parseFloat(price || 0);
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(numPrice);
    }, []);

    // ===================== PRODUCT LOADING =====================
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(API_LIST, { withCredentials: true });
            const json = res.data;

            let data = [];

            if (Array.isArray(json)) {
                data = json.map((product, index) => {
                    const displayData = getProductDisplayData(product);
                    if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
                    return null;
                }).filter(Boolean);
            } else if (Array.isArray(json?.products)) {
                data = json.products.map((product, index) => {
                    const displayData = getProductDisplayData(product);
                    if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
                    return null;
                }).filter(Boolean);
            } else if (json?.data && Array.isArray(json.data)) {
                data = json.data.map((product, index) => {
                    const displayData = getProductDisplayData(product);
                    if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
                    return null;
                }).filter(Boolean);
            }

            setProducts(data);
        } catch (err) {
            console.error("❌ Error fetching best sellers:", err);
            setError("Couldn't load best sellers. Please try again later.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ===================== RENDER =====================
    return (
        <div className="container-fluid my-4 position-relative margin-left-rights pb-0 mb-0">
            {/* <ToastContainer position="top-right" autoClose={3000} /> */}

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
                            {/* {outOfStockProductName} is currently out of stock. Please check back later or browse similar products. */}
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
            {/* ===================== END OUT OF STOCK POPUP ===================== */}

            <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 best-seller-headings spacing fw-normal">
                Best Sellers
            </h2>

            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2 page-title-main-name text-black fs-4">Loading best sellers...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
                        Retry
                    </button>
                </div>
            )}

            {products.length > 0 ? (
                <div className="mobile-responsive-code position-relative">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        breakpoints={{
                            300: { slidesPerView: 2, spaceBetween: 10 },
                            576: { slidesPerView: 2.5, spaceBetween: 15 },
                            768: { slidesPerView: 3, spaceBetween: 15 },
                            992: { slidesPerView: 4, spaceBetween: 20 },
                            1200: { slidesPerView: 4, spaceBetween: 25 },
                        }}
                        className="foryou-swiper pb-0 mb-0"
                    >
                        {products.map((item) => {
                            if (!item) return null;

                            const allVariants = item.allVariants || [];
                            const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || item.variant || {};

                            let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

                            if (item.image) {
                                imageUrl = item.image.startsWith("http")
                                    ? item.image
                                    : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
                            }

                            // Check variant details
                            const hasVariants = allVariants.length > 0;

                            // Check wishlist status for current variant
                            const selectedSku = getSku(displayVariant);
                            const isProductInWishlist = isInWishlist(item._id, selectedSku);

                            // Group all variants for overlay
                            const groupedVariants = groupVariantsByType(allVariants);
                            const totalVariants = allVariants.length;

                            // Check if a variant is explicitly selected
                            const isVariantSelected = !!selectedVariants[item._id];

                            // Check if product is completely out of stock (all variants OOS)
                            const isCompletelyOutOfStock = item.isCompletelyOutOfStock || false;

                            // Check if current selected variant is out of stock
                            const isCurrentVariantOutOfStock = displayVariant.stock <= 0;

                            // Button state logic
                            const isAdding = addingToCart[item._id];

                            // Determine if we should show out of stock state
                            const showOutOfStock = isCompletelyOutOfStock && !hasVariants;

                            const showSelectVariantButton = hasVariants && allVariants.length > 1;

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

                            return (
                                <SwiperSlide key={item.uniqueId}>
                                    <div className="foryou-card-wrapper">
                                        <div className="foryou-card">
                                            {/* Product Image with Overlays */}
                                            <div
                                                className="foryou-img-wrapper"
                                                onClick={() => {
                                                    if (showOutOfStock) {
                                                        handleOutOfStockClick(item.name);
                                                    } else {
                                                        handleProductClick(item);
                                                    }
                                                }}
                                                style={{ cursor: showOutOfStock ? 'pointer' : 'pointer', position: 'relative' }}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={item.name || "Product"}
                                                    className="foryou-img img-fluid"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
                                                    }}
                                                    style={{
                                                        opacity: showOutOfStock ? 0.6 : 1,
                                                        filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
                                                    }}
                                                />

                                                {item?.supportsVTO && (
                                                    <div
                                                        className="support-beauty-badge"
                                                        title="Try It On"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProductClick(item);
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
                                                    <button className="bg-transparent"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (displayVariant) {
                                                                toggleWishlist(item, displayVariant);
                                                            }
                                                        }}
                                                        disabled={wishlistLoading[item._id]}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
                                                            color: isProductInWishlist ? '#dc3545' : '#ccc',
                                                            fontSize: '22px',
                                                            zIndex: 2,
                                                            backgroundColor: 'transparent !important',
                                                            borderRadius: '50%',
                                                            width: '34px',
                                                            height: '34px',
                                                            minHeight: '34px',
                                                            maxHeight: '34px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.3s ease',
                                                            border: 'none',
                                                            outline: 'none'
                                                        }}
                                                        title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                                    >
                                                        {wishlistLoading[item._id] ? (
                                                            <div className="spinner-border spinner-border-sm" role="status"></div>
                                                        ) : isProductInWishlist ? (
                                                            <FaHeart />
                                                        ) : (
                                                            <FaRegHeart />
                                                        )}
                                                    </button>
                                                )}

                                                {/* Promo Badge */}
                                                {/* {variant.promoApplied && !showOutOfStock && (
                                                    <div className="promo-badge">
                                                        <i className="bi bi-tag-fill me-1"></i>
                                                        Promo
                                                    </div>
                                                )} */}
                                            </div>

                                            {/* Product Info */}
                                            <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
                                                <div className="justify-content-between d-flex flex-column"
                                                    style={{ height: '200px' }}>

                                                    {/* Brand Name */}
                                                    <div className="brand-name small text-muted text-start mb-1 mt-2">
                                                        {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
                                                    </div>

                                                    {/* Product Name */}
                                                    <h6
                                                        className="foryou-name font-family-Poppins m-0 p-0"
                                                        onClick={() => {
                                                            if (showOutOfStock) {
                                                                handleOutOfStockClick(item.name);
                                                            } else {
                                                                handleProductClick(item);
                                                            }
                                                        }}
                                                        style={{
                                                            cursor: 'pointer',
                                                            opacity: showOutOfStock ? 0.6 : 1,
                                                        }}
                                                    >
                                                        {(() => {
                                                            const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                                                            const nameStr = item.name || "Unnamed Product";
                                                            return varText && varText.toUpperCase() !== "DEFAULT" ? `${nameStr} - ${varText}` : nameStr;
                                                        })()}
                                                    </h6>



                                                    {/* Show out of stock message in variant area */}
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
                                                                {formatPrice(displayVariant.displayPrice)}
                                                            </span>

                                                            {displayVariant.originalPrice > displayVariant.displayPrice && !showOutOfStock && (
                                                                <>
                                                                    <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                                                        {formatPrice(displayVariant.originalPrice)}
                                                                    </span>
                                                                    <span className="discount-percent fw-bold ms-2">
                                                                        ({displayVariant.discountPercent || 0}% OFF)
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

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
                                                                        handleOutOfStockClick(item.name);
                                                                    } else if (showSelectVariantButton) {
                                                                        openVariantOverlay(item._id, "all", e);
                                                                    } else {
                                                                        handleAddToCart(item);
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
                                        {showVariantOverlay === item._id && !showOutOfStock && (
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
                                                                    const isSelected = displayVariant.sku === v.sku;
                                                                    const isOutOfStock = (v.stock ?? 0) <= 0;

                                                                    return (
                                                                        <div
                                                                            key={getSku(v) || v._id}
                                                                            style={{ cursor: isOutOfStock ? "not-allowed" : "pointer", position: "relative" }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (!isOutOfStock) {
                                                                                    handleVariantSelect(item._id, v);
                                                                                    setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
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
                                                                                    handleVariantSelect(item._id, v);
                                                                                    setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
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
                                                                onClick={(e) => { e.stopPropagation(); handleProductClick(item); }}
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
                                                                const chosen = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                                                                if (chosen) {
                                                                    handleVariantSelect(item._id, chosen);
                                                                }
                                                                await handleAddToCart(item, chosen);
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
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            ) : !loading && !error && (
                <div className="text-center py-5">
                    <i className="bi bi-box-seam display-4 text-muted"></i>
                    <p className="text-muted mt-3">No products available at the moment.</p>
                    <button className="btn btn-primary mt-2" onClick={fetchProducts}>
                        Refresh
                    </button>
                </div>
            )}

            {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
            {showVariantOverlay && (() => {
                const item = products.find(p => p._id === showVariantOverlay);
                if (!item) return null;

                const allVariants = item.allVariants || [];
                const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || item.variant || {};
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
                                            {formatPrice(displayVariant.displayPrice)}
                                        </span>
                                        {displayVariant.originalPrice > displayVariant.displayPrice && (
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
        </div>
    );
};

export default BestSellers;



//===============================================================================================(Done-Code(End))====================================================== 




