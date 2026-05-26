// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css"; // you can create this or reuse ProductPage.css
// import Bag from "../assets/Bag.svg";

// const API_BASE = "https://beauty.joyory.com/api/user";
// const CART_API_BASE = `${API_BASE}/cart`;
// const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

// /* ---------- helpers (copied from ProductPage) ---------- */
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

// export default function CategoryLandingPage() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   // State
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Wishlist state (same as ProductPage)
//   const [wishlistData, setWishlistData] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   // Cart & variant selection (for product cards inside topSellers / findsForYou)
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   /* ---------- Toast ---------- */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type}`;
//     t.style.cssText = `
//       position:fixed; top:20px; right:20px; padding:12px 20px;
//       border-radius:8px; color:#fff; z-index:9999;
//       background:${type === "error" ? "#f56565" : "#48bb78"};
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${API_BASE}/categories/category/${slug}/landing`
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC (copied from ProductPage) ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true }
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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

//   /* ========== CART LOGIC (simplified from ProductPage) ========== */
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
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

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* ========== RENDER PRODUCT CARD (same as ProductPage, but reused) ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div
//         key={prod._id}
//         className="col-6 col-md-4 col-lg-3 position-relative page-title-main-name"
//       >
//         {/* Wishlist button */}
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar)
//               toggleWishlist(prod, displayVariant || {});
//           }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute",
//             top: 8,
//             right: 8,
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: inWl ? "#dc3545" : "#ccc",
//             fontSize: 22,
//             zIndex: 2,
//             backgroundColor: "rgba(255,255,255,.9)",
//             borderRadius: "50%",
//             width: 34,
//             height: 34,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//             transition: "all .3s ease",
//             border: "none",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <img
//           src={img}
//           alt={prod.name}
//           className="card-img-top"
//           style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//           onClick={() => navigate(`/product/${slugPr}`)}
//         />

//         <div className="card-body p-0 d-flex flex-column" style={{ height: 265 }}>
//           <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">
//             {getBrandName(prod)}
//           </div>
//           <h5
//             className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate(`/product/${slugPr}`)}
//           >
//             {prod.name}
//           </h5>

//           {hasVar && (
//             <div className="m-0 p-0 ms-0">
//               {isVariantSelected ? (
//                 <div
//                   className="text-muted small"
//                   style={{ cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openVariantOverlay(prod._id, "all");
//                   }}
//                   title="Click to change variant"
//                 >
//                   Variant:{" "}
//                   <span className="fw-bold text-dark">
//                     {getVariantDisplayText(displayVariant)}
//                   </span>
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               ) : (
//                 <div
//                   className="small text-muted"
//                   style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openVariantOverlay(prod._id, "all");
//                   }}
//                 >
//                   {vars.length} Variants Available
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Price */}
//           <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
//             {(() => {
//               const price =
//                 displayVariant?.displayPrice ||
//                 displayVariant?.discountedPrice ||
//                 prod.price ||
//                 0;
//               const orig =
//                 displayVariant?.originalPrice ||
//                 displayVariant?.mrp ||
//                 prod.mrp ||
//                 price;
//               const disc = orig > price;
//               const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//               return disc ? (
//                 <>
//                   ₹{price}
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#888",
//                       marginLeft: 8,
//                     }}
//                   >
//                     ₹{orig}
//                   </span>
//                   <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>
//                     ({pct}% OFF)
//                   </span>
//                 </>
//               ) : (
//                 <>₹{orig}</>
//               );
//             })()}
//           </p>

//           {/* Cart button */}
//           <div className="mt-3">
//             <button
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${
//                 isAdding ? "bg-black text-white" : ""
//               }`}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (showSelectVariantButton) {
//                   openVariantOverlay(prod._id, "all");
//                 } else {
//                   handleAddToCart(prod);
//                 }
//               }}
//               disabled={disabled}
//               style={{ transition: "background-color .3s ease, color .3s ease" }}
//             >
//               {isAdding ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" />
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   {btnText}
//                   {!disabled && !isAdding && !showSelectVariantButton && (
//                     <img src={Bag} alt="Bag" style={{ height: 20 }} />
//                   )}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay (same as ProductPage) */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" onClick={closeVariantOverlay}>
//             <div
//               className="variant-overlay-content w-100"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "90%",
//                 maxWidth: 500,
//                 maxHeight: "80vh",
//                 background: "#fff",
//                 borderRadius: 12,
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">
//                   Select Variant ({totalVars})
//                 </h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   style={{ background: "none", border: "none", fontSize: 24 }}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${
//                     selectedVariantType === "all" ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${
//                       selectedVariantType === "color" ? "active" : ""
//                     }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${
//                       selectedVariantType === "text" ? "active" : ""
//                     }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   width: 28,
//                                   height: 28,
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   margin: "0 auto 8px",
//                                   border: sel ? "3px solid #000" : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                   position: "relative",
//                                 }}
//                               >
//                                 {sel && (
//                                   <span
//                                     style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform: "translate(-50%,-50%)",
//                                       color: "#fff",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div
//                                 className="small page-title-main-name"
//                                 style={{ fontSize: "14px !important" }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && <div className="text-danger small">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   padding: 10,
//                                   borderRadius: 8,
//                                   border: sel ? "3px solid #000" : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: 50,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="fullscreen-loader page-title-main-name">
//           <div className="spinner" />
//           <p className="text-black">Loading category...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3>Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategories,
//     promotions,
//     brands,
//     topSellers,
//     skinTypes,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     isParent,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* Banner Image */}
//       {category.bannerImage?.length > 0 && (
//         <div className="banner-images text-center mt-xl-5 pt-xl-4">
//           <img
//             src={category.bannerImage[0]}
//             alt={category.name}
//             className="w-100 hero-slider-image-responsive"
//             style={{ maxHeight: 400, objectFit: "cover" }}
//           />
//         </div>
//       )}

//       <div className="container-lg py-4">
//         {/* Category Title & Description */}
//         <div className="mb-4">
//           <h1 className="page-title-main-name">{category.name}</h1>
//           {category.description && (
//             <p className="text-muted">{category.description}</p>
//           )}
//           <p className="text-muted small">{totalProducts} products</p>
//         </div>

//         {/* Sub Categories (if any) */}
//         {subCategories?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Top Category</h3>
//             <div className="row g-3">
//               {subCategories.map((sub) => (
//                 <div key={sub._id} className="col-6 col-md-3 col-lg-2">
//                   <div
//                     className="card h-100 border-0 text-center"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => navigate(`/category/${sub.slug}`)}
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         className="card-img-top rounded-circle mx-auto"
//                         style={{ width: 100, height: 100, objectFit: "cover" }}
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="card-title small">{sub.name}</h6>
//                       <p className="text-muted small">{sub.productCount} items</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Promotions Carousel (simple row) */}
//         {promotions?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Offers for You</h3>
//             <div className="d-flex overflow-auto py-2" style={{ gap: "1rem" }}>
//               {promotions.map((promo) => (
//                 <div
//                   key={promo._id}
//                   className="card border-0 shadow-sm"
//                   style={{ minWidth: 250, cursor: "pointer" }}
//                   onClick={() => navigate(`/promotion/${promo.slug}`)}
//                 >
//                   {promo.images?.[0] && (
//                     <img
//                       src={promo.images[0]}
//                       alt={promo.title}
//                       className="card-img-top"
//                       style={{ height: 120, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="card-body p-2">
//                     <h6 className="card-title small fw-bold">{promo.title}</h6>
//                     {promo.discountLabel && (
//                       <span className="badge bg-danger">{promo.discountLabel}</span>
//                     )}
//                     <p className="card-text small text-muted mt-1">
//                       {promo.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Brands */}
//         {brands?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Top Brands</h3>
//             <div className="d-flex flex-wrap gap-3">
//               {brands.map((brand) => (
//                 <div
//                   key={brand._id}
//                   className="text-center"
//                   style={{ minWidth: 100, cursor: "pointer" }}
//                   onClick={() => navigate(`/brand/${brand.slug}`)}
//                 >
//                   {brand.logo && (
//                     <img
//                       src={brand.logo}
//                       alt={brand.name}
//                       className="rounded-circle border"
//                       style={{ width: 70, height: 70, objectFit: "contain" }}
//                     />
//                   )}
//                   <div className="small mt-1">{brand.name}</div>
//                   {brand.hasPromotion && (
//                     <span className="badge bg-success small">Offer</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Sellers */}
//         {topSellers?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Top Sellers</h3>
//             <div className="row g-4">
//               {topSellers.map((prod) => renderProductCard(prod))}
//             </div>
//           </section>
//         )}

//         {/* Skin Types (for skin category) */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Shop by Skin Type</h3>
//             <div className="d-flex flex-wrap gap-3">
//               {skinTypes.map((st) => (
//                 <div
//                   key={st._id}
//                   className="text-center"
//                   style={{ minWidth: 100, cursor: "pointer" }}
//                   onClick={() => navigate(`/skintype/${st.slug}`)}
//                 >
//                   {st.image && (
//                     <img
//                       src={st.image}
//                       alt={st.name}
//                       className="rounded-circle"
//                       style={{ width: 70, height: 70, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="small mt-1">{st.name}</div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Shop by Ingredients */}
//         {shopByIngredients?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Shop by Ingredients</h3>
//             <div className="d-flex flex-wrap gap-3">
//               {shopByIngredients.map((ing) => (
//                 <div
//                   key={ing._id}
//                   className="text-center"
//                   style={{ minWidth: 100, cursor: "pointer" }}
//                   onClick={() => navigate(`/ingredient/${ing.slug}`)}
//                 >
//                   {ing.image && (
//                     <img
//                       src={ing.image}
//                       alt={ing.name}
//                       className="rounded-circle"
//                       style={{ width: 70, height: 70, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="small mt-1">{ing.name}</div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Finds For You – each section with products */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-5">
//             <h3 className="h5 fw-bold mb-3">{section.title}</h3>
//             <div className="row g-4">
//               {section.products?.map((prod) => renderProductCard(prod))}
//             </div>
//           </section>
//         ))}

//         {/* Feature Banners (like quiz, virtual try‑on) */}
//         {featureBanners?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex flex-wrap gap-3">
//               {featureBanners.map((banner) => (
//                 <div
//                   key={banner._id}
//                   className="card border-0 shadow-sm"
//                   style={{ width: 300, cursor: "pointer" }}
//                   onClick={() => {
//                     if (banner.type === "quiz") navigate("/quiz");
//                     else if (banner.type === "shadeFinder") navigate("/shade-finder");
//                     else if (banner.type === "virtualTryOn") navigate("/virtual-try-on");
//                   }}
//                 >
//                   {banner.image && (
//                     <img
//                       src={banner.image}
//                       alt={banner.title}
//                       className="card-img-top"
//                       style={{ height: 150, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="card-body p-2">
//                     <h6 className="card-title small fw-bold">{banner.title}</h6>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>

//       <Footer />
//     </>
//   );
// }

// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css";
// import Bag from "../assets/Bag.svg";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const API_BASE = "https://beauty.joyory.com/api/user";
// const CART_API_BASE = `${API_BASE}/cart`;
// const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

// /* ---------- helpers (copied from ProductPage) ---------- */
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

// export default function CategoryLandingPage() {
//   const swiperRef = useRef(null);
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   // State
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Wishlist state (same as ProductPage)
//   const [wishlistData, setWishlistData] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});

//   // Cart & variant selection (for product cards inside topSellers / findsForYou)
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   /* ---------- Toast ---------- */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type}`;
//     t.style.cssText = `
//       position:fixed; top:20px; right:20px; padding:12px 20px;
//       border-radius:8px; color:#fff; z-index:9999;
//       background:${type === "error" ? "#f56565" : "#48bb78"};
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${API_BASE}/categories/category/${slug}/landing`
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC (copied from ProductPage) ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true }
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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

//   /* ========== CART LOGIC (simplified from ProductPage) ========== */
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
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

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* Video play/pause when slide changes (copied from HeroSlider) */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => {});
//   };

//   /* ========== RENDER PRODUCT CARD (same as ProductPage, but reused) ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div
//         key={prod._id}
//         className="col-6 col-md-4 col-lg-3 position-relative page-title-main-name"
//       >
//         {/* Wishlist button */}
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar)
//               toggleWishlist(prod, displayVariant || {});
//           }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute",
//             top: 8,
//             right: 8,
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: inWl ? "#dc3545" : "#ccc",
//             fontSize: 22,
//             zIndex: 2,
//             backgroundColor: "rgba(255,255,255,.9)",
//             borderRadius: "50%",
//             width: 34,
//             height: 34,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//             transition: "all .3s ease",
//             border: "none",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <img
//           src={img}
//           alt={prod.name}
//           className="card-img-top"
//           style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//           onClick={() => navigate(`/product/${slugPr}`)}
//         />

//         <div className="card-body p-0 d-flex flex-column" style={{ height: 265 }}>
//           <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">
//             {getBrandName(prod)}
//           </div>
//           <h5
//             className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate(`/product/${slugPr}`)}
//           >
//             {prod.name}
//           </h5>

//           {hasVar && (
//             <div className="m-0 p-0 ms-0">
//               {isVariantSelected ? (
//                 <div
//                   className="text-muted small"
//                   style={{ cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openVariantOverlay(prod._id, "all");
//                   }}
//                   title="Click to change variant"
//                 >
//                   Variant:{" "}
//                   <span className="fw-bold text-dark">
//                     {getVariantDisplayText(displayVariant)}
//                   </span>
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               ) : (
//                 <div
//                   className="small text-muted"
//                   style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openVariantOverlay(prod._id, "all");
//                   }}
//                 >
//                   {vars.length} Variants Available
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Price */}
//           <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
//             {(() => {
//               const price =
//                 displayVariant?.displayPrice ||
//                 displayVariant?.discountedPrice ||
//                 prod.price ||
//                 0;
//               const orig =
//                 displayVariant?.originalPrice ||
//                 displayVariant?.mrp ||
//                 prod.mrp ||
//                 price;
//               const disc = orig > price;
//               const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//               return disc ? (
//                 <>
//                   ₹{price}
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#888",
//                       marginLeft: 8,
//                     }}
//                   >
//                     ₹{orig}
//                   </span>
//                   <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>
//                     ({pct}% OFF)
//                   </span>
//                 </>
//               ) : (
//                 <>₹{orig}</>
//               );
//             })()}
//           </p>

//           {/* Cart button */}
//           <div className="mt-3">
//             <button
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${
//                 isAdding ? "bg-black text-white" : ""
//               }`}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (showSelectVariantButton) {
//                   openVariantOverlay(prod._id, "all");
//                 } else {
//                   handleAddToCart(prod);
//                 }
//               }}
//               disabled={disabled}
//               style={{ transition: "background-color .3s ease, color .3s ease" }}
//             >
//               {isAdding ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" />
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   {btnText}
//                   {!disabled && !isAdding && !showSelectVariantButton && (
//                     <img src={Bag} alt="Bag" style={{ height: 20 }} />
//                   )}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay (same as ProductPage) */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" onClick={closeVariantOverlay}>
//             <div
//               className="variant-overlay-content w-100"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "90%",
//                 maxWidth: 500,
//                 maxHeight: "80vh",
//                 background: "#fff",
//                 borderRadius: 12,
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">
//                   Select Variant ({totalVars})
//                 </h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   style={{ background: "none", border: "none", fontSize: 24 }}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${
//                     selectedVariantType === "all" ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${
//                       selectedVariantType === "color" ? "active" : ""
//                     }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${
//                       selectedVariantType === "text" ? "active" : ""
//                     }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   width: 28,
//                                   height: 28,
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   margin: "0 auto 8px",
//                                   border: sel ? "3px solid #000" : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                   position: "relative",
//                                 }}
//                               >
//                                 {sel && (
//                                   <span
//                                     style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform: "translate(-50%,-50%)",
//                                       color: "#fff",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div
//                                 className="small page-title-main-name"
//                                 style={{ fontSize: "14px !important" }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && <div className="text-danger small">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   padding: 10,
//                                   borderRadius: 8,
//                                   border: sel ? "3px solid #000" : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: 50,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="fullscreen-loader page-title-main-name">
//           <div className="spinner" />
//           <p className="text-black">Loading category...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3>Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategories,
//     promotions,
//     brands,
//     topSellers,
//     skinTypes,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     isParent,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* 🔥 Custom style to ensure pagination bullets are visible */}
//       <style dangerouslySetInnerHTML={{
//         __html: `
//           .swiper-pagination-bullet {
//             background: #fff !important;
//             opacity: 0.8 !important;
//             border: 1px solid #000 !important;
//           }
//           .swiper-pagination-bullet-active {
//             background: #000 !important;
//             opacity: 1 !important;
//             border-color: #fff !important;
//           }
//         `
//       }} />

//       {/* 🔁 Swiper slider for banner images – fixed height ensures visibility */}
//       {category.bannerImage?.length > 0 && (
//         <section className="hero-slider">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={handleSlideChange}
//             loop
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{ clickable: true }}
//             navigation
//             speed={800}
//             className="mt-lg-5 margin-setup"
//             style={{ height: "400px", width: "100%" }}
//           >
//             {category.bannerImage.map((imgUrl, index) => (
//               <SwiperSlide key={index}>
//                 <div
//                   className="slide-wrapper position-relative mt-xl-4 padding-left-rightss"
//                   style={{ height: "100%", width: "100%" }}
//                 >
//                   <img
//                     src={imgUrl}
//                     alt={`${category.name} banner ${index + 1}`}
//                     className="slide-media hero-slider-image-responsive"
//                     style={{
//                       height: "100%",
//                       width: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </section>
//       )}

//       <div className="container-lg py-4">
//         {/* Category Title & Description */}
//         <div className="mb-4">
//           <h1 className="page-title-main-name">{category.name}</h1>
//           {category.description && (
//             <p className="text-muted">{category.description}</p>
//           )}
//           <p className="text-muted small">{totalProducts} products</p>
//         </div>

//         {/* Sub Categories (if any) */}
//         {subCategories?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Top Category</h3>
//             <div className="row g-3">
//               {subCategories.map((sub) => (
//                 <div key={sub._id} className="col-6 col-md-3 col-lg-2">
//                   <div
//                     className="card h-100 border-0 text-center"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => navigate(`/category/${sub.slug}`)}
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         className="card-img-top rounded-circle mx-auto"
//                         style={{ width: 100, height: 100, objectFit: "cover" }}
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="card-title small">{sub.name}</h6>
//                       <p className="text-muted small">{sub.productCount} items</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Promotions Carousel (simple row) */}
//         {promotions?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Offers for You</h3>
//             <div className="d-flex overflow-auto py-2" style={{ gap: "1rem" }}>
//               {promotions.map((promo) => (
//                 <div
//                   key={promo._id}
//                   className="card border-0 shadow-sm"
//                   style={{ minWidth: 250, cursor: "pointer" }}
//                   onClick={() => navigate(`/promotion/${promo.slug}`)}
//                 >
//                   {promo.images?.[0] && (
//                     <img
//                       src={promo.images[0]}
//                       alt={promo.title}
//                       className="card-img-top"
//                       style={{ height: 120, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="card-body p-2">
//                     <h6 className="card-title small fw-bold">{promo.title}</h6>
//                     {promo.discountLabel && (
//                       <span className="badge bg-danger">{promo.discountLabel}</span>
//                     )}
//                     <p className="card-text small text-muted mt-1">
//                       {promo.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Brands */}
//         {brands?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Top Brands</h3>
//             <div className="d-flex flex-wrap gap-3">
//               {brands.map((brand) => (
//                 <div
//                   key={brand._id}
//                   className="text-center"
//                   style={{ minWidth: 100, cursor: "pointer" }}
//                   onClick={() => navigate(`/brand/${brand.slug}`)}
//                 >
//                   {brand.logo && (
//                     <img
//                       src={brand.logo}
//                       alt={brand.name}
//                       className="rounded-circle border"
//                       style={{ width: 70, height: 70, objectFit: "contain" }}
//                     />
//                   )}
//                   <div className="small mt-1">{brand.name}</div>
//                   {brand.hasPromotion && (
//                     <span className="badge bg-success small">Offer</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Sellers */}
//         {topSellers?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Top Sellers</h3>
//             <div className="row g-4">
//               {topSellers.map((prod) => renderProductCard(prod))}
//             </div>
//           </section>
//         )}

//         {/* Skin Types (for skin category) */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Shop by Skin Type</h3>
//             <div className="d-flex flex-wrap gap-3">
//               {skinTypes.map((st) => (
//                 <div
//                   key={st._id}
//                   className="text-center"
//                   style={{ minWidth: 100, cursor: "pointer" }}
//                   onClick={() => navigate(`/skintype/${st.slug}`)}
//                 >
//                   {st.image && (
//                     <img
//                       src={st.image}
//                       alt={st.name}
//                       className="rounded-circle"
//                       style={{ width: 70, height: 70, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="small mt-1">{st.name}</div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Shop by Ingredients */}
//         {shopByIngredients?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Shop by Ingredients</h3>
//             <div className="d-flex flex-wrap gap-3">
//               {shopByIngredients.map((ing) => (
//                 <div
//                   key={ing._id}
//                   className="text-center"
//                   style={{ minWidth: 100, cursor: "pointer" }}
//                   onClick={() => navigate(`/ingredient/${ing.slug}`)}
//                 >
//                   {ing.image && (
//                     <img
//                       src={ing.image}
//                       alt={ing.name}
//                       className="rounded-circle"
//                       style={{ width: 70, height: 70, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="small mt-1">{ing.name}</div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Finds For You – each section with products */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-5">
//             <h3 className="h5 fw-bold mb-3">{section.title}</h3>
//             <div className="row g-4">
//               {section.products?.map((prod) => renderProductCard(prod))}
//             </div>
//           </section>
//         ))}

//         {/* Feature Banners (like quiz, virtual try‑on) */}
//         {featureBanners?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex flex-wrap gap-3">
//               {featureBanners.map((banner) => (
//                 <div
//                   key={banner._id}
//                   className="card border-0 shadow-sm"
//                   style={{ width: 300, cursor: "pointer" }}
//                   onClick={() => {
//                     if (banner.type === "quiz") navigate("/quiz");
//                     else if (banner.type === "shadeFinder") navigate("/shade-finder");
//                     else if (banner.type === "virtualTryOn") navigate("/virtual-try-on");
//                   }}
//                 >
//                   {banner.image && (
//                     <img
//                       src={banner.image}
//                       alt={banner.title}
//                       className="card-img-top"
//                       style={{ height: 150, objectFit: "cover" }}
//                     />
//                   )}
//                   <div className="card-body p-2">
//                     <h6 className="card-title small fw-bold">{banner.title}</h6>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>

//       <Footer />
//     </>
//   );
// }

// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHeart, FaRegHeart, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css";
// import Bag from "../assets/Bag.svg";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
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

// // Custom Section Slider Component with Bootstrap classes
// const SectionSlider = ({ children, slidesPerView = 4, spaceBetween = 20 }) => {
//   const swiperRef = useRef(null);

//   return (
//     <div className="position-relative margintop-sss">
//       {/* Navigation Buttons */}
//       <button
//         onClick={() => swiperRef.current?.swiper?.slidePrev()}
//         className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{
//           width: "40px",
//           height: "40px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           border: "1px solid #dee2e6",
//         }}
//       >
//         <FaChevronLeft size={16} />
//       </button>

//       <button
//         onClick={() => swiperRef.current?.swiper?.slideNext()}
//         className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{
//           width: "40px",
//           height: "40px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           border: "1px solid #dee2e6",
//         }}
//       >
//         <FaChevronRight size={16} />
//       </button>

//       <Swiper
//         ref={swiperRef}
//         slidesPerView={1}
//         spaceBetween={spaceBetween}
//         breakpoints={{
//           320: { slidesPerView: 2, spaceBetween: 10 },
//           576: { slidesPerView: 3, spaceBetween: 15 },
//           768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
//           // 992: { slidesPerView: slidesPerView, spaceBetween: 20 },
//           // 1200: { slidesPerView: slidesPerView + 1, spaceBetween: 20 },
//         }}
//         navigation={false}
//         className="section-slider"
//       >
//         {children}
//       </Swiper>
//     </div>
//   );
// };

// export default function CategoryLandingPage() {
//   const swiperRef = useRef(null);
//   const { slug } = useParams();
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
//     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
//     t.style.cssText = `
//       z-index: 9999;
//       background: ${type === "error" ? "#dc3545" : "#198754"};
//       box-shadow: 0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${API_BASE}/categories/category/${slug}/landing`
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true }
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
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

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* Video play/pause when slide changes */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => { });
//   };

//   /* ========== RENDER PRODUCT CARD ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col position-relative">
//         {/* Wishlist button */}
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar)
//               toggleWishlist(prod, displayVariant || {});
//           }}
//           disabled={wishlistLoading[prod._id]}
//           className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//           style={{
//             width: "36px",
//             height: "36px",
//             color: inWl ? "#dc3545" : "#6c757d",
//             border: "none",
//             boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <span className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <div className="card h-100 border-0">
//           <img
//             src={img}
//             alt={prod.name}
//             className="card-img-top"
//             style={{ height: "200px", objectFit: "contain", cursor: "pointer" }}
//             onClick={() => navigate(`/product/${slugPr}`)}
//           />

//           <div className="card-body d-flex flex-column p-3">
//             <div className="text-muted small mb-1 fw-medium text-start text-uppercase">
//               {getBrandName(prod)}
//             </div>
//             <h5
//               className="card-title fs-6 fw-bold text-truncate"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${slugPr}`)}
//             >
//               {prod.name}
//             </h5>

//             {hasVar && (
//               <div className="mb-2">
//                 {isVariantSelected ? (
//                   <div
//                     className="text-muted small cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span className="fw-bold text-dark ms-1">
//                       {getVariantDisplayText(displayVariant)}
//                     </span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                   </div>
//                 ) : (
//                   <div
//                     className="small text-muted cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                   >
//                     {vars.length} Variants Available
//                     <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Price */}
//             <p className="fw-bold mb-3" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price =
//                   displayVariant?.displayPrice ||
//                   displayVariant?.discountedPrice ||
//                   prod.price ||
//                   0;
//                 const orig =
//                   displayVariant?.originalPrice ||
//                   displayVariant?.mrp ||
//                   prod.mrp ||
//                   price;
//                 const disc = orig > price;
//                 const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//                 return disc ? (
//                   <>
//                     ₹{price}
//                     <span
//                       className="text-decoration-line-through text-muted ms-2"
//                       style={{ fontSize: "14px" }}
//                     >
//                       ₹{orig}
//                     </span>
//                     <span className="text-danger ms-2" style={{ fontSize: "14px" }}>
//                       ({pct}% OFF)
//                     </span>
//                   </>
//                 ) : (
//                   <>₹{orig}</>
//                 );
//               })()}
//             </p>

//             {/* Cart button */}
//             <div className="mt-auto">
//               <button
//                 className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"
//                   }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantButton) {
//                     openVariantOverlay(prod._id, "all");
//                   } else {
//                     handleAddToCart(prod);
//                   }
//                 }}
//                 disabled={disabled}
//               >
//                 {isAdding ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status" />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {btnText}
//                     {!disabled && !isAdding && !showSelectVariantButton && (
//                       <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
//             onClick={closeVariantOverlay}>
//             <div
//               className="bg-white rounded-3 overflow-hidden d-flex flex-column"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "90%",
//                 maxWidth: "500px",
//                 maxHeight: "80vh",
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   className="btn btn-link text-dark text-decoration-none fs-4 p-0"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="d-flex border-bottom">
//                 <button
//                   className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "all" ? "active text-dark border-bottom border-dark border-2" : "text-muted"
//                     }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "color" ? "active text-dark border-bottom border-dark border-2" : "text-muted"
//                       }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "text" ? "active text-dark border-bottom border-dark border-2" : "text-muted"
//                       }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="position-relative mx-auto mb-2"
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   border: sel ? "3px solid #000" : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {sel && (
//                                   <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small fw-medium">
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && <div className="text-danger small">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="d-flex align-items-center justify-content-center fw-medium"
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: sel ? "3px solid #000" : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-dark fw-medium">Loading category...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3 className="text-danger">Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategories,
//     promotions,
//     brands,
//     topSellers,
//     skinTypes,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     isParent,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* Custom Styles */}
//       <style>{`
//         .swiper-pagination-bullet {
//           background: #fff !important;
//           opacity: 0.8 !important;
//           border: 1px solid #000 !important;
//         }
//         .swiper-pagination-bullet-active {
//           background: #000 !important;
//           opacity: 1 !important;
//           border-color: #fff !important;
//         }
//         .section-slider {
//           padding: 0 10px;
//         }
//         .cursor-pointer {
//           cursor: pointer;
//         }
//       `}</style>

//       {/* Hero Banner Slider */}
//       {category.bannerImage?.length > 0 && (
//         <section className="hero-slider">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={handleSlideChange}
//             loop
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{ clickable: true }}
//             navigation
//             speed={800}
//             className="mt-lg-5"
//             style={{ height: "auto", width: "100%" }}
//           >
//             {category.bannerImage.map((imgUrl, index) => (
//               <SwiperSlide key={index} className="mt-5">
//                 <div className="position-relative w-100 h-100 mt-xl-4">
//                   <img
//                     src={imgUrl}
//                     alt={`${category.name} banner ${index + 1}`}
//                     className="w-100 h-100"
//                     style={{ objectFit: "cover" }}
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </section>
//       )}

//       {/* <div className="container-lg py-4"> */}
//       <div className="container-fluid p-md-5 p-2 py-4">
//         {/* Category Title & Description */}
//         <div className="mb-0">
//           {/* <h1 className="fw-bold  p-3 ms-md-0">{category.name}</h1> */}
//           {/* {category.description && (
//             <p className="text-muted">{category.description}</p>
//           )} */}
//           {/* <p className="text-muted small">{totalProducts} products</p> */}
//         </div>

//         {/* Sub Categories (Top Category) - Slider */}
//         {subCategories?.length > 0 && (
//           <section className="mb-0">
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">Top Category</h2>

//             </div>
//             <SectionSlider slidesPerView={3} spaceBetween={20}>
//               {subCategories.map((sub) => (
//                 <SwiperSlide key={sub._id}
//                  >
//                   <div
//                     className="card h-100 border-0 text-center cursor-pointer"
//                     onClick={() => navigate(`/category/${sub.slug}`)}
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         // className="card-img-top rounded-circle mx-auto mt-3"
//                         className="mx-auto mt-3 img-fluid object-fit-contain"
//                         // style={{ width: "100px", height: "100px", objectFit: "cover" }}
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="mt-3 text-start ms-1 page-title-main-name">{sub.name}</h6>
//                       {/* <p className="text-muted small mb-0">{sub.productCount} items</p> */}
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Promotions (Offers for You) - Slider */}
//         {promotions?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">Offers For You</h3>
//             </div>
//             <SectionSlider slidesPerView={4} spaceBetween={20}>
//               {promotions.map((promo) => (
//                 <SwiperSlide key={promo._id}>
//                   <div
//                     // className="card border-0 shadow-sm h-100 cursor-pointer"
//                     className="border-0 h-100 cursor-pointer"
//                     onClick={() => navigate(`/promotion/${promo.slug}`)}
//                   >
//                     {promo.images?.[0] && (
//                       <img
//                         src={promo.images[0]}
//                         alt={promo.title}
//                         className="card-img-top"
//                         style={{ height: "100%", objectFit: "containt" }}
//                       />
//                     )}
//                     <div className="ps-1 page-title-main-name">
//                       {/* <h6 className="card-title small fw-bold">{promo.title}</h6> */}
//                       {/* {promo.discountLabel && (
//                         <span className="badge bg-danger">{promo.discountLabel}</span>
//                       )} */}
//                       <p className="mt-1 mb-3 mt-3">
//                         {promo.description}
//                       </p>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Top Brands - Slider */}
//         {brands?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="h5 fw-bold mb-0">Top Brands</h3>
//             </div>
//             <SectionSlider slidesPerView={8} spaceBetween={15}>
//               {brands.map((brand) => (
//                 <SwiperSlide key={brand._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/brand/${brand.slug}`)}
//                   >
//                     {brand.logo && (
//                       <img
//                         src={brand.logo}
//                         alt={brand.name}
//                         className="rounded-circle border"
//                         style={{ width: "80px", height: "80px", objectFit: "contain" }}
//                       />
//                     )}
//                     <div className="small mt-2 fw-medium">{brand.name}</div>
//                     {brand.hasPromotion && (
//                       <span className="badge bg-success small">Offer</span>
//                     )}
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Top Sellers - Slider */}
//         {topSellers?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="h5 fw-bold mb-0">Top Sellers</h3>

//             </div>
//             <SectionSlider slidesPerView={4} spaceBetween={20}>
//               {topSellers.map((prod) => (
//                 <SwiperSlide key={prod._id}>
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Skin Types - Slider */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="h5 fw-bold mb-0">Shop by Skin Type</h3>
//             </div>
//             <SectionSlider slidesPerView={6} spaceBetween={15}>
//               {skinTypes.map((st) => (
//                 <SwiperSlide key={st._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/skintype/${st.slug}`)}
//                   >
//                     {st.image && (
//                       <img
//                         src={st.image}
//                         alt={st.name}
//                         className="rounded-circle"
//                         style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                       />
//                     )}
//                     <div className="small mt-2 fw-medium">{st.name}</div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Shop by Ingredients - Slider */}
//         {shopByIngredients?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="h5 fw-bold mb-0">Shop by Ingredients</h3>
//             </div>
//             <SectionSlider slidesPerView={6} spaceBetween={15}>
//               {shopByIngredients.map((ing) => (
//                 <SwiperSlide key={ing._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/ingredient/${ing.slug}`)}
//                   >
//                     {ing.image && (
//                       <img
//                         src={ing.image}
//                         alt={ing.name}
//                         className="rounded-circle"
//                         style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                       />
//                     )}
//                     <div className="small mt-2 fw-medium">{ing.name}</div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Finds For You (For You From Joyory) - Slider */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="h5 fw-bold mb-0">{section.title}</h3>
//               {section.products?.length > 4 && (
//                 <button
//                   className="btn btn-link text-decoration-none text-dark page-title-main-name"
//                   onClick={() => navigate(`/section/${section._id}`)}
//                 >
//                   View All
//                 </button>
//               )}
//             </div>
//             <SectionSlider slidesPerView={4} spaceBetween={20}>
//               {section.products?.map((prod) => (
//                 <SwiperSlide key={prod._id}>
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         ))}

//         {/* Feature Banners - Slider */}
//         {featureBanners?.length > 0 && (
//           <section className="mb-5">
//             <h3 className="h5 fw-bold mb-3">Features</h3>
//             <SectionSlider slidesPerView={3} spaceBetween={20}>
//               {featureBanners.map((banner) => (
//                 <SwiperSlide key={banner._id}>
//                   <div
//                     className="card border-0 shadow-sm h-100 cursor-pointer"
//                     onClick={() => {
//                       if (banner.type === "quiz") navigate("/quiz");
//                       else if (banner.type === "shadeFinder") navigate("/shade-finder");
//                       else if (banner.type === "virtualTryOn") navigate("/virtual-try-on");
//                     }}
//                   >
//                     {banner.image && (
//                       <img
//                         src={banner.image}
//                         alt={banner.title}
//                         className="card-img-top"
//                         style={{ height: "180px", objectFit: "cover" }}
//                       />
//                     )}
//                     <div className="card-body p-3">
//                       <h6 className="card-title small fw-bold">{banner.title}</h6>
//                       {banner.subtitle && (
//                         <p className="card-text small text-muted mb-0">{banner.subtitle}</p>
//                       )}
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





// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaHeart,
//   FaRegHeart,
//   FaChevronDown,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css";
// import Bag from "../assets/Bag.svg";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import Certificate from "./Certificate.jsx";

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
//   (
//     v.shadeName ||
//     v.name ||
//     v.size ||
//     v.ml ||
//     v.weight ||
//     "Default"
//   ).toUpperCase();

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

// /**
//  * Custom Section Slider Component
//  * @param {Object} props
//  * @param {React.ReactNode} props.children - SwiperSlide components
//  * @param {number} [props.slidesPerView=4] - Default slides per view (fallback for breakpoints)
//  * @param {number} [props.spaceBetween=20] - Space between slides in px
//  * @param {Object} [props.breakpoints] - Custom breakpoints overriding defaults
//  */
// const SectionSlider = ({
//   children,
//   slidesPerView = 4,
//   spaceBetween = 20,
//   breakpoints = {},
// }) => {
//   const swiperRef = useRef(null);

//   // Default breakpoints (same as your original code)
//   const defaultBreakpoints = {
//     320: { slidesPerView: 2, spaceBetween: 10 },
//     576: { slidesPerView: 3, spaceBetween: 15 },
//     768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
//     // 992: { slidesPerView: slidesPerView, spaceBetween: 20 },
//     // 1200: { slidesPerView: slidesPerView + 1, spaceBetween: 20 },
//   };

//   // Merge custom breakpoints with defaults (custom overrides defaults)
//   const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

//   return (
//     <div className="position-relative margintop-sss">
//       {/* Navigation Buttons */}
//       <button
//         onClick={() => swiperRef.current?.swiper?.slidePrev()}
//         className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{
//           width: "40px",
//           height: "40px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           border: "1px solid #dee2e6",
//         }}
//       >
//         <FaChevronLeft size={16} />
//       </button>

//       <button
//         onClick={() => swiperRef.current?.swiper?.slideNext()}
//         className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{
//           width: "40px",
//           height: "40px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           border: "1px solid #dee2e6",
//         }}
//       >
//         <FaChevronRight size={16} />
//       </button>

//       <Swiper
//         ref={swiperRef}
//         slidesPerView={1}
//         spaceBetween={spaceBetween}
//         breakpoints={mergedBreakpoints}
//         navigation={false}
//         className="section-slider"
//       >
//         {children}
//       </Swiper>
//     </div>
//   );
// };

// export default function CategoryLandingPage() {
//   const swiperRef = useRef(null);
//   const { slug } = useParams();
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
//     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
//     t.style.cssText = `
//       z-index: 9999;
//       background: ${type === "error" ? "#dc3545" : "#198754"};
//       box-shadow: 0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${API_BASE}/categories/category/${slug}/landing`,
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true },
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
//         const cache = JSON.parse(
//           localStorage.getItem("cartVariantCache") || "{}",
//         );
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//       }

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg =
//         e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* Video play/pause when slide changes */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => {});
//   };

//   /* ========== LINK NAVIGATION HANDLER ========== */
//   const handleLinkNavigation = (link) => {
//     if (!link) return;
//     if (link.startsWith("http://") || link.startsWith("https://")) {
//       window.location.href = link;
//     } else {
//       navigate(link);
//     }
//   };

//   /* ========== RENDER PRODUCT CARD ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col position-relative">
//         {/* Wishlist button */}
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar)
//               toggleWishlist(prod, displayVariant || {});
//           }}
//           disabled={wishlistLoading[prod._id]}
//           className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//           style={{
//             width: "36px",
//             height: "36px",
//             color: inWl ? "#dc3545" : "#6c757d",
//             border: "none",
//             boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <span className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <div className="card border-0" style={{ height: "auto !important" }}>
//           <img
//             src={img}
//             alt={prod.name}
//             className="card-img-top"
//             style={{ height: "200px", objectFit: "contain", cursor: "pointer" }}
//             onClick={() => navigate(`/product/${slugPr}`)}
//           />

//           <div
//             className="card-body d-flex flex-column p-3"
//             style={{ height: "235px" }}
//           >
//             <div className="text-muted small mb-1 fw-medium text-start text-uppercase">
//               {getBrandName(prod)}
//             </div>
//             <h5
//               className="card-title fs-6 fw-bold text-truncate"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${slugPr}`)}
//             >
//               {prod.name}
//             </h5>

//             {hasVar && (
//               <div className="mb-2">
//                 {isVariantSelected ? (
//                   <div
//                     className="text-muted small cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span
//                       className="fw-bold text-dark ms-1"
//                       style={{ fontSize: "12px" }}
//                     >
//                       {getVariantDisplayText(displayVariant)}
//                     </span>
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 ) : (
//                   <div
//                     className="small text-muted cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                   >
//                     {vars.length} Variants Available
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 )}

//                 <p className="fw-bold mb-3" style={{ fontSize: "16px" }}>
//                   {(() => {
//                     const price =
//                       displayVariant?.displayPrice ||
//                       displayVariant?.discountedPrice ||
//                       prod.price ||
//                       0;
//                     const orig =
//                       displayVariant?.originalPrice ||
//                       displayVariant?.mrp ||
//                       prod.mrp ||
//                       price;
//                     const disc = orig > price;
//                     const pct = disc
//                       ? Math.round(((orig - price) / orig) * 100)
//                       : 0;
//                     return disc ? (
//                       <>
//                         ₹{price}
//                         <span
//                           className="text-decoration-line-through text-muted ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ₹{orig}
//                         </span>
//                         <span
//                           className="text-danger ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ({pct}% OFF)
//                         </span>
//                       </>
//                     ) : (
//                       <>₹{orig}</>
//                     );
//                   })()}
//                 </p>
//               </div>
//             )}

//             {/* Price */}
//             {/* <p className="fw-bold mb-3" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price =
//                   displayVariant?.displayPrice ||
//                   displayVariant?.discountedPrice ||
//                   prod.price ||
//                   0;
//                 const orig =
//                   displayVariant?.originalPrice ||
//                   displayVariant?.mrp ||
//                   prod.mrp ||
//                   price;
//                 const disc = orig > price;
//                 const pct = disc
//                   ? Math.round(((orig - price) / orig) * 100)
//                   : 0;
//                 return disc ? (
//                   <>
//                     ₹{price}
//                     <span
//                       className="text-decoration-line-through text-muted ms-2"
//                       style={{ fontSize: "14px" }}
//                     >
//                       ₹{orig}
//                     </span>
//                     <span
//                       className="text-danger ms-2"
//                       style={{ fontSize: "14px" }}
//                     >
//                       ({pct}% OFF)
//                     </span>
//                   </>
//                 ) : (
//                   <>₹{orig}</>
//                 );
//               })()}
//             </p> */}

//             {/* Cart button */}
//             <div className="mt-auto">
//               <button
//                 className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${
//                   isAdding ? "btn-dark" : "btn-outline-dark"
//                 }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantButton) {
//                     openVariantOverlay(prod._id, "all");
//                   } else {
//                     handleAddToCart(prod);
//                   }
//                 }}
//                 disabled={disabled}
//               >
//                 {isAdding ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {btnText}
//                     {!disabled && !isAdding && !showSelectVariantButton && (
//                       <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div
//             className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ zIndex: 1050 }}
//             onClick={closeVariantOverlay}
//           >
//             <div
//               className="bg-white rounded-3 overflow-hidden d-flex flex-column"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "90%",
//                 maxWidth: "500px",
//                 maxHeight: "100%",
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   className="btn btn-link text-dark text-decoration-none fs-4 p-0"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="d-flex border-bottom">
//                 <button
//                   className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                     selectedVariantType === "all"
//                       ? "active text-white border-bottom border-dark border-2"
//                       : "text-muted"
//                   }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                       selectedVariantType === "color"
//                         ? "active text-white border-bottom border-dark border-2"
//                         : "text-muted"
//                     }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                       selectedVariantType === "text"
//                         ? "active text-white border-bottom border-dark border-2"
//                         : "text-muted"
//                     }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="position-relative mx-auto mb-2"
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {sel && (
//                                   <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small fw-medium">
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small">
//                                   Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="d-flex align-items-center justify-content-center fw-medium"
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small mt-1">
//                                   Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
//           <div className="spinner-border text-dark mb-3" role="status" />
//           <p className="text-dark fw-medium">Loading category...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3 className="text-danger">Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategoriesTitle,
//     subCategories,
//     promotionsTitle,
//     promotions,
//     brandsTitle,
//     brands,
//     topSellersTitle,
//     topSellers,
//     skinTypesTitle,
//     skinTypes,
//     shopByIngredientsTitle,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     /* NEW SECTION */
//     inFocusTitle,
//     inFocus,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* Custom Styles */}
//       <style>{`
//         .swiper-pagination-bullet {
//           background: #fff !important;
//           opacity: 0.8 !important;
//           border: 1px solid #000 !important;
//         }
//         .swiper-pagination-bullet-active {
//           background: #000 !important;
//           opacity: 1 !important;
//           border-color: #fff !important;
//         }import { style } from 'framer-motion/client';

//         .section-slider {
//           padding: 0 10px;
//         }
//         .cursor-pointer {
//           cursor: pointer;
//         }
//       `}</style>

//       {/* Hero Banner Slider - now clickable */}
//       {category.bannerImage?.length > 0 && (
//         <section className="hero-slider">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={handleSlideChange}
//             loop
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{ clickable: true }}
//             navigation
//             speed={800}
//             className="mt-lg-5"
//             style={{ height: "auto", width: "100%" }}
//           >
//             {category.bannerImage.map((banner, index) => {
//               // Gracefully handle both the old string format and the new object format
//               const imgUrl = typeof banner === "string" ? banner : banner.url;
//               const targetLink =
//                 typeof banner === "object" ? banner.link : null;

//               return (
//                 <SwiperSlide key={index} className="mt-5">
//                   <div
//                     className="position-relative w-100 h-100 mt-xl-4"
//                     style={{ cursor: targetLink ? "pointer" : "default" }}
//                     onClick={() =>
//                       targetLink && handleLinkNavigation(targetLink)
//                     }
//                   >
//                     <img
//                       src={imgUrl}
//                       alt={`${category.name} banner ${index + 1}`}
//                       className="w-100 h-100"
//                       style={{ objectFit: "cover" }}
//                     />
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </section>
//       )}

//       {/* Main Content Container */}
//       <div className="container-fluid p-md-5 p-2 py-4">
//         {/* Category Title - now clickable */}
//         <div
//           className="mb-0 cursor-pointer"
//           onClick={() => navigate(`/category/${category.slug}`)}
//         >
//           {/* <h1 className="fw-bold p-3 ms-md-0">{category.name}</h1> */}
//         </div>

//         {/* Sub Categories (Top Category) - Slider */}
//         {subCategories?.length > 0 && (
//           <section className="mb-0">
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {subCategoriesTitle || "Top Categories"}
//               </h2>
//             </div>
//             <SectionSlider slidesPerView={3} spaceBetween={20}>
//               {subCategories.map((sub) => (
//                 <SwiperSlide key={sub._id}>
//                   <div
//                     className="card h-100 border-0 text-center cursor-pointer"
//                     onClick={() => navigate(`/category/${sub.slug}`)}
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         className="mx-auto mt-3 img-fluid object-fit-contain"
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="mt-3 text-start ms-1 page-title-main-name">
//                         {sub.name}
//                       </h6>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Quiz Banner Section */}
//         {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
//           <section className="mb-5">
//             {/* <h3 className="h5 fw-bold mb-3">Beauty Quiz</h3> */}

//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               {featureBanners?.find((b) => b.type === "quiz")?.title ||
//                 "Beauty Quiz"}
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "quiz")
//                 .map((banner) => (
//                   <div key={banner._id}>
//                     <div
//                       className="h-100 row"
//                       // onClick={() => {
//                       //   if (banner.link) {
//                       //     handleLinkNavigation(banner.link);
//                       //   } else {
//                       //     navigate("/quiz");
//                       //   }
//                       // }}
//                     >
//                       <div className="col-md-6">
//                         {banner.image && (
//                           <img
//                             src={banner.image}
//                             alt={banner.title}
//                             className="img-fluid banner-image-quiz"
//                             style={{ height: "auto", objectFit: "cover" }}
//                           />
//                         )}
//                       </div>

//                       <div className="col-md-6 d-lg-flex align-items-center ">
//                         <div>
//                           <h5 className="card-title fs-4 description-responsive page-title-main-name mt-lg-0 mt-4">
//                             {banner.description}
//                           </h5>

//                           {banner.buttonText && (
//                             <p
//                               className="quize-btn mb-0 cursor-pointer mt-2 mt-lg-4 page-title-main-name"
//                               onClick={() => {
//                                 if (banner.link) {
//                                   handleLinkNavigation(banner.link);
//                                 } else {
//                                   navigate("/quiz");
//                                 }
//                               }}
//                             >
//                               {banner.buttonText}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </section>
//         )}

//         {/* Promotions (Offers for You) - Slider */}
//         {promotions?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal ">
//                 {promotionsTitle || "Offers For You"}
//               </h3>
//             </div>
//             <SectionSlider slidesPerView={4} spaceBetween={20}>
//               {promotions.map((promo) => (
//                 <SwiperSlide key={promo._id}>
//                   <div
//                     className="border-0 h-100 cursor-pointer"
//                     onClick={() => navigate(`/promotion/${promo.slug}`)}
//                   >
//                     {promo.images?.[0] && (
//                       <img
//                         src={promo.images[0]}
//                         alt={promo.title}
//                         className="card-img-top"
//                         style={{ height: "100%", objectFit: "contain" }}
//                       />
//                     )}
//                     <div className="ps-1 page-title-main-name">
//                       <p className="mt-1 mb-3 mt-3">{promo.description}</p>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Shade Finder Banner Section */}
//         {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
//           <section className="mb-5">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Shade Finder
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "shadeFinder")
//                 .map((banner) => (
//                   <SwiperSlide key={banner._id}>
//                     <div
//                       className="margin-left-right h-100 cursor-pointer"
//                       onClick={() => {
//                         if (banner.link) {
//                           handleLinkNavigation(banner.link);
//                         } else {
//                           navigate("/shade-finder");
//                         }
//                       }}
//                     >
//                       {banner.image && (
//                         <img
//                           src={banner.image}
//                           alt={banner.title}
//                           className="img-fluid"
//                         />
//                       )}
//                     </div>
//                   </SwiperSlide>
//                 ))}
//             </div>
//           </section>
//         )}

//         {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {section.title}
//               </h3>
//               {section.products?.length > 4 && (
//                 <button
//                   className="btn btn-link text-decoration-none text-dark page-title-main-name"
//                   onClick={() => navigate(`/section/${section._id}`)}
//                 >
//                   View All
//                 </button>
//               )}
//             </div>

//             {/* SectionSlider with custom breakpoints for this specific section */}
//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 }, // mobile
//                 576: { slidesPerView: 3, spaceBetween: 15 }, // small tablets
//                 768: { slidesPerView: 4, spaceBetween: 20 }, // tablets
//                 1024: { slidesPerView: 4, spaceBetween: 20 }, // desktops
//                 1280: { slidesPerView: 4, spaceBetween: 20 }, // large screens
//               }}
//             >
//               {section.products?.map((prod) => (
//                 <SwiperSlide key={prod._id} className="page-title-main-name">
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         ))}

//         {/* Virtual Try On Banner Section */}
//         {featureBanners?.filter((b) => b.type === "virtualTryOn").length >
//           0 && (
//           <section className="mb-5">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Virtual Try On
//             </h3>
//             <SectionSlider slidesPerView={1} spaceBetween={20}>
//               {featureBanners
//                 .filter((banner) => banner.type === "virtualTryOn")
//                 .map((banner) => (
//                   <SwiperSlide key={banner._id}>
//                     <div
//                       className="card border-0 shadow-sm h-100 cursor-pointer"
//                       onClick={() => {
//                         if (banner.link) {
//                           handleLinkNavigation(banner.link);
//                         } else {
//                           navigate("/virtual-try-on");
//                         }
//                       }}
//                     >
//                       {banner.image && (
//                         <img
//                           src={banner.image}
//                           alt={banner.title}
//                           className="img-fluid w-100"
//                           style={{ height: "auto" }}
//                         />
//                       )}
//                     </div>
//                   </SwiperSlide>
//                 ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* shopByIngredients */}
//         {shopByIngredients?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {shopByIngredientsTitle || "Shop by Ingredients"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={6}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 }, // mobile
//                 576: { slidesPerView: 3, spaceBetween: 10 }, // small tablet
//                 768: { slidesPerView: 3, spaceBetween: 15 }, // tablet
//                 1024: { slidesPerView: 3, spaceBetween: 15 }, // desktop
//                 1280: { slidesPerView: 3, spaceBetween: 15 }, // large desktop
//               }}
//             >
//               {shopByIngredients.map((ing) => (
//                 <SwiperSlide key={ing._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() =>
//                       navigate(`/products?ingredients=${ing.slug}`)
//                     }
//                   >
//                     {ing.image && (
//                       <img
//                         src={ing.image}
//                         alt={ing.name}
//                         className="img-fluid"
//                       />
//                     )}
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* In Focus Section - Slider */}
//         {inFocus?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {inFocusTitle || "In Focus"}
//               </h3>
//             </div>

//             <div>
//               {inFocus.map((product) => (
//                 <div key={product._id} className="bg-color-setup">
//                   <div className="bg-images"></div>
//                   <div className="border-0 row">
//                     <div className="col-lg-4">
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="img-fluid produtc-common-margin-padding"
//                         style={{ borderRadius: "10px", objectFit: "contain" }}
//                       />
//                     </div>

//                     <div className="col-lg-8">
//                       <div className="card-body p-2">
//                         <div className="text-uppercase ms-lg-5 ms-0 mt-lg-5 pt-3 fs-2 ms-lg-0 ms-3  page-title-main-name">
//                           {product.brandName}
//                         </div>

//                         <h6 className="ms-lg-5 ms-0 mt-2 ms-lg-0 ms-3 playfair-font-bold main-name-font-size">
//                           {product.name}
//                         </h6>

//                         <button
//                           onClick={() => navigate(`/product/${product.slug}`)}
//                           className="bg-transparent page-title-main-name fs-3 cursor-pointer ms-lg-5 ms-0 mt-lg-4 ms-lg-0 ms-3"
//                           style={{ border: "none" }}
//                         >
//                           Shop Now{" "}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Brands - Slider */}
//         {brands?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {brandsTitle || "Top Brands"}
//               </h3>
//             </div>
//             <SectionSlider slidesPerView={8} spaceBetween={15}>
//               {brands.map((brand) => (
//                 <SwiperSlide key={brand._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/brand/${brand.slug}`)}
//                   >
//                     {brand.thumbnailImage && (
//                       <img
//                         className="img-fluid"
//                         src={brand.thumbnailImage}
//                         alt={brand.name}
//                         style={{}}
//                       />
//                     )}
//                     <div className="mt-2 text-start fs-6 page-title-main-name">
//                       {brand.name}
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Skin Types - Slider */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {skinTypesTitle || "Shop by Skin Type"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={3}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 }, // mobile
//                 576: { slidesPerView: 3, spaceBetween: 10 }, // small tablet
//                 768: { slidesPerView: 3, spaceBetween: 15 }, // tablet
//                 1024: { slidesPerView: 3, spaceBetween: 15 }, // desktop
//                 1280: { slidesPerView: 3, spaceBetween: 15 }, // large desktop
//               }}
//             >
//               {skinTypes.map((st) => (
//                 <SwiperSlide key={st._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/skintype/${st.slug}`)}
//                   >
//                     {st.image && (
//                       <img
//                         src={st.image}
//                         alt={st.name}
//                         className="rounded-circle"
//                         style={{
//                           width: "80px",
//                           height: "80px",
//                           objectFit: "cover",
//                         }}
//                       />
//                     )}

//                     <div className="small mt-2 fw-medium">{st.name}</div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Top Sellers - Slider */}
//         {topSellers?.length > 0 && (
//           <section className="mb-5 page-title-main-name">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {topSellersTitle || "Top Sellers"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               autoplay={5}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 }, // mobile
//                 576: { slidesPerView: 3, spaceBetween: 15 }, // small tablets
//                 768: { slidesPerView: 4, spaceBetween: 20 }, // tablets
//                 1024: { slidesPerView: 4, spaceBetween: 20 }, // desktops
//                 1280: { slidesPerView: 4, spaceBetween: 20 }, // large screens
//               }}
//             >
//               {topSellers.map((prod) => (
//                 <SwiperSlide key={prod._id}>
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}
//       </div>
//       <Certificate />

//       <Footer />
//     </>
//   );
// }











// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaHeart,
//   FaRegHeart,
//   FaChevronDown,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css";
// import Bag from "../assets/Bag.svg";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// // import Loader from "../assets/Loader.gif";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import Certificate from "./Certificate.jsx";

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
//   (
//     v.shadeName ||
//     v.name ||
//     v.size ||
//     v.ml ||
//     v.weight ||
//     "Default"
//   ).toUpperCase();

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

// /**
//  * Custom Section Slider Component
//  * @param {Object} props
//  * @param {React.ReactNode} props.children - SwiperSlide components
//  * @param {number} [props.slidesPerView=4] - Default slides per view (fallback for breakpoints)
//  * @param {number} [props.spaceBetween=20] - Space between slides in px
//  * @param {Object} [props.breakpoints] - Custom breakpoints overriding defaults
//  */
// const SectionSlider = ({
//   children,
//   slidesPerView = 4,
//   spaceBetween = 20,
//   breakpoints = {},
// }) => {
//   const swiperRef = useRef(null);

//   // Default breakpoints (same as your original code)
//   const defaultBreakpoints = {
//     320: { slidesPerView: 2, spaceBetween: 10 },
//     576: { slidesPerView: 3, spaceBetween: 15 },
//     768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
//     // 992: { slidesPerView: slidesPerView, spaceBetween: 20 },
//     // 1200: { slidesPerView: slidesPerView + 1, spaceBetween: 20 },
//   };

//   // Merge custom breakpoints with defaults (custom overrides defaults)
//   const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

//   return (
//     <div className="position-relative margintop-sss">
//       {/* Navigation Buttons */}
//       {/* <button
//         onClick={() => swiperRef.current?.swiper?.slidePrev()}
//         className="btn rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{
//           width: "40px",
//           height: "40px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           border: "1px solid #dee2e6",
//           backgroundColor: '#ffffff70 !important',
//         }}
//       >
//         <FaChevronLeft size={16} style={{ fill: '#000' }} />
//       </button> */}

//       {/* <button
//         onClick={() => swiperRef.current?.swiper?.slideNext()}
//         className="btn rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
//         style={{
//           width: "40px",
//           height: "40px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           border: "1px solid #dee2e6",
//           backgroundColor: '#ffffff70 !important',
//         }}
//       >
//         <FaChevronRight size={16} style={{ fill: '#000' }} />
//       </button> */}

//       <Swiper
//         ref={swiperRef}
//         slidesPerView={1}
//         spaceBetween={spaceBetween}
//         breakpoints={mergedBreakpoints}
//         navigation={false}
//         className="section-slider"
//       >
//         {children}
//       </Swiper>
//     </div>
//   );
// };

// export default function CategoryLandingPage() {
//   const swiperRef = useRef(null);
//   const { slug } = useParams();
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
//     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
//     t.style.cssText = `
//       z-index: 9999;
//       background: ${type === "error" ? "#dc3545" : "#198754"};
//       box-shadow: 0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${API_BASE}/categories/category/${slug}/landing`,
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//      if (!user || user.guest) {
//     showToastMsg("Please login to use wishlist", "error");
//     navigate("/login", { state: { from: location.pathname } });
//     return;
//   }
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true },
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
//         const cache = JSON.parse(
//           localStorage.getItem("cartVariantCache") || "{}",
//         );
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//       }

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg =
//         e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* Video play/pause when slide changes */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => { });
//   };

//   /* ========== LINK NAVIGATION HANDLER ========== */
//   const handleLinkNavigation = (link) => {
//     if (!link) return;
//     if (link.startsWith("http://") || link.startsWith("https://")) {
//       window.location.href = link;
//     } else {
//       navigate(link);
//     }
//   };

//   /* ========== RENDER PRODUCT CARD ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col position-relative">
//         {/* Wishlist button */}
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar)
//               toggleWishlist(prod, displayVariant || {});
//           }}
//           disabled={wishlistLoading[prod._id]}
//           className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//           style={{
//             width: "36px",
//             height: "36px",
//             color: inWl ? "#dc3545" : "#6c757d",
//             border: "none",
//             boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <span className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <div className="border-0" style={{ height: "auto !important" }}>
//           <img
//             src={img}
//             alt={prod.name}
//             className="card-img-top"
//             style={{ height: "200px", objectFit: "contain", cursor: "pointer" }}
//             onClick={() => navigate(`/product/${slugPr}`)}
//           />

//           <div
//             className="card-body d-flex flex-column p-3"
//             style={{ height: "235px" }}
//           >
//             <div className="text-muted small mb-1 fw-medium text-start text-uppercase">
//               {getBrandName(prod)}
//             </div>
//             <h5
//               className="card-title fs-6 fw-bold"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${slugPr}`)}
//             >
//               {prod.name}
//             </h5>

//             {hasVar && (
//               <div className="mb-2">
//                 {isVariantSelected ? (
//                   <div
//                     className="text-muted small cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span
//                       className="fw-bold text-dark ms-1"
//                       style={{ fontSize: "12px" }}
//                     >
//                       {getVariantDisplayText(displayVariant)}
//                     </span>
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 ) : (
//                   <div
//                     className="small text-muted cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                   >
//                     {vars.length} Variants Available
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 )}

//                 <p className="fw-bold mb-3" style={{ fontSize: "16px" }}>
//                   {(() => {
//                     const price =
//                       displayVariant?.displayPrice ||
//                       displayVariant?.discountedPrice ||
//                       prod.price ||
//                       0;
//                     const orig =
//                       displayVariant?.originalPrice ||
//                       displayVariant?.mrp ||
//                       prod.mrp ||
//                       price;
//                     const disc = orig > price;
//                     const pct = disc
//                       ? Math.round(((orig - price) / orig) * 100)
//                       : 0;
//                     return disc ? (
//                       <>
//                         ₹{price}
//                         <span
//                           className="text-decoration-line-through text-muted ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ₹{orig}
//                         </span>
//                         <span
//                           className="text-danger ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ({pct}% OFF)
//                         </span>
//                       </>
//                     ) : (
//                       <>₹{orig}</>
//                     );
//                   })()}
//                 </p>
//               </div>
//             )}

//             {/* Cart button */}
//             <div className="mt-auto">
//               <button
//                 className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${isAdding ? "" : "btn-outline-dark"
//                   }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantButton) {
//                     openVariantOverlay(prod._id, "all");
//                   } else {
//                     handleAddToCart(prod);
//                   }
//                 }}
//                 disabled={disabled}
//               >
//                 {isAdding ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {btnText}
//                     {!disabled && !isAdding && !showSelectVariantButton && (
//                       <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div
//             className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ zIndex: 1050 }}
//             onClick={closeVariantOverlay}
//           >
//             <div
//               className="bg-white h-100 rounded-0 overflow-hidden d-flex flex-column"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   className="btn btn-link text-dark text-decoration-none fs-4 p-0"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="d-flex border-bottom">
//                 <button
//                   className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "all"
//                     ? "active text-black border-bottom border-dark border-2"
//                     : "text-muted"
//                     }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "color"
//                       ? "active text-black border-bottom border-dark border-2"
//                       : "text-muted"
//                       }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "text"
//                       ? "active text-black border-bottom border-dark border-2"
//                       : "text-muted"
//                       }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col-lg-4 col-6" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="position-relative mx-auto mb-2"
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {sel && (
//                                   <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small fw-medium">
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small">
//                                   Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="d-flex align-items-center justify-content-center fw-medium"
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small mt-1">
//                                   Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   // if (loading)
//   //   return (
//   //     <>
//   //       <Header />
//   //       <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
//   //         <div className="spinner-border text-dark mb-3" role="status" />
//   //         <p className="text-dark fw-medium">Loading category...</p>
//   //       </div>
//   //       <Footer />
//   //     </>
//   //   );


//     /* ========== RENDER SECTIONS ========== */
//   if (loading)
//     return (
//       <div 
//         className="d-flex flex-column align-items-center justify-content-center bg-white"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           {/* <div 
//             className="spinner-border text-dark mb-4" 
//             role="status"
//             style={{ 
//               width: "4rem", 
//               height: "4rem",
//               borderWidth: "6px"
//             }}
//           />

//           <h5 className="fw-semibold text-dark mb-2 page-title-main-name">
//             Loading Category
//           </h5> */}


//           {/* <img src={Loader} className="w-100" alt="Image-Not-Found" /> */}

//           <DotLottieReact
//       src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//       loop
//       autoplay
//     />


//           <p className="text-muted mb-0">
//             Please wait while we prepare the best products for you...
//           </p>
//         </div>
//       </div>
//     );

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3 className="text-danger">Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3 className="text-danger">Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategoriesTitle,
//     subCategories,
//     promotionsTitle,
//     promotions,
//     brandsTitle,
//     brands,
//     topSellersTitle,
//     topSellers,
//     skinTypesTitle,
//     skinTypes,
//     shopByIngredientsTitle,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     /* NEW SECTION */
//     inFocusTitle,
//     inFocus,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* Custom Styles */}
//       <style>{`
//         .swiper-pagination-bullet {
//           background: #fff !important;
//           opacity: 0.8 !important;
//           border: 1px solid #000 !important;
//         }
//         .swiper-pagination-bullet-active {
//           background: #000 !important;
//           opacity: 1 !important;
//           border-color: #fff !important;
//         }
//         .cursor-pointer {
//           cursor: pointer;
//         }
//       `}</style>

//       {/* Hero Banner Slider - now clickable */}
//       {category.bannerImage?.length > 0 && (
//         <section className="hero-slider">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={handleSlideChange}
//             loop
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{ clickable: true }}
//             navigation
//             speed={800}
//             className="mt-lg-5"
//             style={{ height: "auto", width: "100%" }}
//           >
//             {category.bannerImage.map((banner, index) => {
//               // Gracefully handle both the old string format and the new object format
//               const imgUrl = typeof banner === "string" ? banner : banner.url;
//               const targetLink =
//                 typeof banner === "object" ? banner.link : null;

//               return (
//                 <SwiperSlide key={index} className="mt-5">
//                   <div
//                     className="position-relative w-100 h-100 mt-xl-4 padding-left-rightss"
//                     style={{ cursor: targetLink ? "pointer" : "default" }}
//                     onClick={() =>
//                       targetLink && handleLinkNavigation(targetLink)
//                     }
//                   >
//                     <img
//                       src={imgUrl}
//                       alt={`${category.name} banner ${index + 1}`}
//                       className="w-100 h-100"
//                       style={{ objectFit: "cover" }}
//                     />
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </section>
//       )}

//       {/* Main Content Container */}
//       <div className="container-fluid p-md-5 p-lg-2 py-lg-4 pt-lg-2">
//         {/* Category Title - now clickable */}
//         <div
//           className="mb-0 cursor-pointer"
//           onClick={() => navigate(`/category/${category.slug}`)}
//         >
//           {/* <h1 className="fw-bold p-3 ms-md-0">{category.name}</h1> */}
//         </div>



//         {/* Sub Categories (Top Category) - Slider */}
//         {subCategories?.length > 0 && (
//           <section className="mb padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="top-categories-title mb-0  page-title-main-name fw-normal">
//                 {subCategoriesTitle || "Top Categories"}
//               </h2>
//             </div>
//             <SectionSlider slidesPerView={3} spaceBetween={20}>
//               {subCategories.map((sub) => (
//                 <SwiperSlide key={sub._id}>
//                   <div
//                     className="h-100 border-0 text-center cursor-pointer mt-lg-3 mt-1"
//                     onClick={() => navigate(`productpage/category/${sub.slug}`)}
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         className="mx-auto mt-3 img-fluid object-fit-contain"
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="mt-3 text-start ms-1 page-title-main-name">
//                         {sub.name}
//                       </h6>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Quiz Banner Section */}
//         {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-5 mt-3">
//               {featureBanners?.find((b) => b.type === "quiz")?.title ||
//                 "Beauty Quiz"}
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "quiz")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div key={banner._id} className="h-100 row mt-lg-4 mt-3">
//                       <div className="col-md-6">
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid banner-image-quiz"
//                             style={{ height: "auto", objectFit: "cover" }}
//                           />
//                         )}
//                       </div>
//                       <div className="col-md-6 d-lg-flex align-items-center">
//                         <div>
//                           <h5 className="card-title fs-4 description-responsive page-title-main-name mt-lg-0 mt-4 ms-lg-5">
//                             {banner.description}
//                           </h5>
//                           {banner.buttonText && (
//                             <p
//                               className="quize-btn mb-0 cursor-pointer mt-2 mt-lg-5 page-title-main-name ms-lg-5"
//                               onClick={() => {
//                                 if (bannerLink) {
//                                   handleLinkNavigation(bannerLink);
//                                 } else {
//                                   navigate("/quiz");
//                                 }
//                               }}
//                             >
//                               {banner.buttonText}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}



//         {/* Promotions (Offers for You) - Fixed Category & Brand Filtering */}
//         {promotions?.length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             {/* <div className="d-flex align-items-center mb-3"> */}
//             <div className="m-0 p-0">
//               <h3 className="p-0 m-0 page-title-main-name fw-normal" style={{
//                 marginLeft: "-10px !important",
//               }}>
//                 {promotionsTitle || "Offers For You"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 1, spaceBetween: 10 },
//                 576: { slidesPerView: 2, spaceBetween: 15 },
//                 768: { slidesPerView: 3, spaceBetween: 20 },
//                 1024: { slidesPerView: 3, spaceBetween: 20 },
//               }}
//             >
//               {promotions.map((promo) => {
//                 const isBrandPromo = promo.scope === "brand" && promo.targetSlug;
//                 const isCategoryPromo = promo.scope === "category" && promo.targetSlug;

//                 return (
//                   <SwiperSlide key={promo._id}>
//                     <div
//                       className="border-0 h-100 cursor-pointer mt-lg-4 mt-3"
//                       onClick={() => {
//                         console.log(`Clicked promotion: ${promo.title} | Scope: ${promo.scope} | Target: ${promo.targetSlug}`);

//                         if (isBrandPromo) {
//                           navigate(`/brand/${promo.targetSlug}`);
//                         }
//                         else if (isCategoryPromo) {
//                           // ✅ Correct navigation for Category filtering
//                           navigate(`/Products/category/${promo.targetSlug}`);
//                         }
//                         else {
//                           navigate(`/promotion/${promo.slug}`);
//                         }
//                       }}
//                       style={{
//                         transition: "all 0.3s ease",
//                         // borderRadius: "12px",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {promo.images?.[0] && (
//                         <img
//                           src={promo.images[0]}
//                           alt={promo.title}
//                           className="m-0 p-0  img-fluid"
//                           style={{
//                             height: "auto",
//                             padding: "10px",
//                           }}
//                           onError={(e) => {
//                             console.error(`Image failed to load for promotion: ${promo.title}`);
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}

//                       <div className="pt-3 ps-0">


//                         <div className="page-title-main-name">
//                           <p className="mt-1 mb-3">{promo.title}</p>
//                         </div>

//                         {/* <h6 className="fw-normal mb-2" style={{ fontSize: "15px", lineHeight: "1.3" }}>
//                           {promo.title}
//                         </h6> */}
//                         {/* <p className="text-muted small mb-3" style={{ lineHeight: "1.4" }}>
//                           {promo.description}
//                         </p> */}
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Shade Finder Banner Section */}
//         {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Shade Finder
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "shadeFinder")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div
//                       key={banner._id}
//                       className="margin-left-right h-100 cursor-pointer"
//                       onClick={() => {
//                         if (bannerLink) {
//                           handleLinkNavigation(bannerLink);
//                         } else {
//                           navigate("/shade-finder");
//                         }
//                       }}
//                     >
//                       {bannerImage && (
//                         <img
//                           src={bannerImage}
//                           alt={banner.title}
//                           className="img-fluid"
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}

//         {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {section.title}
//               </h3>
//               {section.products?.length > 4 && (
//                 <button
//                   className="btn btn-link text-decoration-none text-dark page-title-main-name"
//                   onClick={() => navigate(`/section/${section._id}`)}
//                 >
//                   View All
//                 </button>
//               )}
//             </div>

//             {/* SectionSlider with custom breakpoints for this specific section */}
//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 }, // mobile
//                 576: { slidesPerView: 3, spaceBetween: 15 }, // small tablets
//                 768: { slidesPerView: 4, spaceBetween: 20 }, // tablets
//                 1024: { slidesPerView: 4, spaceBetween: 20 }, // desktops
//                 1280: { slidesPerView: 4, spaceBetween: 20 }, // large screens
//               }}
//             >
//               {section.products?.map((prod) => (
//                 <SwiperSlide key={prod._id} className="page-title-main-name">
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         ))}

//         {/* Virtual Try On Banner Section */}

//         {featureBanners?.filter((b) => b.type === "virtualTryOn").length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Virtual Try On
//             </h3>

//             <Swiper
//               modules={[Autoplay, Pagination, Navigation]}
//               spaceBetween={20}
//               slidesPerView={1}
//               pagination={{ clickable: true }}
//               navigation={true}
//               breakpoints={{
//                 320: {
//                   slidesPerView: 1,
//                   spaceBetween: 10,
//                 },
//                 480: {
//                   slidesPerView: 1,
//                   spaceBetween: 15,
//                 },
//                 576: {
//                   slidesPerView: 1,
//                   spaceBetween: 15,
//                 },
//                 768: {
//                   slidesPerView: 1,
//                   spaceBetween: 20,
//                 },
//                 992: {
//                   slidesPerView: 1,
//                   spaceBetween: 20,
//                 },
//                 1200: {
//                   slidesPerView: 1,
//                   spaceBetween: 25,
//                 },
//                 1400: {
//                   slidesPerView: 1,
//                   spaceBetween: 30,
//                 },
//               }}
//               className="virtual-tryon-swiper"
//             >
//               {featureBanners
//                 .filter((banner) => banner.type === "virtualTryOn")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <SwiperSlide key={banner._id}>
//                       <div
//                         className="card border-0 shadow-sm h-100 cursor-pointer mt-lg-3 mt-0"
//                         onClick={() => {
//                           if (bannerLink) {
//                             handleLinkNavigation(bannerLink);
//                           } else {
//                             navigate("/virtual-try-on");
//                           }
//                         }}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid w-100"
//                             style={{
//                               height: "auto",
//                               borderRadius: '12px',
//                               objectFit: 'cover'
//                             }}
//                           />
//                         )}
//                       </div>
//                     </SwiperSlide>
//                   );
//                 })}
//             </Swiper>
//           </section>
//         )}

//         {/* shopByIngredients */}

//         {shopByIngredients?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {shopByIngredientsTitle || "Shop by Ingredients"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={6}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 10 },
//                 768: { slidesPerView: 4, spaceBetween: 12 },
//                 1024: { slidesPerView: 4, spaceBetween: 15 },
//                 1280: { slidesPerView: 4, spaceBetween: 15 },
//               }}
//             >
//               {shopByIngredients.map((ing) => {
//                 // Safe check to prevent errors
//                 if (!ing || !ing.slug) {
//                   console.warn("Invalid ingredient data:", ing);
//                   return null;
//                 }

//                 // ✅ IMPORTANT: We cannot use 'filters' here because it's not defined in CategoryLandingPage
//                 // So we remove the active state for now (or you can pass it as prop later)

//                 return (
//                   <SwiperSlide key={ing._id || ing.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card"
//                       onClick={() => {
//                         if (!ing.slug) {
//                           console.error("Ingredient slug is missing");
//                           return;
//                         }

//                         console.log(`Navigating to ingredient: ${ing.name} (${ing.slug})`);

//                         // Correct navigation → Goes to ProductPage with query param
//                         navigate(`/products/ingredients?ingredients=${encodeURIComponent(ing.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                         // border: "1px solid #ddd",
//                         // background: "#fff",
//                       }}
//                     // onMouseOver={(e) => {
//                     //   e.currentTarget.style.borderColor = "#000";
//                     //   e.currentTarget.style.transform = "translateY(-3px)";
//                     // }}
//                     // onMouseOut={(e) => {
//                     //   e.currentTarget.style.borderColor = "#ddd";
//                     //   e.currentTarget.style.transform = "translateY(0)";
//                     // }}
//                     >
//                       {ing.image && (
//                         <img
//                           src={ing.image}
//                           alt={ing.name}
//                           className="img-fluid rounded"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             console.error(`Image load failed for: ${ing.name}`);
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}

//                       <p className="mt-2 mb-0 small fw-medium page-title-main-name text-start">
//                         {ing.name || "Unknown"}
//                       </p>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* In Focus Section - Slider */}
//         {inFocus?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {inFocusTitle || "In Focus"}
//               </h3>
//             </div>

//             <div>
//               {inFocus.map((product) => (
//                 <div key={product._id} className="bg-color-setup">
//                   <div className="bg-images"></div>
//                   <div className="border-0 row">
//                     <div className="col-lg-4">
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="img-fluid produtc-common-margin-padding"
//                         style={{ borderRadius: "10px", objectFit: "contain" }}
//                       />
//                     </div>

//                     <div className="col-lg-8">
//                       <div className="card-body p-2">
//                         <div className="text-uppercase ms-lg-5 ms-0 mt-lg-5 pt-3 fs-2 ms-lg-0 ms-0  page-title-main-name">
//                           {product.brandName}
//                         </div>

//                         <h6 className="ms-lg-5 ms-0 mt-2 ms-lg-0 playfair-font-bold main-name-font-size">
//                           {product.name}
//                         </h6>

//                         <button
//                           onClick={() => navigate(`/product/${product.slug}`)}
//                           className="bg-transparent page-title-main-name fs-3 cursor-pointer ms-lg-5 ms-0 mt-lg-4 ms-lg-0"
//                           style={{ border: "none" }}
//                         >
//                           Shop Now{" "}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Brands - Slider */}
//         {brands?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {brandsTitle || "Top Brands"}
//               </h3>
//             </div>
//             <SectionSlider slidesPerView={8} spaceBetween={15}>
//               {brands.map((brand) => (
//                 <SwiperSlide key={brand._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/brand/${brand.slug}`)}
//                   >
//                     {brand.thumbnailImage && (
//                       <img
//                         className="img-fluid"
//                         src={brand.thumbnailImage}
//                         alt={brand.name}
//                         style={{}}
//                       />
//                     )}
//                     <div className="mt-2 text-start fs-6 page-title-main-name">
//                       {brand.name}
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Skin Types - Slider */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {skinTypesTitle || "Shop by Skin Type"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={3}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 10 },
//                 768: { slidesPerView: 3, spaceBetween: 15 },
//                 1024: { slidesPerView: 4, spaceBetween: 15 },
//                 1280: { slidesPerView: 4, spaceBetween: 15 },
//               }}
//             >
//               {skinTypes.map((st) => {
//                 // Safeguard against missing data
//                 if (!st || !st.slug) {
//                   console.warn("Invalid skin type data:", st);
//                   return null;
//                 }

//                 return (
//                   <SwiperSlide key={st._id || st.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card"
//                       onClick={() => {
//                         if (!st.slug) return;
//                         // Navigate to product listing filtered by this skin type
//                         navigate(`/products/skintype/${encodeURIComponent(st.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                         // border: "1px solid #ddd",
//                         // background: "#fff",
//                       }}
//                     // onMouseOver={(e) => {
//                     //   e.currentTarget.style.borderColor = "#000";
//                     //   e.currentTarget.style.transform = "translateY(-3px)";
//                     // }}
//                     // onMouseOut={(e) => {
//                     //   e.currentTarget.style.borderColor = "#ddd";
//                     //   e.currentTarget.style.transform = "translateY(0)";
//                     // }}
//                     >
//                       {st.image && (
//                         <img
//                           src={st.image}
//                           alt={st.name}
//                           className="img-fluid rounded"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             console.error(`Image load failed for: ${st.name}`);
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}

//                       {/* <p className="mt-2 mb-0 small fw-medium page-title-main-name text-center">
//                         {st.name || "Unknown"}
//                       </p> */}
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Top Sellers - Slider */}
//         {topSellers?.length > 0 && (
//           <section className="mb-lg-5 mb-3 page-title-main-name padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {topSellersTitle || "Top Sellers"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               autoplay={5}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 }, // mobile
//                 576: { slidesPerView: 3, spaceBetween: 15 }, // small tablets
//                 768: { slidesPerView: 3, spaceBetween: 20 }, // tablets
//                 1024: { slidesPerView: 3, spaceBetween: 20 }, // desktops
//                 1280: { slidesPerView: 4, spaceBetween: 20 }, // large screens
//               }}
//             >
//               {topSellers.map((prod) => (
//                 <SwiperSlide key={prod._id}>
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}
//       </div>
//       <Certificate />

//       <Footer />
//     </>
//   );
// }















// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaHeart,
//   FaRegHeart,
//   FaChevronDown,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css";
// import Bag from "../assets/Bag.svg";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import Certificate from "./Certificate.jsx";

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
//   (
//     v.shadeName ||
//     v.name ||
//     v.size ||
//     v.ml ||
//     v.weight ||
//     "Default"
//   ).toUpperCase();

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

// /**
//  * Custom Section Slider Component
//  * @param {Object} props
//  * @param {React.ReactNode} props.children - SwiperSlide components
//  * @param {number} [props.slidesPerView=4] - Default slides per view (fallback for breakpoints)
//  * @param {number} [props.spaceBetween=20] - Space between slides in px
//  * @param {Object} [props.breakpoints] - Custom breakpoints overriding defaults
//  */
// const SectionSlider = ({
//   children,
//   slidesPerView = 4,
//   spaceBetween = 20,
//   breakpoints = {},
// }) => {
//   const swiperRef = useRef(null);

//   // Default breakpoints (same as your original code)
//   const defaultBreakpoints = {
//     320: { slidesPerView: 2, spaceBetween: 10 },
//     576: { slidesPerView: 3, spaceBetween: 15 },
//     768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
//   };

//   // Merge custom breakpoints with defaults (custom overrides defaults)
//   const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

//   return (
//     <div className="position-relative margintop-sss">
//       <Swiper
//         ref={swiperRef}
//         slidesPerView={1}
//         spaceBetween={spaceBetween}
//         breakpoints={mergedBreakpoints}
//         navigation={false}
//         className="section-slider"
//       >
//         {children}
//       </Swiper>
//     </div>
//   );
// };

// export default function CategoryLandingPage() {
//   const swiperRef = useRef(null);
//   const { slug } = useParams();
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
//     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
//     t.style.cssText = `
//       z-index: 9999;
//       background: ${type === "error" ? "#dc3545" : "#198754"};
//       box-shadow: 0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${API_BASE}/categories/category/${slug}/landing`,
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true },
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
//         const cache = JSON.parse(
//           localStorage.getItem("cartVariantCache") || "{}",
//         );
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//       }

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg =
//         e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* Video play/pause when slide changes */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => { });
//   };

//   /* ========== LINK NAVIGATION HANDLER ========== */
//   const handleLinkNavigation = (link) => {
//     if (!link) return;
//     if (link.startsWith("http://") || link.startsWith("https://")) {
//       window.location.href = link;
//     } else {
//       navigate(link);
//     }
//   };

//   /* ========== RENDER PRODUCT CARD ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col position-relative">
//         {/* Wishlist button */}
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar)
//               toggleWishlist(prod, displayVariant || {});
//           }}
//           disabled={wishlistLoading[prod._id]}
//           className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//           style={{
//             width: "36px",
//             height: "36px",
//             color: inWl ? "#dc3545" : "#6c757d",
//             border: "none",
//             background:'transparent'
//             // boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <span className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <div className="border-0" style={{ height: "auto !important" }}>
//           <img
//             src={img}
//             alt={prod.name}
//             className="card-img-top"
//             style={{ height: "200px", objectFit: "contain", cursor: "pointer" }}
//             onClick={() => navigate(`/product/${slugPr}`)}
//           />

//           <div
//             className="card-body d-flex flex-column p-3"
//             // style={{ height: "235px" }}
//           >
//             <div className="text-muted small mb-1 fw-medium text-start text-uppercase">
//               {getBrandName(prod)}
//             </div>
//             <h5
//               className="card-title fs-6 fw-bold"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${slugPr}`)}
//             >
//               {prod.name}
//             </h5>

//             {hasVar && (
//               <div className="mb-2 mt-2">
//                 {isVariantSelected ? (
//                   <div
//                     className="text-muted small cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span
//                       className="fw-bold text-dark ms-1"
//                       style={{ fontSize: "12px" }}
//                     >
//                       {getVariantDisplayText(displayVariant)}
//                     </span>
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 ) : (
//                   <div
//                     className="small text-muted cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                   >
//                     {vars.length} Variants Available
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 )}

//                 <p className="fw-bold mb-3 mt-2" style={{ fontSize: "16px" }}>
//                   {(() => {
//                     const price =
//                       displayVariant?.displayPrice ||
//                       displayVariant?.discountedPrice ||
//                       prod.price ||
//                       0;
//                     const orig =
//                       displayVariant?.originalPrice ||
//                       displayVariant?.mrp ||
//                       prod.mrp ||
//                       price;
//                     const disc = orig > price;
//                     const pct = disc
//                       ? Math.round(((orig - price) / orig) * 100)
//                       : 0;
//                     return disc ? (
//                       <>
//                         ₹{price}
//                         <span
//                           className="text-decoration-line-through text-muted ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ₹{orig}
//                         </span>
//                         <span
//                           className="text-danger ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ({pct}% OFF)
//                         </span>
//                       </>
//                     ) : (
//                       <>₹{orig}</>
//                     );
//                   })()}
//                 </p>
//               </div>
//             )}

//             {/* Cart button */}
//             <div className="mt-auto">
//               <button
//                 className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"
//                   }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantButton) {
//                     openVariantOverlay(prod._id, "all");
//                   } else {
//                     handleAddToCart(prod);
//                   }
//                 }}
//                 disabled={disabled}
//               >
//                 {isAdding ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {btnText}
//                     {!disabled && !isAdding && !showSelectVariantButton && (
//                       <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div
//             className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ zIndex: 1050 }}
//             onClick={closeVariantOverlay}
//           >
//             <div
//               className="bg-white h-100 rounded-0 overflow-hidden d-flex flex-column"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   className="btn btn-link text-dark text-decoration-none fs-4 p-0"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="d-flex border-bottom">
//                 <button
//                   className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "all"
//                     ? "active text-black border-bottom border-dark border-2"
//                     : "text-muted"
//                     }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "color"
//                       ? "active text-black border-bottom border-dark border-2"
//                       : "text-muted"
//                       }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${selectedVariantType === "text"
//                       ? "active text-white border-bottom border-dark border-2"
//                       : "text-muted"
//                       }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col-lg-4 col-6" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="position-relative mx-auto mb-2"
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {sel && (
//                                   <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small fw-medium">
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small">
//                                   Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="d-flex align-items-center justify-content-center fw-medium"
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small mt-1">
//                                   Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   // if (loading)
//   //   return (
//   //     <>
//   //       <Header />
//   //       <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
//   //         <div className="spinner-border text-dark mb-3" role="status" />
//   //         <p className="text-dark fw-medium">Loading category...</p>
//   //       </div>
//   //       <Footer />
//   //     </>
//   //   );





//   if (loading)
//     return (
//       <div
//         className="d-flex flex-column align-items-center justify-content-center bg-white"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           {/* <div 
//              className="spinner-border text-dark mb-4" 
//              role="status"
//              style={{ 
//                width: "4rem", 
//                height: "4rem",
//                borderWidth: "6px"
//              }}
//            />

//            <h5 className="fw-semibold text-dark mb-2 page-title-main-name">
//              Loading Category
//            </h5> */}


//           {/* <img src={Loader} className="w-100" alt="Image-Not-Found" /> */}

//           <DotLottieReact
//             src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//             loop
//             autoplay
//           />


//           <p className="text-muted mb-0">
//             Please wait while we prepare the best products for you...
//           </p>
//         </div>
//       </div>
//     );


//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3 className="text-danger">Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategoriesTitle,
//     subCategories,
//     promotionsTitle,
//     promotions,
//     brandsTitle,
//     brands,
//     topSellersTitle,
//     topSellers,
//     skinTypesTitle,
//     skinTypes,
//     shopByIngredientsTitle,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     /* NEW SECTION */
//     inFocusTitle,
//     inFocus,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* Custom Styles */}
//       {/* <style>{`
//         .swiper-pagination-bullet {
//           background: #fff !important;
//           opacity: 0.8 !important;
//           border: 1px solid #000 !important;
//         }
//         .swiper-pagination-bullet-active {
//           background: #000 !important;
//           opacity: 1 !important;
//           border-color: #fff !important;
//         }
//         .cursor-pointer {
//           cursor: pointer;
//         }
//       `}</style> */}

//       {/* Hero Banner Slider - now clickable */}
//       {category.bannerImage?.length > 0 && (
//         <section className="hero-slider">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={handleSlideChange}
//             loop
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{
//               clickable: true,
//               bulletClass: 'custom-swiper-bullet',
//               bulletActiveClass: 'custom-swiper-bullet-active',
//             }}
//             navigation
//             speed={800}
//             className="mt-lg-5"
//             style={{ height: "auto", width: "100%" }}
//           >
//             {category.bannerImage.map((banner, index) => {
//               // Gracefully handle both the old string format and the new object format
//               const imgUrl = typeof banner === "string" ? banner : banner.url;
//               const targetLink =
//                 typeof banner === "object" ? banner.link : null;

//               return (
//                 <SwiperSlide key={index} className="mt-5">
//                   <div
//                     className="position-relative w-100 h-100 mt-xl-4 padding-left-rightss"
//                     style={{ cursor: targetLink ? "pointer" : "default" }}
//                     onClick={() =>
//                       targetLink && handleLinkNavigation(targetLink)
//                     }
//                   >
//                     <img
//                       src={imgUrl}
//                       alt={`${category.name} banner ${index + 1}`}
//                       className="w-100 h-100"
//                       style={{ objectFit: "cover" }}
//                     />
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </section>
//       )}

//       {/* Main Content Container */}
//       <div className="container-fluid p-md-5 p-lg-2 py-lg-4 pt-lg-2">
//         {/* Category Title - now clickable */}
//         <div
//           className="mb-0 cursor-pointer"
//           onClick={() => navigate(`/category/${category.slug}`)}
//         >
//           {/* <h1 className="fw-bold p-3 ms-md-0">{category.name}</h1> */}
//         </div>

//         {/* Sub Categories (Top Category) - Slider */}
//         {subCategories?.length > 0 && (
//           <section className="mb padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="top-categories-title mb-0 page-title-main-name fw-normal">
//                 {subCategoriesTitle || "Top Categories"}
//               </h2>
//             </div>
//             <SectionSlider slidesPerView={3} spaceBetween={20}>
//               {subCategories.map((sub) => (
//                 <SwiperSlide key={sub._id}>
//                   <div
//                     className="h-100 border-0 text-center cursor-pointer mt-3"
//                     onClick={() => navigate(`productpage/category/${sub.slug}`)}
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         className="mx-auto mt-3 img-fluid object-fit-contain"
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="mt-3 text-start ms-1 page-title-main-name">
//                         {sub.name}
//                       </h6>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Quiz Banner Section */}
//         {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-5 mt-3">
//               {featureBanners?.find((b) => b.type === "quiz")?.title ||
//                 "Beauty Quiz"}
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "quiz")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div key={banner._id} className="h-100 row mt-lg-4 mt-3">
//                       <div className="col-md-6">
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid banner-image-quiz"
//                             style={{ height: "auto", objectFit: "cover" }}
//                           />
//                         )}
//                       </div>
//                       <div className="col-md-6 d-lg-flex align-items-center">
//                         <div>
//                           <h5 className="card-title fs-4 description-responsive page-title-main-name mt-lg-0 mt-4 ms-lg-5">
//                             {banner.description}
//                           </h5>
//                           {banner.buttonText && (
//                             <p
//                               className="quize-btn mb-0 cursor-pointer mt-2 mt-lg-5 page-title-main-name ms-lg-5"
//                               onClick={() => {
//                                 if (bannerLink) {
//                                   handleLinkNavigation(bannerLink);
//                                 } else {
//                                   navigate("/quiz");
//                                 }
//                               }}
//                             >
//                               {banner.buttonText}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}

//         {/* Promotions (Offers for You) - Fixed Category & Brand Filtering */}
//         {promotions?.length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             <div className="m-0 p-0">
//               <h3 className="p-0 m-0 page-title-main-name fw-normal" style={{
//                 marginLeft: "-10px !important",
//               }}>
//                 {promotionsTitle || "Offers For You"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 1, spaceBetween: 10 },
//                 576: { slidesPerView: 2, spaceBetween: 15 },
//                 768: { slidesPerView: 3, spaceBetween: 20 },
//                 1024: { slidesPerView: 3, spaceBetween: 20 },
//               }}
//             >
//               {promotions.map((promo) => {
//                 const isBrandPromo = promo.scope === "brand" && promo.targetSlug;
//                 const isCategoryPromo = promo.scope === "category" && promo.targetSlug;

//                 return (
//                   <SwiperSlide key={promo._id}>
//                     <div
//                       className="border-0 h-100 cursor-pointer mt-lg-4 mt-3"
//                       onClick={() => {
//                         console.log(`Clicked promotion: ${promo.title} | Scope: ${promo.scope} | Target: ${promo.targetSlug}`);

//                         if (isBrandPromo) {
//                           navigate(`/brand/${promo.targetSlug}`);
//                         }
//                         else if (isCategoryPromo) {
//                           navigate(`/Products/category/${promo.targetSlug}`);
//                         }
//                         else {
//                           navigate(`/promotion/${promo.slug}`);
//                         }
//                       }}
//                       style={{
//                         transition: "all 0.3s ease",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {promo.images?.[0] && (
//                         <img
//                           src={promo.images[0]}
//                           alt={promo.title}
//                           className="m-0 p-0 img-fluid"
//                           style={{
//                             height: "auto",
//                             padding: "10px",
//                           }}
//                           onError={(e) => {
//                             console.error(`Image failed to load for promotion: ${promo.title}`);
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}

//                       <div className="pt-3 ps-0">
//                         <div className="page-title-main-name">
//                           <p className="mt-1 mb-3">{promo.title}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Shade Finder Banner Section */}
//         {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Shade Finder
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "shadeFinder")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div
//                       key={banner._id}
//                       className="margin-left-right h-100 cursor-pointer"
//                       onClick={() => {
//                         if (bannerLink) {
//                           handleLinkNavigation(bannerLink);
//                         } else {
//                           navigate("/shade-finder");
//                         }
//                       }}
//                     >
//                       {bannerImage && (
//                         <img
//                           src={bannerImage}
//                           alt={banner.title}
//                           className="img-fluid"
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}

//         {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {section.title}
//               </h3>
//               {section.products?.length > 4 && (
//                 <button
//                   className="btn btn-link text-decoration-none text-dark page-title-main-name"
//                   onClick={() => navigate(`/section/${section._id}`)}
//                 >
//                   View All
//                 </button>
//               )}
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 1024: { slidesPerView: 4, spaceBetween: 20 },
//                 1280: { slidesPerView: 4, spaceBetween: 20 },
//               }}
//             >
//               {section.products?.map((prod) => (
//                 <SwiperSlide key={prod._id} className="page-title-main-name">
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         ))}

//         {/* Virtual Try On Banner Section */}
//         {featureBanners?.filter((b) => b.type === "virtualTryOn").length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Virtual Try On
//             </h3>

//             <Swiper
//               modules={[Autoplay, Pagination, Navigation]}
//               spaceBetween={20}
//               slidesPerView={1}
//               pagination={{
//                 clickable: true,
//                 bulletClass: 'custom-swiper-bullet',
//                 bulletActiveClass: 'custom-swiper-bullet-active',
//               }}
//               navigation={true}
//               breakpoints={{
//                 320: { slidesPerView: 1, spaceBetween: 10 },
//                 480: { slidesPerView: 1, spaceBetween: 15 },
//                 576: { slidesPerView: 1, spaceBetween: 15 },
//                 768: { slidesPerView: 1, spaceBetween: 20 },
//                 992: { slidesPerView: 1, spaceBetween: 20 },
//                 1200: { slidesPerView: 1, spaceBetween: 25 },
//                 1400: { slidesPerView: 1, spaceBetween: 30 },
//               }}
//               className="virtual-tryon-swiper"
//             >
//               {featureBanners
//                 .filter((banner) => banner.type === "virtualTryOn")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <SwiperSlide key={banner._id}>
//                       <div
//                         className="card border-0 shadow-sm h-100 cursor-pointer mt-lg-3 mt-0"
//                         onClick={() => {
//                           if (bannerLink) {
//                             handleLinkNavigation(bannerLink);
//                           } else {
//                             navigate("/virtual-try-on");
//                           }
//                         }}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid w-100"
//                             style={{
//                               height: "auto",
//                               borderRadius: '12px',
//                               objectFit: 'cover'
//                             }}
//                           />
//                         )}
//                       </div>
//                     </SwiperSlide>
//                   );
//                 })}
//             </Swiper>
//           </section>
//         )}

//         {/* shopByIngredients - FIXED NAVIGATION */}
//         {shopByIngredients?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {shopByIngredientsTitle || "Shop by Ingredients"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={6}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 10 },
//                 768: { slidesPerView: 4, spaceBetween: 12 },
//                 1024: { slidesPerView: 4, spaceBetween: 15 },
//                 1280: { slidesPerView: 4, spaceBetween: 15 },
//               }}
//             >
//               {shopByIngredients.map((ing) => {
//                 if (!ing || !ing.slug) {
//                   console.warn("Invalid ingredient data:", ing);
//                   return null;
//                 }

//                 return (
//                   <SwiperSlide key={ing._id || ing.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card"
//                       onClick={() => {
//                         if (!ing.slug) {
//                           console.error("Ingredient slug is missing");
//                           return;
//                         }
//                         console.log(`Navigating to ingredient: ${ing.name} (${ing.slug})`);
//                         // ✅ FIX: Navigate to products with query parameter instead of path
//                         navigate(`/products?ingredients=${encodeURIComponent(ing.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                       }}
//                     >
//                       {ing.image && (
//                         <img
//                           src={ing.image}
//                           alt={ing.name}
//                           className="img-fluid rounded"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             console.error(`Image load failed for: ${ing.name}`);
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}
//                       <p className="mt-2 mb-0 small fw-medium page-title-main-name text-center">
//                         {ing.name || "Unknown"}
//                       </p>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* In Focus Section - Slider */}
//         {inFocus?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {inFocusTitle || "In Focus"}
//               </h3>
//             </div>

//             <div>
//               {inFocus.map((product) => (
//                 <div key={product._id} className="bg-color-setup">
//                   <div className="bg-images"></div>
//                   <div className="border-0 row">
//                     <div className="col-lg-4">
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="img-fluid produtc-common-margin-padding"
//                         style={{ borderRadius: "10px", objectFit: "contain" }}
//                       />
//                     </div>

//                     <div className="col-lg-8">
//                       <div className="card-body p-2">
//                         <div className="text-uppercase ms-lg-5 ms-0 mt-lg-5 pt-3 fs-2 ms-lg-0 ms-0 page-title-main-name">
//                           {product.brandName}
//                         </div>

//                         <h6 className="ms-lg-5 ms-0 mt-2 ms-lg-0 playfair-font-bold main-name-font-size">
//                           {product.name}
//                         </h6>

//                         <button
//                           onClick={() => navigate(`/product/${product.slug}`)}
//                           className="bg-transparent page-title-main-name fs-3 cursor-pointer ms-lg-5 ms-0 mt-lg-4 ms-lg-0"
//                           style={{ border: "none" }}
//                         >
//                           Shop Now{" "}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Brands - Slider */}
//         {brands?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {brandsTitle || "Top Brands"}
//               </h3>
//             </div>
//             <SectionSlider slidesPerView={8} spaceBetween={15}>
//               {brands.map((brand) => (
//                 <SwiperSlide key={brand._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/brand/${brand.slug}`)}
//                   >
//                     {brand.thumbnailImage && (
//                       <img
//                         className="img-fluid"
//                         src={brand.thumbnailImage}
//                         alt={brand.name}
//                         style={{}}
//                       />
//                     )}
//                     <div className="mt-2 text-start fs-6 page-title-main-name">
//                       {brand.name}
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Skin Types - Slider - FIXED NAVIGATION */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {skinTypesTitle || "Shop by Skin Type"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={3}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 10 },
//                 768: { slidesPerView: 3, spaceBetween: 15 },
//                 1024: { slidesPerView: 4, spaceBetween: 15 },
//                 1280: { slidesPerView: 4, spaceBetween: 15 },
//               }}
//             >
//               {skinTypes.map((st) => {
//                 if (!st || !st.slug) {
//                   console.warn("Invalid skin type data:", st);
//                   return null;
//                 }

//                 return (
//                   <SwiperSlide key={st._id || st.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card"
//                       onClick={() => {
//                         if (!st.slug) return;
//                         // ✅ FIX: Navigate to products with query parameter
//                         navigate(`/products?skinTypes=${encodeURIComponent(st.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                       }}
//                     >
//                       {st.image && (
//                         <img
//                           src={st.image}
//                           alt={st.name}
//                           className="img-fluid rounded"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             console.error(`Image load failed for: ${st.name}`);
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}
//                       <p className="mt-2 mb-0 small fw-medium page-title-main-name text-center">
//                         {st.name || "Unknown"}
//                       </p>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Top Sellers - Slider */}
//         {topSellers?.length > 0 && (
//           <section className="mb-lg-5 mb-3 page-title-main-name padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {topSellersTitle || "Top Sellers"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               autoplay={5}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 1024: { slidesPerView: 4, spaceBetween: 20 },
//                 1280: { slidesPerView: 4, spaceBetween: 20 },
//               }}
//             >
//               {topSellers.map((prod) => (
//                 <SwiperSlide key={prod._id}>
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}
//       </div>
//       <Certificate />

//       <Footer />
//     </>
//   );
// }


























// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaHeart,
//   FaRegHeart,
//   FaChevronDown,
//   FaChevronLeft,
//   FaChevronRight,
//   FaTimes,
// } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css";
// import Bag from "../assets/Bag.svg";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import Certificate from "./Certificate.jsx";

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
//   (
//     v.shadeName ||
//     v.name ||
//     v.size ||
//     v.ml ||
//     v.weight ||
//     "Default"
//   ).toUpperCase();

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

// /**
//  * Custom Section Slider Component
//  */
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
//     768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
//   };

//   const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

//   return (
//     <div className="position-relative margintop-sss">
//       <Swiper
//         ref={swiperRef}
//         slidesPerView={1}
//         spaceBetween={spaceBetween}
//         breakpoints={mergedBreakpoints}
//         navigation={false}
//         className="section-slider"
//       >
//         {children}
//       </Swiper>
//     </div>
//   );
// };

// // ===================== OUT OF STOCK POPUP COMPONENT =====================
// const OutOfStockPopup = ({ isOpen, onClose, productName }) => {
//   if (!isOpen) return null;

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         zIndex: 9999,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           backgroundColor: '#fff',
//           borderRadius: '12px',
//           padding: '30px 40px',
//           maxWidth: '400px',
//           width: '90%',
//           textAlign: 'center',
//           boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
//           position: 'relative',
//           animation: 'popupSlideIn 0.3s ease-out',
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           style={{
//             position: 'absolute',
//             top: '10px',
//             right: '15px',
//             background: 'none',
//             border: 'none',
//             fontSize: '24px',
//             cursor: 'pointer',
//             color: '#666',
//           }}
//         >
//           <FaTimes />
//         </button>

//         <div
//           style={{
//             width: '60px',
//             height: '60px',
//             backgroundColor: '#fee2e2',
//             borderRadius: '50%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             margin: '0 auto 15px',
//           }}
//         >
//           <FaTimes
//             style={{
//               color: '#dc3545',
//               fontSize: '30px',
//             }}
//           />
//         </div>

//         <h5
//           className="page-title-main-name"
//           style={{
//             fontSize: '18px',
//             fontWeight: 600,
//             marginBottom: '10px',
//             color: '#333',
//           }}
//         >
//           Out of Stock
//         </h5>

//         <p
//           style={{
//             fontSize: '14px',
//             color: '#666',
//             marginBottom: '20px',
//           }}
//         >
//           "Oops! {productName} is out of stock right now. Check back soon or discover similar items."
//         </p>

//         <button
//           onClick={onClose}
//           className="btn btn-dark w-100"
//           style={{
//             borderRadius: '8px',
//             padding: '10px',
//           }}
//         >
//           Got it
//         </button>
//       </div>
//       <style>{`
//         @keyframes popupSlideIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default function CategoryLandingPage() {
//   const swiperRef = useRef(null);
//   const { slug } = useParams();
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

//   // ===================== OUT OF STOCK POPUP STATE =====================
//   const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
//   const [outOfStockProductName, setOutOfStockProductName] = useState("");

//   /* ---------- Toast ---------- */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
//     t.style.cssText = `
//       z-index: 9999;
//       background: ${type === "error" ? "#dc3545" : "#198754"};
//       box-shadow: 0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   // ===================== OUT OF STOCK POPUP HANDLER =====================
//   const handleOutOfStockClick = (productName) => {
//     setOutOfStockProductName(productName || "This product");
//     setShowOutOfStockPopup(true);

//     // Auto hide after 3 seconds
//     setTimeout(() => {
//       setShowOutOfStockPopup(false);
//     }, 3000);
//   };

//   const closeOutOfStockPopup = () => {
//     setShowOutOfStockPopup(false);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${API_BASE}/categories/category/${slug}/landing`,
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true },
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
//         const cache = JSON.parse(
//           localStorage.getItem("cartVariantCache") || "{}",
//         );
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//       }

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg =
//         e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* Video play/pause when slide changes */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => { });
//   };

//   /* ========== LINK NAVIGATION HANDLER ========== */
//   const handleLinkNavigation = (link) => {
//     if (!link) return;
//     if (link.startsWith("http://") || link.startsWith("https://")) {
//       window.location.href = link;
//     } else {
//       navigate(link);
//     }
//   };

//   /* ========== CHECK IF PRODUCT IS COMPLETELY OUT OF STOCK ========== */
//   const isCompletelyOutOfStock = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     if (vars.length === 0) {
//       return (prod.stock || 0) <= 0;
//     }
//     return vars.every(v => (v.stock || 0) <= 0);
//   };

//   /* ========== RENDER PRODUCT CARD ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
    
//     // Check out of stock status
//     const completelyOutOfStock = isCompletelyOutOfStock(prod);
//     const currentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
    
//     // Show out of stock if completely out OR (has variants but none selected and current is out)
//     const showOutOfStock = completelyOutOfStock || (hasVar && currentVariantOutOfStock && !isVariantSelected);
    
//     const showSelectVariantButton = hasVar && !isVariantSelected && !completelyOutOfStock;
//     const disabled = isAdding || (showOutOfStock ? false : (!showSelectVariantButton && currentVariantOutOfStock));

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showOutOfStock) btnText = "Out of Stock";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (currentVariantOutOfStock) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col position-relative">
//         {/* Wishlist button - Hidden when out of stock */}
//         {!showOutOfStock && (
//           <button
//             onClick={() => {
//               if (displayVariant || !hasVar)
//                 toggleWishlist(prod, displayVariant || {});
//             }}
//             disabled={wishlistLoading[prod._id]}
//             className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//             style={{
//               width: "36px",
//               height: "36px",
//               color: inWl ? "#dc3545" : "#6c757d",
//               border: "none",
//               background: 'transparent'
//             }}
//             title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             {wishlistLoading[prod._id] ? (
//               <span className="spinner-border spinner-border-sm" role="status" />
//             ) : inWl ? (
//               <FaHeart />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>
//         )}

//         <div className="border-0" style={{ height: "auto !important" }}>
//           <div
//             style={{ position: 'relative', cursor: showOutOfStock ? 'pointer' : 'pointer' }}
//             onClick={() => {
//               if (showOutOfStock) {
//                 handleOutOfStockClick(prod.name);
//               } else {
//                 navigate(`/product/${slugPr}`);
//               }
//             }}
//           >
//             <img
//               src={img}
//               alt={prod.name}
//               className="card-img-top"
//               style={{
//                 height: "200px",
//                 objectFit: "contain",
//                 opacity: showOutOfStock ? 0.6 : 1,
//                 filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
//               }}
//             />

//             {/* OUT OF STOCK OVERLAY */}
//             {showOutOfStock && (
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                   backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 3,
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: '#dc3545',
//                     color: '#fff',
//                     padding: '8px 16px',
//                     borderRadius: '20px',
//                     fontSize: '14px',
//                     fontWeight: 600,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '5px',
//                   }}
//                 >
//                   <FaTimes />
//                   Out of Stock
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="card-body d-flex flex-column p-3">
//             <div className="text-muted small mb-1 fw-medium text-start text-uppercase">
//               {getBrandName(prod)}
//             </div>
//             <h5
//               className="card-title fs-6 fw-bold"
//               style={{
//                 cursor: 'pointer',
//                 opacity: showOutOfStock ? 0.6 : 1,
//               }}
//               onClick={() => {
//                 if (showOutOfStock) {
//                   handleOutOfStockClick(prod.name);
//                 } else {
//                   navigate(`/product/${slugPr}`);
//                 }
//               }}
//             >
//               {prod.name}
//             </h5>

//             {hasVar && !showOutOfStock && (
//               <div className="mb-2 mt-2">
//                 {isVariantSelected ? (
//                   <div
//                     className="text-muted small cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span
//                       className="fw-bold text-dark ms-1"
//                       style={{ fontSize: "12px" }}
//                     >
//                       {getVariantDisplayText(displayVariant)}
//                     </span>
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 ) : (
//                   <div
//                     className="small text-muted cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                   >
//                     {vars.length} Variants Available
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Show out of stock message in variant area */}
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

//             <p className="fw-bold mb-3 mt-2" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price =
//                   displayVariant?.displayPrice ||
//                   displayVariant?.discountedPrice ||
//                   prod.price ||
//                   0;
//                 const orig =
//                   displayVariant?.originalPrice ||
//                   displayVariant?.mrp ||
//                   prod.mrp ||
//                   price;
//                 const disc = orig > price;
//                 const pct = disc
//                   ? Math.round(((orig - price) / orig) * 100)
//                   : 0;
//                 return (
//                   <span
//                     style={{
//                       textDecoration: showOutOfStock ? 'line-through' : 'none',
//                       opacity: showOutOfStock ? 0.6 : 1,
//                     }}
//                   >
//                     {disc ? (
//                       <>
//                         ₹{price}
//                         <span
//                           className="text-decoration-line-through text-muted ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ₹{orig}
//                         </span>
//                         <span
//                           className="text-danger ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ({pct}% OFF)
//                         </span>
//                       </>
//                     ) : (
//                       <>₹{orig}</>
//                     )}
//                   </span>
//                 );
//               })()}
//             </p>

//             {/* Cart button */}
//             <div className="mt-auto">
//               <button
//                 className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${
//                   showOutOfStock
//                     ? "btn-secondary"
//                     : isAdding
//                       ? "btn-dark"
//                       : "btn-outline-dark"
//                 }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showOutOfStock) {
//                     handleOutOfStockClick(prod.name);
//                   } else if (showSelectVariantButton) {
//                     openVariantOverlay(prod._id, "all");
//                   } else {
//                     handleAddToCart(prod);
//                   }
//                 }}
//                 disabled={disabled && !showOutOfStock}
//                 style={{
//                   opacity: showOutOfStock ? 0.8 : 1,
//                   cursor: showOutOfStock ? 'pointer' : (disabled ? 'not-allowed' : 'pointer'),
//                 }}
//               >
//                 {isAdding ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Adding...
//                   </>
//                 ) : showOutOfStock ? (
//                   <>
//                     <FaTimes style={{ fontSize: '14px' }} />
//                     Out of Stock
//                   </>
//                 ) : (
//                   <>
//                     {btnText}
//                     {!disabled && !isAdding && !showSelectVariantButton && (
//                       <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay - Only show if not completely out of stock */}
//         {showVariantOverlay === prod._id && !showOutOfStock && (
//           <div
//             className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ zIndex: 1050 }}
//             onClick={closeVariantOverlay}
//           >
//             <div
//               className="bg-white h-100 rounded-0 overflow-hidden d-flex flex-column"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   className="btn btn-link text-dark text-decoration-none fs-4 p-0"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="d-flex border-bottom">
//                 <button
//                   className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                     selectedVariantType === "all"
//                       ? "active text-black border-bottom border-dark border-2"
//                       : "text-muted"
//                   }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                       selectedVariantType === "color"
//                         ? "active text-black border-bottom border-dark border-2"
//                         : "text-muted"
//                     }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                       selectedVariantType === "text"
//                         ? "active text-black border-bottom border-dark border-2"
//                         : "text-muted"
//                     }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col-lg-4 col-6" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="position-relative mx-auto mb-2"
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {sel && (
//                                   <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small fw-medium">
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small">
//                                   <FaTimes style={{ fontSize: '10px' }} /> Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="d-flex align-items-center justify-content-center fw-medium"
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small mt-1">
//                                   <FaTimes style={{ fontSize: '10px' }} /> Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   if (loading)
//     return (
//       <div
//         className="d-flex flex-column align-items-center justify-content-center bg-white"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           <DotLottieReact
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

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3 className="text-danger">Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategoriesTitle,
//     subCategories,
//     promotionsTitle,
//     promotions,
//     brandsTitle,
//     brands,
//     topSellersTitle,
//     topSellers,
//     skinTypesTitle,
//     skinTypes,
//     shopByIngredientsTitle,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     inFocusTitle,
//     inFocus,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* ===================== OUT OF STOCK POPUP ===================== */}
//       <OutOfStockPopup
//         isOpen={showOutOfStockPopup}
//         onClose={closeOutOfStockPopup}
//         productName={outOfStockProductName}
//       />

//       {/* Hero Banner Slider */}
//       {category.bannerImage?.length > 0 && (
//         <section className="hero-slider">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={handleSlideChange}
//             loop
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{
//               clickable: true,
//               bulletClass: 'custom-swiper-bullet',
//               bulletActiveClass: 'custom-swiper-bullet-active',
//             }}
//             navigation
//             speed={800}
//             className="mt-lg-5"
//             style={{ height: "auto", width: "100%" }}
//           >
//             {category.bannerImage.map((banner, index) => {
//               const imgUrl = typeof banner === "string" ? banner : banner.url;
//               const targetLink =
//                 typeof banner === "object" ? banner.link : null;

//               return (
//                 <SwiperSlide key={index} className="">
//                   <div
//                     className="position-relative w-100 h-100 mt-xl-4 mt-3 padding-left-rightss"
//                     style={{ cursor: targetLink ? "pointer" : "default" }}
//                     onClick={() =>
//                       targetLink && handleLinkNavigation(targetLink)
//                     }
//                   >
//                     <img
//                       src={imgUrl}
//                       alt={`${category.name} banner ${index + 1}`}
//                       className="slide-media hero-slider-image-responsive mt-5 pt-0"
//                       style={{ minheight:'560px' }}
//                     />
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </section>
//       )}

//       {/* Main Content Container */}
//       <div className="container-fluid p-md-5 p-lg-2 py-lg-4 ps-4 px-4 pt-lg-2">
//         {/* Category Title */}
//         <div
//           className="mb-0 cursor-pointer"
//           onClick={() => navigate(`/category/${category.slug}`)}
//         >
//         </div>

//         {/* Sub Categories (Top Category) - Slider */}
//         {subCategories?.length > 0 && (
//           <section className="mb padding-left-right-sub-category">
//             <div className="mt-3 d-flex justify-content-between align-items-center">
//               <h2 className="top-categories-title mb-0 page-title-main-name fw-normal">
//                 {subCategoriesTitle || "Top Categories"}
//               </h2>
//             </div>
//             <SectionSlider slidesPerView={3} spaceBetween={10}>
//               {subCategories.map((sub) => (
//                 <SwiperSlide key={sub._id}>
//                   <div
//                     className="h-100 border-0 text-center cursor-pointer mt-1"
//                     onClick={() => navigate(`productpage/category/${sub.slug}`)}
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         className="mx-auto mt-3 img-fluid object-fit-contain"
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="mt-3 text-start ms-1 page-title-main-name">
//                         {sub.name}
//                       </h6>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Quiz Banner Section */}
//         {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-5 mt-3">
//               {featureBanners?.find((b) => b.type === "quiz")?.title ||
//                 "Beauty Quiz"}
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "quiz")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div key={banner._id} className="h-100 row mt-lg-4 mt-3">
//                       <div className="col-md-6">
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid banner-image-quiz"
//                             style={{ height: "auto", objectFit: "cover" }}
//                           />
//                         )}
//                       </div>
//                       <div className="col-md-6 d-lg-flex align-items-center">
//                         <div>
//                           <h5 className="card-title fs-4 description-responsive description-responsivess page-title-main-name mt-lg-0 mt-4 ms-lg-5 ">
//                             {banner.description}
//                           </h5>
//                           {banner.buttonText && (
//                             <p
//                               className="quize-btn mb-0 cursor-pointer mt-2 mt-lg-5 page-title-main-name ms-lg-5 ms-0 mt-4 quize-btn-responsive"
//                               onClick={() => {
//                                 if (bannerLink) {
//                                   handleLinkNavigation(bannerLink);
//                                 } else {
//                                   navigate("/quiz");
//                                 }
//                               }}
//                             >
//                               {banner.buttonText}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}

//         {/* Promotions (Offers for You) */}
//         {promotions?.length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             <div className="m-0 p-0">
//               <h3 className="top-categories-title p-0 m-0 page-title-main-name fw-normal mt-4" style={{
//                 marginLeft: "-10px !important",
//               }}>
//                 {promotionsTitle || "Offers For You"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 1, spaceBetween: 10 },
//                 576: { slidesPerView: 2, spaceBetween: 15 },
//                 768: { slidesPerView: 3, spaceBetween: 20 },
//                 1024: { slidesPerView: 3, spaceBetween: 20 },
//               }}
//             >
//               {promotions.map((promo) => {
//                 const isBrandPromo = promo.scope === "brand" && promo.targetSlug;
//                 const isCategoryPromo = promo.scope === "category" && promo.targetSlug;

//                 return (
//                   <SwiperSlide key={promo._id}>
//                     <div
//                       className="border-0 h-100 cursor-pointer mt-lg-4 mt-3"
//                       onClick={() => {
//                         if (isBrandPromo) {
//                           navigate(`/brand/${promo.targetSlug}`);
//                         } else if (isCategoryPromo) {
//                           navigate(`/Products/category/${promo.targetSlug}`);
//                         } else {
//                           navigate(`/promotion/${promo.slug}`);
//                         }
//                       }}
//                       style={{
//                         transition: "all 0.3s ease",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {promo.images?.[0] && (
//                         <img
//                           src={promo.images[0]}
//                           alt={promo.title}
//                           className="m-0 p-0 img-fluid mt-lg-0 mt-1"
//                           style={{
//                             height: "auto",
//                             padding: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}

//                       <div className="pt-3 ps-0">
//                         <div className="page-title-main-name">
//                           <p className="mb-3">{promo.title}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Shade Finder Banner Section */}
//         {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Shade Finder
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "shadeFinder")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div
//                       key={banner._id}
//                       className="margin-left-right h-100 cursor-pointer"
//                       onClick={() => {
//                         if (bannerLink) {
//                           handleLinkNavigation(bannerLink);
//                         } else {
//                           navigate("/shade-finder");
//                         }
//                       }}
//                     >
//                       {bannerImage && (
//                         <img
//                           src={bannerImage}
//                           alt={banner.title}
//                           className="img-fluid"
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}

//         {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {section.title}
//               </h3>
//               {section.products?.length > 4 && (
//                 <button
//                   className="btn btn-link text-decoration-none text-dark page-title-main-name"
//                   onClick={() => navigate(`/section/${section._id}`)}
//                 >
//                   View All
//                 </button>
//               )}
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 1024: { slidesPerView: 4, spaceBetween: 20 },
//                 1280: { slidesPerView: 4, spaceBetween: 20 },
//               }}
//             >
//               {section.products?.map((prod) => (
//                 <SwiperSlide key={prod._id} className="page-title-main-name">
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         ))}

//         {/* Virtual Try On Banner Section */}
//         {featureBanners?.filter((b) => b.type === "virtualTryOn").length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Virtual Try On
//             </h3>

//             <Swiper
//               modules={[Autoplay, Pagination, Navigation]}
//               spaceBetween={20}
//               slidesPerView={1}
//               pagination={{
//                 clickable: true,
//                 bulletClass: 'custom-swiper-bullet',
//                 bulletActiveClass: 'custom-swiper-bullet-active',
//               }}
//               navigation={true}
//               breakpoints={{
//                 320: { slidesPerView: 1, spaceBetween: 10 },
//                 480: { slidesPerView: 1, spaceBetween: 15 },
//                 576: { slidesPerView: 1, spaceBetween: 15 },
//                 768: { slidesPerView: 1, spaceBetween: 20 },
//                 992: { slidesPerView: 1, spaceBetween: 20 },
//                 1200: { slidesPerView: 1, spaceBetween: 25 },
//                 1400: { slidesPerView: 1, spaceBetween: 30 },
//               }}
//               className="virtual-tryon-swiper"
//             >
//               {featureBanners
//                 .filter((banner) => banner.type === "virtualTryOn")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <SwiperSlide key={banner._id}>
//                       <div
//                         className="card border-0 shadow-sm h-100 cursor-pointer mt-lg-3 mt-0"
//                         onClick={() => {
//                           if (bannerLink) {
//                             handleLinkNavigation(bannerLink);
//                           } else {
//                             navigate("/virtual-try-on");
//                           }
//                         }}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid w-100"
//                             style={{
//                               height: "auto",
//                               borderRadius: '12px',
//                               objectFit: 'cover'
//                             }}
//                           />
//                         )}
//                       </div>
//                     </SwiperSlide>
//                   );
//                 })}
//             </Swiper>
//           </section>
//         )}

//         {/* shopByIngredients - FIXED NAVIGATION */}
//         {shopByIngredients?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-1">
//               <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-0 mt-3">
//                 {shopByIngredientsTitle || "Shop by Ingredients"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={6}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 12 },
//                 576: { slidesPerView: 3, spaceBetween: 12 },
//                 768: { slidesPerView: 4, spaceBetween: 12 },
//                 1024: { slidesPerView: 4, spaceBetween: 10 },
//                 1280: { slidesPerView: 4, spaceBetween: 10 },
//               }}
//             >
//               {shopByIngredients.map((ing) => {
//                 if (!ing || !ing.slug) {
//                   return null;
//                 }

//                 return (
//                   <SwiperSlide key={ing._id || ing.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card mt-3 p-0 "
//                       onClick={() => {
//                         if (!ing.slug) return;
//                         navigate(`/products?ingredients=${encodeURIComponent(ing.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                       }}
//                     >
//                       {ing.image && (
//                         <img
//                           src={ing.image}
//                           alt={ing.name}
//                           className="img-fluid"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}
//                       <p className="mt-2 mb-0 small fw-medium page-title-main-name text-start ms-1">
//                         {ing.name || "Unknown"}
//                       </p>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* In Focus Section - Slider */}
//         {inFocus?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {inFocusTitle || "In Focus"}
//               </h3>
//             </div>

//             <div>
//               {inFocus.map((product) => (
//                 <div key={product._id} className="bg-color-setup">
//                   <div className="bg-images"></div>
//                   <div className="border-0 row">
//                     <div className="col-lg-4">
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="img-fluid produtc-common-margin-padding"
//                         style={{ borderRadius: "10px", objectFit: "contain" }}
//                       />
//                     </div>

//                     <div className="col-lg-8">
//                       <div className="card-body p-2">
//                         <div className="text-uppercase ms-lg-5 ms-0 mt-lg-5 pt-3 fs-2 ms-lg-0 ms-0 page-title-main-name ">
//                           {product.brandName}
//                         </div>

//                         <h6 className="ms-lg-5 ms-0 mt-2 ms-lg-0 playfair-font-bold main-name-font-size">
//                           {product.name}
//                         </h6>

//                         <button
//                           onClick={() => navigate(`/product/${product.slug}`)}
//                           className="bg-transparent page-title-main-name fs-3 cursor-pointer ms-lg-5 ms-0 mt-lg-5 ms-lg-0"
//                           style={{ border: "none" }}
//                         >
//                           SHOP NOW{" "}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Brands - Slider */}
//         {brands?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {brandsTitle || "Top Brands"}
//               </h3>
//             </div>
//             <SectionSlider slidesPerView={8} spaceBetween={15}>
//               {brands.map((brand) => (
//                 <SwiperSlide key={brand._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/brand/${brand.slug}`)}
//                   >
//                     {brand.thumbnailImage && (
//                       <img
//                         className="img-fluid"
//                         src={brand.thumbnailImage}
//                         alt={brand.name}
//                       />
//                     )}
//                     <div className="mt-2 text-start fs-6 page-title-main-name">
//                       {brand.name}
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Skin Types - Slider - FIXED NAVIGATION */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {skinTypesTitle || "Shop by Skin Type"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={3}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 10 },
//                 768: { slidesPerView: 3, spaceBetween: 15 },
//                 1024: { slidesPerView: 4, spaceBetween: 15 },
//                 1280: { slidesPerView: 4, spaceBetween: 15 },
//               }}
//             >
//               {skinTypes.map((st) => {
//                 if (!st || !st.slug) {
//                   return null;
//                 }

//                 return (
//                   <SwiperSlide key={st._id || st.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card"
//                       onClick={() => {
//                         if (!st.slug) return;
//                         navigate(`/products?skinTypes=${encodeURIComponent(st.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                       }}
//                     >
//                       {st.image && (
//                         <img
//                           src={st.image}
//                           alt={st.name}
//                           className="img-fluid rounded"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}
//                       {/* <p className="mt-2 mb-0 small fw-medium page-title-main-name text-center">
//                         {st.name || "Unknown"}
//                       </p> */}
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Top Sellers - Slider */}
//         {topSellers?.length > 0 && (
//           <section className="mb-lg-5 mb-3 page-title-main-name padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {topSellersTitle || "Top Sellers"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               autoplay={5}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 1024: { slidesPerView: 4, spaceBetween: 20 },
//                 1280: { slidesPerView: 4, spaceBetween: 20 },
//               }}
//             >
//               {topSellers.map((prod) => (
//                 <SwiperSlide key={prod._id}>
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}
//       </div>
//       <Certificate />

//       <Footer />
//     </>
//   );
// }















// // CategoryLandingPage.jsx
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaHeart,
//   FaRegHeart,
//   FaChevronDown,
//   FaChevronLeft,
//   FaChevronRight,
//   FaTimes,
// } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import "../css/CategoryLandingPage.css";
// import Bag from "../assets/Bag.svg";

// // Import Swiper and its styles
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import Certificate from "./Certificate.jsx";

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
//   (
//     v.shadeName ||
//     v.name ||
//     v.size ||
//     v.ml ||
//     v.weight ||
//     "Default"
//   ).toUpperCase();

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

// /**
//  * Custom Section Slider Component
//  */
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
//     768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
//   };

//   const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

//   return (
//     <div className="position-relative margintop-sss">
//       <Swiper
//         ref={swiperRef}
//         slidesPerView={1}
//         spaceBetween={spaceBetween}
//         breakpoints={mergedBreakpoints}
//         navigation={false}
//         className="section-slider"
//       >
//         {children}
//       </Swiper>
//     </div>
//   );
// };

// // ===================== OUT OF STOCK POPUP COMPONENT =====================
// const OutOfStockPopup = ({ isOpen, onClose, productName }) => {
//   if (!isOpen) return null;

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         zIndex: 9999,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           backgroundColor: '#fff',
//           borderRadius: '12px',
//           padding: '30px 40px',
//           maxWidth: '400px',
//           width: '90%',
//           textAlign: 'center',
//           boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
//           position: 'relative',
//           animation: 'popupSlideIn 0.3s ease-out',
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           style={{
//             position: 'absolute',
//             top: '10px',
//             right: '15px',
//             background: 'none',
//             border: 'none',
//             fontSize: '24px',
//             cursor: 'pointer',
//             color: '#666',
//           }}
//         >
//           <FaTimes />
//         </button>

//         <div
//           style={{
//             width: '60px',
//             height: '60px',
//             backgroundColor: '#fee2e2',
//             borderRadius: '50%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             margin: '0 auto 15px',
//           }}
//         >
//           <FaTimes
//             style={{
//               color: '#dc3545',
//               fontSize: '30px',
//             }}
//           />
//         </div>

//         <h5
//           className="page-title-main-name"
//           style={{
//             fontSize: '18px',
//             fontWeight: 600,
//             marginBottom: '10px',
//             color: '#333',
//           }}
//         >
//           Out of Stock
//         </h5>

//         <p
//           style={{
//             fontSize: '14px',
//             color: '#666',
//             marginBottom: '20px',
//           }}
//         >
//           "Oops! {productName} is out of stock right now. Check back soon or discover similar items."
//         </p>

//         <button
//           onClick={onClose}
//           className="btn btn-dark w-100"
//           style={{
//             borderRadius: '8px',
//             padding: '10px',
//           }}
//         >
//           Got it
//         </button>
//       </div>
//       <style>{`
//         @keyframes popupSlideIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default function CategoryLandingPage() {
//   const swiperRef = useRef(null);
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   // ========== ADDED: Effective slug for handling nested routes ==========
//   const effectiveSlug = slug?.includes("/")
//     ? slug.split("/").pop()
//     : slug;
//   // ========== END ADDED ==========

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

//   // ===================== OUT OF STOCK POPUP STATE =====================
//   const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
//   const [outOfStockProductName, setOutOfStockProductName] = useState("");

//   /* ---------- Toast ---------- */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
//     t.style.cssText = `
//       z-index: 9999;
//       background: ${type === "error" ? "#dc3545" : "#198754"};
//       box-shadow: 0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   // ===================== OUT OF STOCK POPUP HANDLER =====================
//   const handleOutOfStockClick = (productName) => {
//     setOutOfStockProductName(productName || "This product");
//     setShowOutOfStockPopup(true);

//     // Auto hide after 3 seconds
//     setTimeout(() => {
//       setShowOutOfStockPopup(false);
//     }, 3000);
//   };

//   const closeOutOfStockPopup = () => {
//     setShowOutOfStockPopup(false);
//   };

//   /* ========== FETCH LANDING DATA ========== */
//   useEffect(() => {
//     const fetchLandingData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           // ========== OLD CODE (REPLACED) ==========
//           // `${API_BASE}/categories/category/${slug}/landing`,
//           // ========== NEW CODE ==========
//           `${API_BASE}/categories/category/${effectiveSlug}/landing`,
//           // ========== END REPLACEMENT ==========
//         );
//         setData(data);
//       } catch (err) {
//         console.error("Failed to load category landing:", err);
//         setError(err.response?.data?.message || "Failed to load page");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLandingData();
//   }, [slug]);

//   /* ========== WISHLIST LOGIC ========== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(WISHLIST_API_BASE, {
//           withCredentials: true,
//         });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant)
//       return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
//             withCredentials: true,
//             data: { sku },
//           });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(
//             `${WISHLIST_API_BASE}/${pid}`,
//             { sku },
//             { withCredentials: true },
//           );
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
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             displayPrice:
//               variant.displayPrice || variant.discountedPrice || prod.price,
//             originalPrice: variant.originalPrice || variant.mrp || prod.price,
//             image: variant.images?.[0] || prod.images?.[0],
//             sku,
//             variantName: variant.shadeName || "Default",
//             stock: variant.stock,
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
//         payload = {
//           productId: prod._id,
//           variants: [{ variantSku: getSku(sel), quantity: 1 }],
//         };
//         const cache = JSON.parse(
//           localStorage.getItem("cartVariantCache") || "{}",
//         );
//         cache[prod._id] = sel;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//       }

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!data.success) throw new Error(data.message || "Cart add failed");

//       showToastMsg("Product added to cart!", "success");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg =
//         e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401)
//         navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) =>
//     setSelectedVariants((p) => ({ ...p, [pid]: v }));

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   /* Video play/pause when slide changes */
//   const handleSlideChange = () => {
//     const swiper = swiperRef.current?.swiper;
//     if (!swiper) return;
//     document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//     const activeSlide = swiper.slides[swiper.activeIndex];
//     const video = activeSlide?.querySelector("video");
//     if (video) video.play().catch(() => { });
//   };

//   /* ========== LINK NAVIGATION HANDLER ========== */
//   const handleLinkNavigation = (link) => {
//     if (!link) return;
//     if (link.startsWith("http://") || link.startsWith("https://")) {
//       window.location.href = link;
//     } else {
//       navigate(link);
//     }
//   };

//   /* ========== CHECK IF PRODUCT IS COMPLETELY OUT OF STOCK ========== */
//   const isCompletelyOutOfStock = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     if (vars.length === 0) {
//       return (prod.stock || 0) <= 0;
//     }
//     return vars.every(v => (v.stock || 0) <= 0);
//   };

//   /* ========== RENDER PRODUCT CARD ========== */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant =
//       selectedVariants[prod._id] ||
//       (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img =
//       displayVariant?.images?.[0] ||
//       displayVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
    
//     // Check out of stock status
//     const completelyOutOfStock = isCompletelyOutOfStock(prod);
//     const currentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
    
//     // Show out of stock if completely out OR (has variants but none selected and current is out)
//     const showOutOfStock = completelyOutOfStock || (hasVar && currentVariantOutOfStock && !isVariantSelected);
    
//     const showSelectVariantButton = hasVar && !isVariantSelected && !completelyOutOfStock;
//     const disabled = isAdding || (showOutOfStock ? false : (!showSelectVariantButton && currentVariantOutOfStock));

//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showOutOfStock) btnText = "Out of Stock";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (currentVariantOutOfStock) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col position-relative">
//         {/* Wishlist button - Hidden when out of stock */}
//         {!showOutOfStock && (
//           <button
//             onClick={() => {
//               if (displayVariant || !hasVar)
//                 toggleWishlist(prod, displayVariant || {});
//             }}
//             disabled={wishlistLoading[prod._id]}
//             className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
//             style={{
//               width: "36px",
//               height: "36px",
//               color: inWl ? "#dc3545" : "#6c757d",
//               border: "none",
//               background: 'transparent'
//             }}
//             title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             {wishlistLoading[prod._id] ? (
//               <span className="spinner-border spinner-border-sm" role="status" />
//             ) : inWl ? (
//               <FaHeart />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>
//         )}

//         <div className="border-0" style={{ height: "auto !important" }}>
//           <div
//             style={{ position: 'relative', cursor: showOutOfStock ? 'pointer' : 'pointer' }}
//             onClick={() => {
//               if (showOutOfStock) {
//                 handleOutOfStockClick(prod.name);
//               } else {
//                 navigate(`/product/${slugPr}`);
//               }
//             }}
//           >
//             <img
//               src={img}
//               alt={prod.name}
//               className="card-img-top"
//               style={{
//                 height: "200px",
//                 objectFit: "contain",
//                 opacity: showOutOfStock ? 0.6 : 1,
//                 filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
//               }}
//             />

//             {/* OUT OF STOCK OVERLAY */}
//             {showOutOfStock && (
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                   backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 3,
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: '#dc3545',
//                     color: '#fff',
//                     padding: '8px 16px',
//                     borderRadius: '20px',
//                     fontSize: '14px',
//                     fontWeight: 600,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '5px',
//                   }}
//                 >
//                   <FaTimes />
//                   Out of Stock
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="card-body d-flex flex-column p-3">
//             <div className="text-muted small mb-1 fw-medium text-start text-uppercase">
//               {getBrandName(prod)}
//             </div>
//             <h5
//               className="card-title fs-6 fw-bold"
//               style={{
//                 cursor: 'pointer',
//                 opacity: showOutOfStock ? 0.6 : 1,
//               }}
//               onClick={() => {
//                 if (showOutOfStock) {
//                   handleOutOfStockClick(prod.name);
//                 } else {
//                   navigate(`/product/${slugPr}`);
//                 }
//               }}
//             >
//               {prod.name}
//             </h5>

//             {hasVar && !showOutOfStock && (
//               <div className="mb-2 mt-2">
//                 {isVariantSelected ? (
//                   <div
//                     className="text-muted small cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span
//                       className="fw-bold text-dark ms-1"
//                       style={{ fontSize: "12px" }}
//                     >
//                       {getVariantDisplayText(displayVariant)}
//                     </span>
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 ) : (
//                   <div
//                     className="small text-muted cursor-pointer d-inline-flex align-items-center"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(prod._id, "all");
//                     }}
//                   >
//                     {vars.length} Variants Available
//                     <FaChevronDown
//                       className="ms-1"
//                       style={{ fontSize: "10px" }}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Show out of stock message in variant area */}
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

//             <p className="fw-bold mb-3 mt-2" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price =
//                   displayVariant?.displayPrice ||
//                   displayVariant?.discountedPrice ||
//                   prod.price ||
//                   0;
//                 const orig =
//                   displayVariant?.originalPrice ||
//                   displayVariant?.mrp ||
//                   prod.mrp ||
//                   price;
//                 const disc = orig > price;
//                 const pct = disc
//                   ? Math.round(((orig - price) / orig) * 100)
//                   : 0;
//                 return (
//                   <span
//                     style={{
//                       textDecoration: showOutOfStock ? 'line-through' : 'none',
//                       opacity: showOutOfStock ? 0.6 : 1,
//                     }}
//                   >
//                     {disc ? (
//                       <>
//                         ₹{price}
//                         <span
//                           className="text-decoration-line-through text-muted ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ₹{orig}
//                         </span>
//                         <span
//                           className="text-danger ms-2"
//                           style={{ fontSize: "14px" }}
//                         >
//                           ({pct}% OFF)
//                         </span>
//                       </>
//                     ) : (
//                       <>₹{orig}</>
//                     )}
//                   </span>
//                 );
//               })()}
//             </p>

//             {/* Cart button */}
//             <div className="mt-auto">
//               <button
//                 className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${
//                   showOutOfStock
//                     ? "btn-secondary"
//                     : isAdding
//                       ? "btn-dark"
//                       : "btn-outline-dark"
//                 }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showOutOfStock) {
//                     handleOutOfStockClick(prod.name);
//                   } else if (showSelectVariantButton) {
//                     openVariantOverlay(prod._id, "all");
//                   } else {
//                     handleAddToCart(prod);
//                   }
//                 }}
//                 disabled={disabled && !showOutOfStock}
//                 style={{
//                   opacity: showOutOfStock ? 0.8 : 1,
//                   cursor: showOutOfStock ? 'pointer' : (disabled ? 'not-allowed' : 'pointer'),
//                 }}
//               >
//                 {isAdding ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />
//                     Adding...
//                   </>
//                 ) : showOutOfStock ? (
//                   <>
//                     <FaTimes style={{ fontSize: '14px' }} />
//                     Out of Stock
//                   </>
//                 ) : (
//                   <>
//                     {btnText}
//                     {!disabled && !isAdding && !showSelectVariantButton && (
//                       <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Variant Overlay - Only show if not completely out of stock */}
//         {showVariantOverlay === prod._id && !showOutOfStock && (
//           <div
//             className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//             style={{ zIndex: 1050 }}
//             onClick={closeVariantOverlay}
//           >
//             <div
//               className="bg-white h-100 rounded-0 overflow-hidden d-flex flex-column"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//               }}
//             >
//               <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   className="btn btn-link text-dark text-decoration-none fs-4 p-0"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="d-flex border-bottom">
//                 <button
//                   className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                     selectedVariantType === "all"
//                       ? "active text-black border-bottom border-dark border-2"
//                       : "text-muted"
//                   }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVars})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                       selectedVariantType === "color"
//                         ? "active text-black border-bottom border-dark border-2"
//                         : "text-muted"
//                     }`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
//                       selectedVariantType === "text"
//                         ? "active text-black border-bottom border-dark border-2"
//                         : "text-muted"
//                     }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               <div className="p-3 overflow-auto flex-grow-1">
//                 {/* color variants */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3">
//                       {grouped.color.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col-lg-4 col-6" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="position-relative mx-auto mb-2"
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {sel && (
//                                   <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small fw-medium">
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small">
//                                   <FaTimes style={{ fontSize: '10px' }} /> Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {/* text variants (sizes) */}
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center cursor-pointer"
//                               style={{
//                                 cursor: oosV ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !oosV &&
//                                 (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 className="d-flex align-items-center justify-content-center fw-medium"
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: sel
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   background: sel ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   opacity: oosV ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && (
//                                 <div className="text-danger small mt-1">
//                                   <FaTimes style={{ fontSize: '10px' }} /> Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ========== RENDER SECTIONS ========== */
//   if (loading)
//     return (
//       <div
//         className="d-flex flex-column align-items-center justify-content-center bg-white"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           <DotLottieReact
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

//   if (error || !data)
//     return (
//       <>
//         <Header />
//         <div className="container text-center py-5">
//           <h3 className="text-danger">Error</h3>
//           <p className="text-muted">{error || "Category not found"}</p>
//         </div>
//         <Footer />
//       </>
//     );

//   const {
//     category,
//     subCategoriesTitle,
//     subCategories,
//     promotionsTitle,
//     promotions,
//     brandsTitle,
//     brands,
//     topSellersTitle,
//     topSellers,
//     skinTypesTitle,
//     skinTypes,
//     shopByIngredientsTitle,
//     shopByIngredients,
//     findsForYou,
//     featureBanners,
//     totalProducts,
//     inFocusTitle,
//     inFocus,
//   } = data;

//   return (
//     <>
//       <Header />

//       {/* ===================== OUT OF STOCK POPUP ===================== */}
//       <OutOfStockPopup
//         isOpen={showOutOfStockPopup}
//         onClose={closeOutOfStockPopup}
//         productName={outOfStockProductName}
//       />

//       {/* Hero Banner Slider */}
//       {category.bannerImage?.length > 0 && (
//         <section className="hero-slider">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={handleSlideChange}
//             loop
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{
//               clickable: true,
//               bulletClass: 'custom-swiper-bullet',
//               bulletActiveClass: 'custom-swiper-bullet-active',
//             }}
//             navigation
//             speed={800}
//             className="mt-lg-5"
//             style={{ height: "auto", width: "100%" }}
//           >
//             {category.bannerImage.map((banner, index) => {
//               const imgUrl = typeof banner === "string" ? banner : banner.url;
//               const targetLink =
//                 typeof banner === "object" ? banner.link : null;

//               return (
//                 <SwiperSlide key={index} className="">
//                   <div
//                     className="position-relative w-100 h-100 mt-xl-4 mt-3 padding-left-rightss"
//                     style={{ cursor: targetLink ? "pointer" : "default" }}
//                     onClick={() =>
//                       targetLink && handleLinkNavigation(targetLink)
//                     }
//                   >
//                     <img
//                       src={imgUrl}
//                       alt={`${category.name} banner ${index + 1}`}
//                       className="slide-media hero-slider-image-responsive mt-5 pt-0"
//                       style={{height:'100%' }}
//                     />
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </section>
//       )}

//       {/* Main Content Container */}
//       <div className="container-fluid p-md-5 p-lg-2 py-lg-4 ps-4 px-4 pt-lg-2">
//         {/* Category Title */}
//         <div
//           className="mb-0 cursor-pointer"
//           onClick={() => navigate(`/category/${category.slug}`)}
//         >
//         </div>

//         {/* Sub Categories (Top Category) - Slider */}
//         {subCategories?.length > 0 && (
//           <section className="mb padding-left-right-sub-category">
//             <div className="mt-3 d-flex justify-content-between align-items-center">
//               <h2 className="top-categories-title mb-0 page-title-main-name fw-normal">
//                 {subCategoriesTitle || "Top Categories"}
//               </h2>
//             </div>
//             <SectionSlider slidesPerView={3} spaceBetween={10}>
//               {subCategories.map((sub) => (
//                 <SwiperSlide key={sub._id}>
//                   <div
//                     className="h-100 border-0 text-center cursor-pointer mt-1"
//                     // ========== OLD CODE (REPLACED) ==========
//                     // onClick={() => navigate(`productpage/category/${sub.slug}`)}
//                     // ========== NEW CODE ==========
//                     onClick={() => navigate(`/category/${slug}/${sub.slug}`)}
//                     // ========== END REPLACEMENT ==========
//                   >
//                     {sub.thumbnailImage?.[0] && (
//                       <img
//                         src={sub.thumbnailImage[0]}
//                         alt={sub.name}
//                         className="mx-auto mt-3 img-fluid object-fit-contain"
//                       />
//                     )}
//                     <div className="card-body p-2">
//                       <h6 className="mt-3 text-start ms-1 page-title-main-name">
//                         {sub.name}
//                       </h6>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Quiz Banner Section */}
//         {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-5 mt-3">
//               {featureBanners?.find((b) => b.type === "quiz")?.title ||
//                 "Beauty Quiz"}
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "quiz")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div key={banner._id} className="h-100 row mt-lg-4 mt-3">
//                       <div className="col-md-6">
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid banner-image-quiz"
//                             style={{ height: "auto", objectFit: "cover" }}
//                           />
//                         )}
//                       </div>
//                       <div className="col-md-6 d-lg-flex align-items-center">
//                         <div>
//                           <h5 className="card-title fs-4 description-responsive description-responsivess page-title-main-name mt-lg-0 mt-4 ms-lg-5 ">
//                             {banner.description}
//                           </h5>
//                           {banner.buttonText && (
//                             <p
//                               className="quize-btn mb-0 cursor-pointer mt-2 mt-lg-5 page-title-main-name ms-lg-5 ms-0 mt-4 quize-btn-responsive"
//                               onClick={() => {
//                                 if (bannerLink) {
//                                   handleLinkNavigation(bannerLink);
//                                 } else {
//                                   navigate("/quiz");
//                                 }
//                               }}
//                             >
//                               {banner.buttonText}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}

//         {/* Promotions (Offers for You) */}
//         {promotions?.length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             <div className="m-0 p-0">
//               <h3 className="top-categories-title p-0 m-0 page-title-main-name fw-normal mt-4" style={{
//                 marginLeft: "-10px !important",
//               }}>
//                 {promotionsTitle || "Offers For You"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 1, spaceBetween: 10 },
//                 576: { slidesPerView: 2, spaceBetween: 15 },
//                 768: { slidesPerView: 3, spaceBetween: 20 },
//                 1024: { slidesPerView: 3, spaceBetween: 20 },
//               }}
//             >
//               {promotions.map((promo) => {
//                 const isBrandPromo = promo.scope === "brand" && promo.targetSlug;
//                 const isCategoryPromo = promo.scope === "category" && promo.targetSlug;

//                 return (
//                   <SwiperSlide key={promo._id}>
//                     <div
//                       className="border-0 h-100 cursor-pointer mt-lg-4 mt-3"
//                       onClick={() => {
//                         if (isBrandPromo) {
//                           navigate(`/brand/${promo.targetSlug}`);
//                         } else if (isCategoryPromo) {
//                           // ========== OLD CODE (REPLACED) ==========
//                           // navigate(`/Products/category/${promo.targetSlug}`);
//                           // ========== NEW CODE ==========
//                           navigate(`/category/${promo.targetSlug}`);
//                           // ========== END REPLACEMENT ==========
//                         } else {
//                           navigate(`/promotion/${promo.slug}`);
//                         }
//                       }}
//                       style={{
//                         transition: "all 0.3s ease",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {promo.images?.[0] && (
//                         <img
//                           src={promo.images[0]}
//                           alt={promo.title}
//                           className="m-0 p-0 img-fluid mt-lg-0 mt-1"
//                           style={{
//                             height: "auto",
//                             padding: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}

//                       <div className="pt-3 ps-0">
//                         <div className="page-title-main-name">
//                           <p className="mb-3">{promo.title}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Shade Finder Banner Section */}
//         {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Shade Finder
//             </h3>
//             <div>
//               {featureBanners
//                 .filter((banner) => banner.type === "shadeFinder")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <div
//                       key={banner._id}
//                       className="margin-left-right h-100 cursor-pointer"
//                       onClick={() => {
//                         if (bannerLink) {
//                           handleLinkNavigation(bannerLink);
//                         } else {
//                           navigate("/shade-finder");
//                         }
//                       }}
//                     >
//                       {bannerImage && (
//                         <img
//                           src={bannerImage}
//                           alt={banner.title}
//                           className="img-fluid"
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//             </div>
//           </section>
//         )}

//         {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
//         {findsForYou?.map((section) => (
//           <section key={section._id} className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//                 {section.title}
//               </h3>
//               {section.products?.length > 4 && (
//                 <button
//                   className="btn btn-link text-decoration-none text-dark page-title-main-name"
//                   onClick={() => navigate(`/section/${section._id}`)}
//                 >
//                   View All
//                 </button>
//               )}
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 1024: { slidesPerView: 4, spaceBetween: 20 },
//                 1280: { slidesPerView: 4, spaceBetween: 20 },
//               }}
//             >
//               {section.products?.map((prod) => (
//                 <SwiperSlide key={prod._id} className="page-title-main-name">
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         ))}

//         {/* Virtual Try On Banner Section */}
//         {featureBanners?.filter((b) => b.type === "virtualTryOn").length > 0 && (
//           <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
//             <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
//               Virtual Try On
//             </h3>

//             <Swiper
//               modules={[Autoplay, Pagination, Navigation]}
//               spaceBetween={20}
//               slidesPerView={1}
//               pagination={{
//                 clickable: true,
//                 bulletClass: 'custom-swiper-bullet',
//                 bulletActiveClass: 'custom-swiper-bullet-active',
//               }}
//               navigation={true}
//               breakpoints={{
//                 320: { slidesPerView: 1, spaceBetween: 10 },
//                 480: { slidesPerView: 1, spaceBetween: 15 },
//                 576: { slidesPerView: 1, spaceBetween: 15 },
//                 768: { slidesPerView: 1, spaceBetween: 20 },
//                 992: { slidesPerView: 1, spaceBetween: 20 },
//                 1200: { slidesPerView: 1, spaceBetween: 25 },
//                 1400: { slidesPerView: 1, spaceBetween: 30 },
//               }}
//               className="virtual-tryon-swiper"
//             >
//               {featureBanners
//                 .filter((banner) => banner.type === "virtualTryOn")
//                 .map((banner) => {
//                   const bannerImage = banner.image?.[0]?.url || banner.image;
//                   const bannerLink = banner.image?.[0]?.link || banner.link;
//                   return (
//                     <SwiperSlide key={banner._id}>
//                       <div
//                         className="card border-0 shadow-sm h-100 cursor-pointer mt-lg-3 mt-0"
//                         onClick={() => {
//                           if (bannerLink) {
//                             handleLinkNavigation(bannerLink);
//                           } else {
//                             navigate("/virtual-try-on");
//                           }
//                         }}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         {bannerImage && (
//                           <img
//                             src={bannerImage}
//                             alt={banner.title}
//                             className="img-fluid w-100"
//                             style={{
//                               height: "auto",
//                               borderRadius: '12px',
//                               objectFit: 'cover'
//                             }}
//                           />
//                         )}
//                       </div>
//                     </SwiperSlide>
//                   );
//                 })}
//             </Swiper>
//           </section>
//         )}

//         {/* shopByIngredients - FIXED NAVIGATION */}
//         {shopByIngredients?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-1">
//               <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-0 mt-3">
//                 {shopByIngredientsTitle || "Shop by Ingredients"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={6}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 12 },
//                 576: { slidesPerView: 3, spaceBetween: 12 },
//                 768: { slidesPerView: 4, spaceBetween: 12 },
//                 1024: { slidesPerView: 4, spaceBetween: 10 },
//                 1280: { slidesPerView: 4, spaceBetween: 10 },
//               }}
//             >
//               {shopByIngredients.map((ing) => {
//                 if (!ing || !ing.slug) {
//                   return null;
//                 }

//                 return (
//                   <SwiperSlide key={ing._id || ing.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card mt-3 p-0 "
//                       onClick={() => {
//                         if (!ing.slug) return;
//                         navigate(`/products?ingredients=${encodeURIComponent(ing.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                       }}
//                     >
//                       {ing.image && (
//                         <img
//                           src={ing.image}
//                           alt={ing.name}
//                           className="img-fluid"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}
//                       <p className="mt-2 mb-0 small fw-medium page-title-main-name text-start ms-1">
//                         {ing.name || "Unknown"}
//                       </p>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* In Focus Section - Slider */}
//         {inFocus?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {inFocusTitle || "In Focus"}
//               </h3>
//             </div>

//             <div>
//               {inFocus.map((product) => (
//                 <div key={product._id} className="bg-color-setup">
//                   <div className="bg-images"></div>
//                   <div className="border-0 row">
//                     <div className="col-lg-4">
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="img-fluid produtc-common-margin-padding"
//                         style={{ borderRadius: "10px", objectFit: "contain" }}
//                       />
//                     </div>

//                     <div className="col-lg-8">
//                       <div className="card-body p-2">
//                         <div className="text-uppercase ms-lg-5 ms-0 mt-lg-5 pt-3 fs-2 ms-lg-0 ms-0 page-title-main-name ">
//                           {product.brandName}
//                         </div>

//                         <h6 className="ms-lg-5 ms-0 mt-2 ms-lg-0 playfair-font-bold main-name-font-size">
//                           {product.name}
//                         </h6>

//                         <button
//                           onClick={() => navigate(`/product/${product.slug}`)}
//                           className="bg-transparent page-title-main-name fs-3 cursor-pointer ms-lg-5 ms-0 mt-lg-5 ms-lg-0"
//                           style={{ border: "none" }}
//                         >
//                           SHOP NOW{" "}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Top Brands - Slider */}
//         {brands?.length > 0 && (
//           <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {brandsTitle || "Top Brands"}
//               </h3>
//             </div>
//             <SectionSlider slidesPerView={8} spaceBetween={15}>
//               {brands.map((brand) => (
//                 <SwiperSlide key={brand._id}>
//                   <div
//                     className="text-center cursor-pointer"
//                     onClick={() => navigate(`/brand/${brand.slug}`)}
//                   >
//                     {brand.thumbnailImage && (
//                       <img
//                         className="img-fluid"
//                         src={brand.thumbnailImage}
//                         alt={brand.name}
//                       />
//                     )}
//                     <div className="mt-2 text-start fs-6 page-title-main-name">
//                       {brand.name}
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Skin Types - Slider - FIXED NAVIGATION */}
//         {skinTypes?.length > 0 && (
//           <section className="mb-5 padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {skinTypesTitle || "Shop by Skin Type"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={3}
//               spaceBetween={15}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 10 },
//                 768: { slidesPerView: 3, spaceBetween: 15 },
//                 1024: { slidesPerView: 4, spaceBetween: 15 },
//                 1280: { slidesPerView: 4, spaceBetween: 15 },
//               }}
//             >
//               {skinTypes.map((st) => {
//                 if (!st || !st.slug) {
//                   return null;
//                 }

//                 return (
//                   <SwiperSlide key={st._id || st.slug}>
//                     <div
//                       className="text-center cursor-pointer ingredient-card"
//                       onClick={() => {
//                         if (!st.slug) return;
//                         navigate(`/products?skinTypes=${encodeURIComponent(st.slug)}`);
//                       }}
//                       style={{
//                         padding: "12px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease",
//                       }}
//                     >
//                       {st.image && (
//                         <img
//                           src={st.image}
//                           alt={st.name}
//                           className="img-fluid rounded"
//                           style={{
//                             width: "100%",
//                             aspectRatio: "1 / 1",
//                             objectFit: "cover",
//                             borderRadius: "10px",
//                           }}
//                           onError={(e) => {
//                             e.target.src = "/placeholder.png";
//                           }}
//                         />
//                       )}
//                       {/* <p className="mt-2 mb-0 small fw-medium page-title-main-name text-center">
//                         {st.name || "Unknown"}
//                       </p> */}
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </SectionSlider>
//           </section>
//         )}

//         {/* Top Sellers - Slider */}
//         {topSellers?.length > 0 && (
//           <section className="mb-lg-5 mb-3 page-title-main-name padding-left-right-sub-category">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
//                 {topSellersTitle || "Top Sellers"}
//               </h3>
//             </div>

//             <SectionSlider
//               slidesPerView={4}
//               spaceBetween={20}
//               autoplay={5}
//               breakpoints={{
//                 320: { slidesPerView: 2, spaceBetween: 10 },
//                 576: { slidesPerView: 3, spaceBetween: 15 },
//                 768: { slidesPerView: 4, spaceBetween: 20 },
//                 1024: { slidesPerView: 4, spaceBetween: 20 },
//                 1280: { slidesPerView: 4, spaceBetween: 20 },
//               }}
//             >
//               {topSellers.map((prod) => (
//                 <SwiperSlide key={prod._id}>
//                   {renderProductCard(prod)}
//                 </SwiperSlide>
//               ))}
//             </SectionSlider>
//           </section>
//         )}
//       </div>
//       <Certificate />

//       <Footer />
//     </>
//   );
// }












// CategoryLandingPage.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "./UserContext.jsx";
import "../css/CategoryLandingPage.css";
import Bag from "../assets/Bag.svg";

// Import Swiper and its styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Certificate from "./Certificate.jsx";

const API_BASE = "https://beauty.joyory.com/api/user";
const CART_API_BASE = `${API_BASE}/cart`;
const WISHLIST_API_BASE = `${API_BASE}/wishlist`;

/* ---------- helpers ---------- */
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  const n = hex.trim().toLowerCase();
  return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(n);
};

const getVariantDisplayText = (v) =>
  (
    v.shadeName ||
    v.name ||
    v.size ||
    v.ml ||
    v.weight ||
    "Default"
  ).toUpperCase();

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

/**
 * Custom Section Slider Component
 */
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
    768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
  };

  const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };

  return (
    <div className="position-relative margintop-sss">
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        spaceBetween={spaceBetween}
        breakpoints={mergedBreakpoints}
        navigation={false}
        className="section-slider"
      >
        {children}
      </Swiper>
    </div>
  );
};

// ===================== 404 NOT FOUND PAGE COMPONENT =====================
const NotFoundPage = ({ message, onGoHome }) => (
  <>
    <Header />
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 text-center">
          <div className="mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
              style={{ width: '120px', height: '120px' }}
            >
              <span style={{ fontSize: '60px' }}>🔍</span>
            </div>
          </div>
          
          <h1 className="display-4 fw-bold mb-3 page-title-main-name">
            404
          </h1>
          
          <h2 className="h4 mb-4 page-title-main-name text-muted">
            Page Not Found
          </h2>
          
          <p className="lead mb-4 page-title-main-name text-secondary">
            {message || "The page you're looking for doesn't exist or has been moved."}
          </p>
          
          <div className="mb-5">
            <p className="text-muted mb-4 page-title-main-name">
              Here are some helpful links instead:
            </p>
            
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button
                className="btn btn-dark px-4 py-2 page-title-main-name"
                onClick={onGoHome || (() => window.location.href = '/')}
              >
                <i className="bi bi-house me-2"></i>
                Go to Homepage
              </button>
              
              <button
                className="btn btn-outline-dark px-4 py-2 page-title-main-name"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Go Back
              </button>
            </div>
          </div>
          
      
        </div>
      </div>
    </div>
    <Footer />
  </>
);

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

export default function CategoryLandingPage() {
  const swiperRef = useRef(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // ========== ADDED: Effective slug for handling nested routes ==========
  const effectiveSlug = slug?.includes("/")
    ? slug.split("/").pop()
    : slug;
  // ========== END ADDED ==========

  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show404, setShow404] = useState(false); // NEW: 404 state
  const [errorMessage, setErrorMessage] = useState(""); // NEW: custom error message

  // Wishlist state
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});

  // Cart & variant selection
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // ===================== OUT OF STOCK POPUP STATE =====================
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  /* ---------- Toast ---------- */
  const showToastMsg = (msg, type = "error", dur = 3000) => {
    const t = document.createElement("div");
    t.className = `toast-notification toast-${type} position-fixed top-0 end-0 m-3 p-3 rounded text-white`;
    t.style.cssText = `
      z-index: 9999;
      background: ${type === "error" ? "#dc3545" : "#198754"};
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), dur);
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

  /* ========== FETCH LANDING DATA ========== */
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        setShow404(false); // Reset 404 state
        setError(null);
        
        const { data } = await axios.get(
          `${API_BASE}/categories/category/${effectiveSlug}/landing`,
        );
        setData(data);
      } catch (err) {
        console.error("Failed to load category landing:", err);
        
        const status = err.response?.status;
        const responseMessage = err.response?.data?.message;
        const isLandingPage = err.response?.data?.isLandingPage;
        
        // ========== ENHANCED ERROR HANDLING ==========
        
        // Check if it's a 400 error with isLandingPage: false (sub-category blocked)
        if (status === 400 && isLandingPage === false) {
          setErrorMessage(
            responseMessage || 
            "This page is only available for top-level parent categories. Sub-categories are not accessible directly."
          );
          setShow404(true);
        }
        // Check if it's a 404 error (category not found)
        else if (status === 404) {
          setErrorMessage(
            responseMessage || 
            "The category you're looking for doesn't exist or has been removed."
          );
          setShow404(true);
        }
        // Check if it's a 500 error (server error)
        else if (status === 500) {
          setErrorMessage(
            "We're experiencing technical difficulties. Please try again later."
          );
          setShow404(true);
        }
        // Network error (no response)
        else if (err.code === 'ERR_NETWORK' || !err.response) {
          setErrorMessage(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
          setShow404(true);
        }
        // Any other error
        else {
          setError(responseMessage || "Failed to load page");
          setErrorMessage(
            responseMessage || 
            "An unexpected error occurred. Please try again or contact support."
          );
          setShow404(true);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (effectiveSlug) {
      fetchLandingData();
    } else {
      // If no slug provided, show 404
      setErrorMessage("No category specified. Please select a valid category.");
      setShow404(true);
      setLoading(false);
    }
  }, [slug, effectiveSlug]);

  /* ========== WISHLIST LOGIC ========== */
  const isInWishlist = (pid, sku) => {
    if (!pid || !sku) return false;
    return wishlistData.some(
      (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
    );
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const { data } = await axios.get(WISHLIST_API_BASE, {
          withCredentials: true,
        });
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
    if (!prod || !variant)
      return showToastMsg("Select a variant first", "error");
    const pid = prod._id;
    const sku = getSku(variant);
    setWishlistLoading((p) => ({ ...p, [pid]: true }));
    try {
      const inWl = isInWishlist(pid, sku);
      if (user && !user.guest) {
        if (inWl) {
          await axios.delete(`${WISHLIST_API_BASE}/${pid}`, {
            withCredentials: true,
            data: { sku },
          });
          showToastMsg("Removed from wishlist!", "success");
        } else {
          await axios.post(
            `${WISHLIST_API_BASE}/${pid}`,
            { sku },
            { withCredentials: true },
          );
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
            displayPrice:
              variant.displayPrice || variant.discountedPrice || prod.price,
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
  const handleAddToCart = async (prod) => {
    setAddingToCart((p) => ({ ...p, [prod._id]: true }));
    try {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      let payload;

      if (hasVar) {
        const sel = selectedVariants[prod._id];
        if (!sel || sel.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(sel), quantity: 1 }],
        };
        const cache = JSON.parse(
          localStorage.getItem("cartVariantCache") || "{}",
        );
        cache[prod._id] = sel;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }
        payload = { productId: prod._id, quantity: 1 };
      }

      const { data } = await axios.post(`${CART_API_BASE}/add`, payload, {
        withCredentials: true,
      });
      if (!data.success) throw new Error(data.message || "Cart add failed");

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (e) {
      const msg =
        e.response?.data?.message || e.message || "Failed to add to cart";
      showToastMsg(msg, "error");
      if (e.response?.status === 401)
        navigate("/login", { state: { from: location.pathname } });
    } finally {
      setAddingToCart((p) => ({ ...p, [prod._id]: false }));
    }
  };

  const handleVariantSelect = (pid, v) =>
    setSelectedVariants((p) => ({ ...p, [pid]: v }));

  const openVariantOverlay = (pid, t = "all") => {
    setSelectedVariantType(t);
    setShowVariantOverlay(pid);
  };
  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };
  const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

  /* Video play/pause when slide changes */
  const handleSlideChange = () => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;
    document.querySelectorAll(".slide-video").forEach((v) => v.pause());
    const activeSlide = swiper.slides[swiper.activeIndex];
    const video = activeSlide?.querySelector("video");
    if (video) video.play().catch(() => { });
  };

  /* ========== LINK NAVIGATION HANDLER ========== */
  const handleLinkNavigation = (link) => {
    if (!link) return;
    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.location.href = link;
    } else {
      navigate(link);
    }
  };

  /* ========== CHECK IF PRODUCT IS COMPLETELY OUT OF STOCK ========== */
  const isCompletelyOutOfStock = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    if (vars.length === 0) {
      return (prod.stock || 0) <= 0;
    }
    return vars.every(v => (v.stock || 0) <= 0);
  };

  /* ========== RENDER PRODUCT CARD ========== */
  const renderProductCard = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    const hasVar = vars.length > 0;

    const isVariantSelected = !!selectedVariants[prod._id];
    const displayVariant =
      selectedVariants[prod._id] ||
      (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null);

    const grouped = groupVariantsByType(vars);
    const totalVars = vars.length;
    const sku = displayVariant ? getSku(displayVariant) : null;
    const inWl = sku ? isInWishlist(prod._id, sku) : false;
    const slugPr = getProductSlug(prod);
    const img =
      displayVariant?.images?.[0] ||
      displayVariant?.image ||
      prod.images?.[0] ||
      "/placeholder.png";

    const isAdding = addingToCart[prod._id];
    
    // Check out of stock status
    const completelyOutOfStock = isCompletelyOutOfStock(prod);
    const currentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
    
    // Show out of stock if completely out OR (has variants but none selected and current is out)
    const showOutOfStock = completelyOutOfStock || (hasVar && currentVariantOutOfStock && !isVariantSelected);
    
    const showSelectVariantButton = hasVar && !isVariantSelected && !completelyOutOfStock;
    const disabled = isAdding || (showOutOfStock ? false : (!showSelectVariantButton && currentVariantOutOfStock));

    let btnText = "Add to Cart";
    if (isAdding) btnText = "Adding...";
    else if (showOutOfStock) btnText = "Out of Stock";
    else if (showSelectVariantButton) btnText = "Select Variant";
    else if (currentVariantOutOfStock) btnText = "Out of Stock";

    return (
      <div key={prod._id} className="col position-relative">
        {/* Wishlist button - Hidden when out of stock */}
        {!showOutOfStock && (
          <button
            onClick={() => {
              if (displayVariant || !hasVar)
                toggleWishlist(prod, displayVariant || {});
            }}
            disabled={wishlistLoading[prod._id]}
            className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center z-2"
            style={{
              width: "36px",
              height: "36px",
              color: inWl ? "#dc3545" : "#ccc",
              border: "none",
              background: 'transparent'
            }}
            title={inWl ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlistLoading[prod._id] ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : inWl ? (
              <FaHeart className="fs-4" />
            ) : (
              <FaRegHeart className="fs-4" />
            )}
          </button>
        )}

        <div className="border-0" style={{ height: "auto !important" }}>
          <div
            style={{ position: 'relative', cursor: showOutOfStock ? 'pointer' : 'pointer' }}
            onClick={() => {
              if (showOutOfStock) {
                handleOutOfStockClick(prod.name);
              } else {
                navigate(`/product/${slugPr}`);
              }
            }}
          >
            <img
              src={img}
              alt={prod.name}
              className="card-img-top"
              style={{
                height: "200px",
                objectFit: "contain",
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
          </div>

          <div className="card-body d-flex flex-column p-3">
            <div className="text-muted small mb-1 fw-medium text-start text-uppercase">
              {getBrandName(prod)}
            </div>
            <h5
              className="card-title fs-6 fw-bold"
              style={{
                cursor: 'pointer',
                opacity: showOutOfStock ? 0.6 : 1,
              }}
              onClick={() => {
                if (showOutOfStock) {
                  handleOutOfStockClick(prod.name);
                } else {
                  navigate(`/product/${slugPr}`);
                }
              }}
            >
              {prod.name}
            </h5>

            {hasVar && !showOutOfStock && (
              <div className="mb-2 mt-2">
                {isVariantSelected ? (
                  <div
                    className="text-muted small cursor-pointer d-inline-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      openVariantOverlay(prod._id, "all");
                    }}
                    title="Click to change variant"
                  >
                    Variant:{" "}
                    <span
                      className="fw-bold text-dark ms-1"
                      style={{ fontSize: "12px" }}
                    >
                      {getVariantDisplayText(displayVariant)}
                    </span>
                    <FaChevronDown
                      className="ms-1"
                      style={{ fontSize: "10px" }}
                    />
                  </div>
                ) : (
                  <div
                    className="small text-muted cursor-pointer d-inline-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      openVariantOverlay(prod._id, "all");
                    }}
                  >
                    {vars.length} Variants Available
                    <FaChevronDown
                      className="ms-1"
                      style={{ fontSize: "10px" }}
                    />
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

            <p className="fw-bold mb-3 mt-2" style={{ fontSize: "16px" }}>
              {(() => {
                const price =
                  displayVariant?.displayPrice ||
                  displayVariant?.discountedPrice ||
                  prod.price ||
                  0;
                const orig =
                  displayVariant?.originalPrice ||
                  displayVariant?.mrp ||
                  prod.mrp ||
                  price;
                const disc = orig > price;
                const pct = disc
                  ? Math.round(((orig - price) / orig) * 100)
                  : 0;
                return (
                  <span
                    style={{
                      textDecoration: showOutOfStock ? 'line-through' : 'none',
                      opacity: showOutOfStock ? 0.6 : 1,
                    }}
                  >
                    {disc ? (
                      <>
                        ₹{price}
                        <span
                          className="text-decoration-line-through text-muted ms-2"
                          style={{ fontSize: "14px" }}
                        >
                          ₹{orig}
                        </span>
                        <span
                          className="text-danger ms-2"
                          style={{ fontSize: "14px" }}
                        >
                          ({pct}% OFF)
                        </span>
                      </>
                    ) : (
                      <>₹{orig}</>
                    )}
                  </span>
                );
              })()}
            </p>

            {/* Cart button */}
            <div className="mt-auto">
              <button
                className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${
                  showOutOfStock
                    ? "btn-secondary"
                    : isAdding
                      ? "btn-dark"
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
                disabled={disabled && !showOutOfStock}
                style={{
                  opacity: showOutOfStock ? 0.8 : 1,
                  cursor: showOutOfStock ? 'pointer' : (disabled ? 'not-allowed' : 'pointer'),
                }}
              >
                {isAdding ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Adding...
                  </>
                ) : showOutOfStock ? (
                  <>
                    <FaTimes style={{ fontSize: '14px' }} />
                    Out of Stock
                  </>
                ) : (
                  <>
                    {btnText}
                    {!disabled && !isAdding && !showSelectVariantButton && (
                      <img src={Bag} alt="Bag" style={{ height: "20px" }} />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Variant Overlay - Only show if not completely out of stock */}
        {showVariantOverlay === prod._id && !showOutOfStock && (
          <div
            className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
            onClick={closeVariantOverlay}
          >
            <div
              className="bg-white h-100 rounded-0 overflow-hidden d-flex flex-column"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="m-0 fw-bold">Select Variant ({totalVars})</h5>
                <button
                  onClick={closeVariantOverlay}
                  className="btn btn-link text-dark text-decoration-none fs-4 p-0"
                >
                  ×
                </button>
              </div>

              <div className="d-flex border-bottom">
                <button
                  className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
                    selectedVariantType === "all"
                      ? "active text-black border-bottom border-dark border-2"
                      : "text-muted"
                  }`}
                  onClick={() => setSelectedVariantType("all")}
                >
                  All ({totalVars})
                </button>
                {grouped.color.length > 0 && (
                  <button
                    className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
                      selectedVariantType === "color"
                        ? "active text-black border-bottom border-dark border-2"
                        : "text-muted"
                    }`}
                    onClick={() => setSelectedVariantType("color")}
                  >
                    Colors ({grouped.color.length})
                  </button>
                )}
                {grouped.text.length > 0 && (
                  <button
                    className={`btn btn-link flex-fill py-3 text-decoration-none fw-medium ${
                      selectedVariantType === "text"
                        ? "active text-black border-bottom border-dark border-2"
                        : "text-muted"
                    }`}
                    onClick={() => setSelectedVariantType("text")}
                  >
                    Sizes ({grouped.text.length})
                  </button>
                )}
              </div>

              <div className="p-3 overflow-auto flex-grow-1">
                {/* color variants */}
                {(selectedVariantType === "all" ||
                  selectedVariantType === "color") &&
                  grouped.color.length > 0 && (
                    <div className="row row-cols-4 g-3">
                      {grouped.color.map((v) => {
                        const sel = selectedVariants[prod._id]?.sku === v.sku;
                        const oosV = v.stock <= 0;
                        return (
                          <div className="col-lg-4 col-6" key={v.sku || v._id}>
                            <div
                              className="text-center cursor-pointer"
                              style={{
                                cursor: oosV ? "not-allowed" : "pointer",
                              }}
                              onClick={() =>
                                !oosV &&
                                (handleVariantSelect(prod._id, v),
                                  closeVariantOverlay())
                              }
                            >
                              <div
                                className="position-relative mx-auto mb-2"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "20%",
                                  backgroundColor: v.hex || "#ccc",
                                  border: sel
                                    ? "3px solid #000"
                                    : "1px solid #ddd",
                                  opacity: oosV ? 0.5 : 1,
                                }}
                              >
                                {sel && (
                                  <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <div className="small fw-medium">
                                {getVariantDisplayText(v)}
                              </div>
                              {oosV && (
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

                {/* text variants (sizes) */}
                {(selectedVariantType === "all" ||
                  selectedVariantType === "text") &&
                  grouped.text.length > 0 && (
                    <div className="row row-cols-3 g-3">
                      {grouped.text.map((v) => {
                        const sel = selectedVariants[prod._id]?.sku === v.sku;
                        const oosV = v.stock <= 0;
                        return (
                          <div className="col" key={v.sku || v._id}>
                            <div
                              className="text-center cursor-pointer"
                              style={{
                                cursor: oosV ? "not-allowed" : "pointer",
                              }}
                              onClick={() =>
                                !oosV &&
                                (handleVariantSelect(prod._id, v),
                                  closeVariantOverlay())
                              }
                            >
                              <div
                                className="d-flex align-items-center justify-content-center fw-medium"
                                style={{
                                  padding: "10px",
                                  borderRadius: "8px",
                                  border: sel
                                    ? "3px solid #000"
                                    : "1px solid #ddd",
                                  background: sel ? "#f8f9fa" : "#fff",
                                  minHeight: "50px",
                                  opacity: oosV ? 0.5 : 1,
                                }}
                              >
                                {getVariantDisplayText(v)}
                              </div>
                              {oosV && (
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
    );
  };

  /* ========== RENDER SECTIONS ========== */
  if (loading)
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center bg-white"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact
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

  // ========== NEW: Show 404 page if error condition met ==========
  if (show404) {
    return (
      <NotFoundPage 
        message={errorMessage} 
        onGoHome={() => navigate('/', { replace: true })}
      />
    );
  }

  // ========== FALLBACK: Show error in page with header/footer ==========
  if (error || !data)
    return (
      <>
        <Header />
        <div className="container text-center py-5">
          <h3 className="text-danger">Error</h3>
          <p className="text-muted">{error || "Category not found"}</p>
          <button 
            className="btn btn-dark mt-3"
            onClick={() => navigate('/', { replace: true })}
          >
            Go to Homepage
          </button>
        </div>
        <Footer />
      </>
    );

  const {
    category,
    subCategoriesTitle,
    subCategories,
    promotionsTitle,
    promotions,
    brandsTitle,
    brands,
    topSellersTitle,
    topSellers,
    skinTypesTitle,
    skinTypes,
    shopByIngredientsTitle,
    shopByIngredients,
    findsForYou,
    featureBanners,
    totalProducts,
    inFocusTitle,
    inFocus,
  } = data;

  return (
    <>
      <Header />

      {/* ===================== OUT OF STOCK POPUP ===================== */}
      <OutOfStockPopup
        isOpen={showOutOfStockPopup}
        onClose={closeOutOfStockPopup}
        productName={outOfStockProductName}
      />

      {/* Hero Banner Slider */}
      {category.bannerImage?.length > 0 && (
        <section className="hero-slider">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination, Navigation]}
            onSlideChange={handleSlideChange}
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: 'custom-swiper-bullet',
              bulletActiveClass: 'custom-swiper-bullet-active',
            }}
            navigation
            speed={800}
            className="mt-lg-5"
            style={{ height: "auto", width: "100%" }}
          >
            {category.bannerImage.map((banner, index) => {
              const imgUrl = typeof banner === "string" ? banner : banner.url;
              const targetLink =
                typeof banner === "object" ? banner.link : null;

              return (
                <SwiperSlide key={index} className="">
                  <div
                    className="position-relative w-100 h-100 mt-xl-4 mt-3 padding-left-rightss"
                    style={{ cursor: targetLink ? "pointer" : "default" }}
                    onClick={() =>
                      targetLink && handleLinkNavigation(targetLink)
                    }
                  >
                    <img
                      src={imgUrl}
                      alt={`${category.name} banner ${index + 1}`}
                      className="slide-media hero-slider-image-responsive mt-5 pt-0"
                      style={{height:'100%' }}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}

      {/* Main Content Container */}
      <div className="container-fluid p-md-5 p-lg-2 py-lg-4 ps-4 px-4 pt-lg-2">
        {/* Category Title */}
        <div
          className="mb-0 cursor-pointer"
          onClick={() => navigate(`/category/${category.slug}`)}
        >
        </div>

        {/* Sub Categories (Top Category) - Slider */}
        {subCategories?.length > 0 && (
          <section className="mb padding-left-right-sub-category">
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <h2 className="top-categories-title mb-0 page-title-main-name fw-normal">
                {subCategoriesTitle || "Top Categories"}
              </h2>
            </div>
            <SectionSlider slidesPerView={3} spaceBetween={10}>
              {subCategories.map((sub) => (
                <SwiperSlide key={sub._id}>
                  <div
                    className="h-100 border-0 text-center cursor-pointer mt-1"
                    onClick={() => navigate(`/category/${slug}/${sub.slug}`)}
                  >
                    {sub.thumbnailImage?.[0] && (
                      <img
                        src={sub.thumbnailImage[0]}
                        alt={sub.name}
                        className="mx-auto mt-3 img-fluid object-fit-contain"
                      />
                    )}
                    <div className="card-body p-2">
                      <h6 className="mt-3 text-start ms-1 page-title-main-name">
                        {sub.name}
                      </h6>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </SectionSlider>
          </section>
        )}

        {/* Quiz Banner Section */}
        {featureBanners?.filter((b) => b.type === "quiz").length > 0 && (
          <section className="mb-5 padding-left-right-sub-category">
            <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-5 mt-3">
              {featureBanners?.find((b) => b.type === "quiz")?.title ||
                "Beauty Quiz"}
            </h3>
            <div>
              {featureBanners
                .filter((banner) => banner.type === "quiz")
                .map((banner) => {
                  const bannerImage = banner.image?.[0]?.url || banner.image;
                  const bannerLink = banner.image?.[0]?.link || banner.link;
                  return (
                    <div key={banner._id} className="h-100 row mt-lg-4 mt-3">
                      <div className="col-md-6">
                        {bannerImage && (
                          <img
                            src={bannerImage}
                            alt={banner.title}
                            className="img-fluid banner-image-quiz"
                            style={{ height: "auto", objectFit: "cover" }}
                          />
                        )}
                      </div>
                      <div className="col-md-6 d-lg-flex align-items-center">
                        <div>
                          <h5 className="card-title fs-4 description-responsive description-responsivess page-title-main-name mt-lg-0 mt-4 ms-lg-5 ">
                            {banner.description}
                          </h5>
                          {banner.buttonText && (
                            <p
                              className="quize-btn mb-0 cursor-pointer mt-2 mt-lg-5 page-title-main-name ms-lg-5 ms-0 mt-4 quize-btn-responsive"
                              onClick={() => {
                                if (bannerLink) {
                                  handleLinkNavigation(bannerLink);
                                } else {
                                  navigate("/quiz");
                                }
                              }}
                            >
                              {banner.buttonText}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* Promotions (Offers for You) */}
        {promotions?.length > 0 && (
          <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
            <div className="m-0 p-0">
              <h3 className="top-categories-title p-0 m-0 page-title-main-name fw-normal mt-4" style={{
                marginLeft: "-10px !important",
              }}>
                {promotionsTitle || "Offers For You"}
              </h3>
            </div>

            <SectionSlider
              slidesPerView={4}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                576: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}
            >
              {promotions.map((promo) => {
                const isBrandPromo = promo.scope === "brand" && promo.targetSlug;
                const isCategoryPromo = promo.scope === "category" && promo.targetSlug;

                return (
                  <SwiperSlide key={promo._id}>
                    <div
                      className="border-0 h-100 cursor-pointer mt-lg-4 mt-3"
                      onClick={() => {
                        if (isBrandPromo) {
                          navigate(`/brand/${promo.targetSlug}`);
                        } else if (isCategoryPromo) {
                          navigate(`/category/${promo.targetSlug}`);
                        } else {
                          navigate(`/promotion/${promo.slug}`);
                        }
                      }}
                      style={{
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                      }}
                    >
                      {promo.images?.[0] && (
                        <img
                          src={promo.images[0]}
                          alt={promo.title}
                          className="m-0 p-0 img-fluid mt-lg-0 mt-1"
                          style={{
                            height: "auto",
                            padding: "10px",
                          }}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      )}

                      <div className="pt-3 ps-0">
                        <div className="page-title-main-name">
                          <p className="mb-3">{promo.title}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </SectionSlider>
          </section>
        )}

        {/* Shade Finder Banner Section */}
        {featureBanners?.filter((b) => b.type === "shadeFinder").length > 0 && (
          <section className="mb-5 padding-left-right-sub-category">
            <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
              Shade Finder
            </h3>
            <div>
              {featureBanners
                .filter((banner) => banner.type === "shadeFinder")
                .map((banner) => {
                  const bannerImage = banner.image?.[0]?.url || banner.image;
                  const bannerLink = banner.image?.[0]?.link || banner.link;
                  return (
                    <div
                      key={banner._id}
                      className="margin-left-right h-100 cursor-pointer"
                      onClick={() => {
                        if (bannerLink) {
                          handleLinkNavigation(bannerLink);
                        } else {
                          navigate("/shade-finder");
                        }
                      }}
                    >
                      {bannerImage && (
                        <img
                          src={bannerImage}
                          alt={banner.title}
                          className="img-fluid"
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* Finds For You (For You From Joyory) - Slider with custom breakpoints */}
        {findsForYou?.map((section) => (
          <section key={section._id} className="mb-lg-5 mb-4 padding-left-right-sub-category">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
                {section.title}
              </h3>
              {section.products?.length > 4 && (
                <button
                  className="btn btn-link text-decoration-none text-dark page-title-main-name"
                  onClick={() => navigate(`/section/${section._id}`)}
                >
                  View All
                </button>
              )}
            </div>

            <SectionSlider
              slidesPerView={4}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                576: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
            >
              {section.products?.map((prod) => (
                <SwiperSlide key={prod._id} className="page-title-main-name">
                  {renderProductCard(prod)}
                </SwiperSlide>
              ))}
            </SectionSlider>
          </section>
        ))}

        {/* Virtual Try On Banner Section */}
        {featureBanners?.filter((b) => b.type === "virtualTryOn").length > 0 && (
          <section className="mb-lg-5 mb-3 padding-left-right-sub-category">
            <h3 className="mb-3 top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal">
              Virtual Try On
            </h3>

            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: 'custom-swiper-bullet',
                bulletActiveClass: 'custom-swiper-bullet-active',
              }}
              navigation={true}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                480: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 1, spaceBetween: 15 },
                768: { slidesPerView: 1, spaceBetween: 20 },
                992: { slidesPerView: 1, spaceBetween: 20 },
                1200: { slidesPerView: 1, spaceBetween: 25 },
                1400: { slidesPerView: 1, spaceBetween: 30 },
              }}
              className="virtual-tryon-swiper"
            >
              {featureBanners
                .filter((banner) => banner.type === "virtualTryOn")
                .map((banner) => {
                  const bannerImage = banner.image?.[0]?.url || banner.image;
                  const bannerLink = banner.image?.[0]?.link || banner.link;
                  return (
                    <SwiperSlide key={banner._id}>
                      <div
                        className="card border-0 shadow-sm h-100 cursor-pointer mt-lg-3 mt-0"
                        onClick={() => {
                          if (bannerLink) {
                            handleLinkNavigation(bannerLink);
                          } else {
                            navigate("/virtual-try-on");
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {bannerImage && (
                          <img
                            src={bannerImage}
                            alt={banner.title}
                            className="img-fluid w-100"
                            style={{
                              height: "auto",
                              borderRadius: '12px',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </section>
        )}

        {/* shopByIngredients - FIXED NAVIGATION */}
        {shopByIngredients?.length > 0 && (
          <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="top-categories-title mb-0 p-1 ms-md-0 page-title-main-name fw-normal mt-lg-0 mt-3">
                {shopByIngredientsTitle || "Shop by Ingredients"}
              </h3>
            </div>

            <SectionSlider
              slidesPerView={6}
              spaceBetween={15}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 12 },
                576: { slidesPerView: 3, spaceBetween: 12 },
                768: { slidesPerView: 4, spaceBetween: 12 },
                1024: { slidesPerView: 4, spaceBetween: 10 },
                1280: { slidesPerView: 4, spaceBetween: 10 },
              }}
            >
              {shopByIngredients.map((ing) => {
                if (!ing || !ing.slug) {
                  return null;
                }

                return (
                  <SwiperSlide key={ing._id || ing.slug}>
                    <div
                      className="text-center cursor-pointer ingredient-card mt-3 p-0 "
                      onClick={() => {
                        if (!ing.slug) return;
                        navigate(`/products?ingredients=${encodeURIComponent(ing.slug)}`);
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {ing.image && (
                        <img
                          src={ing.image}
                          alt={ing.name}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      )}
                      <p className="mt-2 mb-0 small fw-medium page-title-main-name text-start ms-1">
                        {ing.name || "Unknown"}
                      </p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </SectionSlider>
          </section>
        )}

        {/* In Focus Section - Slider */}
        {inFocus?.length > 0 && (
          <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                {inFocusTitle || "In Focus"}
              </h3>
            </div>

            <div>
              {inFocus.map((product) => (
                <div key={product._id} className="bg-color-setup">
                  <div className="bg-images"></div>
                  <div className="border-0 row">
                    <div className="col-lg-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid produtc-common-margin-padding"
                        style={{ borderRadius: "10px", objectFit: "contain" }}
                      />
                    </div>

                    <div className="col-lg-8">
                      <div className="card-body p-2">
                        <div className="text-uppercase ms-lg-5 ms-0 mt-lg-5 pt-3 fs-2 ms-lg-0 ms-0 page-title-main-name ">
                          {product.brandName}
                        </div>

                        <h6 className="ms-lg-5 ms-0 mt-2 ms-lg-0 playfair-font-bold main-name-font-size">
                          {product.name}
                        </h6>

                        <button
                          onClick={() => navigate(`/product/${product.slug}`)}
                          className="bg-transparent page-title-main-name fs-3 cursor-pointer ms-lg-5 ms-0 mt-lg-5 ms-lg-0"
                          style={{ border: "none" }}
                        >
                          SHOP NOW{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Brands - Slider */}
        {brands?.length > 0 && (
          <section className="mb-lg-5 mb-4 padding-left-right-sub-category">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                {brandsTitle || "Top Brands"}
              </h3>
            </div>
            <SectionSlider slidesPerView={8} spaceBetween={15}>
              {brands.map((brand) => (
                <SwiperSlide key={brand._id}>
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => navigate(`/brand/${brand.slug}`)}
                  >
                    {brand.thumbnailImage && (
                      <img
                        className="img-fluid"
                        src={brand.thumbnailImage}
                        alt={brand.name}
                      />
                    )}
                    <div className="mt-2 text-start fs-6 page-title-main-name">
                      {brand.name}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </SectionSlider>
          </section>
        )}

        {/* Skin Types - Slider - FIXED NAVIGATION */}
        {skinTypes?.length > 0 && (
          <section className="mb-5 padding-left-right-sub-category">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                {skinTypesTitle || "Shop by Skin Type"}
              </h3>
            </div>

            <SectionSlider
              slidesPerView={3}
              spaceBetween={15}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                576: { slidesPerView: 3, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 15 },
                1280: { slidesPerView: 4, spaceBetween: 15 },
              }}
            >
              {skinTypes.map((st) => {
                if (!st || !st.slug) {
                  return null;
                }

                return (
                  <SwiperSlide key={st._id || st.slug}>
                    <div
                      className="text-center cursor-pointer ingredient-card"
                      onClick={() => {
                        if (!st.slug) return;
                        navigate(`/products?skinTypes=${encodeURIComponent(st.slug)}`);
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {st.image && (
                        <img
                          src={st.image}
                          alt={st.name}
                          className="img-fluid rounded"
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      )}
                      {/* <p className="mt-2 mb-0 small fw-medium page-title-main-name text-center">
                        {st.name || "Unknown"}
                      </p> */}
                    </div>
                  </SwiperSlide>
                );
              })}
            </SectionSlider>
          </section>
        )}

        {/* Top Sellers - Slider */}
        {topSellers?.length > 0 && (
          <section className="mb-lg-5 mb-3 page-title-main-name padding-left-right-sub-category">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="top-categories-title p-1 mb-0 page-title-main-name fw-normal">
                {topSellersTitle || "Top Sellers"}
              </h3>
            </div>

            <SectionSlider
              slidesPerView={4}
              spaceBetween={20}
              autoplay={5}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                576: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
            >
              {topSellers.map((prod) => (
                <SwiperSlide key={prod._id}>
                  {renderProductCard(prod)}
                </SwiperSlide>
              ))}
            </SectionSlider>
          </section>
        )}
      </div>
      <Certificate />

      <Footer />
    </>
  );
}










