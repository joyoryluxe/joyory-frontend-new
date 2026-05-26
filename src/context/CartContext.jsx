


// // src/context/CartContext.jsx
// import React, { createContext, useState } from "react";
// import axios from "axios";

// export const CartContext = createContext();

// const VARIANT_CACHE_KEY = "cartVariantCache";

// // ---- tiny helpers to persist the variant locally ----
// const putVariantInCache = (productId, variant) => {
//   try {
//     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//     cache[productId] = variant; // last chosen variant per product
//     localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));
//   } catch {}
// };

// const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [cartItems, setCartItems] = useState([]);

//   const updateCartCount = (items) => {
//     const total = items.reduce((acc, item) => acc + item.quantity, 0);
//     setCartCount(total);
//   };

//   // selectedVariant is the full object: { sku?, shadeName?, hex?, image? }
//   const addToCart = async (product, selectedVariant) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please login first!");
//         return;
//       }

//       const brand =
//         product.brand?.name ||
//         (typeof product.brand === "string" ? product.brand : "Unknown");

//       // keep client state consistent (same product+sku treated as same line)
//       const existingItem = cartItems.find(
//         (item) =>
//           item.productId === product._id &&
//           (item.selectedVariant?.sku || item.selectedVariant?.shadeName) ===
//             (selectedVariant?.sku || selectedVariant?.shadeName)
//       );

//       let response;

//       if (existingItem) {
//         response = await axios.post(
//           "https://beauty.joyory.com/api/user/cart/add",
//           {
//             productId: product._id,
//             selectedVariant,
//             brand,
//             quantity: existingItem.quantity + 1,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const updatedItems = cartItems.map((item) =>
//           item.productId === product._id &&
//           (item.selectedVariant?.sku || item.selectedVariant?.shadeName) ===
//             (selectedVariant?.sku || selectedVariant?.shadeName)
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//         setCartItems(updatedItems);
//         updateCartCount(updatedItems);
//       } else {
//         response = await axios.post(
//           "https://beauty.joyory.com/api/user/cart/add",
//           {
//             productId: product._id,
//             selectedVariant,
//             brand,
//             quantity: 1,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const updatedItems = [
//           ...cartItems,
//           {
//             productId: product._id,
//             selectedVariant,
//             brand,
//             quantity: 1,
//           },
//         ];
//         setCartItems(updatedItems);
//         updateCartCount(updatedItems);
//       }

//       // ✅ Always remember the chosen variant locally (covers API returning null)
//       if (selectedVariant && Object.keys(selectedVariant).length) {
//         putVariantInCache(product._id, selectedVariant);
//       }

//       console.log("Cart updated:", response.data);
//     } catch (error) {
//       console.error("Error adding to cart", error?.response?.data || error);
//       alert(error?.response?.data?.message || "Failed to add product to cart");
//     }
//   };

//   return (
//     <CartContext.Provider value={{ cartCount, cartItems, addToCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;







// src/context/CartContext.jsx
// import React, { createContext, useState } from "react";
// import axios from "axios";

// export const CartContext = createContext();

// const VARIANT_CACHE_KEY = "cartVariantCache";

// // ---- Helpers to persist variant locally ----
// // const putVariantInCache = (productId, variant) => {
// //   try {
// //     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
// //     cache[productId] = variant; // last chosen variant per product
// //     localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));
// //   } catch {}
// // };
// const getVariantCacheKey = (productId, sku) => `${productId}_${sku}`;


// const putVariantInCache = (productId, variant) => {
//   try {
//     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//     cache[productId] = variant;
//     localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));
//   } catch { }
// };

// const addToCart = async (product, variant) => {
//   try {
//     const finalVariant = normalizeVariant(variant, readVariantFromCache(product._id));

//     // Send to backend
//     await axios.post(
//       "https://beauty.joyory.com/api/user/cart/add",
//       {
//         productId: product._id,
//         selectedVariant: finalVariant,
//         brand: product.brand,
//         quantity: 1,
//       },
//       { withCredentials: true }
//     );

//     // Update cache
//     putVariantInCache(product._id, finalVariant);
//   } catch (err) {
//     console.error(err);
//   }
// };


// const readVariantFromCache = (productId) => {
//   try {
//     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//     return cache[productId] || null;
//   } catch {
//     return null;
//   }
// };

// const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [cartCount, setCartCount] = useState(0);

//   const updateCartCount = (items) => {
//     const total = items.reduce((acc, item) => acc + item.quantity, 0);
//     setCartCount(total);
//   };

//   // Fetch latest cart from backend
//   const syncCartFromBackend = async () => {
//     try {
//       const res = await fetch("https://beauty.joyory.com/api/user/cart/summary", {
//         credentials: "include", // ✅ sends HTTP-only cookie
//       });
//       if (!res.ok) return;

//       const data = await res.json();

//       const normalizedCart = (data.cart || []).map((item) => {
//         const serverVariant = item.variant || {};
//         const cacheVariant = readVariantFromCache(item._id);

//         const finalVariant = {
//           // sku: serverVariant.sku ?? cacheVariant?.sku ?? null,
//           // shadeName: serverVariant.shadeName ?? cacheVariant?.shadeName ?? "N/A",
//           // hex: serverVariant.hex ?? cacheVariant?.hex ?? "#ccc",
//           image: serverVariant.image ?? cacheVariant?.image ?? "/placeholder.png",
//           originalPrice: serverVariant.originalPrice ?? cacheVariant?.originalPrice ?? 0,
//           discountedPrice:
//             serverVariant.discountedPrice ??
//             cacheVariant?.discountedPrice ??
//             serverVariant.originalPrice ??
//             0,
//           discountPercent:
//             serverVariant.discountPercent ?? cacheVariant?.discountPercent ?? null,
//           stock: serverVariant.stock ?? cacheVariant?.stock ?? 0,
//           sku: serverVariant.sku ?? cacheVariant?.sku,
//           shadeName: serverVariant.shadeName ?? cacheVariant?.shadeName,
//           hex: serverVariant.hex ?? cacheVariant?.hex,
//         };

//         const finalPrice = finalVariant.discountedPrice || finalVariant.originalPrice || 0;
//         const quantity = item.quantity || 1;
//         const discounts = finalVariant.discountPercent
//           ? [
//             {
//               type: "Discount",
//               amount: (finalVariant.originalPrice || 0) - finalPrice,
//               note: finalVariant.discountPercent,
//             },
//           ]
//           : [];

//         return {
//           cartItemId: item._id,
//           productId: item.product,
//           name: item.name || "Unnamed Product",
//           image: finalVariant.image || "/placeholder.png",
//           quantity,
//           price: finalPrice,
//           subTotal: finalPrice * quantity - (discounts.reduce((s, d) => s + (d.amount || 0), 0) || 0),
//           brand: item.brand || "",
//           selectedVariant: finalVariant,
//           discounts,
//           variant: item.variant // send full variant object here
//         };
//       });

//       setCartItems(normalizedCart);
//       updateCartCount(normalizedCart);
//     } catch (err) {
//       console.error("Failed to sync cart from backend", err);
//     }
//   };

//   // Add to cart
//   const addToCart = async (product, selectedVariant) => {
//     try {
//       const brand =
//         product.brand?.name ||
//         (typeof product.brand === "string" ? product.brand : "Unknown");

//       const existingItem = cartItems.find(
//         (item) =>
//           item.productId === product._id &&
//           (item.selectedVariant?.sku || item.selectedVariant?.shadeName) ===
//           (selectedVariant?.sku || selectedVariant?.shadeName)
//       );

//       const quantity = existingItem ? existingItem.quantity + 1 : 1;

//       const response = await axios.post(
//         "https://beauty.joyory.com/api/user/cart/add",
//         {
//           // productId: product._id,
//           // selectedVariant,
//           // brand,
//           // quantity,
//           product: product._id,
//           quantity,
//           // variant: selectedVariant, // store full object, not just image & prices
//           variant: item.varint, // store full object, not just image & prices
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true, // ✅ sends HTTP-only cookie automatically
//         }
//       );

//       let updatedItems;
//       if (existingItem) {
//         updatedItems = cartItems.map((item) =>
//           item.productId === product._id &&
//             (item.selectedVariant?.sku || item.selectedVariant?.shadeName) ===
//             (selectedVariant?.sku || selectedVariant?.shadeName)
//             ? { ...item, quantity }
//             : item
//         );
//       } else {
//         updatedItems = [
//           ...cartItems,
//           { productId: product._id, selectedVariant, brand, quantity },
//         ];
//       }

//       setCartItems(updatedItems);
//       updateCartCount(updatedItems);

//       // Save variant locally
//       if (selectedVariant && Object.keys(selectedVariant).length) {
//         putVariantInCache(product._id, selectedVariant);
//       }

//       console.log("Cart updated:", response.data);
//     } catch (error) {
//       console.error("Error adding to cart", error?.response?.data || error);
//       alert(error?.response?.data?.message || "Failed to add product to cart");
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartCount,
//         addToCart,
//         syncCartFromBackend,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;





















// import React, { createContext, useState } from "react";
// import axios from "axios";

// export const CartContext = createContext();
// const VARIANT_CACHE_KEY = "cartVariantCache";

// const putVariantInCache = (productId, variant) => {
//   try {
//     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//     cache[productId] = variant;
//     localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));
//   } catch {}
// };

// const readVariantFromCache = (productId) => {
//   try {
//     const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
//     return cache[productId] || null;
//   } catch {
//     return null;
//   }
// };

// const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [cartCount, setCartCount] = useState(0);

//   const updateCartCount = (items) => {
//     const total = items.reduce((acc, item) => acc + item.quantity, 0);
//     setCartCount(total);
//   };

//   const syncCartFromBackend = async () => {
//     try {
//       const res = await fetch(
//         "https://beauty.joyory.com/api/user/cart/summary",
//         { credentials: "include" }
//       );
//       if (!res.ok) return;
//       const data = await res.json();

//       const normalized = (data.cart || []).map((item) => ({
//         cartItemId: item._id,
//         productId: item.product,
//         name: item.name || "Unnamed Product",
//         quantity: item.quantity || 1,
//         image: item.variant?.image || "/placeholder.png",
//         price: item.variant?.discountedPrice || item.variant?.originalPrice || 0,
//         brand: item.brand || "",
//         selectedVariant: item.variant || {},
//       }));

//       setCartItems(normalized);
//       updateCartCount(normalized);
//     } catch (err) {
//       console.error("Failed to sync cart", err);
//     }
//   };

//   // ✅ Fixed addToCart
//   const addToCart = async (product, selectedVariant) => {
//     try {
//       if (!selectedVariant?.sku) {
//         alert("Please select a shade or variant before adding to cart");
//         return;
//       }

//       const payload = {
//         productId: product._id,
//         variants: [{ variantSku: selectedVariant.sku, quantity: 1 }],
//       };

//       const res = await axios.post(
//         "https://beauty.joyory.com/api/user/cart/add",
//         payload,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         // ✅ Update cache
//         putVariantInCache(product._id, selectedVariant);

//         // ✅ Update UI state
//         const existing = cartItems.find(
//           (i) =>
//             i.productId === product._id &&
//             i.selectedVariant?.sku === selectedVariant.sku
//         );

//         const updated = existing
//           ? cartItems.map((i) =>
//               i.productId === product._id &&
//               i.selectedVariant?.sku === selectedVariant.sku
//                 ? { ...i, quantity: i.quantity + 1 }
//                 : i
//             )
//           : [
//               ...cartItems,
//               {
//                 productId: product._id,
//                 selectedVariant,
//                 quantity: 1,
//                 image:
//                   selectedVariant.image || product.images?.[0] || "/placeholder.png",
//                 price:
//                   selectedVariant.discountedPrice ||
//                   selectedVariant.originalPrice ||
//                   product.price,
//                 name: product.name,
//                 brand:
//                   product.brand?.name ||
//                   (typeof product.brand === "string"
//                     ? product.brand
//                     : "Unknown"),
//               },
//             ];

//         setCartItems(updated);
//         updateCartCount(updated);
//       }
//     } catch (error) {
//       console.error("Add to Cart error:", error?.response?.data || error);
//       alert(error?.response?.data?.message || "Failed to add to cart");
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartCount,
//         addToCart,
//         syncCartFromBackend,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;





















import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();
const VARIANT_CACHE_KEY = "cartVariantCache";
const GUEST_CART_KEY = "guestCart";

const putVariantInCache = (productId, variant) => {
  try {
    const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
    cache[productId] = variant;
    localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));
  } catch {}
};

const readVariantFromCache = (productId) => {
  try {
    const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
    return cache[productId] || null;
  } catch {
    return null;
  }
};

// Guest cart utilities
const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveGuestCart = (cart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {}
};

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Initialize cart from localStorage for guest users
  useEffect(() => {
    const initializeCart = () => {
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        setCartItems(guestCart);
        updateCartCount(guestCart);
      } else {
        // Try to sync from backend for logged-in users
        syncCartFromBackend();
      }
    };

    initializeCart();
  }, []);

  const updateCartCount = (items) => {
    const total = items.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(total);
  };

  const syncCartFromBackend = async () => {
    try {
      const res = await fetch(
        "https://beauty.joyory.com/api/user/cart/summary",
        { credentials: "include" }
      );
      if (!res.ok) return;
      const data = await res.json();

      const normalized = (data.cart || []).map((item) => ({
        cartItemId: item._id,
        productId: item.product,
        name: item.name || "Unnamed Product",
        quantity: item.quantity || 1,
        image: item.variant?.image || "/placeholder.png",
        price: item.variant?.discountedPrice || item.variant?.originalPrice || 0,
        brand: item.brand || "",
        selectedVariant: item.variant || {},
      }));

      setCartItems(normalized);
      updateCartCount(normalized);
    } catch (err) {
      console.error("Failed to sync cart", err);
    }
  };

  // ✅ UPDATED: addToCart with guest support
  const addToCart = async (product, selectedVariant, isGuest = false) => {
    try {
      if (!selectedVariant?.sku) {
        alert("Please select a shade or variant before adding to cart");
        return false;
      }

      // ✅ GUEST USER FLOW
      if (isGuest) {
        const guestCart = getGuestCart();
        
        // Check if item already exists in guest cart
        const existingItemIndex = guestCart.findIndex(
          (item) => 
            item.productId === product._id && 
            item.selectedVariant?.sku === selectedVariant.sku
        );

        let updatedCart;
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          updatedCart = guestCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new item to guest cart
          const newCartItem = {
            productId: product._id,
            selectedVariant,
            quantity: 1,
            image: selectedVariant.image || product.images?.[0] || "/placeholder.png",
            price: selectedVariant.discountedPrice || selectedVariant.originalPrice || product.price,
            name: product.name,
            brand: product.brand?.name || (typeof product.brand === "string" ? product.brand : "Unknown"),
            isGuest: true // Mark as guest item
          };
          updatedCart = [...guestCart, newCartItem];
        }

        // Save to localStorage and update state
        saveGuestCart(updatedCart);
        setCartItems(updatedCart);
        updateCartCount(updatedCart);
        
        console.log("Guest cart updated:", updatedCart);
        return true;
      }

      // ✅ LOGGED-IN USER FLOW (your existing code)
      const payload = {
        productId: product._id,
        variants: [{ variantSku: selectedVariant.sku, quantity: 1 }],
      };

      const res = await axios.post(
        "https://beauty.joyory.com/api/user/cart/add",
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        putVariantInCache(product._id, selectedVariant);

        const existing = cartItems.find(
          (i) =>
            i.productId === product._id &&
            i.selectedVariant?.sku === selectedVariant.sku
        );

        const updated = existing
          ? cartItems.map((i) =>
              i.productId === product._id &&
              i.selectedVariant?.sku === selectedVariant.sku
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [
              ...cartItems,
              {
                productId: product._id,
                selectedVariant,
                quantity: 1,
                image: selectedVariant.image || product.images?.[0] || "/placeholder.png",
                price: selectedVariant.discountedPrice || selectedVariant.originalPrice || product.price,
                name: product.name,
                brand: product.brand?.name || (typeof product.brand === "string" ? product.brand : "Unknown"),
              },
            ];

        setCartItems(updated);
        updateCartCount(updated);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Add to Cart error:", error?.response?.data || error);
      
      if (error?.response?.status === 401) {
        // If user is not authenticated, you might want to switch to guest mode
        throw new Error("Authentication required");
      }
      
      alert(error?.response?.data?.message || "Failed to add to cart");
      return false;
    }
  };

  // ✅ ADD: Function to get guest cart items
  const getGuestCartItems = () => {
    return getGuestCart();
  };

  // ✅ ADD: Function to clear guest cart
  const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY);
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        syncCartFromBackend,
        getGuestCartItems,
        clearGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

