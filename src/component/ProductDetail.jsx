// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaThumbsUp, FaCheckCircle } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { CartContext } from "../context/CartContext";
// import Header from "./Header";
// import Footer from "./Footer";
// import RecommendationSlider from "./RecommendationSlider";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/ProductDetail.css";
// import Addtocard from "./Addtocard";

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToCart } = useContext(CartContext);

//   const [product, setProduct] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [displayImages, setDisplayImages] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 });
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
//   const [reviewImages, setReviewImages] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [expandedReviews, setExpandedReviews] = useState({});
//   const [likedReviews, setLikedReviews] = useState({});
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [isVariantSlug, setIsVariantSlug] = useState(false);

//   const [filters, setFilters] = useState({
//     shade: "All",
//     rating: "All",
//     sort: "Most Helpful",
//     photosOnly: false,
//   });

//   // ✅ Extract variant query parameter from URL
//   const getVariantFromQuery = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('variant');
//   };

//   // ✅ Update URL when variant is selected
//   const updateUrlForVariant = (variant) => {
//     if (!variant || !product) return;

//     if (variant.slug) {
//       navigate(`/product/${variant.slug}`, { replace: true });
//     } else if (variant.sku) {
//       const productSlug = product.slugs?.[0] || slug;
//       navigate(`/product/${productSlug}?variant=${variant.sku}`, { replace: true });
//     }
//   };

//   // ✅ Fetch Product with variant detection
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         let url = `/api/user/products/${slug}`;
//         const variantParam = getVariantFromQuery();
//         if (variantParam) {
//           url += `?variant=${variantParam}`;
//         }

//         const res = await axiosInstance.get(url);
//         const data = res.data;
//         setProduct(data);

//         const isVariantSlug = data.selectedVariant &&
//           data.selectedVariant.slug === slug;
//         setIsVariantSlug(isVariantSlug);

//         const variantsList = data.variants || [];

//         let defaultVariant = null;

//         if (isVariantSlug && data.selectedVariant) {
//           defaultVariant = data.selectedVariant;
//         } else if (variantParam) {
//           defaultVariant = variantsList.find(
//             v => v.sku === variantParam || v.variantSku === variantParam
//           ) || variantsList[0];
//         } else {
//           defaultVariant = variantsList.find(v => v.stock > 0) || variantsList[0];
//         }

//         if (defaultVariant) {
//           const variantData = {
//             shadeName: defaultVariant.shadeName,
//             hex: defaultVariant.hex,
//             stock: defaultVariant.stock,
//             images: defaultVariant.images || data.images || ["/placeholder.png"],
//             displayPrice: defaultVariant.displayPrice,
//             originalPrice: defaultVariant.originalPrice,
//             variantSku: defaultVariant.sku || defaultVariant.variantSku,
//             sku: defaultVariant.sku || defaultVariant.variantSku,
//             slug: defaultVariant.slug,
//             ...defaultVariant
//           };

//           setSelectedShade(variantData);
//           setDisplayImages(variantData.images);

//           const cache = JSON.parse(
//             localStorage.getItem("cartVariantCache") || "{}"
//           );
//           cache[data._id] = variantData;
//           localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//         } else {
//           setSelectedShade(null);
//           setDisplayImages(data.images || ["/placeholder.png"]);
//         }

//         await fetchReviewSummary(data._id);
//       } catch (err) {
//         console.error("❌ Error fetching product:", err);
//         toast.error("Product not found");
//         navigate("/404");
//       }
//     };

//     fetchProduct();
//   }, [slug, location.search, navigate]);

//   // ✅ Handle variant selection
//   const handleVariantSelect = (variant) => {
//     if (!variant || variant.stock <= 0) return;

//     const variantData = {
//       shadeName: variant.shadeName,
//       hex: variant.hex,
//       stock: variant.stock,
//       images: variant.images || product.images || ["/placeholder.png"],
//       displayPrice: variant.displayPrice || product.price,
//       originalPrice: variant.originalPrice || product.mrp || product.price,
//       variantSku: variant.sku || variant.variantSku,
//       sku: variant.sku || variant.variantSku,
//       slug: variant.slug,
//       ...variant
//     };

//     setSelectedShade(variantData);
//     setDisplayImages(variantData.images);
//     updateUrlForVariant(variantData);
//   };

//   /* ================================================================ */
//   /* REVIEWS SECTION - From First Code                                */
//   /* ================================================================ */

//   // 2. Fetch Reviews from Backend (Filtered)
//   const fetchFilteredReviews = async () => {
//     if (!product?._id) return;
//     try {
//       let query = `?sort=${filters.sort === "Most Helpful" ? "helpful" : "recent"}`;
//       if (filters.rating !== "All") query += `&stars=${filters.rating}`;
//       if (filters.photosOnly) query += `&photosOnly=true`;
//       if (filters.shade !== "All") query += `&shadeName=${encodeURIComponent(filters.shade)}`;

//       const res = await axiosInstance.get(`/api/reviews/product/${product._id}${query}`);
//       setReviews(res.data.reviews || []);

//       // Update Summary logic based on current list
//       if (res.data.reviews?.length > 0) {
//         const avg = res.data.reviews.reduce((sum, r) => sum + r.rating, 0) / res.data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: res.data.reviews.length
//         });
//       }
//     } catch (err) {
//       console.error("Reviews fetch error", err);
//     }
//   };

//   useEffect(() => {
//     if (product?._id) {
//       fetchFilteredReviews();
//     }
//   }, [product?._id, filters]);

//   // 4. Submit Review (Passing variantSku)
//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedShade) return toast.warn("Please select a shade first.");
//     if (!newReview.rating || !newReview.comment) return toast.warn("Rating and comment are required.");

//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("productId", product._id);
//       formData.append("variantSku", selectedShade.sku);
//       formData.append("shadeName", selectedShade.shadeName);
//       formData.append("rating", newReview.rating);
//       formData.append("comment", newReview.comment);
//       reviewImages.forEach((file) => formData.append("images", file));

//       const res = await axiosInstance.post(`/api/reviews/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data.review) {
//         toast.success("✅ Review submitted!");
//         setNewReview({ rating: 0, comment: "" });
//         setReviewImages([]);
//         fetchFilteredReviews();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // 5. Toggle Helpful Vote
//   const handleHelpfulVote = async (reviewId) => {
//     try {
//       const res = await axiosInstance.post(`/api/reviews/${reviewId}/vote-helpful`);

//       // Update local count
//       setReviews(prev => prev.map(r =>
//         r._id === reviewId ? { ...r, helpfulVotes: res.data.helpfulVotes } : r
//       ));

//       setLikedReviews(prev => ({
//         ...prev,
//         [reviewId]: res.data.message === "Vote added"
//       }));

//       toast.info(res.data.message);
//     } catch (err) {
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   /* ================================================================ */
//   /* END OF REVIEWS SECTION                                           */
//   /* ================================================================ */

//   const handleAddToCart = async (prod = product) => {
//     // Keep your existing handleAddToCart code
//     if (!prod) {
//       toast.error("❌ Product not found");
//       return;
//     }

//     if (!selectedShade) {
//       toast.error("❌ Please select a shade/variant first");
//       return;
//     }

//     if (selectedShade.stock <= 0) {
//       toast.error("❌ This variant is out of stock");
//       return;
//     }

//     setAddingToCart(true);
//     try {
//       const success = await addToCart(
//         prod,
//         selectedShade,
//         false
//       );

//       if (success) {
//         toast.success("✅ Product added to cart!");
//         setTimeout(() => navigate("/cartpage"), 100);
//       } else {
//         toast.error("❌ Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       if (error.message === "Authentication required") {
//         toast.error("⚠️ Please log in first");
//         navigate("/login");
//       } else {
//         toast.error("❌ Failed to add product");
//       }
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   // ✅ Fetch review summary
//   const fetchReviewSummary = async (productId) => {
//     try {
//       const res = await axiosInstance.get(
//         `/api/reviews/product/${productId}/top`
//       );
//       const data = res.data;
//       setReviews(data.reviews || []);
//       if (data.reviews?.length > 0) {
//         const avg =
//           data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
//           data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: data.reviews.length,
//         });
//       } else {
//         setReviewSummary({ average: 0, count: 0 });
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching reviews:", err);
//     }
//   };

//   if (!product) return <div className="text-center py-5">Loading...</div>;

//   return (
//     <>
//       <Header />
//       <main className="product-detail-page">
//         <div className="product-detail-container">
//           {/* Product Card Section */}
//           <article className="product-card product-cards gap-4">
//             <div
//               className="product-image-section"
//               style={{ display: "flex", gap: "16px" }}
//             >
//               {/* Thumbnails */}
//               <div
//                 className="thumbnail-list"
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "12px",
//                   maxHeight: "320px",
//                   overflowY: displayImages.length > 5 ? "auto" : "visible",
//                   paddingRight: "4px",
//                 }}
//               >
//                 {displayImages.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`thumbnail-${idx}`}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                       border: "2px solid #ddd",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       const newImages = [...displayImages];
//                       [newImages[0], newImages[idx]] = [
//                         newImages[idx],
//                         newImages[0],
//                       ];
//                       setDisplayImages(newImages);
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Main Image */}
//               <div style={{ flex: 1, textAlign: "center" }}>
//                 <img
//                   src={displayImages?.[0] || "/placeholder.png"}
//                   alt={product.name}
//                   className="product-image"
//                   style={{ maxHeight: "400px" }}
//                 />
//               </div>
//             </div>

//             {/* Info Section */}
//             <div className="product-info-section">
//               <p className="brand-variant">
//                 {/* <strong>Brand:</strong>{" "} */}
//                 {product.brand?.name || product.brand || "Unknown"} {" "}
//                 {/* <strong>Variant:</strong> {product.variant} */}
//               </p>


//               <div className="d-flex align-items-center gap-2">

//                 <h1 className="product-name">{product.name}</h1>
//                 {selectedShade && (
//                   <p
//                     className="shadename mb-2"
//                     style={{
//                       marginTop: "10px",
//                       fontSize: "14px",
//                       color: "#555",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {/* Selected */}
//                     <strong className="fs-5 text-black" style={{fontWeight:'600'}}>{selectedShade.shadeName}</strong>
//                     {isVariantSlug && selectedShade.slug && (
//                       <span style={{ marginLeft: "10px", fontSize: "12px", color: "#666" }}>
//                       </span>
//                     )}
//                   </p>
//                 )}

//               </div>



//               {(product.variants?.length > 0 ||
//                 product.foundationVariants?.length > 0 ||
//                 product.shadeOptions?.length > 0) && (
//                   <div className="option-group">
//                     <span className="option-label">Variants</span>
//                     <div
//                       className="variant-list"
//                       style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
//                     >
//                       {/* First: Show color (hex) variants */}
//                       {(
//                         product.variants ||
//                         product.foundationVariants ||
//                         product.shadeOptions
//                       )
//                         .filter(v => v.hex && v.hex.trim() !== "" && /^#([0-9A-F]{3}){1,2}$/i.test(v.hex))
//                         .map((v, idx) => {
//                           const name = v.shadeName || `Variant-${idx}`;
//                           const color = v.hex;
//                           const stock = v.stock ?? 0;
//                           const displayPrice = v.displayPrice ?? product.price;
//                           const originalPrice =
//                             v.originalPrice ?? product.mrp ?? product.price;
//                           const images = v.images ||
//                             product.images || ["/placeholder.png"];
//                           const variantSku = v.sku || v.variantSku || `sku-${product._id}-${idx}`;
//                           const isSelected = selectedShade?.sku === variantSku;
//                           const variantSlug = v.slug;

//                           return (
//                             <div
//                               key={`color-${idx}`}
//                               style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 position: "relative",
//                               }}
//                             >
//                               <div
//                                 className={`color-circles ${isSelected ? "selected" : ""
//                                   }`}
//                                 style={{
//                                   backgroundColor: color,
//                                   cursor: stock > 0 ? "pointer" : "not-allowed",
//                                   border: isSelected
//                                     ? "2px solid #0077b6"
//                                     : "2px solid #ddd",
//                                   width: "25px",
//                                   height: "25px",
//                                   borderRadius: "20%",
//                                   opacity: 1,
//                                   position: "relative",
//                                 }}
//                                 onClick={() => handleVariantSelect({
//                                   ...v,
//                                   shadeName: name,
//                                   hex: color,
//                                   stock,
//                                   images,
//                                   displayPrice,
//                                   originalPrice,
//                                   variantSku,
//                                   sku: variantSku,
//                                   slug: variantSlug,
//                                 })}
//                               >
//                                 {/* Cross for out-of-stock */}
//                                 {stock <= 0 && (
//                                   <>
//                                     <span
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         transform:
//                                           "translate(-50%, -50%) rotate(45deg)",
//                                         width: "18px",
//                                         height: "2px",
//                                         backgroundColor: "red",
//                                       }}
//                                     />
//                                     <span
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         transform:
//                                           "translate(-50%, -50%) rotate(-45deg)",
//                                         width: "18px",
//                                         height: "2px",
//                                         backgroundColor: "red",
//                                       }}
//                                     />
//                                   </>
//                                 )}
//                               </div>
//                               {/* Shade name tooltip on hover */}
//                               {/* <div className="variant-tooltip" style={{
//                                 fontSize: "10px",
//                                 marginTop: "4px",
//                                 textAlign: "center",
//                                 maxWidth: "40px",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 color: "#555"
//                               }}>
//                                 {name}
//                               </div> */}
//                             </div>
//                           );
//                         })}

//                       {/* Separator if both types exist */}
//                       {(product.variants?.filter(v => v.hex && v.hex.trim() !== "" && /^#([0-9A-F]{3}){1,2}$/i.test(v.hex)).length > 0 &&
//                         product.variants?.filter(v => !v.hex || v.hex.trim() === "" || !/^#([0-9A-F]{3}){1,2}$/i.test(v.hex)).length > 0) && (
//                           <div style={{ width: "100%", height: "0px", backgroundColor: "#eee" }}></div>
//                         )}

//                       {/* Then: Show text variants (no hex or invalid hex) */}
//                       {(
//                         product.variants ||
//                         product.foundationVariants ||
//                         product.shadeOptions
//                       )
//                         .filter(v => !v.hex || v.hex.trim() === "" || !/^#([0-9A-F]{3}){1,2}$/i.test(v.hex))
//                         .map((v, idx) => {
//                           const name = v.shadeName || `Variant-${idx}`;
//                           const color = v.hex;
//                           const stock = v.stock ?? 0;
//                           const displayPrice = v.displayPrice ?? product.price;
//                           const originalPrice =
//                             v.originalPrice ?? product.mrp ?? product.price;
//                           const images = v.images ||
//                             product.images || ["/placeholder.png"];
//                           const variantSku = v.sku || v.variantSku || `sku-${product._id}-${idx}`;
//                           const isSelected = selectedShade?.sku === variantSku;
//                           const variantSlug = v.slug;

//                           return (
//                             <div
//                               key={`text-${idx}`}
//                               style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 position: "relative",
//                               }}
//                             >
//                               <button
//                                 disabled={stock <= 0}
//                                 className={`text-variant ${isSelected ? "selected" : ""}`}
//                                 style={{
//                                   minWidth: "60px",
//                                   padding: "6px 12px",
//                                   border: isSelected
//                                     ? "2px solid #0077b6"
//                                     : "1px solid #ddd",
//                                   borderRadius: "6px",
//                                   cursor: stock > 0 ? "pointer" : "not-allowed",
//                                   backgroundColor:
//                                     stock > 0
//                                       ? isSelected
//                                         ? "#e0f0ff"
//                                         : "#f7f7f7"
//                                       : "#eee",
//                                   position: "relative",
//                                   color: stock > 0 ? "#333" : "#999",
//                                   fontSize: "12px",
//                                   width:'75px',
//                                   fontWeight: isSelected ? "600" : "400",
//                                   transition: "all 0.2s ease",
//                                   whiteSpace: "nowrap",
//                                   boxShadow: isSelected ? "0 0 0 1px #0077b6" : "none",
//                                 }}
//                                 onClick={() => handleVariantSelect({
//                                   ...v,
//                                   shadeName: name,
//                                   hex: color,
//                                   stock,
//                                   images,
//                                   displayPrice,
//                                   originalPrice,
//                                   variantSku,
//                                   sku: variantSku,
//                                   slug: variantSlug,
//                                 })}
//                               >
//                                 {name}
//                                 {stock <= 0 && (
//                                   <>
//                                     <span
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         transform:
//                                           "translate(-50%, -50%) rotate(45deg)",
//                                         width: "18px",
//                                         height: "2px",
//                                         backgroundColor: "red",
//                                       }}
//                                     />
//                                     <span
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         transform:
//                                           "translate(-50%, -50%) rotate(-45deg)",
//                                         width: "18px",
//                                         height: "2px",
//                                         backgroundColor: "red",
//                                       }}
//                                     />
//                                   </>
//                                 )}
//                               </button>
//                             </div>
//                           );
//                         })}
//                     </div>


//                   </div>
//                 )}

//               {/* Avg Rating */}
//               <div className="product-rating mt-2">
//                 {[...Array(5)].map((_, index) => (
//                   <FaStar className="fs-4"
//                     key={index}
//                     color={
//                       index < Math.round(reviewSummary.average)
//                         ? "#ffc107"
//                         : "#e4e5e9"
//                     }
//                   />
//                 ))}
//                 <span className="rating-count">
//                   {reviewSummary.average} / 5 ({reviewSummary.count} review
//                   {reviewSummary.count !== 1 ? "s" : ""})
//                 </span>
//               </div>

//               {/* Price */}
//               <div className="product-price d-flex gap-2">
//                 {selectedShade ? (
//                   Number(selectedShade.displayPrice) <
//                     Number(selectedShade.originalPrice) ? (
//                     <>
//                       <span className="text-success fw-bold">
//                         ₹{selectedShade.displayPrice}
//                       </span>
//                       <del className="text-muted fs-6" style={{ fontSize: '10px', marginTop: '6px' }}>
//                         ₹{selectedShade.originalPrice}
//                       </del>
//                       <span className="discount text-danger fw-bold" style={{ font: '10px', marginTop: '6px' }}>
//                         (
//                         {Math.round(
//                           ((selectedShade.originalPrice -
//                             selectedShade.displayPrice) /
//                             selectedShade.originalPrice) *
//                           100
//                         )}
//                         % OFF)
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-success fw-bold">
//                       ₹{selectedShade.displayPrice}
//                     </span>
//                   )
//                 ) : (
//                   <span className="text-success fw-bold">
//                     Select a shade to see price
//                   </span>
//                 )}
//               </div>

//               {/* <data className="text-start">
//                 {selectedShade?.stock > 0 ? "In Stock" : "Out of Stock"}
//               </data> */}

//               {/* Shade Selector */}


//               {product && (
//                 <Addtocard
//                   prod={product}
//                   selectedShade={selectedShade}
//                   showToastMsg={toast}
//                   onAddToCart={handleAddToCart}
//                 />
//               )}

//               <ToastContainer position="top-right" autoClose={3000} />
//             </div>
//           </article>

//           {/* Product Details + Ratings Section */}
//           <section className="product-extra-section">
//             <div className="">
//               <div className="details-section">
//                 <div className="accordion">
//                   <details>
//                     <summary>Description</summary>
//                     <p className="mt-3">
//                       {product.description || "No description available."}
//                     </p>
//                   </details>
//                   <details>
//                     <summary>Ingredients</summary>
//                     <p className="mt-3">
//                       {product.ingredients || "Ingredients not provided."}
//                     </p>
//                   </details>
//                   <details>
//                     <summary>How To Use</summary>
//                     <p className="mt-3">
//                       {product.howToUse || "Usage instructions not provided."}
//                     </p>
//                   </details>
//                   <details>
//                     <summary>Special Features</summary>
//                     <p className="mt-3">
//                       {product.features || "No special features listed."}
//                     </p>
//                   </details>
//                 </div>
//               </div>
//             </div>




//                             <div className="ratings-section d-lg-flex d-md-block mt-5">
//                 <div className="w-50 d-flex align-items-start justify-content-around" style={{flexDirection:'column'}}>

//                 <div className="rating-score">
//                   <h2>{reviewSummary.average}</h2>
//                   <p>/5</p>
//                 </div>
//                 <div className="stars">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar
//                       key={i}
//                       color={
//                         i < Math.round(reviewSummary.average)
//                           ? "#0077b6"
//                           : "#e4e5e9"
//                       }
//                       size={20}
//                     />
//                   ))}
//                 </div>
//                 <p className="rating-text">
//                   {reviewSummary.average >= 4.5
//                     ? "Excellent"
//                     : reviewSummary.average >= 4
//                       ? "Good"
//                       : reviewSummary.average >= 3
//                         ? "Average"
//                         : "Poor"}
//                 </p>

//                 </div>



//                 <div className="rating-bars w-50">
//                   {["Excellent", "VeryGood", "Average", "Good", "Poor"].map(
//                     (label, idx) => (
//                       <div key={idx} className="bar-row">
//                         <span>{label}</span>
//                         <div className="bar">
//                           <div
//                             className="fill"
//                             style={{
//                               width: `${(Math.random() * 100).toFixed(0)}%`,
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//           </section>

//           {/* ================================================================ */}
//           {/* ================================================================ */}
//           <section className="reviews-section mt-5">
//             <h2 className="mb-4">Customer Reviews</h2>

//             <div className="filter-bar d-flex gap-3 mb-4 flex-wrap">
//               <select
//                 value={filters.shade}
//                 onChange={(e) => setFilters({ ...filters, shade: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Shades</option>
//                 {product.variants?.map(v => (
//                   <option key={v.sku} value={v.shadeName}>{v.shadeName}</option>
//                 ))}
//               </select>

//               <select
//                 value={filters.rating}
//                 onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Ratings</option>
//                 {[5, 4, 3, 2, 1].map(n => (
//                   <option key={n} value={n}>{n} Stars</option>
//                 ))}
//               </select>

//               <select
//                 value={filters.sort}
//                 onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="Most Helpful">Most Helpful</option>
//                 <option value="Newest">Newest</option>
//               </select>

//               <button
//                 className={`btn ${filters.photosOnly ? 'btn-primary' : 'btn-outline-primary'}`}
//                 onClick={() => setFilters({ ...filters, photosOnly: !filters.photosOnly })}
//               >
//                 With Photos
//               </button>

//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={() => setFilters({
//                   shade: "All",
//                   rating: "All",
//                   sort: "Most Helpful",
//                   photosOnly: false,
//                 })}
//               >
//                 Reset
//               </button>
//             </div>

//             <div className="reviews-list">
//               {reviews.map((r) => (
//                 <div key={r._id} className="review-card p-3 border-bottom">
//                   <div className="d-flex justify-content-between">
//                     <div className="d-flex align-items-center gap-2">
//                       <img
//                         src={r.customer?.profileImage || "/default-avatar.png"}
//                         className="rounded-circle"
//                         width="50" height="50"
//                         alt="user"
//                       />
//                       <span className="fw-bold">{r.customer?.name || "Anonymous"}</span>
//                       {r.verifiedPurchase && (
//                         <span className="text-success small">
//                           <FaCheckCircle /> Verified
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-muted small">
//                       {new Date(r.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>

//                   <div className="my-2">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar
//                         key={i}
//                         color={i < r.rating ? "#ffc107" : "#eee"}
//                       />
//                     ))}
//                     <span className="ms-3 text-muted">Shade: {r.shadeName}</span>
//                   </div>

//                   <p>{r.comment}</p>

//                   {r.images?.length > 0 && (
//                     <div className="review-images d-flex gap-2 mb-3">
//                       {r.images.map((img, i) => (
//                         <img
//                           key={i}
//                           src={img}
//                           width="80"
//                           className="rounded border"
//                           alt="review"
//                         />
//                       ))}
//                     </div>
//                   )}

//                   <button
//                     className={`btn btn-sm ${likedReviews[r._id] ? 'btn-primary' : 'btn-outline-secondary'}`}
//                     onClick={() => handleHelpfulVote(r._id)}
//                   >
//                     <FaThumbsUp /> Helpful ({r.helpfulVotes || 0})
//                   </button>
//                 </div>
//               ))}

//               {reviews.length === 0 && (
//                 <div className="text-center py-4">
//                   <p className="text-muted">No reviews yet. Be the first to review this product!</p>
//                 </div>
//               )}
//             </div>

//             {/* Review Form */}
//             <form className="mt-5 p-4 border rounded bg-light" onSubmit={handleReviewSubmit}>
//               <h4 className="mb-3">Write a Review</h4>

//               <div className="mb-3">
//                 <label className="d-block mb-2">Rating</label>
//                 {[1, 2, 3, 4, 5].map(n => (
//                   <FaStar
//                     key={n}
//                     size="24"
//                     style={{ cursor: 'pointer', marginRight: '5px' }}
//                     color={n <= newReview.rating ? "#ffc107" : "#ddd"}
//                     onClick={() => setNewReview({ ...newReview, rating: n })}
//                   />
//                 ))}
//                 <span className="ms-2">{newReview.rating} stars</span>
//               </div>

//               <textarea
//                 className="form-control mb-3 text-black"
//                 placeholder="Share your experience..."
//                 rows="4"
//                 onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                 value={newReview.comment}
//                 required
//               ></textarea>

//               <div className="mb-3">
//                 <label className="form-label">Upload Photos (Optional)</label>
//                 <input
//                   type="file"
//                   multiple
//                   className="form-control"
//                   onChange={(e) => setReviewImages(Array.from(e.target.files))}
//                   accept="image/*"
//                 />
//                 {reviewImages.length > 0 && (
//                   <div className="mt-2">
//                     <small>{reviewImages.length} file(s) selected</small>
//                   </div>
//                 )}
//               </div>

//               <button
//                 className="btn btn-primary"
//                 type="submit"
//                 disabled={submitting || !selectedShade}
//               >
//                 {submitting ? "Submitting..." : "Submit Review"}
//               </button>

//               {!selectedShade && (
//                 <div className="alert alert-warning mt-2">
//                   Please select a shade/variant before submitting your review.
//                 </div>
//               )}
//             </form>
//           </section>
//           {/* ================================================================ */}
//           {/* END OF REVIEWS SECTION                                          */
//           /* ================================================================ */}

//           {/* Recommendations */}
//           <div className="product-detail-container">
//             <section className="recommendations-section">
//               <RecommendationSlider
//                 title="Also Viewed"
//                 products={product.recommendations?.alsoViewed?.products || []}
//               />
//             </section>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;





























// import React, { useState, useEffect, useContext, useMemo } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaThumbsUp, FaCheckCircle } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { CartContext } from "../context/CartContext";
// import Header from "./Header";
// import Footer from "./Footer";
// import RecommendationSlider from "./RecommendationSlider";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/ProductDetail.css";
// import Addtocard from "./Addtocard";

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToCart } = useContext(CartContext);

//   const [product, setProduct] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [displayImages, setDisplayImages] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 });
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
//   const [reviewImages, setReviewImages] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [expandedReviews, setExpandedReviews] = useState({});
//   const [likedReviews, setLikedReviews] = useState({});
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [isVariantSlug, setIsVariantSlug] = useState(false);

//   const [filters, setFilters] = useState({
//     shade: "All",
//     rating: "All",
//     sort: "Most Helpful",
//     photosOnly: false,
//   });

//   // New state to toggle review form visibility
//   const [showReviewForm, setShowReviewForm] = useState(false);

//   // ✅ Extract variant query parameter from URL
//   const getVariantFromQuery = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('variant');
//   };

//   // ✅ Update URL when variant is selected
//   const updateUrlForVariant = (variant) => {
//     if (!variant || !product) return;

//     if (variant.slug) {
//       navigate(`/product/${variant.slug}`, { replace: true });
//     } else if (variant.sku) {
//       const productSlug = product.slugs?.[0] || slug;
//       navigate(`/product/${productSlug}?variant=${variant.sku}`, { replace: true });
//     }
//   };

//   // ✅ Fetch Product with variant detection
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         let url = `/api/user/products/${slug}`;
//         const variantParam = getVariantFromQuery();
//         if (variantParam) {
//           url += `?variant=${variantParam}`;
//         }

//         const res = await axiosInstance.get(url);
//         const data = res.data;
//         setProduct(data);

//         const isVariantSlug = data.selectedVariant &&
//           data.selectedVariant.slug === slug;
//         setIsVariantSlug(isVariantSlug);

//         const variantsList = data.variants || [];

//         let defaultVariant = null;

//         if (isVariantSlug && data.selectedVariant) {
//           defaultVariant = data.selectedVariant;
//         } else if (variantParam) {
//           defaultVariant = variantsList.find(
//             v => v.sku === variantParam || v.variantSku === variantParam
//           ) || variantsList[0];
//         } else {
//           defaultVariant = variantsList.find(v => v.stock > 0) || variantsList[0];
//         }

//         if (defaultVariant) {
//           const variantData = {
//             shadeName: defaultVariant.shadeName,
//             hex: defaultVariant.hex,
//             stock: defaultVariant.stock,
//             images: defaultVariant.images || data.images || ["/placeholder.png"],
//             displayPrice: defaultVariant.displayPrice,
//             originalPrice: defaultVariant.originalPrice,
//             variantSku: defaultVariant.sku || defaultVariant.variantSku,
//             sku: defaultVariant.sku || defaultVariant.variantSku,
//             slug: defaultVariant.slug,
//             ...defaultVariant
//           };

//           setSelectedShade(variantData);
//           setDisplayImages(variantData.images);

//           const cache = JSON.parse(
//             localStorage.getItem("cartVariantCache") || "{}"
//           );
//           cache[data._id] = variantData;
//           localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//         } else {
//           setSelectedShade(null);
//           setDisplayImages(data.images || ["/placeholder.png"]);
//         }

//         await fetchReviewSummary(data._id);
//       } catch (err) {
//         console.error("❌ Error fetching product:", err);
//         toast.error("Product not found");
//         navigate("/404");
//       }
//     };

//     fetchProduct();
//   }, [slug, location.search, navigate]);

//   // ✅ Handle variant selection
//   const handleVariantSelect = (variant) => {
//     if (!variant || variant.stock <= 0) return;

//     const variantData = {
//       shadeName: variant.shadeName,
//       hex: variant.hex,
//       stock: variant.stock,
//       images: variant.images || product.images || ["/placeholder.png"],
//       displayPrice: variant.displayPrice || product.price,
//       originalPrice: variant.originalPrice || product.mrp || product.price,
//       variantSku: variant.sku || variant.variantSku,
//       sku: variant.sku || variant.variantSku,
//       slug: variant.slug,
//       ...variant
//     };

//     setSelectedShade(variantData);
//     setDisplayImages(variantData.images);
//     updateUrlForVariant(variantData);
//   };

//   /* ================================================================ */
//   /* REVIEWS SECTION                                                  */
//   /* ================================================================ */

//   const fetchFilteredReviews = async () => {
//     if (!product?._id) return;
//     try {
//       let query = `?sort=${filters.sort === "Most Helpful" ? "helpful" : "recent"}`;
//       if (filters.rating !== "All") query += `&stars=${filters.rating}`;
//       if (filters.photosOnly) query += `&photosOnly=true`;
//       if (filters.shade !== "All") query += `&shadeName=${encodeURIComponent(filters.shade)}`;

//       const res = await axiosInstance.get(`/api/reviews/product/${product._id}${query}`);
//       setReviews(res.data.reviews || []);

//       if (res.data.reviews?.length > 0) {
//         const avg = res.data.reviews.reduce((sum, r) => sum + r.rating, 0) / res.data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: res.data.reviews.length
//         });
//       }
//     } catch (err) {
//       console.error("Reviews fetch error", err);
//     }
//   };

//   useEffect(() => {
//     if (product?._id) {
//       fetchFilteredReviews();
//     }
//   }, [product?._id, filters]);

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedShade) return toast.warn("Please select a shade first.");
//     if (!newReview.rating || !newReview.comment) return toast.warn("Rating and comment are required.");

//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("productId", product._id);
//       formData.append("variantSku", selectedShade.sku);
//       formData.append("shadeName", selectedShade.shadeName);
//       formData.append("rating", newReview.rating);
//       formData.append("comment", newReview.comment);
//       reviewImages.forEach((file) => formData.append("images", file));

//       const res = await axiosInstance.post(`/api/reviews/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data.review) {
//         toast.success("✅ Review submitted!");
//         setNewReview({ rating: 0, comment: "" });
//         setReviewImages([]);
//         fetchFilteredReviews();
//         setShowReviewForm(false); // Hide form after successful submission
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleHelpfulVote = async (reviewId) => {
//     try {
//       const res = await axiosInstance.post(`/api/reviews/${reviewId}/vote-helpful`);

//       setReviews(prev => prev.map(r =>
//         r._id === reviewId ? { ...r, helpfulVotes: res.data.helpfulVotes } : r
//       ));

//       setLikedReviews(prev => ({
//         ...prev,
//         [reviewId]: res.data.message === "Vote added"
//       }));

//       toast.info(res.data.message);
//     } catch (err) {
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   const handleAddToCart = async (prod = product) => {
//     if (!prod) {
//       toast.error("❌ Product not found");
//       return;
//     }

//     if (!selectedShade) {
//       toast.error("❌ Please select a shade/variant first");
//       return;
//     }

//     if (selectedShade.stock <= 0) {
//       toast.error("❌ This variant is out of stock");
//       return;
//     }

//     setAddingToCart(true);
//     try {
//       const success = await addToCart(
//         prod,
//         selectedShade,
//         false
//       );

//       if (success) {
//         toast.success("✅ Product added to cart!");
//         setTimeout(() => navigate("/cartpage"), 100);
//       } else {
//         toast.error("❌ Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       if (error.message === "Authentication required") {
//         toast.error("⚠️ Please log in first");
//         navigate("/login");
//       } else {
//         toast.error("❌ Failed to add product");
//       }
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const fetchReviewSummary = async (productId) => {
//     try {
//       const res = await axiosInstance.get(
//         `/api/reviews/product/${productId}/top`
//       );
//       const data = res.data;
//       setReviews(data.reviews || []);
//       if (data.reviews?.length > 0) {
//         const avg =
//           data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
//           data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: data.reviews.length,
//         });
//       } else {
//         setReviewSummary({ average: 0, count: 0 });
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching reviews:", err);
//     }
//   };

//   if (!product) return <div className="text-center py-5">Loading...</div>;

//   return (
//     <>
//       <Header />
//       <main className="product-detail-page">
//         <div className="product-detail-container">
//           {/* Product Card Section */}
//           <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4">
//             <div
//               className="product-image-section"
//               style={{ display: "flex", gap: "16px" }}
//             >
//               {/* Thumbnails */}
//               <div
//                 className="thumbnail-list"
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "12px",
//                   maxHeight: "320px",
//                   overflowY: displayImages.length > 5 ? "auto" : "visible",
//                   paddingRight: "4px",
//                 }}
//               >
//                 {displayImages.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`thumbnail-${idx}`}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                       border: "2px solid #ddd",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       const newImages = [...displayImages];
//                       [newImages[0], newImages[idx]] = [
//                         newImages[idx],
//                         newImages[0],
//                       ];
//                       setDisplayImages(newImages);
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Main Image */}
//               <div style={{ flex: 1, textAlign: "center" }}>
//                 <img
//                   src={displayImages?.[0] || "/placeholder.png"}
//                   alt={product.name}
//                   className="product-image"
//                   style={{ maxHeight: "400px" }}
//                 />
//               </div>
//             </div>

//             {/* Info Section */}
//             <div className="product-info-section">
//               <p className="brand-variant">
//                 {product.brand?.name || product.brand || "Unknown"} {" "}
//               </p>

//               <div className="d-flex flex-wrap gap-2">
//                 <h1 className="product-name fs-4">{product.name}  
//                   {selectedShade && (
//                   <p
//                     className="shadename mb-2"
//                     style={{
//                       marginTop: "-3px",
//                       fontSize: "14px",
//                       color: "#555",
//                       fontWeight: "500",
//                     }}
//                   >
//                     <strong className="fs-4 text-black" style={{fontWeight: '600' }}>{selectedShade.shadeName}</strong>
//                   </p>
//                 )}
//                 </h1>
                
//               </div>

//               {(product.variants?.length > 0 ||
//                 product.foundationVariants?.length > 0 ||
//                 product.shadeOptions?.length > 0) && (
//                   <div className="option-group">
//                     <span className="option-label fs-6 m-0 p-0">Variants</span>

//                     {/* ================= COLOR (HEX) VARIANTS ================= */}
//                     {(
//                       product.variants ||
//                       product.foundationVariants ||
//                       product.shadeOptions
//                     ).some(
//                       v => v.hex && v.hex.trim() !== "" && /^#([0-9A-F]{3}){1,2}$/i.test(v.hex)
//                     ) && (
//                         <div className="">
//                           {/* <p className="fw-semibold mb-2">Color</p> */}
//                           <div className="variant-list d-flex gap-2 flex-wrap">
//                             {(
//                               product.variants ||
//                               product.foundationVariants ||
//                               product.shadeOptions
//                             )
//                               .filter(
//                                 v =>
//                                   v.hex &&
//                                   v.hex.trim() !== "" &&
//                                   /^#([0-9A-F]{3}){1,2}$/i.test(v.hex)
//                               )
//                               .map((v, idx) => {
//                                 const name = v.shadeName || `Variant-${idx}`;
//                                 const stock = v.stock ?? 0;
//                                 const images =
//                                   v.images || product.images || ["/placeholder.png"];
//                                 const variantSku =
//                                   v.sku || v.variantSku || `sku-${product._id}-${idx}`;
//                                 const isSelected = selectedShade?.sku === variantSku;

//                                 return (
//                                   <div key={`color-${idx}`} className="text-center">
//                                     <div
//                                       className={`color-circles ${isSelected ? "selected" : ""}`}
//                                       style={{
//                                         backgroundColor: v.hex,
//                                         width: "26px",
//                                         height: "26px",
//                                         borderRadius: "20%",
//                                         cursor: stock > 0 ? "pointer" : "not-allowed",
//                                         border: isSelected
//                                           ? "2px solid #0077b6"
//                                           : "2px solid #ddd",
//                                         position: "relative",
//                                       }}
//                                       onClick={() =>
//                                         stock > 0 &&
//                                         handleVariantSelect({
//                                           ...v,
//                                           shadeName: name,
//                                           stock,
//                                           images,
//                                           variantSku,
//                                           sku: variantSku,
//                                           slug: v.slug,
//                                         })
//                                       }
//                                     >
//                                       {stock <= 0 && (
//                                         <>
//                                           <span className="variant-cross" />
//                                           <span className="variant-cross reverse" />
//                                         </>
//                                       )}
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                           </div>
//                         </div>
//                       )}

//                     {/* ================= TEXT VARIANTS ================= */}
//                     {(
//                       product.variants ||
//                       product.foundationVariants ||
//                       product.shadeOptions
//                     ).some(
//                       v => !v.hex || v.hex.trim() === "" || !/^#([0-9A-F]{3}){1,2}$/i.test(v.hex)
//                     ) && (
//                         <div>
//                           {/* <p className="fw-semibold mb-2">Type</p> */}
//                           <div className="variant-list d-flex gap-2 flex-wrap">
//                             {(
//                               product.variants ||
//                               product.foundationVariants ||
//                               product.shadeOptions
//                             )
//                               .filter(
//                                 v =>
//                                   !v.hex ||
//                                   v.hex.trim() === "" ||
//                                   !/^#([0-9A-F]{3}){1,2}$/i.test(v.hex)
//                               )
//                               .map((v, idx) => {
//                                 const name = v.shadeName || `Variant-${idx}`;
//                                 const stock = v.stock ?? 0;
//                                 const images =
//                                   v.images || product.images || ["/placeholder.png"];
//                                 const variantSku =
//                                   v.sku || v.variantSku || `sku-${product._id}-${idx}`;
//                                 const isSelected = selectedShade?.sku === variantSku;

//                                 return (
//                                   <button
//                                     key={`text-${idx}`}
//                                     disabled={stock <= 0}
//                                     className={`text-variant ${isSelected ? "selected" : ""}`}
//                                     style={{
//                                       minWidth: "75px",
//                                       padding: "6px 12px",
//                                       borderRadius: "6px",
//                                       border: isSelected
//                                         ? "2px solid #0077b6"
//                                         : "1px solid #ddd",
//                                       backgroundColor:
//                                         stock > 0
//                                           ? isSelected
//                                             ? "#e0f0ff"
//                                             : "#f7f7f7"
//                                           : "#eee",
//                                       cursor: stock > 0 ? "pointer" : "not-allowed",
//                                       fontSize: "12px",
//                                       fontWeight: isSelected ? 600 : 400,
//                                     }}
//                                     onClick={() =>
//                                       stock > 0 &&
//                                       handleVariantSelect({
//                                         ...v,
//                                         shadeName: name,
//                                         stock,
//                                         images,
//                                         variantSku,
//                                         sku: variantSku,
//                                         slug: v.slug,
//                                       })
//                                     }
//                                   >
//                                     {name}
//                                   </button>
//                                 );
//                               })}
//                           </div>
//                         </div>
//                       )}
//                   </div>
//                 )}


//               {/* Avg Rating */}
//               <div className="product-rating mt-2">
//                 {[...Array(5)].map((_, index) => (
//                   <FaStar className="fs-4"
//                     key={index}
//                     color={
//                       index < Math.round(reviewSummary.average)
//                         ? "#ffc107"
//                         : "#e4e5e9"
//                     }
//                   />
//                 ))}
//                 <span className="rating-count">
//                   {reviewSummary.average} / 5 ({reviewSummary.count} review
//                   {reviewSummary.count !== 1 ? "s" : ""})
//                 </span>
//               </div>

//               {/* Price */}
//               <div className="product-price d-flex gap-2">
//                 {selectedShade ? (
//                   Number(selectedShade.displayPrice) <
//                     Number(selectedShade.originalPrice) ? (
//                     <>
//                       <span className="text-success fw-bold">
//                         ₹{selectedShade.displayPrice}
//                       </span>
//                       <del className="text-muted fs-6" style={{ fontSize: '10px', marginTop: '6px' }}>
//                         ₹{selectedShade.originalPrice}
//                       </del>
//                       <span className="discount text-danger fw-bold" style={{ font: '10px', marginTop: '6px' }}>
//                         (
//                         {Math.round(
//                           ((selectedShade.originalPrice -
//                             selectedShade.displayPrice) /
//                             selectedShade.originalPrice) *
//                           100
//                         )}
//                         % OFF)
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-success fw-bold">
//                       ₹{selectedShade.displayPrice}
//                     </span>
//                   )
//                 ) : (
//                   <span className="text-success fw-bold">
//                     Select a shade to see price
//                   </span>
//                 )}
//               </div>

//               {product && (
//                 <Addtocard
//                   prod={product}
//                   selectedShade={selectedShade}
//                   showToastMsg={toast}
//                   onAddToCart={handleAddToCart}
//                 />
//               )}

//               <ToastContainer position="top-right" autoClose={3000} />
//             </div>
//           </article>

//           {/* Product Details + Ratings Section */}
//           <section className="product-extra-section">
//             <div className="">
//               <div className="details-section">
//                 <div className="accordion">
//                   <details>
//                     <summary>Description</summary>
//                     <p className="mt-3">
//                       {product.description || "No description available."}
//                     </p>
//                   </details>
//                   <details>
//                     <summary>Ingredients</summary>
//                     <p className="mt-3">
//                       {product.ingredients || "Ingredients not provided."}
//                     </p>
//                   </details>
//                   <details>
//                     <summary>How To Use</summary>
//                     <p className="mt-3">
//                       {product.howToUse || "Usage instructions not provided."}
//                     </p>
//                   </details>
//                   <details>
//                     <summary>Special Features</summary>
//                     <p className="mt-3">
//                       {product.features || "No special features listed."}
//                     </p>
//                   </details>
//                 </div>
//               </div>
//             </div>

//             <div className="ratings-section d-lg-flex d-md-block mt-5">
//               <div className="w-100 d-flex align-items-start justify-content-around" style={{ flexDirection: 'column' }}>
//                 <div className="rating-score">
//                   <h2>{reviewSummary.average}</h2>
//                   <p>/5</p>
//                 </div>
//                 <div className="stars">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar
//                       key={i}
//                       color={
//                         i < Math.round(reviewSummary.average)
//                           ? "#0077b6"
//                           : "#e4e5e9"
//                       }
//                       size={20}
//                     />
//                   ))}
//                 </div>
//                 <p className="rating-text">
//                   {reviewSummary.average >= 4.5
//                     ? "Excellent"
//                     : reviewSummary.average >= 4
//                       ? "Good"
//                       : reviewSummary.average >= 3
//                         ? "Average"
//                         : "Poor"}
//                 </p>

//                 <div className="mb-4 pt-4 w-100 d-flex">
//                   <button
//                     className="btn btn-primary mb-3 write-button-width"
//                     onClick={() => setShowReviewForm(!showReviewForm)}
//                   >
//                     Write a Review
//                   </button>
//                 </div>
//               </div>







//               <div className="rating-bars w-50 mt-4">
//                 {["Excellent", "VeryGood", "Average", "Good", "Poor"].map(
//                   (label, idx) => (
//                     <div key={idx} className="bar-row">
//                       <span>{label}</span>
//                       <div className="bar">
//                         <div
//                           className="fill"
//                           style={{
//                             width: `${(Math.random() * 100).toFixed(0)}%`,
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* Reviews Section */}
//           <section className="reviews-section mt-5">
//             <h2 className="mb-4">Customer Reviews</h2>

//             <div className="filter-bar d-flex gap-3 mb-4 flex-wrap">
//               <select
//                 value={filters.shade}
//                 onChange={(e) => setFilters({ ...filters, shade: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Shades</option>
//                 {product.variants?.map(v => (
//                   <option key={v.sku} value={v.shadeName}>{v.shadeName}</option>
//                 ))}
//               </select>

//               <select
//                 value={filters.rating}
//                 onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Ratings</option>
//                 {[5, 4, 3, 2, 1].map(n => (
//                   <option key={n} value={n}>{n} Stars</option>
//                 ))}
//               </select>

//               <select
//                 value={filters.sort}
//                 onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="Most Helpful">Most Helpful</option>
//                 <option value="Newest">Newest</option>
//               </select>

//               <button
//                 className={`btn ${filters.photosOnly ? 'btn-primary' : 'btn-outline-primary'}`}
//                 onClick={() => setFilters({ ...filters, photosOnly: !filters.photosOnly })}
//               >
//                 With Photos
//               </button>

//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={() => setFilters({
//                   shade: "All",
//                   rating: "All",
//                   sort: "Most Helpful",
//                   photosOnly: false,
//                 })}
//               >
//                 Reset
//               </button>
//             </div>

//             <div className="reviews-list">
//               {reviews.map((r) => (
//                 <div key={r._id} className="review-card p-3 border-bottom">
//                   <div className="d-flex justify-content-between">
//                     <div className="d-flex align-items-center gap-2">
//                       <img
//                         src={r.customer?.profileImage || "/default-avatar.png"}
//                         className="rounded-circle"
//                         width="50" height="50"
//                         alt="user"
//                       />
//                       <span className="fw-bold">{r.customer?.name || "Anonymous"}</span>
//                       {r.verifiedPurchase && (
//                         <span className="text-success small">
//                           <FaCheckCircle /> Verified
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-muted small">
//                       {new Date(r.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>

//                   <div className="my-2">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar
//                         key={i}
//                         color={i < r.rating ? "#ffc107" : "#eee"}
//                       />
//                     ))}
//                     <span className="ms-3 text-muted">Shade: {r.shadeName}</span>
//                   </div>

//                   <p>{r.comment}</p>

//                   {r.images?.length > 0 && (
//                     <div className="review-images d-flex gap-2 mb-3">
//                       {r.images.map((img, i) => (
//                         <img
//                           key={i}
//                           src={img}
//                           width="80"
//                           className="rounded border"
//                           alt="review"
//                         />
//                       ))}
//                     </div>
//                   )}

//                   <button
//                     className={`btn btn-sm ${likedReviews[r._id] ? 'btn-primary' : 'btn-outline-secondary'}`}
//                     onClick={() => handleHelpfulVote(r._id)}
//                   >
//                     <FaThumbsUp /> Helpful ({r.helpfulVotes || 0})
//                   </button>
//                 </div>
//               ))}

//               {reviews.length === 0 && (
//                 <div className="text-center py-4">
//                   <p className="text-muted">No reviews yet. Be the first to review this product!</p>
//                 </div>
//               )}
//             </div>

//             {/* Toggle Button + Conditional Review Form */}
//             <div>

//               {showReviewForm && (
//                 <form className="p-4 border rounded bg-light" onSubmit={handleReviewSubmit}>
//                   <h4 className="mb-3">Write a Review</h4>

//                   <div className="mb-3">
//                     <label className="d-block mb-2">Rating</label>
//                     {[1, 2, 3, 4, 5].map(n => (
//                       <FaStar
//                         key={n}
//                         size="24"
//                         style={{ cursor: 'pointer', marginRight: '5px' }}
//                         color={n <= newReview.rating ? "#ffc107" : "#ddd"}
//                         onClick={() => setNewReview({ ...newReview, rating: n })}
//                       />
//                     ))}
//                     <span className="ms-2">{newReview.rating} stars</span>
//                   </div>

//                   <textarea
//                     className="form-control mb-3 text-black"
//                     placeholder="Share your experience..."
//                     rows="4"
//                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                     value={newReview.comment}
//                     required
//                   ></textarea>

//                   <div className="mb-3">
//                     <label className="form-label">Upload Photos (Optional)</label>
//                     <input
//                       type="file"
//                       multiple
//                       className="form-control"
//                       onChange={(e) => setReviewImages(Array.from(e.target.files))}
//                       accept="image/*"
//                     />
//                     {reviewImages.length > 0 && (
//                       <div className="mt-2">
//                         <small>{reviewImages.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     className="btn btn-primary"
//                     type="submit"
//                     disabled={submitting || !selectedShade}
//                   >
//                     {submitting ? "Submitting..." : "Submit Review"}
//                   </button>

//                   {!selectedShade && (
//                     <div className="alert alert-warning mt-2">
//                       Please select a shade/variant before submitting your review.
//                     </div>
//                   )}
//                 </form>
//               )}
//             </div>
//           </section>

//           {/* Recommendations */}
//           <div className="product-detail-container">
//             <section className="recommendations-section">
//               <RecommendationSlider
//                 title="Also Viewed"
//                 products={product.recommendations?.alsoViewed?.products || []}
//               />
//             </section>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;











// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaThumbsUp, FaCheckCircle, FaHeart, FaRegHeart } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import Header from "./Header";
// import Footer from "./Footer";
// import RecommendationSlider from "./RecommendationSlider";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/ProductDetail.css";
// import Addtocard from "./Addtocard";

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const [product, setProduct] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [displayImages, setDisplayImages] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 });
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
//   const [reviewImages, setReviewImages] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [likedReviews, setLikedReviews] = useState({});
//   const [addingToCart, setAddingToCart] = useState(false);

//   // ✅ Wishlist States (Updated for backend compatibility)
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]); // Store full wishlist data

//   const [filters, setFilters] = useState({
//     shade: "All",
//     rating: "All",
//     sort: "Most Helpful",
//     photosOnly: false,
//   });

//   const [showReviewForm, setShowReviewForm] = useState(false);

//   // ===================== WISHLIST FUNCTIONS (Updated for Backend) =====================

//   // ✅ Check if current product (with selected SKU) is in wishlist
//   const checkWishlistStatus = async () => {
//     if (!product || !selectedShade) return false;
    
//     try {
//       if (user && !user.guest) {
//         // For logged-in users: Check via API
//         const response = await axiosInstance.get(`/api/user/wishlist/check/${product._id}`);
//         return response.data.isInWishlist || false;
//       } else {
//         // For guests: Check localStorage
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         return guestWishlist.some(item => 
//           item._id === product._id && item.sku === selectedShade.sku
//         );
//       }
//     } catch (error) {
//       console.error("Error checking wishlist status:", error);
//       return false;
//     }
//   };

//   // ✅ Fetch full wishlist data
//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get("/api/user/wishlist");
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         setWishlistData(localWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   // ✅ Toggle wishlist function (Updated for backend requirements)
//   const toggleWishlist = async () => {
//     if (!product || !selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }

//     setWishlistLoading(true);
//     try {
//       const productId = product._id;
//       const sku = selectedShade.sku;

//       if (user && !user.guest) {
//         // 🟢 Logged-in user - Backend API call
//         if (isInWishlist) {
//           // Remove from wishlist - Send SKU in request body
//           await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
//             data: { sku: sku }
//           });
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           // Add to wishlist - Send SKU in request body
//           await axiosInstance.post(`/api/user/wishlist/${productId}`, { sku: sku });
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }
//       } else {
//         // 🟢 Guest user - LocalStorage
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         const existingIndex = guestWishlist.findIndex(item => 
//           item._id === productId && item.sku === sku
//         );

//         if (existingIndex >= 0) {
//           // Remove from wishlist
//           guestWishlist.splice(existingIndex, 1);
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           // Add to wishlist with complete product data
//           const productData = {
//             _id: productId,
//             name: product.name,
//             brand: product.brand?.name || product.brand || "Unknown",
//             price: selectedShade.displayPrice || product.price || 0,
//             originalPrice: selectedShade.originalPrice || product.mrp || product.price || 0,
//             mrp: selectedShade.originalPrice || product.mrp || product.price || 0,
//             displayPrice: selectedShade.displayPrice || product.price || 0,
//             images: displayImages || product.images || ["/placeholder.png"],
//             image: displayImages?.[0] || product.images?.[0] || "/placeholder.png",
//             slug: product.slugs?.[0] || slug,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: selectedShade.shadeName || selectedShade.name || "Default",
//             shadeName: selectedShade.shadeName || selectedShade.name || "Default",
//             variant: selectedShade.shadeName || selectedShade.name || "Default",
//             hex: selectedShade.hex || "#cccccc",
//             stock: selectedShade.stock || 0,
//             status: selectedShade.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: reviewSummary.average || 0,
//             totalRatings: reviewSummary.count || 0,
//             commentsCount: reviewSummary.count || 0,
//             discountPercent: selectedShade.originalPrice > selectedShade.displayPrice 
//               ? Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }

//         localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//         setWishlistData(guestWishlist);
//       }

//       // Update wishlist data
//       await fetchWishlistData();
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   // ✅ Update wishlist status when product or selectedShade changes
//   useEffect(() => {
//     const updateWishlistStatus = async () => {
//       if (product && selectedShade) {
//         const status = await checkWishlistStatus();
//         setIsInWishlist(status);
//       }
//     };
//     updateWishlistStatus();
//   }, [product, selectedShade, user]);

//   // ✅ Initial fetch of wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // ===================== END WISHLIST FUNCTIONS =====================

//   // ✅ Extract variant query parameter from URL
//   const getVariantFromQuery = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('variant');
//   };

//   // ✅ Update URL when variant is selected
//   const updateUrlForVariant = (variant) => {
//     if (!variant || !product) return;
//     if (variant.slug) {
//       navigate(`/product/${variant.slug}`, { replace: true });
//     } else if (variant.sku) {
//       const productSlug = product.slugs?.[0] || slug;
//       navigate(`/product/${productSlug}?variant=${variant.sku}`, { replace: true });
//     }
//   };

//   // ✅ Fetch Product with variant detection
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         let url = `/api/user/products/${slug}`;
//         const variantParam = getVariantFromQuery();
//         if (variantParam) {
//           url += `?variant=${variantParam}`;
//         }

//         const res = await axiosInstance.get(url);
//         const data = res.data;
//         setProduct(data);

//         const isVariantSlug = data.selectedVariant && data.selectedVariant.slug === slug;

//         const variantsList = data.variants || [];
//         let defaultVariant = null;

//         if (isVariantSlug && data.selectedVariant) {
//           defaultVariant = data.selectedVariant;
//         } else if (variantParam) {
//           defaultVariant = variantsList.find(
//             v => v.sku === variantParam || v.variantSku === variantParam
//           ) || variantsList[0];
//         } else {
//           defaultVariant = variantsList.find(v => v.stock > 0) || variantsList[0];
//         }

//         if (defaultVariant) {
//           const variantData = {
//             shadeName: defaultVariant.shadeName,
//             hex: defaultVariant.hex,
//             stock: defaultVariant.stock,
//             images: defaultVariant.images || data.images || ["/placeholder.png"],
//             displayPrice: defaultVariant.displayPrice,
//             originalPrice: defaultVariant.originalPrice,
//             variantSku: defaultVariant.sku || defaultVariant.variantSku,
//             sku: defaultVariant.sku || defaultVariant.variantSku,
//             slug: defaultVariant.slug,
//             ...defaultVariant
//           };

//           setSelectedShade(variantData);
//           setDisplayImages(variantData.images);
//         } else {
//           setSelectedShade(null);
//           setDisplayImages(data.images || ["/placeholder.png"]);
//         }

//         await fetchReviewSummary(data._id);
//       } catch (err) {
//         console.error("❌ Error fetching product:", err);
//         toast.error("Product not found");
//         navigate("/404");
//       }
//     };

//     fetchProduct();
//   }, [slug, location.search, navigate]);

//   // ✅ Handle variant selection
//   const handleVariantSelect = (variant) => {
//     if (!variant || variant.stock <= 0) return;

//     const variantData = {
//       shadeName: variant.shadeName,
//       hex: variant.hex,
//       stock: variant.stock,
//       images: variant.images || product.images || ["/placeholder.png"],
//       displayPrice: variant.displayPrice || product.price,
//       originalPrice: variant.originalPrice || product.mrp || product.price,
//       variantSku: variant.sku || variant.variantSku,
//       sku: variant.sku || variant.variantSku,
//       slug: variant.slug,
//       ...variant
//     };

//     setSelectedShade(variantData);
//     setDisplayImages(variantData.images);
//     updateUrlForVariant(variantData);
//   };

//   // ===================== REVIEWS SECTION =====================

//   const fetchFilteredReviews = async () => {
//     if (!product?._id) return;
//     try {
//       let query = `?sort=${filters.sort === "Most Helpful" ? "helpful" : "recent"}`;
//       if (filters.rating !== "All") query += `&stars=${filters.rating}`;
//       if (filters.photosOnly) query += `&photosOnly=true`;
//       if (filters.shade !== "All") query += `&shadeName=${encodeURIComponent(filters.shade)}`;

//       const res = await axiosInstance.get(`/api/reviews/product/${product._id}${query}`);
//       setReviews(res.data.reviews || []);

//       if (res.data.reviews?.length > 0) {
//         const avg = res.data.reviews.reduce((sum, r) => sum + r.rating, 0) / res.data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: res.data.reviews.length
//         });
//       }
//     } catch (err) {
//       console.error("Reviews fetch error", err);
//     }
//   };

//   useEffect(() => {
//     if (product?._id) {
//       fetchFilteredReviews();
//     }
//   }, [product?._id, filters]);

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedShade) return toast.warn("Please select a variant first.");
//     if (!newReview.rating || !newReview.comment) return toast.warn("Rating and comment are required.");

//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("productId", product._id);
//       formData.append("variantSku", selectedShade.sku);
//       formData.append("shadeName", selectedShade.shadeName);
//       formData.append("rating", newReview.rating);
//       formData.append("comment", newReview.comment);
//       reviewImages.forEach((file) => formData.append("images", file));

//       const res = await axiosInstance.post(`/api/reviews/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data.review) {
//         toast.success("✅ Review submitted!");
//         setNewReview({ rating: 0, comment: "" });
//         setReviewImages([]);
//         fetchFilteredReviews();
//         setShowReviewForm(false);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleHelpfulVote = async (reviewId) => {
//     try {
//       const res = await axiosInstance.post(`/api/reviews/${reviewId}/vote-helpful`);

//       setReviews(prev => prev.map(r =>
//         r._id === reviewId ? { ...r, helpfulVotes: res.data.helpfulVotes } : r
//       ));

//       setLikedReviews(prev => ({
//         ...prev,
//         [reviewId]: res.data.message === "Vote added"
//       }));

//       toast.info(res.data.message);
//     } catch (err) {
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!product) {
//       toast.error("❌ Product not found");
//       return;
//     }

//     if (!selectedShade) {
//       toast.error("❌ Please select a variant first");
//       return;
//     }

//     if (selectedShade.stock <= 0) {
//       toast.error("❌ This variant is out of stock");
//       return;
//     }

//     setAddingToCart(true);
//     try {
//       const success = await addToCart(product, selectedShade, false);
//       if (success) {
//         toast.success("✅ Added to cart!");
//         setTimeout(() => navigate("/cartpage"), 1000);
//       } else {
//         toast.error("❌ Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       if (error.message === "Authentication required") {
//         toast.error("⚠️ Please log in first");
//         navigate("/login");
//       } else {
//         toast.error("❌ Failed to add product");
//       }
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const fetchReviewSummary = async (productId) => {
//     try {
//       const res = await axiosInstance.get(`/api/reviews/product/${productId}/top`);
//       const data = res.data;
//       setReviews(data.reviews || []);
//       if (data.reviews?.length > 0) {
//         const avg = data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: data.reviews.length,
//         });
//       } else {
//         setReviewSummary({ average: 0, count: 0 });
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching reviews:", err);
//     }
//   };

//   if (!product) return <div className="text-center py-5">Loading...</div>;

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <main className="product-detail-page">
//         <div className="product-detail-container">
//           {/* Product Card Section */}
//           <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4">
//             <div className="product-image-section" style={{ display: "flex", gap: "16px" }}>
//               {/* Thumbnails */}
//               <div className="thumbnail-list" style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 maxHeight: "320px",
//                 overflowY: displayImages.length > 5 ? "auto" : "visible",
//                 paddingRight: "4px",
//               }}>
//                 {displayImages.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`thumbnail-${idx}`}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                       border: "2px solid #ddd",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       const newImages = [...displayImages];
//                       [newImages[0], newImages[idx]] = [newImages[idx], newImages[0]];
//                       setDisplayImages(newImages);
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Main Image with Wishlist Button */}
//               <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
//                 <img
//                   src={displayImages?.[0] || "/placeholder.png"}
//                   alt={product.name}
//                   className="product-image"
//                   style={{ maxHeight: "400px" }}
//                 />
                
//                 {/* Wishlist Icon on Image */}
//                 <button
//                   className="wishlist-icon-btn"
//                   onClick={toggleWishlist}
//                   disabled={wishlistLoading || !selectedShade}
//                   style={{
//                     position: 'absolute',
//                     top: '15px',
//                     right: '15px',
//                     cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//                     color: isInWishlist ? '#dc3545' : '#666',
//                     fontSize: '24px',
//                     zIndex: 2,
//                     borderRadius: '50%',
//                     width: '40px',
//                     height: '40px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     transition: 'all 0.3s ease',
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     border: 'none',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
//                   }}
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {wishlistLoading ? (
//                     <div className="spinner-border spinner-border-sm" role="status"></div>
//                   ) : isInWishlist ? (
//                     <FaHeart />
//                   ) : (
//                     <FaRegHeart />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Product Info Section */}
//             <div className="product-info-section">
//               <p className="brand-variant">
//                 {product.brand?.name || product.brand || "Unknown Brand"}
//               </p>

//               <div className="d-flex flex-wrap gap-2 align-items-center">
//                 <h1 className="product-name fs-4">{product.name}</h1>
//                 {selectedShade && (
//                   <span className="text-muted fs-5" style={{ fontWeight: '500' }}>
//                     - {selectedShade.shadeName}
//                   </span>
//                 )}
//               </div>

//               {/* Variants Selection */}
//               {(product.variants?.length > 0 || product.shadeOptions?.length > 0) && (
//                 <div className="option-group mt-3">
//                   <span className="option-label fs-6 mb-2 d-block">Select Variant</span>
//                   <div className="variant-list d-flex gap-2 flex-wrap">
//                     {(product.variants || product.shadeOptions || []).map((v, idx) => {
//                       const isSelected = selectedShade?.sku === (v.sku || v.variantSku);
//                       const isOutOfStock = v.stock <= 0;
                      
//                       return v.hex ? (
//                         <div
//                           key={`color-${idx}`}
//                           className={`color-circles ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                           style={{
//                             backgroundColor: v.hex,
//                             width: "30px",
//                             height: "30px",
//                             borderRadius: "50%",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             border: isSelected ? "3px solid #0077b6" : "2px solid #ddd",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(v)}
//                           title={`${v.shadeName || "Variant"} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                         >
//                           {isOutOfStock && (
//                             <div className="out-of-stock-indicator"></div>
//                           )}
//                         </div>
//                       ) : (
//                         <button
//                           key={`text-${idx}`}
//                           className={`text-variant ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
//                             backgroundColor: isSelected ? "#e3f2fd" : "#f8f9fa",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             fontSize: "14px",
//                             fontWeight: isSelected ? 600 : 400,
//                             opacity: isOutOfStock ? 0.5 : 1
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(v)}
//                           disabled={isOutOfStock}
//                         >
//                           {v.shadeName || v.size || `Variant ${idx + 1}`}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Rating */}
//               <div className="product-rating mt-3">
//                 {[...Array(5)].map((_, index) => (
//                   <FaStar
//                     key={index}
//                     className="fs-5"
//                     color={index < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"}
//                   />
//                 ))}
//                 <span className="rating-count ms-2">
//                   {reviewSummary.average} / 5 ({reviewSummary.count} review{reviewSummary.count !== 1 ? 's' : ''})
//                 </span>
//               </div>

//               {/* Price */}
//               <div className="product-price d-flex align-items-center gap-3 mt-3">
//                 <span className="text-success fw-bold fs-3">
//                   ₹{selectedShade?.displayPrice || product.price || "0"}
//                 </span>
//                 {selectedShade?.originalPrice > selectedShade?.displayPrice && (
//                   <>
//                     <del className="text-muted fs-5">₹{selectedShade.originalPrice}</del>
//                     <span className="discount-badge text-danger fw-bold">
//                       {Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)}% OFF
//                     </span>
//                   </>
//                 )}
//               </div>

//               {/* Stock Status */}
//               <div className="stock-status mt-2 mb-3">
//                 {selectedShade ? (
//                   selectedShade.stock > 0 ? (
//                     <span className="text-success">
//                       <i className="bi bi-check-circle me-1"></i>
//                       In Stock ({selectedShade.stock} available)
//                     </span>
//                   ) : (
//                     <span className="text-danger">
//                       <i className="bi bi-x-circle me-1"></i>
//                       Out of Stock
//                     </span>
//                   )
//                 ) : (
//                   <span className="text-warning">Select a variant to see stock</span>
//                 )}
//               </div>

//               {/* Action Buttons: Wishlist & Add to Cart */}
//               <div className="action-buttons d-flex flex-column flex-md-row gap-3 mt-4">
//                 {/* Wishlist Button */}
//                 <button
//                   className={`wishlist-main-btn ${isInWishlist ? 'active' : ''}`}
//                   onClick={toggleWishlist}
//                   disabled={wishlistLoading || !selectedShade}
//                   style={{
//                     minWidth: "180px",
//                     padding: "12px 20px",
//                     border: `2px solid ${isInWishlist ? '#dc3545' : '#dee2e6'}`,
//                     backgroundColor: isInWishlist ? '#dc3545' : 'transparent',
//                     color: isInWishlist ? 'white' : '#333',
//                     borderRadius: "8px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "10px",
//                     fontWeight: "600",
//                     fontSize: "16px",
//                     cursor: wishlistLoading ? "not-allowed" : "pointer",
//                     transition: "all 0.3s ease"
//                   }}
//                 >
//                   {wishlistLoading ? (
//                     <>
//                       <div className="spinner-border spinner-border-sm"></div>
//                       <span>Processing...</span>
//                     </>
//                   ) : isInWishlist ? (
//                     <>
//                       <FaHeart /> Remove from Wishlist
//                     </>
//                   ) : (
//                     <>
//                       <FaRegHeart /> Add to Wishlist
//                     </>
//                   )}
//                 </button>

//                 {/* Add to Cart Button */}
//                 <div style={{ flex: 1 }}>
//                   <Addtocard
//                     prod={product}
//                     selectedShade={selectedShade}
//                     showToastMsg={toast}
//                     onAddToCart={handleAddToCart}
//                   />
//                 </div>
//               </div>

//               {/* Wishlist Note */}
//               {!selectedShade && (
//                 <div className="alert alert-warning mt-3">
//                   <small>Please select a variant before adding to wishlist</small>
//                 </div>
//               )}
//             </div>
//           </article>

//           {/* Product Details Accordion */}
//           <section className="product-extra-section mt-5">
//             <div className="details-section">
//               <div className="accordion">
//                 <details>
//                   <summary>Description</summary>
//                   <p className="mt-3">{product.description || "No description available."}</p>
//                 </details>
//                 <details>
//                   <summary>Ingredients</summary>
//                   <p className="mt-3">{product.ingredients || "Ingredients not provided."}</p>
//                 </details>
//                 <details>
//                   <summary>How To Use</summary>
//                   <p className="mt-3">{product.howToUse || "Usage instructions not provided."}</p>
//                 </details>
//                 <details>
//                   <summary>Special Features</summary>
//                   <p className="mt-3">{product.features || "No special features listed."}</p>
//                 </details>
//               </div>
//             </div>
//           </section>

//           {/* Reviews Section */}
//           <section className="reviews-section mt-5">
//             <h2 className="mb-4">Customer Reviews</h2>

//             <div className="filter-bar d-flex gap-3 mb-4 flex-wrap">
//               <select
//                 value={filters.shade}
//                 onChange={(e) => setFilters({ ...filters, shade: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Shades</option>
//                 {product.variants?.map(v => (
//                   <option key={v.sku} value={v.shadeName}>{v.shadeName}</option>
//                 ))}
//               </select>

//               <select
//                 value={filters.rating}
//                 onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Ratings</option>
//                 {[5, 4, 3, 2, 1].map(n => (
//                   <option key={n} value={n}>{n} Stars</option>
//                 ))}
//               </select>

//               <select
//                 value={filters.sort}
//                 onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="Most Helpful">Most Helpful</option>
//                 <option value="Newest">Newest</option>
//               </select>

//               <button
//                 className={`btn ${filters.photosOnly ? 'btn-primary' : 'btn-outline-primary'}`}
//                 onClick={() => setFilters({ ...filters, photosOnly: !filters.photosOnly })}
//               >
//                 With Photos
//               </button>

//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={() => setFilters({
//                   shade: "All",
//                   rating: "All",
//                   sort: "Most Helpful",
//                   photosOnly: false,
//                 })}
//               >
//                 Reset
//               </button>
//             </div>

//             <div className="reviews-list">
//               {reviews.map((r) => (
//                 <div key={r._id} className="review-card p-3 border-bottom">
//                   <div className="d-flex justify-content-between">
//                     <div className="d-flex align-items-center gap-2">
//                       <img
//                         src={r.customer?.profileImage || "/default-avatar.png"}
//                         className="rounded-circle"
//                         width="50" height="50"
//                         alt="user"
//                       />
//                       <span className="fw-bold">{r.customer?.name || "Anonymous"}</span>
//                       {r.verifiedPurchase && (
//                         <span className="text-success small">
//                           <FaCheckCircle /> Verified
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-muted small">
//                       {new Date(r.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>

//                   <div className="my-2">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar key={i} color={i < r.rating ? "#ffc107" : "#eee"} />
//                     ))}
//                     <span className="ms-3 text-muted">Shade: {r.shadeName}</span>
//                   </div>

//                   <p>{r.comment}</p>

//                   {r.images?.length > 0 && (
//                     <div className="review-images d-flex gap-2 mb-3">
//                       {r.images.map((img, i) => (
//                         <img
//                           key={i}
//                           src={img}
//                           width="80"
//                           className="rounded border"
//                           alt="review"
//                         />
//                       ))}
//                     </div>
//                   )}

//                   <button
//                     className={`btn btn-sm ${likedReviews[r._id] ? 'btn-primary' : 'btn-outline-secondary'}`}
//                     onClick={() => handleHelpfulVote(r._id)}
//                   >
//                     <FaThumbsUp /> Helpful ({r.helpfulVotes || 0})
//                   </button>
//                 </div>
//               ))}

//               {reviews.length === 0 && (
//                 <div className="text-center py-4">
//                   <p className="text-muted">No reviews yet. Be the first to review this product!</p>
//                 </div>
//               )}
//             </div>

//             {/* Write Review Form */}
//             <div className="mt-4">
//               <button
//                 className="btn btn-primary"
//                 onClick={() => setShowReviewForm(!showReviewForm)}
//               >
//                 {showReviewForm ? "Cancel Review" : "Write a Review"}
//               </button>

//               {showReviewForm && (
//                 <form className="p-4 border rounded bg-light mt-3" onSubmit={handleReviewSubmit}>
//                   <h4 className="mb-3">Write a Review</h4>

//                   <div className="mb-3">
//                     <label className="d-block mb-2">Rating</label>
//                     {[1, 2, 3, 4, 5].map(n => (
//                       <FaStar
//                         key={n}
//                         size="24"
//                         style={{ cursor: 'pointer', marginRight: '5px' }}
//                         color={n <= newReview.rating ? "#ffc107" : "#ddd"}
//                         onClick={() => setNewReview({ ...newReview, rating: n })}
//                       />
//                     ))}
//                     <span className="ms-2">{newReview.rating} stars</span>
//                   </div>

//                   <textarea
//                     className="form-control mb-3"
//                     placeholder="Share your experience..."
//                     rows="4"
//                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                     value={newReview.comment}
//                     required
//                   ></textarea>

//                   <div className="mb-3">
//                     <label className="form-label">Upload Photos (Optional)</label>
//                     <input
//                       type="file"
//                       multiple
//                       className="form-control"
//                       onChange={(e) => setReviewImages(Array.from(e.target.files))}
//                       accept="image/*"
//                     />
//                     {reviewImages.length > 0 && (
//                       <div className="mt-2">
//                         <small>{reviewImages.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     className="btn btn-primary"
//                     type="submit"
//                     disabled={submitting || !selectedShade}
//                   >
//                     {submitting ? "Submitting..." : "Submit Review"}
//                   </button>

//                   {!selectedShade && (
//                     <div className="alert alert-warning mt-2">
//                       Please select a variant before submitting your review.
//                     </div>
//                   )}
//                 </form>
//               )}
//             </div>
//           </section>

//           {/* Recommendations */}
//           <section className="recommendations-section mt-5">
//             <RecommendationSlider
//               title="You Might Also Like"
//               products={product.recommendations?.alsoViewed?.products || []}
//             />
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;







//=============================================================Done-Code(Start)==========================================================









// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaThumbsUp, FaCheckCircle, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import Header from "./Header";
// import Footer from "./Footer";
// import RecommendationSlider from "./RecommendationSlider";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/ProductDetail.css";
// import Addtocard from "./Addtocard";

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const [product, setProduct] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [displayImages, setDisplayImages] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 });
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//   const [reviewImages, setReviewImages] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [likedReviews, setLikedReviews] = useState({});
//   const [addingToCart, setAddingToCart] = useState(false);

//   // ✅ Wishlist States (Updated for backend compatibility)
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]); // Store full wishlist data

//   const [filters, setFilters] = useState({
//     shade: "All",
//     rating: "All",
//     sort: "Most Helpful",
//     photosOnly: false,
//   });

//   const [showReviewForm, setShowReviewForm] = useState(false);

//   // ===================== WISHLIST FUNCTIONS (Updated for Backend) =====================

//   // ✅ Check if current product (with selected SKU) is in wishlist
//   const checkWishlistStatus = async () => {
//     if (!product || !selectedShade) return false;
    
//     try {
//       if (user && !user.guest) {
//         // For logged-in users: Check via API
//         const response = await axiosInstance.get(`/api/user/wishlist/check/${product._id}`);
//         return response.data.isInWishlist || false;
//       } else {
//         // For guests: Check localStorage
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         return guestWishlist.some(item => 
//           item._id === product._id && item.sku === selectedShade.sku
//         );
//       }
//     } catch (error) {
//       console.error("Error checking wishlist status:", error);
//       return false;
//     }
//   };

//   // ✅ Fetch full wishlist data
//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get("/api/user/wishlist");
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         setWishlistData(localWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   // ✅ Toggle wishlist function (Updated for backend requirements)
//   const toggleWishlist = async () => {
//     if (!product || !selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }

//     setWishlistLoading(true);
//     try {
//       const productId = product._id;
//       const sku = selectedShade.sku;

//       if (user && !user.guest) {
//         // 🟢 Logged-in user - Backend API call
//         if (isInWishlist) {
//           // Remove from wishlist - Send SKU in request body
//           await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
//             data: { sku: sku }
//           });
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           // Add to wishlist - Send SKU in request body
//           await axiosInstance.post(`/api/user/wishlist/${productId}`, { sku: sku });
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }
//       } else {
//         // 🟢 Guest user - LocalStorage
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         const existingIndex = guestWishlist.findIndex(item => 
//           item._id === productId && item.sku === sku
//         );

//         if (existingIndex >= 0) {
//           // Remove from wishlist
//           guestWishlist.splice(existingIndex, 1);
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           // Add to wishlist with complete product data
//           const productData = {
//             _id: productId,
//             name: product.name,
//             brand: product.brand?.name || product.brand || "Unknown",
//             price: selectedShade.displayPrice || product.price || 0,
//             originalPrice: selectedShade.originalPrice || product.mrp || product.price || 0,
//             mrp: selectedShade.originalPrice || product.mrp || product.price || 0,
//             displayPrice: selectedShade.displayPrice || product.price || 0,
//             images: displayImages || product.images || ["/placeholder.png"],
//             image: displayImages?.[0] || product.images?.[0] || "/placeholder.png",
//             slug: product.slugs?.[0] || slug,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: selectedShade.shadeName || selectedShade.name || "Default",
//             shadeName: selectedShade.shadeName || selectedShade.name || "Default",
//             variant: selectedShade.shadeName || selectedShade.name || "Default",
//             hex: selectedShade.hex || "#cccccc",
//             stock: selectedShade.stock || 0,
//             status: selectedShade.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: reviewSummary.average || 0,
//             totalRatings: reviewSummary.count || 0,
//             commentsCount: reviewSummary.count || 0,
//             discountPercent: selectedShade.originalPrice > selectedShade.displayPrice 
//               ? Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }

//         localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//         setWishlistData(guestWishlist);
//       }

//       // Update wishlist data
//       await fetchWishlistData();
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   // ✅ Update wishlist status when product or selectedShade changes
//   useEffect(() => {
//     const updateWishlistStatus = async () => {
//       if (product && selectedShade) {
//         const status = await checkWishlistStatus();
//         setIsInWishlist(status);
//       }
//     };
//     updateWishlistStatus();
//   }, [product, selectedShade, user]);

//   // ✅ Initial fetch of wishlist data
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // ===================== END WISHLIST FUNCTIONS =====================

//   // ✅ Extract variant query parameter from URL
//   const getVariantFromQuery = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('variant');
//   };

//   // ✅ Update URL when variant is selected
//   const updateUrlForVariant = (variant) => {
//     if (!variant || !product) return;
//     if (variant.slug) {
//       navigate(`/product/${variant.slug}`, { replace: true });
//     } else if (variant.sku) {
//       const productSlug = product.slugs?.[0] || slug;
//       navigate(`/product/${productSlug}?variant=${variant.sku}`, { replace: true });
//     }
//   };

//   // ✅ Fetch Product with variant detection
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         let url = `/api/user/products/${slug}`;
//         const variantParam = getVariantFromQuery();
//         if (variantParam) {
//           url += `?variant=${variantParam}`;
//         }

//         const res = await axiosInstance.get(url);
//         const data = res.data;
//         setProduct(data);

//         const isVariantSlug = data.selectedVariant && data.selectedVariant.slug === slug;

//         const variantsList = data.variants || [];
//         let defaultVariant = null;

//         if (isVariantSlug && data.selectedVariant) {
//           defaultVariant = data.selectedVariant;
//         } else if (variantParam) {
//           defaultVariant = variantsList.find(
//             v => v.sku === variantParam || v.variantSku === variantParam
//           ) || variantsList[0];
//         } else {
//           defaultVariant = variantsList.find(v => v.stock > 0) || variantsList[0];
//         }

//         if (defaultVariant) {
//           const variantData = {
//             shadeName: defaultVariant.shadeName,
//             hex: defaultVariant.hex,
//             stock: defaultVariant.stock,
//             images: defaultVariant.images || data.images || ["/placeholder.png"],
//             displayPrice: defaultVariant.displayPrice,
//             originalPrice: defaultVariant.originalPrice,
//             variantSku: defaultVariant.sku || defaultVariant.variantSku,
//             sku: defaultVariant.sku || defaultVariant.variantSku,
//             slug: defaultVariant.slug,
//             ...defaultVariant
//           };

//           setSelectedShade(variantData);
//           setDisplayImages(variantData.images);
          
//           // Set default review variant to selected variant
//           setNewReview(prev => ({
//             ...prev,
//             variantSku: variantData.sku,
//             shadeName: variantData.shadeName
//           }));
//         } else {
//           setSelectedShade(null);
//           setDisplayImages(data.images || ["/placeholder.png"]);
//         }

//         await fetchReviewSummary(data._id);
//       } catch (err) {
//         console.error("❌ Error fetching product:", err);
//         toast.error("Product not found");
//         navigate("/404");
//       }
//     };

//     fetchProduct();
//   }, [slug, location.search, navigate]);

//   // ✅ Handle variant selection
//   const handleVariantSelect = (variant) => {
//     if (!variant || variant.stock <= 0) return;

//     const variantData = {
//       shadeName: variant.shadeName,
//       hex: variant.hex,
//       stock: variant.stock,
//       images: variant.images || product.images || ["/placeholder.png"],
//       displayPrice: variant.displayPrice || product.price,
//       originalPrice: variant.originalPrice || product.mrp || product.price,
//       variantSku: variant.sku || variant.variantSku,
//       sku: variant.sku || variant.variantSku,
//       slug: variant.slug,
//       ...variant
//     };

//     setSelectedShade(variantData);
//     setDisplayImages(variantData.images);
//     updateUrlForVariant(variantData);
    
//     // Update review form with selected variant
//     if (showReviewForm) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: variantData.sku,
//         shadeName: variantData.shadeName
//       }));
//     }
//   };

//   // ===================== REVIEWS SECTION =====================

//   const fetchFilteredReviews = async () => {
//     if (!product?._id) return;
//     try {
//       let query = `?sort=${filters.sort === "Most Helpful" ? "helpful" : "recent"}`;
//       if (filters.rating !== "All") query += `&stars=${filters.rating}`;
//       if (filters.photosOnly) query += `&photosOnly=true`;
//       if (filters.shade !== "All") query += `&shadeName=${encodeURIComponent(filters.shade)}`;

//       const res = await axiosInstance.get(`/api/reviews/product/${product._id}${query}`);
//       setReviews(res.data.reviews || []);

//       if (res.data.reviews?.length > 0) {
//         const avg = res.data.reviews.reduce((sum, r) => sum + r.rating, 0) / res.data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: res.data.reviews.length
//         });
//       }
//     } catch (err) {
//       console.error("Reviews fetch error", err);
//     }
//   };

//   useEffect(() => {
//     if (product?._id) {
//       fetchFilteredReviews();
//     }
//   }, [product?._id, filters]);

//   // ✅ Handle variant selection in review form
//   const handleReviewVariantSelect = (e) => {
//     const selectedSku = e.target.value;
//     const variantsList = product.variants || product.shadeOptions || [];
//     const selectedVariant = variantsList.find(v => v.sku === selectedSku || v.variantSku === selectedSku);
    
//     if (selectedVariant) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: selectedVariant.sku || selectedVariant.variantSku,
//         shadeName: selectedVariant.shadeName || selectedVariant.name || "Default"
//       }));
//     }
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate variant selection
//     if (!newReview.variantSku) {
//       toast.warn("Please select a variant for your review.");
//       return;
//     }
    
//     if (!newReview.rating || !newReview.comment) {
//       toast.warn("Rating and comment are required.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("productId", product._id);
//       formData.append("variantSku", newReview.variantSku);
//       formData.append("shadeName", newReview.shadeName);
//       formData.append("rating", newReview.rating);
//       formData.append("comment", newReview.comment);
//       reviewImages.forEach((file) => formData.append("images", file));

//       const res = await axiosInstance.post(`/api/reviews/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data.review) {
//         toast.success("✅ Review submitted!");
//         setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//         setReviewImages([]);
//         fetchFilteredReviews();
//         setShowReviewForm(false);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleHelpfulVote = async (reviewId) => {
//     try {
//       const res = await axiosInstance.post(`/api/reviews/${reviewId}/vote-helpful`);

//       setReviews(prev => prev.map(r =>
//         r._id === reviewId ? { ...r, helpfulVotes: res.data.helpfulVotes } : r
//       ));

//       setLikedReviews(prev => ({
//         ...prev,
//         [reviewId]: res.data.message === "Vote added"
//       }));

//       toast.info(res.data.message);
//     } catch (err) {
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!product) {
//       toast.error("❌ Product not found");
//       return;
//     }

//     if (!selectedShade) {
//       toast.error("❌ Please select a variant first");
//       return;
//     }

//     if (selectedShade.stock <= 0) {
//       toast.error("❌ This variant is out of stock");
//       return;
//     }

//     setAddingToCart(true);
//     try {
//       const success = await addToCart(product, selectedShade, false);
//       if (success) {
//         toast.success("✅ Added to cart!");
//         setTimeout(() => navigate("/cartpage"), 1000);
//       } else {
//         toast.error("❌ Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       if (error.message === "Authentication required") {
//         toast.error("⚠️ Please log in first");
//         navigate("/login");
//       } else {
//         toast.error("❌ Failed to add product");
//       }
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const fetchReviewSummary = async (productId) => {
//     try {
//       const res = await axiosInstance.get(`/api/reviews/product/${productId}/top`);
//       const data = res.data;
//       setReviews(data.reviews || []);
//       if (data.reviews?.length > 0) {
//         const avg = data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: data.reviews.length,
//         });
//       } else {
//         setReviewSummary({ average: 0, count: 0 });
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching reviews:", err);
//     }
//   };

//   // Reset review form when showing/hiding
//   useEffect(() => {
//     if (showReviewForm && product && selectedShade) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: selectedShade.sku,
//         shadeName: selectedShade.shadeName
//       }));
//     } else if (!showReviewForm) {
//       setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//     }
//   }, [showReviewForm, product, selectedShade]);

//   if (!product) return <div className="text-center py-5 text-black page-title-main-name">Loading...</div>;

//   // Get all available variants for the product
//   const variantsList = product.variants || product.shadeOptions || [];

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <main className="product-detail-page page-title-main-name">
//         <div className="product-detail-container mt-4">
//           {/* Product Card Section */}
//           <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4">
//             <div className="product-image-section" style={{ display: "flex", gap: "16px" }}>
//               {/* Thumbnails */}
//               <div className="thumbnail-list" style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 maxHeight: "320px",
//                 overflowY: displayImages.length > 5 ? "auto" : "visible",
//                 paddingRight: "4px",
//               }}>
//                 {displayImages.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`thumbnail-${idx}`}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                       border: "2px solid #ddd",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => {
//                       const newImages = [...displayImages];
//                       [newImages[0], newImages[idx]] = [newImages[idx], newImages[0]];
//                       setDisplayImages(newImages);
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Main Image with Wishlist Button */}
//               <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
//                 <img
//                   src={displayImages?.[0] || "/placeholder.png"}
//                   alt={product.name}
//                   className="product-image"
//                   style={{ maxHeight: "400px" }}
//                 />
                
//                 {/* Wishlist Icon on Image */}
//                 <button
//                   className="wishlist-icon-btn"
//                   onClick={toggleWishlist}
//                   disabled={wishlistLoading || !selectedShade}
//                   style={{
//                     position: 'absolute',
//                     top: '15px',
//                     right: '15px',
//                     cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//                     color: isInWishlist ? '#dc3545' : '#666',
//                     fontSize: '24px',
//                     zIndex: 2,
//                     borderRadius: '50%',
//                     width: '40px',
//                     height: '40px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     transition: 'all 0.3s ease',
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     border: 'none',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
//                   }}
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {wishlistLoading ? (
//                     <div className="spinner-border spinner-border-sm" role="status"></div>
//                   ) : isInWishlist ? (
//                     <FaHeart />
//                   ) : (
//                     <FaRegHeart />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Product Info Section */}
//             <div className="product-info-section">
//               <p className="brand-variant mt-3">
//                 {product.brand?.name || product.brand || "Unknown Brand"}
//               </p>

//               <div className="d-flex flex-wrap gap-2 align-items-center">
//                 <h1 className="product-name fs-4">{product.name}</h1>
//                 {selectedShade && (
//                   <span className="text-muted fs-5" style={{ fontWeight: '500' }}>
//                     - {selectedShade.shadeName}
//                   </span>
//                 )}
//               </div>

//               {/* Variants Selection */}
//               {variantsList.length > 0 && (
//                 <div className="option-group mt-3">
//                   <span className="option-label fs-6 mb-2 d-block">Select Variant</span>
//                   <div className="variant-list d-flex gap-2 flex-wrap">
//                     {variantsList.map((v, idx) => {
//                       const isSelected = selectedShade?.sku === (v.sku || v.variantSku);
//                       const isOutOfStock = v.stock <= 0;
                      
//                       return v.hex ? (
//                         <div
//                           key={`color-${idx}`}
//                           className={`color-circles ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                           style={{
//                             backgroundColor: v.hex,
//                             width: "30px",
//                             height: "30px",
//                             borderRadius: "50%",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             border: isSelected ? "3px solid #0077b6" : "2px solid #ddd",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(v)}
//                           title={`${v.shadeName || "Variant"} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                         >
//                           {isOutOfStock && (
//                             <div className="out-of-stock-indicator"></div>
//                           )}
//                         </div>
//                       ) : (
//                         <button
//                           key={`text-${idx}`}
//                           className={`text-variant ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
//                             backgroundColor: isSelected ? "#e3f2fd" : "#f8f9fa",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             fontSize: "14px",
//                             fontWeight: isSelected ? 600 : 400,
//                             opacity: isOutOfStock ? 0.5 : 1
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(v)}
//                           disabled={isOutOfStock}
//                         >
//                           {v.shadeName || v.size || `Variant ${idx + 1}`}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Rating */}
//               <div className="product-rating mt-3">
//                 {[...Array(5)].map((_, index) => (
//                   <FaStar
//                     key={index}
//                     className="fs-5"
//                     color={index < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"}
//                   />
//                 ))}
//                 <span className="rating-count ms-2">
//                   {reviewSummary.average} / 5 ({reviewSummary.count} review{reviewSummary.count !== 1 ? 's' : ''})
//                 </span>
//               </div>

//               {/* Price */}
//               <div className="product-price d-flex align-items-center gap-3 mt-3">
//                 <span className="text-success fw-bold fs-3">
//                   ₹{selectedShade?.displayPrice || product.price || "0"}
//                 </span>
//                 {selectedShade?.originalPrice > selectedShade?.displayPrice && (
//                   <>
//                     <del className="text-muted fs-5">₹{selectedShade.originalPrice}</del>
//                     <span className="discount-badge text-danger fw-bold">
//                       {Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)}% OFF
//                     </span>
//                   </>
//                 )}
//               </div>

//               {/* Stock Status */}
//               <div className="stock-status mt-2 mb-3 text-start">
//                 {selectedShade ? (
//                   selectedShade.stock > 0 ? (
//                     <span className="text-success">
//                       {/* <i className="bi bi-check-circle me-1"></i> */}
//                       {/* In Stock ({selectedShade.stock} available) */}
//                     </span>
//                   ) : (
//                     <span className="text-danger">
//                       <i className="bi bi-x-circle me-1"></i>
//                       Out of Stock
//                     </span>
//                   )
//                 ) : (
//                   <span className="text-warning">Select a variant to see stock</span>
//                 )}
//               </div>

//               {/* Action Buttons: Wishlist & Add to Cart */}
//               <div className="action-buttons d-flex flex-column flex-md-row gap-3 mt-4">
//                 {/* Wishlist Button */}
//                 <button
//                   className={`wishlist-main-btn ${isInWishlist ? 'active' : ''}`}
//                   onClick={toggleWishlist}
//                   disabled={wishlistLoading || !selectedShade}
//                   style={{
//                     minWidth: "180px",
//                     padding: "12px 20px",
//                     border: `2px solid ${isInWishlist ? '#dc3545' : '#dee2e6'}`,
//                     backgroundColor: isInWishlist ? '#dc3545' : 'transparent',
//                     color: isInWishlist ? 'white' : '#333',
//                     borderRadius: "8px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "10px",
//                     fontWeight: "600",
//                     fontSize: "16px",
//                     cursor: wishlistLoading ? "not-allowed" : "pointer",
//                     transition: "all 0.3s ease"
//                   }}
//                 >
//                   {wishlistLoading ? (
//                     <>
//                       <div className="spinner-border spinner-border-sm"></div>
//                       <span>Processing...</span>
//                     </>
//                   ) : isInWishlist ? (
//                     <>
//                       <FaHeart /> Remove from Wishlist
//                     </>
//                   ) : (
//                     <>
//                       <FaRegHeart /> Add to Wishlist
//                     </>
//                   )}
//                 </button>

//                 {/* Add to Cart Button */}
//                 <div style={{ flex: 1 }}>
//                   <Addtocard
//                     prod={product}
//                     selectedShade={selectedShade}
//                     showToastMsg={toast}
//                     onAddToCart={handleAddToCart}
//                   />
//                 </div>
//               </div>

//               {/* Wishlist Note */}
//               {!selectedShade && (
//                 <div className="alert alert-warning mt-3">
//                   <small>Please select a variant before adding to wishlist</small>
//                 </div>
//               )}
//             </div>
//           </article>

//           {/* Product Details Accordion */}
//           <section className="product-extra-section mt-5">
//             <div className="details-section">
//               <div className="accordion">
//                 <details>
//                   <summary>Description</summary>
//                   <p className="mt-3">{product.description || "No description available."}</p>
//                 </details>
//                 <details>
//                   <summary>Ingredients</summary>
//                   <p className="mt-3">{product.ingredients || "Ingredients not provided."}</p>
//                 </details>
//                 <details>
//                   <summary>How To Use</summary>
//                   <p className="mt-3">{product.howToUse || "Usage instructions not provided."}</p>
//                 </details>
//                 <details>
//                   <summary>Special Features</summary>
//                   <p className="mt-3">{product.features || "No special features listed."}</p>
//                 </details>
//               </div>
//             </div>
//           </section>

//           {/* Reviews Section */}
//           <section className="reviews-section mt-5">
//             <h2 className="mb-4">Customer Reviews</h2>

//             <div className="filter-bar d-flex gap-3 mb-4 flex-wrap">
//               <select
//                 value={filters.shade}
//                 onChange={(e) => setFilters({ ...filters, shade: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Shades</option>
//                 {variantsList.map(v => (
//                   <option key={v.sku || v.variantSku} value={v.shadeName}>
//                     {v.shadeName || "Default"}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={filters.rating}
//                 onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="All">All Ratings</option>
//                 {[5, 4, 3, 2, 1].map(n => (
//                   <option key={n} value={n}>{n} Stars</option>
//                 ))}
//               </select>

//               <select
//                 value={filters.sort}
//                 onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                 className="form-select"
//                 style={{ width: "auto" }}
//               >
//                 <option value="Most Helpful">Most Helpful</option>
//                 <option value="Newest">Newest</option>
//               </select>

//               <button
//                 className={`btn ${filters.photosOnly ? 'btn-primary' : 'btn-outline-primary'}`}
//                 onClick={() => setFilters({ ...filters, photosOnly: !filters.photosOnly })}
//               >
//                 With Photos
//               </button>

//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={() => setFilters({
//                   shade: "All",
//                   rating: "All",
//                   sort: "Most Helpful",
//                   photosOnly: false,
//                 })}
//               >
//                 Reset
//               </button>
//             </div>

//             <div className="reviews-list">
//               {reviews.map((r) => (
//                 <div key={r._id} className="review-card p-3 border-bottom">
//                   <div className="d-flex justify-content-between">
//                     <div className="d-flex align-items-center gap-2">
//                       <img
//                         src={r.customer?.profileImage || "/default-avatar.png"}
//                         className="rounded-circle"
//                         width="50" height="50"
//                         alt="user"
//                       />
//                       <span className="fw-bold">{r.customer?.name || "Anonymous"}</span>
//                       {r.verifiedPurchase && (
//                         <span className="text-success small">
//                           <FaCheckCircle /> Verified
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-muted small">
//                       {new Date(r.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>

//                   <div className="my-2">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar key={i} color={i < r.rating ? "#ffc107" : "#eee"} />
//                     ))}
//                     <span className="ms-3 text-muted">Shade: {r.shadeName}</span>
//                   </div>

//                   <p>{r.comment}</p>

//                   {r.images?.length > 0 && (
//                     <div className="review-images d-flex gap-2 mb-3">
//                       {r.images.map((img, i) => (
//                         <img
//                           key={i}
//                           src={img}
//                           width="80"
//                           className="rounded border"
//                           alt="review"
//                         />
//                       ))}
//                     </div>
//                   )}

//                   <button
//                     className={`btn btn-sm ${likedReviews[r._id] ? 'btn-primary' : 'btn-outline-secondary'}`}
//                     onClick={() => handleHelpfulVote(r._id)}
//                   >
//                     <FaThumbsUp /> Helpful ({r.helpfulVotes || 0})
//                   </button>
//                 </div>
//               ))}

//               {reviews.length === 0 && (
//                 <div className="text-center py-4">
//                   <p className="text-muted">No reviews yet. Be the first to review this product!</p>
//                 </div>
//               )}
//             </div>

//             {/* Write Review Form */}
//             <div className="mt-4">
//               <button
//                 className="btn btn-primary"
//                 onClick={() => setShowReviewForm(!showReviewForm)}
//               >
//                 {showReviewForm ? "Cancel Review" : "Write a Review"}
//               </button>

//               {showReviewForm && (
//                 <form className="p-4 border rounded bg-light mt-3" onSubmit={handleReviewSubmit}>
//                   <h4 className="mb-3">Write a Review</h4>

//                   {/* Variant Selection Dropdown for Review */}
//                   {variantsList.length > 0 && (
//                     <div className="mb-3">
//                       <label className="form-label">Select Variant</label>
//                       <select
//                         className="form-select"
//                         value={newReview.variantSku}
//                         onChange={handleReviewVariantSelect}
//                         required
//                       >
//                         <option value="">Choose a variant...</option>
//                         {variantsList.map((variant) => (
//                           <option 
//                             key={variant.sku || variant.variantSku} 
//                             value={variant.sku || variant.variantSku}
//                           >
//                             {variant.shadeName || variant.name || "Default"} 
//                             {variant.stock <= 0 ? " (Out of Stock)" : ""}
//                           </option>
//                         ))}
//                       </select>
//                       {newReview.shadeName && (
//                         <div className="mt-2 small text-muted">
//                           Selected: {newReview.shadeName}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <div className="mb-3">
//                     <label className="d-block mb-2">Rating</label>
//                     <div className="d-flex align-items-center">
//                       {[1, 2, 3, 4, 5].map(n => (
//                         <FaStar
//                           key={n}
//                           size="24"
//                           style={{ cursor: 'pointer', marginRight: '5px' }}
//                           color={n <= newReview.rating ? "#ffc107" : "#ddd"}
//                           onClick={() => setNewReview({ ...newReview, rating: n })}
//                         />
//                       ))}
//                       <span className="ms-2">{newReview.rating} stars</span>
//                     </div>
//                   </div>

//                   <textarea
//                     className="form-control mb-3"
//                     placeholder="Share your experience..."
//                     rows="4"
//                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                     value={newReview.comment}
//                     required
//                   ></textarea>

//                   <div className="mb-3">
//                     <label className="form-label">Upload Photos (Optional)</label>
//                     <input
//                       type="file"
//                       multiple
//                       className="form-control"
//                       onChange={(e) => setReviewImages(Array.from(e.target.files))}
//                       accept="image/*"
//                     />
//                     {reviewImages.length > 0 && (
//                       <div className="mt-2">
//                         <small>{reviewImages.length} file(s) selected</small>
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     className="btn btn-primary"
//                     type="submit"
//                     disabled={submitting || !newReview.variantSku}
//                   >
//                     {submitting ? "Submitting..." : "Submit Review"}
//                   </button>

//                   {!newReview.variantSku && (
//                     <div className="alert alert-warning mt-2">
//                       Please select a variant before submitting your review.
//                     </div>
//                   )}
//                 </form>
//               )}
//             </div>
//           </section>

//           {/* Recommendations */}
//           <section className="recommendations-section mt-5">
//             <RecommendationSlider
//               title="You Might Also Like"
//               products={product.recommendations?.alsoViewed?.products || []}
//             />
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;



















// // src/components/ProductDetail.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import Header from "./Header";
// import Footer from "./Footer";
// import RecommendationSlider from "./RecommendationSlider";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/ProductDetail.css";

// // Import separated components
// import ProductDetailsHero from "./ProductDetailsHero";
// import ProductDetailDescription from "./ProductDetailDescription";
// import CustomerReviews from "./CustomerReviews";

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const [product, setProduct] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [displayImages, setDisplayImages] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 });
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//   const [reviewImages, setReviewImages] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [likedReviews, setLikedReviews] = useState({});
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [filters, setFilters] = useState({
//     shade: "All",
//     rating: "All",
//     sort: "Most Helpful",
//     photosOnly: false,
//   });
//   const [showReviewForm, setShowReviewForm] = useState(false);

//   // ===================== WISHLIST FUNCTIONS =====================
//   const checkWishlistStatus = async () => {
//     if (!product || !selectedShade) return false;
    
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get(`/api/user/wishlist/check/${product._id}`);
//         return response.data.isInWishlist || false;
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         return guestWishlist.some(item => 
//           item._id === product._id && item.sku === selectedShade.sku
//         );
//       }
//     } catch (error) {
//       console.error("Error checking wishlist status:", error);
//       return false;
//     }
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get("/api/user/wishlist");
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         setWishlistData(localWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   const toggleWishlist = async () => {
//     if (!product || !selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }

//     setWishlistLoading(true);
//     try {
//       const productId = product._id;
//       const sku = selectedShade.sku;

//       if (user && !user.guest) {
//         if (isInWishlist) {
//           await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
//             data: { sku: sku }
//           });
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           await axiosInstance.post(`/api/user/wishlist/${productId}`, { sku: sku });
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         const existingIndex = guestWishlist.findIndex(item => 
//           item._id === productId && item.sku === sku
//         );

//         if (existingIndex >= 0) {
//           guestWishlist.splice(existingIndex, 1);
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           const productData = {
//             _id: productId,
//             name: product.name,
//             brand: product.brand?.name || product.brand || "Unknown",
//             price: selectedShade.displayPrice || product.price || 0,
//             originalPrice: selectedShade.originalPrice || product.mrp || product.price || 0,
//             mrp: selectedShade.originalPrice || product.mrp || product.price || 0,
//             displayPrice: selectedShade.displayPrice || product.price || 0,
//             images: displayImages || product.images || ["/placeholder.png"],
//             image: displayImages?.[0] || product.images?.[0] || "/placeholder.png",
//             slug: product.slugs?.[0] || slug,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: selectedShade.shadeName || selectedShade.name || "Default",
//             shadeName: selectedShade.shadeName || selectedShade.name || "Default",
//             variant: selectedShade.shadeName || selectedShade.name || "Default",
//             hex: selectedShade.hex || "#cccccc",
//             stock: selectedShade.stock || 0,
//             status: selectedShade.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: reviewSummary.average || 0,
//             totalRatings: reviewSummary.count || 0,
//             commentsCount: reviewSummary.count || 0,
//             discountPercent: selectedShade.originalPrice > selectedShade.displayPrice 
//               ? Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }

//         localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//         setWishlistData(guestWishlist);
//       }

//       await fetchWishlistData();
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   useEffect(() => {
//     const updateWishlistStatus = async () => {
//       if (product && selectedShade) {
//         const status = await checkWishlistStatus();
//         setIsInWishlist(status);
//       }
//     };
//     updateWishlistStatus();
//   }, [product, selectedShade, user]);

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // ===================== PRODUCT FETCHING =====================
//   const getVariantFromQuery = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('variant');
//   };

//   const updateUrlForVariant = (variant) => {
//     if (!variant || !product) return;
//     if (variant.slug) {
//       navigate(`/product/${variant.slug}`, { replace: true });
//     } else if (variant.sku) {
//       const productSlug = product.slugs?.[0] || slug;
//       navigate(`/product/${productSlug}?variant=${variant.sku}`, { replace: true });
//     }
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         let url = `/api/user/products/${slug}`;
//         const variantParam = getVariantFromQuery();
//         if (variantParam) {
//           url += `?variant=${variantParam}`;
//         }

//         const res = await axiosInstance.get(url);
//         const data = res.data;
//         setProduct(data);

//         const isVariantSlug = data.selectedVariant && data.selectedVariant.slug === slug;

//         const variantsList = data.variants || [];
//         let defaultVariant = null;

//         if (isVariantSlug && data.selectedVariant) {
//           defaultVariant = data.selectedVariant;
//         } else if (variantParam) {
//           defaultVariant = variantsList.find(
//             v => v.sku === variantParam || v.variantSku === variantParam
//           ) || variantsList[0];
//         } else {
//           defaultVariant = variantsList.find(v => v.stock > 0) || variantsList[0];
//         }

//         if (defaultVariant) {
//           const variantData = {
//             shadeName: defaultVariant.shadeName,
//             hex: defaultVariant.hex,
//             stock: defaultVariant.stock,
//             images: defaultVariant.images || data.images || ["/placeholder.png"],
//             displayPrice: defaultVariant.displayPrice,
//             originalPrice: defaultVariant.originalPrice,
//             variantSku: defaultVariant.sku || defaultVariant.variantSku,
//             sku: defaultVariant.sku || defaultVariant.variantSku,
//             slug: defaultVariant.slug,
//             ...defaultVariant
//           };

//           setSelectedShade(variantData);
//           setDisplayImages(variantData.images);
          
//           setNewReview(prev => ({
//             ...prev,
//             variantSku: variantData.sku,
//             shadeName: variantData.shadeName
//           }));
//         } else {
//           setSelectedShade(null);
//           setDisplayImages(data.images || ["/placeholder.png"]);
//         }

//         await fetchReviewSummary(data._id);
//       } catch (err) {
//         console.error("❌ Error fetching product:", err);
//         toast.error("Product not found");
//         navigate("/404");
//       }
//     };

//     fetchProduct();
//   }, [slug, location.search, navigate]);

//   // ===================== VARIANT HANDLING =====================
//   const handleVariantSelect = (variant) => {
//     if (!variant || variant.stock <= 0) return;

//     const variantData = {
//       shadeName: variant.shadeName,
//       hex: variant.hex,
//       stock: variant.stock,
//       images: variant.images || product.images || ["/placeholder.png"],
//       displayPrice: variant.displayPrice || product.price,
//       originalPrice: variant.originalPrice || product.mrp || product.price,
//       variantSku: variant.sku || variant.variantSku,
//       sku: variant.sku || variant.variantSku,
//       slug: variant.slug,
//       ...variant
//     };

//     setSelectedShade(variantData);
//     setDisplayImages(variantData.images);
//     updateUrlForVariant(variantData);
    
//     if (showReviewForm) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: variantData.sku,
//         shadeName: variantData.shadeName
//       }));
//     }
//   };

//   // ===================== ADD TO CART FUNCTION =====================
//   const handleAddToCart = async () => {
//     if (!product) {
//       toast.error("❌ Product not found");
//       return;
//     }

//     if (!selectedShade) {
//       toast.error("❌ Please select a variant first");
//       return;
//     }

//     if (selectedShade.stock <= 0) {
//       toast.error("❌ This variant is out of stock");
//       return;
//     }

//     try {
//       const success = await addToCart(product, selectedShade, false);
//       if (success) {
//         toast.success("✅ Added to cart!");
//         setTimeout(() => navigate("/cartpage"), 1000);
//       } else {
//         toast.error("❌ Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       if (error.message === "Authentication required") {
//         toast.error("⚠️ Please log in first");
//         navigate("/login");
//       } else {
//         toast.error("❌ Failed to add product");
//       }
//     }
//   };

//   // ===================== REVIEWS FUNCTIONS =====================
//   const fetchFilteredReviews = async () => {
//     if (!product?._id) return;
//     try {
//       let query = `?sort=${filters.sort === "Most Helpful" ? "helpful" : "recent"}`;
//       if (filters.rating !== "All") query += `&stars=${filters.rating}`;
//       if (filters.photosOnly) query += `&photosOnly=true`;
//       if (filters.shade !== "All") query += `&shadeName=${encodeURIComponent(filters.shade)}`;

//       const res = await axiosInstance.get(`/api/reviews/product/${product._id}${query}`);
//       setReviews(res.data.reviews || []);

//       if (res.data.reviews?.length > 0) {
//         const avg = res.data.reviews.reduce((sum, r) => sum + r.rating, 0) / res.data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: res.data.reviews.length
//         });
//       }
//     } catch (err) {
//       console.error("Reviews fetch error", err);
//     }
//   };

//   useEffect(() => {
//     if (product?._id) {
//       fetchFilteredReviews();
//     }
//   }, [product?._id, filters]);

//   const handleReviewVariantSelect = (e) => {
//     const selectedSku = e.target.value;
//     const variantsList = product.variants || product.shadeOptions || [];
//     const selectedVariant = variantsList.find(v => v.sku === selectedSku || v.variantSku === selectedSku);
    
//     if (selectedVariant) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: selectedVariant.sku || selectedVariant.variantSku,
//         shadeName: selectedVariant.shadeName || selectedVariant.name || "Default"
//       }));
//     }
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!newReview.variantSku) {
//       toast.warn("Please select a variant for your review.");
//       return;
//     }
    
//     if (!newReview.rating || !newReview.comment) {
//       toast.warn("Rating and comment are required.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("productId", product._id);
//       formData.append("variantSku", newReview.variantSku);
//       formData.append("shadeName", newReview.shadeName);
//       formData.append("rating", newReview.rating);
//       formData.append("comment", newReview.comment);
//       reviewImages.forEach((file) => formData.append("images", file));

//       const res = await axiosInstance.post(`/api/reviews/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data.review) {
//         toast.success("✅ Review submitted!");
//         setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//         setReviewImages([]);
//         fetchFilteredReviews();
//         setShowReviewForm(false);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleHelpfulVote = async (reviewId) => {
//     try {
//       const res = await axiosInstance.post(`/api/reviews/${reviewId}/vote-helpful`);

//       setReviews(prev => prev.map(r =>
//         r._id === reviewId ? { ...r, helpfulVotes: res.data.helpfulVotes } : r
//       ));

//       setLikedReviews(prev => ({
//         ...prev,
//         [reviewId]: res.data.message === "Vote added"
//       }));

//       toast.info(res.data.message);
//     } catch (err) {
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   const fetchReviewSummary = async (productId) => {
//     try {
//       const res = await axiosInstance.get(`/api/reviews/product/${productId}/top`);
//       const data = res.data;
//       setReviews(data.reviews || []);
//       if (data.reviews?.length > 0) {
//         const avg = data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / data.reviews.length;
//         setReviewSummary({
//           average: avg.toFixed(1),
//           count: data.reviews.length,
//         });
//       } else {
//         setReviewSummary({ average: 0, count: 0 });
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching reviews:", err);
//     }
//   };

//   // Reset review form when showing/hiding
//   useEffect(() => {
//     if (showReviewForm && product && selectedShade) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: selectedShade.sku,
//         shadeName: selectedShade.shadeName
//       }));
//     } else if (!showReviewForm) {
//       setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//     }
//   }, [showReviewForm, product, selectedShade]);

//   if (!product) return <div className="text-center py-5 text-black page-title-main-name">Loading...</div>;

//   const variantsList = product.variants || product.shadeOptions || [];

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <main className="product-detail-page page-title-main-name">
//         <div className="product-detail-container">
//           {/* Product Details Hero Section */}
//           <ProductDetailsHero
//             product={product}
//             selectedShade={selectedShade}
//             displayImages={displayImages}
//             reviewSummary={reviewSummary}
//             variantsList={variantsList}
//             isInWishlist={isInWishlist}
//             wishlistLoading={wishlistLoading}
//             handleVariantSelect={handleVariantSelect}
//             toggleWishlist={toggleWishlist}
//             handleAddToCart={handleAddToCart}
//             setDisplayImages={setDisplayImages}
//             toast={toast}
//           />

//           {/* Product Description Section */}
//           {/* <ProductDetailDescription product={product} /> */}

//           {/* Customer Reviews Section */}
//           <CustomerReviews
//             product={product}
//             reviews={reviews}
//             reviewSummary={reviewSummary}
//             variantsList={variantsList}
//             filters={filters}
//             setFilters={setFilters}
//             likedReviews={likedReviews}
//             showReviewForm={showReviewForm}
//             setShowReviewForm={setShowReviewForm}
//             newReview={newReview}
//             setNewReview={setNewReview}
//             reviewImages={reviewImages}
//             setReviewImages={setReviewImages}
//             submitting={submitting}
//             handleReviewVariantSelect={handleReviewVariantSelect}
//             handleReviewSubmit={handleReviewSubmit}
//             handleHelpfulVote={handleHelpfulVote}
//           />

//           {/* Recommendations Section */}
//           <section className="recommendations-section mt-5">
//             <RecommendationSlider
//               title="You Might Also Like"
//               // products={product.recommendations?.alsoViewed?.products || []}
//               products={product.recommendations?.youMayAlsoLike?.products || []}
//             />
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;



















// // src/components/ProductDetail.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import Header from "./Header";
// import Footer from "./Footer";
// import RecommendationSlider from "./RecommendationSlider";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../utils/axiosInstance.js";
// import "../css/ProductDetail.css";

// // Import separated components
// import ProductDetailsHero from "./ProductDetailsHero";
// import ProductDetailDescription from "./ProductDetailDescription";
// import CustomerReviews from "./CustomerReviews";

// const ProductDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const [product, setProduct] = useState(null);
//   const [selectedShade, setSelectedShade] = useState(null);
//   const [displayImages, setDisplayImages] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   // Review summary matching backend aggregation
//   const [reviewSummary, setReviewSummary] = useState({
//     avgRating: 0,
//     totalReviews: 0,
//     ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
//   });
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//   const [reviewImages, setReviewImages] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [likedReviews, setLikedReviews] = useState({});
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [filters, setFilters] = useState({
//     shade: "All",
//     rating: "All",
//     sort: "Most Helpful",
//     photosOnly: false,
//   });
//   const [showReviewForm, setShowReviewForm] = useState(false);

//   // ===================== WISHLIST FUNCTIONS =====================
//   const checkWishlistStatus = async () => {
//     if (!product || !selectedShade) return false;
    
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get(`/api/user/wishlist/check/${product._id}`);
//         return response.data.isInWishlist || false;
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         return guestWishlist.some(item => 
//           item._id === product._id && item.sku === selectedShade.sku
//         );
//       }
//     } catch (error) {
//       console.error("Error checking wishlist status:", error);
//       return false;
//     }
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const response = await axiosInstance.get("/api/user/wishlist");
//         if (response.data.success) {
//           setWishlistData(response.data.wishlist || []);
//         }
//       } else {
//         const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         setWishlistData(localWishlist);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist data:", error);
//       setWishlistData([]);
//     }
//   };

//   const toggleWishlist = async () => {
//     if (!product || !selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }

//     setWishlistLoading(true);
//     try {
//       const productId = product._id;
//       const sku = selectedShade.sku;

//       if (user && !user.guest) {

        

//         if (isInWishlist) {
//           await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
//             data: { sku: sku }
//           });
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           await axiosInstance.post(`/api/user/wishlist/${productId}`, { sku: sku });
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         const existingIndex = guestWishlist.findIndex(item => 
//           item._id === productId && item.sku === sku
//         );

//         if (existingIndex >= 0) {
//           guestWishlist.splice(existingIndex, 1);
//           setIsInWishlist(false);
//           toast.success("Removed from wishlist!");
//         } else {
//           const productData = {
//             _id: productId,
//             name: product.name,
//             brand: product.brand?.name || product.brand || "Unknown",
//             price: selectedShade.displayPrice || product.price || 0,
//             originalPrice: selectedShade.originalPrice || product.mrp || product.price || 0,
//             mrp: selectedShade.originalPrice || product.mrp || product.price || 0,
//             displayPrice: selectedShade.displayPrice || product.price || 0,
//             images: displayImages || product.images || ["/placeholder.png"],
//             image: displayImages?.[0] || product.images?.[0] || "/placeholder.png",
//             slug: product.slugs?.[0] || slug,
//             sku: sku,
//             variantSku: sku,
//             variantId: sku,
//             variantName: selectedShade.shadeName || selectedShade.name || "Default",
//             shadeName: selectedShade.shadeName || selectedShade.name || "Default",
//             variant: selectedShade.shadeName || selectedShade.name || "Default",
//             hex: selectedShade.hex || "#cccccc",
//             stock: selectedShade.stock || 0,
//             status: selectedShade.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: reviewSummary.avgRating || 0,
//             totalRatings: reviewSummary.totalReviews || 0,
//             commentsCount: reviewSummary.totalReviews || 0,
//             discountPercent: selectedShade.originalPrice > selectedShade.displayPrice 
//               ? Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)
//               : 0
//           };

//           guestWishlist.push(productData);
//           setIsInWishlist(true);
//           toast.success("Added to wishlist!");
//         }

//         localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
//         setWishlistData(guestWishlist);
//       }

//       await fetchWishlistData();
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       if (error.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   useEffect(() => {
//     const updateWishlistStatus = async () => {
//       if (product && selectedShade) {
//         const status = await checkWishlistStatus();
//         setIsInWishlist(status);
//       }
//     };
//     updateWishlistStatus();
//   }, [product, selectedShade, user]);

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   // ===================== PRODUCT FETCHING =====================
//   const getVariantFromQuery = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('variant');
//   };

//   const updateUrlForVariant = (variant) => {
//     if (!variant || !product) return;
//     if (variant.slug) {
//       navigate(`/product/${variant.slug}`, { replace: true });
//     } else if (variant.sku) {
//       const productSlug = product.slugs?.[0] || slug;
//       navigate(`/product/${productSlug}?variant=${variant.sku}`, { replace: true });
//     }
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         let url = `/api/user/products/${slug}`;
//         const variantParam = getVariantFromQuery();
//         if (variantParam) {
//           url += `?variant=${variantParam}`;
//         }

//         const res = await axiosInstance.get(url);
//         const data = res.data;
//         setProduct(data);

//         // Use reviewSummary from backend if available
//         if (data.reviewSummary) {
//           setReviewSummary(data.reviewSummary);
//         } else {
//           // Fallback to product-level ratings
//           setReviewSummary({
//             avgRating: data.avgRating || 0,
//             totalReviews: data.totalRatings || 0,
//             ratingDistribution: data.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
//           });
//         }

//         const isVariantSlug = data.selectedVariant && data.selectedVariant.slug === slug;

//         const variantsList = data.variants || [];
//         let defaultVariant = null;

//         if (isVariantSlug && data.selectedVariant) {
//           defaultVariant = data.selectedVariant;
//         } else if (variantParam) {
//           defaultVariant = variantsList.find(
//             v => v.sku === variantParam || v.variantSku === variantParam
//           ) || variantsList[0];
//         } else {
//           defaultVariant = variantsList.find(v => v.stock > 0) || variantsList[0];
//         }

//         if (defaultVariant) {
//           const variantData = {
//             shadeName: defaultVariant.shadeName,
//             hex: defaultVariant.hex,
//             stock: defaultVariant.stock,
//             images: defaultVariant.images || data.images || ["/placeholder.png"],
//             displayPrice: defaultVariant.displayPrice,
//             originalPrice: defaultVariant.originalPrice,
//             variantSku: defaultVariant.sku || defaultVariant.variantSku,
//             sku: defaultVariant.sku || defaultVariant.variantSku,
//             slug: defaultVariant.slug,
//             ...defaultVariant
//           };

//           setSelectedShade(variantData);
//           setDisplayImages(variantData.images);
          
//           setNewReview(prev => ({
//             ...prev,
//             variantSku: variantData.sku,
//             shadeName: variantData.shadeName
//           }));
//         } else {
//           setSelectedShade(null);
//           setDisplayImages(data.images || ["/placeholder.png"]);
//         }
//       } catch (err) {
//         console.error("❌ Error fetching product:", err);
//         toast.error("Product not found");
//         navigate("/404");
//       }
//     };

//     fetchProduct();
//   }, [slug, location.search, navigate]);

//   // ===================== VARIANT HANDLING =====================
//   const handleVariantSelect = (variant) => {
//     if (!variant || variant.stock <= 0) return;

//     const variantData = {
//       shadeName: variant.shadeName,
//       hex: variant.hex,
//       stock: variant.stock,
//       images: variant.images || product.images || ["/placeholder.png"],
//       displayPrice: variant.displayPrice || product.price,
//       originalPrice: variant.originalPrice || product.mrp || product.price,
//       variantSku: variant.sku || variant.variantSku,
//       sku: variant.sku || variant.variantSku,
//       slug: variant.slug,
//       ...variant
//     };

//     setSelectedShade(variantData);
//     setDisplayImages(variantData.images);
//     updateUrlForVariant(variantData);
    
//     if (showReviewForm) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: variantData.sku,
//         shadeName: variantData.shadeName
//       }));
//     }
//   };

//   // ===================== ADD TO CART FUNCTION =====================
//   const handleAddToCart = async () => {
//     if (!product) {
//       toast.error("❌ Product not found");
//       return;
//     }

//     if (!selectedShade) {
//       toast.error("❌ Please select a variant first");
//       return;
//     }

//     if (selectedShade.stock <= 0) {
//       toast.error("❌ This variant is out of stock");
//       return;
//     }

//     try {
//       const success = await addToCart(product, selectedShade, false);
//       if (success) {
//         toast.success("✅ Added to cart!");
//         setTimeout(() => navigate("/cartpage"), 1000);
//       } else {
//         toast.error("❌ Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       if (error.message === "Authentication required") {
//         toast.error("⚠️ Please log in first");
//         navigate("/login");
//       } else {
//         toast.error("❌ Failed to add product");
//       }
//     }
//   };

//   // ===================== REVIEWS FUNCTIONS =====================
//   const fetchFilteredReviews = async () => {
//     if (!product?._id) return;
//     try {
//       let query = `?sort=${filters.sort === "Most Helpful" ? "helpful" : "recent"}`;
//       if (filters.rating !== "All") query += `&stars=${filters.rating}`;
//       if (filters.photosOnly) query += `&photosOnly=true`;
//       if (filters.shade !== "All") query += `&shadeName=${encodeURIComponent(filters.shade)}`;

//       const res = await axiosInstance.get(`/api/reviews/product/${product._id}${query}`);
//       setReviews(res.data.reviews || []);

//       // If the backend returns an updated summary, use it
//       if (res.data.summary) {
//         setReviewSummary(res.data.summary);
//       }
//     } catch (err) {
//       console.error("Reviews fetch error", err);
//     }
//   };

//   useEffect(() => {
//     if (product?._id) {
//       fetchFilteredReviews();
//     }
//   }, [product?._id, filters]);

//   const handleReviewVariantSelect = (e) => {
//     const selectedSku = e.target.value;
//     const variantsList = product.variants || product.shadeOptions || [];
//     const selectedVariant = variantsList.find(v => v.sku === selectedSku || v.variantSku === selectedSku);
    
//     if (selectedVariant) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: selectedVariant.sku || selectedVariant.variantSku,
//         shadeName: selectedVariant.shadeName || selectedVariant.name || "Default"
//       }));
//     }
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!newReview.variantSku) {
//       toast.warn("Please select a variant for your review.");
//       return;
//     }
    
//     if (!newReview.rating || !newReview.comment) {
//       toast.warn("Rating and comment are required.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("productId", product._id);
//       formData.append("variantSku", newReview.variantSku);
//       formData.append("shadeName", newReview.shadeName);
//       formData.append("rating", newReview.rating);
//       formData.append("comment", newReview.comment);
//       reviewImages.forEach((file) => formData.append("images", file));

//       const res = await axiosInstance.post(`/api/reviews/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       if (res.data.review) {
//         toast.success("✅ Review submitted!");
//         setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//         setReviewImages([]);
//         // Refresh reviews and summary
//         await fetchFilteredReviews();
//         if (res.data.summary) {
//           setReviewSummary(res.data.summary);
//         }
//         setShowReviewForm(false);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleHelpfulVote = async (reviewId) => {
//     try {
//       const res = await axiosInstance.post(`/api/reviews/${reviewId}/vote-helpful`);

//       setReviews(prev => prev.map(r =>
//         r._id === reviewId ? { ...r, helpfulVotes: res.data.helpfulVotes } : r
//       ));

//       setLikedReviews(prev => ({
//         ...prev,
//         [reviewId]: res.data.message === "Vote added"
//       }));

//       toast.info(res.data.message);
//     } catch (err) {
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   // Reset review form when showing/hiding
//   useEffect(() => {
//     if (showReviewForm && product && selectedShade) {
//       setNewReview(prev => ({
//         ...prev,
//         variantSku: selectedShade.sku,
//         shadeName: selectedShade.shadeName
//       }));
//     } else if (!showReviewForm) {
//       setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
//     }
//   }, [showReviewForm, product, selectedShade]);

//   if (!product) return <div className="text-center py-5 text-black page-title-main-name">Loading...</div>;

//   const variantsList = product.variants || product.shadeOptions || [];

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <main className="product-detail-page page-title-main-name">
//         <div className="product-detail-container">
//           {/* Product Details Hero Section */}
//           <ProductDetailsHero
//             product={product}
//             selectedShade={selectedShade}
//             displayImages={displayImages}
//             reviewSummary={reviewSummary}
//             variantsList={variantsList}
//             isInWishlist={isInWishlist}
//             wishlistLoading={wishlistLoading}
//             handleVariantSelect={handleVariantSelect}
//             toggleWishlist={toggleWishlist}
//             handleAddToCart={handleAddToCart}
//             setDisplayImages={setDisplayImages}
//             toast={toast}
//           />

//           {/* Product Description Section */}
//           {/* <ProductDetailDescription product={product} /> */}

//           {/* Customer Reviews Section */}
//           <CustomerReviews
//             product={product}
//             reviews={reviews}
//             reviewSummary={reviewSummary}
//             variantsList={variantsList}
//             filters={filters}
//             setFilters={setFilters}
//             likedReviews={likedReviews}
//             showReviewForm={showReviewForm}
//             setShowReviewForm={setShowReviewForm}
//             newReview={newReview}
//             setNewReview={setNewReview}
//             reviewImages={reviewImages}
//             setReviewImages={setReviewImages}
//             submitting={submitting}
//             handleReviewVariantSelect={handleReviewVariantSelect}
//             handleReviewSubmit={handleReviewSubmit}
//             handleHelpfulVote={handleHelpfulVote}
//           />

//           {/* Recommendations Section */}
//           <section className="recommendations-section mt-5">
//             <RecommendationSlider
//               title="You Might Also Like"
//               products={product.recommendations?.youMayAlsoLike?.products || []}
//             />
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;









// src/components/ProductDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { UserContext } from "./UserContext";
import Header from "./Header";
import Footer from "./Footer";
import RecommendationSlider from "./RecommendationSlider";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance.js";
import "../css/ProductDetail.css";

// Import separated components
import ProductDetailsHero from "./ProductDetailsHero";
import ProductDetailDescription from "./ProductDetailDescription";
import CustomerReviews from "./CustomerReviews";

// 🆕 Import Lottie loader
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const [product, setProduct] = useState(null);
  const [selectedShade, setSelectedShade] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    variantSku: "",
    shadeName: "",
  });
  const [reviewImages, setReviewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistData, setWishlistData] = useState([]);
  const [filters, setFilters] = useState({
    shade: "All",
    rating: "All",
    sort: "Most Helpful",
    photosOnly: false,
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  /* ===================== WISHLIST FUNCTIONS ===================== */
  const checkWishlistStatus = async () => {
    if (!product || !selectedShade) return false;
    try {
      if (user && !user.guest) {
        const response = await axiosInstance.get(
          `/api/user/wishlist/check/${product._id}`
        );
        return response.data.isInWishlist || false;
      } else {
        const guestWishlist =
          JSON.parse(localStorage.getItem("guestWishlist")) || [];
        return guestWishlist.some(
          (item) =>
            item._id === product._id && item.sku === selectedShade.sku
        );
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      return false;
    }
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axiosInstance.get("/api/user/wishlist");
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist =
          JSON.parse(localStorage.getItem("guestWishlist")) || [];
        setWishlistData(localWishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWishlistData([]);
    }
  };

  const toggleWishlist = async () => {
    if (!product || !selectedShade) {
      toast.warn("Please select a variant first");
      return;
    }
    setWishlistLoading(true);
    try {
      const productId = product._id;
      const sku = selectedShade.sku;

      if (user && !user.guest) {
        if (isInWishlist) {
          await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
            data: { sku: sku },
          });
          setIsInWishlist(false);
          toast.success("Removed from wishlist!");
        } else {
          await axiosInstance.post(`/api/user/wishlist/${productId}`, {
            sku: sku,
          });
          setIsInWishlist(true);
          toast.success("Added to wishlist!");
        }
      } else {
        const guestWishlist =
          JSON.parse(localStorage.getItem("guestWishlist")) || [];
        const existingIndex = guestWishlist.findIndex(
          (item) => item._id === productId && item.sku === sku
        );

        if (existingIndex >= 0) {
          guestWishlist.splice(existingIndex, 1);
          setIsInWishlist(false);
          toast.success("Removed from wishlist!");
        } else {
          const productData = {
            _id: productId,
            name: product.name,
            brand: product.brand?.name || product.brand || "Unknown",
            price: selectedShade.displayPrice || product.price || 0,
            originalPrice:
              selectedShade.originalPrice || product.mrp || product.price || 0,
            mrp: selectedShade.originalPrice || product.mrp || product.price || 0,
            displayPrice: selectedShade.displayPrice || product.price || 0,
            images: displayImages || product.images || ["/placeholder.png"],
            image:
              displayImages?.[0] || product.images?.[0] || "/placeholder.png",
            slug: product.slugs?.[0] || slug,
            sku: sku,
            variantSku: sku,
            variantId: sku,
            variantName:
              selectedShade.shadeName || selectedShade.name || "Default",
            shadeName:
              selectedShade.shadeName || selectedShade.name || "Default",
            variant: selectedShade.shadeName || selectedShade.name || "Default",
            hex: selectedShade.hex || "#cccccc",
            stock: selectedShade.stock || 0,
            status: selectedShade.stock > 0 ? "inStock" : "outOfStock",
            avgRating: reviewSummary.avgRating || 0,
            totalRatings: reviewSummary.totalReviews || 0,
            commentsCount: reviewSummary.totalReviews || 0,
            discountPercent:
              selectedShade.originalPrice > selectedShade.displayPrice
                ? Math.round(
                    ((selectedShade.originalPrice - selectedShade.displayPrice) /
                      selectedShade.originalPrice) *
                      100
                  )
                : 0,
          };

          guestWishlist.push(productData);
          setIsInWishlist(true);
          toast.success("Added to wishlist!");
        }

        localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
        setWishlistData(guestWishlist);
      }

      await fetchWishlistData();
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to use wishlist");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update wishlist"
        );
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    const updateWishlistStatus = async () => {
      if (product && selectedShade) {
        const status = await checkWishlistStatus();
        setIsInWishlist(status);
      }
    };
    updateWishlistStatus();
  }, [product, selectedShade, user]);

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  /* ===================== PRODUCT FETCHING ===================== */
  const getVariantFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("variant");
  };

  const updateUrlForVariant = (variant) => {
    if (!variant || !product) return;
    if (variant.slug) {
      navigate(`/product/${variant.slug}`, { replace: true });
    } else if (variant.sku) {
      const productSlug = product.slugs?.[0] || slug;
      navigate(`/product/${productSlug}?variant=${variant.sku}`, {
        replace: true,
      });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let url = `/api/user/products/${slug}`;
        const variantParam = getVariantFromQuery();
        if (variantParam) {
          url += `?variant=${variantParam}`;
        }

        const res = await axiosInstance.get(url);
        const data = res.data;
        setProduct(data);

        if (data.reviewSummary) {
          setReviewSummary(data.reviewSummary);
        } else {
          setReviewSummary({
            avgRating: data.avgRating || 0,
            totalReviews: data.totalRatings || 0,
            ratingDistribution: data.ratingDistribution || {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
            },
          });
        }

        const isVariantSlug =
          data.selectedVariant && data.selectedVariant.slug === slug;

        const variantsList = data.variants || [];
        let defaultVariant = null;

        if (isVariantSlug && data.selectedVariant) {
          defaultVariant = data.selectedVariant;
        } else if (variantParam) {
          defaultVariant =
            variantsList.find(
              (v) =>
                v.sku === variantParam || v.variantSku === variantParam
            ) || variantsList[0];
        } else {
          defaultVariant =
            variantsList.find((v) => v.stock > 0) || variantsList[0];
        }

        if (defaultVariant) {
          const variantData = {
            shadeName: defaultVariant.shadeName,
            hex: defaultVariant.hex,
            stock: defaultVariant.stock,
            images: defaultVariant.images || data.images || ["/placeholder.png"],
            displayPrice: defaultVariant.displayPrice,
            originalPrice: defaultVariant.originalPrice,
            variantSku: defaultVariant.sku || defaultVariant.variantSku,
            sku: defaultVariant.sku || defaultVariant.variantSku,
            slug: defaultVariant.slug,
            ...defaultVariant,
          };

          setSelectedShade(variantData);
          setDisplayImages(variantData.images);

          setNewReview((prev) => ({
            ...prev,
            variantSku: variantData.sku,
            shadeName: variantData.shadeName,
          }));
        } else {
          setSelectedShade(null);
          setDisplayImages(data.images || ["/placeholder.png"]);
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        toast.error("Product not found");
        navigate("/404");
      }
    };

    fetchProduct();
  }, [slug, location.search, navigate]);

  /* ===================== VARIANT HANDLING ===================== */
  const handleVariantSelect = (variant) => {
    if (!variant || variant.stock <= 0) return;

    const variantData = {
      shadeName: variant.shadeName,
      hex: variant.hex,
      stock: variant.stock,
      images: variant.images || product.images || ["/placeholder.png"],
      displayPrice: variant.displayPrice || product.price,
      originalPrice: variant.originalPrice || product.mrp || product.price,
      variantSku: variant.sku || variant.variantSku,
      sku: variant.sku || variant.variantSku,
      slug: variant.slug,
      ...variant,
    };

    setSelectedShade(variantData);
    setDisplayImages(variantData.images);
    updateUrlForVariant(variantData);

    if (showReviewForm) {
      setNewReview((prev) => ({
        ...prev,
        variantSku: variantData.sku,
        shadeName: variantData.shadeName,
      }));
    }
  };

  /* ===================== ADD TO CART FUNCTION ===================== */
  const handleAddToCart = async () => {
    if (!product) {
      toast.error("❌ Product not found");
      return;
    }

    if (!selectedShade) {
      toast.error("❌ Please select a variant first");
      return;
    }

    if (selectedShade.stock <= 0) {
      toast.error("❌ This variant is out of stock");
      return;
    }

    try {
      const success = await addToCart(product, selectedShade, false);
      if (success) {
        toast.success("✅ Added to cart!");
        setTimeout(() => navigate("/cartpage"), 1000);
      } else {
        toast.error("❌ Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.message === "Authentication required") {
        toast.error("⚠️ Please log in first");
        navigate("/login");
      } else {
        toast.error("❌ Failed to add product");
      }
    }
  };

  /* ===================== REVIEWS FUNCTIONS ===================== */
  const fetchFilteredReviews = async () => {
    if (!product?._id) return;
    try {
      let query = `?sort=${
        filters.sort === "Most Helpful" ? "helpful" : "recent"
      }`;
      if (filters.rating !== "All") query += `&stars=${filters.rating}`;
      if (filters.photosOnly) query += `&photosOnly=true`;
      if (filters.shade !== "All")
        query += `&shadeName=${encodeURIComponent(filters.shade)}`;

      const res = await axiosInstance.get(
        `/api/reviews/product/${product._id}${query}`
      );
      setReviews(res.data.reviews || []);

      if (res.data.summary) {
        setReviewSummary(res.data.summary);
      }
    } catch (err) {
      console.error("Reviews fetch error", err);
    }
  };

  useEffect(() => {
    if (product?._id) {
      fetchFilteredReviews();
    }
  }, [product?._id, filters]);

  const handleReviewVariantSelect = (e) => {
    const selectedSku = e.target.value;
    const variantsList = product.variants || product.shadeOptions || [];
    const selectedVariant = variantsList.find(
      (v) => v.sku === selectedSku || v.variantSku === selectedSku
    );

    if (selectedVariant) {
      setNewReview((prev) => ({
        ...prev,
        variantSku: selectedVariant.sku || selectedVariant.variantSku,
        shadeName: selectedVariant.shadeName || selectedVariant.name || "Default",
      }));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.variantSku) {
      toast.warn("Please select a variant for your review.");
      return;
    }

    if (!newReview.rating || !newReview.comment) {
      toast.warn("Rating and comment are required.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productId", product._id);
      formData.append("variantSku", newReview.variantSku);
      formData.append("shadeName", newReview.shadeName);
      formData.append("rating", newReview.rating);
      formData.append("comment", newReview.comment);
      reviewImages.forEach((file) => formData.append("images", file));

      const res = await axiosInstance.post(`/api/reviews/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.review) {
        toast.success("✅ Review submitted!");
        setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
        setReviewImages([]);
        await fetchFilteredReviews();
        if (res.data.summary) {
          setReviewSummary(res.data.summary);
        }
        setShowReviewForm(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    try {
      const res = await axiosInstance.post(
        `/api/reviews/${reviewId}/vote-helpful`
      );

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, helpfulVotes: res.data.helpfulVotes }
            : r
        )
      );

      setLikedReviews((prev) => ({
        ...prev,
        [reviewId]: res.data.message === "Vote added",
      }));

      toast.info(res.data.message);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    if (showReviewForm && product && selectedShade) {
      setNewReview((prev) => ({
        ...prev,
        variantSku: selectedShade.sku,
        shadeName: selectedShade.shadeName,
      }));
    } else if (!showReviewForm) {
      setNewReview({ rating: 0, comment: "", variantSku: "", shadeName: "" });
    }
  }, [showReviewForm, product, selectedShade]);

  /* ─────────────────────────────────────────────────────────────────
     🆕 LOTTIE LOADER – replaces the plain "Loading..." text
     Uses the same animation URL as the ProductPage
  ───────────────────────────────────────────────────────────────── */
  if (!product) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundColor: "rgba(255,255,255,0.97)",
          zIndex: 9999,
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="text-center">
          <DotLottieReact
            className="mb-4"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
          <p className="text-muted mb-0 page-title-main-name">
            Fetching product details...
          </p>
        </div>
      </div>
    );
  }

  const variantsList = product.variants || product.shadeOptions || [];

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="product-detail-page page-title-main-name">
        <div className="product-detail-container">
          <ProductDetailsHero
            product={product}
            selectedShade={selectedShade}
            displayImages={displayImages}
            reviewSummary={reviewSummary}
            variantsList={variantsList}
            isInWishlist={isInWishlist}
            wishlistLoading={wishlistLoading}
            handleVariantSelect={handleVariantSelect}
            toggleWishlist={toggleWishlist}
            handleAddToCart={handleAddToCart}
            setDisplayImages={setDisplayImages}
            toast={toast}
          />

          {/* <ProductDetailDescription product={product} /> */}

          <CustomerReviews
            product={product}
            reviews={reviews}
            reviewSummary={reviewSummary}
            variantsList={variantsList}
            filters={filters}
            setFilters={setFilters}
            likedReviews={likedReviews}
            showReviewForm={showReviewForm}
            setShowReviewForm={setShowReviewForm}
            newReview={newReview}
            setNewReview={setNewReview}
            reviewImages={reviewImages}
            setReviewImages={setReviewImages}
            submitting={submitting}
            handleReviewVariantSelect={handleReviewVariantSelect}
            handleReviewSubmit={handleReviewSubmit}
            handleHelpfulVote={handleHelpfulVote}
          />

          <section className="recommendations-section mt-5">
            <RecommendationSlider
              title="You Might Also Like"
              products={product.recommendations?.youMayAlsoLike?.products || []}
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;








//=============================================================Done-Code(End)==========================================================













