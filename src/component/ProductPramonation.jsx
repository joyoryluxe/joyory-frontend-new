// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/ProductPromotion.css";

// const ProductPromotion = () => {
//   const [slides, setSlides] = useState([]);

//   // Fetch promotions
//   useEffect(() => {
//     axios
//       .get(
//         "https://beauty.joyory.com/api/user/promotions/active?section=product"
//       )
//       .then((res) => {
//         if (res.data?.promotions) {
//           setSlides(res.data.promotions);
//         } else if (Array.isArray(res.data)) {
//           setSlides(res.data);
//         } else {
//           console.warn("Unexpected API response format:", res.data);
//         }
//       })
//       .catch((err) => {
//         console.error("API Error:", err.response || err);
//       });
//   }, []);

//   // Slick slider settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     lazyLoad: "ondemand",
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     responsive: [
//       {
//         breakpoint: 992, // Tablet
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 576, // Mobile
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="product-promotion container py-4">
//       <h2 className="text-center mb-4">Product Promotions</h2>

//       {slides.length > 0 ? (
//         <Slider {...settings}>
//           {slides.map((slide, index) => (
//             <div className="p-2" key={index}>
//               <div className="promotion-card shadow-sm rounded overflow-hidden">
//                 <img
//                   src={
//                     slide.image ||
//                     slide.images ||
//                     slide.img ||
//                     "https://via.placeholder.com/400x300?text=No+Image"
//                   }
//                   alt={`Promotion ${index + 1}`}
//                   loading="lazy" // ✅ Lazy load image
//                   className="img-fluid "/>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       ) : (
//         <p className="text-center text-muted">No promotions available.</p>
//       )}
//     </div>
//   );
// };

// export default ProductPromotion;



















// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/ProductPromotion.css";

// const ProductPromotion = () => {
//   const [slides, setSlides] = useState([]);
//   const navigate = useNavigate();

//   // Fetch promotions
//   useEffect(() => {
//     axios
//       .get("https://beauty.joyory.com/api/user/promotions/active?section=product")
//       .then((res) => {
//         if (res.data?.promotions) {
//           setSlides(res.data.promotions);
//         } else if (Array.isArray(res.data)) {
//           setSlides(res.data);
//         } else {
//           console.warn("Unexpected API response format:", res.data);
//         }
//       })
//       .catch((err) => {
//         console.error("API Error:", err.response || err);
//       });
//   }, []);

//   // Click promotion -> fetch products
//   const handlePromotionClick = async (promotionId, promotionTitle) => {
//     try {
//       const res = await axios.get(
//         `https://beauty.joyory.com/api/user/promotions/${promotionId}/products`
//       );
//       const products = res.data.products || [];

//       // Navigate to ProductPage with products in location state
//       navigate(`/product/${promotionId}`, {
//         state: {
//           products,
//           pageTitle: promotionTitle || "Promotion Products",
//         },
//       });
//     } catch (err) {
//       console.error("Failed to fetch promotion products:", err.response || err);
//       alert("Failed to load promotion products. Please try again.");
//     }
//   };

//   // Slick slider settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     lazyLoad: "ondemand",
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     responsive: [
//       { breakpoint: 992, settings: { slidesToShow: 2 } },
//       { breakpoint: 576, settings: { slidesToShow: 1 } },
//     ],
//   };

//   return (
//     <div className="product-promotion container py-4">
//       <h2 className="text-center mb-4">Product Promotions</h2>

//       {slides.length > 0 ? (
//         <Slider {...settings}>
//           {slides.map((slide, index) => (
//             <div className="p-2" key={slide._id || index}>
//               <div
//                 className="promotion-card shadow-sm rounded overflow-hidden"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(slide._id, slide.title)}
//               >
//                 <img
//                   src={slide.image || slide.images?.[0] || slide.img || "https://via.placeholder.com/400x300?text=No+Image"}
//                   alt={slide.title || `Promotion ${index + 1}`}
//                   loading="lazy"
//                   className="img-fluid"
//                 />
//               </div>
//             </div>
//           ))}
//         </Slider>
//       ) : (
//         <p className="text-center text-muted">No promotions available.</p>
//       )}
//     </div>
//   );
// };

// export default ProductPromotion;



























// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/ProductPromotion.css";

// const ProductPramonation = () => {
//   const [slides, setSlides] = useState([]);
//   const navigate = useNavigate();

//   // Fetch active promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/promotions/active?section=product"
//         );
//         const promotions = res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
//         setSlides(promotions);
//       } catch (err) {
//         console.error("Failed to fetch promotions:", err.response || err);
//       }
//     };
//     fetchPromotions();
//   }, []);

// const handlePromotionClick = async (slug, promotionTitle) => {
//   try {
//     console.log("Promotion clicked with slug:", slug);

//     const url = `https://beauty.joyory.com/api/user/products/category/${slug}/products`;
//     console.log("Fetching URL:", url);

//     const res = await axios.get(url);
//     const products = res.data.products || [];

//     navigate(`/productpage/${slug}`, {
//       state: {
//         products,
//         pageTitle: promotionTitle || "Promotion Products",
//       },
//     });
//   } catch (err) {
//     console.error("Failed to fetch promotion products:", err.response?.data || err.message);
//     alert("Failed to load promotion products. Please try again.");
//   }
// };



//   // Slider settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     lazyLoad: "ondemand",
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     responsive: [
//       { breakpoint: 992, settings: { slidesToShow: 2 } },
//       { breakpoint: 576, settings: { slidesToShow: 1 } },
//     ],
//   };

//   return (
//     <div className="product-promotion container py-4">
//       <h2 className="text-center mb-4">Product Promotions</h2>

//       {slides.length > 0 ? (
//         <Slider {...settings}>
//           {slides.map((slide, index) => (
//             <div className="p-2" key={slide._id || index}>
//               <div
//                 className="promotion-card shadow-sm rounded overflow-hidden"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(slide.slug, slide.title)}
//               >
//                 <img
//                   src={slide.image || slide.images?.[0] || slide.img || "https://via.placeholder.com/400x300?text=No+Image"}
//                   alt={slide.title || `Promotion ${index + 1}`}
//                   loading="lazy"
//                   className="img-fluid"
//                   style={{ width: "100%", objectFit: "cover" }}
//                 />
//               </div>
//             </div>
//           ))}
//         </Slider>
//       ) : (
//         <p className="text-center text-muted">No promotions available.</p>
//       )}
//     </div>
//   );
// };

// export default ProductPramonation;





































// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/ProductPromotion.css";

// const ProductPramonation = () => {
//   const [slides, setSlides] = useState([]);
//   const navigate = useNavigate();

//   // Fetch active promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/promotions/active?section=product"
//         );
//         const promotions = res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
//         setSlides(promotions);
//       } catch (err) {
//         console.error("Failed to fetch promotions:", err.response || err);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   // Click promotion -> fetch products using promotion ID
//   const handlePromotionClick = async (promotionId, promotionTitle) => {
//     try {

//       const url = `https://beauty.joyory.com/api/user/promotions/${promotionId}/products`;

//       const res = await axios.get(url);
//       const products = res.data.products || [];

//       // Navigate to ProductPage and pass products via state
//       navigate(`/productpage/${promotionId}`, {
//         state: {
//           products,
//           pageTitle: promotionTitle || "Promotion Products",
//         },
//       });
//     } catch (err) {
//       console.error("Failed to fetch promotion products:", err.response?.data || err.message);
//       alert("Failed to load promotion products. Please try again.");
//     }
//   };

//   // Slider settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     lazyLoad: "ondemand",
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     responsive: [
//       { breakpoint: 992, settings: { slidesToShow: 2 } },
//       { breakpoint: 576, settings: { slidesToShow: 1 } },
//     ],
//   };

//   return (
//     <div className="product-promotion container py-4">
//       <h2 className="text-center mb-4">Product Promotions</h2>

//       {slides.length > 0 ? (
//         <Slider {...settings}>
//           {slides.map((slide, index) => (
//             <div className="p-2" key={slide._id || index}>
//               <div
//                 className="promotion-card shadow-sm rounded overflow-hidden"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(slide._id, slide.title)} // ✅ use _id instead of slug
//               >
//                 <img
//                   src={
//                     slide.image ||
//                     slide.images?.[0] ||
//                     slide.img ||
//                     "https://via.placeholder.com/400x300?text=No+Image"
//                   }
//                   alt={slide.title || `Promotion ${index + 1}`}
//                   loading="lazy"
//                   className="img-fluid"
//                   style={{ width: "100%", objectFit: "cover" }}
//                 />

//                 <p>Title</p>

//               </div>
//             </div>
//           ))}
//         </Slider>
//       ) : (
//         <p className="text-center text-muted">No promotions available.</p>
//       )}
//     </div>
//   );
// };

// export default ProductPramonation;























// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/ProductPromotion.css";

// const ProductPromotion = () => {
//   const [slides, setSlides] = useState([]);
//   const navigate = useNavigate();

//   // Fetch active promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/promotions/active?section=product"
//         );
//         const promotions =
//           res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
//         setSlides(promotions);
//       } catch (err) {
//         console.error("Failed to fetch promotions:", err.response || err);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   // Click promotion -> fetch products using promotion ID
//   const handlePromotionClick = async (promotionId, promotionTitle) => {
//     try {
//       const url = `https://beauty.joyory.com/api/user/promotions/${promotionId}/products`;
//       const res = await axios.get(url);
//       const products = res.data.products || [];

//       // Navigate to ProductPage and pass products via state
//       navigate(`/productpage/${promotionId}`, {
//         state: {
//           products,
//           pageTitle: promotionTitle || "Promotion Products",
//         },
//       });
//     } catch (err) {
//       console.error(
//         "Failed to fetch promotion products:",
//         err.response?.data || err.message
//       );
//       alert("Failed to load promotion products. Please try again.");
//     }
//   };

//   // Slider settings
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     lazyLoad: "ondemand",
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     responsive: [
//       { breakpoint: 992, settings: { slidesToShow: 2 } },
//       { breakpoint: 576, settings: { slidesToShow: 1 } },
//     ],
//   };

//   return (
//     <div className="product-promotion container py-4">
//       <h2 className="text-center mb-4">Product Promotions</h2>

//       {slides.length > 0 ? (
//         <Slider {...settings}>
//           {slides.map((slide, index) => (
//             <div className="p-2" key={slide._id || index}>
//               <div
//                 className="promotion-card shadow-sm rounded overflow-hidden text-center"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(slide._id, slide.title)}
//               >
//                 <img
//                   src={
//                     slide.image ||
//                     slide.images?.[0] ||
//                     slide.img ||
//                     "https://via.placeholder.com/400x300?text=No+Image"
//                   }
//                   alt={slide.title || `Promotion ${index + 1}`}
//                   loading="lazy"
//                   className="img-fluid"
//                   style={{ width: "100%", objectFit: "cover" }}
//                 />

//                 {/* ✅ Dynamic Title */}
//                 <h5 className="mt-2">{slide.title || "Untitled Promotion"}</h5>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       ) : (
//         <p className="text-center text-muted">No promotions available.</p>
//       )}
//     </div>
//   );
// };

// export default ProductPromotion;



















// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "../css/ProductPromotion.css";

// const ProductPromotion = () => {
//   const [slides, setSlides] = useState([]);
//   const navigate = useNavigate();

//   // Fetch active promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/promotions/active?section=product"
//         );
//         const promotions =
//           res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
//         setSlides(promotions);
//       } catch (err) {
//         console.error("Failed to fetch promotions:", err.response || err);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   // Click promotion -> fetch products using promotion ID
//   const handlePromotionClick = async (promotionId, promotionTitle) => {
//     try {
//       const url = `https://beauty.joyory.com/api/user/promotions/${promotionId}/products`;
//       const res = await axios.get(url);
//       const products = res.data.products || [];

//       // Navigate to ProductPage and pass products via state
//       navigate(`/productpage/${promotionId}`, {
//         state: {
//           products,
//           pageTitle: promotionTitle || "Promotion Products",
//         },
//       });
//     } catch (err) {
//       console.error(
//         "Failed to fetch promotion products:",
//         err.response?.data || err.message
//       );
//       alert("Failed to load promotion products. Please try again.");
//     }
//   };

//   return (
//     <div className="product-promotion container py-4">
//       <h2 className="text-center mb-5 mt-5">Product Promotions</h2>

//       {slides.length > 0 ? (
//         <Swiper
//           modules={[Autoplay, Pagination]}
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 2500, disableOnInteraction: false }}
//           navigation={true} // Enable arrows
//           speed={800}
//           spaceBetween={15}
//           breakpoints={{
//             300: { slidesPerView: 1 },
//             576: { slidesPerView: 1 },
//             768: { slidesPerView: 2 },
//             992: { slidesPerView: 2 },
//             1200: { slidesPerView: 2 },
//           }}
//         >
//           {slides.map((slide, index) => (
//             <SwiperSlide key={slide._id || index}>
//               <div
//                 className="promotion-card shadow-sm rounded overflow-hidden text-center"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(slide._id, slide.title)}
//               >
//                 <img
//                   src={
//                     slide.image ||
//                     slide.images?.[0] ||
//                     slide.img ||
//                     "https://via.placeholder.com/400x300?text=No+Image"
//                   }
//                   alt={slide.title || `Promotion ${index + 1}`}
//                   loading="lazy"
//                   className="img-fluid"
//                   style={{ width: "100%", objectFit: "cover" }}
//                 />
//                 {/* <h5 className="mt-2">{slide.title || "Untitled Promotion"}</h5> */}
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <p className="text-center text-muted">No promotions available.</p>
//       )}
//     </div>
//   );
// };

// export default ProductPromotion;










// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Added Navigation
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation"; // Import navigation CSS
// import "../css/ProductPromotion.css";
// import "../App.css";

// const ProductPromotion = () => {
//   const [slides, setSlides] = useState([]);
//   const navigate = useNavigate();

//   // Fetch active promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/promotions/active?section=product"
//         );
//         const promotions =
//           res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
//         setSlides(promotions);
//       } catch (err) {
//         console.error("Failed to fetch promotions:", err.response || err);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   // Click promotion -> fetch products using promotion ID
//   const handlePromotionClick = async (promotionId, promotionTitle) => {
//     try {
//       const url = `https://beauty.joyory.com/api/user/promotions/${promotionId}/products`;
//       const res = await axios.get(url);
//       const products = res.data.products || [];

//       // Navigate to ProductPage and pass products via state
//       navigate(`/productpage/${promotionId}`, {
//         state: {
//           products,
//           pageTitle: promotionTitle || "Promotion Products",
//         },
//       });
//     } catch (err) {
//       console.error(
//         "Failed to fetch promotion products:",
//         err.response?.data || err.message
//       );
//       alert("Failed to load promotion products. Please try again.");
//     }
//   };

//   return (
//     <div className="product-promotion container-fluid py-4">
//       <h2 className="font-family-Playfair text-center mt-3 mb-4 mb-lg-5 mt-lg-5 fw-bold spacing">Product Promotions</h2>



//       {slides.length > 0 ? (
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]} // Added Navigation
//           pagination={{ clickable: true }}
//           navigation={true} // Enable arrows
//           autoplay={{ delay: 2500, disableOnInteraction: false }}
//           speed={800}
//           spaceBetween={15}
//           breakpoints={{
//             300: { slidesPerView: 2 },
//             576: { slidesPerView: 2 },
//             768: { slidesPerView: 2 },
//             992: { slidesPerView: 2 },
//             1200: { slidesPerView: 2 },
//           }}
//         >


//           <div className="mobile-responsive-code">
//             {slides.map((slide, index) => (
//               <SwiperSlide key={slide._id || index}>
//                 <div
//                   className="promotion-card shadow-sm rounded overflow-hidden text-center"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => handlePromotionClick(slide._id, slide.title)}
//                 >
//                   <img
//                     src={
//                       slide.image ||
//                       slide.images?.[0] ||
//                       slide.img ||
//                       "https://via.placeholder.com/400x300?text=No+Image"
//                     }
//                     alt={slide.title || `Promotion ${index + 1}`}
//                     loading="lazy"
//                     className="img-fluid"
//                     style={{objectFit: "cover" }}
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </div>

//         </Swiper>
//       ) : (
//         <p className="text-center text-muted">No promotions available.</p>
//       )}
//     </div>
//   );
// };

// export default ProductPromotion;




















// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/ProductPromotion.css";
// import "../App.css";

// const ProductPromotion = () => {
//   const [slides, setSlides] = useState([]);
//   const navigate = useNavigate();

//   // Fetch active promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/promotions/active?section=product"
//         );
//         const promotions =
//           res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
//         setSlides(promotions);
//       } catch (err) {
//         console.error("Failed to fetch promotions:", err.response || err);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   // Click promotion -> navigate using slug (preferred) or ID
//   const handlePromotionClick = (promotion) => {
//     const param = promotion.slug || promotion._id; // Prefer slug, fallback to ID
//     const title = promotion.title || "Promotion Products";

//     // Navigate to ProductPage with param (slug or ID)
//     navigate(`/productpage/${param}`, {
//       state: {
//         pageTitle: title,
//       },
//     });
//   };

//   return (
//     // <div className="product-promotion container">

//     <div className="product-promotion container-fluid my-4">
//       {/* <h2 className="font-family-Playfair text-center mt-3 mb-4 mb-lg-5 mt-lg-5 fw-bold spacing"> */}
//       <h2 className="mb-3 text-left ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 spacing Promotions-headings fw-normal">
//         Product Promotions
//       </h2>


//       <div className="mobile-responsive-code">
//         {slides.length > 0 ? (
//           <Swiper
//             modules={[Autoplay, Pagination, Navigation]}
//             pagination={{ clickable: true }}
//             navigation={true}
//             autoplay={{ delay: 2500, disableOnInteraction: false }}
//             speed={800}
//             spaceBetween={15}
//             breakpoints={{
//               // 300: { slidesPerView: 2 },
//               // 576: { slidesPerView: 2 },
//               // 768: { slidesPerView: 2 },
//               // 992: { slidesPerView: 2 },
//               // 1200: { slidesPerView: 2 },
//               // 300: { slidesPerView: 2, spaceBetween: 10 },
//               // 576: { slidesPerView: 2.5, spaceBetween: 15 },
//               // 768: { slidesPerView: 3, spaceBetween: 15 },
//               // 992: { slidesPerView: 4, spaceBetween: 20 },
//               // 1200: { slidesPerView: 5, spaceBetween: 25 },





//               300: { slidesPerView: 2 , spaceBetween: 10},
//               380: { slidesPerView: 2 , spaceBetween: 10},
//               576: { slidesPerView: 3 , spaceBetween: 15},
//               768: { slidesPerView: 3 , spaceBetween: 15},
//               992: { slidesPerView: 3 , spaceBetween: 20 },
//               1024: { slidesPerView: 4 , spaceBetween: 25 },
//               1200: { slidesPerView: 5 , spaceBetween: 25 },
//               1400: { slidesPerView: 5 , spaceBetween: 25 },
//             }}
//           >

//             {slides.map((slide, index) => (
//               <SwiperSlide key={slide._id || index}>
//                 {/* <div
//                   className="promotion-card shadow-sm rounded overflow-hidden text-center"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => handlePromotionClick(slide)}
//                 >
//                   <img
//                     src={
//                       slide.image ||
//                       slide.images?.[0] ||
//                       slide.img ||
//                       "https://via.placeholder.com/400x300?text=No+Image"
//                     }
//                     alt={slide.title || `Promotion ${index + 1}`}
//                     loading="lazy"
//                     className="img-fluid"
//                     style={{ objectFit: "cover" }}
//                   />
//                 </div> */}


//                 <div
//                   className="overflow-hidden position-relative"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => handlePromotionClick(slide)}
//                 >
//                   <img
//                     src={
//                       slide.image ||
//                       slide.images?.[0] ||
//                       slide.img ||
//                       "https://via.placeholder.com/400x300?text=No+Image"
//                     }
//                     alt={slide.campaignName || `Promotion ${index + 1}`}
//                     loading="lazy"
//                     className="img-fluid"
//                     style={{ objectFit: "cover", height: "100%" }}
//                   />

//                   {/* 🔥 CAPTION OVERLAY */}
//                   <div className="promotion-caption">
//                     <h6 className="promotion-title">
//                       {slide.campaignName?.toUpperCase()}
//                     </h6>

//                     {slide.description && (
//                       <p className="promotion-subtitle text-center">
//                         {slide.description}
//                       </p>
//                     )}

//                     {slide.discountValue && (
//                       <span className="promotion-badge">
//                         {slide.discountValue}
//                         {slide.discountUnit === "percent" ? "% OFF" : " OFF"}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//               </SwiperSlide>
//             ))}

//           </Swiper>
//         ) : (
//           <p className="text-center text-muted">No promotions available.</p>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ProductPromotion;


















// // src/components/ProductPromotion.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/ProductPromotion.css";
// import "../App.css";

// // ✅ Same hook as in OffersSlider for consistent responsive behavior
// function useWindowSize() {
//   const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
//   useEffect(() => {
//     const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// const ProductPromotion = () => {
//   const [slides, setSlides] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [width] = useWindowSize();

//   // Fetch active promotions
//   useEffect(() => {
//     const fetchPromotions = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/promotions/active?section=product"
//         );
//         const promotions =
//           res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
//         setSlides(promotions);
//       } catch (err) {
//         console.error("Failed to fetch promotions:", err.response || err);
//         setError(err.message || "Failed to fetch promotions");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPromotions();
//   }, []);

//   // ✅ Same behavior as OffersSlider:
//   // - Show loading state
//   // - Show error state
//   // - Completely hide the entire section (return null) if no promotions
//   if (isLoading) return <div className="loading-state page-title-main-name">Loading product promotions...</div>;
//   if (error) return <div className="error-state">Error: {error}</div>;
//   if (slides.length === 0) return null;

//   // ✅ Dynamic slides & space (exact match with OffersSlider breakpoints)
//   const currentSlidesToShow =
//     width >= 1400 ? 5 :
//     width >= 1200 ? 5 :
//     width >= 1024 ? 4 :
//     width >= 992 ? 3 :
//     width >= 768 ? 3 :
//     width >= 576 ? 3 :
//     width >= 380 ? 2 : 2;

//   const currentSpaceBetween =
//     width >= 1024 ? 25 :
//     width >= 992 ? 20 :
//     width >= 576 ? 15 :
//     10;

//   // ✅ Only enable loop & autoplay when there are more items than visible (same as OffersSlider)
//   const shouldScroll = slides.length > currentSlidesToShow;

//   // Click promotion → navigate using slug (preferred) or ID
//   const handlePromotionClick = (promotion) => {
//     const param = promotion.slug || promotion._id;
//     const title = promotion.campaignName || promotion.title || "Promotion Products";

//     navigate(`/productpage/${param}`, {
//       state: {
//         pageTitle: title,
//       },
//     });
//   };

//   return (
//     <div className="product-promotion container-fluid my-4">
//       <h2 className="mb-3 text-left ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 spacing Promotions-headings fw-normal">
//         Product Promotions
//       </h2>

//       <div className="mobile-responsive-code">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           pagination={{ clickable: true }}
//           navigation={true}
//           loop={shouldScroll}
//           autoplay={shouldScroll ? {
//             delay: 2500,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true,
//           } : false}
//           speed={600}
//           slidesPerView={currentSlidesToShow}
//           spaceBetween={currentSpaceBetween}
//         >
//           {slides.map((slide, index) => (
//             <SwiperSlide key={slide._id || index}>
//               <div
//                 className="overflow-hidden position-relative"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handlePromotionClick(slide)}
//               >
//                 <img
//                   src={
//                     slide.image ||
//                     slide.images?.[0] ||
//                     slide.img ||
//                     "https://via.placeholder.com/400x300?text=No+Image"
//                   }
//                   alt={slide.campaignName || `Promotion ${index + 1}`}
//                   loading="lazy"
//                   className="img-fluid"
//                   style={{ objectFit: "cover", height: "100%" }}
//                 />

//                 {/* 🔥 CAPTION OVERLAY */}
//                 <div className="promotion-caption">
//                   <h6 className="promotion-title">
//                     {slide.campaignName?.toUpperCase() || ""}
//                   </h6>

//                   {slide.description && (
//                     <p className="promotion-subtitle text-center">
//                       {slide.description}
//                     </p>
//                   )}

//                   {slide.discountValue && (
//                     <span className="promotion-badge">
//                       {slide.discountValue}
//                       {slide.discountUnit === "percent" ? "% OFF" : " OFF"}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default ProductPromotion;























import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/ProductPromotion.css";
import "../App.css";

// ✅ Same hook as in OffersSlider for consistent responsive behavior
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

const ProductPromotion = () => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [width] = useWindowSize();

  // Fetch active promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(
          "https://beauty.joyory.com/api/user/promotions/active?section=product"
        );
        const promotions =
          res.data?.promotions || (Array.isArray(res.data) ? res.data : []);
        setSlides(promotions);
      } catch (err) {
        console.error("Failed to fetch promotions:", err.response || err);
        setError(err.message || "Failed to fetch promotions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // ✅ Same behavior as OffersSlider:
  // - Show loading state
  // - Show error state
  // - Completely hide the entire section (return null) if no promotions
  if (isLoading) return <div className="loading-state page-title-main-name">Loading product promotions...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (slides.length === 0) return null;

  // ✅ Dynamic slides & space (exact match with OffersSlider breakpoints)
  const currentSlidesToShow =
    width >= 1400 ? 3 :
      width >= 1200 ? 3 :
        width >= 1024 ? 3 :
          width >= 992 ? 3 :
            width >= 768 ? 3 :
              width >= 576 ? 3 :
                width >= 380 ? 2 : 2;

  const currentSpaceBetween =
    width >= 1024 ? 25 :
      width >= 992 ? 20 :
        width >= 576 ? 15 :
          10;

  // ✅ Only enable loop & autoplay when there are more items than visible (same as OffersSlider)
  const shouldScroll = slides.length > currentSlidesToShow;

  // Click promotion → navigate using slug (preferred) or ID
  // const handlePromotionClick = (promotion) => {
  //   const param = promotion.slug || promotion._id;
  //   const title = promotion.campaignName || promotion.title || "Promotion Products";

  //   navigate(`/productpage/${param}`, {
  //     state: {
  //       pageTitle: title,
  //     },
  //   });
  // };


  const handlePromotionClick = (promotion) => {
    const { scope, targetSlug, slug, _id } = promotion;

    // ✅ SAME LOGIC AS OFFERS SLIDER
    if (scope === "category" && targetSlug) {
      navigate(`/Products/category/${targetSlug}`);
    }
    else if (scope === "brand" && targetSlug) {
      navigate(`/brand/${targetSlug}`);
    }
    else if (scope === "product" && targetSlug) {
      navigate(`/product/${targetSlug}`);
    }
    else {
      // fallback
      const param = slug || _id;
      navigate(`/productpage/${param}`, {
        state: {
          pageTitle: promotion.campaignName || promotion.title || "Promotion",
        },
      });
    }
  };

  return (
    <div className="product-promotion container-fluid margin-left-rights">
      <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-0 mt-0 spacing Promotions-headings fw-normal">
        Product Promotions
      </h2>

      <div className="mobile-responsive-code mt-3">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={true}
          loop={shouldScroll}
          autoplay={shouldScroll ? {
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          speed={600}
          slidesPerView={currentSlidesToShow}
          spaceBetween={currentSpaceBetween}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide._id || index}>
              <div
                className="overflow-hidden position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => handlePromotionClick(slide)}
              >
                <img
                  src={
                    slide.image ||
                    slide.images?.[0] ||
                    slide.img ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={slide.campaignName || `Promotion ${index + 1}`}
                  loading="lazy"
                  className="img-fluid"
                  style={{ objectFit: "cover", height: "100%" }}
                />

                {/* 🔥 CAPTION OVERLAY */}
                <div className="promotion-caption">
                  <h6 className="promotion-title">
                    {slide.campaignName?.toUpperCase() || ""}
                  </h6>

                  {slide.description && (
                    <p className="promotion-subtitle text-start">
                      {slide.description}
                    </p>
                  )}

                  {slide.discountValue && (
                    <span className="promotion-badge">
                      {slide.discountValue}
                      {slide.discountUnit === "percent" ? "% OFF" : " OFF"}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductPromotion;