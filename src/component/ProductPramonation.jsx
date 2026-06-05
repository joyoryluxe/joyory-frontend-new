import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/ProductPromotion.css";
import "../App.css";

// ✅ Same hook as in OffersSlider for consistent responsive behavior
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

const ProductPromotion = () => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [width] = useWindowSize();

  // Fetch active promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(
          "https://beauty.joyory.com/api/user/promotions/active?section=product"
        );
        const promotions =
          res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
        setSlides(promotions);
      } catch (err) {
        console.error("Failed to fetch promotions:", err.response || err);
        setError(err.message || "Failed to fetch promotions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // ✅ Same behavior as OffersSlider:
  // - Show loading state
  // - Show error state
  // - Completely hide the entire section (return null) if no promotions
  if (isLoading) return <div className="loading-state page-title-main-name">Loading product promotions...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (slides.length === 0) return null;

  // ✅ Dynamic slides & space (exact match with OffersSlider breakpoints)
  const currentSlidesToShow =
    width >= 1400 ? 3 :
      width >= 1200 ? 3 :
        width >= 1024 ? 3 :
          width >= 992 ? 3 :
            width >= 768 ? 3 :
              width >= 576 ? 3 :
                width >= 380 ? 2 : 2;

  const currentSpaceBetween =
    width >= 1024 ? 25 :
      width >= 992 ? 20 :
        width >= 576 ? 15 :
          10;

  // ✅ Only enable loop & autoplay when there are more items than visible (same as OffersSlider)
  const shouldScroll = slides.length > currentSlidesToShow;

  // Click promotion → navigate using slug (preferred) or ID
  // const handlePromotionClick = (promotion) => {
  //   const param = promotion.slug || promotion._id;
  //   const title = promotion.campaignName || promotion.title || "Promotion Products";

  //   navigate(`/productpage/${param}`, {
  //     state: {
  //       pageTitle: title,
  //     },
  //   });
  // };


  const handlePromotionClick = (promotion) => {
    const { scope, targetSlug, slug, _id } = promotion;

    // ✅ SAME LOGIC AS OFFERS SLIDER
    if (scope === "category" && targetSlug) {
      navigate(`/Products/category/${targetSlug}`);
    }
    else if (scope === "brand" && targetSlug) {
      navigate(`/brand/${targetSlug}`);
    }
    else if (scope === "product" && targetSlug) {
      navigate(`/product/${targetSlug}`);
    }
    else {
      // fallback
      const param = slug || _id;
      navigate(`/productpage/${param}`, {
        state: {
          pageTitle: promotion.campaignName || promotion.title || "Promotion",
        },
      });
    }
  };

  return (
    <div className="product-promotion container-fluid margin-left-rights">
      <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-0 mt-0 spacing Promotions-headings fw-normal">
        Product Promotions
      </h2>

      <div className="mobile-responsive-code mt-3">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={true}
          loop={shouldScroll}
          autoplay={shouldScroll ? {
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          speed={600}
          slidesPerView={currentSlidesToShow}
          spaceBetween={currentSpaceBetween}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide._id || index}>
              <div
                className="overflow-hidden position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => handlePromotionClick(slide)}
              >
                <img
                  src={
                    slide.image ||
                    slide.images?.[0] ||
                    slide.img ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={slide.campaignName || `Promotion ${index + 1}`}
                  loading="lazy"
                  className="img-fluid"
                  style={{ objectFit: "cover", height: "100%" }}
                />

                {/* 🔥 CAPTION OVERLAY */}
                <div className="promotion-caption">
                  <h6 className="promotion-title">
                    {slide.campaignName?.toUpperCase() || ""}
                  </h6>

                  {slide.description && (
                    <p className="promotion-subtitle text-start">
                      {slide.description}
                    </p>
                  )}

                  {slide.discountValue && (
                    <span className="promotion-badge">
                      {slide.discountValue}
                      {slide.discountUnit === "percent" ? "% OFF" : " OFF"}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductPromotion;