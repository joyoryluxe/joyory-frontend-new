
// import React, { useRef, useState, useEffect } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "../css/OffersSlider.css";

// // ✅ Import slick carousel CSS
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function useWindowSize() {
//   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
//   useEffect(() => {
//     const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// const OffersSlider = () => {
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
//   const [width] = useWindowSize();

//   const [promotions, setPromotions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=banner"
//         );
//         if (!res.ok) throw new Error("Failed to fetch promotions");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setPromotions(data);
//         } else {
//           throw new Error("API response is not an array");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   if (isLoading) return <div className="loading-state">Loading offers...</div>;
//   if (error) return <div className="error-state">Error: {error}</div>;
//   if (promotions.length === 0) return <div className="no-offers">No active offers available.</div>;

//   const handlePromotionClick = (id) => navigate(`/promotion/${id}`);

//   // ✅ No need key={width}, rely on responsive
//   const settings = {
//     infinite: true,
//     speed: 600,
//     slidesToShow: width >= 1200 ? 3.5 : width >= 992 ? 3 : width >= 768 ? 2 : 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     pauseOnHover: true,
//     arrows: false, // we’ll use our custom arrows
//     dots: false,
//   };

//   return (
//     <>
//       <div className="main-title container">
//         <h2 className="top-categories-title fw-bold mb-3 pb-3">Offers</h2>
//       </div>

//       <div className="offers-slider-wrapper position-relative container">
//         {/* Custom Arrows */}
//         <div className="sticky-left d-md-flex">
//           <div
//             className="arrow-left"
//             onClick={() => sliderRef.current?.slickPrev()}
//           >
//             &lt;
//           </div>
//           <div
//             className="arrow-right"
//             onClick={() => sliderRef.current?.slickNext()}
//           >
//             &gt;
//           </div>
//         </div>

//         {/* Slider */}
//         <Slider ref={sliderRef} {...settings}>
//           {promotions.map((promotion) => (
//             <div
//               key={promotion._id}
//               className="product-card" style={{minheight:"550px"}}
//               onClick={() => handlePromotionClick(promotion._id)}
//             >
//               <img
//                 src={
//                   Array.isArray(promotion.images) && promotion.images.length > 0
//                     ? promotion.images[0]
//                     : "https://via.placeholder.com/300x200?text=No+Image"
//                 }
//                 alt={promotion.title}
//                 className="img-fluid"
//               />
//               <h6>{promotion.title}</h6>
//               {/* <p>{promotion.description}</p> */}
//               <p className="promotion-description">{promotion.description}</p>
//               {promotion.discountLabel && (
//                 <p className="price">{promotion.discountLabel}</p>
//               )}
//               {promotion.countdown && (
//                 <div className="countdown-wrapper">
//                   <div className="countdown-box">{promotion.countdown.days}d</div>
//                   <div className="countdown-box">{promotion.countdown.hours}h</div>
//                   <div className="countdown-box">{promotion.countdown.minutes}m</div>
//                   <div className="countdown-box">{promotion.countdown.seconds}s</div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </Slider>

//         {/* Right sticky text */}
//         <div className="sticky-right d-md-flex">
//           <div className="sale-text">
//             <h2>Special Offers</h2>
//             <div className="percent text-center">%</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OffersSlider;






// import React, { useRef, useState, useEffect } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "../css/OffersSlider.css";

// // ✅ Import slick carousel CSS
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function useWindowSize() {
//   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
//   useEffect(() => {
//     const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// const OffersSlider = () => {
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
//   const [width] = useWindowSize();

//   const [promotions, setPromotions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=banner"
//         );
//         if (!res.ok) throw new Error("Failed to fetch promotions");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setPromotions(data);
//         } else {
//           throw new Error("API response is not an array");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   if (isLoading) return <div className="loading-state">Loading offers...</div>;
//   if (error) return <div className="error-state">Error: {error}</div>;
//   if (promotions.length === 0) return <div className="no-offers">No active offers available.</div>;

//   const handlePromotionClick = (id) => navigate(`/promotion/${id}`);

//   // ✅ No need key={width}, rely on responsive
//   const settings = {
//     infinite: true,
//     speed: 600,
//     slidesToShow: width >= 1200 ? 4.5 : width >= 992 ? 3 : width >= 768 ? 2 : 1.5,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     pauseOnHover: true,
//     arrows: false, // we’ll use our custom arrows
//     dots: false,
//   };

//   return (
//     <>
//       <div className="main-title container">
//         <h2 className="top-categories-title fw-bold mb-3 pb-3">Offers</h2>
//       </div>


//       <div className="offers-slider-wrapper position-relative container">
//         {/* Custom Arrows */}
//         <div className="sticky-left d-md-flex">
//           <div
//             className="arrow-left"
//             onClick={() => sliderRef.current?.slickPrev()}
//           >
//             &lt;
//           </div>
//           <div
//             className="arrow-right"
//             onClick={() => sliderRef.current?.slickNext()}
//           >
//             &gt;
//           </div>
//         </div>

//         {/* Slider */}
//         <Slider ref={sliderRef} {...settings}>
//           {promotions.map((promotion) => (
//             <div
//               key={promotion._id}
//               className="product-card" style={{minheight:"550px"}}
//               onClick={() => handlePromotionClick(promotion._id)}
//             >
//               <img
//                 src={
//                   Array.isArray(promotion.images) && promotion.images.length > 0
//                     ? promotion.images[0]
//                     : "https://via.placeholder.com/300x200?text=No+Image"
//                 }
//                 alt={promotion.title}
//                 className="img-fluid"
//               />
//               <h6 className="offrece-font-size">{promotion.title}</h6>
//               {/* <p>{promotion.description}</p> */}
//               {/* <p className="promotion-description">{promotion.description}</p> */}
//               {promotion.discountLabel && (
//                 <p className="price discounts-prices">{promotion.discountLabel}</p>
//               )}
//               {promotion.countdown && (
//                 <div className="countdown-wrapper">
//                   <div className="countdown-box">{promotion.countdown.days}d</div>
//                   <div className="countdown-box">{promotion.countdown.hours}h</div>
//                   <div className="countdown-box">{promotion.countdown.minutes}m</div>
//                   <div className="countdown-box">{promotion.countdown.seconds}s</div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </Slider>

//         {/* Right sticky text */}
//         <div className="sticky-right d-md-flex">
//           <div className="sale-text">
//             <h2>Special Offers</h2>
//             <div className="percent text-center">%</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OffersSlider;

























// import React, { useRef, useState, useEffect } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "../css/OffersSlider.css";
// import "../App.css";

// // ✅ Import slick carousel CSS
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function useWindowSize() {
//   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
//   useEffect(() => {
//     const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// const OffersSlider = () => {
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
//   const [width] = useWindowSize();

//   const [promotions, setPromotions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=banner"
//         );
//         if (!res.ok) throw new Error("Failed to fetch promotions");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setPromotions(data);
//         } else {
//           throw new Error("API response is not an array");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   if (isLoading) return <div className="loading-state">Loading offers...</div>;
//   if (error) return <div className="error-state">Error: {error}</div>;
//   if (promotions.length === 0) return <div className="no-offers text-center fs-4">No active offers available.</div>;

//   const handlePromotionClick = (id) => navigate(`/promotion/${id}`);

//   // ✅ No need key={width}, rely on responsive
//   const settings = {
//     infinite: true,
//     speed: 600,
//     slidesToShow: width >= 1200 ? 4.5 : width >= 992 ? 3 : width >= 768 ? 3 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     pauseOnHover: true,
//     arrows: false, // we’ll use our custom arrows
//     dots: false,
//   };

//   return (
//     <>
//       {/* <div className="main-title container-fluid">
//       </div> */}


//       <div className="offers-slider-wrapper position-relative container-fluid">
//         <h2 className="top-categories-title fw-bold mt-3 mb-4 mb-lg-5 mt-lg-5 text-center spacing">Offers</h2>
//         {/* Custom Arrows */}
//         {/* <div className="sticky-left d-md-flex">
//           <div
//             className="arrow-left"
//             onClick={() => sliderRef.current?.slickPrev()}
//           >
//             &lt;
//           </div>
//           <div
//             className="arrow-right"
//             onClick={() => sliderRef.current?.slickNext()}
//           >
//             &gt;
//           </div>
//         </div> */}

//         {/* Slider */}
//         <div className="mobile-responsive-code">

//           <Slider ref={sliderRef} {...settings}>
//             {promotions.map((promotion) => (
//               <div
//                 key={promotion._id}
//                 className="product-card" style={{ minheight: "550px" }}
//                 onClick={() => handlePromotionClick(promotion._id)}
//               >
//                 <img
//                   src={
//                     Array.isArray(promotion.images) && promotion.images.length > 0
//                       ? promotion.images[0]
//                       : "https://via.placeholder.com/300x200?text=No+Image"
//                   }
//                   alt={promotion.title}
//                   className="img-fluid"
//                 />
//                 {/* <h6 className="offrece-font-size mt-2">{promotion.title}</h6> */}
//                 {/* <p>{promotion.description}</p> */}
//                 {/* <p className="promotion-description">{promotion.description}</p> */}
//                 {/* {promotion.discountLabel && (
//                   <p className="price discounts-prices">{promotion.discountLabel}</p>
//                 )} */}
//                 {/* {promotion.countdown && (
//                 <div className="countdown-wrapper">
//                   <div className="countdown-box">{promotion.countdown.days}d</div>
//                   <div className="countdown-box">{promotion.countdown.hours}h</div>
//                   <div className="countdown-box">{promotion.countdown.minutes}m</div>
//                   <div className="countdown-box">{promotion.countdown.seconds}s</div>
//                 </div>
//               )} */}
//               </div>
//             ))}
//           </Slider>
//         </div>
//         {/* Right sticky text */}
//         {/* <div className="sticky-right d-md-flex">
//           <div className="sale-text">
//             <h2>Special Offers</h2>
//             <div className="percent text-center">%</div>
//           </div>
//         </div> */}
//       </div>
//     </>
//   );
// };

// export default OffersSlider;
















// import React, { useRef, useState, useEffect } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "../css/OffersSlider.css";
// import "../App.css";

// // ✅ Import slick carousel CSS
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function useWindowSize() {
//   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
//   useEffect(() => {
//     const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// const OffersSlider = () => {
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
//   const [width] = useWindowSize();

//   const [promotions, setPromotions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=banner"
//         );
//         if (!res.ok) throw new Error("Failed to fetch promotions");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setPromotions(data);
//         } else {
//           throw new Error("API response is not an array");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   if (isLoading) return <div className="loading-state page-title-main-name ">Loading offers...</div>;
//   if (error) return <div className="error-state">Error: {error}</div>;
//   if (promotions.length === 0) return <div className="no-offers text-center fs-4">No active offers available.</div>;

//   // ✅ Updated: Prefer slug, fallback to _id
//   const handlePromotionClick = (promotion) => {
//     const param = promotion.slug || promotion._id; // Use slug if exists, else ID
//     navigate(`/promotion/${param}`);
//   };

//   const settings = {
//     infinite: true,
//     speed: 600,
//     // slidesToShow: width >= 1200 ? 5 : width >= 992 ? 3 : width >= 768 ? 3 : 3,
//     slidesToShow:
//       width >= 1400 ? 5 :
//         width >= 1200 ? 5 :
//           width >= 1024 ? 4 :
//             width >= 992 ? 3 :
//               width >= 768 ? 3 :
//                 width >= 576 ? 3 :
//                   width >= 380 ? 2 : 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     pauseOnHover: true,
//     arrows: false,
//     dots: false,
//   };

//   return (
//     <>
//       {/* <div className="offers-slider-wrapper position-relative container"> */}
//       <div className="offers-slider-wrapper position-relative container-fluid" style={{ overflow: 'hidden' }}>
//         {/* <h2 className="top-categories-title fw-bold mt-3 mb-4 mb-lg-5 mt-lg-5 text-center spacing"> */}
//         <h2 className="mb-3 text-left text-start offers-headings spacing fw-normal">
//           Offers
//         </h2>

//         <div className="mobile-responsive-code">
//           <Slider ref={sliderRef} {...settings}>
//             {promotions.map((promotion) => (
//               <div
//                 key={promotion._id}
//                 className="product-card"
//                 style={{ minHeight: "550px", cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(promotion)}
//               >
//                 <img
//                   src={
//                     Array.isArray(promotion.images) && promotion.images.length > 0
//                       ? promotion.images[0]
//                       : "https://via.placeholder.com/300x200?text=No+Image"
//                   }
//                   alt={promotion.title || "Promotion"}
//                   className="img-fluid"
//                   style={{ width: "100%", height: "auto", objectFit: "cover" }}
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OffersSlider;





















// import React, { useRef, useState, useEffect } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "../css/OffersSlider.css";
// import "../App.css";

// // ✅ Import slick carousel CSS
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function useWindowSize() {
//   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
//   useEffect(() => {
//     const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// const OffersSlider = () => {
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
//   const [width] = useWindowSize();

//   const [promotions, setPromotions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=banner"
//         );
//         if (!res.ok) throw new Error("Failed to fetch promotions");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setPromotions(data);
//         } else {
//           throw new Error("API response is not an array");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   if (isLoading) return <div className="loading-state page-title-main-name ">Loading offers...</div>;
//   if (error) return <div className="error-state">Error: {error}</div>;

//   // ✅ NEW: If no promotions → hide the entire section (return null / nothing)
//   if (promotions.length === 0) return null;

//   // ✅ Prefer slug, fallback to _id
//   const handlePromotionClick = (promotion) => {
//     const param = promotion.slug || promotion._id;
//     navigate(`/promotion/${param}`);
//   };

//   // Calculate desired slides based on screen width
//   const desiredSlidesToShow =
//     width >= 1400 ? 5 :
//       width >= 1200 ? 5 :
//         width >= 1024 ? 4 :
//           width >= 992 ? 3 :
//             width >= 768 ? 3 :
//               width >= 576 ? 3 :
//                 width >= 380 ? 2 : 2;

//   // ✅ NEW: Actual slides to show (never exceed available promotions)
//   const actualSlidesToShow = Math.min(desiredSlidesToShow, promotions.length);

//   const settings = {
//     infinite: promotions.length > desiredSlidesToShow,        // Only infinite loop if there are more items than visible
//     speed: 600,
//     slidesToShow: actualSlidesToShow,                         // Dynamic slidesToShow
//     slidesToScroll: 1,
//     slidesToShow:
//       // width >= 1400 ? 5 :
//       //   width >= 1200 ? 5 :
//       //     width >= 1024 ? 4 :
//       //       width >= 992 ? 3 :
//       //         width >= 768 ? 3 :
//       //           width >= 576 ? 3 :
//       //             width >= 380 ? 2 : 2,
//             width >= 1400 ? 3 :
//         width >= 1200 ? 3 :
//           width >= 1024 ? 3 :
//             width >= 992 ? 3 :
//               width >= 768 ? 3 :
//                 width >= 576 ? 3 :
//                   width >= 380 ? 2 : 2,
//     autoplay: promotions.length > desiredSlidesToShow,        // Only autoplay if scrolling is needed
//     autoplaySpeed: 2500,
//     pauseOnHover: true,
//     arrows: false,
//     dots: false,
//   };

//   return (
//     <>
//       <div className="offers-slider-wrapper position-relative container-fluid" style={{ overflow: 'hidden' }}>
//         <h2 className="mb-3 text-left text-start offers-headings spacing fw-normal">
//           Offers
//         </h2>

//         <div className="mobile-responsive-code">
//           <Slider ref={sliderRef} {...settings}>
//             {promotions.map((promotion) => (
//               <div
//                 key={promotion._id}
//                 className="product-card"
//                 style={{ minHeight: "550px", cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(promotion)}
//               >
//                 <img
//                   src={
//                     Array.isArray(promotion.images) && promotion.images.length > 0
//                       ? promotion.images[0]
//                       : "https://via.placeholder.com/300x200?text=No+Image"
//                   }
//                   alt={promotion.title || "Promotion"}
//                   className="img-fluid"
//                   style={{ width: "100%", height: "auto", objectFit: "cover" }}
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OffersSlider;












// import React, { useRef, useState, useEffect } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "../css/OffersSlider.css";
// import "../App.css";

// // ✅ Import slick carousel CSS
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function useWindowSize() {
//   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
//   useEffect(() => {
//     const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// // ✅ Countdown Timer Component
// const CountdownTimer = ({ countdown }) => {
//   if (!countdown) return null;

//   const { days, hours, minutes, seconds } = countdown;

//   return (
//     <div className="countdown-timer">
//       <span className="countdown-item">{days}d</span>
//       <span className="countdown-separator">:</span>
//       <span className="countdown-item">{hours.toString().padStart(2, '0')}h</span>
//       <span className="countdown-separator">:</span>
//       <span className="countdown-item">{minutes.toString().padStart(2, '0')}m</span>
//       <span className="countdown-separator">:</span>
//       <span className="countdown-item">{seconds.toString().padStart(2, '0')}s</span>
//     </div>
//   );
// };

// const OffersSlider = () => {
//   const sliderRef = useRef(null);
//   const navigate = useNavigate();
//   const [width] = useWindowSize();

//   const [promotions, setPromotions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await fetch(
//           "https://beauty.joyory.com/api/user/promotions/active?section=banner"
//         );
//         if (!res.ok) throw new Error("Failed to fetch promotions");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setPromotions(data);
//         } else {
//           throw new Error("API response is not an array");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   if (isLoading) return <div className="loading-state page-title-main-name">Loading offers...</div>;
//   if (error) return <div className="error-state">Error: {error}</div>;

//   // ✅ If no promotions → hide the entire section
//   if (promotions.length === 0) return null;

//   // ✅ Enhanced navigation logic based on scope
//   const handlePromotionClick = (promotion) => {
//     const { scope, targetSlug, slug, _id, type } = promotion;

//     // Navigate based on promotion scope
//     if (scope === "category" && targetSlug) {
//       // navigate(`/category/${targetSlug}`);
//       navigate(`/Products/category/${targetSlug}`);
//     } else if (scope === "brand" && targetSlug) {
//       navigate(`/brand/${targetSlug}`);
//     } else if (scope === "product" && targetSlug) {
//       navigate(`/product/${targetSlug}`);
//     } else {
//       // Fallback to promotion detail page
//       const param = slug || _id;
//       navigate(`/promotion/${param}`);
//     }
//   };

//   // Calculate desired slides based on screen width
//   const desiredSlidesToShow =
//     width >= 1400 ? 3 :
//       width >= 1200 ? 3 :
//         width >= 1024 ? 3 :
//           width >= 992 ? 3 :
//             width >= 768 ? 3 :
//               width >= 576 ? 3 :
//                 width >= 380 ? 2 : 2;

//   // ✅ Actual slides to show (never exceed available promotions)
//   const actualSlidesToShow = Math.min(desiredSlidesToShow, promotions.length);

//   const settings = {
//     infinite: promotions.length > desiredSlidesToShow,
//     speed: 600,
//     slidesToShow: actualSlidesToShow,
//     slidesToScroll: 1,
//     autoplay: promotions.length > desiredSlidesToShow,
//     autoplaySpeed: 2500,
//     pauseOnHover: true,
//     arrows: false,
//     dots: false,
//     responsive: [
//       {
//         breakpoint: 1400,
//         settings: {
//           slidesToShow: Math.min(3, promotions.length),
//         }
//       },
//       {
//         breakpoint: 1200,
//         settings: {
//           slidesToShow: Math.min(3, promotions.length),
//         }
//       },
//       {
//         breakpoint: 992,
//         settings: {
//           slidesToShow: Math.min(3, promotions.length),
//         }
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: Math.min(3, promotions.length),
//         }
//       },
//       {
//         breakpoint: 576,
//         settings: {
//           slidesToShow: Math.min(2, promotions.length),
//         }
//       },
//       {
//         breakpoint: 380,
//         settings: {
//           slidesToShow: Math.min(2, promotions.length),
//         }
//       }
//     ]
//   };

//   // ✅ Get promotional badge based on type
//   const getPromoBadge = (promotion) => {
//     if (promotion.discountLabel) {
//       return promotion.discountLabel;
//     }
//     if (promotion.type === "bogo") {
//       return "BOGO";
//     }
//     if (promotion.type === "freeShipping") {
//       return "Free Shipping";
//     }
//     if (promotion.type === "newUser") {
//       return "New User Offer";
//     }
//     return "Special Offer";
//   };

//   return (
//     // <div className="offers-slider-wrapper position-relative container-fluid margin-left-right-responsive-code" style={{ overflow: 'hidden' }}>
//     <div className="top-categories-wrapper container-fluid mt-md-0 mt-lg-3 bg-white padding-topss margin-left-rights">
//       <h2 className="mb-3 text-left text-start offers-headings spacing fw-normal">
//         Offers
//       </h2>

//       <div className="mobile-responsive-code mt-2 mt-lg-4">
//         <Slider ref={sliderRef} {...settings}>
//           {promotions.map((promotion) => (
//             <div
//               key={promotion._id}
//               className="offer-card"
//               style={{ cursor: "pointer" }}
//               onClick={() => handlePromotionClick(promotion)}
//             >
//               {/* ✅ Promotional Badge */}
//               {/* <div className="offer-badge">
//                 {getPromoBadge(promotion)}
//               </div> */}

//               {/* ✅ Image Container */}
//               <div className="offer-image-container">
//                 <img
//                   src={
//                     Array.isArray(promotion.images) && promotion.images.length > 0
//                       ? promotion.images[0]
//                       : "/assets/images/placeholder-offer.jpg"
//                   }
//                   alt={promotion.title || "Promotion"}
//                   className="img-fluid offer-image"
//                   onError={(e) => {
//                     e.target.src = "/assets/images/placeholder-offer.jpg";
//                   }}
//                 />

//                 {/* ✅ Overlay with countdown for scheduled/ending soon */}
//                 {/* {promotion.countdown && (
//                   <div className="offer-countdown-overlay">
//                     <CountdownTimer countdown={promotion.countdown} />
//                   </div>
//                 )} */}
//               </div>

//               {/* ✅ Offer Details */}
//               <div className="offer-details mt-3 text-start">
//                 <h3 className="offer-title offer-title-responsie-title font-weightss page-title-main-name">{promotion.title}</h3>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default OffersSlider;















// src/components/OffersSlider.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/OffersSlider.css";
import "../App.css";

// ✅ Countdown Timer Component
const CountdownTimer = ({ countdown }) => {
  if (!countdown) return null;

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div className="countdown-timer">
      <span className="countdown-item">{days}d</span>
      <span className="countdown-separator">:</span>
      <span className="countdown-item">{hours.toString().padStart(2, '0')}h</span>
      <span className="countdown-separator">:</span>
      <span className="countdown-item">{minutes.toString().padStart(2, '0')}m</span>
      <span className="countdown-separator">:</span>
      <span className="countdown-item">{seconds.toString().padStart(2, '0')}s</span>
    </div>
  );
};

const OffersSlider = () => {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(
          "https://beauty.joyory.com/api/user/promotions/active?section=banner"
        );
        if (!res.ok) throw new Error("Failed to fetch promotions");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPromotions(data);
        } else {
          throw new Error("API response is not an array");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (isLoading) return <div className="loading-state page-title-main-name">Loading offers...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  // ✅ If no promotions → hide the entire section
  if (promotions.length === 0) return null;

  // ✅ Enhanced navigation logic based on scope
  const handlePromotionClick = (promotion) => {
    const { scope, targetSlug, slug, _id } = promotion;

    // Navigate based on promotion scope
    if (scope === "category" && targetSlug) {
      navigate(`/Products/category/${targetSlug}`);
    } else if (scope === "brand" && targetSlug) {
      navigate(`/brand/${targetSlug}`);
    } else if (scope === "product" && targetSlug) {
      navigate(`/product/${targetSlug}`);
    } else {
      // Fallback to promotion detail page
      const param = slug || _id;
      navigate(`/promotion/${param}`);
    }
  };

  // ✅ Get promotional badge based on type
  const getPromoBadge = (promotion) => {
    if (promotion.discountLabel) {
      return promotion.discountLabel;
    }
    if (promotion.type === "bogo") {
      return "BOGO";
    }
    if (promotion.type === "freeShipping") {
      return "Free Shipping";
    }
    if (promotion.type === "newUser") {
      return "New User Offer";
    }
    return "Special Offer";
  };

  return (
    <div className="top-categories-wrapper container-fluid mt-md-0 mt-lg-3 bg-white padding-topss margin-left-rights">
      <h2 className="mb-3 text-left text-start offers-headings spacing fw-normal">
        Offers
      </h2>

      <div className="mobile-responsive-code mt-2 mt-lg-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={600}
          spaceBetween={10}
          breakpoints={{
            300: { slidesPerView: 2 },
            380: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 3 },
            1400: { slidesPerView: 3 },
          }}
        >
          {promotions.map((promotion) => (
            <SwiperSlide key={promotion._id}>
              <div
                className="offer-card"
                style={{ cursor: "pointer" }}
                onClick={() => handlePromotionClick(promotion)}
              >
                {/* ✅ Promotional Badge */}
                {/* <div className="offer-badge">
                  {getPromoBadge(promotion)}
                </div> */}

                {/* ✅ Image Container */}
                <div className="offer-image-container">
                  <img
                    src={
                      Array.isArray(promotion.images) && promotion.images.length > 0
                        ? promotion.images[0]
                        : "/assets/images/placeholder-offer.jpg"
                    }
                    alt={promotion.title || "Promotion"}
                    className="img-fluid offer-image"
                    onError={(e) => {
                      e.target.src = "/assets/images/placeholder-offer.jpg";
                    }}
                  />

                  {/* ✅ Overlay with countdown for scheduled/ending soon */}
                  {/* {promotion.countdown && (
                    <div className="offer-countdown-overlay">
                      <CountdownTimer countdown={promotion.countdown} />
                    </div>
                  )} */}
                </div>

                {/* ✅ Offer Details */}
                <div className="offer-details mt-3 text-start">
                  <h3 className="offer-title offer-title-responsie-title font-weightss page-title-main-name">{promotion.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OffersSlider;
