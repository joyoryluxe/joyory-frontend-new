// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/Foryou.css";
// import "../App.css";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import bagIcon from "../assets/bag.svg";
// import { FaChevronDown } from "react-icons/fa";

// const Foryou = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedVariants, setSelectedVariants] = useState({});
//   const [addingToCart, setAddingToCart] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState({});
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
//   const getBrandName = useCallback((brand) => {
//     if (!brand) return "Unknown Brand";

//     if (typeof brand === 'string') {
//       const brandMap = {};
//       return brandMap[brand] || brand || "Unknown Brand";
//     }

//     if (brand && typeof brand === 'object') {
//       if (brand.name && typeof brand.name === 'string') {
//         return brand.name;
//       }
//       if (brand._id) {
//         const brandMap = {};
//         return brandMap[brand._id] || brand._id || "Unknown Brand";
//       }
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

//   // Helper to check if hex color is valid and not default
//   const isValidHexColor = useCallback((hex) => {
//     if (!hex || typeof hex !== 'string') return false;

//     const normalizedHex = hex.trim().toLowerCase();

//     const defaultColors = ['#000000', '#000', '#ccc', '#cccccc', '#fff', '#ffffff', '#00000000', 'transparent'];

//     if (defaultColors.includes(normalizedHex)) return false;

//     const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
//     return hexRegex.test(normalizedHex);
//   }, []);

//   // Helper to get variant display type (color, size, ml, etc.)
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

//     if (variantType === 'ml' && variant.ml) {
//       return `${variant.ml} ML`;
//     }
//     if (variantType === 'weight' && variant.weight) {
//       return `${variant.weight} g`;
//     }
//     if (variantType === 'size' && variant.size) {
//       return variant.size;
//     }
//     if (variant.shadeName) {
//       return variant.shadeName.toUpperCase();
//     }
//     if (variant.name) {
//       return variant.name.toUpperCase();
//     }
//     if (variant.variantName) {
//       return variant.variantName.toUpperCase();
//     }

//     return "Default";
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

//     // Get tone and undertone
//     const tones = selectedVariant.toneKeys || product.toneKeys || [];
//     const undertones = selectedVariant.undertoneKeys || product.undertoneKeys || [];

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
//       slug: productSlug, // Add slug here for navigation
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
//         tones,
//         undertones,
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
//       howToUse: product.howToUse || "",
//       ingredients: product.ingredients || [],
//       features: product.features || [],
//       avgRating: parseFloat(product.avgRating || 0),
//       totalRatings: parseInt(product.totalRatings || 0),
//       // All variants available (merged from variants and shadeOptions)
//       allVariants: [...allVariants].filter(v => v) // Remove null/undefined
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getVariantDisplayText, getProductSlug]);

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

//   // Handle variant selection
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

//   // Handle quantity increment
//   const handleIncrement = useCallback((productId) => {
//     if (!productId) return;

//     setProducts(prevProducts =>
//       prevProducts.map(product => {
//         if (product._id === productId) {
//           const currentQty = parseInt(product.variant?.quantity || 0);
//           const stock = parseInt(product.variant?.stock || 0);

//           if (currentQty < stock) {
//             return {
//               ...product,
//               variant: {
//                 ...product.variant,
//                 quantity: currentQty + 1
//               }
//             };
//           } else {
//             toast.warning("⚠️ Maximum stock reached!");
//           }
//         }
//         return product;
//       })
//     );
//   }, []);

//   // Handle quantity decrement
//   const handleDecrement = useCallback((productId) => {
//     if (!productId) return;

//     setProducts(prevProducts =>
//       prevProducts.map(product => {
//         if (product._id === productId && (product.variant?.quantity || 0) > 0) {
//           return {
//             ...product,
//             variant: {
//               ...product.variant,
//               quantity: (product.variant.quantity || 0) - 1
//             }
//           };
//         }
//         return product;
//       })
//     );
//   }, []);

//   // Toggle show all shades for a product
//   const toggleShowAllShades = (productId) => {
//     setShowAllShades(prev => ({
//       ...prev,
//       [productId]: !prev[productId]
//     }));
//   };

//   // Open variant overlay - MODIFIED to accept variant type
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


//   // ===================== UPDATED ADD TO CART FUNCTION - FIXED DUPLICATE ENTRIES =====================
// const handleAddToCart = async (product) => {
//   if (!product) {
//     toast.error("⚠️ Product not loaded yet.");
//     return;
//   }

//   console.log("🛒 Starting add to cart for:", product.name, "with variant:", product.variant);

//   const productId = product._id;
//   if (!productId) {
//     toast.error("⚠️ Invalid product ID.");
//     return;
//   }

//   setAddingToCart(prev => ({ ...prev, [productId]: true }));

//   // Get the currently selected variant from the product
//   const selectedVariant = product.variant;
//   if (!selectedVariant) {
//     toast.error("⚠️ No variant selected.");
//     setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     return;
//   }

//   // Check if selected variant is in stock
//   const stock = parseInt(selectedVariant.stock || 0);
//   if (stock <= 0) {
//     toast.error("❌ This variant is out of stock.");
//     setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     return;
//   }

//   // Get variant identifier
//   const variantId = selectedVariant._id || selectedVariant.sku || `variant-${productId}`;
//   if (!variantId) {
//     toast.error("⚠️ This variant cannot be added to cart.");
//     setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     return;
//   }

//   // Prepare complete variant data for cart
//   const variantToAdd = {
//     // Essential identifiers
//     _id: variantId,
//     id: variantId,
//     sku: variantId,
//     variantId: variantId,
//     variantSku: variantId,

//     // Variant details
//     name: selectedVariant.variantName || selectedVariant.shadeName || selectedVariant.name || "Default",
//     shadeName: selectedVariant.shadeName || selectedVariant.name,
//     hex: selectedVariant.hex || product.hex || "#ccc",
//     color: selectedVariant.hex || product.hex || "#ccc",

//     // Prices
//     price: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//     originalPrice: parseFloat(selectedVariant.originalPrice || selectedVariant.mrp || product.mrp || 0),
//     discountedPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//     displayPrice: parseFloat(selectedVariant.displayPrice || selectedVariant.discountedPrice || selectedVariant.price || 0),
//     mrp: parseFloat(selectedVariant.mrp || product.mrp || 0),

//     // Stock and image
//     stock: stock,
//     image: selectedVariant.images?.[0] || selectedVariant.image || product.image || "/placeholder.png",
//     images: selectedVariant.images || [product.image || "/placeholder.png"],

//     // Additional variant info
//     ml: selectedVariant.ml,
//     size: selectedVariant.size,
//     weight: selectedVariant.weight,
//     variantType: selectedVariant.variantType || 'default',
//     variantDisplayText: selectedVariant.variantDisplayText || "Default",

//     // Quantity
//     quantity: parseInt(product.variant?.quantity || 1),

//     // Product reference
//     productId: productId,
//     productName: product.name,
//     product: product,
//     brandName: product.brandName,
//     brandId: product.brandId,

//     // Store for reference
//     rawVariant: selectedVariant
//   };

//   console.log("🚀 Final variant to add:", variantToAdd);

//   try {
//     let isLoggedIn = false;
//     let userId = null;

//     // Check if user is logged in
//     try {
//       const profileRes = await axios.get("https://beauty.joyory.com/api/user/profile", {
//         withCredentials: true
//       });
//       isLoggedIn = true;
//       userId = profileRes.data.user?._id;
//       console.log("👤 Logged-in user detected:", userId);
//     } catch {
//       console.log("👤 Guest user detected — using local cart");
//     }

//     // Cache the variant selection for future reference
//     const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//     cache[product._id] = variantToAdd;
//     localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//     const quantity = parseInt(product.variant?.quantity || 1);

//     // ===================== GUEST USER FLOW - FIXED =====================
//     if (!isLoggedIn || user?.guest) {
//       console.log("🛒 Guest cart process started...");

//       let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

//       // Check if same product with same variant already exists in cart
//       const existingIndex = guestCart.findIndex(
//         (item) =>
//           item.productId === product._id &&
//           item.variantId === variantToAdd.variantId
//       );

//       if (existingIndex >= 0) {
//         // Update quantity if variant already exists
//         const newQuantity = guestCart[existingIndex].quantity + quantity;
//         if (newQuantity <= stock) {
//           guestCart[existingIndex].quantity = newQuantity;
//           guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * newQuantity;
//           toast.success(`🛒 Updated quantity to ${newQuantity}`);
//         } else {
//           toast.warning(`⚠️ Only ${stock} items available in stock`);
//           guestCart[existingIndex].quantity = stock;
//           guestCart[existingIndex].totalPrice = guestCart[existingIndex].price * stock;
//         }
//       } else {
//         // Add new variant to cart
//         const cartItem = {
//           // Product info
//           productId: product._id,
//           productName: product.name,
//           productImage: variantToAdd.image,
//           brandName: product.brandName,
//           brandId: product.brandId,

//           // Variant info (CRITICAL FOR CART PAGE)
//           variantId: variantToAdd.variantId,
//           variantSku: variantToAdd.variantSku,
//           variantName: variantToAdd.name,
//           shadeName: variantToAdd.shadeName,
//           color: variantToAdd.color,
//           hex: variantToAdd.hex,
//           size: variantToAdd.size,
//           ml: variantToAdd.ml,
//           weight: variantToAdd.weight,
//           variantType: variantToAdd.variantType,
//           variantDisplayText: variantToAdd.variantDisplayText,

//           // Price and quantity
//           price: variantToAdd.price,
//           originalPrice: variantToAdd.originalPrice,
//           discountedPrice: variantToAdd.discountedPrice,
//           quantity: quantity,
//           totalPrice: variantToAdd.price * quantity,

//           // Stock
//           stock: variantToAdd.stock,

//           // Images
//           image: variantToAdd.image,
//           images: variantToAdd.images,

//           // Additional info
//           isGuest: true,
//           addedAt: new Date().toISOString(),

//           // Full objects for reference
//           product: {
//             _id: product._id,
//             name: product.name,
//             brandName: product.brandName,
//             description: product.description
//           },
//           variant: variantToAdd
//         };

//         guestCart.push(cartItem);
//         toast.success("🛒 Added to cart! Redirecting to cart...");
//       }

//       localStorage.setItem("guestCart", JSON.stringify(guestCart));
//       console.log("💾 Guest cart updated:", guestCart);

//       // REMOVED: Do NOT call addToCart from context here - it causes duplicate entries
//       // if (typeof addToCart === "function") {
//       //   addToCart(product, variantToAdd, quantity, true);
//       // }

//       // Reset quantity after adding to cart
//       setProducts(prevProducts =>
//         prevProducts.map(p => {
//           if (p._id === product._id) {
//             return {
//               ...p,
//               variant: {
//                 ...p.variant,
//                 quantity: 0
//               }
//             };
//           }
//           return p;
//         })
//       );

//       // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//       setTimeout(() => {
//         navigate("/Cartpage");
//       }, 1500); // Small delay so user sees toast

//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//       return; // CRITICAL: Return here to prevent further execution
//     }

//     // ===================== LOGGED-IN USER FLOW =====================
//     console.log("🔐 Logged-in user — sending to backend");

//     const payload = {
//       productId: product._id,
//       productName: product.name,
//       variants: [
//         {
//           variantId: variantToAdd.variantId,
//           variantSku: variantToAdd.variantSku,
//           quantity: quantity,
//           variantData: {
//             name: variantToAdd.name,
//             shadeName: variantToAdd.shadeName,
//             color: variantToAdd.color,
//             hex: variantToAdd.hex,
//             size: variantToAdd.size,
//             ml: variantToAdd.ml,
//             weight: variantToAdd.weight,
//             price: variantToAdd.price,
//             originalPrice: variantToAdd.originalPrice,
//             discountedPrice: variantToAdd.discountedPrice,
//             image: variantToAdd.image,
//             stock: variantToAdd.stock,
//             variantType: variantToAdd.variantType,
//             variantDisplayText: variantToAdd.variantDisplayText
//           }
//         },
//       ],
//     };

//     console.log("📦 Sending payload to backend:", payload);

//     const res = await axios.post(
//       "https://beauty.joyory.com/api/user/cart/add",
//       payload,
//       { withCredentials: true }
//     );

//     if (res.data.success) {
//       // REMOVED: Do NOT call addToCart from context here if you're already updating state elsewhere
//       // if (typeof addToCart === "function") {
//       //   addToCart(product, variantToAdd, quantity);
//       // }

//       // Reset quantity after adding to cart
//       setProducts(prevProducts =>
//         prevProducts.map(p => {
//           if (p._id === product._id) {
//             return {
//               ...p,
//               variant: {
//                 ...p.variant,
//                 quantity: 0
//               }
//             };
//           }
//           return p;
//         })
//       );

//       toast.success("✅ Product added to cart! Redirecting to cart...");

//       // AUTO REDIRECT TO CART PAGE AFTER SUCCESS
//       setTimeout(() => {
//         navigate("/Cartpage");
//       }, 1500); // Small delay so user sees toast

//     } else {
//       toast.error(res.data.message || "❌ Failed to add product.");
//       setAddingToCart(prev => ({ ...prev, [productId]: false }));
//     }
//   } catch (err) {
//     console.error("🔥 Add to Cart Error:", err);

//     // Check if it's already been added as guest (for 401 errors)
//     if (err.response?.status === 401) {
//       console.log("🔄 User is unauthorized, checking if already added to guest cart...");

//       // Check if item is already in guest cart
//       let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       const existingIndex = guestCart.findIndex(
//         (item) => item.productId === product._id && item.variantId === variantToAdd.variantId
//       );

//       if (existingIndex === -1) {
//         console.log("🔄 Adding to guest cart as fallback...");

//         // Add to guest cart only if not already present
//         const cartItem = {
//           productId: product._id,
//           productName: product.name,
//           variantId: variantToAdd.variantId,
//           variantSku: variantToAdd.variantSku,
//           variantName: variantToAdd.name,
//           variantDisplayText: variantToAdd.variantDisplayText,
//           price: variantToAdd.price,
//           quantity: parseInt(product.variant?.quantity || 1),
//           image: variantToAdd.image,
//           isGuest: true,
//           addedAt: new Date().toISOString()
//         };

//         guestCart.push(cartItem);
//         localStorage.setItem("guestCart", JSON.stringify(guestCart));

//         // REMOVED: Do NOT call addToCart from context
//         // if (typeof addToCart === "function") {
//         //   addToCart(product, variantToAdd, parseInt(product.variant?.quantity || 1), true);
//         // }

//         toast.success("🛒 Added to cart (Guest Mode)! Redirecting...");
//       } else {
//         console.log("✅ Item already exists in guest cart, not adding duplicate.");
//         toast.info("✅ Item already in cart! Redirecting...");
//       }

//       // Reset quantity
//       setProducts(prevProducts =>
//         prevProducts.map(p => {
//           if (p._id === product._id) {
//             return {
//               ...p,
//               variant: {
//                 ...p.variant,
//                 quantity: 0
//               }
//             };
//           }
//           return p;
//         })
//       );

//       // AUTO REDIRECT TO CART PAGE
//       setTimeout(() => {
//         navigate("/Cartpage");
//       }, 1500);

//     } else {
//       toast.error(err.response?.data?.message || "❌ Failed to add product to cart");
//     }
//     setAddingToCart(prev => ({ ...prev, [productId]: false }));
//   }
// };

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

//       const salesA = a.variant?.sales || 0;
//       const salesB = b.variant?.sales || 0;
//       return salesB - salesA;
//     });
//   }, []);

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

//   // ===================== Wishlist Functions =====================
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         if (user?.guest) {
//           const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
//           setWishlist(localWishlist);
//         } else {
//           const res = await axios.get("https://beauty.joyory.com/api/user/wishlist", {
//             withCredentials: true
//           });
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

//   // Toggle wishlist function
//   const toggleWishlist = async (productId) => {
//     try {
//       setWishlistLoading(prev => ({ ...prev, [productId]: true }));

//       // GUEST USER - Handle local storage
//       if (user?.guest) {
//         let updated = [...wishlist];
//         if (updated.includes(productId)) {
//           updated = updated.filter((id) => id !== productId);
//           toast.success("Removed from wishlist (guest mode)");
//         } else {
//           updated.push(productId);
//           toast.success("Added to wishlist (guest mode)");
//         }
//         setWishlist(updated);
//         localStorage.setItem("guestWishlist", JSON.stringify(updated));
//         setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//         return;
//       }

//       // LOGGED-IN USER - Make API call
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
//       }
//     } catch (err) {
//       console.error("Wishlist API error:", err);
//       toast.error("Failed to update wishlist");
//     } finally {
//       setWishlistLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized";
//       const res = await axios.get(apiUrl, { withCredentials: true });
//       const json = res.data;

//       console.log("📦 API Response:", json);

//       let data = [];

//       if (json?.success && Array.isArray(json.sections)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json?.products)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (json?.data && Array.isArray(json.data)) {
//         data = transformProducts(json.data);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       }

//       console.log("✅ Processed products:", data.length);
//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching recommendations:", err);
//       setError("Couldn't load recommendations. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
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

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   // Group variants by type for the overlay
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

//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />
//       {/* <h2 className="font-familys fw-bold text-center mt-3 mb-4 mb-lg-5 mt-lg-5 spacing"> */}
//       <h2 className="font-familys text-start foryou-heading ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 spacing">
//         Recommended For You
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2">Loading recommendations...</p>
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

//       {memoizedProducts.length > 0 ? (
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
//               const hasOnlyOneVariant = variantAnalysis.hasOnlyOneVariant;
//               const variantsToShow = item.allVariants || [];

//               // Get variant color indicator - dynamic
//               const variantColor = variant.hex || "#000000";
//               const hasValidHex = isValidHexColor(variantColor);
//               const variantType = variant.variantType || 'default';
//               const variantDisplayText = variant.variantDisplayText || "Default";

//               // Check if product is in wishlist
//               const isWishlisted = wishlist.includes(item._id);

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

//               return (
//                 <SwiperSlide key={item.uniqueId}>
//                   <div className="foryou-card-wrapper">
//                     <div className="foryou-card">
//                       {/* Product Image with Overlays - UPDATED TO USE SLUG */}
//                       <div
//                         className="foryou-img-wrapper"
//                         onClick={() => handleProductClick(item)} // Changed to use handleProductClick
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
//                         <div className="justify-content-between d-flex flex-column" style={{height:'360px'}}>

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

//                         {/* Product Name - Also clickable for navigation */}
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
//                             {hasVariants && variantsToShow.length > 0 && (
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

//                             {hasVariants && variantAnalysis.availableVariants.length === 0 && (
//                               <div className="no-variant-available small text-danger">
//                                 <i className="bi bi-exclamation-triangle me-1"></i>
//                                 All variants are out of stock
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {/* Price Section */}
//                         <div className="price-section mb-3">
//                           <div className="d-flex align-items-baseline">
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

//                         {/* Stock Info */}
//                         {/* {variant.status === "inStock" && variant.stock && variant.stock < 10 && (
//                           <div className="stock-warning small text-warning mt-1">
//                             <i className="bi bi-exclamation-triangle me-1"></i>
//                             Only {variant.stock} left in stock!
//                           </div>
//                         )} */}

//                         </div>
//                       </div>
//                     </div>

//                     {/* Variant Overlay - UPDATED TO SHOW ALL VARIANTS */}
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
//                                                   boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 3px #000000' : 'none'
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

// export default Foryou;









// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/Foryou.css";
// import "../App.css";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import bagIcon from "../assets/bag.svg";
// import { FaChevronDown } from "react-icons/fa";
// import { FaHeart, FaRegHeart } from "react-icons/fa";

// // Wishlist cache key
// const WISHLIST_CACHE_KEY = "guestWishlist";

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

// const Foryou = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
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
//   const getBrandName = useCallback((brand) => {
//     if (!brand) return "Unknown Brand";
//     if (typeof brand === 'string') {
//       const brandMap = {};
//       return brandMap[brand] || brand || "Unknown Brand";
//     }
//     if (brand && typeof brand === 'object') {
//       if (brand.name && typeof brand.name === 'string') {
//         return brand.name;
//       }
//       if (brand._id) {
//         const brandMap = {};
//         return brandMap[brand._id] || brand._id || "Unknown Brand";
//       }
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
//         const guestWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];

//         if (currentlyInWishlist) {
//           // Remove from wishlist
//           const updatedWishlist = guestWishlist.filter(item => 
//             !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(updatedWishlist));
//           toast.success("Removed from wishlist!");
//         } else {
//           // Add to wishlist with complete product data
//           const productData = {
//             _id: productId,
//             name: prod.name,
//             brand: getBrandName(prod.brand),
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
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
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

//   // Helper to get variant display type (color, size, ml, etc.)
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
//     const brandName = getBrandName(product.brand);

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
//       allVariants: [...allVariants].filter(v => v)
//     };
//   }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

//   // Handle variant selection
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

//   // ===================== UPDATED ADD TO CART FUNCTION =====================
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
//         const profileRes = await axios.get("https://beauty.joyory.com/api/user/profile", {
//           withCredentials: true
//         });
//         isLoggedIn = true;
//       } catch {}

//       // Cache the variant selection for future reference
//       const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//       cache[product._id] = variantToAdd;
//       localStorage.setItem("cartVariantCache", JSON.stringify(cache));

//       const quantity = parseInt(product.variant?.quantity || 1);

//       // ===================== GUEST USER FLOW =====================
//       if (!isLoggedIn || user?.guest) {
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

//       // ===================== LOGGED-IN USER FLOW =====================
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

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized";
//       const res = await axios.get(apiUrl, { withCredentials: true });
//       const json = res.data;

//       let data = [];
//       if (json?.success && Array.isArray(json.sections)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json?.products)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (json?.data && Array.isArray(json.data)) {
//         data = transformProducts(json.data);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       }

//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching recommendations:", err);
//       setError("Couldn't load recommendations. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
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

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="font-familys text-start foryou-heading ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 spacing">
//         Recommended For You
//       </h2>

//       {loading && (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted mt-2">Loading recommendations...</p>
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

//       {memoizedProducts.length > 0 ? (
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
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '360px' }}>
//                           {/* Rating */}
//                           <div className="ratings mb-0 mt-2">
//                             <div className="d-flex align-items-center">
//                               <div className="star-rating gap-3">
//                                 {[...Array(5)].map((_, i) => (
//                                   <i
//                                     style={{ marginLeft: '4px' }}
//                                     key={i}
//                                     className={`bi ${item.avgRating > 0 && i < Math.floor(item.avgRating)
//                                         ? 'bi-star-fill text-warning'
//                                         : 'bi-star text-muted'
//                                       }`}
//                                   ></i>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>

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
//                               {hasVariants && variantsToShow.length > 0 && (
//                                 <>
//                                   {/* Color Variants Section */}
//                                   {hasColorVariants && (
//                                     <div className="color-variants-section">
//                                       <p className="variant-label text-muted small mb-2">
//                                         Select Color:
//                                       </p>
//                                       <div className="variant-list d-flex flex-wrap gap-2 ms-1 align-items-center" >
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
//                                                     ✓
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
//                                                 backgroundColor: "#f5f5f5",
//                                                 border: "1px solid #ddd",
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
//                                                 backgroundColor: "#f5f5f5",
//                                                 border: "1px solid #ddd",
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
//                               <span className="current-price fw-bold fs-5">
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

//                           {/* Add to Cart with Quantity */}
//                           <div className="cart-section">
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 className={`w-100 ${variant.status === "inStock"} btn-add-cart`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   if (variant.status !== "inStock") {
//                                     toast.info("This variant is out of stock. Please select another variant.");
//                                     return;
//                                   }
//                                   handleAddToCart(item);
//                                 }}
//                                 disabled={variant.status !== "inStock" || addingToCart[item._id]}
//                               >
//                                 {addingToCart[item._id] ? (
//                                   <>
//                                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                     Adding...
//                                   </>
//                                 ) : variant.status !== "inStock" ? (
//                                   <>
//                                     <i className="bi bi-x-circle me-1"></i>
//                                     Out of Stock
//                                   </>
//                                 ) : (
//                                   <>
//                                     Add to Bag
//                                     <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px' }} alt="Bag-icons" />
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
//                                         <div className="page-title-main-name"
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
//                                         <div className="small page-title-main-name" style={{fontSize:'12px'}}>
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

// export default Foryou;




















//===============================================================================================(Done-Code(Start))====================================================== 



// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/Foryou.css";
// import "../App.css";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import tick from "../assets/tick.svg";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import bagIcon from "../assets/bag.svg";
// import { FaChevronDown } from "react-icons/fa";
// import { FaHeart, FaRegHeart } from "react-icons/fa";

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

// const Foryou = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
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
//   const location = useLocation();
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
//         navigate("/login", { state: { from: location.pathname } });
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
//               _id: variant._id || variant.sku || `variant-${Date.now()}`
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

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized";
//       // const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized";
//       const res = await axios.get(apiUrl, { withCredentials: true });
//       const json = res.data;

//       let data = [];
//       if (json?.success && Array.isArray(json.sections)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json?.products)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (json?.data && Array.isArray(json.data)) {
//         data = transformProducts(json.data);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       }

//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching recommendations:", err);
//       setError("Couldn't load recommendations. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
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

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="font-familys text-start foryou-heading ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
//         Recommended For You
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
//           <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
//             Retry
//           </button>
//         </div>
//       )}

//       {memoizedProducts.length > 0 ? (
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
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
//                           {/* Rating */}
//                           {/* <div className="ratings mb-0 mt-2">
//                             <div className="d-flex align-items-center">
//                               <div className="star-rating gap-3">
//                                 {[...Array(5)].map((_, i) => (
//                                   <i
//                                     style={{ marginLeft: '4px' }}
//                                     key={i}
//                                     className={`bi ${item.avgRating > 0 && i < Math.floor(item.avgRating)
//                                         ? 'bi-star-fill text-warning'
//                                         : 'bi-star text-muted'
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
//                               {hasVariants && variantsToShow.length > 0 && (
//                                 <>
//                                   {/* Color Variants Section */}
//                                   {hasColorVariants && (
//                                     <div className="color-variants-section">
//                                       <p className="variant-label text-muted small mb-2">
//                                         Select Color:
//                                       </p>
//                                       <div className="variant-list d-flex flex-wrap gap-2 ms-1 align-items-center" >
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
//                                                     <img src={tick} style={{width:'20px'}} alt="Image-Not-Found" />
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
//                                         <div className="small page-title-main-name" style={{fontSize:'12px'}}>
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
//           <button className="btn btn-primary mt-2" onClick={fetchProducts}>
//             Refresh
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Foryou;



































// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/Foryou.css";
// import "../App.css";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import tick from "../assets/tick.svg";
// import { UserContext } from "./UserContext.jsx";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import bagIcon from "../assets/bag.svg";
// import { FaChevronDown } from "react-icons/fa";
// import { FaHeart, FaRegHeart } from "react-icons/fa";

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

// const Foryou = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
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
//   const location = useLocation();
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
//         navigate("/login", { state: { from: location.pathname } });
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
//               _id: variant._id || variant.sku || `variant-${Date.now()}`
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

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized";
//       // const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized";
//       const res = await axios.get(apiUrl, { withCredentials: true });
//       const json = res.data;

//       let data = [];
//       if (json?.success && Array.isArray(json.sections)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json?.products)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (Array.isArray(json)) {
//         data = transformProducts(json);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       } else if (json?.data && Array.isArray(json.data)) {
//         data = transformProducts(json.data);
//         data = removeDuplicates(data);
//         data = sortProducts(data);
//         data = data.slice(0, 15);
//       }

//       setProducts(data);
//     } catch (err) {
//       console.error("❌ Error fetching recommendations:", err);
//       setError("Couldn't load recommendations. Please try again later.");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
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

//   // Memoized product display to prevent unnecessary re-renders
//   const memoizedProducts = useMemo(() => products, [products]);

//   return (
//     <div className="container-fluid my-4 position-relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="font-familys text-start foryou-heading ms-lg-5 ps-lg-4 mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
//         Recommended For You
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
//           <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchProducts}>
//             Retry
//           </button>
//         </div>
//       )}

//       {memoizedProducts.length > 0 ? (
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
//                         <div className="justify-content-between d-flex flex-column" style={{ height: '260px' }}>
//                           {/* Rating */}
//                           {/* <div className="ratings mb-0 mt-2">
//                             <div className="d-flex align-items-center">
//                               <div className="star-rating gap-3">
//                                 {[...Array(5)].map((_, i) => (
//                                   <i
//                                     style={{ marginLeft: '4px' }}
//                                     key={i}
//                                     className={`bi ${item.avgRating > 0 && i < Math.floor(item.avgRating)
//                                         ? 'bi-star-fill text-warning'
//                                         : 'bi-star text-muted'
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
//                               {hasVariants && variantsToShow.length > 0 && (
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

//                           {/* Add to Cart Button - UPDATED: Show Select Variant first, then Add to Bag */}
//                           <div className="cart-section">
//                             <div className="d-flex align-items-center justify-content-between">
//                               <button
//                                 className={`w-100 ${variant.status === "inStock"} btn-add-cart`}
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
//                                         <div className="small page-title-main-name" style={{fontSize:'12px'}}>
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
//           <button className="btn btn-primary mt-2" onClick={fetchProducts}>
//             Refresh
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Foryou;











import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/Foryou.css";
import "../css/BestSellers.css";
import "../App.css";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import tick from "../assets/tick.svg";  
import { UserContext } from "./UserContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bagIcon from "../assets/bag.svg";
import { FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";

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

const Foryou = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});

  // ===================== WISHLIST STATES =====================
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  // ===================== END WISHLIST STATES =====================

  // ===================== OUT OF STOCK POPUP STATE =====================
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");
  // ===================== END OUT OF STOCK POPUP STATE =====================

  const [showAllShades, setShowAllShades] = useState({});
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("color");

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // Helper to get product slug safely
  const getProductSlug = useCallback((product) => {
    if (!product) return null;

    // First check if product has slugs array (from backend)
    if (product.slugs && Array.isArray(product.slugs) && product.slugs.length > 0) {
      return product.slugs[0]; // Use first slug from array
    }

    // If no slugs array, check for slug field directly
    if (product.slug) {
      return product.slug;
    }

    // Fallback: use product ID
    return product._id;
  }, []);

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

  // Toast Utility (similar to ProductPage)
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

  // ✅ Check if specific product variant is in wishlist
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;

    // Check in wishlistData
    return wishlistData.some(item =>
      (item.productId === productId || item._id === productId) &&
      item.sku === sku
    );
  };

  // ✅ Fetch full wishlist data
  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        // For logged-in users: Fetch from API
        const response = await axios.get(
          "https://beauty.joyory.com/api/user/wishlist",
          { withCredentials: true }
        );
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        // For guests: Get from localStorage
        const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        // Convert guest wishlist to match API structure
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

  // ✅ Toggle wishlist function (same as ProductPage)
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

  // ✅ Initial fetch of wishlist data
  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  // Helper to get variant display type (color, size, ml, etc.)
  const getVariantType = useCallback((variant) => {
    if (!variant) return 'default';
    if (variant.hex && isValidHexColor(variant.hex)) return 'color';
    if (variant.shadeName) return 'shade';
    if (variant.size) return 'size';
    if (variant.ml) return 'ml';
    if (variant.weight) return 'weight';
    return 'default';
  }, []);

  // Helper function to get complete product data for display
  const getProductDisplayData = useCallback((product) => {
    if (!product) return null;

    // Get all available variants
    const allVariants = Array.isArray(product.variants) ? product.variants :
      Array.isArray(product.shadeOptions) ? product.shadeOptions : [];

    // Find available variant (in stock first)
    const availableVariants = allVariants.filter(v => v && (parseInt(v.stock || 0) > 0));
    const defaultVariant = allVariants[0] || {};

    // Check if we have a selected variant stored for this product
    const storedVariant = selectedVariants[product._id];

    // Choose the best variant
    let selectedVariant = storedVariant ||
      product.selectedVariant ||
      (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

    // If stored variant doesn't exist or is out of stock, fallback
    if (storedVariant) {
      const storedStock = parseInt(storedVariant.stock || 0);
      if (storedStock <= 0 && availableVariants.length > 0) {
        selectedVariant = availableVariants[0];
      }
    }

    // Get image with priority
    let image = "";
    const getVariantImage = (variant) => {
      return variant?.images?.[0] || variant?.image;
    };

    image = getVariantImage(selectedVariant) ||
      getVariantImage(availableVariants[0]) ||
      getVariantImage(defaultVariant) ||
      product.image ||
      "";

    // Get prices safely
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

    // Calculate discount percentage if not provided
    let discountPercent = parseFloat(
      selectedVariant.discountPercent ||
      product.discountPercent ||
      0
    );

    if (!discountPercent && originalPrice > displayPrice) {
      discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    }

    // Get variant name
    const variantName = getVariantName(selectedVariant);
    const variantType = getVariantType(selectedVariant);
    const variantDisplayText = getVariantDisplayText(selectedVariant);

    const stock = parseInt(selectedVariant.stock || product.stock || 0);
    const status = stock > 0 ? "inStock" : "outOfStock";
    const sku = selectedVariant.sku || product.sku || "";

    // Get brand name safely
    const brandName = getBrandName(product);

    // Get product slug
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
        stock,
        status,
        sku,
        variantType,
        _id: selectedVariant._id || ""
      },
      image,
      // Product-level data
      brandId: product.brand,
      avgRating: parseFloat(product.avgRating || 0),
      totalRatings: parseInt(product.totalRatings || 0),
      // All variants available
      allVariants: [...allVariants].filter(v => v),
      variants: allVariants, // For compatibility with handleAddToCart
      isCompletelyOutOfStock: allVariants.length > 0 && availableVariants.length === 0
    };
  }, [selectedVariants, getBrandName, getVariantName, getVariantType, getProductSlug]);

  // ===================== UPDATED ADD TO CART - SAME AS PRODUCT PAGE ====================
  const handleAddToCart = async (prod, forceVariant = null) => {
    setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVariants = variants.length > 0;
      let payload;

      if (hasVariants) {
        const selectedVariant = forceVariant || selectedVariants[prod._id] || (variants.find((v) => v.stock > 0) || variants[0]);
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

        // Cache selected variant (only for products with variants)
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = selectedVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        // Non-variant product
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }

        payload = {
          productId: prod._id,
          quantity: 1,
        };

        // Clear cache for non-variant products
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[prod._id];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      // Add to cart via backend (works for both logged-in and guest via session)
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

  // Handle variant selection
  const handleVariantSelect = useCallback((productId, variant) => {
    if (!productId || !variant) return;

    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));

    // Update the products state to reflect the new selected variant
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

  // Toggle show all shades for a product
  const toggleShowAllShades = (productId) => {
    setShowAllShades(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Open variant overlay
  const openVariantOverlay = (productId, variantType = "all", e) => {
    if (e) e.stopPropagation();
    setSelectedVariantType(variantType);
    setShowVariantOverlay(productId);
  };

  // Close variant overlay
  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
    setTempSelectedVariants({});
  };

  // Handle product click - Navigate using slug
  const handleProductClick = useCallback((product) => {
    if (!product) return;

    // Get the product slug (from slugs array or fallback to ID)
    const slug = product.slug || product._id;

    if (slug) {
      navigate(`/product/${slug}`);
    }
  }, [navigate]);

  // Remove duplicates by product ID
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

  // Sort products by criteria
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

  // Transform backend data - merge all sections
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

  // Optimized variant analysis for each product
  const getVariantAnalysis = useCallback((product) => {
    if (!product) return { hasVariants: false, availableVariants: [] };
    const allVariants = product.allVariants || [];
    const availableVariants = allVariants.filter(v => v && parseInt(v.stock || 0) > 0);

    // Analyze variant types
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

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized";
      const apiUrl = "https://beauty.joyory.com/api/user/recommendations/personalized?section=manual";
      const res = await axios.get(apiUrl, { withCredentials: true });
      const json = res.data;

      let data = [];
      if (json?.success && Array.isArray(json.sections)) {
        data = transformProducts(json);
        data = removeDuplicates(data);
        data = sortProducts(data);
        data = data.slice(0, 15);
      } else if (Array.isArray(json?.products)) {
        data = transformProducts(json);
        data = removeDuplicates(data);
        data = sortProducts(data);
        data = data.slice(0, 15);
      } else if (Array.isArray(json)) {
        data = transformProducts(json);
        data = removeDuplicates(data);
        data = sortProducts(data);
        data = data.slice(0, 15);
      } else if (json?.data && Array.isArray(json.data)) {
        data = transformProducts(json.data);
        data = removeDuplicates(data);
        data = sortProducts(data);
        data = data.slice(0, 15);
      }

      setProducts(data);
    } catch (err) {
      console.error("❌ Error fetching recommendations:", err);
      setError("Couldn't load recommendations. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Format price with Indian Rupee symbol
  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // Memoized product display to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="container-fluid my-4 position-relative margin-left-rights">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      <h2 className="font-familys text-start foryou-heading ms-lg-3 ps-lg-4 ms-1 mt-3 mb-2 mb-lg-4 mt-lg-5 spacing fw-normal">
        Recommended For You
      </h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2 page-title-main-name fs-4 text-black">Loading recommendations...</p>
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

      {memoizedProducts.length > 0 ? (
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
            className="foryou-swiper"
          >
            {memoizedProducts.map((item) => {
              if (!item) return null;

              const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || item.variant || {};
              const allVariants = item.allVariants || [];

              let imageUrl = "https://placehold.co/400x300/ffffff/cccccc?text=Product";
              if (item.image) {
                imageUrl = item.image.startsWith("http")
                  ? item.image
                  : `https://res.cloudinary.com/dekngswix/image/upload/${item.image}`;
              }

              const hasVariants = allVariants.length > 0;
              const selectedSku = getSku(displayVariant);
              const isProductInWishlist = isInWishlist(item._id, selectedSku);
              const groupedVariants = groupVariantsByType(allVariants);
              const isCompletelyOutOfStock = item.isCompletelyOutOfStock || false;
              const isCurrentVariantOutOfStock = displayVariant.stock <= 0;
              const isAdding = addingToCart[item._id];
              const showOutOfStock = isCompletelyOutOfStock && !hasVariants;
              const showSelectVariantButton = hasVariants && allVariants.length > 1;
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

              return (
                <SwiperSlide key={item.uniqueId}>
                  <div className="foryou-card-wrapper">
                    <div className="foryou-card">
                      <div
                        className="foryou-img-wrapper"
                        onClick={() => {
                          if (showOutOfStock) {
                            handleOutOfStockClick(item.name);
                          } else {
                            handleProductClick(item);
                          }
                        }}
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
                          style={{
                            opacity: showOutOfStock ? 0.6 : 1,
                            filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
                          }}
                        />

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

                        {!showOutOfStock && (
                          <button className="bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (displayVariant) {
                                toggleWishlist(item, displayVariant);
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
                      </div>

                      <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0" >
                        <div className="justify-content-between d-flex flex-column"
                          style={{ height: '200px' }}>
                          <div className="brand-name small text-muted text-start mb-1 mt-2">
                            {typeof item.brandName === 'string' ? item.brandName : "Unknown Brand"}
                          </div>
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
                            {(() => {
                              const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                              const nameStr = item.name || "Unnamed Product";
                              return varText && varText.toUpperCase() !== "DEFAULT" ? `${nameStr} - ${varText}` : nameStr;
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
                          <div className="price-section mb-3 mt-auto">
                            <div className="d-flex align-items-baseline flex-wrap">
                              <span
                                className="current-price fw-400 fs-5"
                                style={{
                                  textDecoration: showOutOfStock ? 'line-through' : 'none',
                                  opacity: showOutOfStock ? 0.6 : 1,
                                }}
                              >
                                {formatPrice(displayVariant.displayPrice)}
                              </span>
                              {displayVariant.originalPrice > displayVariant.displayPrice && !showOutOfStock && (
                                <>
                                  <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                    {formatPrice(displayVariant.originalPrice)}
                                  </span>
                                  <span className="discount-percent text-danger fw-bold ms-2">
                                    ({displayVariant.discountPercent || 0}% OFF)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
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
                            {groupedVariants.color.length > 0 && (
                              <div className="d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
                                {groupedVariants.color.map((v) => {
                                  const sel = tempSelectedVariants[item._id]?.sku === v.sku || displayVariant.sku === v.sku;
                                  const oosV = v.stock <= 0;
                                  return (
                                    <div
                                      key={v.sku || v._id}
                                      style={{ cursor: oosV ? "not-allowed" : "pointer", position: "relative" }}
                                      onClick={() => {
                                        if (!oosV) {
                                          handleVariantSelect(item._id, v);
                                          setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
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

                            {groupedVariants.text.length > 0 && (
                              <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                                {groupedVariants.text.map((v) => {
                                  const sel = tempSelectedVariants[item._id]?.sku === v.sku || displayVariant.sku === v.sku;
                                  const oosV = v.stock <= 0;
                                  return (
                                    <div
                                      key={v.sku || v._id}
                                      className="variant-text-item"
                                      style={{ cursor: oosV ? "not-allowed" : "pointer" }}
                                      onClick={() => {
                                        if (!oosV) {
                                          handleVariantSelect(item._id, v);
                                          setTempSelectedVariants(prev => ({ ...prev, [item._id]: v }));
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
                                onClick={(e) => { e.stopPropagation(); handleProductClick(item); }} 
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
                                const chosen = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                                if (chosen) {
                                  handleVariantSelect(item._id, chosen);
                                }
                                await handleAddToCart(item, chosen);
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
                                    <img src={bagIcon} alt="Bag" className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} />
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
          <button className="btn btn-primary mt-2" onClick={fetchProducts}>
            Refresh
          </button>
        </div>
      )}

      {showVariantOverlay && (() => {
        const item = memoizedProducts.find(p => p._id === showVariantOverlay);
        if (!item) return null;
        const allVariants = item.allVariants || [];
        const displayVariant = tempSelectedVariants[item._id] || selectedVariants[item._id] || item.variant || {};
        const groupedVariants = groupVariantsByType(allVariants);
        const isAdding = addingToCart[item._id];
        const isCurrentVariantOutOfStock = displayVariant.stock <= 0;
        const hasColorVariants = groupedVariants.color.length > 0;
        const hasTextVariants = groupedVariants.text.length > 0;

        return (
          <>
            <div className="mobile-sheet-backdrop" onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }} />
            <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-sheet-grabber" onClick={closeVariantOverlay} style={{ cursor: 'pointer' }} />
              <div className="mobile-sheet-header">
                <h3 className="mobile-sheet-title">
                  {hasColorVariants ? "Select Shade" : "Select Variant"}
                </h3>
                <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
                  &times;
                </button>
              </div>
              <div className="mobile-sheet-body">
                {hasColorVariants && (
                  <div className="mobile-sheet-variants-grid">
                    {groupedVariants.color.map((v) => {
                      const isSelected = displayVariant.sku === v.sku;
                      const isOutOfStock = (v.stock ?? 0) <= 0;
                      return (
                        <div key={getSku(v) || v._id} className={`mobile-sheet-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`} onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) { handleVariantSelect(item._id, v); setTempSelectedVariants(prev => ({ ...prev, [item._id]: v })); } }}>
                          <div className={`mobile-sheet-color-circle ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`} style={{ backgroundColor: v.hex || "#ccc" }}>
                            {isSelected && (<FaCheck className="mobile-sheet-check-icon" />)}
                          </div>
                          <span className="mobile-sheet-variant-text">{getVariantDisplayText(v)}</span>
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
                      return (
                        <div key={getSku(v) || v._id} className="mobile-sheet-variant-item" onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) { handleVariantSelect(item._id, v); setTempSelectedVariants(prev => ({ ...prev, [item._id]: v })); } }}>
                          <button className={`mobile-sheet-text-pill ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}>
                            <span>{getVariantDisplayText(v)}</span>
                            {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="mobile-sheet-footer">
                <div className="mobile-sheet-footer-left">
                  <span className="mobile-sheet-selected-label">{getVariantDisplayText(displayVariant)}</span>
                  <div className="mobile-sheet-price-row">
                    <span className="mobile-sheet-current-price">{formatPrice(displayVariant.displayPrice)}</span>
                    {displayVariant.originalPrice > displayVariant.displayPrice && (
                      <>
                        <span className="mobile-sheet-original-price">{formatPrice(displayVariant.originalPrice)}</span>
                        <span className="mobile-sheet-discount">({displayVariant.discountPercent || 0}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="mobile-sheet-view-details" onClick={(e) => { e.stopPropagation(); handleProductClick(item); closeVariantOverlay(); }}>View Details</span>
              </div>
              <div className="mobile-sheet-action-wrap">
                <button className="mobile-sheet-btn-add" disabled={isAdding || isCurrentVariantOutOfStock} onClick={async (e) => { e.stopPropagation(); const chosen = tempSelectedVariants[item._id] || selectedVariants[item._id] || (allVariants.find((v) => v.stock > 0) || allVariants[0]); if (chosen) { handleVariantSelect(item._id, chosen); } await handleAddToCart(item, chosen); closeVariantOverlay(); }}>
                  {isAdding ? (<><span className="spinner-border spinner-border-sm" role="status"></span> Adding...</>) : isCurrentVariantOutOfStock ? "Out of Stock" : "Add to Bag"}
                </button>
              </div>
            </div>
          </>
        );
      })()}

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
    </div>
  );
};

export default Foryou;

//===============================================================================================(Done-Code(End))====================================================== 
