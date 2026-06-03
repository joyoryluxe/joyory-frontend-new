// // // src/components/ProductDetailsHero.jsx
// // import React from "react";
// // import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// // import Addtocard from "./Addtocard";

// // const ProductDetailsHero = ({
// //   product,
// //   selectedShade,
// //   displayImages,
// //   reviewSummary,
// //   variantsList,
// //   isInWishlist,
// //   wishlistLoading,
// //   handleVariantSelect,
// //   toggleWishlist,
// //   handleAddToCart,
// //   setDisplayImages
// // }) => {
// //   return (
// //     <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4">
// //       <div className="product-image-section" style={{ display: "flex", gap: "16px" }}>
// //         {/* Thumbnails */}
// //         <div className="thumbnail-list" style={{
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "12px",
// //           maxHeight: "320px",
// //           overflowY: displayImages.length > 5 ? "auto" : "visible",
// //           paddingRight: "4px",
// //         }}>
// //           {displayImages.map((img, idx) => (
// //             <img
// //               key={idx}
// //               src={img}
// //               alt={`thumbnail-${idx}`}
// //               style={{
// //                 width: "60px",
// //                 height: "60px",
// //                 objectFit: "cover",
// //                 borderRadius: "6px",
// //                 border: "2px solid #ddd",
// //                 cursor: "pointer",
// //               }}
// //               onClick={() => {
// //                 const newImages = [...displayImages];
// //                 [newImages[0], newImages[idx]] = [newImages[idx], newImages[0]];
// //                 setDisplayImages(newImages);
// //               }}
// //             />
// //           ))}
// //         </div>

// //         {/* Main Image with Wishlist Button */}
// //         <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
// //           <img
// //             src={displayImages?.[0] || "/placeholder.png"}
// //             alt={product.name}
// //             className="product-image"
// //             style={{ maxHeight: "400px" }}
// //           />

// //           {/* Wishlist Icon on Image */}
// //           <button
// //             className="wishlist-icon-btn"
// //             onClick={toggleWishlist}
// //             disabled={wishlistLoading || !selectedShade}
// //             style={{
// //               position: 'absolute',
// //               top: '15px',
// //               right: '15px',
// //               cursor: wishlistLoading ? 'not-allowed' : 'pointer',
// //               color: isInWishlist ? '#dc3545' : '#666',
// //               fontSize: '24px',
// //               zIndex: 2,
// //               borderRadius: '50%',
// //               width: '40px',
// //               height: '40px',
// //               display: 'flex',
// //               alignItems: 'center',
// //               justifyContent: 'center',
// //               transition: 'all 0.3s ease',
// //               backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //               border: 'none',
// //               boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
// //             }}
// //             title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
// //           >
// //             {wishlistLoading ? (
// //               <div className="spinner-border spinner-border-sm" role="status"></div>
// //             ) : isInWishlist ? (
// //               <FaHeart />
// //             ) : (
// //               <FaRegHeart />
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Product Info Section */}
// //       <div className="product-info-section">
// //         <p className="brand-variant mt-3">
// //           {product.brand?.name || product.brand || "Unknown Brand"}
// //         </p>

// //         <div className="d-flex flex-wrap gap-2 align-items-center">
// //           <h1 className="product-name fs-4">{product.name}</h1>
// //           {selectedShade && (
// //             <span className="text-muted fs-5" style={{ fontWeight: '500' }}>
// //               - {selectedShade.shadeName}
// //             </span>
// //           )}
// //         </div>

// //         {/* Variants Selection */}
// //         {variantsList.length > 0 && (
// //           <div className="option-group mt-3">
// //             <span className="option-label fs-6 mb-2 d-block">Select Variant</span>
// //             <div className="variant-list d-flex gap-2 flex-wrap">
// //               {variantsList.map((v, idx) => {
// //                 const isSelected = selectedShade?.sku === (v.sku || v.variantSku);
// //                 const isOutOfStock = v.stock <= 0;

// //                 return v.hex ? (
// //                   <div
// //                     key={`color-${idx}`}
// //                     className={`color-circles ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
// //                     style={{
// //                       backgroundColor: v.hex,
// //                       width: "30px",
// //                       height: "30px",
// //                       borderRadius: "50%",
// //                       cursor: isOutOfStock ? "not-allowed" : "pointer",
// //                       border: isSelected ? "3px solid #0077b6" : "2px solid #ddd",
// //                       opacity: isOutOfStock ? 0.5 : 1,
// //                     }}
// //                     onClick={() => !isOutOfStock && handleVariantSelect(v)}
// //                     title={`${v.shadeName || "Variant"} ${isOutOfStock ? '(Out of Stock)' : ''}`}
// //                   >
// //                     {isOutOfStock && (
// //                       <div className="out-of-stock-indicator"></div>
// //                     )}
// //                   </div>
// //                 ) : (
// //                   <button
// //                     key={`text-${idx}`}
// //                     className={`text-variant ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
// //                     style={{
// //                       padding: "6px 12px",
// //                       borderRadius: "6px",
// //                       border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
// //                       backgroundColor: isSelected ? "#e3f2fd" : "#f8f9fa",
// //                       cursor: isOutOfStock ? "not-allowed" : "pointer",
// //                       fontSize: "14px",
// //                       fontWeight: isSelected ? 600 : 400,
// //                       opacity: isOutOfStock ? 0.5 : 1
// //                     }}
// //                     onClick={() => !isOutOfStock && handleVariantSelect(v)}
// //                     disabled={isOutOfStock}
// //                   >
// //                     {v.shadeName || v.size || `Variant ${idx + 1}`}
// //                   </button>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         )}

// //         {/* Rating */}
// //         <div className="product-rating mt-3">
// //           {[...Array(5)].map((_, index) => (
// //             <FaStar
// //               key={index}
// //               className="fs-5"
// //               color={index < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"}
// //             />
// //           ))}
// //           <span className="rating-count ms-2">
// //             {reviewSummary.average} / 5 ({reviewSummary.count} review{reviewSummary.count !== 1 ? 's' : ''})
// //           </span>
// //         </div>

// //         {/* Price */}
// //         <div className="product-price d-flex align-items-center gap-3 mt-3">
// //           <span className="text-success fw-bold fs-3">
// //             ₹{selectedShade?.displayPrice || product.price || "0"}
// //           </span>
// //           {selectedShade?.originalPrice > selectedShade?.displayPrice && (
// //             <>
// //               <del className="text-muted fs-5">₹{selectedShade.originalPrice}</del>
// //               <span className="discount-badge text-danger fw-bold">
// //                 {Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)}% OFF
// //               </span>
// //             </>
// //           )}
// //         </div>

// //         {/* Stock Status */}
// //         <div className="stock-status mt-2 mb-3 text-start">
// //           {selectedShade ? (
// //             selectedShade.stock > 0 ? (
// //               <span className="text-success">
// //                 {/* <i className="bi bi-check-circle me-1"></i> */}
// //                 {/* In Stock ({selectedShade.stock} available) */}
// //               </span>
// //             ) : (
// //               <span className="text-danger">
// //                 <i className="bi bi-x-circle me-1"></i>
// //                 Out of Stock
// //               </span>
// //             )
// //           ) : (
// //             <span className="text-warning">Select a variant to see stock</span>
// //           )}
// //         </div>

// //         {/* Action Buttons: Wishlist & Add to Cart */}
// //         <div className="action-buttons d-flex flex-column flex-md-row gap-3 mt-4">
// //           {/* Wishlist Button */}
// //           <button
// //             className={`wishlist-main-btn ${isInWishlist ? 'active' : ''}`}
// //             onClick={toggleWishlist}
// //             disabled={wishlistLoading || !selectedShade}
// //             style={{
// //               minWidth: "180px",
// //               padding: "12px 20px",
// //               border: `2px solid ${isInWishlist ? '#dc3545' : '#dee2e6'}`,
// //               backgroundColor: isInWishlist ? '#dc3545' : 'transparent',
// //               color: isInWishlist ? 'white' : '#333',
// //               borderRadius: "8px",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               gap: "10px",
// //               fontWeight: "600",
// //               fontSize: "16px",
// //               cursor: wishlistLoading ? "not-allowed" : "pointer",
// //               transition: "all 0.3s ease"
// //             }}
// //           >
// //             {wishlistLoading ? (
// //               <>
// //                 <div className="spinner-border spinner-border-sm"></div>
// //                 <span>Processing...</span>
// //               </>
// //             ) : isInWishlist ? (
// //               <>
// //                 <FaHeart /> Remove from Wishlist
// //               </>
// //             ) : (
// //               <>
// //                 <FaRegHeart /> Add to Wishlist
// //               </>
// //             )}
// //           </button>

// //           {/* Add to Cart Button */}
// //           <div style={{ flex: 1 }}>
// //             <Addtocard
// //               prod={product}
// //               selectedShade={selectedShade}
// //               onAddToCart={handleAddToCart}
// //             />
// //           </div>
// //         </div>

// //         {/* Wishlist Note */}
// //         {!selectedShade && (
// //           <div className="alert alert-warning mt-3">
// //             <small>Please select a variant before adding to wishlist</small>
// //           </div>
// //         )}
// //       </div>
// //     </article>
// //   );
// // };

// // export default ProductDetailsHero;






















// // // src/components/ProductDetailsHero.jsx
// // import React, { useState } from "react";
// // import { FaStar, FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";

// // const ProductDetailsHero = ({
// //   product,
// //   selectedShade,
// //   displayImages,
// //   reviewSummary,
// //   variantsList,
// //   isInWishlist,
// //   wishlistLoading,
// //   handleVariantSelect,
// //   toggleWishlist,
// //   handleAddToCart,
// //   setDisplayImages,
// //   toast
// // }) => {
// //   const [addingToCart, setAddingToCart] = useState(false);

// //   // Custom Add to Cart function
// //   const handleAddToCartClick = async () => {
// //     if (!selectedShade) {
// //       toast.warn("Please select a variant first");
// //       return;
// //     }

// //     setAddingToCart(true);
// //     try {
// //       await handleAddToCart();
// //     } catch (error) {
// //       console.error("Error adding to cart:", error);
// //     } finally {
// //       setAddingToCart(false);
// //     }
// //   };

// //   return (
// //     <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4">
// //       <div className="product-image-section" style={{ display: "flex", gap: "16px" }}>
// //         {/* Thumbnails */}
// //         <div className="thumbnail-list" style={{
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "12px",
// //           maxHeight: "320px",
// //           overflowY: displayImages.length > 5 ? "auto" : "visible",
// //           paddingRight: "4px",
// //         }}>
// //           {displayImages.map((img, idx) => (
// //             <img
// //               key={idx}
// //               src={img}
// //               alt={`thumbnail-${idx}`}
// //               style={{
// //                 width: "60px",
// //                 height: "60px",
// //                 objectFit: "cover",
// //                 borderRadius: "6px",
// //                 border: "2px solid #ddd",
// //                 cursor: "pointer",
// //               }}
// //               onClick={() => {
// //                 const newImages = [...displayImages];
// //                 [newImages[0], newImages[idx]] = [newImages[idx], newImages[0]];
// //                 setDisplayImages(newImages);
// //               }}
// //             />
// //           ))}
// //         </div>

// //         {/* Main Image with Wishlist Button */}
// //         <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
// //           <img
// //             src={displayImages?.[0] || "/placeholder.png"}
// //             alt={product.name}
// //             className="product-image"
// //             style={{ maxHeight: "400px" }}
// //           />

// //           {/* Wishlist Icon on Image */}
// //           <button
// //             className="wishlist-icon-btn"
// //             onClick={toggleWishlist}
// //             disabled={wishlistLoading || !selectedShade}
// //             style={{
// //               position: 'absolute',
// //               top: '15px',
// //               right: '15px',
// //               cursor: wishlistLoading ? 'not-allowed' : 'pointer',
// //               color: isInWishlist ? '#dc3545' : '#666',
// //               fontSize: '24px',
// //               zIndex: 2,
// //               borderRadius: '50%',
// //               width: '40px',
// //               height: '40px',
// //               display: 'flex',
// //               alignItems: 'center',
// //               justifyContent: 'center',
// //               transition: 'all 0.3s ease',
// //               backgroundColor: 'rgba(255, 255, 255, 0.9)',
// //               border: 'none',
// //               boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
// //             }}
// //             title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
// //           >
// //             {wishlistLoading ? (
// //               <div className="spinner-border spinner-border-sm" role="status"></div>
// //             ) : isInWishlist ? (
// //               <FaHeart />
// //             ) : (
// //               <FaRegHeart />
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Product Info Section */}
// //       <div className="product-info-section">
// //         <p className="brand-variant mt-3">
// //           {product.brand?.name || product.brand || "Unknown Brand"}
// //         </p>

// //         <div className="d-flex flex-wrap gap-2 align-items-center">
// //           <h1 className="product-name fs-4">{product.name}</h1>
// //           {selectedShade && (
// //             <span className="text-muted fs-5" style={{ fontWeight: '500' }}>
// //               - {selectedShade.shadeName}
// //             </span>
// //           )}
// //         </div>

// //         {/* Variants Selection */}
// //         {variantsList.length > 0 && (
// //           <div className="option-group mt-3">
// //             <span className="option-label fs-6 mb-2 d-block">Select Variant</span>
// //             <div className="variant-list d-flex gap-2 flex-wrap">
// //               {variantsList.map((v, idx) => {
// //                 const isSelected = selectedShade?.sku === (v.sku || v.variantSku);
// //                 const isOutOfStock = v.stock <= 0;

// //                 return v.hex ? (
// //                   <div
// //                     key={`color-${idx}`}
// //                     className={`color-circles ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
// //                     style={{
// //                       backgroundColor: v.hex,
// //                       width: "30px",
// //                       height: "30px",
// //                       borderRadius: "50%",
// //                       cursor: isOutOfStock ? "not-allowed" : "pointer",
// //                       border: isSelected ? "3px solid #0077b6" : "2px solid #ddd",
// //                       opacity: isOutOfStock ? 0.5 : 1,
// //                     }}
// //                     onClick={() => !isOutOfStock && handleVariantSelect(v)}
// //                     title={`${v.shadeName || "Variant"} ${isOutOfStock ? '(Out of Stock)' : ''}`}
// //                   >
// //                     {isOutOfStock && (
// //                       <div className="out-of-stock-indicator"></div>
// //                     )}
// //                   </div>
// //                 ) : (
// //                   <button
// //                     key={`text-${idx}`}
// //                     className={`text-variant ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
// //                     style={{
// //                       padding: "6px 12px",
// //                       borderRadius: "6px",
// //                       border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
// //                       backgroundColor: isSelected ? "#e3f2fd" : "#f8f9fa",
// //                       cursor: isOutOfStock ? "not-allowed" : "pointer",
// //                       fontSize: "14px",
// //                       fontWeight: isSelected ? 600 : 400,
// //                       opacity: isOutOfStock ? 0.5 : 1
// //                     }}
// //                     onClick={() => !isOutOfStock && handleVariantSelect(v)}
// //                     disabled={isOutOfStock}
// //                   >
// //                     {v.shadeName || v.size || `Variant ${idx + 1}`}
// //                   </button>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         )}

// //         {/* Rating */}
// //         <div className="product-rating mt-3">
// //           {[...Array(5)].map((_, index) => (
// //             <FaStar
// //               key={index}
// //               className="fs-5"
// //               color={index < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"}
// //             />
// //           ))}
// //           <span className="rating-count ms-2">
// //             {reviewSummary.average} / 5 ({reviewSummary.count} review{reviewSummary.count !== 1 ? 's' : ''})
// //           </span>
// //         </div>

// //         {/* Price */}
// //         <div className="product-price d-flex align-items-center gap-3 mt-3">
// //           <span className="text-success fw-bold fs-3">
// //             ₹{selectedShade?.displayPrice || product.price || "0"}
// //           </span>
// //           {selectedShade?.originalPrice > selectedShade?.displayPrice && (
// //             <>
// //               <del className="text-muted fs-5">₹{selectedShade.originalPrice}</del>
// //               <span className="discount-badge text-danger fw-bold">
// //                 {Math.round(((selectedShade.originalPrice - selectedShade.displayPrice) / selectedShade.originalPrice) * 100)}% OFF
// //               </span>
// //             </>
// //           )}
// //         </div>

// //         {/* Stock Status */}
// //         <div className="stock-status mt-2 mb-3 text-start">
// //           {selectedShade ? (
// //             selectedShade.stock > 0 ? (
// //               <span className="text-success">
// //                 {/* <i className="bi bi-check-circle me-1"></i> */}
// //                 {/* In Stock ({selectedShade.stock} available) */}
// //               </span>
// //             ) : (
// //               <span className="text-danger">
// //                 <i className="bi bi-x-circle me-1"></i>
// //                 Out of Stock
// //               </span>
// //             )
// //           ) : (
// //             <span className="text-warning">Select a variant to see stock</span>
// //           )}
// //         </div>

// //         {/* Action Buttons: Wishlist & Add to Cart */}
// //         <div className="action-buttons d-flex flex-column flex-md-row gap-3 mt-4">
// //           {/* Wishlist Button */}
// //           <button
// //             className={`wishlist-main-btn ${isInWishlist ? 'active' : ''}`}
// //             onClick={toggleWishlist}
// //             disabled={wishlistLoading || !selectedShade}
// //             style={{
// //               minWidth: "180px",
// //               padding: "12px 20px",
// //               border: `2px solid ${isInWishlist ? '#dc3545' : '#dee2e6'}`,
// //               backgroundColor: isInWishlist ? '#dc3545' : 'transparent',
// //               color: isInWishlist ? 'white' : '#333',
// //               borderRadius: "8px",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               gap: "10px",
// //               fontWeight: "600",
// //               fontSize: "16px",
// //               cursor: wishlistLoading ? "not-allowed" : "pointer",
// //               transition: "all 0.3s ease"
// //             }}
// //           >
// //             {wishlistLoading ? (
// //               <>
// //                 <div className="spinner-border spinner-border-sm"></div>
// //                 <span>Processing...</span>
// //               </>
// //             ) : isInWishlist ? (
// //               <>
// //                 <FaHeart /> Remove from Wishlist
// //               </>
// //             ) : (
// //               <>
// //                 <FaRegHeart /> Add to Wishlist
// //               </>
// //             )}
// //           </button>

// //           {/* Add to Cart Button - Inline Component */}
// //           <div style={{ flex: 1 }}>
// //             <button
// //               className="btn btn-dark d-flex align-items-center justify-content-center gap-2"
// //               onClick={handleAddToCartClick}
// //               disabled={addingToCart || (selectedShade?.stock <= 0)}
// //               style={{
// //                 width: "100%",
// //                 padding: "12px 20px",
// //                 border: "2px solid #343a40",
// //                 backgroundColor: "#343a40",
// //                 color: "white",
// //                 borderRadius: "8px",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 gap: "10px",
// //                 fontWeight: "600",
// //                 fontSize: "16px",
// //                 cursor: addingToCart ? "not-allowed" : "pointer",
// //                 transition: "all 0.3s ease"
// //               }}
// //             >
// //               {addingToCart ? (
// //                 <>
// //                   <div className="spinner-border spinner-border-sm"></div>
// //                   <span>Adding...</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <FaShoppingBag />
// //                   <span>Add To Bag</span>
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Wishlist Note */}
// //         {!selectedShade && (
// //           <div className="alert alert-warning mt-3">
// //             <small>Please select a variant before adding to wishlist</small>
// //           </div>
// //         )}
// //       </div>
// //     </article>
// //   );
// // };

// // export default ProductDetailsHero;

















// // src/components/ProductDetailsHero.jsx
// import React, { useState, useRef } from "react";
// import { FaStar, FaHeart, FaRegHeart, FaShoppingBag, FaChevronUp, FaChevronDown } from "react-icons/fa";

// const ProductDetailsHero = ({
//   product,
//   selectedShade,
//   displayImages,
//   reviewSummary,
//   variantsList,
//   isInWishlist,
//   wishlistLoading,
//   handleVariantSelect,
//   toggleWishlist,
//   handleAddToCart,
//   setDisplayImages,
//   toast
// }) => {
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
//   const thumbnailsPerView = 4;
//   const thumbnailContainerRef = useRef(null);

//   // Custom Add to Cart function
//   const handleAddToCartClick = async () => {
//     if (!selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }

//     setAddingToCart(true);
//     try {
//       await handleAddToCart();
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   // Thumbnail slider navigation
//   const showPrevThumbnails = () => {
//     setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
//   };

//   const showNextThumbnails = () => {
//     setThumbnailStartIndex((prev) => 
//       Math.min(displayImages.length - thumbnailsPerView, prev + 1)
//     );
//   };

//   const handleThumbnailClick = (absoluteIndex) => {
//     const newImages = [...displayImages];
//     [newImages[0], newImages[absoluteIndex]] = [newImages[absoluteIndex], newImages[0]];
//     setDisplayImages(newImages);
//     // Reset to show the clicked image at top if needed
//     if (absoluteIndex >= thumbnailStartIndex + thumbnailsPerView) {
//       setThumbnailStartIndex(Math.max(0, absoluteIndex - thumbnailsPerView + 1));
//     }
//   };

//   const visibleThumbnails = displayImages.slice(
//     thumbnailStartIndex, 
//     thumbnailStartIndex + thumbnailsPerView
//   );

//   const canScrollUp = thumbnailStartIndex > 0;
//   const canScrollDown = thumbnailStartIndex + thumbnailsPerView < displayImages.length;

//   return (
//     <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4">
//       <div className="product-image-section" style={{ display: "flex", gap: "16px" }}>
//         {/* Thumbnails Slider */}
//         <div 
//           className="thumbnail-slider-container"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "8px",
//             width: "80px",
//           }}
//         >
//           {/* Up Arrow */}
//           {displayImages.length > thumbnailsPerView && (
//             <button
//               onClick={showPrevThumbnails}
//               disabled={!canScrollUp}
//               style={{
//                 width: "32px",
//                 height: "32px",
//                 border: "none",
//                 backgroundColor: "transparent",
//                 cursor: canScrollUp ? "pointer" : "not-allowed",
//                 opacity: canScrollUp ? 1 : 0.3,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 0,
//                 transition: "all 0.2s ease",
//               }}
//             >
//               <FaChevronUp size={18} color="#666" />
//             </button>
//           )}

//           {/* Thumbnails List */}
//           <div 
//             ref={thumbnailContainerRef}
//             className="thumbnail-list"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "12px",
//               height: `${thumbnailsPerView * 72}px`, // 60px height + 12px gap
//               overflow: "hidden",
//               padding: "4px",
//             }}
//           >
//             {visibleThumbnails.map((img, idx) => {
//               const absoluteIndex = thumbnailStartIndex + idx;
//               const isMainImage = absoluteIndex === 0;

//               return (
//                 <div
//                   key={absoluteIndex}
//                   onClick={() => handleThumbnailClick(absoluteIndex)}
//                   style={{
//                     width: "60px",
//                     height: "60px",
//                     borderRadius: "6px",
//                     border: isMainImage ? "2px solid #0077b6" : "2px solid #ddd",
//                     cursor: "pointer",
//                     overflow: "hidden",
//                     flexShrink: 0,
//                     transition: "all 0.2s ease",
//                     boxShadow: isMainImage ? "0 2px 8px rgba(0,119,182,0.3)" : "none",
//                   }}
//                 >
//                   <img
//                     src={img}
//                     alt={`thumbnail-${absoluteIndex}`}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           {/* Down Arrow */}
//           {displayImages.length > thumbnailsPerView && (
//             <button
//               onClick={showNextThumbnails}
//               disabled={!canScrollDown}
//               style={{
//                 width: "32px",
//                 height: "32px",
//                 border: "none",
//                 backgroundColor: "transparent",
//                 cursor: canScrollDown ? "pointer" : "not-allowed",
//                 opacity: canScrollDown ? 1 : 0.3,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 0,
//                 transition: "all 0.2s ease",
//               }}
//             >
//               <FaChevronDown size={18} color="#666" />
//             </button>
//           )}
//         </div>

//         {/* Main Image with Wishlist Button */}
//         <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
//           <img
//             src={displayImages?.[0] || "/placeholder.png"}
//             alt={product.name}
//             className="product-image"
//             style={{ maxHeight: "400px" }}
//           />

//           {/* Wishlist Icon on Image */}
//           <button
//             className="wishlist-icon-btn"
//             onClick={toggleWishlist}
//             disabled={wishlistLoading || !selectedShade}
//             style={{
//               position: 'absolute',
//               top: '15px',
//               right: '15px',
//               cursor: wishlistLoading ? 'not-allowed' : 'pointer',
//               color: isInWishlist ? '#dc3545' : '#666',
//               fontSize: '24px',
//               zIndex: 2,
//               borderRadius: '50%',
//               width: '40px',
//               height: '40px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.3s ease',
//               backgroundColor: 'rgba(255, 255, 255, 0.9)',
//               border: 'none',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
//             }}
//             title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             {wishlistLoading ? (
//               <div className="spinner-border spinner-border-sm" role="status"></div>
//             ) : isInWishlist ? (
//               <FaHeart />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Product Info Section */}
//       <div className="product-info-section">
//         <p className="brand-variant mt-3">
//           {product.brand?.name || product.brand || "Unknown Brand"}
//         </p>

//         <div className="d-flex flex-wrap gap-2 align-items-center">
//           <h1 className="product-name fs-4">{product.name}</h1>
//           {selectedShade && (
//             <span className="text-muted fs-5" style={{ fontWeight: '500' }}>
//               - {selectedShade.shadeName}
//             </span>
//           )}
//         </div>

//         {/* Variants Selection */}
//         {variantsList.length > 0 && (
//           <div className="option-group mt-3">
//             <span className="option-label fs-6 mb-2 d-block">Select Variant</span>
//             <div className="variant-list d-flex gap-2 flex-wrap">
//               {variantsList.map((v, idx) => {
//                 const isSelected = selectedShade?.sku === (v.sku || v.variantSku);
//                 const isOutOfStock = v.stock <= 0;

//                 return v.hex ? (
//                   <div
//                     key={`color-${idx}`}
//                     className={`color-circles ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                     style={{
//                       backgroundColor: v.hex,
//                       width: "30px",
//                       height: "30px",
//                       borderRadius: "50%",
//                       cursor: isOutOfStock ? "not-allowed" : "pointer",
//                       border: isSelected ? "3px solid #0077b6" : "2px solid #ddd",
//                       opacity: isOutOfStock ? 0.5 : 1,
//                     }}
//                     onClick={() => !isOutOfStock && handleVariantSelect(v)}
//                     title={`${v.shadeName || "Variant"} ${isOutOfStock ? '(Out of Stock)' : ''}`}
//                   >
//                     {isOutOfStock && (
//                       <div className="out-of-stock-indicator"></div>
//                     )}
//                   </div>
//                 ) : (
//                   <button
//                     key={`text-${idx}`}
//                     className={`text-variant ${isSelected ? "selected" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
//                     style={{
//                       padding: "6px 12px",
//                       borderRadius: "6px",
//                       border: isSelected ? "2px solid #0077b6" : "1px solid #ddd",
//                       backgroundColor: isSelected ? "#e3f2fd" : "#f8f9fa",
//                       cursor: isOutOfStock ? "not-allowed" : "pointer",
//                       fontSize: "14px",
//                       fontWeight: isSelected ? 600 : 400,
//                       opacity: isOutOfStock ? 0.5 : 1
//                     }}
//                     onClick={() => !isOutOfStock && handleVariantSelect(v)}
//                     disabled={isOutOfStock}
//                   >
//                     {v.shadeName || v.size || `Variant ${idx + 1}`}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Rating */}
//         <div className="product-rating mt-3">
//           {[...Array(5)].map((_, index) => (
//             <FaStar
//               key={index}
//               className="fs-5"
//               color={index < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"}
//             />
//           ))}
//           <span className="rating-count ms-2">
//             {reviewSummary.average} / 5 ({reviewSummary.count} review{reviewSummary.count !== 1 ? 's' : ''})
//           </span>
//         </div>

//         {/* Price */}
//         <div className="product-price d-flex align-items-center gap-3 mt-3">
//           <span className="text-success fw-bold fs-3">
//             ₹{selectedShade?.displayPrice || product.price || "0"}
//           </span>
//           {selectedShade?.originalPrice > selectedShade?.displayPrice && (
//             <>
//               <del className="text-muted fs-5">₹{selectedShade.originalPrice}</del>
//             </>
//           )}
//         </div>

//         {/* Stock Status */}
//         <div className="stock-status mt-2 mb-3 text-start">
//           {selectedShade ? (
//             selectedShade.stock > 0 ? (
//               <span className="text-success">
//                 {/* <i className="bi bi-check-circle me-1"></i> */}
//                 {/* In Stock ({selectedShade.stock} available) */}
//               </span>
//             ) : (
//               <span className="text-danger">
//                 <i className="bi bi-x-circle me-1"></i>
//                 Out of Stock
//               </span>
//             )
//           ) : (
//             <span className="text-warning">Select a variant to see stock</span>
//           )}
//         </div>

//         {/* Action Buttons: Wishlist & Add to Cart */}
//         <div className="action-buttons d-flex flex-column flex-md-row gap-3 mt-4">
//           {/* Wishlist Button */}
//           <button
//             className={`wishlist-main-btn ${isInWishlist ? 'active' : ''}`}
//             onClick={toggleWishlist}
//             disabled={wishlistLoading || !selectedShade}
//             style={{
//               minWidth: "180px",
//               padding: "12px 20px",
//               border: `2px solid ${isInWishlist ? '#dc3545' : '#dee2e6'}`,
//               backgroundColor: isInWishlist ? '#dc3545' : 'transparent',
//               color: isInWishlist ? 'white' : '#333',
//               borderRadius: "8px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "10px",
//               fontWeight: "600",
//               fontSize: "16px",
//               cursor: wishlistLoading ? "not-allowed" : "pointer",
//               transition: "all 0.3s ease"
//             }}
//           >
//             {wishlistLoading ? (
//               <>
//                 <div className="spinner-border spinner-border-sm"></div>
//                 <span>Processing...</span>
//               </>
//             ) : isInWishlist ? (
//               <>
//                 <FaHeart /> Remove from Wishlist
//               </>
//             ) : (
//               <>
//                 <FaRegHeart /> Add to Wishlist
//               </>
//             )}
//           </button>

//           {/* Add to Cart Button - Inline Component */}
//           <div style={{ flex: 1 }}>
//             <button
//               className="btn btn-dark d-flex align-items-center justify-content-center gap-2"
//               onClick={handleAddToCartClick}
//               disabled={addingToCart || (selectedShade?.stock <= 0)}
//               style={{
//                 width: "100%",
//                 padding: "12px 20px",
//                 border: "2px solid #343a40",
//                 backgroundColor: "#343a40",
//                 color: "white",
//                 borderRadius: "8px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "10px",
//                 fontWeight: "600",
//                 fontSize: "16px",
//                 cursor: addingToCart ? "not-allowed" : "pointer",
//                 transition: "all 0.3s ease"
//               }}
//             >
//               {addingToCart ? (
//                 <>
//                   <div className="spinner-border spinner-border-sm"></div>
//                   <span>Adding...</span>
//                 </>
//               ) : (
//                 <>
//                   <FaShoppingBag />
//                   <span>Add To Bag</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Wishlist Note */}
//         {!selectedShade && (
//           <div className="alert alert-warning mt-3">
//             <small>Please select a variant before adding to wishlist</small>
//           </div>
//         )}
//       </div>
//     </article>
//   );
// };

// export default ProductDetailsHero;

















// // src/components/ProductDetailsHero.jsx
// import React, { useState, useRef, useMemo } from "react";
// import { 
//   FaStar, FaHeart, FaRegHeart, FaShoppingBag, 
//   FaChevronUp, FaChevronDown, FaTimes 
// } from "react-icons/fa";

// // --- Helper Functions from ProductPage logic ---
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

// const ProductDetailsHero = ({
//   product,
//   selectedShade,
//   displayImages,
//   reviewSummary,
//   variantsList,
//   isInWishlist,
//   wishlistLoading,
//   handleVariantSelect,
//   toggleWishlist,
//   handleAddToCart,
//   setDisplayImages,
//   toast
// }) => {
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const thumbnailsPerView = 4;
//   const thumbnailContainerRef = useRef(null);

//   // --- Grouping Logic ---
//   const groupedVariants = useMemo(() => {
//     const grouped = { color: [], text: [] };
//     variantsList.forEach((v) => {
//       if (v.hex && isValidHexColor(v.hex)) {
//         grouped.color.push(v);
//       } else {
//         grouped.text.push(v);
//       }
//     });
//     return grouped;
//   }, [variantsList]);

//   // Thumbnail Navigation
//   const showPrevThumbnails = () => setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
//   const showNextThumbnails = () => setThumbnailStartIndex((prev) => Math.min(displayImages.length - thumbnailsPerView, prev + 1));

//   const handleThumbnailClick = (absoluteIndex) => {
//     const newImages = [...displayImages];
//     [newImages[0], newImages[absoluteIndex]] = [newImages[absoluteIndex], newImages[0]];
//     setDisplayImages(newImages);
//   };

//   const handleAddToCartClick = async () => {
//     if (!selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }
//     setAddingToCart(true);
//     try { await handleAddToCart(); } catch (e) { console.error(e); } finally { setAddingToCart(false); }
//   };

//   const visibleThumbnails = displayImages.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView);
//   const canScrollUp = thumbnailStartIndex > 0;
//   const canScrollDown = thumbnailStartIndex + thumbnailsPerView < displayImages.length;

//   return (
//     <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4 p-4 bg-white rounded-3 shadow-sm" style={{position:'relative'}}>
//       {/* LEFT: THUMBNAIL SLIDER */}
//       <div className="product-image-section d-flex gap-3" style={{flexDirection:'column-reverse'}}>
//         <div className="d-flex flex-column align-items-start gap-2">
//           {displayImages.length > thumbnailsPerView && (
//             <button className="btn btn-link p-0" onClick={showPrevThumbnails} disabled={!canScrollUp}>
//               <FaChevronUp color={canScrollUp ? "#333" : "#ccc"} />
//             </button>
//           )}
//           <div style={{ height: `${thumbnailsPerView * 75}px`, overflow: "hidden" }} className="d-flex flex-row gap-2">
//             {visibleThumbnails.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 onClick={() => handleThumbnailClick(thumbnailStartIndex + idx)}
//                 style={{
//                   width: "65px", height: "65px", objectFit: "cover", borderRadius: "6px",
//                   border: (thumbnailStartIndex + idx) === 0 ? "2px solid #000" : "1px solid #ddd",
//                   cursor: "pointer"
//                 }}
//                 alt="thumb"
//               />
//             ))}
//           </div>
//           {displayImages.length > thumbnailsPerView && (
//             <button className="btn btn-link p-0" onClick={showNextThumbnails} disabled={!canScrollDown}>
//               <FaChevronDown color={canScrollDown ? "#333" : "#ccc"} />
//             </button>
//           )}
//         </div>

//         {/* CENTER: MAIN IMAGE */}
//         <div className="position-relative flex-grow-1 text-center">
//           <img
//             src={displayImages?.[0] || "/placeholder.png"}
//             alt={product.name}
//             style={{ maxHeight: "450px", width: "100%", objectFit: "contain" }}
//           />
//           <button 
//             className="btn position-absolute top-0 end-0 bg-white rounded-circle shadow-sm"
//             style={{ width: '40px', height: '40px', padding: 0 }}
//             onClick={toggleWishlist}
//           >
//             {isInWishlist ? <FaHeart color="#dc3545" size={20} /> : <FaRegHeart color="#666" size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* RIGHT: INFO & VARIANT LIMIT LOGIC */}
//       <div className="product-info-section flex-grow-1">
//         <p className="text-muted mb-1 text-start">{product.brand?.name || "Derma Co"}</p>
//         <h1 className="fs-3 fw-bold mb-2 text-start">{product.name}</h1>

//         <div className="d-flex align-items-center gap-1 mb-3 text-start">
//           {[...Array(5)].map((_, i) => (
//             <FaStar key={i} color={i < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"} />
//           ))}
//           <span className="text-muted ms-2">({reviewSummary.count} reviews)</span>
//         </div>

//         <div className="d-flex align-items-center gap-3 mb-4 text-start">
//           <span className="fs-2 fw-bold text-dark">Rs {selectedShade?.displayPrice || product.price}</span>
//           {selectedShade?.originalPrice > selectedShade?.displayPrice && (
//             <del className="text-muted fs-5">Rs {selectedShade.originalPrice}</del>
//           )}
//           <span className="text-success fw-bold">10% off</span>
//         </div>

//         {/* VARIANT SECTION WITH LIMIT OF 4 */}
//         <div className="mb-4 text-start">
//           <p className="fw-bold mb-2">Color</p>
//           <div className="d-flex flex-wrap gap-2">
//             {groupedVariants.color.slice(0, 4).map((v, i) => {
//               const isSelected = selectedShade?.sku === getSku(v);
//               return (
//                 <div
//                   key={i}
//                   onClick={() => handleVariantSelect(v)}
//                   style={{
//                     width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer',
//                     backgroundColor: v.hex, border: isSelected ? '2px solid #000' : '1px solid #ddd',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center'
//                   }}
//                 >
//                   {isSelected && <span className="text-white" style={{fontSize: '10px'}}>✓</span>}
//                 </div>
//               );
//             })}
//             {groupedVariants.color.length > 4 && (
//               <button 
//                 className="btn btn-light border" 
//                 style={{ width: '32px', height: '32px', padding: 0, fontSize: '12px' }}
//                 onClick={() => { setSelectedVariantType("color"); setShowVariantOverlay(true); }}
//               >
//                 +{groupedVariants.color.length - 4}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="mb-4 d-flex gap-2">
//           {groupedVariants.text.slice(0, 2).map((v, i) => {
//             const isSelected = selectedShade?.sku === getSku(v);
//             return (
//               <button
//                 key={i}
//                 className={`btn ${isSelected ? "btn-dark" : "btn-outline-secondary"}`}
//                 onClick={() => handleVariantSelect(v)}
//                 style={{ minWidth: '80px' }}
//               >
//                 {getVariantDisplayText(v)}
//               </button>
//             );
//           })}
//         </div>

//         {/* ACTIONS */}
//         <div className="d-flex gap-3">
//           <button className="btn btn-outline-dark flex-grow-1 py-3 fw-bold" onClick={toggleWishlist}>
//             Wishlist <FaRegHeart className="ms-2" />
//           </button>
//           <button className="btn btn-dark flex-grow-1 py-3 fw-bold" onClick={handleAddToCartClick} disabled={addingToCart}>
//             {addingToCart ? "Adding..." : "Add To Bag"} <FaShoppingBag className="ms-2" />
//           </button>
//         </div>
//       </div>

//       {/* OVERLAP MODAL (Same as ProductPage) */}
//       {showVariantOverlay && (
//         <div className="variant-overlay" style={overlayStyles.overlay} onClick={() => setShowVariantOverlay(false)}>
//           <div className="variant-overlay-content bg-white p-4 rounded-4 shadow" style={overlayStyles.content} onClick={e => e.stopPropagation()}>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="m-0 fw-bold">Select Variant</h5>
//               <button className="btn p-0" onClick={() => setShowVariantOverlay(false)}><FaTimes size={24} /></button>
//             </div>

//             <div className="d-flex mb-4 border-bottom">
//               {['all', 'color', 'text'].map(type => (
//                 <button 
//                   key={type}
//                   className={`btn flex-fill py-2 rounded-0 ${selectedVariantType === type ? "border-bottom border-dark border-3 fw-bold" : "text-muted"}`}
//                   onClick={() => setSelectedVariantType(type)}
//                 >
//                   {type.toUpperCase()}
//                 </button>
//               ))}
//             </div>

//             <div className="overflow-auto" style={{ maxHeight: '400px' }}>
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && (
//                 <div className="row g-3 mb-4">
//                   {groupedVariants.color.map((v, i) => (
//                     <div key={i} className="col-lg-2 col-md-3 col-5 text-center" onClick={() => { handleVariantSelect(v); setShowVariantOverlay(false); }}>
//                       <div className="mx-auto border rounded" style={{ width: '40px', height: '40px', backgroundColor: v.hex, cursor: 'pointer' }} />
//                       <small className="d-block mt-1">{v.shadeName}</small>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {groupedVariants.text.map((v, i) => (
//                     <button key={i} className="btn btn-outline-dark" onClick={() => { handleVariantSelect(v); setShowVariantOverlay(false); }}>
//                       {getVariantDisplayText(v)}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// };

// // Internal styles for the Overlay to ensure it works without external CSS imports
// const overlayStyles = {
//   // overlay: {
//   //   position: 'absolute', width: '100%', height: '100%',
//   //   backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex',
//   //   alignItems: 'center', justifyContent: 'center'
//   // },
//   content: {
//     width: '100%', maxHeight: '80vh', position: 'relative'
//   }
// };

// export default ProductDetailsHero;




















// // src/components/ProductDetailsHero.jsx
// import React, { useState, useRef, useMemo } from "react";
// import { 
//   FaStar, FaHeart, FaRegHeart, FaShoppingBag, 
//   FaChevronUp, FaChevronDown, FaTimes 
// } from "react-icons/fa";

// // --- Helper Functions ---
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

// // Description Accordion Component (embedded directly)
// const ProductDetailDescription = ({ product }) => {
//   return (
//     <section className="product-extra-section mt-5">
//       <div className="details-section">
//         <div className="accordion">
//           <details>
//             <summary>Description</summary>
//             <p className="mt-3">{product.description || "No description available."}</p>
//           </details>
//           <details>
//             <summary>Ingredients</summary>
//             <p className="mt-3">
//               {product.ingredients?.length > 0 
//                 ? product.ingredients.join(", ") 
//                 : "Ingredients not provided."}
//             </p>
//           </details>
//           <details>
//             <summary>How To Use</summary>
//             <p className="mt-3">
//               {product.howToUse?.length > 0 
//                 ? product.howToUse.join(" • ") 
//                 : "Usage instructions not provided."}
//             </p>
//           </details>
//           <details>
//             <summary>Special Features</summary>
//             <p className="mt-3">
//               {product.features?.length > 0 
//                 ? product.features.join(" • ") 
//                 : "No special features listed."}
//             </p>
//           </details>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProductDetailsHero = ({
//   product,
//   selectedShade,
//   displayImages,
//   reviewSummary,
//   variantsList,
//   isInWishlist,
//   wishlistLoading,
//   handleVariantSelect,
//   toggleWishlist,
//   handleAddToCart,
//   setDisplayImages,
//   toast
// }) => {
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const thumbnailsPerView = 4;
//   const thumbnailContainerRef = useRef(null);

//   // Grouping Logic
//   const groupedVariants = useMemo(() => {
//     const grouped = { color: [], text: [] };
//     variantsList.forEach((v) => {
//       if (v.hex && isValidHexColor(v.hex)) {
//         grouped.color.push(v);
//       } else {
//         grouped.text.push(v);
//       }
//     });
//     return grouped;
//   }, [variantsList]);

//   // Thumbnail Navigation
//   const showPrevThumbnails = () => setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
//   const showNextThumbnails = () => setThumbnailStartIndex((prev) => Math.min(displayImages.length - thumbnailsPerView, prev + 1));

//   const handleThumbnailClick = (absoluteIndex) => {
//     const newImages = [...displayImages];
//     [newImages[0], newImages[absoluteIndex]] = [newImages[absoluteIndex], newImages[0]];
//     setDisplayImages(newImages);
//   };

//   const handleAddToCartClick = async () => {
//     if (!selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }
//     setAddingToCart(true);
//     try { 
//       await handleAddToCart(); 
//     } catch (e) { 
//       console.error(e); 
//     } finally { 
//       setAddingToCart(false); 
//     }
//   };

//   const visibleThumbnails = displayImages.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView);
//   const canScrollUp = thumbnailStartIndex > 0;
//   const canScrollDown = thumbnailStartIndex + thumbnailsPerView < displayImages.length;

//   return (
//     <article className="product-card product-cards-main flex-sm-row flex-xs-column gap-4 p-4 bg-white rounded-3 shadow-sm" style={{ position: 'relative' }}>

//       {/* LEFT: THUMBNAIL SLIDER + MAIN IMAGE */}
//       <div className="product-image-section d-flex gap-3" style={{ flexDirection: 'column-reverse' }}>
//         <div className="d-flex flex-column align-items-start gap-2">
//           {displayImages.length > thumbnailsPerView && (
//             <button className="btn btn-link p-0" onClick={showPrevThumbnails} disabled={!canScrollUp}>
//               <FaChevronUp color={canScrollUp ? "#333" : "#ccc"} />
//             </button>
//           )}
//           <div style={{ height: `${thumbnailsPerView * 75}px`, overflow: "hidden" }} className="d-flex flex-row gap-2">
//             {visibleThumbnails.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 onClick={() => handleThumbnailClick(thumbnailStartIndex + idx)}
//                 style={{
//                   width: "65px",
//                   height: "65px",
//                   objectFit: "cover",
//                   borderRadius: "6px",
//                   border: (thumbnailStartIndex + idx) === 0 ? "2px solid #000" : "1px solid #ddd",
//                   cursor: "pointer"
//                 }}
//                 alt="thumb"
//               />
//             ))}
//           </div>
//           {displayImages.length > thumbnailsPerView && (
//             <button className="btn btn-link p-0" onClick={showNextThumbnails} disabled={!canScrollDown}>
//               <FaChevronDown color={canScrollDown ? "#333" : "#ccc"} />
//             </button>
//           )}
//         </div>

//         {/* MAIN IMAGE */}
//         <div className="position-relative flex-grow-1 text-center">
//           <img
//             src={displayImages?.[0] || "/placeholder.png"}
//             alt={product.name}
//             style={{ maxHeight: "450px", width: "100%", objectFit: "contain" }}
//           />
//           <button 
//             className="btn position-absolute top-0 end-0 bg-white rounded-circle shadow-sm"
//             style={{ width: '40px', height: '40px', padding: 0 }}
//             onClick={toggleWishlist}
//             disabled={wishlistLoading}
//           >
//             {isInWishlist ? <FaHeart color="#dc3545" size={20} /> : <FaRegHeart color="#666" size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* RIGHT: INFO + VARIANTS + BUTTONS + DESCRIPTION */}
//       <div className="product-info-section flex-grow-1">
//         <p className="text-muted mb-1 text-start">{product.brand?.name || "Brand Name"}</p>
//         <h1 className="fs-3 fw-bold mb-2 text-start">{product.name}</h1>

//         <div className="d-flex align-items-center gap-1 mb-3 text-start">
//           {[...Array(5)].map((_, i) => (
//             <FaStar key={i} color={i < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"} />
//           ))}
//           <span className="text-muted ms-2">({reviewSummary.count} reviews)</span>
//         </div>

//         <div className="d-flex align-items-center gap-3 mb-4 text-start">
//           <span className="fs-2 fw-bold text-dark">Rs {selectedShade?.displayPrice || product.price}</span>
//           {selectedShade?.originalPrice > selectedShade?.displayPrice && (
//             <del className="text-muted fs-5">Rs {selectedShade.originalPrice}</del>
//           )}
//           <span className="text-success fw-bold">10% off</span>
//         </div>

//         {/* Color Variants (limited to 4 + more button) */}
//         <div className="mb-4 text-start">
//           <p className="fw-bold mb-2">Color</p>
//           <div className="d-flex flex-wrap gap-2">
//             {groupedVariants.color.slice(0, 4).map((v, i) => {
//               const isSelected = selectedShade?.sku === getSku(v);
//               return (
//                 <div
//                   key={i}
//                   onClick={() => handleVariantSelect(v)}
//                   style={{
//                     width: '32px',
//                     height: '32px',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     backgroundColor: v.hex,
//                     border: isSelected ? '2px solid #000' : '1px solid #ddd',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   {isSelected && <span className="text-white" style={{ fontSize: '10px' }}>✓</span>}
//                 </div>
//               );
//             })}
//             {groupedVariants.color.length > 4 && (
//               <button 
//                 className="btn btn-light border" 
//                 style={{ width: '32px', height: '32px', padding: 0, fontSize: '12px' }}
//                 onClick={() => { setSelectedVariantType("color"); setShowVariantOverlay(true); }}
//               >
//                 +{groupedVariants.color.length - 4}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Text Variants (limited to 2) */}
//         <div className="mb-4 d-flex gap-2">
//           {groupedVariants.text.slice(0, 2).map((v, i) => {
//             const isSelected = selectedShade?.sku === getSku(v);
//             return (
//               <button
//                 key={i}
//                 className={`btn ${isSelected ? "btn-dark" : "btn-outline-secondary"}`}
//                 onClick={() => handleVariantSelect(v)}
//                 style={{ minWidth: '80px' }}
//               >
//                 {getVariantDisplayText(v)}
//               </button>
//             );
//           })}
//         </div>

//         {/* ACTIONS: Add to Bag + Wishlist */}
//         <div className="d-flex gap-3 mb-4">
//           <button 
//             className="btn btn-outline-dark flex-grow-1 py-3 fw-bold" 
//             onClick={toggleWishlist}
//             disabled={wishlistLoading}
//           >
//             Wishlist <FaRegHeart className="ms-2" />
//           </button>
//           <button 
//             className="btn btn-dark flex-grow-1 py-3 fw-bold" 
//             onClick={handleAddToCartClick} 
//             disabled={addingToCart || !selectedShade}
//           >
//             {addingToCart ? "Adding..." : "Add To Bag"} <FaShoppingBag className="ms-2" />
//           </button>
//         </div>

//         {/* DESCRIPTION ACCORDION - ADDED HERE */}
//         <ProductDetailDescription product={product} />
//       </div>

//       {/* Variant Selection Overlay */}
//       {showVariantOverlay && (
//         <div 
//           className="variant-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
//           style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.6)' }}
//           onClick={() => setShowVariantOverlay(false)}
//         >
//           <div 
//             className="bg-white rounded-4 p-4 shadow-lg" 
//             style={{ width: '90%', maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto' }}
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="m-0 fw-bold">Select Variant</h5>
//               <button className="btn p-0 fs-4" onClick={() => setShowVariantOverlay(false)}>
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="d-flex mb-4 border-bottom">
//               {['all', 'color', 'text'].map(type => (
//                 <button 
//                   key={type}
//                   className={`btn flex-fill py-2 rounded-0 ${selectedVariantType === type ? "border-bottom border-dark border-3 fw-bold" : "text-muted"}`}
//                   onClick={() => setSelectedVariantType(type)}
//                 >
//                   {type.charAt(0).toUpperCase() + type.slice(1)}
//                 </button>
//               ))}
//             </div>

//             <div className="overflow-auto" style={{ maxHeight: '400px' }}>
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
//                 <div className="row g-3 mb-4">
//                   {groupedVariants.color.map((v, i) => {
//                     const isSelected = selectedShade?.sku === getSku(v);
//                     return (
//                       <div key={i} className="col-3 text-center">
//                         <div
//                           onClick={() => { handleVariantSelect(v); setShowVariantOverlay(false); }}
//                           style={{
//                             width: '45px',
//                             height: '45px',
//                             margin: '0 auto',
//                             borderRadius: '6px',
//                             backgroundColor: v.hex,
//                             border: isSelected ? '3px solid #000' : '1px solid #ddd',
//                             cursor: 'pointer',
//                             position: 'relative'
//                           }}
//                         >
//                           {isSelected && (
//                             <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff', fontWeight: 'bold' }}>
//                               ✓
//                             </span>
//                           )}
//                         </div>
//                         <small className="d-block mt-1">{v.shadeName || v.name}</small>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {groupedVariants.text.map((v, i) => {
//                     const isSelected = selectedShade?.sku === getSku(v);
//                     return (
//                       <button
//                         key={i}
//                         className={`btn ${isSelected ? "btn-dark" : "btn-outline-secondary"}`}
//                         onClick={() => { handleVariantSelect(v); setShowVariantOverlay(false); }}
//                       >
//                         {getVariantDisplayText(v)}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// };

// export default ProductDetailsHero;




























// // src/components/ProductDetailsHero.jsx
// import React, { useState, useRef, useMemo } from "react";
// import {
//   FaStar, FaHeart, FaRegHeart, FaShoppingBag,
//   FaChevronUp, FaChevronDown, FaTimes
// } from "react-icons/fa";
// import "../css/ProductDetailsHero.css"; // import the new CSS file

// // --- Helper Functions ---
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

// // Description Accordion Component (embedded directly)
// const ProductDetailDescription = ({ product }) => {
//   return (
//     <section className="product-extra-section mt-5 border-none">
//       <div className="details-section border-none">
//         <div className="accordion border-none">
//           <details>
//             <summary>Description</summary>
//             <p className="mt-3">{product.description || "No description available."}</p>
//           </details>
//           <details>
//             <summary>Ingredients</summary>
//             <p className="mt-3">
//               {product.ingredients?.length > 0
//                 ? product.ingredients.join(", ")
//                 : "Ingredients not provided."}
//             </p>
//           </details>
//           <details>
//             <summary>How To Use</summary>
//             <p className="mt-3">
//               {product.howToUse?.length > 0
//                 ? product.howToUse.join(" • ")
//                 : "Usage instructions not provided."}
//             </p>
//           </details>
//           <details>
//             <summary>Special Features</summary>
//             <p className="mt-3">
//               {product.features?.length > 0
//                 ? product.features.join(" • ")
//                 : "No special features listed."}
//             </p>
//           </details>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProductDetailsHero = ({
//   product,
//   selectedShade,
//   displayImages,
//   reviewSummary,
//   variantsList,
//   isInWishlist,
//   wishlistLoading,
//   handleVariantSelect,
//   toggleWishlist,
//   handleAddToCart,
//   setDisplayImages,
//   toast
// }) => {
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const thumbnailsPerView = 4;
//   const thumbnailContainerRef = useRef(null);

//   // Grouping Logic
//   const groupedVariants = useMemo(() => {
//     const grouped = { color: [], text: [] };
//     variantsList.forEach((v) => {
//       if (v.hex && isValidHexColor(v.hex)) {
//         grouped.color.push(v);
//       } else {
//         grouped.text.push(v);
//       }
//     });
//     return grouped;
//   }, [variantsList]);

//   // Thumbnail Navigation
//   const showPrevThumbnails = () => setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
//   const showNextThumbnails = () => setThumbnailStartIndex((prev) => Math.min(displayImages.length - thumbnailsPerView, prev + 1));

//   const handleThumbnailClick = (absoluteIndex) => {
//     const newImages = [...displayImages];
//     [newImages[0], newImages[absoluteIndex]] = [newImages[absoluteIndex], newImages[0]];
//     setDisplayImages(newImages);
//   };

//   const handleAddToCartClick = async () => {
//     if (!selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }
//     setAddingToCart(true);
//     try {
//       await handleAddToCart();
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const visibleThumbnails = displayImages.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView);
//   const canScrollUp = thumbnailStartIndex > 0;
//   const canScrollDown = thumbnailStartIndex + thumbnailsPerView < displayImages.length;

//   return (
//     <article className="product-hero-container">

//       {/* LEFT: THUMBNAIL SLIDER + MAIN IMAGE (STICKY) */}
//       <div className="product-hero-left">
//         <div className="product-hero-image-wrapper">
//           {/* Thumbnail Column */}
//           <div className="product-hero-thumbnails">
//             {displayImages.length > thumbnailsPerView && (
//               <button className="btn btn-link p-0" onClick={showPrevThumbnails} disabled={!canScrollUp}>
//                 <FaChevronUp color={canScrollUp ? "#333" : "#ccc"} />
//               </button>
//             )}
//             <div className="product-hero-thumbnails-list" style={{ overflow: 'hidden' }}>
//               {visibleThumbnails.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   onClick={() => handleThumbnailClick(thumbnailStartIndex + idx)}
//                   className={`product-hero-thumbnail ${(thumbnailStartIndex + idx) === 0 ? 'active-thumbnail' : ''}`}
//                   alt="thumb"
//                 />
//               ))}
//             </div>
//             {displayImages.length > thumbnailsPerView && (
//               <button className="btn btn-link p-0" onClick={showNextThumbnails} disabled={!canScrollDown}>
//                 <FaChevronDown color={canScrollDown ? "#333" : "#ccc"} />
//               </button>
//             )}
//           </div>

//           {/* MAIN IMAGE */}
//           <div className="product-hero-main-image">
//             <img
//               src={displayImages?.[0] || "/placeholder.png"}
//               alt={product.name}
//             />
//             <button
//               className="product-hero-wishlist-btn"
//               onClick={toggleWishlist}
//               disabled={wishlistLoading}
//             >
//               {isInWishlist ? <FaHeart color="#dc3545" size={20} /> : <FaRegHeart color="#666" size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT: INFO + VARIANTS + BUTTONS + DESCRIPTION */}
//       <div className="product-hero-right">
//         <p className="text-muted mb-1 text-start mt-lg-2 mt-4">{product.brand?.name || "Brand Name"}</p>
//         <h1 className="fs-3 fw-bold mb-2 text-start">{product.name}</h1>

//         <div className="d-flex align-items-center gap-1 mb-3 text-start">
//           {[...Array(5)].map((_, i) => (
//             <FaStar key={i} color={i < Math.round(reviewSummary.average) ? "#ffc107" : "#e4e5e9"} />
//           ))}
//           <span className="text-muted ms-2">({reviewSummary.count} reviews)</span>
//         </div>

//         <div className="d-flex align-items-center gap-3 mb-4 text-start">
//           <span className="fs-2 fw-bold text-dark">Rs {selectedShade?.displayPrice || product.price}</span>
//           {selectedShade?.originalPrice > selectedShade?.displayPrice && (
//             <del className="text-muted fs-5">Rs {selectedShade.originalPrice}</del>
//           )}
//           <span className="text-success fw-bold">10% off</span>
//         </div>

//         {/* Color Variants (limited to 4 + more button) */}
//         <div className="mb-4 text-start">
//           <p className="fw-bold mb-2">Color</p>
//           <div className="d-flex flex-wrap gap-2">
//             {groupedVariants.color.slice(0, 4).map((v, i) => {
//               const isSelected = selectedShade?.sku === getSku(v);
//               return (
//                 <div
//                   key={i}
//                   onClick={() => handleVariantSelect(v)}
//                   className="color-swatch"
//                   style={{
//                     backgroundColor: v.hex,
//                     border: isSelected ? '2px solid #000' : '1px solid #ddd',
//                   }}
//                 >
//                   {isSelected && <span className="color-swatch-check">✓</span>}
//                 </div>
//               );
//             })}
//             {groupedVariants.color.length > 4 && (
//               <button
//                 className="btn border fw-normal more-variants-btn"
//                 onClick={() => { setSelectedVariantType("color"); setShowVariantOverlay(true); }}
//               >
//                 +{groupedVariants.color.length - 4}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Text Variants (limited to 2) */}
//         <div className="mb-4 d-flex gap-2">
//           {groupedVariants.text.slice(0, 2).map((v, i) => {
//             const isSelected = selectedShade?.sku === getSku(v);
//             return (
//               <button
//                 key={i}
//                 className={`btn ${isSelected ? "btn-dark" : "btn-outline-secondary"} text-variant-btn`}
//                 onClick={() => handleVariantSelect(v)}
//               >
//                 {getVariantDisplayText(v)}
//               </button>
//             );
//           })}
//         </div>

//         {/* ACTIONS: Add to Bag + Wishlist */}
//         <div className="d-flex gap-3 mb-4">
//           <button
//             className="btn btn-dark flex-grow-1 py-3 fw-normal action-btn page-title-main-name"
//             onClick={handleAddToCartClick}
//             disabled={addingToCart || !selectedShade}
//           >
//             {addingToCart ? "Adding..." : "Add To Bag"} <FaShoppingBag className="ms-2" />
//           </button>

//           <button
//             className="btn btn-outline-dark flex-grow-1 py-3 fw-normal action-btn"
//             onClick={toggleWishlist}
//             disabled={wishlistLoading}
//           >
//             Wishlist <FaRegHeart className="ms-2" />
//           </button>
//         </div>

//         {/* DESCRIPTION ACCORDION */}
//         <ProductDetailDescription product={product} />
//       </div>

//       {/* Variant Selection Overlay */}
//       {showVariantOverlay && (
//         <div className="variant-overlay variant-overlayss" onClick={() => setShowVariantOverlay(false)}>
//           <div className="variant-overlay-content variant-seond-overlay" onClick={e => e.stopPropagation()}>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="m-0 fw-bold">Select Variant</h5>
//               <button className="btn p-0 fs-4" onClick={() => setShowVariantOverlay(false)}>
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="d-flex mb-4 border-bottom">
//               {['all', 'color', 'text'].map(type => (
//                 <button
//                   key={type}
//                   className={`btn flex-fill py-2 rounded-0 ${selectedVariantType === type ? "border-bottom border-dark border-3 fw-bold" : "text-muted"}`}
//                   onClick={() => setSelectedVariantType(type)}
//                 >
//                   {type.charAt(0).toUpperCase() + type.slice(1)}
//                 </button>
//               ))}
//             </div>

//             {/* <div className="overflow-auto" style={{ maxHeight: '400px' }}> */}
//             <div className="overflow-auto" style={{ maxHeight: '400px' }}>
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
//                 <div className="row g-3 pb-4">
//                   {groupedVariants.color.map((v, i) => {
//                     const isSelected = selectedShade?.sku === getSku(v);
//                     return (
//                       <div key={i} className="col-lg-2 col-6 text-center">
//                         <div
//                           onClick={() => { handleVariantSelect(v); setShowVariantOverlay(false); }}
//                           className="overlay-color-swatch"
//                           style={{
//                             backgroundColor: v.hex,
//                             border: isSelected ? '3px solid #000' : '1px solid #ddd',
//                           }}
//                         >
//                           {isSelected && (
//                             <span className="overlay-check">✓</span>
//                           )}
//                         </div>
//                         <small className="d-block mt-1">{v.shadeName || v.name}</small>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {groupedVariants.text.map((v, i) => {
//                     const isSelected = selectedShade?.sku === getSku(v);
//                     return (
//                       <button
//                         key={i}
//                         className={`btn ${isSelected ? "btn-dark" : "btn-outline-secondary"}`}
//                         onClick={() => { handleVariantSelect(v); setShowVariantOverlay(false); }}
//                       >
//                         {getVariantDisplayText(v)}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// };

// export default ProductDetailsHero;





















// // src/components/ProductDetailsHero.jsx
// import React, { useState, useRef, useMemo, useEffect } from "react";
// import {
//   FaStar, FaHeart, FaRegHeart, FaShoppingBag,
//   FaChevronUp, FaChevronDown, FaTimes
// } from "react-icons/fa";
// import "../css/ProductDetailsHero.css";

// // --- Helper Functions ---
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

// // Description Accordion
// const ProductDetailDescription = ({ product }) => {
//   return (
//     <section className="product-extra-section mt-5 border-none">
//       <div className="details-section border-none">
//         <div className="accordion border-none">
//           <details>
//             <summary>Description</summary>
//             <p className="mt-3">{product.description || "No description available."}</p>
//           </details>
//           <details>
//             <summary>Ingredients</summary>
//             <p className="mt-3">
//               {product.ingredients?.length > 0
//                 ? product.ingredients.join(", ")
//                 : "Ingredients not provided."}
//             </p>
//           </details>
//           <details>
//             <summary>How To Use</summary>
//             <p className="mt-3">
//               {product.howToUse?.length > 0
//                 ? product.howToUse.join(" • ")
//                 : "Usage instructions not provided."}
//             </p>
//           </details>
//           <details>
//             <summary>Special Features</summary>
//             <p className="mt-3">
//               {product.features?.length > 0
//                 ? product.features.join(" • ")
//                 : "No special features listed."}
//             </p>
//           </details>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProductDetailsHero = ({
//   product,
//   selectedShade,
//   displayImages: initialDisplayImages,
//   reviewSummary,
//   variantsList,
//   isInWishlist,
//   wishlistLoading,
//   handleVariantSelect,
//   toggleWishlist,
//   handleAddToCart,
//   setDisplayImages, // Not needed anymore for thumbnails
//   toast
// }) => {
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Current main image index
//   const [mainImageIndex, setMainImageIndex] = useState(0);

//   const thumbnailsPerView = 4;

//   // Reset when images change
//   useEffect(() => {
//     setMainImageIndex(0);
//     setThumbnailStartIndex(0);
//   }, [initialDisplayImages]);

//   const groupedVariants = useMemo(() => {
//     const grouped = { color: [], text: [] };
//     variantsList.forEach((v) => {
//       if (v.hex && isValidHexColor(v.hex)) {
//         grouped.color.push(v);
//       } else {
//         grouped.text.push(v);
//       }
//     });
//     return grouped;
//   }, [variantsList]);

//   // Thumbnail Navigation
//   const showPrevThumbnails = () => setThumbnailStartIndex(prev => Math.max(0, prev - 1));
//   const showNextThumbnails = () => setThumbnailStartIndex(prev => 
//     Math.min(initialDisplayImages.length - thumbnailsPerView, prev + 1)
//   );

//   // Click thumbnail → Change main image (No reordering)
//   const handleThumbnailClick = (index) => {
//     setMainImageIndex(index);
//   };

//   const handleAddToCartClick = async () => {
//     if (!selectedShade) {
//       toast.warn("Please select a variant first");
//       return;
//     }
//     setAddingToCart(true);
//     try {
//       await handleAddToCart();
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const visibleThumbnails = initialDisplayImages.slice(
//     thumbnailStartIndex, 
//     thumbnailStartIndex + thumbnailsPerView
//   );

//   const canScrollUp = thumbnailStartIndex > 0;
//   const canScrollDown = thumbnailStartIndex + thumbnailsPerView < initialDisplayImages.length;

//   const currentMainImage = initialDisplayImages[mainImageIndex] || initialDisplayImages[0] || "/placeholder.png";

//   return (
//     <article className="product-hero-container">

//       {/* LEFT: THUMBNAILS + MAIN IMAGE */}
//       <div className="product-hero-left">
//         <div className="product-hero-image-wrapper">
//           {/* Thumbnails */}
//           <div className="product-hero-thumbnails">
//             {initialDisplayImages.length > thumbnailsPerView && (
//               <button className="btn btn-link p-0 thumbnail-nav-btn" 
//                       onClick={showPrevThumbnails} disabled={!canScrollUp}>
//                 <FaChevronUp color={canScrollUp ? "#333" : "#ccc"} />
//               </button>
//             )}

//             <div className="product-hero-thumbnails-list">
//               {visibleThumbnails.map((img, idx) => {
//                 const absoluteIndex = thumbnailStartIndex + idx;
//                 const isActive = absoluteIndex === mainImageIndex;
//                 return (
//                   <img
//                     key={absoluteIndex}
//                     src={img}
//                     onClick={() => handleThumbnailClick(absoluteIndex)}
//                     className={`product-hero-thumbnail ${isActive ? 'active-thumbnail' : ''}`}
//                     alt={`thumb-${absoluteIndex}`}
//                     loading="lazy"
//                   />
//                 );
//               })}
//             </div>

//             {initialDisplayImages.length > thumbnailsPerView && (
//               <button className="btn btn-link p-0 thumbnail-nav-btn" 
//                       onClick={showNextThumbnails} disabled={!canScrollDown}>
//                 <FaChevronDown color={canScrollDown ? "#333" : "#ccc"} />
//               </button>
//             )}
//           </div>

//           {/* Main Image */}
//           <div className="product-hero-main-image">
//             <img
//               src={currentMainImage}
//               alt={product?.name || "Product"}
//               loading="lazy"
//               onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
//             />
//             <button
//               className="product-hero-wishlist-btn"
//               onClick={toggleWishlist}
//               disabled={wishlistLoading}
//             >
//               {isInWishlist ? <FaHeart color="#dc3545" size={22} /> : <FaRegHeart color="#666" size={22} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE - INFO (unchanged) */}
//       <div className="product-hero-right">
//         <p className="text-muted mb-1 text-start mt-lg-2 mt-4">
//           {product.brand?.name || product.brand || "Brand Name"}
//         </p>
//         <h1 className="fs-3 fw-bold mb-2 text-start">{product.name}</h1>

//         <div className="d-flex align-items-center gap-1 mb-3 text-start">
//           {[...Array(5)].map((_, i) => (
//             <FaStar 
//               key={i} 
//               color={i < Math.round(reviewSummary.avgRating || 0) ? "#ffc107" : "#e4e5e9"} 
//             />
//           ))}
//           <span className="text-muted ms-2">
//             ({reviewSummary.totalReviews || 0} reviews)
//           </span>
//         </div>

//         <div className="d-flex align-items-center gap-3 mb-4 text-start">
//           <span className="fs-2 fw-bold text-dark">
//             Rs {selectedShade?.displayPrice || product.price}
//           </span>
//           {selectedShade?.originalPrice > selectedShade?.displayPrice && (
//             <del className="text-muted fs-5">Rs {selectedShade.originalPrice}</del>
//           )}
//           <span className="text-success fw-bold">10% off</span>
//         </div>

//         {/* Color Variants */}
//         <div className="mb-4 text-start">
//           <p className="fw-bold mb-2">Color</p>
//           <div className="d-flex flex-wrap gap-2">
//             {groupedVariants.color.slice(0, 4).map((v, i) => {
//               const isSelected = selectedShade?.sku === getSku(v);
//               return (
//                 <div
//                   key={i}
//                   onClick={() => handleVariantSelect(v)}
//                   className="color-swatch"
//                   style={{
//                     backgroundColor: v.hex,
//                     border: isSelected ? '2px solid #000' : '1px solid #ddd',
//                   }}
//                 >
//                   {isSelected && <span className="color-swatch-check">✓</span>}
//                 </div>
//               );
//             })}
//             {groupedVariants.color.length > 4 && (
//               <button
//                 className="btn border fw-normal more-variants-btn"
//                 onClick={() => { 
//                   setSelectedVariantType("color"); 
//                   setShowVariantOverlay(true); 
//                 }}
//               >
//                 +{groupedVariants.color.length - 4}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Text Variants */}
//         <div className="mb-4 d-flex gap-2">
//           {groupedVariants.text.slice(0, 2).map((v, i) => {
//             const isSelected = selectedShade?.sku === getSku(v);
//             return (
//               <button
//                 key={i}
//                 className={`btn ${isSelected ? "btn-dark" : "btn-outline-secondary"} text-variant-btn`}
//                 onClick={() => handleVariantSelect(v)}
//               >
//                 {getVariantDisplayText(v)}
//               </button>
//             );
//           })}
//         </div>

//         {/* Action Buttons */}
//         <div className="d-flex gap-3 mb-4">
//           <button
//             className="btn btn-dark flex-grow-1 py-3 fw-normal action-btn page-title-main-name"
//             onClick={handleAddToCartClick}
//             disabled={addingToCart || !selectedShade}
//           >
//             {addingToCart ? "Adding..." : "Add To Bag"} 
//             <FaShoppingBag className="ms-2" />
//           </button>

//           <button
//             className="btn btn-outline-dark flex-grow-1 py-3 fw-normal action-btn"
//             onClick={toggleWishlist}
//             disabled={wishlistLoading}
//           >
//             Wishlist <FaRegHeart className="ms-2" />
//           </button>
//         </div>

//         <ProductDetailDescription product={product} />
//       </div>

//       {/* Variant Overlay */}
//       {showVariantOverlay && (
//         <div className="variant-overlay position-absolute bg-white p-0 m-0" onClick={() => setShowVariantOverlay(false)}>
//           <div className="variant-overlay-content mw-100" onClick={e => e.stopPropagation()}>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="m-0 fw-bold">Select Variant</h5>
//               <button className="btn p-0 fs-4" onClick={() => setShowVariantOverlay(false)}>
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="d-flex mb-4 border-bottom">
//               {['all', 'color', 'text'].map(type => (
//                 <button
//                   key={type}
//                   className={`btn flex-fill py-2 rounded-0 ${selectedVariantType === type ? "border-bottom border-dark border-3 fw-bold" : "text-muted"}`}
//                   onClick={() => setSelectedVariantType(type)}
//                 >
//                   {type.charAt(0).toUpperCase() + type.slice(1)}
//                 </button>
//               ))}
//             </div>

//             <div className="overflow-auto"
//             //  style={{ maxHeight: '400px' }}
//              >
//               {(selectedVariantType === 'all' || selectedVariantType === 'color') && groupedVariants.color.length > 0 && (
//                 <div className="row g-3 pb-4">
//                   {groupedVariants.color.map((v, i) => {
//                     const isSelected = selectedShade?.sku === getSku(v);
//                     return (
//                       <div key={i} className="col-lg-2 col-6 text-center">
//                         <div
//                           onClick={() => { 
//                             handleVariantSelect(v); 
//                             setShowVariantOverlay(false); 
//                           }}
//                           className="overlay-color-swatch"
//                           style={{
//                             backgroundColor: v.hex,
//                             border: isSelected ? '3px solid #000' : '1px solid #ddd',
//                           }}
//                         >
//                           {isSelected && <span className="overlay-check">✓</span>}
//                         </div>
//                         <small className="d-block mt-1">{v.shadeName || v.name}</small>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {(selectedVariantType === 'all' || selectedVariantType === 'text') && groupedVariants.text.length > 0 && (
//                 <div className="d-flex flex-wrap gap-2">
//                   {groupedVariants.text.map((v, i) => {
//                     const isSelected = selectedShade?.sku === getSku(v);
//                     return (
//                       <button
//                         key={i}
//                         className={`btn ${isSelected ? "btn-dark" : "btn-outline-secondary"}`}
//                         onClick={() => { 
//                           handleVariantSelect(v); 
//                           setShowVariantOverlay(false); 
//                         }}
//                       >
//                         {getVariantDisplayText(v)}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// };

// export default ProductDetailsHero;


















// src/components/ProductDetailsHero.jsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  FaStar, FaHeart, FaRegHeart, FaShoppingBag,
  FaChevronUp, FaChevronDown, FaTimes
} from "react-icons/fa";
import "../css/ProductDetailsHero.css";

// --- Helper Functions ---
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

// Check if variant is out of stock
const isOutOfStock = (variant) => {
  if (variant.stock === undefined || variant.stock === null) return false;
  return Number(variant.stock) <= 0;
};

// Description Accordion
const ProductDetailDescription = ({ product }) => {
  return (
    <section className="product-extra-section mt-5 border-none">
      <div className="details-section border-none">
        <div className="accordion border-none">
          <details>
            <summary>Description</summary>
            <p className="mt-3">{product.description || "No description available."}</p>
          </details>
          <details>
            <summary>Ingredients</summary>
            <p className="mt-3">
              {product.ingredients?.length > 0
                ? product.ingredients.join(", ")
                : "Ingredients not provided."}
            </p>
          </details>
          <details>
            <summary>How To Use</summary>
            <p className="mt-3">
              {product.howToUse?.length > 0
                ? product.howToUse.join(" • ")
                : "Usage instructions not provided."}
            </p>
          </details>
          <details>
            <summary>Special Features</summary>
            <p className="mt-3">
              {product.features?.length > 0
                ? product.features.join(" • ")
                : "No special features listed."}
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

const ProductDetailsHero = ({
  product,
  selectedShade,
  displayImages: initialDisplayImages,
  reviewSummary,
  variantsList,
  isInWishlist,
  wishlistLoading,
  handleVariantSelect,
  toggleWishlist,
  handleAddToCart,
  setDisplayImages,
  toast
}) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [showVariantOverlay, setShowVariantOverlay] = useState(false);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  const [mainImageIndex, setMainImageIndex] = useState(0);

  const thumbnailsPerView = 4;

  useEffect(() => {
    setMainImageIndex(0);
    setThumbnailStartIndex(0);
  }, [initialDisplayImages]);

  const groupedVariants = useMemo(() => {
    const grouped = { color: [], text: [] };
    variantsList.forEach((v) => {
      if (v.hex && isValidHexColor(v.hex)) {
        grouped.color.push(v);
      } else {
        grouped.text.push(v);
      }
    });
    return grouped;
  }, [variantsList]);

  const showPrevThumbnails = () => setThumbnailStartIndex(prev => Math.max(0, prev - 1));
  const showNextThumbnails = () => setThumbnailStartIndex(prev =>
    Math.min(initialDisplayImages.length - thumbnailsPerView, prev + 1)
  );

  const handleThumbnailClick = (index) => {
    setMainImageIndex(index);
  };

  const handleAddToCartClick = async () => {
    if (!selectedShade) {
      toast.warn("Please select a variant first");
      return;
    }
    if (isOutOfStock(selectedShade)) {
      toast.error("This variant is currently out of stock");
      return;
    }
    setAddingToCart(true);
    try {
      await handleAddToCart();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleVariantClick = (variant) => {
    if (isOutOfStock(variant)) {
      toast.warn("This variant is out of stock");
      return;
    }
    handleVariantSelect(variant);
  };

  const visibleThumbnails = initialDisplayImages.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + thumbnailsPerView
  );

  const canScrollUp = thumbnailStartIndex > 0;
  const canScrollDown = thumbnailStartIndex + thumbnailsPerView < initialDisplayImages.length;

  const currentMainImage = initialDisplayImages[mainImageIndex] || initialDisplayImages[0] || "/placeholder.png";

  return (
    <article className="product-hero-container pb-lg-0 pb-0">

      {/* LEFT: THUMBNAILS + MAIN IMAGE */}
      <div className="product-hero-left">
        <div className="product-hero-image-wrapper">
          <div className="product-hero-thumbnails">
            {initialDisplayImages.length > thumbnailsPerView && (
              <button className="btn btn-link p-0 thumbnail-nav-btn right-sides"
                onClick={showPrevThumbnails} disabled={!canScrollUp}>
                <FaChevronUp color={canScrollUp ? "#333" : "#ccc"} />
              </button>
            )}

            <div className="product-hero-thumbnails-list">
              {visibleThumbnails.map((img, idx) => {
                const absoluteIndex = thumbnailStartIndex + idx;
                const isActive = absoluteIndex === mainImageIndex;
                return (
                  <img
                    key={absoluteIndex}
                    src={img}
                    onClick={() => handleThumbnailClick(absoluteIndex)}
                    className={`product-hero-thumbnail ${isActive ? 'active-thumbnail' : ''}`}
                    alt={`thumb-${absoluteIndex}`}
                    loading="lazy"
                  />
                );
              })}
            </div>

            {initialDisplayImages.length > thumbnailsPerView && (
              <button className="btn btn-link p-0 thumbnail-nav-btn left-side"
                onClick={showNextThumbnails} disabled={!canScrollDown}>
                <FaChevronDown color={canScrollDown ? "#333" : "#ccc"} />
              </button>
            )}
          </div>

          <div className="product-hero-main-image">
            <img
              src={currentMainImage}
              alt={product?.name || "Product"}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
            />
            <button
              className="product-hero-wishlist-btn"
              onClick={toggleWishlist}
              disabled={wishlistLoading}
            >
              {isInWishlist ? <FaHeart color="#dc3545" size={22} /> : <FaRegHeart color="#ccc" size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - INFO */}
      <div className="product-hero-right">
        <p className="text-muted mb-1 text-start mt-lg-2 mt-4">
          {product.brand?.name || product.brand || "Brand Name"}
        </p>
        {(() => {
          const varText = selectedShade ? getVariantDisplayText(selectedShade) : "";
          const mainTitleName = varText && varText.toUpperCase() !== "DEFAULT" ? `${product.name} - ${varText}` : product.name;
          return <h1 className="fs-3 fw-bold mb-2 text-start">{mainTitleName}</h1>;
        })()}

        <div className="d-flex align-items-center gap-1 mb-3 text-start">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              color={i < Math.round(reviewSummary.avgRating || 0) ? "#ffc107" : "#e4e5e9"}
            />
          ))}
          <span className="text-muted ms-2">
            ({reviewSummary.totalReviews || 0} reviews)
          </span>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4 text-start">
          <span className="fs-2 fw-bold text-dark">
            Rs {selectedShade?.displayPrice || product.price}
          </span>
          {selectedShade?.originalPrice > selectedShade?.displayPrice && (
            <del className="text-muted fs-5">Rs {selectedShade.originalPrice}</del>
          )}
          <span className="text-success fw-bold">10% off</span>
        </div>

        {/* Selected Variant Display */}
        {selectedShade && (
          <div className="text-muted small text-start mb-3">
            Selected Option: <span className="fw-bold text-dark">{getVariantDisplayText(selectedShade)}</span>
          </div>
        )}

        {/* Color Variants */}
        <div className="mb-4 text-start">
          <p className="fw-bold mb-2">Color</p>
          <div className="d-flex flex-wrap gap-2">
            {groupedVariants.color.slice(0, 4).map((v, i) => {
              const isSelected = selectedShade?.sku === getSku(v);
              const outOfStock = isOutOfStock(v);
              return (
                <div
                  key={i}
                  onClick={() => !outOfStock && handleVariantClick(v)}
                  className={`color-swatch ${outOfStock ? 'out-of-stock-swatch' : ''}`}
                  style={{
                    backgroundColor: v.hex,
                    border: isSelected ? '2px solid #000' : '1px solid #ddd',
                    cursor: outOfStock ? 'not-allowed' : 'pointer',
                    opacity: outOfStock ? 0.5 : 1,
                  }}
                  title={outOfStock ? `${v.shadeName || v.name} - Out of Stock` : v.shadeName || v.name}
                >
                  {isSelected && !outOfStock && <span className="color-swatch-check">✓</span>}
                  {outOfStock && <span className="color-swatch-cross">✕</span>}
                </div>
              );
            })}
            {groupedVariants.color.length > 4 && (
              <button
                className="btn border fw-normal more-variants-btn"
                onClick={() => {
                  setSelectedVariantType("color");
                  setShowVariantOverlay(true);
                }}
              >
                +{groupedVariants.color.length - 4}
              </button>
            )}
          </div>
        </div>

        {/* Text Variants */}
        <div className="mb-4 d-flex gap-2">
          {groupedVariants.text.slice(0, 2).map((v, i) => {
            const isSelected = selectedShade?.sku === getSku(v);
            const outOfStock = isOutOfStock(v);
            return (
              <button
                key={i}
                className={`btn text-variant-btn ${outOfStock ? 'out-of-stock-text-btn' : (isSelected ? "btn-dark" : "btn-outline-secondary")}`}
                onClick={() => !outOfStock && handleVariantClick(v)}
                disabled={outOfStock}
                title={outOfStock ? `${getVariantDisplayText(v)} - Out of Stock` : getVariantDisplayText(v)}
              >
                {outOfStock && <span className="text-cross me-1">✕</span>}
                {getVariantDisplayText(v)}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3 mb-4">
          <button
            className="btn btn-dark flex-grow-1 py-3 fw-normal action-btn page-title-main-name"
            onClick={handleAddToCartClick}
            disabled={addingToCart || !selectedShade || isOutOfStock(selectedShade)}
          >
            {addingToCart ? "Adding..." : isOutOfStock(selectedShade) ? "Out of Stock" : "Add To Bag"}
            <FaShoppingBag className="ms-2" />
          </button>

          <button
            className="btn btn-outline-dark flex-grow-1 py-3 fw-normal action-btn"
            onClick={toggleWishlist}
            disabled={wishlistLoading}
          >
            Wishlist <FaRegHeart className="ms-2" />
          </button>
        </div>

        <ProductDetailDescription product={product} />
      </div>

      {/* Variant Overlay */}
      {showVariantOverlay && (
        <div className="variant-overlay position-absolute bg-white p-0 m-0" onClick={() => setShowVariantOverlay(false)}>
          <div
            className="variant-overlay-content mw-100 p-0"
            onClick={e => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: 500,
              maxHeight: "80vh",
              background: "#fff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom w-100">
              <h5 className="m-0 fw-bold">Select Variant</h5>
              <button className="btn p-0 fs-4" onClick={() => setShowVariantOverlay(false)}>
                <FaTimes />
              </button>
            </div> */}

            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="m-0 page-title-main-name">Select Variant</h5>
              <button onClick={() => setShowVariantOverlay(false)} style={{ background: 'none', border: 'none', fontSize: '40px' }}>×</button>
            </div>

            <div className="p-3 overflow-auto flex-grow-1 w-100">
              {/* Color Variants Grid */}
              {groupedVariants.color.length > 0 && (
                <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-4">
                  {groupedVariants.color.map((v, i) => {
                    const isSelected = selectedShade?.sku === getSku(v);
                    const outOfStock = isOutOfStock(v);
                    return (
                      <div
                        key={i}
                        style={{ cursor: outOfStock ? "not-allowed" : "pointer", position: "relative" }}
                        onClick={() => {
                          if (!outOfStock) {
                            handleVariantClick(v);
                          } else {
                            toast.warn("This variant is out of stock");
                          }
                        }}
                        title={outOfStock ? `${v.shadeName || v.name} - Out of Stock` : v.shadeName || v.name}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: "20%",
                          backgroundColor: v.hex || "#ccc",
                          border: isSelected && !outOfStock ? "3px solid #000" : "1px solid #ddd",
                          opacity: outOfStock ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {isSelected && !outOfStock && <span className="overlay-check" style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>✓</span>}
                        </div>
                        {outOfStock && <span style={{
                          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "red", fontWeight: "bold", fontSize: 16, pointerEvents: "none"
                        }}>✕</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Size/Text Variants Grid */}
              {groupedVariants.text.length > 0 && (
                <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                  {groupedVariants.text.map((v, i) => {
                    const isSelected = selectedShade?.sku === getSku(v);
                    const outOfStock = isOutOfStock(v);
                    return (
                      <button
                        key={i}
                        className={`btn ${outOfStock ? 'out-of-stock-overlay-text-btn' : (isSelected ? "btn-dark" : "btn-outline-secondary")}`}
                        onClick={() => {
                          if (!outOfStock) {
                            handleVariantClick(v);
                          } else {
                            toast.warn("This variant is out of stock");
                          }
                        }}
                        disabled={outOfStock}
                        title={outOfStock ? `${getVariantDisplayText(v)} - Out of Stock` : getVariantDisplayText(v)}
                        style={{
                          padding: "8px 16px", borderRadius: 8,
                          opacity: outOfStock ? 0.4 : 1
                        }}
                      >
                        {getVariantDisplayText(v)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Footer for Add to Cart */}
            <div className="overlay-footer p-3 border-top bg-light d-flex flex-column gap-2 align-items-center w-100">
              {selectedShade && (
                <div className="small text-muted fw-semibold">
                  Selected: <span className="text-dark fw-bold">{getVariantDisplayText(selectedShade)}</span>
                </div>
              )}
              <button
                className="btn btn-dark w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleAddToCartClick();
                  setShowVariantOverlay(false);
                }}
                disabled={addingToCart || !selectedShade || isOutOfStock(selectedShade)}
              >
                {addingToCart ? "Adding..." : (isOutOfStock(selectedShade) ? "Out of Stock" : "Add to Bag")}
                <FaShoppingBag />
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default ProductDetailsHero;