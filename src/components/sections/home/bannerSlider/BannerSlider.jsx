/**
 * BannerSlider.jsx
 * ─────────────────────────────────────────────────────────────
 * Swiper fade slider for Shade Finder banners using BannerCard.
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { getCategoryLanding } from "../../../../api/categoryApi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Loader from "../../../common/Loader";
import "../../../../styles/BannerSlider.css";
import BannerCard from "./BannerCard";

const BannerSlider = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch and process Shade Finder Banners
  const fetchShadeFinderBanners = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await getCategoryLanding("makeup");
      const featureBanners =
        data.featureBanners || data.data?.featureBanners || [];

      const shadeFinderBanners = featureBanners.filter(
        (banner) => banner.type === "shadeFinder"
      );

      const allSlides = [];

      shadeFinderBanners.forEach((banner, bannerIndex) => {
        const images = banner.image || [];

        if (Array.isArray(images) && images.length > 0) {
          images.forEach((img, imgIndex) => {
            if (img?.url) {
              allSlides.push({
                _id: `${banner._id || "shade"}-${bannerIndex}-${imgIndex}`,
                image: img.url,
                title: imgIndex === 0 ? banner.title || "" : "",
                description:
                  imgIndex === 0 ? banner.description || "" : "",
                buttonText:
                  imgIndex === 0 ? banner.buttonText || "Shop Now" : "",
                buttonLink: img.link || banner.link || "",
                bannerType: banner.type,
                isActive: true,
              });
            }
          });
        } else if (typeof banner.image === "string" && banner.image) {
          allSlides.push({
            _id: banner._id || `shade-${bannerIndex}`,
            image: banner.image,
            title: banner.title || "",
            description: banner.description || "",
            buttonText: banner.buttonText || "Shop Now",
            buttonLink: banner.link || "",
            bannerType: banner.type,
            isActive: true,
          });
        }
      });

      setBanners(allSlides);
    } catch (err) {
      console.error("Failed to fetch shade finder banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShadeFinderBanners();
  }, [fetchShadeFinderBanners]);

  const handleBannerClick = (link) => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  if (loading) {
    return (
      <div className="px-0 Virtualtryonhome-container-width">
        <div
          className="banner-loading"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
          }}
        >
          <Loader text="Loading shade finder..." height={100} />
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="px-lg-5 px-4 container-lg-fluid">
      <div className="position-relative banner-container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          pagination={{
            clickable: true,
            bulletClass: "custom-swiper-bullet",
            bulletActiveClass: "custom-swiper-bullet-active",
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          speed={800}
          loop={banners.length > 1}
          spaceBetween={0}
          centeredSlides={true}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          grabCursor={true}
          className="banner-swiper"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <BannerCard
                banner={banner}
                onClick={() => handleBannerClick(banner.buttonLink)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        {windowWidth > 768 && banners.length > 1 && (
          <>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default BannerSlider;
export { BannerCard };
