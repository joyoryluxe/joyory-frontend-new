/**
 * useBestSellers.js
 * ─────────────────────────────────────────────────────────────
 * Headless custom hook containing the data fetching, variant
 * transformations, wishlist syncing, and cart/overlay handling
 * for the Best Sellers section.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getTopSellers } from "../../../../api/productApi";
import { addToCart } from "../../../../api/cartApi";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../../../api/wishlistApi";
import { UserContext } from "../../../../context/UserContext.jsx";
import { getErrorMessage } from "../../../../utils/errorHandler";
import {
  getSku,
  isValidHexColor,
  getVariantDisplayText,
  getBrandName,
  getProductSlug,
} from "../../../../utils/variantHelpers";

const WISHLIST_CACHE_KEY = "guestWishlist";

export const useBestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  // Standalone route SEO meta handling
  useEffect(() => {
    if (location.pathname === "/bestsellers") {
      let meta = document.querySelector('meta[name="robots"]');
      let isNew = false;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "robots";
        isNew = true;
      }
      const originalContent = meta.content;
      meta.content = "noindex, nofollow";
      if (isNew) {
        document.head.appendChild(meta);
      }
      return () => {
        if (originalContent) {
          meta.content = originalContent;
        } else if (meta && meta.parentNode) {
          meta.parentNode.removeChild(meta);
        }
      };
    }
  }, [location.pathname]);

  const showToastMsg = useCallback((message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "error") {
      toast.error(message, { autoClose: duration });
    } else {
      toast.info(message, { autoClose: duration });
    }
  }, []);

  const handleOutOfStockClick = useCallback((productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => {
      setShowOutOfStockPopup(false);
    }, 3000);
  }, []);

  const closeOutOfStockPopup = useCallback(() => {
    setShowOutOfStockPopup(false);
  }, []);

  const isInWishlist = useCallback(
    (productId, sku) => {
      if (!productId || !sku) return false;
      return wishlistData.some(
        (item) =>
          (item.productId === productId || item._id === productId) &&
          item.sku === sku
      );
    },
    [wishlistData]
  );

  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const response = await getWishlist();
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist =
          JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        const formattedWishlist = localWishlist.map((item) => ({
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
          totalRatings: item.totalRatings,
        }));
        setWishlistData(formattedWishlist);
      }
    } catch (err) {
      console.error("Error fetching wishlist data:", err);
      setWishlistData([]);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const toggleWishlist = useCallback(
    async (prod, variant) => {
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

      setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

      try {
        const currentlyInWishlist = isInWishlist(productId, sku);

        if (user && !user.guest) {
          if (currentlyInWishlist) {
            await removeFromWishlist(productId, { sku });
            showToastMsg("Removed from wishlist!", "success");
          } else {
            await addToWishlist(productId, { sku });
            showToastMsg("Added to wishlist!", "success");
          }
          await fetchWishlistData();
        } else {
          const guestWishlist =
            JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];

          if (currentlyInWishlist) {
            const updatedWishlist = guestWishlist.filter(
              (item) => !(item._id === productId && item.sku === sku)
            );
            localStorage.setItem(
              WISHLIST_CACHE_KEY,
              JSON.stringify(updatedWishlist)
            );
            showToastMsg("Removed from wishlist!", "success");
          } else {
            const productData = {
              _id: productId,
              name: prod.name,
              brand: getBrandName(prod),
              price:
                variant.discountedPrice ||
                variant.displayPrice ||
                prod.price ||
                0,
              originalPrice:
                variant.originalPrice ||
                variant.mrp ||
                prod.mrp ||
                prod.price ||
                0,
              mrp:
                variant.originalPrice ||
                variant.mrp ||
                prod.mrp ||
                prod.price ||
                0,
              displayPrice:
                variant.discountedPrice ||
                variant.displayPrice ||
                prod.price ||
                0,
              images: variant.images || prod.images || ["/placeholder.png"],
              image:
                variant.images?.[0] ||
                variant.image ||
                prod.images?.[0] ||
                "/placeholder.png",
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
              discountPercent:
                variant.originalPrice &&
                variant.discountedPrice &&
                variant.originalPrice > variant.discountedPrice
                  ? Math.round(
                      ((variant.originalPrice - variant.discountedPrice) /
                        variant.originalPrice) *
                        100
                    )
                  : 0,
            };

            guestWishlist.push(productData);
            localStorage.setItem(
              WISHLIST_CACHE_KEY,
              JSON.stringify(guestWishlist)
            );
            showToastMsg("Added to wishlist!", "success");
          }
          await fetchWishlistData();
        }
      } catch (err) {
        console.error("Wishlist toggle error:", err);
        if (err.response?.status === 401) {
          showToastMsg("Please login to use wishlist", "error");
          navigate("/login");
        } else {
          showToastMsg(
            err.response?.data?.message || "Failed to update wishlist",
            "error"
          );
        }
      } finally {
        setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [user, isInWishlist, fetchWishlistData, navigate, location.pathname, showToastMsg]
  );

  const getVariantName = useCallback((variant) => {
    if (!variant) return "Default";
    const nameSources = [
      variant.shadeName,
      variant.name,
      variant.variantName,
      variant.size,
      variant.ml,
      variant.weight,
    ];
    for (const source of nameSources) {
      if (source && typeof source === "string") {
        return source;
      }
    }
    return "Default";
  }, []);

  const getVariantType = useCallback((variant) => {
    if (!variant) return "default";
    if (variant.hex && isValidHexColor(variant.hex)) return "color";
    if (variant.shadeName) return "shade";
    if (variant.size) return "size";
    if (variant.ml) return "ml";
    if (variant.weight) return "weight";
    return "default";
  }, []);

  const getProductDisplayData = useCallback(
    (product) => {
      if (!product) return null;

      const allVariants = Array.isArray(product.variants)
        ? product.variants
        : Array.isArray(product.shadeOptions)
        ? product.shadeOptions
        : [];

      const availableVariants = allVariants.filter(
        (v) => v && parseInt(v.stock || 0) > 0
      );
      const defaultVariant = allVariants[0] || {};
      const storedVariant = selectedVariants[product._id];

      let selectedVariant =
        storedVariant ||
        product.selectedVariant ||
        (availableVariants.length > 0 ? availableVariants[0] : defaultVariant);

      if (storedVariant) {
        const storedStock = parseInt(storedVariant.stock || 0);
        if (storedStock <= 0 && availableVariants.length > 0) {
          selectedVariant = availableVariants[0];
        }
      }

      const getVariantImage = (variant) => {
        return variant?.images?.[0] || variant?.image;
      };

      const image =
        getVariantImage(selectedVariant) ||
        getVariantImage(availableVariants[0]) ||
        getVariantImage(defaultVariant) ||
        product.image ||
        product.displayImage ||
        product.images?.[0] ||
        "";

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

      let discountPercent = parseFloat(
        selectedVariant.discountPercent || product.discountPercent || 0
      );

      if (!discountPercent && originalPrice > displayPrice) {
        discountPercent = Math.round(
          ((originalPrice - displayPrice) / originalPrice) * 100
        );
      }

      const variantName = getVariantName(selectedVariant);
      const variantType = getVariantType(selectedVariant);
      const variantDisplayText = getVariantDisplayText(selectedVariant);

      const stock = parseInt(selectedVariant.stock || product.stock || 0);
      const status = stock > 0 ? "inStock" : "outOfStock";
      const sku = selectedVariant.sku || product.sku || "";

      const brandName = getBrandName(product);
      const productSlug = getProductSlug(product);

      return {
        ...product,
        _id: product._id || "",
        name: product.name || "Unnamed Product",
        brandName:
          typeof brandName === "string" ? brandName : "Unknown Brand",
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
          _id: selectedVariant._id || "",
        },
        image,
        brandId: product.brand,
        description: product.description || "",
        avgRating: parseFloat(product.avgRating || 0),
        totalRatings: parseInt(product.totalRatings || 0),
        allVariants: [...allVariants].filter((v) => v),
        variants: allVariants,
        isCompletelyOutOfStock:
          allVariants.length > 0 && availableVariants.length === 0,
      };
    },
    [selectedVariants, getVariantName, getVariantType]
  );

  const handleVariantSelect = useCallback((productId, variant) => {
    if (!productId || !variant) return;

    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
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
          let discountPercent = parseFloat(variant.discountPercent || 0);
          if (!discountPercent && originalPrice > displayPrice) {
            discountPercent = Math.round(
              ((originalPrice - displayPrice) / originalPrice) * 100
            );
          }

          return {
            ...product,
            image: variant.images?.[0] || variant.image || product.image,
            variant: {
              ...product.variant,
              ...variant,
              displayPrice,
              originalPrice,
              discountPercent,
              stock,
              status: stock > 0 ? "inStock" : "outOfStock",
            },
          };
        }
        return product;
      })
    );
  }, []);

  const openVariantOverlay = useCallback(
    (productId, variantType = "color", e) => {
      if (e) e.stopPropagation();
      setShowVariantOverlay(productId);
      const product = products.find((p) => p._id === productId);
      if (product) {
        const current = selectedVariants[productId] || product.variant;
        setTempSelectedVariants((prev) => ({ ...prev, [productId]: current }));
      }
    },
    [products, selectedVariants]
  );

  const closeVariantOverlay = useCallback(() => {
    setShowVariantOverlay(null);
  }, []);

  const handleAddToCart = useCallback(
    async (product, forceVariant = null) => {
      if (!product) return;

      const allVariants = product.allVariants || product.variants || [];
      const hasVariants = allVariants.length > 0;
      const variantToAdd =
        forceVariant ||
        tempSelectedVariants[product._id] ||
        selectedVariants[product._id] ||
        product.variant ||
        (allVariants.find((v) => v.stock > 0) || allVariants[0]);

      const isOutOfStock = hasVariants
        ? (variantToAdd?.stock ?? 0) <= 0
        : (product.stock ?? 0) <= 0;

      if (isOutOfStock) {
        handleOutOfStockClick(product.name);
        return;
      }

      setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

      try {
        let payload;
        if (hasVariants && variantToAdd) {
          payload = {
            productId: product._id,
            variants: [{ variantSku: getSku(variantToAdd), quantity: 1 }],
          };
        } else {
          payload = { productId: product._id, quantity: 1 };
        }

        if (hasVariants && variantToAdd) {
          const cache = JSON.parse(
            localStorage.getItem("cartVariantCache") || "{}"
          );
          cache[product._id] = variantToAdd;
          localStorage.setItem("cartVariantCache", JSON.stringify(cache));
        }

        const res = await addToCart(payload);
        if (res?.data?.success) {
          showToastMsg("Product added to bag!", "success");
        } else {
          throw new Error(res?.data?.message || "Failed to add to cart");
        }
      } catch (err) {
        console.error("Cart error:", err);
        showToastMsg(
          err.response?.data?.message || err.message || "Failed to add to cart",
          "error"
        );
      } finally {
        setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
      }
    },
    [
      tempSelectedVariants,
      selectedVariants,
      handleOutOfStockClick,
      showToastMsg,
    ]
  );

  const handleProductClick = useCallback(
    (product) => {
      if (!product) return;
      const slug = product.slug || product._id;
      navigate(`/product/${slug}`);
    },
    [navigate]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTopSellers();
      const rawProducts = res.data?.products || res.data || [];
      const transformed = rawProducts
        .map((p, idx) => {
          const displayData = getProductDisplayData(p);
          if (!displayData) return null;
          return {
            ...displayData,
            uniqueId: `bestseller-${idx}-${p._id || idx}`,
          };
        })
        .filter(Boolean);

      setProducts(transformed);
    } catch (err) {
      console.error("Error fetching best sellers:", err);
      setError(
        getErrorMessage(
          err,
          "Couldn't load best sellers. Please try again later."
        )
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [getProductDisplayData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const memoizedProducts = useMemo(() => products, [products]);

  return {
    products: memoizedProducts,
    selectedVariants,
    tempSelectedVariants,
    setTempSelectedVariants,
    addingToCart,
    wishlistLoading,
    wishlistData,
    showOutOfStockPopup,
    outOfStockProductName,
    showVariantOverlay,
    loading,
    error,
    isInWishlist,
    handleOutOfStockClick,
    closeOutOfStockPopup,
    toggleWishlist,
    handleVariantSelect,
    openVariantOverlay,
    closeVariantOverlay,
    handleAddToCart,
    handleProductClick,
    fetchProducts,
  };
};

export default useBestSellers;
