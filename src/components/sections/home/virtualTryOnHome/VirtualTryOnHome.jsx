/**
 * VirtualTryOnHome.jsx
 * ─────────────────────────────────────────────────────────────
 * Swiper fade slider for Virtual Try-On banners using VirtualTryOnCard.
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { getCategoryLanding } from "../../../../api/categoryApi";
import Loader from "../../../common/Loader";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../styles/BannerSlider.css";
import VirtualTryOnCard from "./VirtualTryOnCard";

const Virtualtryonhome = () => {
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

  // Fetch only virtual try on banners from API
  const fetchVirtualTryOnBanners = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await getCategoryLanding("makeup");
      const featureBanners =
        data.featureBanners || data.data?.featureBanners || [];

      const virtualTryOnBanners = featureBanners.filter(
        (banner) => banner.type === "virtualTryOn"
      );

      const allBanners = [];

      virtualTryOnBanners.forEach((banner, bannerIndex) => {
        if (
          banner.image &&
          Array.isArray(banner.image) &&
          banner.image.length > 0
        ) {
          banner.image.forEach((img, imgIndex) => {
            if (img.url) {
              allBanners.push({
                _id: `${banner._id || "virtualTryOn"}-${bannerIndex}-${imgIndex}`,
                image: img.url,
                title: imgIndex === 0 ? banner.title || "" : "",
                description:
                  imgIndex === 0 ? banner.description || "" : "",
                buttonText: imgIndex === 0 ? banner.buttonText || "" : "",
                buttonLink: img.link || banner.link || "",
                isActive: true,
                order: allBanners.length + 1,
                textPosition: "center",
                textColor: "dark",
                bannerType: banner.type,
              });
            }
          });
        } else if (typeof banner.image === "string" && banner.image) {
          allBanners.push({
            _id: banner._id || `virtualTryOn-${bannerIndex}`,
            image: banner.image,
            title: banner.title || "",
            description: banner.description || "",
            buttonText: banner.buttonText || "",
            buttonLink: banner.link || "",
            isActive: true,
            order: allBanners.length + 1,
            textPosition: "center",
            textColor: "dark",
            bannerType: banner.type,
          });
        }
      });

      setBanners(allBanners);
    } catch (err) {
      console.error("Failed to fetch virtual try on banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVirtualTryOnBanners();
  }, [fetchVirtualTryOnBanners]);

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
          <Loader text="Loading virtual try on..." height={100} />
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
              <VirtualTryOnCard
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

export default Virtualtryonhome;
export { VirtualTryOnCard };
