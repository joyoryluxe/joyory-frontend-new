// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/cartpage.css";
// import { CartContext } from "../Context/Cartcontext";
// import { FaTimes } from "react-icons/fa";
// import { Modal, Button, Alert } from "react-bootstrap";

// const API_BASE = "https://beauty.joyory.com/api/user/cart";
// const INITIATE_ORDER_API = `${API_BASE}/order/initiate`;
// const VARIANT_CACHE_KEY = "cartVariantCache";

// // ---------- cache helpers ----------
// const readVariantFromCache = (cartItemId) => {
//   try {
//     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//     return cache[cartItemId] || null;
//   } catch {
//     return null;
//   }
// };

// const removeVariantFromCache = (cartItemId) => {
//   try {
//     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//     delete cache[cartItemId];
//     localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));
//   } catch { }
// };

// // ---------- component ----------
// const CartPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { syncCartFromBackend } = useContext(CartContext);
//   const [cartData, setCartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initiating, setInitiating] = useState(false);
//   const [stockError, setStockError] = useState("");

//   // 🔘 Confirm remove modal state
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [itemToRemove, setItemToRemove] = useState(null);

//   // modal handlers
//   const handleShowConfirm = (item) => {
//     setItemToRemove(item);
//     setShowConfirm(true);
//   };

//   const handleCloseConfirm = () => {
//     setShowConfirm(false);
//     setItemToRemove(null);
//   };

//   const handleConfirmRemove = () => {
//     if (itemToRemove) {
//       handleRemoveByProductId(
//         itemToRemove.productId,
//         itemToRemove.selectedVariant?.sku
//       );
//     }
//     handleCloseConfirm();
//   };

//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageColor, setCouponMessageColor] = useState("info");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [activeCouponTab, setActiveCouponTab] = useState("available");
//   const [manualCoupon, setManualCoupon] = useState("");

//   // --------------------------------------------------
//   // 1.  fetch cart  (guest + logged-in) - FIXED
//   // --------------------------------------------------
//   const fetchCart = async (discountCode = null) => {
//     try {
//       setLoading(true);
//       const tokenExists = document.cookie.includes("token=");
//       const isGuest = !tokenExists;

//       // normalize helper - FIXED for guest cart
//       const normalizeCart = (cartArray = [], isGuestCart = false) => {
//         return cartArray.map((item, index) => {
//           // For guest cart, handle different structure
//           let variant, product, price, originalPrice, name, brand, image;

//           if (isGuestCart) {
//             // Guest cart structure from localStorage
//             variant = item.variant || {};
//             product = item.product || {};
//             price = variant.discountedPrice || variant.displayPrice || item.price || 0;
//             originalPrice = variant.originalPrice || variant.mrp || product.mrp || price;
//             name = item.name || product.name || "Unnamed Product";
//             brand = getBrandName(product) || item.brand || "";
//             image = variant.images?.[0] || variant.image || product.images?.[0] || item.image || "/placeholder.png";
//           } else {
//             // Logged-in cart structure from API
//             variant = item.selectedVariant || item.variant || {};
//             product = item.product || {};
//             price = variant.displayPrice || item.displayPrice || variant.price || 0;
//             originalPrice = variant.originalPrice || item.originalPrice || price;
//             name = item.name || product.name || "Unnamed Product";
//             brand = item.brand || getBrandName(product) || "";
//             image = variant.image || product.images?.[0] || item.image || "/placeholder.png";
//           }

//           const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
//           const quantity = item.quantity || 1;
//           const discounts = discountPercent > 0 ? [
//             {
//               type: "Discount",
//               amount: originalPrice - price,
//               note: `${discountPercent}% Off`,
//             },
//           ] : [];

//           // Generate unique ID for guest items
//           const cartItemId = isGuestCart
//             ? `${item.productId || product._id}-${variant.sku || variant._id || index}-guest`
//             : item.cartItemId || item._id || item.id || item.productId;

//           return {
//             cartItemId,
//             productId: item.productId || product._id || item.product || variant.productId,
//             name,
//             image,
//             brand,
//             selectedVariant: variant,
//             quantity,
//             price,
//             subTotal: price * quantity,
//             discounts,
//             stockStatus: item.stockStatus || (variant.stock > 0 ? "in_stock" : "out_of_stock"),
//             stockMessage: item.stockMessage || (variant.stock <= 0 ? "Out of stock" : ""),
//             canCheckout: item.canCheckout !== false && (variant.stock > 0 || variant.stock === undefined),
//           };
//         });
//       };

//       const getBrandName = (product) => {
//         if (!product?.brand) return "";
//         if (typeof product.brand === "object") return product.brand.name || "";
//         return product.brand;
//       };

//       // ------------------------------
//       // GUEST cart - FIXED
//       // ------------------------------
//       if (isGuest) {
//         console.log("🛒 Guest mode — loading from localStorage");
//         const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

//         if (!guestCart.length) {
//           console.log("🛒 Guest cart is empty");
//           setCartData({
//             cart: [],
//             taxableAmount: 0,
//             gstRate: "0%",
//             gstAmount: 0,
//             gstMessage: "",
//             totalSavings: 0,
//             savingsMessage: "",
//           });
//           setLoading(false);
//           return;
//         }

//         console.log("🛒 Guest cart items:", guestCart);
//         const normalizedCart = normalizeCart(guestCart, true);
//         console.log("🛒 Normalized guest cart:", normalizedCart);

//         const bagMrp = normalizedCart.reduce(
//           (sum, i) => {
//             const original = i.selectedVariant?.originalPrice || i.selectedVariant?.mrp || i.price || 0;
//             return sum + original * i.quantity;
//           },
//           0
//         );

//         const bagDiscount = normalizedCart.reduce(
//           (sum, i) => {
//             const original = i.selectedVariant?.originalPrice || i.selectedVariant?.mrp || i.price || 0;
//             return sum + (original - i.price) * i.quantity;
//           },
//           0
//         );

//         const taxableAmount = bagMrp - bagDiscount;
//         const gstRate = "18%";
//         const gstAmount = taxableAmount * 0.18;
//         const payable = taxableAmount + gstAmount;

//         setCartData({
//           cart: normalizedCart,
//           bagMrp,
//           bagDiscount,
//           autoDiscount: 0,
//           couponDiscount: 0,
//           shipping: 0,
//           taxableAmount,
//           gstRate,
//           gstAmount,
//           gstMessage: `Includes ${gstRate} GST (₹${gstAmount.toFixed(2)})`,
//           payable,
//           appliedCoupon: null,
//           applicableCoupons: [],
//           inapplicableCoupons: [],
//           promotions: [],
//           pointsToUse: 0,
//           giftCardApplied: null,
//           grandTotal: payable,
//           totalSavings: bagDiscount,
//           savingsMessage: `🎉 You saved ₹${bagDiscount.toFixed(2)} on this order!`,
//         });
//         return;
//       }

//       // ------------------------------
//       // LOGGED-IN cart
//       // ------------------------------
//       const url = discountCode
//         ? `${API_BASE}/summary?discount=${discountCode}`
//         : `${API_BASE}/summary`;
//       const res = await fetch(url, { credentials: "include" });
//       if (!res.ok) {
//         if (res.status === 401) navigate("/login");
//         setCartData(null);
//         return;
//       }
//       const data = await res.json();
//       console.log("Cart API response:", data);

//       // Extract all GST and price details from backend
//       const priceDetails = data.priceDetails || {};
//       const shipping = priceDetails.shippingCharge || 0;
//       const taxableAmount = priceDetails.taxableAmount || 0;
//       const gstRate = priceDetails.gstRate || "0%";
//       const gstAmount = priceDetails.gstAmount || 0;
//       const gstMessage = priceDetails.gstMessage || "";
//       const totalSavings =
//         priceDetails.totalSavings || priceDetails.bagDiscount || 0;
//       const savingsMessage = priceDetails.savingsMessage || "";

//       // Calculate GST if not provided
//       let finalGstAmount = gstAmount;
//       let finalTaxableAmount = taxableAmount;
//       if (!gstAmount && taxableAmount) {
//         const gstPercentage = parseFloat(gstRate) / 100 || 0.18;
//         finalGstAmount = taxableAmount * gstPercentage;
//       }
//       if (!taxableAmount && priceDetails.payable) {
//         finalTaxableAmount = priceDetails.payable - finalGstAmount;
//       }

//       setCartData({
//         cart: normalizeCart(data.cart || []),
//         bagMrp: priceDetails.bagMrp || 0,
//         bagDiscount: priceDetails.bagDiscount || 0,
//         autoDiscount: priceDetails.autoDiscount || 0,
//         couponDiscount: priceDetails.couponDiscount || 0,
//         shipping,
//         taxableAmount: finalTaxableAmount,
//         gstRate,
//         gstAmount: finalGstAmount,
//         gstMessage:
//           gstMessage ||
//           `Includes ${gstRate} GST (₹${finalGstAmount.toFixed(2)})`,
//         payable: priceDetails.payable || 0,
//         appliedCoupon: data.appliedCoupon || null,
//         applicableCoupons: data.applicableCoupons || [],
//         inapplicableCoupons: data.inapplicableCoupons || [],
//         promotions: data.appliedPromotions || [],
//         pointsToUse: data.pointsUsed || 0,
//         giftCardApplied: data.giftCardApplied || null,
//         grandTotal: data.grandTotal || priceDetails.payable || 0,
//         shippingMessage: priceDetails.shippingMessage || "",
//         totalSavings,
//         savingsMessage,
//       });

//       const offender = (data.cart || []).find((i) => !i.canCheckout);
//       setStockError(offender ? offender.stockMessage : "");
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//       setCartData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // 2.  quantity change - FIXED for guest cart
//   // --------------------------------------------------
//   const recalcSummary = (cart, currentCartData) => {
//     const bagMrp = cart.reduce(
//       (sum, item) => {
//         const original = item.selectedVariant?.originalPrice || item.selectedVariant?.mrp || item.price || 0;
//         return sum + original * item.quantity;
//       },
//       0
//     );

//     const bagDiscount = cart.reduce(
//       (sum, item) => {
//         const original = item.selectedVariant?.originalPrice || item.selectedVariant?.mrp || item.price || 0;
//         return sum + (original - item.price) * item.quantity;
//       },
//       0
//     );

//     const subTotal = cart.reduce((sum, item) => sum + item.subTotal, 0);

//     // Calculate GST based on taxable amount
//     const taxableAmount = subTotal;
//     const gstPercentage = parseFloat(currentCartData?.gstRate || "18") / 100;
//     const gstAmount = taxableAmount * gstPercentage;

//     const payable = taxableAmount + gstAmount;

//     return {
//       bagMrp,
//       bagDiscount,
//       taxableAmount,
//       gstAmount,
//       payable,
//       gstMessage: `Includes ${(gstPercentage * 100).toFixed(0)}% GST (₹${gstAmount.toFixed(2)})`,
//     };
//   };

//   const handleQuantityChange = async (cartItemId, newQty) => {
//     if (newQty < 1) return;
//     if (newQty > 6) return alert("Max 6 units allowed.");

//     // Find the item in current cart
//     const item = cartData?.cart?.find((i) => i.cartItemId === cartItemId);
//     if (!item) return;

//     const tokenExists = document.cookie.includes("token=");

//     if (!tokenExists) {
//       // Guest cart update
//       const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       const updatedGuestCart = guestCart.map((guestItem, index) => {
//         // Create a unique ID for comparison
//         const guestItemId = `${guestItem.productId || guestItem.product?._id}-${guestItem.variant?.sku || guestItem.variant?._id || index}-guest`;

//         if (guestItemId === cartItemId) {
//           return {
//             ...guestItem,
//             quantity: newQty
//           };
//         }
//         return guestItem;
//       });

//       localStorage.setItem("guestCart", JSON.stringify(updatedGuestCart));

//       // Update local state
//       const updatedCart = cartData.cart.map((i) =>
//         i.cartItemId === cartItemId ? {
//           ...i,
//           quantity: newQty,
//           subTotal: i.price * newQty
//         } : i
//       );

//       const updatedSummary = recalcSummary(updatedCart, cartData);
//       setCartData({
//         ...cartData,
//         cart: updatedCart,
//         ...updatedSummary,
//         grandTotal: updatedSummary.payable,
//       });
//       return;
//     }

//     // Logged-in user update
//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;
//       const res = await fetch(`${API_BASE}/update`, {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           cartItemId: item.cartItemId,
//           productId: item.productId,
//           quantity: newQty,
//           discount: appliedCoupon,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update quantity");
//       await fetchCart(appliedCoupon);
//     } catch (err) {
//       console.error("🔴 Error updating cart quantity:", err);
//       alert("Failed to update quantity. Please try again.");
//       await fetchCart();
//     }
//   };

//   // --------------------------------------------------
//   // 3.  remove item - FIXED for guest cart
//   // --------------------------------------------------
//   const handleRemoveByProductId = async (productId, variantSku = null) => {
//     if (!productId) return;
//     const tokenExists = document.cookie.includes("token=");

//     if (!tokenExists) {
//       // Guest cart removal
//       const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
//       const newGuestCart = guestCart.filter((item) => {
//         const itemProductId = item.productId || item.product?._id;
//         const itemVariantSku = item.variant?.sku || item.variant?._id;

//         // If no variantSku specified, remove all variants of this product
//         if (!variantSku) {
//           return itemProductId !== productId;
//         }

//         // Remove specific variant
//         return !(itemProductId === productId && itemVariantSku === variantSku);
//       });

//       localStorage.setItem("guestCart", JSON.stringify(newGuestCart));

//       // Update local state optimistically
//       if (cartData) {
//         const updatedCart = cartData.cart.filter((item) => {
//           if (!variantSku) {
//             return item.productId !== productId;
//           }
//           return !(item.productId === productId && item.selectedVariant?.sku === variantSku);
//         });

//         const {
//           bagMrp,
//           bagDiscount,
//           taxableAmount,
//           gstAmount,
//           payable,
//           gstMessage,
//         } = recalcSummary(updatedCart, cartData);

//         setCartData({
//           ...cartData,
//           cart: updatedCart,
//           bagMrp,
//           bagDiscount,
//           taxableAmount,
//           gstAmount,
//           payable,
//           grandTotal: payable,
//           gstMessage,
//         });
//       }
//       return;
//     }

//     // Logged-in user removal
//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;
//       const url = variantSku
//         ? `${API_BASE}/remove/${productId}?variantSku=${encodeURIComponent(variantSku)}`
//         : `${API_BASE}/remove/${productId}`;

//       const res = await fetch(url, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error(`Server failed to remove item`);
//       await fetchCart(appliedCoupon);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove item from cart.");
//       await fetchCart();
//     }
//   };

//   // --------------------------------------------------
//   // 4.  coupon
//   // --------------------------------------------------
//   const handleCouponSubmit = async (code) => {
//     if (!code) {
//       setCouponMessage("Please enter a coupon code.");
//       setCouponMessageColor("warning");
//       return;
//     }

//     if (cartData?.inapplicableCoupons?.some((c) => c.code === code)) {
//       setCouponMessage("This coupon is not applicable to your cart.");
//       setCouponMessageColor("danger");
//       return;
//     }

//     try {
//       await fetchCart(code);
//       localStorage.setItem("appliedCoupon", code);
//       setCouponMessage(`Coupon ${code} applied successfully!`);
//       setCouponMessageColor("success");
//       setShowCouponModal(false);
//       setManualCoupon("");
//     } catch (err) {
//       setCouponMessage(err.message || "Failed to apply coupon.");
//       setCouponMessageColor("danger");
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     setCouponMessage("Coupon removed.");
//     setCouponMessageColor("info");
//     localStorage.removeItem("appliedCoupon");
//     await fetchCart();
//   };

//   // --------------------------------------------------
//   // 6.  NEW: Handle show discount products
//   // --------------------------------------------------
//   const handleShowDiscountProducts = (coupon) => {
//     navigate("/DiscountProductsPage", {
//       state: {
//         coupon,
//         activeCouponTab
//       }
//     });
//   };

//   // --------------------------------------------------
//   // 9.  proceed to checkout
//   // --------------------------------------------------
//   const handleProceed = async () => {
//     try {
//       setInitiating(true);

//       const tokenExists = document.cookie.includes("token=");

//       if (!tokenExists) {
//         // Guest checkout - redirect to login
//         navigate("/login", {
//           state: {
//             from: "/cartpage",
//             message: "Please login to proceed with checkout"
//           }
//         });
//         return;
//       }

//       // Logged-in checkout
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
//         if (res.status === 401) navigate("/login");
//         throw new Error("Failed to initiate order");
//       }

//       const orderData = await res.json();

//       navigate("/AddressSelection", {
//         state: {
//           orderId: orderData.orderId,
//           cartItems: cartData.cart,
//           priceDetails: {
//             bagMrp: cartData.bagMrp,
//             bagDiscount: cartData.bagDiscount,
//             autoDiscount: cartData.autoDiscount,
//             couponDiscount: cartData.couponDiscount,
//             shipping: cartData.shipping,
//             taxableAmount: cartData.taxableAmount,
//             gstRate: cartData.gstRate,
//             gstAmount: cartData.gstAmount,
//             gstMessage: cartData.gstMessage,
//             payable: cartData.payable,
//             appliedCoupon: cartData.appliedCoupon,
//             totalSavings: cartData.totalSavings,
//             savingsMessage: cartData.savingsMessage,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("🔴 Checkout Error:", err);
//       alert(err.message || "Something went wrong during checkout.");
//     } finally {
//       setInitiating(false);
//     }
//   };

//   // --------------------------------------------------
//   // 10.  mount
//   // --------------------------------------------------
//   useEffect(() => {
//     const load = async () => {
//       await syncCartFromBackend();
//       const applyCode = location.state?.applyCouponCode;
//       if (applyCode) {
//         handleCouponSubmit(applyCode);
//       } else {
//         const savedCoupon = localStorage.getItem("appliedCoupon");
//         if (savedCoupon) {
//           setManualCoupon(savedCoupon);
//           await fetchCart(savedCoupon);
//         } else {
//           await fetchCart();
//         }
//       }
//     };
//     load();
//   }, [location.state]);

//   // --------------------------------------------------
//   // 11.  render
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // Check if cartData exists and has cart items
//   if (!cartData || !cartData.cart || cartData.cart.length === 0) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-4">
//           <h2>Your Cart</h2>
//           <div className="card p-4 text-center">
//             <h5 className="mb-2">Your cart is empty 🛒</h5>
//             <button
//               className="btn btn-outline-primary"
//               onClick={() => navigate("/")}
//             >
//               Start Shopping
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
//       <div className="container mt-4">
//         <h2>Your Cart</h2>
//         <div className="row">
//           <div className="col-lg-8">
//             <ul className="list-group">
//               {cartData.cart.map((item) => {
//                 const variant = item.selectedVariant || {};
//                 const shadeName = variant.shadeName || variant.name;
//                 const shadeHex = variant.hex;
//                 const imageUrl = variant.image || variant.images?.[0] || item.image;

//                 return (
//                   <li
//                     key={item.cartItemId}
//                     className="list-group-item d-flex justify-content-between align-items-end"
//                   >
//                     <div
//                       className="d-flex align-items-center gap-2"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate(`/product/${item.productId}`)}
//                     >
//                       <img
//                         src={imageUrl || "/placeholder.png"}
//                         alt={item.name}
//                         style={{
//                           width: "80px",
//                           height: "80px",
//                           objectFit: "cover",
//                           borderRadius: "8px",
//                         }}
//                       />
//                       <div className="w-75">
//                         <strong className="page-title-main-name">{item.name}</strong>
//                         {item.brand && (
//                           <div className="text-muted small page-title-main-name">{item.brand}</div>
//                         )}
//                         {item.stockStatus !== "in_stock" && (
//                           <div className="small text-danger fw-semibold page-title-main-name">
//                             {item.stockMessage || "Out of stock"}
//                           </div>
//                         )}
//                         {shadeName && (
//                           <div className="mt-1 small d-flex align-items-center gap-2 page-title-main-name">
//                             <span>Shade: {shadeName}</span>
//                             {shadeHex && (
//                               <span
//                                 style={{
//                                   width: "16px",
//                                   height: "16px",
//                                   borderRadius: "50%",
//                                   display: "inline-block",
//                                   backgroundColor: shadeHex,
//                                   border: "1px solid #aaa",
//                                 }}
//                               ></span>
//                             )}
//                           </div>
//                         )}
//                         <div className="small d-flex align-items-center page-title-main-name">
//                           {variant.originalPrice && variant.originalPrice > item.price ? (
//                             <>
//                               <span className="text-muted text-decoration-line-through me-1">
//                                 ₹{variant.originalPrice}
//                               </span>
//                               <span className="fw-bold text-danger">
//                                 ₹{item.price}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="fw-bold page-title-main-name">₹{item.price}</span>
//                           )}
//                           <div className="ms-2">
//                             {item.discounts?.length > 0 && (
//                               <ul className="mt-1 small text-success p-0 m-0 page-title-main-name" type="none">
//                                 {item.discounts.map((d) => (
//                                   <li
//                                     key={`${item.cartItemId}-${d.type}-${d.note}`}
//                                     className="backgound-colors-discount page-title-main-name"
//                                   >
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

//                     <div className="d-flex align-items-center gap-2 page-title-main-name" style={{ margin: "5px 0" }}>
//                       <div className="border-for-minu-plush">
//                         <button
//                           className="btn btn-sm btn-outline-secondary page-title-main-name"
//                           style={{
//                             border: "none",
//                             background: "#FFF",
//                             boxShadow: "none",
//                             borderTop: "none",
//                             borderBottom: "none",
//                           }}
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, item.quantity - 1)
//                           }
//                           disabled={item.stockStatus === "out_of_stock"}
//                         >
//                           −
//                         </button>

//                         <span
//                           className={`px-2 ${item.stockStatus === "out_of_stock page-title-main-name"
//                             ? "text-muted text-decoration-line-through"
//                             : ""
//                             }`}
//                         >
//                           {item.quantity}
//                         </span>

//                         <button
//                           className="btn btn-sm btn-outline-secondary page-title-main-name"
//                           style={{
//                             border: "none",
//                             background: "#FFF",
//                             boxShadow: "none",
//                             borderTop: "none",
//                             borderBottom: "none",
//                           }}
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, item.quantity + 1)
//                           }
//                           disabled={item.stockStatus === "out_of_stock"}
//                         >
//                           +
//                         </button>
//                       </div>

//                       <span
//                         className={`fw-bold page-title-main-name ${item.stockStatus === "out_of_stock" ? "text-muted" : ""
//                           }`}
//                       >
//                         ₹{item.subTotal.toFixed(2)}
//                       </span>

//                       <button
//                         onClick={() => handleShowConfirm(item)}
//                         className="btn btn-outline-danger"
//                         title="Remove item from cart"
//                       >
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>

//           <div className="col-lg-4 mt-4 mt-lg-0">
//             <div className="border-color-width">
//               <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
//                 <div className="d-flex align-items-center">
//                   <div>
//                     <div className="fw-bold ms-3 fs-4 page-title-main-name">Coupons & Bank Offers</div>
//                   </div>
//                 </div>
//                 <i
//                   className="bi bi-chevron-right margin-left-right"
//                   onClick={() => setShowCouponModal(true)}
//                 ></i>
//               </div>

//               <hr />
//               <div className="d-flex justify-content-start align-items-center" style={{ cursor: "pointer" }}>
//                 <h5 className="ms-3 page-title-main-name">Order Summary</h5>
//               </div>
//               <hr />

//               <div className="mb-3 page-title-main-name">
//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert">
//                   <span className="page-title-main-name">Bag MRP:</span>
//                   <span className="page-title-main-name">₹{cartData.bagMrp?.toFixed(2) || "0.00"}</span>
//                 </div>

//                 {cartData.bagDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert">
//                     <span className="page-title-main-name">Bag Discount:</span>
//                     <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}

//                 <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
//                   <div className="d-block">
//                     <span className="page-title-main-name">Shipping:</span>
//                     {cartData.shippingMessage && (
//                       <div className="small text-info mb-2 page-title-main-name">
//                         <i className="bi bi-truck me-1 page-title-main-name"></i>
//                         {cartData.shippingMessage}
//                       </div>
//                     )}
//                   </div>
//                   <span className={cartData.shipping === 0 ? "text-success" : ""}>
//                     ₹{cartData.shipping?.toFixed(2) || "0.00"}
//                     {cartData.shipping === 0 && (
//                       <span className="ms-1 small page-title-main-name">Free Shipping</span>
//                     )}
//                   </span>
//                 </div>

//                 {cartData.couponDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert pb-2 page-title-main-name">
//                     <span>Coupon Discount:</span>
//                     <span>-₹{cartData.couponDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}

//                 <hr />
//                 <div className="d-flex justify-content-between mb-1 pt-2 margin-left-right-repert">
//                   <span className="fw-semibold page-title-main-name">Taxable Amount:</span>
//                   <span className="fw-semibold page-title-main-name">
//                     ₹{cartData.taxableAmount?.toFixed(2) || "0.00"}
//                   </span>
//                 </div>

//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert page-title-main-name">
//                   <span className="page-title-main-name">GST ({cartData.gstRate || "0%"})</span>
//                   <span className="page-title-main-name">+₹{cartData.gstAmount?.toFixed(2) || "0.00"}</span>
//                 </div>

//                 {cartData.gstMessage && (
//                   <div className="small text-muted mb-2 margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-receipt me-1"></i>
//                     {cartData.gstMessage}
//                   </div>
//                 )}

//                 <hr />
//                 <div className="d-flex justify-content-between mb-3 pt-2 margin-left-right-repert align-items-center">
//                   <span className="fw-bold page-title-main-name">Total Payable:</span>
//                   <span className="fw-bold text-primary fs-5 page-title-main-name">
//                     ₹{cartData.payable?.toFixed(2) || "0.00"}
//                   </span>
//                 </div>

//                 <hr />

//                 {cartData.savingsMessage && (
//                   <Alert variant="success" className="py-2 small margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-coin me-1"></i>
//                     {cartData.savingsMessage}
//                   </Alert>
//                 )}
//               </div>

//               {cartData.appliedCoupon?.code && (
//                 <div className="mb-3 p-2 border rounded bg-success text-white margin-left-right-repert">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <strong>Applied Coupon:</strong> {cartData.appliedCoupon.code}
//                       {cartData.appliedCoupon.discount && (
//                         <span className="ms-2">- ₹{cartData.appliedCoupon.discount} off</span>
//                       )}
//                     </div>
//                     <button
//                       className="btn btn-sm btn-outline-light"
//                       onClick={handleRemoveCoupon}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {couponMessage && (
//                 <div className={`mt-2 alert backend-color ${couponMessageColor} text-white`}>
//                   {couponMessage}
//                 </div>
//               )}

//               {stockError && (
//                 <Alert variant="warning" className="mb-2">
//                   <strong>
//                     {(cartData.cart || []).find((i) => !i.canCheckout)?.name || "Item"}
//                   </strong>
//                   {" – "}
//                   {stockError}
//                 </Alert>
//               )}

//               <button
//                 className="page-title-main-name bg-black text-white checkout-button w-100 mt-3 py-2 fw-bold"
//                 onClick={handleProceed}
//                 disabled={initiating || !!stockError}
//               >
//                 {initiating ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2 page-title-main-name" role="status"></span>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-lock-fill me-2"></i>
//                     Proceed to Checkout (₹{cartData.payable?.toFixed(2)})
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Confirm Remove Modal */}
//       <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Removal</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to remove "{itemToRemove?.name}" from your cart?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseConfirm}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleConfirmRemove}>
//             Remove
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Coupon Modal */}
//       <div className={`modal fade ${showCouponModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//         <div className="modal-dialog modal-lg modal-dialog-centered page-title-main-name" role="document">
//           <div className="modal-content border-0 rounded-0">
//             <div className="modal-header border-bottom py-3 px-4">
//               <h5 className="modal-title fw-normal" style={{ color: '#444' }}>Apply Coupon</h5>
//               <button
//                 type="button"
//                 className="btn-close shadow-none mb-0"
//                 onClick={() => setShowCouponModal(false)}
//                 aria-label="Close"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="modal-body p-4 bg-light">
//               <ul className="nav nav-tabs border-0 mb-4 justify-content-center">
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "available" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("available")}>
//                     Available
//                   </button>
//                 </li>
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "inapplicable" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("inapplicable")}>
//                     Not Applicable
//                   </button>
//                 </li>
//               </ul>

//               <div className="row row-cols-1 row-cols-md-2 g-3">
//                 {(activeCouponTab === "available" ? cartData.applicableCoupons : cartData.inapplicableCoupons)?.map((c) => (
//                   <div className="col-lg-6 col-md-12" key={c._id}>
//                     <div className={`coupon-ticket shadow-sm ${activeCouponTab === "inapplicable" ? "opacity-75" : ""}`}>
//                       <div className="ticket-sidebar">
//                         <div className="ticket-notch"></div>
//                         <span className="ticket-code-rotated">{c.code}</span>
//                       </div>
//                       <div className="ticket-body">
//                         <div className="d-flex justify-content-between">
//                           <h6 className="mb-1 fw-bold text-secondary page-title-main-name">{c.label || "Lipsticks "}</h6>
//                           {activeCouponTab === "available" && (
//                             <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn page-title-main-name" onClick={() => handleCouponSubmit(c.code)}>
//                               Apply
//                             </button>
//                           )}
//                         </div>
//                         <p className="ticket-desc mb-2 text-muted page-title-main-name">
//                           {c.description || "Enjoy upto 25% off on Rs 1000. MAX Discount 1000/-"}
//                         </p>
//                         <div className="ticket-divider"></div>
//                         {/* Clickable "Valid on select products" text */}
//                         <small 
//                           className="ticket-footer text-muted page-title-main-name" 
//                           style={{ cursor: 'pointer', textDecoration: 'underline' }}
//                           onClick={() => handleShowDiscountProducts(c)}
//                         >
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
























// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/cartpage.css";
// import { CartContext } from "../Context/Cartcontext";
// import { FaTimes } from "react-icons/fa";
// import { Modal, Button, Alert } from "react-bootstrap";

// const API_BASE = "https://beauty.joyory.com/api/user/cart";
// const INITIATE_ORDER_API = `${API_BASE}/order/initiate`;

// // ---------- component ----------
// const CartPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { syncCartFromBackend } = useContext(CartContext);
//   const [cartData, setCartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initiating, setInitiating] = useState(false);
//   const [stockError, setStockError] = useState("");

//   // Confirm remove modal state
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [itemToRemove, setItemToRemove] = useState(null);

//   // modal handlers
//   const handleShowConfirm = (item) => {
//     setItemToRemove(item);
//     setShowConfirm(true);
//   };

//   const handleCloseConfirm = () => {
//     setShowConfirm(false);
//     setItemToRemove(null);
//   };

//   const handleConfirmRemove = () => {
//     if (itemToRemove) {
//       handleRemoveByProductId(
//         itemToRemove.productId,
//         itemToRemove.selectedVariant?.sku || null
//       );
//     }
//     handleCloseConfirm();
//   };

//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageColor, setCouponMessageColor] = useState("info");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [activeCouponTab, setActiveCouponTab] = useState("available");
//   const [manualCoupon, setManualCoupon] = useState("");

//   // --------------------------------------------------
//   // 1. fetch cart from backend (works for both logged-in and guest via session)
//   // --------------------------------------------------
//   const fetchCart = async (discountCode = null) => {
//     try {
//       setLoading(true);

//       const url = discountCode
//         ? `${API_BASE}/summary?discount=${discountCode}`
//         : `${API_BASE}/summary`;

//       const res = await fetch(url, { credentials: "include" });

//       // Handle empty cart (backend returns 400 with message "Cart is empty")
//       if (res.status === 400) {
//         const emptyData = {
//           cart: [],
//           freebies: [],
//           bagMrp: 0,
//           bagDiscount: 0,
//           autoDiscount: 0,
//           couponDiscount: 0,
//           shipping: 0,
//           taxableAmount: 0,
//           gstRate: "0%",
//           gstAmount: 0,
//           gstMessage: "",
//           payable: 0,
//           appliedCoupon: null,
//           applicableCoupons: [],
//           inapplicableCoupons: [],
//           promotions: [],
//           totalSavings: 0,
//           savingsMessage: "",
//           grandTotal: 0,
//           shippingMessage: "",
//         };
//         setCartData(emptyData);
//         setStockError("");
//         setLoading(false);
//         return;
//       }

//       if (!res.ok) {
//         if (res.status === 401) navigate("/login");
//         throw new Error("Failed to fetch cart");
//       }

//       const data = await res.json();

//       // Normalize cart items to match frontend expectations
//       const normalizedCart = (data.cart || []).map((item) => {
//         const variant = item.variant || {};
//         const price = variant.displayPrice || variant.discountedPrice || 0;
//         const originalPrice = variant.originalPrice || price;
//         const discountPercent =
//           variant.discountPercent ||
//           (originalPrice > price
//             ? Math.round(((originalPrice - price) / originalPrice) * 100)
//             : 0);

//         const discounts = discountPercent > 0
//           ? [
//               {
//                 type: "Discount",
//                 amount: originalPrice - price,
//                 note: `${discountPercent}% Off`,
//               },
//             ]
//           : [];

//         const image = variant.image || "/placeholder.png";
//         const name = item.name || "Unnamed Product";
//         const brand = item.brand || ""; // fallback if backend adds it later

//         // Unique ID for frontend operations (fallback if no _id from backend)
//         const cartItemId =
//           item._id ||
//           `${item.product}-${variant.sku || "default"}`;

//         return {
//           cartItemId,
//           productId: item.product || item.productId,
//           name,
//           image,
//           brand,
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

//       const priceDetails = data.priceDetails || {};

//       setCartData({
//         cart: normalizedCart,
//         freebies: data.freebies || [],
//         bagMrp: priceDetails.bagMrp || 0,
//         bagDiscount: priceDetails.bagDiscount || 0,
//         autoDiscount: priceDetails.autoDiscount || 0,
//         couponDiscount: priceDetails.couponDiscount || 0,
//         shipping: priceDetails.shippingCharge || 0,
//         taxableAmount: priceDetails.taxableAmount || 0,
//         gstRate: priceDetails.gstRate || "0%",
//         gstAmount: priceDetails.gstAmount || 0,
//         gstMessage: priceDetails.gstMessage || "",
//         payable: priceDetails.payable || 0,
//         appliedCoupon: data.appliedCoupon || null,
//         applicableCoupons: data.applicableCoupons || [],
//         inapplicableCoupons: data.inapplicableCoupons || [],
//         promotions: data.appliedPromotions || [],
//         totalSavings: priceDetails.totalSavings || 0,
//         savingsMessage: priceDetails.savingsMessage || "",
//         grandTotal: data.grandTotal || priceDetails.payable || 0,
//         shippingMessage: priceDetails.shippingMessage || "",
//       });

//       const offender = (data.cart || []).find((i) => !i.canCheckout);
//       setStockError(offender ? offender.stockMessage : "");
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//       setCartData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // 2. quantity change (always via backend - works for guest session too)
//   // --------------------------------------------------
//   const handleQuantityChange = async (cartItemId, newQty) => {
//     if (newQty < 1) return;
//     if (newQty > 6) return alert("Max 6 units allowed.");

//     const item = cartData?.cart?.find((i) => i.cartItemId === cartItemId);
//     if (!item) return;

//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;

//       const res = await fetch(`${API_BASE}/update`, {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: item.productId,
//           variantSku: item.selectedVariant?.sku || null,
//           quantity: newQty,
//           discount: appliedCoupon,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update quantity");

//       await fetchCart(appliedCoupon);
//     } catch (err) {
//       console.error("Error updating cart quantity:", err);
//       alert("Failed to update quantity. Please try again.");
//       await fetchCart();
//     }
//   };

//   // --------------------------------------------------
//   // 3. remove item (always via backend)
//   // --------------------------------------------------
//   const handleRemoveByProductId = async (productId, variantSku = null) => {
//     if (!productId) return;

//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;
//       const url = variantSku
//         ? `${API_BASE}/remove/${productId}?variantSku=${encodeURIComponent(variantSku)}`
//         : `${API_BASE}/remove/${productId}`;

//       const res = await fetch(url, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error("Server failed to remove item");

//       await fetchCart(appliedCoupon);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove item from cart.");
//       await fetchCart();
//     }
//   };

//   // --------------------------------------------------
//   // 4. coupon handlers
//   // --------------------------------------------------
//   const handleCouponSubmit = async (code) => {
//     if (!code) {
//       setCouponMessage("Please enter a coupon code.");
//       setCouponMessageColor("warning");
//       return;
//     }

//     try {
//       await fetchCart(code);
//       localStorage.setItem("appliedCoupon", code);
//       setCouponMessage(`Coupon ${code} applied successfully!`);
//       setCouponMessageColor("success");
//       setShowCouponModal(false);
//       setManualCoupon("");
//     } catch (err) {
//       setCouponMessage("Failed to apply coupon.");
//       setCouponMessageColor("danger");
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     setCouponMessage("Coupon removed.");
//     setCouponMessageColor("info");
//     localStorage.removeItem("appliedCoupon");
//     await fetchCart();
//   };

//   // --------------------------------------------------
//   // 5. show discount products
//   // --------------------------------------------------
//   const handleShowDiscountProducts = (coupon) => {
//     navigate("/DiscountProductsPage", {
//       state: { coupon, activeCouponTab },
//     });
//   };

//   // --------------------------------------------------
//   // 6. proceed to checkout
//   // --------------------------------------------------
//   const handleProceed = async () => {
//     try {
//       setInitiating(true);

//       const tokenExists = document.cookie.includes("token=");

//       if (!tokenExists) {
//         navigate("/login", {
//           state: {
//             from: "/cartpage",
//             message: "Please login to proceed with checkout",
//           },
//         });
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
//         if (res.status === 401) navigate("/login");
//         throw new Error("Failed to initiate order");
//       }

//       const orderData = await res.json();

//       navigate("/AddressSelection", {
//         state: {
//           orderId: orderData.orderId,
//           cartItems: cartData.cart,
//           priceDetails: {
//             bagMrp: cartData.bagMrp,
//             bagDiscount: cartData.bagDiscount,
//             autoDiscount: cartData.autoDiscount,
//             couponDiscount: cartData.couponDiscount,
//             shipping: cartData.shipping,
//             taxableAmount: cartData.taxableAmount,
//             gstRate: cartData.gstRate,
//             gstAmount: cartData.gstAmount,
//             gstMessage: cartData.gstMessage,
//             payable: cartData.payable,
//             appliedCoupon: cartData.appliedCoupon,
//             totalSavings: cartData.totalSavings,
//             savingsMessage: cartData.savingsMessage,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "Something went wrong during checkout.");
//     } finally {
//       setInitiating(false);
//     }
//   };

//   // --------------------------------------------------
//   // 7. mount
//   // --------------------------------------------------
//   useEffect(() => {
//     const load = async () => {
//       await syncCartFromBackend();
//       const applyCode = location.state?.applyCouponCode;
//       if (applyCode) {
//         handleCouponSubmit(applyCode);
//       } else {
//         const savedCoupon = localStorage.getItem("appliedCoupon");
//         if (savedCoupon) {
//           await fetchCart(savedCoupon);
//         } else {
//           await fetchCart();
//         }
//       }
//     };
//     load();
//   }, [location.state]);

//   // --------------------------------------------------
//   // 8. render
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!cartData || (cartData.cart.length === 0 && cartData.freebies?.length === 0)) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-4">
//           <h2>Your Cart</h2>
//           <div className="card p-4 text-center">
//             <h5 className="mb-2">Your cart is empty 🛒</h5>
//             <button
//               className="btn btn-outline-primary"
//               onClick={() => navigate("/")}
//             >
//               Start Shopping
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
//       <div className="container mt-4">
//         <h2>Your Cart</h2>
//         <div className="row">
//           <div className="col-lg-8">
//             <ul className="list-group">
//               {cartData.cart.map((item) => {
//                 const variant = item.selectedVariant || {};
//                 const shadeName = variant.shadeName || variant.name;
//                 const shadeHex = variant.hex;
//                 const imageUrl = item.image;

//                 return (
//                   <li
//                     key={item.cartItemId}
//                     className="list-group-item d-flex justify-content-between align-items-end"
//                   >
//                     <div
//                       className="d-flex align-items-center gap-2"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate(`/product/${item.productId}`)}
//                     >
//                       <img
//                         src={imageUrl}
//                         alt={item.name}
//                         style={{
//                           width: "80px",
//                           height: "80px",
//                           objectFit: "cover",
//                           borderRadius: "8px",
//                         }}
//                       />
//                       <div className="w-75">
//                         <strong className="page-title-main-name">{item.name}</strong>
//                         {item.brand && (
//                           <div className="text-muted small page-title-main-name">{item.brand}</div>
//                         )}
//                         {item.stockStatus !== "in_stock" && (
//                           <div className="small text-danger fw-semibold page-title-main-name">
//                             {item.stockMessage || "Out of stock"}
//                           </div>
//                         )}
//                         {shadeName && (
//                           <div className="mt-1 small d-flex align-items-center gap-2 page-title-main-name">
//                             <span>Shade: {shadeName}</span>
//                             {shadeHex && (
//                               <span
//                                 style={{
//                                   width: "16px",
//                                   height: "16px",
//                                   borderRadius: "50%",
//                                   display: "inline-block",
//                                   backgroundColor: shadeHex,
//                                   border: "1px solid #aaa",
//                                 }}
//                               ></span>
//                             )}
//                           </div>
//                         )}
//                         <div className="small d-flex align-items-center page-title-main-name">
//                           {variant.originalPrice && variant.originalPrice > item.price ? (
//                             <>
//                               <span className="text-muted text-decoration-line-through me-1">
//                                 ₹{variant.originalPrice}
//                               </span>
//                               <span className="fw-bold text-danger">
//                                 ₹{item.price}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="fw-bold page-title-main-name">₹{item.price}</span>
//                           )}
//                           <div className="ms-2">
//                             {item.discounts?.length > 0 && (
//                               <ul className="mt-1 small text-success p-0 m-0 page-title-main-name" type="none">
//                                 {item.discounts.map((d) => (
//                                   <li
//                                     key={`${item.cartItemId}-${d.type}-${d.note}`}
//                                     className="backgound-colors-discount page-title-main-name"
//                                   >
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

//                     <div className="d-flex align-items-center gap-2 page-title-main-name" style={{ margin: "5px 0" }}>
//                       <div className="border-for-minu-plush">
//                         <button
//                           className="btn btn-sm btn-outline-secondary page-title-main-name"
//                           style={{
//                             border: "none",
//                             background: "#FFF",
//                             boxShadow: "none",
//                             borderTop: "none",
//                             borderBottom: "none",
//                           }}
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, item.quantity - 1)
//                           }
//                           disabled={item.stockStatus === "out_of_stock"}
//                         >
//                           −
//                         </button>

//                         <span
//                           className={`px-2 ${item.stockStatus === "out_of_stock" ? "text-muted text-decoration-line-through" : ""
//                             } page-title-main-name`}
//                         >
//                           {item.quantity}
//                         </span>

//                         <button
//                           className="btn btn-sm btn-outline-secondary page-title-main-name"
//                           style={{
//                             border: "none",
//                             background: "#FFF",
//                             boxShadow: "none",
//                             borderTop: "none",
//                             borderBottom: "none",
//                           }}
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, item.quantity + 1)
//                           }
//                           disabled={item.stockStatus === "out_of_stock"}
//                         >
//                           +
//                         </button>
//                       </div>

//                       <span
//                         className={`fw-bold page-title-main-name ${item.stockStatus === "out_of_stock" ? "text-muted" : ""
//                           }`}
//                       >
//                         ₹{item.subTotal.toFixed(2)}
//                       </span>

//                       <button
//                         onClick={() => handleShowConfirm(item)}
//                         className="btn btn-outline-danger"
//                         title="Remove item from cart"
//                       >
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>

//             {/* Free Gifts Section */}
//             {cartData.freebies?.length > 0 && (
//               <div className="mt-4">
//                 <h5 className="ms-3 page-title-main-name">Free Gifts 🎁</h5>
//                 <ul className="list-group">
//                   {cartData.freebies.map((freebie, idx) => {
//                     const variant = freebie.variant || {};
//                     const image = variant.images?.[0] || variant.image || "/placeholder.png";

//                     return (
//                       <li key={idx} className="list-group-item d-flex align-items-center gap-3">
//                         <img
//                           src={image}
//                           alt={freebie.name}
//                           style={{
//                             width: "80px",
//                             height: "80px",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                           }}
//                         />
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
//           </div>

//           <div className="col-lg-4 mt-4 mt-lg-0">
//             <div className="border-color-width">
//               <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
//                 <div className="d-flex align-items-center">
//                   <div>
//                     <div className="fw-bold ms-3 fs-4 page-title-main-name">Coupons & Bank Offers</div>
//                   </div>
//                 </div>
//                 <i
//                   className="bi bi-chevron-right margin-left-right"
//                   onClick={() => setShowCouponModal(true)}
//                   style={{ cursor: "pointer" }}
//                 ></i>
//               </div>

//               <hr />
//               <div className="d-flex justify-content-start align-items-center" style={{ cursor: "pointer" }}>
//                 <h5 className="ms-3 page-title-main-name">Order Summary</h5>
//               </div>
//               <hr />

//               <div className="mb-3 page-title-main-name">
//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert">
//                   <span className="page-title-main-name">Bag MRP:</span>
//                   <span className="page-title-main-name">₹{cartData.bagMrp?.toFixed(2) || "0.00"}</span>
//                 </div>

//                 {cartData.bagDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert">
//                     <span className="page-title-main-name">Bag Discount:</span>
//                     <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}

//                 <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
//                   <div className="d-block">
//                     <span className="page-title-main-name">Shipping:</span>
//                     {cartData.shippingMessage && (
//                       <div className="small text-info mb-2 page-title-main-name">
//                         <i className="bi bi-truck me-1 page-title-main-name"></i>
//                         {cartData.shippingMessage}
//                       </div>
//                     )}
//                   </div>
//                   <span className={cartData.shipping === 0 ? "text-success" : ""}>
//                     ₹{cartData.shipping?.toFixed(2) || "0.00"}
//                     {cartData.shipping === 0 && (
//                       <span className="ms-1 small page-title-main-name">Free Shipping</span>
//                     )}
//                   </span>
//                 </div>

//                 {cartData.couponDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert pb-2 page-title-main-name">
//                     <span>Coupon Discount:</span>
//                     <span>-₹{cartData.couponDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}

//                 <hr />
//                 <div className="d-flex justify-content-between mb-1 pt-2 margin-left-right-repert">
//                   <span className="fw-semibold page-title-main-name">Taxable Amount:</span>
//                   <span className="fw-semibold page-title-main-name">
//                     ₹{cartData.taxableAmount?.toFixed(2) || "0.00"}
//                   </span>
//                 </div>

//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert page-title-main-name">
//                   <span className="page-title-main-name">GST ({cartData.gstRate})</span>
//                   <span className="page-title-main-name">+₹{cartData.gstAmount?.toFixed(2) || "0.00"}</span>
//                 </div>

//                 {cartData.gstMessage && (
//                   <div className="small text-muted mb-2 margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-receipt me-1"></i>
//                     {cartData.gstMessage}
//                   </div>
//                 )}

//                 <hr />
//                 <div className="d-flex justify-content-between mb-3 pt-2 margin-left-right-repert align-items-center">
//                   <span className="fw-bold page-title-main-name">Total Payable:</span>
//                   <span className="fw-bold text-primary fs-5 page-title-main-name">
//                     ₹{cartData.payable?.toFixed(2) || "0.00"}
//                   </span>
//                 </div>

//                 <hr />

//                 {cartData.savingsMessage && (
//                   <Alert variant="success" className="py-2 small margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-coin me-1"></i>
//                     {cartData.savingsMessage}
//                   </Alert>
//                 )}
//               </div>

//               {cartData.appliedCoupon?.code && (
//                 <div className="mb-3 p-2 border rounded bg-success text-white margin-left-right-repert">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <strong>Applied Coupon:</strong> {cartData.appliedCoupon.code}
//                       {cartData.appliedCoupon.discount && (
//                         <span className="ms-2">- ₹{cartData.appliedCoupon.discount} off</span>
//                       )}
//                     </div>
//                     <button
//                       className="btn btn-sm btn-outline-light"
//                       onClick={handleRemoveCoupon}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {couponMessage && (
//                 <div className={`mt-2 alert backend-color ${couponMessageColor} text-white`}>
//                   {couponMessage}
//                 </div>
//               )}

//               {stockError && (
//                 <Alert variant="warning" className="mb-2">
//                   <strong>
//                     {(cartData.cart || []).find((i) => !i.canCheckout)?.name || "Item"}
//                   </strong>
//                   {" – "}
//                   {stockError}
//                 </Alert>
//               )}

//               <button
//                 className="page-title-main-name bg-black text-white checkout-button w-100 mt-3 py-2 fw-bold"
//                 onClick={handleProceed}
//                 disabled={initiating || !!stockError}
//               >
//                 {initiating ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2 page-title-main-name" role="status"></span>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-lock-fill me-2"></i>
//                     Proceed to Checkout (₹{cartData.payable?.toFixed(2)})
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Confirm Remove Modal */}
//       <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Removal</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to remove "{itemToRemove?.name}" from your cart?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseConfirm}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleConfirmRemove}>
//             Remove
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Coupon Modal */}
//       <div className={`modal fade ${showCouponModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//         <div className="modal-dialog modal-lg modal-dialog-centered page-title-main-name" role="document">
//           <div className="modal-content border-0 rounded-0">
//             <div className="modal-header border-bottom py-3 px-4">
//               <h5 className="modal-title fw-normal" style={{ color: '#444' }}>Apply Coupon</h5>
//               <button
//                 type="button"
//                 className="btn-close shadow-none mb-0"
//                 onClick={() => setShowCouponModal(false)}
//                 aria-label="Close"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="modal-body p-4 bg-light">
//               <ul className="nav nav-tabs border-0 mb-4 justify-content-center">
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "available" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("available")}>
//                     Available
//                   </button>
//                 </li>
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "inapplicable" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("inapplicable")}>
//                     Not Applicable
//                   </button>
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
//                             <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn page-title-main-name" onClick={() => handleCouponSubmit(c.code)}>
//                               Apply
//                             </button>
//                           )}
//                         </div>
//                         <p className="ticket-desc mb-2 text-muted page-title-main-name">
//                           {c.description || "Enjoy discount on your order"}
//                         </p>
//                         <div className="ticket-divider"></div>
//                         <small
//                           className="ticket-footer text-muted page-title-main-name"
//                           style={{ cursor: 'pointer', textDecoration: 'underline' }}
//                           onClick={() => handleShowDiscountProducts(c)}
//                         >
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





























// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/cartpage.css";
// import { CartContext } from "../Context/Cartcontext";
// import { FaTimes } from "react-icons/fa";
// import { Modal, Button, Alert } from "react-bootstrap";
// import plush from "../assets/plush.svg";
// import minus from "../assets/minus.svg";


// const API_BASE = "https://beauty.joyory.com/api/user/cart";
// // const API_BASE = "https://beauty.joyory.com/api/user/cart";
// const INITIATE_ORDER_API = `${API_BASE}/order/initiate`;

// // ---------- component ----------
// const CartPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { syncCartFromBackend } = useContext(CartContext);
//   const [cartData, setCartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initiating, setInitiating] = useState(false);
//   const [stockError, setStockError] = useState("");

//   // Confirm remove modal state
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [itemToRemove, setItemToRemove] = useState(null);

//   // modal handlers
//   const handleShowConfirm = (item) => {
//     setItemToRemove(item);
//     setShowConfirm(true);
//   };

//   const handleCloseConfirm = () => {
//     setShowConfirm(false);
//     setItemToRemove(null);
//   };

//   const handleConfirmRemove = () => {
//     if (itemToRemove) {
//       handleRemoveByProductId(
//         itemToRemove.productId,
//         itemToRemove.selectedVariant?.sku || null
//       );
//     }
//     handleCloseConfirm();
//   };

//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageColor, setCouponMessageColor] = useState("info");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [activeCouponTab, setActiveCouponTab] = useState("available");
//   const [manualCoupon, setManualCoupon] = useState("");
//   let cartCallCount = 0;
//   // --------------------------------------------------
//   // 1. fetch cart from backend (works for both logged-in and guest via session)
//   // --------------------------------------------------
//   const fetchCart = async (discountCode = null) => {
//     cartCallCount++;
//     console.log("🛒 fetchCart call:", cartCallCount, "Discount:", discountCode);
//     try {
//       setLoading(true);

//       const url = discountCode
//         ? `${API_BASE}/summary?discount=${discountCode}`
//         : `${API_BASE}/summary`;

//       const res = await fetch(url, { credentials: "include" });

//       // Handle empty cart (backend returns 400 with message "Cart is empty")
//       if (res.status === 400) {
//         const emptyData = {
//           cart: [],
//           freebies: [],
//           bagMrp: 0,
//           bagDiscount: 0,
//           autoDiscount: 0,
//           couponDiscount: 0,
//           shipping: 0,
//           taxableAmount: 0,
//           gstRate: "0%",
//           gstAmount: 0,
//           gstMessage: "",
//           payable: 0,
//           appliedCoupon: null,
//           applicableCoupons: [],
//           inapplicableCoupons: [],
//           promotions: [],
//           totalSavings: 0,
//           savingsMessage: "",
//           grandTotal: 0,
//           shippingMessage: "",
//         };
//         setCartData(emptyData);
//         setStockError("");
//         setLoading(false);
//         return;
//       }

//       if (!res.ok) {
//         if (res.status === 401) navigate("/login");
//         throw new Error("Failed to fetch cart");
//       }

//       const data = await res.json();

//       // Normalize cart items to match frontend expectations
//       const normalizedCart = (data.cart || []).map((item) => {
//         const variant = item.variant || {};
//         const price = variant.displayPrice || variant.discountedPrice || 0;
//         const originalPrice = variant.originalPrice || price;
//         const discountPercent =
//           variant.discountPercent ||
//           (originalPrice > price
//             ? Math.round(((originalPrice - price) / originalPrice) * 100)
//             : 0);

//         const discounts = discountPercent > 0
//           ? [
//             {
//               type: "Discount",
//               amount: originalPrice - price,
//               note: `${discountPercent}% Off`,
//             },
//           ]
//           : [];

//         const image = variant.image || "/placeholder.png";
//         const name = item.name || "Unnamed Product";
//         const brand = item.brand || ""; // fallback if backend adds it later

//         // Unique ID for frontend operations (fallback if no _id from backend)
//         const cartItemId =
//           item._id ||
//           `${item.product}-${variant.sku || "default"}`;

//         return {
//           cartItemId,
//           productId: item.product || item.productId,
//           name,
//           image,
//           brand,
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

//       const priceDetails = data.priceDetails || {};

//       setCartData({
//         cart: normalizedCart,
//         freebies: data.freebies || [],
//         bagMrp: priceDetails.bagMrp || 0,
//         bagDiscount: priceDetails.bagDiscount || 0,
//         autoDiscount: priceDetails.autoDiscount || 0,
//         couponDiscount: priceDetails.couponDiscount || 0,
//         shipping: priceDetails.shippingCharge || 0,
//         taxableAmount: priceDetails.taxableAmount || 0,
//         gstRate: priceDetails.gstRate || "0%",
//         gstAmount: priceDetails.gstAmount || 0,
//         gstMessage: priceDetails.gstMessage || "",
//         payable: priceDetails.payable || 0,
//         appliedCoupon: data.appliedCoupon || null,
//         applicableCoupons: data.applicableCoupons || [],
//         inapplicableCoupons: data.inapplicableCoupons || [],
//         promotions: data.appliedPromotions || [],
//         totalSavings: priceDetails.totalSavings || 0,
//         savingsMessage: priceDetails.savingsMessage || "",
//         grandTotal: data.grandTotal || priceDetails.payable || 0,
//         shippingMessage: priceDetails.shippingMessage || "",
//       });

//       const offender = (data.cart || []).find((i) => !i.canCheckout);
//       setStockError(offender ? offender.stockMessage : "");
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//       setCartData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // 2. quantity change (always via backend - works for guest session too)
//   // --------------------------------------------------
//   const handleQuantityChange = async (cartItemId, newQty) => {
//     if (newQty < 1) return;
//     if (newQty > 6) return alert("Max 6 units allowed.");

//     const item = cartData?.cart?.find((i) => i.cartItemId === cartItemId);
//     if (!item) return;

//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;

//       const res = await fetch(`${API_BASE}/update`, {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: item.productId,
//           variantSku: item.selectedVariant?.sku || null,
//           quantity: newQty,
//           discount: appliedCoupon,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update quantity");

//       await fetchCart(appliedCoupon);
//     } catch (err) {
//       console.error("Error updating cart quantity:", err);
//       alert("Failed to update quantity. Please try again.");
//       await fetchCart();
//     }
//   };

//   // --------------------------------------------------
//   // 3. remove item (always via backend)
//   // --------------------------------------------------
//   const handleRemoveByProductId = async (productId, variantSku = null) => {
//     if (!productId) return;

//     try {
//       const appliedCoupon = cartData?.appliedCoupon?.code || null;
//       const url = variantSku
//         ? `${API_BASE}/remove/${productId}?variantSku=${encodeURIComponent(variantSku)}`
//         : `${API_BASE}/remove/${productId}`;

//       const res = await fetch(url, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error("Server failed to remove item");

//       await fetchCart(appliedCoupon);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove item from cart.");
//       await fetchCart();
//     }
//   };

//   // --------------------------------------------------
//   // 4. coupon handlers
//   // --------------------------------------------------
//   const handleCouponSubmit = async (code) => {
//     if (!code) {
//       setCouponMessage("Please enter a coupon code.");
//       setCouponMessageColor("warning");
//       return;
//     }

//     try {
//       await fetchCart(code);
//       localStorage.setItem("appliedCoupon", code);
//       setCouponMessage(`Coupon ${code} applied successfully!`);
//       setCouponMessageColor("success");
//       setShowCouponModal(false);
//       setManualCoupon("");
//     } catch (err) {
//       setCouponMessage("Failed to apply coupon.");
//       setCouponMessageColor("danger");
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     setCouponMessage("Coupon removed.");
//     setCouponMessageColor("info");
//     localStorage.removeItem("appliedCoupon");
//     await fetchCart();
//   };

//   // --------------------------------------------------
//   // 5. show discount products
//   // --------------------------------------------------
//   const handleShowDiscountProducts = (coupon) => {
//     navigate("/DiscountProductsPage", {
//       state: { coupon, activeCouponTab },
//     });
//   };

//   // --------------------------------------------------
//   // 6. proceed to checkout
//   // --------------------------------------------------
//   const handleProceed = async () => {
//     try {
//       setInitiating(true);

//       const tokenExists = document.cookie.includes("token=");

//       if (!tokenExists) {
//         navigate("/login", {
//           state: {
//             from: "/cartpage",
//             message: "Please login to proceed with checkout",
//           },
//         });
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
//         if (res.status === 401) navigate("/login");
//         throw new Error("Failed to initiate order");
//       }

//       const orderData = await res.json();

//       navigate("/AddressSelection", {
//         state: {
//           orderId: orderData.orderId,
//           cartItems: cartData.cart,
//           priceDetails: {
//             bagMrp: cartData.bagMrp,
//             bagDiscount: cartData.bagDiscount,
//             autoDiscount: cartData.autoDiscount,
//             couponDiscount: cartData.couponDiscount,
//             shipping: cartData.shipping,
//             taxableAmount: cartData.taxableAmount,
//             gstRate: cartData.gstRate,
//             gstAmount: cartData.gstAmount,
//             gstMessage: cartData.gstMessage,
//             payable: cartData.payable,
//             appliedCoupon: cartData.appliedCoupon,
//             totalSavings: cartData.totalSavings,
//             savingsMessage: cartData.savingsMessage,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "Something went wrong during checkout.");
//     } finally {
//       setInitiating(false);
//     }
//   };

//   // --------------------------------------------------
//   // 7. mount
//   // --------------------------------------------------
//   // useEffect(() => {
//   //   const load = async () => {
//   //     // await syncCartFromBackend();






//   //     const applyCode = location.state?.applyCouponCode;
//   //     if (applyCode) {
//   //       handleCouponSubmit(applyCode);
//   //     } else {
//   //       const savedCoupon = localStorage.getItem("appliedCoupon");
//   //       if (savedCoupon) {
//   //         await fetchCart(savedCoupon);
//   //       } else {
//   //         await fetchCart();
//   //       }
//   //     }
//   //   };
//   //   load();
//   // }, [location.state]);



//   useEffect(() => {
//     const load = async () => {
//       const applyCode = location.state?.applyCouponCode;
//       const savedCoupon = localStorage.getItem("appliedCoupon");

//       if (applyCode) {
//         await fetchCart(applyCode);
//       } else if (savedCoupon) {
//         await fetchCart(savedCoupon);
//       } else {
//         await fetchCart();
//       }
//     };

//     load();
//   }, []);   // 🔥 remove location.state dependency

//   // --------------------------------------------------
//   // 8. render
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!cartData || (cartData.cart.length === 0 && cartData.freebies?.length === 0)) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-xl-5 pt-xl-4 ">
//           <h2 className="page-title-main-name">Your Cart</h2>
//           <div className="card p-4 text-center" style={{height:'75%'}}>
//             <h5 className="mb-2 page-title-main-name">Your cart is empty 🛒</h5>
//             <button
//               className="btn btn-outline-primary page-title-main-name"
//               onClick={() => navigate("/")}
//             >
//               Start Shopping
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
//       <div className="container-lg Conatiner-fluid mt-xl-5 pt-xl-5">
//         <h2 className="page-title-main-name mb-4">Your Cart</h2>
//         <div className="row">
//           <div className="col-xxl-8 col-12">
//             <ul className="list-group">
//               {cartData.cart.map((item) => {
//                 const variant = item.selectedVariant || {};
//                 const shadeName = variant.shadeName || variant.name;
//                 const shadeHex = variant.hex;
//                 const imageUrl = item.image;

//                 return (
//                   <li
//                     key={item.cartItemId}
//                     className="list-group-item d-flex justify-content-between align-items-end"
//                   >
//                     <div
//                       className="d-flex align-items-center gap-2"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate(`/product/${item.productId}`)}
//                     >
//                       <img
//                         src={imageUrl}
//                         alt={item.name}
//                         style={{
//                           width: "80px",
//                           height: "80px",
//                           objectFit: "cover",
//                           borderRadius: "8px",
//                         }}
//                       />
//                       <div className="w-75">
//                         <strong className="page-title-main-name">{item.name}</strong>
//                         {item.brand && (
//                           <div className="text-muted small page-title-main-name">{item.brand}</div>
//                         )}
//                         {item.stockStatus !== "in_stock" && (
//                           <div className="small text-danger fw-semibold page-title-main-name">
//                             {item.stockMessage || "Out of stock"}
//                           </div>
//                         )}
//                         {shadeName && (
//                           <div className="mt-1 small d-flex align-items-center gap-2 page-title-main-name">
//                             <span>Shade: {shadeName}</span>
//                             {shadeHex && (
//                               <span
//                                 style={{
//                                   width: "16px",
//                                   height: "16px",
//                                   borderRadius: "50%",
//                                   display: "inline-block",
//                                   backgroundColor: shadeHex,
//                                   border: "1px solid #aaa",
//                                 }}
//                               ></span>
//                             )}
//                           </div>
//                         )}
//                         <div className="small d-flex align-items-center page-title-main-name">
//                           {variant.originalPrice && variant.originalPrice > item.price ? (
//                             <>
//                               <span className="text-muted text-decoration-line-through me-1">
//                                 ₹{variant.originalPrice}
//                               </span>
//                               <span className="fw-bold text-danger">
//                                 ₹{item.price}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="fw-400 page-title-main-name">₹{item.price}</span>
//                           )}
//                           <div className="ms-2">
//                             {item.discounts?.length > 0 && (
//                               <ul className="mt-1 small text-success p-0 m-0 page-title-main-name" type="none">
//                                 {item.discounts.map((d) => (
//                                   <li
//                                     key={`${item.cartItemId}-${d.type}-${d.note}`}
//                                     className="backgound-colors-discount page-title-main-name"
//                                   >
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
//                         <button
//                           className="btn btn-sm btn-outline-secondary page-title-main-name"
//                           style={{
//                             border: "none",
//                             background: "#FFF",
//                             boxShadow: "none",
//                             borderTop: "none",
//                             borderBottom: "none",
//                           }}
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, item.quantity - 1)
//                           }
//                           disabled={item.stockStatus === "out_of_stock"}
//                         >
//                           −

//                           {/* <img src={minus} alt="" /> */}
//                         </button>

//                         <span
//                           className={`px-2 ${item.stockStatus === "out_of_stock" ? "text-muted text-decoration-line-through" : ""
//                             } page-title-main-name`}
//                         >
//                           {item.quantity}
//                         </span>

//                         <button
//                           className="btn btn-sm btn-outline-secondary page-title-main-name"
//                           style={{
//                             border: "none",
//                             background: "#FFF",
//                             boxShadow: "none",
//                             borderTop: "none",
//                             borderBottom: "none",
//                           }}
//                           onClick={() =>
//                             handleQuantityChange(item.cartItemId, item.quantity + 1)
//                           }
//                           disabled={item.stockStatus === "out_of_stock"}
//                         >
//                           +

//                           {/* <img src={plush} alt="" /> */}
//                         </button>
//                       </div>

//                       <span
//                         className={`fw-bold page-title-main-name ${item.stockStatus === "out_of_stock" ? "text-muted" : ""
//                           }`}
//                       >
//                         ₹{item.subTotal.toFixed(2)}
//                       </span>

//                       <button
//                         onClick={() => handleShowConfirm(item)}
//                         className="btn btn-outline-danger"
//                         title="Remove item from cart"
//                       >
//                         {/* <i className="bi bi-trash"></i> */}
//                         <i class="bi bi-trash3"></i>
//                       </button>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>

//             {/* Free Gifts Section */}
//             {cartData.freebies?.length > 0 && (
//               <div className="mt-4">
//                 <h5 className="ms-3 page-title-main-name">Free Gifts 🎁</h5>
//                 <ul className="list-group">
//                   {cartData.freebies.map((freebie, idx) => {
//                     const variant = freebie.variant || {};
//                     const image = variant.images?.[0] || variant.image || "/placeholder.png";

//                     return (
//                       <li key={idx} className="list-group-item d-flex align-items-center gap-3">
//                         <img
//                           src={image}
//                           alt={freebie.name}
//                           style={{
//                             width: "80px",
//                             height: "80px",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                           }}
//                         />
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
//           </div>

//           <div className="col-xxl-4 col-12 mt-4 mt-lg-0">
//             <div className="border-color-width">
//               <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
//                 <div className="d-flex align-items-center">
//                   <div>
//                     <div className="fw-600 ms-3 fs-5 page-title-main-name">Coupons & Bank Offers</div>
//                   </div>
//                 </div>
//                 <i
//                   className="bi bi-chevron-right margin-left-right"
//                   onClick={() => setShowCouponModal(true)}
//                   style={{ cursor: "pointer" }}
//                 ></i>
//               </div>

//               <hr />
//               <div className="d-flex justify-content-start align-items-center" style={{ cursor: "pointer" }}>
//                 <h5 className="ms-3 fs-5 fw-600 page-title-main-name">Order Summary</h5>
//               </div>
//               <hr />

//               <div className="mb-3 page-title-main-name">
//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert">
//                   <span className="page-title-main-name">Bag MRP:</span>
//                   <span className="page-title-main-name">₹{cartData.bagMrp?.toFixed(2) || "0.00"}</span>
//                 </div>

//                 {cartData.bagDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert">
//                     <span className="page-title-main-name">Bag Discount:</span>
//                     <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}

//                 <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
//                   <div className="d-block">
//                     <span className="page-title-main-name">Shipping:</span>
//                     {cartData.shippingMessage && (
//                       <div className="small mb-2 page-title-main-name" style={{color:"#51C878"}}>
//                         <i className="bi bi-truck me-1 page-title-main-name"></i>
//                         {cartData.shippingMessage}
//                       </div>
//                     )}
//                   </div>
//                   <span className={cartData.shipping === 0 ? "text-success" : ""}>
//                     ₹{cartData.shipping?.toFixed(2) || "0.00"}
//                     {cartData.shipping === 0 && (
//                       <span className="ms-1 small page-title-main-name">Free Shipping</span>
//                     )}
//                   </span>
//                 </div>

//                 {cartData.couponDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-1 text-success margin-left-right-repert pb-2 page-title-main-name">
//                     <span>Coupon Discount:</span>
//                     <span>-₹{cartData.couponDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}

//                 <hr />
//                 <div className="d-flex justify-content-between mb-1 pt-2 margin-left-right-repert">
//                   <span className="fw-semibold page-title-main-name">Taxable Amount:</span>
//                   <span className="fw-semibold page-title-main-name">
//                     ₹{cartData.taxableAmount?.toFixed(2) || "0.00"}
//                   </span>
//                 </div>

//                 <div className="d-flex justify-content-between mb-1 margin-left-right-repert page-title-main-name">
//                   <span className="page-title-main-name">GST ({cartData.gstRate})</span>
//                   <span className="page-title-main-name">+₹{cartData.gstAmount?.toFixed(2) || "0.00"}</span>
//                 </div>

//                 {cartData.gstMessage && (
//                   <div className="small text-muted mb-2 margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-receipt me-1"></i>
//                     {cartData.gstMessage}
//                   </div>
//                 )}

//                 <hr />
//                 <div className="d-flex justify-content-between mb-3 pt-2 margin-left-right-repert align-items-center">
//                   <span className="fw-bold page-title-main-name">Total Payable:</span>
//                   <span className="fw-bold text-primary fs-5 page-title-main-name text-black">
//                     ₹{cartData.payable?.toFixed(2) || "0.00"}
//                   </span>
//                 </div>

//                 <hr />

//                 {cartData.savingsMessage && (
//                   <div variant="success" className="py-2 small margin-left-right-repert page-title-main-name">
//                     <i className="bi bi-coin me-1"></i>
//                     {cartData.savingsMessage}
//                   </div>
//                 )}
//               </div>

//               {cartData.appliedCoupon?.code && (
//                 <div className="mb-3 p-2 border rounded bg-success text-white margin-left-right-repert">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <strong>Applied Coupon:</strong> {cartData.appliedCoupon.code}
//                       {cartData.appliedCoupon.discount && (
//                         <span className="ms-2">- ₹{cartData.appliedCoupon.discount} off</span>
//                       )}
//                     </div>
//                     <button
//                       className="btn btn-sm btn-outline-light"
//                       onClick={handleRemoveCoupon}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {couponMessage && (
//                 <div className={`mt-2 alert backend-color ${couponMessageColor} text-white`}>
//                   {couponMessage}
//                 </div>
//               )}

//               {stockError && (
//                 <Alert variant="warning" className="mb-2">
//                   <strong>
//                     {(cartData.cart || []).find((i) => !i.canCheckout)?.name || "Item"}
//                   </strong>
//                   {" – "}
//                   {stockError}
//                 </Alert>
//               )}

//               <button
//                 className="page-title-main-name bg-black text-white checkout-button w-100 mt-3 py-2 fw-bold"
//                 onClick={handleProceed}
//                 disabled={initiating || !!stockError}
//               >
//                 {initiating ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2 page-title-main-name" role="status"></span>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-lock-fill me-2"></i>
//                     Proceed to Checkout (₹{cartData.payable?.toFixed(2)})
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Confirm Remove Modal */}
//       <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Removal</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="page-title-main-name">
//           Are you sure you want to remove "{itemToRemove?.name}" from your cart?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseConfirm}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleConfirmRemove}>
//             Remove
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Coupon Modal */}
//       <div className={`modal fade ${showCouponModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//         <div className="modal-dialog modal-lg modal-dialog-centered page-title-main-name" role="document">
//           <div className="modal-content border-0 rounded-0">
//             <div className="modal-header border-bottom py-3 px-4">
//               <h5 className="modal-title fw-normal" style={{ color: '#444' }}>Apply Coupon</h5>
//               <button
//                 type="button"
//                 className="btn-close shadow-none mb-0"
//                 onClick={() => setShowCouponModal(false)}
//                 aria-label="Close"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="modal-body p-4 bg-light">
//               <ul className="nav nav-tabs border-0 mb-4 justify-content-center">
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "available" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("available")}>
//                     Available
//                   </button>
//                 </li>
//                 <li className="nav-item">
//                   <button className={`nav-link border-0 shadow-none ${activeCouponTab === "inapplicable" ? "active border-bottom border-dark text-dark fw-bold" : "text-muted"}`} onClick={() => setActiveCouponTab("inapplicable")}>
//                     Not Applicable
//                   </button>
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
//                             <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn page-title-main-name" onClick={() => handleCouponSubmit(c.code)}>
//                               Apply
//                             </button>
//                           )}
//                         </div>
//                         <p className="ticket-desc mb-2 text-muted page-title-main-name">
//                           {c.description || "Enjoy discount on your order"}
//                         </p>
//                         <div className="ticket-divider"></div>
//                         <small
//                           className="ticket-footer text-muted page-title-main-name"
//                           style={{ cursor: 'pointer', textDecoration: 'underline' }}
//                           onClick={() => handleShowDiscountProducts(c)}
//                         >
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
























// import React, { useEffect, useState, useContext, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/cartpage.css";
// import { CartContext } from "../Context/Cartcontext";
// import { FaTimes } from "react-icons/fa";
// import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import { Modal, Button, Alert } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import axios from "axios";
// import { UserContext } from "./UserContext.jsx";
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

// // ─── Recommendation product card (mirrors Foryou.jsx card exactly) ───────────
// const RecoProductCard = ({ product, navigate, user }) => {
//   const [selectedVariant, setSelectedVariant] = useState(
//     product.selectedVariant || product.variants?.[0] || {}
//   );




//   const [addingToCart, setAddingToCart] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");
//   const [variantSelected, setVariantSelected] = useState(false);

//   const allVariants = product.variants || [];
//   const groupedVariants = groupVariantsByType(allVariants);
//   const totalVariants = allVariants.length;
//   const hasVariants = totalVariants > 0;

//   const variant = selectedVariant || {};
//   const displayPrice = variant.displayPrice || variant.discountedPrice || product.price || 0;
//   const originalPrice = variant.originalPrice || product.price || displayPrice;
//   const discountPercent = variant.discountPercent || 0;
//   const imageUrl = variant.images?.[0] || "/placeholder.png";
//   const outOfStock = hasVariants ? (variant.stock ?? 0) <= 0 : (product.stock ?? 0) <= 0;
//   const showSelectVariant = hasVariants && !variantSelected;
//   const brandName =
//     typeof product.brand === "object" ? product.brand?.name : product.brand || "";

//   // ── wishlist helpers ──────────────────────────────────────────────────────
//   const isInWishlist = useCallback(() => {
//     const sku = getSku(variant);
//     return wishlistData.some(
//       (item) =>
//         (item.productId === product._id || item._id === product._id) &&
//         item.sku === sku
//     );
//   }, [wishlistData, variant, product._id]);

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(
//           local.map((item) => ({
//             productId: item._id,
//             _id: item._id,
//             sku: item.sku,
//           }))
//         );
//       }
//     } catch {
//       setWishlistData([]);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchWishlistData();
//   }, [fetchWishlistData]);

//   const toggleWishlist = async (e) => {
//     e.stopPropagation();
//     setWishlistLoading(true);
//     const productId = product._id;
//     const sku = getSku(variant);
//     const inWishlist = isInWishlist();
//     try {
//       if (user && !user.guest) {
//         if (inWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { withCredentials: true, data: { sku } }
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       } else {
//         const guestWishlist =
//           JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         if (inWishlist) {
//           const updated = guestWishlist.filter(
//             (item) => !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(updated));
//           toast.success("Removed from wishlist!");
//         } else {
//           guestWishlist.push({
//             _id: productId,
//             name: product.name,
//             sku,
//             image: imageUrl,
//             displayPrice,
//             originalPrice,
//           });
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error("Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   // ── add to cart ───────────────────────────────────────────────────────────
//   const handleAddToCart = async (e) => {
//     e.stopPropagation();
//     if (showSelectVariant) {
//       setShowVariantOverlay(true);
//       return;
//     }
//     setAddingToCart(true);
//     try {
//       const payload = hasVariants
//         ? {
//           productId: product._id,
//           variants: [{ variantSku: getSku(variant), quantity: 1 }],
//         }
//         : { productId: product._id, quantity: 1 };

//       const res = await axios.post(`${API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!res.data.success) throw new Error(res.data.message || "Failed");
//       toast.success("Product added to cart!");
//       navigate("/cartpage");
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || err.message || "Failed to add to cart";
//       toast.error(msg);
//       if (err.response?.status === 401) navigate("/login");
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   // ── variant select ────────────────────────────────────────────────────────
//   const handleVariantSelect = (v) => {
//     setSelectedVariant(v);
//     setVariantSelected(true);
//     setShowVariantOverlay(false);
//   };

//   const buttonText = addingToCart
//     ? "Adding..."
//     : showSelectVariant
//       ? "Select Variant"
//       : outOfStock
//         ? "Out of Stock"
//         : "Add to Bag";

//   const inWishlist = isInWishlist();

//   return (
//     <div className="foryou-card-wrapper" style={{ minWidth: "200px", flex: "0 0 auto" }}>
//       <div className="foryou-card">
//         {/* Image wrapper */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => navigate(`/product/${product._id}`)}
//           style={{ cursor: "pointer" }}
//         >
//           <img
//             src={imageUrl}
//             alt={product.name || "Product"}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//             }}
//           />

//           {/* Wishlist button */}
//           <button
//             onClick={toggleWishlist}
//             disabled={wishlistLoading}
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               cursor: wishlistLoading ? "not-allowed" : "pointer",
//               color: inWishlist ? "#dc3545" : "#000000",
//               fontSize: "22px",
//               zIndex: 2,
//               backgroundColor: "rgba(255,255,255,0.9)",
//               borderRadius: "50%",
//               width: "34px",
//               height: "34px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               transition: "all 0.3s ease",
//               border: "none",
//               outline: "none",
//             }}
//             title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             {wishlistLoading ? (
//               <div className="spinner-border spinner-border-sm" role="status" />
//             ) : inWishlist ? (
//               <FaHeart />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>

//           {/* Promo badge */}
//           {variant.promoApplied && (
//             <div className="promo-badge">
//               <i className="bi bi-tag-fill me-1"></i>Promo
//             </div>
//           )}

//           {/* Out-of-stock overlay badge */}
//           {outOfStock && (
//             <span
//               className="badge bg-secondary"
//               style={{
//                 position: "absolute",
//                 top: "6px",
//                 left: "6px",
//                 fontSize: "10px",
//                 zIndex: 1,
//               }}
//             >
//               Out of Stock
//             </span>
//           )}

//           {/* Discount badge */}
//           {!outOfStock && discountPercent > 0 && (
//             <span
//               className="badge bg-danger"
//               style={{
//                 position: "absolute",
//                 top: "6px",
//                 left: "6px",
//                 fontSize: "10px",
//                 zIndex: 1,
//               }}
//             >
//               {discountPercent}% OFF
//             </span>
//           )}
//         </div>

//         {/* Product info — same structure as Foryou.jsx */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           <div
//             className="justify-content-between d-flex flex-column"
//             style={{ height: "260px" }}
//           >
//             {/* Brand */}
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">
//               {brandName}
//             </div>

//             {/* Name */}
//             <h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => navigate(`/product/${product._id}`)}
//               style={{ cursor: "pointer" }}
//             >
//               {product.name || "Unnamed Product"}
//             </h6>

//             {/* Variant display */}
//             {hasVariants && (
//               <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                 {variantSelected ? (
//                   <div
//                     className="selected-variant-display text-muted small"
//                     style={{ cursor: "pointer", display: "inline-block" }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowVariantOverlay(true);
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span className="fw-bold text-dark">
//                       {getVariantDisplayText(variant)}
//                     </span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted" style={{ height: "20px" }}>
//                     {totalVariants} Variants Available
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Price */}
//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span className="current-price fw-400 fs-5">₹{displayPrice}</span>
//                 {originalPrice > displayPrice && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                       ₹{originalPrice}
//                     </span>
//                     <span className="discount-percent text-danger fw-bold ms-2">
//                       ({discountPercent}% OFF)
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Add to Cart button */}
//             <div className="cart-section">
//               <div className="d-flex align-items-center justify-content-between">
//                 <button
//                   className="w-100 btn-add-cart"
//                   onClick={handleAddToCart}
//                   disabled={addingToCart || (!showSelectVariant && outOfStock)}
//                   style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
//                 >
//                   {addingToCart ? (
//                     <>
//                       <span
//                         className="spinner-border spinner-border-sm me-2"
//                         role="status"
//                       />
//                       Adding...
//                     </>
//                   ) : (
//                     <>
//                       {buttonText}
//                       {!addingToCart && !showSelectVariant && !outOfStock && (
//                         <img
//                           src={bagIcon}
//                           className="img-fluid ms-1"
//                           style={{ marginTop: "-3px", height: "20px" }}
//                           alt="Bag-icon"
//                         />
//                       )}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Variant Overlay — same as Foryou.jsx */}
//       {showVariantOverlay && (
//         <div
//           className="variant-overlay"
//           onClick={() => setShowVariantOverlay(false)}
//         >
//           <div
//             className="variant-overlay-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "100%",
//               maxWidth: "500px",
//               maxHeight: "100vh",
//               background: "#fff",
//               borderRadius: "12px",
//               overflow: "hidden",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {/* Header */}
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">
//                 Select Variant ({totalVariants})
//               </h5>
//               <button
//                 onClick={() => setShowVariantOverlay(false)}
//                 style={{ background: "none", border: "none", fontSize: "24px" }}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="variant-tabs d-flex">
//               <button
//                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                 onClick={() => setSelectedVariantType("all")}
//               >
//                 All ({totalVariants})
//               </button>
//               {groupedVariants.color.length > 0 && (
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("color")}
//                 >
//                   Colors ({groupedVariants.color.length})
//                 </button>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <button
//                   className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("text")}
//                 >
//                   Sizes ({groupedVariants.text.length})
//                 </button>
//               )}
//             </div>

//             {/* Content */}
//             <div className="p-3 overflow-auto flex-grow-1">
//               {/* Color variants */}
//               {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                 groupedVariants.color.length > 0 && (
//                   <div className="row row-col-4 g-3 mb-4">
//                     {groupedVariants.color.map((v) => {
//                       const isSelected = variant.sku === v.sku;
//                       const isOOS = (v.stock ?? 0) <= 0;
//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOOS && handleVariantSelect(v)}
//                           >
//                             <div
//                               className="page-title-main-name"
//                               style={{
//                                 width: "28px",
//                                 height: "28px",
//                                 borderRadius: "20%",
//                                 backgroundColor: v.hex || "#ccc",
//                                 margin: "0 auto 8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 opacity: isOOS ? 0.5 : 1,
//                                 position: "relative",
//                               }}
//                             >
//                               {isSelected && (
//                                 <span
//                                   style={{
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     color: "#fff",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   ✓
//                                 </span>
//                               )}
//                             </div>
//                             <div
//                               className="small page-title-main-name"
//                               style={{ fontSize: "12px" }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOOS && (
//                               <div className="text-danger small">Out of Stock</div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//               {/* Text variants */}
//               {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                 groupedVariants.text.length > 0 && (
//                   <div className="row row-cols-3 g-0">
//                     {groupedVariants.text.map((v) => {
//                       const isSelected = variant.sku === v.sku;
//                       const isOOS = (v.stock ?? 0) <= 0;
//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOOS && handleVariantSelect(v)}
//                           >
//                             <div
//                               style={{
//                                 padding: "10px",
//                                 borderRadius: "8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 background: isSelected ? "#f8f9fa" : "#fff",
//                                 minHeight: "50px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 opacity: isOOS ? 0.5 : 1,
//                               }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOOS && (
//                               <div className="text-danger small mt-1">Out of Stock</div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main CartPage ────────────────────────────────────────────────────────────
// const CartPage = () => {
//   const [isClicked, setIsClicked] = useState(false);

//   const handleClick = () => {
//     setIsClicked(true);
//     handleCloseConfirm(); // your existing function
//   };


//   const navigate = useNavigate();
//   const location = useLocation();
//   const { syncCartFromBackend } = useContext(CartContext);
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

//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageColor, setCouponMessageColor] = useState("info");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [activeCouponTab, setActiveCouponTab] = useState("available");
//   const [manualCoupon, setManualCoupon] = useState("");
//   let cartCallCount = 0;

//   // ── fetch cart ──────────────────────────────────────────────────────────────
//   const fetchCart = async (discountCode = null) => {
//     cartCallCount++;
//     try {
//       setLoading(true);
//       const url = discountCode
//         ? `${API_BASE}/summary?discount=${discountCode}`
//         : `${API_BASE}/summary`;
//       const res = await fetch(url, { credentials: "include" });

//       if (res.status === 400) {
//         setCartData({ cart: [], freebies: [], bagMrp: 0, bagDiscount: 0, autoDiscount: 0, couponDiscount: 0, shipping: 0, taxableAmount: 0, gstRate: "0%", gstAmount: 0, gstMessage: "", payable: 0, appliedCoupon: null, applicableCoupons: [], inapplicableCoupons: [], promotions: [], totalSavings: 0, savingsMessage: "", grandTotal: 0, shippingMessage: "" });
//         setStockError("");
//         setLoading(false);
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
//       setLoading(false);
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
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove item from cart.");
//       await fetchCart();
//     }
//   };

//   // ── coupon handlers ─────────────────────────────────────────────────────────
//   const handleCouponSubmit = async (code) => {
//     if (!code) { setCouponMessage("Please enter a coupon code."); setCouponMessageColor("warning"); return; }
//     try {
//       await fetchCart(code);
//       localStorage.setItem("appliedCoupon", code);
//       setCouponMessage(`Coupon ${code} applied successfully!`);
//       setCouponMessageColor("success");
//       setShowCouponModal(false);
//       setManualCoupon("");
//     } catch { setCouponMessage("Failed to apply coupon."); setCouponMessageColor("danger"); }
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
//   const handleProceed = async () => {
//     try {
//       setInitiating(true);
//       if (!document.cookie.includes("token=")) {
//         navigate("/login", { state: { from: "/cartpage", message: "Please login to proceed with checkout" } });
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
//         method: "POST", credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) { if (res.status === 401) navigate("/login"); throw new Error("Failed to initiate order"); }
//       const orderData = await res.json();
//       navigate("/AddressSelection", {
//         state: {
//           orderId: orderData.orderId,
//           cartItems: cartData.cart,
//           priceDetails: {
//             bagMrp: cartData.bagMrp, bagDiscount: cartData.bagDiscount,
//             autoDiscount: cartData.autoDiscount, couponDiscount: cartData.couponDiscount,
//             shipping: cartData.shipping, taxableAmount: cartData.taxableAmount,
//             gstRate: cartData.gstRate, gstAmount: cartData.gstAmount,
//             gstMessage: cartData.gstMessage, payable: cartData.payable,
//             appliedCoupon: cartData.appliedCoupon, totalSavings: cartData.totalSavings,
//             savingsMessage: cartData.savingsMessage,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "Something went wrong during checkout.");
//     } finally {
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
//   // if (loading) {
//   //   return (
//   //     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//   //       <div className="spinner-border text-primary" role="status">
//   //         <span className="visually-hidden">Loading...</span>
//   //       </div>
//   //     </div>
//   //   );
//   // }







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

//   if (!cartData || (cartData.cart.length === 0 && cartData.freebies?.length === 0)) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-xl-5 pt-xl-5">
//           <div className="p-4 text-center mt-5 cartpage-empty-Main-section">
//             <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
//             <h5 className="mb-2 page-title-main-name">Your cart is empty 🛒</h5>
//             <button className="page-title-main-name Shop-now-Button" onClick={() => navigate("/")}>
//               Shop Now
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // ── render ──────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="container-lg Conatiner-fluid mt-xl-5 pt-xl-5">
//         <h2 className="page-title-main-name mb-4 cartpage-titlesss">Your Cart</h2>
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
//                         <strong className="page-title-main-name">{item.name}</strong>
//                         {item.brand && <div className="text-muted small page-title-main-name">{item.brand}</div>}
//                         {item.stockStatus !== "in_stock" && (
//                           <div className="small text-danger fw-semibold page-title-main-name">{item.stockMessage || "Out of stock"}</div>
//                         )}
//                         {shadeName && (
//                           <div className="mt-1 small d-flex align-items-center gap-2 page-title-main-name">
//                             <span>Shade: {shadeName}</span>
//                             {shadeHex && <span style={{ width: "16px", height: "16px", borderRadius: "50%", display: "inline-block", backgroundColor: shadeHex, border: "1px solid #aaa" }} />}
//                           </div>
//                         )}
//                         <div className="small d-flex align-items-center page-title-main-name">
//                           {variant.originalPrice && variant.originalPrice > item.price ? (
//                             <>
//                               <span className="text-muted text-decoration-line-through me-1">₹{variant.originalPrice}</span>
//                               <span className="fw-bold text-danger">₹{item.price}</span>
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

//             {/* ── Recommendations — Foryou-style cards ── */}


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
//                     <span className="page-title-main-name">Bag Discount :</span>
//                     <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}
//                 <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
//                   <div className="d-block">
//                     <span className="page-title-main-name">Shipping :</span>
//                     {cartData.shippingMessage && (
//                       <div className="small mb-2 page-title-main-name" style={{ color: "#51C878" }}>
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

//       {/* Confirm Remove Modal */}
//       <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
//         <Modal.Header closeButton><Modal.Title>Confirm Removal</Modal.Title></Modal.Header>
//         <Modal.Body className="page-title-main-name">Are you sure you want to remove "{itemToRemove?.name}" from your cart?</Modal.Body>
//         <Modal.Footer>
//           {/* <Button className="btn-for-back-buttons border-black" onClick={handleCloseConfirm}>Cancel</Button> */}
//           <Button
//             className={`btn-for-back-buttons border-black ${isClicked ? "active-black" : ""}`}
//             onClick={handleClick}
//           >
//             Cancel
//           </Button>
//           <Button className="btn-for-back-buttons-bg-color" onClick={handleConfirmRemove}>Remove</Button>
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
//                             <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn" onClick={() => handleCouponSubmit(c.code)}>Apply</button>
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

//       <div className="container">
//         {!recoLoading && recommendations.length > 0 && (
//           <div className="mt-5">
//             {recommendations.map((section) => (
//               <div key={section.key} className="mb-5">

//                 {/* Section Title */}
//                 <h2
//                   className="font-familys text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
//                   style={{ fontSize: "1.4rem" }}
//                 >
//                   {section.title}
//                 </h2>

//                 {/* Swiper Slider */}
//                 <Swiper
//                   spaceBetween={20}
//                   slidesPerView={2}
//                   breakpoints={{
//                     576: {
//                       slidesPerView: 2,
//                     },
//                     768: {
//                       slidesPerView: 3,
//                     },
//                     992: {
//                       slidesPerView: 4,
//                     },
//                     1200: {
//                       slidesPerView: 4,
//                     },
//                     1400: {
//                       slidesPerView: 4,
//                     },
//                   }}
//                 >
//                   {section.products.map((product) => (
//                     <SwiperSlide key={`${section.key}-${product._id}`}>
//                       <RecoProductCard
//                         product={product}
//                         navigate={navigate}
//                         user={user}
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>

//               </div>
//             ))}
//           </div>
//         )}
//       </div>


//       <Footer />
//     </>
//   );
// };

// export default CartPage;






















// import React, { useEffect, useState, useContext, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/cartpage.css";
// import { CartContext } from "../Context/Cartcontext";
// import { FaTimes } from "react-icons/fa";
// import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import { Modal, Button, Alert } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import axios from "axios";
// import { UserContext } from "./UserContext.jsx";
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

// // ─── Recommendation product card (mirrors Foryou.jsx card exactly) ───────────
// const RecoProductCard = ({ product, navigate, user }) => {
//   const [selectedVariant, setSelectedVariant] = useState(
//     product.selectedVariant || product.variants?.[0] || {}
//   );




//   const [addingToCart, setAddingToCart] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");
//   const [variantSelected, setVariantSelected] = useState(false);

//   const allVariants = product.variants || [];
//   const groupedVariants = groupVariantsByType(allVariants);
//   const totalVariants = allVariants.length;
//   const hasVariants = totalVariants > 0;

//   const variant = selectedVariant || {};
//   const displayPrice = variant.displayPrice || variant.discountedPrice || product.price || 0;
//   const originalPrice = variant.originalPrice || product.price || displayPrice;
//   const discountPercent = variant.discountPercent || 0;
//   const imageUrl = variant.images?.[0] || "/placeholder.png";
//   const outOfStock = hasVariants ? (variant.stock ?? 0) <= 0 : (product.stock ?? 0) <= 0;
//   const showSelectVariant = hasVariants && !variantSelected;
//   const brandName =
//     typeof product.brand === "object" ? product.brand?.name : product.brand || "";

//   // ── wishlist helpers ──────────────────────────────────────────────────────
//   const isInWishlist = useCallback(() => {
//     const sku = getSku(variant);
//     return wishlistData.some(
//       (item) =>
//         (item.productId === product._id || item._id === product._id) &&
//         item.sku === sku
//     );
//   }, [wishlistData, variant, product._id]);

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(
//           local.map((item) => ({
//             productId: item._id,
//             _id: item._id,
//             sku: item.sku,
//           }))
//         );
//       }
//     } catch {
//       setWishlistData([]);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchWishlistData();
//   }, [fetchWishlistData]);

//   const toggleWishlist = async (e) => {
//     e.stopPropagation();
//     setWishlistLoading(true);
//     const productId = product._id;
//     const sku = getSku(variant);
//     const inWishlist = isInWishlist();
//     try {
//       if (user && !user.guest) {
//         if (inWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { withCredentials: true, data: { sku } }
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       } else {
//         const guestWishlist =
//           JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         if (inWishlist) {
//           const updated = guestWishlist.filter(
//             (item) => !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(updated));
//           toast.success("Removed from wishlist!");
//         } else {
//           guestWishlist.push({
//             _id: productId,
//             name: product.name,
//             sku,
//             image: imageUrl,
//             displayPrice,
//             originalPrice,
//           });
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error("Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   // ── add to cart ───────────────────────────────────────────────────────────
//   const handleAddToCart = async (e) => {
//     e.stopPropagation();
//     if (showSelectVariant) {
//       setShowVariantOverlay(true);
//       return;
//     }
//     setAddingToCart(true);
//     try {
//       const payload = hasVariants
//         ? {
//           productId: product._id,
//           variants: [{ variantSku: getSku(variant), quantity: 1 }],
//         }
//         : { productId: product._id, quantity: 1 };

//       const res = await axios.post(`${API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!res.data.success) throw new Error(res.data.message || "Failed");
//       toast.success("Product added to cart!");
//       navigate("/cartpage");
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || err.message || "Failed to add to cart";
//       toast.error(msg);
//       if (err.response?.status === 401) navigate("/login");
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   // ── variant select ────────────────────────────────────────────────────────
//   const handleVariantSelect = (v) => {
//     setSelectedVariant(v);
//     setVariantSelected(true);
//     setShowVariantOverlay(false);
//   };

//   const buttonText = addingToCart
//     ? "Adding..."
//     : showSelectVariant
//       ? "Select Variant"
//       : outOfStock
//         ? "Out of Stock"
//         : "Add to Bag";

//   const inWishlist = isInWishlist();

//   return (
//     <div className="foryou-card-wrapper" style={{ minWidth: "200px", flex: "0 0 auto" }}>
//       <div className="foryou-card">
//         {/* Image wrapper */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => navigate(`/product/${product._id}`)}
//           style={{ cursor: "pointer" }}
//         >
//           <img
//             src={imageUrl}
//             alt={product.name || "Product"}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//             }}
//           />

//           {/* Wishlist button */}
//           <button
//             onClick={toggleWishlist}
//             disabled={wishlistLoading}
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               cursor: wishlistLoading ? "not-allowed" : "pointer",
//               color: inWishlist ? "#dc3545" : "#000000",
//               fontSize: "22px",
//               zIndex: 2,
//               backgroundColor: "rgba(255,255,255,0.9)",
//               borderRadius: "50%",
//               width: "34px",
//               height: "34px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               transition: "all 0.3s ease",
//               border: "none",
//               outline: "none",
//             }}
//             title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             {wishlistLoading ? (
//               <div className="spinner-border spinner-border-sm" role="status" />
//             ) : inWishlist ? (
//               <FaHeart />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>

//           {/* Promo badge */}
//           {variant.promoApplied && (
//             <div className="promo-badge">
//               <i className="bi bi-tag-fill me-1"></i>Promo
//             </div>
//           )}

//           {/* Out-of-stock overlay badge */}
//           {outOfStock && (
//             <span
//               className="badge bg-secondary"
//               style={{
//                 position: "absolute",
//                 top: "6px",
//                 left: "6px",
//                 fontSize: "10px",
//                 zIndex: 1,
//               }}
//             >
//               Out of Stock
//             </span>
//           )}

//           {/* Discount badge */}
//           {!outOfStock && discountPercent > 0 && (
//             <span
//               className="badge bg-danger"
//               style={{
//                 position: "absolute",
//                 top: "6px",
//                 left: "6px",
//                 fontSize: "10px",
//                 zIndex: 1,
//               }}
//             >
//               {discountPercent}% OFF
//             </span>
//           )}
//         </div>

//         {/* Product info — same structure as Foryou.jsx */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           <div
//             className="justify-content-between d-flex flex-column"
//             style={{ height: "260px" }}
//           >
//             {/* Brand */}
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">
//               {brandName}
//             </div>

//             {/* Name */}
//             <h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => navigate(`/product/${product._id}`)}
//               style={{ cursor: "pointer" }}
//             >
//               {product.name || "Unnamed Product"}
//             </h6>

//             {/* Variant display */}
//             {hasVariants && (
//               <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                 {variantSelected ? (
//                   <div
//                     className="selected-variant-display text-muted small"
//                     style={{ cursor: "pointer", display: "inline-block" }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowVariantOverlay(true);
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span className="fw-bold text-dark">
//                       {getVariantDisplayText(variant)}
//                     </span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted" style={{ height: "20px" }}>
//                     {totalVariants} Variants Available
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Price */}
//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span className="current-price fw-400 fs-5">₹{displayPrice}</span>
//                 {originalPrice > displayPrice && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                       ₹{originalPrice}
//                     </span>
//                     <span className="discount-percent text-danger fw-bold ms-2">
//                       ({discountPercent}% OFF)
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Add to Cart button */}
//             <div className="cart-section">
//               <div className="d-flex align-items-center justify-content-between">
//                 <button
//                   className="w-100 btn-add-cart"
//                   onClick={handleAddToCart}
//                   disabled={addingToCart || (!showSelectVariant && outOfStock)}
//                   style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
//                 >
//                   {addingToCart ? (
//                     <>
//                       <span
//                         className="spinner-border spinner-border-sm me-2"
//                         role="status"
//                       />
//                       Adding...
//                     </>
//                   ) : (
//                     <>
//                       {buttonText}
//                       {!addingToCart && !showSelectVariant && !outOfStock && (
//                         <img
//                           src={bagIcon}
//                           className="img-fluid ms-1"
//                           style={{ marginTop: "-3px", height: "20px" }}
//                           alt="Bag-icon"
//                         />
//                       )}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Variant Overlay — same as Foryou.jsx */}
//       {showVariantOverlay && (
//         <div
//           className="variant-overlay"
//           onClick={() => setShowVariantOverlay(false)}
//         >
//           <div
//             className="variant-overlay-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "100%",
//               maxWidth: "500px",
//               maxHeight: "100vh",
//               background: "#fff",
//               borderRadius: "12px",
//               overflow: "hidden",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {/* Header */}
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">
//                 Select Variant ({totalVariants})
//               </h5>
//               <button
//                 onClick={() => setShowVariantOverlay(false)}
//                 style={{ background: "none", border: "none", fontSize: "24px" }}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="variant-tabs d-flex">
//               <button
//                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                 onClick={() => setSelectedVariantType("all")}
//               >
//                 All ({totalVariants})
//               </button>
//               {groupedVariants.color.length > 0 && (
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("color")}
//                 >
//                   Colors ({groupedVariants.color.length})
//                 </button>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <button
//                   className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("text")}
//                 >
//                   Sizes ({groupedVariants.text.length})
//                 </button>
//               )}
//             </div>

//             {/* Content */}
//             <div className="p-3 overflow-auto flex-grow-1">
//               {/* Color variants */}
//               {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                 groupedVariants.color.length > 0 && (
//                   <div className="row row-col-4 g-3 mb-4">
//                     {groupedVariants.color.map((v) => {
//                       const isSelected = variant.sku === v.sku;
//                       const isOOS = (v.stock ?? 0) <= 0;
//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOOS && handleVariantSelect(v)}
//                           >
//                             <div
//                               className="page-title-main-name"
//                               style={{
//                                 width: "28px",
//                                 height: "28px",
//                                 borderRadius: "20%",
//                                 backgroundColor: v.hex || "#ccc",
//                                 margin: "0 auto 8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 opacity: isOOS ? 0.5 : 1,
//                                 position: "relative",
//                               }}
//                             >
//                               {isSelected && (
//                                 <span
//                                   style={{
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     color: "#fff",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   ✓
//                                 </span>
//                               )}
//                             </div>
//                             <div
//                               className="small page-title-main-name"
//                               style={{ fontSize: "12px" }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOOS && (
//                               <div className="text-danger small">Out of Stock</div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//               {/* Text variants */}
//               {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                 groupedVariants.text.length > 0 && (
//                   <div className="row row-cols-3 g-0">
//                     {groupedVariants.text.map((v) => {
//                       const isSelected = variant.sku === v.sku;
//                       const isOOS = (v.stock ?? 0) <= 0;
//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOOS && handleVariantSelect(v)}
//                           >
//                             <div
//                               style={{
//                                 padding: "10px",
//                                 borderRadius: "8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 background: isSelected ? "#f8f9fa" : "#fff",
//                                 minHeight: "50px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 opacity: isOOS ? 0.5 : 1,
//                               }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOOS && (
//                               <div className="text-danger small mt-1">Out of Stock</div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main CartPage ────────────────────────────────────────────────────────────
// const CartPage = () => {
//   const [isClicked, setIsClicked] = useState(false);

//   const handleClick = () => {
//     setIsClicked(true);
//     handleCloseConfirm(); // your existing function
//   };


//   const navigate = useNavigate();
//   const location = useLocation();
//   const { syncCartFromBackend } = useContext(CartContext);
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

//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageColor, setCouponMessageColor] = useState("info");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [activeCouponTab, setActiveCouponTab] = useState("available");
//   const [manualCoupon, setManualCoupon] = useState("");
//   let cartCallCount = 0;

//   // ── fetch cart ──────────────────────────────────────────────────────────────
//   const fetchCart = async (discountCode = null) => {
//     cartCallCount++;
//     try {
//       setLoading(true);
//       const url = discountCode
//         ? `${API_BASE}/summary?discount=${discountCode}`
//         : `${API_BASE}/summary`;
//       const res = await fetch(url, { credentials: "include" });

//       if (res.status === 400) {
//         setCartData({ cart: [], freebies: [], bagMrp: 0, bagDiscount: 0, autoDiscount: 0, couponDiscount: 0, shipping: 0, taxableAmount: 0, gstRate: "0%", gstAmount: 0, gstMessage: "", payable: 0, appliedCoupon: null, applicableCoupons: [], inapplicableCoupons: [], promotions: [], totalSavings: 0, savingsMessage: "", grandTotal: 0, shippingMessage: "" });
//         setStockError("");
//         setLoading(false);
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
//       setLoading(false);
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
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove item from cart.");
//       await fetchCart();
//     }
//   };

//   // ── coupon handlers ─────────────────────────────────────────────────────────
//   const handleCouponSubmit = async (code) => {
//     if (!code) { setCouponMessage("Please enter a coupon code."); setCouponMessageColor("warning"); return; }
//     try {
//       await fetchCart(code);
//       localStorage.setItem("appliedCoupon", code);
//       setCouponMessage(`Coupon ${code} applied successfully!`);
//       setCouponMessageColor("success");
//       setShowCouponModal(false);
//       setManualCoupon("");
//     } catch { setCouponMessage("Failed to apply coupon."); setCouponMessageColor("danger"); }
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
//   const handleProceed = async () => {
//     try {
//       setInitiating(true);
//       if (!document.cookie.includes("token=")) {
//         navigate("/login", { state: { from: "/cartpage", message: "Please login to proceed with checkout" } });
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
//         method: "POST", credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) { if (res.status === 401) navigate("/login"); throw new Error("Failed to initiate order"); }
//       const orderData = await res.json();
//       navigate("/AddressSelection", {
//         state: {
//           orderId: orderData.orderId,
//           cartItems: cartData.cart,
//           priceDetails: {
//             bagMrp: cartData.bagMrp, bagDiscount: cartData.bagDiscount,
//             autoDiscount: cartData.autoDiscount, couponDiscount: cartData.couponDiscount,
//             shipping: cartData.shipping, taxableAmount: cartData.taxableAmount,
//             gstRate: cartData.gstRate, gstAmount: cartData.gstAmount,
//             gstMessage: cartData.gstMessage, payable: cartData.payable,
//             appliedCoupon: cartData.appliedCoupon, totalSavings: cartData.totalSavings,
//             savingsMessage: cartData.savingsMessage,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "Something went wrong during checkout.");
//     } finally {
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
//   // if (loading) {
//   //   return (
//   //     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//   //       <div className="spinner-border text-primary" role="status">
//   //         <span className="visually-hidden">Loading...</span>
//   //       </div>
//   //     </div>
//   //   );
//   // }







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

//   if (!cartData || (cartData.cart.length === 0 && cartData.freebies?.length === 0)) {
//     return (
//       <>
//         <Header />
//         <div className="container mt-xl-5 pt-xl-5">
//           <div className="p-4 text-center mt-5 cartpage-empty-Main-section">
//             <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
//             <h5 className="mb-2 page-title-main-name">Your cart is empty 🛒</h5>
//             <button className="page-title-main-name Shop-now-Button" onClick={() => navigate("/")}>
//               Shop Now
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // ── render ──────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="container-lg Conatiner-fluid mt-xl-5 pt-xl-5">
//         <h2 className="page-title-main-name mb-4 cartpage-titlesss">Your Cart</h2>
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
//                         <strong className="page-title-main-name">{item.name}</strong>
//                         {item.brand && <div className="text-muted small page-title-main-name">{item.brand}</div>}
//                         {item.stockStatus !== "in_stock" && (
//                           <div className="small text-danger fw-semibold page-title-main-name">{item.stockMessage || "Out of stock"}</div>
//                         )}
//                         {shadeName && (
//                           <div className="mt-1 small d-flex align-items-center gap-2 page-title-main-name">
//                             <span>Shade: {shadeName}</span>
//                             {shadeHex && <span style={{ width: "16px", height: "16px", borderRadius: "50%", display: "inline-block", backgroundColor: shadeHex, border: "1px solid #aaa" }} />}
//                           </div>
//                         )}
//                         <div className="small d-flex align-items-center page-title-main-name">
//                           {variant.originalPrice && variant.originalPrice > item.price ? (
//                             <>
//                               <span className="text-muted text-decoration-line-through me-1">₹{variant.originalPrice}</span>
//                               <span className="fw-bold text-danger">₹{item.price}</span>
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

//             {/* ── Recommendations — Foryou-style cards ── */}


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
//                     <span className="page-title-main-name">Bag Discount :</span>
//                     <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}
//                 <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
//                   <div className="d-block">
//                     <span className="page-title-main-name">Shipping :</span>
//                     {cartData.shippingMessage && (
//                       <div className="small mb-2 page-title-main-name" style={{ color: "#51C878" }}>
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

//       {/* Confirm Remove Modal */}
//       <Modal className="page-title-main-name" show={showConfirm} onHide={handleCloseConfirm} centered>
//         <Modal.Header closeButton><Modal.Title>Confirm Removal</Modal.Title></Modal.Header>
//         <Modal.Body className="page-title-main-name">Are you sure you want to remove "{itemToRemove?.name}" from your cart?</Modal.Body>
//         <Modal.Footer>
//           {/* <Button className="btn-for-back-buttons border-black" onClick={handleCloseConfirm}>Cancel</Button> */}
//           <Button
//             className={`btn-for-back-buttons border-black ${isClicked ? "active-black" : ""}`}
//             onClick={handleClick}
//           >
//             Cancel
//           </Button>
//           <Button className="btn-for-back-buttons-bg-color" onClick={handleConfirmRemove}>Remove</Button>
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
//                             <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn" onClick={() => handleCouponSubmit(c.code)}>Apply</button>
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

//      <div className="container">
//   {!recoLoading && recommendations.length > 0 && (
//     <div className="mt-5">
//       {recommendations.map((section) => {

//         // ✅ Detect wishlist section
//         const isWishlistSection =
//           section.key === "wishlist" ||
//           section.title?.toLowerCase().includes("wishlist");

//         // ✅ Filter only AVAILABLE products
//         const filteredProducts = (section.products || []).filter((product) => {
//           if (!product) return false;

//           const variants = product.variants || [];

//           // If variants exist → check any variant in stock
//           if (variants.length > 0) {
//             return variants.some((v) => (v.stock ?? 0) > 0);
//           }

//           // If no variants → check product stock
//           return (product.stock ?? 0) > 0;
//         });

//         // ✅ If wishlist section AND no valid products → SKIP rendering
//       //  if (isWishlistSection && filteredProducts.length === 0) {
//       //     return null;
//       //   }


//       if (isWishlistSection && filteredProducts.length === 0) {
//   return (
//     <div key={section.key} className="mb-5 text-center text-muted">
//       {/* <h5>Your wishlist items are currently unavailable</h5> */}
//     </div>
//   );
// }

//         return (
//           <div key={section.key} className="mb-5">

//             {/* Section Title */}
//             <h2
//               className="font-familys text-start foryou-heading ms-0 mt-3 mb-3 fw-normal"
//               style={{ fontSize: "1.4rem" }}
//             >
//               {section.title}
//             </h2>

//             {/* Swiper Slider */}
//             <Swiper
//               spaceBetween={20}
//               slidesPerView={2}
//               breakpoints={{
//                 576: { slidesPerView: 2 },
//                 768: { slidesPerView: 3 },
//                 992: { slidesPerView: 4 },
//                 1200: { slidesPerView: 4 },
//                 1400: { slidesPerView: 4 },
//               }}
//             >
//               {(isWishlistSection ? filteredProducts : section.products).map((product) => (
//                 <SwiperSlide key={`${section.key}-${product._id}`}>
//                   <RecoProductCard
//                     product={product}
//                     navigate={navigate}
//                     user={user}
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//           </div>
//         );
//       })}
//     </div>
//   )}
// </div>


//       <Footer />
//     </>
//   );
// };

// export default CartPage;































// import React, { useEffect, useState, useContext, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/cartpage.css";
// import { CartContext } from "../Context/Cartcontext";
// import { FaTimes } from "react-icons/fa";
// import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import { Modal, Button, Alert } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import axios from "axios";
// import { UserContext } from "./UserContext.jsx";
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
// const RecoProductCard = ({ product, navigate, user }) => {
//   const [selectedVariant, setSelectedVariant] = useState(
//     product.selectedVariant || product.variants?.[0] || {}
//   );

//   const [addingToCart, setAddingToCart] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [wishlistData, setWishlistData] = useState([]);
//   const [showVariantOverlay, setShowVariantOverlay] = useState(false);
//   const [selectedVariantType, setSelectedVariantType] = useState("all");
//   const [variantSelected, setVariantSelected] = useState(false);

//   const allVariants = product.variants || [];
//   const groupedVariants = groupVariantsByType(allVariants);
//   const totalVariants = allVariants.length;
//   const hasVariants = totalVariants > 0;

//   const variant = selectedVariant || {};
//   const displayPrice = variant.displayPrice || variant.discountedPrice || product.price || 0;
//   const originalPrice = variant.originalPrice || product.price || displayPrice;
//   const discountPercent = variant.discountPercent || 0;
//   const imageUrl = variant.images?.[0] || "/placeholder.png";
//   const outOfStock = hasVariants ? (variant.stock ?? 0) <= 0 : (product.stock ?? 0) <= 0;
//   const showSelectVariant = hasVariants && !variantSelected;
//   const brandName =
//     typeof product.brand === "object" ? product.brand?.name : product.brand || "";

//   // ── wishlist helpers ──────────────────────────────────────────────────────
//   const isInWishlist = useCallback(() => {
//     const sku = getSku(variant);
//     return wishlistData.some(
//       (item) =>
//         (item.productId === product._id || item._id === product._id) &&
//         item.sku === sku
//     );
//   }, [wishlistData, variant, product._id]);

//   const fetchWishlistData = useCallback(async () => {
//     try {
//       if (user && !user.guest) {
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/wishlist",
//           { withCredentials: true }
//         );
//         if (res.data.success) setWishlistData(res.data.wishlist || []);
//       } else {
//         const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         setWishlistData(
//           local.map((item) => ({
//             productId: item._id,
//             _id: item._id,
//             sku: item.sku,
//           }))
//         );
//       }
//     } catch {
//       setWishlistData([]);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchWishlistData();
//   }, [fetchWishlistData]);

//   const toggleWishlist = async (e) => {
//     e.stopPropagation();
//     setWishlistLoading(true);
//     const productId = product._id;
//     const sku = getSku(variant);
//     const inWishlist = isInWishlist();
//     try {
//       if (user && !user.guest) {
//         if (inWishlist) {
//           await axios.delete(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { withCredentials: true, data: { sku } }
//           );
//           toast.success("Removed from wishlist!");
//         } else {
//           await axios.post(
//             `https://beauty.joyory.com/api/user/wishlist/${productId}`,
//             { sku },
//             { withCredentials: true }
//           );
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       } else {
//         const guestWishlist =
//           JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
//         if (inWishlist) {
//           const updated = guestWishlist.filter(
//             (item) => !(item._id === productId && item.sku === sku)
//           );
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(updated));
//           toast.success("Removed from wishlist!");
//         } else {
//           guestWishlist.push({
//             _id: productId,
//             name: product.name,
//             sku,
//             image: imageUrl,
//             displayPrice,
//             originalPrice,
//           });
//           localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
//           toast.success("Added to wishlist!");
//         }
//         await fetchWishlistData();
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.error("Please login to use wishlist");
//         navigate("/login");
//       } else {
//         toast.error("Failed to update wishlist");
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   // ── add to cart (SAME AS FORYOU) ──────────────────────────────────────────
//   const handleAddToCart = async (e) => {
//     e.stopPropagation();
//     if (showSelectVariant) {
//       setShowVariantOverlay(true);
//       return;
//     }
//     setAddingToCart(true);
//     try {
//       const payload = hasVariants
//         ? {
//           productId: product._id,
//           variants: [{ variantSku: getSku(variant), quantity: 1 }],
//         }
//         : { productId: product._id, quantity: 1 };

//       // Cache selected variant (same as Foryou)
//       if (hasVariants) {
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         cache[product._id] = variant;
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       } else {
//         const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
//         delete cache[product._id];
//         localStorage.setItem("cartVariantCache", JSON.stringify(cache));
//       }

//       const res = await axios.post(`${API_BASE}/add`, payload, {
//         withCredentials: true,
//       });
//       if (!res.data.success) throw new Error(res.data.message || "Failed");
//       toast.success("Product added to cart!");
//       navigate("/cartpage");
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || err.message || "Failed to add to cart";
//       toast.error(msg);
//       if (err.response?.status === 401) navigate("/login");
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   // ── variant select ────────────────────────────────────────────────────────
//   const handleVariantSelect = (v) => {
//     setSelectedVariant(v);
//     setVariantSelected(true);
//     setShowVariantOverlay(false);
//   };

//   const buttonText = addingToCart
//     ? "Adding..."
//     : showSelectVariant
//       ? "Select Variant"
//       : outOfStock
//         ? "Out of Stock"
//         : "Add to Bag";

//   const inWishlist = isInWishlist();

//   return (
//     <div className="foryou-card-wrapper" style={{ flex: "0 0 auto" }}>
//       <div className="foryou-card">
//         {/* Image wrapper */}
//         <div
//           className="foryou-img-wrapper"
//           onClick={() => navigate(`/product/${product._id}`)}
//           style={{ cursor: "pointer" }}
//         >
//           <img
//             src={imageUrl}
//             alt={product.name || "Product"}
//             className="foryou-img img-fluid"
//             loading="lazy"
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://placehold.co/400x300/ffffff/cccccc?text=Product";
//             }}
//           />

//           {/* Wishlist button */}
//           <button
//             onClick={toggleWishlist}
//             disabled={wishlistLoading}
//             style={{
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               cursor: wishlistLoading ? "not-allowed" : "pointer",
//               color: inWishlist ? "#dc3545" : "#000000",
//               fontSize: "22px",
//               zIndex: 2,
//               backgroundColor: "rgba(255,255,255,0.9)",
//               borderRadius: "50%",
//               width: "34px",
//               height: "34px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               transition: "all 0.3s ease",
//               border: "none",
//               outline: "none",
//             }}
//             title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             {wishlistLoading ? (
//               <div className="spinner-border spinner-border-sm" role="status" />
//             ) : inWishlist ? (
//               <FaHeart />
//             ) : (
//               <FaRegHeart />
//             )}
//           </button>

//           {/* Promo badge */}
//           {variant.promoApplied && (
//             <div className="promo-badge">
//               <i className="bi bi-tag-fill me-1"></i>Promo
//             </div>
//           )}

//           {/* Out-of-stock overlay badge */}
//           {outOfStock && (
//             <span
//               className="badge bg-secondary"
//               style={{
//                 position: "absolute",
//                 top: "6px",
//                 left: "6px",
//                 fontSize: "10px",
//                 zIndex: 1,
//               }}
//             >
//               Out of Stock
//             </span>
//           )}

//           {/* Discount badge */}
//           {!outOfStock && discountPercent > 0 && (
//             <span
//               className="badge bg-danger"
//               style={{
//                 position: "absolute",
//                 top: "6px",
//                 left: "6px",
//                 fontSize: "10px",
//                 zIndex: 1,
//               }}
//             >
//               {discountPercent}% OFF
//             </span>
//           )}
//         </div>

//         {/* Product info — same structure as Foryou.jsx */}
//         <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
//           <div
//             className="justify-content-between d-flex flex-column"
//             style={{ height: "260px" }}
//           >
//             {/* Brand */}
//             <div className="brand-name small text-muted mb-1 mt-2 text-start">
//               {brandName}
//             </div>

//             {/* Name */}
//             <h6
//               className="foryou-name font-family-Poppins m-0 p-0"
//               onClick={() => navigate(`/product/${product._id}`)}
//               style={{ cursor: "pointer" }}
//             >
//               {product.name || "Unnamed Product"}
//             </h6>

//             {/* Variant display */}
//             {hasVariants && (
//               <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
//                 {variantSelected ? (
//                   <div
//                     className="selected-variant-display text-muted small"
//                     style={{ cursor: "pointer", display: "inline-block" }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowVariantOverlay(true);
//                     }}
//                     title="Click to change variant"
//                   >
//                     Variant:{" "}
//                     <span className="fw-bold text-dark">
//                       {getVariantDisplayText(variant)}
//                     </span>
//                     <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
//                   </div>
//                 ) : (
//                   <div className="small text-muted" style={{ height: "20px" }}>
//                     {totalVariants} Variants Available
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Price */}
//             <div className="price-section mb-3 mt-auto">
//               <div className="d-flex align-items-baseline flex-wrap">
//                 <span className="current-price fw-400 fs-5">₹{displayPrice}</span>
//                 {originalPrice > displayPrice && (
//                   <>
//                     <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
//                       ₹{originalPrice}
//                     </span>
//                     <span className="discount-percent text-danger fw-bold ms-2">
//                       ({discountPercent}% OFF)
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Add to Cart button — EXACT SAME AS FORYOU */}
//             <div className="cart-section">
//               <div className="d-flex align-items-center justify-content-between">
//                 <button
//                   className={`btn w-100 page-title-main-name add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${addingToCart ? "btn-dark" : "btn-outline-dark"
//                     }`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (showSelectVariant) {
//                       setShowVariantOverlay(true);
//                     } else {
//                       handleAddToCart(e);
//                     }
//                   }}
//                   disabled={addingToCart || (!showSelectVariant && outOfStock)}
//                   style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
//                 >
//                   {addingToCart ? (
//                     <>
//                       <span
//                         className="spinner-border spinner-border-sm me-2"
//                         role="status"
//                       />
//                       Adding...
//                     </>
//                   ) : (
//                     <>
//                       {buttonText}
//                       {!addingToCart && !showSelectVariant && !outOfStock && (
//                         <img
//                           src={bagIcon}
//                           className="img-fluid"
//                           style={{ height: "20px" }}
//                           alt="Bag-icon"
//                         />
//                       )}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Variant Overlay — same as Foryou.jsx */}
//       {showVariantOverlay && (
//         <div
//           className="variant-overlay"
//           onClick={() => setShowVariantOverlay(false)}
//         >
//           <div
//             className="variant-overlay-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "100%",
//               maxWidth: "500px",
//               maxHeight: "100vh",
//               background: "#fff",
//               borderRadius: "12px",
//               overflow: "hidden",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {/* Header */}
//             <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
//               <h5 className="m-0 page-title-main-name">
//                 Select Variant ({totalVariants})
//               </h5>
//               <button
//                 onClick={() => setShowVariantOverlay(false)}
//                 style={{ background: "none", border: "none", fontSize: "24px" }}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="variant-tabs d-flex">
//               <button
//                 className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "all" ? "active" : ""}`}
//                 onClick={() => setSelectedVariantType("all")}
//               >
//                 All ({totalVariants})
//               </button>
//               {groupedVariants.color.length > 0 && (
//                 <button
//                   className={`variant-tab flex-fill py-3 page-title-main-name ${selectedVariantType === "color" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("color")}
//                 >
//                   Colors ({groupedVariants.color.length})
//                 </button>
//               )}
//               {groupedVariants.text.length > 0 && (
//                 <button
//                   className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
//                   onClick={() => setSelectedVariantType("text")}
//                 >
//                   Sizes ({groupedVariants.text.length})
//                 </button>
//               )}
//             </div>

//             {/* Content */}
//             <div className="p-3 overflow-auto flex-grow-1">
//               {/* Color variants */}
//               {(selectedVariantType === "all" || selectedVariantType === "color") &&
//                 groupedVariants.color.length > 0 && (
//                   <div className="row row-col-4 g-3 mb-4">
//                     {groupedVariants.color.map((v) => {
//                       const isSelected = variant.sku === v.sku;
//                       const isOOS = (v.stock ?? 0) <= 0;
//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOOS && handleVariantSelect(v)}
//                           >
//                             <div
//                               className="page-title-main-name"
//                               style={{
//                                 width: "28px",
//                                 height: "28px",
//                                 borderRadius: "20%",
//                                 backgroundColor: v.hex || "#ccc",
//                                 margin: "0 auto 8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 opacity: isOOS ? 0.5 : 1,
//                                 position: "relative",
//                               }}
//                             >
//                               {isSelected && (
//                                 <span
//                                   style={{
//                                     position: "absolute",
//                                     top: "50%",
//                                     left: "50%",
//                                     transform: "translate(-50%, -50%)",
//                                     color: "#fff",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   ✓
//                                 </span>
//                               )}
//                             </div>
//                             <div
//                               className="small page-title-main-name"
//                               style={{ fontSize: "12px" }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOOS && (
//                               <div className="text-danger small">Out of Stock</div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//               {/* Text variants */}
//               {(selectedVariantType === "all" || selectedVariantType === "text") &&
//                 groupedVariants.text.length > 0 && (
//                   <div className="row row-cols-3 g-0">
//                     {groupedVariants.text.map((v) => {
//                       const isSelected = variant.sku === v.sku;
//                       const isOOS = (v.stock ?? 0) <= 0;
//                       return (
//                         <div className="col-lg-3 col-5" key={getSku(v)}>
//                           <div
//                             className="text-center"
//                             style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
//                             onClick={() => !isOOS && handleVariantSelect(v)}
//                           >
//                             <div
//                               style={{
//                                 padding: "10px",
//                                 borderRadius: "8px",
//                                 border: isSelected ? "2px solid #000" : "1px solid #ddd",
//                                 background: isSelected ? "#f8f9fa" : "#fff",
//                                 minHeight: "50px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 opacity: isOOS ? 0.5 : 1,
//                               }}
//                             >
//                               {getVariantDisplayText(v)}
//                             </div>
//                             {isOOS && (
//                               <div className="text-danger small mt-1">Out of Stock</div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main CartPage ────────────────────────────────────────────────────────────
// const CartPage = () => {
//   const [isClicked, setIsClicked] = useState(false);

//   const handleClick = () => {
//     setIsClicked(true);
//     handleCloseConfirm(); // your existing function
//   };

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { syncCartFromBackend } = useContext(CartContext);
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

//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageColor, setCouponMessageColor] = useState("info");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [activeCouponTab, setActiveCouponTab] = useState("available");
//   const [manualCoupon, setManualCoupon] = useState("");
//   let cartCallCount = 0;

//   // ── fetch cart ──────────────────────────────────────────────────────────────
//   const fetchCart = async (discountCode = null) => {
//     cartCallCount++;
//     try {
//       setLoading(true);
//       const url = discountCode
//         ? `${API_BASE}/summary?discount=${discountCode}`
//         : `${API_BASE}/summary`;
//       const res = await fetch(url, { credentials: "include" });

//       if (res.status === 400) {
//         setCartData({ cart: [], freebies: [], bagMrp: 0, bagDiscount: 0, autoDiscount: 0, couponDiscount: 0, shipping: 0, taxableAmount: 0, gstRate: "0%", gstAmount: 0, gstMessage: "", payable: 0, appliedCoupon: null, applicableCoupons: [], inapplicableCoupons: [], promotions: [], totalSavings: 0, savingsMessage: "", grandTotal: 0, shippingMessage: "" });
//         setStockError("");
//         setLoading(false);
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
//       setLoading(false);
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
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove item from cart.");
//       await fetchCart();
//     }
//   };

//   // ── coupon handlers ─────────────────────────────────────────────────────────
//   const handleCouponSubmit = async (code) => {
//     if (!code) { setCouponMessage("Please enter a coupon code."); setCouponMessageColor("warning"); return; }
//     try {
//       await fetchCart(code);
//       localStorage.setItem("appliedCoupon", code);
//       setCouponMessage(`Coupon ${code} applied successfully!`);
//       setCouponMessageColor("success");
//       setShowCouponModal(false);
//       setManualCoupon("");
//     } catch { setCouponMessage("Failed to apply coupon."); setCouponMessageColor("danger"); }
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
//   const handleProceed = async () => {
//     try {
//       setInitiating(true);
//       if (!document.cookie.includes("token=")) {
//         navigate("/login", { state: { from: "/cartpage", message: "Please login to proceed with checkout" } });
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
//         method: "POST", credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) { if (res.status === 401) navigate("/login"); throw new Error("Failed to initiate order"); }
//       const orderData = await res.json();
//       navigate("/AddressSelection", {
//         state: {
//           orderId: orderData.orderId,
//           cartItems: cartData.cart,
//           priceDetails: {
//             bagMrp: cartData.bagMrp, bagDiscount: cartData.bagDiscount,
//             autoDiscount: cartData.autoDiscount, couponDiscount: cartData.couponDiscount,
//             shipping: cartData.shipping, taxableAmount: cartData.taxableAmount,
//             gstRate: cartData.gstRate, gstAmount: cartData.gstAmount,
//             gstMessage: cartData.gstMessage, payable: cartData.payable,
//             appliedCoupon: cartData.appliedCoupon, totalSavings: cartData.totalSavings,
//             savingsMessage: cartData.savingsMessage,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "Something went wrong during checkout.");
//     } finally {
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
//       <Header />
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="container-lg Conatiner-fluid mt-xl-5 pt-xl-5">
//         <h2 className="page-title-main-name mb-4 cartpage-titlesss">Your Cart</h2>
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
//                         <strong className="page-title-main-name">{item.name}</strong>
//                         {item.brand && <div className="text-muted small page-title-main-name">{item.brand}</div>}
//                         {item.stockStatus !== "in_stock" && (
//                           <div className="small text-danger fw-semibold page-title-main-name">{item.stockMessage || "Out of stock"}</div>
//                         )}
//                         {shadeName && (
//                           <div className="mt-1 small d-flex align-items-center gap-2 page-title-main-name">
//                             <span>Shade: {shadeName}</span>
//                             {shadeHex && <span style={{ width: "16px", height: "16px", borderRadius: "50%", display: "inline-block", backgroundColor: shadeHex, border: "1px solid #aaa" }} />}
//                           </div>
//                         )}
//                         <div className="small d-flex align-items-center page-title-main-name">
//                           {variant.originalPrice && variant.originalPrice > item.price ? (
//                             <>
//                               <span className="text-muted text-decoration-line-through me-1">₹{variant.originalPrice}</span>
//                               <span className="fw-bold text-danger">₹{item.price}</span>
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
//                     <span className="page-title-main-name">Bag Discount :</span>
//                     <span className="page-title-main-name">-₹{cartData.bagDiscount?.toFixed(2) || "0.00"}</span>
//                   </div>
//                 )}
//                 <div className="d-flex justify-content-between mb-1 shipping-margin-left-right">
//                   <div className="d-block">
//                     <span className="page-title-main-name">Shipping :</span>
//                     {cartData.shippingMessage && (
//                       <div className="small mb-2 page-title-main-name" style={{ color: "#51C878" }}>
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
//         <Modal.Header closeButton><Modal.Title>Confirm Removal</Modal.Title></Modal.Header>
//         <Modal.Body className="page-title-main-name">Are you sure you want to remove "{itemToRemove?.name}" from your cart?</Modal.Body>
//         <Modal.Footer>
//           <Button
//             className={`btn-for-back-buttons border-black ${isClicked ? "active-black" : ""}`}
//             onClick={handleClick}
//           >
//             Cancel
//           </Button>
//           <Button className="btn-for-back-buttons-bg-color" onClick={handleConfirmRemove}>Remove</Button>
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
//                             <button className="page-title-main-name border-0 bg-transparent btn-link text-decoration-none p-0 ticket-apply-btn" onClick={() => handleCouponSubmit(c.code)}>Apply</button>
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


















import React, { useEffect, useState, useContext, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../css/cartpage.css";
import { CartContext } from "../Context/Cartcontext";
import { FaTimes } from "react-icons/fa";
import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import { Modal, Button, Alert } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import applyGif from "../assets/Apply.gif";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
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
const RecoProductCard = ({ product, navigate, user }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.selectedVariant || product.variants?.[0] || {}
  );

  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistData, setWishlistData] = useState([]);
  const [showVariantOverlay, setShowVariantOverlay] = useState(false);
  const [selectedVariantType, setSelectedVariantType] = useState("all");
  const [variantSelected, setVariantSelected] = useState(false);

  const allVariants = product.variants || [];
  const groupedVariants = groupVariantsByType(allVariants);
  const totalVariants = allVariants.length;
  const hasVariants = totalVariants > 0;

  const variant = selectedVariant || {};
  const displayPrice = variant.displayPrice || variant.discountedPrice || product.price || 0;
  const originalPrice = variant.originalPrice || product.price || displayPrice;
  const discountPercent = variant.discountPercent || 0;
  const imageUrl = variant.images?.[0] || "/placeholder.png";
  const outOfStock = hasVariants ? (variant.stock ?? 0) <= 0 : (product.stock ?? 0) <= 0;
  const showSelectVariant = hasVariants && !variantSelected;
  const brandName =
    typeof product.brand === "object" ? product.brand?.name : product.brand || "";

  // ── wishlist helpers ──────────────────────────────────────────────────────
  const isInWishlist = useCallback(() => {
    const sku = getSku(variant);
    return wishlistData.some(
      (item) =>
        (item.productId === product._id || item._id === product._id) &&
        item.sku === sku
    );
  }, [wishlistData, variant, product._id]);

  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const res = await axios.get(
          "https://beauty.joyory.com/api/user/wishlist",
          { withCredentials: true }
        );
        if (res.data.success) setWishlistData(res.data.wishlist || []);
      } else {
        const local = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        setWishlistData(
          local.map((item) => ({
            productId: item._id,
            _id: item._id,
            sku: item.sku,
          }))
        );
      }
    } catch {
      setWishlistData([]);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    setWishlistLoading(true);
    const productId = product._id;
    const sku = getSku(variant);
    const inWishlist = isInWishlist();
    try {
      if (user && !user.guest) {
        if (inWishlist) {
          await axios.delete(
            `https://beauty.joyory.com/api/user/wishlist/${productId}`,
            { withCredentials: true, data: { sku } }
          );
          toast.success("Removed from wishlist!");
        } else {
          await axios.post(
            `https://beauty.joyory.com/api/user/wishlist/${productId}`,
            { sku },
            { withCredentials: true }
          );
          toast.success("Added to wishlist!");
        }
        await fetchWishlistData();
      } else {
        const guestWishlist =
          JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        if (inWishlist) {
          const updated = guestWishlist.filter(
            (item) => !(item._id === productId && item.sku === sku)
          );
          localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(updated));
          toast.success("Removed from wishlist!");
        } else {
          guestWishlist.push({
            _id: productId,
            name: product.name,
            sku,
            image: imageUrl,
            displayPrice,
            originalPrice,
          });
          localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify(guestWishlist));
          toast.success("Added to wishlist!");
        }
        await fetchWishlistData();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login to use wishlist");
        navigate("/login");
      } else {
        toast.error("Failed to update wishlist");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  // ── add to cart (SAME AS FORYOU) ──────────────────────────────────────────
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (showSelectVariant) {
      setShowVariantOverlay(true);
      return;
    }
    setAddingToCart(true);
    try {
      const payload = hasVariants
        ? {
          productId: product._id,
          variants: [{ variantSku: getSku(variant), quantity: 1 }],
        }
        : { productId: product._id, quantity: 1 };

      // Cache selected variant (same as Foryou)
      if (hasVariants) {
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[product._id] = variant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[product._id];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      const res = await axios.post(`${API_BASE}/add`, payload, {
        withCredentials: true,
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed");
      toast.success("Product added to cart!");
      navigate("/cartpage");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to add to cart";
      toast.error(msg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setAddingToCart(false);
    }
  };

  // ── variant select ────────────────────────────────────────────────────────
  const handleVariantSelect = (v) => {
    setSelectedVariant(v);
    setVariantSelected(true);
    setShowVariantOverlay(false);
  };

  const buttonText = addingToCart
    ? "Adding..."
    : showSelectVariant
      ? "Select Variant"
      : outOfStock
        ? "Out of Stock"
        : "Add to Bag";

  const inWishlist = isInWishlist();

  return (
    <div className="foryou-card-wrapper" style={{ flex: "0 0 auto" }}>
      <div className="foryou-card">
        {/* Image wrapper */}
        <div
          className="foryou-img-wrapper"
          onClick={() => navigate(`/product/${product._id}`)}
          style={{ cursor: "pointer" }}
        >
          <img
            src={imageUrl}
            alt={product.name || "Product"}
            className="foryou-img img-fluid"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/400x300/ffffff/cccccc?text=Product";
            }}
          />

          {/* Wishlist button */}
          <button className="bg-transparent"
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: wishlistLoading ? "not-allowed" : "pointer",
              color: inWishlist ? "#dc3545" : "#ccc",
              fontSize: "22px",
              zIndex: 2,
              // backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              border: "none",
              outline: "none",
            }}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlistLoading ? (
              <div className="spinner-border spinner-border-sm" role="status" />
            ) : inWishlist ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
          </button>

          {/* Promo badge */}
          {variant.promoApplied && (
            <div className="promo-badge">
              <i className="bi bi-tag-fill me-1"></i>Promo
            </div>
          )}

          {/* Out-of-stock overlay badge */}
          {outOfStock && (
            <span
              className="badge bg-secondary"
              style={{
                position: "absolute",
                top: "6px",
                left: "6px",
                fontSize: "10px",
                zIndex: 1,
              }}
            >
              Out of Stock
            </span>
          )}

          {/* Discount badge */}
          {!outOfStock && discountPercent > 0 && (
            <span
              className="badge bg-danger"
              style={{
                position: "absolute",
                top: "6px",
                left: "6px",
                fontSize: "10px",
                zIndex: 1,
              }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Product info — same structure as Foryou.jsx */}
        <div className="foryou-product-info w-100 ps-lg-0 p-0 pt-md-0">
          <div
            className="justify-content-between d-flex flex-column"
            style={{ height: "260px" }}
          >
            {/* Brand */}
            <div className="brand-name small text-muted mb-1 mt-2 text-start">
              {brandName}
            </div>

            {/* Name */}
            <h6
              className="foryou-name font-family-Poppins m-0 p-0"
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: "pointer" }}
            >
              {product.name || "Unnamed Product"}
            </h6>

            {/* Variant display */}
            {hasVariants && (
              <div className="variant-section m-0 p-0 ms-0 mt-2 mb-2">
                {variantSelected ? (
                  <div
                    className="selected-variant-display text-muted small"
                    style={{ cursor: "pointer", display: "inline-block" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVariantOverlay(true);
                    }}
                    title="Click to change variant"
                  >
                    Variant:{" "}
                    <span className="fw-bold text-dark">
                      {getVariantDisplayText(variant)}
                    </span>
                    <FaChevronDown className="ms-1" style={{ fontSize: "10px" }} />
                  </div>
                ) : (
                  <div className="small text-muted" style={{ height: "20px" }}>
                    {totalVariants} Variants Available
                  </div>
                )}
              </div>
            )}

            {/* Price */}
            <div className="price-section mb-3 mt-auto">
              <div className="d-flex align-items-baseline flex-wrap">
                <span className="current-price fw-400 fs-5">₹{displayPrice}</span>
                {originalPrice > displayPrice && (
                  <>
                    <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                      ₹{originalPrice}
                    </span>
                    <span className="discount-percent text-danger fw-bold ms-2">
                      ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Add to Cart button — EXACT SAME AS FORYOU */}
            <div className="cart-section">
              <div className="d-flex align-items-center justify-content-between">
                <button
                  className={`btn w-100 page-title-main-name add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${addingToCart ? "btn-dark" : "btn-outline-dark"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showSelectVariant) {
                      setShowVariantOverlay(true);
                    } else {
                      handleAddToCart(e);
                    }
                  }}
                  disabled={addingToCart || (!showSelectVariant && outOfStock)}
                  style={{ transition: "background-color 0.3s ease, color 0.3s ease" }}
                >
                  {addingToCart ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Adding...
                    </>
                  ) : (
                    <>
                      {buttonText}
                      {!addingToCart && !showSelectVariant && !outOfStock && (
                        <img
                          src={bagIcon}
                          className="img-fluid"
                          style={{ height: "20px" }}
                          alt="Bag-icon"
                        />
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variant Overlay — same as Foryou.jsx */}
      {showVariantOverlay && (
        <div
          className="variant-overlay"
          onClick={() => setShowVariantOverlay(false)}
        >
          <div
            className="variant-overlay-content m-0 p-0"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "100vh",
              background: "#fff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="m-0 page-title-main-name">
                Select Variant ({totalVariants})
              </h5>
              <button
                onClick={() => setShowVariantOverlay(false)}
                style={{ background: "none", border: "none", fontSize: "24px" }}
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
                  className={`variant-tab flex-fill py-3 ${selectedVariantType === "text" ? "active" : ""}`}
                  onClick={() => setSelectedVariantType("text")}
                >
                  Sizes ({groupedVariants.text.length})
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-3 overflow-auto flex-grow-1 p-0 m-0">
              {/* Color variants */}
              {(selectedVariantType === "all" || selectedVariantType === "color") &&
                groupedVariants.color.length > 0 && (
                  <div className="row row-col-4 g-3">
                    {groupedVariants.color.map((v) => {
                      const isSelected = variant.sku === v.sku;
                      const isOOS = (v.stock ?? 0) <= 0;
                      return (
                        <div className="col-lg-4 col-6" key={getSku(v)}>
                          <div
                            className="text-center"
                            style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
                            onClick={() => !isOOS && handleVariantSelect(v)}
                          >
                            <div
                              className="page-title-main-name"
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "20%",
                                backgroundColor: v.hex || "#ccc",
                                margin: "0 auto 8px",
                                border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                opacity: isOOS ? 0.5 : 1,
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
                            <div
                              className="small page-title-main-name"
                              style={{ fontSize: "12px" }}
                            >
                              {getVariantDisplayText(v)}
                            </div>
                            {isOOS && (
                              <div className="text-danger small">Out of Stock</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              {/* Text variants */}
              {(selectedVariantType === "all" || selectedVariantType === "text") &&
                groupedVariants.text.length > 0 && (
                  <div className="row row-cols-3 g-0">
                    {groupedVariants.text.map((v) => {
                      const isSelected = variant.sku === v.sku;
                      const isOOS = (v.stock ?? 0) <= 0;
                      return (
                        <div className="col-lg-3 col-5" key={getSku(v)}>
                          <div
                            className="text-center"
                            style={{ cursor: isOOS ? "not-allowed" : "pointer" }}
                            onClick={() => !isOOS && handleVariantSelect(v)}
                          >
                            <div
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #000" : "1px solid #ddd",
                                background: isSelected ? "#f8f9fa" : "#fff",
                                minHeight: "50px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isOOS ? 0.5 : 1,
                              }}
                            >
                              {getVariantDisplayText(v)}
                            </div>
                            {isOOS && (
                              <div className="text-danger small mt-1">Out of Stock</div>
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

// ─── Main CartPage ────────────────────────────────────────────────────────────
const CartPage = () => {
  const [isClicked, setIsClicked] = useState(false);
    const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showApplyAnimation, setShowApplyAnimation] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    handleCloseConfirm(); // your existing function
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { syncCartFromBackend } = useContext(CartContext);
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

  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageColor, setCouponMessageColor] = useState("info");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [activeCouponTab, setActiveCouponTab] = useState("available");
  const [manualCoupon, setManualCoupon] = useState("");
  let cartCallCount = 0;

  // ── fetch cart ──────────────────────────────────────────────────────────────
  const fetchCart = async (discountCode = null) => {
    cartCallCount++;
    try {
      setLoading(true);
      const url = discountCode
        ? `${API_BASE}/summary?discount=${discountCode}`
        : `${API_BASE}/summary`;
      const res = await fetch(url, { credentials: "include" });

      if (res.status === 400) {
        setCartData({ cart: [], freebies: [], bagMrp: 0, bagDiscount: 0, autoDiscount: 0, couponDiscount: 0, shipping: 0, taxableAmount: 0, gstRate: "0%", gstAmount: 0, gstMessage: "", payable: 0, appliedCoupon: null, applicableCoupons: [], inapplicableCoupons: [], promotions: [], totalSavings: 0, savingsMessage: "", grandTotal: 0, shippingMessage: "" });
        setStockError("");
        setLoading(false);
        return;
      }
      if (!res.ok) { if (res.status === 401) navigate("/login"); throw new Error("Failed to fetch cart"); }

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
      setCartData(null);
    } finally {
      setLoading(false);
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
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity. Please try again.");
      await fetchCart();
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
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from cart.");
      await fetchCart();
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
    };
    load();
    fetchRecommendations();
  }, []);

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
      <ToastContainer position="top-right" autoClose={3000} />
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
                    <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${item.productId}`)}>
                      <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                      <div className="w-75">
                        <strong className="page-title-main-name">{item.name}</strong>
                        {item.brand && <div className="text-muted small page-title-main-name">{item.brand}</div>}
                        {item.stockStatus !== "in_stock" && (
                          <div className="small text-danger fw-semibold page-title-main-name">{item.stockMessage || "Out of stock"}</div>
                        )}
                        {shadeName && (
                          <div className="mt-1 small d-flex align-items-center gap-2 page-title-main-name">
                            <span>Shade: {shadeName}</span>
                            {shadeHex && <span style={{ width: "16px", height: "16px", borderRadius: "50%", display: "inline-block", backgroundColor: shadeHex, border: "1px solid #aaa" }} />}
                          </div>
                        )}
                        <div className="small d-flex align-items-center page-title-main-name">
                          {variant.originalPrice && variant.originalPrice > item.price ? (
                            <>
                              <span className="text-muted text-decoration-line-through me-1">₹{variant.originalPrice}</span>
                              <span className="fw-bold text-danger">₹{item.price}</span>
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
                      <div className="small mb-2 page-title-main-name text-black" style={{ color: "#51C878" }}>
                        <i className="bi bi-truck me-1"></i>{cartData.shippingMessage}
                      </div>
                    )}
                  </div>
                  <span className={cartData.shipping === 0 ? "text-success d-flex align-items-end flex-column" : ""}>
                    ₹{cartData.shipping?.toFixed(2) || "0.00"}
                    {cartData.shipping === 0 && <span className="ms-1 small page-title-main-name">Free Shipping</span>}
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
                <div className="mb-3 p-2 border rounded bg-success text-white margin-left-right-repert">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Applied Coupon:</strong> {cartData.appliedCoupon.code}
                      {cartData.appliedCoupon.discount && <span className="ms-2">- ₹{cartData.appliedCoupon.discount} off</span>}
                    </div>
                    <button className="btn btn-sm btn-outline-light" onClick={handleRemoveCoupon}>Remove</button>
                  </div>
                </div>
              )}

              {couponMessage && (
                <div className={`mt-2 alert backend-color ${couponMessageColor} text-white`}>{couponMessage}</div>
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
        <Modal.Header closeButton><Modal.Title>Confirm Removal</Modal.Title></Modal.Header>
        <Modal.Body className="page-title-main-name">Are you sure you want to remove "{itemToRemove?.name}" from your cart?</Modal.Body>
        <Modal.Footer>
          <Button
            className={`btn-for-back-buttons border-black ${isClicked ? "active-black" : ""}`}
            onClick={handleClick}
          >
            Cancel
          </Button>
          <Button className="btn-for-back-buttons-bg-color" onClick={handleConfirmRemove}>Remove</Button>
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
                        <div className="d-flex justify-content-between">
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

      <Footer />
    </>
  );
};

export default CartPage;






//======================================================Done-Code===========================================================================================
