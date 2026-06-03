// import React, { useEffect, useState, useContext, useMemo } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar } from "react-icons/fa";
// import { CartContext } from "../context/CartContext";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/Brandspage.css";
// import Slider from "react-slick";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BrandFilter from "./BrandFilter";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";

// const VARIANT_CACHE_KEY = "cartVariantCache";

// // Utility: returns SKU whether backend uses `sku` or `variantSku`
// const getSku = (v) => v?.sku || v?.variantSku || null;

// // Utility: detect "black" hex in various formats
// const isBlackHex = (hex) => {
//   if (!hex) return false;
//   const cleaned = String(hex).toLowerCase().replace(/\s/g, "").replace("#", "");
//   return cleaned === "000000" || cleaned === "000" || cleaned === "black";
// };

// const BrandPage = () => {
//   const { brandSlug, categorySlug } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [showAllVariants, setShowAllVariants] = useState({});
//   const [selectedShades, setSelectedShades] = useState({});
//   const [selectedImages, setSelectedImages] = useState({});
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

//   // Mobile filter and sort states
//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);

//   // ================================
//   // Fetch Brand Products
//   // ================================
//   useEffect(() => {
//     const fetchBrandData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `https://beauty.joyory.com/api/user/brands/${brandSlug}`
//         );
//         setBrandData(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching brand data:", error);
//         setError(error.response?.data?.message || "Failed to load brand");
//         if (error.response?.status === 404) {
//           toast.error("Brand not found. It may have been removed or the URL is incorrect.");
//         } else {
//           toast.error("Failed to load brand. Please try again later.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (brandSlug) {
//       fetchBrandData();
//     } else {
//       setLoading(false);
//     }
//   }, [brandSlug, categorySlug]);

//   // ================================
//   // Fetch Filter Options
//   // ================================
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("Error fetching filter data:", err);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   // ================================
//   // Default Variant Setup
//   // ================================
//   useEffect(() => {
//     if (!brandData?.products) return;

//     const defaultShades = {};
//     const defaultImages = {};

//     brandData.products.forEach((product) => {
//       const variants = product.variants || [];
//       if (variants.length === 0) return;

//       const blackVariant = variants.find((v) => isBlackHex(v?.hex));
//       const selected = blackVariant || variants[0];

//       defaultShades[product._id] = {
//         shadeName: selected?.shadeName || selected?.size || "Default",
//         hex: selected?.hex,
//         image: selected?.image || selected?.images?.[0] || null,
//         discountedPrice: selected?.discountedPrice ?? selected?.price ?? 0,
//         originalPrice: selected?.originalPrice ?? selected?.price ?? 0,
//         variantSku: getSku(selected),
//         stock: selected?.stock ?? 0,
//       };

//       defaultImages[product._id] =
//         selected?.image || selected?.images?.[0] || product?.images?.[0] || null;
//     });

//     setSelectedShades(defaultShades);
//     setSelectedImages(defaultImages);
//   }, [brandData]);

//   // ================================
//   // Get current sort text
//   // ================================
//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   // ================================
//   // Filtered products memo
//   // ================================
//   const filteredProducts = useMemo(() => {
//     if (!brandData?.products) return [];

//     const hasStock = (product) =>
//       product.variants?.some((v) => v.stock > 0) || product.stock > 0;

//     const passesBrandFilter = (product) => {
//       if (!filters.brand) return true;
//       const productBrandId = product.brand?._id || product.brand;
//       return String(productBrandId) === String(filters.brand);
//     };

//     const passesCategoryFilter = (product) => {
//       if (!filters.category) return true;
//       const productCategories = [];
//       if (product.category) {
//         productCategories.push(product.category._id || product.category.slug || product.category.name);
//       }
//       if (Array.isArray(product.categories)) {
//         product.categories.forEach((c) => productCategories.push(c._id || c.slug || c.name));
//       }
//       return productCategories.some((c) => String(c) === String(filters.category));
//     };

//     const passesSkinTypeFilter = (product) => {
//       if (!filters.skinType) return true;
//       const skinTypeIds = [];
//       if (product.skinType) skinTypeIds.push(product.skinType._id || product.skinType);
//       if (Array.isArray(product.skinTypes)) {
//         product.skinTypes.forEach((s) => skinTypeIds.push(s._id || s.slug || s.name));
//       }
//       return skinTypeIds.some((id) => String(id) === String(filters.skinType));
//     };

//     const passesFormulationFilter = (product) => {
//       if (!filters.formulation) return true;
//       const formulationId = product.formulation?._id || product.formulation;
//       return String(formulationId) === String(filters.formulation);
//     };

//     const passesPriceFilter = (product) => {
//       if (!filters.priceRange) return true;
//       const variant = product.variants?.[0] || {};
//       const price = variant.discountedPrice || variant.price || product.price || 0;
//       if (filters.priceRange.max === null) return price >= filters.priceRange.min;
//       return price >= filters.priceRange.min && price <= filters.priceRange.max;
//     };

//     const passesRatingFilter = (product) => {
//       if (!filters.minRating) return true;
//       return (product.avgRating || 0) >= parseFloat(filters.minRating);
//     };

//     const sortByDiscount = (a, b) => {
//       if (!filters.discountSort) return 0;
//       const getDiscount = (prod) => {
//         const variant = prod.variants?.[0] || {};
//         const original = variant.originalPrice || prod.mrp || prod.price || 0;
//         const discounted = variant.discountedPrice || variant.price || 0;
//         return original - discounted;
//       };
//       const discountA = getDiscount(a);
//       const discountB = getDiscount(b);
//       return filters.discountSort === "high" ? discountB - discountA : discountA - discountB;
//     };

//     return brandData.products
//       .filter((product) =>
//         hasStock(product) &&
//         passesBrandFilter(product) &&
//         passesCategoryFilter(product) &&
//         passesSkinTypeFilter(product) &&
//         passesFormulationFilter(product) &&
//         passesPriceFilter(product) &&
//         passesRatingFilter(product)
//       )
//       .sort(sortByDiscount);
//   }, [brandData?.products, filters]);

//   // ================================
//   // Pagination
//   // ================================
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 6;

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const currentProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * productsPerPage;
//     const endIndex = startIndex + productsPerPage;
//     return filteredProducts.slice(startIndex, endIndex);
//   }, [filteredProducts, currentPage, productsPerPage]);

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters]);

//   const goToPage = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // ================================
//   // Helpers
//   // ================================
//   const getAverageRating = (product) => {
//     if (!product.reviews || product.reviews.length === 0) return 0;
//     const total = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
//     return (total / product.reviews.length).toFixed(1);
//   };

//   const handleShadeSelect = (productId, shade) => {
//     if (shade.stock !== undefined && shade.stock <= 0) {
//       toast.warning(`${shade.shadeName || 'This variant'} is out of stock`);
//       return;
//     }

//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: {
//         shadeName: shade.shadeName || shade.size || "Default",
//         hex: shade.hex,
//         image: shade.image || shade.images?.[0] || null,
//         discountedPrice: shade.discountedPrice ?? shade.price ?? 0,
//         originalPrice: shade.originalPrice ?? shade.price ?? 0,
//         stock: shade.stock ?? 0,
//         variantSku: getSku(shade),
//       },
//     }));

//     if (shade.image || shade.images?.[0]) {
//       setSelectedImages((prev) => ({
//         ...prev,
//         [productId]: shade.image || shade.images[0],
//       }));
//     }
//   };

//   // ================================
//   // Add to cart
//   // ================================
//   const handleAddToCart = async (prod) => {
//     try {
//       setAddingToCart((s) => ({ ...s, [prod._id]: true }));

//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch {
//         isLoggedIn = false;
//       }

//       const hasVariants = Array.isArray(prod.variants) && prod.variants.length > 0;
//       const selectedShade = selectedShades[prod._id];
//       let variantToAdd = null;

//       if (hasVariants) {
//         const availableVariants = prod.variants.filter((v) => v.stock > 0);
//         if (availableVariants.length === 0) {
//           toast.warning("All variants are out of stock.");
//           return;
//         }

//         if (selectedShade && selectedShade.variantSku) {
//           const matchedVariant = prod.variants.find((v) => getSku(v) === selectedShade.variantSku);
//           if (matchedVariant && matchedVariant.stock > 0) {
//             variantToAdd = matchedVariant;
//           } else {
//             const matchedByName = prod.variants.find((v) => (v.shadeName || "").toLowerCase() === (selectedShade.shadeName || "").toLowerCase());
//             if (matchedByName && matchedByName.stock > 0) variantToAdd = matchedByName;
//           }
//           if (!variantToAdd) {
//             toast.warning("Selected shade is out of stock or unavailable.");
//             return;
//           }
//         } else {
//           variantToAdd = availableVariants[0];
//         }
//       } else {
//         if (prod.stock <= 0) {
//           toast.warning("Product is out of stock.");
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

//       const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//       cache[prod._id] = variantToAdd;
//       localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));

//       const variantSkuToSend = getSku(variantToAdd) || variantToAdd.sku;
//       const cartPayload = {
//         productId: prod._id,
//         variants: [{ variantSku: variantSkuToSend, quantity: 1 }],
//       };

//       if (isLoggedIn) {
//         await addToCart(prod, variantToAdd);
//         toast.success("Product added to cart!");
//         navigate("/cartpage", { state: { refresh: true } });
//       } else {
//         const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//         const existingIndex = guestCart.findIndex((item) => item.productId === prod._id && item.variantSku === variantSkuToSend);
//         if (existingIndex !== -1) {
//           guestCart[existingIndex].quantity += 1;
//         } else {
//           guestCart.push({ productId: prod._id, variantSku: variantSkuToSend, product: prod, variant: variantToAdd, quantity: 1 });
//         }
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));
//         toast.success("Added to cart as guest!");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err?.response?.data || err?.message);
//       toast.error("Failed to add product.");
//     } finally {
//       setAddingToCart((s) => ({ ...s, [prod._id]: false }));
//     }
//   };

//   // ================================
//   // Render product card
//   // ================================
//   const renderProductCard = (product) => {
//     const avgRating = getAverageRating(product);
//     const variants = product.variants || [];

//     const colorVariants = variants.filter((v) => v.hex);
//     const otherVariants = variants.filter((v) => !v.hex);

//     const selShade = selectedShades[product._id];
//     const selectedVariant = selShade
//       ? (variants.find((v) => getSku(v) === selShade.variantSku) || { ...selShade })
//       : variants[0] || {};

//     const price = Number(selectedVariant?.discountedPrice ?? product.price ?? 0);
//     const mrp = Number(selectedVariant?.originalPrice ?? product.mrp ?? price);
//     const hasDiscount = mrp > price;
//     const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

//     const isExpanded = showAllVariants[product._id] || false;
//     const visibleColorVariants = isExpanded ? colorVariants : colorVariants.slice(0, 4);
//     const visibleOtherVariants = isExpanded ? otherVariants : otherVariants.slice(0, 4);

//     return (
//       <div key={product._id} className="col-6 col-md-4 col-lg-4">
//         <div className="card h-100 border-0 shadow-sm">
//           <Link to={`/product/${product._id}`} className="text-decoration-none">
//             <img
//               src={selectedImages[product._id] || selectedVariant?.image || product.images?.[0]}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: "200px", objectFit: "contain" }}
//             />
//           </Link>

//           <div className="card-body d-flex flex-column">
//             <h6
//               className="fw-bold text-dark product-title"
//               style={{
//                 display: '-webkit-box',
//                 WebkitLineClamp: 2,
//                 WebkitBoxOrient: 'vertical',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 lineHeight: '1.4',
//                 minHeight: '2.8em'
//               }}
//             >
//               {product.name}
//             </h6>

//             {/* Color variants (show swatches) */}
//             {colorVariants.length > 0 && (
//               <>
//                 <div className="d-flex flex-wrap mb-2 align-items-center">
//                   {visibleColorVariants.map((variant, idx) => {
//                     const outOfStock = (variant.stock ?? 0) <= 0;
//                     const variantSku = getSku(variant);
//                     const isSelected = selectedShades[product._id]?.variantSku === variantSku || (!selectedShades[product._id] && idx === 0);

//                     const swatchStyle = variant.hex
//                       ? { backgroundColor: variant.hex }
//                       : { backgroundColor: "transparent" };

//                     return (
//                       <div
//                         key={variantSku || `${product._id}-cv-${idx}`}
//                         onClick={() => handleShadeSelect(product._id, variant)}
//                         style={{
//                           width: 30,
//                           height: 30,
//                           borderRadius: "50%",
//                           display: "inline-flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           marginRight: 6,
//                           cursor: outOfStock ? "not-allowed" : "pointer",
//                           opacity: outOfStock ? 0.3 : 1,
//                           position: "relative",
//                           transition: "border 0.2s ease-in-out",
//                           border: isSelected ? "2px solid #000" : "1px solid #ccc",
//                           ...swatchStyle,
//                         }}
//                         title={outOfStock ? `${variant.shadeName || 'Shade'} (Out of Stock)` : variant.shadeName}
//                       >
//                         {!variant.hex && variant.image && (
//                           <img src={variant.image} alt={variant.shadeName || "shade"} style={{ width: 24, height: 24, objectFit: "cover", borderRadius: "50%" }} />
//                         )}
//                         {outOfStock && (
//                           <span style={{
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             transform: "translate(-50%, -50%)",
//                             color: "#ff0000",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             zIndex: 2
//                           }}>
//                             ✕
//                           </span>
//                         )}
//                       </div>
//                     );
//                   })}

//                   {colorVariants.length > 4 && (
//                     <button
//                       className="btn btn-sm btn-outline-secondary mb-2 mt-2"
//                       onClick={() => setShowAllVariants((prev) => ({ ...prev, [product._id]: !isExpanded }))}
//                       style={{ fontSize: 10, width: 70 }}
//                     >
//                       {isExpanded ? "Show Less" : "Show More"}
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Other variants (sizes, types, etc.) */}
//             {otherVariants.length > 0 && (
//               <>
//                 <div className="d-flex flex-wrap gap-2 mb-2">
//                   {visibleOtherVariants.map((variant, idx) => {
//                     const outOfStock = (variant.stock ?? 0) <= 0;
//                     const variantSku = getSku(variant);
//                     const isSelected = selectedShades[product._id]?.variantSku === variantSku || (!selectedShades[product._id] && idx === 0 && !colorVariants.length);

//                     return (
//                       <button
//                         key={variantSku || `${product._id}-ov-${idx}`}
//                         onClick={() => handleShadeSelect(product._id, variant)}
//                         className={`btn btn-sm ${isSelected ? "btn-dark text-white" : "btn-outline-secondary"}`}
//                         style={{
//                           minWidth: 60,
//                           borderRadius: 8,
//                           opacity: outOfStock ? 0.5 : 1,
//                           cursor: outOfStock ? "not-allowed" : "pointer",
//                           position: "relative",
//                           overflow: "hidden"
//                         }}
//                         disabled={outOfStock}
//                       >
//                         {variant.size || variant.shadeName || "Option"}
//                         {outOfStock && (
//                           <span
//                             style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%) rotate(45deg)",
//                               width: "100%",
//                               height: "1px",
//                               backgroundColor: "#ff0000"
//                             }}
//                           />
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {otherVariants.length > 4 && (
//                   <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => setShowAllVariants((prev) => ({ ...prev, [product._id]: !isExpanded }))} style={{ fontSize: "0.85rem" }}>
//                     {isExpanded ? "Show Less" : "Show More"}
//                   </button>
//                 )}
//               </>
//             )}

//             {/* Selected label */}
//             {selectedVariant && (
//               <span className="d-flex gap-2" style={{ fontSize: 15, marginTop: 10 }}>
//                 <p className="fw-bold mb-0" style={{ fontSize: 15 }}>Selected:</p>{" "}
//                 {selectedVariant?.shadeName || selectedVariant?.size || "Default"}
//                 {(selectedVariant.stock ?? 0) <= 0 && (
//                   <span className="badge bg-danger ms-2">Out of Stock</span>
//                 )}
//               </span>
//             )}

//             {/* Ratings */}
//             <div className="d-flex align-items-center mb-1 mt-2">
//               {[...Array(5)].map((_, i) => (
//                 <FaStar key={i} size={14} color={i < Math.round(product.avgRating || 0) ? "#ffc107" : "#e4e5e9"} />
//               ))}
//               <span className="ms-2 text-muted" style={{ fontSize: "0.85rem" }}>
//                 ({Array.isArray(product.totalRatings) ? product.totalRatings.length : product.totalRatings || 0})
//               </span>
//             </div>

//             {/* Price */}
//             <div className="mb-2">
//               <div className="d-flex align-items-baseline gap-2">
//                 {hasDiscount && <del className="text-muted" style={{ fontSize: "0.85rem", display: "block" }}>₹{mrp}</del>}
//                 <p className="text-primary fw-bold mb-0">₹{price}
//                   {hasDiscount && <span className="text-success ms-2" style={{ fontSize: "0.85rem", fontWeight: 500 }}>({discountPercent}% OFF)</span>}
//                 </p>
//               </div>
//             </div>

//             <button
//               className="btn w-100 mt-auto"
//               style={{ backgroundColor: "#365798", color: "white" }}
//               onClick={() => handleAddToCart(product)}
//               disabled={addingToCart[product._id] || (selectedVariant && (selectedVariant.stock ?? 0) <= 0)}
//             >
//               {addingToCart[product._id] ? "Adding..." :
//                (selectedVariant && (selectedVariant.stock ?? 0) <= 0) ? "Out of Stock" : "Add to Cart"}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ================================
//   // Loading and Error Handling
//   // ================================
//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status"></div>
//         <p className="mt-2">Loading brand data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger fs-5">Error: {error}</p>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>
//             Go Back
//           </button>
//           <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>
//             Go to Home
//           </button>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (!brandData) {
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger">Brand not found.</p>
//           <button className="btn btn-primary" onClick={() => navigate("/")}>
//             Go to Home
//           </button>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />

//       {/* BANNER SECTION */}
//       {brandData.brand?.banner && (
//         <div className="brand-banner-section mb-5">
//           <div className="container-fluid px-0">
//             <div className="brand-banner-container position-relative">
//               <img
//                 src={brandData.brand.banner}
//                 alt={`${brandData.brand.name} Banner`}
//                 className="brand-banner-image w-100"
//                 style={{
//                   height: "auto",
//                   objectFit: "cover",
//                   objectPosition: "center"
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container py-5">
//         <div className="row mb-5">
//           {brandData.categories?.length > 0 && (
//             <div className="mb-4 category-slider-wrapper">
//               <h5 className="fw-bold text-primary mb-3">Shop by Categories</h5>

//               <Slider
//                 dots={false}
//                 infinite={false}
//                 speed={400}
//                 slidesToShow={Math.min(5, brandData.categories.length)}
//                 slidesToScroll={2}
//                 arrows={true}
//                 responsive={[
//                   {
//                     breakpoint: 1400,
//                     settings: {
//                       slidesToShow: Math.min(5, brandData.categories.length),
//                       slidesToScroll: 2,
//                       arrows: true
//                     }
//                   },
//                   {
//                     breakpoint: 1200,
//                     settings: {
//                       slidesToShow: Math.min(4, brandData.categories.length),
//                       slidesToScroll: 2,
//                       arrows: true
//                     }
//                   },
//                   {
//                     breakpoint: 992,
//                     settings: {
//                       slidesToShow: Math.min(3, brandData.categories.length),
//                       slidesToScroll: 2,
//                       arrows: true
//                     }
//                   },
//                   {
//                     breakpoint: 768,
//                     settings: {
//                       slidesToShow: Math.min(2, brandData.categories.length),
//                       slidesToScroll: 1,
//                       arrows: true
//                     }
//                   },
//                   {
//                     breakpoint: 576,
//                     settings: {
//                       slidesToShow: Math.min(2, brandData.categories.length),
//                       slidesToScroll: 1,
//                       arrows: false
//                     }
//                   },
//                   {
//                     breakpoint: 480,
//                     settings: {
//                       slidesToShow: Math.min(3, brandData.categories.length),
//                       slidesToScroll: 1,
//                       arrows: false
//                     }
//                   }
//                 ]}
//               >
//                 {brandData.categories.map((cat) => {
//                   const isSelected = filters.category && (String(filters.category) === String(cat._id) || String(filters.category) === String(cat.slug));
//                   return (
//                     <div key={cat._id} className="category-card text-center p-3 category-card-produt-promotions" onClick={() => setFilters({ ...filters, category: isSelected ? "" : cat._id })} style={{ cursor: "pointer", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: isSelected ? "#e6f0ff" : "#fff", transition: "all 0.2s ease-in-out", margin: "0 8px", minWidth: 120 }}>
//                       <div style={{ fontSize: 24, color: "#365798", marginBottom: 8 }}><i className="bi bi-tag"></i></div>
//                       <p className="mb-0 fw-bold text-dark">{cat.name}</p>
//                     </div>
//                   );
//                 })}
//               </Slider>

//               {filters.category && (
//                 <div className="text-center mt-3">
//                   <button className="btn btn-sm btn-outline-danger" onClick={() => setFilters({ ...filters, category: "" })}>Clear</button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Desktop Sidebar Filter */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="brand" />
//           </div>

//           {/* Mobile Filter + Sort Buttons - ADDED THIS SECTION */}
//           <div className="d-lg-none mb-3">
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

//           {/* Filter Bottom Offcanvas - ADDED THIS SECTION */}
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
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterData={filterData}
//                     products={brandData.products}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Sort Bottom Offcanvas - ADDED THIS SECTION */}
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

//           <div className="col-md-12 col-lg-9">
//             {/* Clear filters button and product count */}
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <h4 className="fw-bold mb-0">Products
//                 <span className="text-muted fs-6 ms-2">
//                   (Showing {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products)
//                 </span>
//               </h4>

//               {Object.values(filters).some(val => val !== "" && val !== null) && (
//                 <button className="btn btn-sm btn-outline-danger"
//                   onClick={() => setFilters({
//                     brand: "", category: "", skinType: "", formulation: "", priceRange: null, minRating: "", discountSort: ""
//                   })}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {currentProducts.length > 0 ?
//                 currentProducts.map(renderProductCard) :
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                   <button className="btn btn-primary" onClick={() => setFilters({
//                     brand: "", category: "", skinType: "", formulation: "", priceRange: null, minRating: "", discountSort: ""
//                   })}>
//                     Clear All Filters
//                   </button>
//                 </div>
//               }
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center mt-4">
//                 <nav>
//                   <ul className="pagination">
//                     <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                       <button className="page-link" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
//                         Previous
//                       </button>
//                     </li>

//                     {/* Show first page */}
//                     {currentPage > 3 && (
//                       <li className="page-item">
//                         <button className="page-link" onClick={() => goToPage(1)}>1</button>
//                       </li>
//                     )}

//                     {/* Show dots if needed */}
//                     {currentPage > 4 && (
//                       <li className="page-item disabled">
//                         <span className="page-link">...</span>
//                       </li>
//                     )}

//                     {/* Show page numbers around current page */}
//                     {Array.from({ length: totalPages }, (_, i) => i + 1)
//                       .filter(page => page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2))
//                       .map(page => (
//                         <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
//                           <button className="page-link" onClick={() => goToPage(page)}>
//                             {page}
//                           </button>
//                         </li>
//                       ))
//                     }

//                     {/* Show dots if needed */}
//                     {currentPage < totalPages - 3 && (
//                       <li className="page-item disabled">
//                         <span className="page-link">...</span>
//                       </li>
//                     )}

//                     {/* Show last page */}
//                     {currentPage < totalPages - 2 && (
//                       <li className="page-item">
//                         <button className="page-link" onClick={() => goToPage(totalPages)}>{totalPages}</button>
//                       </li>
//                     )}

//                     <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                       <button className="page-link" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
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

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//       <Footer />
//     </>
//   );
// };

// export default BrandPage;

// import React, { useEffect, useState, useContext, useMemo } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { CartContext } from "../context/CartContext";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/Brandspage.css";
// import Slider from "react-slick";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BrandFilter from "./BrandFilter";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";
// import { style } from 'framer-motion/client';

// const VARIANT_CACHE_KEY = "cartVariantCache";

// const getSku = (v) => v?.sku || v?.variantSku || null;

// const isBlackHex = (hex) => {
//   if (!hex) return false;
//   const cleaned = String(hex).toLowerCase().replace(/\s/g, "").replace("#", "");
//   return cleaned === "000000" || cleaned === "000" || cleaned === "black";
// };

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

// const BrandPage = () => {
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShades, setSelectedShades] = useState({});
//   const [selectedImages, setSelectedImages] = useState({});
//   const [wishlist, setWishlist] = useState([]);
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

//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 6;

//   // Fetch Brand Data
//   useEffect(() => {
//     const fetchBrandData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `https://beauty.joyory.com/api/user/brands/${brandSlug}`
//         );
//         setBrandData(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching brand data:", error);
//         setError(error.response?.data?.message || "Failed to load brand");
//         toast.error("Failed to load brand. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (brandSlug) fetchBrandData();
//   }, [brandSlug]);

//   // Fetch Filters
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("Error fetching filter data:", err);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   // Default Variant & Image Setup
//   useEffect(() => {
//     if (!brandData?.products) return;

//     const defaultShades = {};
//     const defaultImages = {};

//     brandData.products.forEach((product) => {
//       const variants = product.variants || [];
//       if (variants.length === 0) return;

//       const blackVariant = variants.find((v) => isBlackHex(v?.hex));
//       const selected = blackVariant || variants[0];

//       defaultShades[product._id] = {
//         shadeName: selected?.shadeName || selected?.size || "Default",
//         hex: selected?.hex,
//         image: selected?.image || selected?.images?.[0] || null,
//         discountedPrice: selected?.discountedPrice ?? selected?.price ?? 0,
//         originalPrice: selected?.originalPrice ?? selected?.price ?? 0,
//         variantSku: getSku(selected),
//         stock: selected?.stock ?? 0,
//       };

//       defaultImages[product._id] =
//         selected?.image || selected?.images?.[0] || product?.images?.[0] || null;
//     });

//     setSelectedShades(defaultShades);
//     setSelectedImages(defaultImages);
//   }, [brandData]);

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   const filteredProducts = useMemo(() => {
//     if (!brandData?.products) return [];

//     const hasStock = (product) =>
//       product.variants?.some((v) => v.stock > 0) || product.stock > 0;

//     const passesBrandFilter = (product) => {
//       if (!filters.brand) return true;
//       const productBrandId = product.brand?._id || product.brand;
//       return String(productBrandId) === String(filters.brand);
//     };

//     const passesCategoryFilter = (product) => {
//       if (!filters.category) return true;
//       const productCategories = [];
//       if (product.category) {
//         productCategories.push(product.category._id || product.category.slug || product.category.name);
//       }
//       if (Array.isArray(product.categories)) {
//         product.categories.forEach((c) => productCategories.push(c._id || c.slug || c.name));
//       }
//       return productCategories.some((c) => String(c) === String(filters.category));
//     };

//     const passesSkinTypeFilter = (product) => {
//       if (!filters.skinType) return true;
//       const skinTypeIds = [];
//       if (product.skinType) skinTypeIds.push(product.skinType._id || product.skinType);
//       if (Array.isArray(product.skinTypes)) {
//         product.skinTypes.forEach((s) => skinTypeIds.push(s._id || s.slug || s.name));
//       }
//       return skinTypeIds.some((id) => String(id) === String(filters.skinType));
//     };

//     const passesFormulationFilter = (product) => {
//       if (!filters.formulation) return true;
//       const formulationId = product.formulation?._id || product.formulation;
//       return String(formulationId) === String(filters.formulation);
//     };

//     const passesPriceFilter = (product) => {
//       if (!filters.priceRange) return true;
//       const variant = product.variants?.[0] || {};
//       const price = variant.discountedPrice || variant.price || product.price || 0;
//       if (filters.priceRange.max === null) return price >= filters.priceRange.min;
//       return price >= filters.priceRange.min && price <= filters.priceRange.max;
//     };

//     const passesRatingFilter = (product) => {
//       if (!filters.minRating) return true;
//       return (product.avgRating || 0) >= parseFloat(filters.minRating);
//     };

//     const sortByDiscount = (a, b) => {
//       if (!filters.discountSort) return 0;
//       const getDiscount = (prod) => {
//         const variant = prod.variants?.[0] || {};
//         const original = variant.originalPrice || prod.mrp || prod.price || 0;
//         const discounted = variant.discountedPrice || variant.price || 0;
//         return original - discounted;
//       };
//       const discountA = getDiscount(a);
//       const discountB = getDiscount(b);
//       return filters.discountSort === "high" ? discountB - discountA : discountA - discountB;
//     };

//     return brandData.products
//       .filter((product) =>
//         hasStock(product) &&
//         passesBrandFilter(product) &&
//         passesCategoryFilter(product) &&
//         passesSkinTypeFilter(product) &&
//         passesFormulationFilter(product) &&
//         passesPriceFilter(product) &&
//         passesRatingFilter(product)
//       )
//       .sort(sortByDiscount);
//   }, [brandData?.products, filters]);

//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const currentProducts = useMemo(() => {
//     const start = (currentPage - 1) * productsPerPage;
//     return filteredProducts.slice(start, start + productsPerPage);
//   }, [filteredProducts, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters]);

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleVariantSelect = (productId, variant) => {
//     if ((variant.stock ?? 0) <= 0) {
//       toast.warning(`${getVariantDisplayText(variant)} is out of stock`);
//       return;
//     }

//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: {
//         shadeName: variant.shadeName || variant.size || "Default",
//         hex: variant.hex,
//         image: variant.image || variant.images?.[0] || null,
//         discountedPrice: variant.discountedPrice ?? variant.price ?? 0,
//         originalPrice: variant.originalPrice ?? variant.price ?? 0,
//         stock: variant.stock ?? 0,
//         variantSku: getSku(variant),
//       },
//     }));

//     if (variant.image || variant.images?.[0]) {
//       setSelectedImages((prev) => ({
//         ...prev,
//         [productId]: variant.image || variant.images[0],
//       }));
//     }
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
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch {}

//       const variants = prod.variants || [];
//       let variantToAdd = selectedShades[prod._id];

//       if (variants.length > 0) {
//         if (!variantToAdd || (variantToAdd.stock ?? 0) <= 0) {
//           toast.warning("Please select an in-stock variant.");
//           return;
//         }
//         const matched = variants.find((v) => getSku(v) === variantToAdd.variantSku);
//         variantToAdd = matched || variantToAdd;
//       } else {
//         if (prod.stock <= 0) {
//           toast.warning("Product is out of stock.");
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

//       const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//       cache[prod._id] = variantToAdd;
//       localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));

//       if (isLoggedIn) {
//         await addToCart(prod, variantToAdd);
//         toast.success("Product added to cart!");
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
//         toast.success("Added to cart as guest!");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       toast.error("Failed to add product.");
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

//   const getBrandName = (product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   };

//   const renderProductCard = (product) => {
//     const variants = product.variants || [];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     const selShade = selectedShades[product._id];
//     const selectedVariant = selShade
//       ? variants.find((v) => getSku(v) === selShade.variantSku) || { ...selShade }
//       : variants[0] || {};

//     const price = Number(selectedVariant?.discountedPrice ?? product.price ?? 0);
//     const original = Number(selectedVariant?.originalPrice ?? product.mrp ?? price);
//     const hasDiscount = original > price;
//     const percent = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;

//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     return (
//       <div key={product._id} className="col-6 col-md-4 col-lg-4 position-relative">
//         <div className="h-100">
//           <Link to={`/product/${product._id}`} className="text-decoration-none">
//             <img
//               src={selectedImages[product._id] || selectedVariant?.image || product.images?.[0] || "/placeholder.png"}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: "200px", objectFit: "contain" }}
//             />
//           </Link>

//           <div className="d-flex flex-column p-0 m-0" style={{ height: "320px" }}>
//             {/* Brand Name */}
//             <div className="brand-name text-muted small mb-1 fw-medium">
//               {getBrandName(product)}
//             </div>

//             {/* Product Name + Selected Variant */}
//             <h5
//               className="card-title mt-2"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${product._id}`)}
//             >
//               {product.name}
//             </h5>
//             {selectedVariant.shadeName && (
//               <div className="text-black fw-normal fs-6 mb-2">
//                 {getVariantDisplayText(selectedVariant)}
//               </div>
//             )}

//             {/* Rating */}
//             <div className="d-flex align-items-center mt-1 mb-2">
//               {renderStars(product.avgRating || 0)}
//               <span className="ms-2 text-muted small">({product.totalRatings || 0})</span>
//             </div>

//             {/* Variant Selection */}
//             {variants.length > 0 && (
//               <div className="variant-section mt-2">
//                 {grouped.color.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2 mb-2">
//                     {initialColors.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className="color-circle"
//                           style={{
//                             width: "28px",
//                             height: "28px",
//                             borderRadius: "20%",
//                             backgroundColor: v.hex || "#ccc",
//                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             position: "relative",
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {isSelected && (
//                             <span style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}>✓</span>
//                           )}
//                         </div>
//                       );
//                     })}
//                     {grouped.color.length > 4 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "color")}
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

//                 {grouped.text.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2">
//                     {initialText.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className={`variant-text ${isSelected ? "selected" : ""}`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                             background: isSelected ? "#000" : "#fff",
//                             color: isSelected ? "#fff" : "#000",
//                             fontSize: "13px",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {getVariantDisplayText(v)}
//                         </div>
//                       );
//                     })}
//                     {grouped.text.length > 2 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "text")}
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
//             <p className="fw-bold mb-3 mt-3" style={{ fontSize: "16px" }}>
//               {hasDiscount ? (
//                 <>
//                   ₹{price}
//                   <span style={{ textDecoration: "line-through", color: "#888", marginLeft: "8px" }}>
//                     ₹{original}
//                   </span>
//                   <span style={{ color: "#e53e3e", marginLeft: "8px", fontWeight: "600" }}>
//                     ({percent}% OFF)
//                   </span>
//                 </>
//               ) : (
//                 <>₹{original}</>
//               )}
//             </p>

//             {/* Add to Cart Button */}
//             <div className="mt-auto">
//               <button
//                 className={`btn add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${
//                   addingToCart[product._id] ? "bg-black text-white" : ""
//                 }`}
//                 onClick={() => handleAddToCart(product)}
//                 disabled={addingToCart[product._id] || (selectedVariant.stock ?? 0) <= 0}
//                 style={{ transition: "all 0.3s ease" }}
//               >
//                 {addingToCart[product._id] ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Adding...
//                   </>
//                 ) : (selectedVariant.stock ?? 0) <= 0 ? (
//                   "Out of Stock"
//                 ) : (
//                   <>
//                     Add to Cart
//                     <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Variant Overlay */}
//           {showVariantOverlay === product._id && (
//             <div className="variant-overlay" onClick={closeVariantOverlay}>
//               <div
//                 className="variant-overlay-content"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: "90%",
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
//                   <h5 className="m-0">Select Variant ({totalVariants})</h5>
//                   <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: "24px" }}>
//                     ×
//                   </button>
//                 </div>

//                 <div className="variant-tabs d-flex">
//                   <button
//                     className={`variant-tab flex-fill py-3 ${selectedVariantType === "all" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("all")}
//                   >
//                     All ({totalVariants})
//                   </button>
//                   {grouped.color.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 ${selectedVariantType === "color" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("color")}
//                     >
//                       Colors ({grouped.color.length})
//                     </button>
//                   )}
//                   {grouped.text.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("text")}
//                     >
//                       Sizes ({grouped.text.length})
//                     </button>
//                   )}
//                 </div>

//                 <div className="p-3 overflow-auto flex-grow-1">
//                   {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;
//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                               onClick={() => !isOutOfStock && (handleVariantSelect(product._id, v), closeVariantOverlay())}
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
//                                   <span style={{
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     color: "#fff",
//                                     fontWeight: "bold",
//                                   }}>✓</span>
//                                 )}
//                               </div>
//                               <div className="small" style={{fontSize:'10px'}}>{getVariantDisplayText(v)}</div>
//                               {isOutOfStock && <div className="text-danger small">Out of Stock</div>}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;
//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
//                               onClick={() => !isOutOfStock && (handleVariantSelect(product._id, v), closeVariantOverlay())}
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
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status"></div>
//         <p className="mt-2">Loading brand data...</p>
//       </div>
//     );
//   }

//   if (error || !brandData) {
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger fs-5">{error || "Brand not found."}</p>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//           <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Go to Home</button>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {brandData.brand?.banner && (
//         <div className="brand-banner-section mb-5">
//           <div className="container-fluid px-0">
//             <img src={brandData.brand.banner} alt={`${brandData.brand.name} Banner`} className="w-100" style={{ height: "auto", objectFit: "cover" }} />
//           </div>
//         </div>
//       )}

//       <div className="container py-5">
//         <div className="row mb-5">
//           {brandData.categories?.length > 0 && (
//             <div className="mb-4 category-slider-wrapper">
//               <h5 className="fw-bold text-primary mb-3">Shop by Categories</h5>
//               <Slider dots={false} infinite={false} speed={400} slidesToShow={Math.min(5, brandData.categories.length)} slidesToScroll={2} arrows={true}>
//                 {brandData.categories.map((cat) => {
//                   const isSelected = filters.category && (String(filters.category) === String(cat._id));
//                   return (
//                     <div key={cat._id} className="category-card text-center p-3" onClick={() => setFilters({ ...filters, category: isSelected ? "" : cat._id })} style={{ cursor: "pointer", borderRadius: 12, backgroundColor: isSelected ? "#e6f0ff" : "#fff" }}>
//                       <div style={{ fontSize: 24, color: "#365798", marginBottom: 8 }}><i className="bi bi-tag"></i></div>
//                       <p className="mb-0 fw-bold text-dark">{cat.name}</p>
//                     </div>
//                   );
//                 })}
//               </Slider>
//             </div>
//           )}

//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="brand" />
//           </div>

//           <div className="d-lg-none mb-3">
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowFilterOffcanvas(true)} style={{ gap: "12px" }}>
//                       <img src={filtering} alt="Filter" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold">Filter</p>
//                         <span className="text-muted small">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowSortOffcanvas(true)} style={{ gap: "12px" }}>
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

//           {/* {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,0.2)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowFilterOffcanvas(false)}></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter filters={filters} setFilters={setFilters} filterData={filterData} products={brandData.products} onClose={() => setShowFilterOffcanvas(false)} hideBrandFilter={false} />
//                 </div>
//               </div>
//             </>
//           )} */}

//           {/* Mobile Filter Offcanvas - Keep as is */}
// {showFilterOffcanvas && (
//   <>
//     <div
//       className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//       style={{ opacity: 0.5, zIndex: 1040 }}
//       onClick={() => setShowFilterOffcanvas(false)}
//     ></div>
//     <div
//       className="position-fixed start-0 bottom-0 w-100 bg-white"
//       style={{
//         zIndex: 1050,
//         borderTopLeftRadius: "16px",
//         borderTopRightRadius: "16px",
//         maxHeight: "85vh",
//         boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
//       }}
//     >
//       <div className="text-center py-3 position-relative">
//         <h5 className="mb-0 fw-bold">Filters</h5>
//         <button
//           className="btn-close position-absolute end-0 me-3"
//           style={{ top: "50%", transform: "translateY(-50%)" }}
//           onClick={() => setShowFilterOffcanvas(false)}
//         ></button>
//         <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//       </div>
//       <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//         <BrandFilter
//           filters={filters}
//           setFilters={setFilters}
//           filterData={filterData}
//           products={brandData?.products || []}
//           onClose={() => setShowFilterOffcanvas(false)}
//           currentPage="brand"
//           hideBrandFilter={false}
//         />
//       </div>
//     </div>
//   </>
// )}

//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,0.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowSortOffcanvas(false)}></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={!filters.discountSort} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "" })); setShowSortOffcanvas(false); }} />
//                       <span>Relevance</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "high"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "high" })); setShowSortOffcanvas(false); }} />
//                       <span>Highest Discount First</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "low"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "low" })); setShowSortOffcanvas(false); }} />
//                       <span>Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <h4 className="fw-bold mb-0">
//                 Products
//                 <span className="text-muted fs-6 ms-2">
//                   (Showing {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length})
//                 </span>
//               </h4>
//               {Object.values(filters).some(val => val !== "" && val !== null) && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={() => setFilters({ brand: "", category: "", skinType: "", formulation: "", priceRange: null, minRating: "", discountSort: "" })}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {currentProducts.length > 0 ? currentProducts.map(renderProductCard) : (
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

// export default BrandPage;

// import React, { useEffect, useState, useContext, useMemo } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { CartContext } from "../context/CartContext";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/Brandspage.css";
// import Slider from "react-slick";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BrandFilter from "./BrandFilter";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";
// import { style } from 'framer-motion/client';

// const VARIANT_CACHE_KEY = "cartVariantCache";

// const getSku = (v) => v?.sku || v?.variantSku || null;

// const isBlackHex = (hex) => {
//   if (!hex) return false;
//   const cleaned = String(hex).toLowerCase().replace(/\s/g, "").replace("#", "");
//   return cleaned === "000000" || cleaned === "000" || cleaned === "black";
// };

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

// const BrandPage = () => {
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShades, setSelectedShades] = useState({});
//   const [selectedImages, setSelectedImages] = useState({});
//   const [wishlist, setWishlist] = useState([]);
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

//   // Build query parameters for API call
//   const buildQueryParams = () => {
//     const params = new URLSearchParams();

//     if (filters.brand) params.append('brandIds', filters.brand);
//     if (filters.skinType) params.append('skinTypes', filters.skinType);
//     if (filters.formulation) params.append('formulations', filters.formulation);
//     if (filters.minRating) params.append('minRating', filters.minRating);

//     if (filters.priceRange) {
//       params.append('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max !== null) {
//         params.append('maxPrice', filters.priceRange.max);
//       }
//     }

//     if (filters.discountSort === 'high') {
//       params.append('sort', 'priceHighToLow');
//     } else if (filters.discountSort === 'low') {
//       params.append('sort', 'priceLowToHigh');
//     } else {
//       params.append('sort', 'recent');
//     }

//     params.append('limit', 1000);

//     return params.toString();
//   };

//   // Fetch Brand Data with filters
//   useEffect(() => {
//     const fetchBrandData = async () => {
//       try {
//         setLoading(true);
//         let url = `https://beauty.joyory.com/api/user/brands/${brandSlug}`;
//         const queryParams = buildQueryParams();
//         if (queryParams) {
//           url += `?${queryParams}`;
//         }
//         const response = await axios.get(url);
//         setBrandData(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching brand data:", error);
//         setError(error.response?.data?.message || "Failed to load brand");
//         toast.error("Failed to load brand. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (brandSlug) fetchBrandData();
//   }, [brandSlug, filters]);

//   // Fetch Filters
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("Error fetching filter data:", err);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   // Default Variant & Image Setup
//   useEffect(() => {
//     if (!brandData?.products) return;

//     const defaultShades = {};
//     const defaultImages = {};

//     brandData.products.forEach((product) => {
//       const variants = product.variants || [];
//       if (variants.length === 0) return;

//       const blackVariant = variants.find((v) => isBlackHex(v?.hex));
//       const selected = blackVariant || variants[0];

//       defaultShades[product._id] = {
//         shadeName: selected?.shadeName || selected?.size || "Default",
//         hex: selected?.hex,
//         image: selected?.image || selected?.images?.[0] || null,
//         discountedPrice: selected?.discountedPrice ?? selected?.price ?? 0,
//         originalPrice: selected?.originalPrice ?? selected?.price ?? 0,
//         variantSku: getSku(selected),
//         stock: selected?.stock ?? 0,
//       };

//       defaultImages[product._id] =
//         selected?.image || selected?.images?.[0] || product?.images?.[0] || null;
//     });

//     setSelectedShades(defaultShades);
//     setSelectedImages(defaultImages);
//   }, [brandData]);

//   // Wishlist Fetch
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//         setWishlist(res.data.wishlist?.map(item => item._id) || []);
//       } catch (err) {
//         setWishlist([]);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   const toggleWishlist = async (productId) => {
//     try {
//       await axios.post(`https://beauty.joyory.com/api/user/wishlist/${productId}`, {}, { withCredentials: true });
//       setWishlist(prev =>
//         prev.includes(productId)
//           ? prev.filter(id => id !== productId)
//           : [...prev, productId]
//       );
//       toast.success("Wishlist updated!");
//     } catch (err) {
//       toast.error("Failed to update wishlist");
//     }
//   };

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   // Filtered & Sorted Products (No Pagination)
//   const displayedProducts = useMemo(() => {
//     if (!brandData?.products) return [];

//     const hasStock = (product) =>
//       product.variants?.some((v) => v.stock > 0) || product.stock > 0;

//     const passesBrandFilter = (product) => {
//       if (!filters.brand) return true;
//       const productBrandId = product.brand?._id || product.brand;
//       return String(productBrandId) === String(filters.brand);
//     };

//     const passesCategoryFilter = (product) => {
//       if (!filters.category) return true;
//       const productCategories = [];
//       if (product.category) {
//         productCategories.push(product.category._id || product.category.slug || product.category.name);
//       }
//       if (Array.isArray(product.categories)) {
//         product.categories.forEach((c) => productCategories.push(c._id || c.slug || c.name));
//       }
//       return productCategories.some((c) => String(c) === String(filters.category));
//     };

//     const passesSkinTypeFilter = (product) => {
//       if (!filters.skinType) return true;
//       const skinTypeIds = [];
//       if (product.skinType) skinTypeIds.push(product.skinType._id || product.skinType);
//       if (Array.isArray(product.skinTypes)) {
//         product.skinTypes.forEach((s) => skinTypeIds.push(s._id || s.slug || s.name));
//       }
//       return skinTypeIds.some((id) => String(id) === String(filters.skinType));
//     };

//     const passesFormulationFilter = (product) => {
//       if (!filters.formulation) return true;
//       const formulationId = product.formulation?._id || product.formulation;
//       return String(formulationId) === String(filters.formulation);
//     };

//     const passesPriceFilter = (product) => {
//       if (!filters.priceRange) return true;
//       const variant = product.variants?.[0] || {};
//       const price = variant.discountedPrice || variant.displayPrice || product.price || 0;
//       if (filters.priceRange.max === null) return price >= filters.priceRange.min;
//       return price >= filters.priceRange.min && price <= filters.priceRange.max;
//     };

//     const passesRatingFilter = (product) => {
//       if (!filters.minRating) return true;
//       return (product.avgRating || 0) >= parseFloat(filters.minRating);
//     };

//     const sortByDiscount = (a, b) => {
//       if (!filters.discountSort) return 0;
//       const getDiscount = (prod) => {
//         const variant = prod.variants?.[0] || {};
//         const original = variant.originalPrice || prod.mrp || prod.price || 0;
//         const discounted = variant.discountedPrice || variant.displayPrice || prod.price || 0;
//         return original - discounted;
//       };

//       const discountA = getDiscount(a);
//       const discountB = getDiscount(b);

//       if (filters.discountSort === "high") {
//         return discountB - discountA;
//       } else {
//         return discountA - discountB;
//       }
//     };

//     return brandData.products
//       .filter((product) =>
//         hasStock(product) &&
//         passesBrandFilter(product) &&
//         passesCategoryFilter(product) &&
//         passesSkinTypeFilter(product) &&
//         passesFormulationFilter(product) &&
//         passesPriceFilter(product) &&
//         passesRatingFilter(product)
//       )
//       .sort(sortByDiscount);
//   }, [brandData?.products, filters]);

//   const handleVariantSelect = (productId, variant) => {
//     if ((variant.stock ?? 0) <= 0) {
//       toast.warning(`${getVariantDisplayText(variant)} is out of stock`);
//       return;
//     }

//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: {
//         shadeName: variant.shadeName || variant.size || "Default",
//         hex: variant.hex,
//         image: variant.image || variant.images?.[0] || null,
//         discountedPrice: variant.discountedPrice ?? variant.price ?? 0,
//         originalPrice: variant.originalPrice ?? variant.price ?? 0,
//         stock: variant.stock ?? 0,
//         variantSku: getSku(variant),
//       },
//     }));

//     if (variant.image || variant.images?.[0]) {
//       setSelectedImages((prev) => ({
//         ...prev,
//         [productId]: variant.image || variant.images[0],
//       }));
//     }
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
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch {}

//       const variants = prod.variants || [];
//       let variantToAdd = selectedShades[prod._id];

//       if (variants.length > 0) {
//         if (!variantToAdd || (variantToAdd.stock ?? 0) <= 0) {
//           toast.warning("Please select an in-stock variant.");
//           return;
//         }
//         const matched = variants.find((v) => getSku(v) === variantToAdd.variantSku);
//         variantToAdd = matched || variantToAdd;
//       } else {
//         if (prod.stock <= 0) {
//           toast.warning("Product is out of stock.");
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

//       const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//       cache[prod._id] = variantToAdd;
//       localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));

//       if (isLoggedIn) {
//         await addToCart(prod, variantToAdd);
//         toast.success("Product added to cart!");
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
//         toast.success("Added to cart as guest!");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       toast.error("Failed to add product.");
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

//   const getBrandName = (product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   };

//   const renderProductCard = (product) => {
//     const variants = product.variants || [];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;
//     const isWishlisted = wishlist.includes(product._id);

//     const selShade = selectedShades[product._id];
//     const selectedVariant = selShade
//       ? variants.find((v) => getSku(v) === selShade.variantSku) || { ...selShade }
//       : variants[0] || {};

//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     return (
//       <div key={product._id} className="col-6 col-md-4 col-lg-4 position-relative">
//         <div
//           onClick={() => toggleWishlist(product._id)}
//           style={{
//             position: "absolute",
//             top: "8px",
//             right: "8px",
//             cursor: "pointer",
//             color: isWishlisted ? "red" : "#ccc",
//             fontSize: "22px",
//             zIndex: 2,
//           }}
//         >
//           {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//         </div>

//         <div className="h-100">
//           <Link to={`/product/${product._id}`} className="text-decoration-none">
//             <img
//               src={selectedImages[product._id] || selectedVariant?.image || product.images?.[0] || "/placeholder.png"}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: "200px", objectFit: "contain" }}
//             />
//           </Link>

//           <div className="d-flex flex-column p-0 m-0" style={{ height: "320px" }}>
//             <div className="brand-name text-muted small mb-1 fw-medium">
//               {getBrandName(product)}
//             </div>

//             <h5
//               className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${product._id}`)}
//             >
//               {product.name}
//               {selectedVariant.shadeName && (
//                 <div className="text-black fw-normal fs-6" style={{ marginTop: "-2px" }}>
//                   {getVariantDisplayText(selectedVariant)}
//                 </div>
//               )}
//             </h5>

//             <div className="d-flex align-items-center mt-1 mb-2">
//               {renderStars(product.avgRating || 0)}
//               <span className="ms-2 text-muted small">({product.totalRatings || 0})</span>
//             </div>

//             {variants.length > 0 && (
//               <div className="variant-section mt-2">
//                 {grouped.color.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2 mb-2">
//                     {initialColors.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className="color-circle"
//                           style={{
//                             width: "28px",
//                             height: "28px",
//                             borderRadius: "20%",
//                             backgroundColor: v.hex || "#ccc",
//                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             position: "relative",
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {isSelected && (
//                             <span style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}>✓</span>
//                           )}
//                         </div>
//                       );
//                     })}
//                     {grouped.color.length > 4 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "color")}
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

//                 {grouped.text.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2">
//                     {initialText.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className={`variant-text page-title-main-name ${isSelected ? "selected" : ""}`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                             background: isSelected ? "#000" : "#fff",
//                             color: isSelected ? "#fff" : "#000",
//                             fontSize: "13px",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             textTransform: 'lowercase'
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {getVariantDisplayText(v)}
//                         </div>
//                       );
//                     })}
//                     {grouped.text.length > 2 && (
//                       <button
//                         className="more-btn page-title-main-name"
//                         onClick={() => openVariantOverlay(product._id, "text")}
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

//             <p className="fw-bold mb-3 mt-3 page-title-main-name" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price =
//                   selectedVariant?.displayPrice ||
//                   selectedVariant?.discountedPrice ||
//                   product.price ||
//                   0;
//                 const original =
//                   selectedVariant?.originalPrice ||
//                   selectedVariant?.mrp ||
//                   product.mrp ||
//                   price;
//                 const hasDiscount = original > price;
//                 const percent = hasDiscount
//                   ? Math.round(((original - price) / original) * 100)
//                   : 0;
//                 return hasDiscount ? (
//                   <>
//                     ₹{price}
//                     <span style={{ textDecoration: "line-through", color: "#888", marginLeft: "8px" }}>
//                       ₹{original}
//                     </span>
//                     <span style={{ color: "#e53e3e", marginLeft: "8px", fontWeight: "600" }}>
//                       ({percent}% OFF)
//                     </span>
//                   </>
//                 ) : (
//                   <>₹{original}</>
//                 );
//               })()}
//             </p>

//             <div className="mt-auto">
//               <button
//                 className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${
//                   addingToCart[product._id] ? "bg-black text-white" : ""
//                 }`}
//                 onClick={() => handleAddToCart(product)}
//                 disabled={addingToCart[product._id] || (selectedVariant.stock ?? 0) <= 0}
//                 style={{ transition: "all 0.3s ease" }}
//               >
//                 {addingToCart[product._id] ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Adding...
//                   </>
//                 ) : (selectedVariant.stock ?? 0) <= 0 ? (
//                   "Out of Stock"
//                 ) : (
//                   <>
//                     Add to Cart
//                     <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Variant Overlay remains unchanged */}
//           {showVariantOverlay === product._id && (
//             <div className="variant-overlay" onClick={closeVariantOverlay}>
//               <div
//                 className="variant-overlay-content"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: "90%",
//                   maxWidth: "500px",
//                   maxHeight: "80vh",
//                   background: "#fff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 {/* ... (same overlay code as before) ... */}
//                 {/* Kept exactly as in your original code */}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status"></div>
//         <p className="mt-2">Loading brand data...</p>
//       </div>
//     );
//   }

//   if (error || !brandData) {
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger fs-5">{error || "Brand not found."}</p>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//           <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Go to Home</button>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {brandData.brand?.banner && (
//         <div className="brand-banner-section mb-5">
//           <div className="container-fluid px-0">
//             <img src={brandData.brand.banner} alt={`${brandData.brand.name} Banner`} className="w-100" style={{ height: "auto", objectFit: "cover" }} />
//           </div>
//         </div>
//       )}

//       <div className="container py-5">
//         <div className="row mb-5">
//           {brandData.categories?.length > 0 && (
//             <div className="mb-4 category-slider-wrapper">
//               <h5 className="fw-bold text-primary mb-3 page-title-main-name">Shop by Categories</h5>
//               <Slider dots={false} infinite={false} speed={400} slidesToShow={Math.min(5, brandData.categories.length)} slidesToScroll={2} arrows={true}>
//                 {brandData.categories.map((cat) => {
//                   const isSelected = filters.category && (String(filters.category) === String(cat._id));
//                   return (
//                     <div key={cat._id} className="category-card text-center p-3" onClick={() => setFilters({ ...filters, category: isSelected ? "" : cat._id })} style={{ cursor: "pointer", borderRadius: 12, backgroundColor: isSelected ? "#e6f0ff" : "#fff" }}>
//                       <div style={{ fontSize: 24, color: "#365798", marginBottom: 8 }}><i className="bi bi-tag"></i></div>
//                       <p className="mb-0 fw-bold text-dark page-title-main-name">{cat.name}</p>
//                     </div>
//                   );
//                 })}
//               </Slider>
//             </div>
//           )}

//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="brand" />
//           </div>

//           <div className="d-lg-none mb-3">
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowFilterOffcanvas(true)} style={{ gap: "12px" }}>
//                       <img src={filtering} alt="Filter" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowSortOffcanvas(true)} style={{ gap: "12px" }}>
//                       <img src={updownarrow} alt="Sort" style={{ width: "25px" }} />
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

//           {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,0.2)" }}>
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
//                     products={brandData?.products || []}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     currentPage="brand"
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,0.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowSortOffcanvas(false)}></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={!filters.discountSort} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Relevance</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "high"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "high" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Highest Discount First</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "low"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "low" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <h4 className="fw-bold mb-0 page-title-main-name">
//                 Products
//                 <span className="text-muted fs-6 ms-2">
//                   (Showing all {displayedProducts.length} products)
//                 </span>
//               </h4>
//               {Object.values(filters).some(val => val !== "" && val !== null) && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={() => setFilters({ brand: "", category: "", skinType: "", formulation: "", priceRange: null, minRating: "", discountSort: "" })}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {displayedProducts.length > 0 ? displayedProducts.map(renderProductCard) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default BrandPage;

//==========================================================================Code(Start)=================================================================================

// import React, { useEffect, useState, useContext, useMemo } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/Brandspage.css";
// import Slider from "react-slick";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BrandFilter from "./BrandFilter";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const VARIANT_CACHE_KEY = "cartVariantCache";

// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;

// const isBlackHex = (hex) => {
//   if (!hex) return false;
//   const cleaned = String(hex).toLowerCase().replace(/\s/g, "").replace("#", "");
//   return cleaned === "000000" || cleaned === "000" || cleaned === "black";
// };

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

// const BrandPage = () => {
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useContext(UserContext);

//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShades, setSelectedShades] = useState({});
//   const [selectedImages, setSelectedImages] = useState({});

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

//   // Build query parameters for API call
//   const buildQueryParams = () => {
//     const params = new URLSearchParams();

//     if (filters.brand) params.append('brandIds', filters.brand);
//     if (filters.skinType) params.append('skinTypes', filters.skinType);
//     if (filters.formulation) params.append('formulations', filters.formulation);
//     if (filters.minRating) params.append('minRating', filters.minRating);

//     if (filters.priceRange) {
//       params.append('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max !== null) {
//         params.append('maxPrice', filters.priceRange.max);
//       }
//     }

//     if (filters.discountSort === 'high') {
//       params.append('sort', 'priceHighToLow');
//     } else if (filters.discountSort === 'low') {
//       params.append('sort', 'priceLowToHigh');
//     } else {
//       params.append('sort', 'recent');
//     }

//     params.append('limit', 1000);

//     return params.toString();
//   };

//   // Fetch Brand Data with filters
//   useEffect(() => {
//     const fetchBrandData = async () => {
//       try {
//         setLoading(true);
//         let url = `https://beauty.joyory.com/api/user/brands/${brandSlug}`;
//         const queryParams = buildQueryParams();
//         if (queryParams) {
//           url += `?${queryParams}`;
//         }
//         const response = await axios.get(url);
//         setBrandData(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching brand data:", error);
//         setError(error.response?.data?.message || "Failed to load brand");
//         toast.error("Failed to load brand. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (brandSlug) fetchBrandData();
//   }, [brandSlug, filters]);

//   // Fetch Filters
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("Error fetching filter data:", err);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   // Default Variant & Image Setup
//   useEffect(() => {
//     if (!brandData?.products) return;

//     const defaultShades = {};
//     const defaultImages = {};

//     brandData.products.forEach((product) => {
//       const variants = product.variants || [];
//       if (variants.length === 0) return;

//       const blackVariant = variants.find((v) => isBlackHex(v?.hex));
//       const selected = blackVariant || variants[0];

//       defaultShades[product._id] = {
//         shadeName: selected?.shadeName || selected?.size || "Default",
//         hex: selected?.hex,
//         image: selected?.image || selected?.images?.[0] || null,
//         discountedPrice: selected?.discountedPrice ?? selected?.price ?? 0,
//         originalPrice: selected?.originalPrice ?? selected?.price ?? 0,
//         variantSku: getSku(selected),
//         sku: getSku(selected),
//         stock: selected?.stock ?? 0,
//       };

//       defaultImages[product._id] =
//         selected?.image || selected?.images?.[0] || product?.images?.[0] || null;
//     });

//     setSelectedShades(defaultShades);
//     setSelectedImages(defaultImages);
//   }, [brandData]);

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   // Filtered & Sorted Products (No Pagination)
//   const displayedProducts = useMemo(() => {
//     if (!brandData?.products) return [];

//     const hasStock = (product) =>
//       product.variants?.some((v) => v.stock > 0) || product.stock > 0;

//     const passesBrandFilter = (product) => {
//       if (!filters.brand) return true;
//       const productBrandId = product.brand?._id || product.brand;
//       return String(productBrandId) === String(filters.brand);
//     };

//     const passesCategoryFilter = (product) => {
//       if (!filters.category) return true;
//       const productCategories = [];
//       if (product.category) {
//         productCategories.push(product.category._id || product.category.slug || product.category.name);
//       }
//       if (Array.isArray(product.categories)) {
//         product.categories.forEach((c) => productCategories.push(c._id || c.slug || c.name));
//       }
//       return productCategories.some((c) => String(c) === String(filters.category));
//     };

//     const passesSkinTypeFilter = (product) => {
//       if (!filters.skinType) return true;
//       const skinTypeIds = [];
//       if (product.skinType) skinTypeIds.push(product.skinType._id || product.skinType);
//       if (Array.isArray(product.skinTypes)) {
//         product.skinTypes.forEach((s) => skinTypeIds.push(s._id || s.slug || s.name));
//       }
//       return skinTypeIds.some((id) => String(id) === String(filters.skinType));
//     };

//     const passesFormulationFilter = (product) => {
//       if (!filters.formulation) return true;
//       const formulationId = product.formulation?._id || product.formulation;
//       return String(formulationId) === String(filters.formulation);
//     };

//     const passesPriceFilter = (product) => {
//       if (!filters.priceRange) return true;
//       const variant = product.variants?.[0] || {};
//       const price = variant.discountedPrice || variant.displayPrice || product.price || 0;
//       if (filters.priceRange.max === null) return price >= filters.priceRange.min;
//       return price >= filters.priceRange.min && price <= filters.priceRange.max;
//     };

//     const passesRatingFilter = (product) => {
//       if (!filters.minRating) return true;
//       return (product.avgRating || 0) >= parseFloat(filters.minRating);
//     };

//     const sortByDiscount = (a, b) => {
//       if (!filters.discountSort) return 0;
//       const getDiscount = (prod) => {
//         const variant = prod.variants?.[0] || {};
//         const original = variant.originalPrice || prod.mrp || prod.price || 0;
//         const discounted = variant.discountedPrice || variant.displayPrice || prod.price || 0;
//         return original - discounted;
//       };

//       const discountA = getDiscount(a);
//       const discountB = getDiscount(b);

//       if (filters.discountSort === "high") {
//         return discountB - discountA;
//       } else {
//         return discountA - discountB;
//       }
//     };

//     return brandData.products
//       .filter((product) =>
//         hasStock(product) &&
//         passesBrandFilter(product) &&
//         passesCategoryFilter(product) &&
//         passesSkinTypeFilter(product) &&
//         passesFormulationFilter(product) &&
//         passesPriceFilter(product) &&
//         passesRatingFilter(product)
//       )
//       .sort(sortByDiscount);
//   }, [brandData?.products, filters]);

//   const handleVariantSelect = (productId, variant) => {
//     if ((variant.stock ?? 0) <= 0) {
//       toast.warning(`${getVariantDisplayText(variant)} is out of stock`);
//       return;
//     }

//     const newSelectedShade = {
//       shadeName: variant.shadeName || variant.size || "Default",
//       hex: variant.hex,
//       image: variant.image || variant.images?.[0] || null,
//       discountedPrice: variant.discountedPrice ?? variant.price ?? 0,
//       originalPrice: variant.originalPrice ?? variant.price ?? 0,
//       stock: variant.stock ?? 0,
//       variantSku: getSku(variant),
//       sku: getSku(variant),
//     };

//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: newSelectedShade,
//     }));

//     if (variant.image || variant.images?.[0]) {
//       setSelectedImages((prev) => ({
//         ...prev,
//         [productId]: variant.image || variant.images[0],
//       }));
//     }
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
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       let isLoggedIn = false;
//       try {
//         await axios.get("https://beauty.joyory.com/api/user/profile", { withCredentials: true });
//         isLoggedIn = true;
//       } catch { }

//       const variants = prod.variants || [];
//       let variantToAdd = selectedShades[prod._id];

//       if (variants.length > 0) {
//         if (!variantToAdd || (variantToAdd.stock ?? 0) <= 0) {
//           toast.warning("Please select an in-stock variant.");
//           return;
//         }
//         const matched = variants.find((v) => getSku(v) === variantToAdd.variantSku);
//         variantToAdd = matched || variantToAdd;
//       } else {
//         if (prod.stock <= 0) {
//           toast.warning("Product is out of stock.");
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

//       const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//       cache[prod._id] = variantToAdd;
//       localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));

//       if (isLoggedIn) {
//         await addToCart(prod, variantToAdd);
//         toast.success("Product added to cart!");
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
//         toast.success("Added to cart as guest!");
//       }
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       toast.error("Failed to add product.");
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

//   const getBrandName = (product) => {
//     if (!product?.brand) return "Unknown Brand";
//     if (typeof product.brand === "object" && product.brand.name) return product.brand.name;
//     if (typeof product.brand === "string") return product.brand;
//     return "Unknown Brand";
//   };

//   const renderProductCard = (product) => {
//     const variants = product.variants || [];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;

//     const selShade = selectedShades[product._id];
//     const selectedVariant = selShade
//       ? variants.find((v) => getSku(v) === selShade.variantSku) || { ...selShade }
//       : variants[0] || {};

//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     // Check wishlist status for current variant
//     const selectedSku = getSku(selectedVariant);
//     const isProductInWishlist = isInWishlist(product._id, selectedSku);

//     return (
//       <div key={product._id} className="col-6 col-md-4 col-lg-4 position-relative">
//         {/* Wishlist Heart - Fixed */}
//         <button
//           onClick={() => {
//             if (selectedVariant) {
//               toggleWishlist(product, selectedVariant);
//             }
//           }}
//           disabled={wishlistLoading[product._id]}
//           style={{
//             position: "absolute",
//             top: "8px",
//             right: "8px",
//             cursor: wishlistLoading[product._id] ? "not-allowed" : "pointer",
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
//           {wishlistLoading[product._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status"></div>
//           ) : isProductInWishlist ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <div className="h-100">
//           {/* <Link to={`/product/${product._id}`} className="text-decoration-none">
//             <img
//               src={selectedImages[product._id] || selectedVariant?.image || product.images?.[0] || "/placeholder.png"}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: "200px", objectFit: "contain" }}
//             />
//           </Link> */}

//           <Link
//             to={`/product/${product.slugs?.[0] || product._id}`}
//             className="text-decoration-none"
//           >
//             <img
//               src={selectedImages[product._id] || selectedVariant?.image || product.images?.[0] || "/placeholder.png"}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: "200px", objectFit: "contain" }}
//             />
//           </Link>

//           <div className="d-flex flex-column p-0 m-0" style={{ height: "320px" }}>
//             <div className="brand-name text-muted small mb-1 fw-medium">
//               {getBrandName(product)}
//             </div>

//             {/* <h5
//               className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${product._id}`)}
//             >
//               {product.name}
//               {selectedVariant.shadeName && (
//                 <div className="text-black fw-normal fs-6" style={{ marginTop: "-2px" }}>
//                   {getVariantDisplayText(selectedVariant)}
//                 </div>
//               )}
//             </h5> */}

//             <h5
//               className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${product.slugs?.[0] || product._id}`)}
//             >
//               {product.name}
//               {selectedVariant.shadeName && (
//                 <div className="text-black fw-normal fs-6" style={{ marginTop: "-2px" }}>
//                   {getVariantDisplayText(selectedVariant)}
//                 </div>
//               )}
//             </h5>

//             <div className="d-flex align-items-center mt-1 mb-2">
//               {renderStars(product.avgRating || 0)}
//               <span className="ms-2 text-muted small">({product.totalRatings || 0})</span>
//             </div>

//             {variants.length > 0 && (
//               <div className="variant-section mt-2">
//                 {grouped.color.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2 mb-2">
//                     {initialColors.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className="color-circle"
//                           style={{
//                             width: "28px",
//                             height: "28px",
//                             borderRadius: "20%",
//                             backgroundColor: v.hex || "#ccc",
//                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             position: "relative",
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {isSelected && (
//                             <span style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}>✓</span>
//                           )}
//                         </div>
//                       );
//                     })}
//                     {grouped.color.length > 4 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "color")}
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

//                 {grouped.text.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2">
//                     {initialText.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;

//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className={`variant-text page-title-main-name ${isSelected ? "selected" : ""}`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                             background: isSelected ? "#000" : "#fff",
//                             color: isSelected ? "#fff" : "#000",
//                             fontSize: "13px",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             textTransform: 'lowercase'
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {getVariantDisplayText(v)}
//                         </div>
//                       );
//                     })}
//                     {grouped.text.length > 2 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "text")}
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

//             <p className="fw-bold mb-3 mt-3 page-title-main-name" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price =
//                   selectedVariant?.displayPrice ||
//                   selectedVariant?.discountedPrice ||
//                   product.price ||
//                   0;
//                 const original =
//                   selectedVariant?.originalPrice ||
//                   selectedVariant?.mrp ||
//                   product.mrp ||
//                   price;
//                 const hasDiscount = original > price;
//                 const percent = hasDiscount
//                   ? Math.round(((original - price) / original) * 100)
//                   : 0;
//                 return hasDiscount ? (
//                   <>
//                     ₹{price}
//                     <span style={{ textDecoration: "line-through", color: "#888", marginLeft: "8px" }}>
//                       ₹{original}
//                     </span>
//                     <span style={{ color: "#e53e3e", marginLeft: "8px", fontWeight: "600" }}>
//                       ({percent}% OFF)
//                     </span>
//                   </>
//                 ) : (
//                   <>₹{original}</>
//                 );
//               })()}
//             </p>

//             <div className="mt-auto">
//               <button
//                 className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${addingToCart[product._id] ? "bg-black text-white" : ""
//                   }`}
//                 onClick={() => handleAddToCart(product)}
//                 disabled={addingToCart[product._id] || (selectedVariant.stock ?? 0) <= 0}
//                 style={{ transition: "all 0.3s ease" }}
//               >
//                 {addingToCart[product._id] ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Adding...
//                   </>
//                 ) : (selectedVariant.stock ?? 0) <= 0 ? (
//                   "Out of Stock"
//                 ) : (
//                   <>
//                     Add to Cart
//                     <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Variant Overlay */}
//           {showVariantOverlay === product._id && (
//             <div className="variant-overlay" onClick={closeVariantOverlay}>
//               <div
//                 className="variant-overlay-content"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: "90%",
//                   maxWidth: "500px",
//                   maxHeight: "80vh",
//                   background: "#fff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom page-title-main-name">
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
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("all")}
//                   >
//                     All ({totalVariants})
//                   </button>
//                   {grouped.color.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("color")}
//                     >
//                       Colors ({grouped.color.length})
//                     </button>
//                   )}
//                   {grouped.text.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("text")}
//                     >
//                       Sizes ({grouped.text.length})
//                     </button>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                   {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;

//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{
//                                 cursor: isOutOfStock ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(product._id, v),
//                                   closeVariantOverlay())
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
//                               <div className="small fs-10 page-title-main-name">
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

//                   {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;

//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{
//                                 cursor: isOutOfStock ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(product._id, v),
//                                   closeVariantOverlay())
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
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status"></div>
//         <p className="mt-2">Loading brand data...</p>
//       </div>
//     );
//   }

//   if (error || !brandData) {
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger fs-5">{error || "Brand not found."}</p>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//           <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Go to Home</button>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {brandData.brand?.banner && (
//         <div className="brand-banner-section mb-5">
//           <div className="container-fluid px-0">
//             <img src={brandData.brand.banner} alt={`${brandData.brand.name} Banner`} className="w-100" style={{ height: "auto", objectFit: "cover" }} />
//           </div>
//         </div>
//       )}

//       <div className="container py-5">
//         <div className="row mb-5">
//           {brandData.categories?.length > 0 && (
//             <div className="mb-4 category-slider-wrapper">
//               <h5 className="fw-bold text-primary mb-3 page-title-main-name">Shop by Categories</h5>
//               <Slider dots={false} infinite={false} speed={400} slidesToShow={Math.min(5, brandData.categories.length)} slidesToScroll={2} arrows={true}>
//                 {brandData.categories.map((cat) => {
//                   const isSelected = filters.category && (String(filters.category) === String(cat._id));
//                   return (
//                     <div key={cat._id} className="category-card text-center p-3" onClick={() => setFilters({ ...filters, category: isSelected ? "" : cat._id })} style={{ cursor: "pointer", borderRadius: 12, backgroundColor: isSelected ? "#e6f0ff" : "#fff" }}>
//                       <div style={{ fontSize: 24, color: "#365798", marginBottom: 8 }}><i className="bi bi-tag"></i></div>
//                       <p className="mb-0 fw-bold text-dark page-title-main-name">{cat.name}</p>
//                     </div>
//                   );
//                 })}
//               </Slider>
//             </div>
//           )}

//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="brand" />
//           </div>

//           <div className="d-lg-none mb-3">
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowFilterOffcanvas(true)} style={{ gap: "12px" }}>
//                       <img src={filtering} alt="Filter" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowSortOffcanvas(true)} style={{ gap: "12px" }}>
//                       <img src={updownarrow} alt="Sort" style={{ width: "25px" }} />
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

//           {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,0.2)" }}>
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
//                     products={brandData?.products || []}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     currentPage="brand"
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,0.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowSortOffcanvas(false)}></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={!filters.discountSort} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Relevance</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "high"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "high" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Highest Discount First</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "low"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "low" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <h4 className="fw-bold mb-0 page-title-main-name">
//                 Products
//                 <span className="text-muted fs-6 ms-2">
//                   (Showing all {displayedProducts.length} products)
//                 </span>
//               </h4>
//               {Object.values(filters).some(val => val !== "" && val !== null) && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={() => setFilters({ brand: "", category: "", skinType: "", formulation: "", priceRange: null, minRating: "", discountSort: "" })}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {displayedProducts.length > 0 ? displayedProducts.map(renderProductCard) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default BrandPage;

// import React, { useEffect, useState, useContext, useMemo, useRef, useCallback } from "react";
// import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/Brandspage.css";
// import Slider from "react-slick";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BrandFilter from "./BrandFilter";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || 'default'}`;
// const isBlackHex = (hex) => {
//   if (!hex) return false;
//   const cleaned = String(hex).toLowerCase().replace(/\s/g, "").replace("#", "");
//   return cleaned === "000000" || cleaned === "000" || cleaned === "black";
// };
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

// const BrandPage = () => {
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   const [brandData, setBrandData] = useState({ products: [] });
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShades, setSelectedShades] = useState({});
//   const [selectedImages, setSelectedImages] = useState({});

//   // WISHLIST STATES
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

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

//   const loaderRef = useRef(null);

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
//       toast.warn("Please select a variant first");
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
//           toast.success("Removed from wishlist!");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku: sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       } else {
//         const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
//         if (currentlyInWishlist) {
//           const updatedWishlist = guestWishlist.filter(item =>
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem("guestWishlist", JSON.stringify(updatedWishlist));
//           toast.success("Removed from wishlist!");
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
//           toast.success("Added to wishlist!");
//         }
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

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);
//   // ===================== END WISHLIST FUNCTIONS =====================

//   // Build query parameters with cursor support
//   const buildQueryParams = (cursor = null) => {
//     const params = new URLSearchParams();

//     if (filters.category) params.append('categoryIds', filters.category);
//     if (filters.skinType) params.append('skinTypes', filters.skinType);
//     if (filters.formulation) params.append('formulations', filters.formulation);
//     if (filters.minRating) params.append('minRating', filters.minRating);

//     if (filters.priceRange) {
//       params.append('minPrice', filters.priceRange.min);
//       if (filters.priceRange.max !== null) {
//         params.append('maxPrice', filters.priceRange.max);
//       }
//     }

//     if (filters.discountSort === 'high') {
//       params.append('sort', 'priceHighToLow');
//     } else if (filters.discountSort === 'low') {
//       params.append('sort', 'priceLowToHigh');
//     } else {
//       params.append('sort', 'recent');
//     }

//     if (cursor) params.append('cursor', cursor);
//     params.append('limit', 9);

//     return params.toString();
//   };

//   // Fetch brand products with cursor pagination
//   const fetchBrandProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setHasMore(true);
//         setNextCursor(null);
//       } else {
//         setLoadingMore(true);
//       }

//       const params = buildQueryParams(cursor);
//       const url = `https://beauty.joyory.com/api/user/brands/${brandSlug}${params ? `?${params}` : ''}`;

//       const response = await axios.get(url);

//       const newProducts = response.data.products || [];
//       const pagination = response.data.pagination || {};

//       if (reset) {
//         setBrandData(response.data);
//       } else {
//         setBrandData(prev => ({
//           ...prev,
//           products: [...(prev.products || []), ...newProducts]
//         }));
//       }

//       setHasMore(pagination.hasMore ?? false);
//       setNextCursor(pagination.nextCursor ?? null);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching brand data:", error);
//       setError(error.response?.data?.message || "Failed to load brand");
//       toast.error("Failed to load brand. Please try again later.");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Initial fetch + refetch on filter/brand change
//   useEffect(() => {
//     if (brandSlug) {
//       fetchBrandProducts(null, true);
//     }
//   }, [brandSlug, filters]);

//   // Load more products
//   const loadMoreProducts = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) {
//       fetchBrandProducts(nextCursor);
//     }
//   }, [nextCursor, hasMore, loadingMore]);

//   // Intersection Observer for infinite scroll
//   useEffect(() => {
//     if (!loaderRef.current || !hasMore || loadingMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           loadMoreProducts();
//         }
//       },
//       { rootMargin: "100px", threshold: 0.1 }
//     );

//     observer.observe(loaderRef.current);

//     return () => observer.disconnect();
//   }, [loadMoreProducts, hasMore, loadingMore]);

//   // Fallback scroll listener
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

//   // Fetch filter data (static)
//   useEffect(() => {
//     const fetchFilterData = async () => {
//       try {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/products/filters"
//         );
//         setFilterData(res.data);
//       } catch (err) {
//         console.error("Error fetching filter data:", err);
//       }
//     };
//     fetchFilterData();
//   }, []);

//   // Default variant & image setup
//   useEffect(() => {
//     if (!brandData?.products) return;
//     const defaultShades = {};
//     const defaultImages = {};
//     brandData.products.forEach((product) => {
//       const variants = product.variants || [];
//       if (variants.length === 0) return;
//       const blackVariant = variants.find((v) => isBlackHex(v?.hex));
//       const selected = blackVariant || variants[0];
//       defaultShades[product._id] = {
//         shadeName: selected?.shadeName || selected?.size || "Default",
//         hex: selected?.hex,
//         image: selected?.image || selected?.images?.[0] || null,
//         discountedPrice: selected?.discountedPrice ?? selected?.price ?? 0,
//         originalPrice: selected?.originalPrice ?? selected?.price ?? 0,
//         variantSku: getSku(selected),
//         sku: getSku(selected),
//         stock: selected?.stock ?? 0,
//       };
//       defaultImages[product._id] =
//         selected?.image || selected?.images?.[0] || product?.images?.[0] || null;
//     });
//     setSelectedShades(defaultShades);
//     setSelectedImages(defaultImages);
//   }, [brandData?.products]);

//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   // Products to display (now directly from paginated brandData.products - all filtering/sorting is server-side)
//   const displayedProducts = brandData?.products || [];

//   const handleVariantSelect = (productId, variant) => {
//     if ((variant.stock ?? 0) <= 0) {
//       toast.warning(`${getVariantDisplayText(variant)} is out of stock`);
//       return;
//     }
//     const newSelectedShade = {
//       shadeName: variant.shadeName || variant.size || "Default",
//       hex: variant.hex,
//       image: variant.image || variant.images?.[0] || null,
//       discountedPrice: variant.discountedPrice ?? variant.price ?? 0,
//       originalPrice: variant.originalPrice ?? variant.price ?? 0,
//       stock: variant.stock ?? 0,
//       variantSku: getSku(variant),
//       sku: getSku(variant),
//     };
//     setSelectedShades((prev) => ({
//       ...prev,
//       [productId]: newSelectedShade,
//     }));
//     if (variant.image || variant.images?.[0]) {
//       setSelectedImages((prev) => ({
//         ...prev,
//         [productId]: variant.image || variant.images[0],
//       }));
//     }
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
//     setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
//     try {
//       const variants = Array.isArray(prod.variants) ? prod.variants : [];
//       const hasVariants = variants.length > 0;
//       let payload;
//       if (hasVariants) {
//         const selectedVariant = selectedShades[prod._id];
//         if (!selectedVariant || selectedVariant.stock <= 0) {
//           toast.warning("Please select an in-stock variant.");
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
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[prod._id] = selectedVariant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         if (prod.stock <= 0) {
//           toast.warning("Product is out of stock.");
//           return;
//         }
//         payload = {
//           productId: prod._id,
//           quantity: 1,
//         };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }
//       const response = await axios.post(
//         `${CART_API_BASE}/add`,
//         payload,
//         { withCredentials: true }
//       );
//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to add to cart");
//       }
//       toast.success("Product added to cart!");
//       navigate("/cartpage");
//     } catch (err) {
//       console.error("Add to Cart error:", err);
//       const msg = err.response?.data?.message || err.message || "Failed to add product to cart";
//       toast.error(msg);
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

//   const renderProductCard = (product) => {
//     const variants = product.variants || [];
//     const grouped = groupVariantsByType(variants);
//     const totalVariants = variants.length;
//     const selShade = selectedShades[product._id];
//     const selectedVariant = selShade
//       ? variants.find((v) => getSku(v) === selShade.variantSku) || { ...selShade }
//       : variants[0] || {};
//     const initialColors = grouped.color.slice(0, 4);
//     const initialText = grouped.text.slice(0, 2);

//     const selectedSku = getSku(selectedVariant);
//     const isProductInWishlist = isInWishlist(product._id, selectedSku);

//     const isAdding = addingToCart[product._id];
//     const hasVariants = variants.length > 0;
//     const noVariantSelected = hasVariants && !selectedVariant;
//     const outOfStock = hasVariants
//       ? (selectedVariant?.stock <= 0)
//       : (product.stock <= 0);
//     const buttonDisabled = isAdding || noVariantSelected || outOfStock;
//     const buttonText = isAdding
//       ? "Adding..."
//       : noVariantSelected
//         ? "Select Variant"
//         : outOfStock
//           ? "Out of Stock"
//           : "Add to Cart";

//     return (
//       <div key={product._id} className="col-6 col-md-4 col-lg-4 position-relative">
//         <button
//           onClick={() => {
//             if (selectedVariant || variants.length === 0) {
//               toggleWishlist(product, selectedVariant || {});
//             }
//           }}
//           disabled={wishlistLoading[product._id]}
//           style={{
//             position: "absolute",
//             top: "8px",
//             right: "8px",
//             cursor: wishlistLoading[product._id] ? "not-allowed" : "pointer",
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
//           {wishlistLoading[product._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status"></div>
//           ) : isProductInWishlist ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>
//         <div className="h-100">
//           <Link
//             to={`/product/${product.slugs?.[0] || product._id}`}
//             className="text-decoration-none"
//           >
//             <img
//               src={selectedImages[product._id] || selectedVariant?.image || product.images?.[0] || "/placeholder.png"}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: "200px", objectFit: "contain" }}
//             />
//           </Link>
//           <div className="d-flex flex-column p-0 m-0" style={{ height: "320px" }}>
//             <div className="brand-name text-muted small mb-1 fw-medium">
//               {getBrandName(product)}
//             </div>
//             <h5
//               className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${product.slugs?.[0] || product._id}`)}
//             >
//               {product.name}
//               {selectedVariant.shadeName && (
//                 <div className="text-black fw-normal fs-6" style={{ marginTop: "-2px" }}>
//                   {getVariantDisplayText(selectedVariant)}
//                 </div>
//               )}
//             </h5>
//             <div className="d-flex align-items-center mt-1 mb-2">
//               {renderStars(product.avgRating || 0)}
//               <span className="ms-2 text-muted small">({product.totalRatings || 0})</span>
//             </div>
//             {variants.length > 0 && (
//               <div className="variant-section mt-2">
//                 {grouped.color.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2 mb-2">
//                     {initialColors.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className="color-circle"
//                           style={{
//                             width: "28px",
//                             height: "28px",
//                             borderRadius: "20%",
//                             backgroundColor: v.hex || "#ccc",
//                             border: isSelected ? "3px solid #000" : "1px solid #ddd",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             position: "relative",
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {isSelected && (
//                             <span style={{
//                               position: "absolute",
//                               top: "50%",
//                               left: "50%",
//                               transform: "translate(-50%, -50%)",
//                               color: "#fff",
//                               fontSize: "14px",
//                               fontWeight: "bold",
//                             }}>✓</span>
//                           )}
//                         </div>
//                       );
//                     })}
//                     {grouped.color.length > 4 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "color")}
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
//                 {grouped.text.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2">
//                     {initialText.map((v) => {
//                       const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                       const isOutOfStock = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className={`variant-text page-title-main-name ${isSelected ? "selected" : ""}`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: "6px",
//                             border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                             background: isSelected ? "#000" : "#fff",
//                             color: isSelected ? "#fff" : "#000",
//                             fontSize: "13px",
//                             cursor: isOutOfStock ? "not-allowed" : "pointer",
//                             opacity: isOutOfStock ? 0.5 : 1,
//                             textTransform: 'lowercase'
//                           }}
//                           onClick={() => !isOutOfStock && handleVariantSelect(product._id, v)}
//                         >
//                           {getVariantDisplayText(v)}
//                         </div>
//                       );
//                     })}
//                     {grouped.text.length > 2 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "text")}
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
//             <p className="fw-bold mb-3 mt-3 page-title-main-name" style={{ fontSize: "16px" }}>
//               {(() => {
//                 const price =
//                   selectedVariant?.displayPrice ||
//                   selectedVariant?.discountedPrice ||
//                   product.price ||
//                   0;
//                 const original =
//                   selectedVariant?.originalPrice ||
//                   selectedVariant?.mrp ||
//                   product.mrp ||
//                   price;
//                 const hasDiscount = original > price;
//                 const percent = hasDiscount
//                   ? Math.round(((original - price) / original) * 100)
//                   : 0;
//                 return hasDiscount ? (
//                   <>
//                     ₹{price}
//                     <span style={{ textDecoration: "line-through", color: "#888", marginLeft: "8px" }}>
//                       ₹{original}
//                     </span>
//                     <span style={{ color: "#e53e3e", marginLeft: "8px", fontWeight: "600" }}>
//                       ({percent}% OFF)
//                     </span>
//                   </>
//                 ) : (
//                   <>₹{original}</>
//                 );
//               })()}
//             </p>
//             <div className="mt-auto">
//               <button
//                 className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
//                 onClick={() => handleAddToCart(product)}
//                 disabled={buttonDisabled}
//                 style={{
//                   transition: "background-color 0.3s ease, color 0.3s ease",
//                 }}
//               >
//                 {isAdding ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {buttonText}
//                     {!buttonDisabled && !isAdding && (
//                       <img src={Bag} alt="Bag" style={{ height: "20px" }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Variant Overlay */}
//           {showVariantOverlay === product._id && (
//             <div className="variant-overlay" onClick={closeVariantOverlay}>
//               <div
//                 className="variant-overlay-content"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: "90%",
//                   maxWidth: "500px",
//                   maxHeight: "80vh",
//                   background: "#fff",
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom page-title-main-name">
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
//                 <div className="variant-tabs d-flex">
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("all")}
//                   >
//                     All ({totalVariants})
//                   </button>
//                   {grouped.color.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("color")}
//                     >
//                       Colors ({grouped.color.length})
//                     </button>
//                   )}
//                   {grouped.text.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("text")}
//                     >
//                       Sizes ({grouped.text.length})
//                     </button>
//                   )}
//                 </div>
//                 <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                   {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                     <div className="row row-cols-4 g-3 mb-4">
//                       {grouped.color.map((v) => {
//                         const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;
//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{
//                                 cursor: isOutOfStock ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(product._id, v),
//                                   closeVariantOverlay())
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
//                               <div className="small fs-10 page-title-main-name">
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
//                   {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                     <div className="row row-cols-3 g-3">
//                       {grouped.text.map((v) => {
//                         const isSelected = selectedShades[product._id]?.variantSku === getSku(v);
//                         const isOutOfStock = (v.stock ?? 0) <= 0;
//                         return (
//                           <div className="col" key={getSku(v) || v._id}>
//                             <div
//                               className="text-center"
//                               style={{
//                                 cursor: isOutOfStock ? "not-allowed" : "pointer",
//                               }}
//                               onClick={() =>
//                                 !isOutOfStock &&
//                                 (handleVariantSelect(product._id, v),
//                                   closeVariantOverlay())
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
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status"></div>
//         <p className="mt-2">Loading brand data...</p>
//       </div>
//     );
//   }

//   if (error || !brandData?.brand) {
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger fs-5">{error || "Brand not found."}</p>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//           <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Go to Home</button>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {brandData.banner && (
//         <div className="brand-banner-section mb-5">
//           <div className="container-fluid px-0">
//             <img src={brandData.banner} alt={`${brandData.brand.name} Banner`} className="w-100" style={{ height: "auto", objectFit: "cover" }} />
//           </div>
//         </div>
//       )}

//       <div className="container py-5">
//         <div className="row mb-5">
//           {brandData.categories?.length > 0 && (
//             <div className="mb-4 category-slider-wrapper">
//               <h5 className="fw-bold text-primary mb-3 page-title-main-name">Shop by Categories</h5>
//               <Slider dots={false} infinite={false} speed={400} slidesToShow={Math.min(5, brandData.categories.length)} slidesToScroll={2} arrows={true}>
//                 {brandData.categories.map((cat) => {
//                   const isSelected = filters.category && (String(filters.category) === String(cat._id));
//                   return (
//                     <div key={cat._id} className="category-card text-center p-3" onClick={() => setFilters({ ...filters, category: isSelected ? "" : cat._id })} style={{ cursor: "pointer", borderRadius: 12, backgroundColor: isSelected ? "#e6f0ff" : "#fff" }}>
//                       <div style={{ fontSize: 24, color: "#365798", marginBottom: 8 }}><i className="bi bi-tag"></i></div>
//                       <p className="mb-0 fw-bold text-dark page-title-main-name">{cat.name}</p>
//                     </div>
//                   );
//                 })}
//               </Slider>
//             </div>
//           )}

//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="brand" />
//           </div>

//           <div className="d-lg-none mb-3">
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowFilterOffcanvas(true)} style={{ gap: "12px" }}>
//                       <img src={filtering} alt="Filter" style={{ width: "25px" }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3" onClick={() => setShowSortOffcanvas(true)} style={{ gap: "12px" }}>
//                       <img src={updownarrow} alt="Sort" style={{ width: "25px" }} />
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

//           {/* Filter & Sort Offcanvas (unchanged) */}
//           {showFilterOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,0.2)" }}>
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
//                     products={brandData?.products || []}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     currentPage="brand"
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)}></div>
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white" style={{ zIndex: 1050, borderTopLeftRadius: "16px", borderTopRightRadius: "16px", maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,0.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} onClick={() => setShowSortOffcanvas(false)}></button>
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: "5px", width: "50px", borderRadius: "3px" }}></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={!filters.discountSort} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Relevance</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "high"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "high" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Highest Discount First</span>
//                     </label>
//                     <label className="list-group-item py-3 d-flex align-items-center">
//                       <input className="form-check-input me-3" type="radio" name="sort" checked={filters.discountSort === "low"} onChange={() => { setFilters(prev => ({ ...prev, discountSort: "low" })); setShowSortOffcanvas(false); }} />
//                       <span className="page-title-main-name">Lowest Discount First</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 Showing {displayedProducts.length} products
//                 {hasMore && " (Scroll for more)"}
//               </span>
//               {Object.values(filters).some(val => val !== "" && val !== null && val !== false) && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={() => setFilters({
//                   brand: "",
//                   category: "",
//                   skinType: "",
//                   formulation: "",
//                   priceRange: null,
//                   minRating: "",
//                   discountSort: "",
//                 })}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {displayedProducts.length > 0 ? displayedProducts.map(renderProductCard) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               )}
//             </div>

//             {/* Loading more spinner */}
//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             {/* Observer target */}
//             <div ref={loaderRef} style={{ height: "20px" }} />

//             {/* End of results */}
//             {!hasMore && displayedProducts.length > 0 && (
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

// export default BrandPage;

// /*  BrandPage  –  Cursor infinite-scroll edition  */
// import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
// import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/Brandspage.css";
// import Slider from "react-slick";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BrandFilter from "./BrandFilter";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";

// /* ---------- helpers ---------- */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;
// const isBlackHex = (hex) => {
//   if (!hex) return false;
//   const c = String(hex).toLowerCase().replace(/\s|#/g, "");
//   return c === "000000" || c === "000" || c === "black";
// };
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

// /* =============================================================== */
// export default function BrandPage() {
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   const [brandData, setBrandData] = useState({ products: [] });
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedShades, setSelectedShades] = useState({});
//   const [selectedImages, setSelectedImages] = useState({});

//   // wishlist
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

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

//   const loaderRef = useRef(null);

//   /* ===================== WISHLIST ===================== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(
//           local.map((it) => ({
//             productId: it._id,
//             _id: it._id,
//             sku: it.sku,
//             name: it.name,
//             variant: it.variantName,
//             image: it.image,
//             displayPrice: it.displayPrice,
//             originalPrice: it.originalPrice,
//             discountPercent: it.discountPercent,
//             status: it.status,
//             avgRating: it.avgRating,
//             totalRatings: it.totalRatings,
//           }))
//         );
//       }
//     } catch (e) {
//       console.error(e);
//       setWishlistData([]);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) return toast.warn("Select a variant first");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${pid}`,
//             { withCredentials: true, data: { sku } }
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${pid}`,
//             { sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       } else {
//         const g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         if (inWl) {
//           localStorage.setItem(
//             "guestWishlist",
//             JSON.stringify(g.filter((it) => !(it._id === pid && it.sku === sku)))
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           g.push({
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: prod.slugs?.[0] || prod.slug || pid,
//             sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#ccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             discountPercent:
//               variant.originalPrice &&
//                 variant.discountedPrice &&
//                 variant.originalPrice > variant.discountedPrice
//                 ? Math.round(
//                   ((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) *
//                   100
//                 )
//                 : 0,
//           });
//           localStorage.setItem("guestWishlist", JSON.stringify(g));
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       }
//     } catch (e) {
//       if (e.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else toast.error(e.response?.data?.message || "Wishlist error");
//     } finally {
//       setWishlistLoading((p) => ({ ...p, [pid]: false }));
//     }
//   };
//   /* ===================== END WISHLIST ===================== */

//   /* ===================== PRODUCTS ===================== */
//   const buildQueryParams = (cursor = null) => {
//     const p = new URLSearchParams();
//     if (filters.category) p.append("categoryIds", filters.category);
//     if (filters.skinType) p.append("skinTypes", filters.skinType);
//     if (filters.formulation) p.append("formulations", filters.formulation);
//     if (filters.minRating) p.append("minRating", filters.minRating);
//     if (filters.priceRange) {
//       p.append("minPrice", filters.priceRange.min);
//       if (filters.priceRange.max !== null) p.append("maxPrice", filters.priceRange.max);
//     }
//     if (filters.discountSort === "high") p.append("sort", "priceHighToLow");
//     else if (filters.discountSort === "low") p.append("sort", "priceLowToHigh");
//     else p.append("sort", "recent");
//     if (cursor) p.append("cursor", cursor);
//     p.append("limit", 9);
//     return p.toString();
//   };

//   const fetchBrandProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setBrandData({ products: [] });
//         setHasMore(true);
//         setNextCursor(null);
//       } else setLoadingMore(true);

//       const params = buildQueryParams(cursor);
//       const url = `https://beauty.joyory.com/api/user/brands/${brandSlug}${params ? `?${params}` : ""}`;

//       const { data } = await axios.get(url);

//       const newProducts = data.products || [];
//       const pg = data.pagination || {};

//       if (reset) setBrandData(data);
//       else
//         setBrandData((prev) => ({
//           ...prev,
//           products: [...(prev.products || []), ...newProducts],
//         }));

//       setHasMore(pg.hasMore ?? false);
//       setNextCursor(pg.nextCursor ?? null);
//       setError(null);
//     } catch (e) {
//       console.error(e);
//       setError(e.response?.data?.message || "Failed to load brand");
//       toast.error("Failed to load brand. Please try again later.");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     if (brandSlug) fetchBrandProducts(null, true);
//   }, [brandSlug, filters]);

//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) fetchBrandProducts(nextCursor);
//   }, [nextCursor, hasMore, loadingMore]);

//   useEffect(() => {
//     if (!loaderRef.current || !hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { rootMargin: "100px", threshold: 0.1 }
//     );
//     obs.observe(loaderRef.current);
//     return () => obs.disconnect();
//   }, [loadMore, hasMore, loadingMore]);

//   useEffect(() => {
//     const onScroll = () => {
//       if (loadingMore || !hasMore) return;
//       const st = document.documentElement.scrollTop || document.body.scrollTop;
//       const sh = document.documentElement.scrollHeight || document.body.scrollHeight;
//       const ch = document.documentElement.clientHeight || window.innerHeight;
//       if (st + ch >= sh - 200) loadMore();
//     };
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, [loadMore, loadingMore, hasMore]);
//   /* ===================== END PRODUCTS ===================== */

//   /* static filter data */
//   useEffect(() => {
//     axios
//       .get("https://beauty.joyory.com/api/user/products/filters")
//       .then((r) => setFilterData(r.data))
//       .catch((e) => console.error(e));
//   }, []);

//   /* default variant / image */
//   useEffect(() => {
//     if (!brandData?.products) return;
//     const defaultShades = {};
//     const defaultImages = {};
//     brandData.products.forEach((pr) => {
//       const vars = pr.variants || [];
//       if (!vars.length) return;
//       const black = vars.find((v) => isBlackHex(v?.hex));
//       const sel = black || vars[0];
//       defaultShades[pr._id] = {
//         shadeName: sel.shadeName || sel.size || "Default",
//         hex: sel.hex,
//         image: sel.image || sel.images?.[0] || null,
//         discountedPrice: sel.discountedPrice ?? sel.price ?? 0,
//         originalPrice: sel.originalPrice ?? sel.price ?? 0,
//         stock: sel.stock ?? 0,
//         variantSku: getSku(sel),
//         sku: getSku(sel),
//       };
//       defaultImages[pr._id] = sel.image || sel.images?.[0] || pr.images?.[0] || null;
//     });
//     setSelectedShades(defaultShades);
//     setSelectedImages(defaultImages);
//   }, [brandData?.products]);

//   /* handlers */
//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   const handleVariantSelect = (pid, variant) => {
//     if ((variant.stock ?? 0) <= 0) {
//       toast.warning(`${getVariantDisplayText(variant)} is out of stock`);
//       return;
//     }
//     const newSel = {
//       shadeName: variant.shadeName || variant.size || "Default",
//       hex: variant.hex,
//       image: variant.image || variant.images?.[0] || null,
//       discountedPrice: variant.discountedPrice ?? variant.price ?? 0,
//       originalPrice: variant.originalPrice ?? variant.price ?? 0,
//       stock: variant.stock ?? 0,
//       variantSku: getSku(variant),
//       sku: getSku(variant),
//     };
//     setSelectedShades((p) => ({ ...p, [pid]: newSel }));
//     if (variant.image || variant.images?.[0])
//       setSelectedImages((p) => ({ ...p, [pid]: variant.image || variant.images[0] }));
//   };

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const handleAddToCart = async (prod) => {
//     setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//     try {
//       const vars = prod.variants || [];
//       const hasVar = vars.length > 0;
//       let payload;
//       if (hasVar) {
//         const sel = selectedShades[prod._id];
//         if (!sel || sel.stock <= 0) {
//           toast.warning("Please select an in-stock variant.");
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
//           toast.warning("Product is out of stock.");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[prod._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }
//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!data.success) throw new Error(data.message || "Cart add failed");
//       toast.success("Product added to cart!");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       toast.error(msg);
//       if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const renderStars = (r) =>
//     [...Array(5)].map((_, i) => (
//       <FaStar key={i} size={16} color={i < Math.round(r) ? "#2b6cb0" : "#ccc"} style={{ marginRight: 2 }} />
//     ));

//   const renderProductCard = (product) => {
//     const vars = product.variants || [];
//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;
//     const selShade = selectedShades[product._id];
//     const selectedVar = selShade
//       ? vars.find((v) => getSku(v) === selShade.variantSku) || { ...selShade }
//       : vars[0] || {};
//     const initCol = grouped.color.slice(0, 4);
//     const initText = grouped.text.slice(0, 2);

//     const selectedSku = getSku(selectedVar);
//     const inWl = isInWishlist(product._id, selectedSku);

//     const isAdding = addingToCart[product._id];
//     const hasVar = vars.length > 0;
//     const noVarSel = hasVar && !selectedVar;
//     const oos = hasVar ? selectedVar?.stock <= 0 : product.stock <= 0;
//     const disabled = isAdding || noVarSel || oos;
//     const btnText = isAdding
//       ? "Adding..."
//       : noVarSel
//         ? "Select Variant"
//         : oos
//           ? "Out of Stock"
//           : "Add to Cart";

//     return (
//       <div key={product._id} className="col-6 col-md-4 col-lg-4 position-relative">
//         <button
//           onClick={() => {
//             if (selectedVar || vars.length === 0) toggleWishlist(product, selectedVar || {});
//           }}
//           disabled={wishlistLoading[product._id]}
//           style={{
//             position: "absolute",
//             top: 8,
//             right: 8,
//             cursor: wishlistLoading[product._id] ? "not-allowed" : "pointer",
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
//           {wishlistLoading[product._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <div className="h-100">
//           <Link to={`/product/${product.slugs?.[0] || product._id}`} className="text-decoration-none">
//             <img
//               src={selectedImages[product._id] || selectedVar?.image || product.images?.[0] || "/placeholder.png"}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: 200, objectFit: "contain" }}
//             />
//           </Link>

//           <div className="d-flex flex-column p-0 m-0" style={{ height: 320 }}>
//             <div className="brand-name text-muted small mb-1 fw-medium">{getBrandName(product)}</div>
//             <h5
//               className="card-title mt-2 d-ruby align-items-center gap-1 page-title-main-name"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${product.slugs?.[0] || product._id}`)}
//             >
//               {product.name}
//               {selectedVar.shadeName && (
//                 <div className="text-black fw-normal fs-6 ms-1" style={{ marginTop: "-2px" }}>
//                   {getVariantDisplayText(selectedVar)}
//                 </div>
//               )}
//             </h5>

//             <div className="d-flex align-items-center mt-1 mb-2">
//               {renderStars(product.avgRating || 0)}
//               <span className="ms-2 text-muted small">({product.totalRatings || 0})</span>
//             </div>

//             {vars.length > 0 && (
//               <div className="variant-section mt-2">
//                 {grouped.color.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2 mb-2">
//                     {initCol.map((v) => {
//                       const sel = selectedShades[product._id]?.variantSku === getSku(v);
//                       const oosV = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className="color-circle"
//                           style={{
//                             width: 28,
//                             height: 28,
//                             borderRadius: "20%",
//                             backgroundColor: v.hex || "#ccc",
//                             border: sel ? "3px solid #000" : "1px solid #ddd",
//                             cursor: oosV ? "not-allowed" : "pointer",
//                             opacity: oosV ? 0.5 : 1,
//                             position: "relative",
//                           }}
//                           onClick={() => !oosV && handleVariantSelect(product._id, v)}
//                         >
//                           {sel && (
//                             <span
//                               style={{
//                                 position: "absolute",
//                                 top: "50%",
//                                 left: "50%",
//                                 transform: "translate(-50%,-50%)",
//                                 color: "#fff",
//                                 fontSize: 14,
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
//                         onClick={() => openVariantOverlay(product._id, "color")}
//                         style={{
//                           width: 28,
//                           height: 28,
//                           borderRadius: 6,
//                           background: "#f5f5f5",
//                           border: "1px solid #ddd",
//                           fontSize: 10,
//                           fontWeight: "bold",
//                         }}
//                       >
//                         +{grouped.color.length - 4}
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {grouped.text.length > 0 && (
//                   <div className="d-flex flex-wrap gap-2">
//                     {initText.map((v) => {
//                       const sel = selectedShades[product._id]?.variantSku === getSku(v);
//                       const oosV = (v.stock ?? 0) <= 0;
//                       return (
//                         <div
//                           key={getSku(v) || v._id}
//                           className={`variant-text page-title-main-name ${sel ? "selected" : ""}`}
//                           style={{
//                             padding: "6px 12px",
//                             borderRadius: 6,
//                             border: sel ? "2px solid #000" : "1px solid #ddd",
//                             background: sel ? "#000" : "#fff",
//                             color: sel ? "#fff" : "#000",
//                             fontSize: 13,
//                             cursor: oosV ? "not-allowed" : "pointer",
//                             opacity: oosV ? 0.5 : 1,
//                             textTransform: "lowercase",
//                           }}
//                           onClick={() => !oosV && handleVariantSelect(product._id, v)}
//                         >
//                           {getVariantDisplayText(v)}
//                         </div>
//                       );
//                     })}
//                     {grouped.text.length > 2 && (
//                       <button
//                         className="more-btn"
//                         onClick={() => openVariantOverlay(product._id, "text")}
//                         style={{
//                           padding: "6px 12px",
//                           borderRadius: 6,
//                           background: "#f5f5f5",
//                           border: "1px solid #ddd",
//                           fontSize: 12,
//                         }}
//                       >
//                         +{grouped.text.length - 2}
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             <p className="fw-bold mb-3 mt-3 page-title-main-name" style={{ fontSize: 16 }}>
//               {(() => {
//                 const price = selectedVar?.displayPrice || selectedVar?.discountedPrice || product.price || 0;
//                 const orig = selectedVar?.originalPrice || selectedVar?.mrp || product.mrp || price;
//                 const disc = orig > price;
//                 const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//                 return disc ? (
//                   <>
//                     ₹{price}
//                     <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                     <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//                   </>
//                 ) : (
//                   <>₹{orig}</>
//                 );
//               })()}
//             </p>

//             <div className="mt-auto">
//               <button
//                 className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""
//                   }`}
//                 onClick={() => handleAddToCart(product)}
//                 disabled={disabled}
//                 style={{ transition: "background-color .3s ease, color .3s ease" }}
//               >
//                 {isAdding ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status" />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     {btnText}
//                     {!disabled && !isAdding && <img src={Bag} alt="Bag" style={{ height: 20 }} />}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Variant Overlay */}
//           {showVariantOverlay === product._id && (
//             <div className="variant-overlay" onClick={closeVariantOverlay}>
//               <div
//                 className="variant-overlay-content"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: "90%",
//                   maxWidth: 500,
//                   maxHeight: "80vh",
//                   background: "#fff",
//                   borderRadius: 12,
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom page-title-main-name">
//                   <h5 className="m-0">Select Variant ({totalVars})</h5>
//                   <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>
//                     ×
//                   </button>
//                 </div>
//                 <div className="variant-tabs d-flex">
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""
//                       }`}
//                     onClick={() => setSelectedVariantType("all")}
//                   >
//                     All ({totalVars})
//                   </button>
//                   {grouped.color.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""
//                         }`}
//                       onClick={() => setSelectedVariantType("color")}
//                     >
//                       Colors ({grouped.color.length})
//                     </button>
//                   )}
//                   {grouped.text.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""
//                         }`}
//                       onClick={() => setSelectedVariantType("text")}
//                     >
//                       Sizes ({grouped.text.length})
//                     </button>
//                   )}
//                 </div>
//                 <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                   {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                     grouped.color.length > 0 && (
//                       <div className="row row-cols-4 g-3 mb-4">
//                         {grouped.color.map((v) => {
//                           const sel = selectedShades[product._id]?.variantSku === getSku(v);
//                           const oosV = (v.stock ?? 0) <= 0;
//                           return (
//                             <div className="col" key={getSku(v) || v._id}>
//                               <div
//                                 className="text-center"
//                                 style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                 onClick={() =>
//                                   !oosV &&
//                                   (handleVariantSelect(product._id, v), closeVariantOverlay())
//                                 }
//                               >
//                                 <div
//                                   style={{
//                                     width: 28,
//                                     height: 28,
//                                     borderRadius: "20%",
//                                     backgroundColor: v.hex || "#ccc",
//                                     margin: "0 auto 8px",
//                                     border: sel ? "3px solid #000" : "1px solid #ddd",
//                                     opacity: oosV ? 0.5 : 1,
//                                     position: "relative",
//                                   }}
//                                 >
//                                   {sel && (
//                                     <span
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         transform: "translate(-50%,-50%)",
//                                         color: "#fff",
//                                         fontWeight: "bold",
//                                       }}
//                                     >
//                                       ✓
//                                     </span>
//                                   )}
//                                 </div>
//                                 <div className="small fs-10 page-title-main-name">{getVariantDisplayText(v)}</div>
//                                 {oosV && <div className="text-danger small">Out of Stock</div>}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}

//                   {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                     grouped.text.length > 0 && (
//                       <div className="row row-cols-3 g-3">
//                         {grouped.text.map((v) => {
//                           const sel = selectedShades[product._id]?.variantSku === getSku(v);
//                           const oosV = (v.stock ?? 0) <= 0;
//                           return (
//                             <div className="col" key={getSku(v) || v._id}>
//                               <div
//                                 className="text-center"
//                                 style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                 onClick={() =>
//                                   !oosV &&
//                                   (handleVariantSelect(product._id, v), closeVariantOverlay())
//                                 }
//                               >
//                                 <div
//                                   style={{
//                                     padding: 10,
//                                     borderRadius: 8,
//                                     border: sel ? "3px solid #000" : "1px solid #ddd",
//                                     background: sel ? "#f8f9fa" : "#fff",
//                                     minHeight: 50,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     opacity: oosV ? 0.5 : 1,
//                                   }}
//                                 >
//                                   {getVariantDisplayText(v)}
//                                 </div>
//                                 {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
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
//       </div>
//     );
//   };

//   /* ---------- render ---------- */
//   if (loading)
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status" />
//         <p className="mt-2 page-title-main-name text-black">Loading brand data...</p>
//       </div>
//     );

//   if (error || !brandData?.brand)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger fs-5">{error || "Brand not found."}</p>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>
//             Go Back
//           </button>
//           <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>
//             Go to Home
//           </button>
//         </div>
//         <Footer />
//       </>
//     );

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* {brandData.banner && ( */}

//       {(brandData.banner || brandData.brand?.banner) && (

//         <div className="brand-banner-section mb-5 mt-xl-5 pt-xl-4">
//           <div className="container-fluid px-0">
//             <img
//               // src={brandData.banner}
//               src={brandData.banner || brandData.brand?.banner}
//               alt={`${brandData.brand.name} Banner`}
//               className="w-100 hero-slider-image-responsive"
//               style={{ height: "auto", objectFit: "cover" }}
//             />
//           </div>
//         </div>
//       )}

//       <div className="container py-5">
//         <div className="row mb-5">
//           {brandData.categories?.length > 0 && (
//             <div className="mb-4 category-slider-wrapper">
//               <h5 className="fw-bold text-primary mb-3 page-title-main-name">Shop by Categories</h5>
//               <Slider
//                 dots={false}
//                 infinite={false}
//                 speed={400}
//                 slidesToShow={Math.min(5, brandData.categories.length)}
//                 slidesToScroll={2}
//                 arrows
//               >
//                 {brandData.categories.map((cat) => {
//                   const isSelected = filters.category && String(filters.category) === String(cat._id);
//                   return (
//                     <div
//                       key={cat._id}
//                       className="category-card text-center p-3"
//                       onClick={() => setFilters({ ...filters, category: isSelected ? "" : cat._id })}
//                       style={{ cursor: "pointer", borderRadius: 12, backgroundColor: isSelected ? "#e6f0ff" : "#fff" }}
//                     >
//                       <div style={{ fontSize: 24, color: "#365798", marginBottom: 8 }}>
//                         <i className="bi bi-tag" />
//                       </div>
//                       <p className="mb-0 fw-bold text-dark page-title-main-name">{cat.name}</p>
//                     </div>
//                   );
//                 })}
//               </Slider>
//             </div>
//           )}

//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="brand" />
//           </div>

//           <div className="d-lg-none mb-3">
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

//           {/* Filter & Sort Offcanvas (unchanged) */}
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
//                     products={brandData?.products || []}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     currentPage="brand"
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

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
//                         checked={!filters.discountSort}
//                         onChange={() => {
//                           setFilters((p) => ({ ...p, discountSort: "" }));
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
//                           setFilters((p) => ({ ...p, discountSort: "high" }));
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
//                           setFilters((p) => ({ ...p, discountSort: "low" }));
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

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 Showing {brandData.products.length} products
//                 {hasMore && " (Scroll for more)"}
//               </span>
//               {Object.values(filters).some((v) => v !== "" && v !== null && v !== false) && (
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
//               {brandData.products.length > 0 ? (
//                 brandData.products.map(renderProductCard)
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               )}
//             </div>

//             {/* infinite-scroll spinner */}
//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             {/* sentinel element for observer */}
//             <div ref={loaderRef} style={{ height: 20 }} />

//             {/* end message */}
//             {!hasMore && brandData.products.length > 0 && (
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
// }

// /*  BrandPage  –  Unified API Edition (PRODUCT_ALL_API)  */
// import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
// import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "../css/Brandspage.css";
// import Slider from "react-slick";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BrandFilter from "./BrandFilter";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// // FIXED: Removed trailing spaces from API URLs that were causing Add to Cart to fail
// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// /* ---------- helpers ---------- */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;
// const isBlackHex = (hex) => {
//   if (!hex) return false;
//   const c = String(hex).toLowerCase().replace(/\s|#/g, "");
//   return c === "000000" || c === "000" || c === "black";
// };
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

// /* =============================================================== */
// export default function BrandPage() {
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   const [allProducts, setAllProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("Products");
//   const [bannerImage, setBannerImage] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);
//   const [error, setError] = useState(null);

//   const [addingToCart, setAddingToCart] = useState({});
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [selectedImages, setSelectedImages] = useState({});

//   // wishlist
//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

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

//   const loaderRef = useRef(null);

//   /* ===================== WISHLIST ===================== */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some(
//       (it) => (it.productId === pid || it._id === pid) && it.sku === sku
//     );
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(
//           local.map((it) => ({
//             productId: it._id,
//             _id: it._id,
//             sku: it.sku,
//             name: it.name,
//             variant: it.variantName,
//             image: it.image,
//             displayPrice: it.displayPrice,
//             originalPrice: it.originalPrice,
//             discountPercent: it.discountPercent,
//             status: it.status,
//             avgRating: it.avgRating,
//             totalRatings: it.totalRatings,
//           }))
//         );
//       }
//     } catch (e) {
//       console.error(e);
//       setWishlistData([]);
//     }
//   };

//   useEffect(() => {
//     fetchWishlistData();
//   }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!prod || !variant) return toast.warn("Select a variant first");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${pid}`,
//             { withCredentials: true, data: { sku } }
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${pid}`,
//             { sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       } else {
//         const g = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         if (inWl) {
//           localStorage.setItem(
//             "guestWishlist",
//             JSON.stringify(g.filter((it) => !(it._id === pid && it.sku === sku)))
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           g.push({
//             _id: pid,
//             name: prod.name,
//             brand: getBrandName(prod),
//             price: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             originalPrice: variant.originalPrice || variant.mrp || prod.mrp || prod.price || 0,
//             displayPrice: variant.discountedPrice || variant.displayPrice || prod.price || 0,
//             image: variant.images?.[0] || variant.image || prod.images?.[0] || "/placeholder.png",
//             slug: prod.slugs?.[0] || prod.slug || pid,
//             sku,
//             variantName: variant.shadeName || variant.name || "Default",
//             hex: variant.hex || "#ccc",
//             stock: variant.stock || 0,
//             status: variant.stock > 0 ? "inStock" : "outOfStock",
//             avgRating: prod.avgRating || 0,
//             totalRatings: prod.totalRatings || 0,
//             discountPercent:
//               variant.originalPrice &&
//                 variant.discountedPrice &&
//                 variant.originalPrice > variant.discountedPrice
//                 ? Math.round(
//                   ((variant.originalPrice - variant.discountedPrice) / variant.originalPrice) *
//                   100
//                 )
//                 : 0,
//           });
//           localStorage.setItem("guestWishlist", JSON.stringify(g));
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       }
//     } catch (e) {
//       if (e.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else toast.error(e.response?.data?.message || "Wishlist error");
//     } finally {
//       setWishlistLoading((p) => ({ ...p, [pid]: false }));
//     }
//   };

//   /* ===================== UNIFIED API FETCH LOGIC ===================== */
//   const buildQueryParams = (cursor = null) => {
//     const p = new URLSearchParams();
//     if (brandSlug) p.append("brandIds", brandSlug);
//     if (filters.category) p.append("categoryIds", filters.category);
//     if (filters.skinType) p.append("skinTypes", filters.skinType);
//     if (filters.formulation) p.append("formulations", filters.formulation);
//     if (filters.minRating) p.append("minRating", filters.minRating);
//     if (filters.priceRange) {
//       p.append("minPrice", filters.priceRange.min);
//       if (filters.priceRange.max !== null) p.append("maxPrice", filters.priceRange.max);
//     }
//     if (filters.discountSort === "high") p.append("sort", "priceHighToLow");
//     else if (filters.discountSort === "low") p.append("sort", "priceLowToHigh");
//     else p.append("sort", "recent");
//     if (cursor) p.append("cursor", cursor);
//     p.append("limit", 9);
//     return p.toString();
//   };

//   const fetchProducts = async (cursor = null, reset = false) => {
//     try {
//       if (reset) {
//         setLoading(true);
//         setAllProducts([]);
//         setNextCursor(null);
//         setHasMore(true);
//       } else setLoadingMore(true);

//       const queryStr = buildQueryParams(cursor);
//       const { data } = await axios.get(`${PRODUCT_ALL_API}?${queryStr}`, { withCredentials: true });

//       if (data.titleMessage) setPageTitle(data.titleMessage);
//       else if (data.category?.name) setPageTitle(data.category.name);
//       else if (data.promoMeta?.name) setPageTitle(data.promoMeta.name);
//       else if (data.skinType?.name) setPageTitle(data.skinType.name);
//       else if (data.brand?.name) setPageTitle(data.brand.name);

//       if (data.category?.bannerImage) setBannerImage(data.category.bannerImage);
//       else if (data.promoMeta?.bannerImage) setBannerImage(data.promoMeta.bannerImage);
//       else if (data.skinType?.bannerImage) setBannerImage(data.skinType.bannerImage);
//       else if (data.brand?.banner) setBannerImage(data.brand.banner);

//       const prods = data.products || [];
//       const pg = data.pagination || {};

//       if (reset) setAllProducts(prods);
//       else setAllProducts((prev) => [...prev, ...prods]);

//       setHasMore(pg.hasMore || false);
//       setNextCursor(pg.nextCursor || null);
//       setError(null);

//       // We DO NOT auto-select variants here anymore to ensure "Select Variant" works!

//     } catch (e) {
//       console.error(e);
//       setError(e.response?.data?.message || "Failed to load products");
//       toast.error("Failed to load products. Please try again later.");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     if (brandSlug) fetchProducts(null, true);
//   }, [brandSlug, filters]);

//   /* ===================== INFINITE SCROLL ===================== */
//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
//   }, [nextCursor, hasMore, loadingMore]);

//   useEffect(() => {
//     if (!hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { root: null, rootMargin: "100px", threshold: 0.1 }
//     );
//     const el = loaderRef.current;
//     if (el) obs.observe(el);
//     return () => el && obs.unobserve(el);
//   }, [loadMore, hasMore, loadingMore]);

//   /* static filter data */
//   useEffect(() => {
//     axios
//       .get("https://beauty.joyory.com/api/user/products/filters")
//       .then((r) => setFilterData(r.data))
//       .catch((e) => console.error(e));
//   }, []);

//   /* handlers */
//   const getCurrentSortText = () => {
//     if (filters.discountSort === "high") return "Highest Discount";
//     if (filters.discountSort === "low") return "Lowest Discount";
//     return "Relevance";
//   };

//   const handleVariantSelect = (pid, variant) => {
//     if ((variant.stock ?? 0) <= 0) {
//       toast.warning(`${getVariantDisplayText(variant)} is out of stock`);
//       return;
//     }
//     setSelectedVariants((p) => ({ ...p, [pid]: variant }));
//     if (variant.image || variant.images?.[0])
//       setSelectedImages((p) => ({ ...p, [pid]: variant.image || variant.images[0] }));
//   };

//   const openVariantOverlay = (pid, t = "all") => {
//     setSelectedVariantType(t);
//     setShowVariantOverlay(pid);
//   };
//   const closeVariantOverlay = () => {
//     setShowVariantOverlay(null);
//     setSelectedVariantType("all");
//   };

//   const handleAddToCart = async (prod) => {
//     setAddingToCart((p) => ({ ...p, [prod._id]: true }));
//     try {
//       const vars = prod.variants || [];
//       const hasVar = vars.length > 0;
//       let payload;

//       if (hasVar) {
//         const sel = selectedVariants[prod._id];
//         if (!sel || sel.stock <= 0) {
//           toast.warning("Please select an in-stock variant.");
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
//           toast.warning("Product is out of stock.");
//           return;
//         }
//         payload = { productId: prod._id, quantity: 1 };
//       }

//       const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
//       if (!data.success) throw new Error(data.message || "Cart add failed");
//       toast.success("Product added to cart!");
//       navigate("/cartpage");
//     } catch (e) {
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       toast.error(msg);
//       if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const renderStars = (r) =>
//     [...Array(5)].map((_, i) => (
//       <FaStar key={i} size={16} color={i < Math.round(r) ? "#2b6cb0" : "#ccc"} style={{ marginRight: 2 }} />
//     ));

//   /* ===================== PRODUCT CARD RENDER ========================== */
//   const renderProductCard = (product) => {
//     const vars = product.variants || [];
//     const hasVar = vars.length > 0;
//     const isVariantSelected = !!selectedVariants[product._id];

//     // For display (images/pricing) - use explicitly selected or fallback to first available
//     const displayVariant = selectedVariants[product._id] || (hasVar ? (vars.find(v => v.stock > 0) || vars[0]) : null);

//     const grouped = groupVariantsByType(vars);
//     const totalVars = vars.length;

//     const sku = displayVariant ? getSku(displayVariant) : null;
//     const inWl = sku ? isInWishlist(product._id, sku) : false;
//     const slugPr = product.slugs?.[0] || product._id;
//     const img = selectedImages[product._id] || displayVariant?.image || displayVariant?.images?.[0] || product.images?.[0] || "/placeholder.png";

//     const isAdding = addingToCart[product._id];
//     const oos = hasVar ? displayVariant?.stock <= 0 : product.stock <= 0;

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

//     return (
//       <div key={product._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name mt-5">
//         <button
//           onClick={() => {
//             if (displayVariant || !hasVar) toggleWishlist(product, displayVariant || {});
//           }}
//           disabled={wishlistLoading[product._id]}
//           style={{
//             position: "absolute",
//             top: 8,
//             right: 8,
//             cursor: wishlistLoading[product._id] ? "not-allowed" : "pointer",
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
//           {wishlistLoading[product._id] ? (
//             <div className="spinner-border spinner-border-sm" role="status" />
//           ) : inWl ? (
//             <FaHeart />
//           ) : (
//             <FaRegHeart />
//           )}
//         </button>

//         <div className="h-100">
//           <Link to={`/product/${slugPr}`} className="text-decoration-none">
//             <img
//               src={img}
//               alt={product.name}
//               className="card-img-top"
//               style={{ height: 200, objectFit: "contain" }}
//             />
//           </Link>

//           <div className="d-flex flex-column p-0 m-0" style={{ height: "auto" }}>
//             <div className="brand-name text-muted small mb-1 fw-medium text-start mt-3">{getBrandName(product)}</div>
//             <h5
//               className="card-title mt-2 d-ruby align-items-center gap-1 page-title-main-name"
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate(`/product/${slugPr}`)}
//             >
//               {product.name}
//             </h5>

//             {/* <div className="d-flex align-items-center mt-1 mb-2">
//               {renderStars(product.avgRating || 0)}
//               <span className="ms-2 text-muted small">({product.totalRatings || 0})</span>
//             </div> */}

//             {/* Minimal Variant Display Instead of Colored Bubbles */}
//             {hasVar && (
//               <div className="m-0 p-0 ms-0 mt-2 mb-3" style={{height:"auto"}}>
//                 {isVariantSelected ? (
//                   <div
//                     className=" text-muted small"
//                     style={{ cursor: 'pointer', display: 'inline-block' }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(product._id, "all");
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant: <span className="fw-bold text-dark">{getVariantDisplayText(displayVariant)}</span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                   </div>
//                 ) : (
//                   <div
//                     className="small text-muted"
//                     style={{ height: '20px', cursor: 'pointer', display: 'inline-block' }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openVariantOverlay(product._id, "all");
//                     }}
//                   >
//                     {vars.length} Variants Available
//                     <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />
//                   </div>
//                 )}
//               </div>
//             )}

//             <p className="fw-bold mb-3 mt-auto page-title-main-name" style={{ fontSize: 16 }}>
//               {(() => {
//                 const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || product.price || 0;
//                 const orig = displayVariant?.originalPrice || displayVariant?.mrp || product.mrp || price;
//                 const disc = orig > price;
//                 const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//                 return disc ? (
//                   <>
//                     ₹{price}
//                     <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                     <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//                   </>
//                 ) : (
//                   <>₹{orig}</>
//                 );
//               })()}
//             </p>

//             <div className="mt-3">
//               <button
//                 className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${
//                   isAdding ? "bg-black text-white" : ""
//                 }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (showSelectVariantButton) {
//                     openVariantOverlay(product._id, "all");
//                   } else {
//                     handleAddToCart(product);
//                   }
//                 }}
//                 disabled={disabled}
//                 style={{ transition: "background-color .3s ease, color .3s ease" }}
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
//                       <img src={Bag} alt="Bag" style={{ height: 20 }} />
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Variant Overlay */}
//           {showVariantOverlay === product._id && (
//             <div className="variant-overlay" style={{zindex:"99"}} onClick={closeVariantOverlay}>
//               <div
//                 className="variant-overlay-content"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                   width: "90%",
//                   maxWidth: 500,
//                   maxHeight: "80vh",
//                   background: "#fff",
//                   borderRadius: 12,
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom page-title-main-name">
//                   <h5 className="m-0">Select Variant ({totalVars})</h5>
//                   <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>
//                     ×
//                   </button>
//                 </div>
//                 <div className="variant-tabs d-flex">
//                   <button
//                     className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                     onClick={() => setSelectedVariantType("all")}
//                   >
//                     All ({totalVars})
//                   </button>
//                   {grouped.color.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("color")}
//                     >
//                       Colors ({grouped.color.length})
//                     </button>
//                   )}
//                   {grouped.text.length > 0 && (
//                     <button
//                       className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "text" ? "active" : ""}`}
//                       onClick={() => setSelectedVariantType("text")}
//                     >
//                       Sizes ({grouped.text.length})
//                     </button>
//                   )}
//                 </div>
//                 <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                   {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                     grouped.color.length > 0 && (
//                       <div className="row row-cols-4 g-3 mb-4">
//                         {grouped.color.map((v) => {
//                           const sel = selectedVariants[product._id]?.sku === v.sku;
//                           const oosV = (v.stock ?? 0) <= 0;
//                           return (
//                             <div className="col" key={getSku(v) || v._id}>
//                               <div
//                                 className="text-center"
//                                 style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                 onClick={() =>
//                                   !oosV &&
//                                   (handleVariantSelect(product._id, v), closeVariantOverlay())
//                                 }
//                               >
//                                 <div
//                                   style={{
//                                     width: 28,
//                                     height: 28,
//                                     borderRadius: "20%",
//                                     backgroundColor: v.hex || "#ccc",
//                                     margin: "0 auto 8px",
//                                     border: sel ? "3px solid #000" : "1px solid #ddd",
//                                     opacity: oosV ? 0.5 : 1,
//                                     position: "relative",
//                                   }}
//                                 >
//                                   {sel && (
//                                     <span
//                                       style={{
//                                         position: "absolute",
//                                         top: "50%",
//                                         left: "50%",
//                                         transform: "translate(-50%,-50%)",
//                                         color: "#fff",
//                                         fontWeight: "bold",
//                                       }}
//                                     >
//                                       ✓
//                                     </span>
//                                   )}
//                                 </div>
//                                 <div className="small fs-10 page-title-main-name">{getVariantDisplayText(v)}</div>
//                                 {oosV && <div className="text-danger small">Out of Stock</div>}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}

//                   {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                     grouped.text.length > 0 && (
//                       <div className="row row-cols-3 g-3">
//                         {grouped.text.map((v) => {
//                           const sel = selectedVariants[product._id]?.sku === v.sku;
//                           const oosV = (v.stock ?? 0) <= 0;
//                           return (
//                             <div className="col" key={getSku(v) || v._id}>
//                               <div
//                                 className="text-center"
//                                 style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                                 onClick={() =>
//                                   !oosV &&
//                                   (handleVariantSelect(product._id, v), closeVariantOverlay())
//                                 }
//                               >
//                                 <div
//                                   style={{
//                                     padding: 10,
//                                     borderRadius: 8,
//                                     border: sel ? "3px solid #000" : "1px solid #ddd",
//                                     background: sel ? "#f8f9fa" : "#fff",
//                                     minHeight: 50,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     opacity: oosV ? 0.5 : 1,
//                                   }}
//                                 >
//                                   {getVariantDisplayText(v)}
//                                 </div>
//                                 {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
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
//       </div>
//     );
//   };

//   /* ---------- render ---------- */
//   if (loading && allProducts.length === 0)
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status" />
//         <p className="mt-2 page-title-main-name text-black">Loading brand data...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center">
//           <p className="text-danger fs-5">{error || "Brand not found."}</p>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>
//             Go Back
//           </button>
//           <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>
//             Go to Home
//           </button>
//         </div>
//         <Footer />
//       </>
//     );

//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {bannerImage && (
//         <div className="brand-banner-section mb-5 mt-xl-5 pt-xl-4">
//           <div className="container-fluid px-0">
//             <img
//               src={bannerImage}
//               alt={`${pageTitle} Banner`}
//               className="w-100 hero-slider-image-responsive"
//               style={{ height: "auto", objectFit: "cover" }}
//             />
//           </div>
//         </div>
//       )}

//       <div className="container py-5">
//         <div className="row mb-5">

//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter filters={filters} setFilters={setFilters} currentPage="brand" />
//           </div>

//           <div className="d-lg-none mb-3">
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

//           {/* Filter & Sort Offcanvas */}
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
//                     products={allProducts}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     currentPage="brand"
//                     hideBrandFilter={false}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

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
//                         checked={!filters.discountSort}
//                         onChange={() => {
//                           setFilters((p) => ({ ...p, discountSort: "" }));
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
//                           setFilters((p) => ({ ...p, discountSort: "high" }));
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
//                           setFilters((p) => ({ ...p, discountSort: "low" }));
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

//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 Showing {allProducts.length} products
//                 {hasMore && " (Scroll for more)"}
//               </span>
//               {Object.values(filters).some((v) => v !== "" && v !== null && v !== false) && (
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
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <h4>No products found</h4>
//                   <p className="text-muted">Try adjusting your filters.</p>
//                 </div>
//               )}
//             </div>

//             {/* infinite-scroll spinner */}
//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             {/* sentinel element for observer */}
//             <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

//             {/* end message */}
//             {!hasMore && allProducts.length > 0 && (
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
// }

// /* BrandPage – Unified API & Full Feature Edition (aligned with ProductPage) */
// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { FaStar, FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import Header from "./Header";
// import Footer from "./Footer";
// import { CartContext } from "../Context/CartContext"; // adjust path if needed
// import { UserContext } from "./UserContext.jsx";
// import BrandFilter from "./BrandFilter";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import "../css/Brandspage.css";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// // Add this in your component:
// import axios from "axios";
// import updownarrow from "../assets/updownarrow.svg";
// import filtering from "../assets/filtering.svg";
// import Bag from "../assets/Bag.svg";

// const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
// const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// /* ─── helpers ───────────────────────────────────────────────────────────── */
// const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;
// const isValidHexColor = (hex) => {
//   if (!hex || typeof hex !== "string") return false;
//   return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
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

// export default function BrandPage() {
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();
//   const swiperRef = useRef(null);
//   const location = useLocation();
//   const { user } = useContext(UserContext);

//   /* ── state ──────────────────────────────────────────────────────────────── */
//   const [allProducts, setAllProducts] = useState([]);
//   const [pageTitle, setPageTitle] = useState("Products");
//   const [bannerImages, setBannerImage] = useState("");

//   const [trendingCategories, setTrendingCategories] = useState([]);
//   const [filterData, setFilterData] = useState(null);

//   const [activeCategorySlug, setActiveCategorySlug] = useState(null);
//   const [activeCategoryName, setActiveCategoryName] = useState("");

//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState(null);

//   const [wishlistLoading, setWishlistLoading] = useState({});
//   const [wishlistData, setWishlistData] = useState([]);

//   const [filters, setFilters] = useState({
//     brandIds: [brandSlug],
//     categoryIds: [],
//     skinTypes: [],
//     formulations: [],
//     finishes: [],
//     ingredients: [],
//     priceRange: null,
//     discountRange: null,
//     minRating: "",
//     sort: "recent",
//   });

//   const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
//   const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(null);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");

//   const loaderRef = useRef(null);

//   /* ── toast ──────────────────────────────────────────────────────────────── */
//   const showToastMsg = (msg, type = "error", dur = 3000) => {
//     const t = document.createElement("div");
//     t.className = `toast-notification toast-${type}`;
//     t.style.cssText = `
//       position:fixed;top:20px;right:20px;padding:12px 20px;
//       border-radius:8px;color:#fff;z-index:9999;
//       background:${type === "error" ? "#f56565" : "#48bb78"};
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//     `;
//     t.textContent = msg;
//     document.body.appendChild(t);
//     setTimeout(() => t.remove(), dur);
//   };

//   /* ── wishlist ───────────────────────────────────────────────────────────── */
//   const isInWishlist = (pid, sku) => {
//     if (!pid || !sku) return false;
//     return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
//   };

//   const fetchWishlistData = async () => {
//     try {
//       if (user && !user.guest) {
//         const { data } = await axios.get("https://beauty.joyory.com/api/user/wishlist", { withCredentials: true });
//         if (data.success) setWishlistData(data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//         setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => { fetchWishlistData(); }, [user]);

//   const toggleWishlist = async (prod, variant) => {
//     if (!user || user.guest) {
//       showToastMsg("Please login to use wishlist", "error");
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (!prod || !variant) return showToastMsg("Select a variant first", "error");
//     const pid = prod._id;
//     const sku = getSku(variant);
//     setWishlistLoading((p) => ({ ...p, [pid]: true }));
//     try {
//       const inWl = isInWishlist(pid, sku);
//       if (user && !user.guest) {
//         if (inWl) {
//           await axios.delete(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { withCredentials: true, data: { sku } });
//           showToastMsg("Removed from wishlist!", "success");
//         } else {
//           await axios.post(`https://beauty.joyory.com/api/user/wishlist/${pid}`, { sku }, { withCredentials: true });
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
//             image: variant.images?.[0] || prod.images?.[0],
//             sku, variantName: variant.shadeName || "Default", stock: variant.stock,
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

//   /* ── fetch products ─────────────────────────────────────────────────────── */
//   const buildQueryParams = (cursor = null) => {
//     const p = new URLSearchParams();

//     if (brandSlug) p.append("brandIds", brandSlug);
//     if (activeCategorySlug) {
//       p.append("categoryIds", activeCategorySlug);
//     }
//     filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
//     filters.skinTypes?.forEach((n) => p.append("skinTypes", n));
//     filters.formulations?.forEach((id) => p.append("formulations", id));
//     filters.finishes?.forEach((s) => p.append("finishes", s));
//     filters.ingredients?.forEach((s) => p.append("ingredients", s));
//     if (filters.minRating) p.append("minRating", filters.minRating);
//     if (filters.priceRange) {
//       p.append("minPrice", filters.priceRange.min);
//       if (filters.priceRange.max != null) p.append("maxPrice", filters.priceRange.max);
//     }
//     if (filters.discountRange) p.append("minDiscount", filters.discountRange.min);
//     if (filters.sort) p.append("sort", filters.sort);
//     if (cursor) p.append("cursor", cursor);
//     p.append("limit", "9");

//     const queryString = p.toString();
//     console.log("BrandPage API Query →", `${PRODUCT_ALL_API}?${queryString}`);
//     return queryString;
//   };

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

//       const { data } = await axios.get(
//         `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
//         { withCredentials: true }
//       );

//       if (data.titleMessage) setPageTitle(data.titleMessage);
//       else if (data.brand?.name) setPageTitle(data.brand.name);
//       else if (data.category?.name) setPageTitle(data.category.name);

//       if (data.bannerImage && Array.isArray(data.bannerImage)) {
//         setBannerImage(data.bannerImage[0]?.url || data.bannerImage[0] || "");
//       } else if (data.brand?.banner) setBannerImage(data.brand.banner);
//       else if (data.category?.bannerImage) setBannerImage(data.category.bannerImage);

//       if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
//         setTrendingCategories(data.trendingCategories);
//         if (activeCategorySlug && !activeCategoryName) {
//           const found = data.trendingCategories.find((c) => c.slug === activeCategorySlug);
//           if (found) setActiveCategoryName(found.name);
//         }
//       } else {
//         setTrendingCategories([]);
//       }

//       if (reset && data.filters) {
//         setFilterData(data.filters);
//       }

//       const prods = data.products || [];
//       const pg = data.pagination || {};

//       if (reset) setAllProducts(prods);
//       else setAllProducts((prev) => [...prev, ...prods]);

//       setHasMore(pg.hasMore || false);
//       setNextCursor(pg.nextCursor || null);
//     } catch (e) {
//       console.error(e);
//       showToastMsg("Failed to fetch products", "error");
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     if (brandSlug) fetchProducts(null, true);
//   }, [brandSlug, filters, activeCategorySlug]);

//   /* ── category pill logic ────────────────────────────────────────────────── */
//   const handleCategoryPillClick = useCallback(
//     (cat) => {
//       if (activeCategorySlug === cat.slug) {
//         setActiveCategorySlug(null);
//         setActiveCategoryName("");
//       } else {
//         setActiveCategorySlug(cat.slug);
//         setActiveCategoryName(cat.name);
//         setFilters((prev) => ({ ...prev, categoryIds: [] }));
//       }
//     },
//     [activeCategorySlug]
//   );

//   const handleClearCategory = useCallback(() => {
//     setActiveCategorySlug(null);
//     setActiveCategoryName("");
//     setFilters((prev) => ({ ...prev, categoryIds: [] }));
//   }, []);

//   /* ── infinite scroll ────────────────────────────────────────────────────── */
//   const loadMore = useCallback(() => {
//     if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
//   }, [nextCursor, hasMore, loadingMore]);

//   useEffect(() => {
//     if (!hasMore || loadingMore) return;
//     const obs = new IntersectionObserver(
//       ([e]) => e.isIntersecting && loadMore(),
//       { root: null, rootMargin: "100px", threshold: 0.1 }
//     );
//     const el = loaderRef.current;
//     if (el) obs.observe(el);
//     return () => el && obs.unobserve(el);
//   }, [loadMore, hasMore, loadingMore]);

//   /* ── cart & variant ─────────────────────────────────────────────────────── */
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
//       const msg = e.response?.data?.message || e.message || "Failed to add to cart";
//       showToastMsg(msg, "error");
//       if (e.response?.status === 401) navigate("/login", { state: { from: location.pathname } });
//     } finally {
//       setAddingToCart((p) => ({ ...p, [prod._id]: false }));
//     }
//   };

//   const handleVariantSelect = (pid, v) => setSelectedVariants((p) => ({ ...p, [pid]: v }));
//   const openVariantOverlay = (pid, t = "all") => { setSelectedVariantType(t); setShowVariantOverlay(pid); };
//   const closeVariantOverlay = () => { setShowVariantOverlay(null); setSelectedVariantType("all"); };
//   const getProductSlug = (pr) => (pr.slugs?.[0] ? pr.slugs[0] : pr._id);

//   const isAnyFilterActive =
//     filters.brandIds.length > 0 ||
//     filters.categoryIds.length > 0 ||
//     filters.skinTypes.length > 0 ||
//     filters.formulations.length > 0 ||
//     filters.finishes.length > 0 ||
//     filters.ingredients.length > 0 ||
//     filters.priceRange ||
//     filters.discountRange ||
//     filters.minRating ||
//     filters.sort !== "recent" ||
//     activeCategorySlug;

//   const handleClearAllFilters = () => {
//     setFilters({
//       brandIds: [brandSlug],
//       categoryIds: [],
//       skinTypes: [],
//       formulations: [],
//       finishes: [],
//       ingredients: [],
//       priceRange: null,
//       discountRange: null,
//       minRating: "",
//       sort: "recent",
//     });
//     setActiveCategorySlug(null);
//     setActiveCategoryName("");
//   };

//   /* ── product card ───────────────────────────────────────────────────────── */
//   const renderProductCard = (prod) => {
//     const vars = Array.isArray(prod.variants) ? prod.variants : [];
//     const hasVar = vars.length > 0;
//     const isVariantSelected = !!selectedVariants[prod._id];
//     const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
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
//     let btnText = "Add to Cart";
//     if (isAdding) btnText = "Adding...";
//     else if (showSelectVariantButton) btnText = "Select Variant";
//     else if (oos) btnText = "Out of Stock";

//     return (
//       <div key={prod._id} className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name">
//         <button
//           onClick={() => { if (displayVariant || !hasVar) toggleWishlist(prod, displayVariant || {}); }}
//           disabled={wishlistLoading[prod._id]}
//           style={{
//             position: "absolute", top: 8, right: 8,
//             cursor: wishlistLoading[prod._id] ? "not-allowed" : "pointer",
//             color: inWl ? "#dc3545" : "#ccc", fontSize: 22, zIndex: 2,
//             backgroundColor: "rgba(255,255,255,.9)",
//              borderRadius: "50%",
//             width: 34, height: 34, display: "flex", alignItems: "center",
//             justifyContent: "center",
//             //  boxShadow: "0 2px 4px rgba(0,0,0,.1)",
//             transition: "all .3s ease", border: "none",
//           }}
//           title={inWl ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           {wishlistLoading[prod._id]
//             ? <div className="spinner-border spinner-border-sm" role="status" />
//             : inWl ? <FaHeart /> : <FaRegHeart />}
//         </button>

//         <img src={img} alt={prod.name} className="card-img-top"
//           style={{ height: 200, objectFit: "contain", cursor: "pointer" }}
//           onClick={() => navigate(`/product/${slugPr}`)} />

//         <div className="card-body p-0 d-flex flex-column" style={{ height: 265 }}>
//           <div className="brand-name text-muted small mb-1 fw-medium mt-2 text-start">{getBrandName(prod)}</div>
//           <h5 className="card-title mt-2 align-items-center gap-1 page-title-main-name"
//             style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${slugPr}`)}>
//             {prod.name}
//           </h5>

//           {hasVar && (
//             <div className="m-0 p-0 ms-0">
//               {isVariantSelected ? (
//                 <div className="text-muted small" style={{ cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}
//                   title="Click to change variant">
//                   Variant: <span className="fw-bold text-limit-2">{getVariantDisplayText(displayVariant)} <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} /></span>
//                 </div>
//               ) : (
//                 <div className="small text-muted" style={{ height: "20px", cursor: "pointer", display: "inline-block" }}
//                   onClick={(e) => { e.stopPropagation(); openVariantOverlay(prod._id, "all"); }}>
//                   {vars.length} Variants Available
//                   <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                 </div>
//               )}
//             </div>
//           )}

//           <p className="fw-bold mb-3 mt-2 page-title-main-name" style={{ fontSize: 16 }}>
//             {(() => {
//               const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
//               const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
//               const disc = orig > price;
//               const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
//               return disc ? (
//                 <>₹{price}
//                   <span style={{ textDecoration: "line-through", color: "#888", marginLeft: 8 }}>₹{orig}</span>
//                   <span style={{ color: "#e53e3e", marginLeft: 8, fontWeight: 600 }}>({pct}% OFF)</span>
//                 </>
//               ) : <>₹{orig}</>;
//             })()}
//           </p>

//           <div className="mt-3">
//             <button
//               // className={`page-title-main-name add-to-cart-product-page w-100 d-flex align-items-center justify-content-center gap-2 ${isAdding ? "bg-black text-white" : ""}`}
//               className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"
//                 }`}
//               onClick={(e) => { e.stopPropagation(); showSelectVariantButton ? openVariantOverlay(prod._id, "all") : handleAddToCart(prod); }}
//               disabled={disabled}
//               style={{ transition: "background-color .3s ease, color .3s ease" }}
//             >
//               {isAdding
//                 ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Adding...</>
//                 : <>{btnText}{!disabled && !isAdding && !showSelectVariantButton && <img src={Bag} alt="Bag" style={{ height: 20 }} />}</>}
//             </button>
//           </div>
//         </div>

//         {showVariantOverlay === prod._id && (
//           <div className="variant-overlay position-absolute" onClick={closeVariantOverlay}>
//             <div className="variant-overlay-content w-100" onClick={(e) => e.stopPropagation()}
//               style={{ width: "90%", maxWidth: 500, maxHeight: "80vh", background: "#fff", borderRadius: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
//               <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                 <h5 className="m-0 page-title-main-name">Select Variant ({totalVars})</h5>
//                 <button onClick={closeVariantOverlay} style={{ background: "none", border: "none", fontSize: 24 }}>×</button>
//               </div>
//               <div className="variant-tabs d-flex">
//                 <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`} onClick={() => setSelectedVariantType("all")}>All ({totalVars})</button>
//                 {grouped.color.length > 0 && <button className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`} onClick={() => setSelectedVariantType("color")}>Colors ({grouped.color.length})</button>}
//                 {grouped.text.length > 0 && <button className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`} onClick={() => setSelectedVariantType("text")}>Sizes ({grouped.text.length})</button>}
//               </div>
//               <div className="p-3 overflow-auto flex-grow-1 page-title-main-name">
//                 {(selectedVariantType === "all" || selectedVariantType === "color") && grouped.color.length > 0 && (
//                   <div className="row row-cols-4 g-3 mb-4">
//                     {grouped.color.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku; const oosV = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ width: 28, height: 28, borderRadius: "20%", backgroundColor: v.hex || "#ccc", margin: "0 auto 8px", border: sel ? "3px solid #000" : "1px solid #ddd", opacity: oosV ? 0.5 : 1, position: "relative" }}>
//                               {sel && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold" }}>✓</span>}
//                             </div>
//                             <div className="small page-title-main-name" style={{ fontSize: "14px !important" }}>{getVariantDisplayText(v)}</div>
//                             {oosV && <div className="text-danger small">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//                 {(selectedVariantType === "all" || selectedVariantType === "text") && grouped.text.length > 0 && (
//                   <div className="row row-cols-3 g-3">
//                     {grouped.text.map((v) => {
//                       const sel = selectedVariants[prod._id]?.sku === v.sku; const oosV = v.stock <= 0;
//                       return (
//                         <div className="col" key={v.sku || v._id}>
//                           <div className="text-center" style={{ cursor: oosV ? "not-allowed" : "pointer" }}
//                             onClick={() => !oosV && (handleVariantSelect(prod._id, v), closeVariantOverlay())}>
//                             <div style={{ padding: 10, borderRadius: 8, border: sel ? "3px solid #000" : "1px solid #ddd", background: sel ? "#f8f9fa" : "#fff", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: oosV ? 0.5 : 1 }}>
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {oosV && <div className="text-danger small mt-1">Out of Stock</div>}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const brandFilterProps = {
//     filters,
//     setFilters,
//     filterData,
//     trendingCategories,
//     activeCategorySlug,
//     activeCategoryName,
//     onClearCategory: handleClearCategory,
//     onCategoryPillClick: handleCategoryPillClick,
//     isSubCategoryView: !!activeCategorySlug,
//   };

//   /* ── render ─────────────────────────────────────────────────────────────── */
//   return (
//     <>
//       {loading && (
//         <div
//               className="d-flex flex-column align-items-center justify-content-center bg-white"
//               style={{
//                 minHeight: "100vh",
//                 width: "100%",
//               }}
//             >
//               <div className="text-center">
//                 <DotLottieReact
//                   src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//                   loop
//                   autoplay
//                 />
//                 <p className="text-muted mb-0">
//                   Please wait while we prepare the best products for you...
//                 </p>
//               </div>
//             </div>
//       )}
//       <Header />

//       {/* <div className="banner-images text-center mt-xl-5 pt-xl-4">
//         <img src={bannerImage || "/banner-placeholder.jpg"} alt="Banner"
//           className="w-100 hero-slider-image-responsive"
//           style={{ maxHeight: 400, objectFit: "cover" }} />
//       </div> */}

//       {bannerImages?.length > 0 && (
//         <section className="hero-slider text-center mt-xl-5 pt-xl-4 padding-left-rightss">
//           <Swiper
//             ref={swiperRef}
//             modules={[Autoplay, Pagination, Navigation]}
//             onSlideChange={() => {
//               const swiper = swiperRef.current?.swiper;
//               if (!swiper) return;
//               document.querySelectorAll(".slide-video").forEach((v) => v.pause());
//               const activeSlide = swiper.slides[swiper.activeIndex];
//               const video = activeSlide?.querySelector("video");
//               if (video) video.play().catch(() => { });
//             }}
//             loop={bannerImages.length > 1}
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             pagination={{
//               clickable: true,
//               bulletClass: 'custom-swiper-bullet',
//               bulletActiveClass: 'custom-swiper-bullet-active',
//             }}
//             navigation={bannerImages.length > 1}
//             speed={800}
//             style={{ height: "auto", width: "100%" }}
//           >
//             {bannerImages.map((banner, index) => {
//               const imgUrl = typeof banner === "string" ? banner : banner.url;
//               const targetLink = typeof banner === "object" ? banner.link : null;

//               return (
//                 <SwiperSlide key={index}>
//                   <div
//                     className="position-relative w-100 h-100 hero-slider-image-responsive"
//                     style={{ cursor: targetLink ? "pointer" : "default" }}
//                     onClick={() => {
//                       if (!targetLink) return;
//                       if (targetLink.startsWith("http")) window.open(targetLink, "_blank");
//                       else navigate(targetLink);
//                     }}
//                   >
//                     <img
//                       src={imgUrl}
//                       alt={pageTitle || `Banner ${index + 1}`}
//                       className="w-100 h-100"
//                       style={{ maxHeight: 400, objectFit: "cover" }}
//                       onError={(e) => { e.currentTarget.src = "/banner-placeholder.jpg"; }}
//                     />
//                   </div>
//                 </SwiperSlide>
//               );
//             })}
//           </Swiper>
//         </section>
//       )}

//       {trendingCategories.length > 0 && (
//         <div className="container-lg mt-4">
//           <div className="d-flex overflow-auto py-2"
//             style={{ gap: "0.75rem", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
//             {trendingCategories.map((cat) => {
//               const isActive = activeCategorySlug === cat.slug;
//               return (
//                 <button key={cat.slug}
//                   onClick={() => handleCategoryPillClick(cat)}
//                   className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
//                   style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, transition: "all 0.18s ease", transform: isActive ? "scale(1.04)" : "scale(1)" }}
//                   title={`Filter by ${cat.name}`}
//                 >
//                   {cat.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <div className="padding-left-rightss brand-page-responsive-code">
//         <h2 className="mb-4 d-none d-lg-block page-title-main-name">{pageTitle}</h2>

//         <div className="row">
//           {/* Desktop Sidebar */}
//           <div className="d-none d-lg-block col-lg-3">
//             <BrandFilter {...brandFilterProps} />
//           </div>

//           {/* Mobile Filter + Sort */}
//           <div className="d-lg-none mb-3">
//             <h2 className="mb-4 text-center">{pageTitle}</h2>
//             <div className="w-100 filter-responsive rounded shadow-sm">
//               <div className="container-fluid p-0">
//                 <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
//                   <div className="col-6">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={filtering} alt="Filter" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
//                         <span className="text-muted small page-title-main-name">Tap to apply</span>
//                       </div>
//                     </button>
//                   </div>
//                   <div className="col-6 border-end">
//                     <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
//                       onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
//                       <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
//                       <div className="text-start">
//                         <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
//                         <span className="text-muted small">{filters.sort === "recent" ? "Relevance" : filters.sort}</span>
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
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold">Filters</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowFilterOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
//                   <BrandFilter
//                     {...brandFilterProps}
//                     onClose={() => setShowFilterOffcanvas(false)}
//                     onClearCategory={() => { handleClearCategory(); setShowFilterOffcanvas(false); }}
//                     onCategoryPillClick={(cat) => {
//                       handleCategoryPillClick(cat);
//                       setShowFilterOffcanvas(false);
//                     }}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Mobile Sort Offcanvas */}
//           {showSortOffcanvas && (
//             <>
//               <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
//                 style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
//               <div className="position-fixed start-0 bottom-0 w-100 bg-white"
//                 style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
//                 <div className="text-center py-3 position-relative">
//                   <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
//                   <button className="btn-close position-absolute end-0 me-3"
//                     style={{ top: "50%", transform: "translateY(-50%)" }}
//                     onClick={() => setShowSortOffcanvas(false)} />
//                   <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
//                 </div>
//                 <div className="px-4 pb-4">
//                   <div className="list-group">
//                     {[
//                       { value: "recent", label: "Relevance" },
//                       { value: "priceHighToLow", label: "Price High to Low" },
//                       { value: "priceLowToHigh", label: "Price Low to High" },
//                     ].map(({ value, label }) => (
//                       <label key={value} className="list-group-item py-3 d-flex align-items-center">
//                         <input className="form-check-input me-3" type="radio" name="sort"
//                           checked={filters.sort === value}
//                           onChange={() => { setFilters((p) => ({ ...p, sort: value })); setShowSortOffcanvas(false); }} />
//                         <span className="page-title-main-name">{label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Product Grid */}
//           <div className="col-12 col-lg-9">
//             <div className="mb-3 d-flex justify-content-between align-items-center">
//               <span className="text-muted page-title-main-name">
//                 {pageTitle || `Showing ${allProducts.length} products`}
//                 {hasMore && pageTitle && " (Scroll for more)"}
//               </span>
//               {isAnyFilterActive && (
//                 <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             <div className="row g-4">
//               {allProducts.length > 0
//                 ? allProducts.map(renderProductCard)
//                 : <div className="col-12 text-center py-5"><h4>No products found</h4><p className="text-muted">Try adjusting your filters.</p></div>}
//             </div>

//             {loadingMore && (
//               <div className="text-center mt-4 py-4">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading more products...</span>
//                 </div>
//                 <p className="mt-2">Loading more products...</p>
//               </div>
//             )}

//             <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

//             {!hasMore && allProducts.length > 0 && (
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
// }






/* BrandPage – Fully aligned with ProductPage filter sidebar */
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "./UserContext.jsx";
import BrandFilter from "./BrandFilter";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../css/Brandspage.css";
import "../css/BestSellers.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import updownarrow from "../assets/updownarrow.svg";
import filtering from "../assets/filtering.svg";
import Bag from "../assets/Bag.svg";

const CART_API_BASE = "https://beauty.joyory.com/api/user/cart";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

/* ─── helpers ───────────────────────────────────────────────────────────── */
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;
const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
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

export default function BrandPage() {
  const { brandSlug } = useParams();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(); // NEW
  const { user } = useContext(UserContext);

  /* ── state ──────────────────────────────────────────────────────────────── */
  const [allProducts, setAllProducts] = useState([]);
  const [pageTitle, setPageTitle] = useState("Products");
  const [bannerImages, setBannerImages] = useState([]);

  const [trendingCategories, setTrendingCategories] = useState([]);
  const [filterData, setFilterData] = useState(null);

  const [activeCategorySlug, setActiveCategorySlug] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  const [selectedVariants, setSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);

  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);

  // 🔥 Filters – NOW mirrors ProductPage (priceRange, discountMin)
  const [filters, setFilters] = useState(() => {
    const initial = {
      brandIds: [brandSlug],
      categoryIds: [],
      skinTypes: [],
      formulations: [],
      finishes: [],
      ingredients: [],
      priceRange: null,
      discountMin: null, // single number
      minRating: "",
      sort: "recent",
    };

    const getMultiParam = (key) => {
      const vals = searchParams.getAll(key);
      if (vals.length) return vals;
      const comma = searchParams.get(key);
      return comma
        ? comma
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        : [];
    };

    [
      "brandIds",
      "categoryIds",
      "skinTypes",
      "formulations",
      "finishes",
      "ingredients",
    ].forEach((k) => {
      initial[k] = getMultiParam(k);
    });

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice !== null || maxPrice !== null) {
      initial.priceRange = {
        min: minPrice ? parseFloat(minPrice) : 0,
        max: maxPrice ? parseFloat(maxPrice) : null,
      };
    }

    const discountMin = searchParams.get("discountMin");
    if (discountMin !== null) initial.discountMin = parseFloat(discountMin);

    const minRating = searchParams.get("minRating");
    if (minRating !== null) initial.minRating = minRating;

    const sortParam = searchParams.get("sort");
    if (
      sortParam &&
      ["recent", "priceHighToLow", "priceLowToHigh"].includes(sortParam)
    )
      initial.sort = sortParam;

    return initial;
  });

  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // ===================== OUT OF STOCK POPUP STATE =====================
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  // ===================== END OUT OF STOCK POPUP STATE =====================

  const loaderRef = useRef(null);

  /* ── toast ──────────────────────────────────────────────────────────────── */
  // const showToastMsg = (msg, type = "error", dur = 3000) => {
  //   const t = document.createElement("div");
  //   t.className = `toast-notification toast-${type}`;
  //   t.style.cssText = `
  //     position:fixed;top:20px;right:20px;padding:12px 20px;
  //     border-radius:8px;color:#fff;z-index:9999;
  //     background:${type === "error" ? "#f56565" : "#48bb78"};
  //     box-shadow:0 4px 12px rgba(0,0,0,.15);
  //   `;
  //   t.textContent = msg;
  //   document.body.appendChild(t);
  //   setTimeout(() => t.remove(), dur);
  // };




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

  const isCompletelyOutOfStock = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    if (vars.length === 0) {
      return (prod.stock || 0) <= 0;
    }
    return vars.every((v) => (v.stock || 0) <= 0);
  };
  // ===================== END OUT OF STOCK POPUP HANDLER =====================

  /* ── wishlist ───────────────────────────────────────────────────────────── */
  const isInWishlist = (pid, sku) => {
    if (!pid || !sku) return false;
    return wishlistData.some(
      (it) => (it.productId === pid || it._id === pid) && it.sku === sku,
    );
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const { data } = await axios.get(
          "https://beauty.joyory.com/api/user/wishlist",
          { withCredentials: true },
        );
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
    if (!prod || !variant)
      return showToastMsg("Select a variant first", "error");
    const pid = prod._id;
    const sku = getSku(variant);
    setWishlistLoading((p) => ({ ...p, [pid]: true }));
    try {
      const inWl = isInWishlist(pid, sku);
      if (user && !user.guest) {
        if (inWl) {
          await axios.delete(
            `https://beauty.joyory.com/api/user/wishlist/${pid}`,
            { withCredentials: true, data: { sku } },
          );
          showToastMsg("Removed from wishlist!", "success");
        } else {
          await axios.post(
            `https://beauty.joyory.com/api/user/wishlist/${pid}`,
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

  /* ── fetch products ─────────────────────────────────────────────────────── */
  const buildQueryParams = (cursor = null) => {
    const p = new URLSearchParams();
    if (brandSlug) p.append("brandIds", brandSlug);
    if (activeCategorySlug) p.append("categoryIds", activeCategorySlug);

    filters.brandIds?.forEach((id) => p.append("brandIds", id));
    filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
    filters.skinTypes?.forEach((n) => p.append("skinTypes", n));
    filters.formulations?.forEach((id) => p.append("formulations", id));
    filters.finishes?.forEach((s) => p.append("finishes", s));
    filters.ingredients?.forEach((s) => p.append("ingredients", s));
    if (filters.minRating) p.append("minRating", filters.minRating);

    if (filters.priceRange) {
      p.append("minPrice", filters.priceRange.min);
      if (filters.priceRange.max != null)
        p.append("maxPrice", filters.priceRange.max);
    }

    if (filters.discountMin && filters.discountMin > 0) {
      p.append("discountMin", filters.discountMin);
    }

    if (filters.sort) p.append("sort", filters.sort);
    if (cursor) p.append("cursor", cursor);
    p.append("limit", "9");

    const queryString = p.toString();
    console.log("BrandPage API Query →", `${PRODUCT_ALL_API}?${queryString}`);
    return queryString;
  };

  // const fetchProducts = async (cursor = null, reset = false) => {
  //   try {
  //     if (reset) {
  //       setLoading(true);
  //       setAllProducts([]);           // cleared on full reload
  //       setNextCursor(null);
  //       setHasMore(true);
  //     } else {
  //       setLoadingMore(true);
  //     }

  //     const { data } = await axios.get(
  //       `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
  //       { withCredentials: true }
  //     );

  //     if (data.titleMessage) setPageTitle(data.titleMessage);
  //     else if (data.brand?.name) setPageTitle(data.brand.name);
  //     else if (data.category?.name) setPageTitle(data.category.name);

  //     // Banner extraction
  //     if (data.bannerImage && Array.isArray(data.bannerImage)) {
  //       setBannerImages(data.bannerImage);
  //     } else if (data.brand?.banner) {
  //       setBannerImages([data.brand.banner]);
  //     } else if (data.category?.bannerImage) {
  //       setBannerImages([data.category.bannerImage]);
  //     } else {
  //       setBannerImages([]);
  //     }

  //     if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
  //       setTrendingCategories(data.trendingCategories);
  //       if (activeCategorySlug && !activeCategoryName) {
  //         const found = data.trendingCategories.find((c) => c.slug === activeCategorySlug);
  //         if (found) setActiveCategoryName(found.name);
  //       }
  //     } else {
  //       setTrendingCategories([]);
  //     }

  //     if (reset && data.filters) {
  //       setFilterData(data.filters);
  //     }

  //     const prods = Array.isArray(data.products) ? data.products : [];
  //     const pg = data.pagination || {};

  //     if (reset) setAllProducts(prods);
  //     else setAllProducts((prev) => [...prev, ...prods]);

  //     setHasMore(pg.hasMore || false);
  //     setNextCursor(pg.nextCursor || null);
  //   } catch (e) {
  //     console.error(e);
  //     showToastMsg("Failed to fetch products", "error");
  //   } finally {
  //     setLoading(false);
  //     setLoadingMore(false);
  //   }
  // };

  const fetchProducts = async (cursor = null, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setAllProducts([]);
        setNextCursor(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const { data } = await axios.get(
        `${PRODUCT_ALL_API}?${buildQueryParams(cursor)}`,
        { withCredentials: true },
      );

      if (data.titleMessage) setPageTitle(data.titleMessage);
      else if (data.brand?.name) setPageTitle(data.brand.name);
      else if (data.category?.name) setPageTitle(data.category.name);

      /*** FIXED BANNER HANDLING - Handles nested array ***/
      let banners = [];

      if (data.bannerImage) {
        // Case 1: Backend returns [[{url}, {url}]] → flatten it
        if (Array.isArray(data.bannerImage)) {
          if (Array.isArray(data.bannerImage[0])) {
            banners = data.bannerImage[0]; // Flatten nested array
          } else {
            banners = data.bannerImage; // Normal array
          }
        }
        // Case 2: Single string
        else if (typeof data.bannerImage === "string") {
          banners = [{ url: data.bannerImage }];
        }
        // Case 3: Single object
        else if (data.bannerImage.url) {
          banners = [data.bannerImage];
        }
      } else if (data.brand?.banner) {
        banners = [{ url: data.brand.banner }];
      } else if (data.category?.bannerImage) {
        banners = Array.isArray(data.category.bannerImage)
          ? data.category.bannerImage
          : [{ url: data.category.bannerImage }];
      }

      console.log("✅ Final banners set to state:", banners); // For debugging

      setBannerImages(banners);

      // Trending Categories
      if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
        setTrendingCategories(data.trendingCategories);
        if (activeCategorySlug && !activeCategoryName) {
          const found = data.trendingCategories.find(
            (c) => c.slug === activeCategorySlug,
          );
          if (found) setActiveCategoryName(found.name);
        }
      } else {
        setTrendingCategories([]);
      }

      if (reset && data.filters) {
        setFilterData(data.filters);
      }

      const prods = Array.isArray(data.products) ? data.products : [];
      const pg = data.pagination || {};

      if (reset) setAllProducts(prods);
      else setAllProducts((prev) => [...prev, ...prods]);

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);
    } catch (e) {
      console.error("Fetch products error:", e);
      showToastMsg("Failed to fetch products", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (brandSlug) fetchProducts(null, true);
  }, [brandSlug, filters, activeCategorySlug]);

  /* ── category pill logic ────────────────────────────────────────────────── */
  const handleCategoryPillClick = useCallback(
    (cat) => {
      if (activeCategorySlug === cat.slug) {
        setActiveCategorySlug(null);
        setActiveCategoryName("");
      } else {
        setActiveCategorySlug(cat.slug);
        setActiveCategoryName(cat.name);
        setFilters((prev) => ({ ...prev, categoryIds: [] }));
      }
    },
    [activeCategorySlug],
  );

  const handleClearCategory = useCallback(() => {
    setActiveCategorySlug(null);
    setActiveCategoryName("");
    setFilters((prev) => ({ ...prev, categoryIds: [] }));
  }, []);





  // Force scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",   // or "smooth" if you prefer
    });
  }, [brandSlug]);   // Re-run when brand changes




  /* ── URL Sync (like ProductPage) ──────────────────────────────────────── */
  useEffect(() => {
    const newParams = new URLSearchParams();
    const addArray = (key, arr) => {
      if (Array.isArray(arr) && arr.length)
        arr.forEach((v) => newParams.append(key, v));
    };

    addArray("brandIds", filters.brandIds);
    addArray("categoryIds", filters.categoryIds);
    addArray("skinTypes", filters.skinTypes);
    addArray("formulations", filters.formulations);
    addArray("finishes", filters.finishes);
    addArray("ingredients", filters.ingredients);

    if (filters.priceRange) {
      newParams.set("minPrice", filters.priceRange.min);
      if (filters.priceRange.max != null)
        newParams.set("maxPrice", filters.priceRange.max);
    }
    if (filters.discountMin != null && filters.discountMin > 0)
      newParams.set("discountMin", filters.discountMin);
    if (filters.minRating) newParams.set("minRating", filters.minRating);
    if (filters.sort !== "recent") newParams.set("sort", filters.sort);

    const newQuery = newParams.toString();
    if (newQuery !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [filters, setSearchParams, searchParams]);

  /* ── infinite scroll ────────────────────────────────────────────────────── */
  const loadMore = useCallback(() => {
    if (nextCursor && hasMore && !loadingMore) fetchProducts(nextCursor, false);
  }, [nextCursor, hasMore, loadingMore]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && loadMore(),
      { root: null, rootMargin: "100px", threshold: 0.1 },
    );
    const el = loaderRef.current;
    if (el) obs.observe(el);
    return () => el && obs.unobserve(el);
  }, [loadMore, hasMore, loadingMore]);

  /* ── cart & variant ─────────────────────────────────────────────────────── */
  const handleAddToCart = async (prod) => {
    setAddingToCart((p) => ({ ...p, [prod._id]: true }));
    try {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      let payload;
      if (hasVar) {
        const sel = selectedVariants[prod._id] || (vars.find((v) => v.stock > 0) || vars[0]);
        if (!sel || sel.stock <= 0) {
          showToastMsg("Please select an in-stock variant.", "error");
          return;
        }
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(sel), quantity: 1 }],
        };
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

  const isAnyFilterActive =
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
    !!activeCategorySlug;

  const handleClearAllFilters = () => {
    setFilters({
      brandIds: [brandSlug],
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
    setActiveCategorySlug(null);
    setActiveCategoryName("");
  };

  /* ── product card ───────────────────────────────────────────────────────── */
  const renderProductCard = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    const hasVar = vars.length > 0;
    const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null) || {};
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
    const isCurrentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;

    // Show out of stock if completely out AND it has NO variants
    const showOutOfStock = completelyOutOfStock && !hasVar;

    const showSelectVariantButton = hasVar && vars.length > 1;
    const buttonDisabled = isAdding || showOutOfStock;

    let btnText = "Add to Bag";
    if (isAdding) btnText = "Adding...";
    else if (showOutOfStock) btnText = "Out of Stock";
    else if (showSelectVariantButton) btnText = "Select Variant";
    else if (isCurrentVariantOutOfStock) btnText = "Out of Stock";

    return (
      <div
        key={prod._id}
        className="col-6 col-md-4 col-lg-4 position-relative page-title-main-name"
      >
        <div className="foryou-card-wrapper">
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
              style={{ cursor: showOutOfStock ? 'pointer' : 'pointer', position: 'relative' }}
            >
              <img
                src={img}
                alt={prod.name}
                className="foryou-img img-fluid"
                style={{
                  opacity: showOutOfStock ? 0.6 : 1,
                  filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
                }}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
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

              {/* Wishlist button */}
              {!showOutOfStock && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (displayVariant || !hasVar)
                      toggleWishlist(prod, displayVariant || {});
                  }}
                  disabled={wishlistLoading[prod._id]}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    cursor: wishlistLoading[prod._id] ? 'not-allowed' : 'pointer',
                    color: inWl ? '#dc3545' : '#ccc',
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
                  title={inWl ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlistLoading[prod._id] ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : inWl ? (
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
                    const varName = displayVariant ? getVariantDisplayText(displayVariant) : "";
                    return varName && varName.toUpperCase() !== "DEFAULT" ? `${prod.name} - ${varName}` : prod.name;
                  })()}
                </h6>

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
                      const pct = disc ? Math.round(((orig - price) / orig) * 100) : 0;
                      return (
                        <>
                          <span
                            className="current-price fw-400 fs-5"
                            style={{
                              textDecoration: showOutOfStock ? 'line-through' : 'none',
                              opacity: showOutOfStock ? 0.6 : 1,
                            }}
                          >
                            ₹{price}
                          </span>
                          {disc && !showOutOfStock && (
                            <>
                              <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                ₹{orig}
                              </span>
                              <span className="discount-percent text-danger fw-bold ms-2">
                                ({pct}% OFF)
                              </span>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Cart Button */}
                <div className="cart-section">
                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${showOutOfStock
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
                          {btnText}
                          {!buttonDisabled && !isAdding && !showSelectVariantButton && (
                            <img src={Bag} alt="Bag" className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} />
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
            <div className="variant-overlay" onClick={closeVariantOverlay}>
              <div
                className="variant-overlay-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                  <h5 className="m-0 page-title-main-name">Select Variant</h5>
                  <button
                    onClick={closeVariantOverlay}
                    style={{ background: "none", border: "none", fontSize: "40px" }}
                  >
                    ×
                  </button>
                </div>

                <div className="variant-overlay-body">
                  {grouped.color.length > 0 && (
                    <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                      {grouped.color.map((v) => {
                        const sel = tempSelectedVariants[prod._id]?.sku === v.sku || displayVariant.sku === v.sku;
                        const oosV = v.stock <= 0;
                        return (
                          <div
                            key={v.sku || v._id}
                            style={{ cursor: oosV ? "not-allowed" : "pointer", position: "relative" }}
                            onClick={() => {
                              if (!oosV) {
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
                                border: sel ? "3px solid #000" : "1px solid #ddd",
                                opacity: oosV ? 0.4 : 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {sel && (
                                <span style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                                  ✓
                                </span>
                              )}
                            </div>
                            {oosV && (
                              <span style={{
                                position: "absolute", top: 0, left: 8, right: 0, bottom: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "red", fontWeight: "bold", fontSize: 16, pointerEvents: "none"
                              }}>✕</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {grouped.text.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                      {grouped.text.map((v) => {
                        const sel = tempSelectedVariants[prod._id]?.sku === v.sku || displayVariant.sku === v.sku;
                        const oosV = v.stock <= 0;
                        return (
                          <div
                            key={v.sku || v._id}
                            className="variant-text-item"
                            style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                            onClick={() => {
                              if (!oosV) {
                                handleVariantSelect(prod._id, v);
                                setTempSelectedVariants(prev => ({ ...prev, [prod._id]: v }));
                              }
                            }}
                          >
                            <div
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: sel ? "2px solid #000" : "1px solid #ddd",
                                background: sel ? "#f8f9fa" : "#fff",
                                opacity: oosV ? 0.4 : 1,
                                textDecoration: oosV ? "line-through" : "none"
                              }}
                            >
                              {getVariantDisplayText(v)}
                              {oosV && <span className="text-danger small ms-1">(OOS)</span>}
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
                    className={`btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const chosen = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (vars.find((v) => v.stock > 0) || vars[0]);
                      if (chosen) {
                        handleVariantSelect(prod._id, chosen);
                      }
                      await handleAddToCart(prod);
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
                    ) : displayVariant?.stock <= 0 ? (
                      "Out of Stock"
                    ) : (
                      <>
                        Add to Bag
                        {!isAdding && displayVariant?.stock > 0 && (
                          <img src={Bag} alt="Bag" className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
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
    isSubCategoryView: !!activeCategorySlug,
  };

  /* ── render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* {loading && allProducts.length === 0 && (
        <div
          className="d-flex flex-column align-items-center justify-content-center bg-white"
          style={{ minHeight: "100vh", width: "100%" , zIndex:"999"  }}
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
      )} */}




      {loading && allProducts.length === 0 && (
        <div
          className="d-flex flex-column align-items-center justify-content-center bg-white"
          style={{
            position: "fixed",        // ← This is the key
            top: 0,
            left: 0,
            width: "100%",           // Use 100vw instead of 100%
            height: "100vh",          // Use 100vh instead of minHeight
            zIndex: 9999,             // Higher z-index is safer
            overflow: "hidden",       // Prevent any scrolling behind
          }}
        >
          <div className="text-center">
            <DotLottieReact
              src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "90%" }} // Optional: control size
            />
            <p className="text-muted mb-0 mt-3">
              Please wait while we prepare the best products for you...
            </p>
          </div>
        </div>
      )}
      <Header />

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

      {/* Banner Slider */}
      {bannerImages?.length > 0 ? (
        <section className="hero-slider text-center margin-padding-brabdpage-responsive padding-left-rightss">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination, Navigation]}
            onSlideChange={() => {
              const swiper = swiperRef.current?.swiper;
              if (!swiper) return;
              document
                .querySelectorAll(".slide-video")
                .forEach((v) => v.pause());
              const activeSlide = swiper.slides[swiper.activeIndex];
              const video = activeSlide?.querySelector("video");
              if (video) video.play().catch(() => { });
            }}
            loop={bannerImages.length > 1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: "custom-swiper-bullet",
              bulletActiveClass: "custom-swiper-bullet-active",
            }}
            navigation={bannerImages.length > 1}
            speed={800}
            style={{ height: "auto", width: "100%" }}
          >
            {bannerImages.map((banner, index) => {
              // const imgUrl = typeof banner === "string" ? banner : banner.url;
              const imgUrl =
                typeof banner === "string" ? banner : banner?.url || "";
              const targetLink =
                typeof banner === "object" ? banner.link : null;
              return (
                <SwiperSlide key={index}>
                  <div
                    className="position-relative w-100 h-100 hero-slider-image-responsive"
                    style={{ cursor: targetLink ? "pointer" : "default" }}
                    onClick={() => {
                      if (!targetLink) return;
                      if (targetLink.startsWith("http"))
                        window.open(targetLink, "_blank");
                      else navigate(targetLink);
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={pageTitle || `Banner ${index + 1}`}
                      className="w-100 h-100"
                      style={{ Height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = "/banner-placeholder.jpg";
                      }}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      ) : (
        <div className="non-hero-spacer" />
      )}

      {/* Trending Category Pills */}
      {trendingCategories.length > 0 && (
        <div className="container-lg mt-4">
          <div
            className="d-flex overflow-auto py-2"
            style={{
              gap: "0.75rem",
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
            }}
          >
            {trendingCategories.map((cat) => {
              const isActive = activeCategorySlug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryPillClick(cat)}
                  className={`btn rounded-pill px-4 py-2 page-title-main-name flex-shrink-0 ${isActive ? "btn-dark" : "btn-outline-secondary"}`}
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    transition: "all 0.18s ease",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                  title={`Filter by ${cat.name}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="padding-left-rightss brand-page-responsive-code">
        <h2 className="mb-4 d-none d-lg-block page-title-main-name">
          {pageTitle}
        </h2>

        <div className="row">
          {/* Desktop Sidebar – exact same filter as ProductPage */}
          <div className="d-none d-lg-block col-lg-3">
            <BrandFilter {...brandFilterProps} />
          </div>

          {/* Mobile Filter + Sort */}
          <div className="d-lg-none mb-3">
            <h2 className="mb-4 text-center">{pageTitle}</h2>
            <div className="w-100 filter-responsive rounded shadow-sm">
              <div className="container-fluid p-0">
                <div
                  className="row g-0"
                  style={{ flexDirection: "row-reverse" }}
                >
                  <div className="col-6">
                    <button
                      className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                      onClick={() => setShowFilterOffcanvas(true)}
                      style={{ gap: 12 }}
                    >
                      <img src={filtering} alt="Filter" style={{ width: 25 }} />
                      <div className="text-start">
                        <p className="mb-0 fs-6 fw-semibold page-title-main-name">
                          Filter
                        </p>
                        <span className="text-muted small page-title-main-name">
                          Tap to apply
                        </span>
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
                        <p className="mb-0 fs-6 fw-semibold page-title-main-name">
                          Sort by
                        </p>
                        <span className="text-muted small">
                          {filters.sort === "recent"
                            ? "Relevance"
                            : filters.sort}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Offcanvas */}
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
                <div
                  className="px-3 pb-4 overflow-auto"
                  style={{ maxHeight: "70vh" }}
                >
                  <BrandFilter
                    {...brandFilterProps}
                    onClose={() => setShowFilterOffcanvas(false)}
                    onClearCategory={() => {
                      handleClearCategory();
                      setShowFilterOffcanvas(false);
                    }}
                    onCategoryPillClick={(cat) => {
                      handleCategoryPillClick(cat);
                      setShowFilterOffcanvas(false);
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Mobile Sort Offcanvas */}
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
                      { value: "priceHighToLow", label: "Price High to Low" },
                      { value: "priceLowToHigh", label: "Price Low to High" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="list-group-item py-3 d-flex align-items-center"
                      >
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

          {/* Product Grid */}
          <div className="col-12 col-lg-9">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="text-muted page-title-main-name">
                {pageTitle || `Showing ${allProducts.length} products`}
                {hasMore && pageTitle && " (Scroll for more)"}
              </span>
              {isAnyFilterActive && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearAllFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="row g-4 position-relative">
              {/* Loading overlay when filters change but products already exist */}
              {loading && allProducts.length > 0 && (
                <div
                  className="position-absolute w-100 h-100 d-flex justify-content-center align-items-start pt-5"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    zIndex: 10,
                    borderRadius: "15px",
                  }}
                >
                  <div
                    className="text-center sticky-top"
                    style={{ top: "200px" }}
                  >
                    <DotLottieReact
                      src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                      loop
                      autoplay
                      style={{ width: "150px", height: "150px" }}
                    />
                    <p className="page-title-main-name fw-bold">
                      Refining selection...
                    </p>
                  </div>
                </div>
              )}
              {allProducts.length > 0 ? (
                allProducts.map(renderProductCard)
              ) : loading ? (
                <div className="col-12 text-center py-5">
                  <DotLottieReact
                    src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                    loop
                    autoplay
                    style={{
                      width: "200px",
                      height: "200px",
                      margin: "0 auto",
                    }}
                  />
                  <p className="text-muted">Loading products...</p>
                </div>
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>No products found</h4>
                  <p className="text-muted">Try adjusting your filters.</p>
                </div>
              )}
            </div>

            {loadingMore && (
              <div className="text-center mt-4 py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">
                    Loading more products...
                  </span>
                </div>
                <p className="mt-2">Loading more products...</p>
              </div>
            )}

            <div ref={loaderRef} style={{ height: 20, marginTop: 20 }} />

            {!hasMore && allProducts.length > 0 && (
              <div className="text-center mt-4 py-4 border-top">
                <p className="text-muted">
                  🎉 You've reached the end! No more products to show.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
      {showVariantOverlay && (() => {
        const item = allProducts.find(p => p._id === showVariantOverlay);
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
                      ₹{displayVariant.displayPrice}
                    </span>
                    {displayVariant.originalPrice > displayVariant.displayPrice && (
                      <>
                        <span className="mobile-sheet-original-price">
                          ₹{displayVariant.originalPrice}
                        </span>
                        <span className="mobile-sheet-discount">
                          ({Math.round(((displayVariant.originalPrice - displayVariant.displayPrice) / displayVariant.originalPrice) * 100)}% OFF)
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
                    await handleAddToCart(item);
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

      <Footer />
    </>
  );
}

//=============================================================================Done-COde(End)====================================================================================
