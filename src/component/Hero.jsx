// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// // import "./css/HeroSlider.css";
// import "../css/HeroSlider.css";

// export default function Hero() {
//   const slides = [
//     {
//       type: "image",
//       src: "https://picsum.photos/id/1015/1600/600",
//       alt: "Slide Image 1"
//     },
//     {
//       type: "video",
//       src: "https://www.w3schools.com/html/mov_bbb.mp4",
//       alt: "Slide Video 1"
//     },
//     {
//       type: "image",
//       src: "https://picsum.photos/id/1020/1600/600",
//       alt: "Slide Image 2"
//     },
//     {
//       type: "video",
//       src: "https://www.w3schools.com/html/movie.mp4",
//       alt: "Slide Video 2"
//     },
//   ];

//   return (
//     <div className="hero-slider">
//       <Swiper
//         modules={[Autoplay, Pagination, Navigation]}
//         loop={true}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         spaceBetween={0}
//         slidesPerView={1}
//       >
//         {slides.map((slide, index) => (
//           <SwiperSlide key={index}>
//             {slide.type === "image" ? (
//               <img src={slide.src} alt={slide.alt} className="slide-media" />
//             ) : (
//               <video
//                 className="slide-media"
//                 src={slide.src}
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//               />
//             )}
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }




// import React, { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// export default function HeroSlider() {
//   const swiperRef = useRef();

//   const slides = [
//     { type: "image", src: "https://picsum.photos/id/1015/1600/800", alt: "Slide 1" },
//     { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", alt: "Video 1" },
//     { type: "image", src: "https://picsum.photos/id/1018/1600/800", alt: "Slide 2" },
//     { type: "video", src: "https://www.w3schools.com/html/movie.mp4", alt: "Video 2" },
//   ];

//   const handleSlideChange = () => {
//     const swiper = swiperRef.current.swiper;
//     // Pause all videos when slide changes
//     document.querySelectorAll(".slide-video").forEach((video) => video.pause());
//     // Play current active video if any
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide.querySelector("video");
//     if (video) video.play();
//   };

//   return (
//     <div className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop={true}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         slidesPerView={1}
//         spaceBetween={0}
//       >
//         {slides.map((slide, index) => (
//           <SwiperSlide key={index}>
//             {slide.type === "image" ? (
//               <img src={slide.src} alt={slide.alt} className="slide-media" />
//             ) : (
//               <video
//                 className="slide-media slide-video"
//                 src={slide.src}
//                 muted
//                 playsInline
//                 loop
//               />
//             )}
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }





















// import React, { useRef, useEffect, useState } from "react";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef();
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch media data from API
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);
//         if (res.data && res.data.items) {
//           setSlides(res.data.items);
//         }
//       } catch (err) {
//         console.error("Error fetching media:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, []);

//   // ✅ Pause/Play video logic on slide change
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current.swiper;
//     // Pause all videos
//     document.querySelectorAll(".slide-video").forEach((video) => video.pause());
//     // Play current active video (if any)
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide.querySelector("video");
//     if (video) video.play();
//   };

//   if (loading) {
//     return (
//       <div className="hero-slider text-center py-5">
//         <h5>Loading media...</h5>
//       </div>
//     );
//   }

//   return (
//     <div className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop={true}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         slidesPerView={1}
//         spaceBetween={0}
//       >
//         {slides.map((item, index) => (
//           <SwiperSlide key={item._id || index}>
//             {item.type === "image" ? (
//               <img
//                 src={item.url}
//                 alt={`Slide ${index + 1}`}
//                 className="slide-media"
//               />
//             ) : (
//               <video
//                 className="slide-media slide-video"
//                 src={item.url}
//                 muted
//                 playsInline
//                 loop
//               />
//             )}
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }















// import React, { useRef, useEffect, useState } from "react";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef();
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch media data from API
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);
//         if (res.data && res.data.items) {
//           setSlides(res.data.items);
//         }
//       } catch (err) {
//         console.error("Error fetching media:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, []);

//   // ✅ Pause/Play video logic on slide change
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current.swiper;
//     // Pause all videos
//     document.querySelectorAll(".slide-video").forEach((video) => video.pause());
//     // Play current active video (if any)
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide.querySelector("video");
//     if (video) video.play();
//   };

//   if (loading) {
//     return (
//       <div className="hero-slider text-center py-5">
//         <h5>Loading media...</h5>
//       </div>
//     );
//   }

//   return (
//     <div className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop={true}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         slidesPerView={1}
//         spaceBetween={0}
//       >
//         {slides.map((item, index) => (
//           // <SwiperSlide key={item._id || index}>
//           //   {item.type === "image" ? (
//           //     <img
//           //       src={item.url}
//           //       alt={`Slide ${index + 1}`}
//           //       className="slide-media"
//           //     />
//           //   ) : (
//           //     <video
//           //       className="slide-media slide-video"
//           //       src={item.url}
//           //       muted
//           //       playsInline
//           //       loop
//           //     />
//           //   )}
//           // </SwiperSlide>


//           <SwiperSlide key={item._id || index}>
//             <div className="slide-wrapper">
//               {item.type === "image" ? (
//                 <img src={item.url} alt={item.title || `Slide ${index + 1}`} className="slide-media" />
//               ) : (
//                 <video
//                   className="slide-media slide-video"
//                   src={item.url}
//                   muted
//                   playsInline
//                   loop
//                 />
//               )}

//               {/* ================= Overlay Text Content ================= */}
//               <div className="slide-content">
//                 {item.title && <h2 className="slide-title">{item.title}</h2>}
//                 {item.description && <div className="slide-subtitle-main"> <p className="slide-subtitle">{item.description}</p> </div>}
//                 {item.buttonText && item.buttonLink && (
//                   <a href={item.buttonLink} className="slide-btn">
//                     {item.buttonText}
//                   </a>
//                 )}
//               </div>

//               {/* Optional Dark Overlay for better visibility */}
//               <div className="slide-overlay"></div>
//             </div>
//           </SwiperSlide>

//         ))}
//       </Swiper>
//     </div>
//   );
// }


















// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef();
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // ✅ Fetch media data from API
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);
//         if (res.data && res.data.items) {
//           setSlides(res.data.items);
//         }
//       } catch (err) {
//         console.error("Error fetching media:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, []);

//   // ✅ Pause/Play video logic on slide change
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current.swiper;
//     // Pause all videos
//     document.querySelectorAll(".slide-video").forEach((video) => video.pause());
//     // Play current active video (if any)
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide.querySelector("video");
//     if (video) video.play();
//   };

//   if (loading) {
//     return (
//       <div className="hero-slider text-center py-5">
//         <h5>Loading media...</h5>
//       </div>
//     );
//   }

//   return (
//     <div className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop={true}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         slidesPerView={1}
//         spaceBetween={0}
//       >
//         {slides.map((item, index) => (
//           <SwiperSlide key={item._id || index}>
//             <div className="slide-wrapper">
//               {/* Media */}
//               {item.type === "image" ? (
//                 <img
//                   src={item.url}
//                   alt={item.title || `Slide ${index + 1}`}
//                   className="slide-media"
//                 />
//               ) : (
//                 <video
//                   className="slide-media slide-video"
//                   src={item.url}
//                   muted
//                   playsInline
//                   loop
//                 />
//               )}

//               {/* Overlay Content - matches JSON exactly */}
//               <div className="slide-content">
//                 {item.title && <h1 className="slide-title hero-title-font">{item.title}</h1>}
//                 {item.description && (
//                   <div className="slide-subtitle-main">
//                     <p className="slide-subtitle">{item.description}</p>
//                   </div>
//                 )}

//                 {/* <button
//                   className="slide-btn mt-lg-4 mt-md-0"
//                   onClick={() => (window.location.href = "https://joyory.com/ShopProduct")}
//                 >
//                   Shop Product
//                 </button> */}



//                 <button
//                   className="slide-btn mt-lg-4 mt-md-0"
//                   onClick={() => navigate("/ShopProduct")}
//                 >
//                   Shop Product
//                 </button>




//               </div>

//               {/* Dark Overlay for readability */}
//               <div className="slide-overlay"></div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }






























// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// // const API_URL = "https://beauty.joyory.com/api/media";
// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef(null);
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // ✅ Fetch media data
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);
//         if (res.data?.items) {
//           setSlides(res.data.items);
//         }
//       } catch (error) {
//         console.error("Error fetching media:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, []);

//   // ✅ Pause / play videos on slide change
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;

//     document
//       .querySelectorAll(".slide-video")
//       .forEach((video) => video.pause());

//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play();
//   };

//   // ✅ Handle Shop button click safely
//   const handleShopRedirect = (item) => {
//     const slug =
//       item.slug ||
//       item.productSlug ||
//       item.redirectSlug ||
//       null;

//     if (!slug) {
//       console.warn("Slug missing for slide:", item);
//       navigate("/ShopProduct"); // fallback (listing page)
//       return;
//     }

//     navigate(`/ShopProduct/${slug}`);
//   };

//   if (loading) {
//     return (
//       <div className="hero-slider text-center py-5">
//         <h5 className="page-title-main-name">Loading media...</h5>
//       </div>
//     );
//   }

//   return (
//     <div className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         slidesPerView={1}
//         spaceBetween={0}
//       >
//         {slides.map((item, index) => (
//           <SwiperSlide key={item._id || index}>
//             <div className="slide-wrapper">

//               {/* Media */}
//               {item.type === "image" ? (
//                 <img
//                   src={item.url}
//                   alt={item.title || `Slide ${index + 1}`}
//                   className="slide-media"
//                 />
//               ) : (
//                 <video
//                   className="slide-media slide-video"
//                   src={item.url}
//                   muted
//                   playsInline
//                   loop
//                 />
//               )}

//               {/* Content */}
//               <div className="slide-content">
//                 {item.title && (
//                   <h1 className="slide-title hero-title-font">
//                     {item.title}
//                   </h1>
//                 )}

//                 {item.description && (
//                   <div className="slide-subtitle-main">
//                     <p className="slide-subtitle">
//                       {item.description}
//                     </p>
//                   </div>
//                 )}

//                 <button
//                   className="slide-btn mt-lg-4 mt-md-0"
//                   onClick={() => handleShopRedirect(item)}
//                 >
//                 </button>
//               </div>

//               {/* Overlay */}
//               <div className="slide-overlay"></div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }


















// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef(null);
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   /* ---------------- FETCH MEDIA ---------------- */
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);
//         console.log("API Response:", res.data); // Debug

//         if (res.data?.success && res.data?.items) {
//           console.log("Slides data:", res.data.items); // Debug each slide
//           setSlides(res.data.items);
//         } else {
//           console.error("No items found in response");
//           setSlides([]);
//         }
//       } catch (error) {
//         console.error("Error fetching media:", error);
//         setSlides([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedia();
//   }, []);

//   /* ---------------- VIDEO CONTROL ---------------- */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;

//     // Pause all videos
//     document.querySelectorAll(".slide-video").forEach((video) => video.pause());

//     // Play video in active slide
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) {
//       video.play().catch(err => {
//         console.log("Video autoplay prevented:", err);
//       });
//     }
//   };

//   /* ---------------- INITIAL VIDEO PLAY ---------------- */
//   useEffect(() => {
//     if (slides.length > 0) {
//       const timer = setTimeout(() => {
//         const firstVideo = document.querySelector(".slide-video");
//         if (firstVideo) {
//           firstVideo.play().catch(err => {
//             console.log("Initial video play failed:", err);
//           });
//         }
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [slides]);

//   /* ---------------- REDIRECT ---------------- */
//   const handleShopRedirect = (item) => {
//     console.log("Redirecting with item:", item); // Debug

//     // Extract slug from various possible fields
//     const slug = item.slug || item.productSlug || item.redirectSlug || null;

//     if (!slug) {
//       console.log("No slug found, redirecting to general shop page");
//       // navigate("/ShopProduct");
//       return;
//     }

//     // console.log(`Redirecting to: /ShopProduct/${slug}`);
//     // navigate(`/ShopProduct/${slug}`);
//   };

//   /* ---------------- LOADER ---------------- */
//   if (loading) {
//     return (
//       <div className="hero-slider text-center py-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-2">Loading slides...</p>
//       </div>
//     );
//   }

//   /* ---------------- NO SLIDES ---------------- */
//   if (!slides || slides.length === 0) {
//     return (
//       <div className="hero-slider text-center py-5">
//         <p>No slides available at the moment.</p>
//         <button
//           className="btn btn-primary mt-3"
//           onClick={() => navigate("/ShopProduct")}
//         >
//           Shop Now
//         </button>
//       </div>
//     );
//   }

//   return (
//     <section className="hero-slider">

//       {/* ✅ OPTIONAL: Uncomment for SEO */}
//       {/* <h1 className="visually-hidden">
//         Joyory – Premium Jewellery Online Store
//       </h1> */}

//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         onInit={(swiper) => {
//           // Auto-play video on first slide after initialization
//           setTimeout(() => {
//             const firstVideo = swiper.slides[0]?.querySelector(".slide-video");
//             if (firstVideo) {
//               firstVideo.play().catch(err => {
//                 console.log("Video autoplay on init prevented:", err);
//               });
//             }
//           }, 300);
//         }}
//         loop={true}
//         autoplay={{
//           delay: 5000,
//           disableOnInteraction: false,
//           pauseOnMouseEnter: true
//         }}
//         pagination={{
//           clickable: true,
//           dynamicBullets: true
//         }}
//         navigation={true}
//         speed={600}
//         grabCursor={true}
//       >
//         {slides.map((item, index) => {
//           console.log(`Rendering slide ${index}:`, {
//             title: item.title,
//             buttonText: item.buttonText,
//             hasButtonText: !!item.buttonText
//           });

//           return (
//             <SwiperSlide key={item._id || `slide-${index}`}>
//               <div className="slide-wrapper position-relative">

//                 {/* MEDIA - Image or Video */}
//                 {item.type === "image" ? (
//                   <img
//                     src={item.url}
//                     alt={item.title || `Slide ${index + 1}`}
//                     className="slide-media"
//                     loading={index === 0 ? "eager" : "lazy"}
//                     onError={(e) => {
//                       console.error(`Failed to load image: ${item.url}`);
//                       e.target.src = "https://via.placeholder.com/1920x1080/333/fff?text=Image+Not+Found";
//                     }}
//                   />
//                 ) : (
//                   <video
//                     className="slide-media slide-video"
//                     src={item.url}
//                     muted
//                     playsInline
//                     loop
//                     preload="auto"
//                     onError={(e) => {
//                       console.error(`Failed to load video: ${item.url}`);
//                       // Show fallback if video fails
//                       e.target.parentElement.innerHTML = `
//                         <img src="https://via.placeholder.com/1920x1080/333/fff?text=Video+Not+Found" 
//                              class="slide-media" 
//                              alt="Video not available" />
//                       `;
//                     }}
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                 )}

//                 {/* CONTENT OVERLAY */}
//                 <div className="slide-overlay"></div>

//                 {/* SLIDE CONTENT */}
//                 <div className="slide-content position-absolute">

//                   {/* TITLE - Using H2 for SEO */}
//                   {item.title && (
//                     <h1 className="slide-title hero-title-font animate__animated animate__fadeInDown">
//                       {item.title}
//                     </h1>
//                   )}

//                   {/* DESCRIPTION */}
//                   {item.description && (
//                     <div className="slide-subtitle-main">
//                       <p className="slide-subtitle animate__animated animate__fadeInUp">
//                         {item.description}
//                       </p>
//                     </div>
//                   )}

//                   {/* ✅ FIXED BUTTON - Using buttonText from backend */}
//                   <button
//                     className="slide-btn animate__animated animate__fadeInUp"
//                     onClick={() => handleShopRedirect(item)}
//                     aria-label={item.buttonText || "Shop Now"}
//                   >
//                     {/* Display buttonText from backend, fallback to "Shop Now" */}
//                     {item.buttonText ? item.buttonText : "Shop Now"}
//                   </button>

//                 </div>
//               </div>
//             </SwiperSlide>
//           );
//         })}
//       </Swiper>
//     </section>
//   );
// }




















// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef(null);
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   /* ---------------- FETCH MEDIA ---------------- */
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);
        
//         // Match backend structure: res.data.data
//         if (res.data?.success && Array.isArray(res.data.data)) {
//           setSlides(res.data.data);
//         } else if (res.data?.items) {
//           setSlides(res.data.items);
//         } else {
//           console.error("Unexpected API structure", res.data);
//           setSlides([]);
//         }
//       } catch (error) {
//         console.error("Error fetching media:", error);
//         setSlides([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedia();
//   }, []);

//   /* ---------------- VIDEO CONTROL ---------------- */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;

//     document.querySelectorAll(".slide-video").forEach((video) => video.pause());

//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) {
//       video.play().catch(err => console.log("Autoplay prevented:", err));
//     }
//   };

//   /* ---------------- REDIRECT LOGIC (FIXED) ---------------- */
//   const handleShopRedirect = (item) => {
//     const targetLink = item.buttonLink;

//     // if (!targetLink) {
//     //   console.warn("No buttonLink found for this slide");
//     //   navigate("/ShopProduct"); // Fallback
//     //   return;
//     // }

//     // Check if it's an external link (starts with http)
//     if (targetLink.startsWith("http")) {
//       window.location.href = targetLink;
//     } else {
//       // If it's a relative path (e.g., /category/skin)
//       navigate(targetLink);
//     }
//   };

//   /* ---------------- LOADER ---------------- */
//   if (loading) {
//     return (
//       <div className="hero-slider d-flex justify-content-center align-items-center" style={{height: "500px"}}>
//         <div className="spinner-border text-primary" role="status"></div>
//       </div>
//     );
//   }

//   if (!slides || slides.length === 0) {
//     return null; // Or a fallback image
//   }

//   return (
//     <section className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         onInit={(swiper) => {
//           setTimeout(() => {
//             const firstVideo = swiper.slides[0]?.querySelector(".slide-video");
//             if (firstVideo) firstVideo.play().catch(() => {});
//           }, 300);
//         }}
//         loop={true}
//         autoplay={{
//           delay: 5000,
//           disableOnInteraction: false,
//         }}
//         pagination={{ clickable: true }}
//         navigation={true}
//         speed={800}
//       >
//         {slides.map((item, index) => (
//           <SwiperSlide key={item._id || index}>
//             <div className="slide-wrapper position-relative">
              
//               {/* MEDIA RENDERER */}
//               {item.type === "image" ? (
//                 <img
//                   src={item.url}
//                   alt={item.title || "Joyory Slide"}
//                   className="slide-media"
//                 />
//               ) : (
//                 <video
//                   className="slide-media slide-video"
//                   src={item.url}
//                   muted
//                   playsInline
//                   loop
//                   preload="auto"
//                 />
//               )}

//               <div className="slide-overlay"></div>

//               {/* CONTENT */}
//               <div className="slide-content position-absolute">
//                 {item.title && (
//                   <h1 className="slide-title animate__animated animate__fadeInDown">
//                     {item.title}
//                   </h1>
//                 )}

//                 {item.description && (
//                   <div className="slide-subtitle-main">
//                     <p className="slide-subtitle animate__animated animate__fadeInUp">
//                       {item.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* UPDATED BUTTON */}
//                 <button
//                   className="slide-btn animate__animated animate__fadeInUp"
//                   onClick={() => handleShopRedirect(item)}
//                 >
//                   {item.buttonText || "Shop Now"}
//                 </button>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// }



















// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef(null);
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   /* ================= FETCH MEDIA ================= */
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);

//         if (res.data?.success && Array.isArray(res.data.data)) {
//           setSlides(res.data.data);
//         } else if (res.data?.items) {
//           setSlides(res.data.items);
//         } else {
//           setSlides([]);
//         }
//       } catch (error) {
//         console.error("Error fetching media:", error);
//         setSlides([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedia();
//   }, []);

//   /* ================= VIDEO CONTROL ================= */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;

//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());

//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => {});
//   };

//   /* ================= BUTTON REDIRECT ================= */
//   const handleShopRedirect = (item) => {
//     if (!item?.buttonLink) return;

//     if (item.buttonLink.startsWith("http")) {
//       window.location.href = item.buttonLink;
//     } else {
//       navigate(item.buttonLink);
//     }
//   };

//   /* ================= LOADER ================= */
//   if (loading) {
//     return (
//       <div
//         className="hero-slider d-flex justify-content-center align-items-center"
//         style={{ height: "500px" }}
//       >
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!slides.length) return null;

//   return (
//     <section className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         speed={800}
//       >
//         {slides.map((item, index) => (
//           <SwiperSlide key={item._id || index}>
//             <div className="slide-wrapper position-relative">

//               {/* MEDIA */}
//               {item.type === "image" ? (
//                 <img
//                   src={item.url}
//                   alt={item.title || "Joyory Slide"}
//                   className="slide-media"
//                 />
//               ) : (
//                 <video
//                   className="slide-media slide-video"
//                   src={item.url}
//                   muted
//                   playsInline
//                   loop
//                   preload="auto"
//                 />
//               )}

//               <div className="slide-overlay" />

//               {/* CONTENT */}
//               <div className="slide-content position-absolute">
//                 {item.title && (
//                   <h1 className="slide-title animate__animated animate__fadeInDown">
//                     {item.title}
//                   </h1>
//                 )}

//                 {item.description && (
//                   <div className="slide-subtitle-main">
//                     <p className="slide-subtitle animate__animated animate__fadeInUp">
//                       {item.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* ✅ BUTTON ONLY IF DATA EXISTS */}
//                 {item.buttonLink && item.buttonText && (
//                   <button
//                     className="slide-btn animate__animated animate__fadeInUp"
//                     onClick={() => handleShopRedirect(item)}
//                   >
//                     {item.buttonText}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// }






























// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css";

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef(null);
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   /* ================= FETCH MEDIA ================= */
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);

//         if (res.data?.success && Array.isArray(res.data.data)) {
//           setSlides(res.data.data);
//         } else if (res.data?.items) {
//           setSlides(res.data.items);
//         } else {
//           setSlides([]);
//         }
//       } catch (error) {
//         console.error("Error fetching media:", error);
//         setSlides([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedia();
//   }, []);

//   /* ================= VIDEO CONTROL ================= */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;

//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());

//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => {});
//   };

//   /* ================= BUTTON REDIRECT ================= */
//   const handleShopRedirect = (item) => {
//     if (!item?.buttonLink) return;

//     if (item.buttonLink.startsWith("http")) {
//       window.location.href = item.buttonLink;
//     } else {
//       navigate(item.buttonLink);
//     }
//   };

//   /* ================= LOADER ================= */
//   if (loading) {
//     return (
//       <div
//         className="hero-slider d-flex justify-content-center align-items-center"
//         style={{ height: "500px" }}
//       >
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!slides.length) return null;

//   return (
//     <section className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation
//         speed={800}
//         className="mt-lg-5 margin-setup"
//       >
//         {slides.map((item, index) => (
//           <SwiperSlide key={item._id || index}>
//             <div className="slide-wrapper position-relative mt-xl-4">

//               {/* MEDIA */}
//               {item.type === "image" ? (
//                 <img
//                   src={item.url}
//                   alt={item.title || "Joyory Slide"}
//                   className="slide-media  hero-slider-image-responsive"
//                 />
//               ) : (
//                 <video
//                   className="slide-media slide-video"
//                   src={item.url}
//                   muted
//                   playsInline
//                   loop
//                   preload="auto"
//                 />
//               )}

//               <div className="slide-overlay" />

//               {/* CONTENT */}
//               <div className="slide-content position-absolute">
//                 {item.title && (
//                   <h1 className="slide-title animate__animated animate__fadeInDown">
//                     {item.title}
//                   </h1>
//                 )}

//                 {item.description && (
//                   <div className="slide-subtitle-main">
//                     <p className="slide-subtitle animate__animated animate__fadeInUp">
//                       {item.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* ✅ BUTTON ONLY IF DATA EXISTS */}
//                 {item.buttonLink && item.buttonText && (
//                   <button
//                     className="slide-btn animate__animated animate__fadeInUp"
//                     onClick={() => handleShopRedirect(item)}
//                   >
//                     {item.buttonText}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// }
























// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/HeroSlider.css"; // your custom CSS (must be after Swiper imports)

// const API_URL = "https://beauty.joyory.com/api/media";

// export default function HeroSlider() {
//   const swiperRef = useRef(null);
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const res = await axios.get(API_URL);
//         if (res.data?.success && Array.isArray(res.data.data)) {
//           setSlides(res.data.data);
//         } else if (res.data?.items) {
//           setSlides(res.data.items);
//         } else {
//           setSlides([]);
//         }
//       } catch (error) {
//         console.error("Error fetching media:", error);
//         setSlides([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, []);

//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => {});
//   };

//   const handleShopRedirect = (item) => {
//     if (!item?.buttonLink) return;
//     if (item.buttonLink.startsWith("http")) {
//       window.location.href = item.buttonLink;
//     } else {
//       navigate(item.buttonLink);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="hero-slider d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!slides.length) return null;

//   return (
//     <section className="hero-slider">
//       <Swiper
//         ref={swiperRef}
//         modules={[Autoplay, Pagination, Navigation]}
//         onSlideChange={handleSlideChange}
//         loop
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{
//           clickable: true,
//           // Optional: use a custom CSS class for the pagination container
//           bulletClass: 'custom-swiper-bullet',
//           bulletActiveClass: 'custom-swiper-bullet-active',
//         }}
//         navigation
//         speed={800}
//         className="mt-lg-5 margin-setup"
//       >
//         {slides.map((item, index) => (
//           <SwiperSlide key={item._id || index}>
//             <div className="slide-wrapper position-relative mt-xl-4 padding-left-rightss">
//               {item.type === "image" ? (
//                 <img
//                   src={item.url}
//                   alt={item.title || "Joyory Slide"}
//                   className="slide-media hero-slider-image-responsive"
//                 />
//               ) : (
//                 <video
//                   className="slide-media slide-video"
//                   src={item.url}
//                   muted
//                   playsInline
//                   loop
//                   preload="auto"
//                 />
//               )}
//               {/* <div className="slide-overlay" />
//               <div className="slide-content position-absolute">
//                 {item.title && (
//                   <h1 className="slide-title animate__animated animate__fadeInDown">
//                     {item.title}
//                   </h1>
//                 )}
//                 {item.description && (
//                   <div className="slide-subtitle-main">
//                     <p className="slide-subtitle animate__animated animate__fadeInUp">
//                       {item.description}
//                     </p>
//                   </div>
//                 )}
//                 {item.buttonLink && item.buttonText && (
//                   <button
//                     className="slide-btn animate__animated animate__fadeInUp"
//                     onClick={() => handleShopRedirect(item)}
//                   >
//                     {item.buttonText}
//                   </button>
//                 )}
//               </div> */}
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// }





















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