// import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
// import { createPortal } from "react-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "../components/common/Header";
// import Footer from "../components/common/Footer";
// import "../styles/CartPage.css";
// import "../styles/ForYou.css";
// import "../App.css";
// import "../styles/Foundation.css";
// import { CartContext } from "../context/CartContext";
// import { WishlistContext } from "../context/WishlistContext";
// import { FaTimes, FaHeart, FaRegHeart, FaChevronDown, FaCheck } from "react-icons/fa";
// import { Modal, Button, Alert } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import applyGif from "../assets/Apply.gif";
// import axios from "axios";
// import { UserContext } from "../context/UserContext.jsx";
// import bagIcon from "../assets/bag.svg";

// const API_BASE = "https://beauty.joyory.com/api/user/cart";
// const INITIATE_ORDER_API = `${API_BASE}/order/initiate`;
// const RECOMMENDATIONS_API = "https://beauty.joyory.com/api/user/recommendations/cart";
// const WISHLIST_CACHE_KEY = "guestWishlist";

// // ─── Variant helpers (same as Foryou.jsx) ────────────────────────────────────
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
// };

// const getVariantDisplayText = (variant) =>
//   (
//     variant?.shadeName ||
//     variant?.name ||
//     variant?.size ||
//     variant?.ml ||
//     variant?.weight ||
//     "Default"
//   ).toUpperCase();

// const groupVariantsByType = (variants) => {
//   const grouped = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
//     else grouped.text.push(v);
//   });
//   return grouped;
// };

// // ─── Recommendation / Wishlist product card (mirrors Foryou.jsx exactly) ───────────
// const formatPrice = (price) =>
//   new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

// // ─── Recommendation / Wishlist product card (mirrors Foryou.jsx exactly) ───────────
// const RecoProductCard = ({ product, navigate, user, onAddToCartSuccess }) => {
//   const allVariants = useMemo(
//     () => product?.variants || product?.product?.variants || product?.shadeOptions || product?.product?.shadeOptions || [],
//     [product]
//   );

//   const hasVariants = allVariants.length > 0;

//   const [selectedVariant, setSelectedVariant] = useState(
//     () => product?.selectedVariant || product?.product?.selectedVariant || allVariants.find((v) => v.stock > 0) || allVariants[0] || {}
//   );
//   const [tempSelectedVariant, setTempSelectedVariant] = useState(null);
//   const [variantSelected, setVariantSelected] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);

//   // ===================== OUT OF STOCK POPUP STATE =====================
//   const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
//   const [outOfStockProductName, setOutOfStockProductName] = useState("");

//   const handleOutOfStockClick = (productName) => {
//     setOutOfStockProductName(productName || "This product");
//     setShowOutOfStockPopup(true);
//     setTimeout(() => setShowOutOfStockPopup(false), 3000);
//   };

//   const closeOutOfStockPopup = () => setShowOutOfStockPopup(false);
//   // ===================== END OUT OF STOCK POPUP STATE =====================

//   const location = useLocation();

//   /* wishlist helpers */
//   const isInWishlist = useCallback(
//     (productId, sku) =>
//       wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
//     [wishlistData]
//   );

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
//       }
//     } catch { setWishlistData([]); }
//   }, [user]);

//   useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

//   /* computed */
//   const displayVariant = tempSelectedVariant || selectedVariant || {};

//   const displayPrice = parseFloat(
//     displayVariant?.displayPrice || displayVariant?.discountedPrice || displayVariant?.price || product?.price || product?.product?.price || 0
//   );
//   const originalPrice = parseFloat(
//     displayVariant?.originalPrice || displayVariant?.mrp || product?.mrp || product?.product?.mrp || displayPrice
//   );
//   let discountPercent = parseFloat(displayVariant?.discountPercent || product?.discountPercent || product?.product?.discountPercent || 0);
//   if (!discountPercent && originalPrice > displayPrice)
//     discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

//   const activeVar = displayVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
//   const stock = parseInt((hasVariants ? activeVar?.stock : (product?.stock || product?.product?.stock)) || 0);
//   const outOfStock = stock <= 0;

//   // Check if ALL variants are out of stock
//   const isCompletelyOutOfStock = hasVariants
//     ? allVariants.every(v => parseInt(v.stock || 0) <= 0)
//     : parseInt(product?.stock || product?.product?.stock || 0) <= 0;

//   const showSelectVariantBtn = hasVariants && allVariants.length > 1;

//   const imageUrl = useMemo(() => {
//     let rawImage = displayVariant?.images?.[0] || displayVariant?.image ||
//       product?.selectedVariant?.images?.[0] || product?.product?.selectedVariant?.images?.[0] ||
//       product?.images?.[0] || product?.product?.images?.[0] ||
//       product?.image || product?.product?.image ||
//       '';
//     if (rawImage) {
//       return rawImage.startsWith("http")
//         ? rawImage
//         : `https://res.cloudinary.com/dekngswix/image/upload/${rawImage}`;
//     }
//     return 'https://placehold.co/400x300/ffffff/cccccc?text=Product';
//   }, [displayVariant, product]);

//   const sku = getSku(displayVariant);
//   const productId = product?.product?._id || product?._id;
//   const productInWishlist = isInWishlist(productId, sku);
//   const groupedVariants = groupVariantsByType(allVariants);

//   const getBrandName = () => {
//     const brand = product?.brand || product?.product?.brand;
//     if (!brand) return 'Unknown Brand';
//     if (typeof brand === 'object' && brand.name) return brand.name;
//     return typeof brand === 'string' ? brand : 'Unknown Brand';
//   };

//   const getProductSlug = () =>
//     product?.slugs?.[0] || product?.product?.slugs?.[0] ||
//     product?.slug || product?.product?.slug ||
//     productId;

//   /* actions */
//   const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(false);
//     setTempSelectedVariant(null);
//   };

//   const handleAddToCart = async (forceVariant = null) => {
//     setAddingToCart(true);
//     try {
//       let payload;
//       if (hasVariants) {
//         const sel = forceVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
//         if (!sel || (sel.stock ?? 0) <= 0) { toast.error('Please select an in-stock variant.'); return; }
//         payload = { productId: productId, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
//       } else {
//         if (outOfStock) { toast.error('Product is out of stock.'); return; }
//         payload = { productId: productId, quantity: 1 };
//       }

//       // Cache selected variant
//       const chosen = forceVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
//       if (hasVariants && chosen) {
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[productId] = chosen;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[productId];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       const res = await axios.post(`${API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!res.data.success) throw new Error(res.data.message || 'Failed');
//       toast.success('Product added to cart!');
//       if (onAddToCartSuccess) {
//         onAddToCartSuccess();
//       } else {
//         navigate('/cartpage');
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || 'Failed to add product');
//       if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const handleToggleWishlist = async (e) => {
//     e.stopPropagation();
//     if (!selectedVariant) { toast.error('Please select a variant first'); return; }
//     setWishlistLoading(true);
//     try {
//       const inWl = isInWishlist(productId, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { withCredentials: true, data: { sku } });
//           toast.success('Removed from wishlist!');
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { sku }, { withCredentials: true });
//           toast.success('Added to wishlist!');
//         }
//         await fetchWishlistData();
//       } else {
//         const local = JSON.parse(localStorage.getItem('guestWishlist')) || [];
//         if (inWl) {
//           localStorage.setItem('guestWishlist', JSON.stringify(local.filter((i) => !(i._id === productId && i.sku === sku))));
//           toast.success('Removed from wishlist!');
//         } else {
//           const pName = product?.product?.name || product?.name || 'Unnamed Product';
//           local.push({ _id: productId, name: pName, sku, image: imageUrl, displayPrice, originalPrice });
//           localStorage.setItem('guestWishlist', JSON.stringify(local));
//           toast.success('Added to wishlist!');
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) { toast.error('Please login to use wishlist'); navigate('/login'); }
//       else toast.error('Failed to update wishlist');
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   // Determine if we should show out of stock state (entirely OOS)
//   const showOutOfStock = isCompletelyOutOfStock && !hasVariants;

//   const buttonDisabled = addingToCart || showOutOfStock;

//   let buttonText = "Add to Bag";
//   if (addingToCart) {
//     buttonText = "Adding...";
//   } else if (showOutOfStock) {
//     buttonText = "Out of Stock";
//   } else if (showSelectVariantBtn) {
//     buttonText = "Select Variant";
//   } else if (outOfStock) {
//     buttonText = "Out of Stock";
//   }

//   const pName = product?.product?.name || product?.name || 'Unnamed Product';

//   return (
//     <div className="foryou-card-wrapper" style={{ flex: "0 0 auto" }}>
//       <div className="foryou-card">
//         {/* Product Image with Overlays */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => {
//             if (showOutOfStock) {
//               handleOutOfStockClick(pName);
//             } else {
//               navigate(`/product/${getProductSlug()}`);
//             }
//           }}
//           style={{ cursor: 'pointer', position: 'relative' }}
//         >
//           <img
//             src={imageUrl}
//             alt={pName}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
//             style={{
//               opacity: showOutOfStock ? 0.6 : 1,
//               filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
//             }}
//           />

//           {(product?.supportsVTO || product?.product?.supportsVTO) && (
//             <div 
//               className="support-beauty-badge" 
//               title="Try It On" 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 navigate(`/product/${getProductSlug()}`);
//               }}
//               onTouchStart={(e) => e.stopPropagation()}
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M3 7V5a2 2 0 0 1 2-2h2" />
//                 <path d="M17 3h2a2 2 0 0 1 2 2v2" />
//                 <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
//                 <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
//                 <path d="M8 10a4 4 0 1 1 8 0c0 2.2-1.8 4-4 4s-4-1.8-4-4z" />
//                 <path d="M10 10h.01" />
//                 <path d="M14 10h.01" />
//                 <path d="M10 13c.5.5 1.5.7 2 .7s1.5-.2 2-.7" />
//                 <path d="M6 19c0-1.5 1.5-2.5 6-2.5s6 1 6 2.5" />
//               </svg>
//               <span className="vto-text">TRY IT ON</span>
//             </div>
//           )}

//           {/* OUT OF STOCK OVERLAY */}
//           {showOutOfStock && (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 3,
//               }}
//             >
//               <div
//                 style={{
//                   backgroundColor: '#dc3545',
//                   color: '#fff',
//                   padding: '8px 16px',
//                   borderRadius: '20px',
//                   fontSize: '14px',
//                   fontWeight: 600,
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '5px',
//                 }}
//               >
//                 <FaTimes />
//                 Out of Stock
//               </div>
//             </div>
//           )}

//           {/* Wishlist Icon - Hidden when out of stock */}
//           {!showOutOfStock && (
//             <button className='bg-transparent'
//               onClick={handleToggleWishlist}
//               disabled={wishlistLoading}
//               style={{
//                 position: 'absolute',
//                 top: '10px',
//                 right: '10px',
//                 cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//                 color: productInWishlist ? '#dc3545' : '#ccc',
//                 fontSize: '22px',
//                 zIndex: 2,
//                 backgroundColor: 'transparent !important',
//                 borderRadius: '50%',
//                 width: '34px',
//                 height: '34px',
//                 minHeight: '34px',
//                 maxHeight: '34px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 transition: 'all 0.3s ease',
//                 border: 'none',
//                 outline: 'none',
//               }}
//               title={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//             >
//               {wishlistLoading ? (
//                 <div className="spinner-border spinner-border-sm" role="status" />
//               ) : productInWishlist ? (
//                 <FaHeart />
//               ) : (
//                 <FaRegHeart />
//               )}
//             </button>
//           )}
//         </div>

//         {/* Product Info */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           <div className="justify-content-between d-flex flex-column" style={{ height: '200px' }}>
//             {/* Brand Name */}
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

//             {/* Product Name */}
//<div className="product-card-title-wrap"><h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => {
//                 if (showOutOfStock) {
//                   handleOutOfStockClick(pName);
//                 } else {
//                   navigate(`/product/${getProductSlug()}`);
//                 }
//               }}
//               style={{
//                 cursor: 'pointer',
//                 opacity: showOutOfStock ? 0.6 : 1,
//               }}
//             >
//               {(() => {
//                 const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
//                 return varText && varText.toUpperCase() !== "DEFAULT" ? `${pName} - ${varText}` : pName;
//               })()}
//             </h6></div>//             {/* Show out of stock message in variant area */}
//             {showOutOfStock && (
//               <div className="mt-2 mb-2">
//                 <span
//                   style={{
//                     color: '#dc3545',
//                     fontSize: '13px',
//                     fontWeight: 500,
//                   }}
//                 >
//                   <FaTimes style={{ fontSize: '11px', marginRight: '4px' }} />
//                   Currently unavailable
//                 </span>
//               </div>
//             )}

//             {/* Price Section */}
//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span
//                   className="current-price fw-400 fs-5"
//                   style={{
//                     textDecoration: showOutOfStock ? 'line-through' : 'none',
//                     opacity: showOutOfStock ? 0.6 : 1,
//                   }}
//                 >
//                   {formatPrice(displayPrice)}
//                 </span>
//                 {originalPrice > displayPrice && !showOutOfStock && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
//                     <span className="discount-percent fw-bold ms-2">({discountPercent}% OFF)</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Add to Cart / Select Variant / Out of Stock Button */}
//             <div className="cart-section">
//               <div className="d-flex align-items-center justify-content-between">
//                 <button
//                   className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${showOutOfStock
//                     ? "btn-secondary"
//                     : addingToCart
//                       ? ""
//                       : "btn-outline-dark"
//                     }`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (showOutOfStock) {
//                       handleOutOfStockClick(pName);
//                     } else if (showSelectVariantBtn) {
//                       setShowVariantOverlay(true);
//                     } else {
//                       handleAddToCart();
//                     }
//                   }}
//                   disabled={buttonDisabled && !showOutOfStock}
//                   style={{
//                     transition: "background-color 0.3s ease, color 0.3s ease",
//                     opacity: showOutOfStock ? 0.8 : 1,
//                     cursor: showOutOfStock ? 'pointer' : (buttonDisabled ? 'not-allowed' : 'pointer'),
//                   }}
//                 >
//                   {addingToCart ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" />
//                       Adding...
//                     </>
//                   ) : showOutOfStock ? (
//                     <>
//                       <FaTimes style={{ fontSize: '14px' }} />
//                       Out of Stock
//                     </>
//                   ) : (
//                     <>
//                       {buttonText}
//                       {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
//                         <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                       )}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Desktop Variant Overlay */}
//       {showVariantOverlay && !showOutOfStock && (
//         <div className="variant-overlay" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}>
//           <div
//             className="variant-overlay-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">Select Variant</h5>
//               <button onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }} style={{ background: 'none', border: 'none', fontSize: '40px' }}>×</button>
//             </div>

//             <div className="variant-overlay-body">
//               {groupedVariants.color.length > 0 && (
//                 <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
//                   {groupedVariants.color.map((v) => {
//                     const isSel = displayVariant.sku === v.sku;
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div
//                         key={getSku(v) || v._id}
//                         style={{ cursor: isOOS ? "not-allowed" : "pointer", position: "relative" }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (!isOOS) {
//                             handleVariantSelect(v);
//                             setTempSelectedVariant(v);
//                           }
//                         }}
//                         title={v.shadeName}
//                       >
//                         <div
//                           style={{
//                             width: "32px",
//                             height: "32px",
//                             borderRadius: "20%",
//                             backgroundColor: v.hex || "#ccc",
//                             border: isSel ? "3px solid #000" : "1px solid #ddd",
//                             opacity: isOOS ? 0.4 : 1,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           {isSel && (
//                             <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
//                               ✓
//                             </span>
//                           )}
//                         </div>
//                         {isOOS && (
//                           <span style={{
//                             position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                             color: "red", fontWeight: "bold", fontSize: 16, pointerEvents: "none"
//                           }}>✕</span>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
//                   {groupedVariants.text.map((v) => {
//                     const isSel = displayVariant.sku === v.sku;
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     return (
//                       <div
//                         key={getSku(v) || v._id}
//                         className="variant-text-item"
//                         style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (!isOOS) {
//                             handleVariantSelect(v);
//                             setTempSelectedVariant(v);
//                           }
//                         }}
//                       >
//                         <div
//                           style={{
//                             padding: "8px 16px",
//                             borderRadius: "8px",
//                             border: isSel ? "2px solid #000" : "1px solid #ddd",
//                             background: isSel ? "#f8f9fa" : "#fff",
//                             opacity: isOOS ? 0.4 : 1,
//                             textDecoration: isOOS ? "line-through" : "none"
//                           }}
//                         >
//                           {getVariantDisplayText(v)}
//                           {isOOS && <span className="text-danger small ms-1">(OOS)</span>}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             <div className="variant-overlay-footer">
//               <div className="small text-muted fw-semibold">
//                 Selected: <span className="text-dark fw-bold">{getVariantDisplayText(displayVariant)}</span>
//               </div>
//               <div className="mt-1 mb-2 text-start">
//                 <span
//                   onClick={(e) => { e.stopPropagation(); navigate(`/product/${getProductSlug()}`); }}
//                   className="text-decoration-none fw-semibold"
//                   style={{ cursor: 'pointer', fontSize: '12px' }}
//                 >
//                   View Details
//                 </span>
//               </div>
//               <button
//                 className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${addingToCart ? "btn-dark" : "btn-outline-dark"}`}
//                 onClick={async (e) => {
//                   e.stopPropagation();
//                   const chosen = tempSelectedVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
//                   if (chosen) {
//                     handleVariantSelect(chosen);
//                   }
//                   await handleAddToCart(chosen);
//                   closeVariantOverlay();
//                 }}
//                 disabled={addingToCart || (displayVariant && displayVariant.stock <= 0)}
//                 style={{
//                   transition: "background-color 0.3s ease, color 0.3s ease",
//                 }}
//               >
//                 {addingToCart ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Adding...
//                   </>
//                 ) : displayVariant?.stock <= 0 ? (
//                   "Out of Stock"
//                 ) : (
//                   <>
//                     Add to Bag
//                     {!addingToCart && displayVariant?.stock > 0 && (
//                       <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Bottom Sheet Drawer using React Portal */}
//       {showVariantOverlay && !showOutOfStock && createPortal(
//         <>
//           <div
//             className="mobile-sheet-backdrop"
//             onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}
//           />
//           <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
//             {/* Drag grabber */}
//             <div className="mobile-sheet-grabber" onClick={closeVariantOverlay} style={{ cursor: 'pointer' }} />

//             {/* Header */}
//             <div className="mobile-sheet-header">
//               <h3 className="mobile-sheet-title">
//                 {groupedVariants.color.length > 0 ? "Select Shade" : "Select Variant"}
//               </h3>
//               <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
//                 &times;
//               </button>
//             </div>

//             {/* Body content */}
//             <div className="mobile-sheet-body">
//               {groupedVariants.color.length > 0 && (
//                 <div className="mobile-sheet-variants-grid">
//                   {groupedVariants.color.map((v) => {
//                     const isSel = displayVariant.sku === v.sku;
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     const variantText = getVariantDisplayText(v);

//                     return (
//                       <div
//                         key={getSku(v) || v._id}
//                         className={`mobile-sheet-variant-item ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (!isOOS) {
//                             handleVariantSelect(v);
//                             setTempSelectedVariant(v);
//                           }
//                         }}
//                       >
//                         <div
//                           className={`mobile-sheet-color-circle ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}
//                           style={{ backgroundColor: v.hex || "#ccc", position: "relative" }}
//                         >
//                           {isSel && (
//                             <FaCheck className="mobile-sheet-check-icon" />
//                           )}
//                           {isOOS && (
//                             <span style={{
//                               position: 'absolute',
//                               top: 0,
//                               left: 0,
//                               right: 0,
//                               bottom: 0,
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               color: 'red',
//                               fontWeight: 'bold',
//                               fontSize: '14px',
//                               pointerEvents: 'none',
//                             }}>✕</span>
//                           )}
//                         </div>
//                         <span className="mobile-sheet-variant-text">
//                           {variantText}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {groupedVariants.text.length > 0 && (
//                 <div className="mobile-sheet-variants-grid">
//                   {groupedVariants.text.map((v) => {
//                     const isSel = displayVariant.sku === v.sku;
//                     const isOOS = (v.stock ?? 0) <= 0;
//                     const variantText = getVariantDisplayText(v);

//                     return (
//                       <div
//                         key={getSku(v) || v._id}
//                         className="mobile-sheet-variant-item"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (!isOOS) {
//                             handleVariantSelect(v);
//                             setTempSelectedVariant(v);
//                           }
//                         }}
//                       >
//                         <button className={`mobile-sheet-text-pill ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}>
//                           <span>{variantText}</span>
//                           {isSel && <FaCheck style={{ fontSize: '10px' }} />}
//                           {isOOS && (
//                             <span style={{
//                               color: 'red',
//                               fontWeight: 'bold',
//                               marginLeft: '6px',
//                               fontSize: '12px',
//                             }}>✕</span>
//                           )}
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Footer Price & Info */}
//             <div className="mobile-sheet-footer">
//               <div className="mobile-sheet-footer-left">
//                 <span className="mobile-sheet-selected-label">
//                   {getVariantDisplayText(displayVariant)}
//                 </span>
//                 <div className="mobile-sheet-price-row">
//                   <span className="mobile-sheet-current-price">
//                     {formatPrice(displayVariant.displayPrice)}
//                   </span>
//                   {displayVariant.originalPrice > displayVariant.displayPrice && (
//                     <>
//                       <span className="mobile-sheet-original-price">
//                         {formatPrice(displayVariant.originalPrice)}
//                       </span>
//                       <span className="mobile-sheet-discount">
//                         ({displayVariant.discountPercent || 0}% OFF)
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </div>
//               <span
//                 className="mobile-sheet-view-details"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/product/${getProductSlug()}`);
//                   closeVariantOverlay();
//                 }}
//               >
//                 View Details
//               </span>
//             </div>

//             {/* Add to Bag Button */}
//             <div className="mobile-sheet-action-wrap">
//               <button
//                 className="mobile-sheet-btn-add"
//                 disabled={addingToCart || (displayVariant && displayVariant.stock <= 0)}
//                 onClick={async (e) => {
//                   e.stopPropagation();
//                   const chosen = tempSelectedVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
//                   if (chosen) {
//                     handleVariantSelect(chosen);
//                   }
//                   await handleAddToCart(chosen);
//                   closeVariantOverlay();
//                 }}
//               >
//                 {addingToCart ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm" role="status" />
//                     Adding...
//                   </>
//                 ) : (displayVariant && displayVariant.stock <= 0) ? (
//                   "Out of Stock"
//                 ) : (
//                   "Add to Bag"
//                 )}
//               </button>
//             </div>
//           </div>
//         </>
//         , document.body
//       )}

//       {/* Out of stock popup using React Portal */}
//       {showOutOfStockPopup && createPortal(
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             zIndex: 99999,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//           onClick={closeOutOfStockPopup}
//         >
//           <div
//             style={{
//               backgroundColor: '#fff',
//               borderRadius: '12px',
//               padding: '30px 40px',
//               maxWidth: '400px',
//               width: '90%',
//               textAlign: 'center',
//               boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
//               position: 'relative',
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closeOutOfStockPopup}
//               style={{
//                 position: 'absolute',
//                 top: '10px',
//                 right: '15px',
//                 background: 'none',
//                 border: 'none',
//                 fontSize: '24px',
//                 cursor: 'pointer',
//                 color: '#666',
//               }}
//             >
//               &times;
//             </button>
//             <div style={{ fontSize: '50px', marginBottom: '15px' }}>😢</div>
//             <h4 style={{ fontWeight: 600, marginBottom: '10px' }}>Out of Stock</h4>
//             <p style={{ color: '#666', margin: 0 }}>
//               Oops! {outOfStockProductName} is out of stock right now. We are working hard to restock it as soon as possible!
//             </p>
//           </div>
//         </div>
//         , document.body
//       )}
//     </div>
//   );
// };

// // ─── Main CartPage ────────────────────────────────────────────────────────────
// const CartPage = () => {
//   const [isClicked, setIsClicked] = useState(false);
//   const [applyingCoupon, setApplyingCoupon] = useState(false);
//   const [showApplyAnimation, setShowApplyAnimation] = useState(false);
//   const [movingToWishlist, setMovingToWishlist] = useState(false);

//   const handleClick = () => {
//     setIsClicked(true);
//     handleCloseConfirm(); // your existing function
//   };

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { syncCartFromBackend } = useContext(CartContext);
//   const { syncWishlist } = useContext(WishlistContext);
//   const { user } = useContext(UserContext);

//   const [cartData, setCartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initiating, setInitiating] = useState(false);
//   const [stockError, setStockError] = useState("");

//   // Recommendations
//   const [recommendations, setRecommendations] = useState([]);
//   const [recoLoading, setRecoLoading] = useState(false);

//   // Confirm remove modal
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [itemToRemove, setItemToRemove] = useState(null);

//   const handleShowConfirm = (item) => { setItemToRemove(item); setShowConfirm(true); };
//   const handleCloseConfirm = () => { setShowConfirm(false); setItemToRemove(null); };
//   const handleConfirmRemove = () => {
//     if (itemToRemove) handleRemoveByProductId(itemToRemove.productId, itemToRemove.selectedVariant?.sku || null);
//     handleCloseConfirm();
//   };

//   const handleMoveToWishlist = async () => {
//     if (!itemToRemove) return;
//     setMovingToWishlist(true);
//     try {
//       const productId = itemToRemove.productId;
//       const variantSku = itemToRemove.selectedVariant?.sku || null;

//       if (user && !user.guest) {
//         // Logged-in user: Call backend API
//         const res = await fetch(`https://beauty.joyory.com/api/user/cart/${productId}/move-to-wishlist`, {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ sku: variantSku }),
//         });

//         if (!res.ok) {
//           throw new Error("Failed to move item to wishlist");
//         }
//       } else {
//         // Guest user: Handle locally
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         const exists = local.some((i) => (i.productId === productId || i._id === productId) && i.sku === variantSku);
//         if (!exists) {
//           const displayPrice = itemToRemove.price;
//           const originalPrice = itemToRemove.selectedVariant?.originalPrice || displayPrice;
//           local.push({
//             _id: productId,
//             productId: productId,
//             name: itemToRemove.name,
//             sku: variantSku,
//             image: itemToRemove.image,
//             displayPrice: displayPrice,
//             originalPrice: originalPrice,
//           });
//           localStorage.setItem("guestWishlist", JSON.stringify(local));
//         }
//         // Remove from cart locally/session-wise using existing cart removal function
//         await handleRemoveByProductId(productId, variantSku);
//       }

//       handleCloseConfirm();
//       await syncCartFromBackend();
//       await syncWishlist();
//       navigate("/Wishlist");
//     } catch (err) {
//       console.error("Error moving item to wishlist:", err);
//       alert("Failed to move item to wishlist. Please try again.");
//     } finally {
//       setMovingToWishlist(false);
//     }
//   };

//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageColor, setCouponMessageColor] = useState("info");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [activeCouponTab, setActiveCouponTab] = useState("available");
//   const [manualCoupon, setManualCoupon] = useState("");
//   let cartCallCount = 0;

//   const handleAddToCartSuccess = async () => {
//     const savedCoupon = localStorage.getItem("appliedCoupon");
//     await fetchCart(savedCoupon, true);
//     await syncCartFromBackend();
//   };

//   // ── fetch cart ──────────────────────────────────────────────────────────────
//   const fetchCart = async (discountCode = null, silent = false) => {
//     cartCallCount++;
//     try {
//       if (!silent) setLoading(true);
//       const url = discountCode
//         ? `${API_BASE}/summary?discount=${discountCode}`
//         : `${API_BASE}/summary`;
//       const res = await fetch(url, { credentials: "include" });

//       if (res.status === 400) {
//         setCartData({ cart: [], freebies: [], bagMrp: 0, bagDiscount: 0, autoDiscount: 0, couponDiscount: 0, shipping: 0, taxableAmount: 0, gstRate: "0%", gstAmount: 0, gstMessage: "", payable: 0, appliedCoupon: null, applicableCoupons: [], inapplicableCoupons: [], promotions: [], totalSavings: 0, savingsMessage: "", grandTotal: 0, shippingMessage: "" });
//         setStockError("");
//         if (!silent) setLoading(false);
//         return;
//       }
//       if (!res.ok) { if (res.status === 401) navigate("/login"); throw new Error("Failed to fetch cart"); }

//       const data = await res.json();
//       const normalizedCart = (data.cart || []).map((item) => {
//         const variant = item.variant || {};
//         const price = variant.displayPrice || variant.discountedPrice || 0;
//         const originalPrice = variant.originalPrice || price;
//         const discountPercent = variant.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
//         const discounts = discountPercent > 0 ? [{ type: "Discount", amount: originalPrice - price, note: `${discountPercent}% Off` }] : [];
//         return {
//           cartItemId: item._id || `${item.product}-${variant.sku || "default"}`,
//           productId: item.product || item.productId,
//           name: item.name || "Unnamed Product",
//           image: variant.image || "/placeholder.png",
//           brand: item.brand || "",
//           selectedVariant: variant,
//           quantity: item.quantity || 1,
//           price,
//           subTotal: item.itemTotal || price * (item.quantity || 1),
//           discounts,
//           stockStatus: item.stockStatus || (variant.stock > 0 ? "in_stock" : "out_of_stock"),
//           stockMessage: item.stockMessage || "",
//           canCheckout: item.canCheckout !== false,
//         };
//       });

//       const p = data.priceDetails || {};
//       setCartData({
//         cart: normalizedCart,
//         freebies: data.freebies || [],
//         bagMrp: p.bagMrp || 0, bagDiscount: p.bagDiscount || 0, autoDiscount: p.autoDiscount || 0,
//         couponDiscount: p.couponDiscount || 0, shipping: p.shippingCharge || 0,
//         taxableAmount: p.taxableAmount || 0, gstRate: p.gstRate || "0%",
//         gstAmount: p.gstAmount || 0, gstMessage: p.gstMessage || "",
//         payable: p.payable || 0, appliedCoupon: data.appliedCoupon || null,
//         applicableCoupons: data.applicableCoupons || [], inapplicableCoupons: data.inapplicableCoupons || [],
//         promotions: data.appliedPromotions || [], totalSavings: p.totalSavings || 0,
//         savingsMessage: p.savingsMessage || "", grandTotal: data.grandTotal || p.payable || 0,
//         shippingMessage: p.shippingMessage || "",
//       });
//       const offender = (data.cart || []).find((i) => !i.canCheckout);
//       setStockError(offender ? offender.stockMessage : "");
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//       setCartData(null);
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   };

//   // ── fetch recommendations ───────────────────────────────────────────────────
//   const fetchRecommendations = async () => {
//     try {
//       setRecoLoading(true);
//       const res = await fetch(RECOMMENDATIONS_API, { credentials: "include" });
//       if (!res.ok) return;
//       const data = await res.json();
//       if (data.success && Array.isArray(data.sections)) {
//         setRecommendations(data.sections);
//       }
//     } catch (err) {
//       console.error("Error fetching recommendations:", err);
//     } finally {
//       setRecoLoading(false);
//     }
//   };

//   // ── quantity change ─────────────────────────────────────────────────────────
//   const handleQuantityChange = async (cartItemId, newQty) => {
//     if (newQty < 1) return;
//     if (newQty > 6) return alert("Max 6 units allowed.");
//     const item = cartData?.cart?.find((i) => i.cartItemId === cartItemId);
//     if (!item) return;
//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;
//       const res = await fetch(`${API_BASE}/update`, {
//         method: "PUT", credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productId: item.productId, variantSku: item.selectedVariant?.sku || null, quantity: newQty, discount: appliedCoupon }),
//       });
//       if (!res.ok) throw new Error("Failed to update quantity");
//       await fetchCart(appliedCoupon);
//       await syncCartFromBackend();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update quantity. Please try again.");
//       await fetchCart();
//     }
//   };

//   // ── remove item ─────────────────────────────────────────────────────────────
//   const handleRemoveByProductId = async (productId, variantSku = null) => {
//     if (!productId) return;
//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;
//       const url = variantSku
//         ? `${API_BASE}/remove/${productId}?variantSku=${encodeURIComponent(variantSku)}`
//         : `${API_BASE}/remove/${productId}`;
//       const res = await fetch(url, { method: "DELETE", credentials: "include" });
//       if (!res.ok) throw new Error("Server failed to remove item");
//       await fetchCart(appliedCoupon);
//       await syncCartFromBackend();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove item from cart.");
//       await fetchCart();
//     }
//   };

//   // ── coupon handlers ─────────────────────────────────────────────────────────
//   // const handleCouponSubmit = async (code) => {
//   //   if (!code) { setCouponMessage("Please enter a coupon code."); setCouponMessageColor("warning"); return; }
//   //   try {
//   //     await fetchCart(code);
//   //     localStorage.setItem("appliedCoupon", code);
//   //     setCouponMessage(`Coupon ${code} applied successfully!`);
//   //     setCouponMessageColor("success");
//   //     setShowCouponModal(false);
//   //     setManualCoupon("");
//   //   } catch { setCouponMessage("Failed to apply coupon."); setCouponMessageColor("danger"); }
//   // };





//   const handleCouponSubmit = async (code) => {
//     if (!code) {
//       setCouponMessage("Please enter a coupon code.");
//       setCouponMessageColor("warning");
//       return;
//     }

//     try {
//       setApplyingCoupon(true);
//       setShowApplyAnimation(true);

//       // simulate animation duration (you can tweak timing)
//       await new Promise((res) => setTimeout(res, 1500));

//       await fetchCart(code);
//       localStorage.setItem("appliedCoupon", code);

//       setCouponMessage(`Coupon ${code} applied successfully!`);
//       setCouponMessageColor("success");

//       // hide animation + modal
//       setShowApplyAnimation(false);
//       setShowCouponModal(false);
//       setManualCoupon("");

//     } catch {
//       setCouponMessage("Failed to apply coupon.");
//       setCouponMessageColor("danger");
//       setShowApplyAnimation(false);
//     } finally {
//       setApplyingCoupon(false);
//     }
//   };



//   const handleRemoveCoupon = async () => {
//     setCouponMessage("Coupon removed.");
//     setCouponMessageColor("info");
//     localStorage.removeItem("appliedCoupon");
//     await fetchCart();
//   };

//   const handleShowDiscountProducts = (coupon) => {
//     navigate("/DiscountProductsPage", { state: { coupon, activeCouponTab } });
//   };

//   // ── checkout ────────────────────────────────────────────────────────────────
//   // const handleProceed = async () => {
//   //   try {
//   //     setInitiating(true);
//   //     if (!document.cookie.includes("token=")) {
//   //       navigate("/login", { state: { from: "/cartpage", message: "Please login to proceed with checkout" } });
//   //       return;
//   //     }
//   //     const body = {
//   //       discountCode: cartData?.appliedCoupon?.code || null,
//   //       pointsToUse: cartData?.pointsToUse || 0,
//   //       giftCardCode: cartData?.giftCardApplied?.code || null,
//   //       giftCardPin: cartData?.giftCardApplied?.pin || null,
//   //       giftCardAmount: cartData?.giftCardApplied?.amount || 0,
//   //       taxableAmount: cartData?.taxableAmount || 0,
//   //       gstAmount: cartData?.gstAmount || 0,
//   //       gstRate: cartData?.gstRate || "0%",
//   //     };
//   //     const res = await fetch(INITIATE_ORDER_API, {
//   //       method: "POST", credentials: "include",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(body),
//   //     });
//   //     if (!res.ok) { if (res.status === 401) navigate("/login"); throw new Error("Failed to initiate order"); }
//   //     const orderData = await res.json();
//   //     navigate("/AddressSelection", {
//   //       state: {
//   //         orderId: orderData.orderId,
//   //         cartItems: cartData.cart,
//   //         priceDetails: {
//   //           bagMrp: cartData.bagMrp, bagDiscount: cartData.bagDiscount,
//   //           autoDiscount: cartData.autoDiscount, couponDiscount: cartData.couponDiscount,
//   //           shipping: cartData.shipping, taxableAmount: cartData.taxableAmount,
//   //           gstRate: cartData.gstRate, gstAmount: cartData.gstAmount,
//   //           gstMessage: cartData.gstMessage, payable: cartData.payable,
//   //           appliedCoupon: cartData.appliedCoupon, totalSavings: cartData.totalSavings,
//   //           savingsMessage: cartData.savingsMessage,
//   //         },
//   //       },
//   //     });
//   //   } catch (err) {
//   //     console.error("Checkout Error:", err);
//   //     alert(err.message || "Something went wrong during checkout.");
//   //   } finally {
//   //     setInitiating(false);
//   //   }
//   // };



//   const handleProceed = async () => {
//     try {
//       setInitiating(true);

//       // 🔐 Check login first
//       if (!document.cookie.includes("token=")) {
//         setTimeout(() => {
//           navigate("/login", {
//             state: {
//               from: "/cartpage",
//               message: "Please login to proceed with checkout",
//             },
//           });
//         }, 1200); // small delay for UX

//         return;
//       }

//       const body = {
//         discountCode: cartData?.appliedCoupon?.code || null,
//         pointsToUse: cartData?.pointsToUse || 0,
//         giftCardCode: cartData?.giftCardApplied?.code || null,
//         giftCardPin: cartData?.giftCardApplied?.pin || null,
//         giftCardAmount: cartData?.giftCardApplied?.amount || 0,
//         taxableAmount: cartData?.taxableAmount || 0,
//         gstAmount: cartData?.gstAmount || 0,
//         gstRate: cartData?.gstRate || "0%",
//       };

//       const res = await fetch(INITIATE_ORDER_API, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setTimeout(() => navigate("/login"), 1200);
//           return;
//         }
//         throw new Error("Failed to initiate order");
//       }

//       const orderData = await res.json();

//       // 🧠 Add delay BEFORE redirect (smooth UX)
//       setTimeout(() => {
//         navigate("/AddressSelection", {
//           state: {
//             orderId: orderData.orderId,
//             cartItems: cartData.cart,
//             priceDetails: {
//               bagMrp: cartData.bagMrp,
//               bagDiscount: cartData.bagDiscount,
//               autoDiscount: cartData.autoDiscount,
//               couponDiscount: cartData.couponDiscount,
//               shipping: cartData.shipping,
//               taxableAmount: cartData.taxableAmount,
//               gstRate: cartData.gstRate,
//               gstAmount: cartData.gstAmount,
//               gstMessage: cartData.gstMessage,
//               payable: cartData.payable,
//               appliedCoupon: cartData.appliedCoupon,
//               totalSavings: cartData.totalSavings,
//               savingsMessage: cartData.savingsMessage,
//             },
//           },
//         });
//       }, 1500); // 🔥 control loader duration here

//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "Something went wrong during checkout.");
//       setInitiating(false);
//     }
//   };

//   // ── mount ───────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       const applyCode = location.state?.applyCouponCode;
//       const savedCoupon = localStorage.getItem("appliedCoupon");
//       if (applyCode) await fetchCart(applyCode);
//       else if (savedCoupon) await fetchCart(savedCoupon);
//       else await fetchCart();
//     };
//     load();
//     fetchRecommendations();
//   }, []);

//   // ── loading / empty states ──────────────────────────────────────────────────
//   if (loading)
//     return (
//       <div
//         className="fullscreen-loader page-title-main-name"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           <DotLottieReact className='foryoulanding-css'
//             src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//             loop
//             autoplay
//           />
//           <p className="text-muted mb-0">
//             Please wait while we prepare the best products for you...
//           </p>
//         </div>
//       </div>
//     );

//   if (!cartData || (cartData.cart.length === 0 && cartData.freebies?.length === 0)) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-xl-5 pt-xl-5">
//           <div className="p-4 text-center mt-5 cartpage-empty-Main-section">
//             <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
//             <h5 className="mb-2 page-title-main-name">Your cart is empty 🛒</h5>
//             <button
//               className="page-title-main-name Shop-now-Button"
//               onClick={() => navigate("/")}
//             >
//               Shop Now
//             </button>
//           </div>

//           {/* ✅ ADD FROM HERE */}
//           <div className="container mt-4">
//             {!recoLoading && recommendations.length > 0 && (
//               <div className="mt-4">
//                 {recommendations.map((section) => {
//                   const filteredProducts = (section.products || []).filter((product) => {
//                     if (!product) return false;

//                     const variants = product.variants || [];
//                     if (variants.length > 0) {
//                       return variants.some((v) => (v.stock ?? 0) > 0);
//                     }

//                     return (product.stock ?? 0) > 0;
//                   });

//                   if (filteredProducts.length === 0) return null;

//                   return (
//                     <div key={section.key} className="mb-5">
//                       <h2
//                         className="font-familys text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
//                         style={{ fontSize: "1.4rem" }}
//                       >
//                         {section.title || "Trending Products"}
//                       </h2>

//                       <Swiper
//                         spaceBetween={20}
//                         slidesPerView={2}
//                         breakpoints={{
//                           576: { slidesPerView: 2 },
//                           768: { slidesPerView: 3 },
//                           992: { slidesPerView: 4 },
//                           1200: { slidesPerView: 4 },
//                           1400: { slidesPerView: 4 },
//                         }}
//                       >
//                         {filteredProducts.map((product) => (
//                           <SwiperSlide key={`${section.key}-${product._id}`}>
//                             <RecoProductCard
//                               product={product}
//                               navigate={navigate}
//                               user={user}
//                               onAddToCartSuccess={handleAddToCartSuccess}
//                             />
//                           </SwiperSlide>
//                         ))}
//                       </Swiper>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//           {/* ✅ END HERE */}
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // ── render ──────────────────────────────────────────────────────────────────
//   return (
//     <>


//       {initiating && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "#fff",
//             zIndex: 9999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexDirection: "column",
//           }}
//         >
//           <DotLottieReact
//             src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//             loop
//             autoplay
//             style={{ width: "250px" }}
//           />
//           <p className="mt-3 text-muted">Preparing your checkout...</p>
//         </div>
//       )}
//       <Header />
//       {/* <ToastContainer position="top-right" autoClose={3000} /> */}
//       <div className="container-lg Conatiner-fluid mt-xl-5 pt-xl-5">
//         <h2 className="page-title-main-name mb-4 cartpage-titlesss mt-lg-5 pt-lg-3 mt-5 pt-5">Your Cart</h2>
//         <div className="row">

//           {/* ── Left column: cart items + freebies + recommendations ── */}
//           <div className="col-xxl-8 col-12">
//             <ul className="list-group">
//               {cartData.cart.map((item) => {
//                 const variant = item.selectedVariant || {};
//                 const shadeName = variant.shadeName || variant.name;
//                 const shadeHex = variant.hex;
//                 return (
//                   <li key={item.cartItemId} className="list-group-item d-flex justify-content-between align-items-end border-black">
//                     <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${item.productId}`)}>
//                       <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
//                       <div className="w-75">
//                         <strong className="page-title-main-name">
//                           {(() => {
//                             const variantText = shadeName ? shadeName.trim() : "";
//                             return variantText && variantText.toUpperCase() !== "DEFAULT" ? `${item.name} - ${shadeName}` : item.name;
//                           })()}
//                         </strong>
//                         {item.brand && <div className="text-muted small page-title-main-name">{item.brand}</div>}
//                         {item.stockStatus !== "in_stock" && (
//                           <div className="small text-danger fw-semibold page-title-main-name">{item.stockMessage || "Out of stock"}</div>
//                         )}
//                         <div className="small d-flex align-items-center page-title-main-name">
//                           {variant.originalPrice && variant.originalPrice > item.price ? (
//                             <>
//                               <span className="text-muted text-decoration-line-through me-1">₹{variant.originalPrice}</span>
//                               <span className="fw-bold">₹{item.price}</span>
//                             </>
//                           ) : (
//                             <span className="fw-400 page-title-main-name">₹{item.price}</span>
//                           )}
//                           <div className="ms-2">
//                             {item.discounts?.length > 0 && (
//                               <ul className="mt-1 small text-success p-0 m-0 page-title-main-name" type="none">
//                                 {item.discounts.map((d) => (
//                                   <li key={`${item.cartItemId}-${d.type}-${d.note}`} className="backgound-colors-discount page-title-main-name">
//                                     <i className="bi bi-tag page-title-main-name"></i>&nbsp;
//                                     {d.note || `${d.type} - ₹${d.amount} off`}
//                                   </li>
//                                 ))}
//                               </ul>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="d-flex align-items-center gap-2 page-title-main-name justify-content-between" style={{ margin: "5px 0" }}>
//                       <div className="border-for-minu-plush">
//                         <button className="btn btn-sm btn-outline-secondary page-title-main-name" style={{ border: "none", background: "#FFF", boxShadow: "none" }} onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)} disabled={item.stockStatus === "out_of_stock"}>−</button>
//                         <span className={`px-2 ${item.stockStatus === "out_of_stock" ? "text-muted text-decoration-line-through" : ""} page-title-main-name`}>{item.quantity}</span>
//                         <button className="btn btn-sm btn-outline-secondary page-title-main-name" style={{ border: "none", background: "#FFF", boxShadow: "none" }} onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)} disabled={item.stockStatus === "out_of_stock"}>+</button>
//                       </div>
//                       <span className={`fw-bold page-title-main-name ${item.stockStatus === "out_of_stock" ? "text-muted" : ""}`}>₹{item.subTotal.toFixed(2)}</span>
//                       <button onClick={() => handleShowConfirm(item)} className="btn btn-outline-danger" title="Remove item from cart">
//                         <i className="bi bi-trash3"></i>
//                       </button>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>

//             {/* Free Gifts */}
//             {cartData.freebies?.length > 0 && (
//               <div className="mt-4">
//                 <h5 className="ms-3 page-title-main-name">Free Gifts 🎁</h5>
//                 <ul className="list-group">
//                   {cartData.freebies.map((freebie, idx) => {
//                     const fv = freebie.variant || {};
//                     const img = fv.images?.[0] || fv.image || "/placeholder.png";
//                     return (
//                       <li key={idx} className="list-group-item d-flex align-items-center gap-3">
//                         <img src={img} alt={freebie.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
//                         <div>
//                           <strong className="page-title-main-name">{freebie.name}</strong>
//                           {freebie.qty > 1 && <div className="small page-title-main-name">Quantity: {freebie.qty}</div>}
//                           <div className="text-success fw-bold page-title-main-name">FREE</div>
//                           {freebie.message && <div className="small text-muted page-title-main-name">{freebie.message}</div>}
//                         </div>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             )}

//             {/* Reco loading skeleton */}
//             {recoLoading && (
//               <div className="mt-5 d-flex gap-3" style={{ overflowX: "hidden" }}>
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} style={{ minWidth: "200px" }}>
//                     <div className="bg-light rounded" style={{ height: "200px", marginBottom: "8px" }} />
//                     <div className="bg-light rounded" style={{ height: "16px", marginBottom: "6px", width: "60%" }} />
//                     <div className="bg-light rounded" style={{ height: "14px", width: "40%" }} />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ── Right column: Order Summary (unchanged) ── */}
//           <div className="col-xxl-4 col-12 mt-4 mt-lg-0">
//             <div className="border-color-width">
//               <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
//                 <div className="fw-600 ms-3 fs-5 page-title-main-name">Coupons & Bank Offers</div>
//                 <i className="bi bi-chevron-right margin-left-right" onClick={() => setShowCouponModal(true)} style={{ cursor: "pointer" }}></i>
//               </div>
//               <hr className="border-color-blacks" />
//               <h5 className="ms-3 fs-5 fw-600 page-title-main-name">Order Summary</h5>
//               <hr className="border-color-blacks" />

//               <div className="mb-3 page-title-main-name">
//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert">
//                   <span className="page-title-main-name">Bag MRP :</span>
//                   <span className="page-title-main-name">₹{cartData.bagMrp?.toFixed(2) || "0.00"}</span>
//                 </div>
//                 {cartData.bagDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert">
//                     <span className="page-title-main-name text-black">Bag Discount :</span>
//                     <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}
//                 <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
//                   <div className="d-block">
//                     <span className="page-title-main-name">Shipping :</span>
//                     {cartData.shippingMessage && (
//                       <div className="small mb-2 page-title-main-name text-black" style={{ color: "#51C878" }}>
//                         <i className="bi bi-truck me-1"></i>{cartData.shippingMessage}
//                       </div>
//                     )}
//                   </div>
//                   <span className={cartData.shipping === 0 ? "text-success d-flex align-items-end flex-column" : ""}>
//                     ₹{cartData.shipping?.toFixed(2) || "0.00"}
//                     {cartData.shipping === 0 && <span className="ms-1 small page-title-main-name">Free Shipping</span>}
//                   </span>
//                 </div>
//                 {cartData.couponDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert pb-2 page-title-main-name">
//                     <span>Coupon Discount:</span>
//                     <span>-₹{cartData.couponDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}
//                 <hr className="border-color-blacks" />
//                 <div className="d-flex justify-content-between mb-1 pt-2 margin-left-right-repert">
//                   <span className="font-weight-in-tablable-amount page-title-main-name">Taxable Amount :</span>
//                   <span className="fw-semibold page-title-main-name">₹{cartData.taxableAmount?.toFixed(2) || "0.00"}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert page-title-main-name">
//                   <span className="page-title-main-name">GST ({cartData.gstRate})</span>
//                   <span className="page-title-main-name">+₹{cartData.gstAmount?.toFixed(2) || "0.00"}</span>
//                 </div>
//                 {cartData.gstMessage && (
//                   <div className="small text-muted mb-2 margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-receipt me-1"></i>{cartData.gstMessage}
//                   </div>
//                 )}
//                 <hr className="border-color-blacks" />
//                 <div className="d-flex justify-content-between mb-3 pt-2 margin-left-right-repert align-items-center">
//                   <span className="fw-semibold fs-6 page-title-main-name">Total Payable :</span>
//                   <span className="fw-bold text-primary fs-5 page-title-main-name text-black">₹{cartData.payable?.toFixed(2) || "0.00"}</span>
//                 </div>
//                 <hr className="border-color-blacks" />
//                 {cartData.savingsMessage && (
//                   <div className="py-2 small margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-coin me-1"></i>{cartData.savingsMessage}
//                   </div>
//                 )}
//               </div>

//               {cartData.appliedCoupon?.code && (
//                 <div className="mb-3 p-2 border rounded bg-success text-white margin-left-right-repert">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <strong>Applied Coupon:</strong> {cartData.appliedCoupon.code}
//                       {cartData.appliedCoupon.discount && <span className="ms-2">- ₹{cartData.appliedCoupon.discount} off</span>}
//                     </div>
//                     <button className="btn btn-sm btn-outline-light" onClick={handleRemoveCoupon}>Remove</button>
//                   </div>
//                 </div>
//               )}

//               {couponMessage && (
//                 <div className={`mt-2 alert backend-color ${couponMessageColor} text-white`}>{couponMessage}</div>
//               )}

//               {stockError && (
//                 <Alert variant="warning" className="mb-2">
//                   <strong>{(cartData.cart || []).find((i) => !i.canCheckout)?.name || "Item"}</strong>{" – "}{stockError}
//                 </Alert>
//               )}

//               <button
//                 className="page-title-main-name bg-black text-white checkout-button w-100 mt-3 py-2 fw-bold"
//                 onClick={handleProceed}
//                 disabled={initiating || !!stockError}
//               >
//                 {initiating ? (
//                   <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Processing...</>
//                 ) : (
//                   <><i className="bi bi-lock-fill me-2"></i>Proceed to Checkout (₹{cartData.payable?.toFixed(2)})</>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Recommendations + From Your Wishlist (with filtering) ── */}
//       <div className="container">
//         {!recoLoading && recommendations.length > 0 && (
//           <div className="mt-5">
//             {recommendations.map((section) => {
//               // Detect wishlist section
//               const isWishlistSection =
//                 section.key === "wishlist" ||
//                 section.title?.toLowerCase().includes("wishlist");

//               // Filter only AVAILABLE products
//               const filteredProducts = (section.products || []).filter((product) => {
//                 if (!product) return false;
//                 const variants = product.variants || [];
//                 if (variants.length > 0) {
//                   return variants.some((v) => (v.stock ?? 0) > 0);
//                 }
//                 return (product.stock ?? 0) > 0;
//               });

//               // If wishlist section has NO available products, completely hide it
//               if (isWishlistSection && filteredProducts.length === 0) {
//                 return null;
//               }

//               // Determine which products to render
//               const productsToRender = isWishlistSection ? filteredProducts : (section.products || []);

//               return (
//                 <div key={section.key} className="mb-5">
//                   {/* Section Title */}
//                   <h2
//                     className="font-familys text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
//                     style={{ fontSize: "1.4rem" }}
//                   >
//                     {section.title}
//                   </h2>

//                   {/* Swiper Slider */}
//                   <Swiper
//                     spaceBetween={20}
//                     slidesPerView={2}
//                     breakpoints={{
//                       576: { slidesPerView: 2 },
//                       768: { slidesPerView: 3 },
//                       992: { slidesPerView: 4 },
//                       1200: { slidesPerView: 4 },
//                       1400: { slidesPerView: 4 },
//                     }}
//                   >
//                     {productsToRender.map((product) => (
//                       <SwiperSlide key={`${section.key}-${product._id}`}>
//                         <RecoProductCard
//                           product={product}
//                           navigate={navigate}
//                           user={user}
//                           onAddToCartSuccess={handleAddToCartSuccess}
//                         />
//                       </SwiperSlide>
//                     ))}
//                   </Swiper>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Confirm Remove Modal */}
//       <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
//         <Modal.Header style={{ position: 'relative' }}>
//           <Modal.Title>Confirm Removal</Modal.Title>
//           <button
//             type="button"
//             onClick={handleCloseConfirm}
//             style={{
//               position: 'absolute',
//               right: '20px',
//               top: '12px',
//               background: 'none',
//               border: 'none',
//               fontSize: '28px',
//               color: '#000',
//               cursor: 'pointer',
//               lineHeight: '1',
//               padding: '0',
//               opacity: '0.8',
//               transition: 'opacity 0.2s'
//             }}
//             onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
//             onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}

//             className="removel-cross-btn"
//           >
//             &times;
//           </button>
//         </Modal.Header>
//         <Modal.Body className="page-title-main-name">Are you sure you want to remove "{itemToRemove?.name}" from your cart?</Modal.Body>
//         <Modal.Footer>
//           <button
//             className="modal-footer-btn"
//             onClick={handleConfirmRemove}
//             disabled={movingToWishlist}
//           >
//             Remove
//           </button>
//           <button
//             className="modal-footer-btn"
//             onClick={handleMoveToWishlist}
//             disabled={movingToWishlist}
//           >
//             {movingToWishlist ? "Moving..." : "Move to Wishlist"}
//           </button>
//         </Modal.Footer>
//       </Modal>

//       {/* Coupon Modal */}
//       <div className={`modal fade ${showCouponModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//         <div className="modal-dialog modal-lg modal-dialog-centered page-title-main-name" role="document">
//           <div className="modal-content border-0 rounded-0">
//             <div className="modal-header border-bottom py-3 px-4">
//               <h5 className="modal-title fw-normal" style={{ color: "#444" }}>Apply Coupon</h5>
//               <button type="button" className="btn-close shadow-none mb-0" onClick={() => setShowCouponModal(false)} aria-label="Close">
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="modal-body p-4 bg-light">
//               <ul className="nav nav-tabs border-0 mb-4 justify-content-center">
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "available" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("available")}>Available</button>
//                 </li>
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "inapplicable" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("inapplicable")}>Not Applicable</button>
//                 </li>
//               </ul>
//               <div className="row row-cols-1 row-cols-md-2 g-3">
//                 {(activeCouponTab === "available" ? cartData.applicableCoupons : cartData.inapplicableCoupons)?.map((c) => (
//                   <div className="col-lg-6 col-md-12" key={c._id || c.code}>
//                     <div className={`coupon-ticket shadow-sm ${activeCouponTab === "inapplicable" ? "opacity-75" : ""}`}>
//                       <div className="ticket-sidebar">
//                         <div className="ticket-notch"></div>
//                         <span className="ticket-code-rotated">{c.code}</span>
//                       </div>
//                       <div className="ticket-body">
//                         <div className="d-flex justify-content-between">
//                           <h6 className="mb-1 fw-bold text-secondary page-title-main-name">{c.label || "Offer"}</h6>
//                           {activeCouponTab === "available" && (
//                             // <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn" onClick={() => handleCouponSubmit(c.code)}>Apply</button>

//                             <button
//                               className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn d-flex align-items-center gap-2"
//                               onClick={() => handleCouponSubmit(c.code)}
//                               disabled={applyingCoupon}
//                             >
//                               {applyingCoupon ? (
//                                 <>
//                                   <span className="spinner-border spinner-border-sm"></span>
//                                   Applying...
//                                 </>
//                               ) : (
//                                 "Apply"
//                               )}
//                               {showApplyAnimation && (
//                                 <div
//                                   style={{
//                                     position: "fixed",
//                                     top: 0,
//                                     left: 0,
//                                     width: "100%",
//                                     height: "100%",
//                                     // background: "rgba(255,255,255,0.95)",
//                                     zIndex: 9999,
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     flexDirection: "column"
//                                   }}
//                                 >
//                                   <img
//                                     src={applyGif}   // ⚠️ put your gif in public folder
//                                     style={{ width: "20%", marginBottom: "10px" }}
//                                   />
//                                   {/* <p className="page-title-main-name text-muted">
//                                     Applying your coupon...
//                                   </p> */}
//                                 </div>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                         <p className="ticket-desc mb-2 text-muted page-title-main-name">{c.description || "Enjoy discount on your order"}</p>
//                         <div className="ticket-divider"></div>
//                         <small className="ticket-footer text-muted page-title-main-name" style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleShowDiscountProducts(c)}>
//                           Valid on select products
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default CartPage;






// //======================================================Done-Code===========================================================================================






















import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../styles/CartPage.css";
import "../styles/ForYou.css";
import "../App.css";
import "../styles/Foundation.css";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FaTimes, FaHeart, FaRegHeart, FaChevronDown, FaCheck } from "react-icons/fa";
import { Modal, Button, Alert } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import applyGif from "../assets/Apply.gif";
import axios from "axios";
import { UserContext } from "../context/UserContext.jsx";
import bagIcon from "../assets/bag.svg";

const API_BASE = "https://beauty.joyory.com/api/user/cart";
const INITIATE_ORDER_API = `${API_BASE}/order/initiate`;
const RECOMMENDATIONS_API = "https://beauty.joyory.com/api/user/recommendations/cart";
const WISHLIST_CACHE_KEY = "guestWishlist";

// ─── Variant helpers (same as Foryou.jsx) ────────────────────────────────────
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
};

const getVariantDisplayText = (variant) =>
  (
    variant?.shadeName ||
    variant?.name ||
    variant?.size ||
    variant?.ml ||
    variant?.weight ||
    "Default"
  ).toUpperCase();

const groupVariantsByType = (variants) => {
  const grouped = { color: [], text: [] };
  (variants || []).forEach((v) => {
    if (!v) return;
    if (v.hex && isValidHexColor(v.hex)) grouped.color.push(v);
    else grouped.text.push(v);
  });
  return grouped;
};

// ─── Recommendation / Wishlist product card (mirrors Foryou.jsx exactly) ───────────
const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(price || 0));

// ─── Recommendation / Wishlist product card (mirrors Foryou.jsx exactly) ───────────
const RecoProductCard = ({ product, navigate, user, onAddToCartSuccess }) => {
  const allVariants = useMemo(
    () => product?.variants || product?.product?.variants || product?.shadeOptions || product?.product?.shadeOptions || [],
    [product]
  );

  const hasVariants = allVariants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState(
    () => product?.selectedVariant || product?.product?.selectedVariant || allVariants.find((v) => v.stock > 0) || allVariants[0] || {}
  );
  const [tempSelectedVariant, setTempSelectedVariant] = useState(null);
  const [variantSelected, setVariantSelected] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(false);

  // ===================== OUT OF STOCK POPUP STATE =====================
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  const handleOutOfStockClick = (productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => setShowOutOfStockPopup(false), 3000);
  };

  const closeOutOfStockPopup = () => setShowOutOfStockPopup(false);
  // ===================== END OUT OF STOCK POPUP STATE =====================

  const location = useLocation();

  /* wishlist helpers */
  const isInWishlist = useCallback(
    (productId, sku) =>
      wishlistData.some((i) => (i.productId === productId || i._id === productId) && i.sku === sku),
    [wishlistData]
  );

  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const res = await axios.get('https://beauty.joyory.com/api/user/wishlist', { withCredentials: true });
        if (res.data.success) setWishlistData(res.data.wishlist || []);
      } else {
        const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        setWishlistData(local.map((i) => ({ productId: i._id, _id: i._id, sku: i.sku })));
      }
    } catch { setWishlistData([]); }
  }, [user]);

  useEffect(() => { fetchWishlistData(); }, [fetchWishlistData]);

  /* computed */
  const displayVariant = tempSelectedVariant || selectedVariant || {};

  const displayPrice = parseFloat(
    displayVariant?.displayPrice || displayVariant?.discountedPrice || displayVariant?.price || product?.price || product?.product?.price || 0
  );
  const originalPrice = parseFloat(
    displayVariant?.originalPrice || displayVariant?.mrp || product?.mrp || product?.product?.mrp || displayPrice
  );
  let discountPercent = parseFloat(displayVariant?.discountPercent || product?.discountPercent || product?.product?.discountPercent || 0);
  if (!discountPercent && originalPrice > displayPrice)
    discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

  const activeVar = displayVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
  const stock = parseInt((hasVariants ? activeVar?.stock : (product?.stock || product?.product?.stock)) || 0);
  const outOfStock = stock <= 0;

  // Check if ALL variants are out of stock
  const isCompletelyOutOfStock = hasVariants
    ? allVariants.every(v => parseInt(v.stock || 0) <= 0)
    : parseInt(product?.stock || product?.product?.stock || 0) <= 0;

  const showSelectVariantBtn = hasVariants && allVariants.length > 1;

  const imageUrl = useMemo(() => {
    let rawImage = displayVariant?.images?.[0] || displayVariant?.image ||
      product?.selectedVariant?.images?.[0] || product?.product?.selectedVariant?.images?.[0] ||
      product?.images?.[0] || product?.product?.images?.[0] ||
      product?.image || product?.product?.image ||
      '';
    if (rawImage) {
      return rawImage.startsWith("http")
        ? rawImage
        : `https://res.cloudinary.com/dekngswix/image/upload/${rawImage}`;
    }
    return 'https://placehold.co/400x300/ffffff/cccccc?text=Product';
  }, [displayVariant, product]);

  const sku = getSku(displayVariant);
  const productId = product?.product?._id || product?._id;
  const productInWishlist = isInWishlist(productId, sku);
  const groupedVariants = groupVariantsByType(allVariants);

  const getBrandName = () => {
    const brand = product?.brand || product?.product?.brand;
    if (!brand) return 'Unknown Brand';
    if (typeof brand === 'object' && brand.name) return brand.name;
    return typeof brand === 'string' ? brand : 'Unknown Brand';
  };

  const getProductSlug = () =>
    product?.slugs?.[0] || product?.product?.slugs?.[0] ||
    product?.slug || product?.product?.slug ||
    productId;

  /* actions */
  const handleVariantSelect = (v) => { setSelectedVariant(v); setVariantSelected(true); };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(false);
    setTempSelectedVariant(null);
  };

  const handleAddToCart = async (forceVariant = null) => {
    setAddingToCart(true);
    try {
      let payload;
      if (hasVariants) {
        const sel = forceVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
        if (!sel || (sel.stock ?? 0) <= 0) { toast.error('Please select an in-stock variant.'); return; }
        payload = { productId: productId, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
      } else {
        if (outOfStock) { toast.error('Product is out of stock.'); return; }
        payload = { productId: productId, quantity: 1 };
      }

      // Cache selected variant
      const chosen = forceVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
      if (hasVariants && chosen) {
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[productId] = chosen;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[productId];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      const res = await axios.post(`${API_BASE}/add`, payload, {
        withCredentials: true,
      });
      if (!res.data.success) throw new Error(res.data.message || 'Failed');
      toast.success('Product added to cart!');
      if (onAddToCartSuccess) {
        onAddToCartSuccess();
      } else {
        navigate('/cartpage');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add product');
      if (err.response?.status === 401) navigate('/login', { state: { from: location?.pathname } });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!selectedVariant) { toast.error('Please select a variant first'); return; }

    if (!user || user.guest) {
      toast.error('Please login to use wishlist');
      localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId, sku }));
      navigate('/login', { state: { from: "/wishlist" } });
      return;
    }

    setWishlistLoading(true);
    try {
      const inWl = isInWishlist(productId, sku);
      if (inWl) {
        await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { withCredentials: true, data: { sku } });
        toast.success('Removed from wishlist!');
      } else {
        await axios.post(`https://beauty.joyory.com/api/user/wishlist/${productId}`, { sku }, { withCredentials: true });
        toast.success('Added to wishlist!');
      }
      await fetchWishlistData();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please login to use wishlist');
        localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId, sku }));
        navigate('/login', { state: { from: "/wishlist" } });
      }
      else toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Determine if we should show out of stock state (entirely OOS)
  const showOutOfStock = isCompletelyOutOfStock && !hasVariants;

  const buttonDisabled = addingToCart || showOutOfStock;

  let buttonText = "Add to Bag";
  if (addingToCart) {
    buttonText = "Adding...";
  } else if (showOutOfStock) {
    buttonText = "Out of Stock";
  } else if (showSelectVariantBtn) {
    buttonText = "Select Variant";
  } else if (outOfStock) {
    buttonText = "Out of Stock";
  }

  const pName = product?.product?.name || product?.name || 'Unnamed Product';

  return (
    <div className="foryou-card-wrapper" style={{ flex: "0 0 auto" }}>
      <div className="foryou-card">
        {/* Product Image with Overlays */}
        <div
          className="foryou-img-wrapper"
          onClick={() => {
            if (showOutOfStock) {
              handleOutOfStockClick(pName);
            } else {
              navigate(`/product/${getProductSlug()}`);
            }
          }}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <img
            src={imageUrl}
            alt={pName}
            className="foryou-img img-fluid"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/ffffff/cccccc?text=Product'; }}
            style={{
              opacity: showOutOfStock ? 0.6 : 1,
              filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
            }}
          />

          {(product?.supportsVTO || product?.product?.supportsVTO) && (
            <div
              className="support-beauty-badge"
              title="Try It On"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${getProductSlug()}`);
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <path d="M8 10a4 4 0 1 1 8 0c0 2.2-1.8 4-4 4s-4-1.8-4-4z" />
                <path d="M10 10h.01" />
                <path d="M14 10h.01" />
                <path d="M10 13c.5.5 1.5.7 2 .7s1.5-.2 2-.7" />
                <path d="M6 19c0-1.5 1.5-2.5 6-2.5s6 1 6 2.5" />
              </svg>
              <span className="vto-text">TRY IT ON</span>
            </div>
          )}

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
            <button
              className={`product-card-wishlist-btn ${productInWishlist ? 'in-wishlist' : ''}`}
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              title={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlistLoading ? (
                <div className="spinner-border spinner-border-sm" role="status" />
              ) : productInWishlist ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
          <div className="justify-content-between d-flex flex-column" style={{ height: '200px' }}>
            {/* Brand Name */}
            <div className="brand-name small text-muted mb-1 mt-2 text-start">{getBrandName()}</div>

            {/* Product Name */}<div className="product-card-title-wrap"><h6
              className="foryou-name font-family-Poppins m-0 p-0"
              onClick={() => {
                if (showOutOfStock) {
                  handleOutOfStockClick(pName);
                } else {
                  navigate(`/product/${getProductSlug()}`);
                }
              }}
              style={{
                cursor: 'pointer',
                opacity: showOutOfStock ? 0.6 : 1,
              }}
            >
              {(() => {
                const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                return varText && varText.toUpperCase() !== "DEFAULT" ? `${pName} - ${varText}` : pName;
              })()}
            </h6></div>{/* Show out of stock message in variant area */}
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
                  {formatPrice(displayPrice)}
                </span>
                {originalPrice > displayPrice && !showOutOfStock && (
                  <>
                    <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">{formatPrice(originalPrice)}</span>
                    <span className="discount-percent fw-bold ms-2">({discountPercent}% OFF)</span>
                  </>
                )}
              </div>
            </div>
                  {product.nextOrderDiscountMessage && (
                    <div className="next-order-discount-tag" title={product.nextOrderDiscountMessage} onClick={(e) => { e.stopPropagation(); window.showDiscountPopup && window.showDiscountPopup(product.nextOrderDiscountMessage, e.currentTarget); }}>
                      <span className="text-truncate">{product.nextOrderDiscountMessage}</span>
                    </div>
                  )}

            {/* Add to Cart / Select Variant / Out of Stock Button */}
            <div className="cart-section">
              <div className="d-flex align-items-center justify-content-between">
                <button
                  className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${showOutOfStock
                    ? "btn-secondary"
                    : addingToCart
                      ? ""
                      : "btn-outline-dark"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showOutOfStock) {
                      handleOutOfStockClick(pName);
                    } else if (showSelectVariantBtn) {
                      setShowVariantOverlay(true);
                    } else {
                      handleAddToCart();
                    }
                  }}
                  disabled={buttonDisabled && !showOutOfStock}
                  style={{
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    opacity: showOutOfStock ? 0.8 : 1,
                    cursor: showOutOfStock ? 'pointer' : (buttonDisabled ? 'not-allowed' : 'pointer'),
                  }}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
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
                      {!buttonDisabled && !addingToCart && !showSelectVariantBtn && (
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

      {/* Desktop Variant Overlay */}
      {showVariantOverlay && !showOutOfStock && (
        <div className="variant-overlay" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}>
          <div
            className="variant-overlay-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="m-0 page-title-main-name">Select Variant</h5>
              <button onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }} style={{ background: 'none', border: 'none', fontSize: '40px' }}>×</button>
            </div>

            <div className="variant-overlay-body">
              {groupedVariants.color.length > 0 && (
                <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                  {groupedVariants.color.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    return (
                      <div
                        key={getSku(v) || v._id}
                        style={{ cursor: isOOS ? "not-allowed" : "pointer", position: "relative" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                        title={v.shadeName}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "20%",
                            backgroundColor: v.hex || "#ccc",
                            border: isSel ? "3px solid #000" : "1px solid #ddd",
                            opacity: isOOS ? 0.4 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSel && (
                            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                              ✓
                            </span>
                          )}
                        </div>
                        {isOOS && (
                          <span style={{
                            position: "absolute", top: 0, left: 8, right: 0, bottom: 0,
                            display: "flex", alignItems: "center", justifyCorner: "center",
                            color: "red", fontWeight: "bold", fontSize: 16, pointerEvents: "none"
                          }}>✕</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {groupedVariants.text.length > 0 && (
                <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                  {groupedVariants.text.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    return (
                      <div
                        key={getSku(v) || v._id}
                        className="variant-text-item"
                        style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: isSel ? "2px solid #000" : "1px solid #ddd",
                            background: isSel ? "#f8f9fa" : "#fff",
                            opacity: isOOS ? 0.4 : 1,
                            textDecoration: isOOS ? "line-through" : "none"
                          }}
                        >
                          {getVariantDisplayText(v)}
                          {isOOS && <span className="text-danger small ms-1">(OOS)</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="variant-overlay-footer">
              <div className="small text-muted fw-semibold">
                Selected: <span className="text-dark fw-bold">{getVariantDisplayText(displayVariant)}</span>
              </div>
              <div className="mt-1 mb-2 text-start">
                <span
                  onClick={(e) => { e.stopPropagation(); navigate(`/product/${getProductSlug()}`); }}
                  className="text-decoration-none fw-semibold"
                  style={{ cursor: 'pointer', fontSize: '12px' }}
                >
                  View Details
                </span>
              </div>
              <button
                className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${addingToCart ? "btn-dark" : "btn-outline-dark"}`}
                onClick={async (e) => {
                  e.stopPropagation();
                  const chosen = tempSelectedVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                  if (chosen) {
                    handleVariantSelect(chosen);
                  }
                  await handleAddToCart(chosen);
                  closeVariantOverlay();
                }}
                disabled={addingToCart || (displayVariant && displayVariant.stock <= 0)}
                style={{
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adding...
                  </>
                ) : displayVariant?.stock <= 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    Add to Bag
                    {!addingToCart && displayVariant?.stock > 0 && (
                      <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Drawer using React Portal */}
      {showVariantOverlay && !showOutOfStock && createPortal(
        <>
          <div
            className="mobile-sheet-backdrop"
            onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}
          />
          <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
            {/* Drag grabber */}
            <div className="mobile-sheet-grabber" onClick={closeVariantOverlay} style={{ cursor: 'pointer' }} />

            {/* Header */}
            <div className="mobile-sheet-header">
              <h3 className="mobile-sheet-title">
                {groupedVariants.color.length > 0 ? "Select Shade" : "Select Variant"}
              </h3>
              <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
                &times;
              </button>
            </div>

            {/* Body content */}
            <div className="mobile-sheet-body">
              {groupedVariants.color.length > 0 && (
                <div className="mobile-sheet-variants-grid">
                  {groupedVariants.color.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    const variantText = getVariantDisplayText(v);

                    return (
                      <div
                        key={getSku(v) || v._id}
                        className={`mobile-sheet-variant-item ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                      >
                        <div
                          className={`mobile-sheet-color-circle ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}
                          style={{ backgroundColor: v.hex || "#ccc", position: "relative" }}
                        >
                          {isSel && (
                            <FaCheck className="mobile-sheet-check-icon" />
                          )}
                          {isOOS && (
                            <span style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'red',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              pointerEvents: 'none',
                            }}>✕</span>
                          )}
                        </div>
                        <span className="mobile-sheet-variant-text">
                          {variantText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {groupedVariants.text.length > 0 && (
                <div className="mobile-sheet-variants-grid">
                  {groupedVariants.text.map((v) => {
                    const isSel = displayVariant.sku === v.sku;
                    const isOOS = (v.stock ?? 0) <= 0;
                    const variantText = getVariantDisplayText(v);

                    return (
                      <div
                        key={getSku(v) || v._id}
                        className="mobile-sheet-variant-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOOS) {
                            handleVariantSelect(v);
                            setTempSelectedVariant(v);
                          }
                        }}
                      >
                        <button className={`mobile-sheet-text-pill ${isSel ? "selected" : ""} ${isOOS ? "oos" : ""}`}>
                          <span>{variantText}</span>
                          {isSel && <FaCheck style={{ fontSize: '10px' }} />}
                          {isOOS && (
                            <span style={{
                              color: 'red',
                              fontWeight: 'bold',
                              marginLeft: '6px',
                              fontSize: '12px',
                            }}>✕</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Price & Info */}
            <div className="mobile-sheet-footer">
              <div className="mobile-sheet-footer-left">
                <span className="mobile-sheet-selected-label">
                  {getVariantDisplayText(displayVariant)}
                </span>
                <div className="mobile-sheet-price-row">
                  <span className="mobile-sheet-current-price">
                    {formatPrice(displayVariant.displayPrice)}
                  </span>
                  {displayVariant.originalPrice > displayVariant.displayPrice && (
                    <>
                      <span className="mobile-sheet-original-price">
                        {formatPrice(displayVariant.originalPrice)}
                      </span>
                      <span className="mobile-sheet-discount">
                        ({displayVariant.discountPercent || 0}% OFF)
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span
                className="mobile-sheet-view-details"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${getProductSlug()}`);
                  closeVariantOverlay();
                }}
              >
                View Details
              </span>
            </div>

            {/* Add to Bag Button */}
            <div className="mobile-sheet-action-wrap">
              <button
                className="mobile-sheet-btn-add"
                disabled={addingToCart || (displayVariant && displayVariant.stock <= 0)}
                onClick={async (e) => {
                  e.stopPropagation();
                  const chosen = tempSelectedVariant || selectedVariant || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                  if (chosen) {
                    handleVariantSelect(chosen);
                  }
                  await handleAddToCart(chosen);
                  closeVariantOverlay();
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    Adding...
                  </>
                ) : (displayVariant && displayVariant.stock <= 0) ? (
                  "Out of Stock"
                ) : (
                  "Add to Bag"
                )}
              </button>
            </div>
          </div>
        </>
        , document.body
      )}

      {/* Out of stock popup using React Portal */}
      {showOutOfStockPopup && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999,
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
              &times;
            </button>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>😢</div>
            <h4 style={{ fontWeight: 600, marginBottom: '10px' }}>Out of Stock</h4>
            <p style={{ color: '#666', margin: 0 }}>
              Oops! {outOfStockProductName} is out of stock right now. We are working hard to restock it as soon as possible!
            </p>
          </div>
        </div>
        , document.body
      )}
    </div>
  );
};
// ─── Confetti Burst Component ───────────────────────────────────────────────
const ConfettiBurst = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#ff7675', '#74b9ff', '#a29bfe'];
      const shapes = ['50%', '0%']; // circle or square
      const newParticles = Array.from({ length: 120 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 400;
        const shootX = Math.cos(angle) * distance;
        const shootY = -150 - Math.random() * 500; // shoot upwards

        return {
          id: i,
          color: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: shapes[Math.floor(Math.random() * shapes.length)],
          shootX: `${shootX}px`,
          shootY: `${shootY}px`,
          rotateDeg: `${Math.random() * 1080 - 540}deg`,
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 12}px`,
          delay: `${Math.random() * 0.2}s`,
          duration: `${2 + Math.random() * 1.5}s`,
          left: `${40 + Math.random() * 20}vw`, // start near the middle
          top: `90vh`, // start near the bottom
        };
      });
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--shoot-x': p.shootX,
            '--shoot-y': p.shootY,
            '--rotate-deg': p.rotateDeg,
          }}
        />
      ))}
    </div>
  );
};

// ─── Main CartPage ────────────────────────────────────────────────────────────
const CartPage = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showApplyAnimation, setShowApplyAnimation] = useState(false);
  const [movingToWishlist, setMovingToWishlist] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    handleCloseConfirm(); // your existing function
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { syncCartFromBackend } = useContext(CartContext);

  const getCleanProductSlug = (item) => {
    try {
      const slugMap = JSON.parse(localStorage.getItem("productSlugMap") || "{}");
      return slugMap[item.productId] || item.productSlug || item.productId;
    } catch {
      return item.productSlug || item.productId;
    }
  };
  const { syncWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [stockError, setStockError] = useState("");

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [recoLoading, setRecoLoading] = useState(false);

  // Confirm remove modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleShowConfirm = (item) => { setItemToRemove(item); setShowConfirm(true); };
  const handleCloseConfirm = () => { setShowConfirm(false); setItemToRemove(null); };
  const handleConfirmRemove = () => {
    if (itemToRemove) handleRemoveByProductId(itemToRemove.productId, itemToRemove.selectedVariant?.sku || null);
    handleCloseConfirm();
  };

  const handleMoveToWishlist = async () => {
    if (!itemToRemove) return;
    setMovingToWishlist(true);
    try {
      const productId = itemToRemove.productId;
      const variantSku = itemToRemove.selectedVariant?.sku || null;

      if (user && !user.guest) {
        // Logged-in user: Call backend API
        const res = await fetch(`https://beauty.joyory.com/api/user/cart/${productId}/move-to-wishlist`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sku: variantSku }),
        });

        if (!res.ok) {
          throw new Error("Failed to move item to wishlist");
        }
      } else {
        // Guest user: Save pending action and redirect to login
        localStorage.setItem("pendingCartAction", JSON.stringify({
          type: "move-to-wishlist",
          productId,
          sku: variantSku
        }));
        handleCloseConfirm();
        toast.info("Please login to move items to your wishlist");
        navigate("/login", { state: { from: "/cartpage" } });
        return;
      }

      handleCloseConfirm();
      syncCartFromBackend();
      navigate("/Wishlist");
    } catch (err) {
      console.error("Error moving item to wishlist:", err);
      alert("Failed to move item to wishlist. Please try again.");
    } finally {
      setMovingToWishlist(false);
    }
  };

  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageColor, setCouponMessageColor] = useState("info");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [activeCouponTab, setActiveCouponTab] = useState("available");
  const [manualCoupon, setManualCoupon] = useState("");
  let cartCallCount = 0;

  const handleAddToCartSuccess = async () => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    await fetchCart(savedCoupon, true);
    await syncCartFromBackend();
  };

  // ── fetch cart ──────────────────────────────────────────────────────────────
  const fetchCart = async (discountCode = null, silent = false) => {
    cartCallCount++;
    try {
      if (!silent) setLoading(true);
      const url = discountCode
        ? `${API_BASE}/summary?discount=${discountCode}`
        : `${API_BASE}/summary`;
      const res = await fetch(url, { credentials: "include" });

      if (res.status === 400) {
        setCartData({ cart: [], freebies: [], bagMrp: 0, bagDiscount: 0, autoDiscount: 0, couponDiscount: 0, shipping: 0, taxableAmount: 0, gstRate: "0%", gstAmount: 0, gstMessage: "", payable: 0, appliedCoupon: null, applicableCoupons: [], inapplicableCoupons: [], promotions: [], totalSavings: 0, savingsMessage: "", grandTotal: 0, shippingMessage: "" });
        setStockError("");
        if (!silent) setLoading(false);
        return;
      }
      if (!res.ok) {
        if (res.status === 401) {
          if (user && !user.guest) {
            navigate("/login");
          }
        }
        throw new Error("Failed to fetch cart");
      }

      const data = await res.json();
      const normalizedCart = (data.cart || []).map((item) => {
        const variant = item.variant || {};
        const price = variant.displayPrice || variant.discountedPrice || 0;
        const originalPrice = variant.originalPrice || price;
        const discountPercent = variant.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
        const discounts = discountPercent > 0 ? [{ type: "Discount", amount: originalPrice - price, note: `${discountPercent}% Off` }] : [];
        return {
          cartItemId: item._id || `${item.product}-${variant.sku || "default"}`,
          productId: item.product || item.productId,
          productSlug: item.slug || (item.product && typeof item.product === 'object' ? item.product.slugs?.[0] || item.product.slug : null) || null,
          name: item.name || "Unnamed Product",
          image: variant.image || "/placeholder.png",
          brand: item.brand || "",
          selectedVariant: variant,
          quantity: item.quantity || 1,
          price,
          subTotal: item.itemTotal || price * (item.quantity || 1),
          discounts,
          stockStatus: item.stockStatus || (variant.stock > 0 ? "in_stock" : "out_of_stock"),
          stockMessage: item.stockMessage || "",
          canCheckout: item.canCheckout !== false,
        };
      });

      const p = data.priceDetails || {};
      setCartData({
        cart: normalizedCart,
        freebies: data.freebies || [],
        bagMrp: p.bagMrp || 0, bagDiscount: p.bagDiscount || 0, autoDiscount: p.autoDiscount || 0,
        couponDiscount: p.couponDiscount || 0, shipping: p.shippingCharge || 0,
        taxableAmount: p.taxableAmount || 0, gstRate: p.gstRate || "0%",
        gstAmount: p.gstAmount || 0, gstMessage: p.gstMessage || "",
        payable: p.payable || 0, appliedCoupon: data.appliedCoupon || null,
        applicableCoupons: data.applicableCoupons || [], inapplicableCoupons: data.inapplicableCoupons || [],
        promotions: data.appliedPromotions || [], totalSavings: p.totalSavings || 0,
        savingsMessage: p.savingsMessage || "", grandTotal: data.grandTotal || p.payable || 0,
        shippingMessage: p.shippingMessage || "",
      });
      const offender = (data.cart || []).find((i) => !i.canCheckout);
      setStockError(offender ? offender.stockMessage : "");
    } catch (err) {
      console.error("Error fetching cart:", err);
      // Fallback to local guest cart if user is guest or not logged in
      const isGuest = !user || user.guest;
      if (isGuest) {
        try {
          const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
          const normalizedCart = guestCart.map((item) => ({
            cartItemId: item.cartItemId || `${item.productId}-${item.selectedVariant?.sku || "default"}`,
            productId: item.productId,
            productSlug: item.selectedVariant?.slug || (item.product ? item.product.slugs?.[0] || item.product.slug : null) || null,
            name: item.name || "Unnamed Product",
            image: item.image || "/placeholder.png",
            brand: item.brand || "",
            selectedVariant: item.selectedVariant || {},
            quantity: item.quantity || 1,
            price: item.price || 0,
            subTotal: (item.price || 0) * (item.quantity || 1),
            discounts: [],
            stockStatus: "in_stock",
            stockMessage: "",
            canCheckout: true,
          }));

          const totalAmount = normalizedCart.reduce((sum, item) => sum + item.subTotal, 0);

          setCartData({
            cart: normalizedCart,
            freebies: [],
            bagMrp: totalAmount,
            bagDiscount: 0,
            autoDiscount: 0,
            couponDiscount: 0,
            shipping: 0,
            taxableAmount: totalAmount,
            gstRate: "12%",
            gstAmount: Math.round(totalAmount * 0.12 * 100) / 100,
            gstMessage: "",
            payable: totalAmount,
            appliedCoupon: null,
            applicableCoupons: [],
            inapplicableCoupons: [],
            promotions: [],
            totalSavings: 0,
            savingsMessage: "",
            grandTotal: totalAmount,
            shippingMessage: "",
          });
          setStockError("");
        } catch (localErr) {
          console.error("Error parsing guestCart from localStorage:", localErr);
          setCartData(null);
        }
      } else {
        setCartData(null);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // ── fetch recommendations ───────────────────────────────────────────────────
  const fetchRecommendations = async () => {
    try {
      setRecoLoading(true);
      const res = await fetch(RECOMMENDATIONS_API, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.sections)) {
        setRecommendations(data.sections);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setRecoLoading(false);
    }
  };

  // ── quantity change ─────────────────────────────────────────────────────────
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    if (newQty > 6) return alert("Max 6 units allowed.");
    const item = cartData?.cart?.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
    try {
      const appliedCoupon = cartData?.appliedCoupon?.code || null;
      const res = await fetch(`${API_BASE}/update`, {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, variantSku: item.selectedVariant?.sku || null, quantity: newQty, discount: appliedCoupon }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      await fetchCart(appliedCoupon);
      await syncCartFromBackend();
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity. Please try again.");
      await fetchCart();
      await syncCartFromBackend();
    }
  };

  // ── remove item ─────────────────────────────────────────────────────────────
  const handleRemoveByProductId = async (productId, variantSku = null) => {
    if (!productId) return;
    try {
      const appliedCoupon = cartData?.appliedCoupon?.code || null;
      const url = variantSku
        ? `${API_BASE}/remove/${productId}?variantSku=${encodeURIComponent(variantSku)}`
        : `${API_BASE}/remove/${productId}`;
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Server failed to remove item");
      await fetchCart(appliedCoupon);
      await syncCartFromBackend();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from cart.");
      await fetchCart();
      await syncCartFromBackend();
    }
  };

  // ── coupon handlers ─────────────────────────────────────────────────────────
  // const handleCouponSubmit = async (code) => {
  //   if (!code) { setCouponMessage("Please enter a coupon code."); setCouponMessageColor("warning"); return; }
  //   try {
  //     await fetchCart(code);
  //     localStorage.setItem("appliedCoupon", code);
  //     setCouponMessage(`Coupon ${code} applied successfully!`);
  //     setCouponMessageColor("success");
  //     setShowCouponModal(false);
  //     setManualCoupon("");
  //   } catch { setCouponMessage("Failed to apply coupon."); setCouponMessageColor("danger"); }
  // };





  const handleCouponSubmit = async (code) => {
    if (!code) {
      setCouponMessage("Please enter a coupon code.");
      setCouponMessageColor("warning");
      return;
    }

    try {
      setApplyingCoupon(true);
      setShowApplyAnimation(true);

      // simulate animation duration (you can tweak timing)
      await new Promise((res) => setTimeout(res, 1500));

      await fetchCart(code);
      await syncCartFromBackend();
      localStorage.setItem("appliedCoupon", code);

      setCouponMessage(`Coupon ${code} applied successfully!`);
      setCouponMessageColor("success");

      // hide animation + modal
      setShowApplyAnimation(false);
      setShowCouponModal(false);
      setManualCoupon("");

    } catch {
      setCouponMessage("Failed to apply coupon.");
      setCouponMessageColor("danger");
      setShowApplyAnimation(false);
    } finally {
      setApplyingCoupon(false);
    }
  };



  const handleRemoveCoupon = async () => {
    setCouponMessage("Coupon removed.");
    setCouponMessageColor("info");
    localStorage.removeItem("appliedCoupon");
    await fetchCart();
    await syncCartFromBackend();
  };

  const handleShowDiscountProducts = (coupon) => {
    navigate("/DiscountProductsPage", { state: { coupon, activeCouponTab } });
  };

  // ── checkout ────────────────────────────────────────────────────────────────
  // const handleProceed = async () => {
  //   try {
  //     setInitiating(true);
  //     if (!document.cookie.includes("token=")) {
  //       navigate("/login", { state: { from: "/cartpage", message: "Please login to proceed with checkout" } });
  //       return;
  //     }
  //     const body = {
  //       discountCode: cartData?.appliedCoupon?.code || null,
  //       pointsToUse: cartData?.pointsToUse || 0,
  //       giftCardCode: cartData?.giftCardApplied?.code || null,
  //       giftCardPin: cartData?.giftCardApplied?.pin || null,
  //       giftCardAmount: cartData?.giftCardApplied?.amount || 0,
  //       taxableAmount: cartData?.taxableAmount || 0,
  //       gstAmount: cartData?.gstAmount || 0,
  //       gstRate: cartData?.gstRate || "0%",
  //     };
  //     const res = await fetch(INITIATE_ORDER_API, {
  //       method: "POST", credentials: "include",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });
  //     if (!res.ok) { if (res.status === 401) navigate("/login"); throw new Error("Failed to initiate order"); }
  //     const orderData = await res.json();
  //     navigate("/AddressSelection", {
  //       state: {
  //         orderId: orderData.orderId,
  //         cartItems: cartData.cart,
  //         priceDetails: {
  //           bagMrp: cartData.bagMrp, bagDiscount: cartData.bagDiscount,
  //           autoDiscount: cartData.autoDiscount, couponDiscount: cartData.couponDiscount,
  //           shipping: cartData.shipping, taxableAmount: cartData.taxableAmount,
  //           gstRate: cartData.gstRate, gstAmount: cartData.gstAmount,
  //           gstMessage: cartData.gstMessage, payable: cartData.payable,
  //           appliedCoupon: cartData.appliedCoupon, totalSavings: cartData.totalSavings,
  //           savingsMessage: cartData.savingsMessage,
  //         },
  //       },
  //     });
  //   } catch (err) {
  //     console.error("Checkout Error:", err);
  //     alert(err.message || "Something went wrong during checkout.");
  //   } finally {
  //     setInitiating(false);
  //   }
  // };



  const handleProceed = async () => {
    try {
      setInitiating(true);

      // 🔐 Check login first
      if (!document.cookie.includes("token=")) {
        setTimeout(() => {
          navigate("/login", {
            state: {
              from: "/cartpage",
              message: "Please login to proceed with checkout",
            },
          });
        }, 1200); // small delay for UX

        return;
      }

      const body = {
        discountCode: cartData?.appliedCoupon?.code || null,
        pointsToUse: cartData?.pointsToUse || 0,
        giftCardCode: cartData?.giftCardApplied?.code || null,
        giftCardPin: cartData?.giftCardApplied?.pin || null,
        giftCardAmount: cartData?.giftCardApplied?.amount || 0,
        taxableAmount: cartData?.taxableAmount || 0,
        gstAmount: cartData?.gstAmount || 0,
        gstRate: cartData?.gstRate || "0%",
      };

      const res = await fetch(INITIATE_ORDER_API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setTimeout(() => navigate("/login"), 1200);
          return;
        }
        throw new Error("Failed to initiate order");
      }

      const orderData = await res.json();

      // 🧠 Add delay BEFORE redirect (smooth UX)
      setTimeout(() => {
        navigate("/AddressSelection", {
          state: {
            orderId: orderData.orderId,
            cartItems: cartData.cart,
            priceDetails: {
              bagMrp: cartData.bagMrp,
              bagDiscount: cartData.bagDiscount,
              autoDiscount: cartData.autoDiscount,
              couponDiscount: cartData.couponDiscount,
              shipping: cartData.shipping,
              taxableAmount: cartData.taxableAmount,
              gstRate: cartData.gstRate,
              gstAmount: cartData.gstAmount,
              gstMessage: cartData.gstMessage,
              payable: cartData.payable,
              appliedCoupon: cartData.appliedCoupon,
              totalSavings: cartData.totalSavings,
              savingsMessage: cartData.savingsMessage,
            },
          },
        });
      }, 1500); // 🔥 control loader duration here

    } catch (err) {
      console.error("Checkout Error:", err);
      alert(err.message || "Something went wrong during checkout.");
      setInitiating(false);
    }
  };

  // ── mount ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const applyCode = location.state?.applyCouponCode;
      const savedCoupon = localStorage.getItem("appliedCoupon");
      if (applyCode) await fetchCart(applyCode);
      else if (savedCoupon) await fetchCart(savedCoupon);
      else await fetchCart();
      await syncCartFromBackend();
    };
    load();
    fetchRecommendations();
  }, []);

  // ── Handle pending cart action after login ───────────────────────────────────
  useEffect(() => {
    const handlePendingCartAction = async () => {
      if (!user || user.guest) return; // Wait until authenticated user is loaded
      
      const pendingActionStr = localStorage.getItem("pendingCartAction");
      if (pendingActionStr) {
        try {
          const { type, productId, sku } = JSON.parse(pendingActionStr);
          localStorage.removeItem("pendingCartAction");

          if (type === "move-to-wishlist") {
            const res = await fetch(`https://beauty.joyory.com/api/user/cart/${productId}/move-to-wishlist`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sku }),
            });

            if (res.ok) {
              toast.success("Product moved to wishlist successfully!");
              const savedCoupon = localStorage.getItem("appliedCoupon");
              await fetchCart(savedCoupon);
              await syncCartFromBackend();
              syncWishlist();
            } else {
              console.error("Failed to move item to wishlist");
            }
          }
        } catch (e) {
          console.error("Error executing pending cart action:", e);
        }
      }
    };
    handlePendingCartAction();
  }, [user, syncWishlist]);

  // ── Auto-clear coupon message ──────────────────────────────────────────────
  useEffect(() => {
    if (couponMessage) {
      const timer = setTimeout(() => {
        setCouponMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [couponMessage]);

  // ── loading / empty states ──────────────────────────────────────────────────
  if (loading)
    return (
      <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact className='foryoulanding-css'
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );

  if (!cartData || (cartData.cart.length === 0 && cartData.freebies?.length === 0)) {
    return (
      <>
        <Header />
        <div className="container mt-xl-5 pt-xl-5">
          <div className="p-4 text-center mt-5 cartpage-empty-Main-section">
            <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
            <h5 className="mb-2 page-title-main-name">Your cart is empty 🛒</h5>
            <button
              className="page-title-main-name Shop-now-Button"
              onClick={() => navigate("/")}
            >
              Shop Now
            </button>
          </div>

          {/* ✅ ADD FROM HERE */}
          <div className="container mt-4">
            {!recoLoading && recommendations.length > 0 && (
              <div className="mt-4">
                {recommendations.map((section) => {
                  const filteredProducts = (section.products || []).filter((product) => {
                    if (!product) return false;

                    const variants = product.variants || [];
                    if (variants.length > 0) {
                      return variants.some((v) => (v.stock ?? 0) > 0);
                    }

                    return (product.stock ?? 0) > 0;
                  });

                  if (filteredProducts.length === 0) return null;

                  return (
                    <div key={section.key} className="mb-5">
                      <h2
                        className="font-familys text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
                        style={{ fontSize: "1.4rem" }}
                      >
                        {section.title || "Trending Products"}
                      </h2>

                      <Swiper
                        spaceBetween={20}
                        slidesPerView={2}
                        breakpoints={{
                          576: { slidesPerView: 2 },
                          768: { slidesPerView: 3 },
                          992: { slidesPerView: 4 },
                          1200: { slidesPerView: 4 },
                          1400: { slidesPerView: 4 },
                        }}
                      >
                        {filteredProducts.map((product) => (
                          <SwiperSlide key={`${section.key}-${product._id}`}>
                            <RecoProductCard
                              product={product}
                              navigate={navigate}
                              user={user}
                              onAddToCartSuccess={handleAddToCartSuccess}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* ✅ END HERE */}
        </div>
        <Footer />
      </>
    );
  }

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <>


      {initiating && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#fff",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <DotLottieReact
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
            style={{ width: "250px" }}
          />
          <p className="mt-3 text-muted">Preparing your checkout...</p>
        </div>
      )}
      <Header />
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <div className="container-lg Conatiner-fluid mt-xl-5 pt-xl-5">
        <h2 className="page-title-main-name mb-4 cartpage-titlesss mt-lg-5 pt-lg-3 mt-5 pt-5">Your Cart</h2>
        <div className="row">

          {/* ── Left column: cart items + freebies + recommendations ── */}
          <div className="col-xxl-8 col-12">
            <ul className="list-group">
              {cartData.cart.map((item) => {
                const variant = item.selectedVariant || {};
                const shadeName = variant.shadeName || variant.name;
                const shadeHex = variant.hex;
                return (
                  <li key={item.cartItemId} className="list-group-item d-flex justify-content-between align-items-end border-black">
                    <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${getCleanProductSlug(item)}`)}>
                      <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                      <div className="w-75">
                        <strong className="page-title-main-name">
                          {(() => {
                            // const variantText = shadeName ? shadeName.trim() : "";
                            // return variantText && variantText.toUpperCase() !== "DEFAULT" ? `${item.name} - ${shadeName}` : item.name;
                            return item.name;
                          })()}
                        </strong>
                        {item.brand && <div className="text-muted small page-title-main-name">{item.brand}</div>}
                        {item.stockStatus !== "in_stock" && (
                          <div className="small text-danger fw-semibold page-title-main-name">{item.stockMessage || "Out of stock"}</div>
                        )}
                        <div className="small d-flex align-items-center page-title-main-name">
                          {variant.originalPrice && variant.originalPrice > item.price ? (
                            <>
                              <span className="fw-bold me-1">₹{item.price}</span>
                              <span className="text-muted text-decoration-line-through">₹{variant.originalPrice}</span>
                            </>
                          ) : (
                            <span className="fw-400 page-title-main-name">₹{item.price}</span>
                          )}
                          <div className="ms-2">
                            {item.discounts?.length > 0 && (
                              <ul className="mt-1 small text-success p-0 m-0 page-title-main-name" type="none">
                                {item.discounts.map((d) => (
                                  <li key={`${item.cartItemId}-${d.type}-${d.note}`} className="backgound-colors-discount page-title-main-name">
                                    <i className="bi bi-tag page-title-main-name"></i>&nbsp;
                                    {d.note || `${d.type} - ₹${d.amount} off`}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 page-title-main-name justify-content-between" style={{ margin: "5px 0" }}>
                      <div className="border-for-minu-plush">
                        <button className="btn btn-sm btn-outline-secondary page-title-main-name" style={{ border: "none", background: "#FFF", boxShadow: "none" }} onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)} disabled={item.stockStatus === "out_of_stock"}>−</button>
                        <span className={`px-2 ${item.stockStatus === "out_of_stock" ? "text-muted text-decoration-line-through" : ""} page-title-main-name`}>{item.quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary page-title-main-name" style={{ border: "none", background: "#FFF", boxShadow: "none" }} onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)} disabled={item.stockStatus === "out_of_stock"}>+</button>
                      </div>
                      <span className={`fw-bold page-title-main-name ${item.stockStatus === "out_of_stock" ? "text-muted" : ""}`}>₹{item.subTotal.toFixed(2)}</span>
                      <button onClick={() => handleShowConfirm(item)} className="btn btn-outline-danger" title="Remove item from cart">
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Free Gifts */}
            {cartData.freebies?.length > 0 && (
              <div className="mt-4">
                <h5 className="ms-3 page-title-main-name">Free Gifts 🎁</h5>
                <ul className="list-group">
                  {cartData.freebies.map((freebie, idx) => {
                    const fv = freebie.variant || {};
                    const img = fv.images?.[0] || fv.image || "/placeholder.png";
                    return (
                      <li key={idx} className="list-group-item d-flex align-items-center gap-3">
                        <img src={img} alt={freebie.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                        <div>
                          <strong className="page-title-main-name">{freebie.name}</strong>
                          {freebie.qty > 1 && <div className="small page-title-main-name">Quantity: {freebie.qty}</div>}
                          <div className="text-success fw-bold page-title-main-name">FREE</div>
                          {freebie.message && <div className="small text-muted page-title-main-name">{freebie.message}</div>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Reco loading skeleton */}
            {recoLoading && (
              <div className="mt-5 d-flex gap-3" style={{ overflowX: "hidden" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ minWidth: "200px" }}>
                    <div className="bg-light rounded" style={{ height: "200px", marginBottom: "8px" }} />
                    <div className="bg-light rounded" style={{ height: "16px", marginBottom: "6px", width: "60%" }} />
                    <div className="bg-light rounded" style={{ height: "14px", width: "40%" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right column: Order Summary (unchanged) ── */}
          <div className="col-xxl-4 col-12 mt-4 mt-lg-0">
            <div className="border-color-width">
              <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <div className="fw-600 ms-3 fs-5 page-title-main-name">Coupons & Bank Offers</div>
                <i className="bi bi-chevron-right margin-left-right" onClick={() => setShowCouponModal(true)} style={{ cursor: "pointer" }}></i>
              </div>
              <hr className="border-color-blacks" />
              <h5 className="ms-3 fs-5 fw-600 page-title-main-name">Order Summary</h5>
              <hr className="border-color-blacks" />

              <div className="mb-3 page-title-main-name">
                <div className="d-flex justify-content-between mb-1 margin-left-right-repert">
                  <span className="page-title-main-name">Bag MRP :</span>
                  <span className="page-title-main-name">₹{cartData.bagMrp?.toFixed(2) || "0.00"}</span>
                </div>
                {cartData.bagDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert">
                    <span className="page-title-main-name text-black">Bag Discount :</span>
                    <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
                  <div className="d-block">
                    <span className="page-title-main-name">Shipping :</span>
                    {cartData.shippingMessage && (
                      <div className="shipping-promo-message mb-2 page-title-main-name">
                        <i className="bi bi-truck me-1"></i>{cartData.shippingMessage}
                      </div>
                    )}
                  </div>
                  <span className={cartData.shipping === 0 ? "text-success" : ""}>
                    {cartData.shipping === 0 ? "Free" : `₹${cartData.shipping?.toFixed(2) || "0.00"}`}
                  </span>
                </div>
                {cartData.couponDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert pb-2 page-title-main-name">
                    <span>Coupon Discount:</span>
                    <span>-₹{cartData.couponDiscount?.toFixed(2) || "0.00"}</span>
                  </div>
                )}
                <hr className="border-color-blacks" />
                <div className="d-flex justify-content-between mb-1 pt-2 margin-left-right-repert">
                  <span className="font-weight-in-tablable-amount page-title-main-name">Taxable Amount :</span>
                  <span className="fw-semibold page-title-main-name">₹{cartData.taxableAmount?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="d-flex justify-content-between mb-1 margin-left-right-repert page-title-main-name">
                  <span className="page-title-main-name">GST ({cartData.gstRate})</span>
                  <span className="page-title-main-name">+₹{cartData.gstAmount?.toFixed(2) || "0.00"}</span>
                </div>
                {cartData.gstMessage && (
                  <div className="small text-muted mb-2 margin-left-right-repert page-title-main-name">
                    <i className="bi bi-receipt me-1"></i>{cartData.gstMessage}
                  </div>
                )}
                <hr className="border-color-blacks" />
                <div className="d-flex justify-content-between mb-3 pt-2 margin-left-right-repert align-items-center">
                  <span className="fw-semibold fs-6 page-title-main-name">Total Payable :</span>
                  <span className="fw-bold text-primary fs-5 page-title-main-name text-black">₹{cartData.payable?.toFixed(2) || "0.00"}</span>
                </div>
                <hr className="border-color-blacks" />
                {cartData.savingsMessage && (
                  <div className="py-2 small margin-left-right-repert page-title-main-name">
                    <i className="bi bi-coin me-1"></i>{cartData.savingsMessage}
                  </div>
                )}
              </div>

              {cartData.appliedCoupon?.code && (
                <div className="applied-coupon-box">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Applied Coupon:</strong> <br /> {cartData.appliedCoupon.code}
                      {cartData.appliedCoupon.discount && <span className="ms-2">- ₹{cartData.appliedCoupon.discount} off</span>}
                    </div>
                    <button className="applied-coupon-remove-btn" onClick={handleRemoveCoupon}>Remove</button>
                  </div>
                </div>
              )}

              {stockError && (
                <Alert variant="warning" className="mb-2">
                  <strong>{(cartData.cart || []).find((i) => !i.canCheckout)?.name || "Item"}</strong>{" – "}{stockError}
                </Alert>
              )}

              <button
                className="page-title-main-name bg-black text-white checkout-button w-100 mt-3 py-2 fw-bold"
                onClick={handleProceed}
                disabled={initiating || !!stockError}
              >
                {initiating ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Processing...</>
                ) : (
                  <><i className="bi bi-lock-fill me-2"></i>Proceed to Checkout (₹{cartData.payable?.toFixed(2)})</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommendations + From Your Wishlist (with filtering) ── */}
      <div className="container">
        {!recoLoading && recommendations.length > 0 && (
          <div className="mt-5">
            {recommendations.map((section) => {
              // Detect wishlist section
              const isWishlistSection =
                section.key === "wishlist" ||
                section.title?.toLowerCase().includes("wishlist");

              // Filter only AVAILABLE products
              const filteredProducts = (section.products || []).filter((product) => {
                if (!product) return false;
                const variants = product.variants || [];
                if (variants.length > 0) {
                  return variants.some((v) => (v.stock ?? 0) > 0);
                }
                return (product.stock ?? 0) > 0;
              });

              // If wishlist section has NO available products, completely hide it
              if (isWishlistSection && filteredProducts.length === 0) {
                return null;
              }

              // Determine which products to render
              const productsToRender = isWishlistSection ? filteredProducts : (section.products || []);

              return (
                <div key={section.key} className="mb-5">
                  {/* Section Title */}
                  <h2
                    className="font-familys text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
                    style={{ fontSize: "1.4rem" }}
                  >
                    {section.title}
                  </h2>

                  {/* Swiper Slider */}
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={2}
                    breakpoints={{
                      576: { slidesPerView: 2 },
                      768: { slidesPerView: 3 },
                      992: { slidesPerView: 4 },
                      1200: { slidesPerView: 4 },
                      1400: { slidesPerView: 4 },
                    }}
                  >
                    {productsToRender.map((product) => (
                      <SwiperSlide key={`${section.key}-${product._id}`}>
                        <RecoProductCard
                          product={product}
                          navigate={navigate}
                          user={user}
                          onAddToCartSuccess={handleAddToCartSuccess}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Remove Modal */}
      <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
        <Modal.Header style={{ position: 'relative' }}>
          <Modal.Title>Confirm Removal</Modal.Title>
          <button
            type="button"
            onClick={handleCloseConfirm}
            style={{
              position: 'absolute',
              right: '20px',
              top: '12px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              color: '#000',
              cursor: 'pointer',
              lineHeight: '1',
              padding: '0',
              opacity: '0.8',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}

            className="removel-cross-btn"
          >
            &times;
          </button>
        </Modal.Header>
        <Modal.Body className="page-title-main-name">Are you sure you want to remove "{itemToRemove?.name}" from your cart?</Modal.Body>
        <Modal.Footer>
          <button
            className="modal-footer-btn"
            onClick={handleConfirmRemove}
            disabled={movingToWishlist}
          >
            Remove
          </button>
          <button
            className="modal-footer-btn"
            onClick={handleMoveToWishlist}
            disabled={movingToWishlist}
          >
            {movingToWishlist ? "Moving..." : "Move to Wishlist"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Coupon Modal */}
      <div className={`modal fade ${showCouponModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered page-title-main-name" role="document">
          <div className="modal-content border-0 rounded-0">
            <div className="modal-header border-bottom py-3 px-4">
              <h5 className="modal-title fw-normal" style={{ color: "#444" }}>Apply Coupon</h5>
              <button type="button" className="btn-close shadow-none mb-0" onClick={() => setShowCouponModal(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body p-4 bg-light">
              <ul className="nav nav-tabs border-0 mb-4 justify-content-center">
                <li className="nav-item">
                  <button className={`nav-link border-0 shadow-none ${activeCouponTab === "available" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("available")}>Available</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link border-0 shadow-none ${activeCouponTab === "inapplicable" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("inapplicable")}>Not Applicable</button>
                </li>
              </ul>
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {(activeCouponTab === "available" ? cartData.applicableCoupons : cartData.inapplicableCoupons)?.map((c) => (
                  <div className="col-lg-6 col-md-12" key={c._id || c.code}>
                    <div className={`coupon-ticket shadow-sm ${activeCouponTab === "inapplicable" ? "opacity-75" : ""}`}>
                      <div className="ticket-sidebar">
                        <div className="ticket-notch"></div>
                        <span className="ticket-code-rotated">{c.code}</span>
                      </div>
                      <div className="ticket-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-1 fw-bold text-secondary page-title-main-name">{c.label || "Offer"}</h6>
                          {activeCouponTab === "available" && (
                            // <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn" onClick={() => handleCouponSubmit(c.code)}>Apply</button>

                            <button
                              className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn d-flex align-items-center gap-2"
                              onClick={() => handleCouponSubmit(c.code)}
                              disabled={applyingCoupon}
                            >
                              {applyingCoupon ? (
                                <>
                                  <span className="spinner-border spinner-border-sm"></span>
                                  Applying...
                                </>
                              ) : (
                                "Apply"
                              )}
                              {showApplyAnimation && (
                                <div
                                  style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    // background: "rgba(255,255,255,0.95)",
                                    zIndex: 9999,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column"
                                  }}
                                >
                                  <img
                                    src={applyGif}   // ⚠️ put your gif in public folder
                                    style={{ width: "20%", marginBottom: "10px" }}
                                  />
                                  {/* <p className="page-title-main-name text-muted">
                                    Applying your coupon...
                                  </p> */}
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                        <p className="ticket-desc mb-2 text-muted page-title-main-name">{c.description || "Enjoy discount on your order"}</p>
                        <div className="ticket-divider"></div>
                        <small className="ticket-footer text-muted page-title-main-name" style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleShowDiscountProducts(c)}>
                          Valid on select products
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebratory Confetti Burst */}
      <ConfettiBurst active={couponMessageColor === "success" && couponMessage.includes("applied successfully")} />

      {/* Floating Animated Coupon Toast */}
      {couponMessage && (
        <div className="coupon-toast-container">
          <div className={`coupon-toast ${couponMessageColor}`}>
            <span className={`coupon-toast-icon ${couponMessageColor}`}>
              {couponMessageColor === "success" && <i className="bi bi-check-circle-fill text-success"></i>}
              {couponMessageColor === "danger" && <i className="bi bi-x-circle-fill text-danger"></i>}
              {couponMessageColor === "warning" && <i className="bi bi-exclamation-circle-fill text-warning"></i>}
              {couponMessageColor === "info" && <i className="bi bi-info-circle-fill text-info"></i>}
            </span>
            <div className="coupon-toast-content">
              {couponMessage}
            </div>
            <button
              onClick={() => setCouponMessage("")}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                padding: "0 0 0 10px",
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                color: "#666",
                lineHeight: "1"
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CartPage;






//======================================================Done-Code===========================================================================================
