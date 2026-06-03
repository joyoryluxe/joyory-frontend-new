// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ShopProduct.css";
// import axiosInstance from "../utils/axiosInstance.js";

// const ShopProduct = () => {
//   const { slug, id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [allProducts, setAllProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("");
//   const [bannerImage, setBannerImage] = useState("");
//   const [selectedShades, setSelectedShades] = useState({});
//   const [expandedShades, setExpandedShades] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [skinType, setSkinType] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState({ show: false, type: "error", message: "" });
//   const [currentPage, setCurrentPage] = useState(1);

//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     skinType: "",
//     formulation: "",
//     priceRange: null,
//     minRating: "",
//     discountSort: "",
//   });
//   const [filterData, setFilterData] = useState(null);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const productsPerPage = 12;
//   const maxVisibleShades = 500;

//   // ===== Toast Utility =====
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast({ show: false, message: "", type: "error" }), duration);
//   };

//   // ===================== Fetch All Products =====================
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setLoading(true);
//         const res = await axiosInstance.get("https://beauty.joyory.com/api/user/products/all");
//         const data = res.data;

//         console.log("📦 API Response:", data);

//         // Set filter data from API response
//         if (data.brands && data.categories) {
//           setFilterData({
//             brands: data.brands,
//             categories: data.categories,
//             skinTypes: data.skinTypes || [],
//             formulations: data.formulations || []
//           });
//         }

//         // Set all products
//         setAllProducts(data.products || []);

//         // Set page title based on current route
//         if (id) {
//           setPageTitle("Promotion Products");
//         } else if (window.location.pathname.includes("skintype")) {
//           setPageTitle(slug ? `${slug.charAt(0).toUpperCase() + slug.slice(1)} Skin Type` : "Skin Type Products");
//         } else {
//           setPageTitle(slug ? `${slug.charAt(0).toUpperCase() + slug.slice(1)} Products` : "All Products");
//         }

//         // Set banner image (you might want to customize this based on your needs)
//         setBannerImage(data.bannerImage || "/banner-placeholder.jpg");

//         // Auto select first in-stock variant
//         const defaultSelected = {};
//         (data.products || []).forEach((prod) => {
//           const availableVariant = prod.variants?.find((v) => v.stock > 0);
//           if (availableVariant) {
//             defaultSelected[prod._id] = {
//               shadeName: availableVariant.shadeName,
//               hex: availableVariant.hex,
//               sku: availableVariant.sku,
//               displayPrice: availableVariant.displayPrice,
//               image: availableVariant.images?.[0] || prod.images?.[0],
//               stock: availableVariant.stock,
//             };
//           }
//         });
//         setSelectedShades(defaultSelected);

//         setCurrentPage(1);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setAllProducts([]);
//         showToastMsg("Failed to fetch products", "error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllProducts();
//   }, [slug, id, location.pathname]);

//   // ===================== Filter Products Based on Route =====================
//   const products = useMemo(() => {
//     if (!allProducts.length) return [];

//     let filtered = allProducts;

//     // Filter by category if slug is provided and not a skin type route
//     if (slug && !window.location.pathname.includes("skintype") && !id) {
//       filtered = filtered.filter(product => {
//         const categorySlug = product.category?.slug;
//         return categorySlug === slug;
//       });
//     }

//     // Filter by skin type if skin type route
//     if (window.location.pathname.includes("skintype") && slug) {
//       filtered = filtered.filter(product => {
//         const skinTypes = product.skinTypes || [];
//         return skinTypes.some(st => 
//           st.slug === slug || 
//           st.name?.toLowerCase() === slug.toLowerCase() ||
//           st._id === slug
//         );
//       });
//     }

//     return filtered;
//   }, [allProducts, slug, id, location.pathname]);

//   // ===================== Wishlist =====================
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         if (user?.guest) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axiosInstance.get("/api/user/wishlist");
//           if (Array.isArray(res.data.wishlist)) {
//             setWishlist(res.data.wishlist.map((item) => item._id));
//           }
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, [user]);

//   // ===================== Wishlist Toggle =====================
//   const toggleWishlist = async (productId) => {
//     try {
//       if (user?.guest) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter((id) => id !== productId);
//           showToastMsg("Removed from wishlist (guest mode)", "success");
//         } else {
//           updated.push(productId);
//           showToastMsg("Added to wishlist (guest mode)", "success");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//         return;
//       }

//       const res = await axiosInstance.post(`/api/user/wishlist/${productId}`);
//       if (res.data.wishlist) {
//         setWishlist(res.data.wishlist.map((item) => item._id));
//         showToastMsg("Wishlist updated!", "success");
//       } else {
//         setWishlist((prev) =>
//           prev.includes(productId)
//             ? prev.filter((id) => id !== productId)
//             : [...prev, productId]
//         );
//       }
//     } catch (err) {
//       console.error("Wishlist API error:", err);
//       showToastMsg("Failed to update wishlist", "error");
//     }
//   };

//   // ===================== Shade Select =====================
//   const handleShadeSelect = (
//     productId,
//     shadeName,
//     hex,
//     sku,
//     available,
//     displayPrice,
//     image,
//     stock
//   ) => {
//     if (!available) return;
//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: { shadeName, hex, sku, displayPrice, image, stock },
//     }));
//   };

//   const toggleShades = (productId) => {
//     setExpandedShades((prev) => ({
//       ...prev,
//       [productId]: !prev[productId],
//     }));
//   };

//   const handleAddToCart = async (prod) => {
//     try {
//       console.log("🛒 Starting add to cart for:", prod.name);
//       console.log("👤 User type:", user?.guest ? "Guest" : "Logged-in");

//       const hasVariants = Array.isArray(prod.variants) && prod.variants.length > 0;
//       const selectedShade = selectedShades[prod._id];
//       let variantToAdd = null;

//       console.log("📦 Product variants:", prod.variants);
//       console.log("🎨 Selected shade:", selectedShade);

//       if (hasVariants) {
//         const availableVariants = prod.variants.filter((v) => v.stock > 0);
//         console.log("✅ Available variants:", availableVariants);

//         if (availableVariants.length === 0) {
//           showToastMsg("❌ All variants are out of stock.", "error");
//           return;
//         }

//         if (selectedShade) {
//           const matchedVariant = prod.variants.find(
//             (v) => v.sku === selectedShade.sku
//           );
//           console.log("🔍 Matched variant:", matchedVariant);

//           if (matchedVariant && matchedVariant.stock > 0) {
//             variantToAdd = {
//               ...matchedVariant,
//               image: matchedVariant.images?.[0] || matchedVariant.image || selectedShade.image || prod.images?.[0] || "/placeholder.png"
//             };
//           } else {
//             showToastMsg("❌ Selected shade is out of stock.", "error");
//             return;
//           }
//         } else {
//           variantToAdd = {
//             ...availableVariants[0],
//             image: availableVariants[0].images?.[0] || availableVariants[0].image || prod.images?.[0] || "/placeholder.png"
//           };
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("❌ Product is out of stock.", "error");
//           return;
//         }
//         variantToAdd = {
//           sku: `sku-${prod._id}-default`,
//           shadeName: "Default",
//           hex: "#ccc",
//           image: prod.images?.[0] || "/placeholder.png",
//           originalPrice: prod.mrp || prod.price,
//           discountedPrice: prod.price,
//           stock: prod.stock ?? 1,
//         };
//       }

//       console.log("🚀 Final variant to add:", variantToAdd);
//       console.log("🖼️ Variant image:", variantToAdd.image);

//       // GUEST USER
//       if (user?.guest) {
//         console.log("🎯 Adding to guest cart...");
//         const success = await addToCart(prod, variantToAdd, true);

//         if (success) {
//           console.log("✅ Successfully added to guest cart");
//           showToastMsg("✅ Added to cart!", "success");

//           // Check what's in guest cart
//           const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//           console.log("📋 Guest cart contents:", guestCart);

//           setTimeout(() => {
//             navigate("/cartpage");
//           }, 100);
//         } else {
//           console.log("❌ Failed to add to guest cart");
//           showToastMsg("❌ Failed to add to cart", "error");
//         }
//         return;
//       }

//       // LOGGED-IN USER
//       try {
//         await addToCart(prod, variantToAdd, false);
//         showToastMsg("✅ Product added to cart!", "success");
//         navigate("/cartpage", { state: { refresh: true } });
//       } catch (error) {
//         if (error.message === "Authentication required") {
//           showToastMsg("⚠️ Please log in first", "error");
//           navigate("/login");
//         } else {
//           showToastMsg("❌ Failed to add product", "error");
//         }
//       }

//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       showToastMsg("❌ Failed to add product to cart", "error");
//     }
//   };

//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar
//         key={i}
//         size={16}
//         color={i < rating ? "#2b6cb0" : "#ccc"}
//         style={{ marginRight: "2px" }}
//       />
//     ));

//   // ===================== Filter & Pagination =====================

//   const filteredProducts = useMemo(() => {
//     if (!products.length) return [];

//     console.log(
//       "🔥 FILTER RE-RUN - Products:",
//       products.length,
//       "Filters:",
//       filters
//     );

//     let filtered = products.filter((product) => {
//       // 1️⃣ Stock check - keep all products for now, filter out of stock in UI

//       // 2️⃣ BRAND FILTER
//       if (filters.brand) {
//         let productBrandId = null;

//         // Handle brand as object or string
//         if (product.brand?._id) productBrandId = String(product.brand._id);
//         else if (typeof product.brand === "string")
//           productBrandId = product.brand;

//         if (productBrandId !== String(filters.brand)) return false;
//       }

//       // 3️⃣ CATEGORY FILTER
//       if (filters.category) {
//         const productCategoryId =
//           product.category?._id || product.category || null;
//         if (
//           !productCategoryId ||
//           String(productCategoryId) !== String(filters.category)
//         )
//           return false;
//       }

//       // 4️⃣ SKIN TYPE FILTER (Updated)
//       if (filters.skinType) {
//         const skinTypeIds = [];

//         // Support both product.skinType (object or array) and product.skinTypes (array or string)
//         if (product.skinType) {
//           if (Array.isArray(product.skinType)) {
//             product.skinType.forEach((st) =>
//               skinTypeIds.push(st._id || st.slug || st.name || st)
//             );
//           } else {
//             skinTypeIds.push(
//               product.skinType._id || product.skinType.slug || product.skinType.name || product.skinType
//             );
//           }
//         }

//         if (Array.isArray(product.skinTypes)) {
//           product.skinTypes.forEach((s) =>
//             skinTypeIds.push(s._id || s.slug || s.name || s)
//           );
//         }

//         // Check match
//         const matchesSkinType = skinTypeIds.some(
//           (id) => String(id) === String(filters.skinType)
//         );
//         if (!matchesSkinType) return false;
//       }

//       // 5️⃣ FORMULATION FILTER
//       if (filters.formulation) {
//         let formulationId = product.formulation?._id || null;
//         if (
//           !formulationId ||
//           String(formulationId) !== String(filters.formulation)
//         )
//           return false;
//       }

//       // 6️⃣ PRICE RANGE FILTER
//       if (filters.priceRange) {
//         const variant = product.variants?.[0] || {};
//         const price =
//           variant.discountedPrice || variant.displayPrice || product.price || 0;

//         if (filters.priceRange.max === null) {
//           if (price < filters.priceRange.min) return false;
//         } else if (
//           price < filters.priceRange.min ||
//           price > filters.priceRange.max
//         )
//           return false;
//       }

//       // 7️⃣ MIN RATING FILTER
//       if (filters.minRating) {
//         if ((product.avgRating || 0) < parseFloat(filters.minRating))
//           return false;
//       }

//       return true;
//     });

//     // 8️⃣ DISCOUNT SORT
//     if (filters.discountSort) {
//       filtered = [...filtered].sort((a, b) => {
//         const getDiscount = (prod) => {
//           const variant = prod.variants?.[0] || {};
//           const original = variant.originalPrice || prod.mrp || prod.price || 0;
//           const discounted =
//             variant.discountedPrice || variant.displayPrice || prod.price || 0;
//           return original - discounted;
//         };

//         const discountA = getDiscount(a);
//         const discountB = getDiscount(b);
//         return filters.discountSort === "high"
//           ? discountB - discountA
//           : discountA - discountB;
//       });
//     }

//     console.log(`🎯 FINAL RESULT: ${filtered.length} products after filtering`);
//     return filtered;
//   }, [products, filters]);

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const indexOfLast = currentPage * productsPerPage;
//   const currentProducts = filteredProducts.slice(
//     indexOfLast - productsPerPage,
//     indexOfLast
//   );

//   const goToPage = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters]);

//   // ===================== JSX Render =====================
//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader">
//           <div className="spinner"></div>
//           <p>Loading products...</p>
//         </div>
//       )}
//       <Header />

//       {/* Toast Notification */}
//       {toast.show && (
//         <div
//           className="toast-notification"
//           style={{
//             position: "fixed",
//             top: "20px",
//             right: "20px",
//             padding: "12px 20px",
//             borderRadius: "8px",
//             color: "#fff",
//             backgroundColor: toast.type === "error" ? "#f56565" : "#48bb78",
//             zIndex: 9999,
//           }}
//         >
//           {toast.message}
//         </div>
//       )}

//       <div className="banner-images text-center">
//         <img
//           src={bannerImage || "/banner-placeholder.jpg"}
//           alt="Banner"
//           className="w-100"
//           style={{ maxHeight: "400px", objectFit: "cover" }}
//         />
//       </div>

//       <div className="container-lg py-4">
//         <h2 className="mb-4 d-none d-md-none d-lg-block">{pageTitle}</h2>

//         <div className="row">
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter
//               filters={filters}
//               setFilters={setFilters}
//               currentPage="category"
//               filterData={filterData}
//             />
//           </div>

//           {/* Mobile Filter */}
//           <div className="d-lg-none mb-3 text-center">
//             <div className="d-flex align-items-baseline justify-content-between">
//               <h2 className="mb-4">{pageTitle}</h2>
//               <button
//                 className="btn btn-primary brand-filter-button"
//                 onClick={() => setShowMobileFilters(true)}
//               >
//                 <i className="bi bi-funnel-fill" style={{ fontSize: "18px" }}></i>
//               </button>
//             </div>

//             {showMobileFilters && (
//               <div
//                 className="mobile-filter-popup"
//                 onClick={() => setShowMobileFilters(false)}
//                 style={{
//                   paddingTop: "50px",
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "rgba(0, 0, 0, 0.6)",
//                   zIndex: 9999,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   className="mobile-filter-content mw-100"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={products}
//                     onClose={() => setShowMobileFilters(false)}
//                     hideBrandFilter={true}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="col-12 col-lg-9">
//             {/* Filter Summary */}
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <span className="text-muted">
//                   Showing {filteredProducts.length} of {products.length}{" "}
//                   products
//                 </span>
//               </div>
//               {Object.values(filters).some(
//                 (val) => val !== "" && val !== null
//               ) && (
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() =>
//                       setFilters({
//                         brand: "",
//                         category: "",
//                         skinType: "",
//                         formulation: "",
//                         priceRange: null,
//                         minRating: "",
//                         discountSort: "",
//                       })
//                     }
//                   >
//                     Clear Filters
//                   </button>
//                 )}
//             </div>

//             {/* Products List */}
//             <div className="row g-4">
//               {currentProducts.length > 0 ? (
//                 currentProducts.map((prod) => {
//                   const variants = Array.isArray(prod.variants)
//                     ? prod.variants
//                     : [];
//                   const isExpanded = expandedShades[prod._id] || false;
//                   const visibleVariants = isExpanded
//                     ? variants
//                     : variants.slice(0, maxVisibleShades);
//                   const isWishlisted = wishlist.includes(prod._id);
//                   const selectedShade = selectedShades[prod._id];

//                   return (
//                     <div key={prod._id} className="col-12 col-sm-6 col-lg-4">
//                       <div className="h-100 mt-3 position-relative">
//                         <div
//                           onClick={() => toggleWishlist(prod._id)}
//                           style={{
//                             position: "absolute",
//                             top: "8px",
//                             right: "8px",
//                             cursor: "pointer",
//                             color: isWishlisted ? "red" : "#ccc",
//                             fontSize: "22px",
//                             zIndex: 2,
//                           }}
//                         >
//                           {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                         </div>

//                         <img
//                           src={
//                             selectedShade?.image ||
//                             prod.images?.[0] ||
//                             "/placeholder.png"
//                           }
//                           alt={prod.name}
//                           className="card-img-top"
//                           style={{
//                             height: "200px",
//                             objectFit: "contain",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => navigate(`/product/${prod._id}`)}
//                         />

//                         <div className="card-body d-flex flex-column">
//                           <h5
//                             className="card-title mt-2"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => navigate(`/product/${prod._id}`)}
//                           >
//                             {prod.name}
//                           </h5>

//                           {variants.length > 0 && (
//                             <div className="mb-3 mt-2">
//                               {variants.length > 1 && (
//                                 <strong>Variants:</strong>
//                               )}

//                               <div
//                                 className="d-flex flex-wrap mt-2"
//                                 style={{ gap: "6px" }}
//                               >
//                                 {visibleVariants.map((variant, idx) => {
//                                   const isAvailable = variant.stock > 0;
//                                   const isSelected =
//                                     selectedShade?.sku === variant.sku ||
//                                     selectedShade?.shadeName ===
//                                     variant.shadeName;
//                                   const isShade =
//                                     variant.hex &&
//                                     variant.hex !== "null" &&
//                                     variant.hex.trim() !== "" &&
//                                     /^#[0-9A-F]{3,6}$/i.test(variant.hex);

//                                   return (
//                                     <div
//                                       key={idx}
//                                       title={`${variant.shadeName} ${isAvailable ? "" : "(Out of stock)"
//                                         }`}
//                                       style={{
//                                         width: isShade ? "30px" : "auto",
//                                         height: isShade ? "30px" : "auto",
//                                         padding: isShade ? "0" : "5px 10px",
//                                         borderRadius: isShade ? "50%" : "6px",
//                                         backgroundColor: isShade
//                                           ? variant.hex
//                                           : isSelected
//                                             ? "#000"
//                                             : "#fff",
//                                         color: isShade
//                                           ? "transparent"
//                                           : isSelected
//                                             ? "#fff"
//                                             : "#000",
//                                         border: isSelected
//                                           ? "2px solid black"
//                                           : "1px solid #ccc",
//                                         cursor: isAvailable
//                                           ? "pointer"
//                                           : "not-allowed",
//                                         opacity: isAvailable ? 1 : 0.5,
//                                         position: "relative",
//                                         display: "inline-flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                       }}
//                                       onClick={() =>
//                                         isAvailable &&
//                                         handleShadeSelect(
//                                           prod._id,
//                                           variant.shadeName,
//                                           variant.hex,
//                                           variant.sku,
//                                           isAvailable,
//                                           variant.displayPrice,
//                                           variant.images?.[0] ||
//                                           prod.images?.[0],
//                                           variant.stock
//                                         )
//                                       }
//                                     >
//                                       {!isShade && variant.shadeName}
//                                       {!isAvailable && (
//                                         <span
//                                           style={{
//                                             position: "absolute",
//                                             top: "50%",
//                                             left: "50%",
//                                             transform: "translate(-50%, -50%)",
//                                             fontSize: "14px",
//                                             color: "red",
//                                             fontWeight: "bold",
//                                             pointerEvents: "none",
//                                           }}
//                                         >
//                                           ❌
//                                         </span>
//                                       )}
//                                     </div>
//                                   );
//                                 })}
//                               </div>

//                               {variants.length > maxVisibleShades && (
//                                 <button
//                                   className="btn btn-link p-0 mt-1"
//                                   style={{ fontSize: "14px" }}
//                                   onClick={() => toggleShades(prod._id)}
//                                 >
//                                   {isExpanded ? "Show Less" : "Show More"}
//                                 </button>
//                               )}
//                             </div>
//                           )}

//                           {selectedShade && (
//                             <div className="mt-2 text-primary fw-bold">
//                               Selected: {selectedShade.shadeName}
//                             </div>
//                           )}

//                           <p
//                             className="fw-bold mb-2"
//                             style={{ fontSize: "16px" }}
//                           >
//                             {(() => {
//                               const variant =
//                                 selectedShade || prod.variants?.[0];
//                               const discountedPrice =
//                                 variant?.discountedPrice ||
//                                 variant?.displayPrice ||
//                                 prod.price;
//                               const originalPrice =
//                                 variant?.originalPrice ||
//                                 prod.mrp ||
//                                 prod.price;
//                               const hasDiscount =
//                                 originalPrice > discountedPrice;
//                               const discountPercent = hasDiscount
//                                 ? Math.round(
//                                   ((originalPrice - discountedPrice) /
//                                     originalPrice) *
//                                   100
//                                 )
//                                 : 0;

//                               return hasDiscount ? (
//                                 <>
//                                   ₹{discountedPrice}
//                                   <span
//                                     style={{
//                                       textDecoration: "line-through",
//                                       color: "#888",
//                                       marginLeft: "6px",
//                                       fontWeight: "normal",
//                                     }}
//                                   >
//                                     ₹{originalPrice}
//                                   </span>
//                                   <span
//                                     style={{
//                                       color: "#e53e3e",
//                                       marginLeft: "6px",
//                                       fontWeight: "600",
//                                     }}
//                                   >
//                                     ({discountPercent}% OFF)
//                                   </span>
//                                 </>
//                               ) : (
//                                 <>₹{originalPrice}</>
//                               );
//                             })()}
//                           </p>

//                           <div className="d-flex align-items-center mb-2">
//                             {renderStars(prod.avgRating || 0)}
//                             <span className="ms-2 text-muted small">
//                               ({prod.totalRatings || 0})
//                             </span>
//                           </div>

//                           <div className="mt-auto">
//                             <button
//                               className="btn btn-primary w-100"
//                               onClick={() => handleAddToCart(prod)}
//                               disabled={
//                                 (!prod.variants ||
//                                   prod.variants.length === 0) &&
//                                 prod.stock === 0
//                               }
//                             >
//                               {(!prod.variants || prod.variants.length === 0) &&
//                                 prod.stock === 0
//                                 ? "Out of Stock"
//                                 : "Add to Cart"}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">
//                     Try adjusting your filters to see more products.
//                   </p>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() =>
//                       setFilters({
//                         brand: "",
//                         category: "",
//                         skinType: "",
//                         formulation: "",
//                         priceRange: null,
//                         minRating: "",
//                         discountSort: "",
//                       })
//                     }
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* ===== Pagination ===== */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center mt-4">
//                 <nav>
//                   <ul className="pagination">
//                     <li
//                       className={`page-item ${currentPage === 1 ? "disabled" : ""
//                         }`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() => goToPage(currentPage - 1)}
//                       >
//                         Previous
//                       </button>
//                     </li>

//                     {Array.from({ length: totalPages }, (_, i) => (
//                       <li
//                         key={i + 1}
//                         className={`page-item ${currentPage === i + 1 ? "active" : ""
//                           }`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => goToPage(i + 1)}
//                         >
//                           {i + 1}
//                         </button>
//                       </li>
//                     ))}

//                     <li
//                       className={`page-item ${currentPage === totalPages ? "disabled" : ""
//                         }`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() => goToPage(currentPage + 1)}
//                       >
//                         Next
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ShopProduct;
















// /* ProductPage.jsx  –  single-endpoint edition  */
// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ShopProduct.css";
// import axiosInstance from "../utils/axiosInstance.js";

// const ALL_PRODUCTS_URL = "https://beauty.joyory.com/api/user/products/all";

// /* --------------------  utility: toast  ---------------------------- */
// const useToast = () => {
//   const [toast, setToast] = useState({ show: false, type: "error", message: "" });
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast({ show: false, message: "", type: "error" }), duration);
//   };
//   return [toast, showToastMsg];
// };

// /* --------------------  component  --------------------------------- */
// const ProductPage = () => {
//   const { slug, id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   /* -------------- local state -------------- */
//   const [allProducts, setAllProducts] = useState([]); // Store ALL products from all pages
//   const [pageTitle, setPageTitle] = useState("");
//   const [bannerImage, setBannerImage] = useState("");
//   const [selectedShades, setSelectedShades] = useState({});
//   const [expandedShades, setExpandedShades] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [skinType, setSkinType] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [toast, showToastMsg] = useToast();
//   const [currentPage, setCurrentPage] = useState(1);

//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     skinType: "",
//     formulation: "",
//     priceRange: null,
//     minRating: "",
//     discountSort: "",
//   });
//   const [filterData, setFilterData] = useState(null);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 12,
//     total: 0,
//     totalPages: 1,
//     hasMore: false
//   });

//   const productsPerPage = 12; // Frontend pagination for filtered results
//   const maxVisibleShades = 500;

//   /* ================================================================ */
//   /* 1️⃣  FETCH ALL PAGES - recursively fetch all products            */
//   /* ================================================================ */
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setLoading(true);
//         let allFetchedProducts = [];
//         let currentPage = 1;
//         let totalPages = 1;

//         // Fetch all pages recursively
//         const fetchPage = async (page) => {
//           try {
//             console.log(`📥 Fetching page ${page}...`);
//             const { data } = await axiosInstance.get(`${ALL_PRODUCTS_URL}?page=${page}&limit=100`);

//             if (data.products && data.products.length > 0) {
//               allFetchedProducts = [...allFetchedProducts, ...data.products];
//             }

//             if (data.pagination) {
//               totalPages = data.pagination.totalPages;
//               setPagination(data.pagination);
//             }

//             // If there are more pages, fetch the next one
//             if (page < totalPages) {
//               await fetchPage(page + 1);
//             }
//           } catch (err) {
//             console.error(`Error fetching page ${page}:`, err);
//             throw err;
//           }
//         };

//         await fetchPage(1);

//         console.log(`✅ Fetched ${allFetchedProducts.length} total products from ${totalPages} pages`);
//         setAllProducts(allFetchedProducts);

//         // Set filter data from first page response
//         const firstPageResponse = await axiosInstance.get(`${ALL_PRODUCTS_URL}?page=1&limit=100`);
//         const firstPageData = firstPageResponse.data;

//         setFilterData({
//           brands: firstPageData.brands || [],
//           categories: firstPageData.categories || [],
//           skinTypes: firstPageData.skinTypes || [],
//           formulations: firstPageData.formulations || [],
//         });

//         /* ---------- heading / banner (keep old logic) ---------- */
//         if (id) {
//           setPageTitle("Promotion Products");
//           setBannerImage("");
//         } else if (location.pathname.includes("skintype")) {
//           setPageTitle(firstPageData.skinType || "Skin Type");
//           setBannerImage("");
//         } else if (slug) {
//           const cat = (firstPageData.categories || []).find((c) => c.slug === slug);
//           setPageTitle(cat?.name || "Products");
//           setBannerImage(cat?.bannerImage || "");
//         } else {
//           setPageTitle("All Products");
//           setBannerImage("");
//         }
//         setCurrentPage(1);

//         /* ---------- auto-select first in-stock variant ---------- */
//         const defaultSelected = {};
//         allFetchedProducts.forEach((p) => {
//           const v = (p.variants || []).find((v) => v.stock > 0);
//           if (v)
//             defaultSelected[p._id] = {
//               shadeName: v.shadeName,
//               hex: v.hex,
//               sku: v.sku,
//               displayPrice: v.displayPrice,
//               image: v.images?.[0] || p.images?.[0],
//               stock: v.stock,
//             };
//         });
//         setSelectedShades(defaultSelected);
//       } catch (err) {
//         console.error("Error fetching all products:", err);
//         setAllProducts([]);
//         showToastMsg("Failed to fetch products");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllProducts();
//   }, [slug, id, location.pathname]);

//   /* ================================================================ */
//   /* FILTER PRODUCTS BASED ON ROUTE PARAMS                           */
//   /* ================================================================ */
//   const products = useMemo(() => {
//     if (!allProducts.length) return [];

//     let filtered = allProducts;

//     // Filter by category if slug is provided and not a skin type route
//     if (slug && !window.location.pathname.includes("skintype") && !id) {
//       filtered = filtered.filter(product => {
//         const categorySlug = product.category?.slug;
//         return categorySlug === slug;
//       });
//       console.log(`🎯 Filtered by category "${slug}": ${filtered.length} products`);
//     }

//     // Filter by skin type if skin type route
//     if (window.location.pathname.includes("skintype") && slug) {
//       filtered = filtered.filter(product => {
//         const skinTypes = product.skinTypes || [];
//         return skinTypes.some(st => 
//           st.slug === slug || 
//           st.name?.toLowerCase() === slug.toLowerCase() ||
//           st._id === slug
//         );
//       });
//       console.log(`🎯 Filtered by skin type "${slug}": ${filtered.length} products`);
//     }

//     return filtered;
//   }, [allProducts, slug, id, location.pathname]);

//   /* ================================================================ */
//   /* Wishlist – identical to previous file                            */
//   /* ================================================================ */
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         if (user?.guest) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axiosInstance.get("/api/user/wishlist");
//           if (Array.isArray(res.data.wishlist))
//             setWishlist(res.data.wishlist.map((item) => item._id));
//         }
//       } catch (err) {
//         console.error("Wishlist fetch error:", err);
//       }
//     };
//     fetchWishlist();
//   }, [user]);

//   /* ------------------------------------------------------------------ */
//   /*  Helpers – unchanged                                               */
//   /* ------------------------------------------------------------------ */
//   const toggleWishlist = async (productId) => {
//     try {
//       if (user?.guest) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter((id) => id !== productId);
//           showToastMsg("Removed from wishlist (guest mode)", "success");
//         } else {
//           updated.push(productId);
//           showToastMsg("Added to wishlist (guest mode)", "success");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//         return;
//       }
//       const res = await axiosInstance.post(`/api/user/wishlist/${productId}`);
//       if (res.data.wishlist) {
//         setWishlist(res.data.wishlist.map((item) => item._id));
//         showToastMsg("Wishlist updated!", "success");
//       } else {
//         setWishlist((prev) =>
//           prev.includes(productId)
//             ? prev.filter((id) => id !== productId)
//             : [...prev, productId]
//         );
//       }
//     } catch (err) {
//       console.error("Wishlist API error:", err);
//       showToastMsg("Failed to update wishlist", "error");
//     }
//   };

//   const handleShadeSelect = (
//     productId,
//     shadeName,
//     hex,
//     sku,
//     available,
//     displayPrice,
//     image,
//     stock
//   ) => {
//     if (!available) return;
//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: { shadeName, hex, sku, displayPrice, image, stock },
//     }));
//   };

//   const toggleShades = (productId) => {
//     setExpandedShades((prev) => ({ ...prev, [productId]: !prev[productId] }));
//   };

//   const handleAddToCart = async (prod) => {
//     try {
//       const hasVariants = Array.isArray(prod.variants) && prod.variants.length > 0;
//       const selectedShade = selectedShades[prod._id];
//       let variantToAdd = null;

//       if (hasVariants) {
//         const availableVariants = prod.variants.filter((v) => v.stock > 0);
//         if (availableVariants.length === 0) {
//           showToastMsg("❌ All variants are out of stock.", "error");
//           return;
//         }
//         if (selectedShade) {
//           const matched = prod.variants.find((v) => v.sku === selectedShade.sku);
//           if (matched && matched.stock > 0) {
//             variantToAdd = { ...matched, image: matched.images?.[0] || matched.image || selectedShade.image || prod.images?.[0] || "/placeholder.png" };
//           } else {
//             showToastMsg("❌ Selected shade is out of stock.", "error");
//             return;
//           }
//         } else {
//           variantToAdd = { ...availableVariants[0], image: availableVariants[0].images?.[0] || availableVariants[0].image || prod.images?.[0] || "/placeholder.png" };
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("❌ Product is out of stock.", "error");
//           return;
//         }
//         variantToAdd = {
//           sku: `sku-${prod._id}-default`,
//           shadeName: "Default",
//           hex: "#ccc",
//           image: prod.images?.[0] || "/placeholder.png",
//           originalPrice: prod.mrp || prod.price,
//           discountedPrice: prod.price,
//           stock: prod.stock ?? 1,
//         };
//       }

//       if (user?.guest) {
//         const success = await addToCart(prod, variantToAdd, true);
//         if (success) {
//           showToastMsg("✅ Added to cart!", "success");
//           setTimeout(() => navigate("/cartpage"), 100);
//         } else showToastMsg("❌ Failed to add to cart", "error");
//         return;
//       }

//       try {
//         await addToCart(prod, variantToAdd, false);
//         showToastMsg("✅ Product added to cart!", "success");
//         navigate("/cartpage", { state: { refresh: true } });
//       } catch (error) {
//         if (error.message === "Authentication required") {
//           showToastMsg("⚠️ Please log in first", "error");
//           navigate("/login");
//         } else showToastMsg("❌ Failed to add product", "error");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       showToastMsg("❌ Failed to add product to cart", "error");
//     }
//   };

//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar key={i} size={16} color={i < rating ? "#2b6cb0" : "#ccc"} style={{ marginRight: "2px" }} />
//     ));

//   /* ------------------------------------------------------------------ */
//   /* FILTERING & PAGINATION                                            */
//   /* ------------------------------------------------------------------ */
//   const filteredProducts = useMemo(() => {
//     if (!products.length) return [];

//     console.log("🔥 Applying filters to", products.length, "products");

//     let filtered = products.filter((product) => {
//       if (filters.brand) {
//         const productBrandId = product.brand?._id || product.brand;
//         if (String(productBrandId) !== String(filters.brand)) return false;
//       }
//       if (filters.category) {
//         const productCategoryId = product.category?._id || product.category;
//         if (String(productCategoryId) !== String(filters.category)) return false;
//       }
//       if (filters.skinType) {
//         const skinTypeIds = [];
//         if (product.skinType) {
//           if (Array.isArray(product.skinType))
//             product.skinType.forEach((st) => skinTypeIds.push(st._id || st.slug || st.name || st));
//           else skinTypeIds.push(product.skinType._id || product.skinType.slug || product.skinType.name || product.skinType);
//         }
//         if (Array.isArray(product.skinTypes))
//           product.skinTypes.forEach((s) => skinTypeIds.push(s._id || s.slug || s.name || s));
//         const matches = skinTypeIds.some((id) => String(id) === String(filters.skinType));
//         if (!matches) return false;
//       }
//       if (filters.formulation) {
//         const formulationId = product.formulation?._id || null;
//         if (String(formulationId) !== String(filters.formulation)) return false;
//       }
//       if (filters.priceRange) {
//         const variant = product.variants?.[0] || {};
//         const price = variant.discountedPrice || variant.displayPrice || product.price || 0;
//         if (filters.priceRange.max === null) {
//           if (price < filters.priceRange.min) return false;
//         } else if (price < filters.priceRange.min || price > filters.priceRange.max) return false;
//       }
//       if (filters.minRating) {
//         if ((product.avgRating || 0) < parseFloat(filters.minRating)) return false;
//       }
//       return true;
//     });

//     if (filters.discountSort) {
//       filtered = [...filtered].sort((a, b) => {
//         const getDiscount = (prod) => {
//           const variant = prod.variants?.[0] || {};
//           const original = variant.originalPrice || prod.mrp || prod.price || 0;
//           const discounted = variant.discountedPrice || variant.displayPrice || prod.price || 0;
//           return original - discounted;
//         };
//         const discountA = getDiscount(a);
//         const discountB = getDiscount(b);
//         return filters.discountSort === "high" ? discountB - discountA : discountA - discountB;
//       });
//     }

//     console.log(`🎯 Filtered result: ${filtered.length} products`);
//     return filtered;
//   }, [products, filters]);

//   // Frontend pagination for filtered results
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const indexOfLast = currentPage * productsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfLast - productsPerPage, indexOfLast);

//   const goToPage = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => { setCurrentPage(1); }, [filters]);

//   /* ====================================================================== */
//   /* ===========================  JSX  ==================================== */
//   /* ====================================================================== */
//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader">
//           <div className="spinner"></div>
//           <p>Loading products...</p>
//         </div>
//       )}
//       <Header />

//       {toast.show && (
//         <div
//           className="toast-notification"
//           style={{
//             position: "fixed",
//             top: "20px",
//             right: "20px",
//             padding: "12px 20px",
//             borderRadius: "8px",
//             color: "#fff",
//             backgroundColor: toast.type === "error" ? "#f56565" : "#48bb78",
//             zIndex: 9999,
//           }}
//         >
//           {toast.message}
//         </div>
//       )}

//       <div className="banner-images text-center">
//         <img
//           src={bannerImage || "/banner-placeholder.jpg"}
//           alt="Banner"
//           className="w-100"
//           style={{ maxHeight: "400px", objectFit: "cover" }}
//         />
//       </div>

//       <div className="container-lg py-4">
//         <h2 className="mb-4 d-none d-md-none d-lg-block">{pageTitle}</h2>

//         <div className="row">
//           {/* desktop filter */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter
//               filters={filters}
//               setFilters={setFilters}
//               filterData={filterData}
//               products={products}
//               currentPage="category"
//             />
//           </div>

//           {/* mobile filter toggle */}
//           <div className="d-lg-none mb-3 text-center">
//             <div className="d-flex align-items-baseline justify-content-between">
//               <h2 className="mb-4">{pageTitle}</h2>
//               <button
//                 className="btn btn-primary brand-filter-button"
//                 onClick={() => setShowMobileFilters(true)}
//               >
//                 <i className="bi bi-funnel-fill" style={{ fontSize: "18px" }}></i>
//               </button>
//             </div>

//             {showMobileFilters && (
//               <div
//                 className="mobile-filter-popup"
//                 onClick={() => setShowMobileFilters(false)}
//                 style={{
//                   paddingTop: "50px",
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "rgba(0, 0, 0, 0.6)",
//                   zIndex: 9999,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   className="mobile-filter-content mw-100"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={products}
//                     onClose={() => setShowMobileFilters(false)}
//                     hideBrandFilter={true}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* products area */}
//           <div className="col-12 col-lg-9">
//             {/* filter summary */}
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <span className="text-muted">
//                   Showing {currentProducts.length} of {filteredProducts.length} filtered products (from {allProducts.length} total)
//                 </span>
//               </div>
//               {Object.values(filters).some((v) => v !== "" && v !== null) && (
//                 <button
//                   className="btn btn-sm btn-outline-danger"
//                   onClick={() =>
//                     setFilters({
//                       brand: "",
//                       category: "",
//                       skinType: "",
//                       formulation: "",
//                       priceRange: null,
//                       minRating: "",
//                       discountSort: "",
//                     })
//                   }
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             {/* products grid */}
//             <div className="row g-4">
//               {currentProducts.length > 0 ? (
//                 currentProducts.map((prod) => {
//                   const variants = Array.isArray(prod.variants) ? prod.variants : [];
//                   const isExpanded = expandedShades[prod._id] || false;
//                   const visibleVariants = isExpanded ? variants : variants.slice(0, maxVisibleShades);
//                   const isWishlisted = wishlist.includes(prod._id);
//                   const selectedShade = selectedShades[prod._id];

//                   return (
//                     <div key={prod._id} className="col-12 col-sm-6 col-lg-4">
//                       <div className="h-100 mt-3 position-relative">
//                         {/* wishlist heart */}
//                         <div
//                           onClick={() => toggleWishlist(prod._id)}
//                           style={{
//                             position: "absolute",
//                             top: "8px",
//                             right: "8px",
//                             cursor: "pointer",
//                             color: isWishlisted ? "red" : "#ccc",
//                             fontSize: "22px",
//                             zIndex: 2,
//                           }}
//                         >
//                           {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                         </div>

//                         {/* product image */}
//                         <img
//                           src={selectedShade?.image || prod.images?.[0] || "/placeholder.png"}
//                           alt={prod.name}
//                           className="card-img-top"
//                           style={{ height: "200px", objectFit: "contain", cursor: "pointer" }}
//                           onClick={() => navigate(`/product/${prod._id}`)}
//                         />

//                         <div className="card-body d-flex flex-column">
//                           <h5
//                             className="card-title mt-2"
//                             style={{ cursor: "pointer" }}
//                             onClick={() => navigate(`/product/${prod._id}`)}
//                           >
//                             {prod.name}
//                           </h5>

//                           {/* variants */}
//                           {variants.length > 0 && (
//                             <div className="mb-3 mt-2">
//                               {variants.length > 1 && <strong>Variants:</strong>}
//                               <div className="d-flex flex-wrap mt-2" style={{ gap: "6px" }}>
//                                 {visibleVariants.map((variant, idx) => {
//                                   const isAvailable = variant.stock > 0;
//                                   const isSelected = selectedShade?.sku === variant.sku || selectedShade?.shadeName === variant.shadeName;
//                                   const isShade = variant.hex && variant.hex !== "null" && variant.hex.trim() !== "" && /^#[0-9A-F]{3,6}$/i.test(variant.hex);

//                                   return (
//                                     <div
//                                       key={idx}
//                                       title={`${variant.shadeName} ${isAvailable ? "" : "(Out of stock)"}`}
//                                       style={{
//                                         width: isShade ? "30px" : "auto",
//                                         height: isShade ? "30px" : "auto",
//                                         padding: isShade ? "0" : "5px 10px",
//                                         borderRadius: isShade ? "50%" : "6px",
//                                         backgroundColor: isShade ? variant.hex : isSelected ? "#000" : "#fff",
//                                         color: isShade ? "transparent" : isSelected ? "#fff" : "#000",
//                                         border: isSelected ? "2px solid black" : "1px solid #ccc",
//                                         cursor: isAvailable ? "pointer" : "not-allowed",
//                                         opacity: isAvailable ? 1 : 0.5,
//                                         position: "relative",
//                                         display: "inline-flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                       }}
//                                       onClick={() =>
//                                         isAvailable &&
//                                         handleShadeSelect(
//                                           prod._id,
//                                           variant.shadeName,
//                                           variant.hex,
//                                           variant.sku,
//                                           isAvailable,
//                                           variant.displayPrice,
//                                           variant.images?.[0] || prod.images?.[0],
//                                           variant.stock
//                                         )
//                                       }
//                                     >
//                                       {!isShade && variant.shadeName}
//                                       {!isAvailable && (
//                                         <span
//                                           style={{
//                                             position: "absolute",
//                                             top: "50%",
//                                             left: "50%",
//                                             transform: "translate(-50%, -50%)",
//                                             fontSize: "14px",
//                                             color: "red",
//                                             fontWeight: "bold",
//                                             pointerEvents: "none",
//                                           }}
//                                         >
//                                           ❌
//                                         </span>
//                                       )}
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                               {variants.length > maxVisibleShades && (
//                                 <button
//                                   className="btn btn-link p-0 mt-1"
//                                   style={{ fontSize: "14px" }}
//                                   onClick={() => toggleShades(prod._id)}
//                                 >
//                                   {isExpanded ? "Show Less" : "Show More"}
//                                 </button>
//                               )}
//                             </div>
//                           )}

//                           {selectedShade && (
//                             <div className="mt-2 text-primary fw-bold">Selected: {selectedShade.shadeName}</div>
//                           )}

//                           {/* price */}
//                           <p className="fw-bold mb-2" style={{ fontSize: "16px" }}>
//                             {(() => {
//                               const variant = selectedShade || prod.variants?.[0];
//                               const discountedPrice = variant?.discountedPrice || variant?.displayPrice || prod.price;
//                               const originalPrice = variant?.originalPrice || prod.mrp || prod.price;
//                               const hasDiscount = originalPrice > discountedPrice;
//                               const discountPercent = hasDiscount ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

//                               return hasDiscount ? (
//                                 <>
//                                   ₹{discountedPrice}
//                                   <span style={{ textDecoration: "line-through", color: "#888", marginLeft: "6px", fontWeight: "normal" }}>
//                                     ₹{originalPrice}
//                                   </span>
//                                   <span style={{ color: "#e53e3e", marginLeft: "6px", fontWeight: "600" }}>
//                                     ({discountPercent}% OFF)
//                                   </span>
//                                 </>
//                               ) : (
//                                 <>₹{originalPrice}</>
//                               );
//                             })()}
//                           </p>

//                           {/* rating */}
//                           <div className="d-flex align-items-center mb-2">
//                             {renderStars(prod.avgRating || 0)}
//                             <span className="ms-2 text-muted small">({prod.totalRatings || 0})</span>
//                           </div>

//                           {/* add to cart */}
//                           <div className="mt-auto">
//                             <button
//                               className="btn btn-primary w-100"
//                               onClick={() => handleAddToCart(prod)}
//                               disabled={(!prod.variants || prod.variants.length === 0) && prod.stock === 0}
//                             >
//                               {(!prod.variants || prod.variants.length === 0) && prod.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters to see more products.</p>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() =>
//                       setFilters({
//                         brand: "",
//                         category: "",
//                         skinType: "",
//                         formulation: "",
//                         priceRange: null,
//                         minRating: "",
//                         discountSort: "",
//                       })
//                     }
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* pagination */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center mt-4">
//                 <nav>
//                   <ul className="pagination">
//                     <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                       <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
//                         Previous
//                       </button>
//                     </li>
//                     {Array.from({ length: totalPages }, (_, i) => (
//                       <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
//                         <button className="page-link" onClick={() => goToPage(i + 1)}>
//                           {i + 1}
//                         </button>
//                       </li>
//                     ))}
//                     <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                       <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
//                         Next
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ProductPage;




















// /* ProductPage.jsx – Single Endpoint with Full Filtering Design (Mobile + Desktop) */
// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ProductPage.css"; // Use same CSS as top file
// import axiosInstance from "../utils/axiosInstance.js";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const ALL_PRODUCTS_URL = "/api/user/products/all";

// const ProductPage = () => {
//   const { slug, id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const [allProducts, setAllProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("");
//   const [bannerImage, setBannerImage] = useState("");
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState({ show: false, type: "error", message: "" });
//   const [currentPage, setCurrentPage] = useState(1);

//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     skinType: "",
//     formulation: "",
//     priceRange: null,
//     minRating: "",
//     discountSort: "",
//   });
//   const [filterData, setFilterData] = useState(null);

//   // Mobile offcanvas
//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

//   // Variant overlay
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const productsPerPage = 6;

//   // Toast
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast({ show: false, message: "", type: "error" }), duration);
//   };

//   // Helpers
//   const isValidHexColor = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex?.trim().toLowerCase() || "");

//   const getVariantDisplayText = (variant) =>
//     (variant.shadeName || variant.name || variant.size || variant.ml || variant.weight || "Default").toUpperCase();

//   const groupVariantsByType = (variants) => {
//     const grouped = { color: [], text: [] };
//     variants.forEach((v) => {
//       if (v?.hex && isValidHexColor(v.hex)) grouped.color.push(v);
//       else grouped.text.push(v);
//     });
//     return grouped;
//   };

//   const getBrandName = (product) =>
//     typeof product.brand === "object" ? product.brand.name : product.brand || "Unknown Brand";

//   const getProductSlug = (product) => product.slugs?.[0] || product._id;

//   // Fetch all products
//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setLoading(true);
//         let allFetched = [];
//         let page = 1;
//         let totalPages = 1;

//         do {
//           const { data } = await axiosInstance.get(`${ALL_PRODUCTS_URL}?page=${page}&limit=100`);
//           if (data.products?.length) allFetched.push(...data.products);
//           totalPages = data.pagination?.totalPages || 1;
//           page++;
//         } while (page <= totalPages);

//         setAllProducts(allFetched);

//         const firstRes = await axiosInstance.get(`${ALL_PRODUCTS_URL}?page=1&limit=100`);
//         setFilterData({
//           brands: firstRes.data.brands || [],
//           categories: firstRes.data.categories || [],
//           skinTypes: firstRes.data.skinTypes || [],
//           formulations: firstRes.data.formulations || [],
//         });

//         // Set title & banner
//         if (id) {
//           setPageTitle("Promotion Products");
//         } else if (location.pathname.includes("/skintype/") && slug) {
//           const st = firstRes.data.skinTypes?.find(s => s.slug === slug);
//           setPageTitle(st?.name || "Skin Type");
//         } else if (slug) {
//           const cat = firstRes.data.categories?.find(c => c.slug === slug);
//           setPageTitle(cat?.name || "Category");
//           setBannerImage(cat?.bannerImage || "");
//         } else {
//           setPageTitle("All Products");
//         }

//         // Default variant
//         const defaults = {};
//         allFetched.forEach((p) => {
//           const available = (p.variants || []).find(v => v.stock > 0) || p.variants?.[0];
//           if (available) defaults[p._id] = available;
//         });
//         setSelectedVariants(defaults);
//       } catch (err) {
//         console.error(err);
//         showToastMsg("Failed to load products", "error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllProducts();
//   }, [slug, id, location.pathname]);

//   // Wishlist
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         if (user?.guest) {
//           setWishlist(JSON.parse(localStorage.getItem("guestWishlist") || "[]"));
//         } else {
//           const res = await axiosInstance.get("/api/user/wishlist");
//           setWishlist(res.data.wishlist?.map(i => i._id) || []);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchWishlist();
//   }, [user]);

//   const toggleWishlist = async (productId) => {
//     try {
//       if (user?.guest) {
//         const updated = wishlist.includes(productId)
//           ? wishlist.filter(id => id !== productId)
//           : [...wishlist, productId];
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//         showToastMsg(updated.includes(productId) ? "Added to wishlist" : "Removed from wishlist", "success");
//         return;
//       }
//       const res = await axiosInstance.post(`/api/user/wishlist/${productId}`);
//       setWishlist(res.data.wishlist.map(i => i._id));
//       showToastMsg("Wishlist updated!", "success");
//     } catch (err) {
//       showToastMsg("Failed to update wishlist", "error");
//     }
//   };

//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
//   };

//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const handleAddToCart = async (prod) => {
//     setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = prod.variants || [];
//       let variantToAdd = selectedVariants[prod._id];

//       if (variants.length > 0) {
//         if (!variantToAdd || variantToAdd.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         variantToAdd = {
//           sku: `sku-${prod._id}-default`,
//           shadeName: "Default",
//           hex: "#ccc",
//           image: prod.images?.[0] || "/placeholder.png",
//           displayPrice: prod.price,
//           originalPrice: prod.mrp || prod.price,
//           stock: prod.stock ?? 1,
//         };
//       }

//       if (user?.guest) {
//         await addToCart(prod, variantToAdd, true);
//         showToastMsg("Added to cart!", "success");
//       } else {
//         await addToCart(prod, variantToAdd, false);
//         showToastMsg("Product added to cart!", "success");
//       }
//       navigate("/cartpage", { state: { refresh: true } });
//     } catch (err) {
//       if (err.message === "Authentication required") {
//         showToastMsg("Please log in first", "error");
//         navigate("/login");
//       } else {
//         showToastMsg("Failed to add to cart", "error");
//       }
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar key={i} size={16} color={i < rating ? "#2b6cb0" : "#ccc"} style={{ marginRight: "2px" }} />
//     ));

//   // Route filtering
//   const routeFilteredProducts = useMemo(() => {
//     if (!allProducts.length) return [];

//     let filtered = allProducts;

//     if (slug && !location.pathname.includes("/skintype/") && !id) {
//       filtered = filtered.filter(p => p.category?.slug === slug);
//     } else if (location.pathname.includes("/skintype/") && slug) {
//       filtered = filtered.filter(p =>
//         (p.skinTypes || []).some(st => st.slug === slug || st._id === slug)
//       );
//     }

//     return filtered;
//   }, [allProducts, slug, id, location.pathname]);

//   // Apply UI filters
//   const filteredProducts = useMemo(() => {
//     let list = routeFilteredProducts;

//     if (filters.brand) list = list.filter(p => String(p.brand?._id || p.brand) === String(filters.brand));
//     if (filters.skinType) {
//       list = list.filter(p => {
//         const ids = [];
//         if (p.skinType) {
//           if (Array.isArray(p.skinType)) p.skinType.forEach(st => ids.push(st._id || st.slug || st));
//           else ids.push(p.skinType._id || p.skinType.slug || p.skinType);
//         }
//         if (p.skinTypes) p.skinTypes.forEach(st => ids.push(st._id || st.slug || st));
//         return ids.some(id => String(id) === String(filters.skinType));
//       });
//     }
//     if (filters.formulation) list = list.filter(p => String(p.formulation?._id) === String(filters.formulation));
//     if (filters.priceRange) {
//       list = list.filter(p => {
//         const price = selectedVariants[p._id]?.displayPrice || p.variants?.[0]?.displayPrice || p.price || 0;
//         return filters.priceRange.max === null
//           ? price >= filters.priceRange.min
//           : price >= filters.priceRange.min && price <= filters.priceRange.max;
//       });
//     }
//     if (filters.minRating) list = list.filter(p => (p.avgRating || 0) >= parseFloat(filters.minRating));

//     if (filters.discountSort) {
//       list.sort((a, b) => {
//         const getDiscount = (p) => {
//           const v = selectedVariants[p._id] || p.variants?.[0] || {};
//           const orig = v.originalPrice || p.mrp || p.price || 0;
//           const disc = v.displayPrice || p.price || 0;
//           return orig - disc;
//         };
//         return filters.discountSort === "high"
//           ? getDiscount(b) - getDiscount(a)
//           : getDiscount(a) - getDiscount(b);
//       });
//     }

//     return list;
//   }, [routeFilteredProducts, filters, selectedVariants]);

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const currentProducts = filteredProducts.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => setCurrentPage(1), [filters]);

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader">
//           <div className="spinner"></div>
//           <p>Loading products...</p>
//         </div>
//       )}

//       <Header />

//       {toast.show && (
//         <div className="toast-notification" style={{
//           position: "fixed", top: "20px", right: "20px", padding: "12px 20px",
//           borderRadius: "8px", color: "#fff",
//           backgroundColor: toast.type === "error" ? "#f56565" : "#48bb78",
//           zIndex: 9999
//         }}>
//           {toast.message}
//         </div>
//       )}

//       <div className="banner-images text-center">
//         <img src={bannerImage || "/banner-placeholder.jpg"} alt="Banner" className="w-100" style={{ maxHeight: "400px", objectFit: "cover" }} />
//       </div>

//       <div className="container-lg py-4">
//         <h2 className="mb-4 d-none d-lg-block">{pageTitle}</h2>

//         <div className="row">
//           {/* Desktop Sidebar */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="category" />
//           </div>

//           {/* Mobile Filter + Sort Buttons */}
//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>

//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   {/* Filter Button */}
//                   <div className="col-6">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img src={filtering} alt="Filter" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold">Filter</p>
//                         <span className="text-muted small">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>

//                   {/* Sort Button */}
//                   <div className="col-6 border-end">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img src={updownarrow} alt="Sort" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold">Sort by</p>
//                         <span className="text-muted small">{getCurrentSortText()}</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Filter Offcanvas */}
//           {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{
//                 zIndex: 1050,
//                 borderTopLeftRadius: "16px",
//                 borderTopRightRadius: "16px",
//                 maxHeight: "85vh",
//                 boxShadow: "0 -4px 20px rgba(0,0,0,0.2)"
//               }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowFilterOffcanvas(false)}></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={allProducts}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Mobile Sort Offcanvas */}
//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{
//                 zIndex: 1050,
//                 borderTopLeftRadius: "16px",
//                 borderTopRightRadius: "16px",
//                 maxHeight: "60vh",
//                 boxShadow: "0 -4px 12px rgba(0,0,0,0.15)"
//               }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowSortOffcanvas(false)}></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={!filters.discountSort}
//                         onChange={() => { setFilters(prev => ({ ...prev, discountSort: "" })); setShowSortOffcanvas(false); }} />
//                       <span>Relevance</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "high"}
//                         onChange={() => { setFilters(prev => ({ ...prev, discountSort: "high" })); setShowSortOffcanvas(false); }} />
//                       <span>Highest Discount First</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "low"}
//                         onChange={() => { setFilters(prev => ({ ...prev, discountSort: "low" })); setShowSortOffcanvas(false); }} />
//                       <span>Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Product Grid */}
//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted">Showing {filteredProducts.length} of {allProducts.length} products</span>
//               {Object.values(filters).some(v => v !== "" && v !== null) && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={() => setFilters({
//                   brand: "", category: "", skinType: "", formulation: "", priceRange: null, minRating: "", discountSort: ""
//                 })}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {currentProducts.length > 0 ? (
//                 currentProducts.map((prod) => {
//                   const variants = Array.isArray(prod.variants) ? prod.variants : [];
//                   const selectedVariant = selectedVariants[prod._id] || variants[0];
//                   const grouped = groupVariantsByType(variants);
//                   const totalVariants = variants.length;
//                   const isWishlisted = wishlist.includes(prod._id);
//                   const productSlug = getProductSlug(prod);
//                   const imageUrl = selectedVariant?.images?.[0] || selectedVariant?.image || prod.images?.[0] || "/placeholder.png";

//                   const initialColors = grouped.color.slice(0, 4);
//                   const initialText = grouped.text.slice(0, 2);

//                   return (
//                     <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative">
//                       <div onClick={() => toggleWishlist(prod._id)} style={{
//                         position: "absolute", top: "8px", right: "8px", cursor: "pointer",
//                         color: isWishlisted ? "red" : "#ccc", fontSize: "22px", zIndex: 2
//                       }}>
//                         {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                       </div>

//                       <img src={imageUrl} alt={prod.name} className="card-img-top" style={{
//                         height: "200px", objectFit: "contain", cursor: "pointer"
//                       }} onClick={() => navigate(`/product/${productSlug}`)} />

//                       <div className="d-flex align-items-center mt-2">
//                         {renderStars(prod.avgRating || 0)}
//                         <span className="ms-2 text-muted small">({prod.totalRatings || 0})</span>
//                       </div>

//                       <div className="card-body p-0 d-flex flex-column" style={{ height: "320px" }}>
//                         <div className="brand-name text-muted small mb-1 fw-medium">{getBrandName(prod)}</div>

//                         <h5 className="card-title mt-2 d-lg-flex d-md-block flex-lg-wrap flex-md-wrap align-items-center gap-1" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${productSlug}`)}>
//                           {prod.name}
//                           {selectedVariant?.shadeName && (
//                             <div className="text-black fw-normal fs-6" style={{ marginTop: "-2px" }}>
//                               {getVariantDisplayText(selectedVariant)}
//                             </div>
//                           )}
//                         </h5>

//                         {variants.length > 0 && (
//                           <div className="variant-section mt-3">
//                             {grouped.color.length > 0 && (
//                               <div className="d-flex flex-wrap gap-2 mb-2">
//                                 {initialColors.map(v => {
//                                   const isSelected = selectedVariant?.sku === v.sku;
//                                   const isOutOfStock = v.stock <= 0;
//                                   return (
//                                     <div key={v.sku || v._id} className="color-circle" style={{
//                                       width: "28px", height: "28px", borderRadius: "20%",
//                                       backgroundColor: v.hex || "#ccc",
//                                       border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                       cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                       opacity: isOutOfStock ? 0.5 : 1,
//                                       position: "relative"
//                                     }} onClick={() => !isOutOfStock && handleVariantSelect(prod._id, v)}>
//                                       {isSelected && <span style={{
//                                         position: "absolute", top: "50%", left: "50%",
//                                         transform: "translate(-50%, -50%)", color: "#fff", fontSize: "14px", fontWeight: "bold"
//                                       }}>✓</span>}
//                                     </div>
//                                   );
//                                 })}
//                                 {grouped.color.length > 4 && (
//                                   <button className="more-btn" onClick={() => openVariantOverlay(prod._id, "color")} style={{
//                                     width: "28px", height: "28px", borderRadius: "6px",
//                                     background: "#f5f5f5", border: "1px solid #ddd", fontSize: "10px", fontWeight: "bold"
//                                   }}>
//                                     +{grouped.color.length - 4}
//                                   </button>
//                                 )}
//                               </div>
//                             )}

//                             {grouped.text.length > 0 && (
//                               <div className="d-flex flex-wrap gap-2">
//                                 {initialText.map(v => {
//                                   const isSelected = selectedVariant?.sku === v.sku;
//                                   const isOutOfStock = v.stock <= 0;
//                                   return (
//                                     <div key={v.sku || v._id} style={{
//                                       padding: "6px 12px", borderRadius: "6px",
//                                       border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                       background: isSelected ? "#000" : "#fff",
//                                       color: isSelected ? "#fff" : "#000",
//                                       fontSize: "13px",
//                                       cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                       opacity: isOutOfStock ? 0.5 : 1
//                                     }} onClick={() => !isOutOfStock && handleVariantSelect(prod._id, v)}>
//                                       {getVariantDisplayText(v)}
//                                     </div>
//                                   );
//                                 })}
//                                 {grouped.text.length > 2 && (
//                                   <button className="more-btn" onClick={() => openVariantOverlay(prod._id, "text")} style={{
//                                     padding: "6px 12px", borderRadius: "6px",
//                                     background: "#f5f5f5", border: "1px solid #ddd", fontSize: "12px"
//                                   }}>
//                                     +{grouped.text.length - 2}
//                                   </button>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         <p className="fw-bold mb-3 mt-3" style={{ fontSize: "16px" }}>
//                           {(() => {
//                             const price = selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0;
//                             const original = selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || price;
//                             const hasDiscount = original > price;
//                             const percent = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;
//                             return hasDiscount ? (
//                               <>
//                                 ₹{price}
//                                 <span style={{ textDecoration: "line-through", color: "#888", marginLeft: "8px" }}>₹{original}</span>
//                                 <span style={{ color: "#e53e3e", marginLeft: "8px", fontWeight: "600" }}>({percent}% OFF)</span>
//                               </>
//                             ) : <>₹{original}</>;
//                           })()}
//                         </p>

//                         <div className="mt-auto">
//                           <button
//                             className={`btn add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${addingToCart[prod._id] ? "bg-black text-white" : ""}`}
//                             onClick={() => handleAddToCart(prod)}
//                             disabled={selectedVariant?.stock <= 0 || addingToCart[prod._id]}
//                             style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
//                           >
//                             {addingToCart[prod._id] ? (
//                               <>
//                                 <span className="spinner-border spinner-border-sm me-2"></span>
//                                 Adding...
//                               </>
//                             ) : selectedVariant?.stock <= 0 && variants.length > 0 ? (
//                               "Out of Stock"
//                             ) : (
//                               <>
//                                 Add to Cart
//                                 <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Variant Overlay */}
//                       {showVariantOverlay === prod._id && (
//                         <div className="variant-overlay" onClick={closeVariantOverlay}>
//                           <div className="variant-overlay-content" onClick={e => e.stopPropagation()} style={{
//                             width: "90%", maxWidth: "500px", maxHeight: "80vh",
//                             background: "#fff", borderRadius: "12px", overflowY: "scroll",
//                             display: "flex", flexDirection: "column"
//                           }}>
//                             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                               <h5 className="m-0">Select Variant ({totalVariants})</h5>
//                               <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: "24px" }}>×</button>
//                             </div>

//                             <div className="variant-tabs d-flex">
//                               <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>All ({totalVariants})</button>
//                               {grouped.color.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>Colors ({grouped.color.length})</button>}
//                               {grouped.text.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>Sizes ({grouped.text.length})</button>}
//                             </div>



//                             <div className="row">

//                             <div className="row p-3 flex-grow-1" style={{overflow:'auto'}}>


//                               {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.map(v => {
//                                 const isSelected = selectedVariant?.sku === v.sku;
//                                 const isOutOfStock = v.stock <= 0;
//                                 return (
//                                   <div className="col-lg-4 col-6  mt-4 mt-lg-2">
//                                   <div key={v.sku || v._id} className="text-center" style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }} onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                                     <div style={{
//                                       width: "28px", height: "28px", borderRadius: "20%",
//                                       backgroundColor: v.hex || "#ccc", margin: "0 auto 8px",
//                                       border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                       opacity: isOutOfStock ? 0.5 : 1, position: "relative"
//                                     }}>
//                                       {isSelected && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#fff", fontWeight: "bold" }}>✓</span>}
//                                     </div>
//                                     <div className="font-size-shopproduct">{getVariantDisplayText(v)}</div>
//                                     {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
//                                   </div>
//                                   </div>

//                                 );
//                               })}

//                               {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.map(v => {
//                                 const isSelected = selectedVariant?.sku === v.sku;
//                                 const isOutOfStock = v.stock <= 0;
//                                 return (
//                                   <div key={v.sku || v._id} className="text-center col-lg-4 col-6  mt-4 mt-lg-2" style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }} onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                                     <div style={{
//                                       padding: "10px", borderRadius: "8px",
//                                       border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                       background: isSelected ? "#f8f9fa" : "#fff",
//                                       minHeight: "50px", display: "flex",
//                                       alignItems: "center", justifyContent: "center",
//                                       opacity: isOutOfStock ? 0.5 : 1
//                                     }}>
//                                       {getVariantDisplayText(v)}
//                                     </div>
//                                     {isOutOfStock && <div className="text-danger small font-size mt-1">Out of Stock</div>}
//                                   </div>
//                                 );
//                               })}




//                             </div>

//                             </div>

//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               )}
//             </div>

//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center mt-5">
//                 <nav>
//                   <ul className="pagination">
//                     <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                       <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Previous</button>
//                     </li>
//                     {Array.from({ length: totalPages }, (_, i) => (
//                       <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
//                         <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
//                       </li>
//                     ))}
//                     <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                       <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Next</button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ProductPage;













// /* ProductPage.jsx – Infinite Scrolling with Full Filtering Design (Mobile + Desktop) */
// import React, { useState, useEffect, useContext, useMemo, useRef, useCallback } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ProductPage.css"; // Use same CSS as top file
// import axiosInstance from "../utils/axiosInstance.js";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const ALL_PRODUCTS_URL = "/api/user/products/all";
// const PRODUCTS_PER_PAGE = 12; // Items to load per scroll
// const DEBOUNCE_DELAY = 500; // Debounce delay for API calls

// const ProductPage = () => {
//   const { slug, id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // State
//   const [allProducts, setAllProducts] = useState([]);
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("");
//   const [bannerImage, setBannerImage] = useState("");
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [toast, setToast] = useState({ show: false, type: "error", message: "" });

//   // Infinite Scroll State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   // Filters
//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     skinType: "",
//     formulation: "",
//     priceRange: null,
//     minRating: "",
//     discountSort: "",
//   });

//   const [filterData, setFilterData] = useState(null);

//   // Mobile offcanvas
//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

//   // Variant overlay
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Refs
//   const observerRef = useRef();
//   const lastProductRef = useRef();
//   const debounceTimerRef = useRef(null);

//   // Toast
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast({ show: false, message: "", type: "error" }), duration);
//   };

//   // Helpers
//   const isValidHexColor = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex?.trim().toLowerCase() || "");

//   const getVariantDisplayText = (variant) =>
//     (variant.shadeName || variant.name || variant.size || variant.ml || variant.weight || "Default").toUpperCase();

//   const groupVariantsByType = (variants) => {
//     const grouped = { color: [], text: [] };
//     variants.forEach((v) => {
//       if (v?.hex && isValidHexColor(v.hex)) grouped.color.push(v);
//       else grouped.text.push(v);
//     });
//     return grouped;
//   };

//   const getBrandName = (product) =>
//     typeof product.brand === "object" ? product.brand.name : product.brand || "Unknown Brand";

//   const getProductSlug = (product) => product.slugs?.[0] || product._id;

//   // Debounced API call function
//   const debouncedApiCall = useCallback((callback, delay) => {
//     if (debounceTimerRef.current) {
//       clearTimeout(debounceTimerRef.current);
//     }
//     debounceTimerRef.current = setTimeout(callback, delay);
//   }, []);

//   // Fetch initial products with infinite scroll support
//   useEffect(() => {
//     const fetchInitialProducts = async () => {
//       try {
//         setInitialLoading(true);
//         setLoadingMore(false);

//         // Reset infinite scroll states
//         setCurrentPage(1);
//         setHasMore(true);

//         // Fetch first page
//         const { data } = await axiosInstance.get(
//           `${ALL_PRODUCTS_URL}?page=1&limit=${PRODUCTS_PER_PAGE}`
//         );

//         setAllProducts(data.products || []);
//         setDisplayedProducts(data.products || []);
//         setTotalPages(data.pagination?.totalPages || 1);

//         // Set filter data
//         setFilterData({
//           brands: data.brands || [],
//           categories: data.categories || [],
//           skinTypes: data.skinTypes || [],
//           formulations: data.formulations || [],
//         });

//         // Set title & banner
//         if (id) {
//           setPageTitle("Promotion Products");
//         } else if (location.pathname.includes("/skintype/") && slug) {
//           const st = data.skinTypes?.find(s => s.slug === slug);
//           setPageTitle(st?.name || "Skin Type");
//         } else if (slug) {
//           const cat = data.categories?.find(c => c.slug === slug);
//           setPageTitle(cat?.name || "Category");
//           setBannerImage(cat?.bannerImage || "");
//         } else {
//           setPageTitle("All Products");
//         }

//         // Default variants
//         const defaults = {};
//         data.products?.forEach((p) => {
//           const available = (p.variants || []).find(v => v.stock > 0) || p.variants?.[0];
//           if (available) defaults[p._id] = available;
//         });
//         setSelectedVariants(defaults);

//         // Set hasMore based on total pages
//         if (data.pagination?.totalPages <= 1) {
//           setHasMore(false);
//         }

//       } catch (err) {
//         console.error("Failed to load initial products:", err);
//         showToastMsg("Failed to load products", "error");
//       } finally {
//         setInitialLoading(false);
//         setLoading(false);
//       }
//     };

//     fetchInitialProducts();

//     // Cleanup debounce timer on unmount
//     return () => {
//       if (debounceTimerRef.current) {
//         clearTimeout(debounceTimerRef.current);
//       }
//     };
//   }, [slug, id, location.pathname]);

//   // Fetch more products for infinite scroll
//   const fetchMoreProducts = async () => {
//     if (loadingMore || !hasMore) return;

//     try {
//       setLoadingMore(true);
//       const nextPage = currentPage + 1;

//       const { data } = await axiosInstance.get(
//         `${ALL_PRODUCTS_URL}?page=${nextPage}&limit=${PRODUCTS_PER_PAGE}`
//       );

//       if (data.products?.length > 0) {
//         // Append new products
//         setAllProducts(prev => [...prev, ...data.products]);
//         setDisplayedProducts(prev => [...prev, ...data.products]);
//         setCurrentPage(nextPage);

//         // Update default variants for new products
//         const newDefaults = { ...selectedVariants };
//         data.products.forEach((p) => {
//           const available = (p.variants || []).find(v => v.stock > 0) || p.variants?.[0];
//           if (available) newDefaults[p._id] = available;
//         });
//         setSelectedVariants(newDefaults);

//         // Check if more pages exist
//         if (nextPage >= (data.pagination?.totalPages || 1)) {
//           setHasMore(false);
//         }
//       } else {
//         setHasMore(false);
//       }
//     } catch (err) {
//       console.error("Failed to load more products:", err);
//       showToastMsg("Failed to load more products", "error");
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   // Intersection Observer for infinite scroll
//   useEffect(() => {
//     if (!hasMore || initialLoading) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !loadingMore) {
//           debouncedApiCall(fetchMoreProducts, DEBOUNCE_DELAY);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "100px", // Load when within 100px of viewport
//         threshold: 0.1,
//       }
//     );

//     if (lastProductRef.current) {
//       observer.observe(lastProductRef.current);
//     }

//     return () => {
//       if (lastProductRef.current) {
//         observer.unobserve(lastProductRef.current);
//       }
//     };
//   }, [hasMore, loadingMore, initialLoading, displayedProducts.length]);

//   // Filter products when filters change
//   useEffect(() => {
//     if (allProducts.length === 0) return;

//     setInitialLoading(true);

//     // Reset to first page when filters change
//     const applyFilters = async () => {
//       try {
//         // Reset infinite scroll states
//         setCurrentPage(1);
//         setHasMore(true);

//         // Build query parameters for filtered API call
//         const queryParams = new URLSearchParams();
//         queryParams.append('page', '1');
//         queryParams.append('limit', PRODUCTS_PER_PAGE.toString());

//         if (filters.brand) queryParams.append('brand', filters.brand);
//         if (filters.category) queryParams.append('category', filters.category);
//         if (filters.skinType) queryParams.append('skinType', filters.skinType);
//         if (filters.formulation) queryParams.append('formulation', filters.formulation);
//         if (filters.minRating) queryParams.append('minRating', filters.minRating);
//         if (filters.priceRange) {
//           queryParams.append('minPrice', filters.priceRange.min.toString());
//           if (filters.priceRange.max) {
//             queryParams.append('maxPrice', filters.priceRange.max.toString());
//           }
//         }

//         // Add route filters
//         if (slug && !location.pathname.includes("/skintype/") && !id) {
//           queryParams.append('categorySlug', slug);
//         } else if (location.pathname.includes("/skintype/") && slug) {
//           queryParams.append('skinTypeSlug', slug);
//         }

//         // Make filtered API call
//         const { data } = await axiosInstance.get(
//           `${ALL_PRODUCTS_URL}?${queryParams.toString()}`
//         );

//         setDisplayedProducts(data.products || []);
//         setAllProducts(data.products || []);
//         setTotalPages(data.pagination?.totalPages || 1);

//         // Check if more pages exist
//         if (data.pagination?.totalPages <= 1) {
//           setHasMore(false);
//         }

//       } catch (err) {
//         console.error("Failed to apply filters:", err);
//         showToastMsg("Failed to apply filters", "error");
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     debouncedApiCall(applyFilters, DEBOUNCE_DELAY);
//   }, [filters, slug, id, location.pathname]);

//   // Wishlist
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         if (user?.guest) {
//           setWishlist(JSON.parse(localStorage.getItem("guestWishlist") || "[]"));
//         } else {
//           const res = await axiosInstance.get("/api/user/wishlist");
//           setWishlist(res.data.wishlist?.map(i => i._id) || []);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchWishlist();
//   }, [user]);

//   const toggleWishlist = async (productId) => {
//     try {
//       if (user?.guest) {
//         const updated = wishlist.includes(productId)
//           ? wishlist.filter(id => id !== productId)
//           : [...wishlist, productId];
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//         showToastMsg(updated.includes(productId) ? "Added to wishlist" : "Removed from wishlist", "success");
//         return;
//       }
//       const res = await axiosInstance.post(`/api/user/wishlist/${productId}`);
//       setWishlist(res.data.wishlist.map(i => i._id));
//       showToastMsg("Wishlist updated!", "success");
//     } catch (err) {
//       showToastMsg("Failed to update wishlist", "error");
//     }
//   };

//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
//   };

//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const handleAddToCart = async (prod) => {
//     setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = prod.variants || [];
//       let variantToAdd = selectedVariants[prod._id];

//       if (variants.length > 0) {
//         if (!variantToAdd || variantToAdd.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         variantToAdd = {
//           sku: `sku-${prod._id}-default`,
//           shadeName: "Default",
//           hex: "#ccc",
//           image: prod.images?.[0] || "/placeholder.png",
//           displayPrice: prod.price,
//           originalPrice: prod.mrp || prod.price,
//           stock: prod.stock ?? 1,
//         };
//       }

//       if (user?.guest) {
//         await addToCart(prod, variantToAdd, true);
//         showToastMsg("Added to cart!", "success");
//       } else {
//         await addToCart(prod, variantToAdd, false);
//         showToastMsg("Product added to cart!", "success");
//       }

//       navigate("/cartpage", { state: { refresh: true } });
//     } catch (err) {
//       if (err.message === "Authentication required") {
//         showToastMsg("Please log in first", "error");
//         navigate("/login");
//       } else {
//         showToastMsg("Failed to add to cart", "error");
//       }
//     } finally {
//       setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar key={i} size={16} color={i < rating ? "#2b6cb0" : "#ccc"} style={{ marginRight: "2px" }} />
//     ));

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   // Manual load more button handler
//   const handleLoadMore = () => {
//     if (!loadingMore && hasMore) {
//       fetchMoreProducts();
//     }
//   };

//   // Clear all filters
//   const handleClearFilters = () => {
//     setFilters({
//       brand: "", 
//       category: "", 
//       skinType: "", 
//       formulation: "", 
//       priceRange: null, 
//       minRating: "", 
//       discountSort: ""
//     });
//     // Reset to show all products
//     setCurrentPage(1);
//     setHasMore(true);
//   };

//   return (
//     <>
//       {initialLoading && (
//         <div className="fullscreen-loader">
//           <div className="spinner"></div>
//           <p>Loading products...</p>
//         </div>
//       )}

//       <Header />

//       {toast.show && (
//         <div className="toast-notification" style={{
//           position: "fixed", top: "20px", right: "20px", padding: "12px 20px",
//           borderRadius: "8px", color: "#fff",
//           backgroundColor: toast.type === "error" ? "#f56565" : "#48bb78",
//           zIndex: 9999
//         }}>
//           {toast.message}
//         </div>
//       )}

//       <div className="banner-images text-center">
//         <img 
//           src={bannerImage || "/banner-placeholder.jpg"} 
//           alt="Banner" 
//           className="w-100" 
//           style={{ maxHeight: "400px", objectFit: "cover" }} 
//         />
//       </div>

//       <div className="container-lg py-4">
//         <h2 className="mb-4 d-none d-lg-block">{pageTitle}</h2>

//         <div className="row">
//           {/* Desktop Sidebar */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter 
//               filters={filters} 
//               setFilters={setFilters} 
//               currentPage="category" 
//             />
//           </div>

//           {/* Mobile Filter + Sort Buttons */}
//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   {/* Filter Button */}
//                   <div className="col-6">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img src={filtering} alt="Filter" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold">Filter</p>
//                         <span className="text-muted small">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>

//                   {/* Sort Button */}
//                   <div className="col-6 border-end">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img src={updownarrow} alt="Sort" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold">Sort by</p>
//                         <span className="text-muted small">{getCurrentSortText()}</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Filter Offcanvas */}
//           {showFilterOffcanvas && (
//             <>
//               <div 
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark" 
//                 style={{ opacity: 0.5, zIndex: 1040 }} 
//                 onClick={() => setShowFilterOffcanvas(false)}
//               ></div>

//               <div 
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: "16px",
//                   borderTopRightRadius: "16px",
//                   maxHeight: "85vh",
//                   boxShadow: "0 -4px 20px rgba(0,0,0,0.2)"
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button 
//                     className="btn-close position-absolute end-0 me-3" 
//                     style={{ top: "50%", transform: "translateY(-50%)" }} 
//                     onClick={() => setShowFilterOffcanvas(false)}
//                   ></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>

//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={allProducts}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Mobile Sort Offcanvas */}
//           {showSortOffcanvas && (
//             <>
//               <div 
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark" 
//                 style={{ opacity: 0.5, zIndex: 1040 }} 
//                 onClick={() => setShowSortOffcanvas(false)}
//               ></div>

//               <div 
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: "16px",
//                   borderTopRightRadius: "16px",
//                   maxHeight: "60vh",
//                   boxShadow: "0 -4px 12px rgba(0,0,0,0.15)"
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Sort by</h5>
//                   <button 
//                     className="btn-close position-absolute end-0 me-3" 
//                     style={{ top: "50%", transform: "translateY(-50%)" }} 
//                     onClick={() => setShowSortOffcanvas(false)}
//                   ></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>

//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input 
//                         className="form-check-input me-3" 
//                         type="radio" 
//                         name="sort" 
//                         checked={!filters.discountSort}
//                         onChange={() => { 
//                           setFilters(prev => ({ ...prev, discountSort: "" })); 
//                           setShowSortOffcanvas(false); 
//                         }} 
//                       />
//                       <span>Relevance</span>
//                     </label>

//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input 
//                         className="form-check-input me-3" 
//                         type="radio" 
//                         name="sort" 
//                         checked={filters.discountSort === "high"}
//                         onChange={() => { 
//                           setFilters(prev => ({ ...prev, discountSort: "high" })); 
//                           setShowSortOffcanvas(false); 
//                         }} 
//                       />
//                       <span>Highest Discount First</span>
//                     </label>

//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input 
//                         className="form-check-input me-3" 
//                         type="radio" 
//                         name="sort" 
//                         checked={filters.discountSort === "low"}
//                         onChange={() => { 
//                           setFilters(prev => ({ ...prev, discountSort: "low" })); 
//                           setShowSortOffcanvas(false); 
//                         }} 
//                       />
//                       <span>Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Product Grid */}
//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 Showing {displayedProducts.length} products
//                 {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
//               </span>

//               {Object.values(filters).some(v => v !== "" && v !== null) && (
//                 <button 
//                   className="btn btn-sm btn-outline-danger" 
//                   onClick={handleClearFilters}
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {displayedProducts.length > 0 ? (
//                 displayedProducts.map((prod, index) => {
//                   const variants = Array.isArray(prod.variants) ? prod.variants : [];
//                   const selectedVariant = selectedVariants[prod._id] || variants[0];
//                   const grouped = groupVariantsByType(variants);
//                   const totalVariants = variants.length;
//                   const isWishlisted = wishlist.includes(prod._id);
//                   const productSlug = getProductSlug(prod);
//                   const imageUrl = selectedVariant?.images?.[0] || selectedVariant?.image || prod.images?.[0] || "/placeholder.png";
//                   const initialColors = grouped.color.slice(0, 4);
//                   const initialText = grouped.text.slice(0, 2);

//                   // Set ref for last product for infinite scroll
//                   const isLastProduct = index === displayedProducts.length - 1;

//                   return (
//                     <div 
//                       key={prod._id} 
//                       className="col-6 col-md-4 col-lg-4 position-relative"
//                       ref={isLastProduct ? lastProductRef : null}
//                     >
//                       {/* Wishlist Button */}
//                       <div 
//                         onClick={() => toggleWishlist(prod._id)} 
//                         style={{
//                           position: "absolute", 
//                           top: "8px", 
//                           right: "8px", 
//                           cursor: "pointer",
//                           color: isWishlisted ? "red" : "#ccc", 
//                           fontSize: "22px", 
//                           zIndex: 2
//                         }}
//                       >
//                         {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                       </div>

//                       {/* Product Image */}
//                       <img 
//                         src={imageUrl} 
//                         alt={prod.name} 
//                         className="card-img-top" 
//                         style={{
//                           height: "200px", 
//                           objectFit: "contain", 
//                           cursor: "pointer"
//                         }} 
//                         onClick={() => navigate(`/product/${productSlug}`)} 
//                       />

//                       {/* Rating */}
//                       <div className="d-flex align-items-center mt-2">
//                         {renderStars(prod.avgRating || 0)}
//                         <span className="ms-2 text-muted small page-title-main-name">({prod.totalRatings || 0})</span>
//                       </div>

//                       {/* Product Details */}
//                       <div className="card-body p-0 d-flex flex-column" style={{ height: "280px" }}>
//                         <div className="brand-name text-muted small mb-1 fw-medium page-title-main-name">
//                           {getBrandName(prod)}
//                         </div>

//                         <h5 
//                           className="card-title mt-2 d-lg-flex d-md-block flex-lg-wrap flex-md-wrap align-items-center gap-1 page-title-main-name" 
//                           style={{ cursor: "pointer" }} 
//                           onClick={() => navigate(`/product/${productSlug}`)}
//                         >
//                           {prod.name}
//                           {selectedVariant?.shadeName && (
//                             <div className="text-black fw-normal fs-6 page-title-main-name" style={{ marginTop: "-2px" , textTransform:'lowercase' }}>
//                               {getVariantDisplayText(selectedVariant)}
//                             </div>
//                           )}
//                         </h5>

//                         {/* Variants Section */}
//                         {variants.length > 0 && (
//                           <div className="variant-section mt-3">
//                             {grouped.color.length > 0 && (
//                               <div className="d-flex flex-wrap gap-2 mb-2">
//                                 {initialColors.map(v => {
//                                   const isSelected = selectedVariant?.sku === v.sku;
//                                   const isOutOfStock = v.stock <= 0;
//                                   return (
//                                     <div 
//                                       key={v.sku || v._id} 
//                                       className="color-circle page-title-main-name" 
//                                       style={{
//                                         width: "28px", 
//                                         height: "28px", 
//                                         borderRadius: "20%",
//                                         backgroundColor: v.hex || "#ccc",
//                                         border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                         cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         opacity: isOutOfStock ? 0.5 : 1,
//                                         position: "relative"
//                                       }} 
//                                       onClick={() => !isOutOfStock && handleVariantSelect(prod._id, v)}
//                                     >
//                                       {isSelected && (
//                                         <span className="page-title-main-name" style={{
//                                           position: "absolute", 
//                                           top: "50%", 
//                                           left: "50%",
//                                           transform: "translate(-50%, -50%)", 
//                                           color: "#fff", 
//                                           fontSize: "14px", 
//                                           fontWeight: "bold"
//                                         }}>
//                                           ✓
//                                         </span>
//                                       )}
//                                     </div>
//                                   );
//                                 })}

//                                 {grouped.color.length > 4 && (
//                                   <button 
//                                     className="more-btn page-title-main-name" 
//                                     onClick={() => openVariantOverlay(prod._id, "color")} 
//                                     style={{
//                                       width: "28px", 
//                                       height: "28px", 
//                                       borderRadius: "6px",
//                                       background: "#f5f5f5", 
//                                       border: "1px solid #ddd", 
//                                       fontSize: "10px", 
//                                       fontWeight: "bold"
//                                     }}
//                                   >
//                                     +{grouped.color.length - 4}
//                                   </button>
//                                 )}
//                               </div>
//                             )}

//                             {grouped.text.length > 0 && (
//                               <div className="d-flex flex-wrap gap-2 page-title-main-name">
//                                 {initialText.map(v => {
//                                   const isSelected = selectedVariant?.sku === v.sku;
//                                   const isOutOfStock = v.stock <= 0;
//                                   return (
//                                     <div className="page-title-main-name"
//                                       key={v.sku || v._id} 
//                                       style={{
//                                         padding: "6px 12px", 
//                                         borderRadius: "6px",
//                                         border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                         background: isSelected ? "#000" : "#fff",
//                                         color: isSelected ? "#fff" : "#000",
//                                         fontSize: "13px",
//                                         cursor: isOutOfStock ? "not-allowed" : "pointer",
//                                         opacity: isOutOfStock ? 0.5 : 1
//                                       }} 
//                                       onClick={() => !isOutOfStock && handleVariantSelect(prod._id, v)}
//                                     >
//                                       {getVariantDisplayText(v)}
//                                     </div>
//                                   );
//                                 })}

//                                 {grouped.text.length > 2 && (
//                                   <button 
//                                     className="more-btn page-title-main-name" 
//                                     onClick={() => openVariantOverlay(prod._id, "text")} 
//                                     style={{
//                                       padding: "6px 12px", 
//                                       borderRadius: "6px",
//                                       background: "#f5f5f5", 
//                                       border: "1px solid #ddd", 
//                                       fontSize: "12px"
//                                     }}
//                                   >
//                                     +{grouped.text.length - 2}
//                                   </button>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {/* Price */}
//                         <p className="fw-bold mb-3 mt-3 page-title-main-name" style={{ fontSize: "16px" }}>
//                           {(() => {
//                             const price = selectedVariant?.displayPrice || selectedVariant?.discountedPrice || prod.price || 0;
//                             const original = selectedVariant?.originalPrice || selectedVariant?.mrp || prod.mrp || price;
//                             const hasDiscount = original > price;
//                             const percent = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;

//                             return hasDiscount ? (
//                               <>
//                                 ₹{price}
//                                 <span className="page-title-main-name" style={{ textDecoration: "line-through", color: "#888", marginLeft: "8px" }}>
//                                   ₹{original}
//                                 </span>
//                                 <span className="page-title-main-name" style={{ color: "#e53e3e", marginLeft: "8px", fontWeight: "600" }}>
//                                   ({percent}% OFF)
//                                 </span>
//                               </>
//                             ) : <>₹{original}</>;
//                           })()}
//                         </p>

//                         {/* Add to Cart Button */}
//                         <div className="mt-auto">
//                           <button
//                             className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${addingToCart[prod._id] ? "bg-black text-white" : ""}`}
//                             onClick={() => handleAddToCart(prod)}
//                             disabled={selectedVariant?.stock <= 0 || addingToCart[prod._id]}
//                             style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
//                           >
//                             {addingToCart[prod._id] ? (
//                               <>
//                                 <span className="spinner-border spinner-border-sm me-2"></span>
//                                 Adding...
//                               </>
//                             ) : selectedVariant?.stock <= 0 && variants.length > 0 ? (
//                               "Out of Stock"
//                             ) : (
//                               <>
//                                 Add to Cart
//                                 <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Variant Overlay */}
//                       {showVariantOverlay === prod._id && (
//                         <div className="variant-overlay" onClick={closeVariantOverlay}>
//                           <div 
//                             className="variant-overlay-content" 
//                             onClick={e => e.stopPropagation()} 
//                             style={{
//                               width: "90%", 
//                               maxWidth: "500px", 
//                               maxHeight: "80vh",
//                               background: "#fff", 
//                               borderRadius: "12px", 
//                               overflowY: "scroll",
//                               display: "flex", 
//                               flexDirection: "column"
//                             }}
//                           >
//                             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                               <h5 className="m-0">Select Variant ({totalVariants})</h5>
//                               <button 
//                                 onClick={closeVariantOverlay} 
//                                 style={{ background: "none", border: "none", fontSize: "24px" }}
//                               >
//                                 ×
//                               </button>
//                             </div>

//                             <div className="variant-tabs d-flex">
//                               <button 
//                                 className={`variant-tab flex-fill py-3 ${selectedVariantType === "all" ? "active" : ""}`} 
//                                 onClick={() => setSelectedVariantType("all")}
//                               >
//                                 All ({totalVariants})
//                               </button>

//                               {grouped.color.length > 0 && (
//                                 <button 
//                                   className={`variant-tab flex-fill py-3 ${selectedVariantType === "color" ? "active" : ""}`} 
//                                   onClick={() => setSelectedVariantType("color")}
//                                 >
//                                   Colors ({grouped.color.length})
//                                 </button>
//                               )}

//                               {grouped.text.length > 0 && (
//                                 <button 
//                                   className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} 
//                                   onClick={() => setSelectedVariantType("text")}
//                                 >
//                                   Sizes ({grouped.text.length})
//                                 </button>
//                               )}
//                             </div>

//                             <div className="row p-3 flex-grow-1" style={{ overflow: 'auto' }}>
//                               {(selectedVariantType === "all" || selectedVariantType === "color") && 
//                                 grouped.color.map(v => {
//                                   const isSelected = selectedVariant?.sku === v.sku;
//                                   const isOutOfStock = v.stock <= 0;
//                                   return (
//                                     <div className="col-lg-4 col-6 mt-4 mt-lg-2" key={v.sku || v._id}>
//                                       <div 
//                                         className="text-center" 
//                                         style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }} 
//                                         onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}
//                                       >
//                                         <div style={{
//                                           width: "28px", 
//                                           height: "28px", 
//                                           borderRadius: "20%",
//                                           backgroundColor: v.hex || "#ccc", 
//                                           margin: "0 auto 8px",
//                                           border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                           opacity: isOutOfStock ? 0.5 : 1, 
//                                           position: "relative"
//                                         }}>
//                                           {isSelected && (
//                                             <span style={{ 
//                                               position: "absolute", 
//                                               top: "50%", 
//                                               left: "50%", 
//                                               transform: "translate(-50%, -50%)", 
//                                               color: "#fff", 
//                                               fontWeight: "bold" 
//                                             }}>
//                                               ✓
//                                             </span>
//                                           )}
//                                         </div>
//                                         <div className="font-size-shopproduct">{getVariantDisplayText(v)}</div>
//                                         {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
//                                       </div>
//                                     </div>
//                                   );
//                                 })
//                               }

//                               {(selectedVariantType === "all" || selectedVariantType === "text") && 
//                                 grouped.text.map(v => {
//                                   const isSelected = selectedVariant?.sku === v.sku;
//                                   const isOutOfStock = v.stock <= 0;
//                                   return (
//                                     <div 
//                                       className="text-center col-lg-4 col-6 mt-4 mt-lg-2" 
//                                       key={v.sku || v._id} 
//                                       style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }} 
//                                       onClick={() => !isOutOfStock && (handleVariantSelect(prod._id, v), closeVariantOverlay())}
//                                     >
//                                       <div style={{
//                                         padding: "10px", 
//                                         borderRadius: "8px",
//                                         border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                         background: isSelected ? "#f8f9fa" : "#fff",
//                                         minHeight: "50px", 
//                                         display: "flex",
//                                         alignItems: "center", 
//                                         justifyContent: "center",
//                                         opacity: isOutOfStock ? 0.5 : 1
//                                       }}>
//                                         {getVariantDisplayText(v)}
//                                       </div>
//                                       {isOutOfStock && <div className="text-danger small font-size mt-1">Out of Stock</div>}
//                                     </div>
//                                   );
//                                 })
//                               }
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               ) : !initialLoading ? (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               ) : null}
//             </div>

//             {/* Loading More Indicator */}
//             {loadingMore && (
//               <div className="text-center my-5">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2 text-muted">Loading more products...</p>
//               </div>
//             )}

//             {/* Manual Load More Button (Alternative to infinite scroll) */}
//             {hasMore && !loadingMore && !initialLoading && (
//               <div className="text-center my-5">
//                 <button 
//                   className="btn btn-primary px-5" 
//                   onClick={handleLoadMore}
//                   disabled={loadingMore}
//                 >
//                   Load More Products
//                 </button>
//               </div>
//             )}

//             {/* End of Products Message */}
//             {!hasMore && displayedProducts.length > 0 && !initialLoading && (
//               <div className="text-center my-5">
//                 <p className="text-muted">You've reached the end of products</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ProductPage;





















// import React, { useState, useEffect, useContext, useMemo } from "react"; 
//   import { useParams, useNavigate, useLocation } from "react-router-dom"; 
//   import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa"; 
//   import Header from "./Header"; 
//   import Footer from "./Footer"; 
//   import { CartContext } from "../Context/CartContext"; 
//   import { UserContext } from "./UserContext.jsx"; 
//   import BrandFilter from "./BrandFilter"; 
//   import "../css/ProductPage.css"; 
//   import axios from "axios";
//   import updownarrow from "../assets/updownarrow.svg"; 
//   import filtering from "../assets/filtering.svg"; 
//   import Bag from "../assets/Bag.svg"; 

//   // Helper functions
//   const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

//   const isValidHexColor = (hex) => {
//     if (!hex || typeof hex !== "string") return false;
//     const normalized = hex.trim().toLowerCase();
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(normalized);
//   };

//   const getVariantDisplayText = (variant) => {
//     return (
//       variant.shadeName ||
//       variant.name ||
//       variant.size ||
//       variant.ml ||
//       variant.weight ||
//       "Default"
//     ).toUpperCase();
//   };

//   const groupVariantsByType = (variants) => {
//     const grouped = { color: [], text: [], default: [] };
//     variants.forEach((v) => {
//       if (!v) return;
//       if (v.hex && isValidHexColor(v.hex)) {
//         grouped.color.push(v);
//       } else {
//         grouped.text.push(v);
//       }
//     });
//     return grouped;
//   };

//   const getBrandName = (product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   };

//   const ProductPage = () => {
//     const { slug } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();

//     const [allProducts, setAllProducts] = useState([]);
//     const [displayedProducts, setDisplayedProducts] = useState([]);
//     const [pageTitle, setPageTitle] = useState("");
//     const [bannerImage, setBannerImage] = useState("");
//     const [promotionMeta, setPromotionMeta] = useState(null);
//     const [skinType, setSkinType] = useState(null);
//     const [selectedVariants, setSelectedVariants] = useState({});
//     const [addingToCart, setAddingToCart] = useState({});
//     const [loading, setLoading] = useState(true);

//     // ===================== WISHLIST STATES =====================
//     const [wishlistLoading, setWishlistLoading] = useState({});
//     const [wishlistData, setWishlistData] = useState([]);
//     // ===================== END WISHLIST STATES =====================

//     const [filters, setFilters] = useState({
//       brand: "",
//       category: "",
//       skinType: "",
//       formulation: "",
//       priceRange: null,
//       minRating: "",
//       discountSort: "",
//     });
//     const [filterData, setFilterData] = useState(null);
//     const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//     const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
//     const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//     const [selectedVariantType, setSelectedVariantType] = useState("all");

//     const { addToCart } = useContext(CartContext);
//     const { user } = useContext(UserContext);

//     // Toast Utility
//     const showToastMsg = (message, type = "error", duration = 3000) => {
//       // Create a toast element
//       const toast = document.createElement("div");
//       toast.className = `toast-notification toast-${type}`;
//       toast.style.cssText = `
//         position: fixed;
//         top: 20px;
//         right: 20px;
//         padding: 12px 20px;
//         border-radius: 8px;
//         color: #fff;
//         background-color: ${type === "error" ? "#f56565" : "#48bb78"};
//         z-index: 9999;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//       `;
//       toast.textContent = message;
//       document.body.appendChild(toast);

//       // Remove after duration
//       setTimeout(() => {
//         toast.remove();
//       }, duration);
//     };

//     // ===================== WISHLIST FUNCTIONS =====================

//     // ✅ Check if specific product variant is in wishlist
//     const isInWishlist = (productId, sku) => {
//       if (!productId || !sku) return false;

//       // Check in wishlistData
//       return wishlistData.some(item => 
//         (item.productId === productId || item._id === productId) && 
//         item.sku === sku
//       );
//     };

//     // ✅ Fetch full wishlist data
//     const fetchWishlistData = async () => {
//       try {
//         if (user && !user.guest) {
//           // For logged-in users: Fetch from API
//           const response = await axios.get(
//             "https://beauty.joyory.com/api/user/wishlist", 
//             { withCredentials: true }
//           );
//           if (response.data.success) {
//             setWishlistData(response.data.wishlist || []);
//           }
//         } else {
//           // For guests: Get from localStorage
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//           // Convert guest wishlist to match API structure
//           const formattedWishlist = localWishlist.map(item => ({
//             productId: item._id,
//             _id: item._id,
//             sku: item.sku,
//             name: item.name,
//             variant: item.variantName,
//             image: item.image,
//             displayPrice: item.displayPrice,
//             originalPrice: item.originalPrice,
//             discountPercent: item.discountPercent,
//             status: item.status,
//             avgRating: item.avgRating,
//             totalRatings: item.totalRatings
//           }));
//           setWishlistData(formattedWishlist);
//         }
//       } catch (error) {
//         console.error("Error fetching wishlist data:", error);
//         setWishlistData([]);
//       }
//     };

//     // ✅ Toggle wishlist function
//     const toggleWishlist = async (prod, variant) => {
//       if (!prod || !variant) {
//         showToastMsg("Please select a variant first", "error");
//         return;
//       }

//       const productId = prod._id;
//       const sku = getSku(variant);

//       // Set loading for this product
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//       try {
//         // Check current wishlist status
//         const currentlyInWishlist = isInWishlist(productId, sku);

//         if (user && !user.guest) {
//           // 🟢 Logged-in user - Backend API call
//           if (currentlyInWishlist) {
//             // Remove from wishlist
//             await axios.delete(
//               `https://beauty.joyory.com/api/user/wishlist/${productId}`, 
//               { 
//                 withCredentials: true,
//                 data: { sku: sku }
//               }
//             );
//             showToastMsg("Removed from wishlist!", "success");
//           } else {
//             // Add to wishlist
//             await axios.post(
//               `https://beauty.joyory.com/api/user/wishlist/${productId}`, 
//               { sku: sku },
//               { withCredentials: true }
//             );
//             showToastMsg("Added to wishlist!", "success");
//           }

//           // Refresh wishlist data
//           await fetchWishlistData();
//         } else {
//           // 🟢 Guest user - LocalStorage
//           const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

//           if (currentlyInWishlist) {
//             // Remove from wishlist
//             const updatedWishlist = guestWishlist.filter(item => 
//               !(item._id === productId && item.sku === sku)
//             );
//             localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//             showToastMsg("Removed from wishlist!", "success");
//           } else {
//             // Add to wishlist with complete product data
//             const productData = {
//               _id: productId,
//               name: prod.name,
//               brand: getBrandName(prod),
//               price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//               originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//               mrp: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//               displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//               images: variant.images || prod.images || ["/placeholder.png"],
//               image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//               slug: prod.slugs?.[0] || prod.slug || prod._id,
//               sku: sku,
//               variantSku: sku,
//               variantId: sku,
//               variantName: variant.shadeName || variant.name || "Default",
//               shadeName: variant.shadeName || variant.name || "Default",
//               variant: variant.shadeName || variant.name || "Default",
//               hex: variant.hex || "#cccccc",
//               stock: variant.stock || 0,
//               status: variant.stock > 0 ? "inStock" : "outOfStock",
//               avgRating: prod.avgRating || 0,
//               totalRatings: prod.totalRatings || 0,
//               commentsCount: prod.totalRatings || 0,
//               discountPercent: (variant.originalPrice && variant.discountedPrice && variant.originalPrice > variant.discountedPrice) 
//                 ? Math.round(((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) * 100)
//                 : 0
//             };

//             guestWishlist.push(productData);
//             localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//             showToastMsg("Added to wishlist!", "success");
//           }

//           // Update local state
//           await fetchWishlistData();
//         }
//       } catch (error) {
//         console.error("Wishlist toggle error:", error);
//         if (error.response?.status === 401) {
//           showToastMsg("Please login to use wishlist", "error");
//           navigate("/login");
//         } else {
//           showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
//         }
//       } finally {
//         setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//       }
//     };

//     // ✅ Initial fetch of wishlist data
//     useEffect(() => {
//       fetchWishlistData();
//     }, [user]);

//     // ===================== END WISHLIST FUNCTIONS =====================

//     // Build query parameters for API call - NO PAGINATION
//     const buildQueryParams = () => {
//       const params = new URLSearchParams();

//       // Add filters to query params - matching backend parameter names
//       if (filters.brand) params.append('brandIds', filters.brand);
//       if (filters.skinType) params.append('skinTypes', filters.skinType);
//       if (filters.formulation) params.append('formulations', filters.formulation);
//       if (filters.minRating) params.append('minRating', filters.minRating);

//       // Add price range if exists
//       if (filters.priceRange) {
//         params.append('minPrice', filters.priceRange.min);
//         if (filters.priceRange.max !== null) {
//           params.append('maxPrice', filters.priceRange.max);
//         }
//       }

//       // Add sorting - mapping frontend sort to backend sort values
//       if (filters.discountSort === 'high') {
//         params.append('sort', 'priceHighToLow');
//       } else if (filters.discountSort === 'low') {
//         params.append('sort', 'priceLowToHigh');
//       } else {
//         params.append('sort', 'recent'); // Default sort
//       }

//       // Set a very high limit to get all products at once
//       params.append('limit', 1000);

//       return params.toString();
//     };

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       // ✅ SINGLE API (as requested)
//       const url =
//         "https://beauty.joyory.com/api/user/products/all";

//       const res = await axios.get(url);

//       // ✅ Normalize response safely
//       const products =
//         res.data?.products ||
//         res.data?.data ||
//         res.data ||
//         [];

//       setAllProducts(products);
//       setDisplayedProducts(products);

//       // ✅ Static page title since this is "All Products"
//       setPageTitle("Shop Products");

//     } catch (err) {
//       console.error("API FAILED:", err.response || err);
//       showToastMsg("Failed to fetch products", "error");
//       setAllProducts([]);
//       setDisplayedProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProducts();
// }, []);



//     // Apply filters to displayed products
//     useEffect(() => {
//       if (allProducts.length === 0) {
//         setDisplayedProducts([]);
//         return;
//       }

//       let filtered = [...allProducts];

//       // Brand Filter
//       if (filters.brand) {
//         filtered = filtered.filter(product => {
//           let productBrandId = null;
//           if (product.brand?._id) productBrandId = String(product.brand._id);
//           else if (typeof product.brand === "string") productBrandId = product.brand;
//           return productBrandId === String(filters.brand);
//         });
//       }

//       // Skin Type Filter
//       if (filters.skinType) {
//         filtered = filtered.filter(product => {
//           const skinTypeIds = [];
//           if (product.skinType) {
//             if (Array.isArray(product.skinType)) {
//               product.skinType.forEach((st) =>
//                 skinTypeIds.push(st._id || st.slug || st.name || st)
//               );
//             } else {
//               skinTypeIds.push(
//                 product.skinType._id ||
//                   product.skinType.slug ||
//                   product.skinType.name ||
//                   product.skinType
//               );
//             }
//           }
//           if (Array.isArray(product.skinTypes)) {
//             product.skinTypes.forEach((s) =>
//               skinTypeIds.push(s._id || s.slug || s.name || s)
//             );
//           }
//           return skinTypeIds.some(
//             (id) => String(id) === String(filters.skinType)
//           );
//         });
//       }

//       // Formulation Filter
//       if (filters.formulation) {
//         filtered = filtered.filter(product => {
//           let formulationId = product.formulation?._id || null;
//           return formulationId && String(formulationId) === String(filters.formulation);
//         });
//       }

//       // Price Range Filter
//       if (filters.priceRange) {
//         filtered = filtered.filter(product => {
//           const variant = product.variants?.[0] || {};
//           const price = variant.discountedPrice || variant.displayPrice || product.price || 0;
//           if (filters.priceRange.max === null) {
//             return price >= filters.priceRange.min;
//           } else {
//             return price >= filters.priceRange.min && price <= filters.priceRange.max;
//           }
//         });
//       }

//       // Min Rating Filter
//       if (filters.minRating) {
//         filtered = filtered.filter(product => {
//           return (product.avgRating || 0) >= parseFloat(filters.minRating);
//         });
//       }

//       // Discount Sorting
//       if (filters.discountSort) {
//         filtered = [...filtered].sort((a, b) => {
//           const getDiscount = (prod) => {
//             const variant = prod.variants?.[0] || {};
//             const original = variant.originalPrice || prod.mrp || prod.price || 0;
//             const discounted = variant.discountedPrice || variant.displayPrice || prod.price || 0;
//             return original - discounted; // Discount amount
//           };

//           const discountA = getDiscount(a);
//           const discountB = getDiscount(b);

//           if (filters.discountSort === "high") {
//             return discountB - discountA; // Highest discount first
//           } else {
//             return discountA - discountB; // Lowest discount first
//           }
//         });
//       }

//       setDisplayedProducts(filtered);
//     }, [allProducts, filters]);

//     // Fetch filter data
//     useEffect(() => {
//       const fetchFilterData = async () => {
//         try {
//           const res = await axios.get(
//             "https://beauty.joyory.com/api/user/products/filters",
//             { withCredentials: true }
//           );
//           setFilterData(res.data);
//         } catch (err) {
//           console.error("Filter data fetch error:", err);
//         }
//       };
//       fetchFilterData();
//     }, []);

//     // Variant Selection
//     const handleVariantSelect = (productId, variant) => {
//       setSelectedVariants((prev) => ({
//         ...prev,
//         [productId]: variant,
//       }));
//     };

//     // Open/Close Variant Overlay
//     const openVariantOverlay = (productId, type = "all") => {
//       setSelectedVariantType(type);
//       setShowVariantOverlay(productId);
//     };

//     const closeVariantOverlay = () => {
//       setShowVariantOverlay(null);
//       setSelectedVariantType("all");
//     };

//     // Get Product Slug
//     const getProductSlug = (product) => {
//       if (product.slugs && product.slugs.length > 0) return product.slugs[0];
//       return product._id;
//     };

//     // Add to Cart
//     const handleAddToCart = async (prod) => {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//       try {
//         const variants = prod.variants || [];
//         let variantToAdd = selectedVariants[prod._id];

//         if (variants.length > 0) {
//           if (!variantToAdd || variantToAdd.stock <= 0) {
//             showToastMsg("Please select an in-stock variant.", "error");
//             return;
//           }
//         } else {
//           if (prod.stock <= 0) {
//             showToastMsg("Product is out of stock.", "error");
//             return;
//           }
//           variantToAdd = {
//             sku: `sku-${prod._id}-default`,
//             shadeName: "Default",
//             hex: "#ccc",
//             image: prod.images?.[0] || "/placeholder.png",
//             displayPrice: prod.price,
//             originalPrice: prod.mrp || prod.price,
//             stock: prod.stock ?? 1,
//           };
//         }

//         // Cache the variant selection for future reference
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = variantToAdd;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//         // Check if user is logged in
//         let isLoggedIn = false;
//         try {
//           await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//           isLoggedIn = true;
//         } catch {}

//         if (isLoggedIn) {
//           await addToCart(prod, variantToAdd);
//           showToastMsg("Product added to cart!", "success");
//           navigate("/cartpage", { state: { refresh: true } });
//         } else {
//           const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//           const existingIndex = guestCart.findIndex(
//             (item) => item.productId === prod._id && item.variantSku === getSku(variantToAdd)
//           );
//           if (existingIndex !== -1) {
//             guestCart[existingIndex].quantity += 1;
//           } else {
//             guestCart.push({
//               productId: prod._id,
//               variantSku: getSku(variantToAdd),
//               product: prod,
//               variant: variantToAdd,
//               quantity: 1,
//             });
//           }
//           localStorage.setItem("guestCart", JSON.stringify(guestCart));
//           showToastMsg("Added to cart as guest!", "success");
//           navigate("/cartpage");
//         }
//       } catch (err) {
//         console.error("Add to Cart error:", err);
//         if (err.message === "Authentication required") {
//           showToastMsg("Please log in first", "error");
//           navigate("/login");
//         } else {
//           showToastMsg("Failed to add product to cart", "error");
//         }
//       } finally {
//         setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//       }
//     };

//     const renderStars = (rating) =>
//       Array.from({ length: 5 }, (_, i) => (
//         <FaStar
//           key={i}
//           size={16}
//           color={i < Math.round(rating) ? "#2b6cb0" : "#ccc"}
//           style={{ marginRight: "2px" }}
//         />
//       ));

//     const getCurrentSortText = () => {
//       if (filters.discountSort === "high") return "Highest Discount";
//       if (filters.discountSort === "low") return "Lowest Discount";
//       return "Relevance";
//     };

//     // Render product card
//     const renderProductCard = (prod) => {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const selectedVariant = selectedVariants[prod._id] || variants[0];
//       const grouped = groupVariantsByType(variants);
//       const totalVariants = variants.length;

//       // Check wishlist status for current variant
//       const selectedSku = getSku(selectedVariant);
//       const isProductInWishlist = isInWishlist(prod._id, selectedSku);

//       const productSlug = getProductSlug(prod);
//       const imageUrl =
//         selectedVariant?.images?.[0] ||
//         selectedVariant?.image ||
//         prod.images?.[0] ||
//         "/placeholder.png";

//       // Initial display variants
//       const initialColors = grouped.color.slice(0, 4);
//       const initialText = grouped.text.slice(0, 2);

//       return (
//         <div
//           key={prod._id}
//           className="col-6 col-md-4 col-lg-4 position-relative"
//         >
//           {/* Wishlist Heart - UPDATED */}
//           <button
//             onClick={() => {
//               if (selectedVariant) {
//                 toggleWishlist(prod, selectedVariant);
//               }
//             }}
//             disabled={wishlistLoading[prod._id]}
//             style={{
//               position: "absolute",
//               top: "8px",
//               right: "8px",
//               cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//               color: isProductInWishlist ? "#dc3545" : "#ccc",
//               fontSize: "22px",
//               zIndex: 2,
//               backgroundColor: "rgba(255, 255, 255, 0.9)",
//               borderRadius: "50%",
//               width: "34px",
//               height: "34px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               transition: "all 0.3s ease",
//               border: "none",
//               outline: "none"
//             }}
//             title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             {wishlistLoading[prod._id] ? (
//               <div className="spinner-border spinner-border-sm" role="status"></div>
//             ) : isProductInWishlist ? (
//               <FaHeart />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>

//           {/* Product Image */}
//           <img
//             src={imageUrl}
//             alt={prod.name}
//             className="card-img-top"
//             style={{
//               height: "200px",
//               objectFit: "contain",
//               cursor: "pointer",
//             }}
//             onClick={() => navigate(`/product/${productSlug}`)}
//           />

//           {/* Rating */}
//           <div className="d-flex align-items-center mt-2">
//             {renderStars(prod.avgRating || 0)}
//             <span className="ms-2 text-muted small">
//               ({prod.totalRatings || 0})
//             </span>
//           </div>

//           <div className="card-body p-0 d-flex flex-column" style={{ height: "285px" }}>
//             {/* Brand */}
//             <div className="brand-name text-muted small mb-1 fw-medium">
//               {getBrandName(prod)}
//             </div>

//             <h5
//               className="card-title mt-2  align-items-center gap-1 page-title-main-name"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${productSlug}`)}
//             >
//               {prod.name}
//               {selectedVariant && selectedVariant.shadeName && (
//                 <div
//                   className="text-black fw-normal fs-6"
//                   style={{ marginTop: "-2px" }}
//                 >
//                   {getVariantDisplayText(selectedVariant)}
//                 </div>
//               )}
//             </h5>

//             {/* Variant Selection */}
//             {variants.length > 0 && (
//               <div className="variant-section mt-3">
//                 {/* Color Circles */}
//                 {grouped.color.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2 mb-2">
//                     {initialColors.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku;
//                       const isOutOfStock = v.stock <= 0;
//                       return (
//                         <div
//                           key={v.sku || v._id}
//                           className="color-circle"
//                           style={{
//                             width: "28px",
//                             height: "28px",
//                             borderRadius: "20%",
//                             backgroundColor: v.hex || "#ccc",
//                             border: isSelected
//                               ? "3px solid #000"
//                               : "1px solid #ddd",
//                             cursor: isOutOfStock
//                               ? "not-allowed"
//                               : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             position: "relative",
//                           }}
//                           onClick={() =>
//                             !isOutOfStock &&
//                             handleVariantSelect(prod._id, v)
//                           }
//                         >
//                           {isSelected && (
//                             <span
//                               style={{
//                                 position: "absolute",
//                                 top: "50%",
//                                 left: "50%",
//                                 transform: "translate(-50%, -50%)",
//                                 color: "#fff",
//                                 fontSize: "14px",
//                                 fontWeight: "bold",
//                               }}
//                             >
//                               ✓
//                             </span>
//                           )}
//                         </div>
//                       );
//                     })}
//                     {grouped.color.length > 4 && (
//                       <button
//                         className="more-btn"
//                         onClick={() =>
//                           openVariantOverlay(prod._id, "color")
//                         }
//                         style={{
//                           width: "28px",
//                           height: "28px",
//                           borderRadius: "6px",
//                           background: "#f5f5f5",
//                           border: "1px solid #ddd",
//                           fontSize: "10px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         +{grouped.color.length - 4}
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {/* Text Variants */}
//                 {grouped.text.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2">
//                     {initialText.map((v) => {
//                       const isSelected = selectedVariant?.sku === v.sku;
//                       const isOutOfStock = v.stock <= 0;
//                       return (
//                         <div
//                           key={v.sku || v._id}
//                           className={`variant-text page-title-main-name ${
//                             isSelected ? "selected" : ""
//                           }`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             border: isSelected
//                               ? "2px solid #000"
//                               : "1px solid #ddd",
//                             background: isSelected
//                               ? "#000"
//                               : "#fff",
//                             color: isSelected ? "#fff" : "#000",
//                             fontSize: "13px",
//                             cursor: isOutOfStock
//                               ? "not-allowed"
//                               : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             textTransform:'lowercase'
//                           }}
//                           onClick={() =>
//                             !isOutOfStock &&
//                             handleVariantSelect(prod._id, v)
//                           }
//                         >
//                           {getVariantDisplayText(v)}
//                         </div>
//                       );
//                     })}
//                     {grouped.text.length > 2 && (
//                       <button
//                         className="more-btn page-title-main-name"
//                         onClick={() =>
//                           openVariantOverlay(prod._id, "text")
//                         }
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           background: "#f5f5f5",
//                           border: "1px solid #ddd",
//                           fontSize: "12px",
//                         }}
//                       >
//                         +{grouped.text.length - 2}
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Price */}
//             <p
//               className="fw-bold mb-3 mt-3 page-title-main-name"
//               style={{ fontSize: "16px" }}
//             >
//               {(() => {
//                 const price =
//                   selectedVariant?.displayPrice ||
//                   selectedVariant?.discountedPrice ||
//                   prod.price ||
//                   0;
//                 const original =
//                   selectedVariant?.originalPrice ||
//                   selectedVariant?.mrp ||
//                   prod.mrp ||
//                   price;
//                 const hasDiscount = original > price;
//                 const percent = hasDiscount
//                   ? Math.round(
//                       ((original - price) / original) * 100
//                     )
//                   : 0;
//                 return hasDiscount ? (
//                   <>
//                     ₹{price}
//                     <span
//                       style={{
//                         textDecoration: "line-through",
//                         color: "#888",
//                         marginLeft: "8px",
//                       }}
//                     >
//                       ₹{original}
//                     </span>
//                     <span
//                       style={{
//                         color: "#e53e3e",
//                         marginLeft: "8px",
//                         fontWeight: "600",
//                       }}
//                     >
//                       ({percent}% OFF)
//                     </span>
//                   </>
//                 ) : (
//                   <>₹{original}</>
//                 );
//               })()}
//             </p>

//             {/* Add to Cart Button */}
//             <div className="mt-auto">
//               <button
//                 className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${
//                   addingToCart[prod._id]
//                     ? "bg-black text-white"
//                     : ""
//                 }`}
//                 onClick={() => handleAddToCart(prod)}
//                 disabled={
//                   selectedVariant?.stock <= 0 ||
//                   addingToCart[prod._id]
//                 }
//                 style={{
//                   transition:
//                     "background-color 0.3s ease, color 0.3s ease",
//                 }}
//               >
//                 {addingToCart[prod._id] ? (
//                   <>
//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                       aria-hidden="true"
//                     ></span>
//                     Adding...
//                   </>
//                 ) : selectedVariant?.stock <= 0 &&
//                   variants.length > 0 ? (
//                   "Out of Stock"
//                 ) : (
//                   <>
//                     Add to Cart
//                     <img
//                       src={Bag}
//                       alt="Bag"
//                       style={{ height: "20px" }}
//                     />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Variant Overlay */}
//           {showVariantOverlay === prod._id && (
//             <div
//               className="variant-overlay"
//               onClick={closeVariantOverlay}
//             >
//               <div
//                 className="variant-overlay-content"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: "100%",
//                   maxWidth: "500px",
//                   maxHeight: "80vh",
//                   background: "#fff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                   <h5 className="m-0">
//                     Select Variant ({totalVariants})
//                   </h5>
//                   <button
//                     onClick={closeVariantOverlay}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       fontSize: "24px",
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>

//                 {/* Tabs */}
//                 <div className="variant-tabs d-flex">
//                   <button
//                     className={`variant-tab flex-fill py-3 ${
//                       selectedVariantType === "all" ? "active" : ""
//                     }`}
//                     onClick={() => setSelectedVariantType("all")}
//                   >
//                     All ({totalVariants})
//                   </button>
//                   {grouped.color.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 ${
//                         selectedVariantType === "color"
//                           ? "active"
//                           : ""
//                       }`}
//                       onClick={() =>
//                         setSelectedVariantType("color")
//                       }
//                     >
//                       Colors ({grouped.color.length})
//                     </button>
//                   )}
//                   {grouped.text.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 ${
//                         selectedVariantType === "text"
//                           ? "active"
//                           : ""
//                       }`}
//                       onClick={() => setSelectedVariantType("text")}
//                     >
//                       Sizes ({grouped.text.length})
//                     </button>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-3 overflow-auto flex-grow-1">
//                   {(selectedVariantType === "all" ||
//                     selectedVariantType === "color") &&
//                     grouped.color.length > 0 && (
//                       <div className="row row-cols-4 g-3 mb-4">
//                         {grouped.color.map((v) => {
//                           const isSelected =
//                             selectedVariant?.sku === v.sku;
//                           const isOutOfStock = v.stock <= 0;
//                           return (
//                             <div
//                               className="col"
//                               key={v.sku || v._id}
//                             >
//                               <div
//                                 className="text-center"
//                                 style={{
//                                   cursor: isOutOfStock
//                                     ? "not-allowed"
//                                     : "pointer",
//                                 }}
//                                 onClick={() =>
//                                   !isOutOfStock &&
//                                   (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                                 }
//                               >
//                                 <div
//                                   style={{
//                                     width: "28px",
//                                     height: "28px",
//                                     borderRadius: "20%",
//                                     backgroundColor:
//                                       v.hex || "#ccc",
//                                     margin: "0 auto 8px",
//                                     border: isSelected
//                                       ? "3px solid #000"
//                                       : "1px solid #ddd",
//                                     opacity: isOutOfStock ? 0.5 : 1,
//                                     position: "relative",
//                                   }}
//                                 >
//                                   {isSelected && (
//                                     <span
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         transform:
//                                           "translate(-50%, -50%)",
//                                         color: "#fff",
//                                         fontWeight: "bold",
//                                       }}
//                                     >
//                                       ✓
//                                     </span>
//                                   )}
//                                 </div>
//                                 <div className="small">
//                                   {getVariantDisplayText(v)}
//                                 </div>
//                                 {isOutOfStock && (
//                                   <div className="text-danger small">
//                                     Out of Stock
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}

//                   {(selectedVariantType === "all" ||
//                     selectedVariantType === "text") &&
//                     grouped.text.length > 0 && (
//                       <div className="row row-cols-3 g-3">
//                         {grouped.text.map((v) => {
//                           const isSelected =
//                             selectedVariant?.sku === v.sku;
//                           const isOutOfStock = v.stock <= 0;
//                           return (
//                             <div
//                               className="col"
//                               key={v.sku || v._id}
//                             >
//                               <div
//                                 className="text-center"
//                                 style={{
//                                   cursor: isOutOfStock
//                                     ? "not-allowed"
//                                     : "pointer",
//                                 }}
//                                 onClick={() =>
//                                   !isOutOfStock &&
//                                   (handleVariantSelect(prod._id, v),
//                                   closeVariantOverlay())
//                                 }
//                               >
//                                 <div
//                                   style={{
//                                     padding: "10px",
//                                     borderRadius: "8px",
//                                     border: isSelected
//                                       ? "3px solid #000"
//                                       : "1px solid #ddd",
//                                     background: isSelected
//                                       ? "#f8f9fa"
//                                       : "#fff",
//                                     minHeight: "50px",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     opacity: isOutOfStock ? 0.5 : 1,
//                                   }}
//                                 >
//                                   {getVariantDisplayText(v)}
//                                 </div>
//                                 {isOutOfStock && (
//                                   <div className="text-danger small mt-1">
//                                     Out of Stock
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     };

//     return (
//       <>
//         {loading && (
//           <div className="fullscreen-loader">
//             <div className="spinner"></div>
//             <p>Loading products...</p>
//           </div>
//         )}
//         <Header />

//         <div className="banner-images text-center">
//           <img
//             src={bannerImage || "/banner-placeholder.jpg"}
//             alt="Banner"
//             className="w-100"
//             style={{ maxHeight: "400px", objectFit: "cover" }}
//           />
//         </div>

//         <div className="container-lg py-4">
//           <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2>

//           <div className="row">
//             {/* Desktop Sidebar */}
//             <div className="d-none d-lg-block col-lg-3">
//               <BrandFilter
//                 filters={filters}
//                 setFilters={setFilters}
//                 currentPage="category"
//               />
//             </div>

//             {/* Mobile Filter + Sort Buttons */}
//             <div className="d-lg-none mb-3">
//               <h2 className="mb-4 text-center">{pageTitle}</h2>

//               <div className="w-100 filter-responsive rounded shadow-sm">
//                 <div className="container-fluid p-0">
//                   <div
//                     className="row g-0"
//                     style={{ flexDirection: "row-reverse" }}
//                   >
//                     {/* Filter Button */}
//                     <div className="col-6">
//                       <button
//                         className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                         onClick={() => setShowFilterOffcanvas(true)}
//                         style={{ gap: "12px" }}
//                       >
//                         <img
//                           src={filtering}
//                           alt="Filter"
//                           style={{ width: "25px" }}
//                         />
//                         <div className="text-start">
//                           <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                           <span className="text-muted small page-title-main-name">Tap to apply</span>
//                         </div>
//                       </button>
//                     </div>

//                     {/* Sort Button */}
//                     <div className="col-6 border-end">
//                       <button
//                         className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                         onClick={() => setShowSortOffcanvas(true)}
//                         style={{ gap: "12px" }}
//                       >
//                         <img
//                           src={updownarrow}
//                           alt="Sort"
//                           style={{ width: "25px" }}
//                         />
//                         <div className="text-start">
//                           <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                           <span className="text-muted small">
//                             {getCurrentSortText()}
//                           </span>
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Filter Offcanvas */}
//             {showFilterOffcanvas && (
//               <>
//                 <div
//                   className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                   style={{ opacity: 0.5, zIndex: 1040 }}
//                   onClick={() => setShowFilterOffcanvas(false)}
//                 ></div>
//                 <div
//                   className="position-fixed start-0 bottom-0 w-100 bg-white"
//                   style={{
//                     zIndex: 1050,
//                     borderTopLeftRadius: "16px",
//                     borderTopRightRadius: "16px",
//                     maxHeight: "85vh",
//                     boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
//                   }}
//                 >
//                   <div className="text-center py-3 position-relative">
//                     <h5 className="mb-0 fw-bold">Filters</h5>
//                     <button
//                       className="btn-close position-absolute end-0 me-3"
//                       style={{ top: "50%", transform: "translateY(-50%)" }}
//                       onClick={() => setShowFilterOffcanvas(false)}
//                     ></button>
//                     <div
//                       className="mx-auto mt-2 bg-secondary"
//                       style={{
//                         height: "5px",
//                         width: "50px",
//                         borderRadius: "3px",
//                       }}
//                     ></div>
//                   </div>
//                   <div
//                     className="px-3 pb-4 overflow-auto"
//                     style={{ maxHeight: "70vh" }}
//                   >
//                     <BrandFilter
//                       filters={filters}
//                       setFilters={setFilters}
//                       filterData={filterData}
//                       products={allProducts}
//                       onClose={() => setShowFilterOffcanvas(false)}
//                       hideBrandFilter={false}
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Mobile Sort Offcanvas */}
//             {showSortOffcanvas && (
//               <>
//                 <div
//                   className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                   style={{ opacity: 0.5, zIndex: 1040 }}
//                   onClick={() => setShowSortOffcanvas(false)}
//                 ></div>
//                 <div
//                   className="position-fixed start-0 bottom-0 w-100 bg-white"
//                   style={{
//                     zIndex: 1050,
//                     borderTopLeftRadius: "16px",
//                     borderTopRightRadius: "16px",
//                     maxHeight: "60vh",
//                     boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
//                   }}
//                 >
//                   <div className="text-center py-3 position-relative">
//                     <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                     <button
//                       className="btn-close position-absolute end-0 me-3"
//                       style={{ top: "50%", transform: "translateY(-50%)" }}
//                       onClick={() => setShowSortOffcanvas(false)}
//                     ></button>
//                     <div
//                       className="mx-auto mt-2 bg-secondary"
//                       style={{
//                         height: "5px",
//                         width: "50px",
//                         borderRadius: "3px",
//                       }}
//                     ></div>
//                   </div>
//                   <div className="px-4 pb-4">
//                     <div className="list-group">
//                       <label className="list-group-item py-3 d-flex align-items-center">
//                         <input
//                           className="form-check-input me-3"
//                           type="radio"
//                           name="sort"
//                           checked={!filters.discountSort}
//                           onChange={() => {
//                             setFilters((prev) => ({ ...prev, discountSort: "" }));
//                             setShowSortOffcanvas(false);
//                           }}
//                         />
//                         <span className="page-title-main-name">Relevance</span>
//                       </label>
//                       <label className="list-group-item py-3 d-flex align-items-center">
//                         <input
//                           className="form-check-input me-3"
//                           type="radio"
//                           name="sort"
//                           checked={filters.discountSort === "high"}
//                           onChange={() => {
//                             setFilters((prev) => ({
//                               ...prev,
//                               discountSort: "high",
//                             }));
//                             setShowSortOffcanvas(false);
//                           }}
//                         />
//                         <span className="page-title-main-name">Highest Discount First</span>
//                       </label>
//                       <label className="list-group-item py-3 d-flex align-items-center">
//                         <input
//                           className="form-check-input me-3"
//                           type="radio"
//                           name="sort"
//                           checked={filters.discountSort === "low"}
//                           onChange={() => {
//                             setFilters((prev) => ({
//                               ...prev,
//                               discountSort: "low",
//                             }));
//                             setShowSortOffcanvas(false);
//                           }}
//                         />
//                         <span className="page-title-main-name">Lowest Discount First</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Product Grid */}
//             <div className="col-12 col-lg-9">
//               <div className="mb-3 d-flex justify-content-between align-items-center">
//                 <span className="text-muted page-title-main-name">
//                   Showing {displayedProducts.length} of {allProducts.length} products
//                 </span>
//                 {Object.values(filters).some(
//                   (val) => val !== "" && val !== null
//                 ) && (
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() =>
//                       setFilters({
//                         brand: "",
//                         category: "",
//                         skinType: "",
//                         formulation: "",
//                         priceRange: null,
//                         minRating: "",
//                         discountSort: "",
//                       })
//                     }
//                   >
//                     Clear Filters
//                   </button>
//                 )}
//               </div>

//               <div className="row g-4">
//                 {displayedProducts.length > 0 ? (
//                   displayedProducts.map(renderProductCard)
//                 ) : (
//                   <div className="col-12 text-center py-5">
//                     <h4>No products found</h4>
//                     <p className="text-muted">Try adjusting your filters.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <Footer />
//       </>
//     );
//   };

//   export default ProductPage;























// import React, { useState, useEffect, useContext, useMemo, useRef, useCallback } from "react"; 
// import { useParams, useNavigate, useLocation } from "react-router-dom"; 
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa"; 
// import Header from "./Header"; 
// import Footer from "./Footer"; 
// import { CartContext } from "../Context/CartContext"; 
// import { UserContext } from "./UserContext.jsx"; 
// import BrandFilter from "./BrandFilter"; 
// import "../css/ProductPage.css"; 
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg"; 
// import filtering from "../assets/filtering.svg"; 
// import Bag from "../assets/Bag.svg"; 

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

// const getBrandName = (product) => {
//   if (!product?.brand) return "Unknown Brand";
//   if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//   if (typeof product.brand === "string") return product.brand;
//   return "Unknown Brand";
// };

// const ProductPage = () => {
//   const { slug } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [allProducts, setAllProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("");
//   const [bannerImage, setBannerImage] = useState("");
//   const [promotionMeta, setPromotionMeta] = useState(null);
//   const [skinType, setSkinType] = useState(null);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     skinType: "",
//     formulation: "",
//     priceRange: null,
//     minRating: "",
//     discountSort: "",
//   });
//   const [filterData, setFilterData] = useState(null);
//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // Create a ref for the container and observer
//   const loaderRef = useRef(null);
//   const containerRef = useRef(null);

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     const toast = document.createElement("div");
//     toast.className = `toast-notification toast-${type}`;
//     toast.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       padding: 12px 20px;
//       border-radius: 8px;
//       color: #fff;
//       background-color: ${type === "error" ? "#f56565" : "#48bb78"};
//       z-index: 9999;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     `;
//     toast.textContent = message;
//     document.body.appendChild(toast);

//     setTimeout(() => {
//       toast.remove();
//     }, duration);
//   };

//   // ===================== WISHLIST FUNCTIONS =====================

//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;

//     return wishlistData.some(item => 
//       (item.productId === productId || item._id === productId) && 
//       item.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist", 
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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

//   // Build query parameters with cursor
//   const buildQueryParams = (cursor = null) => {
//     const params = new URLSearchParams();

//     // Add filters to query params
//     if (filters.brand) params.append('brandIds', filters.brand);
//     if (filters.skinType) params.append('skinTypes', filters.skinType);
//     if (filters.formulation) params.append('formulations', filters.formulation);
//     if (filters.minRating) params.append('minRating', filters.minRating);

//     // Add price range if exists
//     if (filters.priceRange) {
//       params.append('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max !== null) {
//         params.append('maxPrice', filters.priceRange.max);
//       }
//     }

//     // Add sorting
//     if (filters.discountSort === 'high') {
//       params.append('sort', 'priceHighToLow');
//     } else if (filters.discountSort === 'low') {
//       params.append('sort', 'priceLowToHigh');
//     } else {
//       params.append('sort', 'recent');
//     }

//     // Add cursor for pagination
//     if (cursor) {
//       params.append('cursor', cursor);
//     }

//     // Set limit (same as backend default)
//     params.append('limit', 9);

//     return params.toString();
//   };

//   // ✅ Fetch products with cursor pagination
//   const fetchProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setAllProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const params = buildQueryParams(cursor);
//       const url = `https://beauty.joyory.com/api/user/products/all?${params}`;

//       const res = await axios.get(url);

//       // Normalize response
//       const products = res.data?.products || [];
//       const pagination = res.data?.pagination || {};

//       // Update products
//       if (reset) {
//         setAllProducts(products);
//       } else {
//         setAllProducts(prev => [...prev, ...products]);
//       }

//       // Update pagination info
//       setHasMore(pagination.hasMore || false);
//       setNextCursor(pagination.nextCursor || null);

//       // Update title message
//       if (res.data.titleMessage) {
//         setPageTitle(res.data.titleMessage);
//       } else {
//         setPageTitle("Shop Products");
//       }

//     } catch (err) {
//       console.error("API FAILED:", err.response || err);
//       showToastMsg("Failed to fetch products", "error");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // ✅ Initial fetch and fetch when filters change
//   useEffect(() => {
//     fetchProducts(null, true);
//   }, [filters]);

//   // ✅ Load more products function
//   const loadMoreProducts = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) {
//       fetchProducts(nextCursor, false);
//     }
//   }, [nextCursor, hasMore, loadingMore]);

//   // ✅ Setup Intersection Observer for infinite scroll
//   useEffect(() => {
//     if (!hasMore || loadingMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const firstEntry = entries[0];
//         if (firstEntry.isIntersecting) {
//           loadMoreProducts();
//         }
//       },
//       {
//         root: null, // viewport
//         rootMargin: "100px", // load when 100px away from viewport bottom
//         threshold: 0.1, // 10% of the element is visible
//       }
//     );

//     const currentLoader = loaderRef.current;
//     if (currentLoader) {
//       observer.observe(currentLoader);
//     }

//     return () => {
//       if (currentLoader) {
//         observer.unobserve(currentLoader);
//       }
//     };
//   }, [loadMoreProducts, hasMore, loadingMore]);

//   // ✅ Handle scroll event for older browsers
//   useEffect(() => {
//     const handleScroll = () => {
//       if (loadingMore || !hasMore) return;

//       const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//       const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
//       const clientHeight = document.documentElement.clientHeight || window.innerHeight;

//       // Load more when 200px from bottom
//       if (scrollTop + clientHeight >= scrollHeight - 200) {
//         loadMoreProducts();
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [loadMoreProducts, loadingMore, hasMore]);

//   // Variant Selection
//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   // Open/Close Variant Overlay
//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Get Product Slug
//   const getProductSlug = (product) => {
//     if (product.slugs && product.slugs.length > 0) return product.slugs[0];
//     return product._id;
//   };

//   // Add to Cart
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = prod.variants || [];
//       let variantToAdd = selectedVariants[prod._id];

//       if (variants.length > 0) {
//         if (!variantToAdd || variantToAdd.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//         variantToAdd = {
//           sku: `sku-${prod._id}-default`,
//           shadeName: "Default",
//           hex: "#ccc",
//           image: prod.images?.[0] || "/placeholder.png",
//           displayPrice: prod.price,
//           originalPrice: prod.mrp || prod.price,
//           stock: prod.stock ?? 1,
//         };
//       }

//       // Cache the variant selection for future reference
//       const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//       cache[prod._id] = variantToAdd;
//       localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//       // Check if user is logged in
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch {}

//       if (isLoggedIn) {
//         await addToCart(prod, variantToAdd);
//         showToastMsg("Product added to cart!", "success");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           (item) => item.productId === prod._id && item.variantSku === getSku(variantToAdd)
//         );
//         if (existingIndex !== -1) {
//           guestCart[existingIndex].quantity += 1;
//         } else {
//           guestCart.push({
//             productId: prod._id,
//             variantSku: getSku(variantToAdd),
//             product: prod,
//             variant: variantToAdd,
//             quantity: 1,
//           });
//         }
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//         showToastMsg("Added to cart as guest!", "success");
//         navigate("/cartpage");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       if (err.message === "Authentication required") {
//         showToastMsg("Please log in first", "error");
//         navigate("/login");
//       } else {
//         showToastMsg("Failed to add product to cart", "error");
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
//     }
//   };

//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar
//         key={i}
//         size={16}
//         color={i < Math.round(rating) ? "#2b6cb0" : "#ccc"}
//         style={{ marginRight: "2px" }}
//       />
//     ));

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   // Render product card
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const selectedVariant = selectedVariants[prod._id] || variants[0];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     // Check wishlist status for current variant
//     const selectedSku = getSku(selectedVariant);
//     const isProductInWishlist = isInWishlist(prod._id, selectedSku);

//     const productSlug = getProductSlug(prod);
//     const imageUrl =
//       selectedVariant?.images?.[0] ||
//       selectedVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     // Initial display variants
//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     return (
//       <div
//         key={prod._id}
//         className="col-6 col-md-4 col-lg-4 position-relative"
//       >
//         {/* Wishlist Heart */}
//         <button
//           onClick={() => {
//             if (selectedVariant) {
//               toggleWishlist(prod, selectedVariant);
//             }
//           }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute",
//             top: "8px",
//             right: "8px",
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: isProductInWishlist ? "#dc3545" : "#ccc",
//             fontSize: "22px",
//             zIndex: 2,
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             borderRadius: "50%",
//             width: "34px",
//             height: "34px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             transition: "all 0.3s ease",
//             border: "none",
//             outline: "none"
//           }}
//           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status"></div>
//           ) : isProductInWishlist ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         {/* Product Image */}
//         <img
//           src={imageUrl}
//           alt={prod.name}
//           className="card-img-top"
//           style={{
//             height: "200px",
//             objectFit: "contain",
//             cursor: "pointer",
//           }}
//           onClick={() => navigate(`/product/${productSlug}`)}
//         />

//         {/* Rating */}
//         <div className="d-flex align-items-center mt-2">
//           {renderStars(prod.avgRating || 0)}
//           <span className="ms-2 text-muted small">
//             ({prod.totalRatings || 0})
//           </span>
//         </div>

//         <div className="card-body p-0 d-flex flex-column" style={{ height: "285px" }}>
//           {/* Brand */}
//           <div className="brand-name text-muted small mb-1 fw-medium">
//             {getBrandName(prod)}
//           </div>

//           <h5
//             className="card-title mt-2  align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate(`/product/${productSlug}`)}
//           >
//             {prod.name}
//             {selectedVariant && selectedVariant.shadeName && (
//               <div
//                 className="text-black fw-normal fs-6"
//                 style={{ marginTop: "-2px" }}
//               >
//                 {getVariantDisplayText(selectedVariant)}
//               </div>
//             )}
//           </h5>

//           {/* Variant Selection */}
//           {variants.length > 0 && (
//             <div className="variant-section mt-3">
//               {/* Color Circles */}
//               {grouped.color.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2 mb-2">
//                   {initialColors.map((v) => {
//                     const isSelected = selectedVariant?.sku === v.sku;
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={v.sku || v._id}
//                         className="color-circle"
//                         style={{
//                           width: "28px",
//                           height: "28px",
//                           borderRadius: "20%",
//                           backgroundColor: v.hex || "#ccc",
//                           border: isSelected
//                             ? "3px solid #000"
//                             : "1px solid #ddd",
//                           cursor: isOutOfStock
//                             ? "not-allowed"
//                             : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           position: "relative",
//                         }}
//                         onClick={() =>
//                           !isOutOfStock &&
//                           handleVariantSelect(prod._id, v)
//                         }
//                       >
//                         {isSelected && (
//                           <span
//                             style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             ✓
//                           </span>
//                         )}
//                       </div>
//                     );
//                   })}
//                   {grouped.color.length > 4 && (
//                     <button
//                       className="more-btn"
//                       onClick={() =>
//                         openVariantOverlay(prod._id, "color")
//                       }
//                       style={{
//                         width: "28px",
//                         height: "28px",
//                         borderRadius: "6px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "10px",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       +{grouped.color.length - 4}
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* Text Variants */}
//               {grouped.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {initialText.map((v) => {
//                     const isSelected = selectedVariant?.sku === v.sku;
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={v.sku || v._id}
//                         className={`variant-text page-title-main-name ${
//                           isSelected ? "selected" : ""
//                         }`}
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           border: isSelected
//                             ? "2px solid #000"
//                             : "1px solid #ddd",
//                           background: isSelected
//                             ? "#000"
//                             : "#fff",
//                           color: isSelected ? "#fff" : "#000",
//                           fontSize: "13px",
//                           cursor: isOutOfStock
//                             ? "not-allowed"
//                             : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           textTransform:'lowercase'
//                         }}
//                         onClick={() =>
//                           !isOutOfStock &&
//                           handleVariantSelect(prod._id, v)
//                         }
//                       >
//                         {getVariantDisplayText(v)}
//                       </div>
//                     );
//                   })}
//                   {grouped.text.length > 2 && (
//                     <button
//                       className="more-btn page-title-main-name"
//                       onClick={() =>
//                         openVariantOverlay(prod._id, "text")
//                       }
//                       style={{
//                         padding: "6px 12px",
//                         borderRadius: "6px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "12px",
//                       }}
//                     >
//                       +{grouped.text.length - 2}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Price */}
//           <p
//             className="fw-bold mb-3 mt-3 page-title-main-name"
//             style={{ fontSize: "16px" }}
//           >
//             {(() => {
//               const price =
//                 selectedVariant?.displayPrice ||
//                 selectedVariant?.discountedPrice ||
//                 prod.price ||
//                 0;
//               const original =
//                 selectedVariant?.originalPrice ||
//                 selectedVariant?.mrp ||
//                 prod.mrp ||
//                 price;
//               const hasDiscount = original > price;
//               const percent = hasDiscount
//                 ? Math.round(
//                     ((original - price) / original) * 100
//                   )
//                 : 0;
//               return hasDiscount ? (
//                 <>
//                   ₹{price}
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#888",
//                       marginLeft: "8px",
//                     }}
//                   >
//                     ₹{original}
//                   </span>
//                   <span
//                     style={{
//                       color: "#e53e3e",
//                       marginLeft: "8px",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ({percent}% OFF)
//                   </span>
//                 </>
//               ) : (
//                 <>₹{original}</>
//               );
//             })()}
//           </p>

//           {/* Add to Cart Button */}
//           <div className="mt-auto">
//             <button
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${
//                 addingToCart[prod._id]
//                   ? "bg-black text-white"
//                   : ""
//               }`}
//               onClick={() => handleAddToCart(prod)}
//               disabled={
//                 selectedVariant?.stock <= 0 ||
//                 addingToCart[prod._id]
//               }
//               style={{
//                 transition:
//                   "background-color 0.3s ease, color 0.3s ease",
//               }}
//             >
//               {addingToCart[prod._id] ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                     aria-hidden="true"
//                   ></span>
//                   Adding...
//                 </>
//               ) : selectedVariant?.stock <= 0 &&
//                 variants.length > 0 ? (
//                 "Out of Stock"
//               ) : (
//                 <>
//                   Add to Cart
//                   <img
//                     src={Bag}
//                     alt="Bag"
//                     style={{ height: "20px" }}
//                   />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div
//             className="variant-overlay"
//             onClick={closeVariantOverlay}
//           >
//             <div
//               className="variant-overlay-content"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//                 maxHeight: "80vh",
//                 background: "#fff",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0">
//                   Select Variant ({totalVariants})
//                 </h5>
//                 <button
//                   onClick={closeVariantOverlay}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     fontSize: "24px",
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 ${
//                     selectedVariantType === "all" ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVariants})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${
//                       selectedVariantType === "color"
//                         ? "active"
//                         : ""
//                     }`}
//                     onClick={() =>
//                       setSelectedVariantType("color")
//                     }
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${
//                       selectedVariantType === "text"
//                         ? "active"
//                         : ""
//                     }`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="p-3 overflow-auto flex-grow-1">
//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const isSelected =
//                           selectedVariant?.sku === v.sku;
//                         const isOutOfStock = v.stock <= 0;
//                         return (
//                           <div
//                             className="col"
//                             key={v.sku || v._id}
//                           >
//                             <div
//                               className="text-center"
//                               style={{
//                                 cursor: isOutOfStock
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor:
//                                     v.hex || "#ccc",
//                                   margin: "0 auto 8px",
//                                   border: isSelected
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   opacity: isOutOfStock ? 0.5 : 1,
//                                   position: "relative",
//                                 }}
//                               >
//                                 {isSelected && (
//                                   <span
//                                     style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform:
//                                         "translate(-50%, -50%)",
//                                       color: "#fff",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small">
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {isOutOfStock && (
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

//                 {(selectedVariantType === "all" ||
//                   selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const isSelected =
//                           selectedVariant?.sku === v.sku;
//                         const isOutOfStock = v.stock <= 0;
//                         return (
//                           <div
//                             className="col"
//                             key={v.sku || v._id}
//                           >
//                             <div
//                               className="text-center"
//                               style={{
//                                 cursor: isOutOfStock
//                                   ? "not-allowed"
//                                   : "pointer",
//                               }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(prod._id, v),
//                                 closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: isSelected
//                                     ? "3px solid #000"
//                                     : "1px solid #ddd",
//                                   background: isSelected
//                                     ? "#f8f9fa"
//                                     : "#fff",
//                                   minHeight: "50px",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   opacity: isOutOfStock ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {isOutOfStock && (
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

//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader">
//           <div className="spinner"></div>
//           <p>Loading products...</p>
//         </div>
//       )}
//       <Header />

//       <div className="banner-images text-center">
//         <img
//           src={bannerImage || "/banner-placeholder.jpg"}
//           alt="Banner"
//           className="w-100"
//           style={{ maxHeight: "400px", objectFit: "cover" }}
//         />
//       </div>

//       <div className="container-lg py-4" ref={containerRef}>
//         <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2>

//         <div className="row">
//           {/* Desktop Sidebar */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter
//               filters={filters}
//               setFilters={setFilters}
//               currentPage="category"
//             />
//           </div>

//           {/* Mobile Filter + Sort Buttons */}
//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>

//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div
//                   className="row g-0"
//                   style={{ flexDirection: "row-reverse" }}
//                 >
//                   {/* Filter Button */}
//                   <div className="col-6">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img
//                         src={filtering}
//                         alt="Filter"
//                         style={{ width: "25px" }}
//                       />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>

//                   {/* Sort Button */}
//                   <div className="col-6 border-end">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img
//                         src={updownarrow}
//                         alt="Sort"
//                         style={{ width: "25px" }}
//                       />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                         <span className="text-muted small">
//                           {getCurrentSortText()}
//                         </span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Filter Offcanvas */}
//           {showFilterOffcanvas && (
//             <>
//               <div
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }}
//                 onClick={() => setShowFilterOffcanvas(false)}
//               ></div>
//               <div
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: "16px",
//                   borderTopRightRadius: "16px",
//                   maxHeight: "85vh",
//                   boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button
//                     className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowFilterOffcanvas(false)}
//                   ></button>
//                   <div
//                     className="mx-auto mt-2 bg-secondary"
//                     style={{
//                       height: "5px",
//                       width: "50px",
//                       borderRadius: "3px",
//                     }}
//                   ></div>
//                 </div>
//                 <div
//                   className="px-3 pb-4 overflow-auto"
//                   style={{ maxHeight: "70vh" }}
//                 >
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={allProducts}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Mobile Sort Offcanvas */}
//           {showSortOffcanvas && (
//             <>
//               <div
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }}
//                 onClick={() => setShowSortOffcanvas(false)}
//               ></div>
//               <div
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: "16px",
//                   borderTopRightRadius: "16px",
//                   maxHeight: "60vh",
//                   boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button
//                     className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowSortOffcanvas(false)}
//                   ></button>
//                   <div
//                     className="mx-auto mt-2 bg-secondary"
//                     style={{
//                       height: "5px",
//                       width: "50px",
//                       borderRadius: "3px",
//                     }}
//                   ></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input
//                         className="form-check-input me-3"
//                         type="radio"
//                         name="sort"
//                         checked={!filters.discountSort}
//                         onChange={() => {
//                           setFilters((prev) => ({ ...prev, discountSort: "" }));
//                           setShowSortOffcanvas(false);
//                         }}
//                       />
//                       <span className="page-title-main-name">Relevance</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input
//                         className="form-check-input me-3"
//                         type="radio"
//                         name="sort"
//                         checked={filters.discountSort === "high"}
//                         onChange={() => {
//                           setFilters((prev) => ({
//                             ...prev,
//                             discountSort: "high",
//                           }));
//                           setShowSortOffcanvas(false);
//                         }}
//                       />
//                       <span className="page-title-main-name">Highest Discount First</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input
//                         className="form-check-input me-3"
//                         type="radio"
//                         name="sort"
//                         checked={filters.discountSort === "low"}
//                         onChange={() => {
//                           setFilters((prev) => ({
//                             ...prev,
//                             discountSort: "low",
//                           }));
//                           setShowSortOffcanvas(false);
//                         }}
//                       />
//                       <span className="page-title-main-name">Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Product Grid */}
//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 Showing {allProducts.length} products
//                 {hasMore && " (Scroll for more)"}
//               </span>
//               {Object.values(filters).some(
//                 (val) => val !== "" && val !== null
//               ) && (
//                 <button
//                   className="btn btn-sm btn-outline-danger"
//                   onClick={() =>
//                     setFilters({
//                       brand: "",
//                       category: "",
//                       skinType: "",
//                       formulation: "",
//                       priceRange: null,
//                       minRating: "",
//                       discountSort: "",
//                     })
//                   }
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {allProducts.length > 0 ? (
//                 allProducts.map(renderProductCard)
//               ) : !loading ? (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               ) : null}
//             </div>

//             {/* Loading Spinner for infinite scroll */}
//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             {/* Observer element for infinite scroll */}
//             <div ref={loaderRef} style={{ height: "20px", marginTop: "20px" }}></div>

//             {/* End of Results Message */}
//             {!hasMore && allProducts.length > 0 && (
//               <div className="text-center mt-4 py-4 border-top">
//                 <p className="text-muted">
//                   🎉 You've reached the end! No more products to show.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ProductPage;





























// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import "../css/ProductPage.css";
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

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

// const getBrandName = (product) => {
//   if (!product?.brand) return "Unknown Brand";
//   if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//   if (typeof product.brand === "string") return product.brand;
//   return "Unknown Brand";
// };

// const ProductPage = () => {
//   const { slug } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [allProducts, setAllProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("");
//   const [bannerImage, setBannerImage] = useState("");
//   const [promotionMeta, setPromotionMeta] = useState(null);
//   const [skinType, setSkinType] = useState(null);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);

//   // ===================== WISHLIST STATES =====================
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   // ===================== END WISHLIST STATES =====================

//   // const [filters, setFilters] = useState({
//   //   brand: "",
//   //   category: "",
//   //   skinType: "",
//   //   formulation: "",
//   //   priceRange: null,
//   //   minRating: "",
//   //   discountSort: "",
//   // });
//   // const [filterData, setFilterData] = useState(null);

//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     skinType: "",
//     formulation: "",
//     priceRange: null,
//     minRating: "",
//     discountSort: "",
//   });
//   const [filterData, setFilterData] = useState(null);


//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // Create a ref for the container and observer
//   const loaderRef = useRef(null);
//   const containerRef = useRef(null);

//   // Toast Utility
//   const showToastMsg = (message, type = "error", duration = 3000) => {
//     const toast = document.createElement("div");
//     toast.className = `toast-notification toast-${type}`;
//     toast.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       padding: 12px 20px;
//       border-radius: 8px;
//       color: #fff;
//       background-color: ${type === "error" ? "#f56565" : "#48bb78"};
//       z-index: 9999;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     `;
//     toast.textContent = message;
//     document.body.appendChild(toast);

//     setTimeout(() => {
//       toast.remove();
//     }, duration);
//   };

//   // ===================== WISHLIST FUNCTIONS =====================

//   const isInWishlist = (productId, sku) => {
//     if (!productId || !sku) return false;

//     return wishlistData.some(item =>
//       (item.productId === productId || item._id === productId) &&
//       item.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
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

//   // Build query parameters with cursor
//   const buildQueryParams = (cursor = null) => {
//     const params = new URLSearchParams();

//     // Add filters to query params
//     if (filters.brand) params.append('brandIds', filters.brand);
//     if (filters.category) params.append('categoryIds', filters.category);
//     if (filters.skinType) params.append('skinTypes', filters.skinType);
//     if (filters.formulation) params.append('formulations', filters.formulation);
//     if (filters.minRating) params.append('minRating', filters.minRating);

//     // Add price range if exists
//     if (filters.priceRange) {
//       params.append('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max !== null) {
//         params.append('maxPrice', filters.priceRange.max);
//       }
//     }

//     // Add sorting
//     if (filters.discountSort === 'high') {
//       params.append('sort', 'priceHighToLow');
//     } else if (filters.discountSort === 'low') {
//       params.append('sort', 'priceLowToHigh');
//     } else {
//       params.append('sort', 'recent');
//     }

//     // Add cursor for pagination
//     if (cursor) {
//       params.append('cursor', cursor);
//     }

//     // Set limit (same as backend default)
//     params.append('limit', 9);

//     return params.toString();
//   };

//   // ✅ Fetch products with cursor pagination
//   const fetchProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setAllProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const params = buildQueryParams(cursor);
//       const url = `https://beauty.joyory.com/api/user/products/all?${params}`;

//       const res = await axios.get(url);

//       // Normalize response
//       const products = res.data?.products || [];
//       const pagination = res.data?.pagination || {};

//       // Update products
//       if (reset) {
//         setAllProducts(products);
//       } else {
//         setAllProducts(prev => [...prev, ...products]);
//       }

//       // Update pagination info
//       setHasMore(pagination.hasMore || false);
//       setNextCursor(pagination.nextCursor || null);

//       // Update title message
//       if (res.data.titleMessage) {
//         setPageTitle(res.data.titleMessage);
//       } else {
//         setPageTitle("Shop Products");
//       }

//     } catch (err) {
//       console.error("API FAILED:", err.response || err);
//       showToastMsg("Failed to fetch products", "error");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // ✅ Initial fetch and fetch when filters change
//   useEffect(() => {
//     fetchProducts(null, true);
//   }, [filters]);

//   // ✅ Load more products function
//   const loadMoreProducts = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) {
//       fetchProducts(nextCursor, false);
//     }
//   }, [nextCursor, hasMore, loadingMore]);

//   // ✅ Setup Intersection Observer for infinite scroll
//   useEffect(() => {
//     if (!hasMore || loadingMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const firstEntry = entries[0];
//         if (firstEntry.isIntersecting) {
//           loadMoreProducts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "100px",
//         threshold: 0.1,
//       }
//     );

//     const currentLoader = loaderRef.current;
//     if (currentLoader) {
//       observer.observe(currentLoader);
//     }

//     return () => {
//       if (currentLoader) {
//         observer.unobserve(currentLoader);
//       }
//     };
//   }, [loadMoreProducts, hasMore, loadingMore]);

//   // ✅ Handle scroll event for older browsers
//   useEffect(() => {
//     const handleScroll = () => {
//       if (loadingMore || !hasMore) return;

//       const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//       const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
//       const clientHeight = document.documentElement.clientHeight || window.innerHeight;

//       if (scrollTop + clientHeight >= scrollHeight - 200) {
//         loadMoreProducts();
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [loadMoreProducts, loadingMore, hasMore]);

//   // Variant Selection
//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   // Open/Close Variant Overlay
//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   // Get Product Slug
//   const getProductSlug = (product) => {
//     if (product.slugs && product.slugs.length > 0) return product.slugs[0];
//     return product._id;
//   };

//   // ==================== UPDATED ADD TO CART - FULLY MATCHES BACKEND LOGIC ====================
//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;

//       if (hasVariants) {
//         const selectedVariant = selectedVariants[prod._id];
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

//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <FaStar
//         key={i}
//         size={16}
//         color={i < Math.round(rating) ? "#2b6cb0" : "#ccc"}
//         style={{ marginRight: "2px" }}
//       />
//     ));

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   // Render product card
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVariants = variants.length > 0;
//     const selectedVariant = selectedVariants[prod._id] || (hasVariants ? variants[0] : null);
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     // Check wishlist status for current variant
//     const selectedSku = selectedVariant ? getSku(selectedVariant) : null;
//     const isProductInWishlist = selectedSku ? isInWishlist(prod._id, selectedSku) : false;

//     const productSlug = getProductSlug(prod);
//     const imageUrl =
//       selectedVariant?.images?.[0] ||
//       selectedVariant?.image ||
//       prod.images?.[0] ||
//       "/placeholder.png";

//     // Initial display variants
//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     // Button state logic
//     const isAdding = addingToCart[prod._id];
//     const noVariantSelected = hasVariants && !selectedVariant;
//     const outOfStock = hasVariants
//       ? (selectedVariant?.stock <= 0)
//       : (prod.stock <= 0);
//     const buttonDisabled = isAdding || noVariantSelected || outOfStock;
//     const buttonText = isAdding
//       ? "Adding..."
//       : noVariantSelected
//         ? "Select Variant"
//         : outOfStock
//           ? "Out of Stock"
//           : "Add to Cart";

//     return (
//       <div
//         key={prod._id}
//         className="col-6 col-md-4 col-lg-4 position-relative"
//       >
//         {/* Wishlist Heart */}
//         <button
//           onClick={() => {
//             if (selectedVariant || !hasVariants) {
//               toggleWishlist(prod, selectedVariant || {});
//             }
//           }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute",
//             top: "8px",
//             right: "8px",
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: isProductInWishlist ? "#dc3545" : "#ccc",
//             fontSize: "22px",
//             zIndex: 2,
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             borderRadius: "50%",
//             width: "34px",
//             height: "34px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             transition: "all 0.3s ease",
//             border: "none",
//             outline: "none"
//           }}
//           title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status"></div>
//           ) : isProductInWishlist ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         {/* Product Image */}
//         <img
//           src={imageUrl}
//           alt={prod.name}
//           className="card-img-top"
//           style={{
//             height: "200px",
//             objectFit: "contain",
//             cursor: "pointer",
//           }}
//           onClick={() => navigate(`/product/${productSlug}`)}
//         />

//         {/* Rating */}
//         <div className="d-flex align-items-center mt-2">
//           {renderStars(prod.avgRating || 0)}
//           <span className="ms-2 text-muted small">
//             ({prod.totalRatings || 0})
//           </span>
//         </div>

//         <div className="card-body p-0 d-flex flex-column" style={{ height: "285px" }}>
//           {/* Brand */}
//           <div className="brand-name text-muted small mb-1 fw-medium">
//             {getBrandName(prod)}
//           </div>

//           <h5
//             className="card-title mt-2  align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate(`/product/${productSlug}`)}
//           >
//             {prod.name}
//             {selectedVariant && selectedVariant.shadeName && (
//               <div
//                 className="text-black fw-normal fs-6"
//                 style={{ marginTop: "-2px" }}
//               >
//                 {getVariantDisplayText(selectedVariant)}
//               </div>
//             )}
//           </h5>

//           {/* Variant Selection */}
//           {hasVariants && (
//             <div className="variant-section mt-3">
//               {/* Color Circles */}
//               {grouped.color.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2 mb-2">
//                   {initialColors.map((v) => {
//                     const isSelected = selectedVariant?.sku === v.sku;
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={v.sku || v._id}
//                         className="color-circle"
//                         style={{
//                           width: "28px",
//                           height: "28px",
//                           borderRadius: "20%",
//                           backgroundColor: v.hex || "#ccc",
//                           border: isSelected
//                             ? "3px solid #000"
//                             : "1px solid #ddd",
//                           cursor: isOutOfStock
//                             ? "not-allowed"
//                             : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           position: "relative",
//                         }}
//                         onClick={() =>
//                           !isOutOfStock &&
//                           handleVariantSelect(prod._id, v)
//                         }
//                       >
//                         {isSelected && (
//                           <span
//                             style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             ✓
//                           </span>
//                         )}
//                       </div>
//                     );
//                   })}
//                   {grouped.color.length > 4 && (
//                     <button
//                       className="more-btn"
//                       onClick={() =>
//                         openVariantOverlay(prod._id, "color")
//                       }
//                       style={{
//                         width: "28px",
//                         height: "28px",
//                         borderRadius: "6px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "10px",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       +{grouped.color.length - 4}
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* Text Variants */}
//               {grouped.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {initialText.map((v) => {
//                     const isSelected = selectedVariant?.sku === v.sku;
//                     const isOutOfStock = v.stock <= 0;
//                     return (
//                       <div
//                         key={v.sku || v._id}
//                         className={`variant-text page-title-main-name ${isSelected ? "selected" : ""
//                           }`}
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: "6px",
//                           border: isSelected
//                             ? "2px solid #000"
//                             : "1px solid #ddd",
//                           background: isSelected
//                             ? "#000"
//                             : "#fff",
//                           color: isSelected ? "#fff" : "#000",
//                           fontSize: "13px",
//                           cursor: isOutOfStock
//                             ? "not-allowed"
//                             : "pointer",
//                           opacity: isOutOfStock ? 0.5 : 1,
//                           textTransform: 'lowercase'
//                         }}
//                         onClick={() =>
//                           !isOutOfStock &&
//                           handleVariantSelect(prod._id, v)
//                         }
//                       >
//                         {getVariantDisplayText(v)}
//                       </div>
//                     );
//                   })}
//                   {grouped.text.length > 2 && (
//                     <button
//                       className="more-btn page-title-main-name"
//                       onClick={() =>
//                         openVariantOverlay(prod._id, "text")
//                       }
//                       style={{
//                         padding: "6px 12px",
//                         borderRadius: "6px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "12px",
//                       }}
//                     >
//                       +{grouped.text.length - 2}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Price */}
//           <p
//             className="fw-bold mb-3 mt-3 page-title-main-name"
//             style={{ fontSize: "16px" }}
//           >
//             {(() => {
//               const price =
//                 selectedVariant?.displayPrice ||
//                 selectedVariant?.discountedPrice ||
//                 prod.price ||
//                 0;
//               const original =
//                 selectedVariant?.originalPrice ||
//                 selectedVariant?.mrp ||
//                 prod.mrp ||
//                 price;
//               const hasDiscount = original > price;
//               const percent = hasDiscount
//                 ? Math.round(
//                   ((original - price) / original) * 100
//                 )
//                 : 0;
//               return hasDiscount ? (
//                 <>
//                   ₹{price}
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#888",
//                       marginLeft: "8px",
//                     }}
//                   >
//                     ₹{original}
//                   </span>
//                   <span
//                     style={{
//                       color: "#e53e3e",
//                       marginLeft: "8px",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ({percent}% OFF)
//                   </span>
//                 </>
//               ) : (
//                 <>₹{original}</>
//               );
//             })()}
//           </p>

//           {/* Add to Cart Button */}
//           <div className="mt-auto">
//             <button
//               className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""
//                 }`}
//               onClick={() => handleAddToCart(prod)}
//               disabled={buttonDisabled}
//               style={{
//                 transition: "background-color 0.3s ease, color 0.3s ease",
//               }}
//             >
//               {isAdding ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   {buttonText}
//                   {!buttonDisabled && !isAdding && (
//                     <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                   )}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Variant Overlay */}
//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay" onClick={closeVariantOverlay}>
//             <div
//               className="variant-overlay-content"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//                 maxHeight: "80vh",
//                 background: "#fff",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0">Select Variant ({totalVariants})</h5>
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: "24px" }}>
//                   ×
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="variant-tabs d-flex">
//                 <button
//                   className={`variant-tab flex-fill py-3 ${selectedVariantType === "all" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("all")}
//                 >
//                   All ({totalVariants})
//                 </button>
//                 {grouped.color.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${selectedVariantType === "color" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("color")}
//                   >
//                     Colors ({grouped.color.length})
//                   </button>
//                 )}
//                 {grouped.text.length > 0 && (
//                   <button
//                     className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("text")}
//                   >
//                     Sizes ({grouped.text.length})
//                   </button>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="p-3 overflow-auto flex-grow-1">
//                 {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                   grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const isSelected = selectedVariant?.sku === v.sku;
//                         const isOutOfStock = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   borderRadius: "20%",
//                                   backgroundColor: v.hex || "#ccc",
//                                   margin: "0 auto 8px",
//                                   border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                   opacity: isOutOfStock ? 0.5 : 1,
//                                   position: "relative",
//                                 }}
//                               >
//                                 {isSelected && (
//                                   <span
//                                     style={{
//                                       position: "absolute",
//                                       top: "50%",
//                                       left: "50%",
//                                       transform: "translate(-50%, -50%)",
//                                       color: "#fff",
//                                       fontWeight: "bold",
//                                     }}
//                                   >
//                                     ✓
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="small">{getVariantDisplayText(v)}</div>
//                               {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                 {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                   grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const isSelected = selectedVariant?.sku === v.sku;
//                         const isOutOfStock = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(prod._id, v), closeVariantOverlay())
//                               }
//                             >
//                               <div
//                                 style={{
//                                   padding: "10px",
//                                   borderRadius: "8px",
//                                   border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                                   background: isSelected ? "#f8f9fa" : "#fff",
//                                   minHeight: "50px",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   opacity: isOutOfStock ? 0.5 : 1,
//                                 }}
//                               >
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {isOutOfStock && <div className="text-danger small mt-1">Out of Stock</div>}
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

//   return (
//     <>
//       {loading && (
//         <div className="fullscreen-loader page-title-main-name">
//           <div className="spinner"></div>
//           <p className="text-black">Loading products...</p>
//         </div>
//       )}
//       <Header />

//       {/* <div className="banner-images text-center">
//         <img
//           src={bannerImage || "/banner-placeholder.jpg"}
//           alt="Banner"
//           className="w-100"
//           style={{ maxHeight: "400px", objectFit: "cover" }}
//         />
//       </div> */}

//       <div className="container-lg py-4" ref={containerRef}>
//         {/* <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2> */}

//         <div className="row">
//           {/* Desktop Sidebar */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter
//               filters={filters}
//               setFilters={setFilters}
//               currentPage="category"
//             />
//           </div>

//           {/* Mobile Filter + Sort Buttons */}
//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>

//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   {/* Filter Button */}
//                   <div className="col-6">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img src={filtering} alt="Filter" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>

//                   {/* Sort Button */}
//                   <div className="col-6 border-end">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)}
//                       style={{ gap: "12px" }}
//                     >
//                       <img src={updownarrow} alt="Sort" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                         <span className="text-muted small">{getCurrentSortText()}</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Filter Offcanvas */}
//           {showFilterOffcanvas && (
//             <>
//               <div
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }}
//                 onClick={() => setShowFilterOffcanvas(false)}
//               ></div>
//               <div
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: "16px",
//                   borderTopRightRadius: "16px",
//                   maxHeight: "85vh",
//                   boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button
//                     className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowFilterOffcanvas(false)}
//                   ></button>
//                   <div
//                     className="mx-auto mt-2 bg-secondary"
//                     style={{ height: "5px", width: "50px", borderRadius: "3px" }}
//                   ></div>
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={allProducts}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Mobile Sort Offcanvas */}
//           {showSortOffcanvas && (
//             <>
//               <div
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }}
//                 onClick={() => setShowSortOffcanvas(false)}
//               ></div>
//               <div
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: "16px",
//                   borderTopRightRadius: "16px",
//                   maxHeight: "60vh",
//                   boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button
//                     className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowSortOffcanvas(false)}
//                   ></button>
//                   <div
//                     className="mx-auto mt-2 bg-secondary"
//                     style={{ height: "5px", width: "50px", borderRadius: "3px" }}
//                   ></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input
//                         className="form-check-input me-3"
//                         type="radio"
//                         name="sort"
//                         checked={!filters.discountSort}
//                         onChange={() => {
//                           setFilters((prev) => ({ ...prev, discountSort: "" }));
//                           setShowSortOffcanvas(false);
//                         }}
//                       />
//                       <span className="page-title-main-name">Relevance</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input
//                         className="form-check-input me-3"
//                         type="radio"
//                         name="sort"
//                         checked={filters.discountSort === "high"}
//                         onChange={() => {
//                           setFilters((prev) => ({ ...prev, discountSort: "high" }));
//                           setShowSortOffcanvas(false);
//                         }}
//                       />
//                       <span className="page-title-main-name">Highest Discount First</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input
//                         className="form-check-input me-3"
//                         type="radio"
//                         name="sort"
//                         checked={filters.discountSort === "low"}
//                         onChange={() => {
//                           setFilters((prev) => ({ ...prev, discountSort: "low" }));
//                           setShowSortOffcanvas(false);
//                         }}
//                       />
//                       <span className="page-title-main-name">Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Product Grid */}
//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               {/* <span className="text-muted page-title-main-name">
//                 Showing {allProducts.length} products
//                 {hasMore && " (Scroll for more)"}
//               </span> */}

//               <span className="text-muted page-title-main-name">
//                 {/* {pageTitle || `Showing ${allProducts.length} products`} */}
//                 {hasMore && pageTitle && " (Scroll for more)"}
//               </span>

//               {Object.values(filters).some((val) => val !== "" && val !== null) && (
//                 <button
//                   className="btn btn-sm btn-outline-danger"
//                   onClick={() =>
//                     setFilters({
//                       brand: "",
//                       category: "",
//                       skinType: "",
//                       formulation: "",
//                       priceRange: null,
//                       minRating: "",
//                       discountSort: "",
//                     })
//                   }
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {allProducts.length > 0 ? (
//                 allProducts.map(renderProductCard)
//               ) : !loading ? (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               ) : null}
//             </div>

//             {/* Loading Spinner for infinite scroll */}
//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             {/* Observer element for infinite scroll */}
//             <div ref={loaderRef} style={{ height: "20px", marginTop: "20px" }}></div>

//             {/* End of Results Message */}
//             {!hasMore && allProducts.length > 0 && (
//               <div className="text-center mt-4 py-4 border-top">
//                 <p className="text-muted">
//                   🎉 You've reached the end! No more products to show.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ProductPage;





























/* ProductPage – Merged Design Edition with Multi-Filter & Multi-Brand Support */
import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaTag } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "./UserContext.jsx";
import BrandFilter from "./BrandFilter";
import "../css/ProductPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import updownarrow from "../assets/updownarrow.svg";
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

/* ─── helpers ───────────────────────────────────────────────────────────── */
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

const isValidHexColor = (hex) => {
    if (!hex || typeof hex !== "string") return false;
    return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
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

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug || params["*"];
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    let effectiveSlug = slug;
    if (slug && slug.includes("/")) {
        const segments = slug.split("/");
        effectiveSlug = segments[segments.length - 1];
    }

    /* ── state ──────────────────────────────────────────────────────────────── */
    const [allProducts, setAllProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState("Products");
    const [bannerImages, setBannerImages] = useState([]);
    const swiperRef = useRef(null);

    const [trendingCategories, setTrendingCategories] = useState([]);
    const [shopBySkinTypes, setShopBySkinTypes] = useState([]);
    const [shopByIngredients, setShopByIngredients] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [filterData, setFilterData] = useState(null);

    const activeCategorySlug = useMemo(() => {
        return location.pathname.includes("/category/") && effectiveSlug ? effectiveSlug : null;
    }, [location.pathname, effectiveSlug]);
    const [activeCategoryName, setActiveCategoryName] = useState("");

    const [selectedVariants, setSelectedVariants] = useState({});
    const [tempSelectedVariants, setTempSelectedVariants] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);

    const [wishlistLoading, setWishlistLoading] = useState({});
    const [wishlistData, setWishlistData] = useState([]);

    const [filters, setFilters] = useState(() => {
        const initial = {
            brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
            finishes: [], ingredients: [], priceRange: null, discountMin: null,
            minRating: "", sort: "recent"
        };
        const getMultiParam = (key) => {
            const values = searchParams.getAll(key);
            if (values.length > 0) return values;
            const commaValue = searchParams.get(key);
            if (commaValue) return commaValue.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };
        ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
            initial[key] = getMultiParam(key);
        });
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice !== null || maxPrice !== null) {
            initial.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : null,
            };
        }
        const discountMin = searchParams.get('discountMin');
        if (discountMin !== null) initial.discountMin = parseFloat(discountMin);
        const minRating = searchParams.get('minRating');
        if (minRating !== null) initial.minRating = minRating;
        const sortParam = searchParams.get('sort');
        if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
            initial.sort = sortParam;
        }
        return initial;
    });

    const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
    const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
    const [showVariantOverlay, setShowVariantOverlay] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("all");

    const { addToCart } = useContext(CartContext);
    const { user } = useContext(UserContext);
    const loaderRef = useRef(null);
    const containerRef = useRef(null);

    /* ── helper: get brand name from filterData ────────────────────────────── */
    const getBrandNameById = useCallback((brandId) => {
        if (!brandId) return brandId;
        const brands = filterData?.brands || [];
        const found = brands.find(b => (b._id === brandId || b.id === brandId || b.slug === brandId));
        if (found) return found.name || found.brandName || brandId;
        return brandId;
    }, [filterData]);

    const getSkinTypeNameBySlug = useCallback((skinSlug) => {
        if (!skinSlug) return skinSlug;
        const found = shopBySkinTypes.find(s => s.slug === skinSlug);
        if (found) return found.name || skinSlug;
        return skinSlug;
    }, [shopBySkinTypes]);

    const getIngredientNameBySlug = useCallback((ingSlug) => {
        if (!ingSlug) return ingSlug;
        const found = shopByIngredients.find(i => i.slug === ingSlug);
        if (found) return found.name || ingSlug;
        return ingSlug;
    }, [shopByIngredients]);

    const getCategoryNameById = useCallback((catId) => {
        if (!catId) return catId;
        const found = trendingCategories.find(c => c.slug === catId || c._id === catId);
        if (found) return found.name || catId;
        if (filterData?.categories) {
            const catFound = filterData.categories.find(c => c._id === catId || c.slug === catId);
            if (catFound) return catFound.name || catId;
        }
        return catId;
    }, [trendingCategories, filterData]);

    const getFormulationNameById = useCallback((formId) => {
        if (!formId) return formId;
        const formulations = filterData?.formulations || [];
        const found = formulations.find(f => f._id === formId || f.slug === formId);
        if (found) return found.name || formId;
        return formId;
    }, [filterData]);

    const getFinishNameById = useCallback((finishId) => {
        if (!finishId) return finishId;
        const finishes = filterData?.finishes || [];
        const found = finishes.find(f => f._id === finishId || f.slug === finishId);
        if (found) return found.name || finishId;
        return finishId;
    }, [filterData]);

    /* ── helper: build active filter chips ──────────────────────────────────── */
    const activeFilterChips = useMemo(() => {
        const chips = [];

        filters.brandIds?.forEach(id => {
            chips.push({ type: 'brand', key: id, label: getBrandNameById(id) });
        });

        filters.categoryIds?.forEach(id => {
            chips.push({ type: 'category', key: id, label: getCategoryNameById(id) });
        });

        filters.skinTypes?.forEach(slug => {
            chips.push({ type: 'skinType', key: slug, label: getSkinTypeNameBySlug(slug) });
        });

        filters.formulations?.forEach(id => {
            chips.push({ type: 'formulation', key: id, label: getFormulationNameById(id) });
        });

        filters.finishes?.forEach(id => {
            chips.push({ type: 'finish', key: id, label: getFinishNameById(id) });
        });

        filters.ingredients?.forEach(slug => {
            chips.push({ type: 'ingredient', key: slug, label: getIngredientNameBySlug(slug) });
        });

        if (filters.priceRange) {
            const priceLabel = filters.priceRange.max
                ? `₹${filters.priceRange.min} - ₹${filters.priceRange.max}`
                : `Above ₹${filters.priceRange.min}`;
            chips.push({ type: 'priceRange', key: 'priceRange', label: priceLabel });
        }

        if (filters.discountMin && filters.discountMin > 0) {
            chips.push({ type: 'discount', key: 'discount', label: `${filters.discountMin}%+ Off` });
        }

        if (filters.minRating) {
            chips.push({ type: 'rating', key: 'rating', label: `${filters.minRating}★ & above` });
        }

        return chips;
    }, [filters, getBrandNameById, getSkinTypeNameBySlug, getIngredientNameBySlug, getCategoryNameById, getFormulationNameById, getFinishNameById]);

    /* ── handle remove single filter chip ──────────────────────────────────── */
    const handleRemoveFilterChip = useCallback((chip) => {
        setFilters(prev => {
            const updated = { ...prev };
            switch (chip.type) {
                case 'brand':
                    updated.brandIds = (prev.brandIds || []).filter(id => id !== chip.key);
                    break;
                case 'category':
                    updated.categoryIds = (prev.categoryIds || []).filter(id => id !== chip.key);
                    break;
                case 'skinType':
                    updated.skinTypes = (prev.skinTypes || []).filter(s => s !== chip.key);
                    break;
                case 'formulation':
                    updated.formulations = (prev.formulations || []).filter(id => id !== chip.key);
                    break;
                case 'finish':
                    updated.finishes = (prev.finishes || []).filter(id => id !== chip.key);
                    break;
                case 'ingredient':
                    updated.ingredients = (prev.ingredients || []).filter(s => s !== chip.key);
                    break;
                case 'priceRange':
                    updated.priceRange = null;
                    break;
                case 'discount':
                    updated.discountMin = null;
                    break;
                case 'rating':
                    updated.minRating = "";
                    break;
                default:
                    break;
            }
            return updated;
        });
    }, []);

    /* ── toast ──────────────────────────────────────────────────────────────── */
    const showToastMsg = (msg, type = "error", dur = 3000) => {
        if (type === "success") {
            toast.success(msg, { autoClose: dur });
        } else if (type === "info") {
            toast.info(msg, { autoClose: dur });
        } else {
            toast.error(msg, { autoClose: dur });
        }
    };

    /* ── wishlist ───────────────────────────────────────────────────────────── */
    const isInWishlist = (pid, sku) => {
        if (!pid || !sku) return false;
        return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
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

    useEffect(() => { fetchWishlistData(); }, [user]);

    const toggleWishlist = async (prod, variant) => {
        if (!prod || !variant) {
            showToastMsg("Please select a variant first", "error");
            return;
        }

        const productId = prod._id;
        const sku = getSku(variant);

        setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

        try {
            const inWl = isInWishlist(productId, sku);

            if (user && !user.guest) {
                if (inWl) {
                    await axios.delete(
                        `https://beauty.joyory.com/api/user/wishlist/${productId}`,
                        { withCredentials: true, data: { sku } }
                    );
                    showToastMsg("Removed from wishlist!", "success");
                } else {
                    await axios.post(
                        `https://beauty.joyory.com/api/user/wishlist/${productId}`,
                        { sku },
                        { withCredentials: true }
                    );
                    showToastMsg("Added to wishlist!", "success");
                }
                await fetchWishlistData();
            } else {
                let guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];

                if (inWl) {
                    guestWishlist = guestWishlist.filter(
                        (it) => !(it._id === productId && it.sku === sku)
                    );
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
                    showToastMsg("Added to wishlist!", "success");
                }

                localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
                await fetchWishlistData();
            }
        } catch (e) {
            if (e.response?.status === 401) {
                showToastMsg("Please login to use wishlist", "error");
                navigate("/login", { state: { from: location.pathname } });
            } else {
                showToastMsg(e.response?.data?.message || "Wishlist error", "error");
            }
        } finally {
            setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
        }
    };

    /* ── Set initial selected variants when products are loaded ──────────── */
    useEffect(() => {
        if (allProducts.length > 0) {
            const newSelectedVariants = {};
            allProducts.forEach((prod) => {
                const variants = Array.isArray(prod.variants) ? prod.variants : [];
                if (variants.length > 0) {
                    const firstInStockVariant = variants.find(v => v.stock > 0);
                    if (firstInStockVariant) {
                        newSelectedVariants[prod._id] = firstInStockVariant;
                    } else {
                        newSelectedVariants[prod._id] = variants[0];
                    }
                }
            });
            setSelectedVariants(prev => ({ ...prev, ...newSelectedVariants }));
        }
    }, [allProducts]);

    /* ── fetch products ─────────────────────────────────────────────────────── */
    const buildQueryParams = (cursor = null) => {
        const p = new URLSearchParams();
        const path = location.pathname.toLowerCase();

        if (activeCategorySlug) {
            p.append("categoryIds", activeCategorySlug);
        } else if (path.includes("/category/")) {
            p.append("categoryIds", effectiveSlug);
        } else if (path.includes("/skintype/")) {
            p.append("skinTypes", effectiveSlug);
        } else if (path.includes("/ingredients/")) {
            p.append("ingredients", effectiveSlug);
        } else if (path.includes("/promotion/")) {
            p.append("promoSlug", effectiveSlug);
        }

        const q = searchParams.get("q") || searchParams.get("search");
        if (q) p.append("q", q);

        filters.brandIds?.forEach((id) => p.append("brandIds", id));
        filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
        filters.skinTypes?.forEach((n) => p.append("skinTypes", n));
        filters.formulations?.forEach((id) => p.append("formulations", id));
        filters.finishes?.forEach((s) => p.append("finishes", s));
        filters.ingredients?.forEach((s) => p.append("ingredients", s));
        if (filters.minRating) p.append("minRating", filters.minRating);

        if (filters.priceRange) {
            p.append("minPrice", filters.priceRange.min);
            if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
        }

        if (filters.discountMin && filters.discountMin > 0) {
            p.append("discountMin", filters.discountMin);
        }

        if (filters.sort) p.append("sort", filters.sort);
        if (cursor) p.append("cursor", cursor);
        p.append("limit", "9");

        const queryString = p.toString();
        console.log("API Query ->", `${PRODUCT_ALL_API}?${queryString}`);
        return queryString;
    };

    const fetchProducts = async (cursor = null, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                setNextCursor(null);
                setHasMore(true);
            } else {
                setLoadingMore(true);
            }

            const { data } = await axios.get(
                `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
                { withCredentials: true }
            );

            // title & banner
            const q = searchParams.get("q") || searchParams.get("search");
            if (q) setPageTitle(`Search Results for "${q}"`);
            else if (data.titleMessage) setPageTitle(data.titleMessage);
            else if (data.category?.name) setPageTitle(data.category.name);
            else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
            else if (data.skinType?.name) setPageTitle(data.skinType.name);
            else setPageTitle("Shop Products");

            // Extract banner array
            let extractedBanners = [];
            if (data.bannerImage && Array.isArray(data.bannerImage)) {
                extractedBanners = data.bannerImage;
            } else if (data.category?.bannerImage && Array.isArray(data.category.bannerImage)) {
                extractedBanners = data.category.bannerImage;
            } else if (data.promoMeta?.bannerImage && Array.isArray(data.promoMeta.bannerImage)) {
                extractedBanners = data.promoMeta.bannerImage;
            } else if (data.skinType?.bannerImage && Array.isArray(data.skinType.bannerImage)) {
                extractedBanners = data.skinType.bannerImage;
            } else if (data.bannerImage) {
                extractedBanners = [data.bannerImage];
            } else if (data.category?.bannerImage) {
                extractedBanners = [data.category.bannerImage];
            } else if (data.promoMeta?.bannerImage) {
                extractedBanners = [data.promoMeta.bannerImage];
            } else if (data.skinType?.bannerImage) {
                extractedBanners = [data.skinType.bannerImage];
            }
            setBannerImages(extractedBanners);

            // Shop By Sections
            if (data.skinTypes && Array.isArray(data.skinTypes)) {
                setShopBySkinTypes(data.skinTypes);
            }
            if (data.shopByIngredients && Array.isArray(data.shopByIngredients)) {
                setShopByIngredients(data.shopByIngredients);
            }
            if (data.promotions && Array.isArray(data.promotions)) {
                setPromotions(data.promotions);
            }

            if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
                setTrendingCategories(data.trendingCategories);
                if (effectiveSlug && !activeCategoryName) {
                    const found = data.trendingCategories.find((c) => c.slug === effectiveSlug);
                    if (found) setActiveCategoryName(found.name);
                }
            } else {
                setTrendingCategories([]);
            }

            if (data.category?.name && !activeCategoryName && effectiveSlug) {
                setActiveCategoryName(data.category.name);
            }

            if (reset && data.filters) {
                setFilterData(data.filters);
            }

            const prods = data.products || [];
            const pg = data.pagination || {};

            if (reset) {
                setAllProducts(prods);
            } else {
                setAllProducts((prev) => [...prev, ...prods]);
            }

            setHasMore(pg.hasMore || false);
            setNextCursor(pg.nextCursor || null);
        } catch (e) {
            console.error(e);
            showToastMsg("Failed to fetch products", "error");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (location.pathname.includes("/category/") && effectiveSlug) {
            if (trendingCategories.length > 0) {
                const found = trendingCategories.find(c => c.slug === effectiveSlug);
                if (found) setActiveCategoryName(found.name);
            }
        } else {
            setActiveCategoryName("");
        }
    }, [effectiveSlug, location.pathname, trendingCategories]);

    /* ── Parse URL query parameters on mount ──────────────────────────────── */
    useEffect(() => {
        const initialFilters = {
            brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
            finishes: [], ingredients: [], priceRange: null, discountMin: null,
            minRating: "", sort: "recent"
        };

        const getMultiParam = (key) => {
            const values = searchParams.getAll(key);
            if (values.length > 0) return values;
            const commaValue = searchParams.get(key);
            if (commaValue) return commaValue.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach(key => {
            initialFilters[key] = getMultiParam(key);
        });

        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice !== null || maxPrice !== null) {
            initialFilters.priceRange = {
                min: minPrice ? parseFloat(minPrice) : 0,
                max: maxPrice ? parseFloat(maxPrice) : null,
            };
        }

        const discountMin = searchParams.get('discountMin');
        if (discountMin !== null) initialFilters.discountMin = parseFloat(discountMin);
        const minRating = searchParams.get('minRating');
        if (minRating !== null) initialFilters.minRating = minRating;
        const sortParam = searchParams.get('sort');
        if (sortParam !== null && ['recent', 'priceHighToLow', 'priceLowToHigh'].includes(sortParam)) {
            initialFilters.sort = sortParam;
        }

        setFilters(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(initialFilters)) {
                console.log("Filters restored from URL:", initialFilters);
                return initialFilters;
            }
            return prev;
        });
    }, [searchParams]);

    /* ── Sync URL query parameters when filters change ──────────────────── */
    useEffect(() => {
        const newParams = new URLSearchParams();

        const addArrayParam = (key, arr) => {
            if (arr && arr.length) arr.forEach(v => newParams.append(key, v));
        };

        addArrayParam('brandIds', filters.brandIds);
        addArrayParam('categoryIds', filters.categoryIds);
        addArrayParam('skinTypes', filters.skinTypes);
        addArrayParam('formulations', filters.formulations);
        addArrayParam('finishes', filters.finishes);
        addArrayParam('ingredients', filters.ingredients);

        if (filters.priceRange) {
            if (filters.priceRange.min !== undefined) newParams.set('minPrice', filters.priceRange.min);
            if (filters.priceRange.max != null) newParams.set('maxPrice', filters.priceRange.max);
        }

        if (filters.discountMin) {
            newParams.set('discountMin', filters.discountMin);
        }

        if (filters.minRating) newParams.set('minRating', filters.minRating);
        if (filters.sort !== 'recent') newParams.set('sort', filters.sort);

        const currentQuery = searchParams.toString();
        const newQuery = newParams.toString();
        if (currentQuery !== newQuery) {
            setSearchParams(newParams, { replace: true });
        }
    }, [filters, setSearchParams, searchParams]);

    // Fetch products when filters or page context change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(null, true);
        }, 400);

        return () => clearTimeout(timer);
    }, [effectiveSlug, location.pathname, filters, activeCategorySlug]);

    /* ── helpers ────────────────────────────────────────────────────────────── */
    const pageDefault = location.pathname.includes("/category/") ? effectiveSlug : null;

    const makeEmptyFilters = () => ({
        brandIds: [], categoryIds: [], skinTypes: [], formulations: [],
        finishes: [], ingredients: [], priceRange: null, discountMin: null,
        minRating: "", sort: "recent",
    });

    /* ── CATEGORY PILL CLICK ────────────────────────────────────────────────── */
    const handleCategoryPillClick = useCallback((cat) => {
        if (slug && slug.includes("/")) {
            const segments = slug.split("/");
            segments[segments.length - 1] = cat.slug;
            navigate(`/category/${segments.join("/")}`);
        } else if (slug) {
            navigate(`/category/${slug}/${cat.slug}`);
        } else {
            navigate(`/category/${cat.slug}`);
        }
    }, [navigate, slug]);

    const handleClearCategory = useCallback(() => {
        if (slug && slug.includes("/")) {
            const segments = slug.split("/");
            segments.pop();
            const newPath = segments.join("/");
            if (newPath) {
                navigate(`/category/${newPath}`);
            } else {
                navigate("/products");
            }
        } else {
            navigate("/products");
        }
    }, [navigate, slug]);

    /* ── Click Handlers ─────────────────────────────────────────────────────── */
    const handleSkinTypeClick = useCallback((skin) => {
        setFilters(prev => {
            const current = prev.skinTypes || [];
            const isActive = current.includes(skin.slug);
            return {
                ...prev,
                skinTypes: isActive ? current.filter(s => s !== skin.slug) : [...current, skin.slug]
            };
        });
    }, []);

    const handleIngredientClick = useCallback((ing) => {
        setFilters(prev => {
            const current = prev.ingredients || [];
            const isActive = current.includes(ing.slug);
            return {
                ...prev,
                ingredients: isActive ? current.filter(i => i !== ing.slug) : [...current, ing.slug]
            };
        });
    }, []);

    const handlePromotionClick = useCallback((promo) => {
        if (promo.scope === "brand" && promo.targetSlug) {
            navigate(`/brand/${promo.targetSlug}`);
        } else if (promo.scope === "category" && promo.targetSlug) {
            navigate(`/category/${promo.targetSlug}`);
        } else {
            navigate(`/promotion/${promo.slug}`);
        }
    }, [navigate]);

    /* ── infinite scroll ────────────────────────────────────────────────────── */
    const loadMore = useCallback(() => {
        if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
    }, [nextCursor, hasMore, loadingMore]);

    useEffect(() => {
        if (!hasMore || loadingMore) return;
        const obs = new IntersectionObserver(
            ([e]) => e.isIntersecting && loadMore(),
            { root: null, rootMargin: "100px", threshold: 0.1 }
        );
        const el = loaderRef.current;
        if (el) obs.observe(el);
        return () => el && obs.unobserve(el);
    }, [loadMore, hasMore, loadingMore]);

    // Handle scroll for older browsers
    useEffect(() => {
        const handleScroll = () => {
            if (loadingMore || !hasMore) return;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                loadMore();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore, loadingMore, hasMore]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    /* ── cart ───────────────────────────────────────────────────────────────── */
    const handleAddToCart = async (prod, forceVariant = null) => {
        setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
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
                    variants: [{ variantSku: getSku(sel), quantity: 1 }]
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
                const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
                delete cache[prod._id];
                localStorage.setItem("cartVariantCache", JSON.stringify(cache));
            }

            const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
            if (!data.success) throw new Error(data.message || "Cart add failed");
            showToastMsg("Product added to cart!", "success");
            navigate("/cartpage");
        } catch (e) {
            const msg = e.response?.data?.message || e.message || "Failed to add to cart";
            showToastMsg(msg, "error");
            if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
        } finally {
            setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
        }
    };

    /* ── ui handlers ────────────────────────────────────────────────────────── */
    const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
    const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
    const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); setTempSelectedVariants({}); };
    const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

    const isAnyFilterActive =
        filters.brandIds.length > 0 || filters.categoryIds.length > 0 ||
        filters.skinTypes.length > 0 || filters.formulations.length > 0 ||
        filters.finishes.length > 0 || filters.ingredients.length > 0 ||
        filters.priceRange || filters.discountMin || filters.minRating ||
        filters.sort !== "recent" ||
        (activeCategorySlug && activeCategorySlug !== pageDefault);

    const handleClearAllFilters = () => {
        setFilters(makeEmptyFilters());
        if (slug && slug.includes("/")) {
            const segments = slug.split("/");
            segments.pop();
            const newPath = segments.join("/");
            if (newPath) {
                navigate(`/category/${newPath}`);
            } else {
                navigate("/products");
            }
        } else {
            navigate("/products");
        }
    };

    /* ── product card ───────────────────────────────────────────────────────── */
    const renderProductCard = (prod) => {
        const vars = Array.isArray(prod.variants) ? prod.variants : [];
        const hasVar = vars.length > 0;
        const isVariantSelected = !!selectedVariants[prod._id];
        const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
        const grouped = groupVariantsByType(vars);
        const totalVars = vars.length;
        const sku = displayVariant ? getSku(displayVariant) : null;
        const inWl = sku ? isInWishlist(prod._id, sku) : false;
        const slugPr = getProductSlug(prod);
        const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";
        const isAdding = addingToCart[prod._id];
        const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;
        const showSelectVariantButton = hasVar && vars.length > 1;
        const disabled = isAdding || (!showSelectVariantButton && oos);
        let btnText = "Add to Cart";
        if (isAdding) btnText = "Adding...";
        else if (showSelectVariantButton) btnText = "Select Variant";
        else if (oos) btnText = "Out of Stock";

        return (
            <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
                {/* Wishlist Heart */}
                <button
                    onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
                    disabled={wishlistLoading[prod._id]}
                    style={{
                        position: "absolute", top: 8, right: 8,
                        cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
                        color: inWl ? "#dc3545" : "#ccc", fontSize: 22, zIndex: 2,
                        backgroundColor: "transparent",
                        borderRadius: "50%",
                        width: 34, height: 34, display: "flex", alignItems: "center",
                        justifyContent: "center",
                        transition: "all .3s ease", border: "none",
                    }}
                    title={inWl ? "Remove from wishlist" : "Add to wishlist"}
                >
                    {wishlistLoading[prod._id]
                        ? <div className="spinner-border spinner-border-sm" role="status" />
                        : inWl ? <FaHeart /> : <FaRegHeart />}
                </button>

                {/* Product Image */}
                <img
                    src={img}
                    alt={prod.name}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
                    onClick={() => navigate(`/product/${slugPr}`)}
                />

                <div className="card-body p-0 d-flex flex-column" style={{ height: 265, justifyContent: 'space-between' }}>
                    {/* Brand */}
                    <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>

                    {/* Product Name */}
                    <h5
                        className="card-title mt-2 align-items-center gap-1 page-title-main-name"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/product/${slugPr}`)}
                    >
                        {(() => {
                            const varName = displayVariant ? getVariantDisplayText(displayVariant) : "";
                            return varName && varName.toUpperCase() !== "DEFAULT" ? `${prod.name} - ${varName}` : prod.name;
                        })()}
                    </h5>

                    {/* Price */}
                    <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
                        {(() => {
                            const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
                            const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
                            const disc = orig > price;
                            const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
                            return disc ? (
                                <>
                                    ₹{price}
                                    <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
                                    <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
                                </>
                            ) : <>₹{orig}</>;
                        })()}
                    </p>

                    {/* Add to Cart Button */}
                    <div className="mt-3">
                        <button
                            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
                            disabled={disabled}
                            style={{ transition: "background-color .3s ease, color .3s ease" }}
                        >
                            {isAdding
                                ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
                                : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: 20 }} />}</>}
                        </button>
                    </div>
                </div>

                {/* Variant Overlay - STREAMLINED */}
                {showVariantOverlay === prod._id && (
                    <div className="variant-overlay" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}>
                        <div
                          className="variant-overlay-content"
                          onClick={(e) => e.stopPropagation()}
                        >
                            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h5 className="m-0 page-title-main-name">Select Variant</h5>
                                <button onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }} style={{ background: "none", border: "none", fontSize: "40px" }}>×</button>
                            </div>

                            <div className="variant-overlay-body page-title-main-name">
                                {grouped.color.length > 0 && (
                                    <div className="row row-cols-4 g-3 mb-4">
                                        {grouped.color.map((v) => {
                                            const sel = displayVariant?.sku === v.sku;
                                            const oosV = v.stock <= 0;
                                            return (
                                                <div className="col-lg-4 col-6" key={v.sku || v._id}>
                                                    <div
                                                        className="text-center"
                                                        style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!oosV) {
                                                                handleVariantSelect(prod._id, v);
                                                                setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
                                                            }
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: 28, height: 28, borderRadius: "20%",
                                                            backgroundColor: v.hex || "#ccc", margin: "0 auto 8px",
                                                            border: sel ? "3px solid #000" : "1px solid #ddd",
                                                            opacity: oosV ? 0.5 : 1, position: "relative"
                                                        }}>
                                                            {sel && <span style={{
                                                                position: "absolute", top: "50%", left: "50%",
                                                                transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold"
                                                            }}>✓</span>}
                                                        </div>
                                                        <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>
                                                            {getVariantDisplayText(v)}
                                                        </div>
                                                        {oosV && <div className="text-danger small">Out of Stock</div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {grouped.text.length > 0 && (
                                    <div className="row row-cols-3 g-3">
                                        {grouped.text.map((v) => {
                                            const sel = displayVariant?.sku === v.sku;
                                            const oosV = v.stock <= 0;
                                            return (
                                                <div className="col" key={v.sku || v._id}>
                                                    <div
                                                        className="text-center"
                                                        style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!oosV) {
                                                                handleVariantSelect(prod._id, v);
                                                                setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
                                                            }
                                                        }}
                                                    >
                                                        <div style={{
                                                            padding: 10, borderRadius: 8,
                                                            border: sel ? "3px solid #000" : "1px solid #ddd",
                                                            background: sel ? "#f8f9fa" : "#fff",
                                                            minHeight: 50, display: "flex", alignItems: "center",
                                                            justifyContent: "center", opacity: oosV ? 0.5 : 1
                                                        }}>
                                                            {getVariantDisplayText(v)}
                                                        </div>
                                                        {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
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
                                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${slugPr}`); }} 
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
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            />
                                            Adding...
                                        </>
                                    ) : displayVariant?.stock <= 0 ? (
                                        "Out of Stock"
                                    ) : (
                                        <>
                                            Add to Bag
                                            {!isAdding && displayVariant?.stock > 0 && (
                                                <img src={Bag} alt="Bag" style={{ height: 20 }} />
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

    /* ── render: Selected Filter Chips ──────────────────────────────────────── */
    const renderActiveFilterChips = () => {
        if (activeFilterChips.length === 0) return null;

        return (
            <div className="active-filters-section mb-3" style={{
                background: '#f8f9fa',
                borderRadius: '10px',
                padding: '12px 16px',
                border: '1px solid #e9ecef',
            }}>
                <div className="d-flex align-items-start flex-wrap gap-2">
                    <span className="fw-semibold text-muted small" style={{ lineHeight: '32px', marginRight: '4px' }}>
                        <FaTag style={{ fontSize: '12px', marginRight: '4px' }} />
                        Active Filters:
                    </span>
                    {activeFilterChips.map((chip, idx) => (
                        <span
                            key={`${chip.type}-${chip.key}-${idx}`}
                            className="badge rounded-pill d-inline-flex align-items-center gap-1 page-title-main-name"
                            style={{
                                background: '#fff',
                                color: '#333',
                                border: '1px solid #dee2e6',
                                fontSize: '12px',
                                fontWeight: 500,
                                padding: '5px 10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                lineHeight: '1.4',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#fff0f0';
                                e.currentTarget.style.borderColor = '#dc3545';
                                e.currentTarget.style.color = '#dc3545';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.borderColor = '#dee2e6';
                                e.currentTarget.style.color = '#333';
                            }}
                            onClick={() => handleRemoveFilterChip(chip)}
                            title={`Remove ${chip.label}`}
                        >
                            {chip.label}
                            <FaTimes style={{ fontSize: '10px', opacity: 0.7 }} />
                        </span>
                    ))}

                    {activeFilterChips.length > 1 && (
                        <button
                            className="btn btn-sm btn-link text-danger p-0 ms-1 page-title-main-name"
                            style={{ fontSize: '12px', textDecoration: 'underline', lineHeight: '32px' }}
                            onClick={handleClearAllFilters}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const brandFilterProps = {
        filters,
        setFilters,
        filterData,
        trendingCategories,
        activeCategorySlug,
        activeCategoryName,
        onClearCategory: handleClearCategory,
        onCategoryPillClick: handleCategoryPillClick,
    };

    // Keep loader for initial loading
    if (loading && allProducts.length === 0)
        return (
            <div
                className="fullscreen-loader page-title-main-name"
                style={{ minHeight: "100vh", width: "100%" }}
            >
                <div className="text-center">
                    <DotLottieReact
                        className='foryoulanding-css'
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

    /* ── render ─────────────────────────────────────────────────────────────── */
    return (
        <>
            <Header />

            <div className="non-hero-spacer" />

            {/* Trending Categories */}
            {trendingCategories.length > 0 && (
                <div className="container-lg mt-4 mb-4">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView="auto"
                        navigation
                        style={{ padding: "5px 0" }}
                    >
                        {trendingCategories.map((cat) => {
                            const isActive = activeCategorySlug === cat.slug;
                            return (
                                <SwiperSlide key={cat.slug} className="mx-auto" style={{ width: "auto" }}>
                                    <button
                                        onClick={() => handleCategoryPillClick(cat)}
                                        className={`btn px-4 py-2 page-title-main-name ${isActive ? "btn-dark custom-pill" : "custom-pill"}`}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                            transition: "all 0.18s ease",
                                            transform: isActive ? "scale(1.04)" : "scale(1)",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={`Filter by ${cat.name}`}
                                    >
                                        {cat.name}
                                    </button>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            )}

            {/* Shop by Skin Types */}
            {shopBySkinTypes.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Shop by Skin Type</h5>
                    <div
                        className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}
                    >
                        {shopBySkinTypes.map((skin) => {
                            const isActive = filters.skinTypes.includes(skin.slug);
                            return (
                                <button
                                    key={skin.slug}
                                    onClick={() => handleSkinTypeClick(skin)}
                                    className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                                    style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
                                >
                                    {skin.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Shop by Ingredients */}
            {shopByIngredients.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Shop by Ingredients</h5>
                    <div
                        className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}
                    >
                        {shopByIngredients.map((ing) => {
                            const isActive = filters.ingredients.includes(ing.slug);
                            return (
                                <button
                                    key={ing.slug}
                                    onClick={() => handleIngredientClick(ing)}
                                    className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                                    style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}
                                >
                                    {ing.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Special Offers / Promotions */}
            {promotions.length > 0 && (
                <div className="container-lg mt-3">
                    <h5 className="mb-2 page-title-main-name">Special Offers</h5>
                    <div
                        className="d-flex overflow-auto py-2"
                        style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}
                    >
                        {promotions.map((promo) => (
                            <button
                                key={promo._id}
                                onClick={() => handlePromotionClick(promo)}
                                className="btn px-4 py-2 page-title-main-name flex-shrink-0 btn-outline-danger"
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                {promo.title} {promo.discountLabel && `(${promo.discountLabel})`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="padding-left-rightss ms-lg-0 ms-3 mx-3">
                {/* <h2 className="mb-4 d-none d-lg-block page-title-main-name page-upper-case-first">{pageTitle}</h2> */}

                <div className="row">
                    {/* Desktop Sidebar */}
                    <div className="d-none d-lg-block col-lg-3">
                        <BrandFilter {...brandFilterProps} />
                    </div>

                    {/* Mobile Filter + Sort Buttons */}
                    <div className="d-lg-none mb-lg-3">
                        <h2 className="mb-4 text-center mt-lg-0 mt-3 page-upper-case-first">{pageTitle}</h2>
                        <div className="w-100 filter-responsive rounded shadow-sm">
                            <div className="container-fluid p-0">
                                <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
                                    <div className="col-6">
                                        <button
                                            className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                                            onClick={() => setShowFilterOffcanvas(true)}
                                            style={{ gap: 12 }}
                                        >
                                            <img src={filtering} alt="Filter" style={{ width: 25 }} />
                                            <div className="text-start">
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
                                                <span className="text-muted small page-title-main-name">Tap to apply</span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="col-6 border-end">
                                        <button
                                            className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                                            onClick={() => setShowSortOffcanvas(true)}
                                            style={{ gap: 12 }}
                                        >
                                            <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
                                            <div className="text-start">
                                                <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
                                                <span className="text-muted small">
                                                    {filters.sort === "recent" ? "Relevance" : filters.sort === "priceHighToLow" ? "Price: High to Low" : "Price: Low to High"}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Offcanvas */}
                    {showFilterOffcanvas && (
                        <>
                            <div
                                className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                                style={{ opacity: 0.5, zIndex: 1040 }}
                                onClick={() => setShowFilterOffcanvas(false)}
                            />
                            <div
                                className="position-fixed start-0 bottom-0 w-100 bg-white"
                                style={{
                                    zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16,
                                    maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)"
                                }}
                            >
                                <div className="text-center py-3 position-relative">
                                    <h5 className="mb-0 fw-bold">Filters</h5>
                                    <button
                                        className="btn-close position-absolute end-0 me-3"
                                        style={{ top: "50%", transform: "translateY(-50%)" }}
                                        onClick={() => setShowFilterOffcanvas(false)}
                                    />
                                    <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
                                </div>
                                <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
                                    <BrandFilter
                                        {...brandFilterProps}
                                        onClose={() => setShowFilterOffcanvas(false)}
                                        onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
                                        onCategoryPillClick={(cat) => {
                                            handleCategoryPillClick(cat);
                                            setShowFilterOffcanvas(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Sort Offcanvas */}
                    {showSortOffcanvas && (
                        <>
                            <div
                                className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                                style={{ opacity: 0.5, zIndex: 1040 }}
                                onClick={() => setShowSortOffcanvas(false)}
                            />
                            <div
                                className="position-fixed start-0 bottom-0 w-100 bg-white"
                                style={{
                                    zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16,
                                    maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)"
                                }}
                            >
                                <div className="text-center py-3 position-relative">
                                    <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
                                    <button
                                        className="btn-close position-absolute end-0 me-3"
                                        style={{ top: "50%", transform: "translateY(-50%)" }}
                                        onClick={() => setShowSortOffcanvas(false)}
                                    />
                                    <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
                                </div>
                                <div className="px-4 pb-4">
                                    <div className="list-group">
                                        {[
                                            { value: "recent", label: "Relevance" },
                                            { value: "priceHighToLow", label: "Price High to Low" },
                                            { value: "priceLowToHigh", label: "Price Low to High" },
                                        ].map(({ value, label }) => (
                                            <label key={value} className="list-group-item py-3 d-flex align-items-center">
                                                <input
                                                    className="form-check-input me-3"
                                                    type="radio"
                                                    name="sort"
                                                    checked={filters.sort === value}
                                                    onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }}
                                                />
                                                <span className="page-title-main-name">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Product Grid */}
                    <div className="col-12 col-lg-9">
                        {/* Selected Filter Chips - Shows above product grid */}
                        {renderActiveFilterChips()}

                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <span className="text-muted page-title-main-name d-lg-block d-none">
                                {pageTitle || `Showing ${allProducts.length} products`}
                                {/* {hasMore && pageTitle && " (Scroll for more)"} */}
                            </span>

                            {isAnyFilterActive && activeFilterChips.length > 0 && (
                                <button
                                    className="btn btn-sm btn-outline-danger page-title-main-name"
                                    onClick={handleClearAllFilters}
                                    style={{ fontSize: '12px' }}
                                >
                                    <FaTimes style={{ fontSize: '10px', marginRight: '4px' }} />
                                    Clear All Filters
                                </button>
                            )}
                        </div>

                        <div className="row g-4 position-relative">
                            {/* Loading Overlay - shown when loading but products exist */}
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
                                        <p className="text-muted mb-0">
                                            Finding the perfect products just for you
                                        </p>
                                        <div className="d-flex justify-content-center gap-1 mt-4">
                                            <div className="dot-pulse"></div>
                                            <div className="dot-pulse"></div>
                                            <div className="dot-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {allProducts.length > 0
                                ? allProducts.map(renderProductCard)
                                : !loading
                                    ? <div className="col-12 text-center py-5">
                                        <h4>No products found</h4>
                                        <p className="text-muted">Try adjusting your filters.</p>
                                    </div>
                                    : null
                            }
                        </div>

                        {/* Loading more spinner */}
                        {loadingMore && (
                            <div className="text-center mt-4 py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading more products...</span>
                                </div>
                                <p className="mt-2">Loading more products...</p>
                            </div>
                        )}

                        <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

                        {!hasMore && allProducts.length > 0 && (
                            <div className="text-center mt-4 py-4 border-top">
                                <p className="text-muted">You've reached the end! No more products to show.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
