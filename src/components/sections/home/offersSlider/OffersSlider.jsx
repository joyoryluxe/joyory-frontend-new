import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { getActivePromotions } from "../../../../api/promotionApi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../../styles/OffersSlider.css";
import "../../../../App.css";
import OfferCard from "./OfferCard";

const OffersSlider = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await getActivePromotions({ section: "banner" });
        const data = res.data;
        if (Array.isArray(data)) {
          // Filter promotions that have at least one valid image
          const validPromotions = data.filter(
            (promo) =>
              Array.isArray(promo.images) &&
              promo.images.length > 0 &&
              promo.images[0]
          );
          setPromotions(validPromotions);
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

  // Gracefully return null during loading or error to avoid layout shifts
  if (isLoading || error || promotions.length === 0) return null;

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
              <OfferCard promotion={promotion} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OffersSlider;
