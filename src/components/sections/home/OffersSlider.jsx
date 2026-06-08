// src/components/OffersSlider.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../styles/OffersSlider.css";
import "../../../App.css";

// ✅ Countdown Timer Component
const CountdownTimer = ({ countdown }) => {
  if (!countdown) return null;

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div className="countdown-timer">
      <span className="countdown-item">{days}d</span>
      <span className="countdown-separator">:</span>
      <span className="countdown-item">{hours.toString().padStart(2, '0')}h</span>
      <span className="countdown-separator">:</span>
      <span className="countdown-item">{minutes.toString().padStart(2, '0')}m</span>
      <span className="countdown-separator">:</span>
      <span className="countdown-item">{seconds.toString().padStart(2, '0')}s</span>
    </div>
  );
};

const OffersSlider = () => {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(
          "https://beauty.joyory.com/api/user/promotions/active?section=banner"
        );
        if (!res.ok) throw new Error("Failed to fetch promotions");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPromotions(data);
        } else {
          throw new Error("API response is not an array");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (isLoading) return <div className="loading-state page-title-main-name">Loading offers...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  // ✅ If no promotions → hide the entire section
  if (promotions.length === 0) return null;

  // ✅ Enhanced navigation logic based on scope
  const handlePromotionClick = (promotion) => {
    const { scope, targetSlug, slug, _id } = promotion;

    // Navigate based on promotion scope
    if (scope === "category" && targetSlug) {
      navigate(`/Products/category/${targetSlug}`);
    } else if (scope === "brand" && targetSlug) {
      navigate(`/brand/${targetSlug}`);
    } else if (scope === "product" && targetSlug) {
      navigate(`/product/${targetSlug}`);
    } else {
      // Fallback to promotion detail page
      const param = slug || _id;
      navigate(`/promotion/${param}`);
    }
  };

  // ✅ Get promotional badge based on type
  const getPromoBadge = (promotion) => {
    if (promotion.discountLabel) {
      return promotion.discountLabel;
    }
    if (promotion.type === "bogo") {
      return "BOGO";
    }
    if (promotion.type === "freeShipping") {
      return "Free Shipping";
    }
    if (promotion.type === "newUser") {
      return "New User Offer";
    }
    return "Special Offer";
  };

  return (
    <div className="top-categories-wrapper container-fluid mt-md-0 mt-lg-3 bg-white padding-topss margin-left-rights">
      <h2 className="mb-3 text-left text-start offers-headings spacing fw-normal">
        Offers
      </h2>

      <div className="mobile-responsive-code mt-2 mt-lg-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={600}
          spaceBetween={10}
          breakpoints={{
            300: { slidesPerView: 2 },
            380: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 3 },
            1400: { slidesPerView: 3 },
          }}
        >
          {promotions.map((promotion) => (
            <SwiperSlide key={promotion._id}>
              <div
                className="offer-card"
                style={{ cursor: "pointer" }}
                onClick={() => handlePromotionClick(promotion)}
              >
                {/* ✅ Promotional Badge */}
                {/* <div className="offer-badge">
                  {getPromoBadge(promotion)}
                </div> */}

                {/* ✅ Image Container */}
                <div className="offer-image-container">
                  <img
                    src={
                      Array.isArray(promotion.images) && promotion.images.length > 0
                        ? promotion.images[0]
                        : "/assets/images/placeholder-offer.jpg"
                    }
                    alt={promotion.title || "Promotion"}
                    className="img-fluid offer-image"
                    onError={(e) => {
                      e.target.src = "/assets/images/placeholder-offer.jpg";
                    }}
                  />

                  {/* ✅ Overlay with countdown for scheduled/ending soon */}
                  {/* {promotion.countdown && (
                    <div className="offer-countdown-overlay">
                      <CountdownTimer countdown={promotion.countdown} />
                    </div>
                  )} */}
                </div>

                {/* ✅ Offer Details */}
                <div className="offer-details mt-3 text-start">
                  <h3 className="offer-title offer-title-responsie-title font-weightss page-title-main-name">{promotion.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OffersSlider;
