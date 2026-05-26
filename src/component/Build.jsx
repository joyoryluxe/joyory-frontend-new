// // src/component/Build.jsx
// import React, { useState, useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import "../App.css";

// // Import your banner images
// import Builds from "../assets/Build.png";

// const Build = () => {
//   const navigate = useNavigate();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Static banners data
//   const staticBanners = [
//     {
//       _id: "banner-1",
//       image: Builds,
//       title: "Welcome to Our Store",
//       description: "Discover amazing products at unbeatable prices",
//       buttonText: "Shop Now",
//       // buttonLink: "/products",
//       isActive: true,
//       order: 1,
//       textPosition: "center",
//       textColor: "dark"
//     },
//   ];

//   // Determine text alignment classes based on position
//   const getTextAlignment = (position) => {
//     switch (position) {
//       case "left":
//         return "text-start align-items-start";
//       case "right":
//         return "text-end align-items-end";
//       case "center":
//       default:
//         return "text-center align-items-center";
//     }
//   };

//   // Get appropriate text color class
//   const getTextColor = (color) => {
//     return color === "light" ? "text-white" : "text-dark";
//   };

//   return (
//     <div className="px-0 Virtualtryonhome-container-width mt-5">
//       <div className="position-relative banner-container">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation, EffectFade]}
//           pagination={{ 
//             clickable: true,
//             dynamicBullets: true,
//             renderBullet: function (index, className) {
//               return `<span class="${className}"></span>`;
//             }
//           }}
//           navigation={{
//             nextEl: '.swiper-button-next',
//             prevEl: '.swiper-button-prev',
//           }}
//           autoplay={{ 
//             delay: 4000, // Increased for better UX
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true 
//           }}
//           speed={800}
//           loop={true}
//           spaceBetween={0}
//           centeredSlides={true}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           grabCursor={true}
//           className="banner-swiper"
//         >
//           {staticBanners
//             .filter(banner => banner.isActive)
//             .sort((a, b) => (a.order || 0) - (b.order || 0))
//             .map((banner) => (
//               <SwiperSlide key={banner._id}>
//                 <div className="banner-slide position-relative overflow-hidden">
//                   {/* Banner Image with responsive sizing */}
//                   <div className="banner-image-wrapper">
//                     <img
//                       src={banner.image}
//                       alt={banner.title || "Banner"}
//                       className="img-fluid w-100 margin-left-for-Virtualtryonhome"
//                       loading="lazy"
//                       onError={(e) => {
//                         e.currentTarget.src = "https://via.placeholder.com/1920x600/0077b6/ffffff?text=Joyory+Banner";
//                         e.currentTarget.onerror = null;
//                       }}
//                     />
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//         </Swiper>

//         {/* Custom Pagination */}
//         <div className="swiper-pagination"></div>

//         {/* Custom Navigation Buttons */}
//         {windowWidth > 768 && (
//           <>
//             <div className="swiper-button-prev"></div>
//             <div className="swiper-button-next"></div>
//           </>
//         )}
//       </div>

//       {/* CSS for banner slider - Responsive Design */}
//       <style jsx="true">{`
//         .banner-container {
//           margin: 0 auto;
//           max-width: 1920px;
//         }
        
//         .banner-swiper {
//           border-radius: 12px;
//           overflow: hidden;
//           // box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
//         }
        
//         .banner-image-wrapper {
//           position: relative;
//           width: 100%;
//           height: 0;
//           padding-bottom: 33.33%; /* 3:1 Aspect Ratio */
//           overflow: hidden;
//         }
        
//         .banner-image {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           object-position: center;
//         }
        
//         .banner-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           display: flex;
//           align-items: center;
//           background: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1));
//         }
        
//         .banner-content {
//           background: rgba(255, 255, 255, 0.9);
//           border-radius: 12px;
//           backdrop-filter: blur(5px);
//           max-width: 600px;
//         }
        
//         .banner-title {
//           font-size: clamp(1.5rem, 4vw, 3rem);
//           line-height: 1.2;
//         }
        
//         .banner-description {
//           font-size: clamp(0.9rem, 2vw, 1.25rem);
//           line-height: 1.5;
//         }
        
//         .swiper-pagination {
//           bottom: 20px !important;
//         }
        
//         .swiper-pagination-bullet {
//           width: 10px;
//           height: 10px;
//           background: rgba(255, 255, 255, 0.5);
//           opacity: 1;
//           transition: all 0.3s ease;
//         }
        
//         .swiper-pagination-bullet-active {
//           background: #007bff;
//           width: 30px;
//           border-radius: 6px;
//         }
        
//         .swiper-button-next, .swiper-button-prev {
//           // background: rgba(255, 255, 255, 0.9);
//           width: 48px;
//           height: 48px;
//           border-radius: 50%;
//           // box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//           transition: all 0.3s ease;
//         }
        
//         .swiper-button-next:after, .swiper-button-prev:after {
//           font-size: 18px;
//           color: #333;
//           font-weight: bold;
//         }
        
//         .swiper-button-next:hover, .swiper-button-prev:hover {
//           background: rgba(255, 255, 255, 1);
//           transform: scale(1.1);
//         }
        
//         /* Mobile Styles */
//         @media (max-width: 768px) {
//           .banner-container {
//             padding: 0 5px;
//           }
          
//           .banner-swiper {
//             border-radius: 8px;
//           }
          
//           .banner-image-wrapper {
//             padding-bottom: 50%; /* 2:1 Aspect Ratio for mobile */
//           }
          
//           .banner-content {
//             background: rgba(255, 255, 255, 0.95);
//             padding: 20px !important;
//             margin: 10px;
//           }
          
//           .banner-title {
//             font-size: 1.5rem !important;
//             margin-bottom: 8px !important;
//           }
          
//           .banner-description {
//             font-size: 0.95rem !important;
//             margin-bottom: 16px !important;
//           }
          
//           .btn-lg {
//             padding: 8px 20px !important;
//             font-size: 0.95rem !important;
//           }
          
//           .swiper-pagination-bullet {
//             width: 8px;
//             height: 8px;
//           }
          
//           .swiper-pagination-bullet-active {
//             width: 20px;
//           }
//         }
        
//         /* Tablet Styles */
//         @media (min-width: 769px) and (max-width: 1024px) {
//           .banner-image-wrapper {
//             padding-bottom: 40%; /* 2.5:1 Aspect Ratio for tablet */
//           }
          
//           .banner-content {
//             padding: 30px !important;
//           }
          
//           .banner-title {
//             font-size: 2rem !important;
//           }
          
//           .banner-description {
//             font-size: 1.1rem !important;
//           }
//         }
        
//         /* Desktop Styles */
//         @media (min-width: 1025px) {
//           .banner-content {
//             padding: 40px !important;
//           }
//         }
        
//         /* Dark mode support */
//         @media (prefers-color-scheme: dark) {
//           .banner-content {
//             background: rgba(30, 30, 30, 0.9);
//           }
          
//           .text-dark {
//             color: #f8f9fa !important;
//           }
          
//           .swiper-button-next, .swiper-button-prev {
//             background: rgba(30, 30, 30, 0.9);
//           }
          
//           .swiper-button-next:after, .swiper-button-prev:after {
//             color: #f8f9fa;
//           }
//         }
        
//         /* Accessibility - Focus styles */
//         .swiper-button-next:focus,
//         .swiper-button-prev:focus,
//         .btn:focus {
//           outline: 2px solid #007bff;
//           outline-offset: 2px;
//         }
        
//         /* Animation for banner content */
//         .banner-content {
//           animation: fadeInUp 0.6s ease-out;
//         }
        
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Build;




















import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Build.css";

const FEATURE_BANNER_API = "https://beauty.joyory.com/api/user/categories/category/skin/landing";

const FeatureBanners = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners
  const fetchFeatureBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get(FEATURE_BANNER_API, { withCredentials: true });
      
      console.log("Feature Banners API Response:", data);

      // Handle different possible response structures
      const featureBanners = data.featureBanners || data.data?.featureBanners || [];
      setBanners(Array.isArray(featureBanners) ? featureBanners : []);
      
    } catch (err) {
      console.error("Failed to fetch feature banners:", err);
      setError("Failed to load banners. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatureBanners();
  }, [fetchFeatureBanners]);

  // Handle banner click with smart navigation
  const handleBannerClick = useCallback((banner) => {
    console.log("Banner clicked:", banner);

    const link = banner.link || banner.image?.[0]?.link;

    if (!link) {
      console.warn("No link found for banner:", banner.title);
      return;
    }

    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  }, [navigate]);

  // Get banner image URL safely
  const getBannerImage = (banner) => {
    if (banner.image?.[0]?.url) return banner.image[0].url;
    if (typeof banner.image === "string") return banner.image;
    return "/placeholder-banner.jpg";
  };

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading banners...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || banners.length === 0) {
    return null; // Hide section if error or no banners
  }

  return (
    <section className="feature-banners py-2 bg-white">
      <div className="container-fluid-lg p-0 ms-lg-4">
        {banners.map((banner, index) => (
          <div
            key={banner._id || index}
            className="feature-banner-card mb-5 mobile-responsive-code"
            onClick={() => handleBannerClick(banner)}
            style={{ cursor: "pointer" }}
          >
            <div className="border-0 overflow-hidden">
              <div className="row g-0 align-items-center flex-row-reverse">



                 {/* Image Side */}
                <div className="col-lg-6 order-1 order-lg-2">
                  <div className="">
                    <img
                      src={getBannerImage(banner)}
                      alt={banner.title || "Feature"}
                      className="img-fluid banner-image-quiz-margin-padding"
                      // style={{
                      //   height: "auto",
                      //   objectFit: "cover",
                      // }}
                      onError={(e) => {
                        e.target.src = "/placeholder-banner.jpg";
                        e.target.style.objectFit = "contain";
                        e.target.style.padding = "40px";
                        e.target.style.background = "#f8f9fa";
                      }}
                    />
                    
                    {/* Subtle overlay gradient for better text readability on mobile */}
                    {/* <div className="d-lg-none position-absolute bottom-0 start-0 w-100 h-50" 
                    /> */}
                  </div>
                </div>




                
                {/* Content Side */}
                <div className="col-lg-6 pt-lg-4 pt-3 p-lg-5 order-2 order-lg-1">

                  {banner.description && (
                    <p className="description-responsive text-black mb-4 page-title-main-name ms-lg-4 ms-2 build-font-size w-100" style={{ fontWeight:'500', lineHeight: 1.6 }}>
                      {banner.description}
                    </p>
                  )}

                  {(banner.buttonText || banner.link) && (
                    <button 
                      // className="btn btn-dark btn-lg px-5 py-3 fw-semibold"
                      className="quize-btn quize-btn-responsive mb-0 cursor-pointer mt-2 ms-lg-4 mt-lg-5 ms-lg-0 ms-4 page-title-main-name"
                      style={{ fontSize: "1.05rem" }}
                    >
                      {banner.buttonText}
                    </button>
                  )}
                </div>




              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureBanners;