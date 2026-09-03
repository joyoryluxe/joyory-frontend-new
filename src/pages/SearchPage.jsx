import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaRegSadTear, FaSpinner, FaSync, FaTimes, FaHeart, FaRegHeart, FaChevronDown, FaCheck } from "react-icons/fa";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import axiosInstance from "../utils/axiosInstance.js";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SearchPage.css";
import "../styles/BestSellers.css";
import Bag from "../assets/Bag.svg";
import updownarrow from "../assets/updownarrow.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../components/common/Loader";
import filtering from "../assets/filtering.svg";
import BrandFilter from "../components/common/BrandFilter";

// ===================== OUT OF STOCK POPUP COMPONENT =====================
const OutOfStockPopup = ({ isOpen, onClose, productName }) => {
  if (!isOpen) return null;

  return (
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
      onClick={onClose}
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
          onClick={onClose}
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
          "Oops! {productName} is out of stock right now. Check back soon or discover similar items."
        </p>

        <button
          onClick={onClose}
          className="btn btn-dark w-100"
          style={{
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          Got it
        </button>
      </div>
      <style>{`
        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

const CART_API_BASE = "/api/user/cart";
const WISHLIST_CACHE_KEY = "guestWishlist";
const PRODUCT_ALL_API = "https://beauty.joyory.com/api/user/products/all";

// ==================== HELPER FUNCTIONS ====================
const sanitizeSearchQuery = (query) => {
  if (!query) return "";
  return query
    .replace(/[+*?^$()\[\]{}|\\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeText = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_.,;:'"`/\\()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

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

const getCategoryName = (product) => {
  if (!product?.category) return "Uncategorized";
  if (typeof product.category === "object" && product.category.name) return product.category.name;
  if (typeof product.category === "string") return product.category;
  return "Uncategorized";
};

const safeString = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.name) return String(val.name);
    if (val.title) return String(val.title);
    if (val.label) return String(val.label);
    try {
      return JSON.stringify(val);
    } catch (e) {
      return "";
    }
  }
  return String(val);
};

const getCategoryAndDescendantSpecs = (categoriesList, searchSlugOrName) => {
  const term = searchSlugOrName.toLowerCase().trim();
  const collectedIds = new Set();
  const collectedNames = new Set();
  const collectedSlugs = new Set();

  const findCategory = (nodes) => {
    for (const node of nodes) {
      if (node.name?.toLowerCase().trim() === term || node.slug?.toLowerCase().trim() === term) {
        return node;
      }
      if (node.children?.length) {
        const found = findCategory(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const collectNode = (node) => {
    if (!node) return;
    if (node._id) collectedIds.add(String(node._id));
    if (node.name) collectedNames.add(node.name.toLowerCase().trim());
    if (node.slug) collectedSlugs.add(node.slug.toLowerCase().trim());
    if (node.children?.length) {
      node.children.forEach(child => collectNode(child));
    }
  };

  const targetCategory = findCategory(categoriesList);
  if (targetCategory) {
    collectNode(targetCategory);
  }
  return { ids: collectedIds, names: collectedNames, slugs: collectedSlugs };
};

const matchesCategory = (product, specs) => {
  if (!specs || !product) return false;

  const checkVal = (catVal) => {
    if (!catVal) return false;
    if (typeof catVal === 'object') {
      const idStr = String(catVal._id || catVal.id || "");
      const nameStr = String(catVal.name || "").toLowerCase().trim();
      const slugStr = String(catVal.slug || "").toLowerCase().trim();

      if (idStr && specs.ids.has(idStr)) return true;
      if (nameStr && specs.names.has(nameStr)) return true;
      if (slugStr && specs.slugs.has(slugStr)) return true;
    } else if (typeof catVal === 'string') {
      const term = catVal.toLowerCase().trim();
      if (specs.ids.has(catVal)) return true;
      if (specs.names.has(term)) return true;
      if (specs.slugs.has(term)) return true;
    }
    return false;
  };

  return checkVal(product.category) || checkVal(product.originalCategory);
};

const getSearchableString = (p) => {
  const productName = safeString(p.name || p.title).toLowerCase();
  const brandName = safeString(getBrandName(p)).toLowerCase();
  const categoryName = safeString(getCategoryName(p)).toLowerCase();
  const descriptionText = safeString(p.description).toLowerCase();

  // Variants details
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const variantsText = variants.map(v =>
    `${safeString(v.shadeName)} ${safeString(v.name)} ${safeString(v.size)} ${safeString(v.ml)} ${safeString(v.weight)} ${safeString(v.sku)}`.toLowerCase()
  ).join(" ");

  // Additional product details
  const skinTypesText = Array.isArray(p.skinTypes)
    ? p.skinTypes.map(st => safeString(st)).join(" ").toLowerCase()
    : safeString(p.skinTypes).toLowerCase();

  const ingredientsText = Array.isArray(p.ingredients)
    ? p.ingredients.map(ing => safeString(ing)).join(" ").toLowerCase()
    : safeString(p.ingredients).toLowerCase();

  const formulationText = safeString(p.formulation).toLowerCase();
  const finishText = safeString(p.finish).toLowerCase();

  const tagsText = Array.isArray(p.tags)
    ? p.tags.map(t => safeString(t)).join(" ").toLowerCase()
    : safeString(p.tags).toLowerCase();

  const raw = [
    productName,
    brandName,
    categoryName,
    descriptionText,
    variantsText,
    skinTypesText,
    ingredientsText,
    formulationText,
    finishText,
    tagsText
  ].filter(Boolean).join(" ");

  const norm = normalizeText(raw);
  return `${raw} ${norm}`;
};

const getVariantName = (variant) => {
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
};

const getVariantType = (variant) => {
  if (!variant) return 'default';
  if (variant.hex && isValidHexColor(variant.hex)) return 'color';
  if (variant.shadeName) return 'shade';
  if (variant.size) return 'size';
  if (variant.ml) return 'ml';
  if (variant.weight) return 'weight';
  return 'default';
};

// Flat map recursive tree traversal checking both subCategories and children
const flattenCategories = (nodes) => {
  if (!Array.isArray(nodes)) return [];
  let flat = [];
  nodes.forEach(node => {
    flat.push(node);
    const nextNodes = node.subCategories || node.children;
    if (Array.isArray(nextNodes) && nextNodes.length > 0) {
      flat = flat.concat(flattenCategories(nextNodes));
    }
  });
  return flat;
};

// Tira-style Semantic Query Parser with word boundary matching
const parseSemanticQuery = (term, categoriesList, brandsList) => {
  const cleanTerm = term.toLowerCase().trim();
  if (!cleanTerm) return { brand: null, category: null, remaining: "" };

  const flatCats = flattenCategories(categoriesList);

  // Sort by length desc for greedy longest-word-first matching
  const sortedBrands = [...brandsList].sort((a, b) => (b.name || "").length - (a.name || "").length);
  const sortedCats = [...flatCats].sort((a, b) => (b.name || "").length - (a.name || "").length);

  // 1. Exact matches first
  const exactBrand = sortedBrands.find(b =>
    (b.name && b.name.toLowerCase().trim() === cleanTerm) ||
    (b.slug && b.slug.toLowerCase().trim() === cleanTerm)
  );
  if (exactBrand) return { brand: exactBrand, category: null, remaining: "" };

  const exactCat = sortedCats.find(c =>
    (c.name && c.name.toLowerCase().trim() === cleanTerm) ||
    (c.slug && c.slug.toLowerCase().trim() === cleanTerm)
  );
  if (exactCat) return { brand: null, category: exactCat, remaining: "" };

  let matchedBrand = null;
  let matchedCategory = null;
  let remainingText = cleanTerm;

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 2. Extract brand token using word boundaries
  for (const brand of sortedBrands) {
    const bName = (brand.name || "").toLowerCase().trim();
    const bSlug = (brand.slug || "").toLowerCase().trim();

    if (bName) {
      const regex = new RegExp(`\\b${escapeRegExp(bName)}\\b`, 'i');
      if (regex.test(remainingText)) {
        matchedBrand = brand;
        remainingText = remainingText.replace(regex, "").replace(/\s+/g, " ").trim();
        break;
      }
    }
    if (bSlug && bSlug !== bName) {
      const regex = new RegExp(`\\b${escapeRegExp(bSlug)}\\b`, 'i');
      if (regex.test(remainingText)) {
        matchedBrand = brand;
        remainingText = remainingText.replace(regex, "").replace(/\s+/g, " ").trim();
        break;
      }
    }
  }

  // 3. Extract category token from remaining text using word boundaries
  for (const cat of sortedCats) {
    const cName = (cat.name || "").toLowerCase().trim();
    const cSlug = (cat.slug || "").toLowerCase().trim();

    if (cName) {
      const regex = new RegExp(`\\b${escapeRegExp(cName)}\\b`, 'i');
      if (regex.test(remainingText)) {
        matchedCategory = cat;
        remainingText = remainingText.replace(regex, "").replace(/\s+/g, " ").trim();
        break;
      }
    }
    if (cSlug && cSlug !== cName) {
      const regex = new RegExp(`\\b${escapeRegExp(cSlug)}\\b`, 'i');
      if (regex.test(remainingText)) {
        matchedCategory = cat;
        remainingText = remainingText.replace(regex, "").replace(/\s+/g, " ").trim();
        break;
      }
    }
  }

  return {
    brand: matchedBrand,
    category: matchedCategory,
    remaining: remainingText
  };
};

// ==================== MAIN COMPONENT ====================
const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  // URL Syncing
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setSearchTerm(q);

    // Track Search in Meta Pixel
    if (q && window.fbq) {
      window.fbq('track', 'Search', {
        search_string: q
      });
    }
  }, [location.search]);

  const [allProducts, setAllProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);




  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // ==================== FILTER STATES ====================
  const [filterData, setFilterData] = useState(null);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
  const [showDesktopSortDropdown, setShowDesktopSortDropdown] = useState(false);

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



  const buildQueryParams = useCallback((currentCursor = null) => {
    const p = new URLSearchParams();

    if (searchTerm) {
      const sanitizedSearchTerm = sanitizeSearchQuery(searchTerm);
      const { brand, category, remaining } = parseSemanticQuery(sanitizedSearchTerm, categories, brandsList);

      // Only automatically append parsed brand if remaining is empty (i.e. not a keyword/product name search)
      if (brand && (!filters.brandIds || filters.brandIds.length === 0) && !remaining) {
        p.append("brandIds", brand.slug || brand._id);
      }

      // Only append the automatically parsed category if remaining is empty (i.e., it's a pure category search like "Lips")
      // This prevents matching a category from a word in a product name and filtering out the product.
      if (category && (!filters.categoryIds || filters.categoryIds.length === 0) && !remaining) {
        p.append("categoryIds", category.slug || category._id);
      }

      // Always pass the search query to backend text index
      p.append("q", sanitizedSearchTerm);
    }

    filters.brandIds?.forEach((id) => p.append("brandIds", id));
    filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
    filters.skinTypes?.forEach((n) => p.append("skinTypes", n.replace(/\+/g, " ")));
    filters.formulations?.forEach((id) => p.append("formulations", id));
    filters.finishes?.forEach((s) => p.append("finishes", s));
    filters.ingredients?.forEach((s) => p.append("ingredients", s));

    if (filters.minRating) {
      p.append("minRating", filters.minRating);
    }

    if (filters.priceRange) {
      p.append("minPrice", filters.priceRange.min);
      if (filters.priceRange.max != null) {
        p.append("maxPrice", filters.priceRange.max);
      }
    }

    if (filters.discountMin && filters.discountMin > 0) {
      p.append("discountMin", filters.discountMin);
    }

    // Do not pass sort to backend API due to cursor pagination limitation (nextCursor is null when sorting)
    // if (filters.sort) {
    //   p.append("sort", filters.sort);
    // }

    if (currentCursor) {
      p.append("cursor", currentCursor);
    }

    // Set limit to 500 for search term query to fetch all relevant products on the first page, allowing accurate re-ranking
    if (searchTerm) {
      p.append("limit", "500");
    } else {
      p.append("limit", "9");
    }

    return p.toString();
  }, [searchTerm, filters, categories, brandsList]);

  const fetchProducts = useCallback(async (currentCursor = null, reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setCursor(null);
        setHasMore(true);
      } else {
        setIsFetchingMore(true);
      }

      let products = [];
      let pagination = {};
      let titleMsg = null;

      if (searchTerm && reset) {
        // Loop to fetch all pages of matching products when a search term is supplied
        let hasMorePages = true;
        let pageCursor = currentCursor;
        const productMap = new Map();

        while (hasMorePages) {
          const queryString = buildQueryParams(pageCursor);
          const response = await axiosInstance.get(`${PRODUCT_ALL_API}?${queryString}`, {
            withCredentials: true
          });

          let pageProducts = [];
          let pagePag = {};

          if (response.data && Array.isArray(response.data.products)) {
            pageProducts = response.data.products;
            pagePag = response.data.pagination || {};
          } else if (Array.isArray(response.data)) {
            pageProducts = response.data;
          }

          if (response.data?.titleMessage) {
            titleMsg = response.data.titleMessage;
          }

          if (response.data?.filters && !filterData) {
            setFilterData(response.data.filters);
          }
          if (response.data?.trendingCategories && trendingCategories.length === 0) {
            setTrendingCategories(response.data.trendingCategories);
          }

          pageProducts.forEach(p => {
            const id = p._id || p.id;
            if (id) productMap.set(id, p);
          });

          if (!pagePag.hasMore || !pagePag.nextCursor || pageProducts.length === 0) {
            hasMorePages = false;
            pagination = pagePag;
          } else {
            pageCursor = pagePag.nextCursor;
          }
        }
        products = Array.from(productMap.values());
      } else {
        const queryString = buildQueryParams(currentCursor);
        const response = await axiosInstance.get(`${PRODUCT_ALL_API}?${queryString}`, {
          withCredentials: true
        });

        if (response.data && Array.isArray(response.data.products)) {
          products = response.data.products;
          pagination = response.data.pagination || {};
        } else if (Array.isArray(response.data)) {
          products = response.data;
        }

        if (response.data?.titleMessage) {
          titleMsg = response.data.titleMessage;
        }

        if (response.data?.filters && !filterData) {
          setFilterData(response.data.filters);
        }
        if (response.data?.trendingCategories && trendingCategories.length === 0) {
          setTrendingCategories(response.data.trendingCategories);
        }
      }

      if (reset) {
        setAllProducts(products);
      } else {
        setAllProducts(prev => {
          const productMap = new Map();
          prev.forEach(p => productMap.set(p._id, p));
          products.forEach(p => productMap.set(p._id, p));
          return Array.from(productMap.values());
        });
      }

      if (titleMsg) {
        const match = titleMsg.match(/\d+/);
        if (match) {
          setTotalCount(parseInt(match[0], 10));
        } else {
          setTotalCount(prev => reset ? products.length : prev + products.length);
        }
      } else {
        setTotalCount(prev => reset ? products.length : prev + products.length);
      }

      setHasMore(pagination.hasMore || false);
      setCursor(pagination.nextCursor || null);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError("We couldn't load the inventory. Please try again.");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [buildQueryParams, filterData, trendingCategories, searchTerm]);

  const fetchMoreProducts = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;
    await fetchProducts(cursor, false);
  }, [cursor, isFetchingMore, hasMore, fetchProducts]);


  // ==================== WISHLIST STATES ====================
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [wishlistData, setWishlistData] = useState([]);

  // ==================== VARIANT STATES ====================
  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  const handleOutOfStockClick = (productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => {
      setShowOutOfStockPopup(false);
    }, 3000);
  };

  const closeOutOfStockPopup = () => {
    setShowOutOfStockPopup(false);
  };

  const isCompletelyOutOfStock = useCallback((prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    if (vars.length === 0) {
      return (prod.stock || 0) <= 0;
    }
    return vars.every(v => (v.stock || 0) <= 0);
  }, []);

  // Toast Utility
  const showToastMsg = (message, type = "error", duration = 3000) => {
    if (type === "success") {
      toast.success(message, { autoClose: duration });
    } else if (type === "error") {
      toast.error(message, { autoClose: duration });
    } else {
      toast.info(message, { autoClose: duration });
    }
  };

  // ==================== WISHLIST FUNCTIONS - FULLY UPDATED ====================

  // 🔥 FIXED: Proper string comparison for IDs
  const isInWishlist = useCallback((productId, sku) => {
    if (!productId || !sku) return false;

    // Normalize to strings for comparison
    const normalizedProductId = String(productId);
    const normalizedSku = String(sku);

    return wishlistData.some(item => {
      const itemProductId = String(item.productId || item._id);
      const itemSku = String(item.sku);
      return itemProductId === normalizedProductId && itemSku === normalizedSku;
    });
  }, [wishlistData]);

  // 🔥 FIXED: Fetch with proper error handling and credentials
  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const response = await axiosInstance.get("/api/user/wishlist", {
          withCredentials: true // Ensure cookies are sent
        });
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_CACHE_KEY)) || [];
        // Normalize local data to match API format
        const formattedWishlist = localWishlist.map(item => ({
          productId: String(item._id || item.productId),
          _id: String(item._id),
          sku: String(item.sku),
          name: item.name,
          variant: item.variantName || item.variant,
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
  }, [user]);

  // 🔥 FIXED: Toggle with proper string normalization and storage sync
  const toggleWishlist = useCallback(async (prod, variant) => {
    // Handle case when no variant is passed (for products without variants)
    if (!prod) {
      showToastMsg("Product not found", "error");
      return;
    }

    // Get effective variant (passed variant, selected variant, or first available)
    const effectiveVariant = variant && Object.keys(variant).length > 0
      ? variant
      : selectedVariants[prod._id]
        ? selectedVariants[prod._id]
        : (prod.variants?.[0] || {});

    if (!effectiveVariant || Object.keys(effectiveVariant).length === 0) {
      showToastMsg("Please select a variant first", "error");
      return;
    }

    const productId = String(prod._id);
    const sku = String(getSku(effectiveVariant));

    if (!user || user.guest) {
      showToastMsg("Please login to use wishlist", "error");
      localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId, sku }));
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (currentlyInWishlist) {
        await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
          data: { sku: sku },
          withCredentials: true // 🔥 FIXED: Added credentials
        });
        showToastMsg("Removed from wishlist!", "success");
      } else {
        await axiosInstance.post(`/api/user/wishlist/${productId}`,
          { sku: sku },
          { withCredentials: true } // 🔥 FIXED: Added credentials
        );
        showToastMsg("Added to wishlist!", "success");
      }
      // Update local state immediately
      await fetchWishlistData();
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        showToastMsg("Please login to use wishlist", "error");
        localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId, sku }));
        navigate("/login", { state: { from: "/wishlist" } });
      } else {
        showToastMsg(error.response?.data?.message || "Failed to update wishlist", "error");
      }
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  }, [user, isInWishlist, fetchWishlistData, selectedVariants, navigate]);

  // 🔥 FIXED: Listen for storage changes (cross-tab sync)
  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  // 🔥 FIXED: Storage event listener for multi-tab sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === WISHLIST_CACHE_KEY) {
        fetchWishlistData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchWishlistData]);



  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;

      if (isBottom) {
        fetchMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreProducts]);

  // ==================== DATA FETCHING WITH FILTERS ====================
  // Fetch categories tree and brands list on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axiosInstance.get("/api/user/categories/tree").catch(err => {
            console.error("Error fetching categories tree:", err);
            return { data: [] };
          }),
          axiosInstance.get("/api/user/brands").catch(err => {
            console.error("Error fetching brands list:", err);
            return { data: [] };
          })
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
        setBrandsList(Array.isArray(brandRes.data) ? brandRes.data : []);
      } catch (err) {
        console.error("Error fetching search metadata:", err);
      } finally {
        setIsMetadataLoaded(true);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch products debounced on query/filters change
  useEffect(() => {
    if (!isMetadataLoaded) return;

    const timer = setTimeout(() => {
      fetchProducts(null, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters, isMetadataLoaded]);

  // ==================== CLIENT-SIDE SEARCH & FILTER ====================
  const filteredProducts = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];
    const getProductPrice = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
      return displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
    };
    const getProductDiscount = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      const displayVariant = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
      const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
      const orig = displayVariant?.originalPrice || displayVariant?.mrp || prod.mrp || price;
      return orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
    };
    const getProductRating = (prod) => {
      return prod.avgRating || prod.rating || 0;
    };

    // Relevance scoring for search term
    const getSearchScore = (prod) => {
      if (!searchTerm) return 0;

      const normName = normalizeText(prod.name || prod.title);
      const normBrand = normalizeText(getBrandName(prod));
      const normCategory = normalizeText(getCategoryName(prod));
      const normTerm = normalizeText(searchTerm);

      if (normName === normTerm) return 3000;
      if (normName.includes(normTerm)) return 2000;
      if (`${normBrand} ${normName}`.includes(normTerm)) return 1500;

      const words = normTerm.split(/\s+/).filter(Boolean);
      if (words.length === 0) return 0;

      let nameMatches = 0;
      let brandCatMatches = 0;
      const searchableStr = getSearchableString(prod);

      words.forEach(word => {
        if (normName.includes(word)) nameMatches++;
        if (normBrand.includes(word) || normCategory.includes(word) || searchableStr.includes(word)) brandCatMatches++;
      });

      if (nameMatches === 0 && brandCatMatches === 0) return 0;

      const nameScore = (nameMatches / words.length) * 500;
      const totalScore = (brandCatMatches / words.length) * 300;
      const allWordsBonus = (nameMatches === words.length) ? 300 : 0;

      return Math.max(nameScore, totalScore) + allWordsBonus;
    };

    const sorted = [...allProducts];
    sorted.sort((a, b) => {
      const scoreA = getSearchScore(a);
      const scoreB = getSearchScore(b);

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // higher relevance first
      }

      // Fallback sorting
      if (filters.sort === 'priceHighToLow') {
        return getProductPrice(b) - getProductPrice(a);
      } else if (filters.sort === 'priceLowToHigh') {
        return getProductPrice(a) - getProductPrice(b);
      } else if (filters.sort === 'rating') {
        return getProductRating(b) - getProductRating(a);
      } else if (filters.sort === 'discountHighToLow') {
        return getProductDiscount(b) - getProductDiscount(a);
      } else if (filters.sort === 'discountLowToHigh') {
        return getProductDiscount(a) - getProductDiscount(b);
      }
      return 0;
    });

    return sorted;
  }, [allProducts, searchTerm, filters.sort, selectedVariants, tempSelectedVariants]);

  // ==================== HANDLERS ====================
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    const params = new URLSearchParams(window.location.search);
    if (val) params.set("q", val);
    else params.delete("q");
    navigate({ search: params.toString() }, { replace: true });
  };

  const clearSearch = () => {
    setSearchTerm("");
    navigate("/search", { replace: true });
  };

  const handleVariantSelect = useCallback((productId, variant) => {
    if (!productId || !variant) return;

    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  }, []);

  const openVariantOverlay = (productId, type = "all", e) => {
    if (e) e.stopPropagation();
    setSelectedVariantType(type);
    setShowVariantOverlay(productId);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
    setTempSelectedVariants({});
  };

  const getProductSlug = (product) => {
    return product.slugs?.[0] || product.slug || product._id;
  };

  // ==================== ADD TO CART ====================
  const handleAddToCart = async (prod, forceVariant = null) => {
    setAddingToCart(prev => ({ ...prev, [prod._id]: true }));
    try {
      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVariants = variants.length > 0;
      let payload;

      if (hasVariants) {
        const selectedVariant = forceVariant || selectedVariants[prod._id] || (variants.find((v) => v.stock > 0) || variants[0]);
        if (!selectedVariant) {
          showToastMsg("Please select a variant.", "error");
          return;
        }
        if (selectedVariant.stock <= 0) {
          showToastMsg("Selected variant is out of stock.", "error");
          return;
        }
        payload = {
          productId: prod._id,
          variants: [{ variantSku: getSku(selectedVariant), quantity: 1 }],
        };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        cache[prod._id] = selectedVariant;
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      } else {
        if (prod.stock <= 0) {
          showToastMsg("Product is out of stock.", "error");
          return;
        }
        payload = { productId: prod._id, quantity: 1 };
        const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
        delete cache[prod._id];
        localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      }

      const response = await axiosInstance.post(`${CART_API_BASE}/add`, payload);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add to cart");
      }

      showToastMsg("Product added to cart!", "success");
      navigate("/cartpage");
    } catch (err) {
      console.error("Add to Cart error:", err);
      showToastMsg(err.response?.data?.message || "Failed to add to cart", "error");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [prod._id]: false }));
    }
  };

  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // ==================== FILTER HELPERS ====================
  const isAnyFilterActive = useMemo(() => {
    return filters.brandIds.length > 0 ||
      filters.categoryIds.length > 0 ||
      filters.skinTypes.length > 0 ||
      filters.formulations.length > 0 ||
      filters.finishes.length > 0 ||
      filters.ingredients.length > 0 ||
      filters.priceRange ||
      filters.discountMin ||
      filters.minRating ||
      filters.sort !== "recent";
  }, [filters]);

  const handleClearAllFilters = useCallback(() => {
    setFilters({
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
  }, []);

  const handleCategoryCheckboxToggle = useCallback((cat) => {
    setFilters(prev => {
      const current = prev.categoryIds || [];
      const value = cat.slug || cat._id;
      const isActive = current.includes(value);
      return {
        ...prev,
        categoryIds: isActive
          ? current.filter(id => id !== value)
          : [...current, value]
      };
    });
  }, []);

  const brandFilterProps = {
    filters,
    setFilters,
    filterData,
    trendingCategories,
    activeCategorySlug: null,
    activeCategoryName: "",
    onClearCategory: handleClearAllFilters,
    onCategoryPillClick: handleCategoryCheckboxToggle,
  };

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
    const currentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : prod.stock <= 0;

    // Show out of stock if completely out AND it has NO variants
    const showOutOfStock = completelyOutOfStock && !hasVar;

    const showSelectVariantButton = hasVar && vars.length > 1;
    const buttonDisabled = isAdding || showOutOfStock;

    let btnText = "Add to Bag";
    if (isAdding) btnText = "Adding...";
    else if (showOutOfStock) btnText = "Out of Stock";
    else if (showSelectVariantButton) btnText = "Select Variant";
    else if (currentVariantOutOfStock) btnText = "Out of Stock";

    return (
      <div key={prod._id} className="col-6 col-sm-4 col-lg-4 position-relative">
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

              {prod?.supportsVTO && (
                <div
                  className="support-beauty-badge"
                  title="Try It On"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${slugPr}`);
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <path d="M8 10a4 4 0 1 1 8 0c0 2.2-1.8 4-4 4s-4-1.8-4-4z" />
                    <path d="M10 10h.01" />
                    <path d="M14 10h.01" />
                    <path d="M10 13c.5.5 1.5.7 2 .7s1.5-.2 2-.7" />
                    <path d="M6 19c0-1.5 1.5-2.5 6-2.5s6 1 6 2.5" />
                  </svg>
                  <span className="vto-text">TRY IT ON</span>
                </div>
              )}

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
                  className={`product-card-wishlist-btn ${inWl ? 'in-wishlist' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (displayVariant || !hasVar)
                      toggleWishlist(prod, displayVariant || {});
                  }}
                  disabled={wishlistLoading[prod._id]}
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

                {/* Product Name */}<div className="product-card-title-wrap"><h6
                  className="foryou-name m-0 p-0"
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
                </h6></div>{showOutOfStock && (
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
                            {formatPrice(price)}
                          </span>
                          {disc && !showOutOfStock && (
                            <>
                              <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                {formatPrice(orig)}
                              </span>
                              <span className="discount-percent fw-bold ms-2">
                                ({pct}% OFF)
                              </span>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
                {prod.nextOrderDiscountMessage && (
                  <div className="next-order-discount-tag" title={prod.nextOrderDiscountMessage} onClick={(e) => { e.stopPropagation(); window.showDiscountPopup && window.showDiscountPopup(prod.nextOrderDiscountMessage, e.currentTarget); }}>
                    <span className="text-truncate">{prod.nextOrderDiscountMessage}</span>
                  </div>
                )}

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
                          openVariantOverlay(prod._id, "all", e);
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
                            onClick={(e) => {
                              e.stopPropagation();
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
                                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
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
                            onClick={(e) => {
                              e.stopPropagation();
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
                    className={`btn w-100 add-tocard-buttonss d-flex align-items-center justify-content-center gap-2 ${isAdding ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const chosen = tempSelectedVariants[prod._id] || selectedVariants[prod._id] || (vars.find((v) => v.stock > 0) || vars[0]);
                      if (chosen) {
                        handleVariantSelect(prod._id, chosen);
                      }
                      await handleAddToCart(prod, chosen);
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

  // ==================== RENDER ====================
  return (
    <div className="search-page-container">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <Header />

      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            zIndex: 9999,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="text-center">
            <DotLottieReact
              className="mb-4"
              src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className="text-muted mb-0 page-title-main-name">
              Finding the perfect products just for you
            </p>
            <div className="d-flex justify-content-center gap-1 mt-4">
              <div className="dot-pulse"></div>
              <div className="dot-pulse"></div>
              <div className="dot-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* <div className="search-main-wrapper"> */}
      <div className="container-lg-fluid px-lg-5 px-3 pt-lg-5 mt-0 pt-0">
        {/* Sticky Search Bar */}
        <div className="search-header-sticky d-none">
          <div className="search-input-container">
            <FaSearch className="inner-search-icon" />
            <input className="page-title-main-name"
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchTerm}
              onChange={handleInputChange}
              autoFocus
            />
            {searchTerm && <FaTimes className="clear-icon" onClick={clearSearch} />}
            {isSyncing && <FaSync className="spin sync-icon" title="Syncing Inventory..." />}
          </div>
          <div className="search-results-meta page-title-main-name">
            {isLoading ? (
              <span>Initializing catalog...</span>
            ) : (
              <p>
                Showing <b>{totalCount}</b> items
                {searchTerm && <> for "<b>{searchTerm}</b>"</>}
              </p>
            )}
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="container-fluid py-4 pt-lg-4 mt-lg-2 mt-0 pt-2">
          <div className="row">
            {/* Desktop Sidebar Filter */}
            <div className="d-none d-lg-block col-lg-3">
              <BrandFilter {...brandFilterProps} />
            </div>

            {/* Mobile Filter Buttons */}
            <div className="d-lg-none mb-3 col-12">
              <div className="w-100 filter-responsive rounded shadow-sm">
                <div className="container-fluid p-0">
                  <div className="row g-0" style={{ flexDirection: "row-reverse" }}>
                    <div className="col-6">
                      <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                        onClick={() => setShowFilterOffcanvas(true)} style={{ gap: 12 }}>
                        <img src={filtering} alt="Filter" style={{ width: 25 }} />
                        <div className="text-start">
                          <p className="mb-0 fs-6 fw-semibold page-title-main-name">Filter</p>
                          <span className="text-muted small page-title-main-name">Tap to apply</span>
                        </div>
                      </button>
                    </div>
                    <div className="col-6 border-end">
                      <button className="btn w-100 h-100 d-flex align-items-center justify-content-center py-3"
                        onClick={() => setShowSortOffcanvas(true)} style={{ gap: 12 }}>
                        <img src={updownarrow} alt="Sort" style={{ width: 25 }} />
                        <div className="text-start">
                          <p className="mb-0 fs-6 fw-semibold page-title-main-name">Sort by</p>
                          <span className="text-muted small">
                            {filters.sort === "recent" ? "Relevance" :
                              filters.sort === "priceHighToLow" ? "Price High to Low" : "Price Low to High"}
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
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                  style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowFilterOffcanvas(false)} />
                <div className="position-fixed start-0 bottom-0 w-100 bg-white"
                  style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh", boxShadow: "0 -4px 20px rgba(0,0,0,.2)" }}>
                  <div className="text-center py-3 position-relative">
                    <h5 className="mb-0 fw-bold">Filters</h5>
                    <button className="btn-close position-absolute end-0 me-3"
                      style={{ top: "50%", transform: "translateY(-50%)" }}
                      onClick={() => setShowFilterOffcanvas(false)} />
                    <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
                  </div>
                  <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: "70vh" }}>
                    <BrandFilter
                      {...brandFilterProps}
                      onClose={() => setShowFilterOffcanvas(false)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mobile Sort Offcanvas */}
            {showSortOffcanvas && (
              <>
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
                  style={{ opacity: 0.5, zIndex: 1040 }} onClick={() => setShowSortOffcanvas(false)} />
                <div className="position-fixed start-0 bottom-0 w-100 bg-white"
                  style={{ zIndex: 1050, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60vh", boxShadow: "0 -4px 12px rgba(0,0,0,.15)" }}>
                  <div className="text-center py-3 position-relative">
                    <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
                    <button className="btn-close position-absolute end-0 me-3"
                      style={{ top: "50%", transform: "translateY(-50%)" }}
                      onClick={() => setShowSortOffcanvas(false)} />
                    <div className="mx-auto mt-2 bg-secondary" style={{ height: 5, width: 50, borderRadius: 3 }} />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="list-group">
                      {[
                        { value: "recent", label: "Newest First" },
                        { value: "priceLowToHigh", label: "Price: Low to High" },
                        { value: "priceHighToLow", label: "Price: High to Low" },
                        { value: "rating", label: "Top Rated" },
                        { value: "discountHighToLow", label: "Discount: High to Low" },
                        { value: "discountLowToHigh", label: "Discount: Low to High" }
                      ].map(({ value, label }) => (
                        <label key={value} className="list-group-item py-3 d-flex align-items-center">
                          <input className="form-check-input me-3" type="radio" name="sort"
                            checked={filters.sort === value}
                            onChange={() => {
                              setFilters(prev => ({ ...prev, sort: value }));
                              setShowSortOffcanvas(false);
                            }} />
                          <span className="page-title-main-name">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Results Grid */}
            <div className="col-12 col-lg-9">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span className="text-muted page-title-main-name">
                  {totalCount > 0 ? `Showing ${totalCount} products` : "No products found"}
                </span>
                <div className="d-flex align-items-center gap-3">
                  {/* {isAnyFilterActive && (
                    <button className="btn btn-sm btn-outline-danger" onClick={handleClearAllFilters}>
                      Clear Filters
                    </button>
                  )} */}
                  {/* Desktop Sort Dropdown */}
                  <div className="d-none d-lg-flex align-items-center position-relative" style={{ gap: '6px' }}>
                    <span className="text-muted page-title-main-name" style={{ fontSize: '14px' }}>Sort by:</span>
                    <div className="position-relative">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none p-0 page-title-main-name fw-semibold text-dark d-inline-flex align-items-center gap-1"
                        onClick={() => setShowDesktopSortDropdown(!showDesktopSortDropdown)}
                        style={{ border: 'none', background: 'none', boxShadow: 'none', fontSize: '14px' }}
                      >
                        {
                          filters.sort === 'priceHighToLow' ? 'Price: High to Low' :
                            filters.sort === 'priceLowToHigh' ? 'Price: Low to High' :
                              filters.sort === 'rating' ? 'Top Rated' :
                                filters.sort === 'discountHighToLow' ? 'Discount: High to Low' :
                                  filters.sort === 'discountLowToHigh' ? 'Discount: Low to High' :
                                    'Newest First'
                        }
                        <FaChevronDown style={{ fontSize: '10px', transition: 'transform 0.2s', transform: showDesktopSortDropdown ? 'rotate(180deg)' : 'none' }} />
                      </button>
                      {showDesktopSortDropdown && (
                        <>
                          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 998 }} onClick={() => setShowDesktopSortDropdown(false)} />
                          <ul className="dropdown-menu show dropdown-menu-end shadow-sm" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 999, border: '1px solid #eee', borderRadius: '8px', minWidth: '170px', display: 'block', marginTop: '5px', background: '#fff', padding: '5px 0' }}>
                            {[
                              { value: "recent", label: "Newest First" },
                              { value: "priceLowToHigh", label: "Price: Low to High" },
                              { value: "priceHighToLow", label: "Price: High to Low" },
                              { value: "rating", label: "Top Rated" },
                              { value: "discountHighToLow", label: "Discount: High to Low" },
                              { value: "discountLowToHigh", label: "Discount: Low to High" }
                            ].map(({ value, label }) => (
                              <li key={value}>
                                <button
                                  type="button"
                                  className={`dropdown-item page-title-main-name py-2 custom-sort-item ${filters.sort === value ? 'active' : ''}`}
                                  onClick={() => {
                                    setFilters(prev => ({ ...prev, sort: value }));
                                    setShowDesktopSortDropdown(false);
                                  }}
                                  style={{
                                    fontSize: '13px',
                                    border: 'none',


                                    width: '100%',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    padding: '8px 16px'
                                  }}
                                >
                                  {label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isLoading && allProducts.length === 0 ? (
                <div
                  className="fullscreen-loader page-title-main-name text-center py-5"
                  style={{
                    minHeight: "50vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Loader text="Please wait while we prepare the best products for you..." height={200} />
                </div>
              ) : error ? (
                <div className="error-box text-center py-5">
                  <FaRegSadTear size={40} />
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()}>Retry</button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="no-results text-center py-5">
                  <FaSearch size={40} className="text-muted mb-3" />
                  <h3>No matches found</h3>
                  <p className="text-muted">Try different keywords or adjust your filters.</p>
                  {(searchTerm || isAnyFilterActive) && (
                    <button className="btn btn-dark mt-2 px-4" onClick={() => {
                      clearSearch();
                      handleClearAllFilters();
                    }}>
                      Clear All
                    </button>
                  )}
                </div>
              ) : (
                // <div className="row g-4">
                //   {filteredProducts.map(renderProductCard)}
                // </div>

                <>
                  <div className="row g-4">
                    {filteredProducts.map(renderProductCard)}
                  </div>

                  {/* 🔥 Infinite Scroll Loader */}
                  {isFetchingMore && (
                    <Loader text="Loading more products..." height={100} />
                  )}

                  {/* Optional End Message */}
                  {!hasMore && (
                    <div className="text-center py-4 text-muted">
                      No more products to show
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showVariantOverlay && (() => {
        const item = filteredProducts.find(p => p._id === showVariantOverlay) || allProducts.find(p => p._id === showVariantOverlay);
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
                          <div className={`mobile-sheet-color-circle ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`} style={{ backgroundColor: v.hex || "#ccc", position: "relative" }}>
                            {isSelected && (<FaCheck className="mobile-sheet-check-icon" />)}
                            {isOutOfStock && (
                              <span style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'red',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                pointerEvents: 'none',
                              }}>✕</span>
                            )}
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
                            {isOutOfStock && (
                              <span style={{
                                color: 'red',
                                fontWeight: 'bold',
                                marginLeft: '6px',
                                fontSize: '12px',
                              }}>✕</span>
                            )}
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
                    <span className="mobile-sheet-current-price">{formatPrice(displayVariant.displayPrice || displayVariant.price || item.price || 0)}</span>
                    {displayVariant.originalPrice > displayVariant.displayPrice && (
                      <>
                        <span className="mobile-sheet-original-price">{formatPrice(displayVariant.originalPrice)}</span>
                        <span className="mobile-sheet-discount">({displayVariant.discountPercent || 0}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="mobile-sheet-view-details" onClick={(e) => { e.stopPropagation(); navigate(`/product/${getProductSlug(item)}`); closeVariantOverlay(); }}>View Details</span>
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

      {showOutOfStockPopup && (
        <OutOfStockPopup
          isOpen={showOutOfStockPopup}
          onClose={closeOutOfStockPopup}
          productName={outOfStockProductName}
        />
      )}

      <Footer />
    </div>
  );
};

export default SearchPage;






//==============================================================================Done-Code(End)==========================================================================
