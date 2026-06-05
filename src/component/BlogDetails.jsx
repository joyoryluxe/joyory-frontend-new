import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./UserContext";
import { CartContext } from "../context/CartContext";
import bagIcon from "../assets/bag.svg";
import Header from "./Header";
import "../css/Foryou.css";
import Footer from './Footer';

const API_BASE = 'https://beauty.joyory.com/api';
const CART_API_BASE = 'https://beauty.joyory.com/api/user/cart';
const WISHLIST_CACHE_KEY = "guestWishlist";

// ===================== HELPER FUNCTIONS =====================
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

const getVariantName = (variant) => {
  if (!variant) return "Default";
  const nameSources = [variant.shadeName, variant.name, variant.variantName, variant.size, variant.ml, variant.weight];
  for (const source of nameSources) {
    if (source && typeof source === 'string') return source;
  }
  return "Default";
};

const getVariantType = (variant) => {
  if (!variant) return 'default';
  if (variant.hex && isValidHexColor(variant.hex)) return 'color';
  if (variant.shadeName) return 'shade';
  if (variant.size) return 'size';
  if (variant.ml) return 'ml';
  if (variant.weight) return 'weight';
  return 'default';
};

const getProductSlug = (product) => {
  if (!product) return null;
  if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) return product.slugs[0];
  if (product.slug) return product.slug;
  return product._id;
};

const getBrandName = (product) => {
  if (!product?.brand) return "Unknown Brand";
  if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
  if (typeof product.brand === "string") return product.brand;
  return "Unknown Brand";
};

const formatPrice = (price) => {
  const numPrice = parseFloat(price || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numPrice);
};

// ===================== BLOG DETAIL COMPONENT =====================
const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product states
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // New state for Related Articles "Read More"
  const [showAllArticles, setShowAllArticles] = useState(false);

  // ===================== PRODUCT HELPERS =====================
  const getProductDisplayData = useCallback((product) => {
    if (!product) return null;
    // ... (your existing getProductDisplayData logic remains the same)
    const allVariants = Array.isArray(product.variants) ? product.variants : Array.isArray(product.shadeOptions) ? product.shadeOptions : [];
    const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);
    const defaultVariant = allVariants[0] || {};
    const storedVariant = selectedVariants[product._id];
    let selectedVariant = storedVariant || product.selectedVariant || (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

    if (storedVariant) {
      const storedStock = parseInt(storedVariant.stock || 0);
      if (storedStock <= 0 && availableVariants.length > 0) selectedVariant = availableVariants[0];
    }

    let image = "";
    const getVariantImage = (variant) => variant?.images?.[0] || variant?.image;
    image = getVariantImage(selectedVariant) || getVariantImage(availableVariants[0]) || getVariantImage(defaultVariant) || product.image || "";

    const displayPrice = parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || product.price || 0);
    const originalPrice = parseFloat(selectedVariant.originalPrice || selectedVariant.mrp || product.mrp || displayPrice);
    let discountPercent = parseFloat(selectedVariant.discountPercent || product.discountPercent || 0);
    if (!discountPercent && originalPrice > displayPrice) {
      discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    }

    return {
      ...product,
      _id: product._id || "",
      name: product.name || "Unnamed Product",
      brandName: getBrandName(product),
      slug: getProductSlug(product),
      variant: { ...selectedVariant, variantName: getVariantName(selectedVariant), variantDisplayText: getVariantDisplayText(selectedVariant), displayPrice, originalPrice, discountPercent, stock: parseInt(selectedVariant.stock || product.stock || 0), status: parseInt(selectedVariant.stock || product.stock || 0) > 0 ? "inStock" : "outOfStock", sku: selectedVariant.sku || product.sku || "" },
      image,
      allVariants: allVariants.filter(v => v),
      variants: allVariants
    };
  }, [selectedVariants]);

  // Wishlist functions (kept as is)
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item => (item.productId === productId || item._id === productId) && item.sku === sku);
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
        if (response.data.success) setWishlistData(response.data.wishlist || []);
      } else {
        const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        setWishlistData(localWishlist.map(item => ({ productId: item._id, _id: item._id, sku: item.sku, ...item })));
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };

  const toggleWishlist = async (prod, variant) => {
    if (!prod || !variant) return toast.warn("Please select a variant first");
    // Your full toggleWishlist logic (kept from your code)
    const productId = prod._id;
    const sku = getSku(variant);
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    try {
      const currentlyInWishlist = isInWishlist(productId, sku);
      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { withCredentials: true, data: { sku } });
          toast.success("Removed from wishlist!");
        } else {
          await axios.post(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { sku }, { withCredentials: true });
          toast.success("Added to wishlist!");
        }
        await fetchWishlistData();
      } else {
        // Guest logic (same as before)
        let guestWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        if (currentlyInWishlist) {
          guestWishlist = guestWishlist.filter(item => !(item._id === productId && item.sku === sku));
          toast.success("Removed from wishlist!");
        } else {
          guestWishlist.push({ _id: productId, ...prod, sku, variantName: variant.shadeName || "Default" });
          toast.success("Added to wishlist!");
        }
        localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
        await fetchWishlistData();
      }
    } catch (error) {
      toast.error("Wishlist update failed");
    } finally {
      setWishlistLoading(prev => ({ ...prev, [prod._id]: false }));
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const handleVariantSelect = useCallback((productId, variant) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
  }, []);

  const openVariantOverlay = (productId) => {
    setSelectedVariantType("all");
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => setShowVariantOverlay(null);

  const handleAddToCart = async (prod) => {
    // Your existing handleAddToCart logic
    setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
    try {
      const payload = { productId: prod._id, quantity: 1 };
      const response = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
      if (response.data.success) {
        toast.success("Product added to cart!");
        navigate("/cartpage");
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl === '') {
      return 'https://placehold.co/400x300/ffffff/cccccc?text=Product';
    }
    return imageUrl;
  };

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
        if (!res.ok) throw new Error('Blog not found');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!blog?.relatedProducts) return [];
    return blog.relatedProducts.map(p => getProductDisplayData(p)).filter(Boolean);
  }, [blog, getProductDisplayData]);

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /><p>Loading article...</p></div>;
  }

  if (error || !blog) {
    return <div className="alert alert-danger text-center py-5">{error || 'Blog not found'}</div>;
  }

  return (
    <>

    <Header />
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      {/* Hero Section */}
      <section className="trending-hero overflow-hidden margin-top-responsive-design">
        <div className='container-fluid-lg padding-left-rightss-blog'>
          <div className="row align-items-center g-5 background-colorsss">
            <div className="col-lg-7 ps-lg-5 ps-3">
              <div className="mb-3 hero-section-main-name page-title-main-name fw-normal small tracking-widest">
                {blog.categoryName || blog.category?.name} · {blog.label || "Article"}
              </div>
              <h1 className="display-5 fw-bold mb-4 playfair-font-bold blog-title-main-file">{blog.title}</h1>
              {blog.excerpt && <p className="lead mb-5 opacity-90 blog-excerpt-main-file">{blog.excerpt}</p>}
              <div className='d-flex justify-content-between'>
                <p className="lead mb-5 opacity-90 blog-excerpt-main-file">{blog.publishedAtFormatted || blog.publishedAt}</p>
                <p className="lead mb-5 opacity-90 blog-excerpt-main-file">{blog.readingTime ? `${blog.readingTime} min read` : ''}</p>
              </div>
            </div>
            <div className="col-lg-5 hero-image-div p-3 margin-topss-hero-image">
              <div className='Blog-Hero-image-main'>
                {blog.coverImage && <img src={getImageUrl(blog.coverImage)} alt={blog.title} className="img-fluid hero-image" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="blog-detail container-fluid-lg py-5 padding-left-rightss-blog-innersection pt-0">
        <div className="row">
          <div className="col-lg-12">

            {/* Alternating Content Sections */}
            {blog.contentSections && blog.contentSections.length > 0 && (
              <div className="sections mt-5">
                {blog.contentSections.map((section, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div key={section._id} className="section mb-5">
                      <div className="row align-items-center g-4">
                        <div className={`col-lg-6 ${isEven ? 'order-lg-1' : 'order-lg-2'}`}>
                          {section.categoryName && <h5 className="text-muted mb-2">{section.categoryName}</h5>}
                          {section.subtitle && <h3 className="fw-bold mb-3">{section.subtitle}</h3>}
                          <div className="section-description" dangerouslySetInnerHTML={{ __html: section.description }} />
                        </div>
                        {section.image && (
                          <div className={`col-lg-6 ${isEven ? 'order-lg-2' : 'order-lg-1'}`}>
                            <img src={getImageUrl(section.image)} alt={section.subtitle} className="img-fluid rounded w-100" style={{ objectFit: "cover", maxHeight: "400px" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="meta text-muted mb-4 mt-5 pt-1">
              By {blog.author?.name || "Admin"} | {blog.publishedAtFormatted || blog.publishedAt}
              {blog.readingTime && ` | ${blog.readingTime} min read`}
            </div>

            <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Related Products Slider - Already Good */}
            {relatedProducts.length > 0 && (
              <div className="related-products mt-5">
                <h3 className="mb-4">Related Products</h3>
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation
                  breakpoints={{
                    300: { slidesPerView: 2, spaceBetween: 10 },
                    576: { slidesPerView: 2, spaceBetween: 15 },
                    768: { slidesPerView: 3, spaceBetween: 15 },
                    992: { slidesPerView: 4, spaceBetween: 20 },
                  }}
                  className="foryou-swiper"
                >
                   {relatedProducts.map((item) => {
                      if (!item) return null;

                      const variant = item.variant || {};
                      const allVariants = item.allVariants || [];
                      const groupedVariants = groupVariantsByType(allVariants);
                      const totalVariants = allVariants.length;
                      const isVariantSelected = !!selectedVariants[item._id];
                      const isAdding = addingToCart[item._id];
                      const hasVariants = allVariants.length > 0;
                      const outOfStock = hasVariants
                        ? (variant?.stock <= 0)
                        : (item.stock <= 0);
                      const showSelectVariantButton = hasVariants && !isVariantSelected;
                      // const buttonDisabled = isAdding || outOfStock;
                      const buttonText = isAdding
                        ? "Adding..."
                        : showSelectVariantButton
                          ? "Select Variant"
                          : outOfStock
                            ? "Out of Stock"
                            : "Add to Bag";

                      let imageUrl = item.image;
                      if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
                        imageUrl = `https://res.cloudinary.com/dekngswix/image/upload/${imageUrl}`;
                      }
                      if (!imageUrl) imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

                      const selectedSku = getSku(variant);
                      const isProductInWishlist = isInWishlist(item._id, selectedSku);

                      return (
                        <SwiperSlide key={item._id}>
                          <div className="foryou-card-wrapper">
                            <div className="foryou-card">
                              {/* Product Image with Overlays */}
                              <div
                                className="foryou-img-wrapper"
                                onClick={() => navigate(`/product/${item.slug || item._id}`)}
                                style={{ cursor: 'pointer' }}
                              >
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  className="foryou-img img-fluid"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
                                  }}
                                />

                                {/* Wishlist Icon */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (variant) toggleWishlist(item, variant);
                                  }}
                                  disabled={wishlistLoading[item._id]}
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
                                    color: isProductInWishlist ? '#dc3545' : '#000000',
                                    fontSize: '22px',
                                    zIndex: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '50%',
                                    width: '34px',
                                    height: '34px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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

                                {/* Promo Badge */}
                                {/* {variant.promoApplied && (
                                  <div className="promo-badge">
                                    <i className="bi bi-tag-fill me-1"></i>
                                    Promo
                                  </div>
                                )} */}
                              </div>

                              {/* Product Info */}
                              <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
                                <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
                                  <div className="brand-name small text-muted mb-1 mt-2 text-start">
                                    {item.brandName}
                                  </div>
                                  <h6
                                    className="foryou-name font-family-Poppins m-0 p-0"
                                    onClick={() => navigate(`/product/${item.slug || item._id}`)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {item.name}
                                  </h6>

                                  {/* Minimal Variant Display */}
                                  {hasVariants && (
                                    <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
                                      {isVariantSelected ? (
                                        <div
                                          className="selected-variant-display text-muted small"
                                          style={{ cursor: 'pointer', display: 'inline-block' }}
                                          onClick={(e) => openVariantOverlay(item._id, "all", e)}
                                          title="Click to change variant"
                                        >
                                          Variant: <span className="fw-bold text-dark">{getVariantDisplayText(variant)}</span>
                                          <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
                                        </div>
                                      ) : (
                                        <div className="small text-muted" style={{ height: '20px' }}>
                                          {allVariants.length} Variants Available
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Price Section */}
                                  <div className="price-section mb-3">
                                    <div className="d-flex align-items-baseline flex-wrap">
                                      <span className="current-price fw-400 fs-5">
                                        {formatPrice(variant.displayPrice)}
                                      </span>
                                      {variant.originalPrice > variant.displayPrice && (
                                        <>
                                          <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                            {formatPrice(variant.originalPrice)}
                                          </span>
                                          <span className="discount-percent text-danger fw-bold ms-2">
                                            ({variant.discountPercent || 0}% OFF)
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Add to Cart Button */}
                                  <div className="cart-section">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <button
                                        className={`w-100 btn-add-cart`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (showSelectVariantButton) {
                                            openVariantOverlay(item._id, "all", e);
                                          } else {
                                            handleAddToCart(item);
                                          }
                                        }}
                                        // disabled={buttonDisabled}
                                        style={{
                                          transition: "background-color 0.3s ease, color 0.3s ease",
                                        }}
                                      >
                                        {isAdding ? (
                                          <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Adding...
                                          </>
                                        ) : (
                                          <>
                                            {buttonText}
                                            {!isAdding && !showSelectVariantButton && (
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
                            {showVariantOverlay === item._id && (
                              <div className="variant-overlay" onClick={closeVariantOverlay}>
                                <div
                                  className="variant-overlay-content m-0 p-0 w-100"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    width: '90%',
                                    maxWidth: '500px',
                                    maxHeight: '100%',
                                    background: '#fff',
                                    borderRadius: '0px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                    <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
                                    <button onClick={closeVariantOverlay} style={{ background: 'none', border: 'none', fontSize: '40px' }}>×</button>
                                  </div>

                                  <div className="variant-tabs d-flex">
                                    <button
                                      className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
                                      onClick={() => setSelectedVariantType("all")}
                                    >
                                      All ({totalVariants})
                                    </button>
                                    {groupedVariants.color.length > 0 && (
                                      <button
                                        className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
                                        onClick={() => setSelectedVariantType("color")}
                                      >
                                        Colors ({groupedVariants.color.length})
                                      </button>
                                    )}
                                    {groupedVariants.text.length > 0 && (
                                      <button
                                        className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
                                        onClick={() => setSelectedVariantType("text")}
                                      >
                                        Sizes ({groupedVariants.text.length})
                                      </button>
                                    )}
                                  </div>

                                  <div className="p-3 overflow-auto flex-grow-1">
                                    {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
                                      <div className="row row-col-4 g-3">
                                        {groupedVariants.color.map((v) => {
                                          const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
                                          const isOutOfStock = (v.stock ?? 0) <= 0;
                                          return (
                                            <div className="col-lg-4 mt-2 col-5" key={getSku(v) || v._id}>
                                              <div
                                                className="text-center"
                                                style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                                                onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
                                              >
                                                <div
                                                  style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "20%",
                                                    backgroundColor: v.hex || "#ccc",
                                                    margin: "0 auto 8px",
                                                    border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                                    opacity: isOutOfStock ? 0.5 : 1,
                                                    position: "relative",
                                                  }}
                                                >
                                                  {isSelected && (
                                                    <span
                                                      style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%, -50%)",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      ✓
                                                    </span>
                                                  )}
                                                </div>
                                                <div className="small page-title-main-name" style={{fontSize: '12px'}}>
                                                  {getVariantDisplayText(v)}
                                                </div>
                                                {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
                                      <div className="row row-cols-3 g-3">
                                        {groupedVariants.text.map((v) => {
                                          const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
                                          const isOutOfStock = (v.stock ?? 0) <= 0;
                                          return (
                                            <div className="col" key={getSku(v) || v._id}>
                                              <div
                                                className="text-center"
                                                style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                                                onClick={() => !isOutOfStock && (handleVariantSelect(item._id, v), closeVariantOverlay())}
                                              >
                                                <div
                                                  style={{
                                                    padding: "10px",
                                                    borderRadius: "8px",
                                                    border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                                    background: isSelected ? "#f8f9fa" : "#fff",
                                                    minHeight: "50px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    opacity: isOutOfStock ? 0.5 : 1,
                                                  }}
                                                >
                                                  {getVariantDisplayText(v)}
                                                </div>
                                                {isOutOfStock && <div className="text-danger small mt-1">Out of Stock</div>}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
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
            )}

            {/* ===================== RELATED ARTICLES WITH READ MORE ===================== */}
            {blog.relatedArticles && blog.relatedArticles.length > 0 && (
              <div className="related-articles mt-5">
                <h3 className="mb-4">Related Articles</h3>
                <div className="row g-4">
                  {blog.relatedArticles
                    .slice(0, showAllArticles ? blog.relatedArticles.length : 4)
                    .map(article => (
                      <div key={article._id} className="col-md-3 col-6">
                        <Link to={`/blog/${article.slug}`} className="text-decoration-none">
                          <div className="blog-card">
                            <img
                              src={getImageUrl(article.coverImage)}
                              className="blog-card-img w-100"
                              alt={article.title}
                              referrerPolicy="no-referrer"
                            />
                            <h3 className="blog-card-title">{article.title}</h3>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>

                {/* Read More Button */}
                {blog.relatedArticles.length > 4 && !showAllArticles && (
                  <div className="text-center mt-4">
                    <button 
                      className="btn-read-more"
                      onClick={() => setShowAllArticles(true)}
                    >
                      Read More Articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>



      <Footer />
    </>
  );
};


export default BlogDetail;