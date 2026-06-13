// src/components/ProductDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { WishlistContext } from "../context/WishlistContext";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import RecommendationSlider from "../components/common/RecommendationSlider";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance.js";
import "../styles/ProductDetail.css";

// Import separated components
import ProductDetailsHero from "../components/sections/product/ProductDetailsHero";
import ProductDetailDescription from "../components/sections/product/ProductDetailDescription";
import CustomerReviews from "../components/common/CustomerReviews";

// 🆕 Import Lottie loader
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { toggleWishlist: contextToggleWishlist, isInWishlist: contextIsInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [selectedShade, setSelectedShade] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    variantSku: "",
    shadeName: "",
  });
  const [reviewImages, setReviewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const isInWishlist = product && selectedShade ? contextIsInWishlist(product._id, selectedShade.sku) : false;
  const [filters, setFilters] = useState({
    shade: "All",
    rating: "All",
    sort: "Most Helpful",
    photosOnly: false,
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  /* ===================== WISHLIST FUNCTIONS ===================== */
  const toggleWishlist = async () => {
    if (!product || !selectedShade) {
      toast.warn("Please select a variant first");
      return;
    }
    setWishlistLoading(true);
    try {
      await contextToggleWishlist(product, selectedShade);
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  /* ===================== PRODUCT FETCHING ===================== */
  const getVariantFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("variant");
  };

  const updateUrlForVariant = (variant) => {
    if (!variant || !product) return;
    if (variant.slug) {
      navigate(`/product/${variant.slug}`, { replace: true });
    } else if (variant.sku) {
      const productSlug = product.slugs?.[0] || slug;
      navigate(`/product/${productSlug}?variant=${variant.sku}`, {
        replace: true,
      });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let url = `/api/user/products/${slug}`;
        const variantParam = getVariantFromQuery();
        if (variantParam) {
          url += `?variant=${variantParam}`;
        }

        const res = await axiosInstance.get(url);
        const data = res.data;
        if (location.state?.supportsVTO !== undefined) {
          data.supportsVTO = location.state.supportsVTO;
        }
        setProduct(data);

        if (data.reviewSummary) {
          setReviewSummary(data.reviewSummary);
        } else {
          setReviewSummary({
            avgRating: data.avgRating || 0,
            totalReviews: data.totalRatings || 0,
            ratingDistribution: data.ratingDistribution || {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
            },
          });
        }

        const isVariantSlug =
          data.selectedVariant && data.selectedVariant.slug === slug;

        const variantsList = data.variants || [];
        let defaultVariant = null;

        if (isVariantSlug && data.selectedVariant) {
          defaultVariant = data.selectedVariant;
        } else if (variantParam) {
          defaultVariant =
            variantsList.find(
              (v) =>
                v.sku === variantParam || v.variantSku === variantParam
            ) || variantsList[0];
        } else {
          defaultVariant =
            variantsList.find((v) => v.stock > 0) || variantsList[0];
        }

        if (defaultVariant) {
          const variantData = {
            shadeName: defaultVariant.shadeName,
            hex: defaultVariant.hex,
            stock: defaultVariant.stock,
            images: defaultVariant.images || data.images || ["/placeholder.png"],
            displayPrice: defaultVariant.displayPrice,
            originalPrice: defaultVariant.originalPrice,
            variantSku: defaultVariant.sku || defaultVariant.variantSku,
            sku: defaultVariant.sku || defaultVariant.variantSku,
            slug: defaultVariant.slug,
            ...defaultVariant,
          };

          setSelectedShade(variantData);
          setDisplayImages(variantData.images);

          setNewReview((prev) => ({
            ...prev,
            variantSku: variantData.sku,
            shadeName: variantData.shadeName,
          }));
        } else {
          setSelectedShade(null);
          setDisplayImages(data.images || ["/placeholder.png"]);
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        toast.error("Product not found");
        navigate("/404");
      }
    };

    fetchProduct();
  }, [slug, location.search, navigate]);

  /* ===================== VARIANT HANDLING ===================== */
  const handleVariantSelect = (variant) => {
    if (!variant || variant.stock <= 0) return;

    const variantData = {
      shadeName: variant.shadeName,
      hex: variant.hex,
      stock: variant.stock,
      images: variant.images || product.images || ["/placeholder.png"],
      displayPrice: variant.displayPrice || product.price,
      originalPrice: variant.originalPrice || product.mrp || product.price,
      variantSku: variant.sku || variant.variantSku,
      sku: variant.sku || variant.variantSku,
      slug: variant.slug,
      ...variant,
    };

    setSelectedShade(variantData);
    setDisplayImages(variantData.images);
    updateUrlForVariant(variantData);

    if (showReviewForm) {
      setNewReview((prev) => ({
        ...prev,
        variantSku: variantData.sku,
        shadeName: variantData.shadeName,
      }));
    }
  };

  /* ===================== ADD TO CART FUNCTION ===================== */
  const handleAddToCart = async () => {
    if (!product) {
      toast.error("❌ Product not found");
      return;
    }

    if (!selectedShade) {
      toast.error("❌ Please select a variant first");
      return;
    }

    if (selectedShade.stock <= 0) {
      toast.error("❌ This variant is out of stock");
      return;
    }

    try {
      const success = await addToCart(product, selectedShade, false);
      if (success) {
        toast.success("✅ Added to cart!");
        setTimeout(() => navigate("/cartpage"), 1000);
      } else {
        toast.error("❌ Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.message === "Authentication required") {
        toast.error("⚠️ Please log in first");
        navigate("/login");
      } else {
        toast.error("❌ Failed to add product");
      }
    }
  };

  /* ===================== REVIEWS FUNCTIONS ===================== */
  const fetchFilteredReviews = async () => {
    if (!product?._id) return;
    try {
      // Fetch all reviews; filtering by shade, rating, and photos is done on the frontend to ensure 100% reliability
      const query = `?sort=${
        filters.sort === "Most Helpful" ? "helpful" : "recent"
      }`;

      const res = await axiosInstance.get(
        `/api/reviews/product/${product._id}${query}`
      );
      setReviews(res.data.reviews || []);

      if (res.data.summary) {
        setReviewSummary(res.data.summary);
      }
    } catch (err) {
      console.error("Reviews fetch error", err);
    }
  };

  useEffect(() => {
    if (product?._id) {
      fetchFilteredReviews();
    }
  }, [product?._id, filters]);

  const handleReviewVariantSelect = (e) => {
    const selectedSku = e.target.value;
    const variantsList = product.variants || product.shadeOptions || [];
    const selectedVariant = variantsList.find(
      (v) => v.sku === selectedSku || v.variantSku === selectedSku
    );

    if (selectedVariant) {
      setNewReview((prev) => ({
        ...prev,
        variantSku: selectedVariant.sku || selectedVariant.variantSku,
        shadeName: selectedVariant.shadeName || selectedVariant.name || "Default",
      }));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.variantSku) {
      toast.warn("Please select a variant for your review.");
      return;
    }

    if (!newReview.rating || !newReview.comment) {
      toast.warn("Rating and comment are required.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productId", product._id);
      formData.append("variantSku", newReview.variantSku);
      formData.append("shadeName", newReview.shadeName);
      formData.append("rating", newReview.rating);
      formData.append("comment", newReview.comment);
      reviewImages.forEach((file) => formData.append("images", file));

      const res = await axiosInstance.post(`/api/reviews/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.review) {
        toast.success("✅ Review submitted!");
        setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
        setReviewImages([]);
        await fetchFilteredReviews();
        if (res.data.summary) {
          setReviewSummary(res.data.summary);
        }
        setShowReviewForm(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    try {
      const res = await axiosInstance.post(
        `/api/reviews/${reviewId}/vote-helpful`
      );

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, helpfulVotes: res.data.helpfulVotes }
            : r
        )
      );

      setLikedReviews((prev) => ({
        ...prev,
        [reviewId]: res.data.message === "Vote added",
      }));

      toast.info(res.data.message);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    if (showReviewForm && product && selectedShade) {
      setNewReview((prev) => ({
        ...prev,
        variantSku: selectedShade.sku,
        shadeName: selectedShade.shadeName,
      }));
    } else if (!showReviewForm) {
      setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
    }
  }, [showReviewForm, product, selectedShade]);

  /* ─────────────────────────────────────────────────────────────────
     🆕 LOTTIE LOADER – replaces the plain "Loading..." text
     Uses the same animation URL as the ProductPage
  ───────────────────────────────────────────────────────────────── */
  if (!product) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundColor: "rgba(255,255,255,0.97)",
          zIndex: 9999,
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="text-center">
          <DotLottieReact
            className="mb-4"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
          <p className="text-muted mb-0 page-title-main-name">
            Fetching product details...
          </p>
        </div>
      </div>
    );
  }

  const variantsList = product.variants || product.shadeOptions || [];

  return (
    <>
      <Header />

      <main className="product-detail-page page-title-main-name">
        <div className="product-detail-container">
          <ProductDetailsHero
            product={product}
            selectedShade={selectedShade}
            displayImages={displayImages}
            reviewSummary={reviewSummary}
            variantsList={variantsList}
            isInWishlist={isInWishlist}
            wishlistLoading={wishlistLoading}
            handleVariantSelect={handleVariantSelect}
            toggleWishlist={toggleWishlist}
            handleAddToCart={handleAddToCart}
            setDisplayImages={setDisplayImages}
            toast={toast}
          />

          {/* <ProductDetailDescription product={product} /> */}

          <CustomerReviews
            product={product}
            reviews={reviews}
            reviewSummary={reviewSummary}
            variantsList={variantsList}
            filters={filters}
            setFilters={setFilters}
            likedReviews={likedReviews}
            showReviewForm={showReviewForm}
            setShowReviewForm={setShowReviewForm}
            newReview={newReview}
            setNewReview={setNewReview}
            reviewImages={reviewImages}
            setReviewImages={setReviewImages}
            submitting={submitting}
            handleReviewVariantSelect={handleReviewVariantSelect}
            handleReviewSubmit={handleReviewSubmit}
            handleHelpfulVote={handleHelpfulVote}
          />

          <section className="recommendations-section mt-5">
            <RecommendationSlider
              title="You Might Also Like"
              products={product.recommendations?.youMayAlsoLike?.products || []}
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;








//=============================================================Done-Code(End)==========================================================













