import React, { useState, useEffect } from "react";
import { getActivePromotions } from "../../../api/promotionApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../styles/ProductPromotion.css";
import "../../../App.css";
import SectionError from "../../common/SectionError";
import { getErrorMessage } from "../../../utils/errorHandler";

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
  const fetchPromotions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getActivePromotions({ section: "product" });
      const promotions =
        res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
      setSlides(promotions);
    } catch (err) {
      console.error("Failed to fetch promotions:", err.response || err);
      setError(getErrorMessage(err, "Failed to fetch promotions"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // ✅ Same behavior as OffersSlider:
  // - Show loading state
  // - Show error state
  // - Completely hide the entire section (return null) if no promotions
  if (isLoading) return <div className="loading-state page-title-main-name">Loading product promotions...</div>;
  if (error) return <SectionError message={error} onRetry={fetchPromotions} />;
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
                <div className="product-promotion-card">
                  <img
                    src={slide.bannerImage || slide.image || slide.desktopBanner || "https://placehold.co/600x400/f5f5f5/333333?text=Special+Promotion"}
                    alt={slide.campaignName || slide.title || "Promotion"}
                    className="product-promotion-img responsive-imagesss"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400/f5f5f5/333333?text=Special+Promotion";
                    }}
                  />
                  <div className="product-promotion-overlay">
                    <div className="product-promotion-content">
                      <span className="product-promotion-badge">
                        {slide.badgeText || "Special Offer"}
                      </span>
                      <h3 className="product-promotion-title">
                        {slide.campaignName || slide.title || "Limited Time Deal"}
                      </h3>
                      <p className="product-promotion-desc">
                        {slide.description || "Discover exclusive beauty products at unbeatable prices"}
                      </p>
                      <button className="product-promotion-btn">
                        {slide.buttonText || "Shop Now"}
                      </button>
                    </div>
                  </div>
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