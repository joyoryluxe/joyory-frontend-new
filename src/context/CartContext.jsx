import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const CartContext = createContext();
const VARIANT_CACHE_KEY = "cartVariantCache";
const GUEST_CART_KEY = "guestCart";

const putVariantInCache = (productId, variant) => {
  try {
    const cache = JSON.parse(localStorage.getItem(VARIANT_CACHE_KEY) || "{}");
    cache[productId] = variant;
    localStorage.setItem(VARIANT_CACHE_KEY, JSON.stringify(cache));
  } catch { }
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
  } catch { }
};

const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSummary, setCartSummary] = useState({
    bagMrp: 0,
    bagDiscount: 0,
    totalSavings: 0,
    shipping: 0,
    payable: 0,
    grandTotal: 0,
  });

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    syncCartFromBackend();
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const updateCartCount = (items) => {
    const total = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
    setCartCount(total);
  };

  const syncCartFromBackend = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("t", Date.now().toString());

      const wantPoints = localStorage.getItem("useRewardPoints") === "true";
      if (wantPoints) {
        const savedAmount = localStorage.getItem("rewardPointsAmount");
        const pointsToUse = savedAmount ? Number(savedAmount) : 99999999;
        queryParams.append("pointsToUse", String(pointsToUse));
      } else {
        queryParams.append("pointsToUse", "0");
      }

      const savedCoupon = localStorage.getItem("appliedCoupon") || "";
      queryParams.append("discount", savedCoupon);

      const queryString = queryParams.toString();
      const url = queryString
        ? `https://beauty.joyory.com/api/user/cart/summary?${queryString}`
        : `https://beauty.joyory.com/api/user/cart/summary?t=${Date.now()}`;

      const res = await fetch(url, { cache: "no-store", credentials: "include" });

      if (res.status === 400 || res.status === 401 || !res.ok) {
        // Fallback to localStorage guest cart
        const guestCart = getGuestCart();
        const normalizedGuest = guestCart.map((item) => {
          const price = Number(item.price || item.selectedVariant?.discountedPrice || item.selectedVariant?.originalPrice || 0);
          const originalPrice = Number(item.selectedVariant?.originalPrice || item.originalPrice || price);
          const discountPercent = item.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
          return {
            cartItemId: item.cartItemId || `${item.productId}-${item.selectedVariant?.sku || "default"}`,
            productId: item.productId,
            name: item.name || "Unnamed Product",
            quantity: Number(item.quantity) || 1,
            image: item.image || item.selectedVariant?.image || "/placeholder.png",
            price,
            originalPrice,
            discountPercent,
            brand: item.brand || "JOYORY",
            selectedVariant: item.selectedVariant || {},
            isGuest: true,
          };
        });

        const payable = normalizedGuest.reduce((acc, i) => acc + i.price * i.quantity, 0);
        const bagMrp = normalizedGuest.reduce((acc, i) => acc + i.originalPrice * i.quantity, 0);
        const totalSavings = Math.max(0, bagMrp - payable);

        setCartItems(normalizedGuest);
        updateCartCount(normalizedGuest);
        setCartSummary({
          bagMrp,
          bagDiscount: totalSavings,
          totalSavings,
          shipping: payable >= 499 || payable === 0 ? 0 : 50,
          payable,
          grandTotal: payable,
        });
        return;
      }

      const data = await res.json();

      const normalized = (data.cart || []).map((item) => {
        const variant = item.variant || {};
        const price = Number(variant.displayPrice || variant.discountedPrice || variant.price || 0);
        const originalPrice = Number(variant.originalPrice || variant.mrp || price);
        const discountPercent = variant.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

        return {
          cartItemId: item._id,
          productId: item.product?._id || item.product || item.productId,
          productSlug: item.slug || (item.product && typeof item.product === "object" ? item.product.slugs?.[0] || item.product.slug : null) || null,
          name: item.name || (item.product && typeof item.product === "object" ? item.product.name : "Unnamed Product"),
          quantity: Number(item.quantity) || 1,
          image: variant.image || (item.product && typeof item.product === "object" ? item.product.images?.[0] : null) || "/placeholder.png",
          price,
          originalPrice,
          discountPercent,
          brand: item.brand || (item.product && typeof item.product === "object" ? item.product.brand?.name || item.product.brand : "") || "JOYORY",
          selectedVariant: variant,
        };
      });

      const p = data.priceDetails || {};
      const payable = Number(p.payable || data.grandTotal || normalized.reduce((acc, i) => acc + i.price * i.quantity, 0));
      const bagMrp = Number(p.bagMrp || normalized.reduce((acc, i) => acc + (i.originalPrice || i.price) * i.quantity, 0));
      const totalSavings = Number(p.totalSavings || Math.max(0, bagMrp - payable));
      const shipping = Number(p.shippingCharge || (payable >= 499 || payable === 0 ? 0 : 50));

      setCartItems(normalized);
      updateCartCount(normalized);
      setCartSummary({
        bagMrp,
        bagDiscount: Number(p.bagDiscount || totalSavings),
        totalSavings,
        shipping,
        payable,
        grandTotal: payable,
      });
    } catch (err) {
      console.error("Failed to sync cart", err);
      const guestCart = getGuestCart();
      setCartItems(guestCart);
      updateCartCount(guestCart);
    }
  };

  // Initialize and sync cart based on user auth status
  useEffect(() => {
    syncCartFromBackend();
  }, [user]);

  // ✅ ADD TO CART (with automatic slide-in panel opening!)
  const addToCart = async (product, selectedVariant, isGuest = false) => {
    try {
      if (!selectedVariant?.sku) {
        alert("Please select a shade or variant before adding to cart");
        return false;
      }

      // Try backend first
      const payload = {
        productId: product._id,
        variants: [{ variantSku: selectedVariant.sku, quantity: 1 }],
      };

      let backendSuccess = false;
      let backendErrorStatus = null;

      try {
        const res = await axios.post(
          "https://beauty.joyory.com/api/user/cart/add",
          payload,
          { withCredentials: true }
        );
        if (res.data && res.data.success) {
          backendSuccess = true;
          await syncCartFromBackend();
        }
      } catch (err) {
        console.warn("Backend add to cart failed, checking fallback:", err);
        backendErrorStatus = err?.response?.status;
      }

      if (backendSuccess) {
        if (window.fbq) {
          window.fbq("track", "AddToCart", {
            content_ids: [product._id],
            content_name: product.name,
            content_type: "product",
            value: selectedVariant.discountedPrice || selectedVariant.originalPrice || product.price,
            currency: "INR",
          });
        }
        // ✨ Open sliding side panel immediately!
        setIsCartOpen(true);
        return true;
      }

      // If backend failed (or guest request), fall back to localStorage guestCart
      if (isGuest || backendErrorStatus === 401 || backendErrorStatus === 400) {
        const guestCart = getGuestCart();
        const existingItemIndex = guestCart.findIndex(
          (item) =>
            item.productId === product._id &&
            item.selectedVariant?.sku === selectedVariant.sku
        );

        let updatedCart;
        if (existingItemIndex >= 0) {
          updatedCart = guestCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
              : item
          );
        } else {
          const newCartItem = {
            productId: product._id,
            selectedVariant,
            quantity: 1,
            image: selectedVariant.image || product.images?.[0] || "/placeholder.png",
            price: Number(selectedVariant.discountedPrice || selectedVariant.originalPrice || product.price || 0),
            originalPrice: Number(selectedVariant.originalPrice || selectedVariant.discountedPrice || product.price || 0),
            name: product.name,
            brand: product.brand?.name || (typeof product.brand === "string" ? product.brand : "JOYORY"),
            isGuest: true,
          };
          updatedCart = [...guestCart, newCartItem];
        }

        saveGuestCart(updatedCart);
        await syncCartFromBackend();

        if (window.fbq) {
          window.fbq("track", "AddToCart", {
            content_ids: [product._id],
            content_name: product.name,
            content_type: "product",
            value: selectedVariant.discountedPrice || selectedVariant.originalPrice || product.price,
            currency: "INR",
          });
        }

        // ✨ Open sliding side panel immediately!
        setIsCartOpen(true);
        return true;
      }

      if (backendErrorStatus === 401) {
        throw new Error("Authentication required");
      }

      return false;
    } catch (error) {
      console.error("Add to Cart error:", error);
      if (error.message === "Authentication required") {
        throw error;
      }
      alert(error?.response?.data?.message || "Failed to add to cart");
      return false;
    }
  };

  // ✅ UPDATE QUANTITY (Smooth without full-page reloads!)
  const updateItemQuantity = async (cartItemId, productId, variantSku, newQty) => {
    if (newQty < 1) {
      return removeItemFromCart(cartItemId, productId, variantSku);
    }
    if (newQty > 6) {
      alert("Maximum 6 units allowed per item.");
      return;
    }

    try {
      // Optimistic update
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId || (item.productId === productId && (!variantSku || item.selectedVariant?.sku === variantSku))
            ? { ...item, quantity: newQty }
            : item
        )
      );

      // Check if logged in vs guest
      const hasToken = document.cookie.includes("token=");
      if (hasToken) {
        await axios.put(
          "https://beauty.joyory.com/api/user/cart/update",
          { productId, variantSku: variantSku || null, quantity: newQty },
          { withCredentials: true }
        );
        await syncCartFromBackend();
      } else {
        const guestCart = getGuestCart();
        const updated = guestCart.map((item) =>
          item.productId === productId && (!variantSku || item.selectedVariant?.sku === variantSku)
            ? { ...item, quantity: newQty }
            : item
        );
        saveGuestCart(updated);
        await syncCartFromBackend();
      }
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      await syncCartFromBackend();
    }
  };

  // ✅ REMOVE MULTIPLE ITEMS
  const removeMultipleItemsFromCart = async (items) => {
    try {
      if (!Array.isArray(items) || items.length === 0) return;

      const itemKeysToRemove = new Set(
        items.map(i => i.cartItemId || `${i.productId}-${i.variantSku || 'default'}`)
      );

      // Optimistic update
      setCartItems((prev) =>
        prev.filter((item) => {
          const key = item.cartItemId || `${item.productId}-${item.selectedVariant?.sku || 'default'}`;
          return !itemKeysToRemove.has(key);
        })
      );

      const hasToken = document.cookie.includes('token=');
      if (hasToken) {
        await axios.post(
          'https://beauty.joyory.com/api/user/cart/remove-multiple',
          {
            items: items.map(i => ({
              productId: i.productId,
              variantSku: i.variantSku || i.selectedVariant?.sku || null
            }))
          },
          { withCredentials: true }
        );
        await syncCartFromBackend();
      } else {
        const guestCart = getGuestCart();
        const updated = guestCart.filter((item) => {
          const key = item.cartItemId || `${item.productId}-${item.selectedVariant?.sku || 'default'}`;
          return !itemKeysToRemove.has(key);
        });
        saveGuestCart(updated);
        await syncCartFromBackend();
      }
    } catch (err) {
      console.error('Error removing multiple cart items:', err);
      await syncCartFromBackend();
    }
  };

  // ✅ REMOVE ITEM (Smooth without full-page reloads!)
  const removeItemFromCart = async (cartItemId, productId, variantSku) => {
    try {
      // Optimistic update
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(item.cartItemId === cartItemId || (item.productId === productId && (!variantSku || item.selectedVariant?.sku === variantSku)))
        )
      );

      const hasToken = document.cookie.includes("token=");
      if (hasToken) {
        const url = variantSku
          ? `https://beauty.joyory.com/api/user/cart/remove/${productId}?variantSku=${encodeURIComponent(variantSku)}`
          : `https://beauty.joyory.com/api/user/cart/remove/${productId}`;
        await axios.delete(url, { withCredentials: true });
        await syncCartFromBackend();
      } else {
        const guestCart = getGuestCart();
        const updated = guestCart.filter(
          (item) =>
            !(item.productId === productId && (!variantSku || item.selectedVariant?.sku === variantSku))
        );
        saveGuestCart(updated);
        await syncCartFromBackend();
      }
    } catch (err) {
      console.error("Error removing cart item:", err);
      await syncCartFromBackend();
    }
  };

  const getGuestCartItems = () => {
    return getGuestCart();
  };

  const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY);
    setCartItems([]);
    setCartCount(0);
    setCartSummary({
      bagMrp: 0,
      bagDiscount: 0,
      totalSavings: 0,
      shipping: 0,
      payable: 0,
      grandTotal: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSummary,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateItemQuantity,
        removeItemFromCart,
        removeMultipleItemsFromCart,
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
