// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
// import { Button, Badge } from "react-bootstrap";

// const API_BASE = "https://beauty.joyory.com/api/user/cart";

// const DiscountProductsPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { coupon, activeCouponTab } = location.state || {};

//   const [discountProducts, setDiscountProducts] = useState([]);
//   const [loadingDiscountProducts, setLoadingDiscountProducts] = useState(false);
//   const [currentProductPage, setCurrentProductPage] = useState(1);
//   const [totalProductPages, setTotalProductPages] = useState(1);

//   const fetchDiscountProducts = async (discountId, page = 1) => {
//     try {
//       setLoadingDiscountProducts(true);
//       const tokenExists = document.cookie.includes("token=");

//       if (!tokenExists) {
//         alert("Please login to view discount details");
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(
//         `${API_BASE}/discount/${discountId}?page=${page}`,
//         { credentials: "include" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch discount products");
//       }

//       const data = await response.json();

//       setDiscountProducts(data.products || []);
//       setTotalProductPages(data.totalPages || 1);
//       setCurrentProductPage(data.currentPage || 1);

//     } catch (error) {
//       console.error("Error fetching discount products:", error);
//       alert("Failed to load discount products. Please try again.");
//     } finally {
//       setLoadingDiscountProducts(false);
//     }
//   };

//   const handleProductPageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalProductPages && coupon) {
//       setCurrentProductPage(newPage);
//       const discountId = coupon._id || coupon.id || coupon.discountId || coupon.couponId || coupon.code;
//       fetchDiscountProducts(discountId, newPage);
//     }
//   };

//   const handleDiscountProductClick = (product) => {
//     if (product.slugs && product.slugs.length > 0) {
//       navigate(`/product/${product.slugs[0]}`);
//     } else if (product._id) {
//       navigate(`/product/${product._id}`);
//     }
//   };

//   const handleApplyCoupon = () => {
//     navigate("/cartpage", {
//       state: { applyCouponCode: coupon.code }
//     });
//   };

//   const handleClose = () => {
//     navigate("/cartpage");
//   };

//   useEffect(() => {
//     if (coupon) {
//       const discountId = coupon._id || coupon.id || coupon.discountId || coupon.couponId || coupon.code;
//       if (discountId) {
//         fetchDiscountProducts(discountId, 1);
//       } else {
//         alert("Error: Invalid coupon data");
//         navigate("/cartpage");
//       }
//     } else {
//       navigate("/cartpage");
//     }
//   }, [coupon]);

//   return (
//     <>
//       <Header />
//       <div className="container mt-4">
//         <h2>Discount Products</h2>
//         {coupon && (
//           <div className="mb-4">
//             <div className="fw-bold text-primary">{coupon.code}</div>
//             <div className="small text-muted mt-1">
//               {coupon.label || coupon.description}
//             </div>
//           </div>
//         )}
//         {loadingDiscountProducts ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading products...</span>
//             </div>
//             <p className="mt-3">Loading applicable products...</p>
//           </div>
//         ) : discountProducts.length > 0 ? (
//           <>
//             <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//               {discountProducts.map((product) => {
//                 const productImage = product.selectedVariant?.images?.[0] || 
//                                      product.variants?.[0]?.images?.[0] || 
//                                      product.images?.[0] || 
//                                      "/placeholder.png";
//                 const productPrice = product.selectedVariant?.displayPrice || 
//                                      product.price || 
//                                      "N/A";
//                 const originalPrice = product.selectedVariant?.originalPrice;
//                 const hasDiscount = originalPrice && originalPrice > productPrice;
//                 const brandName = product.brand?.name || "Unknown Brand";
//                 const categoryName = product.category?.name || "Uncategorized";

//                 return (
//                   <div 
//                     key={product._id} 
//                     className="col"
//                     onClick={() => handleDiscountProductClick(product)}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className="card h-100 shadow-sm border-0">
//                       <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
//                         <img
//                           src={productImage}
//                           alt={product.name}
//                           className="card-img-top h-100 object-fit-cover"
//                           style={{ transition: 'transform 0.3s ease' }}
//                           onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//                           onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//                         />
//                         {hasDiscount && (
//                           <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small">
//                             {Math.round(((originalPrice - productPrice) / originalPrice) * 100)}% OFF
//                           </span>
//                         )}
//                       </div>
//                       <div className="card-body">
//                         <h6 className="card-title text-truncate">{product.name}</h6>
//                         <p className="card-text small text-muted mb-1">{brandName}</p>
//                         <p className="card-text small text-muted mb-2">{categoryName}</p>
//                         <div className="d-flex align-items-center justify-content-between">
//                           <div>
//                             <span className="fw-bold text-dark">₹{productPrice}</span>
//                             {hasDiscount && (
//                               <span className="text-muted text-decoration-line-through ms-2">
//                                 ₹{originalPrice}
//                               </span>
//                             )}
//                           </div>
//                           <Badge bg="info" className="small">
//                             Eligible
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination Controls */}
//             {totalProductPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center mt-4">
//                 <button
//                   className="btn btn-outline-primary btn-sm me-2"
//                   onClick={() => handleProductPageChange(currentProductPage - 1)}
//                   disabled={currentProductPage === 1 || loadingDiscountProducts}
//                 >
//                   <FaArrowLeft className="me-1" /> Previous
//                 </button>
//                 <span className="mx-3">
//                   Page {currentProductPage} of {totalProductPages}
//                 </span>
//                 <button
//                   className="btn btn-outline-primary btn-sm ms-2"
//                   onClick={() => handleProductPageChange(currentProductPage + 1)}
//                   disabled={currentProductPage === totalProductPages || loadingDiscountProducts}
//                 >
//                   Next <FaArrowRight className="ms-1" />
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="text-center py-5">
//             <div className="display-1 text-muted mb-3">🛍️</div>
//             <h5>No products found for this coupon</h5>
//             <p className="text-muted">This coupon may not be applicable to any products at the moment.</p>
//           </div>
//         )}
//         <div className="d-flex justify-content-end mt-4">
//           <Button variant="secondary" onClick={handleClose} className="me-2">
//             Close
//           </Button>
//           {coupon && activeCouponTab === "available" && (
//             <Button variant="primary" onClick={handleApplyCoupon}>
//               Apply This Coupon
//             </Button>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default DiscountProductsPage;




































// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaArrowRight, FaArrowLeft, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { CartContext } from "../Context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";

// const API_BASE = "https://beauty.joyory.com/api/user/cart";

// // Helper functions from ProductPage
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

// const DiscountProductsPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { coupon, activeCouponTab } = location.state || {};

//   // ===================== STATES =====================
//   const [discountProducts, setDiscountProducts] = useState([]);
//   const [loadingDiscountProducts, setLoadingDiscountProducts] = useState(false);
//   const [currentProductPage, setCurrentProductPage] = useState(1);
//   const [totalProductPages, setTotalProductPages] = useState(1);
//   const [error, setError] = useState(null);

//   // ProductPage functionality states
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Filtering states
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

//   // Context
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // ===================== TOAST UTILITY =====================
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

//   // Build query parameters
//   const buildQueryParams = () => {
//     const params = new URLSearchParams();

//     // Add filters to query params
//     if (filters.brand) params.append('brandIds', filters.brand);
//     if (filters.category) params.append('category', filters.category);
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

//     // Set limit
//     params.append('limit', 9);

//     return params.toString();
//   };

//   // ===================== DISCOUNT PRODUCTS FETCH =====================
//   // const fetchDiscountProducts = async (discountId, page = 1) => {
//   //   try {
//   //     setLoadingDiscountProducts(true);
//   //     setError(null);

//   //     const tokenExists = document.cookie.includes("token=");
//   //     if (!tokenExists) {
//   //       showToastMsg("Please login to view discount details", "error");
//   //       navigate("/login");
//   //       return;
//   //     }

//   //     const params = buildQueryParams();
//   //     const response = await fetch(
//   //       `${API_BASE}/discount/${discountId}?page=${page}&${params}`,
//   //       { credentials: "include" }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error(`Failed to fetch discount products: ${response.statusText}`);
//   //     }

//   //     const data = await response.json();
//   //     console.log("Discount Products API Response:", data);

//   //     if (data.success && data.products) {
//   //       // Initialize selected variants from backend selectedVariant
//   //       const initialSelectedVariants = {};
//   //       data.products.forEach(product => {
//   //         if (product.selectedVariant) {
//   //           initialSelectedVariants[product._id] = product.selectedVariant;
//   //         } else if (product.variants && product.variants.length > 0) {
//   //           initialSelectedVariants[product._id] = product.variants[0];
//   //         }
//   //       });
//   //       setSelectedVariants(initialSelectedVariants);

//   //       setDiscountProducts(data.products);
//   //       setTotalProductPages(data.totalPages || 1);
//   //       setCurrentProductPage(data.currentPage || 1);
//   //       setFilterData(data.filterData || null); // If backend provides
//   //     } else {
//   //       throw new Error("Invalid data format from backend");
//   //     }

//   //   } catch (error) {
//   //     console.error("Error fetching discount products:", error);
//   //     setError(error.message);
//   //     setDiscountProducts([]);
//   //   } finally {
//   //     setLoadingDiscountProducts(false);
//   //   }
//   // };




//   const fetchDiscountProducts = async (page = 1) => {
//   try {
//     setLoadingDiscountProducts(true);
//     setError(null);

//     const discountCode = coupon?.code || "LAKME100OFF2026";

//     const response = await fetch(
//       `https://beauty.joyory.com/api/user/products/all?discountCode=${discountCode}&page=${page}`,
//       { credentials: "include" }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch discount products");
//     }

//     const data = await response.json();
//     console.log("Discount Products API Response:", data);

//     if (data.products) {
//       setDiscountProducts(data.products);
//       setTotalProductPages(data.totalPages || 1);
//       setCurrentProductPage(data.page || 1);
//     } else {
//       setDiscountProducts([]);
//     }

//   } catch (error) {
//     console.error("Error fetching discount products:", error);
//     setError(error.message);
//   } finally {
//     setLoadingDiscountProducts(false);
//   }
// };

//   // ===================== PRODUCT PAGE FUNCTIONALITY =====================
//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const getProductSlug = (product) => {
//     if (product.slugs && product.slugs.length > 0) return product.slugs[0];
//     return product._id;
//   };

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

//   // ===================== RENDER PRODUCT CARD (From ProductPage) =====================
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const selectedVariant = selectedVariants[prod._id] || variants[0] || prod.selectedVariant;
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

//     // Get price information
//     const price = selectedVariant?.displayPrice ||
//       selectedVariant?.discountedPrice ||
//       prod.price ||
//       0;
//     const originalPrice = selectedVariant?.originalPrice ||
//       selectedVariant?.mrp ||
//       prod.mrp ||
//       price;
//     const hasDiscount = originalPrice > price;
//     const discountPercent = hasDiscount
//       ? Math.round(((originalPrice - price) / originalPrice) * 100)
//       : 0;

//     return (
//       <div
//         key={prod._id}
//         className="col-6 col-md-4 col-lg-4 mb-4"
//         style={{ height: "500px" , position:'relative' }}
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

//         {/* Eligible Badge */}
//         <div
//           style={{
//             position: "absolute",
//             top: "8px",
//             left: "8px",
//             background: "#17a2b8",
//             color: "white",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             fontWeight: "bold",
//             zIndex: 2
//           }}
//         >
//           Eligible
//         </div>

//         {/* Product Image */}
//         <img
//           src={imageUrl}
//           alt={prod.name}
//           className="card-img-top"
//           style={{
//             height: "200px",
//             width: "100%",
//             objectFit: "contain",
//             cursor: "pointer",
//           }}
//           onClick={() => navigate(`/product/${productSlug}`)}
//         />

//         {/* Discount Badge */}
//         {hasDiscount && (
//           <div
//             style={{
//               position: "absolute",
//               top: "40px",
//               left: "8px",
//               background: "#dc3545",
//               color: "white",
//               padding: "4px 8px",
//               borderRadius: "4px",
//               fontSize: "12px",
//               fontWeight: "bold",
//               zIndex: 2
//             }}
//           >
//             {discountPercent}% OFF
//           </div>
//         )}

//         {/* Card Body */}
//         <div className="card-body p-0 d-flex flex-column" style={{ height: "280px" }}>
//           {/* Rating */}
//           <div className="d-flex align-items-center mt-2">
//             {renderStars(prod.avgRating || 0)}
//             <span className="ms-2 text-muted small">
//               ({prod.totalRatings || 0})
//             </span>
//           </div>

//           {/* Brand */}
//           <div className="brand-name text-muted small mb-1 fw-medium">
//             {getBrandName(prod)}
//           </div>

//           {/* Product Name */}
//           <h6
//             className="card-title mt-2 align-items-center gap-1"
//             style={{ 
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "600",
//               minHeight: "40px",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical"
//             }}
//             onClick={() => navigate(`/product/${productSlug}`)}
//           >
//             {prod.name}
//             {selectedVariant && selectedVariant.shadeName && (
//               <div
//                 className="text-black fw-normal fs-6"
//                 style={{ marginTop: "2px", fontSize: "12px" }}
//               >
//                 {getVariantDisplayText(selectedVariant)}
//               </div>
//             )}
//           </h6>

//           {/* Variant Selection */}
//           {variants.length > 0 && (
//             <div className="variant-section mt-2">
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
//                           width: "24px",
//                           height: "24px",
//                           borderRadius: "30%",
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
//                               fontSize: "12px",
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
//                         width: "24px",
//                         height: "24px",
//                         borderRadius: "50%",
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
//                         className={`variant-text ${
//                           isSelected ? "selected" : ""
//                         }`}
//                         style={{
//                           padding: "4px 8px",
//                           borderRadius: "4px",
//                           border: isSelected
//                             ? "2px solid #000"
//                             : "1px solid #ddd",
//                           background: isSelected
//                             ? "#000"
//                             : "#fff",
//                           color: isSelected ? "#fff" : "#000",
//                           fontSize: "11px",
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
//                       className="more-btn"
//                       onClick={() =>
//                         openVariantOverlay(prod._id, "text")
//                       }
//                       style={{
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "11px",
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
//           <div className="mt-auto">
//             <p
//               className="fw-bold mb-2"
//               style={{ fontSize: "16px" }}
//             >
//               ₹{price}
//               {hasDiscount && (
//                 <>
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#888",
//                       marginLeft: "8px",
//                       fontSize: "14px",
//                     }}
//                   >
//                     ₹{originalPrice}
//                   </span>
//                   <span
//                     style={{
//                       color: "#e53e3e",
//                       marginLeft: "8px",
//                       fontWeight: "600",
//                       fontSize: "14px",
//                     }}
//                   >
//                     ({discountPercent}% OFF)
//                   </span>
//                 </>
//               )}
//             </p>

//             {/* Add to Cart Button */}
//             <button
//               className={`add-to-cart-btn w-100 d-flex align-items-center justify-content-center gap-2 ${
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
//                 padding: "8px 16px",
//                 backgroundColor: "#000",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "4px",
//                 transition: "background-color 0.3s ease, color 0.3s ease",
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
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               // backgroundColor: "rgba(0,0,0,0.5)",
//               zIndex: 9999,
//               display: "flex",
//               // alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <div
//               className="variant-overlay-content"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//                 maxHeight: "100%",
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
//                     cursor: "pointer"
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
//                   style={{
//                     border: "none",
//                     background: selectedVariantType === "all" ? "#000" : "#fff",
//                     cursor: "pointer"
//                   }}
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
//                     style={{
//                       border: "none",
//                       background: selectedVariantType === "color" ? "#000" : "#fff",
//                       cursor: "pointer"
//                     }}
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
//                     style={{
//                       border: "none",
//                       background: selectedVariantType === "text" ? "#f8f9fa" : "#fff",
//                       cursor: "pointer"
//                     }}
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
//                     <div className="row row-col-4 g-3 mb-4">
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
//                                   borderRadius: "30%",
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

//   // ===================== EVENT HANDLERS =====================
//   const handleProductPageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalProductPages && coupon) {
//       setCurrentProductPage(newPage);
//       const discountId = coupon._id || coupon.id || coupon.discountId || coupon.couponId;
//       fetchDiscountProducts(discountId, newPage);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleApplyCoupon = () => {
//     if (coupon && coupon.code) {
//       localStorage.setItem("appliedCoupon", coupon.code);
//       navigate("/cartpage", {
//         state: { couponApplied: true }
//       });
//     }
//   };

//   const handleClose = () => {
//     navigate("/cartpage");
//   };

//   // ===================== USE EFFECTS =====================
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   useEffect(() => {
//     if (coupon) {
//       const discountId = coupon._id || coupon.id || coupon.discountId || coupon.couponId;
//       if (discountId) {
//         fetchDiscountProducts(discountId, 1);
//       } else {
//         setError("Error: Invalid coupon data");
//       }
//     } else {
//       navigate("/cartpage");
//     }
//   }, [coupon, navigate, filters]); // Added filters to refetch on change

//   // ===================== LOADING STATE =====================
//   if (loadingDiscountProducts) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-4 page-title-main-name">
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-3">Loading discount products...</p>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // ===================== ERROR STATE =====================
//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-4 page-title-main-name">
//           <div className="alert alert-danger mt-4">
//             <h5>Error Loading Discount Products</h5>
//             <p>{error}</p>
//             <button 
//               className="btn btn-primary" 
//               onClick={() => fetchDiscountProducts(coupon._id || coupon.id, 1)}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 page-title-main-name">
//         {/* Breadcrumb */}
//         <nav aria-label="breadcrumb" className="mb-4">
//           <ol className="breadcrumb">
//             <li className="breadcrumb-item"><Link to="/">Home</Link></li>
//             <li className="breadcrumb-item"><Link to="/cartpage">Cart</Link></li>
//             <li className="breadcrumb-item active">Discount Products</li>
//           </ol>
//         </nav>

//         {/* Coupon Header */}
//         {coupon && (
//           <div className="bg-light p-4 rounded mb-4">
//             <div className="row align-items-center">
//               <div className="col-md-8">
//                 <h3 className="text-primary mb-2">
//                   {coupon.code || 'Discount Products'}
//                 </h3>
//                 <p className="text-muted mb-0">
//                   {coupon.label || coupon.description || 'Products applicable for this discount'}
//                 </p>
//                 {coupon.discountPercent && (
//                   <span className="badge bg-success mt-2">
//                     {coupon.discountPercent}% OFF
//                   </span>
//                 )}
//               </div>
//               <div className="col-md-4 text-md-end mt-3 mt-md-0">
//                 <button 
//                   className="btn btn-outline-secondary me-2"
//                   onClick={handleClose}
//                 >
//                   <FaArrowLeft className="me-1" />
//                   Back to Cart
//                 </button>
//                 {activeCouponTab === "available" && (
//                   <button className="btn btn-primary" onClick={handleApplyCoupon}>
//                     Apply Coupon
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Mobile Filter + Sort Buttons */}
//         <div className="d-lg-none mb-3">
//           <div className="w-100 filter-responsive rounded shadow-sm">
//             <div className="container-fluid p-0">
//               <div
//                 className="row g-0"
//                 style={{ flexDirection: "row-reverse" }}
//               >
//                 {/* Filter Button */}
//                 <div className="col-6">
//                   <button
//                     className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                     onClick={() => setShowFilterOffcanvas(true)}
//                     style={{ gap: "12px" }}
//                   >
//                     <img
//                       src={filtering}
//                       alt="Filter"
//                       style={{ width: "25px" }}
//                     />
//                     <div className="text-start">
//                       <p className="mb-0 fs-6 fw-semibold">Filter</p>
//                       <span className="text-muted small">Tap to apply</span>
//                     </div>
//                   </button>
//                 </div>

//                 {/* Sort Button */}
//                 <div className="col-6 border-end">
//                   <button
//                     className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                     onClick={() => setShowSortOffcanvas(true)}
//                     style={{ gap: "12px" }}
//                   >
//                     <img
//                       src={updownarrow}
//                       alt="Sort"
//                       style={{ width: "25px" }}
//                     />
//                     <div className="text-start">
//                       <p className="mb-0 fs-6 fw-semibold">Sort by</p>
//                       <span className="text-muted small">
//                         {getCurrentSortText()}
//                       </span>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Filter Offcanvas */}
//         {showFilterOffcanvas && (
//           <>
//             <div
//               className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//               style={{ opacity: 0.5, zIndex: 1040 }}
//               onClick={() => setShowFilterOffcanvas(false)}
//             ></div>
//             <div
//               className="position-fixed start-0 bottom-0 w-100 bg-white"
//               style={{
//                 zIndex: 1050,
//                 borderTopLeftRadius: "16px",
//                 borderTopRightRadius: "16px",
//                 maxHeight: "85vh",
//                 boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
//               }}
//             >
//               <div className="text-center py-3 position-relative">
//                 <h5 className="mb-0 fw-bold">Filters</h5>
//                 <button
//                   className="btn-close position-absolute end-0 me-3"
//                   style={{ top: "50%", transform: "translateY(-50%)" }}
//                   onClick={() => setShowFilterOffcanvas(false)}
//                 ></button>
//                 <div
//                   className="mx-auto mt-2 bg-secondary"
//                   style={{
//                     height: "5px",
//                     width: "50px",
//                     borderRadius: "3px",
//                   }}
//                 ></div>
//               </div>
//               <div
//                 className="px-3 pb-4 overflow-auto"
//                 style={{ maxHeight: "70vh" }}
//               >
//                 <BrandFilter
//                   filters={filters}
//                   setFilters={setFilters}
//                   filterData={filterData}
//                   products={discountProducts}
//                   onClose={() => setShowFilterOffcanvas(false)}
//                   hideBrandFilter={false}
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Mobile Sort Offcanvas */}
//         {showSortOffcanvas && (
//           <>
//             <div
//               className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//               style={{ opacity: 0.5, zIndex: 1040 }}
//               onClick={() => setShowSortOffcanvas(false)}
//             ></div>
//             <div
//               className="position-fixed start-0 bottom-0 w-100 bg-white"
//               style={{
//                 zIndex: 1050,
//                 borderTopLeftRadius: "16px",
//                 borderTopRightRadius: "16px",
//                 maxHeight: "60vh",
//                 boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
//               }}
//             >
//               <div className="text-center py-3 position-relative">
//                 <h5 className="mb-0 fw-bold">Sort by</h5>
//                 <button
//                   className="btn-close position-absolute end-0 me-3"
//                   style={{ top: "50%", transform: "translateY(-50%)" }}
//                   onClick={() => setShowSortOffcanvas(false)}
//                 ></button>
//                 <div
//                   className="mx-auto mt-2 bg-secondary"
//                   style={{
//                     height: "5px",
//                     width: "50px",
//                     borderRadius: "3px",
//                   }}
//                 ></div>
//               </div>
//               <div className="px-4 pb-4">
//                 <div className="list-group">
//                   <label className="list-group-item py-3 d-flex align-items-center">
//                     <input
//                       className="form-check-input me-3"
//                       type="radio"
//                       name="sort"
//                       checked={!filters.discountSort}
//                       onChange={() => {
//                         setFilters((prev) => ({ ...prev, discountSort: "" }));
//                         setShowSortOffcanvas(false);
//                       }}
//                     />
//                     <span>Relevance</span>
//                   </label>
//                   <label className="list-group-item py-3 d-flex align-items-center">
//                     <input
//                       className="form-check-input me-3"
//                       type="radio"
//                       name="sort"
//                       checked={filters.discountSort === "high"}
//                       onChange={() => {
//                         setFilters((prev) => ({
//                           ...prev,
//                           discountSort: "high",
//                         }));
//                         setShowSortOffcanvas(false);
//                       }}
//                     />
//                     <span>Highest Discount First</span>
//                   </label>
//                   <label className="list-group-item py-3 d-flex align-items-center">
//                     <input
//                       className="form-check-input me-3"
//                       type="radio"
//                       name="sort"
//                       checked={filters.discountSort === "low"}
//                       onChange={() => {
//                         setFilters((prev) => ({
//                           ...prev,
//                           discountSort: "low",
//                         }));
//                         setShowSortOffcanvas(false);
//                       }}
//                     />
//                     <span>Lowest Discount First</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Products Grid Header */}
//         <div className="row mb-4">
//           <div className="col-12 d-flex justify-content-between align-items-center">
//             <h4>
//               Products Eligible for Discount 
//               <span className="text-muted fs-6"> ({discountProducts.length} products)</span>
//             </h4>
//             {Object.values(filters).some(
//               (val) => val !== "" && val !== null
//             ) && (
//               <button
//                 className="btn btn-sm btn-outline-danger"
//                 onClick={() =>
//                   setFilters({
//                     brand: "",
//                     category: "",
//                     skinType: "",
//                     formulation: "",
//                     priceRange: null,
//                     minRating: "",
//                     discountSort: "",
//                   })
//                 }
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Desktop Sidebar */}
//         <div className="row">
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter
//               filters={filters}
//               setFilters={setFilters}
//               currentPage="category"
//             />
//           </div>

//           <div className="col-12 col-lg-9">
//             {/* Products Grid */}
//             {discountProducts.length > 0 ? (
//               <div className="row">
//                 {discountProducts.map(renderProductCard)}
//               </div>
//             ) : (
//               <div className="text-center py-5">
//                 <div className="display-1 text-muted mb-3">🛍️</div>
//                 <h5>No products found for this coupon</h5>
//                 <p className="text-muted">This coupon may not be applicable to any products at the moment.</p>
//                 <button className="btn btn-primary" onClick={handleClose}>
//                   Back to Cart
//                 </button>
//               </div>
//             )}

//             {/* Pagination */}
//             {totalProductPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center mt-5">
//                 <button
//                   className="btn btn-outline-primary me-2"
//                   onClick={() => handleProductPageChange(currentProductPage - 1)}
//                   disabled={currentProductPage === 1 || loadingDiscountProducts}
//                 >
//                   <FaArrowLeft className="me-1" />
//                   Previous
//                 </button>

//                 <div className="mx-3">
//                   <span className="text-muted">
//                     Page {currentProductPage} of {totalProductPages}
//                   </span>
//                 </div>

//                 <button
//                   className="btn btn-outline-primary"
//                   onClick={() => handleProductPageChange(currentProductPage + 1)}
//                   disabled={currentProductPage === totalProductPages || loadingDiscountProducts}
//                 >
//                   Next
//                   <FaArrowRight className="ms-1" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default DiscountProductsPage;







// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaArrowLeft, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { CartContext } from "../Context/Cartcontext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";

// const API_BASE = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// // Helper functions from ProductPage
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

// const DiscountProductsPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { coupon, activeCouponTab } = location.state || {};

//   // ===================== STATES =====================
//   const [discountProducts, setDiscountProducts] = useState([]);
//   const [loadingDiscountProducts, setLoadingDiscountProducts] = useState(false);
//   const [error, setError] = useState(null);

//   // Infinite Scroll Pagination States
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);
//   const loaderRef = useRef(null);

//   // ProductPage functionality states
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Filtering states
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

//   // Context
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // ===================== TOAST UTILITY =====================
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

//   // Build query parameters
//   const buildQueryParams = (cursor = null) => {
//     const params = new URLSearchParams();

//     // Add filters to query params
//     if (filters.brand) params.append('brandIds', filters.brand);
//     if (filters.category) params.append('category', filters.category);
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

//     // Add cursor and limit
//     if (cursor) params.append('cursor', cursor);
//     params.append('limit', 9);

//     return params.toString();
//   };

//   // ===================== DISCOUNT PRODUCTS FETCH (INFINITE SCROLL API) =====================
//   const fetchDiscountProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoadingDiscountProducts(true);
//         setDiscountProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else {
//         setLoadingMore(true);
//       }
//       setError(null);

//       const discountCode = coupon?.code;
//       if (!discountCode) return;

//       const params = buildQueryParams(cursor);

//       const response = await fetch(
//         `${PRODUCT_ALL_API}?discountCode=${encodeURIComponent(discountCode)}&${params}`,
//         { credentials: "include" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch discount products");
//       }

//       const data = await response.json();
//       console.log("Discount Products API Response:", data);

//       const prods = data.products || [];
//       const pg = data.pagination || {};

//       if (reset) {
//         setDiscountProducts(prods);
//       } else {
//         setDiscountProducts((prev) => [...prev, ...prods]);
//       }

//       setHasMore(pg.hasMore || false);
//       setNextCursor(pg.nextCursor || null);

//       if (data.filterData) {
//         setFilterData(data.filterData);
//       }

//       // Initialize selected variants from backend selectedVariant
//       const initialSelectedVariants = {};
//       prods.forEach(product => {
//         if (product.selectedVariant) {
//           initialSelectedVariants[product._id] = product.selectedVariant;
//         } else if (product.variants && product.variants.length > 0) {
//           initialSelectedVariants[product._id] = product.variants[0];
//         }
//       });
//       setSelectedVariants((prev) => ({ ...prev, ...initialSelectedVariants }));

//     } catch (error) {
//       console.error("Error fetching discount products:", error);
//       setError(error.message);
//     } finally {
//       setLoadingDiscountProducts(false);
//       setLoadingMore(false);
//     }
//   };

//   // ===================== INFINITE SCROLL OBSERVER ==========================
//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) {
//       fetchDiscountProducts(nextCursor, false);
//     }
//   }, [nextCursor, hasMore, loadingMore, coupon, filters]);

//   useEffect(() => {
//     if (!hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { root: null, rootMargin: "100px", threshold: 0.1 }
//     );
//     const el = loaderRef.current;
//     if (el) obs.observe(el);
//     return () => {
//       if (el) obs.unobserve(el);
//     };
//   }, [loadMore, hasMore, loadingMore]);


//   // ===================== PRODUCT PAGE FUNCTIONALITY =====================
//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const getProductSlug = (product) => {
//     if (product.slugs && product.slugs.length > 0) return product.slugs[0];
//     return product._id;
//   };

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

//   // ===================== RENDER PRODUCT CARD =====================
//   const renderProductCard = (prod) => {
//     const variants = Array.isArray(prod.variants) ? prod.variants : [];
//     const selectedVariant = selectedVariants[prod._id] || variants[0] || prod.selectedVariant;
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

//     // Get price information
//     const price = selectedVariant?.displayPrice ||
//       selectedVariant?.discountedPrice ||
//       prod.price ||
//       0;
//     const originalPrice = selectedVariant?.originalPrice ||
//       selectedVariant?.mrp ||
//       prod.mrp ||
//       price;
//     const hasDiscount = originalPrice > price;
//     const discountPercent = hasDiscount
//       ? Math.round(((originalPrice - price) / originalPrice) * 100)
//       : 0;

//     return (
//       <div
//         key={prod._id}
//         className="col-6 col-md-4 col-lg-4 mb-4"
//         style={{ height: "500px" , position:'relative' }}
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

//         {/* Eligible Badge */}
//         <div
//           style={{
//             position: "absolute",
//             top: "8px",
//             left: "8px",
//             background: "#17a2b8",
//             color: "white",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             fontWeight: "bold",
//             zIndex: 2
//           }}
//         >
//           Eligible
//         </div>

//         {/* Product Image */}
//         <img
//           src={imageUrl}
//           alt={prod.name}
//           className="card-img-top"
//           style={{
//             height: "200px",
//             width: "100%",
//             objectFit: "contain",
//             cursor: "pointer",
//           }}
//           onClick={() => navigate(`/product/${productSlug}`)}
//         />

//         {/* Discount Badge */}
//         {hasDiscount && (
//           <div
//             style={{
//               position: "absolute",
//               top: "40px",
//               left: "8px",
//               background: "#dc3545",
//               color: "white",
//               padding: "4px 8px",
//               borderRadius: "4px",
//               fontSize: "12px",
//               fontWeight: "bold",
//               zIndex: 2
//             }}
//           >
//             {discountPercent}% OFF
//           </div>
//         )}

//         {/* Card Body */}
//         <div className="card-body p-0 d-flex flex-column" style={{ height: "280px" }}>
//           {/* Rating */}
//           <div className="d-flex align-items-center mt-2">
//             {renderStars(prod.avgRating || 0)}
//             <span className="ms-2 text-muted small">
//               ({prod.totalRatings || 0})
//             </span>
//           </div>

//           {/* Brand */}
//           <div className="brand-name text-muted small mb-1 fw-medium">
//             {getBrandName(prod)}
//           </div>

//           {/* Product Name */}
//           <h6
//             className="card-title mt-2 align-items-center gap-1"
//             style={{ 
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "600",
//               minHeight: "40px",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical"
//             }}
//             onClick={() => navigate(`/product/${productSlug}`)}
//           >
//             {prod.name}
//             {selectedVariant && selectedVariant.shadeName && (
//               <div
//                 className="text-black fw-normal fs-6"
//                 style={{ marginTop: "2px", fontSize: "12px" }}
//               >
//                 {getVariantDisplayText(selectedVariant)}
//               </div>
//             )}
//           </h6>

//           {/* Variant Selection */}
//           {variants.length > 0 && (
//             <div className="variant-section mt-2">
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
//                           width: "24px",
//                           height: "24px",
//                           borderRadius: "30%",
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
//                               fontSize: "12px",
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
//                         width: "24px",
//                         height: "24px",
//                         borderRadius: "50%",
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
//                         className={`variant-text ${
//                           isSelected ? "selected" : ""
//                         }`}
//                         style={{
//                           padding: "4px 8px",
//                           borderRadius: "4px",
//                           border: isSelected
//                             ? "2px solid #000"
//                             : "1px solid #ddd",
//                           background: isSelected
//                             ? "#000"
//                             : "#fff",
//                           color: isSelected ? "#fff" : "#000",
//                           fontSize: "11px",
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
//                       className="more-btn"
//                       onClick={() =>
//                         openVariantOverlay(prod._id, "text")
//                       }
//                       style={{
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                         background: "#f5f5f5",
//                         border: "1px solid #ddd",
//                         fontSize: "11px",
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
//           <div className="mt-auto">
//             <p
//               className="fw-bold mb-2"
//               style={{ fontSize: "16px" }}
//             >
//               ₹{price}
//               {hasDiscount && (
//                 <>
//                   <span
//                     style={{
//                       textDecoration: "line-through",
//                       color: "#888",
//                       marginLeft: "8px",
//                       fontSize: "14px",
//                     }}
//                   >
//                     ₹{originalPrice}
//                   </span>
//                   <span
//                     style={{
//                       color: "#e53e3e",
//                       marginLeft: "8px",
//                       fontWeight: "600",
//                       fontSize: "14px",
//                     }}
//                   >
//                     ({discountPercent}% OFF)
//                   </span>
//                 </>
//               )}
//             </p>

//             {/* Add to Cart Button */}
//             <button
//               className={`add-to-cart-btn w-100 d-flex align-items-center justify-content-center gap-2 ${
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
//                 padding: "8px 16px",
//                 backgroundColor: "#000",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "4px",
//                 transition: "background-color 0.3s ease, color 0.3s ease",
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
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 9999,
//               display: "flex",
//               justifyContent: "center",
//             }}
//           >
//             <div
//               className="variant-overlay-content"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 width: "100%",
//                 maxWidth: "500px",
//                 maxHeight: "100%",
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
//                     cursor: "pointer"
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
//                   style={{
//                     border: "none",
//                     background: selectedVariantType === "all" ? "#000" : "#fff",
//                     cursor: "pointer"
//                   }}
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
//                     style={{
//                       border: "none",
//                       background: selectedVariantType === "color" ? "#000" : "#fff",
//                       cursor: "pointer"
//                     }}
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
//                     style={{
//                       border: "none",
//                       background: selectedVariantType === "text" ? "#f8f9fa" : "#fff",
//                       cursor: "pointer"
//                     }}
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
//                     <div className="row row-col-4 g-3 mb-4">
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
//                                   borderRadius: "30%",
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

//   // ===================== EVENT HANDLERS =====================
//   const handleApplyCoupon = () => {
//     if (coupon && coupon.code) {
//       localStorage.setItem("appliedCoupon", coupon.code);
//       navigate("/cartpage", {
//         state: { couponApplied: true }
//       });
//     }
//   };

//   const handleClose = () => {
//     navigate("/cartpage");
//   };

//   // ===================== USE EFFECTS =====================
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   useEffect(() => {
//     if (coupon) {
//       const discountCode = coupon.code;
//       if (discountCode) {
//         fetchDiscountProducts(null, true);
//       } else {
//         setError("Error: Invalid coupon data");
//       }
//     } else {
//       navigate("/cartpage");
//     }
//   }, [coupon, navigate, filters]); // Refetch on filters change

//   // ===================== LOADING STATE =====================
//   if (loadingDiscountProducts) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-4 page-title-main-name">
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="mt-3">Loading discount products...</p>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // ===================== ERROR STATE =====================
//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-4 page-title-main-name">
//           <div className="alert alert-danger mt-4">
//             <h5>Error Loading Discount Products</h5>
//             <p>{error}</p>
//             <button 
//               className="btn btn-primary" 
//               onClick={() => fetchDiscountProducts(null, true)}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 page-title-main-name">
//         {/* Breadcrumb */}
//         <nav aria-label="breadcrumb" className="mb-4">
//           <ol className="breadcrumb">
//             <li className="breadcrumb-item"><Link to="/">Home</Link></li>
//             <li className="breadcrumb-item"><Link to="/cartpage">Cart</Link></li>
//             <li className="breadcrumb-item active">Discount Products</li>
//           </ol>
//         </nav>

//         {/* Coupon Header */}
//         {coupon && (
//           <div className="bg-light p-4 rounded mb-4">
//             <div className="row align-items-center">
//               <div className="col-md-8">
//                 <h3 className="text-primary mb-2">
//                   {coupon.code || 'Discount Products'}
//                 </h3>
//                 <p className="text-muted mb-0">
//                   {coupon.label || coupon.description || 'Products applicable for this discount'}
//                 </p>
//                 {coupon.discountPercent && (
//                   <span className="badge bg-success mt-2">
//                     {coupon.discountPercent}% OFF
//                   </span>
//                 )}
//               </div>
//               <div className="col-md-4 text-md-end mt-3 mt-md-0">
//                 <button 
//                   className="btn btn-outline-secondary me-2"
//                   onClick={handleClose}
//                 >
//                   <FaArrowLeft className="me-1" />
//                   Back to Cart
//                 </button>
//                 {activeCouponTab === "available" && (
//                   <button className="btn btn-primary" onClick={handleApplyCoupon}>
//                     Apply Coupon
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Mobile Filter + Sort Buttons */}
//         <div className="d-lg-none mb-3">
//           <div className="w-100 filter-responsive rounded shadow-sm">
//             <div className="container-fluid p-0">
//               <div
//                 className="row g-0"
//                 style={{ flexDirection: "row-reverse" }}
//               >
//                 {/* Filter Button */}
//                 <div className="col-6">
//                   <button
//                     className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                     onClick={() => setShowFilterOffcanvas(true)}
//                     style={{ gap: "12px" }}
//                   >
//                     <img
//                       src={filtering}
//                       alt="Filter"
//                       style={{ width: "25px" }}
//                     />
//                     <div className="text-start">
//                       <p className="mb-0 fs-6 fw-semibold">Filter</p>
//                       <span className="text-muted small">Tap to apply</span>
//                     </div>
//                   </button>
//                 </div>

//                 {/* Sort Button */}
//                 <div className="col-6 border-end">
//                   <button
//                     className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                     onClick={() => setShowSortOffcanvas(true)}
//                     style={{ gap: "12px" }}
//                   >
//                     <img
//                       src={updownarrow}
//                       alt="Sort"
//                       style={{ width: "25px" }}
//                     />
//                     <div className="text-start">
//                       <p className="mb-0 fs-6 fw-semibold">Sort by</p>
//                       <span className="text-muted small">
//                         {getCurrentSortText()}
//                       </span>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Filter Offcanvas */}
//         {showFilterOffcanvas && (
//           <>
//             <div
//               className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//               style={{ opacity: 0.5, zIndex: 1040 }}
//               onClick={() => setShowFilterOffcanvas(false)}
//             ></div>
//             <div
//               className="position-fixed start-0 bottom-0 w-100 bg-white"
//               style={{
//                 zIndex: 1050,
//                 borderTopLeftRadius: "16px",
//                 borderTopRightRadius: "16px",
//                 maxHeight: "85vh",
//                 boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
//               }}
//             >
//               <div className="text-center py-3 position-relative">
//                 <h5 className="mb-0 fw-bold">Filters</h5>
//                 <button
//                   className="btn-close position-absolute end-0 me-3"
//                   style={{ top: "50%", transform: "translateY(-50%)" }}
//                   onClick={() => setShowFilterOffcanvas(false)}
//                 ></button>
//                 <div
//                   className="mx-auto mt-2 bg-secondary"
//                   style={{
//                     height: "5px",
//                     width: "50px",
//                     borderRadius: "3px",
//                   }}
//                 ></div>
//               </div>
//               <div
//                 className="px-3 pb-4 overflow-auto"
//                 style={{ maxHeight: "70vh" }}
//               >
//                 <BrandFilter
//                   filters={filters}
//                   setFilters={setFilters}
//                   filterData={filterData}
//                   products={discountProducts}
//                   onClose={() => setShowFilterOffcanvas(false)}
//                   hideBrandFilter={false}
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Mobile Sort Offcanvas */}
//         {showSortOffcanvas && (
//           <>
//             <div
//               className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//               style={{ opacity: 0.5, zIndex: 1040 }}
//               onClick={() => setShowSortOffcanvas(false)}
//             ></div>
//             <div
//               className="position-fixed start-0 bottom-0 w-100 bg-white"
//               style={{
//                 zIndex: 1050,
//                 borderTopLeftRadius: "16px",
//                 borderTopRightRadius: "16px",
//                 maxHeight: "60vh",
//                 boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
//               }}
//             >
//               <div className="text-center py-3 position-relative">
//                 <h5 className="mb-0 fw-bold">Sort by</h5>
//                 <button
//                   className="btn-close position-absolute end-0 me-3"
//                   style={{ top: "50%", transform: "translateY(-50%)" }}
//                   onClick={() => setShowSortOffcanvas(false)}
//                 ></button>
//                 <div
//                   className="mx-auto mt-2 bg-secondary"
//                   style={{
//                     height: "5px",
//                     width: "50px",
//                     borderRadius: "3px",
//                   }}
//                 ></div>
//               </div>
//               <div className="px-4 pb-4">
//                 <div className="list-group">
//                   <label className="list-group-item py-3 d-flex align-items-center">
//                     <input
//                       className="form-check-input me-3"
//                       type="radio"
//                       name="sort"
//                       checked={!filters.discountSort}
//                       onChange={() => {
//                         setFilters((prev) => ({ ...prev, discountSort: "" }));
//                         setShowSortOffcanvas(false);
//                       }}
//                     />
//                     <span>Relevance</span>
//                   </label>
//                   <label className="list-group-item py-3 d-flex align-items-center">
//                     <input
//                       className="form-check-input me-3"
//                       type="radio"
//                       name="sort"
//                       checked={filters.discountSort === "high"}
//                       onChange={() => {
//                         setFilters((prev) => ({
//                           ...prev,
//                           discountSort: "high",
//                         }));
//                         setShowSortOffcanvas(false);
//                       }}
//                     />
//                     <span>Highest Discount First</span>
//                   </label>
//                   <label className="list-group-item py-3 d-flex align-items-center">
//                     <input
//                       className="form-check-input me-3"
//                       type="radio"
//                       name="sort"
//                       checked={filters.discountSort === "low"}
//                       onChange={() => {
//                         setFilters((prev) => ({
//                           ...prev,
//                           discountSort: "low",
//                         }));
//                         setShowSortOffcanvas(false);
//                       }}
//                     />
//                     <span>Lowest Discount First</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Products Grid Header */}
//         <div className="row mb-4">
//           <div className="col-12 d-flex justify-content-between align-items-center">
//             <h4>
//               Products Eligible for Discount 
//               <span className="text-muted fs-6"> ({discountProducts.length} products)</span>
//             </h4>
//             {Object.values(filters).some(
//               (val) => val !== "" && val !== null
//             ) && (
//               <button
//                 className="btn btn-sm btn-outline-danger"
//                 onClick={() =>
//                   setFilters({
//                     brand: "",
//                     category: "",
//                     skinType: "",
//                     formulation: "",
//                     priceRange: null,
//                     minRating: "",
//                     discountSort: "",
//                   })
//                 }
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Desktop Sidebar */}
//         <div className="row">
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter
//               filters={filters}
//               setFilters={setFilters}
//               currentPage="category"
//             />
//           </div>

//           <div className="col-12 col-lg-9">
//             {/* Products Grid */}
//             {discountProducts.length > 0 ? (
//               <div className="row g-4">
//                 {discountProducts.map(renderProductCard)}
//               </div>
//             ) : (
//               <div className="text-center py-5">
//                 <div className="display-1 text-muted mb-3">🛍️</div>
//                 <h5>No products found for this coupon</h5>
//                 <p className="text-muted">This coupon may not be applicable to any products at the moment.</p>
//                 <button className="btn btn-primary" onClick={handleClose}>
//                   Back to Cart
//                 </button>
//               </div>
//             )}

//             {/* Infinite Scroll Loading & Sentinel */}
//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2 text-muted">Loading more products...</p>
//               </div>
//             )}

//             {/* Observer Element */}
//             <div ref={loaderRef} style={{ height: 20, marginTop: 20 }}></div>

//             {/* End of results message */}
//             {!hasMore && discountProducts.length > 0 && (
//               <div className="text-center mt-4 py-4 border-top">
//                 <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default DiscountProductsPage;













// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaArrowLeft, FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import { CartContext } from "../Context/Cartcontext";
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const API_BASE = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// // Helper functions from ProductPage
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
//   const grouped = { color: [], text: [] };
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

// const DiscountProductsPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { coupon, activeCouponTab } = location.state || {};

//   // ===================== STATES =====================
//   const [discountProducts, setDiscountProducts] = useState([]);
//   const [loadingDiscountProducts, setLoadingDiscountProducts] = useState(false);
//   const [error, setError] = useState(null);

//   // Infinite Scroll Pagination States
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);
//   const loaderRef = useRef(null);

//   // ProductPage functionality states
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   // Filtering states - UPDATED to match ProductPage
//   const [filters, setFilters] = useState({
//     brand: "",
//     category: "",
//     skinType: "",
//     formulation: "",
//     finish: "",
//     ingredient: "",
//     priceRange: null,
//     discountRange: null,
//     minRating: "",
//     sort: "recent",
//   });
//   const [filterData, setFilterData] = useState(null);
//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

//   // Context
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   // ===================== TOAST UTILITY =====================
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

//   // Build query parameters - UPDATED to match ProductPage
//   const buildQueryParams = (cursor = null) => {
//     const params = new URLSearchParams();

//     // Add discount code
//     if (coupon?.code) {
//       params.append('discountCode', coupon.code);
//     }

//     // Add filters to query params - MATCHING ProductPage structure
//     if (filters.brand) params.append('brandIds', filters.brand);
//     if (filters.category) params.append('categoryIds', filters.category);
//     if (filters.skinType) params.append('skinTypes', filters.skinType);
//     if (filters.formulation) params.append('formulations', filters.formulation);
//     if (filters.finish) params.append('finishes', filters.finish);
//     if (filters.ingredient) params.append('ingredients', filters.ingredient);
//     if (filters.minRating) params.append('minRating', filters.minRating);

//     // Add price range if exists
//     if (filters.priceRange) {
//       params.append('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max !== null) {
//         params.append('maxPrice', filters.priceRange.max);
//       }
//     }

//     // Add discount range if exists
//     if (filters.discountRange) {
//       params.append('minDiscount', filters.discountRange.min);
//     }

//     // Add sorting - MATCHING ProductPage
//     if (filters.sort) {
//       params.append('sort', filters.sort);
//     }

//     // Add cursor and limit
//     if (cursor) params.append('cursor', cursor);
//     params.append('limit', 9);

//     return params.toString();
//   };

//   // ===================== DISCOUNT PRODUCTS FETCH (INFINITE SCROLL API) =====================
//   const fetchDiscountProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoadingDiscountProducts(true);
//         setDiscountProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else {
//         setLoadingMore(true);
//       }
//       setError(null);

//       const discountCode = coupon?.code;
//       if (!discountCode) return;

//       const params = buildQueryParams(cursor);

//       const response = await fetch(
//         `${PRODUCT_ALL_API}?${params}`,
//         { credentials: "include" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch discount products");
//       }

//       const data = await response.json();
//       console.log("Discount Products API Response:", data);

//       const prods = data.products || [];
//       const pg = data.pagination || {};

//       if (reset) {
//         setDiscountProducts(prods);
//       } else {
//         setDiscountProducts((prev) => [...prev, ...prods]);
//       }

//       setHasMore(pg.hasMore || false);
//       setNextCursor(pg.nextCursor || null);

//       if (data.filterData) {
//         setFilterData(data.filterData);
//       }

//     } catch (error) {
//       console.error("Error fetching discount products:", error);
//       setError(error.message);
//     } finally {
//       setLoadingDiscountProducts(false);
//       setLoadingMore(false);
//     }
//   };

//   // ===================== INFINITE SCROLL OBSERVER ==========================
//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) {
//       fetchDiscountProducts(nextCursor, false);
//     }
//   }, [nextCursor, hasMore, loadingMore, coupon, filters]);

//   useEffect(() => {
//     if (!hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { root: null, rootMargin: "100px", threshold: 0.1 }
//     );
//     const el = loaderRef.current;
//     if (el) obs.observe(el);
//     return () => {
//       if (el) obs.unobserve(el);
//     };
//   }, [loadMore, hasMore, loadingMore]);


//   // ===================== PRODUCT PAGE FUNCTIONALITY =====================
//   const handleVariantSelect = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   const openVariantOverlay = (productId, type = "all") => {
//     setSelectedVariantType(type);
//     setShowVariantOverlay(productId);
//   };

//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const getProductSlug = (product) => {
//     if (product.slugs && product.slugs.length > 0) return product.slugs[0];
//     return product._id;
//   };

//   const handleAddToCart = async (prod) => {
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVar = variants.length > 0;

//       // Check if user has explicitly selected a variant
//       const isVariantSelected = !!selectedVariants[prod._id];

//       // Used for display (image, price). Defaults to explicitly selected OR first available OR first
//       const displayVariant = selectedVariants[prod._id] || (hasVar ? (variants.find(v => v.stock > 0) || variants[0]) : null);

//       if (hasVar) {
//         if (!displayVariant || displayVariant.stock <= 0) {
//           showToastMsg("Please select an in-stock variant.", "error");
//           return;
//         }
//       } else {
//         if (prod.stock <= 0) {
//           showToastMsg("Product is out of stock.", "error");
//           return;
//         }
//       }

//       // Check if user is logged in
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch {}

//       if (isLoggedIn) {
//         await addToCart(prod, displayVariant);
//         showToastMsg("Product added to cart!", "success");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex(
//           (item) => item.productId === prod._id && item.variantSku === getSku(displayVariant)
//         );
//         if (existingIndex !== -1) {
//           guestCart[existingIndex].quantity += 1;
//         } else {
//           guestCart.push({
//             productId: prod._id,
//             variantSku: getSku(displayVariant),
//             product: prod,
//             variant: displayVariant,
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

//   const getCurrentSortText = () => {
//     // Updated to match ProductPage filter structure
//     if (filters.sort === "priceHighToLow") return "Highest Discount";
//     if (filters.sort === "priceLowToHigh") return "Lowest Discount";
//     return "Relevance";
//   };

//   // ===================== RENDER PRODUCT CARD - UPDATED TO MATCH ProductPage DESIGN =====================
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;

//     // Check if user has explicitly selected a variant
//     const isVariantSelected = !!selectedVariants[prod._id];

//     // Used for display (image, price). Defaults to explicitly selected OR first available OR first
//     const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find(v => v.stock > 0) || vars[0]) : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(prod._id, sku) : false;
//     const slugPr = getProductSlug(prod);
//     const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";

//     const isAdding = addingToCart[prod._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;

//     // Show select variant button if product has variants but user hasn't selected one yet
//     const showSelectVariantButton = hasVar && !isVariantSelected;
//     const disabled = isAdding || (!showSelectVariantButton && oos);

//     let btnText = "Add to Cart";
//     if (isAdding) {
//       btnText = "Adding...";
//     } else if (showSelectVariantButton) {
//       btnText = "Select Variant";
//     } else if (oos) {
//       btnText = "Out of Stock";
//     }

//     // Get price information
//     const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//     const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//     const disc = orig > price;
//     const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
//         {/* Wishlist Button - MATCHING ProductPage */}
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {});
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

//         {/* Eligible Badge - KEEPING this as it's specific to discount page */}
//         <div
//           style={{
//             position: "absolute",
//             top: 8,
//             left: 8,
//             background: "#17a2b8",
//             color: "white",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             fontWeight: "bold",
//             zIndex: 2
//           }}
//         >
//           Eligible
//         </div>

//         <img
//           src={img}
//           alt={prod.name}
//           className="card-img-top"
//           style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//           onClick={() => navigate(`/product/${slugPr}`)}
//         />

//         {/* Discount Badge - KEEPING this as it's specific to discount page */}
//         {disc && (
//           <div
//             style={{
//               position: "absolute",
//               top: "40px",
//               left: "8px",
//               background: "#dc3545",
//               color: "white",
//               padding: "4px 8px",
//               borderRadius: "4px",
//               fontSize: "12px",
//               fontWeight: "bold",
//               zIndex: 2
//             }}
//           >
//             {pct}% OFF
//           </div>
//         )}

//         {/* Card Body - MATCHING ProductPage height: 265 */}
//         <div className="card-body p-0 d-flex flex-column" style={{ height: 265 }}>
//           {/* Brand - MATCHING ProductPage */}
//           <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>

//           {/* Product Name - MATCHING ProductPage */}
//           <h5
//             className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate(`/product/${slugPr}`)}
//           >
//             {prod.name}
//           </h5>

//           {/* Minimal Variant Display - MATCHING ProductPage */}
//           {hasVar && (
//             <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//               {isVariantSelected ? (
//                 <div 
//                   className="selected-variant-display text-muted small" 
//                   style={{ cursor: 'pointer', display: 'inline-block' }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openVariantOverlay(prod._id, "all");
//                   }}
//                   title="Click to change variant"
//                 >
//                   Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
//                   <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                 </div>
//               ) : (
//                 <div 
//                   className="small text-muted" 
//                   style={{ height: '20px', cursor: 'pointer', display: 'inline-block' }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openVariantOverlay(prod._id, "all");
//                   }}
//                 >
//                   {vars.length} Variants Available 
//                   <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Pricing - MATCHING ProductPage */}
//           <p className="fw-bold mb-3 mt-auto page-title-main-name" style={{ fontSize: 16 }}>
//             {disc ? (
//               <>
//                 ₹{price}
//                 <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                 <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//               </>
//             ) : (
//               <>₹{orig}</>
//             )}
//           </p>

//           {/* Add to Cart Button - MATCHING ProductPage with Bag icon */}
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

//         {/* Variant Overlay Modal - MATCHING ProductPage */}
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
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>
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
//                                 !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())
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
//                               <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>
//                                 {getVariantDisplayText(v)}
//                               </div>
//                               {oosV && <div className="text-danger small">Out of Stock</div>}
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
//                         const sel = selectedVariants[prod._id]?.sku === v.sku;
//                         const oosV = v.stock <= 0;
//                         return (
//                           <div className="col" key={v.sku || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                               onClick={() =>
//                                 !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())
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

//   // ===================== EVENT HANDLERS =====================
//   const handleApplyCoupon = () => {
//     if (coupon && coupon.code) {
//       localStorage.setItem("appliedCoupon", coupon.code);
//       navigate("/cartpage", {
//         state: { couponApplied: true }
//       });
//     }
//   };

//   const handleClose = () => {
//     navigate("/cartpage");
//   };

//   // ===================== USE EFFECTS =====================
//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   useEffect(() => {
//     if (coupon) {
//       const discountCode = coupon.code;
//       if (discountCode) {
//         fetchDiscountProducts(null, true);
//       } else {
//         setError("Error: Invalid coupon data");
//       }
//     } else {
//       navigate("/cartpage");
//     }
//   }, [coupon, navigate, filters]); // Refetch on filters change

//   // ===================== LOADING STATE =====================
//   if (loadingDiscountProducts) {
//     return (
//       <>
//         <Header />
//         <div className="fullscreen-loader page-title-main-name">
//           <div className="spinner" />
//           <p className="text-black">Loading products...</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // ===================== ERROR STATE =====================
//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-4 page-title-main-name">
//           <div className="alert alert-danger mt-4">
//             <h5>Error Loading Discount Products</h5>
//             <p>{error}</p>
//             <button 
//               className="btn btn-primary" 
//               onClick={() => fetchDiscountProducts(null, true)}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />

//       {/* Banner Image Section - MATCHING ProductPage */}
//       <div className="banner-images text-center mt-xl-5 pt-xl-4">
//         <img
//           src="/banner-placeholder.jpg"
//           alt="Discount Products Banner"
//           className="w-100 hero-slider-image-responsive"
//           style={{ maxHeight: 400, objectFit: "cover" }}
//         />
//       </div>

//       <div className="container-lg py-4">
//         {/* Page Title - MATCHING ProductPage */}
//         <h2 className="mb-4 d-none d-lg-block page-title-main-name">
//           {coupon?.code || 'Discount Products'}
//         </h2>

//         <div className="row">
//           {/* Desktop Sidebar */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="category" />
//           </div>

//           {/* Mobile Filter + Sort Buttons - MATCHING ProductPage */}
//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{coupon?.code || 'Discount Products'}</h2>
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)}
//                       style={{ gap: 12 }}
//                     >
//                       <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button
//                       className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)}
//                       style={{ gap: 12 }}
//                     >
//                       <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
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

//           {/* Mobile Filter Offcanvas - MATCHING ProductPage */}
//           {showFilterOffcanvas && (
//             <>
//               <div
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }}
//                 onClick={() => setShowFilterOffcanvas(false)}
//               />
//               <div
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: 16,
//                   borderTopRightRadius: 16,
//                   maxHeight: "85vh",
//                   boxShadow: "0 -4px 20px rgba(0,0,0,.2)",
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button
//                     className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowFilterOffcanvas(false)}
//                   />
//                   <div
//                     className="mx-auto mt-2 bg-secondary"
//                     style={{ height: 5, width: 50, borderRadius: 3 }}
//                   />
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={discountProducts}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Mobile Sort Offcanvas - MATCHING ProductPage with updated sort options */}
//           {showSortOffcanvas && (
//             <>
//               <div
//                 className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }}
//                 onClick={() => setShowSortOffcanvas(false)}
//               />
//               <div
//                 className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{
//                   zIndex: 1050,
//                   borderTopLeftRadius: 16,
//                   borderTopRightRadius: 16,
//                   maxHeight: "60vh",
//                   boxShadow: "0 -4px 12px rgba(0,0,0,.15)",
//                 }}
//               >
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button
//                     className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowSortOffcanvas(false)}
//                   />
//                   <div
//                     className="mx-auto mt-2 bg-secondary"
//                     style={{ height: 5, width: 50, borderRadius: 3 }}
//                   />
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input
//                         className="form-check-input me-3"
//                         type="radio"
//                         name="sort"
//                         checked={!filters.sort || filters.sort === "recent"}
//                         onChange={() => {
//                           setFilters((p) => ({ ...p, sort: "recent" }));
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
//                         checked={filters.sort === "priceHighToLow"}
//                         onChange={() => {
//                           setFilters((p) => ({ ...p, sort: "priceHighToLow" }));
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
//                         checked={filters.sort === "priceLowToHigh"}
//                         onChange={() => {
//                           setFilters((p) => ({ ...p, sort: "priceLowToHigh" }));
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

//           {/* Product Grid - MATCHING ProductPage structure */}
//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 {coupon?.code || `Showing ${discountProducts.length} products`}
//                 {hasMore && " (Scroll for more)"}
//               </span>
//               {Object.values(filters).some((v) => v !== "" && v !== null) && (
//                 <button
//                   className="btn btn-sm btn-outline-danger"
//                   onClick={() =>
//                     setFilters({
//                       brand: "",
//                       category: "",
//                       skinType: "",
//                       formulation: "",
//                       finish: "",
//                       ingredient: "",
//                       priceRange: null,
//                       discountRange: null,
//                       minRating: "",
//                       sort: "recent",
//                     })
//                   }
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {discountProducts.length > 0 ? (
//                 discountProducts.map(renderProductCard)
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters or check back later.</p>
//                   <button className="btn btn-primary" onClick={handleClose}>
//                     Back to Cart
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Infinite Scroll Loading - MATCHING ProductPage */}
//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             {/* Sentinel Element for Observer */}
//             <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

//             {/* End Message - MATCHING ProductPage */}
//             {!hasMore && discountProducts.length > 0 && (
//               <div className="text-center mt-4 py-4 border-top">
//                 <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default DiscountProductsPage;

























import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaArrowLeft, FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import { CartContext } from "../Context/Cartcontext";
import { UserContext } from "./UserContext.jsx";
import BrandFilter from "./BrandFilter";
import axios from "axios";
import updownarrow from "../assets/updownarrow.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";

const API_BASE = "https://beauty.joyory.com/api/user/cart";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// Helper functions from ProductPage
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
  const grouped = { color: [], text: [] };
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

const getBrandName = (product) => {
  if (!product?.brand) return "Unknown Brand";
  if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
  if (typeof product.brand === "string") return product.brand;
  return "Unknown Brand";
};

const DiscountProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coupon, activeCouponTab } = location.state || {};

  // ===================== STATES =====================
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loadingDiscountProducts, setLoadingDiscountProducts] = useState(false);
  const [error, setError] = useState(null);

  // Infinite Scroll Pagination States
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const loaderRef = useRef(null);

  // ProductPage functionality states
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // Filtering states - EXACTLY MATCHING ProductPage structure
  const [filters, setFilters] = useState({
    brandIds: [],
    categoryIds: [],
    skinTypes: [],
    formulations: [],
    finishes: [],
    ingredients: [],
    priceRange: null,
    discountMin: null,
    minRating: "",
    sort: "recent",
  });

  const [filterData, setFilterData] = useState(null);
  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

  // Trending categories for pills (like ProductPage)
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  // Context
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // ===================== TOAST UTILITY =====================
  const showToastMsg = (message, type = "error", duration = 3000) => {
    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: #fff;
      background-color: ${type === "error" ? "#f56565" : "#48bb78"};
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
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

  // ===================== FILTER HELPERS (SAME AS PRODUCTPAGE) =====================
  const makeEmptyFilters = () => ({
    brandIds: [],
    categoryIds: [],
    skinTypes: [],
    formulations: [],
    finishes: [],
    ingredients: [],
    priceRange: null,
    discountMin: null,
    minRating: "",
    sort: "recent",
  });

  const isAnyFilterActive = () => {
    return (
      filters.brandIds.length > 0 ||
      filters.categoryIds.length > 0 ||
      filters.skinTypes.length > 0 ||
      filters.formulations.length > 0 ||
      filters.finishes.length > 0 ||
      filters.ingredients.length > 0 ||
      filters.priceRange ||
      filters.discountMin ||
      filters.minRating ||
      filters.sort !== "recent" ||
      (activeCategorySlug && activeCategorySlug !== null)
    );
  };

  const handleClearAllFilters = () => {
    setFilters(makeEmptyFilters());
    setActiveCategorySlug(null);
    setActiveCategoryName("");
  };

  // Category pill click handler (same as ProductPage)
  const handleCategoryPillClick = useCallback((cat) => {
    if (activeCategorySlug === cat.slug) {
      setActiveCategorySlug(null);
      setActiveCategoryName("");
      setFilters(prev => ({ ...prev, categoryIds: [] }));
    } else {
      setActiveCategorySlug(cat.slug);
      setActiveCategoryName(cat.name);
      setFilters(prev => ({ ...prev, categoryIds: [cat.slug] }));
    }
  }, [activeCategorySlug]);

  const handleClearCategory = useCallback(() => {
    setActiveCategorySlug(null);
    setActiveCategoryName("");
    setFilters(prev => ({ ...prev, categoryIds: [] }));
  }, []);

  // Skin type click handler
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

  // Build query parameters - EXACTLY MATCHING ProductPage
  const buildQueryParams = (cursor = null) => {
    const params = new URLSearchParams();

    // Add discount code
    if (coupon?.code) {
      params.append('discountCode', coupon.code);
    }

    // Add filters to query params - MATCHING ProductPage structure exactly
    filters.brandIds?.forEach((id) => params.append("brandIds", id));
    filters.categoryIds?.forEach((id) => params.append("categoryIds", id));
    filters.skinTypes?.forEach((n) => params.append("skinTypes", n));
    filters.formulations?.forEach((id) => params.append("formulations", id));
    filters.finishes?.forEach((s) => params.append("finishes", s));
    filters.ingredients?.forEach((s) => params.append("ingredients", s));

    if (filters.minRating) params.append("minRating", filters.minRating);

    // Add price range if exists
    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange.min);
      if (filters.priceRange.max != null) params.append("maxPrice", filters.priceRange.max);
    }

    // Add discount filter - using discountMin parameter (same as ProductPage)
    if (filters.discountMin && filters.discountMin > 0) {
      params.append("discountMin", filters.discountMin);
    }

    // Add sorting
    if (filters.sort) params.append("sort", filters.sort);

    // Add cursor and limit
    if (cursor) params.append("cursor", cursor);
    params.append("limit", "9");

    return params.toString();
  };

  // ===================== DISCOUNT PRODUCTS FETCH (INFINITE SCROLL API) =====================
  const fetchDiscountProducts = async (cursor = null, reset = false) => {
    try {
      if (reset) {
        setLoadingDiscountProducts(true);
        setDiscountProducts([]);
        setNextCursor(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const discountCode = coupon?.code;
      if (!discountCode) return;

      const queryString = buildQueryParams(cursor);
      console.log("Discount Products API Query →", `${PRODUCT_ALL_API}?${queryString}`);

      const response = await fetch(
        `${PRODUCT_ALL_API}?${queryString}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch discount products");
      }

      const data = await response.json();
      console.log("Discount Products API Response:", data);

      const prods = data.products || [];
      const pg = data.pagination || {};

      if (reset) {
        setDiscountProducts(prods);
      } else {
        setDiscountProducts((prev) => [...prev, ...prods]);
      }

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);

      // Set filter data if available
      if (data.filters) {
        setFilterData(data.filters);
      }

      // Set trending categories if available
      if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
        setTrendingCategories(data.trendingCategories);
      }

    } catch (error) {
      console.error("Error fetching discount products:", error);
      setError(error.message);
    } finally {
      setLoadingDiscountProducts(false);
      setLoadingMore(false);
    }
  };

  // ===================== INFINITE SCROLL OBSERVER ==========================
  const loadMore = useCallback(() => {
    if (nextCursor && hasMore && !loadingMore) {
      fetchDiscountProducts(nextCursor, false);
    }
  }, [nextCursor, hasMore, loadingMore, coupon, filters]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && loadMore(),
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) obs.observe(el);
    return () => {
      if (el) obs.unobserve(el);
    };
  }, [loadMore, hasMore, loadingMore]);

  // ===================== PRODUCT PAGE FUNCTIONALITY =====================
  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const openVariantOverlay = (productId, type = "all") => {
    setSelectedVariantType(type);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };

  const getProductSlug = (product) => {
    if (product.slugs && product.slugs.length > 0) return product.slugs[0];
    return product._id;
  };

  const handleAddToCart = async (prod) => {
    setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = variants.length > 0;

      // Check if user has explicitly selected a variant
      const isVariantSelected = !!selectedVariants[prod._id];

      // Used for display (image, price). Defaults to explicitly selected OR first available OR first
      const displayVariant = selectedVariants[prod._id] || (hasVar ? (variants.find(v => v.stock > 0) || variants[0]) : null);

      if (hasVar) {
        if (!displayVariant || displayVariant.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }
      }

      // Build payload same as ProductPage
      let payload;
      if (hasVar) {
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(displayVariant), quantity: 1 }],
        };
        // Cache selected variant
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = displayVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        payload = { productId: prod._id, quantity: 1 };
      }

      const { data } = await axios.post(`${API_BASE}/add`, payload, { withCredentials: true });
      if (!data.success) throw new Error(data.message || "Cart add failed");

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (err) {
      console.error("Add to Cart error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to add to cart";
      showToastMsg(msg, "error");
      if (err.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
    } finally {
      setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
    }
  };

  const getCurrentSortText = () => {
    if (filters.sort === "priceHighToLow") return "Price: High to Low";
    if (filters.sort === "priceLowToHigh") return "Price: Low to High";
    return "Relevance";
  };

  // ===================== RENDER PRODUCT CARD - MATCHING ProductPage DESIGN =====================
  const renderProductCard = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    const hasVar = vars.length > 0;

    // Check if user has explicitly selected a variant
    const isVariantSelected = !!selectedVariants[prod._id];

    // Used for display (image, price). Defaults to explicitly selected OR first available OR first
    const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find(v => v.stock > 0) || vars[0]) : null);

    const grouped = groupVariantsByType(vars);
    const totalVars = vars.length;
    const sku = displayVariant ? getSku(displayVariant) : null;
    const inWl = sku ? isInWishlist(prod._id, sku) : false;
    const slugPr = getProductSlug(prod);
    const img = displayVariant?.images?.[0] || displayVariant?.image || prod.images?.[0] || "/placeholder.png";

    const isAdding = addingToCart[prod._id];
    const oos = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;

    // Show select variant button if product has variants but user hasn't selected one yet
    const showSelectVariantButton = hasVar && !isVariantSelected;
    const disabled = isAdding || (!showSelectVariantButton && oos);

    let btnText = "Add to Cart";
    if (isAdding) {
      btnText = "Adding...";
    } else if (showSelectVariantButton) {
      btnText = "Select Variant";
    } else if (oos) {
      btnText = "Out of Stock";
    }

    // Get price information
    const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
    const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
    const disc = orig > price;
    const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;

    return (
      <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
        {/* Wishlist Button - MATCHING ProductPage */}
        <button className="bg-transparent"
          onClick={() => {
            if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {});
          }}
          disabled={wishlistLoading[prod._id]}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
            color: inWl ? "#dc3545" : "#ccc",
            fontSize: 22,
            zIndex: 2,
            // backgroundColor: "rgba(255,255,255,.9)",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // boxShadow: "0 2px 4px rgba(0,0,0,.1)",
            transition: "all .3s ease",
            border: "none",
          }}
          title={inWl ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlistLoading[prod._id] ? (
            <div className="spinner-border spinner-border-sm" role="status" />
          ) : inWl ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </button>

        {/* Eligible Badge - KEEPING this as it's specific to discount page */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "#17a2b8",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2
          }}
        >
          Eligible
        </div>

        <img
          src={img}
          alt={prod.name}
          className="card-img-top"
          style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
          onClick={() => navigate(`/product/${slugPr}`)}
        />

        {/* Discount Badge */}
        {disc && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "8px",
              background: "#dc3545",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              zIndex: 2
            }}
          >
            {pct}% OFF
          </div>
        )}

        {/* Card Body - MATCHING ProductPage height: 265 */}
        <div className="card-body p-0 d-flex flex-column" style={{ height: 265, justifyContent: 'space-between' }}>
          {/* Brand - MATCHING ProductPage */}
          <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>

          {/* Product Name - MATCHING ProductPage */}
          <h5
            className="card-title mt-2 align-items-center gap-1 page-title-main-name"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/product/${slugPr}`)}
          >
            {prod.name}
          </h5>

          {/* Minimal Variant Display - MATCHING ProductPage */}
          {hasVar && (
            <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
              {isVariantSelected ? (
                <div
                  className="selected-variant-display text-muted small"
                  style={{ cursor: 'pointer', display: 'inline-block' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openVariantOverlay(prod._id, "all");
                  }}
                  title="Click to change variant"
                >
                  Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
                  <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
                </div>
              ) : (
                <div
                  className="small text-muted"
                  style={{ height: '20px', cursor: 'pointer', display: 'inline-block' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openVariantOverlay(prod._id, "all");
                  }}
                >
                  {vars.length} Variants Available
                  <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
                </div>
              )}
            </div>
          )}

          {/* Pricing - MATCHING ProductPage */}
          <p className="fw-bold mb-3 mt-auto page-title-main-name" style={{ fontSize: 16 }}>
            {disc ? (
              <>
                ₹{price}
                <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
                <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
              </>
            ) : (
              <>₹{orig}</>
            )}
          </p>

          {/* Add to Cart Button - MATCHING ProductPage with Bag icon */}
          <div className="mt-3">
            <button
              className={`btn w-100 d-flex align-items-center justify-content-center gap-2 addtocartbuttton page-title-main-name ${isAdding ? "btn-dark" : "btn-outline-dark"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                if (showSelectVariantButton) {
                  openVariantOverlay(prod._id, "all");
                } else {
                  handleAddToCart(prod);
                }
              }}
              disabled={disabled}
              style={{ transition: "background-color .3s ease, color .3s ease" }}
            >
              {isAdding ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Adding...
                </>
              ) : (
                <>
                  {btnText}
                  {!disabled && !isAdding && !showSelectVariantButton && (
                    <img src={Bag} alt="Bag" style={{ height: 20 }} />
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Variant Overlay Modal - MATCHING ProductPage */}
        {showVariantOverlay === prod._id && (
          <div className="variant-overlay position-absolute" onClick={closeVariantOverlay}>
            <div
              className="variant-overlay-content w-100"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: 500,
                background: "#fff",
                borderRadius: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
                <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>
                  ×
                </button>
              </div>

              <div className="variant-tabs d-flex">
                <button
                  className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""
                    }`}
                  onClick={() => setSelectedVariantType("all")}
                >
                  All ({totalVars})
                </button>
                {grouped.color.length > 0 && (
                  <button
                    className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""
                      }`}
                    onClick={() => setSelectedVariantType("color")}
                  >
                    Colors ({grouped.color.length})
                  </button>
                )}
                {grouped.text.length > 0 && (
                  <button
                    className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""
                      }`}
                    onClick={() => setSelectedVariantType("text")}
                  >
                    Sizes ({grouped.text.length})
                  </button>
                )}
              </div>

              <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
                {(selectedVariantType === "all" || selectedVariantType === "color") &&
                  grouped.color.length > 0 && (
                    <div className="row g-3">
                      {grouped.color.map((v) => {
                        const sel = selectedVariants[prod._id]?.sku === v.sku;
                        const oosV = v.stock <= 0;
                        return (
                          <div className="col-lg-4 col-6 mt-2" key={v.sku || v._id}>
                            <div
                              className="text-center"
                              style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                              onClick={() =>
                                !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())
                              }
                            >
                              <div
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "20%",
                                  backgroundColor: v.hex || "#ccc",
                                  margin: "0 auto 8px",
                                  border: sel ? "3px solid #000" : "1px solid #ddd",
                                  opacity: oosV ? 0.5 : 1,
                                  position: "relative",
                                }}
                              >
                                {sel && (
                                  <span
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%,-50%)",
                                      color: "#fff",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    ✓
                                  </span>
                                )}
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

                {(selectedVariantType === "all" || selectedVariantType === "text") &&
                  grouped.text.length > 0 && (
                    <div className="row row-cols-3 g-3">
                      {grouped.text.map((v) => {
                        const sel = selectedVariants[prod._id]?.sku === v.sku;
                        const oosV = v.stock <= 0;
                        return (
                          <div className="col" key={v.sku || v._id}>
                            <div
                              className="text-center"
                              style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                              onClick={() =>
                                !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())
                              }
                            >
                              <div
                                style={{
                                  padding: 10,
                                  borderRadius: 8,
                                  border: sel ? "3px solid #000" : "1px solid #ddd",
                                  background: sel ? "#f8f9fa" : "#fff",
                                  minHeight: 50,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: oosV ? 0.5 : 1,
                                }}
                              >
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
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===================== USE EFFECTS =====================
  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  useEffect(() => {
    if (coupon) {
      const discountCode = coupon.code;
      if (discountCode) {
        fetchDiscountProducts(null, true);
      } else {
        setError("Error: Invalid coupon data");
      }
    } else {
      navigate("/cartpage");
    }
  }, [coupon, navigate, filters]); // Refetch on filters change

  // ===================== LOADING STATE =====================
  // if (loadingDiscountProducts) {
  //   return (
  //     <>
  //       <Header />
  //       <div className="fullscreen-loader page-title-main-name">
  //         <div className="spinner" />
  //         <p className="text-black">Loading products...</p>
  //       </div>
  //       <Footer />
  //     </>
  //   );
  // }


  if (loadingDiscountProducts)
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

  // ===================== ERROR STATE =====================
  if (error) {
    return (
      <>
        <Header />
        <div className="container mt-4 page-title-main-name">
          <div className="alert alert-danger mt-4">
            <h5>Error Loading Discount Products</h5>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => fetchDiscountProducts(null, true)}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ===================== BRAND FILTER PROPS (SAME AS PRODUCTPAGE) =====================
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

  return (
    <>
      <Header />

      {/* Banner Image Section - MATCHING ProductPage */}
      <div className="banner-images text-center mt-xl-5 pt-xl-4">
        <img
          src="/banner-placeholder.jpg"
          alt="Discount Products Banner"
          className="w-100 hero-slider-image-responsive"
          style={{ maxHeight: 400, objectFit: "cover" }}
        />
      </div>

      {/* Trending Categories - MATCHING ProductPage */}
      {trendingCategories.length > 0 && (
        <div className="container-lg mt-4">
          <div className="d-flex overflow-auto py-2"
            style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
            {trendingCategories.map((cat) => {
              const isActive = activeCategorySlug === cat.slug;
              return (
                <button key={cat.slug}
                  onClick={() => handleCategoryPillClick(cat)}
                  className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                  style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, transition: "all 0.18s ease", transform: isActive ? "scale(1.04)" : "scale(1)" }}
                  title={`Filter by ${cat.name}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="padding-left-rightss ms-lg-0 ms-4 mx-4">
        {/* Page Title - MATCHING ProductPage */}
        <h2 className="mb-4 d-none d-lg-block page-title-main-name">
          {coupon?.code || 'Discount Products'}
        </h2>

        <div className="row">
          {/* Desktop Sidebar - EXACTLY LIKE PRODUCTPAGE */}
          <div className="d-none d-lg-block col-lg-3">
            <BrandFilter {...brandFilterProps} />
          </div>

          {/* Mobile Filter + Sort Buttons - EXACTLY LIKE PRODUCTPAGE */}
          <div className="d-lg-none mb-3">
            <h2 className="mb-4 text-center">{coupon?.code || 'Discount Products'}</h2>
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
                        <span className="text-muted small">{getCurrentSortText()}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Offcanvas - EXACTLY LIKE PRODUCTPAGE */}
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
                  zIndex: 1050,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: "85vh",
                  boxShadow: "0 -4px 20px rgba(0,0,0,.2)",
                }}
              >
                <div className="text-center py-3 position-relative">
                  <h5 className="mb-0 fw-bold">Filters</h5>
                  <button
                    className="btn-close position-absolute end-0 me-3"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                    onClick={() => setShowFilterOffcanvas(false)}
                  />
                  <div
                    className="mx-auto mt-2 bg-secondary"
                    style={{ height: 5, width: 50, borderRadius: 3 }}
                  />
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

          {/* Mobile Sort Offcanvas - EXACTLY LIKE PRODUCTPAGE */}
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
                  zIndex: 1050,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: "60vh",
                  boxShadow: "0 -4px 12px rgba(0,0,0,.15)",
                }}
              >
                <div className="text-center py-3 position-relative">
                  <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
                  <button
                    className="btn-close position-absolute end-0 me-3"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                    onClick={() => setShowSortOffcanvas(false)}
                  />
                  <div
                    className="mx-auto mt-2 bg-secondary"
                    style={{ height: 5, width: 50, borderRadius: 3 }}
                  />
                </div>
                <div className="px-4 pb-4">
                  <div className="list-group">
                    {[
                      { value: "recent", label: "Relevance" },
                      { value: "priceHighToLow", label: "Price: High to Low" },
                      { value: "priceLowToHigh", label: "Price: Low to High" },
                    ].map(({ value, label }) => (
                      <label key={value} className="list-group-item py-3 d-flex align-items-center">
                        <input
                          className="form-check-input me-3"
                          type="radio"
                          name="sort"
                          checked={filters.sort === value}
                          onChange={() => {
                            setFilters((p) => ({ ...p, sort: value }));
                            setShowSortOffcanvas(false);
                          }}
                        />
                        <span className="page-title-main-name">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Product Grid - MATCHING ProductPage structure exactly */}
          <div className="col-12 col-lg-9">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="text-muted page-title-main-name">
                {coupon?.code || `Showing ${discountProducts.length} products`}
                {hasMore && " (Scroll for more)"}
              </span>
              {isAnyFilterActive() && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearAllFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="row g-4">
              {discountProducts.length > 0 ? (
                discountProducts.map(renderProductCard)
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>No products found</h4>
                  <p className="text-muted">Try adjusting your filters or check back later.</p>
                  <button className="btn btn-primary" onClick={() => navigate("/cartpage")}>
                    Back to Cart
                  </button>
                </div>
              )}
            </div>

            {/* Infinite Scroll Loading - MATCHING ProductPage */}
            {loadingMore && (
              <div className="text-center mt-4 py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading more products...</span>
                </div>
                <p className="mt-2">Loading more products...</p>
              </div>
            )}

            {/* Sentinel Element for Observer */}
            <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

            {/* End Message - MATCHING ProductPage */}
            {!hasMore && discountProducts.length > 0 && (
              <div className="text-center mt-4 py-4 border-top">
                <p className="text-muted">🎉 You've reached the end! No more products to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DiscountProductsPage;