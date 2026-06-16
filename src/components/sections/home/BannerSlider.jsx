// src/components/BannerSlider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "../../../styles/BannerSlider.css";

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
      console.log('🔥 Fetching Shade Finder Banners...');

      const { data } = await axios.get(
        'https://beauty.joyory.com/api/user/categories/category/makeup/landing',
        { withCredentials: true }
      );

      console.log('✅ API Response:', data);

      // Get featureBanners safely
      const featureBanners = data.featureBanners || data.data?.featureBanners || [];

      // Filter only shadeFinder type
      const shadeFinderBanners = featureBanners.filter(
        banner => banner.type === 'shadeFinder'
      );

      console.log('🎯 ShadeFinder Banners Found:', shadeFinderBanners.length);

      const allSlides = [];

      shadeFinderBanners.forEach((banner, bannerIndex) => {
        const images = banner.image || [];

        if (Array.isArray(images) && images.length > 0) {
          // Support multiple images per banner
          images.forEach((img, imgIndex) => {
            if (img?.url) {
              allSlides.push({
                _id: `${banner._id || 'shade'}-${bannerIndex}-${imgIndex}`,
                image: img.url,
                title: imgIndex === 0 ? (banner.title || "") : "",
                description: imgIndex === 0 ? (banner.description || "") : "",
                buttonText: imgIndex === 0 ? (banner.buttonText || "Shop Now") : "",
                buttonLink: img.link || banner.link || "",   // Individual image link has priority
                bannerType: banner.type,
                isActive: true,
              });
            }
          });
        } 
        else if (typeof banner.image === "string" && banner.image) {
          // Fallback for old single string image
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
      console.log('✅ Final ShadeFinder Slides Created:', allSlides.length);
    } catch (err) {
      console.error('❌ Failed to fetch shade finder banners:', err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShadeFinderBanners();
  }, [fetchShadeFinderBanners]);

  // Handle click on banner / button
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
        <div className="banner-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading shade finder...</span>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    console.log('⚠️ No shade finder banners available');
    return null;
  }

  return (
    <div className="px-lg-5 px-0 container-lg-fluid">
      {/* Custom Pagination Styles - Same as HeroSlider */}
      <style>{`
        .banner-swiper .custom-swiper-bullet {
          background: #fff !important;
          opacity: 0.8 !important;
          border: 1px solid #000 !important;
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 50%;
          margin: 0 4px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .banner-swiper .custom-swiper-bullet-active {
          background: #000 !important;
          opacity: 1 !important;
          border-color: #fff !important;
          transform: scale(1.2);
        }
        
        .banner-swiper .swiper-pagination {
          bottom: 20px !important;
        }
        
        .banner-swiper .swiper-pagination-bullet {
          background: #fff !important;
          opacity: 0.8 !important;
          border: 1px solid #000 !important;
        }
        
        .banner-swiper .swiper-pagination-bullet-active {
          background: #000 !important;
          opacity: 1 !important;
          border-color: #fff !important;
        }

        /* Navigation Arrows Styling */
        .banner-swiper .swiper-button-prev,
        .banner-swiper .swiper-button-next {
          color: #000 !important;
          background: rgba(255, 255, 255, 0.7) !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
        }

        .banner-swiper .swiper-button-prev:hover,
        .banner-swiper .swiper-button-next:hover {
          background: rgba(255, 255, 255, 0.9) !important;
          transform: scale(1.05) !important;
        }

        .banner-swiper .swiper-button-prev:after,
        .banner-swiper .swiper-button-next:after {
          font-size: 18px !important;
          font-weight: bold !important;
        }

        /* Hide navigation on mobile */
        @media (max-width: 768px) {
          .banner-swiper .swiper-button-prev,
          .banner-swiper .swiper-button-next {
            display: none !important;
          }
          
          .banner-swiper .swiper-pagination {
            bottom: 10px !important;
          }
        }

        /* Banner Container */
        .banner-container {
          overflow: hidden;
        }

        .banner-slide {
          cursor: pointer;
        }


      `}</style>

      <div className="position-relative banner-container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          pagination={{
            clickable: true,
            bulletClass: 'custom-swiper-bullet',
            bulletActiveClass: 'custom-swiper-bullet-active',
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          // autoplay={{
          //   delay: 4000,
          //   disableOnInteraction: false,
          //   pauseOnMouseEnter: true,
          // }}
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
              <div 
                className="banner-slide position-relative overflow-hidden cursor-pointer"
                onClick={() => handleBannerClick(banner.buttonLink)}
              >
                <div className="banner-image-wrapper">
                  <img
                    src={banner.image}
                    alt={banner.title || "Shade Finder"}
                    className="img-fluid w-100 margin-left-for-Virtualtryonhome"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/1920x600/764ba2/ffffff?text=Shade+Finder";
                    }}
                  />
                </div>
              </div>
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











//=============================================================Done_code(End)=================================================================================
