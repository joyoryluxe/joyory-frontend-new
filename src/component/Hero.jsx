import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/HeroSlider.css";

const API_URL = "https://beauty.joyory.com/api/media";

export default function HeroSlider() {
  const swiperRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(API_URL);
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

  // ✅ Click anywhere on the image/video → redirect
  const handleSlideClick = (item) => {
    if (!item?.buttonLink) return;
    
    if (item.buttonLink.startsWith("http")) {
      window.location.href = item.buttonLink;   // external or full URL
    } else {
      navigate(item.buttonLink);                // internal route
    }
  };

  if (loading) {
    return (
      <div className="hero-slider d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
        <div className="spinner-border text-primary" />
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
          bulletClass: 'custom-swiper-bullet',
          bulletActiveClass: 'custom-swiper-bullet-active',
        }}
        navigation
        speed={800}
        className="mt-lg-5 margin-setup"
      >
        {slides.map((item, index) => (
          <SwiperSlide key={item._id || index}>
            <div 
              className="slide-wrapper position-relative mt-xl-4 padding-left-rightss"
              onClick={() => handleSlideClick(item)}
              style={{
                cursor: item.buttonLink ? "pointer" : "default",
              }}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title || "Joyory Slide"}
                  className="slide-media hero-slider-image-responsive"
                />
              ) : (
                <video
                  className="slide-media slide-video"
                  src={item.url}
                  muted
                  playsInline
                  loop
                  preload="auto"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}