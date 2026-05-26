// // src/components/BestSellers.jsx
// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "../css/BestSellers.css";

// const API = "https://beauty.joyory.com/api/user/products/top-sellers";

// // make sure image URL is absolute (handles cases where backend sends a relative path)
// const toAbsolute = (url) => {
//   if (!url) return "";
//   return /^https?:\/\//i.test(url)
//     ? url
//     : `https://beauty.joyory.com/${String(url).replace(/^\/+/, "")}`;
// };

// const BestSellers = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       try {
//         const res = await fetch(API);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();

//         // Accept several common response shapes:
//         const raw =
//           (Array.isArray(json) && json) ||
//           json?.products ||
//           json?.data ||
//           json?.items ||
//           [];

//         const mapped = raw.map((p, i) => ({
//           id: p?._id || p?.id || i,
//           name: p?.name || "Unknown",
//           image: toAbsolute(p?.image) || `https://picsum.photos/600/600?random=${i}`,
//         }));

//         if (mounted) {
//           setItems(mapped);
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("BestSellers fetch error:", err);
//         if (mounted) {
//           // simple 3-item fallback so slider still renders
//           setItems(
//             Array.from({ length: 3 }).map((_, i) => ({
//               id: `fallback-${i}`,
//               name: ["NATURALLY EXTRACTED FRAGRANCE", "EATABLE CHOCO LIPBALM", "WATERPROOF MATTE LIPSTICK"][i] || "Best Seller",
//               image: `https://picsum.photos/600/600?random=${i + 1}`,
//             }))
//           );
//           setLoading(false);
//         }
//       }
//     };

//     load();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   return (
//     <section className="bestSellers container">
//       <h2 className="bestSellers__heading">BEST SELLERS</h2>
//       <p className="bestSellers__sub">HOT ON SOCIAL</p>

//       <Swiper
//         modules={[Autoplay, Pagination]}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 2200, disableOnInteraction: false }}
//         speed={700}
//         spaceBetween={24}
//         loop={items.length > 3}
//         watchOverflow
//         grabCursor
//         breakpoints={{
//           0:    { slidesPerView: 1.1 },  // phones
//           480:  { slidesPerView: 1.3 },
//           640:  { slidesPerView: 2 },    // small tablets
//           900:  { slidesPerView: 3 },    // large tablets
//           1200: { slidesPerView: 3 },    // desktop (design shows 3)
//         }}
//         className="bestSellers__swiper"
//       >
//         {(loading ? Array.from({ length: 3 }) : items).map((it, i) => (
//           <SwiperSlide key={it?.id ?? i}>
//             <article className="bs-card">
//               <div className={`bs-card__imgWrap ${loading ? "skeleton" : ""}`}>
//                 {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
//                 <img
//                   src={it?.image}
//                   alt={it?.name || "Best seller image"}
//                   className="bs-card__img h-25"
//                   onError={(e) => {
//                     e.currentTarget.src = `https://picsum.photos/600/600?random=${i + 10}`;
//                   }}
//                 />
//               </div>
//               <h3 className="bs-card__title">{it?.name || "Loading…"}</h3>
//             </article>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// };

// export default BestSellers;















// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import { Link } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "../css/BestSellers.css";

// const API_LIST =
//   "https://beauty.joyory.com/api/user/products/top-sellers";

// // convert relative → absolute image URL
// const toAbsolute = (url) => {
//   if (!url) return "";
//   return /^https?:\/\//i.test(url)
//     ? url
//     : `https://beauty.joyory.com/${String(url).replace(/^\/+/, "")}`;
// };

// const BestSellers = () => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();

//         const raw = Array.isArray(json) ? json : json?.products || [];
//         const mapped = raw.map((p, i) => ({
//           id: p?._id || p?.id || i,
//           name: p?.name || "Unknown",
//           image: toAbsolute(p?.image) || `https://picsum.photos/600/600?random=${i}`,
//         }));

//         setItems(mapped);
//       } catch (err) {
//         console.error("List fetch error", err);
//       }
//     };
//     load();
//   }, []);

//   return (
//     <section className="bestSellers container">
//       <h2 className="bestSellers__heading">BEST SELLERS</h2>
//       <p className="bestSellers__sub">HOT ON SOCIAL</p>

//       <Swiper
//         modules={[Autoplay, Pagination]}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 2200, disableOnInteraction: false }}
//         speed={700}
//         spaceBetween={24}
//         loop={items.length > 3}
//         grabCursor
//         breakpoints={{
//           0: { slidesPerView: 1 },
//           640: { slidesPerView: 2 },
//           900: { slidesPerView: 3 },
//           1200: { slidesPerView: 4 },
//         }}
//       >
//         {items.map((it, i) => (
//           <SwiperSlide key={it.id} className="">
//             <Link to={`/product/${it.id}`} className="bs-card">
//               <div className="bs-card__imgWrap w-100 h-100">
//                 <img
//                   src={it.image}
//                   alt={it.name}
//                   className="bs-card__img"
//                   onError={(e) =>
//                     (e.currentTarget.src = `https://picsum.photos/600/600?random=${i + 20}`)
//                   }
//                 />
//               </div>
//               <h3 className="bs-card__title">{it.name}</h3>
//             </Link>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// };

// export default BestSellers;


// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules"; // Added Navigation
// import { Link } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation"; // Import Navigation CSS
// import "../css/BestSellers.css";
// import "../App.css";

// const API_LIST =
//   "https://beauty.joyory.com/api/user/products/top-sellers";

// // convert relative → absolute image URL
// const toAbsolute = (url) => {
//   if (!url) return "";
//   return /^https?:\/\//i.test(url)
//     ? url
//     : `https://beauty.joyory.com/${String(url).replace(/^\/+/, "")}`;
// };

// const BestSellers = () => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();

//         const raw = Array.isArray(json) ? json : json?.products || [];
//         const mapped = raw.map((p, i) => ({
//           id: p?._id || p?.id || i,
//           name: p?.name || "Unknown",
//           image: toAbsolute(p?.image) || `https://picsum.photos/600/600?random=${i}`,
//         }));

//         setItems(mapped);
//       } catch (err) {
//         console.error("List fetch error", err);
//       }
//     };
//     load();
//   }, []);

//   return (
//     <section className="bestSellers container-fluid ">
//       <h2 className="bestSellers__heading mt-3 mb-4 mb-lg-5 mt-lg-5 font-family-Playfair spacing">BEST SELLERS</h2>
//       {/* <p className="bestSellers__sub">HOT ON SOCIAL</p> */}


//       <div className="mobile-responsive-code">

//       <Swiper
//         modules={[Autoplay, Pagination, Navigation]} // Added Navigation module
//         pagination={{ clickable: true }}
//         navigation={true} // Enable arrows
//         autoplay={{ delay: 2200, disableOnInteraction: false }}
//         speed={700}
//         spaceBetween={15}
//         loop={items.length > 3}
//         grabCursor
//         breakpoints={{
//           0: { slidesPerView: 3 },
//           640: { slidesPerView: 3 },
//           900: { slidesPerView: 3 },
//           1200: { slidesPerView: 4 },
//         }}
//       >
//         {items.map((it, i) => (
//           <SwiperSlide key={it.id} className="">
//             <Link to={`/product/${it.id}`} className="bs-card">
//               <div className="bs-card__imgWrap w-100 h-100">
//                 <img
//                   src={it.image}
//                   alt={it.name}
//                   className="bs-card__img"
//                   onError={(e) =>
//                     (e.currentTarget.src = `https://picsum.photos/600/600?random=${i + 20}`)
//                   }
//                 />
//               </div>
//               <h3 className="bs-card__title font-family-Poppins">{it.name}</h3>
//             </Link>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       </div>
//     </section>
//   );
// };

// export default BestSellers;






















// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // Fixed: Valid hex color check - REMOVED black/white from defaults
//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== "string" || hex.trim() === "") return false;
//     const normalized = hex.trim().toLowerCase();
//     // Only exclude truly invalid cases, not actual colors
//     if (normalized === "transparent") return false;
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(normalized);
//   }, []);

//   // Get display text for variant
//   const getVariantDisplayText = useCallback((variant) => {
//     if (!variant) return "Default";
//     return variant.shadeName || variant.size || variant.ml || variant.weight || "Default";
//   }, []);

//   // Handle variant click
//   const handleVariantSelect = useCallback((productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
//   }, []);

//   // Add to Cart
//   const handleAddToCart = async (product) => {
//     const productId = product._id;
//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     const allVariants = product.variants || [];
//     const selected = selectedVariants[productId] || product.selectedVariant || allVariants[0];

//     // Match selected variant
//     let variantToAdd = allVariants.find(v => v.sku === selected?.sku);

//     if (!variantToAdd || parseInt(variantToAdd.stock || 0) <= 0) {
//       variantToAdd = allVariants.find(v => parseInt(v.stock || 0) > 0);
//       if (!variantToAdd) {
//         toast.error("Out of stock");
//         setAddingToCart(prev => ({ ...prev, [productId]: false }));
//         return;
//       }
//       toast.warning("Selected unavailable, using available variant");
//     }

//     try {
//       const res = await fetch("https://beauty.joyory.com/api/user/cart/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           productId: product._id,
//           variants: [{ variantSku: variantToAdd.sku, quantity: 1 }]
//         })
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success("Added to cart!");
//       } else {
//         toast.error(data.message || "Failed");
//       }
//     } catch (err) {
//       toast.error("Network error");
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();
//         const raw = Array.isArray(json) ? json : json?.products || [];

//         const processed = raw.map(p => {
//           const variants = p.variants || [];
//           const selected = selectedVariants[p._id] || p.selectedVariant || variants[0];
//           const image = (selected?.images?.[0] || p.images?.[0] || "").startsWith("http")
//             ? selected?.images?.[0] || p.images?.[0]
//             : `https://res.cloudinary.com/dekngswix/image/upload/${selected?.images?.[0] || p.images?.[0] || ""}`;

//           return {
//             ...p,
//             displayImage: image || "https://placehold.co/400x400?text=No+Image",
//             currentVariant: selected,
//             allVariants: variants
//           };
//         });

//         setProducts(processed);
//       } catch (err) {
//         console.error("BestSellers error:", err);
//       }
//     };
//     load();
//   }, [selectedVariants]);

//   const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString("en-IN")}`;

//   return (
//     <section className="bestSellers container-fluid py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="bestSellers__heading text-center mt-3 mb-4 font-family-Playfair spacing">
//         BEST SELLERS
//       </h2>

//       <div className="mobile-responsive-code">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           navigation={true}
//           autoplay={{ delay: 2500, disableOnInteraction: false }}
//           speed={800}
//           spaceBetween={20}
//           loop={products.length > 3}
//           grabCursor
//           breakpoints={{
//             300: { slidesPerView: 2, spaceBetween: 10 },
//             576: { slidesPerView: 3 },
//             768: { slidesPerView: 4 },
//             992: { slidesPerView: 4 },
//             1200: { slidesPerView: 5 },
//           }}
//         >
//           {products.map((item) => {
//             const current = selectedVariants[item._id] || item.currentVariant || item.allVariants[0];
//             const variants = item.allVariants || [];
//             const hasVariants = variants.length > 1;

//             return (
//               <SwiperSlide key={item._id}>
//                 <div className="bs-card position-relative bg-white shadow-sm rounded overflow-hidden">
//                   {/* Image */}
//                   <Link to={`/product/${item._id}`} className="text-decoration-none">
//                     <div className="bs-card__imgWrap">
//                       <img
//                         src={current?.images?.[0] || item.displayImage}
//                         alt={item.name}
//                         className="bs-card__img img-fluid w-100"
//                         style={{ height: "280px", objectFit: "cover" }}
//                         onError={(e) => e.currentTarget.src = "https://placehold.co/400x400?text=Product"}
//                       />
//                     </div>
//                   </Link>

//                   {/* Product Info */}
//                   <div className="p-3">
//                     <div className="small text-muted">{item.brand?.name || "Unknown Brand"}</div>
//                     <Link to={`/product/${item._id}`} className="text-decoration-none">
//                       <h6 className="font-family-Poppins text-dark mb-2">{item.name}</h6>
//                     </Link>

//                     {/* Combined Variant Selector */}
//                     {hasVariants && (
//                       <div className="variant-section mb-3">
//                         <div className="d-flex flex-wrap gap-2 justify-content-center">
//                           {variants.map((v) => {
//                             const isSelected = current?.sku === v.sku;
//                             const stock = parseInt(v.stock || 0);
//                             const disabled = stock <= 0;
//                             const hasColor = isValidHexColor(v.hex);
//                             const displayText = getVariantDisplayText(v);

//                             return (
//                               <div key={v.sku} className="text-center">
//                                 {/* Unified variant option - handles both color and text */}
//                                 <div
//                                   className={`variant-option ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
//                                   style={{
//                                     width: hasColor ? '32px' : 'auto',
//                                     height: '32px',
//                                     minWidth: hasColor ? '32px' : 'auto',
//                                     borderRadius: hasColor ? '50%' : '4px',
//                                     border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
//                                     backgroundColor: hasColor ? v.hex : '#f8f9fa',
//                                     color: hasColor ? getContrastColor(v.hex) : '#333',
//                                     cursor: disabled ? 'not-allowed' : 'pointer',
//                                     opacity: disabled ? 0.4 : 1,
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     padding: hasColor ? '0' : '4px 8px',
//                                     fontSize: '12px',
//                                     fontWeight: isSelected ? 'bold' : 'normal',
//                                     transition: 'all 0.2s ease',
//                                     boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : 'none',
//                                     position: 'relative'
//                                   }}
//                                   onClick={() => !disabled && handleVariantSelect(item._id, v)}
//                                   title={displayText}
//                                 >
//                                   {/* For color variants, show text overlay */}
//                                   {hasColor && (
//                                     <span 
//                                       className="color-variant-text"
//                                       style={{
//                                         fontSize: '8px',
//                                         fontWeight: 'bold',
//                                         textShadow: '0 1px 2px rgba(0,0,0,0.5)',
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         whiteSpace: 'nowrap',
//                                         maxWidth: '100%',
//                                         padding: '0 2px'
//                                       }}
//                                     >
//                                       {displayText.length > 4 ? displayText.substring(0, 3) + '..' : displayText}
//                                     </span>
//                                   )}

//                                   {/* For text variants, show full text */}
//                                   {!hasColor && (
//                                     <span className="text-variant">
//                                       {displayText.length > 6 ? displayText.substring(0, 5) + '..' : displayText}
//                                     </span>
//                                   )}

//                                   {/* Selected indicator for color variants */}
//                                   {hasColor && isSelected && (
//                                     <div 
//                                       style={{
//                                         position: 'absolute',
//                                         top: '-4px',
//                                         right: '-4px',
//                                         width: '10px',
//                                         height: '10px',
//                                         borderRadius: '50%',
//                                         backgroundColor: '#007bff',
//                                         border: '2px solid white',
//                                         boxShadow: '0 0 2px rgba(0,0,0,0.3)'
//                                       }}
//                                     />
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>

//                         {/* Selected Label */}
//                         <div className="text-center mt-2 small text-muted">
//                           <strong>Selected:</strong> {getVariantDisplayText(current)}
//                         </div>
//                       </div>
//                     )}

//                     {/* Price */}
//                     <div className="text-center mb-3">
//                       <span className="fw-bold fs-5 text-dark">
//                         {formatPrice(current?.displayPrice || current?.discountedPrice || item.price)}
//                       </span>
//                       {current?.originalPrice > (current?.displayPrice || current?.discountedPrice) && (
//                         <>
//                           <span className="text-muted text-decoration-line-through ms-2 fs-6">
//                             {formatPrice(current.originalPrice)}
//                           </span>
//                           <span className="text-danger fw-bold ms-2">
//                             ({current.discountPercent || Math.round(((current.originalPrice - (current.displayPrice || current.discountedPrice)) / current.originalPrice) * 100)}% OFF)
//                           </span>
//                         </>
//                       )}
//                     </div>

//                     {/* Add to Cart */}
//                     <div className="text-center">
//                       <button
//                         className="btn btn-primary w-100"
//                         disabled={addingToCart[item._id] || parseInt(current?.stock || 0) <= 0}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           handleAddToCart(item);
//                         }}
//                       >
//                         {addingToCart[item._id] ? "Adding..." : parseInt(current?.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// // Helper function to determine text color based on background
// const getContrastColor = (hexColor) => {
//   if (!hexColor) return '#000';
//   const hex = hexColor.replace('#', '');
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);
//   const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//   return brightness > 128 ? '#000' : '#fff';
// };

// export default BestSellers;














// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

// // Selected Variant Display
// const SelectedVariantDisplay = ({ variant, getVariantDisplayText, isValidHexColor, getContrastColor }) => {
//   if (!variant) return null;

//   const variantText = getVariantDisplayText(variant);
//   const hasColor = variant.hex && isValidHexColor(variant.hex);
//   const stock = parseInt(variant.stock || 0);
//   const isInStock = stock > 0;

//   return (
//     <div className="selected-variant-display text-center">
//       <div className="small text-muted mb-1">
//         <strong>Selected:</strong>
//       </div>
//       <div className="d-flex justify-content-center align-items-center mb-2">
//         {hasColor ? (
//           <>
//             <div
//               className="color-dot me-2"
//               style={{
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '50%',
//                 backgroundColor: variant.hex,
//                 border: '2px solid #007bff',
//                 boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               {isInStock && (
//                 <span style={{ color: getContrastColor(variant.hex), fontSize: '14px' }}>✓</span>
//               )}
//             </div>
//             <span className="fw-medium">{variantText}</span>
//           </>
//         ) : (
//           <div
//             className="selected-variant-box px-3 py-2"
//             style={{
//               border: '2px solid #007bff',
//               borderRadius: '6px',
//               backgroundColor: '#f8f9fa',
//               color: '#007bff',
//               fontWeight: '600',
//               fontSize: '14px',
//               minWidth: '100px',
//               textAlign: 'center'
//             }}
//           >
//             {variantText}
//           </div>
//         )}
//       </div>
//       <div className="mt-1 small">
//         {isInStock ? (
//           <span className="text-success">
//             <i className="bi bi-check-circle me-1"></i>
//             In Stock ({stock} available)
//           </span>
//         ) : (
//           <span className="text-danger">
//             <i className="bi bi-x-circle me-1"></i>
//             Out of Stock
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Variant Option with arrow for single variant
// const VariantOption = ({
//   variant,
//   isSelected,
//   disabled,
//   hasColor,
//   displayText,
//   onClick,
//   getContrastColor,
//   showArrow = false
// }) => {
//   const isActuallyDisabled = disabled && !showArrow; // Only disable if out of stock (not for single variant)

//   return (
//     <div className="text-center">
//       <div
//         className={`variant-option ${isSelected ? "selected" : ""} ${isActuallyDisabled ? "disabled" : ""}`}
//         style={{
//           width: hasColor ? '32px' : 'auto',
//           height: '32px',
//           minWidth: hasColor ? '32px' : 'auto',
//           borderRadius: hasColor ? '50%' : '4px',
//           border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
//           backgroundColor: hasColor ? variant.hex : '#f8f9fa',
//           color: hasColor ? getContrastColor(variant.hex) : '#333',
//           cursor: isActuallyDisabled ? 'not-allowed' : 'pointer',
//           opacity: isActuallyDisabled ? 0.4 : 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: hasColor ? 'center' : 'space-between',
//           padding: hasColor ? '0' : '4px 8px',
//           fontSize: '12px',
//           fontWeight: isSelected ? 'bold' : 'normal',
//           transition: 'all 0.2s ease',
//           boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : 'none',
//           position: 'relative'
//         }}
//         onClick={() => !isActuallyDisabled && onClick()}
//         title={`${displayText}${isActuallyDisabled ? ' (Out of Stock)' : ''}`}
//       >
//         {hasColor ? (
//           <span style={{ fontSize: '8px', fontWeight: 'bold' }}>
//             {displayText.length > 4 ? displayText.substring(0, 3) + '..' : displayText}
//           </span>
//         ) : (
//           <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//             <span className="text-variant flex-grow-1">
//               {displayText.length > 6 ? displayText.substring(0, 5) + '..' : displayText}
//             </span>
//             {showArrow && (
//               <span style={{ color: '#007bff', fontSize: '12px', fontWeight: 'bold' }}>▽</span>
//             )}
//           </div>
//         )}

//         {isSelected && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '-4px',
//               right: '-4px',
//               width: '10px',
//               height: '10px',
//               borderRadius: '50%',
//               backgroundColor: '#007bff',
//               border: '2px solid white',
//               boxShadow: '0 0 2px rgba(0,0,0,0.3)'
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     if (normalized === "transparent") return false;
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(normalized);
//   }, []);

//   const getVariantDisplayText = useCallback((variant) => {
//     if (!variant) return "DEFAULT";
//     const text = variant.shadeName || variant.name || variant.size || variant.ml || variant.weight || "DEFAULT";
//     return text.toUpperCase();
//   }, []);

//   const getContrastColor = useCallback((hexColor) => {
//     if (!hexColor) return '#000';
//     const hex = hexColor.replace('#', '');
//     const r = parseInt(hex.substr(0, 2), 16);
//     const g = parseInt(hex.substr(2, 2), 16);
//     const b = parseInt(hex.substr(4, 2), 16);
//     const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//     return brightness > 128 ? '#000' : '#fff';
//   }, []);

//   const handleVariantSelect = useCallback((productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
//   }, []);

//   // === ROBUST ADD TO CART - Variant-wise & working perfectly ===
//   const handleAddToCart = async (product) => {
//     const productId = product._id;
//     if (!productId) return;

//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     const allVariants = product.allVariants || [];
//     const selectedVariant = selectedVariants[productId] || product.currentVariant || allVariants[0];

//     if (!selectedVariant) {
//       toast.error("No variant selected");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const stock = parseInt(selectedVariant.stock || 0);
//     if (stock <= 0) {
//       toast.error("Out of stock");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//     const variantSku = selectedVariant.sku || selectedVariant._id || variantId;

//     const variantData = {
//       variantId,
//       variantSku,
//       name: getVariantDisplayText(selectedVariant),
//       shadeName: selectedVariant.shadeName,
//       hex: selectedVariant.hex,
//       price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       image: selectedVariant.images?.[0] || selectedVariant.image || product.displayImage,
//       stock,
//     };

//     try {
//       let isLoggedIn = false;
//       try {
//         await fetch("https://beauty.joyory.com/api/user/profile", { credentials: "include" });
//         isLoggedIn = true;
//       } catch {}

//       if (!isLoggedIn) {
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

//         const existingIndex = guestCart.findIndex(
//           item => item.productId === productId && item.variantId === variantId
//         );

//         if (existingIndex >= 0) {
//           guestCart[existingIndex].quantity += 1;
//           toast.success(`Quantity: ${guestCart[existingIndex].quantity}`);
//         } else {
//           guestCart.push({
//             productId,
//             productName: product.name,
//             productImage: variantData.image,
//             brandName: product.brand?.name || "Unknown Brand",
//             variantId,
//             variantSku,
//             variantName: variantData.name,
//             shadeName: variantData.shadeName,
//             hex: variantData.hex,
//             price: variantData.price,
//             quantity: 1,
//             totalPrice: variantData.price,
//             stock: variantData.stock,
//             isGuest: true,
//             addedAt: new Date().toISOString()
//           });
//           toast.success("Added to cart (Guest)");
//         }

//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       } else {
//         const res = await fetch("https://beauty.joyory.com/api/user/cart/add", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             productId,
//             variants: [{ variantSku, quantity: 1 }]
//           })
//         });

//         const data = await res.json();
//         if (data.success) {
//           toast.success("Added to cart!");
//         } else {
//           toast.error(data.message || "Failed to add");
//         }
//       }
//     } catch (err) {
//       toast.error("Error - added to guest cart");
//       let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       guestCart.push({
//         productId,
//         variantId,
//         variantName: variantData.name,
//         price: variantData.price,
//         quantity: 1,
//         image: variantData.image,
//         isGuest: true
//       });
//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();
//         const raw = Array.isArray(json) ? json : json?.products || [];

//         const processed = raw.map(p => {
//           const variants = p.variants || [];
//           let current = selectedVariants[p._id] || variants.find(v => parseInt(v.stock || 0) > 0) || variants[0] || {};

//           if (variants.length === 1 && !selectedVariants[p._id]) {
//             setSelectedVariants(prev => ({ ...prev, [p._id]: variants[0] }));
//           }

//           let image = current?.images?.[0] || p.images?.[0] || "";
//           if (image && !image.startsWith("http")) {
//             image = `https://res.cloudinary.com/dekngswix/image/upload/${image}`;
//           }

//           return {
//             ...p,
//             displayImage: image || "https://placehold.co/400x400?text=No+Image",
//             currentVariant: current,
//             allVariants: variants,
//             avgRating: p.avgRating || 0,
//             totalRatings: p.totalRatings || 0,
//           };
//         });

//         setProducts(processed);
//       } catch (err) {
//         console.error("BestSellers load error:", err);
//       }
//     };
//     load();
//   }, [selectedVariants]);

//   const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString("en-IN")}`;

//   const calculateDiscountPercent = useCallback((original, current) => {
//     if (original > current) return Math.round(((original - current) / original) * 100);
//     return 0;
//   }, []);

//   return (
//     <section className="bestSellers container-fluid py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="bestSellers__heading text-center mt-3 mb-4 font-family-Playfair spacing">
//         BEST SELLERS
//       </h2>

//       <div className="mobile-responsive-code">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           navigation={true}
//           autoplay={{ delay: 2500 }}
//           speed={800}
//           spaceBetween={20}
//           loop={products.length > 3}
//           grabCursor
//           breakpoints={{
//             300: { slidesPerView: 2, spaceBetween: 10 },
//             576: { slidesPerView: 3 },
//             768: { slidesPerView: 4 },
//             992: { slidesPerView: 4 },
//             1200: { slidesPerView: 5 },
//           }}
//         >
//           {products.map((item) => {
//             const current = selectedVariants[item._id] || item.currentVariant || {};
//             const variants = item.allVariants || [];
//             const hasSingleVariant = variants.length === 1;
//             const hasMultipleVariants = variants.length > 1;

//             const displayPrice = parseFloat(current?.displayPrice || current?.discountedPrice || current?.price || item.price || 0);
//             const originalPrice = parseFloat(current?.originalPrice || current?.mrp || item.mrp || displayPrice);
//             const discountPercent = calculateDiscountPercent(originalPrice, displayPrice);

//             const avgRating = item.avgRating || 0;
//             const totalRatings = item.totalRatings || 0;

//             return (
//               <SwiperSlide key={item._id}>
//                 <div className="bs-card bg-white shadow-sm rounded overflow-hidden position-relative">
//                   <Link to={`/product/${item._id}`}>
//                     <div className="bs-card__imgWrap position-relative">
//                       <img
//                         src={current?.images?.[0] || item.displayImage}
//                         alt={item.name}
//                         className="img-fluid w-100"
//                         style={{ height: "280px", objectFit: "cover" }}
//                       />
//                       {discountPercent > 0 && (
//                         <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded">
//                           {discountPercent}% OFF
//                         </div>
//                       )}
//                     </div>
//                   </Link>

//                   <div className="p-3 text-center">
//                     {/* Ratings */}
//                     <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`bi ${i < Math.floor(avgRating) ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
//                           style={{ fontSize: "14px" }}
//                         />
//                       ))}
//                       <span className="small text-muted ms-2">
//                         {avgRating > 0 ? `${avgRating.toFixed(1)} (${totalRatings})` : "No reviews"}
//                       </span>
//                     </div>

//                     <div className="small text-muted mb-1">{item.brand?.name || "Unknown Brand"}</div>

//                     <Link to={`/product/${item._id}`} className="text-decoration-none">
//                       <h6 className="font-family-Poppins text-dark mb-3">{item.name}</h6>
//                     </Link>

//                     {/* Variant Section */}
//                     {variants.length > 0 && (
//                       <div className="mb-4">
//                         {hasSingleVariant && current && (
//                           <div className="d-flex justify-content-center mb-3">
//                             <VariantOption
//                               variant={current}
//                               isSelected={true}
//                               disabled={false}
//                               hasColor={isValidHexColor(current.hex)}
//                               displayText={getVariantDisplayText(current)}
//                               onClick={() => {}}
//                               getContrastColor={getContrastColor}
//                               showArrow={true}
//                             />
//                           </div>
//                         )}

//                         {hasMultipleVariants && (
//                           <div className="d-flex flex-wrap gap-3 justify-content-center mb-3">
//                             {variants.map((v) => {
//                               const isSel = current._id === v._id || current.sku === v.sku;
//                               const disabled = parseInt(v.stock || 0) <= 0;
//                               return (
//                                 <VariantOption
//                                   key={v._id || v.sku}
//                                   variant={v}
//                                   isSelected={isSel}
//                                   disabled={disabled}
//                                   hasColor={isValidHexColor(v.hex)}
//                                   displayText={getVariantDisplayText(v)}
//                                   onClick={() => handleVariantSelect(item._id, v)}
//                                   getContrastColor={getContrastColor}
//                                 />
//                               );
//                             })}
//                           </div>
//                         )}

//                         <SelectedVariantDisplay
//                           variant={current}
//                           getVariantDisplayText={getVariantDisplayText}
//                           isValidHexColor={isValidHexColor}
//                           getContrastColor={getContrastColor}
//                         />
//                       </div>
//                     )}

//                     {/* Price */}
//                     <div className="mb-4">
//                       <span className="fw-bold fs-4 text-dark">{formatPrice(displayPrice)}</span>
//                       {originalPrice > displayPrice && (
//                         <>
//                           <span className="text-muted text-decoration-line-through ms-3 fs-6">
//                             {formatPrice(originalPrice)}
//                           </span>
//                           <span className="text-danger fw-bold ms-3">({discountPercent}% OFF)</span>
//                         </>
//                       )}
//                     </div>

//                     {/* Add to Cart */}
//                     <button
//                       className="btn btn-primary w-100 py-2"
//                       disabled={addingToCart[item._id] || parseInt(current.stock || 0) <= 0}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleAddToCart(item);
//                       }}
//                     >
//                       {addingToCart[item._id] ? "Adding..." : parseInt(current.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default BestSellers; 





































// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

// // Selected Variant Display
// const SelectedVariantDisplay = ({ variant, getVariantDisplayText, isValidHexColor, getContrastColor }) => {
//   if (!variant) return null;
//   const variantText = getVariantDisplayText(variant);
//   const hasColor = variant.hex && isValidHexColor(variant.hex);
//   const stock = parseInt(variant.stock || 0);
//   const isInStock = stock > 0;

//   return (
//     <div className="selected-variant-display text-center">
//       <div className="small text-muted mb-1">
//         <strong>Selected:</strong>
//       </div>
//       <div className="d-flex justify-content-center align-items-center mb-2">
//         {hasColor ? (
//           <>
//             <div
//               className="color-dot me-2"
//               style={{
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '50%',
//                 backgroundColor: variant.hex,
//                 border: '2px solid #007bff',
//                 boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               {isInStock && (
//                 <span style={{ color: getContrastColor(variant.hex), fontSize: '14px' }}>✓</span>
//               )}
//             </div>
//             <span className="fw-medium">{variantText}</span>
//           </>
//         ) : (
//           <div
//             className="selected-variant-box px-3 py-2"
//             style={{
//               border: '2px solid #007bff',
//               borderRadius: '6px',
//               backgroundColor: '#f8f9fa',
//               color: '#007bff',
//               fontWeight: '600',
//               fontSize: '14px',
//               minWidth: '100px',
//               textAlign: 'center'
//             }}
//           >
//             {variantText}
//           </div>
//         )}
//       </div>
//       <div className="mt-1 small">
//         {isInStock ? (
//           <span className="text-success">
//             <i className="bi bi-check-circle me-1"></i>
//             In Stock ({stock} available)
//           </span>
//         ) : (
//           <span className="text-danger">
//             <i className="bi bi-x-circle me-1"></i>
//             Out of Stock
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Variant Option
// const VariantOption = ({
//   variant,
//   isSelected,
//   disabled,
//   hasColor,
//   displayText,
//   onClick,
//   getContrastColor,
//   showArrow = false
// }) => {
//   const isActuallyDisabled = disabled && !showArrow;

//   return (
//     <div className="text-center">
//       <div
//         className={`variant-option ${isSelected ? "selected" : ""} ${isActuallyDisabled ? "disabled" : ""}`}
//         style={{
//           width: hasColor ? '32px' : 'auto',
//           height: '32px',
//           minWidth: hasColor ? '32px' : 'auto',
//           borderRadius: hasColor ? '50%' : '4px',
//           border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
//           backgroundColor: hasColor ? variant.hex : '#f8f9fa',
//           color: hasColor ? getContrastColor(variant.hex) : '#333',
//           cursor: isActuallyDisabled ? 'not-allowed' : 'pointer',
//           opacity: isActuallyDisabled ? 0.4 : 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: hasColor ? 'center' : 'space-between',
//           padding: hasColor ? '0' : '4px 8px',
//           fontSize: '12px',
//           fontWeight: isSelected ? 'bold' : 'normal',
//           transition: 'all 0.2s ease',
//           boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : 'none',
//           position: 'relative'
//         }}
//         onClick={() => !isActuallyDisabled && onClick()}
//         title={`${displayText}${isActuallyDisabled ? ' (Out of Stock)' : ''}`}
//       >
//         {hasColor ? (
//           <span style={{ fontSize: '8px', fontWeight: 'bold' }}>
//             {displayText.length > 4 ? displayText.substring(0, 3) + '..' : displayText}
//           </span>
//         ) : (
//           <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//             <span className="text-variant flex-grow-1">
//               {displayText.length > 6 ? displayText.substring(0, 5) + '..' : displayText}
//             </span>
//             {showArrow && (
//               <span style={{ color: '#007bff', fontSize: '12px', fontWeight: 'bold' }}>▽</span>
//             )}
//           </div>
//         )}
//         {isSelected && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '-4px',
//               right: '-4px',
//               width: '10px',
//               height: '10px',
//               borderRadius: '50%',
//               backgroundColor: '#007bff',
//               border: '2px solid white',
//               boxShadow: '0 0 2px rgba(0,0,0,0.3)'
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   const navigate = useNavigate(); // For redirecting to cart

//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     if (normalized === "transparent") return false;
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(normalized);
//   }, []);

//   const getVariantDisplayText = useCallback((variant) => {
//     if (!variant) return "DEFAULT";
//     const text = variant.shadeName || variant.name || variant.size || variant.ml || variant.weight || "DEFAULT";
//     return text.toUpperCase();
//   }, []);

//   const getContrastColor = useCallback((hexColor) => {
//     if (!hexColor) return '#000';
//     const hex = hexColor.replace('#', '');
//     const r = parseInt(hex.substr(0, 2), 16);
//     const g = parseInt(hex.substr(2, 2), 16);
//     const b = parseInt(hex.substr(4, 2), 16);
//     const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//     return brightness > 128 ? '#000' : '#fff';
//   }, []);

//   const handleVariantSelect = useCallback((productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
//   }, []);

//   // === WISHLIST LOGIC ===
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         let isLoggedIn = false;
//         try {
//           await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//           isLoggedIn = true;
//         } catch { }

//         if (!isLoggedIn) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//           if (Array.isArray(res.data.wishlist)) {
//             setWishlist(res.data.wishlist.map(item => item._id));
//           }
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   const toggleWishlist = async (productId) => {
//     try {
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter(id => id !== productId);
//           toast.success("Removed from wishlist (guest mode)");
//         } else {
//           updated.push(productId);
//           toast.success("Added to wishlist (guest mode)");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//       } else {
//         const res = await axios.post(
//           `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//           {},
//           { withCredentials: true }
//         );
//         if (res.data.wishlist) {
//           setWishlist(res.data.wishlist.map(item => item._id));
//           toast.success("Wishlist updated!");
//         }
//       }
//     } catch (err) {
//       console.error("Wishlist toggle error:", err);
//       toast.error("Failed to update wishlist");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // === ADD TO CART + AUTO REDIRECT TO /cart ===
//   const handleAddToCart = async (product) => {
//     const productId = product._id;
//     if (!productId) return;

//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     const allVariants = product.allVariants || [];
//     const selectedVariant = selectedVariants[productId] || product.currentVariant || allVariants[0];

//     if (!selectedVariant) {
//       toast.error("No variant selected");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const stock = parseInt(selectedVariant.stock || 0);
//     if (stock <= 0) {
//       toast.error("Out of stock");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//     const variantSku = selectedVariant.sku || selectedVariant._id || variantId;

//     const variantData = {
//       variantId,
//       variantSku,
//       name: getVariantDisplayText(selectedVariant),
//       shadeName: selectedVariant.shadeName,
//       hex: selectedVariant.hex,
//       price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       image: selectedVariant.images?.[0] || selectedVariant.image || product.displayImage,
//       stock,
//     };

//     try {
//       let isLoggedIn = false;
//       try {
//         await fetch("https://beauty.joyory.com/api/user/profile", { credentials: "include" });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           item => item.productId === productId && item.variantId === variantId
//         );

//         if (existingIndex >= 0) {
//           guestCart[existingIndex].quantity += 1;
//         } else {
//           guestCart.push({
//             productId,
//             productName: product.name,
//             productImage: variantData.image,
//             brandName: product.brand?.name || "Unknown Brand",
//             variantId,
//             variantSku,
//             variantName: variantData.name,
//             shadeName: variantData.shadeName,
//             hex: variantData.hex,
//             price: variantData.price,
//             quantity: 1,
//             stock: variantData.stock,
//             isGuest: true,
//             addedAt: new Date().toISOString()
//           });
//         }
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//         // toast.success("Added to cart! Redirecting to cart...");
//       } else {
//         const res = await fetch("https://beauty.joyory.com/api/user/cart/add", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             productId,
//             variants: [{ variantSku, quantity: 1 }]
//           })
//         });
//         const data = await res.json();
//         if (data.success) {
//           toast.success("Added to cart! Redirecting to cart...");
//         } else {
//           toast.error(data.message || "Failed to add");
//           setAddingToCart(prev => ({ ...prev, [productId]: false }));
//           return;
//         }
//       }

//       // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//       setTimeout(() => {
//         navigate("/Cartpage");
//       }, 1500); // Small delay so user sees toast

//     } catch (err) {
//       toast.error("Error - added to guest cart");
//       let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       guestCart.push({
//         productId,
//         variantId,
//         variantName: variantData.name,
//         price: variantData.price,
//         quantity: 1,
//         image: variantData.image,
//         isGuest: true
//       });
//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       toast.success("Added to cart (Guest)! Redirecting...");
//       setTimeout(() => {
//         navigate("/Cartpage");
//       }, 1500);
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();
//         const raw = Array.isArray(json) ? json : json?.products || [];

//         const processed = raw.map(p => {
//           const variants = p.variants || [];
//           let current = selectedVariants[p._id] || variants.find(v => parseInt(v.stock || 0) > 0) || variants[0] || {};

//           if (variants.length === 1 && !selectedVariants[p._id]) {
//             setSelectedVariants(prev => ({ ...prev, [p._id]: variants[0] }));
//           }

//           let image = current?.images?.[0] || p.images?.[0] || "";
//           if (image && !image.startsWith("http")) {
//             image = `https://res.cloudinary.com/dekngswix/image/upload/${image}`;
//           }

//           return {
//             ...p,
//             displayImage: image || "https://placehold.co/400x400?text=No+Image",
//             currentVariant: current,
//             allVariants: variants,
//             avgRating: p.avgRating || 0,
//             totalRatings: p.totalRatings || 0,
//           };
//         });

//         setProducts(processed);
//       } catch (err) {
//         console.error("BestSellers load error:", err);
//       }
//     };
//     load();
//   }, [selectedVariants]);

//   const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString("en-IN")}`;
//   const calculateDiscountPercent = useCallback((original, current) => {
//     if (original > current) return Math.round(((original - current) / original) * 100);
//     return 0;
//   }, []);

//   return (
//     <section className="bestSellers container-fluid py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="bestSellers__heading text-center mt-3 mb-4 font-family-Playfair spacing">
//         BEST SELLERS
//       </h2>

//       <div className="mobile-responsive-code">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           navigation={true}
//           autoplay={{ delay: 2500 }}
//           speed={800}
//           spaceBetween={20}
//           loop={products.length > 3}
//           grabCursor
//           breakpoints={{
//             300: { slidesPerView: 2, spaceBetween: 10 },
//             576: { slidesPerView: 3 },
//             768: { slidesPerView: 4 },
//             992: { slidesPerView: 4 },
//             1200: { slidesPerView: 4 },
//           }}
//         >
//           {products.map((item) => {
//             const current = selectedVariants[item._id] || item.currentVariant || {};
//             const variants = item.allVariants || [];
//             const hasSingleVariant = variants.length === 1;
//             const hasMultipleVariants = variants.length > 1;

//             const displayPrice = parseFloat(current?.displayPrice || current?.discountedPrice || current?.price || item.price || 0);
//             const originalPrice = parseFloat(current?.originalPrice || current?.mrp || item.mrp || displayPrice);
//             const discountPercent = calculateDiscountPercent(originalPrice, displayPrice);

//             const avgRating = item.avgRating || 0;
//             const totalRatings = item.totalRatings || 0;
//             const isWishlisted = wishlist.includes(item._id);

//             return (
//               <SwiperSlide key={item._id}>
//                 <div className="bs-card bg-white shadow-sm rounded overflow-hidden position-relative">
//                   <Link to={`/product/${item._id}`}>
//                     <div className="bs-card__imgWrap position-relative">
//                       <img
//                         src={current?.images?.[0] || item.displayImage}
//                         alt={item.name}
//                         className="img-fluid w-100"
//                         style={{ height: "280px", objectFit: "cover" }}
//                       />
//                       {/* {discountPercent > 0 && (
//                         <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded">
//                           {discountPercent}% OFF
//                         </div>
//                       )} */}

//                       {/* Wishlist Icon */}
//                       <div
//                         className="position-absolute"
//                         style={{
//                           top: '10px',
//                           right: '10px',
//                           cursor: 'pointer',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255,255,255,0.8)',
//                           borderRadius: '50%',
//                           width: '36px',
//                           height: '36px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center'
//                         }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           toggleWishlist(item._id);
//                         }}
//                       >
//                         {wishlistLoading[item._id] ? (
//                           <div className="spinner-border spinner-border-sm" role="status" />
//                         ) : isWishlisted ? (
//                           <i className="bi bi-heart-fill text-danger" style={{ fontSize: '20px' }} />
//                         ) : (
//                           <i className="bi bi-heart" style={{ fontSize: '20px' }} />
//                         )}
//                       </div>
//                     </div>
//                   </Link>

//                   <div className="p-3 text-center">
//                     {/* Ratings */}
//                     <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`bi ${i < Math.floor(avgRating) ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
//                           style={{ fontSize: "14px" }}
//                         />
//                       ))}
//                       <span className="small text-muted ms-2">
//                         {avgRating > 0 ? `${avgRating.toFixed(1)} (${totalRatings})` : "No reviews"}
//                       </span>
//                     </div>

//                     <div className="small text-muted mb-1">{item.brand?.name || "Unknown Brand"}</div>

//                     <Link to={`/product/${item._id}`} className="text-decoration-none">
//                       <h6 className="font-family-Poppins text-dark mb-3">{item.name}</h6>
//                     </Link>

//                     {/* Variant Section */}
//                     {variants.length > 0 && (
//                       <div className="mb-4">
//                         {hasSingleVariant && current && (
//                           <div className="d-flex justify-content-center mb-3">
//                             <VariantOption
//                               variant={current}
//                               isSelected={true}
//                               disabled={false}
//                               hasColor={isValidHexColor(current.hex)}
//                               displayText={getVariantDisplayText(current)}
//                               onClick={() => { }}
//                               getContrastColor={getContrastColor}
//                               showArrow={true}
//                             />
//                           </div>
//                         )}

//                         {hasMultipleVariants && (
//                           <div className="d-flex flex-wrap gap-3 justify-content-center mb-3">
//                             {variants.map((v) => {
//                               const isSel = current._id === v._id || current.sku === v.sku;
//                               const disabled = parseInt(v.stock || 0) <= 0;
//                               return (
//                                 <VariantOption
//                                   key={v._id || v.sku}
//                                   variant={v}
//                                   isSelected={isSel}
//                                   disabled={disabled}
//                                   hasColor={isValidHexColor(v.hex)}
//                                   displayText={getVariantDisplayText(v)}
//                                   onClick={() => handleVariantSelect(item._id, v)}
//                                   getContrastColor={getContrastColor}
//                                 />
//                               );
//                             })}
//                           </div>
//                         )}

//                         <SelectedVariantDisplay
//                           variant={current}
//                           getVariantDisplayText={getVariantDisplayText}
//                           isValidHexColor={isValidHexColor}
//                           getContrastColor={getContrastColor}
//                         />
//                       </div>
//                     )}

//                     {/* Price */}
//                     <div className="mb-4">
//                       <span className="fw-bold fs-4 text-dark">{formatPrice(displayPrice)}</span>
//                       {originalPrice > displayPrice && (
//                         <>
//                           <span className="text-muted text-decoration-line-through ms-3 fs-6">
//                             {formatPrice(originalPrice)}
//                           </span>
//                           <span className="text-danger fw-bold ms-3">({discountPercent}% OFF)</span>
//                         </>
//                       )}
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       className="btn btn-primary w-100 py-2"
//                       disabled={addingToCart[item._id] || parseInt(current.stock || 0) <= 0}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleAddToCart(item);
//                       }}
//                     >
//                       {addingToCart[item._id] ? "Adding..." : parseInt(current.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default BestSellers;




















// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link, useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

// // Selected Variant Display
// const SelectedVariantDisplay = ({ variant, getVariantDisplayText, isValidHexColor, getContrastColor }) => {
//   if (!variant) return null;
//   const variantText = getVariantDisplayText(variant);
//   const hasColor = variant.hex && isValidHexColor(variant.hex);
//   const stock = parseInt(variant.stock || 0);
//   const isInStock = stock > 0;

//   return (
//     <div className="selected-variant-display text-center">
//       <div className="small text-muted mb-1">
//         <strong>Selected:</strong>
//       </div>
//       <div className="d-flex justify-content-center align-items-center mb-2">
//         {hasColor ? (
//           <>
//             <div
//               className="color-dot me-2"
//               style={{
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '50%',
//                 backgroundColor: variant.hex,
//                 border: '2px solid #007bff',
//                 boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               {isInStock && (
//                 <span style={{ color: getContrastColor(variant.hex), fontSize: '14px' }}>✓</span>
//               )}
//             </div>
//             <span className="fw-medium">{variantText}</span>
//           </>
//         ) : (
//           <div
//             className="selected-variant-box px-3 py-2"
//             style={{
//               border: '2px solid #007bff',
//               borderRadius: '6px',
//               backgroundColor: '#f8f9fa',
//               color: '#007bff',
//               fontWeight: '600',
//               fontSize: '14px',
//               minWidth: '100px',
//               textAlign: 'center'
//             }}
//           >
//             {variantText}
//           </div>
//         )}
//       </div>
//       <div className="mt-1 small">
//         {isInStock ? (
//           <span className="text-success">
//             <i className="bi bi-check-circle me-1"></i>
//             In Stock ({stock} available)
//           </span>
//         ) : (
//           <span className="text-danger">
//             <i className="bi bi-x-circle me-1"></i>
//             Out of Stock
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Variant Option
// const VariantOption = ({
//   variant,
//   isSelected,
//   disabled,
//   hasColor,
//   displayText,
//   onClick,
//   getContrastColor,
//   showArrow = false
// }) => {
//   const isActuallyDisabled = disabled && !showArrow;

//   return (
//     <div className="text-center">
//       <div
//         className={`variant-option ${isSelected ? "selected" : ""} ${isActuallyDisabled ? "disabled" : ""}`}
//         style={{
//           width: hasColor ? '32px' : 'auto',
//           height: '32px',
//           minWidth: hasColor ? '32px' : 'auto',
//           borderRadius: hasColor ? '50%' : '4px',
//           border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
//           backgroundColor: hasColor ? variant.hex : '#f8f9fa',
//           color: hasColor ? getContrastColor(variant.hex) : '#333',
//           cursor: isActuallyDisabled ? 'not-allowed' : 'pointer',
//           opacity: isActuallyDisabled ? 0.4 : 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: hasColor ? 'center' : 'space-between',
//           padding: hasColor ? '0' : '4px 8px',
//           fontSize: '12px',
//           fontWeight: isSelected ? 'bold' : 'normal',
//           transition: 'all 0.2s ease',
//           boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : 'none',
//           position: 'relative'
//         }}
//         onClick={() => !isActuallyDisabled && onClick()}
//         title={`${displayText}${isActuallyDisabled ? ' (Out of Stock)' : ''}`}
//       >
//         {hasColor ? (
//           <span style={{ fontSize: '8px', fontWeight: 'bold' }}>
//             {displayText.length > 4 ? displayText.substring(0, 3) + '..' : displayText}
//           </span>
//         ) : (
//           <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//             <span className="text-variant flex-grow-1">
//               {displayText.length > 6 ? displayText.substring(0, 5) + '..' : displayText}
//             </span>
//             {showArrow && (
//               <span style={{ color: '#007bff', fontSize: '12px', fontWeight: 'bold' }}>▽</span>
//             )}
//           </div>
//         )}
//         {isSelected && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '-4px',
//               right: '-4px',
//               width: '10px',
//               height: '10px',
//               borderRadius: '50%',
//               backgroundColor: '#007bff',
//               border: '2px solid white',
//               boxShadow: '0 0 2px rgba(0,0,0,0.3)'
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   const navigate = useNavigate();

//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     if (normalized === "transparent") return false;
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(normalized);
//   }, []);

//   const getVariantDisplayText = useCallback((variant) => {
//     if (!variant) return "DEFAULT";
//     const text = variant.shadeName || variant.name || variant.size || variant.ml || variant.weight || "DEFAULT";
//     return text.toUpperCase();
//   }, []);

//   const getContrastColor = useCallback((hexColor) => {
//     if (!hexColor) return '#000';
//     const hex = hexColor.replace('#', '');
//     const r = parseInt(hex.substr(0, 2), 16);
//     const g = parseInt(hex.substr(2, 2), 16);
//     const b = parseInt(hex.substr(4, 2), 16);
//     const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//     return brightness > 128 ? '#000' : '#fff';
//   }, []);

//   // ✅ Function to generate product URL with variant support
//   const getProductUrl = useCallback((product, variant = null) => {
//     if (!product) return '#';

//     // Get the variant to use
//     const targetVariant = variant || selectedVariants[product._id] || product.currentVariant;

//     // Priority for URL:
//     // 1. If variant has a slug, use variant slug
//     // 2. If product has slugs array, use first product slug
//     // 3. Fallback to product _id

//     // Check if variant has a slug
//     if (targetVariant && targetVariant.slug) {
//       return `/product/${targetVariant.slug}`;
//     }

//     // Check if product has slugs
//     if (product.slugs && product.slugs.length > 0) {
//       const productSlug = product.slugs[0];
//       // If variant has SKU, add as query parameter
//       if (targetVariant && targetVariant.sku) {
//         return `/product/${productSlug}?variant=${targetVariant.sku}`;
//       }
//       return `/product/${productSlug}`;
//     }

//     // Fallback to product _id with variant SKU if available
//     if (targetVariant && targetVariant.sku) {
//       return `/product/${product._id}?variant=${targetVariant.sku}`;
//     }

//     // Final fallback
//     return `/product/${product._id}`;
//   }, [selectedVariants]);

//   const handleVariantSelect = useCallback((productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));

//     // Optional: Update URL without navigation (just for demonstration)
//     const product = products.find(p => p._id === productId);
//     if (product) {
//       console.log("Selected variant URL would be:", getProductUrl(product, variant));
//     }
//   }, [products, getProductUrl]);

//   // === WISHLIST LOGIC ===
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         let isLoggedIn = false;
//         try {
//           await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//           isLoggedIn = true;
//         } catch { }

//         if (!isLoggedIn) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//           if (Array.isArray(res.data.wishlist)) {
//             setWishlist(res.data.wishlist.map(item => item._id));
//           }
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   const toggleWishlist = async (productId) => {
//     try {
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter(id => id !== productId);
//           toast.success("Removed from wishlist (guest mode)");
//         } else {
//           updated.push(productId);
//           toast.success("Added to wishlist (guest mode)");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//       } else {
//         const res = await axios.post(
//           `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//           {},
//           { withCredentials: true }
//         );
//         if (res.data.wishlist) {
//           setWishlist(res.data.wishlist.map(item => item._id));
//           toast.success("Wishlist updated!");
//         }
//       }
//     } catch (err) {
//       console.error("Wishlist toggle error:", err);
//       toast.error("Failed to update wishlist");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // === ADD TO CART + AUTO REDIRECT TO /cart ===
//   const handleAddToCart = async (product) => {
//     const productId = product._id;
//     if (!productId) return;

//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     const allVariants = product.allVariants || [];
//     const selectedVariant = selectedVariants[productId] || product.currentVariant || allVariants[0];

//     if (!selectedVariant) {
//       toast.error("No variant selected");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const stock = parseInt(selectedVariant.stock || 0);
//     if (stock <= 0) {
//       toast.error("Out of stock");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//     const variantSku = selectedVariant.sku || selectedVariant._id || variantId;

//     const variantData = {
//       variantId,
//       variantSku,
//       name: getVariantDisplayText(selectedVariant),
//       shadeName: selectedVariant.shadeName,
//       hex: selectedVariant.hex,
//       price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       image: selectedVariant.images?.[0] || selectedVariant.image || product.displayImage,
//       stock,
//       slug: selectedVariant.slug, // Added slug for URL sharing
//     };

//     try {
//       let isLoggedIn = false;
//       try {
//         await fetch("https://beauty.joyory.com/api/user/profile", { credentials: "include" });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           item => item.productId === productId && item.variantId === variantId
//         );

//         if (existingIndex >= 0) {
//           guestCart[existingIndex].quantity += 1;
//         } else {
//           guestCart.push({
//             productId,
//             productName: product.name,
//             productImage: variantData.image,
//             brandName: product.brand?.name || "Unknown Brand",
//             variantId,
//             variantSku,
//             variantName: variantData.name,
//             shadeName: variantData.shadeName,
//             hex: variantData.hex,
//             price: variantData.price,
//             quantity: 1,
//             stock: variantData.stock,
//             isGuest: true,
//             addedAt: new Date().toISOString(),
//             variantSlug: variantData.slug, // Store variant slug for sharing
//           });
//         }
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       } else {
//         const res = await fetch("https://beauty.joyory.com/api/user/cart/add", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             productId,
//             variants: [{ variantSku, quantity: 1 }]
//           })
//         });
//         const data = await res.json();
//         if (!data.success) {
//           toast.error(data.message || "Failed to add");
//           setAddingToCart(prev => ({ ...prev, [productId]: false }));
//           return;
//         }
//       }

//       toast.success("Added to cart! Redirecting to cart...");
//       setTimeout(() => {
//         navigate("/cartpage");
//       }, 1500);

//     } catch (err) {
//       toast.error("Error - added to guest cart");
//       let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       guestCart.push({
//         productId,
//         variantId,
//         variantName: variantData.name,
//         price: variantData.price,
//         quantity: 1,
//         image: variantData.image,
//         isGuest: true,
//         variantSlug: variantData.slug,
//       });
//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       toast.success("Added to cart (Guest)! Redirecting...");
//       setTimeout(() => {
//         navigate("/cartpage");
//       }, 1500);
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();
//         const raw = Array.isArray(json) ? json : json?.products || [];

//         const processed = raw.map(p => {
//           const variants = p.variants || [];

//           // Ensure variants have required properties
//           const enrichedVariants = variants.map(v => ({
//             ...v,
//             slug: v.slug || null, // Ensure slug property exists
//           }));

//           let current = selectedVariants[p._id] ||
//             enrichedVariants.find(v => parseInt(v.stock || 0) > 0) ||
//             enrichedVariants[0] || {};

//           if (enrichedVariants.length === 1 && !selectedVariants[p._id]) {
//             setSelectedVariants(prev => ({ ...prev, [p._id]: enrichedVariants[0] }));
//           }

//           let image = current?.images?.[0] || p.images?.[0] || "";
//           if (image && !image.startsWith("http")) {
//             image = `https://res.cloudinary.com/dekngswix/image/upload/${image}`;
//           }

//           return {
//             ...p,
//             displayImage: image || "https://placehold.co/400x400?text=No+Image",
//             currentVariant: current,
//             allVariants: enrichedVariants,
//             avgRating: p.avgRating || 0,
//             totalRatings: p.totalRatings || 0,
//             // Ensure product has slugs array
//             slugs: p.slugs || [],
//           };
//         });

//         setProducts(processed);
//       } catch (err) {
//         console.error("BestSellers load error:", err);
//       }
//     };
//     load();
//   }, [selectedVariants]);

//   const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString("en-IN")}`;
//   const calculateDiscountPercent = useCallback((original, current) => {
//     if (original > current) return Math.round(((original - current) / original) * 100);
//     return 0;
//   }, []);

//   return (
//     <section className="bestSellers container-fluid py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="bestSellers__heading text-center mt-3 mb-4 font-family-Playfair spacing">
//         BEST SELLERS
//       </h2>

//       <div className="mobile-responsive-code">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           navigation={true}
//           autoplay={{ delay: 2500 }}
//           speed={800}
//           spaceBetween={20}
//           loop={products.length > 3}
//           grabCursor
//           breakpoints={{
//             300: { slidesPerView: 2, spaceBetween: 10 },
//             576: { slidesPerView: 2.5 },
//             768: { slidesPerView: 3 },
//             992: { slidesPerView: 4 },
//             1200: { slidesPerView: 5 },
//           }}
//         >
//           {products.map((item) => {
//             const current = selectedVariants[item._id] || item.currentVariant || {};
//             const variants = item.allVariants || [];
//             const hasSingleVariant = variants.length === 1;
//             const hasMultipleVariants = variants.length > 1;

//             const displayPrice = parseFloat(current?.displayPrice || current?.discountedPrice || current?.price || item.price || 0);
//             const originalPrice = parseFloat(current?.originalPrice || current?.mrp || item.mrp || displayPrice);
//             const discountPercent = calculateDiscountPercent(originalPrice, displayPrice);

//             const avgRating = item.avgRating || 0;
//             const totalRatings = item.totalRatings || 0;
//             const isWishlisted = wishlist.includes(item._id);

//             // Get product URL with selected variant
//             const productUrl = getProductUrl(item, current);

//             return (
//               <SwiperSlide key={item._id}>
//                 <div className="bs-card bg-white shadow-sm rounded overflow-hidden position-relative">
//                   {/* Product Image Link */}
//                   <Link to={productUrl}>
//                     <div className="bs-card__imgWrap position-relative">
//                       <img
//                         src={current?.images?.[0] || item.displayImage}
//                         alt={item.name}
//                         className="img-fluid w-100"
//                         style={{ height: "280px", objectFit: "cover" }}
//                       />

//                       {/* Wishlist Icon */}
//                       <div
//                         className="position-absolute"
//                         style={{
//                           top: '10px',
//                           right: '10px',
//                           cursor: 'pointer',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255,255,255,0.8)',
//                           borderRadius: '50%',
//                           width: '36px',
//                           height: '36px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center'
//                         }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           toggleWishlist(item._id);
//                         }}
//                       >
//                         {wishlistLoading[item._id] ? (
//                           <div className="spinner-border spinner-border-sm" role="status" />
//                         ) : isWishlisted ? (
//                           <i className="bi bi-heart-fill text-danger" style={{ fontSize: '20px' }} />
//                         ) : (
//                           <i className="bi bi-heart" style={{ fontSize: '20px' }} />
//                         )}
//                       </div>
//                     </div>
//                   </Link>

//                   <div className="p-3 text-center">
//                     {/* Ratings */}
//                     <div className="mb-2 d-flex align-items-center justify-content-center gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`bi ${i < Math.floor(avgRating) ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
//                           style={{ fontSize: "14px" }}
//                         />
//                       ))}
//                       <span className="small text-muted ms-2">
//                         {avgRating > 0 ? `${avgRating.toFixed(1)} (${totalRatings})` : "No reviews"}
//                       </span>
//                     </div>

//                     <div className="small text-muted mb-1">{item.brand?.name || "Unknown Brand"}</div>

//                     {/* Product Name Link */}
//                     <Link to={productUrl} className="text-decoration-none">
//                       <h6 className="font-family-Poppins text-dark mb-3">{item.name}</h6>
//                     </Link>

//                     {/* Variant Section */}
//                     {variants.length > 0 && (
//                       <div className="mb-4">
//                         {hasSingleVariant && current && (
//                           <div className="d-flex justify-content-center mb-3">
//                             <VariantOption
//                               variant={current}
//                               isSelected={true}
//                               disabled={false}
//                               hasColor={isValidHexColor(current.hex)}
//                               displayText={getVariantDisplayText(current)}
//                               onClick={() => { }}
//                               getContrastColor={getContrastColor}
//                               showArrow={true}
//                             />
//                           </div>
//                         )}

//                         {hasMultipleVariants && (
//                           <div className="d-flex flex-wrap gap-3 justify-content-center mb-3">
//                             {variants.map((v) => {
//                               const isSel = current._id === v._id || current.sku === v.sku;
//                               const disabled = parseInt(v.stock || 0) <= 0;
//                               return (
//                                 <VariantOption
//                                   key={v._id || v.sku}
//                                   variant={v}
//                                   isSelected={isSel}
//                                   disabled={disabled}
//                                   hasColor={isValidHexColor(v.hex)}
//                                   displayText={getVariantDisplayText(v)}
//                                   onClick={() => handleVariantSelect(item._id, v)}
//                                   getContrastColor={getContrastColor}
//                                 />
//                               );
//                             })}
//                           </div>
//                         )}

//                         <SelectedVariantDisplay
//                           variant={current}
//                           getVariantDisplayText={getVariantDisplayText}
//                           isValidHexColor={isValidHexColor}
//                           getContrastColor={getContrastColor}
//                         />
//                       </div>
//                     )}

//                     {/* Price */}
//                     <div className="mb-4">
//                       <span className="fw-bold fs-4 text-dark">{formatPrice(displayPrice)}</span>
//                       {originalPrice > displayPrice && (
//                         <>
//                           <span className="text-muted text-decoration-line-through ms-3 fs-6">
//                             {formatPrice(originalPrice)}
//                           </span>
//                           <span className="text-danger fw-bold ms-3">({discountPercent}% OFF)</span>
//                         </>
//                       )}
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       className="btn btn-primary w-100 py-2"
//                       disabled={addingToCart[item._id] || parseInt(current.stock || 0) <= 0}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleAddToCart(item);
//                       }}
//                     >
//                       {addingToCart[item._id] ? "Adding..." : parseInt(current.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>

//                     {/* Shareable Link Info (Optional) */}
//                     {/* {current && current.slug && (
//                       <div className="mt-2 small text-muted">
//                         <small>
//                           Share URL: <code style={{ fontSize: '10px' }}>{current.slug}</code>
//                         </small>
//                       </div>
//                     )} */}
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default BestSellers;

























// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link, useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

// // Selected Variant Display
// const SelectedVariantDisplay = ({ variant, getVariantDisplayText, isValidHexColor, getContrastColor }) => {
//   if (!variant) return null;
//   const variantText = getVariantDisplayText(variant);
//   const hasColor = variant.hex && isValidHexColor(variant.hex);
//   const stock = parseInt(variant.stock || 0);
//   const isInStock = stock > 0;

//   return (
//     <div className="selected-variant-display text-center">
//       <div className="small text-muted mb-1">
//         <strong>Selected:</strong>
//       </div>
//       <div className="d-flex justify-content-center align-items-center mb-2">
//         {hasColor ? (
//           <>
//             <div
//               className="color-dot me-2"
//               style={{
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '50%',
//                 backgroundColor: variant.hex,
//                 border: '2px solid #007bff',
//                 boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               {isInStock && (
//                 <span style={{ color: getContrastColor(variant.hex), fontSize: '14px' }}>✓</span>
//               )}
//             </div>
//             <span className="fw-medium">{variantText}</span>
//           </>
//         ) : (
//           <div
//             className="selected-variant-box px-3 py-2"
//             style={{
//               border: '2px solid #007bff',
//               borderRadius: '6px',
//               backgroundColor: '#f8f9fa',
//               color: '#007bff',
//               fontWeight: '600',
//               fontSize: '14px',
//               minWidth: '100px',
//               textAlign: 'center'
//             }}
//           >
//             {variantText}
//           </div>
//         )}
//       </div>
//       <div className="mt-1 small">
//         {isInStock ? (
//           <span className="text-success">
//             <i className="bi bi-check-circle me-1"></i>
//             In Stock ({stock} available)
//           </span>
//         ) : (
//           <span className="text-danger">
//             <i className="bi bi-x-circle me-1"></i>
//             Out of Stock
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Variant Option
// const VariantOption = ({
//   variant,
//   isSelected,
//   disabled,
//   hasColor,
//   displayText,
//   onClick,
//   getContrastColor,
//   showArrow = false
// }) => {
//   const isActuallyDisabled = disabled && !showArrow;

//   return (
//     <div className="text-center">
//       <div
//         className={`variant-option ${isSelected ? "selected" : ""} ${isActuallyDisabled ? "disabled" : ""}`}
//         style={{
//           width: hasColor ? '32px' : 'auto',
//           height: '32px',
//           minWidth: hasColor ? '32px' : 'auto',
//           borderRadius: hasColor ? '50%' : '4px',
//           border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
//           backgroundColor: hasColor ? variant.hex : '#f8f9fa',
//           color: hasColor ? getContrastColor(variant.hex) : '#333',
//           cursor: isActuallyDisabled ? 'not-allowed' : 'pointer',
//           opacity: isActuallyDisabled ? 0.4 : 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: hasColor ? 'center' : 'space-between',
//           padding: hasColor ? '0' : '4px 8px',
//           fontSize: '12px',
//           fontWeight: isSelected ? 'bold' : 'normal',
//           transition: 'all 0.2s ease',
//           boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : 'none',
//           position: 'relative'
//         }}
//         onClick={() => !isActuallyDisabled && onClick()}
//         title={`${displayText}${isActuallyDisabled ? ' (Out of Stock)' : ''}`}
//       >
//         {hasColor ? (
//           <span style={{ fontSize: '8px', fontWeight: 'bold' }}>
//             {displayText.length > 4 ? displayText.substring(0, 3) + '..' : displayText}
//           </span>
//         ) : (
//           <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//             <span className="text-variant flex-grow-1">
//               {displayText.length > 6 ? displayText.substring(0, 5) + '..' : displayText}
//             </span>
//             {showArrow && (
//               <span style={{ color: '#007bff', fontSize: '12px', fontWeight: 'bold' }}>▽</span>
//             )}
//           </div>
//         )}
//         {isSelected && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '-4px',
//               right: '-4px',
//               width: '10px',
//               height: '10px',
//               borderRadius: '50%',
//               backgroundColor: '#007bff',
//               border: '2px solid white',
//               boxShadow: '0 0 2px rgba(0,0,0,0.3)'
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   const navigate = useNavigate();

//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     if (normalized === "transparent") return false;
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(normalized);
//   }, []);

//   const getVariantDisplayText = useCallback((variant) => {
//     if (!variant) return "DEFAULT";
//     const text = variant.shadeName || variant.name || variant.size || variant.ml || variant.weight || "DEFAULT";
//     return text.toUpperCase();
//   }, []);

//   const getContrastColor = useCallback((hexColor) => {
//     if (!hexColor) return '#000';
//     const hex = hexColor.replace('#', '');
//     const r = parseInt(hex.substr(0, 2), 16);
//     const g = parseInt(hex.substr(2, 2), 16);
//     const b = parseInt(hex.substr(4, 2), 16);
//     const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//     return brightness > 128 ? '#000' : '#fff';
//   }, []);

//   // ✅ UPDATED: Function to get product slug for navigation
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

//   // ✅ UPDATED: Function to generate product URL with slug support
//   const getProductUrl = useCallback((product, variant = null) => {
//     if (!product) return '#';

//     // Get the product slug
//     const productSlug = getProductSlug(product);

//     // If we have a variant with its own slug, use that
//     const targetVariant = variant || selectedVariants[product._id] || product.currentVariant;

//     if (targetVariant && targetVariant.slug) {
//       return `/product/${targetVariant.slug}`;
//     }

//     // Otherwise use the product slug
//     if (productSlug) {
//       return `/product/${productSlug}`;
//     }

//     // Final fallback to product ID
//     return `/product/${product._id}`;
//   }, [selectedVariants, getProductSlug]);

//   const handleVariantSelect = useCallback((productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));

//     // Optional: Update URL without navigation (just for demonstration)
//     const product = products.find(p => p._id === productId);
//     if (product) {
//       console.log("Selected variant URL would be:", getProductUrl(product, variant));
//     }
//   }, [products, getProductUrl]);

//   // === WISHLIST LOGIC ===
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         let isLoggedIn = false;
//         try {
//           await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//           isLoggedIn = true;
//         } catch { }

//         if (!isLoggedIn) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//           if (Array.isArray(res.data.wishlist)) {
//             setWishlist(res.data.wishlist.map(item => item._id));
//           }
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   const toggleWishlist = async (productId) => {
//     try {
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter(id => id !== productId);
//           toast.success("Removed from wishlist (guest mode)");
//         } else {
//           updated.push(productId);
//           toast.success("Added to wishlist (guest mode)");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//       } else {
//         const res = await axios.post(
//           `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//           {},
//           { withCredentials: true }
//         );
//         if (res.data.wishlist) {
//           setWishlist(res.data.wishlist.map(item => item._id));
//           toast.success("Wishlist updated!");
//         }
//       }
//     } catch (err) {
//       console.error("Wishlist toggle error:", err);
//       toast.error("Failed to update wishlist");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // === ADD TO CART + AUTO REDIRECT TO /cart ===
//   const handleAddToCart = async (product) => {
//     const productId = product._id;
//     if (!productId) return;

//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     const allVariants = product.allVariants || [];
//     const selectedVariant = selectedVariants[productId] || product.currentVariant || allVariants[0];

//     if (!selectedVariant) {
//       toast.error("No variant selected");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const stock = parseInt(selectedVariant.stock || 0);
//     if (stock <= 0) {
//       toast.error("Out of stock");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//     const variantSku = selectedVariant.sku || selectedVariant._id || variantId;

//     const variantData = {
//       variantId,
//       variantSku,
//       name: getVariantDisplayText(selectedVariant),
//       shadeName: selectedVariant.shadeName,
//       hex: selectedVariant.hex,
//       price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       image: selectedVariant.images?.[0] || selectedVariant.image || product.displayImage,
//       stock,
//       slug: selectedVariant.slug, // Added slug for URL sharing
//     };

//     try {
//       let isLoggedIn = false;
//       try {
//         await fetch("https://beauty.joyory.com/api/user/profile", { credentials: "include" });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           item => item.productId === productId && item.variantId === variantId
//         );

//         if (existingIndex >= 0) {
//           guestCart[existingIndex].quantity += 1;
//         } else {
//           guestCart.push({
//             productId,
//             productName: product.name,
//             productImage: variantData.image,
//             brandName: product.brand?.name || "Unknown Brand",
//             variantId,
//             variantSku,
//             variantName: variantData.name,
//             shadeName: variantData.shadeName,
//             hex: variantData.hex,
//             price: variantData.price,
//             quantity: 1,
//             stock: variantData.stock,
//             isGuest: true,
//             addedAt: new Date().toISOString(),
//             variantSlug: variantData.slug, // Store variant slug for sharing
//           });
//         }
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       } else {
//         const res = await fetch("https://beauty.joyory.com/api/user/cart/add", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             productId,
//             variants: [{ variantSku, quantity: 1 }]
//           })
//         });
//         const data = await res.json();
//         if (!data.success) {
//           toast.error(data.message || "Failed to add");
//           setAddingToCart(prev => ({ ...prev, [productId]: false }));
//           return;
//         }
//       }

//       toast.success("Added to cart! Redirecting to cart...");
//       setTimeout(() => {
//         navigate("/cartpage");
//       }, 1500);

//     } catch (err) {
//       toast.error("Error - added to guest cart");
//       let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       guestCart.push({
//         productId,
//         variantId,
//         variantName: variantData.name,
//         price: variantData.price,
//         quantity: 1,
//         image: variantData.image,
//         isGuest: true,
//         variantSlug: variantData.slug,
//       });
//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       toast.success("Added to cart (Guest)! Redirecting...");
//       setTimeout(() => {
//         navigate("/cartpage");
//       }, 1500);
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();
//         const raw = Array.isArray(json) ? json : json?.products || [];

//         const processed = raw.map(p => {
//           const variants = p.variants || [];

//           // Ensure variants have required properties
//           const enrichedVariants = variants.map(v => ({
//             ...v,
//             slug: v.slug || null, // Ensure slug property exists
//           }));

//           let current = selectedVariants[p._id] ||
//             enrichedVariants.find(v => parseInt(v.stock || 0) > 0) ||
//             enrichedVariants[0] || {};

//           if (enrichedVariants.length === 1 && !selectedVariants[p._id]) {
//             setSelectedVariants(prev => ({ ...prev, [p._id]: enrichedVariants[0] }));
//           }

//           let image = current?.images?.[0] || p.images?.[0] || "";
//           if (image && !image.startsWith("http")) {
//             image = `https://res.cloudinary.com/dekngswix/image/upload/${image}`;
//           }

//           return {
//             ...p,
//             displayImage: image || "https://placehold.co/400x400?text=No+Image",
//             currentVariant: current,
//             allVariants: enrichedVariants,
//             avgRating: p.avgRating || 0,
//             totalRatings: p.totalRatings || 0,
//             // Ensure product has slugs array
//             slugs: p.slugs || [],
//           };
//         });

//         setProducts(processed);
//       } catch (err) {
//         console.error("BestSellers load error:", err);
//       }
//     };
//     load();
//   }, [selectedVariants]);

//   const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString("en-IN")}`;
//   const calculateDiscountPercent = useCallback((original, current) => {
//     if (original > current) return Math.round(((original - current) / original) * 100);
//     return 0;
//   }, []);

//   return (
//     <section className="bestSellers container-fluid py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="bestSellers__heading text-center mt-3 mb-4 font-family-Playfair spacing">
//         BEST SELLERS
//       </h2>

//       <div className="mobile-responsive-code">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           navigation={true}
//           // autoplay={{ delay: 2500 }}
//           // speed={800}
//           // loop={products.length > 3}
//           spaceBetween={20}
//           grabCursor
//           breakpoints={{
//             300: { slidesPerView: 2, spaceBetween: 10 },
//             576: { slidesPerView: 2.5 },
//             768: { slidesPerView: 3 },
//             992: { slidesPerView: 4 },
//             1200: { slidesPerView: 5 },
//           }}
//         >
//           {products.map((item) => {
//             const current = selectedVariants[item._id] || item.currentVariant || {};
//             const variants = item.allVariants || [];
//             const hasSingleVariant = variants.length === 1;
//             const hasMultipleVariants = variants.length > 1;

//             const displayPrice = parseFloat(current?.displayPrice || current?.discountedPrice || current?.price || item.price || 0);
//             const originalPrice = parseFloat(current?.originalPrice || current?.mrp || item.mrp || displayPrice);
//             const discountPercent = calculateDiscountPercent(originalPrice, displayPrice);

//             const avgRating = item.avgRating || 0;
//             const totalRatings = item.totalRatings || 0;
//             const isWishlisted = wishlist.includes(item._id);

//             // ✅ UPDATED: Get product URL with slug
//             const productUrl = getProductUrl(item, current);

//             return (
//               <SwiperSlide key={item._id}>
//                 <div className="bs-card overflow-hidden position-relative">
//                   {/* Product Image Link - Using slug */}
//                   <Link to={productUrl}>
//                     <div className="bs-card__imgWrap position-relative">
//                       <img
//                         src={current?.images?.[0] || item.displayImage}
//                         alt={item.name}
//                         className="img-fluid w-100"
//                         style={{ height: "280px", objectFit: "cover" }}
//                       />

//                       {/* Wishlist Icon */}
//                       <div
//                         className="position-absolute"
//                         style={{
//                           top: '10px',
//                           right: '10px',
//                           cursor: 'pointer',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255,255,255,0.8)',
//                           borderRadius: '50%',
//                           width: '36px',
//                           height: '36px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center'
//                         }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           toggleWishlist(item._id);
//                         }}
//                       >
//                         {wishlistLoading[item._id] ? (
//                           <div className="spinner-border spinner-border-sm" role="status" />
//                         ) : isWishlisted ? (
//                           <i className="bi bi-heart-fill text-danger" style={{ fontSize: '20px' }} />
//                         ) : (
//                           <i className="bi bi-heart" style={{ fontSize: '20px' }} />
//                         )}
//                       </div>
//                     </div>
//                   </Link>

//                   <div className="pt-3 text-start">
//                     {/* Ratings */}
//                     <div className="mb-2 d-flex align-items-center justify-content-start gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`bi ${i < Math.floor(avgRating) ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
//                           style={{ fontSize: "14px" }}
//                         />
//                       ))}
//                       <span className="small text-muted ms-2">
//                         {avgRating > 0 ? `${avgRating.toFixed(1)} (${totalRatings})` : "No reviews"}
//                       </span>
//                     </div>

//                     <div className="small text-muted mb-1">{item.brand?.name || "Unknown Brand"}</div>

//                     {/* Product Name Link - Using slug */}
//                     <Link to={productUrl} className="text-decoration-none">
//                       <h6 className="font-family-Poppins text-dark mb-3">{item.name}</h6>
//                     </Link>

//                     {/* Variant Section */}
//                     {variants.length > 0 && (
//                       <div className="mb-4">
//                         {hasSingleVariant && current && (
//                           <div className="d-flex justify-content-start mb-3">
//                             <VariantOption
//                               variant={current}
//                               isSelected={true}
//                               disabled={false}
//                               hasColor={isValidHexColor(current.hex)}
//                               displayText={getVariantDisplayText(current)}
//                               onClick={() => { }}
//                               getContrastColor={getContrastColor}
//                               showArrow={true}
//                             />
//                           </div>
//                         )}

//                         {/* {hasMultipleVariants && (
//                           <div className="d-flex flex-wrap gap-3 justify-content-start mb-3">
//                             {variants.map((v) => {
//                               const isSel = current._id === v._id || current.sku === v.sku;
//                               const disabled = parseInt(v.stock || 0) <= 0;
//                               return (
//                                 <VariantOption
//                                   key={v._id || v.sku}
//                                   variant={v}
//                                   isSelected={isSel}
//                                   disabled={disabled}
//                                   hasColor={isValidHexColor(v.hex)}
//                                   displayText={getVariantDisplayText(v)}
//                                   onClick={() => handleVariantSelect(item._id, v)}
//                                   getContrastColor={getContrastColor}
//                                 />
//                               );
//                             })}
//                           </div>
//                         )} */}


//                         {hasMultipleVariants && (
//                           <div className="mb-3">
//                             {/* First: Show color variants (with hex) */}
//                             {(() => {
//                               const colorVariants = variants.filter(v => isValidHexColor(v.hex));

//                               if (colorVariants.length > 0) {
//                                 return (
//                                   <div className="mb-3">
//                                     <div className="small text-muted mb-2">Color Options:</div>
//                                     <div className="d-flex flex-wrap gap-2 justify-content-start">
//                                       {colorVariants.map((v) => {
//                                         const isSel = current._id === v._id || current.sku === v.sku;
//                                         const disabled = parseInt(v.stock || 0) <= 0;
//                                         return (
//                                           <VariantOption
//                                             key={v._id || v.sku}
//                                             variant={v}
//                                             isSelected={isSel}
//                                             disabled={disabled}
//                                             hasColor={true}
//                                             displayText={getVariantDisplayText(v)}
//                                             onClick={() => handleVariantSelect(item._id, v)}
//                                             getContrastColor={getContrastColor}
//                                           />
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 );
//                               }
//                               return null;
//                             })()}

//                             {/* Second: Show text variants (without hex) */}
//                             {(() => {
//                               const textVariants = variants.filter(v => !isValidHexColor(v.hex));

//                               if (textVariants.length > 0) {
//                                 return (
//                                   <div>
//                                     <div className="small text-muted mb-2">Other Options:</div>
//                                     <div className="d-flex flex-wrap gap-2 justify-content-start">
//                                       {textVariants.map((v) => {
//                                         const isSel = current._id === v._id || current.sku === v.sku;
//                                         const disabled = parseInt(v.stock || 0) <= 0;
//                                         return (
//                                           <VariantOption
//                                             key={v._id || v.sku}
//                                             variant={v}
//                                             isSelected={isSel}
//                                             disabled={disabled}
//                                             hasColor={false}
//                                             displayText={getVariantDisplayText(v)}
//                                             onClick={() => handleVariantSelect(item._id, v)}
//                                             getContrastColor={getContrastColor}
//                                           />
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 );
//                               }
//                               return null;
//                             })()}
//                           </div>
//                         )}





//                         {/* <SelectedVariantDisplay
//                           variant={current}
//                           getVariantDisplayText={getVariantDisplayText}
//                           isValidHexColor={isValidHexColor}
//                           getContrastColor={getContrastColor}
//                         /> */}
//                       </div>
//                     )}

//                     {/* Price */}
//                     <div className="mb-4">
//                       <span className="fw-bold fs-4 text-dark">{formatPrice(displayPrice)}</span>
//                       {originalPrice > displayPrice && (
//                         <>
//                           <span className="text-muted text-decoration-line-through ms-3 fs-6">
//                             {formatPrice(originalPrice)}
//                           </span>
//                           <span className="text-danger fw-bold ms-3">({discountPercent}% OFF)</span>
//                         </>
//                       )}
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       className="btn btn-primary w-100 py-2"
//                       disabled={addingToCart[item._id] || parseInt(current.stock || 0) <= 0}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleAddToCart(item);
//                       }}
//                     >
//                       {addingToCart[item._id] ? "Adding..." : parseInt(current.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default BestSellers;




























// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link, useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

// // Selected Variant Display
// const SelectedVariantDisplay = ({ variant, getVariantDisplayText, isValidHexColor, getContrastColor }) => {
//   if (!variant) return null;
//   const variantText = getVariantDisplayText(variant);
//   const hasColor = variant.hex && isValidHexColor(variant.hex);
//   const stock = parseInt(variant.stock || 0);
//   const isInStock = stock > 0;

//   return (
//     <div className="selected-variant-display text-center">
//       <div className="small text-muted mb-1">
//         <strong>Selected:</strong>
//       </div>
//       <div className="d-flex justify-content-center align-items-center mb-2">
//         {hasColor ? (
//           <>
//             <div
//               className="color-dot me-2"
//               style={{
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '50%',
//                 backgroundColor: variant.hex,
//                 border: '2px solid #007bff',
//                 boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               {isInStock && (
//                 <span style={{ color: getContrastColor(variant.hex), fontSize: '14px' }}>✓</span>
//               )}
//             </div>
//             <span className="fw-medium">{variantText}</span>
//           </>
//         ) : (
//           <div
//             className="selected-variant-box px-3 py-2"
//             style={{
//               border: '2px solid #007bff',
//               borderRadius: '6px',
//               backgroundColor: '#f8f9fa',
//               color: '#007bff',
//               fontWeight: '600',
//               fontSize: '14px',
//               minWidth: '100px',
//               textAlign: 'center'
//             }}
//           >
//             {variantText}
//           </div>
//         )}
//       </div>
//       <div className="mt-1 small">
//         {isInStock ? (
//           <span className="text-success">
//             <i className="bi bi-check-circle me-1"></i>
//             In Stock ({stock} available)
//           </span>
//         ) : (
//           <span className="text-danger">
//             <i className="bi bi-x-circle me-1"></i>
//             Out of Stock
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Variant Option
// const VariantOption = ({
//   variant,
//   isSelected,
//   disabled,
//   hasColor,
//   displayText,
//   onClick,
//   getContrastColor,
//   showArrow = false
// }) => {
//   const isActuallyDisabled = disabled && !showArrow;

//   return (
//     <div className="text-center">
//       <div
//         className={`variant-option ${isSelected ? "selected" : ""} ${isActuallyDisabled ? "disabled" : ""}`}
//         style={{
//           width: hasColor ? '32px' : 'auto',
//           height: '32px',
//           minWidth: hasColor ? '32px' : 'auto',
//           borderRadius: hasColor ? '50%' : '4px',
//           border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
//           backgroundColor: hasColor ? variant.hex : '#f8f9fa',
//           color: hasColor ? getContrastColor(variant.hex) : '#333',
//           cursor: isActuallyDisabled ? 'not-allowed' : 'pointer',
//           opacity: isActuallyDisabled ? 0.4 : 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: hasColor ? 'center' : 'space-between',
//           padding: hasColor ? '0' : '4px 8px',
//           fontSize: '12px',
//           fontWeight: isSelected ? 'bold' : 'normal',
//           transition: 'all 0.2s ease',
//           boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : 'none',
//           position: 'relative'
//         }}
//         onClick={() => !isActuallyDisabled && onClick()}
//         title={`${displayText}${isActuallyDisabled ? ' (Out of Stock)' : ''}`}
//       >
//         {hasColor ? (
//           <span style={{ fontSize: '8px', fontWeight: 'bold' }}>
//             {displayText.length > 4 ? displayText.substring(0, 3) + '..' : displayText}
//           </span>
//         ) : (
//           <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//             <span className="text-variant flex-grow-1">
//               {displayText.length > 6 ? displayText.substring(0, 5) + '..' : displayText}
//             </span>
//             {showArrow && (
//               <span style={{ color: '#007bff', fontSize: '12px', fontWeight: 'bold' }}>▽</span>
//             )}
//           </div>
//         )}
//         {isSelected && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '-4px',
//               right: '-4px',
//               width: '10px',
//               height: '10px',
//               borderRadius: '50%',
//               backgroundColor: '#007bff',
//               border: '2px solid white',
//               boxShadow: '0 0 2px rgba(0,0,0,0.3)'
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   const navigate = useNavigate();

//   // Helper to check if hex color is valid and not default
//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== 'string') return false;
//     const normalizedHex = hex.trim().toLowerCase();

//     const defaultColors = ['#000000', '#000', '#ccc', '#cccccc', '#fff', '#ffffff', '#00000000', 'transparent'];
//     if (defaultColors.includes(normalizedHex)) return false;

//     const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
//     return hexRegex.test(normalizedHex);
//   }, []);

//   const getVariantDisplayText = useCallback((variant) => {
//     if (!variant) return "DEFAULT";

//     // First check for color variants
//     if (variant.hex && isValidHexColor(variant.hex)) {
//       return variant.shadeName || variant.name || "DEFAULT";
//     }

//     // For text variants
//     return variant.shadeName || variant.name || variant.size || variant.ml || variant.weight || "DEFAULT";
//   }, [isValidHexColor]);

//   const getContrastColor = useCallback((hexColor) => {
//     if (!hexColor) return '#000';
//     const hex = hexColor.replace('#', '');
//     const r = parseInt(hex.substr(0, 2), 16);
//     const g = parseInt(hex.substr(2, 2), 16);
//     const b = parseInt(hex.substr(4, 2), 16);
//     const brightness = (r * 299 + g * 587 + b * 114) / 1000;
//     return brightness > 128 ? '#000' : '#fff';
//   }, []);

//   // Helper to get variant type
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, [isValidHexColor]);

//   // Helper to get product slug for navigation
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

//   // Helper function to generate product URL with slug support
//   const getProductUrl = useCallback((product, variant = null) => {
//     if (!product) return '#';

//     // Get the product slug
//     const productSlug = getProductSlug(product);

//     // If we have a variant with its own slug, use that
//     const targetVariant = variant || selectedVariants[product._id] || product.currentVariant;

//     if (targetVariant && targetVariant.slug) {
//       return `/product/${targetVariant.slug}`;
//     }

//     // Otherwise use the product slug
//     if (productSlug) {
//       return `/product/${productSlug}`;
//     }

//     // Final fallback to product ID
//     return `/product/${product._id}`;
//   }, [selectedVariants, getProductSlug]);

//   const handleVariantSelect = useCallback((productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));

//     // Update the product display in state
//     setProducts(prevProducts =>
//       prevProducts.map(product => {
//         if (product._id === productId) {
//           return {
//             ...product,
//             currentVariant: variant,
//             displayImage: variant.images?.[0] || product.displayImage
//           };
//         }
//         return product;
//       })
//     );
//   }, []);

//   // === WISHLIST LOGIC ===
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         let isLoggedIn = false;
//         try {
//           await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//           isLoggedIn = true;
//         } catch { }

//         if (!isLoggedIn) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//           if (Array.isArray(res.data.wishlist)) {
//             setWishlist(res.data.wishlist.map(item => item._id));
//           }
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   const toggleWishlist = async (productId) => {
//     try {
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter(id => id !== productId);
//           toast.success("Removed from wishlist (guest mode)");
//         } else {
//           updated.push(productId);
//           toast.success("Added to wishlist (guest mode)");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//       } else {
//         const res = await axios.post(
//           `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//           {},
//           { withCredentials: true }
//         );
//         if (res.data.wishlist) {
//           setWishlist(res.data.wishlist.map(item => item._id));
//           toast.success("Wishlist updated!");
//         }
//       }
//     } catch (err) {
//       console.error("Wishlist toggle error:", err);
//       toast.error("Failed to update wishlist");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // ===================== UPDATED ADD TO CART FUNCTION - SAME AS FORYOU =====================
//   const handleAddToCart = async (product) => {
//     if (!product) {
//       toast.error("⚠️ Product not loaded yet.");
//       return;
//     }

//     console.log("🛒 Starting add to cart for:", product.name);

//     const productId = product._id;
//     if (!productId) {
//       toast.error("⚠️ Invalid product ID.");
//       return;
//     }

//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     // Get the currently selected variant
//     const selectedVariant = selectedVariants[product._id] || product.currentVariant;
//     if (!selectedVariant) {
//       toast.error("⚠️ No variant selected.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Check if selected variant is in stock
//     const stock = parseInt(selectedVariant.stock || 0);
//     if (stock <= 0) {
//       toast.error("❌ This variant is out of stock.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Get variant identifier
//     const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//     if (!variantId) {
//       toast.error("⚠️ This variant cannot be added to cart.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Prepare complete variant data for cart
//     const variantToAdd = {
//       // Essential identifiers
//       _id: variantId,
//       id: variantId,
//       sku: variantId,
//       variantId: variantId,
//       variantSku: variantId,

//       // Variant details
//       name: getVariantDisplayText(selectedVariant),
//       shadeName: selectedVariant.shadeName,
//       hex: selectedVariant.hex || "#ccc",
//       color: selectedVariant.hex || "#ccc",

//       // Prices
//       price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       originalPrice: parseFloat(selectedVariant.originalPrice || selectedVariant.mrp || product.mrp || 0),
//       discountedPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       displayPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       mrp: parseFloat(selectedVariant.mrp || product.mrp || 0),

//       // Stock and image
//       stock: stock,
//       image: selectedVariant.images?.[0] || selectedVariant.image || product.displayImage || "/placeholder.png",
//       images: selectedVariant.images || [product.displayImage || "/placeholder.png"],

//       // Additional variant info
//       ml: selectedVariant.ml,
//       size: selectedVariant.size,
//       weight: selectedVariant.weight,
//       variantType: getVariantType(selectedVariant) || 'default',
//       variantDisplayText: getVariantDisplayText(selectedVariant) || "Default",

//       // Quantity
//       quantity: 1,

//       // Product reference
//       productId: productId,
//       productName: product.name,
//       product: product,
//       brandName: product.brand?.name || "Unknown Brand",
//       brandId: product.brand?._id,

//       // Store for reference
//       rawVariant: selectedVariant
//     };

//     console.log("🚀 Final variant to add:", variantToAdd);

//     try {
//       let isLoggedIn = false;
//       let userId = null;

//       // Check if user is logged in
//       try {
//         const profileRes = await axios.get("https://beauty.joyory.com/api/user/profile", {
//           withCredentials: true
//         });
//         isLoggedIn = true;
//         userId = profileRes.data.user?._id;
//         console.log("👤 Logged-in user detected:", userId);
//       } catch {
//         console.log("👤 Guest user detected — using local cart");
//       }

//       // Cache the variant selection for future reference
//       const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//       cache[product._id] = variantToAdd;
//       localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//       const quantity = 1;

//       // ===================== GUEST USER FLOW =====================
//       if (!isLoggedIn) {
//         console.log("🛒 Guest cart process started...");

//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

//         // Check if same product with same variant already exists in cart
//         const existingIndex = guestCart.findIndex(
//           (item) =>
//             item.productId === product._id &&
//             item.variantId === variantToAdd.variantId
//         );

//         if (existingIndex >= 0) {
//           // Update quantity if variant already exists
//           const newQuantity = guestCart[existingIndex].quantity + quantity;
//           if (newQuantity <= stock) {
//             guestCart[existingIndex].quantity = newQuantity;
//             guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * newQuantity;
//             toast.success(`🛒 Updated quantity to ${newQuantity}`);
//           } else {
//             toast.warning(`⚠️ Only ${stock} items available in stock`);
//             guestCart[existingIndex].quantity = stock;
//             guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * stock;
//           }
//         } else {
//           // Add new variant to cart
//           const cartItem = {
//             // Product info
//             productId: product._id,
//             productName: product.name,
//             productImage: variantToAdd.image,
//             brandName: product.brand?.name || "Unknown Brand",
//             brandId: product.brand?._id,

//             // Variant info (CRITICAL FOR CART PAGE)
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             variantName: variantToAdd.name,
//             shadeName: variantToAdd.shadeName,
//             color: variantToAdd.color,
//             hex: variantToAdd.hex,
//             size: variantToAdd.size,
//             ml: variantToAdd.ml,
//             weight: variantToAdd.weight,
//             variantType: variantToAdd.variantType,
//             variantDisplayText: variantToAdd.variantDisplayText,

//             // Price and quantity
//             price: variantToAdd.price,
//             originalPrice: variantToAdd.originalPrice,
//             discountedPrice: variantToAdd.discountedPrice,
//             quantity: quantity,
//             totalPrice: variantToAdd.price * quantity,

//             // Stock
//             stock: variantToAdd.stock,

//             // Images
//             image: variantToAdd.image,
//             images: variantToAdd.images,

//             // Additional info
//             isGuest: true,
//             addedAt: new Date().toISOString(),

//             // Full objects for reference
//             product: {
//               _id: product._id,
//               name: product.name,
//               brandName: product.brand?.name,
//               description: product.description
//             },
//             variant: variantToAdd
//           };

//           guestCart.push(cartItem);
//           toast.success("🛒 Added to cart! Redirecting to cart...");
//         }

//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//         console.log("💾 Guest cart updated:", guestCart);

//         // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500); // Small delay so user sees toast

//         setAddingToCart(prev => ({ ...prev, [productId]: false }));
//         return; // CRITICAL: Return here to prevent further execution
//       }

//       // ===================== LOGGED-IN USER FLOW =====================
//       console.log("🔐 Logged-in user — sending to backend");

//       const payload = {
//         productId: product._id,
//         productName: product.name,
//         variants: [
//           {
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             quantity: quantity,
//             variantData: {
//               name: variantToAdd.name,
//               shadeName: variantToAdd.shadeName,
//               color: variantToAdd.color,
//               hex: variantToAdd.hex,
//               size: variantToAdd.size,
//               ml: variantToAdd.ml,
//               weight: variantToAdd.weight,
//               price: variantToAdd.price,
//               originalPrice: variantToAdd.originalPrice,
//               discountedPrice: variantToAdd.discountedPrice,
//               image: variantToAdd.image,
//               stock: variantToAdd.stock,
//               variantType: variantToAdd.variantType,
//               variantDisplayText: variantToAdd.variantDisplayText
//             }
//           },
//         ],
//       };

//       console.log("📦 Sending payload to backend:", payload);

//       const res = await axios.post(
//         "https://beauty.joyory.com/api/user/cart/add",
//         payload,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         toast.success("✅ Product added to cart! Redirecting to cart...");

//         // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500); // Small delay so user sees toast

//       } else {
//         toast.error(res.data.message || "❌ Failed to add product.");
//         setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       }
//     } catch (err) {
//       console.error("🔥 Add to Cart Error:", err);

//       // Check if it's already been added as guest (for 401 errors)
//       if (err.response?.status === 401) {
//         console.log("🔄 User is unauthorized, checking if already added to guest cart...");

//         // Check if item is already in guest cart
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           (item) => item.productId === product._id && item.variantId === variantToAdd.variantId
//         );

//         if (existingIndex === -1) {
//           console.log("🔄 Adding to guest cart as fallback...");

//           // Add to guest cart only if not already present
//           const cartItem = {
//             productId: product._id,
//             productName: product.name,
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             variantName: variantToAdd.name,
//             variantDisplayText: variantToAdd.variantDisplayText,
//             price: variantToAdd.price,
//             quantity: 1,
//             image: variantToAdd.image,
//             isGuest: true,
//             addedAt: new Date().toISOString()
//           };

//           guestCart.push(cartItem);
//           localStorage.setItem("guestCart", JSON.stringify(guestCart));

//           toast.success("🛒 Added to cart (Guest Mode)! Redirecting...");
//         } else {
//           console.log("✅ Item already exists in guest cart, not adding duplicate.");
//           toast.info("✅ Item already in cart! Redirecting...");
//         }

//         // AUTO REDIRECT TO CART PAGE
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500);

//       } else {
//         toast.error(err.response?.data?.message || "❌ Failed to add product to cart");
//       }
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(API_LIST);
//         const json = await res.json();
//         const raw = Array.isArray(json) ? json : json?.products || [];

//         const processed = raw.map(p => {
//           const variants = p.variants || [];

//           // Ensure variants have required properties
//           const enrichedVariants = variants.map(v => ({
//             ...v,
//             slug: v.slug || null, // Ensure slug property exists
//           }));

//           let current = selectedVariants[p._id] ||
//             enrichedVariants.find(v => parseInt(v.stock || 0) > 0) ||
//             enrichedVariants[0] || {};

//           if (enrichedVariants.length === 1 && !selectedVariants[p._id]) {
//             setSelectedVariants(prev => ({ ...prev, [p._id]: enrichedVariants[0] }));
//           }

//           let image = current?.images?.[0] || p.images?.[0] || "";
//           if (image && !image.startsWith("http")) {
//             image = `https://res.cloudinary.com/dekngswix/image/upload/${image}`;
//           }

//           return {
//             ...p,
//             displayImage: image || "https://placehold.co/400x400?text=No+Image",
//             currentVariant: current,
//             allVariants: enrichedVariants,
//             avgRating: p.avgRating || 0,
//             totalRatings: p.totalRatings || 0,
//             // Ensure product has slugs array
//             slugs: p.slugs || [],
//           };
//         });

//         setProducts(processed);
//       } catch (err) {
//         console.error("BestSellers load error:", err);
//       }
//     };
//     load();
//   }, [selectedVariants]);

//   const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString("en-IN")}`;
//   const calculateDiscountPercent = useCallback((original, current) => {
//     if (original > current) return Math.round(((original - current) / original) * 100);
//     return 0;
//   }, []);

//   return (
//     <section className="bestSellers container-fluid py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="bestSellers__heading text-center mt-3 mb-4 font-family-Playfair spacing">
//         BEST SELLERS
//       </h2>

//       <div className="mobile-responsive-code">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           pagination={{ clickable: true, dynamicBullets: true }}
//           navigation={true}
//           spaceBetween={20}
//           grabCursor
//           breakpoints={{
//             300: { slidesPerView: 2, spaceBetween: 10 },
//             576: { slidesPerView: 2.5 },
//             768: { slidesPerView: 3 },
//             992: { slidesPerView: 4 },
//             1200: { slidesPerView: 5 },
//           }}
//         >
//           {products.map((item) => {
//             const current = selectedVariants[item._id] || item.currentVariant || {};
//             const variants = item.allVariants || [];
//             const hasSingleVariant = variants.length === 1;
//             const hasMultipleVariants = variants.length > 1;

//             const displayPrice = parseFloat(current?.displayPrice || current?.discountedPrice || current?.price || item.price || 0);
//             const originalPrice = parseFloat(current?.originalPrice || current?.mrp || item.mrp || displayPrice);
//             const discountPercent = calculateDiscountPercent(originalPrice, displayPrice);

//             const avgRating = item.avgRating || 0;
//             const totalRatings = item.totalRatings || 0;
//             const isWishlisted = wishlist.includes(item._id);

//             // ✅ UPDATED: Get product URL with slug
//             const productUrl = getProductUrl(item, current);

//             // Separate variants into color and text
//             const colorVariants = variants.filter(v => v && isValidHexColor(v.hex));
//             const textVariants = variants.filter(v => v && !isValidHexColor(v.hex));
//             const hasColorVariants = colorVariants.length > 0;
//             const hasTextVariants = textVariants.length > 0;

//             return (
//               <SwiperSlide key={item._id}>
//                 <div className="bs-card overflow-hidden position-relative">
//                   {/* Product Image Link - Using slug */}
//                   <Link to={productUrl}>
//                     <div className="bs-card__imgWrap position-relative">
//                       <img
//                         src={current?.images?.[0] || item.displayImage}
//                         alt={item.name}
//                         className="img-fluid w-100"
//                         style={{ height: "280px", objectFit: "cover" }}
//                       />

//                       {/* Wishlist Icon */}
//                       <div
//                         className="position-absolute"
//                         style={{
//                           top: '10px',
//                           right: '10px',
//                           cursor: 'pointer',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255,255,255,0.8)',
//                           borderRadius: '50%',
//                           width: '36px',
//                           height: '36px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center'
//                         }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           toggleWishlist(item._id);
//                         }}
//                       >
//                         {wishlistLoading[item._id] ? (
//                           <div className="spinner-border spinner-border-sm" role="status" />
//                         ) : isWishlisted ? (
//                           <i className="bi bi-heart-fill text-danger" style={{ fontSize: '20px' }} />
//                         ) : (
//                           <i className="bi bi-heart" style={{ fontSize: '20px' }} />
//                         )}
//                       </div>
//                     </div>
//                   </Link>

//                   <div className="pt-3 text-start">
//                     {/* Ratings */}
//                     <div className="mb-2 d-flex align-items-center justify-content-start gap-1">
//                       {[...Array(5)].map((_, i) => (
//                         <i
//                           key={i}
//                           className={`bi ${i < Math.floor(avgRating) ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
//                           style={{ fontSize: "14px" }}
//                         />
//                       ))}
//                       <span className="small text-muted ms-2">
//                         {avgRating > 0 ? `${avgRating.toFixed(1)} (${totalRatings})` : "No reviews"}
//                       </span>
//                     </div>

//                     <div className="small text-muted mb-1">{item.brand?.name || "Unknown Brand"}</div>

//                     {/* Product Name Link - Using slug */}
//                     <Link to={productUrl} className="text-decoration-none">
//                       <h6 className="font-family-Poppins text-dark mb-3">{item.name}</h6>
//                     </Link>

//                     {/* Variant Section */}
//                     {variants.length > 0 && (
//                       <div className="mb-4">
//                         {hasSingleVariant && current && (
//                           <div className="d-flex justify-content-start mb-3">
//                             <VariantOption
//                               variant={current}
//                               isSelected={true}
//                               disabled={false}
//                               hasColor={isValidHexColor(current.hex)}
//                               displayText={getVariantDisplayText(current)}
//                               onClick={() => { }}
//                               getContrastColor={getContrastColor}
//                               showArrow={true}
//                             />
//                           </div>
//                         )}

//                         {hasMultipleVariants && (
//                           <div className="mb-3">
//                             {/* First: Show color variants (with hex) */}
//                             {hasColorVariants && (
//                               <div className="mb-3">
//                                 <div className="small text-muted mb-2">Color Options:</div>
//                                 <div className="d-flex flex-wrap gap-2 justify-content-start">
//                                   {colorVariants.map((v) => {
//                                     const isSel = current._id === v._id || current.sku === v.sku;
//                                     const disabled = parseInt(v.stock || 0) <= 0;
//                                     return (
//                                       <VariantOption
//                                         key={v._id || v.sku}
//                                         variant={v}
//                                         isSelected={isSel}
//                                         disabled={disabled}
//                                         hasColor={true}
//                                         displayText={getVariantDisplayText(v)}
//                                         onClick={() => handleVariantSelect(item._id, v)}
//                                         getContrastColor={getContrastColor}
//                                       />
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             )}

//                             {/* Second: Show text variants (without hex) */}
//                             {hasTextVariants && (
//                               <div>
//                                 <div className="small text-muted mb-2">
//                                   {hasColorVariants ? "Other Options:" : "Options:"}
//                                 </div>
//                                 <div className="d-flex flex-wrap gap-2 justify-content-start">
//                                   {textVariants.map((v) => {
//                                     const isSel = current._id === v._id || current.sku === v.sku;
//                                     const disabled = parseInt(v.stock || 0) <= 0;
//                                     return (
//                                       <VariantOption
//                                         key={v._id || v.sku}
//                                         variant={v}
//                                         isSelected={isSel}
//                                         disabled={disabled}
//                                         hasColor={false}
//                                         displayText={getVariantDisplayText(v)}
//                                         onClick={() => handleVariantSelect(item._id, v)}
//                                         getContrastColor={getContrastColor}
//                                       />
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Price */}
//                     <div className="mb-4">
//                       <span className="fw-bold fs-4 text-dark">{formatPrice(displayPrice)}</span>
//                       {originalPrice > displayPrice && (
//                         <>
//                           <span className="text-muted text-decoration-line-through ms-3 fs-6">
//                             {formatPrice(originalPrice)}
//                           </span>
//                           <span className="text-danger fw-bold ms-3">({discountPercent}% OFF)</span>
//                         </>
//                       )}
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       className="btn btn-primary w-100 py-2"
//                       disabled={addingToCart[item._id] || parseInt(current.stock || 0) <= 0}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleAddToCart(item);
//                       }}
//                     >
//                       {addingToCart[item._id] ? "Adding..." : parseInt(current.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
//                     </button>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default BestSellers;




















// import React, { useEffect, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link, useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import bagIcon from "../assets/bag.svg";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   // ===================== HELPER FUNCTIONS =====================

//   // Helper to check if hex color is valid and not default
//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== 'string') return false;
//     const normalizedHex = hex.trim().toLowerCase();

//     const defaultColors = ['#000000', '#000', '#ccc', '#cccccc', '#fff', '#ffffff', '#00000000', 'transparent'];
//     if (defaultColors.includes(normalizedHex)) return false;

//     const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
//     return hexRegex.test(normalizedHex);
//   }, []);

//   // Helper to get brand name
//   const getBrandName = useCallback((brand) => {
//     if (!brand) return "Unknown Brand";
//     if (typeof brand === 'string') return brand;
//     if (brand && typeof brand === 'object') {
//       return brand.name || brand._id || "Unknown Brand";
//     }
//     return "Unknown Brand";
//   }, []);

//   // Helper to get variant name
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

//   // Helper to get variant type
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, [isValidHexColor]);

//   // Helper function to get variant display text
//   const getVariantDisplayText = useCallback((variant, variantType) => {
//     if (!variant) return "Default";
//     if (variantType === 'ml' && variant.ml) return `${variant.ml} ML`;
//     if (variantType === 'weight' && variant.weight) return `${variant.weight} g`;
//     if (variantType === 'size' && variant.size) return variant.size;
//     if (variant.shadeName) return variant.shadeName.toUpperCase();
//     if (variant.name) return variant.name.toUpperCase();
//     if (variant.variantName) return variant.variantName.toUpperCase();
//     return "Default";
//   }, []);

//   // Helper to get product slug
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;
//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0];
//     }
//     if (product.slug) return product.slug;
//     return product._id;
//   }, []);

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // ===================== PRODUCT DISPLAY DATA =====================
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
//       product.displayImage ||
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

//     const discountAmount = parseFloat(
//       selectedVariant.discountAmount ||
//       product.discountAmount ||
//       0
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
//     const variantDisplayText = getVariantDisplayText(selectedVariant, variantType);

//     const stock = parseInt(selectedVariant.stock || product.stock || 0);
//     const status = stock > 0 ? "inStock" : "outOfStock";
//     const sku = selectedVariant.sku || product.sku || "";
//     const sales = parseInt(selectedVariant.sales || product.sales || 0);

//     // Check if promo is applied
//     const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
//     const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

//     // Check if variant has quantity (from cart)
//     const quantity = parseInt(selectedVariant.quantity || 0);

//     // Get brand name safely
//     const brandName = getBrandName(product.brand);

//     // Get variant color (hex)
//     const hexColor = selectedVariant.hex || product.hex || "#000000";

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
//         discountAmount,
//         stock,
//         status,
//         sku,
//         sales,
//         promoApplied,
//         promoMessage,
//         hex: hexColor,
//         quantity,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       description: product.description || "",
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v)
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getVariantDisplayText, getProductSlug]);

//   // ===================== VARIANT HANDLING =====================
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

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
//           const variantDisplayText = getVariantDisplayText(variant, variantType);
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
//               quantity: product.variant?.quantity || 0,
//               hex: hexColor,
//               variantType,
//               _id: variant._id || variant.sku || `variant-${Date.now()}`
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType, getVariantDisplayText]);

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
//     const slug = product.slug || product._id;
//     if (slug) {
//       navigate(`/product/${slug}`);
//     }
//   }, [navigate]);

//   // ===================== WISHLIST FUNCTIONS =====================
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         let isLoggedIn = false;
//         try {
//           await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//           isLoggedIn = true;
//         } catch { }

//         if (!isLoggedIn) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//           if (Array.isArray(res.data.wishlist)) {
//             setWishlist(res.data.wishlist.map(item => item._id));
//           }
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   const toggleWishlist = async (productId) => {
//     try {
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch { }

//       if (!isLoggedIn) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter(id => id !== productId);
//           toast.success("Removed from wishlist");
//         } else {
//           updated.push(productId);
//           toast.success("Added to wishlist");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//       } else {
//         const res = await axios.post(
//           `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//           {},
//           { withCredentials: true }
//         );
//         if (res.data.wishlist) {
//           setWishlist(res.data.wishlist.map(item => item._id));
//           toast.success("Wishlist updated!");
//         }
//       }
//     } catch (err) {
//       console.error("Wishlist toggle error:", err);
//       toast.error("Failed to update wishlist");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // ===================== ADD TO CART FUNCTION =====================
//   const handleAddToCart = async (product) => {
//     if (!product) {
//       toast.error("⚠️ Product not loaded yet.");
//       return;
//     }

//     console.log("🛒 Starting add to cart for:", product.name, "with variant:", product.variant);

//     const productId = product._id;
//     if (!productId) {
//       toast.error("⚠️ Invalid product ID.");
//       return;
//     }

//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     // Get the currently selected variant from the product
//     const selectedVariant = product.variant;
//     if (!selectedVariant) {
//       toast.error("⚠️ No variant selected.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Check if selected variant is in stock
//     const stock = parseInt(selectedVariant.stock || 0);
//     if (stock <= 0) {
//       toast.error("❌ This variant is out of stock.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Get variant identifier
//     const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//     if (!variantId) {
//       toast.error("⚠️ This variant cannot be added to cart.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Prepare complete variant data for cart
//     const variantToAdd = {
//       // Essential identifiers
//       _id: variantId,
//       id: variantId,
//       sku: variantId,
//       variantId: variantId,
//       variantSku: variantId,

//       // Variant details
//       name: selectedVariant.variantName || selectedVariant.shadeName || selectedVariant.name || "Default",
//       shadeName: selectedVariant.shadeName || selectedVariant.name,
//       hex: selectedVariant.hex || product.hex || "#ccc",
//       color: selectedVariant.hex || product.hex || "#ccc",

//       // Prices
//       price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       originalPrice: parseFloat(selectedVariant.originalPrice || selectedVariant.mrp || product.mrp || 0),
//       discountedPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       displayPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       mrp: parseFloat(selectedVariant.mrp || product.mrp || 0),

//       // Stock and image
//       stock: stock,
//       image: selectedVariant.images?.[0] || selectedVariant.image || product.image || "/placeholder.png",
//       images: selectedVariant.images || [product.image || "/placeholder.png"],

//       // Additional variant info
//       ml: selectedVariant.ml,
//       size: selectedVariant.size,
//       weight: selectedVariant.weight,
//       variantType: selectedVariant.variantType || 'default',
//       variantDisplayText: selectedVariant.variantDisplayText || "Default",

//       // Quantity
//       quantity: parseInt(product.variant?.quantity || 1),

//       // Product reference
//       productId: productId,
//       productName: product.name,
//       product: product,
//       brandName: product.brandName,
//       brandId: product.brandId,

//       // Store for reference
//       rawVariant: selectedVariant
//     };

//     console.log("🚀 Final variant to add:", variantToAdd);

//     try {
//       let isLoggedIn = false;
//       let userId = null;

//       // Check if user is logged in
//       try {
//         const profileRes = await axios.get("https://beauty.joyory.com/api/user/profile", {
//           withCredentials: true
//         });
//         isLoggedIn = true;
//         userId = profileRes.data.user?._id;
//         console.log("👤 Logged-in user detected:", userId);
//       } catch {
//         console.log("👤 Guest user detected — using local cart");
//       }

//       // Cache the variant selection for future reference
//       const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//       cache[product._id] = variantToAdd;
//       localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//       const quantity = parseInt(product.variant?.quantity || 1);

//       // GUEST USER FLOW
//       if (!isLoggedIn) {
//         console.log("🛒 Guest cart process started...");

//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

//         // Check if same product with same variant already exists in cart
//         const existingIndex = guestCart.findIndex(
//           (item) =>
//             item.productId === product._id &&
//             item.variantId === variantToAdd.variantId
//         );

//         if (existingIndex >= 0) {
//           // Update quantity if variant already exists
//           const newQuantity = guestCart[existingIndex].quantity + quantity;
//           if (newQuantity <= stock) {
//             guestCart[existingIndex].quantity = newQuantity;
//             guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * newQuantity;
//             toast.success(`🛒 Updated quantity to ${newQuantity}`);
//           } else {
//             toast.warning(`⚠️ Only ${stock} items available in stock`);
//             guestCart[existingIndex].quantity = stock;
//             guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * stock;
//           }
//         } else {
//           // Add new variant to cart
//           const cartItem = {
//             // Product info
//             productId: product._id,
//             productName: product.name,
//             productImage: variantToAdd.image,
//             brandName: product.brandName,
//             brandId: product.brandId,

//             // Variant info
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             variantName: variantToAdd.name,
//             shadeName: variantToAdd.shadeName,
//             color: variantToAdd.color,
//             hex: variantToAdd.hex,
//             size: variantToAdd.size,
//             ml: variantToAdd.ml,
//             weight: variantToAdd.weight,
//             variantType: variantToAdd.variantType,
//             variantDisplayText: variantToAdd.variantDisplayText,

//             // Price and quantity
//             price: variantToAdd.price,
//             originalPrice: variantToAdd.originalPrice,
//             discountedPrice: variantToAdd.discountedPrice,
//             quantity: quantity,
//             totalPrice: variantToAdd.price * quantity,

//             // Stock
//             stock: variantToAdd.stock,

//             // Images
//             image: variantToAdd.image,
//             images: variantToAdd.images,

//             // Additional info
//             isGuest: true,
//             addedAt: new Date().toISOString(),

//             // Full objects for reference
//             product: {
//               _id: product._id,
//               name: product.name,
//               brandName: product.brandName,
//               description: product.description
//             },
//             variant: variantToAdd
//           };

//           guestCart.push(cartItem);
//           toast.success("🛒 Added to cart! Redirecting to cart...");
//         }

//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//         console.log("💾 Guest cart updated:", guestCart);

//         // Reset quantity after adding to cart
//         setProducts(prevProducts =>
//           prevProducts.map(p => {
//             if (p._id === product._id) {
//               return {
//                 ...p,
//                 variant: {
//                   ...p.variant,
//                   quantity: 0
//                 }
//               };
//             }
//             return p;
//           })
//         );

//         // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500);

//         setAddingToCart(prev => ({ ...prev, [productId]: false }));
//         return;
//       }

//       // LOGGED-IN USER FLOW
//       console.log("🔐 Logged-in user — sending to backend");

//       const payload = {
//         productId: product._id,
//         productName: product.name,
//         variants: [
//           {
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             quantity: quantity,
//             variantData: {
//               name: variantToAdd.name,
//               shadeName: variantToAdd.shadeName,
//               color: variantToAdd.color,
//               hex: variantToAdd.hex,
//               size: variantToAdd.size,
//               ml: variantToAdd.ml,
//               weight: variantToAdd.weight,
//               price: variantToAdd.price,
//               originalPrice: variantToAdd.originalPrice,
//               discountedPrice: variantToAdd.discountedPrice,
//               image: variantToAdd.image,
//               stock: variantToAdd.stock,
//               variantType: variantToAdd.variantType,
//               variantDisplayText: variantToAdd.variantDisplayText
//             }
//           },
//         ],
//       };

//       console.log("📦 Sending payload to backend:", payload);

//       const res = await axios.post(
//         "https://beauty.joyory.com/api/user/cart/add",
//         payload,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         // Reset quantity after adding to cart
//         setProducts(prevProducts =>
//           prevProducts.map(p => {
//             if (p._id === product._id) {
//               return {
//                 ...p,
//                 variant: {
//                   ...p.variant,
//                   quantity: 0
//                 }
//               };
//             }
//             return p;
//           })
//         );

//         toast.success("✅ Product added to cart! Redirecting to cart...");

//         // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500);

//       } else {
//         toast.error(res.data.message || "❌ Failed to add product.");
//         setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       }
//     } catch (err) {
//       console.error("🔥 Add to Cart Error:", err);

//       // Check if it's already been added as guest (for 401 errors)
//       if (err.response?.status === 401) {
//         console.log("🔄 User is unauthorized, checking if already added to guest cart...");

//         // Check if item is already in guest cart
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           (item) => item.productId === product._id && item.variantId === variantToAdd.variantId
//         );

//         if (existingIndex === -1) {
//           console.log("🔄 Adding to guest cart as fallback...");

//           // Add to guest cart only if not already present
//           const cartItem = {
//             productId: product._id,
//             productName: product.name,
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             variantName: variantToAdd.name,
//             variantDisplayText: variantToAdd.variantDisplayText,
//             price: variantToAdd.price,
//             quantity: parseInt(product.variant?.quantity || 1),
//             image: variantToAdd.image,
//             isGuest: true,
//             addedAt: new Date().toISOString()
//           };

//           guestCart.push(cartItem);
//           localStorage.setItem("guestCart", JSON.stringify(guestCart));

//           toast.success("🛒 Added to cart (Guest Mode)! Redirecting...");
//         } else {
//           console.log("✅ Item already exists in guest cart, not adding duplicate.");
//           toast.info("✅ Item already in cart! Redirecting...");
//         }

//         // Reset quantity
//         setProducts(prevProducts =>
//           prevProducts.map(p => {
//             if (p._id === product._id) {
//               return {
//                 ...p,
//                 variant: {
//                   ...p.variant,
//                   quantity: 0
//                 }
//               };
//             }
//             return p;
//           })
//         );

//         // AUTO REDIRECT TO CART PAGE
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500);

//       } else {
//         toast.error(err.response?.data?.message || "❌ Failed to add product to cart");
//       }
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // Group variants by type for overlay
//   const groupVariantsByType = useCallback((variants) => {
//     const grouped = {
//       color: [], // Hex color variants
//       text: [],  // Text-based variants (size, ml, weight, etc.)
//       default: [] // Other variants
//     };

//     variants.forEach(variant => {
//       if (!variant) return;

//       const variantType = getVariantType(variant);
//       if (variantType === 'color' || (variant.hex && isValidHexColor(variant.hex))) {
//         grouped.color.push(variant);
//       } else if (variantType !== 'color') {
//         grouped.text.push(variant);
//       } else {
//         grouped.default.push(variant);
//       }
//     });

//     return grouped;
//   }, [getVariantType, isValidHexColor]);

//   // ===================== PRODUCT LOADING =====================
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.get(API_LIST, { withCredentials: true });
//       const json = res.data;

//       console.log("📦 BestSellers API Response:", json);

//       let data = [];

//       if (Array.isArray(json)) {
//         // If response is an array
//         data = json.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (Array.isArray(json?.products)) {
//         // If response has products array
//         data = json.products.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (json?.data && Array.isArray(json.data)) {
//         // If response has data array
//         data = json.data.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       }

//       console.log("✅ Processed best sellers:", data.length);
//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching best sellers:", err);
//       setError("Couldn't load best sellers. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // ===================== RENDER =====================
//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />
//       {/* <h2 className="font-familys fw-bold text-center mt-3 mb-4 mb-lg-5 mt-lg-5 spacing"> */}
//       <h2 className="mb-3 text-left ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 best-seller-headings spacing">
//         Best Sellers
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2">Loading best sellers...</p>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//           <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
//             Retry
//           </button>
//         </div>
//       )}

//       {products.length > 0 ? (
//         <div className="mobile-responsive-code position-relative">
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
//               1200: { slidesPerView: 5, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {products.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const allVariants = item.allVariants || [];

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = allVariants.length > 0;
//               const hasMultipleVariants = allVariants.length > 1;
//               const hasOnlyOneVariant = allVariants.length === 1;

//               // Separate variants into color (hex) variants and text variants
//               const colorVariants = allVariants.filter(v => v && isValidHexColor(v.hex));
//               const textVariants = allVariants.filter(v => v && !isValidHexColor(v.hex));
//               const hasColorVariants = colorVariants.length > 0;
//               const hasTextVariants = textVariants.length > 0;

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(allVariants);
//               const totalVariants = allVariants.length;

//               // Show only first 4 color variants initially
//               const initialColorVariants = colorVariants.slice(0, 4);
//               const hasMoreColorVariants = colorVariants.length > 4;

//               // Show only first 2 text variants initially
//               const initialTextVariants = textVariants.slice(0, 2);
//               const hasMoreTextVariants = textVariants.length > 2;

//               // Check if product is in wishlist
//               const isWishlisted = wishlist.includes(item._id);

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

//                         {/* Wishlist Icon */}
//                         <div
//                           className="wishlist-icon"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleWishlist(item._id);
//                           }}
//                           style={{
//                             position: 'absolute',
//                             top: '10px',
//                             right: '10px',
//                             cursor: 'pointer',
//                             color: isWishlisted ? 'red' : '#000000',
//                             fontSize: '22px',
//                             zIndex: 2,
//                             borderRadius: '50%',
//                             width: '36px',
//                             height: '36px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             transition: 'all 0.2s ease'
//                           }}
//                           title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//                         >
//                           {wishlistLoading[item._id] ? (
//                             <div className="spinner-border spinner-border-sm" role="status">
//                               <span className="visually-hidden">Loading...</span>
//                             </div>
//                           ) : isWishlisted ? (
//                             <i className="bi bi-heart-fill"></i>
//                           ) : (
//                             <i className="bi bi-heart"></i>
//                           )}
//                         </div>

//                         {/* Promo Badge */}
//                         {variant.promoApplied && (
//                           <div className="promo-badge">
//                             <i className="bi bi-tag-fill me-1"></i>
//                             Promo
//                           </div>
//                         )} 
//                       </div>

//                       {/* Product Info */}
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
//                         <div className="justify-content-between d-flex flex-column" style={{height:'310px'}}>

//                         {/* Rating */}
//                         <div className="ratings mb-0 mt-2">
//                           <div className="d-flex align-items-center">
//                             <div className="star-rating gap-3">
//                               {[...Array(5)].map((_, i) => (
//                                 <i style={{ marginLeft: '4px' }}
//                                   key={i}
//                                   className={`bi ${item.avgRating > 0 && i < Math.floor(item.avgRating)
//                                       ? 'bi-star-fill text-warning'
//                                       : 'bi-star text-muted'
//                                     }`}
//                                 ></i>
//                               ))}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Brand Name */}
//                         <div className="brand-name small text-muted mb-1">
//                           {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
//                         </div>

//                         {/* Product Name */}
//                         <h6 
//                           className="foryou-name font-family-Poppins m-0 p-0"
//                           onClick={() => handleProductClick(item)}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           {item.name || "Unnamed Product"}
//                         </h6>

//                         {/* Dynamic Variant Display */}
//                         {hasVariants && (
//                           <div className="variant-section m-0 p-0 ms-0 ">
//                             {hasVariants && allVariants.length > 0 && (
//                               <>
//                                 {/* Color Variants Section */}
//                                 {hasColorVariants && (
//                                   <div className="color-variants-section">
//                                     <p className="variant-label text-muted small mb-2">
//                                       Select Color:
//                                     </p>
//                                     <div className="variant-list d-flex flex-wrap gap-2  ms-1">
//                                       {initialColorVariants.map((v, idx) => {
//                                         if (!v) return null;

//                                         const displayText = getVariantDisplayText(v, getVariantType(v));
//                                         const color = v.hex || "#ccc";
//                                         const stock = parseInt(v.stock || 0);
//                                         const isOutOfStock = stock <= 0;
//                                         const isSelected =
//                                           variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                         const isDisabled = hasOnlyOneVariant || isOutOfStock;

//                                         return (
//                                           <div className="varient-margin" key={v.sku || v._id || idx} style={{ position: "relative" }}>
//                                             <div
//                                               className={`color-circle ${isSelected ? "selected" : ""}`}
//                                               style={{
//                                                 backgroundColor: color,
//                                                 marginTop: '7px',
//                                                 width: "20px",
//                                                 height: "20px",
//                                                 borderRadius: "20%",
//                                                 cursor: isDisabled ? "default" : "pointer",
//                                                 opacity: isOutOfStock ? 0.5 : 1,
//                                                 // boxShadow: isSelected
//                                                 //   ? "0 0 0 2px white, 0 0 0 3px #000000"
//                                                 //   : "none",
//                                                 transition: "all 0.2s ease",
//                                               }}
//                                               onClick={() => {
//                                                 if (isDisabled) return;
//                                                 handleVariantSelect(item._id, v);
//                                               }}
//                                               title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                             >
//                                               {isSelected && (
//                                                 <span
//                                                   style={{
//                                                     position: "absolute",
//                                                     top: "50%",
//                                                     left: "50%",
//                                                     transform: "translate(-50%, -50%)",
//                                                     color: "#fff",
//                                                     fontSize: "10px",
//                                                     fontWeight: "bold",
//                                                   }}
//                                                 >
//                                                   ✓
//                                                 </span>
//                                               )}
//                                             </div>
//                                           </div>
//                                         );
//                                       })}

//                                       {/* More Button for Color Variants */}
//                                       {hasMoreColorVariants && (
//                                         <div className="varient-margin" style={{ position: "relative", marginTop: '7px' }}>
//                                           <button
//                                             className="more-variants-btn"
//                                             onClick={(e) => openVariantOverlay(item._id, "color", e)}
//                                             style={{
//                                               width: "20px",
//                                               height: "20px",
//                                               borderRadius: "4px",
//                                               backgroundColor: "#f5f5f5",
//                                               border: "1px solid #ddd",
//                                               cursor: "pointer",
//                                               display: "flex",
//                                               alignItems: "center",
//                                               justifyContent: "center",
//                                               fontSize: "10px",
//                                               fontWeight: "bold",
//                                               color: "#333"
//                                             }}
//                                             title={`Show all ${colorVariants.length} colors`}
//                                           >
//                                             +{colorVariants.length - 4}
//                                           </button>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* Text Variants Section */}
//                                 {hasTextVariants && (
//                                   <div className="text-variants-section">
//                                     <p className="variant-label text-muted small mb-2 mt-2">
//                                       Select Size:
//                                     </p>
//                                     <div className="variant-list d-flex flex-wrap gap-2">
//                                       {initialTextVariants.map((v, idx) => {
//                                         if (!v) return null;

//                                         const displayText = getVariantDisplayText(v, getVariantType(v));
//                                         const stock = parseInt(v.stock || 0);
//                                         const isOutOfStock = stock <= 0;
//                                         const isSelected =
//                                           variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                         const isDisabled = hasOnlyOneVariant || isOutOfStock;

//                                         return (
//                                           <div key={v.sku || v._id || idx}>
//                                             <div
//                                               className={`variant-text-option ${isSelected ? "selected" : ""}`}
//                                               style={{
//                                                 padding: "4px 8px",
//                                                 borderRadius: "4px",
//                                                 border: isSelected ? "2px solid #000000" : "1px solid #ddd",
//                                                 backgroundColor: isSelected ? "#f8f9fa" : "#fff",
//                                                 color: isSelected ? "#000000" : "#333",
//                                                 fontSize: "12px",
//                                                 fontWeight: isSelected ? 600 : 400,
//                                                 cursor: isDisabled ? "default" : "pointer",
//                                                 opacity: isOutOfStock ? 0.5 : 1,
//                                                 minWidth: "60px",
//                                                 textAlign: "center",
//                                               }}
//                                               onClick={() => {
//                                                 if (isDisabled) return;
//                                                 handleVariantSelect(item._id, v);
//                                               }}
//                                               title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                             >
//                                               {displayText}
//                                               {isSelected && (
//                                                 <span className="ms-1" style={{ fontSize: "10px" }}>
//                                                   ✓
//                                                 </span>
//                                               )}
//                                             </div>
//                                           </div>
//                                         );
//                                       })}

//                                       {/* More Button for Text Variants */}
//                                       {hasMoreTextVariants && (
//                                         <div style={{ position: "relative" }}>
//                                           <button
//                                             className="more-variants-btn"
//                                             onClick={(e) => openVariantOverlay(item._id, "text", e)}
//                                             style={{
//                                               padding: "4px 8px",
//                                               borderRadius: "4px",
//                                               backgroundColor: "#f5f5f5",
//                                               border: "1px solid #ddd",
//                                               cursor: "pointer",
//                                               display: "flex",
//                                               alignItems: "center",
//                                               justifyContent: "center",
//                                               fontSize: "10px",
//                                               fontWeight: "bold",
//                                               color: "#333",
//                                               minWidth: "60px",
//                                             }}
//                                             title={`Show all ${textVariants.length} sizes`}
//                                           >
//                                             +{textVariants.length - 2}
//                                           </button>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             )}

//                             {hasVariants && allVariants.filter(v => parseInt(v.stock || 0) > 0).length === 0 && (
//                               <div className="no-variant-available small text-danger">
//                                 <i className="bi bi-exclamation-triangle me-1"></i>
//                                 All variants are out of stock
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {/* Price Section */}
//                         <div className="price-section mb-3">
//                           <div className="d-flex align-items-baseline flex-wrap">
//                             <span className="current-price fw-bold fs-5">
//                               {formatPrice(variant.displayPrice)}
//                             </span>

//                             {variant.originalPrice > variant.displayPrice && (
//                               <>
//                                 <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                   {formatPrice(variant.originalPrice)}
//                                 </span>
//                                 <span className="discount-percent text-danger fw-bold ms-2">
//                                   ({variant.discountPercent || 0}% OFF)
//                                 </span>
//                               </>
//                             )}
//                           </div>
//                         </div>

//                         {/* Add to Cart with Quantity */}
//                         <div className="cart-section">
//                           <div className="d-flex align-items-center justify-content-between">
//                             <button
//                               className={`w-100 ${variant.status === "inStock"} btn-add-cart`}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 if (variant.status !== "inStock") {
//                                   toast.info("This variant is out of stock. Please select another variant.");
//                                   return;
//                                 }
//                                 handleAddToCart(item);
//                               }}
//                               disabled={variant.status !== "inStock" || addingToCart[item._id]}
//                             >
//                               {addingToCart[item._id] ? (
//                                 <>
//                                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                   Adding...
//                                 </>
//                               ) : variant.status !== "inStock" ? (
//                                 <>
//                                   <i className="bi bi-x-circle me-1"></i>
//                                   Out of Stock
//                                 </>
//                               ) : (
//                                 <>
//                                   Add to Bag
//                                   <img src={bagIcon} className="img-fluid ms-1" style={{marginTop:'-3px'}} alt="Bag-icons" />
//                                 </>
//                               )}
//                             </button>
//                           </div>
//                         </div>
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
//                             width: '90%',
//                             maxWidth: '500px',
//                             maxHeight: '80vh',
//                             display: 'flex',
//                             flexDirection: 'column'
//                           }}
//                         >
//                           <div className="overlay-header d-flex justify-content-between align-items-center mb-3" style={{ flexShrink: 0 }}>
//                             <h5 className="m-0">Select Variant ({totalVariants})</h5>
//                             <button 
//                               className="close-overlay-btn"
//                               onClick={closeVariantOverlay}
//                               style={{
//                                 background: 'none',
//                                 border: 'none',
//                                 fontSize: '24px',
//                                 cursor: 'pointer',
//                                 color: '#666'
//                               }}
//                             >
//                               &times;
//                             </button>
//                           </div>

//                           {/* Variant Type Tabs */}
//                           <div className="variant-tabs d-flex mb-3" style={{ flexShrink: 0 }}>
//                             <button
//                               className={`variant-tab ${selectedVariantType === 'all' ? 'active' : ''}`}
//                               onClick={() => setSelectedVariantType('all')}
//                               style={{
//                                 padding: '8px 16px',
//                                 border: 'none',
//                                 background: selectedVariantType === 'all' ? '#000' : '#f5f5f5',
//                                 color: selectedVariantType === 'all' ? '#fff' : '#333',
//                                 cursor: 'pointer',
//                                 fontSize: '14px',
//                                 fontWeight: selectedVariantType === 'all' ? '600' : '400',
//                                 borderRadius: '4px 0 0 4px',
//                                 flex: 1
//                               }}
//                             >
//                               All ({totalVariants})
//                             </button>
//                             {groupedVariants.color.length > 0 && (
//                               <button
//                                 className={`variant-tab ${selectedVariantType === 'color' ? 'active' : ''}`}
//                                 onClick={() => setSelectedVariantType('color')}
//                                 style={{
//                                   padding: '8px 16px',
//                                   border: 'none',
//                                   background: selectedVariantType === 'color' ? '#000' : '#f5f5f5',
//                                   color: selectedVariantType === 'color' ? '#fff' : '#333',
//                                   cursor: 'pointer',
//                                   fontSize: '14px',
//                                   fontWeight: selectedVariantType === 'color' ? '600' : '400',
//                                   borderRadius: '0',
//                                   flex: 1
//                                 }}
//                               >
//                                 Colors ({groupedVariants.color.length})
//                               </button>
//                             )}
//                             {groupedVariants.text.length > 0 && (
//                               <button
//                                 className={`variant-tab ${selectedVariantType === 'text' ? 'active' : ''}`}
//                                 onClick={() => setSelectedVariantType('text')}
//                                 style={{
//                                   padding: '8px 16px',
//                                   border: 'none',
//                                   background: selectedVariantType === 'text' ? '#000' : '#f5f5f5',
//                                   color: selectedVariantType === 'text' ? '#fff' : '#333',
//                                   cursor: 'pointer',
//                                   fontSize: '14px',
//                                   fontWeight: selectedVariantType === 'text' ? '600' : '400',
//                                   borderRadius: '0 4px 4px 0',
//                                   flex: 1
//                                 }}
//                               >
//                                 Sizes ({groupedVariants.text.length})
//                               </button>
//                             )}
//                           </div>

//                           <div className="all-variants-container" style={{ flex: 1, overflowY: 'visible' }}>
//                             {selectedVariantType === 'all' && (
//                               <>
//                                 {/* Color Variants Section */}
//                                 {groupedVariants.color.length > 0 && (
//                                   <div className="color-variants-section mb-4">
//                                     <div className="row row-cols-4 g-3">
//                                       {groupedVariants.color.map((v, idx) => {
//                                         if (!v) return null;
//                                         const displayText = getVariantDisplayText(v, getVariantType(v));
//                                         const color = v.hex || "#ccc";
//                                         const stock = parseInt(v.stock || 0);
//                                         const isOutOfStock = stock <= 0;
//                                         const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);

//                                         return (
//                                           <div className="col" key={v.sku || v._id || idx}>
//                                             <div
//                                               className={`overlay-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                                               style={{
//                                                 textAlign: 'center',
//                                                 cursor: isOutOfStock ? 'not-allowed' : 'pointer'
//                                               }}
//                                               onClick={() => {
//                                                 if (isOutOfStock) return;
//                                                 handleVariantSelect(item._id, v);
//                                                 closeVariantOverlay();
//                                               }}
//                                             >
//                                               <div
//                                                 className="variant-circle mx-auto"
//                                                 style={{
//                                                   backgroundColor: color,
//                                                   width: "25px",
//                                                   height: "25px",
//                                                   borderRadius: "20%",
//                                                   border: isSelected ? "3px solid #000000" : "1px solid #ddd",
//                                                   marginBottom: '8px',
//                                                   opacity: isOutOfStock ? 0.5 : 1,
//                                                   position: 'relative',
//                                                   // boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 3px #000000' : 'none'
//                                                 }}
//                                               >
//                                                 {isSelected && (
//                                                   <span
//                                                     style={{
//                                                       position: "absolute",
//                                                       top: "50%",
//                                                       left: "50%",
//                                                       transform: "translate(-50%, -50%)",
//                                                       color: "#fff",
//                                                       fontSize: "14px",
//                                                       fontWeight: "bold",
//                                                     }}
//                                                   >
//                                                     ✓
//                                                   </span>
//                                                 )}
//                                               </div>
//                                               <div className="variant-name small" style={{
//                                                 fontSize: '11px',
//                                                 fontWeight: isSelected ? 'bold' : 'normal',
//                                                 color: isOutOfStock ? '#999' : '#333',
//                                               }}>
//                                                 {displayText}
//                                               </div>
//                                               {isOutOfStock && (
//                                                 <div className="out-of-stock-label small text-danger">
//                                                   Out of Stock
//                                                 </div>
//                                               )}
//                                             </div>
//                                           </div>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* Text Variants Section */}
//                                 {groupedVariants.text.length > 0 && (
//                                   <div className="text-variants-section">
//                                     <div className="row row-cols-4 g-3">
//                                       {groupedVariants.text.map((v, idx) => {
//                                         if (!v) return null;
//                                         const displayText = getVariantDisplayText(v, getVariantType(v));
//                                         const stock = parseInt(v.stock || 0);
//                                         const isOutOfStock = stock <= 0;
//                                         const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);

//                                         return (
//                                           <div className="col" key={v.sku || v._id || idx}>
//                                             <div
//                                               className={`overlay-text-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                                               style={{
//                                                 textAlign: 'center',
//                                                 cursor: isOutOfStock ? 'not-allowed' : 'pointer'
//                                               }}
//                                               onClick={() => {
//                                                 if (isOutOfStock) return;
//                                                 handleVariantSelect(item._id, v);
//                                                 closeVariantOverlay();
//                                               }}
//                                             >
//                                               <div
//                                                 className="variant-rectangle mx-auto"
//                                                 style={{
//                                                   padding: "8px 4px",
//                                                   borderRadius: "4px",
//                                                   border: isSelected ? "3px solid #000000" : "1px solid #ddd",
//                                                   backgroundColor: isSelected ? "#f8f9fa" : "#fff",
//                                                   color: isSelected ? "#000000" : "#333",
//                                                   fontSize: "12px",
//                                                   fontWeight: isSelected ? "bold" : "normal",
//                                                   marginBottom: '8px',
//                                                   opacity: isOutOfStock ? 0.5 : 1,
//                                                   minHeight: "40px",
//                                                   display: "flex",
//                                                   alignItems: "center",
//                                                   justifyContent: "center"
//                                                 }}
//                                               >
//                                                 {displayText}
//                                               </div>
//                                               <div className="variant-name small" style={{
//                                                 fontSize: '11px',
//                                                 fontWeight: isSelected ? 'bold' : 'normal',
//                                                 color: isOutOfStock ? '#999' : '#333',
//                                               }}>
//                                                 {displayText}
//                                               </div>
//                                               {isOutOfStock && (
//                                                 <div className="out-of-stock-label small text-danger">
//                                                   Out of Stock
//                                                 </div>
//                                               )}
//                                             </div>
//                                           </div>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             )}

//                             {/* Color Variants Only */}
//                             {selectedVariantType === 'color' && (
//                               <div className="color-variants-section">
//                                 <div className="row row-cols-4 g-3">
//                                   {groupedVariants.color.map((v, idx) => {
//                                     if (!v) return null;
//                                     const displayText = getVariantDisplayText(v, getVariantType(v));
//                                     const color = v.hex || "#ccc";
//                                     const stock = parseInt(v.stock || 0);
//                                     const isOutOfStock = stock <= 0;
//                                     const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);

//                                     return (
//                                       <div className="col" key={v.sku || v._id || idx}>
//                                         <div
//                                           className={`overlay-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                                           style={{
//                                             textAlign: 'center',
//                                             cursor: isOutOfStock ? 'not-allowed' : 'pointer'
//                                           }}
//                                           onClick={() => {
//                                             if (isOutOfStock) return;
//                                             handleVariantSelect(item._id, v);
//                                             closeVariantOverlay();
//                                           }}
//                                         >
//                                           <div
//                                             className="variant-circle mx-auto"
//                                             style={{
//                                               backgroundColor: color,
//                                               width: "25px",
//                                               height: "25px",
//                                               borderRadius: "20%",
//                                               border: isSelected ? "3px solid #000000" : "1px solid #ddd",
//                                               marginBottom: '8px',
//                                               opacity: isOutOfStock ? 0.5 : 1,
//                                               position: 'relative',
//                                               boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 3px #000000' : 'none'
//                                             }}
//                                           >
//                                             {isSelected && (
//                                               <span
//                                                 style={{
//                                                   position: "absolute",
//                                                   top: "50%",
//                                                   left: "50%",
//                                                   transform: "translate(-50%, -50%)",
//                                                   color: "#fff",
//                                                   fontSize: "14px",
//                                                   fontWeight: "bold",
//                                                 }}
//                                               >
//                                                 ✓
//                                               </span>
//                                             )}
//                                           </div>
//                                           <div className="variant-name small" style={{
//                                             fontSize: '11px',
//                                             fontWeight: isSelected ? 'bold' : 'normal',
//                                             color: isOutOfStock ? '#999' : '#333',
//                                           }}>
//                                             {displayText}
//                                           </div>
//                                           {isOutOfStock && (
//                                             <div className="out-of-stock-label small text-danger">
//                                               Out of Stock
//                                             </div>
//                                           )}
//                                         </div>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             )}

//                             {/* Text Variants Only */}
//                             {selectedVariantType === 'text' && (
//                               <div className="text-variants-section">
//                                 <div className="row row-cols-4 g-3">
//                                   {groupedVariants.text.map((v, idx) => {
//                                     if (!v) return null;
//                                     const displayText = getVariantDisplayText(v, getVariantType(v));
//                                     const stock = parseInt(v.stock || 0);
//                                     const isOutOfStock = stock <= 0;
//                                     const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);

//                                     return (
//                                       <div className="col" key={v.sku || v._id || idx}>
//                                         <div
//                                           className={`overlay-text-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                                           style={{
//                                             textAlign: 'center',
//                                             cursor: isOutOfStock ? 'not-allowed' : 'pointer'
//                                           }}
//                                           onClick={() => {
//                                             if (isOutOfStock) return;
//                                             handleVariantSelect(item._id, v);
//                                             closeVariantOverlay();
//                                           }}
//                                         >
//                                           <div
//                                             className="variant-rectangle mx-auto"
//                                             style={{
//                                               padding: "8px 4px",
//                                               borderRadius: "4px",
//                                               border: isSelected ? "3px solid #000000" : "1px solid #ddd",
//                                               backgroundColor: isSelected ? "#f8f9fa" : "#fff",
//                                               color: isSelected ? "#000000" : "#333",
//                                               fontSize: "12px",
//                                               fontWeight: isSelected ? "bold" : "normal",
//                                               marginBottom: '8px',
//                                               opacity: isOutOfStock ? 0.5 : 1,
//                                               minHeight: "40px",
//                                               display: "flex",
//                                               alignItems: "center",
//                                               justifyContent: "center"
//                                             }}
//                                           >
//                                             {displayText}
//                                           </div>
//                                           <div className="variant-name small" style={{
//                                             fontSize: '11px',
//                                             fontWeight: isSelected ? 'bold' : 'normal',
//                                             color: isOutOfStock ? '#999' : '#333',
//                                           }}>
//                                             {displayText}
//                                           </div>
//                                           {isOutOfStock && (
//                                             <div className="out-of-stock-label small text-danger">
//                                               Out of Stock
//                                             </div>
//                                           )}
//                                         </div>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
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
//           <button className="btn btn-primary mt-2" onClick={fetchProducts}>
//             Refresh
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BestSellers;












// import React, { useEffect, useState, useCallback, useContext } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { useNavigate } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import bagIcon from "../assets/bag.svg";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { UserContext } from "./UserContext";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";

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

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

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
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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
//       toast.warn("Please select a variant first");
//       return;
//     }

//     const productId = prod._id;
//     const sku = getSku(variant);

//     // Set loading for this product
//     setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//     try {
//       // Check current wishlist status
//       const currentlyInWishlist = isInWishlist(productId, sku);

//       if (user && !user.guest) {
//         // 🟢 Logged-in user - Backend API call
//         if (currentlyInWishlist) {
//           // Remove from wishlist
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`, 
//             { 
//               withCredentials: true,
//               data: { sku: sku }
//             }
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           // Add to wishlist
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`, 
//             { sku: sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }

//         // Refresh wishlist data
//         await fetchWishlistData();
//       } else {
//         // 🟢 Guest user - LocalStorage
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//         if (currentlyInWishlist) {
//           // Remove from wishlist
//           const updatedWishlist = guestWishlist.filter(item => 
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//           toast.success("Removed from wishlist!");
//         } else {
//           // Add to wishlist with complete product data
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: prod.brandName || "Unknown Brand",
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
//           toast.success("Added to wishlist!");
//         }

//         // Update local state
//         await fetchWishlistData();
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // ✅ Initial fetch of wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // ===================== END WISHLIST FUNCTIONS =====================

//   // Helper to get product slug safely
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;

//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0];
//     }

//     if (product.slug) return product.slug;

//     return product._id;
//   }, []);

//   // Safely get brand name from brand object or ID
//   const getBrandName = useCallback((brand) => {
//     if (!brand) return "Unknown Brand";
//     if (typeof brand === 'string') return brand;
//     if (brand && typeof brand === 'object') {
//       return brand.name || brand._id || "Unknown Brand";
//     }
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

//   // Helper to get variant type (color, size, ml, etc.)
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, [isValidHexColor]);

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
//       product.displayImage ||
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

//     const discountAmount = parseFloat(
//       selectedVariant.discountAmount ||
//       product.discountAmount ||
//       0
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
//     const sales = parseInt(selectedVariant.sales || product.sales || 0);

//     // Check if promo is applied
//     const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
//     const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

//     // Check if variant has quantity (from cart)
//     const quantity = parseInt(selectedVariant.quantity || 0);

//     // Get brand name safely
//     const brandName = getBrandName(product.brand);

//     // Get variant color (hex)
//     const hexColor = selectedVariant.hex || product.hex || "#000000";

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
//         discountAmount,
//         stock,
//         status,
//         sku,
//         sales,
//         promoApplied,
//         promoMessage,
//         hex: hexColor,
//         quantity,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       description: product.description || "",
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v)
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

//   // ===================== VARIANT HANDLING =====================
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

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
//               quantity: product.variant?.quantity || 0,
//               hex: hexColor,
//               variantType,
//               _id: variant._id || variant.sku || `variant-${Date.now()}`
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType]);

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
//     const slug = product.slug || product._id;
//     if (slug) {
//       navigate(`/product/${slug}`);
//     }
//   }, [navigate]);

//   // ===================== ADD TO CART FUNCTION =====================
//   const handleAddToCart = async (product) => {
//     if (!product) {
//       toast.error("⚠️ Product not loaded yet.");
//       return;
//     }

//     const productId = product._id;
//     if (!productId) {
//       toast.error("⚠️ Invalid product ID.");
//       return;
//     }

//     setAddingToCart(prev => ({ ...prev, [productId]: true }));

//     // Get the currently selected variant from the product
//     const selectedVariant = product.variant;
//     if (!selectedVariant) {
//       toast.error("⚠️ No variant selected.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Check if selected variant is in stock
//     const stock = parseInt(selectedVariant.stock || 0);
//     if (stock <= 0) {
//       toast.error("❌ This variant is out of stock.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Get variant identifier
//     const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//     if (!variantId) {
//       toast.error("⚠️ This variant cannot be added to cart.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return;
//     }

//     // Prepare complete variant data for cart
//     const variantToAdd = {
//       // Essential identifiers
//       _id: variantId,
//       id: variantId,
//       sku: variantId,
//       variantId: variantId,
//       variantSku: variantId,

//       // Variant details
//       name: selectedVariant.variantName || selectedVariant.shadeName || selectedVariant.name || "Default",
//       shadeName: selectedVariant.shadeName || selectedVariant.name,
//       hex: selectedVariant.hex || product.hex || "#ccc",
//       color: selectedVariant.hex || product.hex || "#ccc",

//       // Prices
//       price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       originalPrice: parseFloat(selectedVariant.originalPrice || selectedVariant.mrp || product.mrp || 0),
//       discountedPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       displayPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//       mrp: parseFloat(selectedVariant.mrp || product.mrp || 0),

//       // Stock and image
//       stock: stock,
//       image: selectedVariant.images?.[0] || selectedVariant.image || product.image || "/placeholder.png",
//       images: selectedVariant.images || [product.image || "/placeholder.png"],

//       // Additional variant info
//       ml: selectedVariant.ml,
//       size: selectedVariant.size,
//       weight: selectedVariant.weight,
//       variantType: selectedVariant.variantType || 'default',
//       variantDisplayText: selectedVariant.variantDisplayText || "Default",

//       // Quantity
//       quantity: parseInt(product.variant?.quantity || 1),

//       // Product reference
//       productId: productId,
//       productName: product.name,
//       product: product,
//       brandName: product.brandName,
//       brandId: product.brandId,

//       // Store for reference
//       rawVariant: selectedVariant
//     };

//     try {
//       let isLoggedIn = false;
//       // Check if user is logged in
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", {
//           withCredentials: true
//         });
//         isLoggedIn = true;
//       } catch {}

//       // Cache the variant selection for future reference
//       const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//       cache[product._id] = variantToAdd;
//       localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//       const quantity = parseInt(product.variant?.quantity || 1);

//       // GUEST USER FLOW
//       if (!isLoggedIn) {
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

//         // Check if same product with same variant already exists in cart
//         const existingIndex = guestCart.findIndex(
//           (item) =>
//             item.productId === product._id &&
//             item.variantId === variantToAdd.variantId
//         );

//         if (existingIndex >= 0) {
//           // Update quantity if variant already exists
//           const newQuantity = guestCart[existingIndex].quantity + quantity;
//           if (newQuantity <= stock) {
//             guestCart[existingIndex].quantity = newQuantity;
//             guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * newQuantity;
//             toast.success(`🛒 Updated quantity to ${newQuantity}`);
//           } else {
//             toast.warning(`⚠️ Only ${stock} items available in stock`);
//             guestCart[existingIndex].quantity = stock;
//             guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * stock;
//           }
//         } else {
//           // Add new variant to cart
//           const cartItem = {
//             // Product info
//             productId: product._id,
//             productName: product.name,
//             productImage: variantToAdd.image,
//             brandName: product.brandName,
//             brandId: product.brandId,

//             // Variant info
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             variantName: variantToAdd.name,
//             shadeName: variantToAdd.shadeName,
//             color: variantToAdd.color,
//             hex: variantToAdd.hex,
//             size: variantToAdd.size,
//             ml: variantToAdd.ml,
//             weight: variantToAdd.weight,
//             variantType: variantToAdd.variantType,
//             variantDisplayText: variantToAdd.variantDisplayText,

//             // Price and quantity
//             price: variantToAdd.price,
//             originalPrice: variantToAdd.originalPrice,
//             discountedPrice: variantToAdd.discountedPrice,
//             quantity: quantity,
//             totalPrice: variantToAdd.price * quantity,

//             // Stock
//             stock: variantToAdd.stock,

//             // Images
//             image: variantToAdd.image,
//             images: variantToAdd.images,

//             // Additional info
//             isGuest: true,
//             addedAt: new Date().toISOString(),

//             // Full objects for reference
//             product: {
//               _id: product._id,
//               name: product.name,
//               brandName: product.brandName,
//               description: product.description
//             },
//             variant: variantToAdd
//           };

//           guestCart.push(cartItem);
//           toast.success("🛒 Added to cart! Redirecting to cart...");
//         }

//         localStorage.setItem("guestCart", JSON.stringify(guestCart));

//         // Reset quantity after adding to cart
//         setProducts(prevProducts =>
//           prevProducts.map(p => {
//             if (p._id === product._id) {
//               return {
//                 ...p,
//                 variant: {
//                   ...p.variant,
//                   quantity: 0
//                 }
//               };
//             }
//             return p;
//           })
//         );

//         // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500);

//         setAddingToCart(prev => ({ ...prev, [productId]: false }));
//         return;
//       }

//       // LOGGED-IN USER FLOW
//       const payload = {
//         productId: product._id,
//         productName: product.name,
//         variants: [
//           {
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             quantity: quantity,
//             variantData: {
//               name: variantToAdd.name,
//               shadeName: variantToAdd.shadeName,
//               color: variantToAdd.color,
//               hex: variantToAdd.hex,
//               size: variantToAdd.size,
//               ml: variantToAdd.ml,
//               weight: variantToAdd.weight,
//               price: variantToAdd.price,
//               originalPrice: variantToAdd.originalPrice,
//               discountedPrice: variantToAdd.discountedPrice,
//               image: variantToAdd.image,
//               stock: variantToAdd.stock,
//               variantType: variantToAdd.variantType,
//               variantDisplayText: variantToAdd.variantDisplayText
//             }
//           },
//         ],
//       };

//       const res = await axios.post(
//         "https://beauty.joyory.com/api/user/cart/add",
//         payload,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         // Reset quantity after adding to cart
//         setProducts(prevProducts =>
//           prevProducts.map(p => {
//             if (p._id === product._id) {
//               return {
//                 ...p,
//                 variant: {
//                   ...p.variant,
//                   quantity: 0
//                 }
//               };
//             }
//             return p;
//           })
//         );

//         toast.success("✅ Product added to cart! Redirecting to cart...");

//         // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500);

//       } else {
//         toast.error(res.data.message || "❌ Failed to add product.");
//         setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       }
//     } catch (err) {
//       console.error("🔥 Add to Cart Error:", err);

//       // Check if it's already been added as guest (for 401 errors)
//       if (err.response?.status === 401) {
//         // Check if item is already in guest cart
//         let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           (item) => item.productId === product._id && item.variantId === variantToAdd.variantId
//         );

//         if (existingIndex === -1) {
//           // Add to guest cart only if not already present
//           const cartItem = {
//             productId: product._id,
//             productName: product.name,
//             variantId: variantToAdd.variantId,
//             variantSku: variantToAdd.variantSku,
//             variantName: variantToAdd.name,
//             variantDisplayText: variantToAdd.variantDisplayText,
//             price: variantToAdd.price,
//             quantity: parseInt(product.variant?.quantity || 1),
//             image: variantToAdd.image,
//             isGuest: true,
//             addedAt: new Date().toISOString()
//           };

//           guestCart.push(cartItem);
//           localStorage.setItem("guestCart", JSON.stringify(guestCart));

//           toast.success("🛒 Added to cart (Guest Mode)! Redirecting...");
//         } else {
//           toast.info("✅ Item already in cart! Redirecting...");
//         }

//         // Reset quantity
//         setProducts(prevProducts =>
//           prevProducts.map(p => {
//             if (p._id === product._id) {
//               return {
//                 ...p,
//                 variant: {
//                   ...p.variant,
//                   quantity: 0
//                 }
//               };
//             }
//             return p;
//           })
//         );

//         // AUTO REDIRECT TO CART PAGE
//         setTimeout(() => {
//           navigate("/Cartpage");
//         }, 1500);

//       } else {
//         toast.error(err.response?.data?.message || "❌ Failed to add product to cart");
//       }
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // ===================== PRODUCT LOADING =====================
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.get(API_LIST, { withCredentials: true });
//       const json = res.data;

//       let data = [];

//       if (Array.isArray(json)) {
//         // If response is an array
//         data = json.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (Array.isArray(json?.products)) {
//         // If response has products array
//         data = json.products.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (json?.data && Array.isArray(json.data)) {
//         // If response has data array
//         data = json.data.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       }

//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching best sellers:", err);
//       setError("Couldn't load best sellers. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // ===================== RENDER =====================
//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="mb-3 text-left ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 best-seller-headings spacing">
//         Best Sellers
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2">Loading best sellers...</p>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//           <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
//             Retry
//           </button>
//         </div>
//       )}

//       {products.length > 0 ? (
//         <div className="mobile-responsive-code position-relative">
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
//               1200: { slidesPerView: 5, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {products.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const allVariants = item.allVariants || [];

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = allVariants.length > 0;
//               const hasMultipleVariants = allVariants.length > 1;
//               const hasOnlyOneVariant = allVariants.length === 1;

//               // Check wishlist status for current variant
//               const selectedSku = getSku(variant);
//               const isProductInWishlist = isInWishlist(item._id, selectedSku);

//               // Separate variants into color (hex) variants and text variants
//               const colorVariants = allVariants.filter(v => v && isValidHexColor(v.hex));
//               const textVariants = allVariants.filter(v => v && !isValidHexColor(v.hex));
//               const hasColorVariants = colorVariants.length > 0;
//               const hasTextVariants = textVariants.length > 0;

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(allVariants);
//               const totalVariants = allVariants.length;

//               // Show only first 4 color variants initially
//               const initialColorVariants = colorVariants.slice(0, 4);
//               const hasMoreColorVariants = colorVariants.length > 4;

//               // Show only first 2 text variants initially
//               const initialTextVariants = textVariants.slice(0, 2);
//               const hasMoreTextVariants = textVariants.length > 2;

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
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
//                         <div className="justify-content-between d-flex flex-column" style={{height:'310px'}}>

//                         {/* Rating */}
//                         <div className="ratings mb-0 mt-2">
//                           <div className="d-flex align-items-center">
//                             <div className="star-rating gap-3">
//                               {[...Array(5)].map((_, i) => (
//                                 <i style={{ marginLeft: '4px' }}
//                                   key={i}
//                                   className={`bi ${item.avgRating > 0 && i < Math.floor(item.avgRating)
//                                       ? 'bi-star-fill text-warning'
//                                       : 'bi-star text-muted'
//                                     }`}
//                                 ></i>
//                               ))}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Brand Name */}
//                         <div className="brand-name small text-muted mb-1">
//                           {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
//                         </div>

//                         {/* Product Name */}
//                         <h6 
//                           className="foryou-name font-family-Poppins m-0 p-0"
//                           onClick={() => handleProductClick(item)}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           {item.name || "Unnamed Product"}
//                         </h6>

//                         {/* Dynamic Variant Display */}
//                         {hasVariants && (
//                           <div className="variant-section m-0 p-0 ms-0 ">
//                             {hasVariants && allVariants.length > 0 && (
//                               <>
//                                 {/* Color Variants Section */}
//                                 {hasColorVariants && (
//                                   <div className="color-variants-section">
//                                     <p className="variant-label text-muted small mb-2">
//                                       Select Color:
//                                     </p>
//                                     <div className="variant-list d-flex flex-wrap gap-2  ms-1">
//                                       {initialColorVariants.map((v, idx) => {
//                                         if (!v) return null;

//                                         const displayText = getVariantDisplayText(v);
//                                         const color = v.hex || "#ccc";
//                                         const stock = parseInt(v.stock || 0);
//                                         const isOutOfStock = stock <= 0;
//                                         const isSelected =
//                                           variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                         const isDisabled = !hasMultipleVariants || isOutOfStock;

//                                         return (
//                                           <div className="varient-margin" key={v.sku || v._id || idx} style={{ position: "relative" }}>
//                                             <div
//                                               className={`color-circle ${isSelected ? "selected" : ""}`}
//                                               style={{
//                                                 backgroundColor: color,
//                                                 marginTop: '7px',
//                                                 width: "20px",
//                                                 height: "20px",
//                                                 borderRadius: "20%",
//                                                 cursor: isDisabled ? "default" : "pointer",
//                                                 opacity: isOutOfStock ? 0.5 : 1,
//                                                 transition: "all 0.2s ease",
//                                               }}
//                                               onClick={() => {
//                                                 if (isDisabled) return;
//                                                 handleVariantSelect(item._id, v);
//                                               }}
//                                               title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                             >
//                                               {isSelected && (
//                                                 <span
//                                                   style={{
//                                                     position: "absolute",
//                                                     top: "50%",
//                                                     left: "50%",
//                                                     transform: "translate(-50%, -50%)",
//                                                     color: "#fff",
//                                                     fontSize: "10px",
//                                                     fontWeight: "bold",
//                                                   }}
//                                                 >
//                                                   ✓
//                                                 </span>
//                                               )}
//                                             </div>
//                                           </div>
//                                         );
//                                       })}

//                                       {/* More Button for Color Variants */}
//                                       {hasMoreColorVariants && (
//                                         <div className="varient-margin" style={{ position: "relative", marginTop: '7px' }}>
//                                           <button
//                                             className="more-variants-btn"
//                                             onClick={(e) => openVariantOverlay(item._id, "color", e)}
//                                             style={{
//                                               width: "20px",
//                                               height: "20px",
//                                               borderRadius: "4px",
//                                               backgroundColor: "#f5f5f5",
//                                               border: "1px solid #ddd",
//                                               cursor: "pointer",
//                                               display: "flex",
//                                               alignItems: "center",
//                                               justifyContent: "center",
//                                               fontSize: "10px",
//                                               fontWeight: "bold",
//                                               color: "#333"
//                                             }}
//                                             title={`Show all ${colorVariants.length} colors`}
//                                           >
//                                             +{colorVariants.length - 4}
//                                           </button>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* Text Variants Section */}
//                                 {hasTextVariants && (
//                                   <div className="text-variants-section">
//                                     <p className="variant-label text-muted small mb-2 mt-2">
//                                       Select Size:
//                                     </p>
//                                     <div className="variant-list d-flex flex-wrap gap-2">
//                                       {initialTextVariants.map((v, idx) => {
//                                         if (!v) return null;

//                                         const displayText = getVariantDisplayText(v);
//                                         const stock = parseInt(v.stock || 0);
//                                         const isOutOfStock = stock <= 0;
//                                         const isSelected =
//                                           variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                         const isDisabled = !hasMultipleVariants || isOutOfStock;

//                                         return (
//                                           <div key={v.sku || v._id || idx}>
//                                             <div
//                                               className={`variant-text-option ${isSelected ? "selected" : ""}`}
//                                               style={{
//                                                 padding: "4px 8px",
//                                                 borderRadius: "4px",
//                                                 border: isSelected ? "2px solid #000000" : "1px solid #ddd",
//                                                 backgroundColor: isSelected ? "#f8f9fa" : "#fff",
//                                                 color: isSelected ? "#000000" : "#333",
//                                                 fontSize: "12px",
//                                                 fontWeight: isSelected ? 600 : 400,
//                                                 cursor: isDisabled ? "default" : "pointer",
//                                                 opacity: isOutOfStock ? 0.5 : 1,
//                                                 minWidth: "60px",
//                                                 textAlign: "center",
//                                               }}
//                                               onClick={() => {
//                                                 if (isDisabled) return;
//                                                 handleVariantSelect(item._id, v);
//                                               }}
//                                               title={`${displayText} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                                             >
//                                               {displayText}
//                                               {isSelected && (
//                                                 <span className="ms-1" style={{ fontSize: "10px" }}>
//                                                   ✓
//                                                 </span>
//                                               )}
//                                             </div>
//                                           </div>
//                                         );
//                                       })}

//                                       {/* More Button for Text Variants */}
//                                       {hasMoreTextVariants && (
//                                         <div style={{ position: "relative" }}>
//                                           <button
//                                             className="more-variants-btn"
//                                             onClick={(e) => openVariantOverlay(item._id, "text", e)}
//                                             style={{
//                                               padding: "4px 8px",
//                                               borderRadius: "4px",
//                                               backgroundColor: "#f5f5f5",
//                                               border: "1px solid #ddd",
//                                               cursor: "pointer",
//                                               display: "flex",
//                                               alignItems: "center",
//                                               justifyContent: "center",
//                                               fontSize: "10px",
//                                               fontWeight: "bold",
//                                               color: "#333",
//                                               minWidth: "60px",
//                                             }}
//                                             title={`Show all ${textVariants.length} sizes`}
//                                           >
//                                             +{textVariants.length - 2}
//                                           </button>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             )}

//                             {hasVariants && allVariants.filter(v => parseInt(v.stock || 0) > 0).length === 0 && (
//                               <div className="no-variant-available small text-danger">
//                                 <i className="bi bi-exclamation-triangle me-1"></i>
//                                 All variants are out of stock
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {/* Price Section */}
//                         <div className="price-section mb-3">
//                           <div className="d-flex align-items-baseline flex-wrap">
//                             <span className="current-price fw-bold fs-5">
//                               {formatPrice(variant.displayPrice)}
//                             </span>

//                             {variant.originalPrice > variant.displayPrice && (
//                               <>
//                                 <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                   {formatPrice(variant.originalPrice)}
//                                 </span>
//                                 <span className="discount-percent text-danger fw-bold ms-2">
//                                   ({variant.discountPercent || 0}% OFF)
//                                 </span>
//                               </>
//                             )}
//                           </div>
//                         </div>

//                         {/* Add to Cart with Quantity */}
//                         <div className="cart-section">
//                           <div className="d-flex align-items-center justify-content-between">
//                             <button
//                               className={`w-100 ${variant.status === "inStock"} btn-add-cart`}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 if (variant.status !== "inStock") {
//                                   toast.info("This variant is out of stock. Please select another variant.");
//                                   return;
//                                 }
//                                 handleAddToCart(item);
//                               }}
//                               disabled={variant.status !== "inStock" || addingToCart[item._id]}
//                             >
//                               {addingToCart[item._id] ? (
//                                 <>
//                                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                   Adding...
//                                 </>
//                               ) : variant.status !== "inStock" ? (
//                                 <>
//                                   <i className="bi bi-x-circle me-1"></i>
//                                   Out of Stock
//                                 </>
//                               ) : (
//                                 <>
//                                   Add to Bag
//                                   <img src={bagIcon} className="img-fluid ms-1" style={{marginTop:'-3px'}} alt="Bag-icons" />
//                                 </>
//                               )}
//                             </button>
//                           </div>
//                         </div>
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
//                             width: '90%',
//                             maxWidth: '500px',
//                             maxHeight: '80vh',
//                             background: '#fff',
//                             borderRadius: '12px',
//                             overflow: 'hidden',
//                             display: 'flex',
//                             flexDirection: 'column'
//                           }}
//                         >
//                           <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                             <h5 className="m-0">Select Variant ({totalVariants})</h5>
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
//                               className={`variant-tab flex-fill py-3 ${selectedVariantType === "all" ? "active" : ""}`}
//                               onClick={() => setSelectedVariantType("all")}
//                             >
//                               All ({totalVariants})
//                             </button>
//                             {groupedVariants.color.length > 0 && (
//                               <button
//                                 className={`variant-tab flex-fill py-3 ${selectedVariantType === "color" ? "active" : ""}`}
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
//                               <div className="row row-cols-4 g-3 mb-4">
//                                 {groupedVariants.color.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col" key={getSku(v) || v._id}>
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
//                                             width: "28px",
//                                             height: "28px",
//                                             borderRadius: "20%",
//                                             backgroundColor: v.hex || "#ccc",
//                                             margin: "0 auto 8px",
//                                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
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
//                                         <div className="small">
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
//                               <div className="row row-cols-3 g-3">
//                                 {groupedVariants.text.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col" key={getSku(v) || v._id}>
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
//                                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
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
//           <button className="btn btn-primary mt-2" onClick={fetchProducts}>
//             Refresh
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BestSellers;















//===============================================================================================(Done-Code(Start))====================================================== 




// import React, { useEffect, useState, useCallback, useContext } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { useNavigate, useLocation } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import bagIcon from "../assets/bag.svg";
// import tick from "../assets/tick.svg";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { UserContext } from "./UserContext";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";
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

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   // Toast Utility (same as ProductPage)
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
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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

//   // ===================== HELPER FUNCTIONS =====================

//   // Helper to get product slug safely
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;

//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0];
//     }

//     if (product.slug) return product.slug;

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

//   // Helper to get variant type (color, size, ml, etc.)
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, [isValidHexColor]);

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
//       product.displayImage ||
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

//     const discountAmount = parseFloat(
//       selectedVariant.discountAmount ||
//       product.discountAmount ||
//       0
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
//     const sales = parseInt(selectedVariant.sales || product.sales || 0);

//     // Check if promo is applied
//     const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
//     const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

//     // Get brand name safely
//     const brandName = getBrandName(product);

//     // Get variant color (hex)
//     const hexColor = selectedVariant.hex || product.hex || "#000000";

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
//         discountAmount,
//         stock,
//         status,
//         sku,
//         sales,
//         promoApplied,
//         promoMessage,
//         hex: hexColor,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       description: product.description || "",
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v),
//       variants: allVariants // For compatibility with handleAddToCart
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

//   // ===================== VARIANT HANDLING =====================
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

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
//               _id: variant._id || variant.sku || `variant-${Date.now()}`
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType]);

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
//     const slug = product.slug || product._id;
//     if (slug) {
//       navigate(`/product/${slug}`);
//     }
//   }, [navigate]);

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
//         navigate("/login", { state: { from: location.pathname } });
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // ===================== PRODUCT LOADING =====================
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.get(API_LIST, { withCredentials: true });
//       const json = res.data;

//       let data = [];

//       if (Array.isArray(json)) {
//         // If response is an array
//         data = json.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (Array.isArray(json?.products)) {
//         // If response has products array
//         data = json.products.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (json?.data && Array.isArray(json.data)) {
//         // If response has data array
//         data = json.data.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       }

//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching best sellers:", err);
//       setError("Couldn't load best sellers. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // ===================== RENDER =====================
//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="mb-3 text-left ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 best-seller-headings spacing fw-normal">
//         Best Sellers
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2 page-title-main-name text-black fs-4">Loading best sellers...</p>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//           <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
//             Retry
//           </button>
//         </div>
//       )}

//       {products.length > 0 ? (
//         <div className="mobile-responsive-code position-relative">
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
//               1200: { slidesPerView: 5, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {products.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const allVariants = item.allVariants || [];

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = allVariants.length > 0;
//               const hasMultipleVariants = allVariants.length > 1;
//               const hasOnlyOneVariant = allVariants.length === 1;

//               // Check wishlist status for current variant
//               const selectedSku = getSku(variant);
//               const isProductInWishlist = isInWishlist(item._id, selectedSku);

//               // Separate variants into color (hex) variants and text variants
//               const colorVariants = allVariants.filter(v => v && isValidHexColor(v.hex));
//               const textVariants = allVariants.filter(v => v && !isValidHexColor(v.hex));
//               const hasColorVariants = colorVariants.length > 0;
//               const hasTextVariants = textVariants.length > 0;

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(allVariants);
//               const totalVariants = allVariants.length;

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
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '250px' }}>

//                           {/* Rating */}
//                           {/* <div className="ratings mb-0 mt-2">
//                             <div className="d-flex align-items-center">
//                               <div className="star-rating gap-3">
//                                 {[...Array(5)].map((_, i) => (
//                                   <i style={{ marginLeft: '4px' }}
//                                     key={i}
//                                     className={`bi ${item.avgRating > 0 && i < Math.floor(item.avgRating)
//                                       ? 'bi-star-fill text-warning'
//                                       : 'bi-star text-muted'
//                                       }`}
//                                   ></i>
//                                 ))}
//                               </div>
//                             </div>
//                           </div> */}

//                           {/* Brand Name */}
//                           <div className="brand-name small text-muted mb-1">
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

//                           {/* Dynamic Variant Display */}
//                           {hasVariants && (
//                             <div className="variant-section m-0 p-0 ms-0 ">
//                               {hasVariants && allVariants.length > 0 && (
//                                 <>
//                                   {/* Color Variants Section */}
//                                   {hasColorVariants && (
//                                     <div className="color-variants-section">
//                                       <p className="variant-label text-muted small mb-2">
//                                         Select Color:
//                                       </p>
//                                       <div className="variant-list d-flex flex-wrap gap-2  ms-1">
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
//                                                     <img src={tick} className="" style={{ width: '20px' }} alt="Image-Not-Found" />
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
//                                                 width: "20px",
//                                                 height: "20px",
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
//                                                     ✓
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

//                               {hasVariants && allVariants.filter(v => parseInt(v.stock || 0) > 0).length === 0 && (
//                                 <div className="no-variant-available small text-danger">
//                                   <i className="bi bi-exclamation-triangle me-1"></i>
//                                   All variants are out of stock
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

//                           {/* Add to Cart Button - UPDATED to match ProductPage */}
//                           <div className="cart-section">
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 className={`w-100 btn-add-cart`}
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
//                             width: '90%',
//                             maxWidth: '500px',
//                             maxHeight: '80vh',
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
//                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("text")}
//                               >
//                                 Sizes ({groupedVariants.text.length})
//                               </button>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="p-3 overflow-auto flex-grow-1">
//                             {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                               // <div className="row row-col-4 g-3 mb-4">
//                               <div className="row row-col-4 mb-4">
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
//                                         <div
//                                           style={{
//                                             width: "28px",
//                                             height: "28px",
//                                             borderRadius: "20%",
//                                             backgroundColor: v.hex || "#ccc",
//                                             margin: "0 auto 8px",
//                                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
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
//                                         <div className="small page-title-main-name">
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
//                               <div className="row row-cols-3 g-3">
//                                 {groupedVariants.text.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col" key={getSku(v) || v._id}>
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
//                                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
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
//           <button className="btn btn-primary mt-2" onClick={fetchProducts}>
//             Refresh
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BestSellers;
















// import React, { useEffect, useState, useCallback, useContext } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { useNavigate, useLocation } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import bagIcon from "../assets/bag.svg";
// import tick from "../assets/tick.svg";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { UserContext } from "./UserContext";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";
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

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("color");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   // Toast Utility (same as ProductPage)
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
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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

//   // ===================== HELPER FUNCTIONS =====================

//   // Helper to get product slug safely
//   const getProductSlug = useCallback((product) => {
//     if (!product) return null;

//     if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//       return product.slugs[0];
//     }

//     if (product.slug) return product.slug;

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

//   // Helper to get variant type (color, size, ml, etc.)
//   const getVariantType = useCallback((variant) => {
//     if (!variant) return 'default';
//     if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//     if (variant.shadeName) return 'shade';
//     if (variant.size) return 'size';
//     if (variant.ml) return 'ml';
//     if (variant.weight) return 'weight';
//     return 'default';
//   }, [isValidHexColor]);

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
//       product.displayImage ||
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

//     const discountAmount = parseFloat(
//       selectedVariant.discountAmount ||
//       product.discountAmount ||
//       0
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
//     const sales = parseInt(selectedVariant.sales || product.sales || 0);

//     // Check if promo is applied
//     const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
//     const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

//     // Get brand name safely
//     const brandName = getBrandName(product);

//     // Get variant color (hex)
//     const hexColor = selectedVariant.hex || product.hex || "#000000";

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
//         discountAmount,
//         stock,
//         status,
//         sku,
//         sales,
//         promoApplied,
//         promoMessage,
//         hex: hexColor,
//         variantType,
//         _id: selectedVariant._id || ""
//       },
//       image,
//       // Product-level data
//       brandId: product.brand,
//       description: product.description || "",
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available
//       allVariants: [...allVariants].filter(v => v),
//       variants: allVariants // For compatibility with handleAddToCart
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

//   // ===================== VARIANT HANDLING =====================
//   const handleVariantSelect = useCallback((productId, variant) => {
//     if (!productId || !variant) return;

//     setSelectedVariants(prev => ({
//       ...prev,
//       [productId]: variant
//     }));

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
//               _id: variant._id || variant.sku || `variant-${Date.now()}`
//             },
//             image: variant.images?.[0] || variant.image || product.image
//           };
//         }
//         return product;
//       })
//     );
//   }, [getVariantName, getVariantType]);

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
//     const slug = product.slug || product._id;
//     if (slug) {
//       navigate(`/product/${slug}`);
//     }
//   }, [navigate]);

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
//         navigate("/login", { state: { from: location.pathname } });
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   // Format price with Indian Rupee symbol
//   const formatPrice = useCallback((price) => {
//     const numPrice = parseFloat(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(numPrice);
//   }, []);

//   // ===================== PRODUCT LOADING =====================
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.get(API_LIST, { withCredentials: true });
//       const json = res.data;

//       let data = [];

//       if (Array.isArray(json)) {
//         // If response is an array
//         data = json.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (Array.isArray(json?.products)) {
//         // If response has products array
//         data = json.products.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       } else if (json?.data && Array.isArray(json.data)) {
//         // If response has data array
//         data = json.data.map((product, index) => {
//           const displayData = getProductDisplayData(product);
//           if (displayData) {
//             return {
//               ...displayData,
//               uniqueId: `best-${index}-${product._id || "noid"}`
//             };
//           }
//           return null;
//         }).filter(Boolean);
//       }

//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching best sellers:", err);
//       setError("Couldn't load best sellers. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // ===================== RENDER =====================
//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="mb-3 text-left ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 best-seller-headings spacing fw-normal">
//         Best Sellers
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2 page-title-main-name text-black fs-4">Loading best sellers...</p>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           {error}
//           <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
//             Retry
//           </button>
//         </div>
//       )}

//       {products.length > 0 ? (
//         <div className="mobile-responsive-code position-relative">
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
//               1200: { slidesPerView: 5, spaceBetween: 25 },
//             }}
//             className="foryou-swiper"
//           >
//             {products.map((item) => {
//               if (!item) return null;

//               const variant = item.variant || {};
//               const allVariants = item.allVariants || [];

//               let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

//               if (item.image) {
//                 imageUrl = item.image.startsWith("http")
//                   ? item.image
//                   : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//               }

//               // Check variant details
//               const hasVariants = allVariants.length > 0;
//               const hasMultipleVariants = allVariants.length > 1;
//               const hasOnlyOneVariant = allVariants.length === 1;

//               // Check wishlist status for current variant
//               const selectedSku = getSku(variant);
//               const isProductInWishlist = isInWishlist(item._id, selectedSku);

//               // Separate variants into color (hex) variants and text variants
//               const colorVariants = allVariants.filter(v => v && isValidHexColor(v.hex));
//               const textVariants = allVariants.filter(v => v && !isValidHexColor(v.hex));
//               const hasColorVariants = colorVariants.length > 0;
//               const hasTextVariants = textVariants.length > 0;

//               // Group all variants for overlay
//               const groupedVariants = groupVariantsByType(allVariants);
//               const totalVariants = allVariants.length;

//               // Show only first 4 color variants initially
//               const initialColorVariants = colorVariants.slice(0, 4);
//               const hasMoreColorVariants = colorVariants.length > 4;

//               // Show only first 2 text variants initially
//               const initialTextVariants = textVariants.slice(0, 2);
//               const hasMoreTextVariants = textVariants.length > 2;

//               // UPDATED: Check if a variant is selected for this product
//               const isVariantSelected = !!selectedVariants[item._id];

//               // UPDATED: Button state logic - Show "Select Variant" first if variants exist but none selected
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
//                       <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '250px' }}>

//                           {/* Rating */}
//                           {/* <div className="ratings mb-0 mt-2">
//                             <div className="d-flex align-items-center">
//                               <div className="star-rating gap-3">
//                                 {[...Array(5)].map((_, i) => (
//                                   <i style={{ marginLeft: '4px' }}
//                                     key={i}
//                                     className={`bi ${item.avgRating > 0 && i < Math.floor(item.avgRating)
//                                       ? 'bi-star-fill text-warning'
//                                       : 'bi-star text-muted'
//                                       }`}
//                                   ></i>
//                                 ))}
//                               </div>
//                             </div>
//                           </div> */}

//                           {/* Brand Name */}
//                           <div className="brand-name small text-muted mb-1">
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

//                           {/* Dynamic Variant Display - REMOVED COLOR VARIANTS SECTION */}
//                           {hasVariants && (
//                             <div className="variant-section m-0 p-0 ms-0 ">
//                               {hasVariants && allVariants.length > 0 && (
//                                 <>
//                                   {/* REMOVED: Color Variants Section */}

//                                   {/* Text Variants Section - KEPT AS IS */}
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
//                                                     ✓
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

//                               {hasVariants && allVariants.filter(v => parseInt(v.stock || 0) > 0).length === 0 && (
//                                 <div className="no-variant-available small text-danger">
//                                   <i className="bi bi-exclamation-triangle me-1"></i>
//                                   All variants are out of stock
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
//                                 className={`w-100 btn-add-cart`}
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
//                             width: '90%',
//                             maxWidth: '500px',
//                             maxHeight: '80vh',
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
//                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                                 onClick={() => setSelectedVariantType("text")}
//                               >
//                                 Sizes ({groupedVariants.text.length})
//                               </button>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="p-3 overflow-auto flex-grow-1">
//                             {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                               <div className="row row-col-4 mb-4">
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
//                                         <div
//                                           style={{
//                                             width: "28px",
//                                             height: "28px",
//                                             borderRadius: "20%",
//                                             backgroundColor: v.hex || "#ccc",
//                                             margin: "0 auto 8px",
//                                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
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
//                                         <div className="small page-title-main-name">
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
//                               <div className="row row-cols-3 g-3">
//                                 {groupedVariants.text.map((v) => {
//                                   const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                   const isOutOfStock = (v.stock ?? 0) <= 0;

//                                   return (
//                                     <div className="col" key={getSku(v) || v._id}>
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
//                                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
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
//           <button className="btn btn-primary mt-2" onClick={fetchProducts}>
//             Refresh
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BestSellers;






















// import React, { useEffect, useState, useCallback, useContext } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { useNavigate, useLocation } from "react-router-dom";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/BestSellers.css";
// import "../App.css";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import bagIcon from "../assets/bag.svg";
// import tick from "../assets/tick.svg";
// import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import { UserContext } from "./UserContext";

// const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";
// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// // Helper functions
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isValidHexColor = (hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
// };

// const getVariantDisplayText = (variant) => {
//     return (
//         variant.shadeName ||
//         variant.name ||
//         variant.size ||
//         variant.ml ||
//         variant.weight ||
//         "Default"
//     ).toUpperCase();
// };

// const groupVariantsByType = (variants) => {
//     const grouped = { color: [], text: [], default: [] };
//     variants.forEach((v) => {
//         if (!v) return;
//         if (v.hex && isValidHexColor(v.hex)) {
//             grouped.color.push(v);
//         } else {
//             grouped.text.push(v);
//         }
//     });
//     return grouped;
// };

// const BestSellers = () => {
//     const [products, setProducts] = useState([]);
//     const [selectedVariants, setSelectedVariants] = useState({});
//     const [addingToCart, setAddingToCart] = useState({});

//     // ===================== WISHLIST STATES =====================
//     const [wishlistLoading, setWishlistLoading] = useState({});
//     const [wishlistData, setWishlistData] = useState([]);
//     // ===================== END WISHLIST STATES =====================

//     const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//     const [selectedVariantType, setSelectedVariantType] = useState("color");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user } = useContext(UserContext);

//     // Toast Utility
//     const showToastMsg = (message, type = "error", duration = 3000) => {
//         if (type === "success") {
//             toast.success(message, { autoClose: duration });
//         } else if (type === "error") {
//             toast.error(message, { autoClose: duration });
//         } else {
//             toast.info(message, { autoClose: duration });
//         }
//     };

//     // ===================== WISHLIST FUNCTIONS =====================

//     const isInWishlist = (productId, sku) => {
//         if (!productId || !sku) return false;
//         return wishlistData.some(item =>
//             (item.productId === productId || item._id === productId) &&
//             item.sku === sku
//         );
//     };

//     const fetchWishlistData = async () => {
//         try {
//             if (user && !user.guest) {
//                 const response = await axios.get(
//                     "https://beauty.joyory.com/api/user/wishlist",
//                     { withCredentials: true }
//                 );
//                 if (response.data.success) {
//                     setWishlistData(response.data.wishlist || []);
//                 }
//             } else {
//                 const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//                 const formattedWishlist = localWishlist.map(item => ({
//                     productId: item._id,
//                     _id: item._id,
//                     sku: item.sku,
//                     name: item.name,
//                     variant: item.variantName,
//                     image: item.image,
//                     displayPrice: item.displayPrice,
//                     originalPrice: item.originalPrice,
//                     discountPercent: item.discountPercent,
//                     status: item.status,
//                     avgRating: item.avgRating,
//                     totalRatings: item.totalRatings
//                 }));
//                 setWishlistData(formattedWishlist);
//             }
//         } catch (error) {
//             console.error("Error fetching wishlist data:", error);
//             setWishlistData([]);
//         }
//     };

//     const toggleWishlist = async (prod, variant) => {
//         if (!user || user.guest) {
//             showToastMsg("Please login to use wishlist", "error");
//             navigate("/login", { state: { from: location.pathname } });
//             return;
//         }
//         if (!prod || !variant) {
//             showToastMsg("Please select a variant first", "error");
//             return;
//         }

//         const productId = prod._id;
//         const sku = getSku(variant);

//         setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//         try {
//             const currentlyInWishlist = isInWishlist(productId, sku);

//             if (user && !user.guest) {
//                 if (currentlyInWishlist) {
//                     await axios.delete(
//                         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//                         {
//                             withCredentials: true,
//                             data: { sku: sku }
//                         }
//                     );
//                     showToastMsg("Removed from wishlist!", "success");
//                 } else {
//                     await axios.post(
//                         `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//                         { sku: sku },
//                         { withCredentials: true }
//                     );
//                     showToastMsg("Added to wishlist!", "success");
//                 }

//                 await fetchWishlistData();
//             } else {
//                 const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//                 if (currentlyInWishlist) {
//                     const updatedWishlist = guestWishlist.filter(item =>
//                         !(item._id === productId && item.sku === sku)
//                     );
//                     localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//                     showToastMsg("Removed from wishlist!", "success");
//                 } else {
//                     const productData = {
//                         _id: productId,
//                         name: prod.name,
//                         brand: getBrandName(prod),
//                         price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//                         originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//                         mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//                         displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//                         images: variant.images || prod.images || ["/placeholder.png"],
//                         image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//                         slug: prod.slugs?.[0] || prod.slug || prod._id,
//                         sku: sku,
//                         variantSku: sku,
//                         variantId: sku,
//                         variantName: variant.shadeName || variant.name || "Default",
//                         shadeName: variant.shadeName || variant.name || "Default",
//                         variant: variant.shadeName || variant.name || "Default",
//                         hex: variant.hex || "#cccccc",
//                         stock: variant.stock || 0,
//                         status: variant.stock > 0 ? "inStock" : "outOfStock",
//                         avgRating: prod.avgRating || 0,
//                         totalRatings: prod.totalRatings || 0,
//                         commentsCount: prod.totalRatings || 0,
//                         discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice)
//                             ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//                             : 0
//                     };

//                     guestWishlist.push(productData);
//                     localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//                     showToastMsg("Added to wishlist!", "success");
//                 }

//                 await fetchWishlistData();
//             }
//         } catch (error) {
//             console.error("Wishlist toggle error:", error);
//             if (error.response?.status === 401) {
//                 showToastMsg("Please login to use wishlist", "error");
//                 navigate("/login");
//             } else {
//                 showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//             }
//         } finally {
//             setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//         }
//     };

//     useEffect(() => {
//         fetchWishlistData();
//     }, [user]);

//     // ===================== HELPER FUNCTIONS =====================

//     const getProductSlug = useCallback((product) => {
//         if (!product) return null;
//         if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
//             return product.slugs[0];
//         }
//         if (product.slug) return product.slug;
//         return product._id;
//     }, []);

//     const getBrandName = useCallback((product) => {
//         if (!product?.brand) return "Unknown Brand";
//         if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//         if (typeof product.brand === "string") return product.brand;
//         return "Unknown Brand";
//     }, []);

//     const getVariantName = useCallback((variant) => {
//         if (!variant) return "Default";
//         const nameSources = [
//             variant.shadeName,
//             variant.name,
//             variant.variantName,
//             variant.size,
//             variant.ml,
//             variant.weight
//         ];
//         for (const source of nameSources) {
//             if (source && typeof source === 'string') {
//                 return source;
//             }
//         }
//         return "Default";
//     }, []);

//     const getVariantType = useCallback((variant) => {
//         if (!variant) return 'default';
//         if (variant.hex && isValidHexColor(variant.hex)) return 'color';
//         if (variant.shadeName) return 'shade';
//         if (variant.size) return 'size';
//         if (variant.ml) return 'ml';
//         if (variant.weight) return 'weight';
//         return 'default';
//     }, []);

//     const getProductDisplayData = useCallback((product) => {
//         if (!product) return null;

//         const allVariants = Array.isArray(product.variants) ? product.variants :
//             Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

//         const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
//         const defaultVariant = allVariants[0] || {};

//         const storedVariant = selectedVariants[product._id];

//         let selectedVariant = storedVariant ||
//             (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

//         if (storedVariant) {
//             const storedStock = parseInt(storedVariant.stock || 0);
//             if (storedStock <= 0 && availableVariants.length > 0) {
//                 selectedVariant = availableVariants[0];
//             }
//         }

//         let image = "";
//         const getVariantImage = (variant) => {
//             return variant?.images?.[0] || variant?.image;
//         };

//         image = getVariantImage(selectedVariant) ||
//             getVariantImage(availableVariants[0]) ||
//             getVariantImage(defaultVariant) ||
//             product.image ||
//             product.displayImage ||
//             "";

//         const displayPrice = parseFloat(
//             selectedVariant.displayPrice ||
//             selectedVariant.discountedPrice ||
//             selectedVariant.price ||
//             product.price ||
//             0
//         );

//         const originalPrice = parseFloat(
//             selectedVariant.originalPrice ||
//             selectedVariant.mrp ||
//             product.mrp ||
//             displayPrice
//         );

//         const discountAmount = parseFloat(
//             selectedVariant.discountAmount ||
//             product.discountAmount ||
//             0
//         );

//         let discountPercent = parseFloat(
//             selectedVariant.discountPercent ||
//             product.discountPercent ||
//             0
//         );

//         if (!discountPercent && originalPrice > displayPrice) {
//             discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//         }

//         const variantName = getVariantName(selectedVariant);
//         const variantType = getVariantType(selectedVariant);
//         const variantDisplayText = getVariantDisplayText(selectedVariant);

//         const stock = parseInt(selectedVariant.stock || product.stock || 0);
//         const status = stock > 0 ? "inStock" : "outOfStock";
//         const sku = selectedVariant.sku || product.sku || "";
//         const sales = parseInt(selectedVariant.sales || product.sales || 0);

//         const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
//         const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

//         const brandName = getBrandName(product);
//         const hexColor = selectedVariant.hex || product.hex || "#000000";
//         const productSlug = getProductSlug(product);

//         return {
//             ...product,
//             _id: product._id || "",
//             name: product.name || "Unnamed Product",
//             brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
//             slug: productSlug,
//             variant: {
//                 ...selectedVariant,
//                 variantName,
//                 variantDisplayText,
//                 displayPrice,
//                 originalPrice,
//                 discountPercent,
//                 discountAmount,
//                 stock,
//                 status,
//                 sku,
//                 sales,
//                 promoApplied,
//                 promoMessage,
//                 hex: hexColor,
//                 variantType,
//                 _id: selectedVariant._id || ""
//             },
//             image,
//             brandId: product.brand,
//             description: product.description || "",
//             avgRating: parseFloat(product.avgRating || 0),
//             totalRatings: parseInt(product.totalRatings || 0),
//             allVariants: [...allVariants].filter(v => v),
//             variants: allVariants
//         };
//     }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

//     // ===================== VARIANT HANDLING =====================
//     const handleVariantSelect = useCallback((productId, variant) => {
//         if (!productId || !variant) return;

//         setSelectedVariants(prev => ({
//             ...prev,
//             [productId]: variant
//         }));

//         setProducts(prevProducts =>
//             prevProducts.map(product => {
//                 if (product._id === productId) {
//                     const stock = parseInt(variant.stock || 0);
//                     const displayPrice = parseFloat(
//                         variant.displayPrice ||
//                         variant.discountedPrice ||
//                         variant.price ||
//                         product.price ||
//                         0
//                     );

//                     const originalPrice = parseFloat(
//                         variant.originalPrice ||
//                         variant.mrp ||
//                         product.mrp ||
//                         displayPrice
//                     );

//                     let discountPercent = parseFloat(variant.discountPercent || product.discountPercent || 0);
//                     if (!discountPercent && originalPrice > displayPrice) {
//                         discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
//                     }

//                     const variantName = getVariantName(variant);
//                     const variantType = getVariantType(variant);
//                     const variantDisplayText = getVariantDisplayText(variant);
//                     const hexColor = variant.hex || product.hex || "#000000";

//                     return {
//                         ...product,
//                         variant: {
//                             ...variant,
//                             variantName,
//                             variantDisplayText,
//                             displayPrice,
//                             originalPrice,
//                             discountPercent,
//                             stock,
//                             status: stock > 0 ? "inStock" : "outOfStock",
//                             sku: variant.sku || "",
//                             hex: hexColor,
//                             variantType,
//                             _id: variant._id || variant.sku || `variant-${Date.now()}`
//                         },
//                         image: variant.images?.[0] || variant.image || product.image
//                     };
//                 }
//                 return product;
//             })
//         );
//     }, [getVariantName, getVariantType]);

//     const openVariantOverlay = (productId, variantType = "all", e) => {
//         if (e) e.stopPropagation();
//         setSelectedVariantType(variantType);
//         setShowVariantOverlay(productId);
//     };

//     const closeVariantOverlay = () => {
//         setShowVariantOverlay(null);
//         setSelectedVariantType("all");
//     };

//     const handleProductClick = useCallback((product) => {
//         if (!product) return;
//         const slug = product.slug || product._id;
//         if (slug) {
//             navigate(`/product/${slug}`);
//         }
//     }, [navigate]);

//     // ===================== ADD TO CART ====================
//     const handleAddToCart = async (prod) => {
//         setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//         try {
//             const variants = Array.isArray(prod.variants) ? prod.variants : [];
//             const hasVariants = variants.length > 0;
//             let payload;

//             if (hasVariants) {
//                 const selectedVariant = selectedVariants[prod._id] || prod.variant;
//                 if (!selectedVariant || selectedVariant.stock <= 0) {
//                     showToastMsg("Please select an in-stock variant.", "error");
//                     return;
//                 }

//                 payload = {
//                     productId: prod._id,
//                     variants: [
//                         {
//                             variantSku: getSku(selectedVariant),
//                             quantity: 1,
//                         },
//                     ],
//                 };

//                 const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//                 cache[prod._id] = selectedVariant;
//                 localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//             } else {
//                 if (prod.stock <= 0) {
//                     showToastMsg("Product is out of stock.", "error");
//                     return;
//                 }

//                 payload = {
//                     productId: prod._id,
//                     quantity: 1,
//                 };

//                 const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//                 delete cache[prod._id];
//                 localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//             }

//             const response = await axios.post(
//                 `${CART_API_BASE}/add`,
//                 payload,
//                 { withCredentials: true }
//             );

//             if (!response.data.success) {
//                 throw new Error(response.data.message || "Failed to add to cart");
//             }

//             showToastMsg("Product added to cart!", "success");
//             navigate("/cartpage");
//         } catch (err) {
//             console.error("Add to Cart error:", err);
//             const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//             showToastMsg(msg, "error");

//             if (err.response?.status === 401) {
//                 navigate("/login", { state: { from: location.pathname } });
//             }
//         } finally {
//             setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//         }
//     };

//     const formatPrice = useCallback((price) => {
//         const numPrice = parseFloat(price || 0);
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(numPrice);
//     }, []);

//     // ===================== PRODUCT LOADING =====================
//     const fetchProducts = async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await axios.get(API_LIST, { withCredentials: true });
//             const json = res.data;

//             let data = [];

//             if (Array.isArray(json)) {
//                 data = json.map((product, index) => {
//                     const displayData = getProductDisplayData(product);
//                     if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
//                     return null;
//                 }).filter(Boolean);
//             } else if (Array.isArray(json?.products)) {
//                 data = json.products.map((product, index) => {
//                     const displayData = getProductDisplayData(product);
//                     if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
//                     return null;
//                 }).filter(Boolean);
//             } else if (json?.data && Array.isArray(json.data)) {
//                 data = json.data.map((product, index) => {
//                     const displayData = getProductDisplayData(product);
//                     if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
//                     return null;
//                 }).filter(Boolean);
//             }

//             setProducts(data);
//         } catch (err) {
//             console.error("❌ Error fetching best sellers:", err);
//             setError("Couldn't load best sellers. Please try again later.");
//             setProducts([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     // ===================== RENDER =====================
//     return (
//         <div className="container-fluid my-4 position-relative margin-left-rights pb-0 mb-0">
//             <ToastContainer position="top-right" autoClose={3000} />

//             <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 best-seller-headings spacing fw-normal">
//                 Best Sellers
//             </h2>

//             {loading && (
//                 <div className="text-center">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="text-muted mt-2 page-title-main-name text-black fs-4">Loading best sellers...</p>
//                 </div>
//             )}

//             {error && (
//                 <div className="alert alert-danger text-center" role="alert">
//                     {error}
//                     <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
//                         Retry
//                     </button>
//                 </div>
//             )}

//             {products.length > 0 ? (
//                 <div className="mobile-responsive-code position-relative">
//                     <Swiper
//                         modules={[Autoplay, Pagination, Navigation]}
//                         pagination={{ clickable: true, dynamicBullets: true }}
//                         navigation={{
//                             nextEl: '.swiper-button-next',
//                             prevEl: '.swiper-button-prev',
//                         }}
//                         breakpoints={{
//                             300: { slidesPerView: 2, spaceBetween: 10 },
//                             576: { slidesPerView: 2.5, spaceBetween: 15 },
//                             768: { slidesPerView: 3, spaceBetween: 15 },
//                             992: { slidesPerView: 4, spaceBetween: 20 },
//                             1200: { slidesPerView: 4, spaceBetween: 25 },
//                         }}
//                         className="foryou-swiper pb-0 mb-0"
//                     >
//                         {products.map((item) => {
//                             if (!item) return null;

//                             const variant = item.variant || {};
//                             const allVariants = item.allVariants || [];

//                             let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

//                             if (item.image) {
//                                 imageUrl = item.image.startsWith("http")
//                                     ? item.image
//                                     : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
//                             }

//                             // Check variant details
//                             const hasVariants = allVariants.length > 0;

//                             // Check wishlist status for current variant
//                             const selectedSku = getSku(variant);
//                             const isProductInWishlist = isInWishlist(item._id, selectedSku);

//                             // Group all variants for overlay
//                             const groupedVariants = groupVariantsByType(allVariants);
//                             const totalVariants = allVariants.length;

//                             // Check if a variant is explicitly selected
//                             const isVariantSelected = !!selectedVariants[item._id];

//                             // Button state logic - SHOW SELECT VARIANT FIRST
//                             const isAdding = addingToCart[item._id];
//                             const outOfStock = hasVariants
//                                 ? (variant?.stock <= 0)
//                                 : (item.stock <= 0);

//                             const showSelectVariantButton = hasVariants && !isVariantSelected;
//                             const buttonDisabled = isAdding || outOfStock;

//                             let buttonText = "Add to Bag";
//                             if (isAdding) {
//                                 buttonText = "Adding...";
//                             } else if (showSelectVariantButton) {
//                                 buttonText = "Select Variant";
//                             } else if (outOfStock) {
//                                 buttonText = "Out of Stock";
//                             }

//                             return (
//                                 <SwiperSlide key={item.uniqueId}>
//                                     <div className="foryou-card-wrapper">
//                                         <div className="foryou-card">
//                                             {/* Product Image with Overlays */}
//                                             <div
//                                                 className="foryou-img-wrapper"
//                                                 onClick={() => handleProductClick(item)}
//                                                 style={{ cursor: 'pointer' }}
//                                             >
//                                                 <img
//                                                     src={imageUrl}
//                                                     alt={item.name || "Product"}
//                                                     className="foryou-img img-fluid"
//                                                     loading="lazy"
//                                                     onError={(e) => {
//                                                         e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//                                                     }}
//                                                 />

//                                                 {/* Wishlist Icon */}
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         if (variant) {
//                                                             toggleWishlist(item, variant);
//                                                         }
//                                                     }}
//                                                     disabled={wishlistLoading[item._id]}
//                                                     style={{
//                                                         position: 'absolute',
//                                                         top: '10px',
//                                                         right: '10px',
//                                                         cursor: wishlistLoading[item._id] ? 'not-allowed' : 'pointer',
//                                                         color: isProductInWishlist ? '#dc3545' : '#000000',
//                                                         fontSize: '22px',
//                                                         zIndex: 2,
//                                                         backgroundColor: 'transparent !important',
//                                                         borderRadius: '50%',
//                                                         width: '34px',
//                                                         height: '34px',
//                                                         display: 'flex',
//                                                         alignItems: 'center',
//                                                         justifyContent: 'center',
//                                                         // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                                                         transition: 'all 0.3s ease',
//                                                         border: 'none',
//                                                         outline: 'none'
//                                                     }}
//                                                     title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                                                 >
//                                                     {wishlistLoading[item._id] ? (
//                                                         <div className="spinner-border spinner-border-sm" role="status"></div>
//                                                     ) : isProductInWishlist ? (
//                                                         <FaHeart />
//                                                     ) : (
//                                                         <FaRegHeart />
//                                                     )}
//                                                 </button>

//                                                 {/* Promo Badge */}
//                                                 {variant.promoApplied && (
//                                                     <div className="promo-badge">
//                                                         <i className="bi bi-tag-fill me-1"></i>
//                                                         Promo
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Product Info */}
//                                             <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
//                                                 <div className="justify-content-between d-flex flex-column" 
//                                                 style={{ height: '250px' }}>

//                                                     {/* Brand Name */}
//                                                     <div className="brand-name small text-muted text-start mb-1 mt-2">
//                                                         {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
//                                                     </div>

//                                                     {/* Product Name */}
//                                                     <h6
//                                                         className="foryou-name font-family-Poppins m-0 p-0"
//                                                         onClick={() => handleProductClick(item)}
//                                                         style={{ cursor: 'pointer' }}
//                                                     >
//                                                         {item.name || "Unnamed Product"}
//                                                     </h6>

//                                                     {/* Minimal Variant Display Instead of Colored Bubbles */}
//                                                     {hasVariants && (
//                                                         <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                                                             {isVariantSelected ? (
//                                                                 <div
//                                                                     className="selected-variant-display text-muted small"
//                                                                     style={{ cursor: 'pointer', display: 'inline-block' }}
//                                                                     onClick={(e) => openVariantOverlay(item._id, "all", e)}
//                                                                     title="Click to change variant"
//                                                                 >
//                                                                     Variant: <span className="fw-bold text-dark">{getVariantDisplayText(variant)}</span>
//                                                                     <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                                                                 </div>
//                                                             ) : (
//                                                                 <div className="small text-muted" style={{ height: '20px' }}>
//                                                                     {allVariants.length} Variants Available
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     )}

//                                                     {/* Price Section */}
//                                                     <div className="price-section mb-3 mt-auto">
//                                                         <div className="d-flex align-items-baseline flex-wrap">
//                                                             <span className="current-price fw-400 fs-5">
//                                                                 {formatPrice(variant.displayPrice)}
//                                                             </span>

//                                                             {variant.originalPrice > variant.displayPrice && (
//                                                                 <>
//                                                                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                                                                         {formatPrice(variant.originalPrice)}
//                                                                     </span>
//                                                                     <span className="discount-percent text-danger fw-bold ms-2">
//                                                                         ({variant.discountPercent || 0}% OFF)
//                                                                     </span>
//                                                                 </>
//                                                             )}
//                                                         </div>
//                                                     </div>

//                                                     {/* Add to Cart / Select Variant Button */}
//                                                     <div className="cart-section">
//                                                         <div className="d-flex align-items-center justify-content-between">
//                                                             <button
//                                                                 // className={`w-100 btn-add-cart`}

//                                                                 className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${isAdding ? "" : "btn-outline-dark"
//                                                                     }`}
//                                                                 onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     if (showSelectVariantButton) {
//                                                                         openVariantOverlay(item._id, "all", e);
//                                                                     } else {
//                                                                         handleAddToCart(item);
//                                                                     }
//                                                                 }}
//                                                                 disabled={buttonDisabled}
//                                                                 style={{
//                                                                     transition: "background-color 0.3s ease, color 0.3s ease",
//                                                                 }}
//                                                             >
//                                                                 {isAdding ? (
//                                                                     <>
//                                                                         <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                                                         Adding...
//                                                                     </>
//                                                                 ) : (
//                                                                     <>
//                                                                         {buttonText}
//                                                                         {!buttonDisabled && !isAdding && !showSelectVariantButton && (
//                                                                             <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                                                                         )}
//                                                                     </>
//                                                                 )}
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Variant Overlay */}
//                                         {showVariantOverlay === item._id && (
//                                             <div className="variant-overlay" onClick={closeVariantOverlay}>
//                                                 <div
//                                                     className="variant-overlay-content m-0 p-0 w-100"
//                                                     onClick={(e) => e.stopPropagation()}
//                                                     style={{
//                                                         width: '90%',
//                                                         maxWidth: '500px',
//                                                         maxHeight: 'auto',
//                                                         background: '#fff',
//                                                         borderRadius: '0px',
//                                                         overflow: 'hidden',
//                                                         display: 'flex',
//                                                         flexDirection: 'column'
//                                                     }}
//                                                 >
//                                                     <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                                                         <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
//                                                         <button
//                                                             onClick={closeVariantOverlay}
//                                                             style={{
//                                                                 background: 'none',
//                                                                 border: 'none',
//                                                                 fontSize: '24px',
//                                                             }}
//                                                         >
//                                                             ×
//                                                         </button>
//                                                     </div>

//                                                     {/* Tabs */}
//                                                     <div className="variant-tabs d-flex">
//                                                         <button
//                                                             className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                                                             onClick={() => setSelectedVariantType("all")}
//                                                         >
//                                                             All ({totalVariants})
//                                                         </button>
//                                                         {groupedVariants.color.length > 0 && (
//                                                             <button
//                                                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                                                                 onClick={() => setSelectedVariantType("color")}
//                                                             >
//                                                                 Colors ({groupedVariants.color.length})
//                                                             </button>
//                                                         )}
//                                                         {groupedVariants.text.length > 0 && (
//                                                             <button
//                                                                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                                                                 onClick={() => setSelectedVariantType("text")}
//                                                             >
//                                                                 Sizes ({groupedVariants.text.length})
//                                                             </button>
//                                                         )}
//                                                     </div>

//                                                     {/* Content */}
//                                                     <div className="p-3 overflow-auto flex-grow-1">
//                                                         {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
//                                                             <div className="row row-col-4">
//                                                                 {groupedVariants.color.map((v) => {
//                                                                     const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                                                     const isOutOfStock = (v.stock ?? 0) <= 0;

//                                                                     return (
//                                                                         <div className="col-lg-4 col-5" key={getSku(v) || v._id}>
//                                                                             <div
//                                                                                 className="text-center"
//                                                                                 style={{
//                                                                                     cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                                                                 }}
//                                                                                 onClick={() =>
//                                                                                     !isOutOfStock &&
//                                                                                     (handleVariantSelect(item._id, v),
//                                                                                         closeVariantOverlay())
//                                                                                 }
//                                                                             >
//                                                                                 <div
//                                                                                     style={{
//                                                                                         width: "28px",
//                                                                                         height: "28px",
//                                                                                         borderRadius: "20%",
//                                                                                         backgroundColor: v.hex || "#ccc",
//                                                                                         margin: "0 auto 8px",
//                                                                                         border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                                                                         opacity: isOutOfStock ? 0.5 : 1,
//                                                                                         position: "relative",
//                                                                                     }}
//                                                                                 >
//                                                                                     {isSelected && (
//                                                                                         <span
//                                                                                             style={{
//                                                                                                 position: "absolute",
//                                                                                                 top: "50%",
//                                                                                                 left: "50%",
//                                                                                                 transform: "translate(-50%, -50%)",
//                                                                                                 color: "#fff",
//                                                                                                 fontWeight: "bold",
//                                                                                             }}
//                                                                                         >
//                                                                                             ✓
//                                                                                         </span>
//                                                                                     )}
//                                                                                 </div>
//                                                                                 <div className="small page-title-main-name" style={{ fontSize: '12px' }}>
//                                                                                     {getVariantDisplayText(v)}
//                                                                                 </div>
//                                                                                 {isOutOfStock && (
//                                                                                     <div className="text-danger small">
//                                                                                         Out of Stock
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         </div>
//                                                                     );
//                                                                 })}
//                                                             </div>
//                                                         )}

//                                                         {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
//                                                             <div className="row row-cols-3 g-3">
//                                                                 {groupedVariants.text.map((v) => {
//                                                                     const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
//                                                                     const isOutOfStock = (v.stock ?? 0) <= 0;

//                                                                     return (
//                                                                         <div className="col" key={getSku(v) || v._id}>
//                                                                             <div
//                                                                                 className="text-center"
//                                                                                 style={{
//                                                                                     cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                                                                 }}
//                                                                                 onClick={() =>
//                                                                                     !isOutOfStock &&
//                                                                                     (handleVariantSelect(item._id, v),
//                                                                                         closeVariantOverlay())
//                                                                                 }
//                                                                             >
//                                                                                 <div
//                                                                                     style={{
//                                                                                         padding: "10px",
//                                                                                         borderRadius: "8px",
//                                                                                         border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                                                                         background: isSelected ? "#f8f9fa" : "#fff",
//                                                                                         minHeight: "50px",
//                                                                                         display: "flex",
//                                                                                         alignItems: "center",
//                                                                                         justifyContent: "center",
//                                                                                         opacity: isOutOfStock ? 0.5 : 1,
//                                                                                     }}
//                                                                                 >
//                                                                                     {getVariantDisplayText(v)}
//                                                                                 </div>
//                                                                                 {isOutOfStock && (
//                                                                                     <div className="text-danger small mt-1">
//                                                                                         Out of Stock
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         </div>
//                                                                     );
//                                                                 })}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </SwiperSlide>
//                             );
//                         })}
//                     </Swiper>
//                 </div>
//             ) : !loading && !error && (
//                 <div className="text-center py-5">
//                     <i className="bi bi-box-seam display-4 text-muted"></i>
//                     <p className="text-muted mt-3">No products available at the moment.</p>
//                     <button className="btn btn-primary mt-2" onClick={fetchProducts}>
//                         Refresh
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BestSellers;















import React, { useEffect, useState, useCallback, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/BestSellers.css";
import "../App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import bagIcon from "../assets/bag.svg";
import tick from "../assets/tick.svg";
import { FaHeart, FaRegHeart, FaChevronDown, FaTimes } from "react-icons/fa";
import { UserContext } from "./UserContext";

const API_LIST = "https://beauty.joyory.com/api/user/products/top-sellers";
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

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});

    // ===================== WISHLIST STATES =====================
    const [wishlistLoading, setWishlistLoading] = useState({});
    const [wishlistData, setWishlistData] = useState([]);
    // ===================== END WISHLIST STATES =====================

    // ===================== OUT OF STOCK POPUP STATE =====================
    const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
    const [outOfStockProductName, setOutOfStockProductName] = useState("");
    // ===================== END OUT OF STOCK POPUP STATE =====================

    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("color");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

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

    // ===================== OUT OF STOCK POPUP HANDLER =====================
    const handleOutOfStockClick = (productName) => {
        setOutOfStockProductName(productName || "This product");
        setShowOutOfStockPopup(true);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            setShowOutOfStockPopup(false);
        }, 3000);
    };

    const closeOutOfStockPopup = () => {
        setShowOutOfStockPopup(false);
    };
    // ===================== END OUT OF STOCK POPUP HANDLER =====================

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
                const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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
        if (!user || user.guest) {
            showToastMsg("Please login to use wishlist", "error");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
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
                        slug: prod.slugs?.[0] || prod.slug || prod._id,
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

    // ===================== HELPER FUNCTIONS =====================

    const getProductSlug = useCallback((product) => {
        if (!product) return null;
        if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
            return product.slugs[0];
        }
        if (product.slug) return product.slug;
        return product._id;
    }, []);

    const getBrandName = useCallback((product) => {
        if (!product?.brand) return "Unknown Brand";
        if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
        if (typeof product.brand === "string") return product.brand;
        return "Unknown Brand";
    }, []);

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

        const storedVariant = selectedVariants[product._id];

        let selectedVariant = storedVariant ||
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
            product.displayImage ||
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

        const discountAmount = parseFloat(
            selectedVariant.discountAmount ||
            product.discountAmount ||
            0
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
        const sales = parseInt(selectedVariant.sales || product.sales || 0);

        const promoApplied = selectedVariant.promoApplied || product.promoApplied || false;
        const promoMessage = selectedVariant.promoMessage || product.promoMessage || "";

        const brandName = getBrandName(product);
        const hexColor = selectedVariant.hex || product.hex || "#000000";
        const productSlug = getProductSlug(product);

        return {
            ...product,
            _id: product._id || "",
            name: product.name || "Unnamed Product",
            brandName: typeof brandName === 'string' ? brandName : "Unknown Brand",
            slug: productSlug,
            variant: {
                ...selectedVariant,
                variantName,
                variantDisplayText,
                displayPrice,
                originalPrice,
                discountPercent,
                discountAmount,
                stock,
                status,
                sku,
                sales,
                promoApplied,
                promoMessage,
                hex: hexColor,
                variantType,
                _id: selectedVariant._id || ""
            },
            image,
            brandId: product.brand,
            description: product.description || "",
            avgRating: parseFloat(product.avgRating || 0),
            totalRatings: parseInt(product.totalRatings || 0),
            allVariants: [...allVariants].filter(v => v),
            variants: allVariants,
            // Check if ALL variants are out of stock
            isCompletelyOutOfStock: allVariants.length > 0 && availableVariants.length === 0
        };
    }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

    // ===================== VARIANT HANDLING =====================
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
                            _id: variant._id || variant.sku || `variant-${Date.now()}`
                        },
                        image: variant.images?.[0] || variant.image || product.image
                    };
                }
                return product;
            })
        );
    }, [getVariantName, getVariantType]);

    const openVariantOverlay = (productId, variantType = "all", e) => {
        if (e) e.stopPropagation();
        setSelectedVariantType(variantType);
        setShowVariantOverlay(productId);
    };

    const closeVariantOverlay = () => {
        setShowVariantOverlay(null);
        setSelectedVariantType("all");
    };

    const handleProductClick = useCallback((product) => {
        if (!product) return;
        const slug = product.slug || product._id;
        if (slug) {
            navigate(`/product/${slug}`);
        }
    }, [navigate]);

    // ===================== ADD TO CART ====================
    const handleAddToCart = async (prod) => {
        setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
        try {
            const variants = Array.isArray(prod.variants) ? prod.variants : [];
            const hasVariants = variants.length > 0;
            let payload;

            if (hasVariants) {
                const selectedVariant = selectedVariants[prod._id] || prod.variant;
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
                navigate("/login", { state: { from: location.pathname } });
            }
        } finally {
            setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
        }
    };

    const formatPrice = useCallback((price) => {
        const numPrice = parseFloat(price || 0);
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(numPrice);
    }, []);

    // ===================== PRODUCT LOADING =====================
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(API_LIST, { withCredentials: true });
            const json = res.data;

            let data = [];

            if (Array.isArray(json)) {
                data = json.map((product, index) => {
                    const displayData = getProductDisplayData(product);
                    if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
                    return null;
                }).filter(Boolean);
            } else if (Array.isArray(json?.products)) {
                data = json.products.map((product, index) => {
                    const displayData = getProductDisplayData(product);
                    if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
                    return null;
                }).filter(Boolean);
            } else if (json?.data && Array.isArray(json.data)) {
                data = json.data.map((product, index) => {
                    const displayData = getProductDisplayData(product);
                    if (displayData) return { ...displayData, uniqueId: `best-${index}-${product._id || "noid"}` };
                    return null;
                }).filter(Boolean);
            }

            setProducts(data);
        } catch (err) {
            console.error("❌ Error fetching best sellers:", err);
            setError("Couldn't load best sellers. Please try again later.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ===================== RENDER =====================
    return (
        <div className="container-fluid my-4 position-relative margin-left-rights pb-0 mb-0">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* ===================== OUT OF STOCK POPUP ===================== */}
            {showOutOfStockPopup && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={closeOutOfStockPopup}
                >
                    <div 
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '30px 40px',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            position: 'relative',
                            animation: 'popupSlideIn 0.3s ease-out',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeOutOfStockPopup}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#666',
                            }}
                        >
                            <FaTimes />
                        </button>
                        
                        <div 
                            style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: '#fee2e2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px',
                            }}
                        >
                            <FaTimes 
                                style={{
                                    color: '#dc3545',
                                    fontSize: '30px',
                                }}
                            />
                        </div>
                        
                        <h5 
                            className="page-title-main-name"
                            style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                marginBottom: '10px',
                                color: '#333',
                            }}
                        >
                            Out of Stock
                        </h5>
                        
                        <p 
                            style={{
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '20px',
                            }}
                        >
                            {/* {outOfStockProductName} is currently out of stock. Please check back later or browse similar products. */}
                            "Oops! {outOfStockProductName} is out of stock right now. Check back soon or discover similar items."
                        </p>
                        
                        <button
                            onClick={closeOutOfStockPopup}
                            className="btn btn-dark w-100"
                            style={{
                                borderRadius: '8px',
                                padding: '10px',
                            }}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
            {/* ===================== END OUT OF STOCK POPUP ===================== */}

            <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 best-seller-headings spacing fw-normal">
                Best Sellers
            </h2>

            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2 page-title-main-name text-black fs-4">Loading best sellers...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
                        Retry
                    </button>
                </div>
            )}

            {products.length > 0 ? (
                <div className="mobile-responsive-code position-relative">
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
                        className="foryou-swiper pb-0 mb-0"
                    >
                        {products.map((item) => {
                            if (!item) return null;

                            const variant = item.variant || {};
                            const allVariants = item.allVariants || [];

                            let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";

                            if (item.image) {
                                imageUrl = item.image.startsWith("http")
                                    ? item.image
                                    : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
                            }

                            // Check variant details
                            const hasVariants = allVariants.length > 0;

                            // Check wishlist status for current variant
                            const selectedSku = getSku(variant);
                            const isProductInWishlist = isInWishlist(item._id, selectedSku);

                            // Group all variants for overlay
                            const groupedVariants = groupVariantsByType(allVariants);
                            const totalVariants = allVariants.length;

                            // Check if a variant is explicitly selected
                            const isVariantSelected = !!selectedVariants[item._id];

                            // Check if product is completely out of stock (all variants OOS)
                            const isCompletelyOutOfStock = item.isCompletelyOutOfStock || false;
                            
                            // Check if current selected variant is out of stock
                            const isCurrentVariantOutOfStock = variant.stock <= 0;

                            // Button state logic
                            const isAdding = addingToCart[item._id];
                            
                            // Determine if we should show out of stock state
                            const showOutOfStock = isCompletelyOutOfStock || (hasVariants && isCurrentVariantOutOfStock && !isVariantSelected);
                            
                            const showSelectVariantButton = hasVariants && !isVariantSelected && !isCompletelyOutOfStock;
                            
                            const buttonDisabled = isAdding || showOutOfStock;

                            let buttonText = "Add to Bag";
                            if (isAdding) {
                                buttonText = "Adding...";
                            } else if (showOutOfStock) {
                                buttonText = "Out of Stock";
                            } else if (showSelectVariantButton) {
                                buttonText = "Select Variant";
                            }

                            return (
                                <SwiperSlide key={item.uniqueId}>
                                    <div className="foryou-card-wrapper">
                                        <div className="foryou-card">
                                            {/* Product Image with Overlays */}
                                            <div
                                                className="foryou-img-wrapper"
                                                onClick={() => {
                                                    if (showOutOfStock) {
                                                        handleOutOfStockClick(item.name);
                                                    } else {
                                                        handleProductClick(item);
                                                    }
                                                }}
                                                style={{ cursor: showOutOfStock ? 'pointer' : 'pointer', position: 'relative' }}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={item.name || "Product"}
                                                    className="foryou-img img-fluid"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
                                                    }}
                                                    style={{
                                                        opacity: showOutOfStock ? 0.6 : 1,
                                                        filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
                                                    }}
                                                />

                                                {/* OUT OF STOCK OVERLAY */}
                                                {showOutOfStock && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            zIndex: 3,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                backgroundColor: '#dc3545',
                                                                color: '#fff',
                                                                padding: '8px 16px',
                                                                borderRadius: '20px',
                                                                fontSize: '14px',
                                                                fontWeight: 600,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '5px',
                                                            }}
                                                        >
                                                            <FaTimes />
                                                            Out of Stock
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Wishlist Icon - Hidden when out of stock */}
                                                {!showOutOfStock && (
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
                                                            backgroundColor: 'transparent !important',
                                                            borderRadius: '50%',
                                                            width: '34px',
                                                            height: '34px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
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
                                                )}

                                                {/* Promo Badge */}
                                                {/* {variant.promoApplied && !showOutOfStock && (
                                                    <div className="promo-badge">
                                                        <i className="bi bi-tag-fill me-1"></i>
                                                        Promo
                                                    </div>
                                                )} */}
                                            </div>

                                            {/* Product Info */}
                                            <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
                                                <div className="justify-content-between d-flex flex-column" 
                                                style={{ height: '250px' }}>

                                                    {/* Brand Name */}
                                                    <div className="brand-name small text-muted text-start mb-1 mt-2">
                                                        {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
                                                    </div>

                                                    {/* Product Name */}
                                                    <h6
                                                        className="foryou-name font-family-Poppins m-0 p-0"
                                                        onClick={() => {
                                                            if (showOutOfStock) {
                                                                handleOutOfStockClick(item.name);
                                                            } else {
                                                                handleProductClick(item);
                                                            }
                                                        }}
                                                        style={{ 
                                                            cursor: 'pointer',
                                                            opacity: showOutOfStock ? 0.6 : 1,
                                                        }}
                                                    >
                                                        {item.name || "Unnamed Product"}
                                                    </h6>

                                                    {/* Minimal Variant Display Instead of Colored Bubbles */}
                                                    {hasVariants && !showOutOfStock && (
                                                        <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
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
                                                                    {allVariants.length} Variants Available
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Show out of stock message in variant area */}
                                                    {showOutOfStock && (
                                                        <div className="mt-2 mb-2">
                                                            <span 
                                                                style={{
                                                                    color: '#dc3545',
                                                                    fontSize: '13px',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                <FaTimes style={{ fontSize: '11px', marginRight: '4px' }} />
                                                                Currently unavailable
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Price Section */}
                                                    <div className="price-section mb-3 mt-auto">
                                                        <div className="d-flex align-items-baseline flex-wrap">
                                                            <span 
                                                                className="current-price fw-400 fs-5"
                                                                style={{
                                                                    textDecoration: showOutOfStock ? 'line-through' : 'none',
                                                                    opacity: showOutOfStock ? 0.6 : 1,
                                                                }}
                                                            >
                                                                {formatPrice(variant.displayPrice)}
                                                            </span>

                                                            {variant.originalPrice > variant.displayPrice && !showOutOfStock && (
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

                                                    {/* Add to Cart / Select Variant / Out of Stock Button */}
                                                    <div className="cart-section">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <button
                                                                className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${
                                                                    showOutOfStock 
                                                                        ? "btn-secondary" 
                                                                        : isAdding 
                                                                            ? "" 
                                                                            : "btn-outline-dark"
                                                                }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (showOutOfStock) {
                                                                        handleOutOfStockClick(item.name);
                                                                    } else if (showSelectVariantButton) {
                                                                        openVariantOverlay(item._id, "all", e);
                                                                    } else {
                                                                        handleAddToCart(item);
                                                                    }
                                                                }}
                                                                disabled={buttonDisabled && !showOutOfStock}
                                                                style={{
                                                                    transition: "background-color 0.3s ease, color 0.3s ease",
                                                                    opacity: showOutOfStock ? 0.8 : 1,
                                                                    cursor: showOutOfStock ? 'pointer' : (buttonDisabled ? 'not-allowed' : 'pointer'),
                                                                }}
                                                            >
                                                                {isAdding ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                        Adding...
                                                                    </>
                                                                ) : showOutOfStock ? (
                                                                    <>
                                                                        <FaTimes style={{ fontSize: '14px' }} />
                                                                        Out of Stock
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
                                        {showVariantOverlay === item._id && !showOutOfStock && (
                                            <div className="variant-overlay" onClick={closeVariantOverlay}>
                                                <div
                                                    className="variant-overlay-content m-0 p-0 w-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        width: '90%',
                                                        maxWidth: '500px',
                                                        maxHeight: 'auto',
                                                        background: '#fff',
                                                        borderRadius: '0px',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        flexDirection: 'column'
                                                    }}
                                                >
                                                    <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                                        <h5 className="m-0 page-title-main-name">Select Variant ({totalVariants})</h5>
                                                        <button
                                                            onClick={closeVariantOverlay}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                fontSize: '24px',
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
                                                                className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
                                                                onClick={() => setSelectedVariantType("text")}
                                                            >
                                                                Sizes ({groupedVariants.text.length})
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-3 overflow-auto flex-grow-1">
                                                        {(selectedVariantType === "all" || selectedVariantType === "color") && groupedVariants.color.length > 0 && (
                                                            <div className="row row-col-4">
                                                                {groupedVariants.color.map((v) => {
                                                                    const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
                                                                    const isOutOfStock = (v.stock ?? 0) <= 0;

                                                                    return (
                                                                        <div className="col-lg-4 col-5" key={getSku(v) || v._id}>
                                                                            <div
                                                                                className="text-center"
                                                                                style={{
                                                                                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                                                                                }}
                                                                                onClick={() =>
                                                                                    !isOutOfStock &&
                                                                                    (handleVariantSelect(item._id, v),
                                                                                        closeVariantOverlay())
                                                                                }
                                                                            >
                                                                                <div
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
                                                                                        <FaTimes style={{ fontSize: '10px' }} /> Out of Stock
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        {(selectedVariantType === "all" || selectedVariantType === "text") && groupedVariants.text.length > 0 && (
                                                            <div className="row row-cols-3 g-3">
                                                                {groupedVariants.text.map((v) => {
                                                                    const isSelected = variant.sku === v.sku || (variant._id && variant._id === v._id);
                                                                    const isOutOfStock = (v.stock ?? 0) <= 0;

                                                                    return (
                                                                        <div className="col" key={getSku(v) || v._id}>
                                                                            <div
                                                                                className="text-center"
                                                                                style={{
                                                                                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                                                                                }}
                                                                                onClick={() =>
                                                                                    !isOutOfStock &&
                                                                                    (handleVariantSelect(item._id, v),
                                                                                        closeVariantOverlay())
                                                                                }
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
                                                                                        <FaTimes style={{ fontSize: '10px' }} /> Out of Stock
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
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
                    <button className="btn btn-primary mt-2" onClick={fetchProducts}>
                        Refresh
                    </button>
                </div>
            )}
        </div>
    );
};

export default BestSellers;



//===============================================================================================(Done-Code(End))====================================================== 




