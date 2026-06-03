// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
// // Import Swiper React components and styles
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// const OfferLanding = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await fetch('https://beauty.joyory.com/api/user/promotions/offers-page');
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOffers();
//   }, []);

//   if (loading) {
//     return (
//       <Container className="text-center my-5 py-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading amazing offers...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="my-5">
//         <Alert variant="danger">Failed to load offers: {error}</Alert>
//       </Container>
//     );
//   }

//   if (!data) return null;

//   // Swiper responsive breakpoints
//   const swiperBreakpoints = {
//     320: { slidesPerView: 1, spaceBetween: 10 },
//     576: { slidesPerView: 2, spaceBetween: 15 },
//     768: { slidesPerView: 3, spaceBetween: 20 },
//     1200: { slidesPerView: 4, spaceBetween: 25 },
//   };

//   const productSwiperBreakpoints = {
//     320: { slidesPerView: 1, spaceBetween: 10 },
//     576: { slidesPerView: 2, spaceBetween: 15 },
//     768: { slidesPerView: 3, spaceBetween: 20 },
//     1200: { slidesPerView: 5, spaceBetween: 25 },
//   };

//   return (
//     <Container fluid className="py-4">
//       {/* Section 1: Main Banner */}
//       {data.banner && (
//         <Row className="mb-4">
//           <Col>
//             <Card className="border-0">
//               <Card.Img
//                 variant="top"
//                 src={data.banner.image}
//                 alt={data.banner.title}
//                 style={{ maxHeight: '400px', objectFit: 'cover' }}
//               />
//               {data.banner.link && (
//                 <Card.ImgOverlay className="d-flex align-items-end justify-content-start p-4">
//                   <Button variant="primary" href={data.banner.link} size="lg">
//                     Shop Now
//                   </Button>
//                 </Card.ImgOverlay>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* Section 2: Joy Banner (Reward Card) */}
//       {data.joyBanner && (
//         <Row className="mb-5 justify-content-center">
//           <Col md={8} lg={6}>
//             <Card className="text-center p-4 shadow-sm border-0">
//               <Card.Title as="h3" className="mb-3">{data.joyBanner.title}</Card.Title>
//               <Card.Img
//                 variant="top"
//                 src={data.joyBanner.image}
//                 className="my-3 mx-auto"
//                 style={{ maxHeight: '180px', width: 'auto', objectFit: 'contain' }}
//               />
//               <Card.Text
//                 dangerouslySetInnerHTML={{ __html: data.joyBanner.description }}
//                 className="mb-4"
//               />
//               <Button
//                 variant="outline-primary"
//                 href={data.joyBanner.link || '#'}
//                 className="mx-auto px-4"
//               >
//                 {data.joyBanner.buttonText}
//               </Button>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* Section 3: Brand Promotions Carousel */}
//       {data.brandPromotions?.items?.length > 0 && (
//         <Section title={data.brandPromotions.title}>
//           <Swiper
//             modules={[Navigation, Pagination]}
//             spaceBetween={20}
//             navigation
//             pagination={{ clickable: true }}
//             breakpoints={swiperBreakpoints}
//             className="pb-5"
//           >
//             {data.brandPromotions.items.map((item) => (
//               <SwiperSlide key={item._id}>
//                 <PromoCard item={item} type="brand" />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Section>
//       )}

//       {/* Section 4: Category Promotions Carousel */}
//       {data.categoryPromotions?.items?.length > 0 && (
//         <Section title={data.categoryPromotions.title}>
//           <Swiper
//             modules={[Navigation, Pagination]}
//             spaceBetween={20}
//             navigation
//             pagination={{ clickable: true }}
//             breakpoints={swiperBreakpoints}
//             className="pb-5"
//           >
//             {data.categoryPromotions.items.map((item) => (
//               <SwiperSlide key={item._id}>
//                 <PromoCard item={item} type="category" />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Section>
//       )}

//       {/* Section 5: Can't Miss This Carousel */}
//       {data.cantMissThis?.items?.length > 0 && (
//         <Section title={data.cantMissThis.title}>
//           <Swiper
//             modules={[Navigation, Pagination]}
//             spaceBetween={20}
//             navigation
//             pagination={{ clickable: true }}
//             breakpoints={swiperBreakpoints}
//             className="pb-5"
//           >
//             {data.cantMissThis.items.map((item) => (
//               <SwiperSlide key={item._id}>
//                 <Card className="h-100 text-center p-4 shadow-sm border-0">
//                   <Card.Title className="fw-bold fs-4">{item.label}</Card.Title>
//                   <Card.Text className="text-muted mb-1">{item.subLabel}</Card.Text>
//                   {item.maxPrice && (
//                     <Card.Text className="text-primary fw-bold">
//                       Max: ₹{item.maxPrice}
//                     </Card.Text>
//                   )}
//                 </Card>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Section>
//       )}

//       {/* Section 6: Discount Ranges Carousel */}
//       {data.discountRanges?.items?.length > 0 && (
//         <Section title={data.discountRanges.title}>
//           <Swiper
//             modules={[Navigation, Pagination]}
//             spaceBetween={20}
//             navigation
//             pagination={{ clickable: true }}
//             breakpoints={swiperBreakpoints}
//             className="pb-5"
//           >
//             {data.discountRanges.items.map((item, idx) => (
//               <SwiperSlide key={idx}>
//                 <Card className="h-100 text-center p-4 shadow-sm border-0">
//                   <Card.Title className="text-success fw-bold fs-3">{item.subLabel}</Card.Title>
//                   <Card.Text className="text-muted">{item.label}</Card.Text>
//                 </Card>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Section>
//       )}

//       {/* Section 7: Offer Products Sections */}
//       {data.offerProducts?.map((section) => (
//         <Section key={section._id} title={section.title}>
//           <Swiper
//             modules={[Navigation, Pagination]}
//             spaceBetween={20}
//             navigation
//             pagination={{ clickable: true }}
//             breakpoints={productSwiperBreakpoints}
//             className="pb-5"
//           >
//             {section.products.map((product) => (
//               <SwiperSlide key={product._id}>
//                 <ProductCard product={product} />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Section>
//       ))}
//     </Container>
//   );
// };

// // Helper component for consistent section wrapper
// const Section = ({ title, children }) => (
//   <div className="mb-5">
//     <h2 className="mb-4 pb-1 border-bottom">{title}</h2>
//     {children}
//   </div>
// );

// // Promo card for brand/category promotions
// const PromoCard = ({ item, type }) => {
//   const targetSlug = item.targetSlug;
//   const link = `/${type}/${targetSlug}`; // Adjust this URL pattern as needed

//   return (
//     <Card className="h-100 shadow-sm border-0" style={{ minHeight: '320px' }}>
//       {item.image && (
//         <Card.Img
//           variant="top"
//           src={item.image}
//           style={{ height: '180px', objectFit: 'cover' }}
//         />
//       )}
//       <Card.Body className="d-flex flex-column">
//         <Card.Title className="fs-6 fw-bold mb-2">{item.title}</Card.Title>
//         <Card.Text className="small text-muted flex-grow-1">
//           {item.description || 'Limited time offer'}
//         </Card.Text>
//         <Card.Text className="text-primary fw-bold mb-2">{item.discountLabel}</Card.Text>
//         {item.countdown && (
//           <small className="text-danger mb-2">
//             Ends in: {item.countdown.days}d {item.countdown.hours}h
//           </small>
//         )}
//         <Button variant="outline-primary" size="sm" href={link} className="mt-auto">
//           Shop Now
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// };

// // Product card for offerProducts sections
// const ProductCard = ({ product }) => {
//   const variant = product.selectedVariant || product.variants?.[0];
//   if (!variant) return null;

//   const discountPercent = variant.originalPrice && variant.discountedPrice
//     ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//     : 0;

//   return (
//     <Card className="h-100 shadow-sm border-0">
//       {variant.images?.length > 0 && (
//         <Card.Img
//           variant="top"
//           src={variant.images[0]}
//           alt={product.name}
//           style={{ height: '220px', objectFit: 'contain', padding: '1rem' }}
//         />
//       )}
//       <Card.Body>
//         <Card.Title className="fs-6 fw-bold mb-1">{product.name}</Card.Title>
//         {product.brand && (
//           <Card.Subtitle className="mb-2 text-muted small">{product.brand.name}</Card.Subtitle>
//         )}

//         <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
//           <span className="fw-bold text-primary">₹{variant.discountedPrice}</span>
//           {variant.originalPrice > variant.discountedPrice && (
//             <>
//               <span className="text-muted text-decoration-line-through small">
//                 ₹{variant.originalPrice}
//               </span>
//               <span className="badge bg-success">{discountPercent}% off</span>
//             </>
//           )}
//         </div>

//         {variant.promoApplied && variant.promoMessage && (
//           <small className="text-success d-block mb-2 small">
//             {variant.promoMessage.join(' • ')}
//           </small>
//         )}

//         <Button variant="primary" size="sm" className="w-100 mt-2">
//           View Options
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// };

// export default OfferLanding;



















// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHeart, FaRegHeart, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import Bag from "../assets/Bag.svg";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// const API_BASE = "https://beauty.joyory.com/api/user";
// const CART_API_BASE = `${API_BASE}/cart`;
// const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

// /* ---------- helpers ---------- */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   const n = hex.trim().toLowerCase();
//   return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(n);
// };

// const getVariantDisplayText = (v) =>
//   (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

// const groupVariantsByType = (variants) => {
//   const g = { color: [], text: [] };
//   (variants || []).forEach((v) => {
//     if (!v) return;
//     v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
//   });
//   return g;
// };

// const getBrandName = (p) => {
//   if (!p?.brand) return "Unknown Brand";
//   if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
//   if (typeof p.brand === "string") return p.brand;
//   return "Unknown Brand";
// };

// // Custom Section Slider Component
// const SectionSlider = ({
//   children,
//   slidesPerView = 4,
//   spaceBetween = 20,
//   breakpoints = {},
// }) => {
//   const swiperRef = useRef(null);

//   const defaultBreakpoints = {
//     320: { slidesPerView: 2, spaceBetween: 10 },
//     576: { slidesPerView: 3, spaceBetween: 15 },
//     768: { slidesPerView: Math.min(slidesPerView, 4), spaceBetween: 20 },
//   };

//   const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

//   return (
//     <div className="position-relative margintop-sss py-2">
//       <button
//         onClick={() => swiperRef.current?.swiper?.slidePrev()}
//         className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{ width: "40px", height: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "1px solid #dee2e6" }}
//       >
//         <FaChevronLeft size={16} />
//       </button>

//       <button
//         onClick={() => swiperRef.current?.swiper?.slideNext()}
//         className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{ width: "40px", height: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "1px solid #dee2e6" }}
//       >
//         <FaChevronRight size={16} />
//       </button>

//       <Swiper
//         ref={swiperRef}
//         slidesPerView={1}
//         spaceBetween={spaceBetween}
//         breakpoints={mergedBreakpoints}
//         navigation={false}
//         className="section-slider px-1"
//       >
//         {children}
//       </Swiper>
//     </div>
//   );
// };

// export default function OffersPage() {
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   // State
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Wishlist state
//   const [wishlistData, setWishlistData] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   // Cart & variant selection
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   /* ---------- Toast ---------- */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white shadow`;
//     t.style.cssText = `z-index: 9999; background: ${type === "error" ? "#dc3545" : "#198754"};`;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ========== FETCH OFFERS DATA ========== */
//   useEffect(() => {
//     const fetchOffersData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(`${API_BASE}/promotions/offers-page`);
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load offers page:", err);
//         setError(err.response?.data?.message || "Failed to load offers page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOffersData();
//   }, []);

//   /* ========== WISHLIST LOGIC ========== */
//   const isInWishlist = (pid, sku) => wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, { withCredentials: true });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchWishlistData(); }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, { withCredentials: true, data: { sku } });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(`${WISHLIST_API_BASE}/${pid}`, { sku }, { withCredentials: true });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         await fetchWishlistData();
//       } else {
//         let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         if (inWl) {
//           g = g.filter((it) => !(it._id === pid && it.sku === sku));
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           g.push({
//             _id: pid, name: prod.name, brand: getBrandName(prod),
//             displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0], sku,
//             variantName: variant.shadeName || "Default", stock: variant.stock,
//           });
//           showToastMsg("Added to wishlist!", "success");
//         }
//         localStorage.setItem("guestWishlist", JSON.stringify(g));
//         await fetchWishlistData();
//       }
//     } catch (e) {
//       showToastMsg(e.response?.data?.message || "Wishlist error", "error");
//     } finally {
//       setWishlistLoading((p) => ({ ...p, [pid]: false }));
//     }
//   };

//   /* ========== CART LOGIC ========== */
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//     try {
//       const vars = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVar = vars.length > 0;
//       let payload;

//       if (hasVar) {
//         const sel = selectedVariants[prod._id];
//         if (!sel || sel.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }
//         payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//       }

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       showToastMsg(e.response?.data?.message || e.message || "Failed to add to cart", "error");
//       if (e.response?.status === 401) navigate("/login");
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
//   const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
//   const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* ========== LINK NAVIGATION HANDLER ========== */
//   const handleLinkNavigation = (link) => {
//     if (!link) return;
//     try {
//       const currentHost = window.location.host;
//       const linkUrl = new URL(link, window.location.origin);
//       if (linkUrl.host === currentHost) {
//         navigate(linkUrl.pathname + linkUrl.search + linkUrl.hash);
//       } else {
//         window.location.href = link;
//       }
//     } catch (e) {
//       navigate(link);
//     }
//   };

//   /* ========== RENDER PRODUCT CARD ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;
//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant = selectedVariants[prod._id] || (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);
//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = isAdding ? "Adding..." : showSelectVariantButton ? "Select Variant" : oos ? "Out of Stock" : "Add to Cart";

//     return (
//       <div key={prod._id} className="position-relative h-100 page-title-main-name">
//         <button
//           onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
//           disabled={wishlistLoading[prod._id]}
//           className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//           style={{ width: "36px", height: "36px", color: inWl ? "#dc3545" : "#6c757d", border: "none", boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}
//         >
//           {wishlistLoading[prod._id] ? <span className="spinner-border spinner-border-sm" /> : inWl ? <FaHeart /> : <FaRegHeart />}
//         </button>

//         <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column">
//           <img src={img} alt={prod.name} className="card-img-top p-2" style={{ height: "220px", objectFit: "contain", cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)} />

//           <div className="card-body d-flex flex-column p-3 flex-grow-1">
//             <div className="text-muted small mb-1 fw-medium text-start text-uppercase">{getBrandName(prod)}</div>
//             <h5 className="card-title fs-6 fw-bold text-truncate cursor-pointer" onClick={() => navigate(`/product/${slugPr}`)}>{prod.name}</h5>

//             {hasVar && (
//               <div className="mb-2">
//                 {isVariantSelected ? (
//                   <div className="text-muted small cursor-pointer d-inline-flex align-items-center" onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
//                     Variant: <span className="fw-bold text-dark ms-1">{getVariantDisplayText(displayVariant)}</span> <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted cursor-pointer d-inline-flex align-items-center" onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
//                     {vars.length} Variants Available <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                   </div>
//                 )}
//               </div>
//             )}

//             <p className="fw-bold mb-3 mt-auto" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//                 const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//                 const disc = orig > price;
//                 const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//                 return disc ? (
//                   <>₹{price} <span className="text-decoration-line-through text-muted ms-2" style={{ fontSize: "14px" }}>₹{orig}</span> <span className="text-danger ms-2" style={{ fontSize: "14px" }}>({pct}% OFF)</span></>
//                 ) : (<>₹{orig}</>);
//               })()}
//             </p>

//             <button className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"}`} onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }} disabled={disabled}>
//               {isAdding ? <><span className="spinner-border spinner-border-sm me-2" /> Adding...</> : <>{btnText} {!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: "20px" }} />}</>}
//             </button>
//           </div>
//         </div>

//         {/* Overlay Rendering (Truncated for brevity, perfectly identical to original) */}
//         {showVariantOverlay === prod._id && (
//            <div className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, background: "rgba(0,0,0,0.5)" }} onClick={closeVariantOverlay}>
//              <div className="bg-white rounded-3 overflow-hidden d-flex flex-column" onClick={(e) => e.stopPropagation()} style={{ width: "90%", maxWidth: "500px", maxHeight: "50vh" }}>
//                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                  <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                  <button onClick={closeVariantOverlay} className="btn btn-link text-dark text-decoration-none fs-4 p-0">×</button>
//                </div>
//                <div className="p-3 overflow-auto flex-grow-1">
//                  <div className="row row-cols-3 g-3">
//                    {vars.map((v) => {
//                      const sel = selectedVariants[prod._id]?.sku === v.sku;
//                      const oosV = v.stock <= 0;
//                      return (
//                        <div className="col" key={v.sku || v._id}>
//                          <div className="text-center cursor-pointer" style={{ cursor: oosV ? "not-allowed" : "pointer" }} onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                            <div className="d-flex align-items-center justify-content-center fw-medium" style={{ padding: "10px", borderRadius: "8px", border: sel ? "3px solid #000" : "1px solid #ddd", background: sel ? "#f8f9fa" : "#fff", minHeight: "50px", opacity: oosV ? 0.5 : 1 }}>
//                              {getVariantDisplayText(v)}
//                            </div>
//                            {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                          </div>
//                        </div>
//                      );
//                    })}
//                  </div>
//                </div>
//              </div>
//            </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) return ( <><Header /><div className="d-flex flex-column align-items-center justify-content-center min-vh-100"><div className="spinner-border text-dark mb-3" /><p className="text-dark fw-medium">Loading offers...</p></div><Footer /></> );
//   if (error || !data) return ( <><Header /><div className="container text-center py-5"><h3 className="text-danger">Error</h3><p className="text-muted">{error || "Failed to load"}</p></div><Footer /></> );

//   const { banner, joyBanner, brandPromotions, categoryPromotions, cantMissThis, discountRanges, offerProducts } = data;

//   return (
//     <>
//       <Header />
//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .hover-lift { transition: transform 0.3s ease; }
//         .hover-lift:hover { transform: translateY(-5px); }
//         .ticket-card { border: 2px dashed #dee2e6; border-radius: 12px; background: #fffcfc; }
//         .ticket-card:hover { border-color: #000; background: #fff; }
//       `}</style>

//       {/* 1. Main Top Banner */}
//       {banner && (
//         <div 
//           className={`w-100 mt-lg-5 pt-lg-3 ${banner.link ? 'cursor-pointer' : ''}`} 
//           onClick={() => handleLinkNavigation(banner.link)}
//         >
//           {banner.image && (
//             <img src={banner.image} alt={banner.title} className="w-100 img-fluid" style={{ objectFit: 'cover' }} />
//           )}
//         </div>
//       )}

//       <div className="container-fluid p-md-5 p-3 py-4 bg-light">
//    {/* 7. Manual Products Mapping (Offer Products) */}
//         {offerProducts?.length > 0 && offerProducts.map((section) => (
//           <section key={section._id} className="mb-5">
//             <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">{section.title}</h3>
//             <SectionSlider 
//               customBreakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 2.5, spaceBetween: 15 },
//                 768: { slidesPerView: 3, spaceBetween: 20 },
//                 992: { slidesPerView: 4, spaceBetween: 20 },
//                 1200: { slidesPerView: 5, spaceBetween: 20 }
//               }}
//             >
//               {section.products?.map((prod) => (
//                 <SwiperSlide key={prod._id} className="h-auto page-title-main-name">
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         ))}




//         {/* 2. Joy Rewards Banner */}
//         {joyBanner && (
//           <div 
//             className="row bg-white shadow-sm rounded-4 overflow-hidden mb-5 align-items-center hover-lift cursor-pointer" 
//             onClick={() => handleLinkNavigation(joyBanner.link)}
//             style={{ border: "1px solid #f1f1f1" }}
//           >
//             <div className="col-md-5 p-0">
//               <img src={joyBanner.image} alt={joyBanner.title} className="img-fluid w-100 h-100" style={{ objectFit: "cover", minHeight: "250px" }} />
//             </div>
//             <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
//               <h2 className="fw-bold mb-3 page-title-main-name" style={{ color: "#d21f3c" }}>{joyBanner.title}</h2>
//               {joyBanner.description && (
//                 <p 
//                   className="text-muted page-title-main-name fs-6 lh-lg mb-4" 
//                   dangerouslySetInnerHTML={{ __html: joyBanner.description }}
//                 />
//               )}
//               {joyBanner.buttonText && (
//                 <button className="btn btn-dark btn-lg rounded-pill px-5 py-2 align-self-start">
//                   {joyBanner.buttonText}
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* 3. Discount Ranges (Offers In Focus) */}
//         {discountRanges?.items?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h4 fw-bold mb-3 page-title-main-name">{discountRanges.title}</h3>
//             <SectionSlider 
//               customBreakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 992: { slidesPerView: 5, spaceBetween: 20 },
//                 1200: { slidesPerView: 6, spaceBetween: 20 }
//               }}
//             >
//               {discountRanges.items.map((range, index) => (
//                 <SwiperSlide key={index}>
//                   <div className="ticket-card p-4 text-center cursor-pointer hover-lift h-100 d-flex flex-column justify-content-center">
//                     <span className="text-muted fw-bold d-block text-uppercase mb-1" style={{ fontSize: "12px", letterSpacing: "1px" }}>{range.label}</span>
//                     <h4 className="fw-bolder m-0 text-dark">{range.subLabel}</h4>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* 4. Can't Miss This (Pricing & Combo Deals) */}
//         {cantMissThis?.items?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h4 fw-bold mb-3 page-title-main-name">{cantMissThis.title}</h3>
//             <SectionSlider 
//               customBreakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 992: { slidesPerView: 5, spaceBetween: 20 }
//               }}
//             >
//               {cantMissThis.items.map((item) => (
//                 <SwiperSlide key={item._id}>
//                   <div className="card bg-dark text-white text-center border-0 shadow-sm cursor-pointer hover-lift h-100 py-4 px-2 rounded-3 d-flex flex-column justify-content-center">
//                     <span className="text-white-50 fw-semibold d-block text-uppercase mb-1" style={{ fontSize: "12px" }}>{item.subLabel}</span>
//                     <h4 className="fw-bold m-0">{item.label}</h4>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* 5. Brand Promotions */}
//         {brandPromotions?.items?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h4 fw-bold mb-3 page-title-main-name">{brandPromotions.title}</h3>
//             <SectionSlider 
//               customBreakpoints={{
//                 320: { slidesPerView: 1.2, spaceBetween: 15 },
//                 576: { slidesPerView: 2, spaceBetween: 15 },
//                 768: { slidesPerView: 3, spaceBetween: 20 },
//                 992: { slidesPerView: 4, spaceBetween: 20 }
//               }}
//             >
//               {brandPromotions.items.map((promo) => (
//                 <SwiperSlide key={promo._id}>
//                   <div className="card border-0 shadow-sm h-100 cursor-pointer hover-lift rounded-3 overflow-hidden" onClick={() => navigate(`/promotion/${promo.slug}`)}>
//                     <img src={promo.image} alt={promo.title} className="card-img-top w-100" style={{ height: "200px", objectFit: "cover" }} />
//                     <div className="card-body bg-white p-3 text-center">
//                       <h6 className="card-title fw-bold text-truncate m-0 mb-1">{promo.title}</h6>
//                       <p className="text-muted small text-truncate m-0">{promo.description}</p>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* 6. Category Promotions */}
//         {categoryPromotions?.items?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h4 fw-bold mb-3 page-title-main-name">{categoryPromotions.title}</h3>
//             <SectionSlider 
//               customBreakpoints={{
//                 320: { slidesPerView: 1.2, spaceBetween: 15 },
//                 576: { slidesPerView: 2, spaceBetween: 15 },
//                 768: { slidesPerView: 3, spaceBetween: 20 },
//                 992: { slidesPerView: 4, spaceBetween: 20 }
//               }}
//             >
//               {categoryPromotions.items.map((promo) => (
//                 <SwiperSlide key={promo._id}>
//                   <div className="card border-0 shadow-sm h-100 cursor-pointer hover-lift rounded-3 overflow-hidden" onClick={() => navigate(`/promotion/${promo.slug}`)}>
//                     <img src={promo.image} alt={promo.title} className="card-img-top w-100" style={{ height: "200px", objectFit: "cover" }} />
//                     <div className="card-body bg-white p-3 text-center">
//                       <h6 className="card-title fw-bold text-truncate m-0 mb-1">{promo.title}</h6>
//                       <p className="text-muted small text-truncate m-0">{promo.description}</p>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}



//       </div>
//       <Footer />
//     </>
//   );
// }


























// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHeart, FaRegHeart, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import Bag from "../assets/Bag.svg";
// import "../css/Offerlanding.css";


// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import Certificate from "./Certificate.jsx";

// const API_BASE = "https://beauty.joyory.com/api/user";
// const CART_API_BASE = `${API_BASE}/cart`;
// const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

// /* ---------- helpers ---------- */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

// const isValidHexColor = (hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const n = hex.trim().toLowerCase();
//     return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(n);
// };

// const getVariantDisplayText = (v) =>
//     (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

// const groupVariantsByType = (variants) => {
//     const g = { color: [], text: [] };
//     (variants || []).forEach((v) => {
//         if (!v) return;
//         v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
//     });
//     return g;
// };

// const getBrandName = (p) => {
//     if (!p?.brand) return "Unknown Brand";
//     if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
//     if (typeof p.brand === "string") return p.brand;
//     return "Unknown Brand";
// };

// // Custom Section Slider Component
// const SectionSlider = ({
//     children,
//     slidesPerView = 4,
//     spaceBetween = 20,
//     breakpoints = {},
// }) => {
//     const swiperRef = useRef(null);

//     const defaultBreakpoints = {
//         320: { slidesPerView: 2, spaceBetween: 10 },
//         576: { slidesPerView: 3, spaceBetween: 15 },
//         768: { slidesPerView: Math.min(slidesPerView, 4), spaceBetween: 20 },
//     };

//     const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

//     return (
//         <div className="position-relative margintop-sss py-2">
//             <button
//                 onClick={() => swiperRef.current?.swiper?.slidePrev()}
//                 className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//                 style={{ width: "40px", height: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "1px solid #dee2e6" }}
//             >
//                 <FaChevronLeft size={16} />
//             </button>

//             <button
//                 onClick={() => swiperRef.current?.swiper?.slideNext()}
//                 className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//                 style={{ width: "40px", height: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "1px solid #dee2e6" }}
//             >
//                 <FaChevronRight size={16} />
//             </button>

//             <Swiper
//                 ref={swiperRef}
//                 slidesPerView={1}
//                 spaceBetween={spaceBetween}
//                 breakpoints={mergedBreakpoints}
//                 navigation={false}
//                 className="section-slider px-1"
//             >
//                 {children}
//             </Swiper>
//         </div>
//     );
// };

// export default function OffersPage() {
//     const navigate = useNavigate();
//     const { user } = useContext(UserContext);

//     // State
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Wishlist state
//     const [wishlistData, setWishlistData] = useState([]);
//     const [wishlistLoading, setWishlistLoading] = useState({});

//     // Cart & variant selection
//     const [selectedVariants, setSelectedVariants] = useState({});
//     const [addingToCart, setAddingToCart] = useState({});
//     const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//     const [selectedVariantType, setSelectedVariantType] = useState("all");

//     /* ---------- Toast ---------- */
//     const showToastMsg = (msg, type = "error", dur = 3000) => {
//         const t = document.createElement("div");
//         t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white shadow`;
//         t.style.cssText = `z-index: 9999; background: ${type === "error" ? "#dc3545" : "#198754"};`;
//         t.textContent = msg;
//         document.body.appendChild(t);
//         setTimeout(() => t.remove(), dur);
//     };

//     /* ========== FETCH OFFERS DATA ========== */
//     useEffect(() => {
//         const fetchOffersData = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await axios.get(`${API_BASE}/promotions/offers-page`);
//                 setData(data);
//             } catch (err) {
//                 console.error("Failed to load offers page:", err);
//                 setError(err.response?.data?.message || "Failed to load offers page");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchOffersData();
//     }, []);

//     /* ========== WISHLIST LOGIC ========== */
//     const isInWishlist = (pid, sku) => wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);

//     const fetchWishlistData = async () => {
//         try {
//             if (user && !user.guest) {
//                 const { data } = await axios.get(WISHLIST_API_BASE, { withCredentials: true });
//                 if (data.success) setWishlistData(data.wishlist || []);
//             } else {
//                 const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//                 setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//             }
//         } catch (e) { console.error(e); }
//     };

//     useEffect(() => { fetchWishlistData(); }, [user]);

//     const toggleWishlist = async (prod, variant) => {
//         if (!prod || !variant) return showToastMsg("Select a variant first", "error");
//         const pid = prod._id;
//         const sku = getSku(variant);
//         setWishlistLoading((p) => ({ ...p, [pid]: true }));
//         try {
//             const inWl = isInWishlist(pid, sku);
//             if (user && !user.guest) {
//                 if (inWl) {
//                     await axios.delete(`${WISHLIST_API_BASE}/${pid}`, { withCredentials: true, data: { sku } });
//                     showToastMsg("Removed from wishlist!", "success");
//                 } else {
//                     await axios.post(`${WISHLIST_API_BASE}/${pid}`, { sku }, { withCredentials: true });
//                     showToastMsg("Added to wishlist!", "success");
//                 }
//                 await fetchWishlistData();
//             } else {
//                 let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//                 if (inWl) {
//                     g = g.filter((it) => !(it._id === pid && it.sku === sku));
//                     showToastMsg("Removed from wishlist!", "success");
//                 } else {
//                     g.push({
//                         _id: pid, name: prod.name, brand: getBrandName(prod),
//                         displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
//                         originalPrice: variant.originalPrice || variant.mrp || prod.price,
//                         image: variant.images?.[0] || prod.images?.[0], sku,
//                         variantName: variant.shadeName || "Default", stock: variant.stock,
//                     });
//                     showToastMsg("Added to wishlist!", "success");
//                 }
//                 localStorage.setItem("guestWishlist", JSON.stringify(g));
//                 await fetchWishlistData();
//             }
//         } catch (e) {
//             showToastMsg(e.response?.data?.message || "Wishlist error", "error");
//         } finally {
//             setWishlistLoading((p) => ({ ...p, [pid]: false }));
//         }
//     };

//     /* ========== CART LOGIC ========== */
//     const handleAddToCart = async (prod) => {
//         setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//         try {
//             const vars = Array.isArray(prod.variants) ? prod.variants : [];
//             const hasVar = vars.length > 0;
//             let payload;

//             if (hasVar) {
//                 const sel = selectedVariants[prod._id];
//                 if (!sel || sel.stock <= 0) {
//                     showToastMsg("Please select an in-stock variant.", "error");
//                     return;
//                 }
//                 payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
//                 const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//                 cache[prod._id] = sel;
//                 localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//             } else {
//                 if (prod.stock <= 0) {
//                     showToastMsg("Product is out of stock.", "error");
//                     return;
//                 }
//                 payload = { productId: prod._id, quantity: 1 };
//             }

//             const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//             if (!data.success) throw new Error(data.message || "Cart add failed");

//             showToastMsg("Product added to cart!", "success");
//             navigate("/cartpage");
//         } catch (e) {
//             showToastMsg(e.response?.data?.message || e.message || "Failed to add to cart", "error");
//             if (e.response?.status === 401) navigate("/login");
//         } finally {
//             setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//         }
//     };

//     const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
//     const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
//     const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
//     const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//     /* ========== LINK NAVIGATION HANDLER ========== */
//     const handleLinkNavigation = (link) => {
//         if (!link) return;
//         try {
//             const currentHost = window.location.host;
//             const linkUrl = new URL(link, window.location.origin);
//             if (linkUrl.host === currentHost) {
//                 navigate(linkUrl.pathname + linkUrl.search + linkUrl.hash);
//             } else {
//                 window.location.href = link;
//             }
//         } catch (e) {
//             navigate(link);
//         }
//     };

//     /* ========== RENDER PRODUCT CARD - SAME AS CATEGORYLANDINGPAGE ========== */
//     const renderProductCard = (prod) => {
//         const vars = Array.isArray(prod.variants) ? prod.variants : [];
//         const hasVar = vars.length > 0;
//         const isVariantSelected = !!selectedVariants[prod._id];
//         const displayVariant = selectedVariants[prod._id] || (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);
//         const grouped = groupVariantsByType(vars);
//         const totalVars = vars.length;
//         const sku = displayVariant ? getSku(displayVariant) : null;
//         const inWl = sku ? isInWishlist(prod._id, sku) : false;
//         const slugPr = getProductSlug(prod);
//         const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
//         const isAdding = addingToCart[prod._id];
//         const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//         const showSelectVariantButton = hasVar && !isVariantSelected;
//         const disabled = isAdding || (!showSelectVariantButton && oos);

//         let btnText = isAdding ? "Adding..." : showSelectVariantButton ? "Select Variant" : oos ? "Out of Stock" : "Add to Cart";

//         return (
//             <div key={prod._id} className="col position-relative">
//                 {/* Wishlist button */}
//                 <button
//                     onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
//                     disabled={wishlistLoading[prod._id]}
//                     className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//                     style={{ width: "36px", height: "36px", color: inWl ? "#dc3545" : "#6c757d", border: "none", boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}
//                 >
//                     {wishlistLoading[prod._id] ? <span className="spinner-border spinner-border-sm" /> : inWl ? <FaHeart /> : <FaRegHeart />}
//                 </button>

//                 <div className="" style={{ height: "auto !important" }}>
//                     <img
//                         src={img}
//                         alt={prod.name}
//                         className="card-img-top"
//                         style={{ height: "auto", objectFit: "contain", cursor: "pointer" }}
//                         onClick={() => navigate(`/product/${slugPr}`)}
//                     />

//                     <div className="card-body d-flex flex-column p-3" style={{ height: "235px" }}>
//                         <div className="text-muted small mb-1 fw-medium text-start text-uppercase">{getBrandName(prod)}</div>
//                         <h5 className="card-title fs-6 fw-bold text-truncate" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)}>
//                             {prod.name}
//                         </h5>

//                         {hasVar && (
//                             <div className="mb-2">
//                                 {isVariantSelected ? (
//                                     <div
//                                         className="text-muted small cursor-pointer d-inline-flex align-items-center"
//                                         onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
//                                         title="Click to change variant"
//                                     >
//                                         Variant: <span className="fw-bold text-dark ms-1" style={{ fontSize: "12px" }}>{getVariantDisplayText(displayVariant)}</span>
//                                         <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                                     </div>
//                                 ) : (
//                                     <div
//                                         className="small text-muted cursor-pointer d-inline-flex align-items-center"
//                                         onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
//                                     >
//                                         {vars.length} Variants Available
//                                         <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                                     </div>
//                                 )}

//                                 <p className="fw-bold mb-3" style={{ fontSize: "16px" }}>
//                                     {(() => {
//                                         const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//                                         const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//                                         const disc = orig > price;
//                                         const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//                                         return disc ? (
//                                             <>
//                                                 ₹{price}
//                                                 <span className="text-decoration-line-through text-muted ms-2" style={{ fontSize: "14px" }}>₹{orig}</span>
//                                                 <span className="text-danger ms-2" style={{ fontSize: "14px" }}>({pct}% OFF)</span>
//                                             </>
//                                         ) : (<>₹{orig}</>);
//                                     })()}
//                                 </p>
//                             </div>
//                         )}

//                         {/* Cart button */}
//                         <div className="mt-auto">
//                             <button
//                                 className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
//                                 onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
//                                 disabled={disabled}
//                             >
//                                 {isAdding ? (
//                                     <><span className="spinner-border spinner-border-sm me-2" role="status" /> Adding...</>
//                                 ) : (
//                                     <>{btnText} {!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: "20px" }} />}</>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Variant Overlay - EXACTLY SAME AS CATEGORYLANDINGPAGE */}
//                 {showVariantOverlay === prod._id && (
//                     <div
//                         className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//                         style={{ zIndex: 1050 }}
//                         onClick={closeVariantOverlay}
//                     >
//                         <div
//                             className="bg-white rounded-3 overflow-hidden d-flex flex-column"
//                             onClick={(e) => e.stopPropagation()}
//                             style={{ width: "90%", maxWidth: "500px", maxHeight: "100%" }}
//                         >
//                             <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                                 <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                                 <button onClick={closeVariantOverlay} className="btn btn-link text-dark text-decoration-none fs-4 p-0">×</button>
//                             </div>

//                             <div className="d-flex border-bottom">
//                                 <button
//                                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "all" ? "active text-white border-bottom border-dark border-2" : "text-muted"}`}
//                                     onClick={() => setSelectedVariantType("all")}
//                                 >
//                                     All ({totalVars})
//                                 </button>
//                                 {grouped.color.length > 0 && (
//                                     <button
//                                         className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "color" ? "active text-white border-bottom border-dark border-2" : "text-muted"}`}
//                                         onClick={() => setSelectedVariantType("color")}
//                                     >
//                                         Colors ({grouped.color.length})
//                                     </button>
//                                 )}
//                                 {grouped.text.length > 0 && (
//                                     <button
//                                         className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "text" ? "active text-white border-bottom border-dark border-2" : "text-muted"}`}
//                                         onClick={() => setSelectedVariantType("text")}
//                                     >
//                                         Sizes ({grouped.text.length})
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="p-3 overflow-auto flex-grow-1">
//                                 {/* color variants */}
//                                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                                     <div className="row row-cols-4 g-3 mb-4">
//                                         {grouped.color.map((v) => {
//                                             const sel = selectedVariants[prod._id]?.sku === v.sku;
//                                             const oosV = v.stock <= 0;
//                                             return (
//                                                 <div className="col" key={v.sku || v._id}>
//                                                     <div
//                                                         className="text-center cursor-pointer"
//                                                         style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                                         onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}
//                                                     >
//                                                         <div
//                                                             className="position-relative mx-auto mb-2"
//                                                             style={{
//                                                                 width: "28px",
//                                                                 height: "28px",
//                                                                 borderRadius: "20%",
//                                                                 backgroundColor: v.hex || "#ccc",
//                                                                 border: sel ? "3px solid #000" : "1px solid #ddd",
//                                                                 opacity: oosV ? 0.5 : 1,
//                                                             }}
//                                                         >
//                                                             {sel && <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">✓</span>}
//                                                         </div>
//                                                         <div className="small fw-medium">{getVariantDisplayText(v)}</div>
//                                                         {oosV && <div className="text-danger small">Out of Stock</div>}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}

//                                 {/* text variants (sizes) */}
//                                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                                     <div className="row row-cols-3 g-3">
//                                         {grouped.text.map((v) => {
//                                             const sel = selectedVariants[prod._id]?.sku === v.sku;
//                                             const oosV = v.stock <= 0;
//                                             return (
//                                                 <div className="col" key={v.sku || v._id}>
//                                                     <div
//                                                         className="text-center cursor-pointer"
//                                                         style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                                         onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}
//                                                     >
//                                                         <div
//                                                             className="d-flex align-items-center justify-content-center fw-medium"
//                                                             style={{
//                                                                 padding: "10px",
//                                                                 borderRadius: "8px",
//                                                                 border: sel ? "3px solid #000" : "1px solid #ddd",
//                                                                 background: sel ? "#f8f9fa" : "#fff",
//                                                                 minHeight: "50px",
//                                                                 opacity: oosV ? 0.5 : 1,
//                                                             }}
//                                                         >
//                                                             {getVariantDisplayText(v)}
//                                                         </div>
//                                                         {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     if (loading) return (<><Header /><div className="d-flex flex-column align-items-center justify-content-center min-vh-100"><div className="spinner-border text-dark mb-3" /><p className="text-dark fw-medium">Loading offers...</p></div><Footer /></>);
//     if (error || !data) return (<><Header /><div className="container text-center py-5"><h3 className="text-danger">Error</h3><p className="text-muted">{error || "Failed to load"}</p></div><Footer /></>);

//     const { banner, joyBanner, brandPromotions, categoryPromotions, cantMissThis, discountRanges, offerProducts } = data;

//     return (
//         <>
//             <Header />
//             <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .hover-lift { transition: transform 0.3s ease; }
//         .hover-lift:hover { transform: translateY(-5px); }
//         .ticket-card {background: #E6EEF2; }
//         .ticket-card:hover {background: #E6EEF2; }
//       `}</style>

//             {/* 1. Main Top Banner */}
//             {banner && (
//                 <div className={`w-100 mt-lg-5 pt-lg-3 ${banner.link ? 'cursor-pointer' : ''}`} onClick={() => handleLinkNavigation(banner.link)}>
//                     {banner.image && <img src={banner.image} alt={banner.title} className="w-100 img-fluid" style={{ objectFit: 'cover' }} />}
//                 </div>
//             )}

//             <div className="container-fluid p-md-5 p-3 py-4 bg-light">



//                 {/* 2. Manual Products Mapping (Offer Products) - WITH SAME DESIGN AS CATEGORYLANDINGPAGE */}
//                 {offerProducts?.length > 0 && offerProducts.map((section) => (
//                     <section key={section._id} className="mb-5 pb-5">
//                         <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">{section.title}</h3>
//                         <SectionSlider slidesPerView={4} spaceBetween={20} breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 10 }, 576: { slidesPerView: 2.5, spaceBetween: 15 }, 768: { slidesPerView: 3, spaceBetween: 20 }, 992: { slidesPerView: 4, spaceBetween: 20 }, 1200: { slidesPerView: 4, spaceBetween: 20 } }}>
//                             {section.products?.map((prod) => (
//                                 <SwiperSlide key={prod._id} className="h-auto page-title-main-name">
//                                     {renderProductCard(prod)}
//                                 </SwiperSlide>
//                             ))}
//                         </SectionSlider>
//                     </section>
//                 ))}







//                 {/* 3. Brand Promotions */}
//                 {brandPromotions?.items?.length > 0 && (
//                     <section className="mb-5 page-title-main-name">
//                         <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">{brandPromotions.title}</h3>
//                         <SectionSlider slidesPerView={4} spaceBetween={20} breakpoints={{ 320: { slidesPerView: 1.2, spaceBetween: 15 }, 576: { slidesPerView: 2, spaceBetween: 15 }, 768: { slidesPerView: 3, spaceBetween: 20 }, 992: { slidesPerView: 3, spaceBetween: 20 } }}>
//                             {brandPromotions.items.map((promo) => (
//                                 <SwiperSlide key={promo._id}>
//                                     <div className="h-100 cursor-pointer hover-lift rounded-3 overflow-hidden" onClick={() => navigate(`/promotion/${promo.slug}`)}>
//                                         <img src={promo.image} alt={promo.title} className="card-img-top w-100" style={{ height: "auto", objectFit: "cover" }} />
//                                         <div className="pt-3 text-center">
//                                             <h6 className="card-title text-start text-truncate m-0 mb-1">{promo.title}</h6>
//                                         </div>
//                                     </div>
//                                 </SwiperSlide>
//                             ))}
//                         </SectionSlider>
//                     </section>
//                 )}






//                  {/* 4. Discount Ranges (Offers In Focus) */}
//                 {discountRanges?.items?.length > 0 && (
//                     <section className="mb-5 pb-5" style={{height:'auto'}}>
//                         <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">{discountRanges.title}</h3>
//                         <SectionSlider slidesPerView={6} spaceBetween={15} breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 10 }, 576: { slidesPerView: 2, spaceBetween: 15 }, 768: { slidesPerView: 3, spaceBetween: 20 }, 992: { slidesPerView: 3, spaceBetween: 20 }, 1200: { slidesPerView: 3, spaceBetween: 20 } }}>
//                             {discountRanges.items.map((range, index) => (
//                                 <SwiperSlide key={index}>
//                                     <div className="mt-4 ticket-card p-4 text-center cursor-pointer hover-lift d-flex flex-row justify-content-center gap-2 page-title-main-name align-items-center" style={{height:'120px'}}>
//                                         <span className="text-black d-block text-uppercase " style={{ fontWeight:'500' , fontSize:'20px' ,letterSpacing: "1px" }}>{range.label}</span>
//                                         <h4 className="m-0 text-black" style={{fontSize:'20px' , fontWeight:'500'}}>{range.subLabel}</h4>
//                                     </div>
//                                 </SwiperSlide>
//                             ))}
//                         </SectionSlider>
//                     </section>
//                 )}







//                   {/* 5. Category Promotions */}
//                 {categoryPromotions?.items?.length > 0 && (
//                     <section className="mb-5 mt-5">
//                         <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">{categoryPromotions.title}</h3>
//                         <SectionSlider slidesPerView={4} spaceBetween={20} breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 15 }, 576: { slidesPerView: 2, spaceBetween: 15 }, 768: { slidesPerView: 3, spaceBetween: 20 }, 992: { slidesPerView: 3, spaceBetween: 20 } }}>
//                             {categoryPromotions.items.map((promo) => (
//                                 <SwiperSlide key={promo._id}>
//                                     <div className="h-100 cursor-pointer hover-lift rounded-3 overflow-hidden page-title-main-name mt-3 mb-3" onClick={() => navigate(`/promotion/${promo.slug}`)}>
//                                         <img src={promo.image} alt={promo.title} className="card-img-top w-100" style={{ height: "200px", objectFit: "cover" }} />
//                                         <div className="pt-3">
//                                             <p className="text-start small fs-5 text-truncate m-0">{promo.description}</p>
//                                         </div>
//                                     </div>
//                                 </SwiperSlide>
//                             ))}
//                         </SectionSlider>
//                     </section>
//                 )}


//                 {/* 6. Joy Rewards Banner */}
//                 {joyBanner && (
//                     <div className="page-title-main-name row overflow-hidden mb-5 align-items-center hover-lift cursor-pointer" onClick={() => handleLinkNavigation(joyBanner.link)} style={{ border: "1px solid #f1f1f1" }}>
//                         <div className="col-md-5 p-0">
//                             <img src={joyBanner.image} alt={joyBanner.title} className="img-fluid w-100 h-100" style={{ objectFit: "cover", minHeight: "250px" }} />
//                         </div>
//                         <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
//                             <h2 className="fw-bold mb-3 page-title-main-name text-black">{joyBanner.title}</h2>
//                             {joyBanner.description && <p className="text-muted page-title-main-name fs-6" style={{lineHeight:'16px'}} dangerouslySetInnerHTML={{ __html: joyBanner.description }} />}
//                             {joyBanner.buttonText && <button className="btn btn-dark btn-lg px-5 py-2 align-self-start start-shopping-btnsa">{joyBanner.buttonText}</button>}
//                         </div>
//                     </div>
//                 )}



//                 {/* 7. Can't Miss This (Pricing & Combo Deals) */}
//                 {cantMissThis?.items?.length > 0 && (
//                     <section className="mb-5">
//                         <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">{cantMissThis.title}</h3>
//                         <SectionSlider slidesPerView={5} spaceBetween={15} breakpoints={{ 320: { slidesPerView: 2, spaceBetween: 10 }, 576: { slidesPerView: 3, spaceBetween: 15 }, 768: { slidesPerView: 3, spaceBetween: 20 }, 992: { slidesPerView: 3, spaceBetween: 20 } }}>
//                             {cantMissThis.items.map((item) => (
//                                 <SwiperSlide key={item._id}>
//                                     <div className="ticket-card text-white text-center border-0 shadow-sm cursor-pointer hover-lift py-4 px-2 rounded-3 d-flex flex-row justify-content-center align-items-center gap-2 page-title-main-name" style={{height:'140px'}}>
//                                         <span className="text-black d-block" style={{ fontSize: "20px" }}>{item.subLabel}</span>
//                                         <h4 className="m-0 text-black" style={{fontSize:'20px'}}>{item.label}</h4>
//                                     </div>
//                                 </SwiperSlide>
//                             ))}
//                         </SectionSlider>
//                     </section>
//                 )}



//                 <Certificate />



//             </div>
//             <Footer />
//         </>
//     );
// }















import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaHeart,
    FaRegHeart,
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaCheck,
} from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { CartContext } from "../Context/CartContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { UserContext } from "./UserContext.jsx";
import Bag from "../assets/Bag.svg";
import "../css/Offerlanding.css";
import "../css/BestSellers.css";
import { ToastContainer, toast } from "react-toastify";

// Import Swiper and its styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Certificate from "./Certificate.jsx";

const API_BASE = "https://beauty.joyory.com/api/user";
const CART_API_BASE = `${API_BASE}/cart`;
const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

/* ---------- helpers ---------- */
const formatPrice = (price) => "₹" + parseFloat(price || 0).toLocaleString("en-IN");
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
    if (!hex || typeof hex !== "string") return false;
    const n = hex.trim().toLowerCase();
    return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(n);
};

const getVariantDisplayText = (v) =>
    (v.shadeName || v.name || v.size || v.ml || v.weight || "Default").toUpperCase();

const groupVariantsByType = (variants) => {
    const g = { color: [], text: [] };
    (variants || []).forEach((v) => {
        if (!v) return;
        v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
    });
    return g;
};

const getBrandName = (p) => {
    if (!p?.brand) return "Unknown Brand";
    if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
    if (typeof p.brand === "string") return p.brand;
    return "Unknown Brand";
};

// Custom Section Slider Component
const SectionSlider = ({
    children,
    slidesPerView = 4,
    spaceBetween = 20,
    breakpoints = {},
}) => {
    const swiperRef = useRef(null);

    const defaultBreakpoints = {
        320: { slidesPerView: 2, spaceBetween: 10 },
        576: { slidesPerView: 3, spaceBetween: 15 },
        768: { slidesPerView: Math.min(slidesPerView, 4), spaceBetween: 20 },
    };

    const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

    return (
        <div className="position-relative margintop-sss py-2">
            <button
                onClick={() => swiperRef.current?.swiper?.slidePrev()}
                className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
                style={{
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #dee2e6",
                }}
            >
                <FaChevronLeft size={16} />
            </button>

            <button
                onClick={() => swiperRef.current?.swiper?.slideNext()}
                className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
                style={{
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #dee2e6",
                }}
            >
                <FaChevronRight size={16} />
            </button>

            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={spaceBetween}
                breakpoints={mergedBreakpoints}
                navigation={false}
                className="section-slider px-1"
            >
                {children}
            </Swiper>
        </div>
    );
};

// ===================== OUT OF STOCK POPUP COMPONENT =====================
const OutOfStockPopup = ({ isOpen, onClose, productName }) => {
    if (!isOpen) return null;

    return (
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
            onClick={onClose}
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
                    onClick={onClose}
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
                    "Oops! {productName} is out of stock right now. Check back soon or discover similar items."
                </p>

                <button
                    onClick={onClose}
                    className="btn btn-dark w-100"
                    style={{
                        borderRadius: '8px',
                        padding: '10px',
                    }}
                >
                    Got it
                </button>
            </div>
            <style>{`
        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default function OffersPage() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // State
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Wishlist state
    const [wishlistData, setWishlistData] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState({});

    // Cart & variant selection
    const [selectedVariants, setSelectedVariants] = useState({});
    const [tempSelectedVariants, setTempSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("all");
    const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
    const [outOfStockProductName, setOutOfStockProductName] = useState("");

    const handleOutOfStockClick = (productName) => {
        setOutOfStockProductName(productName || "This product");
        setShowOutOfStockPopup(true);
        setTimeout(() => {
            setShowOutOfStockPopup(false);
        }, 3000);
    };

    const closeOutOfStockPopup = () => {
        setShowOutOfStockPopup(false);
    };

    const isCompletelyOutOfStock = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        if (vars.length === 0) {
            return (prod.stock || 0) <= 0;
        }
        return vars.every(v => (v.stock || 0) <= 0);
    };

    /* ---------- Toast ---------- */
      const showToastMsg = (message, type = "error", duration = 3000) => {
                  if (type === "success") {
                      toast.success(message, { autoClose: duration });
                  } else if (type === "error") {
                      toast.error(message, { autoClose: duration });
                  } else {
                      toast.info(message, { autoClose: duration });
                  }
              };
    

    /* ========== FETCH OFFERS DATA ========== */
    useEffect(() => {
        const fetchOffersData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_BASE}/promotions/offers-page`);
                setData(data);
            } catch (err) {
                console.error("Failed to load offers page:", err);
                setError(err.response?.data?.message || "Failed to load offers page");
            } finally {
                setLoading(false);
            }
        };
        fetchOffersData();
    }, []);

    /* ========== WISHLIST LOGIC ========== */
    const isInWishlist = (pid, sku) =>
        wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);

    const fetchWishlistData = async () => {
        try {
            if (user && !user.guest) {
                const { data } = await axios.get(WISHLIST_API_BASE, { withCredentials: true });
                if (data.success) setWishlistData(data.wishlist || []);
            } else {
                const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
                setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchWishlistData();
    }, [user]);

    const toggleWishlist = async (prod, variant) => {
        if (!user || user.guest) {
            showToastMsg("Please login to use wishlist", "error");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        if (!prod || !variant) return showToastMsg("Select a variant first", "error");
        const pid = prod._id;
        const sku = getSku(variant);
        setWishlistLoading((p) => ({ ...p, [pid]: true }));
        try {
            const inWl = isInWishlist(pid, sku);
            if (user && !user.guest) {
                if (inWl) {
                    await axios.delete(`${WISHLIST_API_BASE}/${pid}`, { withCredentials: true, data: { sku } });
                    showToastMsg("Removed from wishlist!", "success");
                } else {
                    await axios.post(`${WISHLIST_API_BASE}/${pid}`, { sku }, { withCredentials: true });
                    showToastMsg("Added to wishlist!", "success");
                }
                await fetchWishlistData();
            } else {
                let g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
                if (inWl) {
                    g = g.filter((it) => !(it._id === pid && it.sku === sku));
                    showToastMsg("Removed from wishlist!", "success");
                } else {
                    g.push({
                        _id: pid,
                        name: prod.name,
                        brand: getBrandName(prod),
                        displayPrice: variant.displayPrice || variant.discountedPrice || prod.price,
                        originalPrice: variant.originalPrice || variant.mrp || prod.price,
                        image: variant.images?.[0] || prod.images?.[0],
                        sku,
                        variantName: variant.shadeName || "Default",
                        stock: variant.stock,
                    });
                    showToastMsg("Added to wishlist!", "success");
                }
                localStorage.setItem("guestWishlist", JSON.stringify(g));
                await fetchWishlistData();
            }
        } catch (e) {
            showToastMsg(e.response?.data?.message || "Wishlist error", "error");
        } finally {
            setWishlistLoading((p) => ({ ...p, [pid]: false }));
        }
    };

    /* ========== CART LOGIC ========== */
    const handleAddToCart = async (prod, forceVariant = null) => {
        setAddingToCart((p) => ({ ...p, [prod._id]: true }));
        try {
            const vars = Array.isArray(prod.variants) ? prod.variants : [];
            const hasVar = vars.length > 0;
            let payload;

            if (hasVar) {
                const sel = forceVariant || selectedVariants[prod._id] || (vars.find((v) => v.stock > 0) || vars[0]);
                if (!sel || sel.stock <= 0) {
                    showToastMsg("Please select an in-stock variant.", "error");
                    return;
                }
                payload = {
                    productId: prod._id,
                    variants: [{ variantSku: getSku(sel), quantity: 1 }],
                };
                const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
                cache[prod._id] = sel;
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            } else {
                if (prod.stock <= 0) {
                    showToastMsg("Product is out of stock.", "error");
                    return;
                }
                payload = { productId: prod._id, quantity: 1 };
            }

            const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
            if (!data.success) throw new Error(data.message || "Cart add failed");

            showToastMsg("Product added to cart!", "success");
            navigate("/cartpage");
        } catch (e) {
            showToastMsg(e.response?.data?.message || e.message || "Failed to add to cart", "error");
            if (e.response?.status === 401) navigate("/login");
        } finally {
            setAddingToCart((p) => ({ ...p, [prod._id]: false }));
        }
    };

    const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
    const openVariantOverlay = (pid, t = "all") => {
        setSelectedVariantType(t);
        setShowVariantOverlay(pid);
    };
    const closeVariantOverlay = () => {
        setShowVariantOverlay(null);
        setSelectedVariantType("all");
        setTempSelectedVariants({});
    };
    const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

    /* ========== LINK NAVIGATION HANDLER ========== */
    const handleLinkNavigation = (link) => {
        if (!link) return;
        try {
            const currentHost = window.location.host;
            const linkUrl = new URL(link, window.location.origin);
            if (linkUrl.host === currentHost) {
                navigate(linkUrl.pathname + linkUrl.search + linkUrl.hash);
            } else {
                window.location.href = link;
            }
        } catch (e) {
            navigate(link);
        }
    };

    /* ========== RENDER PRODUCT CARD - SAME AS CATEGORYLANDINGPAGE ========== */
    const renderProductCard = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        const hasVar = vars.length > 0;
        const displayVariant =
            tempSelectedVariants[prod._id] ||
            selectedVariants[prod._id] ||
            (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);
        const imageUrl = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";

        const hasVariants = vars.length > 0;
        const sku = displayVariant ? getSku(displayVariant) : null;
        const isProductInWishlist = sku ? isInWishlist(prod._id, sku) : false;

        const groupedVariants = groupVariantsByType(vars);
        const totalVariants = vars.length;
        const isVariantSelected = !!selectedVariants[prod._id];
        const isCompletelyOos = isCompletelyOutOfStock(prod);
        const isCurrentVariantOutOfStock = displayVariant ? displayVariant.stock <= 0 : prod.stock <= 0;

        const isAdding = addingToCart[prod._id];
        const showOutOfStock = isCompletelyOos && !hasVar;
        const showSelectVariantButton = hasVar && vars.length > 1;
        const buttonDisabled = isAdding || showOutOfStock;

        let buttonText = "Add to Bag";
        if (isAdding) {
            buttonText = "Adding...";
        } else if (showOutOfStock) {
            buttonText = "Out of Stock";
        } else if (showSelectVariantButton) {
            buttonText = "Select Variant";
        } else if (isCurrentVariantOutOfStock) {
            buttonText = "Out of Stock";
        }
        
        const slugPr = getProductSlug(prod);

        return (
            <div key={prod._id} className="foryou-card-wrapper">
                <div className="foryou-card">
                    {/* Product Image with Overlays */}
                    <div
                        className="foryou-img-wrapper"
                        onClick={() => {
                            if (showOutOfStock) {
                                handleOutOfStockClick(prod.name);
                            } else {
                                navigate(`/product/${slugPr}`);
                            }
                        }}
                        style={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <img
                            src={imageUrl}
                            alt={prod.name || "Product"}
                            className="foryou-img img-fluid"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
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
                                    if (displayVariant || !hasVar) {
                                        toggleWishlist(prod, displayVariant || {});
                                    }
                                }}
                                disabled={wishlistLoading[prod._id]}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
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
                                {wishlistLoading[prod._id] ? (
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                ) : isProductInWishlist ? (
                                    <FaHeart />
                                ) : (
                                    <FaRegHeart />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
                        <div className="justify-content-between d-flex flex-column"
                            style={{ height: '200px' }}>

                            {/* Brand Name */}
                            <div className="brand-name small text-muted text-start mb-1 mt-2">
                                {getBrandName(prod)}
                            </div>

                            {/* Product Name */}
                            <h6
                                className="foryou-name font-family-Poppins m-0 p-0"
                                onClick={() => {
                                    if (showOutOfStock) {
                                        handleOutOfStockClick(prod.name);
                                    } else {
                                        navigate(`/product/${slugPr}`);
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    opacity: showOutOfStock ? 0.6 : 1,
                                }}
                            >
                                {(() => {
                                    const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                                    const nameStr = prod.name || "Unnamed Product";
                                    return varText && varText.toUpperCase() !== "DEFAULT" ? `${nameStr} - ${varText}` : nameStr;
                                })()}
                            </h6>

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
                                        {formatPrice(displayVariant ? displayVariant.displayPrice || displayVariant.discountedPrice || prod.price : prod.price)}
                                    </span>

                                    {displayVariant && displayVariant.originalPrice > (displayVariant.displayPrice || displayVariant.discountedPrice) && !showOutOfStock && (
                                        <>
                                            <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                                {formatPrice(displayVariant.originalPrice)}
                                            </span>
                                            <span className="discount-percent text-danger fw-bold ms-2">
                                                ({displayVariant.discountPercent || Math.round(((displayVariant.originalPrice - (displayVariant.displayPrice || displayVariant.discountedPrice)) / displayVariant.originalPrice) * 100)}% OFF)
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Add to Cart / Select Variant / Out of Stock Button */}
                            <div className="cart-section">
                                <div className="d-flex align-items-center justify-content-between">
                                    <button
                                        className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2  ${showOutOfStock
                                            ? "btn-secondary"
                                            : isAdding
                                                ? ""
                                                : "btn-outline-dark"
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (showOutOfStock) {
                                                handleOutOfStockClick(prod.name);
                                            } else if (showSelectVariantButton) {
                                                openVariantOverlay(prod._id, "all");
                                            } else {
                                                handleAddToCart(prod);
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
                                                    <img src={Bag} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
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
                {showVariantOverlay === prod._id && !showOutOfStock && (
                    <div className="variant-overlay" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}>
                        <div
                            className="variant-overlay-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h5 className="m-0 page-title-main-name">Select Variant</h5>
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

                            {/* Content */}
                            <div className="variant-overlay-body">
                                {groupedVariants.color.length > 0 && (
                                    <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                                        {groupedVariants.color.map((v) => {
                                            const isSelected = displayVariant?.sku === v.sku;
                                            const isOutOfStock = (v.stock ?? 0) <= 0;

                                            return (
                                                <div
                                                    key={getSku(v) || v._id}
                                                    style={{ cursor: isOutOfStock ? "not-allowed" : "pointer", position: "relative" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isOutOfStock) {
                                                            handleVariantSelect(prod._id, v);
                                                            setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
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
                                                            border: isSelected ? "3px solid #000" : "1px solid #ddd",
                                                            opacity: isOutOfStock ? 0.4 : 1,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isOutOfStock && (
                                                        <span style={{
                                                            position: "absolute", top: 0, left: 8, right: 0, bottom: 0,
                                                            display: "flex", alignItems: "center", justifycontent: "center",
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
                                            const isSelected = displayVariant?.sku === v.sku;
                                            const isOutOfStock = (v.stock ?? 0) <= 0;

                                            return (
                                                <div
                                                    key={getSku(v) || v._id}
                                                    className="variant-text-item"
                                                    style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isOutOfStock) {
                                                            handleVariantSelect(prod._id, v);
                                                            setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
                                                        }
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "8px 16px",
                                                            borderRadius: "8px",
                                                            border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                                            background: isSelected ? "#f8f9fa" : "#fff",
                                                            opacity: isOutOfStock ? 0.4 : 1,
                                                            textDecoration: isOutOfStock ? "line-through" : "none"
                                                        }}
                                                    >
                                                        {getVariantDisplayText(v)}
                                                        {isOutOfStock && <span className="text-danger small ms-1">(OOS)</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="variant-overlay-footer">
                                <div className="small text-muted fw-semibold ">
                                    Selected: <span className="text-dark fw-bold ">{displayVariant ? getVariantDisplayText(displayVariant) : "None"}</span>
                                </div>
                                <div className="mt-1 mb-2 text-start">
                                    <span
                                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${slugPr}`); }}
                                        className="text-decoration-none fw-semibold"
                                        style={{ cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        View Details
                                    </span>
                                </div>
                                <button
                                    className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        const chosen = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (vars.find((v) => v.stock > 0) || vars[0]);
                                        if (chosen) {
                                            handleVariantSelect(prod._id, chosen);
                                        }
                                        await handleAddToCart(prod, chosen);
                                        closeVariantOverlay();
                                    }}
                                    disabled={isAdding || (displayVariant && displayVariant.stock <= 0)}
                                    style={{
                                        transition: "background-color 0.3s ease, color 0.3s ease",
                                    }}
                                >
                                    {isAdding ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Adding...
                                        </>
                                    ) : (displayVariant && displayVariant.stock <= 0) ? (
                                        "Out of Stock"
                                    ) : (
                                        <>
                                            Add to Bag
                                            {!isAdding && displayVariant && displayVariant.stock > 0 && (
                                                <img src={Bag} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // if (loading)
    //     return (
    //         <>
    //             <Header />
    //             <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
    //                 <div className="spinner-border text-dark mb-3" role="status" />
    //                 <p className="text-dark fw-medium">Loading offers...</p>
    //             </div>
    //             <Footer />
    //         </>
    //     );



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
                    <DotLottieReact className="foryoulanding-css"
                        src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                        loop
                        autoplay
                    />


                    <p className="text-muted mb-0">
                        Please wait while we prepare the best products for you...
                    </p>
                </div>
            </div>
        );

    if (error || !data)
        return (
            <>
                <Header />
                <div className="container text-center py-5">
                    <h3 className="text-danger">Error</h3>
                    <p className="text-muted">{error || "Failed to load"}</p>
                </div>
                <Footer />
            </>
        );

    const { banner, joyBanner, brandPromotions, categoryPromotions, cantMissThis, discountRanges, offerProducts } = data;

    return (
        <>
            <Header />
            <style>{`
        .cursor-pointer { cursor: pointer; }
        .hover-lift { transition: transform 0.3s ease; }
        .ticket-card { background: #E6EEF2; }
        .ticket-card:hover { background: #E6EEF2; }
      `}</style>

            {/* 1. Main Top Banner - Now a slider with multiple images */}
            {banner?.image?.length > 0 && (
                <section className="hero-slider w-100 mt-lg-0 pt-lg-4 pt-0">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        loop
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        // pagination={{ clickable: true }}
                        pagination={{
                            clickable: true,
                            bulletClass: 'custom-swiper-bullet',
                            bulletActiveClass: 'custom-swiper-bullet-active',
                        }}
                        navigation
                        speed={800}
                        className="mt-lg-5 mt-2"
                        style={{ height: "auto", width: "100%" }}
                    >
                        {banner.image.map((bannerItem, index) => (
                            <SwiperSlide key={bannerItem._id || index} className="mt-5">
                                <div
                                    className="position-relative w-100 h-100 cursor-pointer offerces-banner-sections"
                                    style={{ cursor: bannerItem.link ? "pointer" : "default" }}
                                    onClick={() => handleLinkNavigation(bannerItem.link)}
                                >
                                    <img
                                        src={bannerItem.url}
                                        alt={banner.title || "banner"}
                                        className="w-100 img-fluid"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            )}

            <div className="container-fluid ps-md-5 pt-0 mt-0 bg-white">
                {/* 2. Manual Products Mapping (Offer Products) - WITH SAME DESIGN AS CATEGORYLANDINGPAGE */}
                {offerProducts?.length > 0 &&
                    offerProducts.map((section) => (
                        <section key={section._id} className="pt-2 pb-lg-3 mb-3">
                            <h3 className="top-categories-title mb-lg-2 mb-3 p-0 ms-md-0  page-title-main-name fw-normal mt-4">
                                {section.title}
                            </h3>
                            <SectionSlider
                                slidesPerView={4}
                                spaceBetween={20}
                                breakpoints={{
                                    320: { slidesPerView: 2, spaceBetween: 10 },
                                    576: { slidesPerView: 2.5, spaceBetween: 15 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    992: { slidesPerView: 4, spaceBetween: 20 },
                                    1200: { slidesPerView: 4, spaceBetween: 20 },
                                }}
                            >
                                {section.products?.map((prod) => (
                                    <SwiperSlide key={prod._id} className="h-auto page-title-main-name">
                                        {renderProductCard(prod)}
                                    </SwiperSlide>
                                ))}
                            </SectionSlider>
                        </section>
                    ))}

                {/* 3. Brand Promotions */}
                {brandPromotions?.items?.length > 0 && (
                    <section className="page-title-main-name">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            {brandPromotions.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 15 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {brandPromotions.items.map((promo) => (
                                <SwiperSlide key={promo._id}>
                                    <div
                                        className="h-100 cursor-pointer hover-lift rounded-3 overflow-hidden"
                                        onClick={() => navigate(`/brand/${promo.targetSlug}`)}
                                    >
                                        <img
                                            src={promo.image}
                                            alt={promo.title}
                                            className="card-img-top w-100 mt-lg-3 mt-2"
                                            style={{ height: "auto", objectFit: "cover" }}
                                        />
                                        <div className="pt-3 text-center">
                                            <h6 className="card-title text-start text-truncate m-0 mb-1">
                                                {promo.title}
                                            </h6>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 4. Discount Ranges (Offers In Focus) */}

                {discountRanges?.items?.length > 0 && (
                    <section className="mb-lg-5 mb-4" style={{ height: "auto" }}>
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-4 mt-3">
                            {discountRanges.title}
                        </h3>

                        <SectionSlider
                            slidesPerView={3}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 2.5, spaceBetween: 12 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                992: { slidesPerView: 3, spaceBetween: 18 },
                                1200: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {discountRanges.items.map((range, index) => (
                                <SwiperSlide key={index}>
                                    <div
                                        className="mt-lg-3 mt-1 ticket-card p-4 text-center cursor-pointer hover-lift d-lg-flex flex-row justify-content-center gap-2 page-title-main-name align-items-center"
                                        style={{
                                            height: "120px",
                                            borderRadius: "0"
                                        }}

                                        onClick={() => {
                                            // Extract discount percentage from subLabel (e.g., "25% Off" -> 25)
                                            const discountPercent = parseInt(range.subLabel);
                                            if (!isNaN(discountPercent)) {
                                                // Navigate to ProductPage with discountMin parameter
                                                navigate(`/products/category/?discountMin=${discountPercent}`);
                                            } else {
                                                // Fallback navigation
                                                navigate('/products');
                                            }
                                        }}
                                    >
                                        <span
                                            className="text-black pt-lg-0 pt-3 d-block text-uppercase offer-font-weight-500"
                                            style={{ fontSize: "16px", letterSpacing: "1px" }}
                                        >
                                            {range.label}
                                        </span>
                                        <h4 className="m-0 text-black offer-font-weight-500" style={{ fontSize: "16px" }}>
                                            {range.subLabel}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 5. Category Promotions */}
                {categoryPromotions?.items?.length > 0 && (
                    <section className="mb-4 mt-lg-5">
                        <h3 className="top-categories-title mb-0 ms-lg-1 ms-1 ms-md-0 page-title-main-name fw-normal">
                            {categoryPromotions.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={4}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 15 },
                                576: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {categoryPromotions.items.map((promo) => (
                                <SwiperSlide key={promo._id}>
                                    <div
                                        className="h-100 cursor-pointer hover-lift overflow-hidden page-title-main-name mt-3 mb-3"
                                        // onClick={() => navigate(`products/category/${promo.slug}`)}
                                        onClick={() => navigate(`/Products/category/${promo.targetSlug}`)}
                                    >
                                        <img
                                            src={promo.image}
                                            alt={promo.title}
                                            className="card-img-top w-100"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <div className="pt-3">
                                            <p className="text-start mobile-responsive-design-text text-truncate m-0">{promo.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                {/* 6. Joy Rewards Banner */}
                {joyBanner && (
                    <div
                        className="page-title-main-name row overflow-hidden mb-lg-5 mb-3 ms-lg-0 align-items-center hover-lift cursor-pointer"
                        onClick={() => handleLinkNavigation(joyBanner.link)}
                    >
                        <div className="col-md-5 p-0">
                            <img
                                src={joyBanner.image?.[0]?.url || joyBanner.image}
                                alt={joyBanner.title}
                                className="img-fluid w-100 h-100 px-lg-0 px-3"
                                style={{ objectFit: "cover", minHeight: "250px" }}
                            />
                        </div>
                        <div className="col-md-7 p-2 mt-3 p-md-5 d-flex flex-column justify-content-center">
                            <h2 className="fw-bold mb-3 reword-heading-responsive page-title-main-name text-black">{joyBanner.title}</h2>
                            {joyBanner.description && (
                                <p
                                    className="page-title-main-name fs-6 offers-line-height"
                                    dangerouslySetInnerHTML={{ __html: joyBanner.description }}
                                />
                            )}
                            {joyBanner.buttonText && (
                                // <button className="btn btn-dark btn-lg px-5 py-2 align-self-start start-shopping-btnsa">
                                //   {joyBanner.buttonText}
                                // </button>

                                <button
                                    className="btn btn-dark btn-lg mt-lg-3 px-5 py-2 align-self-start start-shopping-btnsa"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent double trigger from parent
                                        const link = joyBanner.image?.[0]?.link || joyBanner.link;
                                        if (link) handleLinkNavigation(link);
                                    }}
                                >
                                    {joyBanner.buttonText}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 7. Can't Miss This (Pricing & Combo Deals) */}
                {/* {cantMissThis?.items?.length > 0 && (
                    <section className="mb-5">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                            {cantMissThis.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={5}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {cantMissThis.items.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <div
                                        className="offersss ticket-card text-white text-center border-0 shadow-sm cursor-pointer hover-lift py-4 px-2 rounded-3 d-lg-flex flex-lg-row justify-content-center align-items-center gap-2 page-title-main-name"
                                        style={{ height: "140px" }}
                                    >
                                        <span className="text-black d-block pt-lg-0 pt-3  offersssfonts offer-font-weight-500">
                                            {item.subLabel}
                                        </span>
                                        <h4 className="m-0 text-black offersssfonts offer-font-weight-500">
                                            {item.label}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )} */}


                {cantMissThis?.items?.length > 0 && (
                    <section className="mb-5">
                        <h3 className="top-categories-title mb-0 p-1 ms-md-0 mb-lg-3 mb-2 page-title-main-name fw-normal">
                            {cantMissThis.title}
                        </h3>
                        <SectionSlider
                            slidesPerView={5}
                            spaceBetween={15}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                576: { slidesPerView: 3, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                992: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                        >
                            {cantMissThis.items.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <div
                                        className="offersss ticket-card text-white text-center border-0 shadow-sm cursor-pointer hover-lift py-4 px-2 rounded-3 d-lg-flex flex-lg-row justify-content-center align-items-center gap-2 page-title-main-name"
                                        style={{ height: "140px" }}
                                        onClick={() => navigate(`/products/category/?maxPrice=${item.maxPrice}`)}
                                    >
                                        <span className="text-black d-block pt-lg-0 pt-3 offersssfonts offer-font-weight-500">
                                            {item.subLabel}
                                        </span>
                                        <h4 className="m-0 text-black offersssfonts offer-font-weight-500">
                                            {item.label}
                                        </h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </SectionSlider>
                    </section>
                )}

                <Certificate />
            </div>

            {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
            {showVariantOverlay && (() => {
                const item = offerProducts?.flatMap(section => section.products || []).find(p => p._id === showVariantOverlay);
                if (!item) return null;

                const allVariants = item.variants || [];
                const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.find((v) => v.stock > 0) || allVariants[0]) || {};
                const groupedVariants = groupVariantsByType(allVariants);
                const isAdding = addingToCart[item._id];
                const isCurrentVariantOutOfStock = displayVariant.stock <= 0;

                const hasColorVariants = groupedVariants.color.length > 0;
                const hasTextVariants = groupedVariants.text.length > 0;

                return (
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
                                    {hasColorVariants ? "Select Shade" : "Select Variant"}
                                </h3>
                                <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
                                    &times;
                                </button>
                            </div>

                            {/* Body content with scrolling swatches */}
                            <div className="mobile-sheet-body">
                                {hasColorVariants && (
                                    <div className="mobile-sheet-variants-grid">
                                        {groupedVariants.color.map((v) => {
                                            const isSelected = displayVariant.sku === v.sku;
                                            const isOutOfStock = (v.stock ?? 0) <= 0;
                                            const variantText = getVariantDisplayText(v);

                                            return (
                                                <div
                                                    key={getSku(v) || v._id}
                                                    className={`mobile-sheet-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isOutOfStock) {
                                                            handleVariantSelect(item._id, v);
                                                            setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
                                                        }
                                                    }}
                                                >
                                                    <div
                                                        className={`mobile-sheet-color-circle ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}
                                                        style={{ backgroundColor: v.hex || "#ccc" }}
                                                    >
                                                        {isSelected && (
                                                            <FaCheck className="mobile-sheet-check-icon" />
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

                                {hasTextVariants && !hasColorVariants && (
                                    <div className="mobile-sheet-variants-grid">
                                        {groupedVariants.text.map((v) => {
                                            const isSelected = displayVariant.sku === v.sku;
                                            const isOutOfStock = (v.stock ?? 0) <= 0;
                                            const variantText = getVariantDisplayText(v);

                                            return (
                                                <div
                                                    key={getSku(v) || v._id}
                                                    className="mobile-sheet-variant-item"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isOutOfStock) {
                                                            handleVariantSelect(item._id, v);
                                                            setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
                                                        }
                                                    }}
                                                >
                                                    <button className={`mobile-sheet-text-pill ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}>
                                                        <span>{variantText}</span>
                                                        {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
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
                                            {formatPrice(displayVariant.displayPrice || displayVariant.discountedPrice || item.price)}
                                        </span>
                                        {displayVariant.originalPrice > (displayVariant.displayPrice || displayVariant.discountedPrice) && (
                                            <>
                                                <span className="mobile-sheet-original-price">
                                                    {formatPrice(displayVariant.originalPrice)}
                                                </span>
                                                <span className="mobile-sheet-discount">
                                                    ({displayVariant.discountPercent || Math.round(((displayVariant.originalPrice - (displayVariant.displayPrice || displayVariant.discountedPrice)) / displayVariant.originalPrice) * 100)}% OFF)
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <span
                                    className="mobile-sheet-view-details"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/product/${getProductSlug(item)}`);
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
                                    disabled={isAdding || isCurrentVariantOutOfStock}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        const chosen = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                                        if (chosen) {
                                            handleVariantSelect(item._id, chosen);
                                        }
                                        await handleAddToCart(item, chosen);
                                        closeVariantOverlay();
                                    }}
                                >
                                    {isAdding ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                            Adding...
                                        </>
                                    ) : isCurrentVariantOutOfStock ? (
                                        "Out of Stock"
                                    ) : (
                                        "Add to Bag"
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                );
            })()}
            {/* ===================== END MOBILE BOTTOM SHEET DRAWER ===================== */}

            {/* ===================== OUT OF STOCK POPUP ===================== */}
            <OutOfStockPopup
                isOpen={showOutOfStockPopup}
                onClose={closeOutOfStockPopup}
                productName={outOfStockProductName}
            />

            <Footer />
        </>
    );
}



















