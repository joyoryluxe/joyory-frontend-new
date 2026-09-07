import React, { useEffect, useState } from "react";
import { getSkinTypes } from "../../../../api/productApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../../styles/SkinTypes.css";
import SectionError from "../../../common/SectionError";
import SkinTypeCard from "./SkinTypeCard";
import { getErrorMessage } from "../../../../utils/errorHandler";

export default function Skintypes() {
  const [skinTypes, setSkinTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkinTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSkinTypes();
      const data =
        response.data?.skinTypes ||
        response.data?.data ||
        response.data?.items ||
        response.data ||
        [];
      setSkinTypes(data);
    } catch (err) {
      console.error("API error:", err);
      setError(
        getErrorMessage(
          err,
          "Failed to load skin types. Please try again later."
        )
      );
      setSkinTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkinTypes();
  }, []);

  return (
    <div className="container-fluid mt-lg-5">
      <h2 className="mb-3 text-left ms-lg-0 ps-lg-5 mt-3 mb-2 mb-lg-4 mt-lg-5 skintype-heading spacing fw-normal">
        Shop By Skin Types
      </h2>

      {loading ? (
        <p className="text-center text-muted page-title-main-name">
          Loading skin types...
        </p>
      ) : error ? (
        <SectionError message={error} onRetry={fetchSkinTypes} />
      ) : skinTypes.length > 0 ? (
        <div className="mobile-responsive-code mb-5">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            navigation={true}
            pagination={{ clickable: true }}
            spaceBetween={20}
            breakpoints={{
              300: { slidesPerView: 2, spaceBetween: 10 },
              380: { slidesPerView: 2, spaceBetween: 10 },
              576: { slidesPerView: 3, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              992: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1200: { slidesPerView: 3, spaceBetween: 20 },
              1400: { slidesPerView: 3, spaceBetween: 20 },
            }}
          >
            {skinTypes.map((type, index) => (
              <SwiperSlide key={type._id || index}>
                <SkinTypeCard type={type} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        !loading &&
        !error && <p className="text-center">No skin types found.</p>
      )}
    </div>
  );
}
