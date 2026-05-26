// // src/components/BannerSlider.jsx
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../App.css";

// // Import your banner images
// import banner1 from "../assets/banner.jpg";
// import banner2 from "../assets/affiliate-hero.png";

// const BannerSlider = () => {
//   const navigate = useNavigate();

//   // Static banners data
//   const staticBanners = [
//     {
//       _id: "banner-1",
//       image: banner1,
//       isActive: true,
//       order: 1,
//     },
//     {
//       _id: "banner-2",
//       image: banner2,
//       isActive: true,
//       order: 2,
//     },
//   ];

//   return (
//     <div className="container p-0">
//       <div className="position-relative">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
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
//             delay: 2000, 
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true 
//           }}
//           speed={800}
//           loop={true}
//           spaceBetween={0}
//           centeredSlides={true}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           breakpoints={{
//             300: { 
//               slidesPerView: 1,
//               spaceBetween: 0
//             },
//             576: { 
//               slidesPerView: 1,
//               spaceBetween: 0
//             },
//             768: { 
//               slidesPerView: 1,
//               spaceBetween: 0
//             },
//             992: { 
//               slidesPerView: 1,
//               spaceBetween: 0
//             },
//             1200: { 
//               slidesPerView: 1,
//               spaceBetween: 0
//             },
//           }}
//           className="banner-swiper"
//         >
//           {staticBanners
//             .filter(banner => banner.isActive)
//             .sort((a, b) => (a.order || 0) - (b.order || 0))
//             .map((banner) => (
//               <SwiperSlide key={banner._id}>
//                 <div 
//                   className="banner-slide position-relative overflow-hidden rounded-3"
//                 >
//                   {/* Banner Image */}
//                   <img
//                     src={banner.image}
//                     alt={banner.title || "Banner"}
//                     className=" img-fluid"
//                     style={{
//                       objectFit: 'cover',
//                       height: window.innerWidth <= 768 ? '300px' : '500px',
//                       width: '100%'
//                     }}
//                     onError={(e) => {
//                       e.currentTarget.src = "https://via.placeholder.com/1200x500/0077b6/ffffff?text=Joyory+Banner";
//                       e.currentTarget.onerror = null; // Prevent infinite loop
//                     }}
//                   />

//                   {/* Banner Overlay Content */}
//                   <div className="banner-content position-absolute d-flex flex-column justify-content-center align-items-start p-4 p-lg-5"
//                   >

//                   </div>

//                   </div>
//               </SwiperSlide>
//             ))}
//         </Swiper>


//         {/* Custom Pagination */}
//         <div className="swiper-pagination" style={{ bottom: '20px' }}></div>
//       </div>

//       {/* CSS for banner slider */}
//       <style jsx="true">{`
//         .banner-swiper {
//           border-radius: 16px;
//           overflow: hidden;
//           box-shadow: 0 10px 40px rgba(0,0,0,0.1);
//         }

//         .banner-slide {
//           transition: transform 0.3s ease;
//         }

//         .banner-slide:hover {
//           transform: scale(1.01);
//         }

//         .swiper-pagination-bullet {
//           width: 12px;
//           height: 12px;
//           background: rgba(255, 255, 255, 0.5);
//           opacity: 1;
//         }

//         .swiper-pagination-bullet-active {
//           background: #FFFFFF;
//           width: 30px;
//           border-radius: 6px;
//         }

//         .swiper-button-next, .swiper-button-prev {
//           background: rgba(0, 0, 0, 0.2);
//           width: 50px;
//           height: 50px;
//           border-radius: 50%;
//           backdrop-filter: blur(5px);
//         }

//         .swiper-button-next:after, .swiper-button-prev:after {
//           font-size: 20px;
//           font-weight: bold;
//         }

//         .swiper-button-next:hover, .swiper-button-prev:hover {
//           background: rgba(0, 0, 0, 0.4);
//         }

//         @media (max-width: 768px) {
//           .banner-content {
//             padding: 20px !important;
//           }

//           .banner-title {
//             font-size: 1.8rem !important;
//             margin-bottom: 10px !important;
//           }

//           .banner-description {
//             font-size: 1rem !important;
//             margin-bottom: 15px !important;
//           }

//           .swiper-button-next, .swiper-button-prev {
//             display: none;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BannerSlider;





//=============================================================Done_code(Start)=================================================================================





// // src/components/BannerSlider.jsx
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
// import banner1 from "../assets/banner.jpg";
// import banner2 from "../assets/affiliate-hero.png";

// const BannerSlider = () => {
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
//       image: banner1,
//       title: "Welcome to Our Store",
//       description: "Discover amazing products at unbeatable prices",
//       buttonText: "Shop Now",
//       buttonLink: "/products",
//       isActive: true,
//       order: 1,
//       textPosition: "center",
//       textColor: "dark"
//     },
//     // {
//     //   _id: "banner-2",
//     //   image: banner2,
//     //   title: "Summer Sale",
//     //   description: "Up to 50% off on all items. Limited time offer!",
//     //   buttonText: "Explore Deals",
//     //   buttonLink: "/deals",
//     //   isActive: true,
//     //   order: 2,
//     //   textPosition: "right",
//     //   textColor: "light"
//     // },
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
//     <div className="px-0 Virtualtryonhome-container-width">
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

//                   {/* Banner Overlay Content - Responsive positioning */}
//                   {/* <div className={`banner-overlay ${getTextAlignment(banner.textPosition)}`}>
//                     <div className="container">
//                       <div className="row">
//                         <div className={`col-12 col-md-10 col-lg-8 mx-auto ${getTextAlignment(banner.textPosition).includes('start') ? 'ms-0' : getTextAlignment(banner.textPosition).includes('end') ? 'ms-auto' : ''}`}>
//                           <div className={`banner-content p-3 p-md-4 p-lg-5 ${getTextColor(banner.textColor)}`}>
//                             {banner.title && (
//                               <h1 className="banner-title fw-bold mb-2 mb-md-3">
//                                 {windowWidth <= 768 ? (
//                                   <>
//                                     {banner.title.split(' ').slice(0, 3).join(' ')}
//                                     {banner.title.split(' ').length > 3 && '...'}
//                                   </>
//                                 ) : (
//                                   banner.title
//                                 )}
//                               </h1>
//                             )}
//                             {banner.description && (
//                               <p className="banner-description mb-3 mb-md-4">
//                                 {windowWidth <= 768 ? (
//                                   <>
//                                     {banner.description.length > 60 
//                                       ? `${banner.description.substring(0, 60)}...`
//                                       : banner.description}
//                                   </>
//                                 ) : (
//                                   banner.description
//                                 )}
//                               </p>
//                             )}
//                             {banner.buttonText && (
//                               <button
//                                 className="btn btn-primary btn-lg px-4 py-2 py-md-3"
//                                 onClick={() => banner.buttonLink && navigate(banner.buttonLink)}
//                                 aria-label={banner.buttonText}
//                               >
//                                 {banner.buttonText}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div> */}
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

// export default BannerSlider;








// // src/components/BannerSlider.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import "../App.css";

// const BannerSlider = () => {
//   const navigate = useNavigate();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // 🔥 FETCH BANNERS FROM API (Same pattern as Virtualtryonhome)
//   const fetchBanners = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('🔥 Fetching Feature Banners for Slider...');

//       const { data } = await axios.get(
//         'https://beauty.joyory.com/api/user/categories/category/makeup/landing',
//         { withCredentials: true }
//       );

//       console.log('✅ API Response:', data);

//       // 🔥 GET FEATURE BANNERS ARRAY
//       const featureBanners = data.featureBanners || data.data?.featureBanners || [];

//       // 🔥 FILTER FOR SHADE FINDER BANNERS ONLY (or use all active banners)
//       const shadeFinderBanners = featureBanners.filter(banner => 
//         banner.type === 'shadeFinder' && banner.image?.[0]?.url
//       );

//       // 🔥 MAP API DATA TO SLIDER FORMAT
//       const mappedBanners = shadeFinderBanners.map((banner, index) => ({
//         _id: banner._id || `banner-${index}`,
//         image: banner.image[0].url,
//         title: banner.title || "",
//         description: banner.description || "",
//         buttonText: banner.buttonText || "",
//         buttonLink: banner.link || banner.image?.[0]?.link || "",
//         isActive: true,
//         order: index + 1,
//         textPosition: "center",
//         textColor: "dark"
//       }));

//       setBanners(mappedBanners);
//       console.log('✅ ShadeFinder Banners Loaded:', mappedBanners);

//     } catch (err) {
//       console.error('❌ Failed to fetch banners:', err);
//       setBanners([]); // Empty array on error
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBanners();
//   }, [fetchBanners]);

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

//   // 🔥 SHOW LOADING WHILE FETCHING
//   if (loading) {
//     return (
//       <div className="px-0 Virtualtryonhome-container-width">
//         <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '400px' }}>
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading banners...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 🔥 HIDE IF NO BANNERS
//   if (banners.length === 0) {
//     return null;
//   }

//   return (
//     <div className="px-0 Virtualtryonhome-container-width">
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
//             delay: 4000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true 
//           }}
//           speed={800}
//           loop={banners.length > 1} // Only loop if multiple banners
//           spaceBetween={0}
//           centeredSlides={true}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           grabCursor={true}
//           className="banner-swiper"
//         >
//           {banners
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
//         {windowWidth > 768 && banners.length > 1 && (
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
//         }

//         .banner-image-wrapper {
//           position: relative;
//           width: 100%;
//           height: 0;
//           padding-bottom: 33.33%;
//           overflow: hidden;
//         }

//         .banner-image-wrapper img {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
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
//           width: 48px;
//           height: 48px;
//           border-radius: 50%;
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
//             padding-bottom: 50%;
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
//             padding-bottom: 40%;
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

// export default BannerSlider;




















// // src/components/BannerSlider.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import "../App.css";
// import "../css/Bannerslider.css";

// const BannerSlider = () => {
//   const navigate = useNavigate();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // 🔥 FETCH ALL FEATURE BANNERS FROM API
//   const fetchBanners = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('🔥 Fetching All Feature Banners for Slider...');

//       const { data } = await axios.get(
//         'https://beauty.joyory.com/api/user/categories/category/makeup/landing',
//         { withCredentials: true }
//       );

//       console.log('✅ API Response:', data);

//       // Extract featureBanners safely
//       const featureBanners = data.featureBanners || data.data?.featureBanners || [];

//       // Map all valid banners to slider format
//       const mappedBanners = featureBanners
//         .filter(banner => banner.image?.[0]?.url) // Only banners with image
//         .map((banner, index) => ({
//           _id: banner._id || `banner-${index}`,
//           image: banner.image[0].url,
//           title: banner.title || "",
//           description: banner.description || "",
//           buttonText: banner.buttonText || "Shop Now",
//           buttonLink: banner.link || "",
//           isActive: true,
//           order: index + 1,
//           textPosition: "center",
//           textColor: "dark"
//         }));

//       setBanners(mappedBanners);
//       console.log(`✅ Loaded ${mappedBanners.length} banners for slider`);

//     } catch (err) {
//       console.error('❌ Failed to fetch banners:', err);
//       setBanners([]); 
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBanners();
//   }, [fetchBanners]);

//   // Text alignment helper
//   const getTextAlignment = (position) => {
//     switch (position) {
//       case "left": return "text-start align-items-start";
//       case "right": return "text-end align-items-end";
//       case "center":
//       default: return "text-center align-items-center";
//     }
//   };

//   const getTextColor = (color) => (color === "light" ? "text-white" : "text-dark");

//   // Loading State
//   if (loading) {
//     return (
//       <div className="px-0 Virtualtryonhome-container-width">
//         <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '400px' }}>
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading banners...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Hide if no banners
//   if (banners.length === 0) {
//     return null;
//   }

//   return (
//     <div className="px-0 Virtualtryonhome-container-width">
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
//             delay: 4000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true 
//           }}
//           speed={800}
//           loop={banners.length > 1}
//           spaceBetween={0}
//           centeredSlides={true}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           grabCursor={true}
//           className="banner-swiper"
//         >
//           {banners
//             .filter(banner => banner.isActive)
//             .sort((a, b) => (a.order || 0) - (b.order || 0))
//             .map((banner) => (
//               <SwiperSlide key={banner._id}>
//                 <div className="banner-slide position-relative overflow-hidden">
//                   <div className="banner-image-wrapper">
//                     <img
//                       src={banner.image}
//                       alt={banner.title || "Joyory Banner"}
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
//         {windowWidth > 768 && banners.length > 1 && (
//           <>
//             <div className="swiper-button-prev"></div>
//             <div className="swiper-button-next"></div>
//           </>
//         )}
//       </div>

//       {/* Full CSS Block */}
//       <style jsx="true">{`
//         .banner-container {
//           margin: 0 auto;
//           max-width: 1920px;
//         }

//         .banner-swiper {
//           border-radius: 12px;
//           overflow: hidden;
//         }

//         .banner-image-wrapper {
//           position: relative;
//           width: 100%;
//           height: 0;
//           padding-bottom: 33.33%;
//           overflow: hidden;
//         }

//         .banner-image-wrapper img {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
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
//           width: 48px;
//           height: 48px;
//           border-radius: 50%;
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
//             padding-bottom: 50%;
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
//         @media (min-width: 769px) && (max-width: 1024px) {
//           .banner-image-wrapper {
//             padding-bottom: 40%;
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

//         /* Accessibility */
//         .swiper-button-next:focus,
//         .swiper-button-prev:focus {
//           outline: 2px solid #007bff;
//           outline-offset: 2px;
//         }

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

// export default BannerSlider;

















// // src/components/BannerSlider.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import "../css/Bannerslider.css"; // Import the separated CSS file

// const BannerSlider = () => {
//   const navigate = useNavigate();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch all banners from API
//   const fetchBanners = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('🔥 Fetching All Feature Banners...');

//       const { data } = await axios.get(
//         'https://beauty.joyory.com/api/user/categories/category/makeup/landing',
//         { withCredentials: true }
//       );

//       console.log('✅ API Response:', data);

//       const featureBanners = data.featureBanners || data.data?.featureBanners || [];

//       const allBanners = [];

//       featureBanners.forEach((banner, bannerIndex) => {
//         if (banner.image && Array.isArray(banner.image) && banner.image.length > 0) {
//           banner.image.forEach((img, imgIndex) => {
//             if (img.url) {
//               allBanners.push({
//                 _id: `${banner._id || 'banner'}-${bannerIndex}-${imgIndex}`,
//                 image: img.url,
//                 title: imgIndex === 0 ? (banner.title || "") : "",
//                 description: imgIndex === 0 ? (banner.description || "") : "",
//                 buttonText: imgIndex === 0 ? (banner.buttonText || "") : "",
//                 buttonLink: img.link || banner.link || "",
//                 isActive: true,
//                 order: allBanners.length + 1,
//                 textPosition: "center",
//                 textColor: "dark",
//                 bannerType: banner.type
//               });
//             }
//           });
//         } else if (typeof banner.image === "string" && banner.image) {
//           allBanners.push({
//             _id: banner._id || `banner-${bannerIndex}`,
//             image: banner.image,
//             title: banner.title || "",
//             description: banner.description || "",
//             buttonText: banner.buttonText || "",
//             buttonLink: banner.link || "",
//             isActive: true,
//             order: allBanners.length + 1,
//             textPosition: "center",
//             textColor: "dark",
//             bannerType: banner.type
//           });
//         }
//       });

//       setBanners(allBanners);
//       console.log('✅ All Banners Loaded:', allBanners);
//       console.log(`📊 Total Slides: ${allBanners.length} (from ${featureBanners.length} banners)`);

//     } catch (err) {
//       console.error('❌ Failed to fetch banners:', err);
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBanners();
//   }, [fetchBanners]);

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

//   const getTextColor = (color) => {
//     return color === "light" ? "text-white" : "text-dark";
//   };

//   if (loading) {
//     return (
//       <div className="px-0 Virtualtryonhome-container-width">
//         <div className="banner-loading">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading banners...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (banners.length === 0) {
//     return null;
//   }

//   return (
//     <div className="px-0 Virtualtryonhome-container-width">
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
//             delay: 4000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true 
//           }}
//           speed={800}
//           loop={banners.length > 1}
//           spaceBetween={0}
//           centeredSlides={true}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           grabCursor={true}
//           className="banner-swiper"
//         >
//           {banners
//             .filter(banner => banner.isActive)
//             .sort((a, b) => (a.order || 0) - (b.order || 0))
//             .map((banner) => (
//               <SwiperSlide key={banner._id}>
//                 <div className="banner-slide position-relative overflow-hidden">
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

//                   {(banner.title || banner.description || banner.buttonText) && (
//                     <div className={`banner-overlay ${getTextAlignment(banner.textPosition)}`}>
//                       <div className="container">
//                         <div className="row">
//                           <div className={`col-12 col-md-10 col-lg-8 mx-auto ${getTextAlignment(banner.textPosition).includes('start') ? 'ms-0' : getTextAlignment(banner.textPosition).includes('end') ? 'ms-auto' : ''}`}>
//                             <div className={`banner-content p-3 p-md-4 p-lg-5 ${getTextColor(banner.textColor)}`}>
//                               {banner.title && (
//                                 <h1 className="banner-title fw-bold mb-2 mb-md-3">
//                                   {windowWidth <= 768 ? (
//                                     <>
//                                       {banner.title.split(' ').slice(0, 3).join(' ')}
//                                       {banner.title.split(' ').length > 3 && '...'}
//                                     </>
//                                   ) : (
//                                     banner.title
//                                   )}
//                                 </h1>
//                               )}
//                               {banner.description && (
//                                 <p className="banner-description mb-3 mb-md-4">
//                                   {windowWidth <= 768 ? (
//                                     <>
//                                       {banner.description.length > 60 
//                                         ? `${banner.description.substring(0, 60)}...`
//                                         : banner.description}
//                                     </>
//                                   ) : (
//                                     banner.description
//                                   )}
//                                 </p>
//                               )}
//                               {banner.buttonText && (
//                                 <button
//                                   className="btn btn-primary btn-lg px-4 py-2 py-md-3"
//                                   onClick={() => banner.buttonLink && navigate(banner.buttonLink)}
//                                   aria-label={banner.buttonText}
//                                 >
//                                   {banner.buttonText}
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </SwiperSlide>
//             ))}
//         </Swiper>

//         <div className="swiper-pagination"></div>

//         {windowWidth > 768 && banners.length > 1 && (
//           <>
//             <div className="swiper-button-prev"></div>
//             <div className="swiper-button-next"></div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BannerSlider;










// // src/components/BannerSlider.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import "../css/Bannerslider.css";

// const BannerSlider = () => {
//   const navigate = useNavigate();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // 🔥 FETCH ONLY SHADE FINDER BANNERS FROM API
//   const fetchShadeFinderBanners = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('🔥 Fetching Shade Finder Banners...');

//       const { data } = await axios.get(
//         'https://beauty.joyory.com/api/user/categories/category/makeup/landing',
//         { withCredentials: true }
//       );

//       console.log('✅ API Response:', data);

//       // 🔥 GET FEATURE BANNERS ARRAY
//       const featureBanners = data.featureBanners || data.data?.featureBanners || [];

//       // 🔥 FILTER ONLY SHADE FINDER TYPE BANNERS
//       const shadeFinderBanners = featureBanners.filter(
//         banner => banner.type === 'shadeFinder'
//       );

//       console.log('🎯 ShadeFinder Banners Found:', shadeFinderBanners.length);

//       // 🔥 PROCESS ONLY SHADE FINDER BANNERS - SUPPORT MULTIPLE IMAGES
//       const allBanners = [];

//       shadeFinderBanners.forEach((banner, bannerIndex) => {
//         // Check if banner has multiple images
//         if (banner.image && Array.isArray(banner.image) && banner.image.length > 0) {
//           // Create a slide for each image in the banner
//           banner.image.forEach((img, imgIndex) => {
//             if (img.url) {
//               allBanners.push({
//                 _id: `${banner._id || 'shadeFinder'}-${bannerIndex}-${imgIndex}`,
//                 image: img.url,
//                 title: imgIndex === 0 ? (banner.title || "") : "",
//                 description: imgIndex === 0 ? (banner.description || "") : "",
//                 buttonText: imgIndex === 0 ? (banner.buttonText || "") : "",
//                 buttonLink: img.link || banner.link || "",
//                 isActive: true,
//                 order: allBanners.length + 1,
//                 textPosition: "center",
//                 textColor: "dark",
//                 bannerType: banner.type
//               });
//             }
//           });
//         } else if (typeof banner.image === "string" && banner.image) {
//           // Single image as string
//           allBanners.push({
//             _id: banner._id || `shadeFinder-${bannerIndex}`,
//             image: banner.image,
//             title: banner.title || "",
//             description: banner.description || "",
//             buttonText: banner.buttonText || "",
//             buttonLink: banner.link || "",
//             isActive: true,
//             order: allBanners.length + 1,
//             textPosition: "center",
//             textColor: "dark",
//             bannerType: banner.type
//           });
//         }
//       });

//       setBanners(allBanners);
//       console.log('✅ ShadeFinder Slides Created:', allBanners.length);

//     } catch (err) {
//       console.error('❌ Failed to fetch shade finder banners:', err);
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchShadeFinderBanners();
//   }, [fetchShadeFinderBanners]);

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

//   const getTextColor = (color) => {
//     return color === "light" ? "text-white" : "text-dark";
//   };

//   if (loading) {
//     return (
//       <div className="px-0 Virtualtryonhome-container-width">
//         <div className="banner-loading">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading shade finder...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 🔥 HIDE IF NO SHADE FINDER BANNERS FOUND
//   if (banners.length === 0) {
//     console.log('⚠️ No shade finder banners available');
//     return null;
//   }

//   return (
//     <div className="px-lg-5 px-4 py- container-lg-fluid ">
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
//             delay: 4000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true
//           }}
//           speed={800}
//           loop={banners.length > 1}
//           spaceBetween={0}
//           centeredSlides={true}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           grabCursor={true}
//           className="banner-swiper"
//         >
//           {banners
//             .filter(banner => banner.isActive)
//             .sort((a, b) => (a.order || 0) - (b.order || 0))
//             .map((banner) => (
//               <SwiperSlide key={banner._id} modules={[Autoplay, Pagination, Navigation, EffectFade]} autoplay={{
//                 delay: 3000,
//                 disableOnInteraction: false,
//                 pauseOnMouseEnter: true,
//               }}

//                 onSwiper={(swiper) => {
//                   setTimeout(() => {
//                     swiper.autoplay.start();
//                   }, 500);
//                 }}

//                 speed={1000}
//                 loop={banners.length > 1}
//                 spaceBetween={0}
//                 centeredSlides={true}

//                 pagination={{
//                   clickable: true,
//                   dynamicBullets: true,
//                 }}

//                 navigation={{
//                   nextEl: '.swiper-button-next',
//                   prevEl: '.swiper-button-prev',
//                 }}

//                 effect="fade"
//                 fadeEffect={{ crossFade: true }}
//                 grabCursor={true}
//                 className="banner-swiper">
//                 <div className="banner-slide position-relative overflow-hidden">
//                   <div className="banner-image-wrapper">
//                     <img
//                       src={banner.image}
//                       alt={banner.title || "Shade Finder"}
//                       className="img-fluid w-100 margin-left-for-Virtualtryonhome"
//                       loading="lazy"
//                       onError={(e) => {
//                         e.currentTarget.src = "https://via.placeholder.com/1920x600/764ba2/ffffff?text=Shade+Finder";
//                         e.currentTarget.onerror = null;
//                       }}
//                     />
//                   </div>

//                   {/* {(banner.title || banner.description || banner.buttonText) && (
//                     <div className={`banner-overlay ${getTextAlignment(banner.textPosition)}`}>
//                       <div className="container">
//                         <div className="row">
//                           <div className={`col-12 col-md-10 col-lg-8 mx-auto ${getTextAlignment(banner.textPosition).includes('start') ? 'ms-0' : getTextAlignment(banner.textPosition).includes('end') ? 'ms-auto' : ''}`}>
//                             <div className={`banner-content p-3 p-md-4 p-lg-5 ${getTextColor(banner.textColor)}`}>
//                               {banner.title && (
//                                 <h1 className="banner-title fw-bold mb-2 mb-md-3">
//                                   {windowWidth <= 768 ? (
//                                     <>
//                                       {banner.title.split(' ').slice(0, 3).join(' ')}
//                                       {banner.title.split(' ').length > 3 && '...'}
//                                     </>
//                                   ) : (
//                                     banner.title
//                                   )}
//                                 </h1>
//                               )}
//                               {banner.description && (
//                                 <p className="banner-description mb-3 mb-md-4">
//                                   {windowWidth <= 768 ? (
//                                     <>
//                                       {banner.description.length > 60
//                                         ? `${banner.description.substring(0, 60)}...`
//                                         : banner.description}
//                                     </>
//                                   ) : (
//                                     banner.description
//                                   )}
//                                 </p>
//                               )}
//                               {banner.buttonText && (
//                                 <button
//                                   className="btn btn-primary btn-lg px-4 py-2 py-md-3"
//                                   onClick={() => banner.buttonLink && navigate(banner.buttonLink)}
//                                   aria-label={banner.buttonText}
//                                 >
//                                   {banner.buttonText}
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )} */}
//                 </div>
//               </SwiperSlide>
//             ))}
//         </Swiper>

//         <div className="swiper-pagination"></div>

//         {windowWidth > 768 && banners.length > 1 && (
//           <>
//             <div className="swiper-button-prev"></div>
//             <div className="swiper-button-next"></div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BannerSlider;














// // src/components/BannerSlider.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import "../css/Bannerslider.css";

// const BannerSlider = () => {
//   const navigate = useNavigate();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch and process Shade Finder Banners
//   const fetchShadeFinderBanners = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('🔥 Fetching Shade Finder Banners...');

//       const { data } = await axios.get(
//         'https://beauty.joyory.com/api/user/categories/category/makeup/landing',
//         { withCredentials: true }
//       );

//       console.log('✅ API Response:', data);

//       // Get featureBanners safely
//       const featureBanners = data.featureBanners || data.data?.featureBanners || [];

//       // Filter only shadeFinder type
//       const shadeFinderBanners = featureBanners.filter(
//         banner => banner.type === 'shadeFinder'
//       );

//       console.log('🎯 ShadeFinder Banners Found:', shadeFinderBanners.length);

//       const allSlides = [];

//       shadeFinderBanners.forEach((banner, bannerIndex) => {
//         const images = banner.image || [];

//         if (Array.isArray(images) && images.length > 0) {
//           // Support multiple images per banner
//           images.forEach((img, imgIndex) => {
//             if (img?.url) {
//               allSlides.push({
//                 _id: `${banner._id || 'shade'}-${bannerIndex}-${imgIndex}`,
//                 image: img.url,
//                 title: imgIndex === 0 ? (banner.title || "") : "",
//                 description: imgIndex === 0 ? (banner.description || "") : "",
//                 buttonText: imgIndex === 0 ? (banner.buttonText || "Shop Now") : "",
//                 buttonLink: img.link || banner.link || "",   // Individual image link has priority
//                 bannerType: banner.type,
//                 isActive: true,
//               });
//             }
//           });
//         } 
//         else if (typeof banner.image === "string" && banner.image) {
//           // Fallback for old single string image
//           allSlides.push({
//             _id: banner._id || `shade-${bannerIndex}`,
//             image: banner.image,
//             title: banner.title || "",
//             description: banner.description || "",
//             buttonText: banner.buttonText || "Shop Now",
//             buttonLink: banner.link || "",
//             bannerType: banner.type,
//             isActive: true,
//           });
//         }
//       });

//       setBanners(allSlides);
//       console.log('✅ Final ShadeFinder Slides Created:', allSlides.length);
//     } catch (err) {
//       console.error('❌ Failed to fetch shade finder banners:', err);
//       setBanners([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchShadeFinderBanners();
//   }, [fetchShadeFinderBanners]);

//   // Handle click on banner / button
//   const handleBannerClick = (link) => {
//     if (!link) return;
    
//     if (link.startsWith("http")) {
//       window.open(link, "_blank", "noopener,noreferrer");
//     } else {
//       navigate(link);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="px-0 Virtualtryonhome-container-width">
//         <div className="banner-loading">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading shade finder...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (banners.length === 0) {
//     console.log('⚠️ No shade finder banners available');
//     return null;
//   }

//   return (
//     <div className="px-lg-5 px-4 py- container-lg-fluid">
//       <div className="position-relative banner-container">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation, EffectFade]}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           navigation={{
//             nextEl: '.swiper-button-next',
//             prevEl: '.swiper-button-prev',
//           }}
//           autoplay={{
//             delay: 4000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true,
//           }}
//           speed={800}
//           loop={banners.length > 1}
//           spaceBetween={0}
//           centeredSlides={true}
//           effect="fade"
//           fadeEffect={{ crossFade: true }}
//           grabCursor={true}
//           className="banner-swiper"
//         >
//           {banners.map((banner) => (
//             <SwiperSlide key={banner._id}>
//               <div 
//                 className="banner-slide position-relative overflow-hidden cursor-pointer"
//                 onClick={() => handleBannerClick(banner.buttonLink)}
//               >
//                 <div className="banner-image-wrapper">
//                   <img
//                     src={banner.image}
//                     alt={banner.title || "Shade Finder"}
//                     className="img-fluid w-100 margin-left-for-Virtualtryonhome"
//                     loading="lazy"
//                     onError={(e) => {
//                       e.currentTarget.src = "https://via.placeholder.com/1920x600/764ba2/ffffff?text=Shade+Finder";
//                     }}
//                   />
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         <div className="swiper-pagination"></div>

//         {windowWidth > 768 && banners.length > 1 && (
//           <>
//             <div className="swiper-button-prev"></div>
//             <div className="swiper-button-next"></div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BannerSlider;


















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
import "../css/Bannerslider.css";

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
    <div className="px-lg-5 px-4 py- container-lg-fluid">
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
