import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from "../../common/Loader";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const API = "https://beauty.joyory.com/api/user/categories/category/makeup/landing";

const Virtualtryonhome = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 FETCH ONLY VIRTUAL TRY ON BANNERS FROM API (Same pattern as BannerSlider)
  const fetchVirtualTryOnBanners = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔥 Fetching Virtual Try On Banners...');

      const { data } = await axios.get(API, { withCredentials: true });

      console.log('✅ API Response:', data);

      // 🔥 GET FEATURE BANNERS ARRAY
      const featureBanners = data.featureBanners || data.data?.featureBanners || [];

      // 🔥 FILTER ONLY VIRTUAL TRY ON TYPE BANNERS (Same as shadeFinder filter)
      const virtualTryOnBanners = featureBanners.filter(
        banner => banner.type === 'virtualTryOn'
      );

      console.log('🎯 VirtualTryOn Banners Found:', virtualTryOnBanners.length);

      // 🔥 PROCESS VIRTUAL TRY ON BANNERS - SUPPORT MULTIPLE IMAGES (Same as BannerSlider)
      const allBanners = [];

      virtualTryOnBanners.forEach((banner, bannerIndex) => {
        // Check if banner has multiple images
        if (banner.image && Array.isArray(banner.image) && banner.image.length > 0) {
          // Create a slide for each image in the banner
          banner.image.forEach((img, imgIndex) => {
            if (img.url) {
              allBanners.push({
                _id: `${banner._id || 'virtualTryOn'}-${bannerIndex}-${imgIndex}`,
                image: img.url,
                title: imgIndex === 0 ? (banner.title || "") : "",
                description: imgIndex === 0 ? (banner.description || "") : "",
                buttonText: imgIndex === 0 ? (banner.buttonText || "") : "",
                buttonLink: img.link || banner.link || "",
                isActive: true,
                order: allBanners.length + 1,
                textPosition: "center",
                textColor: "dark",
                bannerType: banner.type
              });
            }
          });
        } else if (typeof banner.image === "string" && banner.image) {
          // Single image as string
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
            bannerType: banner.type
          });
        }
      });

      setBanners(allBanners);
      console.log('✅ VirtualTryOn Slides Created:', allBanners.length);

    } catch (err) {
      console.error('❌ Failed to fetch virtual try on banners:', err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVirtualTryOnBanners();
  }, [fetchVirtualTryOnBanners]);

  // 🔥 HANDLE SLIDE CLICK - NAVIGATE TO VTO PAGE (VirtualTryOn specific)
  const handleSlideClick = async () => {
    try {
      setNavLoading(true);
      console.log('🔥 Calling VTO API...');

      // Call VTO API
      await axios.get('https://beauty.joyory.com/api/vto/enabled');
      console.log('✅ VTO API Called Successfully');

      // Navigate to virtual try on page
      navigate('/Mainvirtualtryon');

    } catch (error) {
      console.error("❌ Navigation Error:", error);
      // Fallback navigation even if API fails
      navigate('/Mainvirtualtryon');
    } finally {
      setNavLoading(false);
    }
  };

  // 🔥 SHOW LOADING WHILE FETCHING (Same as BannerSlider)
  if (loading) {
    return (
      <div className="px-0 Virtualtryonhome-container-width">
        <div className="banner-loading" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
          <Loader text="Loading virtual try on..." height={100} />
        </div>
      </div>
    );
  }

  // 🔥 HIDE IF NO VIRTUAL TRY ON BANNERS FOUND (Same as BannerSlider)
  if (banners.length === 0) {
    console.log('⚠️ No virtual try on banners available');
    return null;
  }

  return (
    <div className="px-lg-5 px-0 container-lg-fluid">
      <div className="position-relative banner-container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
              return `<span class="${className}"></span>`;
            }
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
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
          {banners
            .filter(banner => banner.isActive)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((banner) => (
              <SwiperSlide key={banner._id}>
                <div
                  className="banner-slide position-relative overflow-hidden"
                  onClick={handleSlideClick}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="banner-image-wrapper">
                    <img
                      src={banner.image}
                      alt={banner.title || "Virtual Try On"}
                      className="img-fluid w-100 margin-left-for-Virtualtryonhome"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/1920x600/667eea/ffffff?text=Virtual+Try+On";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>

                  {/* 🔥 NAVIGATION LOADING OVERLAY */}
                  {navLoading && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                      <div className="text-center text-white">
                        <Loader text="Loading..." height={80} style={{ color: "#fff" }} />
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

        <div className="swiper-pagination"></div>

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