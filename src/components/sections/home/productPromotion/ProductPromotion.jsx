import React, { useState, useEffect } from "react";
import { getActivePromotions } from "../../../../api/promotionApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../../styles/ProductPromotion.css";
import "../../../../App.css";
import SectionError from "../../../common/SectionError";
import ProductPromotionCard from "./ProductPromotionCard";
import { getErrorMessage } from "../../../../utils/errorHandler";

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
  const [width] = useWindowSize();

  const fetchPromotions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getActivePromotions({ section: "slider" });
      const data = response.data;
      if (Array.isArray(data)) {
        setSlides(data);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(getErrorMessage(err, "Failed to load promotions"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  if (isLoading)
    return (
      <div className="loading-state page-title-main-name">
        Loading product promotions...
      </div>
    );
  if (error) return <SectionError message={error} onRetry={fetchPromotions} />;
  if (slides.length === 0) return null;

  const currentSlidesToShow =
    width >= 1400
      ? 3
      : width >= 1200
      ? 3
      : width >= 1024
      ? 3
      : width >= 992
      ? 3
      : width >= 768
      ? 3
      : width >= 576
      ? 3
      : width >= 380
      ? 2
      : 2;

  const currentSpaceBetween =
    width >= 1024 ? 25 : width >= 992 ? 20 : width >= 576 ? 15 : 10;

  const shouldScroll = slides.length > currentSlidesToShow;

  return (
    <div className="product-promotion container-fluid margin-left-rights">
      <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-0 mt-0 spacing Promotions-headings fw-normal">
        Promotions
      </h2>
      <div className="mobile-responsive-code mt-2 mt-lg-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={true}
          loop={shouldScroll}
          autoplay={
            shouldScroll
              ? {
                  delay: 2500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          speed={600}
          slidesPerView={currentSlidesToShow}
          spaceBetween={currentSpaceBetween}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide._id || index}>
              <ProductPromotionCard slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductPromotion;
