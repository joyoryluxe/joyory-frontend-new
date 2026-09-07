/**
 * HeroSlider.jsx
 * ─────────────────────────────────────────────────────────────
 * Swiper Hero Slider component using HeroSlide sub-component.
 * ─────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedia } from "../../../../api/mediaApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Loader from "../../../common/Loader";
import "../../../../styles/HeroSlider.css";
import HeroSlide from "./HeroSlide";

export default function HeroSlider() {
  const swiperRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await getMedia();
        if (res.data?.success && Array.isArray(res.data.data)) {
          setSlides(res.data.data);
        } else if (res.data?.items) {
          setSlides(res.data.items);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const handleSlideChange = () => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;
    document.querySelectorAll(".slide-video").forEach((v) => v.pause());
    const activeSlide = swiper.slides[swiper.activeIndex];
    const video = activeSlide?.querySelector("video");
    if (video) video.play().catch(() => {});
  };

  const handleSlideClick = (item) => {
    if (!item?.buttonLink) return;

    if (item.buttonLink.startsWith("http")) {
      window.location.href = item.buttonLink;
    } else {
      navigate(item.buttonLink);
    }
  };

  if (loading) {
    return (
      <div
        className="hero-slider d-flex justify-content-center align-items-center"
        style={{ height: "500px" }}
      >
        <Loader text="Loading hero slider..." height={100} />
      </div>
    );
  }

  if (!slides.length) return null;

  return (
    <section className="hero-slider bg-white">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation]}
        onSlideChange={handleSlideChange}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={10}
        pagination={{
          clickable: true,
          bulletClass: "custom-swiper-bullet",
          bulletActiveClass: "custom-swiper-bullet-active",
        }}
        navigation
        speed={800}
        className="mt-lg-4 margin-setup"
      >
        {slides.map((item, index) => (
          <SwiperSlide key={item._id || index}>
            <HeroSlide item={item} onClick={() => handleSlideClick(item)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export { HeroSlide };
