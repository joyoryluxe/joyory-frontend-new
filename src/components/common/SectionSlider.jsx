import React from "react";
import { Swiper } from "swiper/react";
import "swiper/css";

const SectionSlider = ({ children, slidesPerView = 4, spaceBetween = 20 }) => {
  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      breakpoints={{
        320: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }}
    >
      {children}
    </Swiper>
  );
};

export default SectionSlider;