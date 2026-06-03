// // // src/components/RecommendationSlider.jsx
// // import React from "react";
// // import Slider from "react-slick";
// // import { useNavigate } from "react-router-dom";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // const sliderSettings = {
// //   dots: true,
// //   infinite: true,
// //   speed: 500,
// //   slidesToShow: 3,
// //   slidesToScroll: 1,
// //   responsive: [
// //     { breakpoint: 1024, settings: { slidesToShow: 2 } },
// //     { breakpoint: 768, settings: { slidesToShow: 1 } },
// //   ],
// // };

// // const RecommendationSlider = ({ title, products }) => {
// //   const navigate = useNavigate();
// //   if (!products || products.length === 0) return null;

// //   return (
// //     <div className="recommendation-slider mt-4">
// //       <h2>{title}</h2>
// //       <Slider {...sliderSettings}>
// //         {products.map((item) => (
// //           <div
// //             key={item._id}
// //             className="similar-product-card"
// //             onClick={() => navigate(`/product/${item._id}`)}
// //             style={{ cursor: "pointer", padding: "10px" }}
// //           >
// //             <img
// //               src={item.images?.[0] || "/placeholder.png"}
// //               alt={item.name}
// //               style={{
// //                 width: "100%",
// //                 borderRadius: "8px",
// //                 height: "200px",
// //                 objectFit: "cover",
// //               }}
// //             />
// //             <div style={{ marginTop: "8px" }}>
// //               <p style={{ fontWeight: "500" }}>{item.name}</p>
// //               <p style={{ color: "#0077b6", fontWeight: "bold" }}>₹{item.price}</p>
// //               {item.discountPercent > 0 && (
// //                 <span className="discount-badge">{item.discountPercent}% OFF</span>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </Slider>
// //     </div>
// //   );
// // };

// // export default RecommendationSlider;











// // // src/components/RecommendationSlider.jsx
// // import React, { useEffect, useState } from "react";
// // import Slider from "react-slick";
// // import { useNavigate } from "react-router-dom";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // const RecommendationSlider = ({ title, products }) => {
// //   const navigate = useNavigate();
// //   const [slidesToShow, setSlidesToShow] = useState(3);

// //   // ✅ Dynamically update slides based on screen width
// //   const updateSlidesToShow = () => {
// //     if (window.innerWidth < 768) {
// //       setSlidesToShow(1); // mobile
// //     } else if (window.innerWidth < 1024) {
// //       setSlidesToShow(2); // tablet
// //     } else {
// //       setSlidesToShow(3); // desktop
// //     }
// //   };

// //   useEffect(() => {
// //     updateSlidesToShow(); // run once on load
// //     window.addEventListener("resize", updateSlidesToShow);
// //     return () => window.removeEventListener("resize", updateSlidesToShow);
// //   }, []);

// //   if (!products || products.length === 0) return null;

// //   const sliderSettings = {
// //     dots: true,
// //     infinite: products.length > slidesToShow, // prevent empty slides
// //     speed: 500,
// //     slidesToShow,
// //     slidesToScroll: 1,
// //     adaptiveHeight: true,
// //   };

// //   return (
// //     <div className="recommendation-slider mt-4">
// //       <h2>{title}</h2>
// //       <Slider {...sliderSettings}>
// //         {products.map((item) => (
// //           <div
// //             key={item._id}
// //             className="similar-product-card"
// //             onClick={() => navigate(`/product/${item._id}`)}
// //             style={{ cursor: "pointer", padding: "10px" }}
// //           >
// //             <img
// //               src={item.images?.[0] || "/placeholder.png"}
// //               alt={item.name}
// //               style={{
// //                 width: "100%",
// //                 borderRadius: "8px",
// //                 height: "200px",
// //                 objectFit: "cover",
// //               }}
// //             />
// //             <div style={{ marginTop: "8px" }}>
// //               <p style={{ fontWeight: "500" }}>{item.name}</p>
// //               <p style={{ color: "#0077b6", fontWeight: "bold" }}>₹{item.price}</p>
// //               {item.discountPercent > 0 && (
// //                 <span className="discount-badge">{item.discountPercent}% OFF</span>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </Slider>
// //     </div>
// //   );
// // };

// // export default RecommendationSlider;





// // // src/components/RecommendationSlider.jsx
// // import React, { useEffect, useState } from "react";
// // import Slider from "react-slick";
// // import { useNavigate } from "react-router-dom";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // // Custom arrow components
// // const NextArrow = ({ onClick }) => (
// //   <div
// //     className="slick-arrow slick-next"
// //     style={{ right: "10px", zIndex: 2 }}
// //     onClick={onClick}
// //   >
// //     ➡️
// //   </div>
// // );

// // const PrevArrow = ({ onClick }) => (
// //   <div
// //     className="slick-arrow slick-prev"
// //     style={{ left: "10px", zIndex: 2 }}
// //     onClick={onClick}
// //   >
// //     ⬅️
// //   </div>
// // );

// // const RecommendationSlider = ({ title, products }) => {
// //   const navigate = useNavigate();
// //   const [slidesToShow, setSlidesToShow] = useState(3);

// //   // Dynamically update slides based on screen width
// //   const updateSlidesToShow = () => {
// //     if (window.innerWidth < 768) {
// //       setSlidesToShow(1); // mobile
// //     } else if (window.innerWidth < 1024) {
// //       setSlidesToShow(2); // tablet
// //     } else {
// //       setSlidesToShow(3); // desktop
// //     }
// //   };

// //   useEffect(() => {
// //     updateSlidesToShow(); // run once on load
// //     window.addEventListener("resize", updateSlidesToShow);
// //     return () => window.removeEventListener("resize", updateSlidesToShow);
// //   }, []);

// //   if (!products || products.length === 0) return null;

// //   const sliderSettings = {
// //     dots: true,
// //     infinite: products.length > slidesToShow,
// //     speed: 500,
// //     slidesToShow,
// //     slidesToScroll: 1,
// //     adaptiveHeight: true,
// //     nextArrow: <NextArrow />,
// //     prevArrow: <PrevArrow />,
// //   };

// //   return (
// //     <div className="recommendation-slider mt-4">
// //       <h2>{title}</h2>
// //       <Slider {...sliderSettings}>
// //         {products.map((item) => (
// //           <div
// //             key={item._id}
// //             className="similar-product-card"
// //             onClick={() => navigate(`/product/${item._id}`)}
// //             style={{ cursor: "pointer", padding: "10px" }}
// //           >
// //             <img
// //               src={item.images?.[0] || "/placeholder.png"}
// //               alt={item.name}
// //               style={{
// //                 width: "100%",
// //                 borderRadius: "8px",
// //                 height: "200px",
// //                 objectFit: "cover",
// //               }}
// //             />
// //             <div style={{ marginTop: "8px" }}>
// //               <p style={{ fontWeight: "500" }}>{item.name}</p>
// //               <p style={{ color: "#0077b6", fontWeight: "bold" }}>₹{item.price}</p>
// //               {item.discountPercent > 0 && (
// //                 <span className="discount-badge">{item.discountPercent}% OFF</span>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </Slider>
// //     </div>
// //   );
// // };

// // export default RecommendationSlider;











// // src/components/RecommendationSlider.jsx
// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Custom arrow components
// const NextArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", right: "10px", zIndex: 2 }}
//       onClick={onClick}
//     >
//       ➡️
//     </div>
//   );
// };

// const PrevArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", left: "10px", zIndex: 2 }}
//       onClick={onClick}
//     >
//       ⬅️
//     </div>
//   );
// };

// const RecommendationSlider = ({ title, products }) => {
//   const navigate = useNavigate();
//   const [slidesToShow, setSlidesToShow] = useState(3);

//   // Dynamically update slides based on screen width
//   const updateSlidesToShow = () => {
//     if (window.innerWidth < 768) setSlidesToShow(1);
//     else if (window.innerWidth < 1024) setSlidesToShow(2);
//     else setSlidesToShow(3);
//   };

//   useEffect(() => {
//     updateSlidesToShow();
//     window.addEventListener("resize", updateSlidesToShow);
//     return () => window.removeEventListener("resize", updateSlidesToShow);
//   }, []);

//   if (!products || products.length === 0) return null;

//   const sliderSettings = {
//     dots: true,
//     infinite: products.length > slidesToShow,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   };

//   return (
//     <div className="recommendation-slider mt-4">
//       <h2>{title}</h2>
//       <Slider {...sliderSettings}>
//         {products.map((item) => (
//           <div
//             key={item._id}
//             className="similar-product-card"
//             onClick={() => navigate(`/product/${item._id}`)}
//             style={{ cursor: "pointer", padding: "10px" }}
//           >
//             <img
//               src={item.images?.[0] || "/placeholder.png"}
//               alt={item.name}
//               style={{
//                 width: "100%",
//                 borderRadius: "8px",
//                 height: "200px",
//                 objectFit: "cover",
//               }}
//             />
//             <div style={{ marginTop: "8px" }}>
//               <p style={{ fontWeight: "500" }}>{item.name}</p>
//               <p style={{ color: "#0077b6", fontWeight: "bold" }}>₹{item.price}</p>
//               {item.discountPercent > 0 && (
//                 <span className="discount-badge">{item.discountPercent}% OFF</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default RecommendationSlider;



























// // src/components/RecommendationSlider.jsx
// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Custom arrow components
// const NextArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", right: "10px", zIndex: 2 }}
//       onClick={onClick}
//     >
//       ➡️
//     </div>
//   );
// };

// const PrevArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", left: "10px", zIndex: 2 }}
//       onClick={onClick}
//     >
//       ⬅️
//     </div>
//   );
// };

// const RecommendationSlider = ({ title, products }) => {
//   const navigate = useNavigate();
//   const [slidesToShow, setSlidesToShow] = useState(3);
//   const [loading, setLoading] = useState(true);

//   // Handle loader state when products change
//   useEffect(() => {
//     if (products && products.length > 0) {
//       setLoading(false);
//     } else {
//       setLoading(true);
//     }
//   }, [products]);

//   // Dynamically update slides based on screen width
//   const updateSlidesToShow = () => {
//     if (window.innerWidth < 768) setSlidesToShow(1);
//     else if (window.innerWidth < 1024) setSlidesToShow(2);
//     else setSlidesToShow(3);
//   };

//   useEffect(() => {
//     updateSlidesToShow();
//     window.addEventListener("resize", updateSlidesToShow);
//     return () => window.removeEventListener("resize", updateSlidesToShow);
//   }, []);

//   const sliderSettings = {
//     dots: true,
//     infinite: products?.length > slidesToShow,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   };

//   return (
//     <div className="recommendation-slider mt-4">
//       <h2>{title}</h2>

//       {/* Loader */}
//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center p-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <Slider {...sliderSettings}>
//           {products.map((item) => (
//             <div
//               key={item._id}
//               className="similar-product-card"
//               onClick={() => navigate(`/product/${item._id}`)}
//               style={{ cursor: "pointer", padding: "10px" }}
//             >
//               <img
//                 src={item.images?.[0] || "/placeholder.png"}
//                 alt={item.name}
//                 style={{
//                   width: "100%",
//                   borderRadius: "8px",
//                   height: "200px",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={{ marginTop: "8px" }}>
//                 <p style={{ fontWeight: "500" }}>{item.name}</p>
//                 <p style={{ color: "#0077b6", fontWeight: "bold" }}>
//                   ₹{item.price}
//                 </p>
//                 {item.discountPercent > 0 && (
//                   <span className="discount-badge">
//                     {item.discountPercent}% OFF
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;




















// import React, { useEffect, useState, useContext } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaStar } from "react-icons/fa";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";

// // Custom arrows
// const NextArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", right: "10px", zIndex: 2 }}
//       onClick={onClick}
//     >
//       ➡️
//     </div>
//   );
// };

// const PrevArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", left: "10px", zIndex: 2 }}
//       onClick={onClick}
//     >
//       ⬅️
//     </div>
//   );
// };

// const RecommendationSlider = ({ title, products }) => {
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const [slidesToShow, setSlidesToShow] = useState(3);
//   const [loading, setLoading] = useState(true);
//   const [addingToCart, setAddingToCart] = useState({});

//   // Loader when products change
//   useEffect(() => {
//     setLoading(!(products && products.length > 0));
//   }, [products]);

//   // Responsive slides
//   const updateSlidesToShow = () => {
//     if (window.innerWidth < 768) setSlidesToShow(1);
//     else if (window.innerWidth < 1024) setSlidesToShow(2);
//     else setSlidesToShow(3);
//   };

//   useEffect(() => {
//     updateSlidesToShow();
//     window.addEventListener("resize", updateSlidesToShow);
//     return () => window.removeEventListener("resize", updateSlidesToShow);
//   }, []);

//   // ⭐ Average rating
//   const getAverageRating = (product) => {
//     if (!product.reviews || product.reviews.length === 0) return 0;
//     const total = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
//     return (total / product.reviews.length).toFixed(1);
//   };

//   // 🛒 Add to Cart Logic (same as main product page)
//   const handleAddToCart = async (product) => {
//     try {
//       await axios.get("https://beauty.joyory.com/api/user/profile", {
//         withCredentials: true,
//       });

//       const variantToAdd =
//         product.variants?.find((v) => v.stock > 0) || product.variants?.[0];

//       if (!variantToAdd) {
//         alert("❌ No available variants for this product.");
//         return;
//       }

//       if (variantToAdd.stock !== undefined && variantToAdd.stock <= 0) {
//         alert("❌ This variant is out of stock.");
//         return;
//       }

//       setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

//       const cartPayload = {
//         productId: product._id,
//         variants: [
//           {
//             variantSku:
//               variantToAdd.sku ||
//               `sku-${product._id}-${variantToAdd.shadeName || "default"}`,
//             quantity: 1,
//           },
//         ],
//       };

//       const res = await axios.post(
//         "https://beauty.joyory.com/api/user/cart/add",
//         cartPayload,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         addToCart(product, variantToAdd);
//         alert("✅ Added to cart!");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         alert(res.data.message || "❌ Failed to add to cart.");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       if (err.response?.status === 401) {
//         alert("⚠️ Please login first");
//         navigate("/login");
//       } else {
//         alert("❌ Failed to add product.");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: products?.length > slidesToShow,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   };

//   return (
//     <div className="recommendation-slider mt-4">
//       <h2>{title}</h2>

//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center p-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <Slider {...sliderSettings}>
//           {products.map((item) => {
//             const avgRating = getAverageRating(item);
//             const hasDiscount = item.mrp && item.price && item.mrp > item.price;
//             const discountPercent = hasDiscount
//               ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
//               : 0;

//             return (
//               <div
//                 key={item._id}
//                 className="similar-product-card"
//                 style={{ cursor: "pointer", padding: "10px" }}
//               >
//                 <div onClick={() => navigate(`/product/${item._id}`)}>
//                   <img
//                     src={item.images?.[0] || "/placeholder.png"}
//                     alt={item.name}
//                     style={{
//                       width: "100%",
//                       borderRadius: "8px",
//                       height: "200px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <div style={{ marginTop: "8px" }}>
//                     <p style={{ fontWeight: "500" }}>{item.name}</p>
//                     <p style={{ color: "#0077b6", fontWeight: "bold" }}>
//                       ₹{item.price}
//                       {hasDiscount && (
//                         <span
//                           style={{
//                             fontSize: "0.85rem",
//                             marginLeft: "4px",
//                             color: "green",
//                           }}
//                         >
//                           ({discountPercent}% OFF)
//                         </span>
//                       )}
//                     </p>
//                     {hasDiscount && (
//                       <del
//                         style={{
//                           fontSize: "0.85rem",
//                           color: "#888",
//                           display: "block",
//                         }}
//                       >
//                         ₹{item.mrp}
//                       </del>
//                     )}
//                   </div>
//                 </div>

//                 {/* 🔹 Shade Summary */}
//                 {item.variants && item.variants.length > 0 && (
//                   <p
//                     style={{
//                       fontSize: "0.85rem",
//                       color: "#555",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     {item.variants.length} shades available
//                   </p>
//                 )}

//                 {/* ⭐ Rating */}
//                 <div className="d-flex align-items-center mb-2">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar
//                       key={i}
//                       size={14}
//                       color={i < Math.round(avgRating) ? "#ffc107" : "#e4e5e9"}
//                     />
//                   ))}
//                   <span
//                     className="ms-2 text-muted"
//                     style={{ fontSize: "0.85rem" }}
//                   >
//                     {avgRating > 0 ? avgRating : "0.0"}
//                   </span>
//                 </div>

//                 {/* 🛒 Add to Cart Button */}
//                 <button
//                   className="btn btn-primary w-100 mt-2"
//                   onClick={() => handleAddToCart(item)}
//                   disabled={addingToCart[item._id]}
//                 >
//                   {addingToCart[item._id] ? "Adding..." : "Add to Cart"}
//                 </button>
//               </div>
//             );
//           })}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;















// // src/components/RecommendationSlider.jsx
// import React, { useEffect, useState, useContext } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaStar } from "react-icons/fa";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";

// // Custom arrows
// const NextArrow = ({ className, style, onClick }) => (
//   <div
//     className={className}
//     style={{ ...style, display: "block", right: "10px", zIndex: 2 }}
//     onClick={onClick}
//   >
//     ➡️
//   </div>
// );

// const PrevArrow = ({ className, style, onClick }) => (
//   <div
//     className={className}
//     style={{ ...style, display: "block", left: "10px", zIndex: 2 }}
//     onClick={onClick}
//   >
//     ⬅️
//   </div>
// );

// const RecommendationSlider = ({ title, products }) => {
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const [slidesToShow, setSlidesToShow] = useState(3);
//   const [loading, setLoading] = useState(true);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShade, setSelectedShade] = useState({});

//   useEffect(() => {
//     setLoading(!(products && products.length > 0));
//   }, [products]);

//   // Responsive slider
//   const updateSlidesToShow = () => {
//     if (window.innerWidth < 768) setSlidesToShow(1);
//     else if (window.innerWidth < 1024) setSlidesToShow(2);
//     else setSlidesToShow(3);
//   };

//   useEffect(() => {
//     updateSlidesToShow();
//     window.addEventListener("resize", updateSlidesToShow);
//     return () => window.removeEventListener("resize", updateSlidesToShow);
//   }, []);

//   // ⭐ Average rating
//   const getAverageRating = (product) => {
//     if (!product.reviews || product.reviews.length === 0) return 0;
//     const total = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
//     return (total / product.reviews.length).toFixed(1);
//   };

//   // 🛒 Add to Cart
//   const handleAddToCart = async (product) => {
//     try {
//       await axios.get("https://beauty.joyory.com/api/user/profile", {
//         withCredentials: true,
//       });

//       const selectedVariant =
//         selectedShade[product._id] ||
//         product.variants?.find((v) => v.stock > 0) ||
//         product.variants?.[0];

//       if (!selectedVariant) {
//         alert("❌ Please select a shade before adding to cart.");
//         return;
//       }

//       if (selectedVariant.stock !== undefined && selectedVariant.stock <= 0) {
//         alert("❌ This variant is out of stock.");
//         return;
//       }

//       setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

//       const cartPayload = {
//         productId: product._id,
//         variants: [
//           {
//             variantSku: selectedVariant.sku || selectedVariant.variantSku,
//             quantity: 1,
//           },
//         ],
//       };

//       const res = await axios.post(
//         "https://beauty.joyory.com/api/user/cart/add",
//         cartPayload,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         addToCart(product, selectedVariant);
//         alert("✅ Added to cart!");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         alert(res.data.message || "❌ Failed to add to cart.");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       if (err.response?.status === 401) {
//         alert("⚠️ Please login first");
//         navigate("/login");
//       } else {
//         alert("❌ Failed to add product.");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: products?.length > slidesToShow,
//     speed: 500,
//     slidesToShow, // default
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024, // screens <= 1024px
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           infinite: products?.length > 2,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 768, // screens <= 768px
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//           infinite: products?.length > 1,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 480, // screens <= 480px
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: products?.length > 1,
//           dots: true,
//         },
//       },
//     ],
//   };


//   return (
//     <div className="recommendation-slider mt-4">
//       <h2>{title}</h2>

//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center p-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <Slider {...sliderSettings}>
//           {products.map((item) => {
//             const avgRating = getAverageRating(item);

//             const activeVariant = selectedShade[item._id] || item.variants?.[0] || {};
//             const price = activeVariant.displayPrice || activeVariant.price || item.price;
//             const mrp = activeVariant.originalPrice || activeVariant.mrp || item.mrp;


//             const discountPercent =
//               mrp && price && mrp > price
//                 ? Math.round(((mrp - price) / mrp) * 100)
//                 : 0;

//             return (
//               <div
//                 key={item._id}
//                 className="similar-product-card"
//                 style={{ cursor: "pointer", padding: "10px" }}
//               >
//                 <div onClick={() => navigate(`/product/${item._id}`)}>
//                   <img
//                     src={item.images?.[0] || "/placeholder.png"}
//                     alt={item.name}
//                     style={{
//                       width: "100%",
//                       borderRadius: "8px",
//                       height: "200px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <div style={{ marginTop: "8px" }}>



//                     <div className="d-flex" style={{flexDirection:"column"}}>


//                       <p style={{ fontWeight: "500" }}>{item.name}</p>

//                       {/* ✅ Dynamic Price Section */}

//                       <div className="d-flex">


//                         <p style={{ color: "#0077b6", fontWeight: "bold", display: "flex", margin: "0", padding: "0" }}>
//                           ₹{price}
//                           {discountPercent > 0 && (
//                             <span
//                               style={{
//                                 fontSize: "0.85rem",
//                                 marginLeft: "4px",
//                                 color: "green", display: "flex",
//                               }}
//                             >
//                               {mrp && mrp > price && (
//                                 <del
//                                   style={{
//                                     fontSize: "0.85rem",
//                                     color: "#888",
//                                     display: "block",
//                                   }}
//                                 >
//                                   ₹{mrp}
//                                 </del>
//                               )}
//                               ({discountPercent}% OFF)
//                             </span>
//                           )}
//                         </p>

//                       </div>


//                       {activeVariant?.shadeName && (
//                         <p
//                           style={{
//                             fontSize: "0.85rem",
//                             color: "#555",
//                             marginTop: "3px",
//                           }}
//                         >
//                           Shade: {activeVariant.shadeName}
//                         </p>
//                       )}

//                     </div>

//                     {/* 🔹 Shade Circles (only valid hex) */}
//                     {/* 🔹 Variant Selection */}
//                     {item.variants && item.variants.length > 0 && (
//                       <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
//                         {item.variants.map((variant, idx) => {
//                           const isSelected =
//                             selectedShade[item._id]?.sku === variant.sku ||
//                             selectedShade[item._id]?.variantSku === variant.sku;
//                           const outOfStock = variant.stock <= 0;

//                           // ✅ Hex variant → show as circle
//                           if (variant.hex) {
//                             return (
//                               <div
//                                 key={idx}
//                                 title={outOfStock ? `${variant.shadeName || ""} - Out of stock` : `${variant.shadeName || ""} - ₹${variant.price}`}
//                                 onClick={() => {
//                                   if (outOfStock) return;
//                                   setSelectedShade((prev) => ({ ...prev, [item._id]: variant }));
//                                 }}
//                                 style={{
//                                   width: "20px",
//                                   height: "20px",
//                                   borderRadius: "50%",
//                                   position: "relative",
//                                   backgroundColor: variant.hex,
//                                   border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
//                                   opacity: outOfStock ? 0.5 : 1,
//                                   cursor: outOfStock ? "not-allowed" : "pointer",
//                                 }}
//                               >
//                                 {outOfStock && (
//                                   <>
//                                     <div
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         width: "14px",
//                                         height: "1.5px",
//                                         backgroundColor: "red",
//                                         transform: "translate(-50%, -50%) rotate(45deg)",
//                                       }}
//                                     />
//                                     <div
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         width: "14px",
//                                         height: "1.5px",
//                                         backgroundColor: "red",
//                                         transform: "translate(-50%, -50%) rotate(-45deg)",
//                                       }}
//                                     />
//                                   </>
//                                 )}
//                               </div>
//                             );
//                           }

//                           // ❌ Non-hex variant → show as button
//                           return (
//                             <button
//                               key={idx}
//                               className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline-secondary"}`}
//                               disabled={outOfStock}
//                               onClick={() => setSelectedShade((prev) => ({ ...prev, [item._id]: variant }))}
//                             >
//                               {variant.shadeName || variant.name} {variant.price ? `- ₹${variant.price}` : ""}
//                               {/* {variant.shadeName || variant.name} {variant.price ? `- ₹${variant.price}` : ""} */}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     )}



//                     {/* ⭐ Rating */}
//                     <div className="d-flex align-items-center mt-2 mb-2">
//                       {[...Array(5)].map((_, i) => (
//                         <FaStar
//                           key={i}
//                           size={14}
//                           color={i < Math.round(avgRating) ? "#ffc107" : "#e4e5e9"}
//                         />
//                       ))}
//                       <span
//                         className="ms-2 text-muted"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         {avgRating > 0 ? avgRating : "0.0"}
//                       </span>
//                     </div>

//                     {/* 🛒 Add to Cart */}

//                     <button
//                       className="btn btn-primary w-100 mt-2"
//                       onClick={() => handleAddToCart(item)}
//                       disabled={addingToCart[item._id] || activeVariant.stock <= 0}
//                     >
//                       {activeVariant.stock <= 0
//                         ? "Out of Stock"
//                         : addingToCart[item._id]
//                           ? "Adding..."
//                           : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;















// src/components/RecommendationSlider.jsx
// import React, { useEffect, useState, useContext } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaStar } from "react-icons/fa";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";

// // Custom arrows
// const NextArrow = ({ className, style, onClick }) => (
//   <div
//     className={className}
//     style={{ ...style, display: "block", right: "10px", zIndex: 2 }}
//     onClick={onClick}
//   >
//     ➡️
//   </div>
// );

// const PrevArrow = ({ className, style, onClick }) => (
//   <div
//     className={className}
//     style={{ ...style, display: "block", left: "10px", zIndex: 2 }}
//     onClick={onClick}
//   >
//     ⬅️
//   </div>
// );

// const RecommendationSlider = ({ title, products }) => {
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const [slidesToShow, setSlidesToShow] = useState(3);
//   const [loading, setLoading] = useState(true);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShade, setSelectedShade] = useState({});

//   useEffect(() => {
//     setLoading(!(products && products.length > 0));
//   }, [products]);

//   // Responsive slider
//   const updateSlidesToShow = () => {
//     if (window.innerWidth < 768) setSlidesToShow(1);
//     else if (window.innerWidth < 1024) setSlidesToShow(2);
//     else setSlidesToShow(3);
//   };

//   useEffect(() => {
//     updateSlidesToShow();
//     window.addEventListener("resize", updateSlidesToShow);
//     return () => window.removeEventListener("resize", updateSlidesToShow);
//   }, []);

//   // ⭐ Average rating
//   const getAverageRating = (product) => {
//     if (!product.reviews || product.reviews.length === 0) return 0;
//     const total = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
//     return (total / product.reviews.length).toFixed(1);
//   };

//   // 🛒 Add to Cart (Fixed)
// const handleAddToCart = async (product) => {
//   try {
//     // ✅ Ensure login
//     await axios.get("https://beauty.joyory.com/api/user/profile", {
//       withCredentials: true,
//     });

//     const selectedVariant =
//       selectedShade[product._id] ||
//       product.variants?.find((v) => v.stock > 0) ||
//       product.variants?.[0];

//     if (!selectedVariant) {
//       alert("❌ Please select a shade before adding to cart.");
//       return;
//     }

//     if (selectedVariant.stock !== undefined && selectedVariant.stock <= 0) {
//       alert("❌ This variant is out of stock.");
//       return;
//     }

//     setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

//     // ✅ Call only the CartContext function (no extra axios)
//     await addToCart(product, selectedVariant);

//     alert("✅ Product added to cart!");
//     navigate("/cartpage", { state: { refresh: true } });
//   } catch (err) {
//     console.error("Add to Cart error:", err);
//     if (err.response?.status === 401) {
//       alert("⚠️ Please login first");
//       navigate("/login");
//     } else {
//       alert("❌ Failed to add product.");
//     }
//   } finally {
//     setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
//   }
// };


//   const sliderSettings = {
//     dots: true,
//     infinite: products?.length > slidesToShow,
//     speed: 500,
//     slidesToShow, // default
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024, // screens <= 1024px
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           infinite: products?.length > 2,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 768, // screens <= 768px
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//           infinite: products?.length > 1,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 480, // screens <= 480px
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: products?.length > 1,
//           dots: true,
//         },
//       },
//     ],
//   };


//   return (
//     <div className="recommendation-slider mt-4">
//       <h2>{title}</h2>

//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center p-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <Slider {...sliderSettings}>
//           {products.map((item) => {
//             const avgRating = getAverageRating(item);

//             const activeVariant = selectedShade[item._id] || item.variants?.[0] || {};
//             const price = activeVariant.displayPrice || activeVariant.price || item.price;
//             const mrp = activeVariant.originalPrice || activeVariant.mrp || item.mrp;


//             const discountPercent =
//               mrp && price && mrp > price
//                 ? Math.round(((mrp - price) / mrp) * 100)
//                 : 0;

//             return (
//               <div
//                 key={item._id}
//                 className="similar-product-card"
//                 // style={{ cursor: "pointer", padding: "10px" }}
//                 style={{
//                   cursor: "pointer",
//                   padding: "10px",
//                   height: "350px",       // fixed height
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between", // space between image, text, button
//                 }}
//               >
//                 <div onClick={() => navigate(`/product/${item._id}`)}>
//                   <img
//                     src={item.images?.[0] || "/placeholder.png"}
//                     alt={item.name}
//                     style={{
//                       width: "100%",
//                       borderRadius: "8px",
//                       height: "auto",
//                       // objectFit: "cover",
//                     }}
//                   />
//                   <div style={{ marginTop: "8px" }}>



//                     <div className="d-flex" style={{ flexDirection: "column" }}>


//                       <p style={{ fontWeight: "500" }}>{item.name}</p>

//                       {/* ✅ Dynamic Price Section */}

//                       <div className="d-flex">


//                         <p style={{ color: "#0077b6", fontWeight: "bold", display: "flex", margin: "0", padding: "0" }}>
//                           ₹{price}
//                           {discountPercent > 0 && (
//                             <span
//                               style={{
//                                 fontSize: "0.85rem",
//                                 marginLeft: "4px",
//                                 color: "green", display: "flex",
//                               }}
//                             >
//                               {mrp && mrp > price && (
//                                 <del
//                                   style={{
//                                     fontSize: "0.85rem",
//                                     color: "#888",
//                                     display: "block",
//                                   }}
//                                 >
//                                   ₹{mrp}
//                                 </del>
//                               )}
//                               ({discountPercent}% OFF)
//                             </span>
//                           )}
//                         </p>

//                       </div>


//                       {activeVariant?.shadeName && (
//                         <p
//                           style={{
//                             fontSize: "0.85rem",
//                             color: "#555",
//                             marginTop: "3px",
//                           }}
//                         >
//                           Shade: {activeVariant.shadeName}
//                         </p>
//                       )}



//                       {/* 🔹 Shade Circles (only valid hex) */}
//                       {/* 🔹 Variant Selection */}
//                       {item.variants && item.variants.length > 0 && (
//                         <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
//                           {item.variants.map((variant, idx) => {
//                             const isSelected =
//                               selectedShade[item._id]?.sku === variant.sku ||
//                               selectedShade[item._id]?.variantSku === variant.sku;
//                             const outOfStock = variant.stock <= 0;

//                             // ✅ Hex variant → show as circle
//                             if (variant.hex) {
//                               return (
//                                 <div
//                                   key={idx}
//                                   title={outOfStock ? `${variant.shadeName || ""} - Out of stock` : `${variant.shadeName || ""} - ₹${variant.price}`}
//                                   onClick={() => {
//                                     if (outOfStock) return;
//                                     setSelectedShade((prev) => ({ ...prev, [item._id]: variant }));
//                                   }}
//                                   style={{
//                                     width: "20px",
//                                     height: "20px",
//                                     borderRadius: "50%",
//                                     position: "relative",
//                                     backgroundColor: variant.hex,
//                                     border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
//                                     opacity: outOfStock ? 0.5 : 1,
//                                     cursor: outOfStock ? "not-allowed" : "pointer",
//                                   }}
//                                 >
//                                   {outOfStock && (
//                                     <>
//                                       <div
//                                         style={{
//                                           position: "absolute",
//                                           top: "50%",
//                                           left: "50%",
//                                           width: "14px",
//                                           height: "1.5px",
//                                           backgroundColor: "red",
//                                           transform: "translate(-50%, -50%) rotate(45deg)",
//                                         }}
//                                       />
//                                       <div
//                                         style={{
//                                           position: "absolute",
//                                           top: "50%",
//                                           left: "50%",
//                                           width: "14px",
//                                           height: "1.5px",
//                                           backgroundColor: "red",
//                                           transform: "translate(-50%, -50%) rotate(-45deg)",
//                                         }}
//                                       />
//                                     </>
//                                   )}
//                                 </div>
//                               );
//                             }

//                             // ❌ Non-hex variant → show as button
//                             return (
//                               <button
//                                 key={idx}
//                                 className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline-secondary"}`}
//                                 disabled={outOfStock}
//                                 onClick={() => setSelectedShade((prev) => ({ ...prev, [item._id]: variant }))}
//                               >
//                                 {variant.shadeName || variant.name} {variant.price ? `- ₹${variant.price}` : ""}
//                                 {/* {variant.shadeName || variant.name} {variant.price ? `- ₹${variant.price}` : ""} */}
//                               </button>

//                             );

//                           })}
//                         </div>
//                       )}



//                       {/* ⭐ Rating */}
//                       <div className="d-flex align-items-center mt-2 mb-2">
//                         {[...Array(5)].map((_, i) => (
//                           <FaStar
//                             key={i}
//                             size={14}
//                             color={i < Math.round(avgRating) ? "#ffc107" : "#e4e5e9"}
//                           />
//                         ))}
//                         <span
//                           className="ms-2 text-muted"
//                           style={{ fontSize: "0.85rem" }}
//                         >
//                           {avgRating > 0 ? avgRating : "0.0"}
//                         </span>
//                       </div>

//                       {/* 🛒 Add to Cart */}

//                       <button
//                         className="btn btn-primary w-100 mt-2"
//                         onClick={() => handleAddToCart(item)}
//                         disabled={addingToCart[item._id] || activeVariant.stock <= 0}
//                       >
//                         {activeVariant.stock <= 0
//                           ? "Out of Stock"
//                           : addingToCart[item._id]
//                             ? "Adding..."
//                             : "Add to Cart"}
//                       </button>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;









//===============================================================================Done-Code(Start)=======================================================================

// // src/components/RecommendationSlider.jsx
// import React, { useEffect, useState, useContext } from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Custom arrows
// const NextArrow = ({ className, style, onClick }) => (
//   <div
//     className={className}
//     style={{ ...style, display: "block", right: "10px", zIndex: 2 }}
//     onClick={onClick}
//   >
//     ➡️
//   </div>
// );

// const PrevArrow = ({ className, style, onClick }) => (
//   <div
//     className={className}
//     style={{ ...style, display: "block", left: "10px", zIndex: 2 }}
//     onClick={onClick}
//   >
//     ⬅️
//   </div>
// );

// const RecommendationSlider = ({ title, products }) => {
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const [slidesToShow, setSlidesToShow] = useState(3);
//   const [loading, setLoading] = useState(true);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShade, setSelectedShade] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   useEffect(() => {
//     setLoading(!(products && products.length > 0));
//   }, [products]);

//   // Fetch wishlist
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", {
//           withCredentials: true
//         });
//         if (Array.isArray(res.data.wishlist)) {
//           setWishlist(res.data.wishlist.map((item) => item._id));
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   // Toggle wishlist
//   const toggleWishlist = async (productId, e) => {
//     if (e) e.stopPropagation();
//     try {
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//       const res = await axios.post(
//         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.data.wishlist) {
//         setWishlist(res.data.wishlist.map((item) => item._id));
//         toast.success("Wishlist updated!");
//       } else {
//         setWishlist((prev) =>
//           prev.includes(productId)
//             ? prev.filter((id) => id !== productId)
//             : [...prev, productId]
//         );
//         toast.success(wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist");
//       }
//     } catch (err) {
//       console.error("Wishlist API error:", err);
//       toast.error("Failed to update wishlist");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // Check if hex color is valid
//   const isValidHexColor = (hex) => {
//     if (!hex || typeof hex !== 'string') return false;
//     const normalizedHex = hex.trim().toLowerCase();
//     const defaultColors = ['#000000', '#000', '#ccc', '#cccccc', '#fff', '#ffffff', '#00000000', 'transparent'];
//     if (defaultColors.includes(normalizedHex)) return false;
//     const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
//     return hexRegex.test(normalizedHex);
//   };

//   // Get image URL with fallback handling
//   const getImageUrl = (product, selectedVariant) => {
//     // Priority 1: Selected variant image
//     if (selectedVariant?.images?.[0]) {
//       const img = selectedVariant.images[0];
//       return img.startsWith("http") ? img : `https://res.cloudinary.com/dekngswix/image/upload/${img}`;
//     }

//     // Priority 2: Product images
//     if (product.images?.[0]) {
//       const img = product.images[0];
//       return img.startsWith("http") ? img : `https://res.cloudinary.com/dekngswix/image/upload/${img}`;
//     }

//     // Priority 3: Variant image from first variant
//     if (product.variants?.[0]?.images?.[0]) {
//       const img = product.variants[0].images[0];
//       return img.startsWith("http") ? img : `https://res.cloudinary.com/dekngswix/image/upload/${img}`;
//     }

//     // Fallback placeholder
//     return "/placeholder.png";
//   };

//   // Get variant display text
//   const getVariantDisplayText = (variant) => {
//     if (!variant) return "Default";

//     if (variant.ml) return `${variant.ml} ML`;
//     if (variant.weight) return `${variant.weight} g`;
//     if (variant.size) return variant.size;
//     if (variant.shadeName) return variant.shadeName;
//     if (variant.name) return variant.name;

//     return "Default";
//   };

//   // Get variant type
//   const getVariantType = (variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   };

//   // Responsive slider
//   const updateSlidesToShow = () => {
//     if (window.innerWidth < 576) setSlidesToShow(1);
//     else if (window.innerWidth < 768) setSlidesToShow(2);
//     else if (window.innerWidth < 1024) setSlidesToShow(3);
//     else setSlidesToShow(4);
//   };

//   useEffect(() => {
//     updateSlidesToShow();
//     window.addEventListener("resize", updateSlidesToShow);
//     return () => window.removeEventListener("resize", updateSlidesToShow);
//   }, []);

//   // ⭐ Average rating
//   const getAverageRating = (product) => {
//     if (!product.reviews || product.reviews.length === 0) return 0;
//     const total = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
//     return (total / product.reviews.length).toFixed(1);
//   };

//   // 🛒 Add to Cart (Fixed)
//   const handleAddToCart = async (product, e) => {
//     if (e) e.stopPropagation();
//     try {
//       const selectedVariant = selectedShade[product._id] ||
//         product.variants?.find((v) => v.stock > 0) ||
//         product.variants?.[0];

//       if (!selectedVariant) {
//         toast.error("❌ Please select a shade before adding to cart.");
//         return;
//       }

//       if (selectedVariant.stock !== undefined && selectedVariant.stock <= 0) {
//         toast.error("❌ This variant is out of stock.");
//         return;
//       }

//       setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

//       // Prepare variant data
//       const variantToAdd = {
//         _id: selectedVariant._id || selectedVariant.sku,
//         sku: selectedVariant.sku,
//         variantSku: selectedVariant.sku,
//         shadeName: selectedVariant.shadeName,
//         name: selectedVariant.shadeName || selectedVariant.name,
//         hex: selectedVariant.hex,
//         displayPrice: selectedVariant.displayPrice || selectedVariant.price || product.price,
//         originalPrice: selectedVariant.originalPrice || selectedVariant.mrp || product.mrp,
//         stock: selectedVariant.stock || product.stock,
//         images: selectedVariant.images || product.images,
//         image: selectedVariant.images?.[0] || product.images?.[0],
//         variantType: getVariantType(selectedVariant),
//         variantDisplayText: getVariantDisplayText(selectedVariant)
//       };

//       // Call CartContext function
//       await addToCart(product, variantToAdd, false);

//       toast.success("✅ Product added to cart!");
//       setTimeout(() => navigate("/cartpage"), 1000);
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       if (err.message === "Authentication required") {
//         toast.error("⚠️ Please login first");
//         navigate("/login");
//       } else {
//         toast.error("❌ Failed to add product.");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
//     }
//   };

//   // Handle product click navigation
//   const handleProductClick = (product) => {
//     if (!product) return;

//     // Try to get slug from different sources
//     const slug = product.slug || 
//                  product.slugs?.[0] || 
//                  (product.selectedVariant?.slug) || 
//                  product._id;

//     navigate(`/product/${slug}`);
//   };

//   // Handle variant click with event propagation
//   const handleVariantClick = (product, variant, e) => {
//     if (e) e.stopPropagation();
//     setSelectedShade(prev => ({
//       ...prev,
//       [product._id]: variant
//     }));
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: products?.length > slidesToShow,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1200,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//         }
//       },
//       {
//         breakpoint: 992,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//         }
//       },
//       {
//         breakpoint: 576,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: false
//         }
//       }
//     ],
//   };

//   return (
//     <div className="recommendation-slider mt-4 mb-5">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="font-familys fw-bold mb-4">{title}</h2>

//       {loading ? (
//         <div className="d-flex justify-content-center align-items-center p-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <Slider {...sliderSettings}>
//           {products.map((item) => {
//             const avgRating = getAverageRating(item);
//             const activeVariant = selectedShade[item._id] || item.selectedVariant || item.variants?.[0] || {};

//             // Get image URL using the helper function
//             const imageUrl = getImageUrl(item, activeVariant);

//             const price = activeVariant.displayPrice || activeVariant.discountedPrice || activeVariant.price || item.price;
//             const mrp = activeVariant.originalPrice || activeVariant.mrp || item.mrp || price;

//             const discountPercent = mrp && price && mrp > price
//               ? Math.round(((mrp - price) / mrp) * 100)
//               : 0;

//             const isWishlisted = wishlist.includes(item._id);

//             return (
//               <div
//                 key={item._id}
//                 className="similar-product-card"
//                 style={{
//                   cursor: "pointer",
//                   padding: "10px",
//                   height: "420px",
//                   display: "flex",
//                   flexDirection: "column",
//                   position: "relative"
//                 }}
//               >
//                 {/* Wishlist Heart */}
//                 <div
//                   className="wishlist-heart"
//                   onClick={(e) => toggleWishlist(item._id, e)}
//                   style={{
//                     position: 'absolute',
//                     top: '15px',
//                     right: '20px',
//                     cursor: 'pointer',
//                     color: isWishlisted ? 'red' : '#000000',
//                     fontSize: '20px',
//                     zIndex: 2,
//                     background: 'rgba(255, 255, 255, 0.8)',
//                     borderRadius: '50%',
//                     width: '30px',
//                     height: '30px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     transition: 'all 0.2s ease'
//                   }}
//                   title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {wishlistLoading[item._id] ? (
//                     <div className="spinner-border spinner-border-sm" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   ) : isWishlisted ? (
//                     <FaHeart />
//                   ) : (
//                     <FaRegHeart />
//                   )}
//                 </div>

//                 {/* Product Image */}
//                 <div 
//                   className="product-image-container"
//                   onClick={() => handleProductClick(item)}
//                   style={{ flex: 1, position: 'relative' }}
//                 >
//                   <img
//                     src={imageUrl}
//                     alt={item.name}
//                     style={{
//                       width: "100%",
//                       height: "200px",
//                       objectFit: "contain",
//                       borderRadius: "8px",
//                       border: "1px solid #eee"
//                     }}
//                     onError={(e) => {
//                       e.currentTarget.src = "/placeholder.png";
//                     }}
//                   />
//                 </div>

//                 {/* Product Info */}
//                 <div 
//                   className="product-info"
//                   onClick={() => handleProductClick(item)}
//                   style={{ flex: 1, marginTop: "10px" }}
//                 >
//                   <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

//                     {/* Brand Name */}
//                     <div className="brand-name small text-muted mb-1">
//                       {item.brand?.name || item.brandName || "Unknown Brand"}
//                     </div>

//                     {/* Product Name */}
//                     <p style={{ 
//                       fontWeight: "500", 
//                       fontSize: "14px",
//                       marginBottom: "5px",
//                       display: "-webkit-box",
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: "vertical",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       height: "40px"
//                     }}>
//                       {item.name}
//                     </p>

//                     {/* Price */}
//                     <div className="d-flex align-items-baseline mb-2">
//                       <p style={{ 
//                         color: "#0077b6", 
//                         fontWeight: "bold", 
//                         fontSize: "16px",
//                         margin: 0,
//                         padding: 0 
//                       }}>
//                         ₹{price}
//                         {discountPercent > 0 && (
//                           <span style={{
//                             fontSize: "12px",
//                             marginLeft: "4px",
//                             color: "green",
//                           }}>
//                             ({discountPercent}% OFF)
//                           </span>
//                         )}
//                       </p>

//                       {mrp && mrp > price && (
//                         <del style={{
//                           fontSize: "12px",
//                           color: "#888",
//                           marginLeft: "8px",
//                         }}>
//                           ₹{mrp}
//                         </del>
//                       )}
//                     </div>

//                     {/* Selected Shade */}
//                     {activeVariant?.shadeName && (
//                       <p style={{
//                         fontSize: "12px",
//                         color: "#555",
//                         marginBottom: "8px",
//                       }}>
//                         Shade: {activeVariant.shadeName}
//                       </p>
//                     )}

//                     {/* Variants */}
//                     {item.variants && item.variants.length > 0 && (
//                       <div style={{ 
//                         display: "flex", 
//                         alignItems: "center", 
//                         gap: "6px", 
//                         marginBottom: "10px",
//                         flexWrap: "wrap" 
//                       }}>
//                         {item.variants.slice(0, 4).map((variant, idx) => {
//                           const isSelected = 
//                             selectedShade[item._id]?.sku === variant.sku ||
//                             selectedShade[item._id]?.variantSku === variant.sku;
//                           const outOfStock = variant.stock <= 0;
//                           const variantType = getVariantType(variant);

//                           // Color variants (with hex)
//                           if (variantType === 'color') {
//                             return (
//                               <div
//                                 key={idx}
//                                 title={outOfStock ? `${variant.shadeName || ""} - Out of stock` : `${variant.shadeName || ""} - ₹${variant.displayPrice || variant.price}`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   if (outOfStock) return;
//                                   handleVariantClick(item, variant, e);
//                                 }}
//                                 style={{
//                                   width: "20px",
//                                   height: "20px",
//                                   borderRadius: "50%",
//                                   position: "relative",
//                                   backgroundColor: variant.hex,
//                                   border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
//                                   opacity: outOfStock ? 0.5 : 1,
//                                   cursor: outOfStock ? "not-allowed" : "pointer",
//                                   boxShadow: isSelected ? "0 0 0 2px white, 0 0 0 3px #0077b6" : "none"
//                                 }}
//                               >
//                                 {outOfStock && (
//                                   <>
//                                     <div
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         width: "14px",
//                                         height: "1.5px",
//                                         backgroundColor: "red",
//                                         transform: "translate(-50%, -50%) rotate(45deg)",
//                                       }}
//                                     />
//                                     <div
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         width: "14px",
//                                         height: "1.5px",
//                                         backgroundColor: "red",
//                                         transform: "translate(-50%, -50%) rotate(-45deg)",
//                                       }}
//                                     />
//                                   </>
//                                 )}
//                                 {isSelected && !outOfStock && (
//                                   <span
//                                     style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform: "translate(-50%, -50%)",
//                                       color: "#fff",
//                                       fontSize: "10px",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                             );
//                           }

//                           // Text variants
//                           return (
//                             <button
//                               key={idx}
//                               className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline-secondary"}`}
//                               disabled={outOfStock}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleVariantClick(item, variant, e);
//                               }}
//                               style={{
//                                 fontSize: "11px",
//                                 padding: "3px 8px",
//                                 borderRadius: "4px",
//                                 border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
//                                 background: isSelected ? "#0077b6" : "transparent",
//                                 color: isSelected ? "#fff" : "#333",
//                                 cursor: outOfStock ? "not-allowed" : "pointer",
//                                 opacity: outOfStock ? 0.5 : 1
//                               }}
//                             >
//                               {getVariantDisplayText(variant)}
//                             </button>
//                           );
//                         })}

//                         {/* More variants indicator */}
//                         {item.variants.length > 4 && (
//                           <span style={{
//                             fontSize: "11px",
//                             color: "#666",
//                             marginLeft: "4px"
//                           }}>
//                             +{item.variants.length - 4} more
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     {/* Rating */}
//                     <div className="d-flex align-items-center mt-2 mb-2" style={{ marginTop: "auto" }}>
//                       {[...Array(5)].map((_, i) => (
//                         <FaStar
//                           key={i}
//                           size={14}
//                           color={i < Math.round(avgRating) ? "#ffc107" : "#e4e5e9"}
//                         />
//                       ))}
//                       <span
//                         className="ms-2 text-muted"
//                         style={{ fontSize: "12px" }}
//                       >
//                         {avgRating > 0 ? avgRating : "0.0"}
//                       </span>
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       className="btn btn-primary w-100 mt-2"
//                       onClick={(e) => handleAddToCart(item, e)}
//                       disabled={addingToCart[item._id] || activeVariant.stock <= 0}
//                       style={{
//                         fontSize: "14px",
//                         padding: "8px 12px",
//                         marginTop: "auto"
//                       }}
//                     >
//                       {activeVariant.stock <= 0
//                         ? "Out of Stock"
//                         : addingToCart[item._id]
//                           ? "Adding..."
//                           : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;













// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import tick from "../assets/tick.svg";
// import bagIcon from "../assets/bag.svg";

// // Wishlist cache key
// const WISHLIST_CACHE_KEY = "guestWishlist";
// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// // Helper functions
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [], default: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const RecommendationSlider = ({ title, products: initialProducts }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [showAllShades, setShowAllShades] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");

//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // Helper to get product slug safely
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;

//     // First check if product has slugs array (from backend)
//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0]; // Use first slug from array
//     }

//     // If no slugs array, check for slug field directly
//     if (product.slug) {
//       return product.slug;
//     }

//     // Fallback: use product ID
//     return product._id;
//   }, []);

//   // Safely get brand name from brand object or ID
//   const getBrandName = useCallback((product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   }, []);

//   // Helper to get variant name safely
//   const getVariantName = useCallback((variant) => {
//     if (!variant) return "Default";
//     const nameSources = [
//       variant.shadeName,
//       variant.name,
//       variant.variantName,
//       variant.size,
//       variant.ml,
//       variant.weight
//     ];
//     for (const source of nameSources) {
//       if (source && typeof source === 'string') {
//         return source;
//       }
//     }
//     return "Default";
//   }, []);

//   // Toast Utility (similar to ProductPage)
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     if (type === "success") {
//       toast.success(message, { autoClose: duration });
//     } else if (type === "error") {
//       toast.error(message, { autoClose: duration });
//     } else {
//       toast.info(message, { autoClose: duration });
//     }
//   };

//   // ===================== WISHLIST FUNCTIONS =====================

//   // ✅ Check if specific product variant is in wishlist
//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;

//     // Check in wishlistData
//     return wishlistData.some(item =>
//       (item.productId === productId || item._id === productId) &&
//       item.sku === sku
//     );
//   };

//   // ✅ Fetch full wishlist data
//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         // For logged-in users: Fetch from API
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         // For guests: Get from localStorage
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         // Convert guest wishlist to match API structure
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: item._id,
//           _id: item._id,
//           sku: item.sku,
//           name: item.name,
//           variant: item.variantName,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   // ✅ Toggle wishlist function (same as ProductPage)
//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }

//     const productId = prod._id;
//     const sku = getSku(variant);

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         if (currentlyInWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             {
//               withCredentials: true,
//               data: { sku: sku }
//             }
//           );
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true }
//           );
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//         if (currentlyInWishlist) {
//           const updatedWishlist = guestWishlist.filter(item =>
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             images: variant.images || prod.images || ["/placeholder.png"],
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: prod.slugs?.[0] || prod.slug || prod._id,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             shadeName: variant.shadeName || variant.name || "Default",
//             variant: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#cccccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
//               ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         showToastMsg("Please login to use wishlist", "error");
//         navigate("/login");
//       } else {
//         showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // ✅ Initial fetch of wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // Helper to get variant display type (color, size, ml, etc.)
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, []);

//   // Helper function to get complete product data for display
//   const getProductDisplayData = useCallback((product) => {
//     if (!product) return null;

//     // Get all available variants
//     const allVariants = Array.isArray(product.variants) ? product.variants :
//       Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

//     // Find available variant (in stock first)
//     const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
//     const defaultVariant = allVariants[0] || {};

//     // Check if we have a selected variant stored for this product
//     const storedVariant = selectedVariants[product._id];

//     // Choose the best variant
//     let selectedVariant = storedVariant ||
//       product.selectedVariant ||
//       (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

//     // If stored variant doesn't exist or is out of stock, fallback
//     if (storedVariant) {
//       const storedStock = parseInt(storedVariant.stock || 0);
//       if (storedStock <= 0 && availableVariants.length > 0) {
//         selectedVariant = availableVariants[0];
//       }
//     }

//     // Get image with priority
//     let image = "";
//     const getVariantImage = (variant) => {
//       return variant?.images?.[0] || variant?.image;
//     };

//     image = getVariantImage(selectedVariant) ||
//       getVariantImage(availableVariants[0]) ||
//       getVariantImage(defaultVariant) ||
//       product.image ||
//       "";

//     // Get prices safely
//     const displayPrice = parseFloat(
//       selectedVariant.displayPrice ||
//       selectedVariant.discountedPrice ||
//       selectedVariant.price ||
//       product.price ||
//       0
//     );

//     const originalPrice = parseFloat(
//       selectedVariant.originalPrice ||
//       selectedVariant.mrp ||
//       product.mrp ||
//       displayPrice
//     );

//     // Calculate discount percentage if not provided
//     let discountPercent = parseFloat(
//       selectedVariant.discountPercent ||
//       product.discountPercent ||
//       0
//     );

//     if (!discountPercent && originalPrice > displayPrice) {
//       discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//     }

//     // Get variant name
//     const variantName = getVariantName(selectedVariant);
//     const variantType = getVariantType(selectedVariant);
//     const variantDisplayText = getVariantDisplayText(selectedVariant);

//     const stock = parseInt(selectedVariant.stock || product.stock || 0);
//     const status = stock > 0 ? "inStock" : "outOfStock";
//     const sku = selectedVariant.sku || product.sku || "";

//     // Get brand name safely
//     const brandName = getBrandName(product);

//     // Get product slug
//     const productSlug = getProductSlug(product);

//     return {
//       ...product,
//       _id: product._id || "",
//       name: product.name || "Unnamed Product",
//       brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
//       slug: productSlug,
//       variant: {
//         ...selectedVariant,
//         variantName,
//         variantDisplayText,
//         displayPrice,
//         originalPrice,
//         discountPercent,
//         stock,
//         status,
//         sku,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v),
//       variants: allVariants // For compatibility with handleAddToCart
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

//   // ===================== UPDATED ADD TO CART - SAME AS PRODUCT PAGE ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id] || prod.variant;
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           variants: [
//             {
//               variantSku: getSku(selectedVariant),
//               quantity: 1,
//             },
//           ],
//         };

//         // Cache selected variant (only for products with variants)
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         // Non-variant product
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           quantity: 1,
//         };

//         // Clear cache for non-variant products
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       // Add to cart via backend (works for both logged-in and guest via session)
//       const response = await axios.post(
//         `${CART_API_BASE}/add`,
//         payload,
//         { withCredentials: true }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//       showToastMsg(msg, "error");

//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Handle variant selection
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

//     // Update the products state to reflect the new selected variant
//     setProducts(prevProducts =>
//       prevProducts.map(product => {
//         if (product._id === productId) {
//           const stock = parseInt(variant.stock || 0);
//           const displayPrice = parseFloat(
//             variant.displayPrice ||
//             variant.discountedPrice ||
//             variant.price ||
//             product.price ||
//             0
//           );

//           const originalPrice = parseFloat(
//             variant.originalPrice ||
//             variant.mrp ||
//             product.mrp ||
//             displayPrice
//           );

//           let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
//           if (!discountPercent && originalPrice > displayPrice) {
//             discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//           }

//           const variantName = getVariantName(variant);
//           const variantType = getVariantType(variant);
//           const variantDisplayText = getVariantDisplayText(variant);
//           const hexColor = variant.hex || product.hex || "#000000";

//           return {
//             ...product,
//             variant: {
//               ...variant,
//               variantName,
//               variantDisplayText,
//               displayPrice,
//               originalPrice,
//               discountPercent,
//               stock,
//               status: stock > 0 ? "inStock" : "outOfStock",
//               sku: variant.sku || "",
//               hex: hexColor,
//               variantType,
//               _id: variant._id || ""
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType]);

//   // Toggle show all shades for a product
//   const toggleShowAllShades = (productId) => {
//     setShowAllShades(prev => ({
//       ...prev,
//       [productId]: !prev[productId]
//     }));
//   };

//   // Open variant overlay
//   const openVariantOverlay = (productId, variantType = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(variantType);
//     setShowVariantOverlay(productId);
//   };

//   // Close variant overlay
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Handle product click - Navigate using slug
//   const handleProductClick = useCallback((product) => {
//     if (!product) return;

//     // Get the product slug (from slugs array or fallback to ID)
//     const slug = product.slug || product._id;

//     if (slug) {
//       navigate(`/product/${slug}`);
//     }
//   }, [navigate]);

//   // Remove duplicates by product ID
//   const removeDuplicates = useCallback((productsArray) => {
//     const seen = new Map();
//     return productsArray.filter(product => {
//       if (!product?._id) return false;
//       const productId = product._id;
//       if (seen.has(productId)) {
//         const existing = seen.get(productId);
//         const existingDiscount = existing.variant?.discountPercent || 0;
//         const currentDiscount = product.variant?.discountPercent || 0;
//         if (currentDiscount > existingDiscount) {
//           seen.set(productId, product);
//         }
//         return false;
//       }
//       seen.set(productId, product);
//       return true;
//     });
//   }, []);

//   // Sort products by criteria
//   const sortProducts = useCallback((productsArray) => {
//     return [...productsArray].filter(Boolean).sort((a, b) => {
//       if (a.variant?.status === "inStock" && b.variant?.status !== "inStock") return -1;
//       if (a.variant?.status !== "inStock" && b.variant?.status === "inStock") return 1;
//       const discountA = a.variant?.discountPercent || 0;
//       const discountB = b.variant?.discountPercent || 0;
//       if (discountB !== discountA) return discountB - discountA;
//       return 0;
//     });
//   }, []);

//   // Transform backend data - merge all sections
//   const transformProducts = useCallback((sectionsData) => {
//     let allProducts = [];
//     if (sectionsData?.success && Array.isArray(sectionsData.sections)) {
//       sectionsData.sections.forEach((section, sectionIndex) => {
//         if (Array.isArray(section.products)) {
//           const productsWithSection = section.products.map((product, productIndex) => {
//             const displayData = getProductDisplayData(product);
//             if (!displayData) return null;
//             return {
//               ...displayData,
//               sectionTitle: typeof section.title === 'string' ? section.title :
//                 (section.name || "Featured"),
//               uniqueId: `${sectionIndex}-${productIndex}-${product._id || "noid"}`,
//               sectionIndex,
//               productIndex
//             };
//           }).filter(Boolean);
//           allProducts = [...allProducts, ...productsWithSection];
//         }
//       });
//     } else if (Array.isArray(sectionsData?.products)) {
//       sectionsData.products.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: sectionsData?.type === "personalized" ?
//               "Recommended For You" :
//               (sectionsData?.title || "Top Picks"),
//             uniqueId: `${sectionsData?.type || "default"}-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     } else if (Array.isArray(sectionsData)) {
//       sectionsData.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: "Recommended",
//             uniqueId: `default-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     }
//     return allProducts.filter(Boolean);
//   }, [getProductDisplayData]);

//   // Optimized variant analysis for each product
//   const getVariantAnalysis = useCallback((product) => {
//     if (!product) return { hasVariants: false, availableVariants: [] };
//     const allVariants = product.allVariants || [];
//     const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);

//     // Analyze variant types
//     const variantTypes = allVariants.map(v => getVariantType(v));
//     const hasColorVariants = variantTypes.includes('color');
//     const hasShadeVariants = variantTypes.includes('shade');
//     const hasSizeVariants = variantTypes.includes('size');

//     return {
//       hasVariants: allVariants.length > 0,
//       availableVariants,
//       totalVariants: allVariants.length,
//       hasMultipleVariants: allVariants.length > 1,
//       hasOnlyOneVariant: allVariants.length === 1,
//       hasColorVariants,
//       hasShadeVariants,
//       hasSizeVariants,
//       variantTypes,
//       currentVariant: product.variant
//     };
//   }, [getVariantType]);

//   // Initialize products
//   useEffect(() => {
//     if (initialProducts && initialProducts.length > 0) {
//       let data = transformProducts(initialProducts);
//       data = removeDuplicates(data);
//       data = sortProducts(data);
//       setProducts(data);
//       setLoading(false);
//     } else {
//       setProducts([]);
//       setLoading(false);
//     }
//   }, [initialProducts, transformProducts, removeDuplicates, sortProducts]);

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   return (
//     <div className="container-fluid  position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="fs-3 text-start foryou-heading mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
//         {title}
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2 page-title-main-name fs-4 text-black">Loading recommendations...</p>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//         </div>
//       )}

//       {memoizedProducts.length > 0 ? (
//         <div className="position-relative">
//           <Swiper
//             modules={[Autoplay, Pagination, Navigation]}
//             pagination={{ clickable: true, dynamicBullets: true }}
//             navigation={{
//               nextEl: '.swiper-button-next',
//               prevEl: '.swiper-button-prev',
//             }}
//             breakpoints={{
//               300: { slidesPerView: 2, spaceBetween: 10 },
//               576: { slidesPerView: 2.5, spaceBetween: 15 },
//               768: { slidesPerView: 2, spaceBetween: 15 },
//               992: { slidesPerView: 3, spaceBetween: 20 },
//               1200: { slidesPerView: 4, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {memoizedProducts.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const variantAnalysis = getVariantAnalysis(item);

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = variantAnalysis.hasVariants;
//               const hasMultipleVariants = variantAnalysis.hasMultipleVariants;
//               const variantsToShow = item.allVariants || [];

//               // Check wishlist status for current variant
//               const selectedSku = getSku(variant);
//               const isProductInWishlist = isInWishlist(item._id, selectedSku);

//               // Separate variants into color (hex) variants and text variants
//               const colorVariants = variantsToShow.filter(v => v && isValidHexColor(v.hex));
//               const textVariants = variantsToShow.filter(v => v && !isValidHexColor(v.hex));
//               const hasColorVariants = colorVariants.length > 0;
//               const hasTextVariants = textVariants.length > 0;

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(variantsToShow);
//               const totalVariants = variantsToShow.length;

//               // Show only first 4 color variants initially
//               const initialColorVariants = colorVariants.slice(0, 4);
//               const hasMoreColorVariants = colorVariants.length > 4;

//               // Show only first 2 text variants initially
//               const initialTextVariants = textVariants.slice(0, 2);
//               const hasMoreTextVariants = textVariants.length > 2;

//               // Button state logic (same as ProductPage)
//               const isAdding = addingToCart[item._id];
//               const noVariantSelected = hasVariants && !variant;
//               const outOfStock = hasVariants
//                 ? (variant?.stock <= 0)
//                 : (item.stock <= 0);
//               const buttonDisabled = isAdding || noVariantSelected || outOfStock;
//               const buttonText = isAdding
//                 ? "Adding..."
//                 : noVariantSelected
//                   ? "Select Variant"
//                   : outOfStock
//                     ? "Out of Stock"
//                     : "Add to Bag";

//               return (
//                 <SwiperSlide key={item.uniqueId}>
//                   <div className="foryou-card-wrapper">
//                     <div className="foryou-card">
//                       {/* Product Image with Overlays */}
//                       <div
//                         className="foryou-img-wrapper"
//                         onClick={() => handleProductClick(item)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <img
//                           src={imageUrl}
//                           alt={item.name || "Product"}
//                           className="foryou-img img-fluid"
//                           loading="lazy"
//                           onError={(e) => {
//                             e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                           }}
//                         />

//                         {/* Wishlist Icon - UPDATED */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (variant) {
//                               toggleWishlist(item, variant);
//                             }
//                           }}
//                           disabled={wishlistLoading[item._id]}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '10px',
//                             cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
//                             color: isProductInWishlist ? '#dc3545' : '#000000',
//                             fontSize: '22px',
//                             zIndex: 2,
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             borderRadius: '50%',
//                             width: '34px',
//                             height: '34px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'all 0.3s ease',
//                             border: 'none',
//                             outline: 'none'
//                           }}
//                           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                         >
//                           {wishlistLoading[item._id] ? (
//                             <div className="spinner-border spinner-border-sm" role="status"></div>
//                           ) : isProductInWishlist ? (
//                             <FaHeart />
//                           ) : (
//                             <FaRegHeart />
//                           )}
//                         </button>

//                         {/* Promo Badge */}
//                         {variant.promoApplied && (
//                           <div className="promo-badge">
//                             <i className="bi bi-tag-fill me-1"></i>
//                             Promo
//                           </div>
//                         )}
//                       </div>

//                       {/* Product Info */}
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '320px' }}>
//                           {/* Brand Name */}
//                           <div className="brand-name small text-muted mb-1">
//                             {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
//                           </div>

//                           {/* Product Name */}
//                           <h6
//                             className="foryou-name m-0 p-0"
//                             onClick={() => handleProductClick(item)}
//                             style={{ cursor: 'pointer' }}
//                           >
//                             {item.name || "Unnamed Product"}

//                             <small className="">
//                               {/* Selected: */}

//                                {variant.variantDisplayText}
//                             </small>

//                             {/* {hasVariants && (

//                           )} */}


//                           </h6>

//                           {/* Selected Variant Name */}


//                           {/* Dynamic Variant Display */}
//                           {hasVariants && (
//                             <div className="variant-section m-0 p-0 ms-0 ">
//                               {hasVariants && variantsToShow.length > 0 && (
//                                 <>
//                                   {/* Color Variants Section */}
//                                   {hasColorVariants && (
//                                     <div className="color-variants-section">
//                                       <p className="variant-label text-muted small mb-2">
//                                         Select Color:
//                                       </p>
//                                       <div className="variant-list d-flex flex-wrap gap-1 ms-1 align-items-center" >
//                                         {initialColorVariants.map((v, idx) => {
//                                           if (!v) return null;
//                                           const displayText = getVariantDisplayText(v);
//                                           const color = v.hex || "#ccc";
//                                           const stock = parseInt(v.stock || 0);
//                                           const isOutOfStock = stock <= 0;
//                                           const isSelected =
//                                             variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                           const isDisabled = !hasMultipleVariants || isOutOfStock;

//                                           return (
//                                             <div className="varient-margin" key={v.sku || v._id || idx} style={{ position: "relative" }}>
//                                               <div
//                                                 className={`color-circle ${isSelected ? "selected" : ""}`}
//                                                 style={{
//                                                   backgroundColor: color,
//                                                   marginTop: '7px',
//                                                   width: "20px",
//                                                   height: "20px",
//                                                   borderRadius: "20%",
//                                                   cursor: isDisabled ? "default" : "pointer",
//                                                   opacity: isOutOfStock ? 0.5 : 1,
//                                                   transition: "all 0.2s ease",
//                                                 }}
//                                                 onClick={() => {
//                                                   if (isDisabled) return;
//                                                   handleVariantSelect(item._id, v);
//                                                 }}
//                                                 title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                               >
//                                                 {isSelected && (
//                                                   <span
//                                                     style={{
//                                                       position: "absolute",
//                                                       top: "50%",
//                                                       left: "50%",
//                                                       transform: "translate(-50%, -50%)",
//                                                       color: "#fff",
//                                                       fontSize: "10px",
//                                                       fontWeight: "bold",
//                                                     }}
//                                                   >
//                                                     <img src={tick} className="" style={{ width: '20px' }} alt="" />
//                                                   </span>
//                                                 )}
//                                               </div>
//                                             </div>
//                                           );
//                                         })}

//                                         {/* More Button for Color Variants */}
//                                         {hasMoreColorVariants && (
//                                           <div className="varient-margin" style={{ position: "relative", marginTop: '7px' }}>
//                                             <button
//                                               className="more-variants-btn"
//                                               onClick={(e) => openVariantOverlay(item._id, "color", e)}
//                                               style={{
//                                                 width: "36px",
//                                                 height: "auto",
//                                                 borderRadius: "4px",
//                                                 backgroundColor: "transparent",
//                                                 border: "0px solid #ddd",
//                                                 cursor: "pointer",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 fontSize: "10px",
//                                                 fontWeight: "bold",
//                                                 color: "#333"
//                                               }}
//                                               title={`Show all ${colorVariants.length} colors`}
//                                             >
//                                               +{colorVariants.length - 4}
//                                             </button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}

//                                   {/* Text Variants Section */}
//                                   {hasTextVariants && (
//                                     <div className="text-variants-section">
//                                       <p className="variant-label text-muted small mb-2 mt-2">
//                                         Select Size:
//                                       </p>
//                                       <div className="variant-list d-flex flex-wrap gap-2">
//                                         {initialTextVariants.map((v, idx) => {
//                                           if (!v) return null;
//                                           const displayText = getVariantDisplayText(v);
//                                           const stock = parseInt(v.stock || 0);
//                                           const isOutOfStock = stock <= 0;
//                                           const isSelected =
//                                             variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                           const isDisabled = !hasMultipleVariants || isOutOfStock;

//                                           return (
//                                             <div key={v.sku || v._id || idx}>
//                                               <div
//                                                 className={`variant-text-option ${isSelected ? "selected" : ""}`}
//                                                 style={{
//                                                   padding: "4px 8px",
//                                                   borderRadius: "4px",
//                                                   border: isSelected ? "2px solid #000000" : "1px solid #ddd",
//                                                   backgroundColor: isSelected ? "#f8f9fa" : "#fff",
//                                                   color: isSelected ? "#000000" : "#333",
//                                                   fontSize: "12px",
//                                                   fontWeight: isSelected ? 600 : 400,
//                                                   cursor: isDisabled ? "default" : "pointer",
//                                                   opacity: isOutOfStock ? 0.5 : 1,
//                                                   minWidth: "60px",
//                                                   textAlign: "center",
//                                                 }}
//                                                 onClick={() => {
//                                                   if (isDisabled) return;
//                                                   handleVariantSelect(item._id, v);
//                                                 }}
//                                                 title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                               >
//                                                 {displayText}
//                                                 {isSelected && (
//                                                   <span className="ms-1" style={{ fontSize: "10px" }}>
//                                                     {/* ✓ */}
//                                                   </span>
//                                                 )}
//                                               </div>
//                                             </div>
//                                           );
//                                         })}

//                                         {/* More Button for Text Variants */}
//                                         {hasMoreTextVariants && (
//                                           <div style={{ position: "relative" }}>
//                                             <button
//                                               className="more-variants-btn"
//                                               onClick={(e) => openVariantOverlay(item._id, "text", e)}
//                                               style={{
//                                                 padding: "4px 8px",
//                                                 borderRadius: "4px",
//                                                 backgroundColor: "transparent",
//                                                 border: "0px solid #ddd",
//                                                 cursor: "pointer",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 fontSize: "10px",
//                                                 fontWeight: "bold",
//                                                 color: "#333",
//                                                 minWidth: "60px",
//                                               }}
//                                               title={`Show all ${textVariants.length} sizes`}
//                                             >
//                                               +{textVariants.length - 2}
//                                             </button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </>
//                               )}
//                             </div>
//                           )}

//                           {/* Price Section */}
//                           <div className="price-section mb-3">
//                             <div className="d-flex align-items-baseline flex-wrap">
//                               <span className="current-price fw-400 fs-5">
//                                 {formatPrice(variant.displayPrice)}
//                               </span>
//                               {variant.originalPrice > variant.displayPrice && (
//                                 <>
//                                   <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                     {formatPrice(variant.originalPrice)}
//                                   </span>
//                                   <span className="discount-percent text-danger fw-bold ms-2">
//                                     ({variant.discountPercent || 0}% OFF)
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </div>

//                           {/* Add to Cart Button - UPDATED to match ProductPage */}
//                           <div className="cart-section">
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 className={`w-100 ${variant.status === "inStock"} btn-add-cart`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleAddToCart(item);
//                                 }}
//                                 disabled={buttonDisabled}
//                                 style={{
//                                   transition: "background-color 0.3s ease, color 0.3s ease",
//                                 }}
//                               >
//                                 {isAdding ? (
//                                   <>
//                                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                     Adding...
//                                   </>
//                                 ) : (
//                                   <>
//                                     {buttonText}
//                                     {!buttonDisabled && !isAdding && (
//                                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                                     )}
//                                   </>
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Variant Overlay */}
//                     {showVariantOverlay === item._id && (
//                       <div className="variant-overlay" onClick={closeVariantOverlay}>
//                         <div
//                           className="variant-overlay-content"
//                           onClick={(e) => e.stopPropagation()}
//                           style={{
//                             width: '100%',
//                             maxWidth: '500px',
//                             maxHeight: '100vh',
//                             background: '#fff',
//                             borderRadius: '12px',
//                             overflow: 'hidden',
//                             display: 'flex',
//                             flexDirection: 'column'
//                           }}
//                         >
//                           <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom ">
//                             <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                             <button
//                               onClick={closeVariantOverlay}
//                               style={{
//                                 background: 'none',
//                                 border: 'none',
//                                 fontSize: '24px',
//                               }}
//                             >
//                               ×
//                             </button>
//                           </div>

//                           {/* Tabs */}
//                           <div className="variant-tabs d-flex">
//                             <button
//                               className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                               onClick={() => setSelectedVariantType("all")}
//                             >
//                               All ({totalVariants})
//                             </button>
//                             {groupedVariants.color.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("color")}
//                               >
//                                 Colors ({groupedVariants.color.length})
//                               </button>
//                             )}
//                             {groupedVariants.text.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("text")}
//                               >
//                                 Sizes ({groupedVariants.text.length})
//                               </button>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="p-3 overflow-auto flex-grow-1">
//                             {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                               <div className="row row-col-4 g-3 mb-4">
//                                 {groupedVariants.color.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div className="page-title-main-name"
//                                           style={{
//                                             width: "28px",
//                                             height: "28px",
//                                             borderRadius: "20%",
//                                             backgroundColor: v.hex || "#ccc",
//                                             margin: "0 auto 8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                             position: "relative",
//                                           }}
//                                         >
//                                           {isSelected && (
//                                             <span
//                                               style={{
//                                                 position: "absolute",
//                                                 top: "50%",
//                                                 left: "50%",
//                                                 transform: "translate(-50%, -50%)",
//                                                 color: "#fff",
//                                                 fontWeight: "bold",
//                                               }}
//                                             >
//                                               ✓
//                                             </span>
//                                           )}
//                                         </div>
//                                         <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}

//                             {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
//                               <div className="row row-cols-3 g-0">
//                                 {groupedVariants.text.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div
//                                           style={{
//                                             padding: "10px",
//                                             borderRadius: "8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             background: isSelected ? "#f8f9fa" : "#fff",
//                                             minHeight: "50px",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                           }}
//                                         >
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small mt-1">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </div>
//       ) : !loading && !error && (
//         <div className="text-center py-5">
//           <i className="bi bi-box-seam display-4 text-muted"></i>
//           <p className="text-muted mt-3">No products available at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;
















// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaHeart, FaRegHeart, FaExternalLinkAlt } from "react-icons/fa";
// import tick from "../assets/tick.svg";
// import bagIcon from "../assets/bag.svg";

// // Wishlist cache key
// const WISHLIST_CACHE_KEY = "guestWishlist";
// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// // Helper functions
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [], default: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const RecommendationSlider = ({ title, products: initialProducts }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [showAllShades, setShowAllShades] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");

//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // Helper to get product slug safely
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;

//     // First check if product has slugs array (from backend)
//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0]; // Use first slug from array
//     }

//     // If no slugs array, check for slug field directly
//     if (product.slug) {
//       return product.slug;
//     }

//     // Fallback: generate slug from product name and ID
//     const productName = product.name || "product";
//     const productId = product._id || "";
//     const nameSlug = productName
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');

//     return `${nameSlug}-${productId.substring(0, 8)}`;
//   }, []);

//   // Get product identifier for URL
//   const getProductIdentifier = useCallback((product) => {
//     if (!product) return null;

//     // Try to get slug first
//     const slug = getProductSlug(product);
//     if (slug) return slug;

//     // Fallback to product ID
//     return product._id;
//   }, [getProductSlug]);

//   // Safely get brand name from brand object or ID
//   const getBrandName = useCallback((product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   }, []);

//   // Helper to get variant name safely
//   const getVariantName = useCallback((variant) => {
//     if (!variant) return "Default";
//     const nameSources = [
//       variant.shadeName,
//       variant.name,
//       variant.variantName,
//       variant.size,
//       variant.ml,
//       variant.weight
//     ];
//     for (const source of nameSources) {
//       if (source && typeof source === 'string') {
//         return source;
//       }
//     }
//     return "Default";
//   }, []);

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     if (type === "success") {
//       toast.success(message, { autoClose: duration });
//     } else if (type === "error") {
//       toast.error(message, { autoClose: duration });
//     } else {
//       toast.info(message, { autoClose: duration });
//     }
//   };

//   // ===================== WISHLIST FUNCTIONS =====================

//   // ✅ Check if specific product variant is in wishlist
//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;

//     // Check in wishlistData
//     return wishlistData.some(item =>
//       (item.productId === productId || item._id === productId) &&
//       item.sku === sku
//     );
//   };

//   // ✅ Fetch full wishlist data
//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         // For logged-in users: Fetch from API
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         // For guests: Get from localStorage
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         // Convert guest wishlist to match API structure
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: item._id,
//           _id: item._id,
//           sku: item.sku,
//           name: item.name,
//           variant: item.variantName,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   // ✅ Toggle wishlist function
//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }

//     const productId = prod._id;
//     const sku = getSku(variant);

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         if (currentlyInWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             {
//               withCredentials: true,
//               data: { sku: sku }
//             }
//           );
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true }
//           );
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//         if (currentlyInWishlist) {
//           const updatedWishlist = guestWishlist.filter(item =>
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             images: variant.images || prod.images || ["/placeholder.png"],
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: getProductSlug(prod),
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             shadeName: variant.shadeName || variant.name || "Default",
//             variant: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#cccccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
//               ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         showToastMsg("Please login to use wishlist", "error");
//         navigate("/login");
//       } else {
//         showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // ✅ Initial fetch of wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // Helper to get variant display type (color, size, ml, etc.)
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, []);

//   // Helper function to get complete product data for display
//   const getProductDisplayData = useCallback((product) => {
//     if (!product) return null;

//     // Get all available variants
//     const allVariants = Array.isArray(product.variants) ? product.variants :
//       Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

//     // Find available variant (in stock first)
//     const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
//     const defaultVariant = allVariants[0] || {};

//     // Check if we have a selected variant stored for this product
//     const storedVariant = selectedVariants[product._id];

//     // Choose the best variant
//     let selectedVariant = storedVariant ||
//       product.selectedVariant ||
//       (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

//     // If stored variant doesn't exist or is out of stock, fallback
//     if (storedVariant) {
//       const storedStock = parseInt(storedVariant.stock || 0);
//       if (storedStock <= 0 && availableVariants.length > 0) {
//         selectedVariant = availableVariants[0];
//       }
//     }

//     // Get image with priority
//     let image = "";
//     const getVariantImage = (variant) => {
//       return variant?.images?.[0] || variant?.image;
//     };

//     image = getVariantImage(selectedVariant) ||
//       getVariantImage(availableVariants[0]) ||
//       getVariantImage(defaultVariant) ||
//       product.image ||
//       "";

//     // Get prices safely
//     const displayPrice = parseFloat(
//       selectedVariant.displayPrice ||
//       selectedVariant.discountedPrice ||
//       selectedVariant.price ||
//       product.price ||
//       0
//     );

//     const originalPrice = parseFloat(
//       selectedVariant.originalPrice ||
//       selectedVariant.mrp ||
//       product.mrp ||
//       displayPrice
//     );

//     // Calculate discount percentage if not provided
//     let discountPercent = parseFloat(
//       selectedVariant.discountPercent ||
//       product.discountPercent ||
//       0
//     );

//     if (!discountPercent && originalPrice > displayPrice) {
//       discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//     }

//     // Get variant name
//     const variantName = getVariantName(selectedVariant);
//     const variantType = getVariantType(selectedVariant);
//     const variantDisplayText = getVariantDisplayText(selectedVariant);

//     const stock = parseInt(selectedVariant.stock || product.stock || 0);
//     const status = stock > 0 ? "inStock" : "outOfStock";
//     const sku = selectedVariant.sku || product.sku || "";

//     // Get brand name safely
//     const brandName = getBrandName(product);

//     // Get product slug and identifier
//     const productSlug = getProductSlug(product);
//     const productIdentifier = getProductIdentifier(product);

//     return {
//       ...product,
//       _id: product._id || "",
//       name: product.name || "Unnamed Product",
//       brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
//       slug: productSlug,
//       productIdentifier: productIdentifier,
//       variant: {
//         ...selectedVariant,
//         variantName,
//         variantDisplayText,
//         displayPrice,
//         originalPrice,
//         discountPercent,
//         stock,
//         status,
//         sku,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v),
//       variants: allVariants // For compatibility with handleAddToCart
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug, getProductIdentifier]);

//   // ===================== ADD TO CART FUNCTION ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id] || prod.variant;
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           variants: [
//             {
//               variantSku: getSku(selectedVariant),
//               quantity: 1,
//             },
//           ],
//         };

//         // Cache selected variant (only for products with variants)
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         // Non-variant product
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           quantity: 1,
//         };

//         // Clear cache for non-variant products
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       // Add to cart via backend (works for both logged-in and guest via session)
//       const response = await axios.post(
//         `${CART_API_BASE}/add`,
//         payload,
//         { withCredentials: true }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//       showToastMsg(msg, "error");

//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Handle variant selection
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

//     // Update the products state to reflect the new selected variant
//     setProducts(prevProducts =>
//       prevProducts.map(product => {
//         if (product._id === productId) {
//           const stock = parseInt(variant.stock || 0);
//           const displayPrice = parseFloat(
//             variant.displayPrice ||
//             variant.discountedPrice ||
//             variant.price ||
//             product.price ||
//             0
//           );

//           const originalPrice = parseFloat(
//             variant.originalPrice ||
//             variant.mrp ||
//             product.mrp ||
//             displayPrice
//           );

//           let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
//           if (!discountPercent && originalPrice > displayPrice) {
//             discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//           }

//           const variantName = getVariantName(variant);
//           const variantType = getVariantType(variant);
//           const variantDisplayText = getVariantDisplayText(variant);
//           const hexColor = variant.hex || product.hex || "#000000";

//           return {
//             ...product,
//             variant: {
//               ...variant,
//               variantName,
//               variantDisplayText,
//               displayPrice,
//               originalPrice,
//               discountPercent,
//               stock,
//               status: stock > 0 ? "inStock" : "outOfStock",
//               sku: variant.sku || "",
//               hex: hexColor,
//               variantType,
//               _id: variant._id || ""
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType]);

//   // Toggle show all shades for a product
//   const toggleShowAllShades = (productId) => {
//     setShowAllShades(prev => ({
//       ...prev,
//       [productId]: !prev[productId]
//     }));
//   };

//   // Open variant overlay
//   const openVariantOverlay = (productId, variantType = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(variantType);
//     setShowVariantOverlay(productId);
//   };

//   // Close variant overlay
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Handle product click - Navigate using slug or ID
//   const handleProductClick = useCallback((product) => {
//     if (!product) return;

//     // Get the product identifier (slug first, then ID)
//     const productIdentifier = product.productIdentifier || product.slug || product._id;

//     if (productIdentifier) {
//       // Store product data in sessionStorage for the product details page
//       // This ensures data is available even after refresh
//       const productDataForStorage = {
//         id: product._id,
//         slug: product.slug,
//         name: product.name,
//         brand: product.brandName,
//         image: product.image,
//         variant: product.variant,
//         price: product.variant?.displayPrice,
//         originalPrice: product.variant?.originalPrice,
//         discountPercent: product.variant?.discountPercent,
//         avgRating: product.avgRating,
//         totalRatings: product.totalRatings,
//         timestamp: Date.now()
//       };

//       // Store in sessionStorage (cleared when browser closes)
//       sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

//       // Also store in localStorage as backup with expiration
//       const localStorageData = {
//         ...productDataForStorage,
//         expires: Date.now() + (60 * 60 * 1000) // 1 hour expiration
//       };
//       localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

//       // Navigate to product page
//       navigate(`/product/${productIdentifier}`);
//     }
//   }, [navigate]);

//   // Open product in new tab
//   const handleOpenInNewTab = useCallback((product, e) => {
//     e.stopPropagation();
//     if (!product) return;

//     const productIdentifier = product.productIdentifier || product.slug || product._id;
//     if (productIdentifier) {
//       // Store product data
//       const productDataForStorage = {
//         id: product._id,
//         slug: product.slug,
//         name: product.name,
//         brand: product.brandName,
//         image: product.image,
//         variant: product.variant,
//         price: product.variant?.displayPrice,
//         originalPrice: product.variant?.originalPrice,
//         discountPercent: product.variant?.discountPercent,
//         avgRating: product.avgRating,
//         totalRatings: product.totalRatings,
//         timestamp: Date.now()
//       };

//       sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

//       const localStorageData = {
//         ...productDataForStorage,
//         expires: Date.now() + (60 * 60 * 1000)
//       };
//       localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

//       // Open in new tab
//       window.open(`/product/${productIdentifier}`, '_blank');
//     }
//   }, []);

//   // Remove duplicates by product ID
//   const removeDuplicates = useCallback((productsArray) => {
//     const seen = new Map();
//     return productsArray.filter(product => {
//       if (!product?._id) return false;
//       const productId = product._id;
//       if (seen.has(productId)) {
//         const existing = seen.get(productId);
//         const existingDiscount = existing.variant?.discountPercent || 0;
//         const currentDiscount = product.variant?.discountPercent || 0;
//         if (currentDiscount > existingDiscount) {
//           seen.set(productId, product);
//         }
//         return false;
//       }
//       seen.set(productId, product);
//       return true;
//     });
//   }, []);

//   // Sort products by criteria
//   const sortProducts = useCallback((productsArray) => {
//     return [...productsArray].filter(Boolean).sort((a, b) => {
//       if (a.variant?.status === "inStock" && b.variant?.status !== "inStock") return -1;
//       if (a.variant?.status !== "inStock" && b.variant?.status === "inStock") return 1;
//       const discountA = a.variant?.discountPercent || 0;
//       const discountB = b.variant?.discountPercent || 0;
//       if (discountB !== discountA) return discountB - discountA;
//       return 0;
//     });
//   }, []);

//   // Transform backend data - merge all sections
//   const transformProducts = useCallback((sectionsData) => {
//     let allProducts = [];
//     if (sectionsData?.success && Array.isArray(sectionsData.sections)) {
//       sectionsData.sections.forEach((section, sectionIndex) => {
//         if (Array.isArray(section.products)) {
//           const productsWithSection = section.products.map((product, productIndex) => {
//             const displayData = getProductDisplayData(product);
//             if (!displayData) return null;
//             return {
//               ...displayData,
//               sectionTitle: typeof section.title === 'string' ? section.title :
//                 (section.name || "Featured"),
//               uniqueId: `${sectionIndex}-${productIndex}-${product._id || "noid"}`,
//               sectionIndex,
//               productIndex
//             };
//           }).filter(Boolean);
//           allProducts = [...allProducts, ...productsWithSection];
//         }
//       });
//     } else if (Array.isArray(sectionsData?.products)) {
//       sectionsData.products.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: sectionsData?.type === "personalized" ?
//               "Recommended For You" :
//               (sectionsData?.title || "Top Picks"),
//             uniqueId: `${sectionsData?.type || "default"}-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     } else if (Array.isArray(sectionsData)) {
//       sectionsData.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: "Recommended",
//             uniqueId: `default-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     }
//     return allProducts.filter(Boolean);
//   }, [getProductDisplayData]);

//   // Optimized variant analysis for each product
//   const getVariantAnalysis = useCallback((product) => {
//     if (!product) return { hasVariants: false, availableVariants: [] };
//     const allVariants = product.allVariants || [];
//     const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);

//     // Analyze variant types
//     const variantTypes = allVariants.map(v => getVariantType(v));
//     const hasColorVariants = variantTypes.includes('color');
//     const hasShadeVariants = variantTypes.includes('shade');
//     const hasSizeVariants = variantTypes.includes('size');

//     return {
//       hasVariants: allVariants.length > 0,
//       availableVariants,
//       totalVariants: allVariants.length,
//       hasMultipleVariants: allVariants.length > 1,
//       hasOnlyOneVariant: allVariants.length === 1,
//       hasColorVariants,
//       hasShadeVariants,
//       hasSizeVariants,
//       variantTypes,
//       currentVariant: product.variant
//     };
//   }, [getVariantType]);

//   // Initialize products
//   useEffect(() => {
//     if (initialProducts && initialProducts.length > 0) {
//       let data = transformProducts(initialProducts);
//       data = removeDuplicates(data);
//       data = sortProducts(data);
//       setProducts(data);
//       setLoading(false);
//     } else {
//       setProducts([]);
//       setLoading(false);
//     }
//   }, [initialProducts, transformProducts, removeDuplicates, sortProducts]);

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   return (
//     <div className="container-fluid position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="fs-3 text-start foryou-heading mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
//         {title}
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2 page-title-main-name fs-4 text-black">Loading recommendations...</p>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//         </div>
//       )}

//       {memoizedProducts.length > 0 ? (
//         <div className="position-relative">
//           <Swiper
//             modules={[Autoplay, Pagination, Navigation]}
//             pagination={{ clickable: true, dynamicBullets: true }}
//             navigation={{
//               nextEl: '.swiper-button-next',
//               prevEl: '.swiper-button-prev',
//             }}
//             breakpoints={{
//               300: { slidesPerView: 2, spaceBetween: 10 },
//               576: { slidesPerView: 2.5, spaceBetween: 15 },
//               768: { slidesPerView: 2, spaceBetween: 15 },
//               992: { slidesPerView: 3, spaceBetween: 20 },
//               1200: { slidesPerView: 4, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {memoizedProducts.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const variantAnalysis = getVariantAnalysis(item);

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = variantAnalysis.hasVariants;
//               const hasMultipleVariants = variantAnalysis.hasMultipleVariants;
//               const variantsToShow = item.allVariants || [];

//               // Check wishlist status for current variant
//               const selectedSku = getSku(variant);
//               const isProductInWishlist = isInWishlist(item._id, selectedSku);

//               // Separate variants into color (hex) variants and text variants
//               const colorVariants = variantsToShow.filter(v => v && isValidHexColor(v.hex));
//               const textVariants = variantsToShow.filter(v => v && !isValidHexColor(v.hex));
//               const hasColorVariants = colorVariants.length > 0;
//               const hasTextVariants = textVariants.length > 0;

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(variantsToShow);
//               const totalVariants = variantsToShow.length;

//               // Show only first 4 color variants initially
//               const initialColorVariants = colorVariants.slice(0, 4);
//               const hasMoreColorVariants = colorVariants.length > 4;

//               // Show only first 2 text variants initially
//               const initialTextVariants = textVariants.slice(0, 2);
//               const hasMoreTextVariants = textVariants.length > 2;

//               // Button state logic
//               const isAdding = addingToCart[item._id];
//               const noVariantSelected = hasVariants && !variant;
//               const outOfStock = hasVariants
//                 ? (variant?.stock <= 0)
//                 : (item.stock <= 0);
//               const buttonDisabled = isAdding || noVariantSelected || outOfStock;
//               const buttonText = isAdding
//                 ? "Adding..."
//                 : noVariantSelected
//                   ? "Select Variant"
//                   : outOfStock
//                     ? "Out of Stock"
//                     : "Add to Bag";

//               return (
//                 <SwiperSlide key={item.uniqueId}>
//                   <div className="foryou-card-wrapper">
//                     <div className="foryou-card">
//                       {/* Product Image with Overlays */}
//                       <div
//                         className="foryou-img-wrapper"
//                         onClick={() => handleProductClick(item)}
//                         style={{ cursor: 'pointer', position: 'relative' }}
//                       >
//                         <img
//                           src={imageUrl}
//                           alt={item.name || "Product"}
//                           className="foryou-img img-fluid"
//                           loading="lazy"
//                           onError={(e) => {
//                             e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                           }}
//                         />

//                         {/* Open in New Tab Button */}
//                         <button
//                           onClick={(e) => handleOpenInNewTab(item, e)}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             left: '10px',
//                             cursor: 'pointer',
//                             color: '#000000',
//                             fontSize: '16px',
//                             zIndex: 2,
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             borderRadius: '50%',
//                             width: '34px',
//                             height: '34px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'all 0.3s ease',
//                             border: 'none',
//                             outline: 'none'
//                           }}
//                           title="Open in new tab"
//                         >
//                           <FaExternalLinkAlt />
//                         </button>

//                         {/* Wishlist Icon */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (variant) {
//                               toggleWishlist(item, variant);
//                             }
//                           }}
//                           disabled={wishlistLoading[item._id]}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '10px',
//                             cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
//                             color: isProductInWishlist ? '#dc3545' : '#000000',
//                             fontSize: '22px',
//                             zIndex: 2,
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             borderRadius: '50%',
//                             width: '34px',
//                             height: '34px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'all 0.3s ease',
//                             border: 'none',
//                             outline: 'none'
//                           }}
//                           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                         >
//                           {wishlistLoading[item._id] ? (
//                             <div className="spinner-border spinner-border-sm" role="status"></div>
//                           ) : isProductInWishlist ? (
//                             <FaHeart />
//                           ) : (
//                             <FaRegHeart />
//                           )}
//                         </button>

//                         {/* Promo Badge */}
//                         {variant.promoApplied && (
//                           <div className="promo-badge">
//                             <i className="bi bi-tag-fill me-1"></i>
//                             Promo
//                           </div>
//                         )}
//                       </div>

//                       {/* Product Info */}
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '320px' }}>
//                           {/* Brand Name */}
//                           <div className="brand-name small text-muted mb-1">
//                             {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
//                           </div>

//                           {/* Product Name */}
//                           <h6
//                             className="foryou-name m-0 p-0"
//                             onClick={() => handleProductClick(item)}
//                             style={{ cursor: 'pointer' }}
//                           >
//                             {item.name || "Unnamed Product"}
//                             <small className="d-block text-muted mt-1">
//                               {variant.variantDisplayText}
//                             </small>
//                           </h6>

//                           {/* Dynamic Variant Display */}
//                           {hasVariants && (
//                             <div className="variant-section m-0 p-0 ms-0">
//                               {hasVariants && variantsToShow.length > 0 && (
//                                 <>
//                                   {/* Color Variants Section */}
//                                   {hasColorVariants && (
//                                     <div className="color-variants-section">
//                                       <p className="variant-label text-muted small mb-2">
//                                         Select Color:
//                                       </p>
//                                       <div className="variant-list d-flex flex-wrap gap-1 ms-1 align-items-center">
//                                         {initialColorVariants.map((v, idx) => {
//                                           if (!v) return null;
//                                           const displayText = getVariantDisplayText(v);
//                                           const color = v.hex || "#ccc";
//                                           const stock = parseInt(v.stock || 0);
//                                           const isOutOfStock = stock <= 0;
//                                           const isSelected =
//                                             variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                           const isDisabled = !hasMultipleVariants || isOutOfStock;

//                                           return (
//                                             <div className="varient-margin" key={v.sku || v._id || idx} style={{ position: "relative" }}>
//                                               <div
//                                                 className={`color-circle ${isSelected ? "selected" : ""}`}
//                                                 style={{
//                                                   backgroundColor: color,
//                                                   marginTop: '7px',
//                                                   width: "20px",
//                                                   height: "20px",
//                                                   borderRadius: "20%",
//                                                   cursor: isDisabled ? "default" : "pointer",
//                                                   opacity: isOutOfStock ? 0.5 : 1,
//                                                   transition: "all 0.2s ease",
//                                                 }}
//                                                 onClick={() => {
//                                                   if (isDisabled) return;
//                                                   handleVariantSelect(item._id, v);
//                                                 }}
//                                                 title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                               >
//                                                 {isSelected && (
//                                                   <span
//                                                     style={{
//                                                       position: "absolute",
//                                                       top: "50%",
//                                                       left: "50%",
//                                                       transform: "translate(-50%, -50%)",
//                                                       color: "#fff",
//                                                       fontSize: "10px",
//                                                       fontWeight: "bold",
//                                                     }}
//                                                   >
//                                                     <img src={tick} className="" style={{ width: '20px' }} alt="" />
//                                                   </span>
//                                                 )}
//                                               </div>
//                                             </div>
//                                           );
//                                         })}

//                                         {/* More Button for Color Variants */}
//                                         {hasMoreColorVariants && (
//                                           <div className="varient-margin" style={{ position: "relative", marginTop: '7px' }}>
//                                             <button
//                                               className="more-variants-btn"
//                                               onClick={(e) => openVariantOverlay(item._id, "color", e)}
//                                               style={{
//                                                 width: "36px",
//                                                 height: "auto",
//                                                 borderRadius: "4px",
//                                                 backgroundColor: "transparent",
//                                                 border: "0px solid #ddd",
//                                                 cursor: "pointer",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 fontSize: "10px",
//                                                 fontWeight: "bold",
//                                                 color: "#333"
//                                               }}
//                                               title={`Show all ${colorVariants.length} colors`}
//                                             >
//                                               +{colorVariants.length - 4}
//                                             </button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}

//                                   {/* Text Variants Section */}
//                                   {hasTextVariants && (
//                                     <div className="text-variants-section">
//                                       <p className="variant-label text-muted small mb-2 mt-2">
//                                         Select Size:
//                                       </p>
//                                       <div className="variant-list d-flex flex-wrap gap-2">
//                                         {initialTextVariants.map((v, idx) => {
//                                           if (!v) return null;
//                                           const displayText = getVariantDisplayText(v);
//                                           const stock = parseInt(v.stock || 0);
//                                           const isOutOfStock = stock <= 0;
//                                           const isSelected =
//                                             variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                           const isDisabled = !hasMultipleVariants || isOutOfStock;

//                                           return (
//                                             <div key={v.sku || v._id || idx}>
//                                               <div
//                                                 className={`variant-text-option ${isSelected ? "selected" : ""}`}
//                                                 style={{
//                                                   padding: "4px 8px",
//                                                   borderRadius: "4px",
//                                                   border: isSelected ? "2px solid #000000" : "1px solid #ddd",
//                                                   backgroundColor: isSelected ? "#f8f9fa" : "#fff",
//                                                   color: isSelected ? "#000000" : "#333",
//                                                   fontSize: "12px",
//                                                   fontWeight: isSelected ? 600 : 400,
//                                                   cursor: isDisabled ? "default" : "pointer",
//                                                   opacity: isOutOfStock ? 0.5 : 1,
//                                                   minWidth: "60px",
//                                                   textAlign: "center",
//                                                 }}
//                                                 onClick={() => {
//                                                   if (isDisabled) return;
//                                                   handleVariantSelect(item._id, v);
//                                                 }}
//                                                 title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                               >
//                                                 {displayText}
//                                               </div>
//                                             </div>
//                                           );
//                                         })}

//                                         {/* More Button for Text Variants */}
//                                         {hasMoreTextVariants && (
//                                           <div style={{ position: "relative" }}>
//                                             <button
//                                               className="more-variants-btn"
//                                               onClick={(e) => openVariantOverlay(item._id, "text", e)}
//                                               style={{
//                                                 padding: "4px 8px",
//                                                 borderRadius: "4px",
//                                                 backgroundColor: "transparent",
//                                                 border: "0px solid #ddd",
//                                                 cursor: "pointer",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 fontSize: "10px",
//                                                 fontWeight: "bold",
//                                                 color: "#333",
//                                                 minWidth: "60px",
//                                               }}
//                                               title={`Show all ${textVariants.length} sizes`}
//                                             >
//                                               +{textVariants.length - 2}
//                                             </button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </>
//                               )}
//                             </div>
//                           )}

//                           {/* Price Section */}
//                           <div className="price-section mb-3">
//                             <div className="d-flex align-items-baseline flex-wrap">
//                               <span className="current-price fw-400 fs-5">
//                                 {formatPrice(variant.displayPrice)}
//                               </span>
//                               {variant.originalPrice > variant.displayPrice && (
//                                 <>
//                                   <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                     {formatPrice(variant.originalPrice)}
//                                   </span>
//                                   <span className="discount-percent text-danger fw-bold ms-2">
//                                     ({variant.discountPercent || 0}% OFF)
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </div>

//                           {/* Add to Cart Button */}
//                           <div className="cart-section">
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 className={`w-100 ${variant.status === "inStock"} btn-add-cart`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleAddToCart(item);
//                                 }}
//                                 disabled={buttonDisabled}
//                                 style={{
//                                   transition: "background-color 0.3s ease, color 0.3s ease",
//                                 }}
//                               >
//                                 {isAdding ? (
//                                   <>
//                                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                     Adding...
//                                   </>
//                                 ) : (
//                                   <>
//                                     {buttonText}
//                                     {!buttonDisabled && !isAdding && (
//                                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                                     )}
//                                   </>
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Variant Overlay */}
//                     {showVariantOverlay === item._id && (
//                       <div className="variant-overlay" onClick={closeVariantOverlay}>
//                         <div
//                           className="variant-overlay-content"
//                           onClick={(e) => e.stopPropagation()}
//                           style={{
//                             width: '100%',
//                             maxWidth: '500px',
//                             maxHeight: '100vh',
//                             background: '#fff',
//                             borderRadius: '12px',
//                             overflow: 'hidden',
//                             display: 'flex',
//                             flexDirection: 'column'
//                           }}
//                         >
//                           <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                             <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                             <button
//                               onClick={closeVariantOverlay}
//                               style={{
//                                 background: 'none',
//                                 border: 'none',
//                                 fontSize: '24px',
//                               }}
//                             >
//                               ×
//                             </button>
//                           </div>

//                           {/* Tabs */}
//                           <div className="variant-tabs d-flex">
//                             <button
//                               className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                               onClick={() => setSelectedVariantType("all")}
//                             >
//                               All ({totalVariants})
//                             </button>
//                             {groupedVariants.color.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("color")}
//                               >
//                                 Colors ({groupedVariants.color.length})
//                               </button>
//                             )}
//                             {groupedVariants.text.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("text")}
//                               >
//                                 Sizes ({groupedVariants.text.length})
//                               </button>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="p-3 overflow-auto flex-grow-1">
//                             {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                               <div className="row row-col-4 g-3 mb-4">
//                                 {groupedVariants.color.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div className="page-title-main-name"
//                                           style={{
//                                             width: "28px",
//                                             height: "28px",
//                                             borderRadius: "20%",
//                                             backgroundColor: v.hex || "#ccc",
//                                             margin: "0 auto 8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                             position: "relative",
//                                           }}
//                                         >
//                                           {isSelected && (
//                                             <span
//                                               style={{
//                                                 position: "absolute",
//                                                 top: "50%",
//                                                 left: "50%",
//                                                 transform: "translate(-50%, -50%)",
//                                                 color: "#fff",
//                                                 fontWeight: "bold",
//                                               }}
//                                             >
//                                               ✓
//                                             </span>
//                                           )}
//                                         </div>
//                                         <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}

//                             {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
//                               <div className="row row-cols-3 g-0">
//                                 {groupedVariants.text.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div
//                                           style={{
//                                             padding: "10px",
//                                             borderRadius: "8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             background: isSelected ? "#f8f9fa" : "#fff",
//                                             minHeight: "50px",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                           }}
//                                         >
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small mt-1">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </div>
//       ) : !loading && !error && (
//         <div className="text-center py-5">
//           <i className="bi bi-box-seam display-4 text-muted"></i>
//           <p className="text-muted mt-3">No products available at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;


































// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaHeart, FaRegHeart, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";
// import tick from "../assets/tick.svg";
// import bagIcon from "../assets/bag.svg";

// // Wishlist cache key
// const WISHLIST_CACHE_KEY = "guestWishlist";
// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// // Helper functions
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [], default: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const RecommendationSlider = ({ title, products: initialProducts }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [showAllShades, setShowAllShades] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");

//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // Helper to get product slug safely
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;

//     // First check if product has slugs array (from backend)
//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0]; // Use first slug from array
//     }

//     // If no slugs array, check for slug field directly
//     if (product.slug) {
//       return product.slug;
//     }

//     // Fallback: generate slug from product name and ID
//     const productName = product.name || "product";
//     const productId = product._id || "";
//     const nameSlug = productName
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');

//     return `${nameSlug}-${productId.substring(0, 8)}`;
//   }, []);

//   // Get product identifier for URL
//   const getProductIdentifier = useCallback((product) => {
//     if (!product) return null;

//     // Try to get slug first
//     const slug = getProductSlug(product);
//     if (slug) return slug;

//     // Fallback to product ID
//     return product._id;
//   }, [getProductSlug]);

//   // Safely get brand name from brand object or ID
//   const getBrandName = useCallback((product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   }, []);

//   // Helper to get variant name safely
//   const getVariantName = useCallback((variant) => {
//     if (!variant) return "Default";
//     const nameSources = [
//       variant.shadeName,
//       variant.name,
//       variant.variantName,
//       variant.size,
//       variant.ml,
//       variant.weight
//     ];
//     for (const source of nameSources) {
//       if (source && typeof source === 'string') {
//         return source;
//       }
//     }
//     return "Default";
//   }, []);

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     if (type === "success") {
//       toast.success(message, { autoClose: duration });
//     } else if (type === "error") {
//       toast.error(message, { autoClose: duration });
//     } else {
//       toast.info(message, { autoClose: duration });
//     }
//   };

//   // ===================== WISHLIST FUNCTIONS =====================

//   // ✅ Check if specific product variant is in wishlist
//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;

//     // Check in wishlistData
//     return wishlistData.some(item =>
//       (item.productId === productId || item._id === productId) &&
//       item.sku === sku
//     );
//   };

//   // ✅ Fetch full wishlist data
//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         // For logged-in users: Fetch from API
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         // For guests: Get from localStorage
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         // Convert guest wishlist to match API structure
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: item._id,
//           _id: item._id,
//           sku: item.sku,
//           name: item.name,
//           variant: item.variantName,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   // ✅ Toggle wishlist function
//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }

//     const productId = prod._id;
//     const sku = getSku(variant);

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         if (currentlyInWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             {
//               withCredentials: true,
//               data: { sku: sku }
//             }
//           );
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true }
//           );
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//         if (currentlyInWishlist) {
//           const updatedWishlist = guestWishlist.filter(item =>
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             images: variant.images || prod.images || ["/placeholder.png"],
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: getProductSlug(prod),
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             shadeName: variant.shadeName || variant.name || "Default",
//             variant: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#cccccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
//               ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         showToastMsg("Please login to use wishlist", "error");
//         navigate("/login");
//       } else {
//         showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // ✅ Initial fetch of wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // Helper to get variant display type (color, size, ml, etc.)
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, []);

//   // Helper function to get complete product data for display
//   const getProductDisplayData = useCallback((product) => {
//     if (!product) return null;

//     // Get all available variants
//     const allVariants = Array.isArray(product.variants) ? product.variants :
//       Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

//     // Find available variant (in stock first)
//     const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
//     const defaultVariant = allVariants[0] || {};

//     // Check if we have a selected variant stored for this product
//     const storedVariant = selectedVariants[product._id];

//     // Choose the best variant
//     let selectedVariant = storedVariant ||
//       product.selectedVariant ||
//       (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

//     // If stored variant doesn't exist or is out of stock, fallback
//     if (storedVariant) {
//       const storedStock = parseInt(storedVariant.stock || 0);
//       if (storedStock <= 0 && availableVariants.length > 0) {
//         selectedVariant = availableVariants[0];
//       }
//     }

//     // Get image with priority
//     let image = "";
//     const getVariantImage = (variant) => {
//       return variant?.images?.[0] || variant?.image;
//     };

//     image = getVariantImage(selectedVariant) ||
//       getVariantImage(availableVariants[0]) ||
//       getVariantImage(defaultVariant) ||
//       product.image ||
//       "";

//     // Get prices safely
//     const displayPrice = parseFloat(
//       selectedVariant.displayPrice ||
//       selectedVariant.discountedPrice ||
//       selectedVariant.price ||
//       product.price ||
//       0
//     );

//     const originalPrice = parseFloat(
//       selectedVariant.originalPrice ||
//       selectedVariant.mrp ||
//       product.mrp ||
//       displayPrice
//     );

//     // Calculate discount percentage if not provided
//     let discountPercent = parseFloat(
//       selectedVariant.discountPercent ||
//       product.discountPercent ||
//       0
//     );

//     if (!discountPercent && originalPrice > displayPrice) {
//       discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//     }

//     // Get variant name
//     const variantName = getVariantName(selectedVariant);
//     const variantType = getVariantType(selectedVariant);
//     const variantDisplayText = getVariantDisplayText(selectedVariant);

//     const stock = parseInt(selectedVariant.stock || product.stock || 0);
//     const status = stock > 0 ? "inStock" : "outOfStock";
//     const sku = selectedVariant.sku || product.sku || "";

//     // Get brand name safely
//     const brandName = getBrandName(product);

//     // Get product slug and identifier
//     const productSlug = getProductSlug(product);
//     const productIdentifier = getProductIdentifier(product);

//     return {
//       ...product,
//       _id: product._id || "",
//       name: product.name || "Unnamed Product",
//       brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
//       slug: productSlug,
//       productIdentifier: productIdentifier,
//       variant: {
//         ...selectedVariant,
//         variantName,
//         variantDisplayText,
//         displayPrice,
//         originalPrice,
//         discountPercent,
//         stock,
//         status,
//         sku,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v),
//       variants: allVariants // For compatibility with handleAddToCart
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug, getProductIdentifier]);

//   // ===================== ADD TO CART FUNCTION ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id] || prod.variant;
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           variants: [
//             {
//               variantSku: getSku(selectedVariant),
//               quantity: 1,
//             },
//           ],
//         };

//         // Cache selected variant (only for products with variants)
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         // Non-variant product
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           quantity: 1,
//         };

//         // Clear cache for non-variant products
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       // Add to cart via backend (works for both logged-in and guest via session)
//       const response = await axios.post(
//         `${CART_API_BASE}/add`,
//         payload,
//         { withCredentials: true }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//       showToastMsg(msg, "error");

//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Handle variant selection
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

//     // Update the products state to reflect the new selected variant
//     setProducts(prevProducts =>
//       prevProducts.map(product => {
//         if (product._id === productId) {
//           const stock = parseInt(variant.stock || 0);
//           const displayPrice = parseFloat(
//             variant.displayPrice ||
//             variant.discountedPrice ||
//             variant.price ||
//             product.price ||
//             0
//           );

//           const originalPrice = parseFloat(
//             variant.originalPrice ||
//             variant.mrp ||
//             product.mrp ||
//             displayPrice
//           );

//           let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
//           if (!discountPercent && originalPrice > displayPrice) {
//             discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//           }

//           const variantName = getVariantName(variant);
//           const variantType = getVariantType(variant);
//           const variantDisplayText = getVariantDisplayText(variant);
//           const hexColor = variant.hex || product.hex || "#000000";

//           return {
//             ...product,
//             variant: {
//               ...variant,
//               variantName,
//               variantDisplayText,
//               displayPrice,
//               originalPrice,
//               discountPercent,
//               stock,
//               status: stock > 0 ? "inStock" : "outOfStock",
//               sku: variant.sku || "",
//               hex: hexColor,
//               variantType,
//               _id: variant._id || ""
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType]);

//   // Toggle show all shades for a product
//   const toggleShowAllShades = (productId) => {
//     setShowAllShades(prev => ({
//       ...prev,
//       [productId]: !prev[productId]
//     }));
//   };

//   // Open variant overlay
//   const openVariantOverlay = (productId, variantType = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(variantType);
//     setShowVariantOverlay(productId);
//   };

//   // Close variant overlay
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Handle product click - Navigate using slug or ID
//   const handleProductClick = useCallback((product) => {
//     if (!product) return;

//     // Get the product identifier (slug first, then ID)
//     const productIdentifier = product.productIdentifier || product.slug || product._id;

//     if (productIdentifier) {
//       // Store product data in sessionStorage for the product details page
//       // This ensures data is available even after refresh
//       const productDataForStorage = {
//         id: product._id,
//         slug: product.slug,
//         name: product.name,
//         brand: product.brandName,
//         image: product.image,
//         variant: product.variant,
//         price: product.variant?.displayPrice,
//         originalPrice: product.variant?.originalPrice,
//         discountPercent: product.variant?.discountPercent,
//         avgRating: product.avgRating,
//         totalRatings: product.totalRatings,
//         timestamp: Date.now()
//       };

//       // Store in sessionStorage (cleared when browser closes)
//       sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

//       // Also store in localStorage as backup with expiration
//       const localStorageData = {
//         ...productDataForStorage,
//         expires: Date.now() + (60 * 60 * 1000) // 1 hour expiration
//       };
//       localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

//       // Navigate to product page
//       navigate(`/product/${productIdentifier}`);
//     }
//   }, [navigate]);

//   // Open product in new tab
//   const handleOpenInNewTab = useCallback((product, e) => {
//     e.stopPropagation();
//     if (!product) return;

//     const productIdentifier = product.productIdentifier || product.slug || product._id;
//     if (productIdentifier) {
//       // Store product data
//       const productDataForStorage = {
//         id: product._id,
//         slug: product.slug,
//         name: product.name,
//         brand: product.brandName,
//         image: product.image,
//         variant: product.variant,
//         price: product.variant?.displayPrice,
//         originalPrice: product.variant?.originalPrice,
//         discountPercent: product.variant?.discountPercent,
//         avgRating: product.avgRating,
//         totalRatings: product.totalRatings,
//         timestamp: Date.now()
//       };

//       sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

//       const localStorageData = {
//         ...productDataForStorage,
//         expires: Date.now() + (60 * 60 * 1000)
//       };
//       localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

//       // Open in new tab
//       window.open(`/product/${productIdentifier}`, '_blank');
//     }
//   }, []);

//   // Remove duplicates by product ID
//   const removeDuplicates = useCallback((productsArray) => {
//     const seen = new Map();
//     return productsArray.filter(product => {
//       if (!product?._id) return false;
//       const productId = product._id;
//       if (seen.has(productId)) {
//         const existing = seen.get(productId);
//         const existingDiscount = existing.variant?.discountPercent || 0;
//         const currentDiscount = product.variant?.discountPercent || 0;
//         if (currentDiscount > existingDiscount) {
//           seen.set(productId, product);
//         }
//         return false;
//       }
//       seen.set(productId, product);
//       return true;
//     });
//   }, []);

//   // Sort products by criteria
//   const sortProducts = useCallback((productsArray) => {
//     return [...productsArray].filter(Boolean).sort((a, b) => {
//       if (a.variant?.status === "inStock" && b.variant?.status !== "inStock") return -1;
//       if (a.variant?.status !== "inStock" && b.variant?.status === "inStock") return 1;
//       const discountA = a.variant?.discountPercent || 0;
//       const discountB = b.variant?.discountPercent || 0;
//       if (discountB !== discountA) return discountB - discountA;
//       return 0;
//     });
//   }, []);

//   // Transform backend data - merge all sections
//   const transformProducts = useCallback((sectionsData) => {
//     let allProducts = [];
//     if (sectionsData?.success && Array.isArray(sectionsData.sections)) {
//       sectionsData.sections.forEach((section, sectionIndex) => {
//         if (Array.isArray(section.products)) {
//           const productsWithSection = section.products.map((product, productIndex) => {
//             const displayData = getProductDisplayData(product);
//             if (!displayData) return null;
//             return {
//               ...displayData,
//               sectionTitle: typeof section.title === 'string' ? section.title :
//                 (section.name || "Featured"),
//               uniqueId: `${sectionIndex}-${productIndex}-${product._id || "noid"}`,
//               sectionIndex,
//               productIndex
//             };
//           }).filter(Boolean);
//           allProducts = [...allProducts, ...productsWithSection];
//         }
//       });
//     } else if (Array.isArray(sectionsData?.products)) {
//       sectionsData.products.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: sectionsData?.type === "personalized" ?
//               "Recommended For You" :
//               (sectionsData?.title || "Top Picks"),
//             uniqueId: `${sectionsData?.type || "default"}-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     } else if (Array.isArray(sectionsData)) {
//       sectionsData.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: "Recommended",
//             uniqueId: `default-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     }
//     return allProducts.filter(Boolean);
//   }, [getProductDisplayData]);

//   // Optimized variant analysis for each product
//   const getVariantAnalysis = useCallback((product) => {
//     if (!product) return { hasVariants: false, availableVariants: [] };
//     const allVariants = product.allVariants || [];
//     const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);

//     // Analyze variant types
//     const variantTypes = allVariants.map(v => getVariantType(v));
//     const hasColorVariants = variantTypes.includes('color');
//     const hasShadeVariants = variantTypes.includes('shade');
//     const hasSizeVariants = variantTypes.includes('size');

//     return {
//       hasVariants: allVariants.length > 0,
//       availableVariants,
//       totalVariants: allVariants.length,
//       hasMultipleVariants: allVariants.length > 1,
//       hasOnlyOneVariant: allVariants.length === 1,
//       hasColorVariants,
//       hasShadeVariants,
//       hasSizeVariants,
//       variantTypes,
//       currentVariant: product.variant
//     };
//   }, [getVariantType]);

//   // Initialize products
//   useEffect(() => {
//     if (initialProducts && initialProducts.length > 0) {
//       let data = transformProducts(initialProducts);
//       data = removeDuplicates(data);
//       data = sortProducts(data);
//       setProducts(data);
//       setLoading(false);
//     } else {
//       setProducts([]);
//       setLoading(false);
//     }
//   }, [initialProducts, transformProducts, removeDuplicates, sortProducts]);

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   return (
//     <div className="container-fluid position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="fs-3 text-start foryou-heading mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
//         {title}
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2 page-title-main-name fs-4 text-black">Loading recommendations...</p>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//         </div>
//       )}

//       {memoizedProducts.length > 0 ? (
//         <div className="position-relative">
//           <Swiper
//             modules={[Autoplay, Pagination, Navigation]}
//             pagination={{ clickable: true, dynamicBullets: true }}
//             navigation={{
//               nextEl: '.swiper-button-next',
//               prevEl: '.swiper-button-prev',
//             }}
//             breakpoints={{
//               300: { slidesPerView: 2, spaceBetween: 10 },
//               576: { slidesPerView: 2.5, spaceBetween: 15 },
//               768: { slidesPerView: 3, spaceBetween: 15 },
//               992: { slidesPerView: 4, spaceBetween: 20 },
//               1200: { slidesPerView: 4, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {memoizedProducts.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const variantAnalysis = getVariantAnalysis(item);

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = variantAnalysis.hasVariants;
//               const variantsToShow = item.allVariants || [];

//               // Check wishlist status for current variant
//               const selectedSku = getSku(variant);
//               const isProductInWishlist = isInWishlist(item._id, selectedSku);

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(variantsToShow);
//               const totalVariants = variantsToShow.length;

//               // Check if a variant is selected for this product
//               const isVariantSelected = !!selectedVariants[item._id];

//               // Button state logic - UPDATED: Show "Select Variant" first if variants exist but none selected
//               const isAdding = addingToCart[item._id];
//               const outOfStock = hasVariants
//                 ? (variant?.stock <= 0)
//                 : (item.stock <= 0);

//               // UPDATED LOGIC: If product has variants and no variant is selected, show "Select Variant" button
//               const showSelectVariantButton = hasVariants && !isVariantSelected;

//               const buttonDisabled = isAdding || outOfStock;
//               const buttonText = isAdding
//                 ? "Adding..."
//                 : showSelectVariantButton
//                   ? "Select Variant"
//                   : outOfStock
//                     ? "Out of Stock"
//                     : "Add to Bag";

//               return (
//                 <SwiperSlide key={item.uniqueId}>
//                   <div className="foryou-card-wrapper">
//                     <div className="foryou-card">
//                       {/* Product Image with Overlays */}
//                       <div
//                         className="foryou-img-wrapper"
//                         onClick={() => handleProductClick(item)}
//                         style={{ cursor: 'pointer', position: 'relative' }}
//                       >
//                         <img
//                           src={imageUrl}
//                           alt={item.name || "Product"}
//                           className="foryou-img img-fluid"
//                           loading="lazy"
//                           onError={(e) => {
//                             e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                           }}
//                         />

//                         {/* Open in New Tab Button */}
//                         <button
//                           onClick={(e) => handleOpenInNewTab(item, e)}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             left: '10px',
//                             cursor: 'pointer',
//                             color: '#000000',
//                             fontSize: '16px',
//                             zIndex: 2,
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             borderRadius: '50%',
//                             width: '34px',
//                             height: '34px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'all 0.3s ease',
//                             border: 'none',
//                             outline: 'none'
//                           }}
//                           title="Open in new tab"
//                         >
//                           <FaExternalLinkAlt />
//                         </button>

//                         {/* Wishlist Icon */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (variant) {
//                               toggleWishlist(item, variant);
//                             }
//                           }}
//                           disabled={wishlistLoading[item._id]}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '10px',
//                             cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
//                             color: isProductInWishlist ? '#dc3545' : '#000000',
//                             fontSize: '22px',
//                             zIndex: 2,
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             borderRadius: '50%',
//                             width: '34px',
//                             height: '34px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'all 0.3s ease',
//                             border: 'none',
//                             outline: 'none'
//                           }}
//                           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                         >
//                           {wishlistLoading[item._id] ? (
//                             <div className="spinner-border spinner-border-sm" role="status"></div>
//                           ) : isProductInWishlist ? (
//                             <FaHeart />
//                           ) : (
//                             <FaRegHeart />
//                           )}
//                         </button>

//                         {/* Promo Badge */}
//                         {variant.promoApplied && (
//                           <div className="promo-badge">
//                             <i className="bi bi-tag-fill me-1"></i>
//                             Promo
//                           </div>
//                         )}
//                       </div>

//                       {/* Product Info */}
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>

//                           {/* Brand Name */}
//                           <div className="brand-name small text-muted mb-1 mt-2 text-start">
//                             {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
//                           </div>

//                           {/* Product Name */}
//                           <h6
//                             className="foryou-name font-family-Poppins m-0 p-0"
//                             onClick={() => handleProductClick(item)}
//                             style={{ cursor: 'pointer' }}
//                           >
//                             {item.name || "Unnamed Product"}
//                           </h6>

//                           {/* Minimal Variant Display Instead of Variant Bubbles */}
//                           {hasVariants && (
//                             <div className="">
//                               {isVariantSelected ? (
//                                 <div
//                                   className="selected-variant-display text-muted small"
//                                   style={{ cursor: 'pointer', display: 'inline-block' }}
//                                   onClick={(e) => openVariantOverlay(item._id, "all", e)}
//                                   title="Click to change variant"
//                                 >
//                                   Variant: <span className="fw-bold text-dark">{getVariantDisplayText(variant)}</span>
//                                   <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                                 </div>
//                               ) : (
//                                 <div className="small text-muted" style={{ height: '20px' }}>
//                                   {variantsToShow.length} Variants Available
//                                 </div>
//                               )}
//                             </div>
//                           )}

//                           {/* Price Section */}
//                           <div className="price-section mb-3">
//                             <div className="d-flex align-items-baseline flex-wrap">
//                               <span className="current-price fw-400 fs-5">
//                                 {formatPrice(variant.displayPrice)}
//                               </span>
//                               {variant.originalPrice > variant.displayPrice && (
//                                 <>
//                                   <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                     {formatPrice(variant.originalPrice)}
//                                   </span>
//                                   <span className="discount-percent text-danger fw-bold ms-2">
//                                     ({variant.discountPercent || 0}% OFF)
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </div>

//                           {/* Add to Cart Button - UPDATED: Show Select Variant first, then Add to Bag */}
//                           <div className="cart-section">
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 // className={`w-100 btn-add-cart`}

//                                 className={`btn w-100 addtocartbuttton page-title-main-name d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"
//                                   }`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   // UPDATED: If showing "Select Variant", open overlay instead of adding to cart
//                                   if (showSelectVariantButton) {
//                                     openVariantOverlay(item._id, "all", e);
//                                   } else {
//                                     handleAddToCart(item);
//                                   }
//                                 }}
//                                 disabled={buttonDisabled}
//                                 style={{
//                                   transition: "background-color 0.3s ease, color 0.3s ease",
//                                 }}
//                               >
//                                 {isAdding ? (
//                                   <>
//                                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                     Adding...
//                                   </>
//                                 ) : (
//                                   <>
//                                     {buttonText}
//                                     {/* Only show bag icon when NOT showing "Select Variant" */}
//                                     {!buttonDisabled && !isAdding && !showSelectVariantButton && (
//                                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                                     )}
//                                   </>
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Variant Overlay */}
//                     {showVariantOverlay === item._id && (
//                       <div className="variant-overlay" onClick={closeVariantOverlay}>
//                         <div
//                           className="variant-overlay-content"
//                           onClick={(e) => e.stopPropagation()}
//                           style={{
//                             width: '100%',
//                             maxWidth: '500px',
//                             maxHeight: '100vh',
//                             background: '#fff',
//                             borderRadius: '0px',
//                             overflow: 'hidden',
//                             display: 'flex',
//                             flexDirection: 'column'
//                           }}
//                         >
//                           <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom ">
//                             <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                             <button
//                               onClick={closeVariantOverlay}
//                               style={{
//                                 background: 'none',
//                                 border: 'none',
//                                 fontSize: '24px',
//                               }}
//                             >
//                               ×
//                             </button>
//                           </div>

//                           {/* Tabs */}
//                           <div className="variant-tabs d-flex">
//                             <button
//                               className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                               onClick={() => setSelectedVariantType("all")}
//                             >
//                               All ({totalVariants})
//                             </button>
//                             {groupedVariants.color.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("color")}
//                               >
//                                 Colors ({groupedVariants.color.length})
//                               </button>
//                             )}
//                             {groupedVariants.text.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("text")}
//                               >
//                                 Sizes ({groupedVariants.text.length})
//                               </button>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="p-3 overflow-auto flex-grow-1">
//                             {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                               <div className="row row-col-4 g-3">
//                                 {groupedVariants.color.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-4 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div className="page-title-main-name"
//                                           style={{
//                                             width: "28px",
//                                             height: "28px",
//                                             borderRadius: "20%",
//                                             backgroundColor: v.hex || "#ccc",
//                                             margin: "0 auto 8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                             position: "relative",
//                                           }}
//                                         >
//                                           {isSelected && (
//                                             <span
//                                               style={{
//                                                 position: "absolute",
//                                                 top: "50%",
//                                                 left: "50%",
//                                                 transform: "translate(-50%, -50%)",
//                                                 color: "#fff",
//                                                 fontWeight: "bold",
//                                               }}
//                                             >
//                                               ✓
//                                             </span>
//                                           )}
//                                         </div>
//                                         <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}

//                             {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
//                               <div className="row row-cols-3 g-0">
//                                 {groupedVariants.text.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div
//                                           style={{
//                                             padding: "10px",
//                                             borderRadius: "8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             background: isSelected ? "#f8f9fa" : "#fff",
//                                             minHeight: "50px",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                           }}
//                                         >
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small mt-1">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </div>
//       ) : !loading && !error && (
//         <div className="text-center py-5">
//           <i className="bi bi-box-seam display-4 text-muted"></i>
//           <p className="text-muted mt-3">No products available at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;















// // src/components/RecommendationSlider.jsx
// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaHeart, FaRegHeart, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";
// import tick from "../assets/tick.svg";
// import bagIcon from "../assets/bag.svg";

// // 🆕 Import DotLottie loader (same package as ProductPage)
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// // Wishlist cache key
// const WISHLIST_CACHE_KEY = "guestWishlist";
// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// // Helper functions
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const normalized = hex.trim().toLowerCase();
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//   return (
//     variant.shadeName ||
//     variant.name ||
//     variant.size ||
//     variant.ml ||
//     variant.weight ||
//     "Default"
//   ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [], default: [] };
//   variants.forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) {
//       grouped.color.push(v);
//     } else {
//       grouped.text.push(v);
//     }
//   });
//   return grouped;
// };

// const RecommendationSlider = ({ title, products: initialProducts }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [showAllShades, setShowAllShades] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");

//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // Helper to get product slug safely
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;
//     // First check if product has slugs array (from backend)
//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0]; // Use first slug from array
//     }
//     // If no slugs array, check for slug field directly
//     if (product.slug) {
//       return product.slug;
//     }
//     // Fallback: generate slug from product name and ID
//     const productName = product.name || "product";
//     const productId = product._id || "";
//     const nameSlug = productName
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');
//     return `${nameSlug}-${productId.substring(0, 8)}`;
//   }, []);

//   // Get product identifier for URL
//   const getProductIdentifier = useCallback((product) => {
//     if (!product) return null;
//     // Try to get slug first
//     const slug = getProductSlug(product);
//     if (slug) return slug;
//     // Fallback to product ID
//     return product._id;
//   }, [getProductSlug]);

//   // Safely get brand name from brand object or ID
//   const getBrandName = useCallback((product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   }, []);

//   // Helper to get variant name safely
//   const getVariantName = useCallback((variant) => {
//     if (!variant) return "Default";
//     const nameSources = [
//       variant.shadeName,
//       variant.name,
//       variant.variantName,
//       variant.size,
//       variant.ml,
//       variant.weight
//     ];
//     for (const source of nameSources) {
//       if (source && typeof source === 'string') {
//         return source;
//       }
//     }
//     return "Default";
//   }, []);

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     if (type === "success") {
//       toast.success(message, { autoClose: duration });
//     } else if (type === "error") {
//       toast.error(message, { autoClose: duration });
//     } else {
//       toast.info(message, { autoClose: duration });
//     }
//   };

//   // ===================== WISHLIST FUNCTIONS =====================
//   // ✅ Check if specific product variant is in wishlist
//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;
//     // Check in wishlistData
//     return wishlistData.some(item =>
//       (item.productId === productId || item._id === productId) &&
//       item.sku === sku
//     );
//   };

//   // ✅ Fetch full wishlist data
//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         // For logged-in users: Fetch from API
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         // For guests: Get from localStorage
//         const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         // Convert guest wishlist to match API structure
//         const formattedWishlist = localWishlist.map(item => ({
//           productId: item._id,
//           _id: item._id,
//           sku: item.sku,
//           name: item.name,
//           variant: item.variantName,
//           image: item.image,
//           displayPrice: item.displayPrice,
//           originalPrice: item.originalPrice,
//           discountPercent: item.discountPercent,
//           status: item.status,
//           avgRating: item.avgRating,
//           totalRatings: item.totalRatings
//         }));
//         setWishlistData(formattedWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   // ✅ Toggle wishlist function
//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) {
//       showToastMsg("Please select a variant first", "error");
//       return;
//     }

//     const productId = prod._id;
//     const sku = getSku(variant);

//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         if (currentlyInWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             {
//               withCredentials: true,
//               data: { sku: sku }
//             }
//           );
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true }
//           );
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//         if (currentlyInWishlist) {
//           const updatedWishlist = guestWishlist.filter(item =>
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             images: variant.images || prod.images || ["/placeholder.png"],
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: getProductSlug(prod),
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             shadeName: variant.shadeName || variant.name || "Default",
//             variant: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#cccccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             commentsCount: prod.totalRatings || 0,
//             discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
//               ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//           showToastMsg("Added to wishlist!", "success");
//         }

//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         showToastMsg("Please login to use wishlist", "error");
//         navigate("/login");
//       } else {
//         showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // ✅ Initial fetch of wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // Helper to get variant display type (color, size, ml, etc.)
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, []);

//   // Helper function to get complete product data for display
//   const getProductDisplayData = useCallback((product) => {
//     if (!product) return null;

//     // Get all available variants
//     const allVariants = Array.isArray(product.variants) ? product.variants :
//       Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

//     // Find available variant (in stock first)
//     const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
//     const defaultVariant = allVariants[0] || {};

//     // Check if we have a selected variant stored for this product
//     const storedVariant = selectedVariants[product._id];

//     // Choose the best variant
//     let selectedVariant = storedVariant ||
//       product.selectedVariant ||
//       (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

//     // If stored variant doesn't exist or is out of stock, fallback
//     if (storedVariant) {
//       const storedStock = parseInt(storedVariant.stock || 0);
//       if (storedStock <= 0 && availableVariants.length > 0) {
//         selectedVariant = availableVariants[0];
//       }
//     }

//     // Get image with priority
//     let image = "";
//     const getVariantImage = (variant) => {
//       return variant?.images?.[0] || variant?.image;
//     };

//     image = getVariantImage(selectedVariant) ||
//       getVariantImage(availableVariants[0]) ||
//       getVariantImage(defaultVariant) ||
//       product.image ||
//       "";

//     // Get prices safely
//     const displayPrice = parseFloat(
//       selectedVariant.displayPrice ||
//       selectedVariant.discountedPrice ||
//       selectedVariant.price ||
//       product.price ||
//       0
//     );

//     const originalPrice = parseFloat(
//       selectedVariant.originalPrice ||
//       selectedVariant.mrp ||
//       product.mrp ||
//       displayPrice
//     );

//     // Calculate discount percentage if not provided
//     let discountPercent = parseFloat(
//       selectedVariant.discountPercent ||
//       product.discountPercent ||
//       0
//     );

//     if (!discountPercent && originalPrice > displayPrice) {
//       discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//     }

//     // Get variant name
//     const variantName = getVariantName(selectedVariant);
//     const variantType = getVariantType(selectedVariant);
//     const variantDisplayText = getVariantDisplayText(selectedVariant);

//     const stock = parseInt(selectedVariant.stock || product.stock || 0);
//     const status = stock > 0 ? "inStock" : "outOfStock";
//     const sku = selectedVariant.sku || product.sku || "";

//     // Get brand name safely
//     const brandName = getBrandName(product);

//     // Get product slug and identifier
//     const productSlug = getProductSlug(product);
//     const productIdentifier = getProductIdentifier(product);

//     return {
//       ...product,
//       _id: product._id || "",
//       name: product.name || "Unnamed Product",
//       brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
//       slug: productSlug,
//       productIdentifier: productIdentifier,
//       variant: {
//         ...selectedVariant,
//         variantName,
//         variantDisplayText,
//         displayPrice,
//         originalPrice,
//         discountPercent,
//         stock,
//         status,
//         sku,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v),
//       variants: allVariants // For compatibility with handleAddToCart
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug, getProductIdentifier]);

//   // ===================== ADD TO CART FUNCTION ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id] || prod.variant;
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           variants: [
//             {
//               variantSku: getSku(selectedVariant),
//               quantity: 1,
//             },
//           ],
//         };

//         // Cache selected variant (only for products with variants)
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         // Non-variant product
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }

//         payload = {
//           productId: prod._id,
//           quantity: 1,
//         };

//         // Clear cache for non-variant products
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       // Add to cart via backend (works for both logged-in and guest via session)
//       const response = await axios.post(
//         `${CART_API_BASE}/add`,
//         payload,
//         { withCredentials: true }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//       showToastMsg(msg, "error");

//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Handle variant selection
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

//     // Update the products state to reflect the new selected variant
//     setProducts(prevProducts =>
//       prevProducts.map(product => {
//         if (product._id === productId) {
//           const stock = parseInt(variant.stock || 0);
//           const displayPrice = parseFloat(
//             variant.displayPrice ||
//             variant.discountedPrice ||
//             variant.price ||
//             product.price ||
//             0
//           );

//           const originalPrice = parseFloat(
//             variant.originalPrice ||
//             variant.mrp ||
//             product.mrp ||
//             displayPrice
//           );

//           let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
//           if (!discountPercent && originalPrice > displayPrice) {
//             discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//           }

//           const variantName = getVariantName(variant);
//           const variantType = getVariantType(variant);
//           const variantDisplayText = getVariantDisplayText(variant);
//           const hexColor = variant.hex || product.hex || "#000000";

//           return {
//             ...product,
//             variant: {
//               ...variant,
//               variantName,
//               variantDisplayText,
//               displayPrice,
//               originalPrice,
//               discountPercent,
//               stock,
//               status: stock > 0 ? "inStock" : "outOfStock",
//               sku: variant.sku || "",
//               hex: hexColor,
//               variantType,
//               _id: variant._id || ""
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType]);

//   // Toggle show all shades for a product
//   const toggleShowAllShades = (productId) => {
//     setShowAllShades(prev => ({
//       ...prev,
//       [productId]: !prev[productId]
//     }));
//   };

//   // Open variant overlay
//   const openVariantOverlay = (productId, variantType = "all", e) => {
//     if (e) e.stopPropagation();
//     setSelectedVariantType(variantType);
//     setShowVariantOverlay(productId);
//   };

//   // Close variant overlay
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Handle product click - Navigate using slug or ID
//   const handleProductClick = useCallback((product) => {
//     if (!product) return;

//     // Get the product identifier (slug first, then ID)
//     const productIdentifier = product.productIdentifier || product.slug || product._id;

//     if (productIdentifier) {
//       // Store product data in sessionStorage for the product details page
//       // This ensures data is available even after refresh
//       const productDataForStorage = {
//         id: product._id,
//         slug: product.slug,
//         name: product.name,
//         brand: product.brandName,
//         image: product.image,
//         variant: product.variant,
//         price: product.variant?.displayPrice,
//         originalPrice: product.variant?.originalPrice,
//         discountPercent: product.variant?.discountPercent,
//         avgRating: product.avgRating,
//         totalRatings: product.totalRatings,
//         timestamp: Date.now()
//       };

//       // Store in sessionStorage (cleared when browser closes)
//       sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

//       // Also store in localStorage as backup with expiration
//       const localStorageData = {
//         ...productDataForStorage,
//         expires: Date.now() + (60 * 60 * 1000) // 1 hour expiration
//       };
//       localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

//       // Navigate to product page
//       navigate(`/product/${productIdentifier}`);
//     }
//   }, [navigate]);

//   // Open product in new tab
//   const handleOpenInNewTab = useCallback((product, e) => {
//     e.stopPropagation();
//     if (!product) return;

//     const productIdentifier = product.productIdentifier || product.slug || product._id;
//     if (productIdentifier) {
//       // Store product data
//       const productDataForStorage = {
//         id: product._id,
//         slug: product.slug,
//         name: product.name,
//         brand: product.brandName,
//         image: product.image,
//         variant: product.variant,
//         price: product.variant?.displayPrice,
//         originalPrice: product.variant?.originalPrice,
//         discountPercent: product.variant?.discountPercent,
//         avgRating: product.avgRating,
//         totalRatings: product.totalRatings,
//         timestamp: Date.now()
//       };

//       sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

//       const localStorageData = {
//         ...productDataForStorage,
//         expires: Date.now() + (60 * 60 * 1000)
//       };
//       localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

//       // Open in new tab
//       window.open(`/product/${productIdentifier}`, '_blank');
//     }
//   }, []);

//   // Remove duplicates by product ID
//   const removeDuplicates = useCallback((productsArray) => {
//     const seen = new Map();
//     return productsArray.filter(product => {
//       if (!product?._id) return false;
//       const productId = product._id;
//       if (seen.has(productId)) {
//         const existing = seen.get(productId);
//         const existingDiscount = existing.variant?.discountPercent || 0;
//         const currentDiscount = product.variant?.discountPercent || 0;
//         if (currentDiscount > existingDiscount) {
//           seen.set(productId, product);
//         }
//         return false;
//       }
//       seen.set(productId, product);
//       return true;
//     });
//   }, []);

//   // Sort products by criteria
//   const sortProducts = useCallback((productsArray) => {
//     return [...productsArray].filter(Boolean).sort((a, b) => {
//       if (a.variant?.status === "inStock" && b.variant?.status !== "inStock") return -1;
//       if (a.variant?.status !== "inStock" && b.variant?.status === "inStock") return 1;
//       const discountA = a.variant?.discountPercent || 0;
//       const discountB = b.variant?.discountPercent || 0;
//       if (discountB !== discountA) return discountB - discountA;
//       return 0;
//     });
//   }, []);

//   // Transform backend data - merge all sections
//   const transformProducts = useCallback((sectionsData) => {
//     let allProducts = [];
//     if (sectionsData?.success && Array.isArray(sectionsData.sections)) {
//       sectionsData.sections.forEach((section, sectionIndex) => {
//         if (Array.isArray(section.products)) {
//           const productsWithSection = section.products.map((product, productIndex) => {
//             const displayData = getProductDisplayData(product);
//             if (!displayData) return null;
//             return {
//               ...displayData,
//               sectionTitle: typeof section.title === 'string' ? section.title :
//                 (section.name || "Featured"),
//               uniqueId: `${sectionIndex}-${productIndex}-${product._id || "noid"}`,
//               sectionIndex,
//               productIndex
//             };
//           }).filter(Boolean);
//           allProducts = [...allProducts, ...productsWithSection];
//         }
//       });
//     } else if (Array.isArray(sectionsData?.products)) {
//       sectionsData.products.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: sectionsData?.type === "personalized" ?
//               "Recommended For You" :
//               (sectionsData?.title || "Top Picks"),
//             uniqueId: `${sectionsData?.type || "default"}-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     } else if (Array.isArray(sectionsData)) {
//       sectionsData.forEach((product, index) => {
//         const displayData = getProductDisplayData(product);
//         if (displayData) {
//           allProducts.push({
//             ...displayData,
//             sectionTitle: "Recommended",
//             uniqueId: `default-${index}-${product?._id || "noid"}`,
//             sectionIndex: 0,
//             productIndex: index
//           });
//         }
//       });
//     }
//     return allProducts.filter(Boolean);
//   }, [getProductDisplayData]);

//   // Optimized variant analysis for each product
//   const getVariantAnalysis = useCallback((product) => {
//     if (!product) return { hasVariants: false, availableVariants: [] };
//     const allVariants = product.allVariants || [];
//     const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);

//     // Analyze variant types
//     const variantTypes = allVariants.map(v => getVariantType(v));
//     const hasColorVariants = variantTypes.includes('color');
//     const hasShadeVariants = variantTypes.includes('shade');
//     const hasSizeVariants = variantTypes.includes('size');

//     return {
//       hasVariants: allVariants.length > 0,
//       availableVariants,
//       totalVariants: allVariants.length,
//       hasMultipleVariants: allVariants.length > 1,
//       hasOnlyOneVariant: allVariants.length === 1,
//       hasColorVariants,
//       hasShadeVariants,
//       hasSizeVariants,
//       variantTypes,
//       currentVariant: product.variant
//     };
//   }, [getVariantType]);

//   // Initialize products
//   useEffect(() => {
//     if (initialProducts && initialProducts.length > 0) {
//       let data = transformProducts(initialProducts);
//       data = removeDuplicates(data);
//       data = sortProducts(data);
//       setProducts(data);
//       setLoading(false);
//     } else {
//       setProducts([]);
//       setLoading(false);
//     }
//   }, [initialProducts, transformProducts, removeDuplicates, sortProducts]);

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   return (
//     <div className="container-fluid position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="fs-3 text-start foryou-heading mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
//         {title}
//       </h2>

//       {/* 🆕 LOTTIE LOADER – replaces old spinner-border */}
//       {loading && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
//           style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.97)',
//             zIndex: 9999,
//             backdropFilter: 'blur(10px)',
//           }}
//         >
//           <div className="text-center">
//             <DotLottieReact
//               className="mb-4"
//               src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//               loop
//               autoplay
//               style={{ width: '200px', height: '200px' }}
//             />
//             <p className="text-muted mb-0 page-title-main-name">
//               Loading recommendations...
//             </p>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//         </div>
//       )}

//       {memoizedProducts.length > 0 ? (
//         <div className="position-relative">
//           <Swiper
//             modules={[Autoplay, Pagination, Navigation]}
//             pagination={{ clickable: true, dynamicBullets: true }}
//             navigation={{
//               nextEl: '.swiper-button-next',
//               prevEl: '.swiper-button-prev',
//             }}
//             breakpoints={{
//               300: { slidesPerView: 2, spaceBetween: 10 },
//               576: { slidesPerView: 2.5, spaceBetween: 15 },
//               768: { slidesPerView: 3, spaceBetween: 15 },
//               992: { slidesPerView: 4, spaceBetween: 20 },
//               1200: { slidesPerView: 4, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {memoizedProducts.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const variantAnalysis = getVariantAnalysis(item);

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = variantAnalysis.hasVariants;
//               const variantsToShow = item.allVariants || [];

//               // Check wishlist status for current variant
//               const selectedSku = getSku(variant);
//               const isProductInWishlist = isInWishlist(item._id, selectedSku);

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(variantsToShow);
//               const totalVariants = variantsToShow.length;

//               // Check if a variant is selected for this product
//               const isVariantSelected = !!selectedVariants[item._id];

//               // Button state logic - UPDATED: Show "Select Variant" first if variants exist but none selected
//               const isAdding = addingToCart[item._id];
//               const outOfStock = hasVariants
//                 ? (variant?.stock <= 0)
//                 : (item.stock <= 0);

//               // UPDATED LOGIC: If product has variants and no variant is selected, show "Select Variant" button
//               const showSelectVariantButton = hasVariants && !isVariantSelected;

//               const buttonDisabled = isAdding || outOfStock;
//               const buttonText = isAdding
//                 ? "Adding..."
//                 : showSelectVariantButton
//                   ? "Select Variant"
//                   : outOfStock
//                     ? "Out of Stock"
//                     : "Add to Bag";

//               return (
//                 <SwiperSlide key={item.uniqueId}>
//                   <div className="foryou-card-wrapper">
//                     <div className="foryou-card">
//                       {/* Product Image with Overlays */}
//                       <div
//                         className="foryou-img-wrapper"
//                         onClick={() => handleProductClick(item)}
//                         style={{ cursor: 'pointer', position: 'relative' }}
//                       >
//                         <img
//                           src={imageUrl}
//                           alt={item.name || "Product"}
//                           className="foryou-img img-fluid"
//                           loading="lazy"
//                           onError={(e) => {
//                             e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                           }}
//                         />

//                         {/* Open in New Tab Button */}
//                         <button
//                           onClick={(e) => handleOpenInNewTab(item, e)}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             left: '10px',
//                             cursor: 'pointer',
//                             color: '#000000',
//                             fontSize: '16px',
//                             zIndex: 2,
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             borderRadius: '50%',
//                             width: '34px',
//                             height: '34px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'all 0.3s ease',
//                             border: 'none',
//                             outline: 'none'
//                           }}
//                           title="Open in new tab"
//                         >
//                           <FaExternalLinkAlt />
//                         </button>

//                         {/* Wishlist Icon */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (variant) {
//                               toggleWishlist(item, variant);
//                             }
//                           }}
//                           disabled={wishlistLoading[item._id]}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '10px',
//                             cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
//                             color: isProductInWishlist ? '#dc3545' : '#000000',
//                             fontSize: '22px',
//                             zIndex: 2,
//                             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                             borderRadius: '50%',
//                             width: '34px',
//                             height: '34px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                             transition: 'all 0.3s ease',
//                             border: 'none',
//                             outline: 'none'
//                           }}
//                           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                         >
//                           {wishlistLoading[item._id] ? (
//                             <div className="spinner-border spinner-border-sm" role="status"></div>
//                           ) : isProductInWishlist ? (
//                             <FaHeart />
//                           ) : (
//                             <FaRegHeart />
//                           )}
//                         </button>

//                         {/* Promo Badge */}
//                         {variant.promoApplied && (
//                           <div className="promo-badge">
//                             <i className="bi bi-tag-fill me-1"></i>
//                             Promo
//                           </div>
//                         )}
//                       </div>

//                       {/* Product Info */}
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>

//                           {/* Brand Name */}
//                           <div className="brand-name small text-muted mb-1 mt-2 text-start">
//                             {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
//                           </div>

//                           {/* Product Name */}
//                           <h6
//                             className="foryou-name font-family-Poppins m-0 p-0"
//                             onClick={() => handleProductClick(item)}
//                             style={{ cursor: 'pointer' }}
//                           >
//                             {item.name || "Unnamed Product"}
//                           </h6>

//                           {/* Minimal Variant Display Instead of Variant Bubbles */}
//                           {hasVariants && (
//                             <div className="">
//                               {isVariantSelected ? (
//                                 <div
//                                   className="selected-variant-display text-muted small"
//                                   style={{ cursor: 'pointer', display: 'inline-block' }}
//                                   onClick={(e) => openVariantOverlay(item._id, "all", e)}
//                                   title="Click to change variant"
//                                 >
//                                   Variant: <span className="fw-bold text-dark">{getVariantDisplayText(variant)}</span>
//                                   <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                                 </div>
//                               ) : (
//                                 <div className="small text-muted" style={{ height: '20px' }}>
//                                   {variantsToShow.length} Variants Available
//                                 </div>
//                               )}
//                             </div>
//                           )}

//                           {/* Price Section */}
//                           <div className="price-section mb-3">
//                             <div className="d-flex align-items-baseline flex-wrap">
//                               <span className="current-price fw-400 fs-5">
//                                 {formatPrice(variant.displayPrice)}
//                               </span>
//                               {variant.originalPrice > variant.displayPrice && (
//                                 <>
//                                   <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                     {formatPrice(variant.originalPrice)}
//                                   </span>
//                                   <span className="discount-percent text-danger fw-bold ms-2">
//                                     ({variant.discountPercent || 0}% OFF)
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </div>

//                           {/* Add to Cart Button - UPDATED: Show Select Variant first, then Add to Bag */}
//                           <div className="cart-section">
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 className={`btn w-100 addtocartbuttton page-title-main-name d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"
//                                   }`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   // UPDATED: If showing "Select Variant", open overlay instead of adding to cart
//                                   if (showSelectVariantButton) {
//                                     openVariantOverlay(item._id, "all", e);
//                                   } else {
//                                     handleAddToCart(item);
//                                   }
//                                 }}
//                                 disabled={buttonDisabled}
//                                 style={{
//                                   transition: "background-color 0.3s ease, color 0.3s ease",
//                                 }}
//                               >
//                                 {isAdding ? (
//                                   <>
//                                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                     Adding...
//                                   </>
//                                 ) : (
//                                   <>
//                                     {buttonText}
//                                     {/* Only show bag icon when NOT showing "Select Variant" */}
//                                     {!buttonDisabled && !isAdding && !showSelectVariantButton && (
//                                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                                     )}
//                                   </>
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Variant Overlay */}
//                     {showVariantOverlay === item._id && (
//                       <div className="variant-overlay" onClick={closeVariantOverlay}>
//                         <div
//                           className="variant-overlay-content"
//                           onClick={(e) => e.stopPropagation()}
//                           style={{
//                             width: '100%',
//                             maxWidth: '500px',
//                             maxHeight: '100vh',
//                             background: '#fff',
//                             borderRadius: '0px',
//                             overflow: 'hidden',
//                             display: 'flex',
//                             flexDirection: 'column'
//                           }}
//                         >
//                           <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom ">
//                             <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                             <button
//                               onClick={closeVariantOverlay}
//                               style={{
//                                 background: 'none',
//                                 border: 'none',
//                                 fontSize: '24px',
//                               }}
//                             >
//                               ×
//                             </button>
//                           </div>

//                           {/* Tabs */}
//                           <div className="variant-tabs d-flex">
//                             <button
//                               className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                               onClick={() => setSelectedVariantType("all")}
//                             >
//                               All ({totalVariants})
//                             </button>
//                             {groupedVariants.color.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("color")}
//                               >
//                                 Colors ({groupedVariants.color.length})
//                               </button>
//                             )}
//                             {groupedVariants.text.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("text")}
//                               >
//                                 Sizes ({groupedVariants.text.length})
//                               </button>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="p-3 overflow-auto flex-grow-1">
//                             {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                               <div className="row row-col-4 g-3">
//                                 {groupedVariants.color.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-4 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div className="page-title-main-name"
//                                           style={{
//                                             width: "28px",
//                                             height: "28px",
//                                             borderRadius: "20%",
//                                             backgroundColor: v.hex || "#ccc",
//                                             margin: "0 auto 8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                             position: "relative",
//                                           }}
//                                         >
//                                           {isSelected && (
//                                             <span
//                                               style={{
//                                                 position: "absolute",
//                                                 top: "50%",
//                                                 left: "50%",
//                                                 transform: "translate(-50%, -50%)",
//                                                 color: "#fff",
//                                                 fontWeight: "bold",
//                                               }}
//                                             >
//                                               ✓
//                                             </span>
//                                           )}
//                                         </div>
//                                         <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}

//                             {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
//                               <div className="row row-cols-3 g-0">
//                                 {groupedVariants.text.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
//                                       <div
//                                         className="text-center"
//                                         style={{
//                                           cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         }}
//                                         onClick={() =>
//                                           !isOutOfStock &&
//                                           (handleVariantSelect(item._id, v),
//                                             closeVariantOverlay())
//                                         }
//                                       >
//                                         <div
//                                           style={{
//                                             padding: "10px",
//                                             borderRadius: "8px",
//                                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                             background: isSelected ? "#f8f9fa" : "#fff",
//                                             minHeight: "50px",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             opacity: isOutOfStock ? 0.5 : 1,
//                                           }}
//                                         >
//                                           {getVariantDisplayText(v)}
//                                         </div>
//                                         {isOutOfStock && (
//                                           <div className="text-danger small mt-1">
//                                             Out of Stock
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </div>
//       ) : !loading && !error && (
//         <div className="text-center py-5">
//           <i className="bi bi-box-seam display-4 text-muted"></i>
//           <p className="text-muted mt-3">No products available at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendationSlider;



























// src/components/RecommendationSlider.jsx
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { UserContext } from "./UserContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";
import tick from "../assets/tick.svg";
import bagIcon from "../assets/bag.svg";

// 🆕 Import DotLottie loader (same package as ProductPage)
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Wishlist cache key
const WISHLIST_CACHE_KEY = "guestWishlist";
const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// Helper functions
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const normalized = hex.trim().toLowerCase();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
};

const getVariantDisplayText = (variant) => {
  return (
    variant.shadeName ||
    variant.name ||
    variant.size ||
    variant.ml ||
    variant.weight ||
    "Default"
  ).toUpperCase();
};

const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [], default: [] };
  variants.forEach((v) => {
    if (!v) return;
    if (v.hex && isValidHexColor(v.hex)) {
      grouped.color.push(v);
    } else {
      grouped.text.push(v);
    }
  });
  return grouped;
};

const RecommendationSlider = ({ title, products: initialProducts }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});

  // ===================== WISHLIST STATES =====================
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  // ===================== END WISHLIST STATES =====================

  const [showAllShades, setShowAllShades] = useState({});
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("color");

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // Helper to get product slug safely
  const getProductSlug = useCallback((product) => {
    if (!product) return null;
    if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
      return product.slugs[0];
    }
    if (product.slug) {
      return product.slug;
    }
    const productName = product.name || "product";
    const productId = product._id || "";
    const nameSlug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${nameSlug}-${productId.substring(0, 8)}`;
  }, []);

  // Get product identifier for URL
  const getProductIdentifier = useCallback((product) => {
    if (!product) return null;
    const slug = getProductSlug(product);
    if (slug) return slug;
    return product._id;
  }, [getProductSlug]);

  // Safely get brand name from brand object or ID
  const getBrandName = useCallback((product) => {
    if (!product?.brand) return "Unknown Brand";
    if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
    if (typeof product.brand === "string") return product.brand;
    return "Unknown Brand";
  }, []);

  // Helper to get variant name safely
  const getVariantName = useCallback((variant) => {
    if (!variant) return "Default";
    const nameSources = [
      variant.shadeName,
      variant.name,
      variant.variantName,
      variant.size,
      variant.ml,
      variant.weight
    ];
    for (const source of nameSources) {
      if (source && typeof source === 'string') {
        return source;
      }
    }
    return "Default";
  }, []);

  // Toast Utility
  const showToastMsg = (message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "error") {
      toast.error(message, { autoClose: duration });
    } else {
      toast.info(message, { autoClose: duration });
    }
  };

  // ===================== WISHLIST FUNCTIONS =====================
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item =>
      (item.productId === productId || item._id === productId) &&
      item.sku === sku
    );
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axios.get(
          "https://beauty.joyory.com/api/user/wishlist",
          { withCredentials: true }
        );
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        const formattedWishlist = localWishlist.map(item => ({
          productId: item._id,
          _id: item._id,
          sku: item.sku,
          name: item.name,
          variant: item.variantName,
          image: item.image,
          displayPrice: item.displayPrice,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          status: item.status,
          avgRating: item.avgRating,
          totalRatings: item.totalRatings
        }));
        setWishlistData(formattedWishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWishlistData([]);
    }
  };

  const toggleWishlist = async (prod, variant) => {
    if (!prod || !variant) {
      showToastMsg("Please select a variant first", "error");
      return;
    }

    const productId = prod._id;
    const sku = getSku(variant);

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axios.delete(
            `https://beauty.joyory.com/api/user/wishlist/${productId}`,
            {
              withCredentials: true,
              data: { sku: sku }
            }
          );
          showToastMsg("Removed from wishlist!", "success");
        } else {
          await axios.post(
            `https://beauty.joyory.com/api/user/wishlist/${productId}`,
            { sku: sku },
            { withCredentials: true }
          );
          showToastMsg("Added to wishlist!", "success");
        }

        await fetchWishlistData();
      } else {
        const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

        if (currentlyInWishlist) {
          const updatedWishlist = guestWishlist.filter(item =>
            !(item._id === productId && item.sku === sku)
          );
          localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
          showToastMsg("Removed from wishlist!", "success");
        } else {
          const productData = {
            _id: productId,
            name: prod.name,
            brand: getBrandName(prod),
            price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
            displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
            images: variant.images || prod.images || ["/placeholder.png"],
            image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
            slug: getProductSlug(prod),
            sku: sku,
            variantSku: sku,
            variantId: sku,
            variantName: variant.shadeName || variant.name || "Default",
            shadeName: variant.shadeName || variant.name || "Default",
            variant: variant.shadeName || variant.name || "Default",
            hex: variant.hex || "#cccccc",
            stock: variant.stock || 0,
            status: variant.stock > 0 ? "inStock" : "outOfStock",
            avgRating: prod.avgRating || 0,
            totalRatings: prod.totalRatings || 0,
            commentsCount: prod.totalRatings || 0,
            discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
              ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
              : 0
          };

          guestWishlist.push(productData);
          localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
          showToastMsg("Added to wishlist!", "success");
        }

        await fetchWishlistData();
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        showToastMsg("Please login to use wishlist", "error");
        navigate("/login");
      } else {
        showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
      }
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const getVariantType = useCallback((variant) => {
    if (!variant) return 'default';
    if (variant.hex && isValidHexColor(variant.hex)) return 'color';
    if (variant.shadeName) return 'shade';
    if (variant.size) return 'size';
    if (variant.ml) return 'ml';
    if (variant.weight) return 'weight';
    return 'default';
  }, []);

  const getProductDisplayData = useCallback((product) => {
    if (!product) return null;

    const allVariants = Array.isArray(product.variants) ? product.variants :
      Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

    const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
    const defaultVariant = allVariants[0] || {};

    const storedVariant = tempSelectedVariants[product._id] || selectedVariants[product._id];

    let selectedVariant = storedVariant ||
      product.selectedVariant ||
      (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

    if (storedVariant) {
      const storedStock = parseInt(storedVariant.stock || 0);
      if (storedStock <= 0 && availableVariants.length > 0) {
        selectedVariant = availableVariants[0];
      }
    }

    let image = "";
    const getVariantImage = (variant) => {
      return variant?.images?.[0] || variant?.image;
    };

    image = getVariantImage(selectedVariant) ||
      getVariantImage(availableVariants[0]) ||
      getVariantImage(defaultVariant) ||
      product.image ||
      "";

    const displayPrice = parseFloat(
      selectedVariant.displayPrice ||
      selectedVariant.discountedPrice ||
      selectedVariant.price ||
      product.price ||
      0
    );

    const originalPrice = parseFloat(
      selectedVariant.originalPrice ||
      selectedVariant.mrp ||
      product.mrp ||
      displayPrice
    );

    let discountPercent = parseFloat(
      selectedVariant.discountPercent ||
      product.discountPercent ||
      0
    );

    if (!discountPercent && originalPrice > displayPrice) {
      discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    }

    const variantName = getVariantName(selectedVariant);
    const variantType = getVariantType(selectedVariant);
    const variantDisplayText = getVariantDisplayText(selectedVariant);

    const stock = parseInt(selectedVariant.stock || product.stock || 0);
    const status = stock > 0 ? "inStock" : "outOfStock";
    const sku = selectedVariant.sku || product.sku || "";

    const brandName = getBrandName(product);

    const productSlug = getProductSlug(product);
    const productIdentifier = getProductIdentifier(product);

    return {
      ...product,
      _id: product._id || "",
      name: product.name || "Unnamed Product",
      brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
      slug: productSlug,
      productIdentifier: productIdentifier,
      variant: {
        ...selectedVariant,
        variantName,
        variantDisplayText,
        displayPrice,
        originalPrice,
        discountPercent,
        stock,
        status,
        sku,
        variantType,
        _id: selectedVariant._id || ""
      },
      image,
      brandId: product.brand,
      avgRating: parseFloat(product.avgRating || 0),
      totalRatings: parseInt(product.totalRatings || 0),
      allVariants: [...allVariants].filter(v => v),
      variants: allVariants
    };
  }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug, getProductIdentifier]);

  const handleAddToCart = async (prod, forceVariant = null) => {
    setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVariants = variants.length > 0;
      let payload;

      if (hasVariants) {
        const selectedVariant = forceVariant || selectedVariants[prod._id] || prod.variant;
        if (!selectedVariant || selectedVariant.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }

        payload = {
          productId: prod._id,
          variants: [
            {
              variantSku: getSku(selectedVariant),
              quantity: 1,
            },
          ],
        };

        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = selectedVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }

        payload = {
          productId: prod._id,
          quantity: 1,
        };

        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[prod._id];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      const response = await axios.post(
        `${CART_API_BASE}/add`,
        payload,
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add to cart");
      }

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (err) {
      console.error("Add to Cart error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
      showToastMsg(msg, "error");

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
    }
  };

  const handleVariantSelect = useCallback((productId, variant) => {
    if (!productId || !variant) return;

    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));

    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product._id === productId) {
          const stock = parseInt(variant.stock || 0);
          const displayPrice = parseFloat(
            variant.displayPrice ||
            variant.discountedPrice ||
            variant.price ||
            product.price ||
            0
          );

          const originalPrice = parseFloat(
            variant.originalPrice ||
            variant.mrp ||
            product.mrp ||
            displayPrice
          );

          let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
          if (!discountPercent && originalPrice > displayPrice) {
            discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
          }

          const variantName = getVariantName(variant);
          const variantType = getVariantType(variant);
          const variantDisplayText = getVariantDisplayText(variant);
          const hexColor = variant.hex || product.hex || "#000000";

          return {
            ...product,
            variant: {
              ...variant,
              variantName,
              variantDisplayText,
              displayPrice,
              originalPrice,
              discountPercent,
              stock,
              status: stock > 0 ? "inStock" : "outOfStock",
              sku: variant.sku || "",
              hex: hexColor,
              variantType,
              _id: variant._id || ""
            },
            image: variant.images?.[0] || variant.image || product.image
          };
        }
        return product;
      })
    );
  }, [getVariantName, getVariantType]);

  const toggleShowAllShades = (productId) => {
    setShowAllShades(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const openVariantOverlay = (productId, variantType = "all", e) => {
    if (e) e.stopPropagation();
    setSelectedVariantType(variantType);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };

  // 🔥🔥🔥 KEY CHANGE: Use window.location.href for full page refresh 🔥🔥🔥
  const handleProductClick = useCallback((product) => {
    if (!product) return;

    const productIdentifier = product.productIdentifier || product.slug || product._id;

    if (productIdentifier) {
      // Store product data in sessionStorage for the product details page
      const productDataForStorage = {
        id: product._id,
        slug: product.slug,
        name: product.name,
        brand: product.brandName,
        image: product.image,
        variant: product.variant,
        price: product.variant?.displayPrice,
        originalPrice: product.variant?.originalPrice,
        discountPercent: product.variant?.discountPercent,
        avgRating: product.avgRating,
        totalRatings: product.totalRatings,
        timestamp: Date.now()
      };

      sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

      const localStorageData = {
        ...productDataForStorage,
        expires: Date.now() + (60 * 60 * 1000)
      };
      localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

      // 🔥 FORCE FULL PAGE RELOAD instead of client-side navigation
      window.location.href = `/product/${productIdentifier}`;
    }
  }, []);

  // 🔥🔥🔥 KEY CHANGE: Open in new tab also uses full URL 🔥🔥🔥
  const handleOpenInNewTab = useCallback((product, e) => {
    e.stopPropagation();
    if (!product) return;

    const productIdentifier = product.productIdentifier || product.slug || product._id;
    if (productIdentifier) {
      const productDataForStorage = {
        id: product._id,
        slug: product.slug,
        name: product.name,
        brand: product.brandName,
        image: product.image,
        variant: product.variant,
        price: product.variant?.displayPrice,
        originalPrice: product.variant?.originalPrice,
        discountPercent: product.variant?.discountPercent,
        avgRating: product.avgRating,
        totalRatings: product.totalRatings,
        timestamp: Date.now()
      };

      sessionStorage.setItem('recommendedProduct', JSON.stringify(productDataForStorage));

      const localStorageData = {
        ...productDataForStorage,
        expires: Date.now() + (60 * 60 * 1000)
      };
      localStorage.setItem(`product_${productIdentifier}`, JSON.stringify(localStorageData));

      // Open in new tab with full URL
      window.open(`/product/${productIdentifier}`, '_blank');
    }
  }, []);

  const removeDuplicates = useCallback((productsArray) => {
    const seen = new Map();
    return productsArray.filter(product => {
      if (!product?._id) return false;
      const productId = product._id;
      if (seen.has(productId)) {
        const existing = seen.get(productId);
        const existingDiscount = existing.variant?.discountPercent || 0;
        const currentDiscount = product.variant?.discountPercent || 0;
        if (currentDiscount > existingDiscount) {
          seen.set(productId, product);
        }
        return false;
      }
      seen.set(productId, product);
      return true;
    });
  }, []);

  const sortProducts = useCallback((productsArray) => {
    return [...productsArray].filter(Boolean).sort((a, b) => {
      if (a.variant?.status === "inStock" && b.variant?.status !== "inStock") return -1;
      if (a.variant?.status !== "inStock" && b.variant?.status === "inStock") return 1;
      const discountA = a.variant?.discountPercent || 0;
      const discountB = b.variant?.discountPercent || 0;
      if (discountB !== discountA) return discountB - discountA;
      return 0;
    });
  }, []);

  const transformProducts = useCallback((sectionsData) => {
    let allProducts = [];
    if (sectionsData?.success && Array.isArray(sectionsData.sections)) {
      sectionsData.sections.forEach((section, sectionIndex) => {
        if (Array.isArray(section.products)) {
          const productsWithSection = section.products.map((product, productIndex) => {
            const displayData = getProductDisplayData(product);
            if (!displayData) return null;
            return {
              ...displayData,
              sectionTitle: typeof section.title === 'string' ? section.title :
                (section.name || "Featured"),
              uniqueId: `${sectionIndex}-${productIndex}-${product._id || "noid"}`,
              sectionIndex,
              productIndex
            };
          }).filter(Boolean);
          allProducts = [...allProducts, ...productsWithSection];
        }
      });
    } else if (Array.isArray(sectionsData?.products)) {
      sectionsData.products.forEach((product, index) => {
        const displayData = getProductDisplayData(product);
        if (displayData) {
          allProducts.push({
            ...displayData,
            sectionTitle: sectionsData?.type === "personalized" ?
              "Recommended For You" :
              (sectionsData?.title || "Top Picks"),
            uniqueId: `${sectionsData?.type || "default"}-${index}-${product?._id || "noid"}`,
            sectionIndex: 0,
            productIndex: index
          });
        }
      });
    } else if (Array.isArray(sectionsData)) {
      sectionsData.forEach((product, index) => {
        const displayData = getProductDisplayData(product);
        if (displayData) {
          allProducts.push({
            ...displayData,
            sectionTitle: "Recommended",
            uniqueId: `default-${index}-${product?._id || "noid"}`,
            sectionIndex: 0,
            productIndex: index
          });
        }
      });
    }
    return allProducts.filter(Boolean);
  }, [getProductDisplayData]);

  const getVariantAnalysis = useCallback((product) => {
    if (!product) return { hasVariants: false, availableVariants: [] };
    const allVariants = product.allVariants || [];
    const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);

    const variantTypes = allVariants.map(v => getVariantType(v));
    const hasColorVariants = variantTypes.includes('color');
    const hasShadeVariants = variantTypes.includes('shade');
    const hasSizeVariants = variantTypes.includes('size');

    return {
      hasVariants: allVariants.length > 0,
      availableVariants,
      totalVariants: allVariants.length,
      hasMultipleVariants: allVariants.length > 1,
      hasOnlyOneVariant: allVariants.length === 1,
      hasColorVariants,
      hasShadeVariants,
      hasSizeVariants,
      variantTypes,
      currentVariant: product.variant
    };
  }, [getVariantType]);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      let data = transformProducts(initialProducts);
      data = removeDuplicates(data);
      data = sortProducts(data);
      setProducts(data);
      setLoading(false);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [initialProducts, transformProducts, removeDuplicates, sortProducts]);

  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="container-fluid position-relative">

      <h2 className="fs-3 text-start foryou-heading mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
        {title}
      </h2>

      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            zIndex: 9999,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="text-center">
            <DotLottieReact
              className="mb-4"
              src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className="text-muted mb-0 page-title-main-name">
              Loading recommendations...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {memoizedProducts.length > 0 ? (
        <div className="position-relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              300: { slidesPerView: 2, spaceBetween: 10 },
              576: { slidesPerView: 2.5, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              992: { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 4, spaceBetween: 25 },
            }}
            className="foryou-swiper"
          >
            {memoizedProducts.map((item) => {
              if (!item) return null;

              const variant = item.variant || {};
              const variantAnalysis = getVariantAnalysis(item);

              let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
              if (item.image) {
                imageUrl = item.image.startsWith("http")
                  ? item.image
                  : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
              }

              const hasVariants = variantAnalysis.hasVariants;
              const variantsToShow = item.allVariants || [];

              const selectedSku = getSku(variant);
              const isProductInWishlist = isInWishlist(item._id, selectedSku);

              const groupedVariants = groupVariantsByType(variantsToShow);
              const totalVariants = variantsToShow.length;

              const isVariantSelected = !!selectedVariants[item._id];

              const isAdding = addingToCart[item._id];
              const outOfStock = hasVariants
                ? (variant?.stock <= 0)
                : (item.stock <= 0);

              const showSelectVariantButton = hasVariants;

              const buttonDisabled = isAdding || outOfStock;
              const buttonText = isAdding
                ? "Adding..."
                : showSelectVariantButton
                  ? "Select Variant"
                  : outOfStock
                    ? "Out of Stock"
                    : "Add to Bag";

              return (
                <SwiperSlide key={item.uniqueId}>
                  <div className="foryou-card-wrapper">
                    <div className="foryou-card">
                      {/* Product Image with Overlays */}
                      <div
                        className="foryou-img-wrapper"
                        onClick={() => handleProductClick(item)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                      >
                        <img
                          src={imageUrl}
                          alt={item.name || "Product"}
                          className="foryou-img img-fluid"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
                          }}
                        />

                        {/* Open in New Tab Button */}
                        <button
                          onClick={(e) => handleOpenInNewTab(item, e)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            cursor: 'pointer',
                            color: '#000000',
                            fontSize: '16px',
                            zIndex: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            outline: 'none'
                          }}
                          title="Open in new tab"
                        >
                          <FaExternalLinkAlt />
                        </button>

                        {/* Wishlist Icon */}
                        <button className="bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (variant) {
                              toggleWishlist(item, variant);
                            }
                          }}
                          disabled={wishlistLoading[item._id]}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
                            color: isProductInWishlist ? '#dc3545' : '#ccc',
                            fontSize: '22px',
                            zIndex: 2,
                            // backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            outline: 'none'
                          }}
                          title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          {wishlistLoading[item._id] ? (
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                          ) : isProductInWishlist ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>

                        {/* Promo Badge */}
                        {/* {variant.promoApplied && (
                          <div className="promo-badge">
                            <i className="bi bi-tag-fill me-1"></i>
                            Promo
                          </div>
                        )} */}
                      </div>

                      {/* Product Info */}
                      <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
                        <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>

                          {/* Brand Name */}
                          <div className="brand-name small text-muted mb-1 mt-2 text-start">
                            {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
                          </div>

                          {/* Product Name */}
                          <h6
                            className="foryou-name font-family-Poppins m-0 p-0"
                            onClick={() => handleProductClick(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            {item.name || "Unnamed Product"}
                          </h6>

                          {/* Minimal Variant Display Instead of Variant Bubbles */}
                          {hasVariants && (
                            <div className="">
                              {isVariantSelected ? (
                                <div
                                  className="selected-variant-display text-muted small"
                                  style={{ cursor: 'pointer', display: 'inline-block' }}
                                  onClick={(e) => openVariantOverlay(item._id, "all", e)}
                                  title="Click to change variant"
                                >
                                  Variant: <span className="fw-bold text-dark">{getVariantDisplayText(variant)}</span>
                                  <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
                                </div>
                              ) : (
                                <div className="small text-muted" style={{ height: '20px' }}>
                                  {variantsToShow.length} Variants Available
                                </div>
                              )}
                            </div>
                          )}

                          {/* Price Section */}
                          <div className="price-section mb-3">
                            <div className="d-flex align-items-baseline flex-wrap">
                              <span className="current-price fw-400 fs-5">
                                {formatPrice(variant.displayPrice)}
                              </span>
                              {variant.originalPrice > variant.displayPrice && (
                                <>
                                  <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                    {formatPrice(variant.originalPrice)}
                                  </span>
                                  <span className="discount-percent text-danger fw-bold ms-2">
                                    ({variant.discountPercent || 0}% OFF)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <div className="cart-section">
                            <div className="d-flex align-items-center justify-content-between">
                              <button
                                className={`btn w-100 addtocartbuttton page-title-main-name d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (showSelectVariantButton) {
                                    openVariantOverlay(item._id, "all", e);
                                  } else {
                                    handleAddToCart(item);
                                  }
                                }}
                                disabled={buttonDisabled}
                                style={{
                                  transition: "background-color 0.3s ease, color 0.3s ease",
                                }}
                              >
                                {isAdding ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    {buttonText}
                                    {!buttonDisabled && !isAdding && !showSelectVariantButton && (
                                      <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                                    )}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Variant Overlay */}
                    {showVariantOverlay === item._id && (
                      <div className="variant-overlay" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}>
                        <div
                          className="variant-overlay-content"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '100%',
                            maxWidth: '500px',
                            maxHeight: '100vh',
                            background: '#fff',
                            borderRadius: '0px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom ">
                            <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
                            <button
                              onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}
                              style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '40px',
                              }}
                            >
                              ×
                            </button>
                          </div>

                          {/* Tabs */}
                          <div className="variant-tabs d-flex">
                            <button
                              className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
                              onClick={() => setSelectedVariantType("all")}
                            >
                              All ({totalVariants})
                            </button>
                            {groupedVariants.color.length > 0 && (
                              <button
                                className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
                                onClick={() => setSelectedVariantType("color")}
                              >
                                Colors ({groupedVariants.color.length})
                              </button>
                            )}
                            {groupedVariants.text.length > 0 && (
                              <button
                                className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
                                onClick={() => setSelectedVariantType("text")}
                              >
                                Sizes ({groupedVariants.text.length})
                              </button>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
                            {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
                              <div className="row row-col-4 g-3">
                                {groupedVariants.color.map((v) => {
                                  const isSelected = variant.sku === v.sku;
                                  const isOutOfStock = (v.stock ?? 0) <= 0;

                                  return (
                                    <div className="col-lg-4 col-5" key={getSku(v) || v._id}>
                                      <div
                                        className="text-center"
                                        style={{
                                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!isOutOfStock) {
                                            handleVariantSelect(item._id, v);
                                            setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
                                          }
                                        }}
                                      >
                                        <div className="page-title-main-name"
                                          style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "20%",
                                            backgroundColor: v.hex || "#ccc",
                                            margin: "0 auto 8px",
                                            border: isSelected ? "3px solid #000" : "1px solid #ddd",
                                            opacity: isOutOfStock ? 0.5 : 1,
                                            position: "relative",
                                          }}
                                        >
                                          {isSelected && (
                                            <span
                                              style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                color: "#fff",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                        <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
                                          {getVariantDisplayText(v)}
                                        </div>
                                        {isOutOfStock && (
                                          <div className="text-danger small">
                                            Out of Stock
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
                              <div className="row row-cols-3 g-0">
                                {groupedVariants.text.map((v) => {
                                  const isSelected = variant.sku === v.sku;
                                  const isOutOfStock = (v.stock ?? 0) <= 0;

                                  return (
                                    <div className="col-lg-3 col-5" key={getSku(v) || v._id}>
                                      <div
                                        className="text-center"
                                        style={{
                                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!isOutOfStock) {
                                            handleVariantSelect(item._id, v);
                                            setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
                                          }
                                        }}
                                      >
                                        <div
                                          style={{
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: isSelected ? "3px solid #000" : "1px solid #ddd",
                                            background: isSelected ? "#f8f9fa" : "#fff",
                                            minHeight: "50px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            opacity: isOutOfStock ? 0.5 : 1,
                                          }}
                                        >
                                          {getVariantDisplayText(v)}
                                        </div>
                                        {isOutOfStock && (
                                          <div className="text-danger small mt-1">
                                            Out of Stock
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="variant-overlay-footer p-3 border-top">
                            <div className="small text-muted fw-semibold">
                              Selected: <span className="text-dark fw-bold">{getVariantDisplayText(variant)}</span>
                            </div>
                            <div className="mt-1 mb-2 text-start">
                              <span 
                                onClick={(e) => { e.stopPropagation(); handleProductClick(item); }} 
                                className="text-decoration-none fw-semibold" 
                                style={{ cursor: 'pointer', fontSize: '12px' }}
                              >
                                View Details
                              </span>
                            </div>
                            <button
                              className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
                              onClick={async (e) => {
                                e.stopPropagation();
                                const chosen = tempSelectedVariants[item._id] || selectedVariants[item._id] || (variantsToShow.find((v) => v.stock > 0) || variantsToShow[0]);
                                if (chosen) {
                                  handleVariantSelect(item._id, chosen);
                                }
                                await handleAddToCart(item, chosen);
                                closeVariantOverlay();
                              }}
                              disabled={isAdding || (variant && variant.stock <= 0)}
                              style={{
                                transition: "background-color 0.3s ease, color 0.3s ease",
                              }}
                            >
                              {isAdding ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                                  Adding...
                                </>
                              ) : variant?.stock <= 0 ? (
                                "Out of Stock"
                              ) : (
                                <>
                                  Add to Bag
                                  {!isAdding && variant?.stock > 0 && (
                                    <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                                  )}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : !loading && !error && (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-4 text-muted"></i>
          <p className="text-muted mt-3">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationSlider;




//===============================================================================Done-Code(End)=======================================================================









