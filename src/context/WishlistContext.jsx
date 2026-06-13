import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

const GUEST_WISHLIST_KEY = "guestWishlist";

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getGuestWishlist = () => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveGuestWishlist = (items) => {
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
    } catch {}
  };

  const getProductId = (item) => {
    if (!item) return "";
    if (item.productId) {
      if (typeof item.productId === "object") {
        return item.productId._id || item.productId.id || "";
      }
      return String(item.productId);
    }
    if (item.product) {
      if (typeof item.product === "object") {
        return item.product._id || item.product.id || "";
      }
      return String(item.product);
    }
    if (item._id) {
      if (typeof item._id === "object") {
        return item._id._id || item._id.id || "";
      }
      return String(item._id);
    }
    return "";
  };

  const syncWishlist = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    try {
      if (user.guest) {
        const guestWish = getGuestWishlist();
        // Deduplicate guest wishlist
        const uniqueItems = [];
        const seen = new Set();
        guestWish.forEach(item => {
          const prodId = getProductId(item);
          const key = `${prodId}-${item.sku}`;
          if (prodId && !seen.has(key)) {
            seen.add(key);
            uniqueItems.push({
              ...item,
              productId: prodId
            });
          }
        });
        setWishlistItems(uniqueItems);
        setWishlistCount(uniqueItems.length);
      } else {
        const response = await axiosInstance.get("/api/user/wishlist", { withCredentials: true });
        if (response.data?.success) {
          const items = response.data.wishlist || [];
          
          // Deduplicate items
          const uniqueItems = [];
          const seen = new Set();
          items.forEach(item => {
            const prodId = getProductId(item);
            const key = `${prodId}-${item.sku}`;
            if (prodId && !seen.has(key)) {
              seen.add(key);
              uniqueItems.push({
                ...item,
                productId: prodId
              });
            }
          });

          setWishlistItems(uniqueItems);
          setWishlistCount(uniqueItems.length);
        }
      }
    } catch (err) {
      console.error("Failed to sync wishlist", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    syncWishlist();
  }, [user]);

  const isInWishlist = (productId, sku) => {
    const targetId = typeof productId === "object" && productId ? (productId._id || productId.id) : String(productId);
    return wishlistItems.some((item) => {
      const itemProdId = getProductId(item);
      return itemProdId === targetId && item.sku === sku;
    });
  };

  const toggleWishlist = async (product, selectedVariant) => {
    if (!product || !selectedVariant) {
      toast.warn("Please select a variant first");
      return false;
    }
    const rawProductId = product._id || product.productId;
    const cleanProductId = typeof rawProductId === "object" && rawProductId ? (rawProductId._id || rawProductId.id) : String(rawProductId);
    const sku = selectedVariant.sku || selectedVariant.variantSku;

    const currentlyInWishlist = isInWishlist(cleanProductId, sku);
    const previousItems = [...wishlistItems];

    // Optimistic Update
    if (currentlyInWishlist) {
      const updatedItems = wishlistItems.filter((item) => {
        const itemProdId = getProductId(item);
        return !(itemProdId === cleanProductId && item.sku === sku);
      });
      setWishlistItems(updatedItems);
      setWishlistCount(updatedItems.length);
    } else {
      const productData = {
        _id: cleanProductId,
        productId: cleanProductId,
        name: product.name || product.title || "Unnamed Product",
        brand: product.brand?.name || product.brand || "Unknown",
        price: selectedVariant.displayPrice || product.price || 0,
        originalPrice: selectedVariant.originalPrice || product.mrp || product.price || 0,
        mrp: selectedVariant.originalPrice || product.mrp || product.price || 0,
        displayPrice: selectedVariant.displayPrice || product.price || 0,
        images: selectedVariant.images || product.images || ["/placeholder.png"],
        image: selectedVariant.images?.[0] || selectedVariant.image || product.images?.[0] || "/placeholder.png",
        slug: product.slugs?.[0] || product.slug || cleanProductId,
        sku: sku,
        variantSku: sku,
        variantId: sku,
        variantName: selectedVariant.shadeName || selectedVariant.name || "Default",
        shadeName: selectedVariant.shadeName || selectedVariant.name || "Default",
        variant: selectedVariant.shadeName || selectedVariant.name || "Default",
        hex: selectedVariant.hex || "#cccccc",
        stock: selectedVariant.stock || 0,
        status: selectedVariant.stock > 0 ? "inStock" : "outOfStock",
        avgRating: product.rating || product.avgRating || 0,
        totalRatings: product.reviewCount || product.totalRatings || 0,
      };
      setWishlistItems([...wishlistItems, productData]);
      setWishlistCount(wishlistItems.length + 1);
    }

    try {
      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axiosInstance.delete(`/api/user/wishlist/${cleanProductId}`, {
            data: { sku }
          });
          toast.success("Removed from wishlist!");
        } else {
          await axiosInstance.post(
            `/api/user/wishlist/${cleanProductId}`,
            { sku },
            { withCredentials: true }
          );
          toast.success("Added to wishlist!");
        }
        await syncWishlist(true);
        return true;
      } else {
        // Guest user wishlist toggle
        const guestWish = getGuestWishlist();
        const existingIndex = guestWish.findIndex((item) => {
          const itemProdId = getProductId(item);
          return itemProdId === cleanProductId && item.sku === sku;
        });

        if (existingIndex >= 0) {
          guestWish.splice(existingIndex, 1);
          toast.success("Removed from wishlist!");
        } else {
          // Normalize product properties
          const productData = {
            _id: cleanProductId,
            productId: cleanProductId,
            name: product.name || product.title || "Unnamed Product",
            brand: product.brand?.name || product.brand || "Unknown",
            price: selectedVariant.displayPrice || product.price || 0,
            originalPrice: selectedVariant.originalPrice || product.mrp || product.price || 0,
            mrp: selectedVariant.originalPrice || product.mrp || product.price || 0,
            displayPrice: selectedVariant.displayPrice || product.price || 0,
            images: selectedVariant.images || product.images || ["/placeholder.png"],
            image: selectedVariant.images?.[0] || selectedVariant.image || product.images?.[0] || "/placeholder.png",
            slug: product.slugs?.[0] || product.slug || cleanProductId,
            sku: sku,
            variantSku: sku,
            variantId: sku,
            variantName: selectedVariant.shadeName || selectedVariant.name || "Default",
            shadeName: selectedVariant.shadeName || selectedVariant.name || "Default",
            variant: selectedVariant.shadeName || selectedVariant.name || "Default",
            hex: selectedVariant.hex || "#cccccc",
            stock: selectedVariant.stock || 0,
            status: selectedVariant.stock > 0 ? "inStock" : "outOfStock",
            avgRating: product.rating || product.avgRating || 0,
            totalRatings: product.reviewCount || product.totalRatings || 0,
            discountPercent:
              selectedVariant.originalPrice > selectedVariant.displayPrice
                ? Math.round(
                    ((selectedVariant.originalPrice - selectedVariant.displayPrice) /
                      selectedVariant.originalPrice) *
                      100
                  )
                : 0,
          };
          guestWish.push(productData);
          toast.success("Added to wishlist!");
        }
        saveGuestWishlist(guestWish);
        setWishlistItems(guestWish);
        setWishlistCount(guestWish.length);
        return true;
      }
    } catch (err) {
      console.error("Error toggling wishlist", err);
      setWishlistItems(previousItems);
      setWishlistCount(previousItems.length);
      toast.error("Failed to update wishlist");
      return false;
    }
  };

  const removeFromWishlist = async (productId, sku) => {
    const targetProductId = typeof productId === "object" && productId ? (productId._id || productId.id) : String(productId);
    const previousItems = [...wishlistItems];
    const updatedItems = wishlistItems.filter((item) => {
      const itemProdId = getProductId(item);
      return !(itemProdId === targetProductId && item.sku === sku);
    });
    setWishlistItems(updatedItems);
    setWishlistCount(updatedItems.length);

    try {
      if (user && !user.guest) {
        await axiosInstance.delete(`/api/user/wishlist/${targetProductId}`, {
          data: { sku }
        });
        await syncWishlist(true);
        toast.success("Removed from wishlist");
      } else {
        const guestWish = getGuestWishlist();
        const updated = guestWish.filter((item) => {
          const itemProdId = getProductId(item);
          return !(itemProdId === targetProductId && item.sku === sku);
        });
        saveGuestWishlist(updated);
        toast.success("Removed from wishlist");
      }
      return true;
    } catch (err) {
      console.error("Error removing from wishlist", err);
      setWishlistItems(previousItems);
      setWishlistCount(previousItems.length);
      toast.error("Failed to remove item");
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        syncWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
