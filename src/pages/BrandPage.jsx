import ProductCardCartButton from "../components/common/ProductCardCartButton";
/* BrandPage – Fully aligned with ProductPage filter sidebar */
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import Header from "../components/common/Header";
import SEOMeta from "../components/common/SEOMeta";
import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import PageNotFound from "./PageNotFound";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext.jsx";
import BrandFilter from "../components/common/BrandFilter";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../styles/BrandPage.css";
import "../styles/BestSellers.css";
import "../styles/CrawlablePagination.css";
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

const PAGE_SIZE = 20;

const getPaginationNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
};

export default function BrandPage() {
  const { brandSlug } = useParams();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(); // NEW
  const { user } = useContext(UserContext);
    const { openCart, syncCartFromBackend } = useContext(CartContext);

  /* ── state ──────────────────────────────────────────────────────────────── */
  const [allProducts, setAllProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activePage, setActivePage] = useState(() => {
    const initialP = parseInt(searchParams.get("page"), 10);
    return initialP > 0 ? initialP : 1;
  });
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  }, [totalCount]);
  const isProgrammaticScrollRef = useRef(false);
  const isNavigatingPageRef = useRef(false);
  const [pageTitle, setPageTitle] = useState("Products");
  const [bannerImages, setBannerImages] = useState([]);

  const [trendingCategories, setTrendingCategories] = useState([]);
  const [filterData, setFilterData] = useState(null);
  const [pageNotFound, setPageNotFound] = useState(false);

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
      let vals = searchParams.getAll(key);
      if (!vals.length) {
        const comma = searchParams.get(key);
        if (comma) vals = comma.split(",").map((s) => s.trim()).filter(Boolean);
      }
      if (key === "skinTypes") {
        return vals.map(v => v.replace(/\s+/g, "+"));
      }
      return vals;
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
      ["recent", "priceHighToLow", "priceLowToHigh", "rating", "discountHighToLow", "discountLowToHigh"].includes(sortParam)
    )
      initial.sort = sortParam;

    return initial;
  });

  const activeCategorySlug = useMemo(() => {
    return filters.categoryIds?.[0] || null;
  }, [filters.categoryIds]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategorySlug) return "";
    const found = trendingCategories.find((c) => c.slug === activeCategorySlug)
      || filterData?.categories?.find((c) => c.slug === activeCategorySlug || c._id === activeCategorySlug);
    return found ? found.name : "";
  }, [activeCategorySlug, trendingCategories, filterData]);

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

  const handleTopCategoryClick = useCallback((cat) => {
    setFilters(prev => {
      const current = prev.categoryIds || [];
      const value = cat.slug || cat._id;
      const isActive = current.includes(value);
      return {
        ...prev,
        categoryIds: isActive ? [] : [value]
      };
    });
  }, []);

  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false);
  const [showSortOffcanvas, setShowSortOffcanvas] = useState(false);
  const [showDesktopSortDropdown, setShowDesktopSortDropdown] = useState(false);
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");

  // ===================== OUT OF STOCK POPUP STATE =====================
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  // ===================== END OUT OF STOCK POPUP STATE =====================

  const sortedProducts = useMemo(() => {
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
    const sorted = [...allProducts];
    if (filters.sort === 'priceHighToLow') {
      sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    } else if (filters.sort === 'priceLowToHigh') {
      sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (filters.sort === 'rating') {
      sorted.sort((a, b) => getProductRating(b) - getProductRating(a));
    } else if (filters.sort === 'discountHighToLow') {
      sorted.sort((a, b) => getProductDiscount(b) - getProductDiscount(a));
    } else if (filters.sort === 'discountLowToHigh') {
      sorted.sort((a, b) => getProductDiscount(a) - getProductDiscount(b));
    }
    return sorted;
  }, [allProducts, filters.sort, selectedVariants, tempSelectedVariants]);

  const loaderRef = useRef(null);
  const lastBrandSlugRef = useRef(null);

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
      if (prod && variant) {
        const sku = getSku(variant);
        localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId: prod._id, sku }));
      }
      navigate("/login", { state: { from: "/wishlist" } });
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
  const buildQueryParams = (cursor = null, customLimit = null) => {
    const p = new URLSearchParams();
    if (brandSlug) p.append("brandIds", brandSlug);

    filters.brandIds?.forEach((id) => p.append("brandIds", id));
    filters.categoryIds?.forEach((id) => p.append("categoryIds", id));
    filters.skinTypes?.forEach((n) => p.append("skinTypes", n.replace(/\+/g, " ")));
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

    // Do not pass sort to backend API due to cursor pagination limitation (nextCursor is null when sorting)
    // if (filters.sort) p.append("sort", filters.sort);
    if (cursor) p.append("cursor", cursor);
    p.append("limit", String(customLimit || PAGE_SIZE));

    const queryString = p.toString();
    console.log("BrandPage API Query →", `${PRODUCT_ALL_API}?${queryString}`);
    return queryString;
  };

  const getAppScrollTop = () => {
    const bodyTop = document.body ? document.body.scrollTop : 0;
    const docTop = document.documentElement ? document.documentElement.scrollTop : 0;
    const winTop = window.pageYOffset || 0;
    return Math.max(bodyTop, docTop, winTop);
  };

  const scrollAppTo = (y, behavior = "smooth") => {
    const targetY = Math.max(0, Math.round(y));
    try {
      if (document.body) {
        document.body.scrollTo({ top: targetY, behavior });
      }
    } catch (e) {}
    try {
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: targetY, behavior });
      }
    } catch (e) {}
    try {
      window.scrollTo({ top: targetY, behavior });
    } catch (e) {}
  };

  const scrollToPageSection = useCallback((pNum, retry = true) => {
    let attempts = 0;
    const maxAttempts = retry ? 30 : 1;

    const tryScroll = () => {
      const targetEl = document.getElementById(`page-section-${pNum}`);
      if (targetEl) {
        isProgrammaticScrollRef.current = true;
        const headerOffset = 130;
        const currentScroll = getAppScrollTop();
        const elementPosition = targetEl.getBoundingClientRect().top + currentScroll;
        const offsetPosition = Math.max(0, Math.round(elementPosition - headerOffset));

        scrollAppTo(offsetPosition, "smooth");
        setActivePage(pNum);

        const url = new URL(window.location.href);
        if (pNum === 1) {
          url.searchParams.delete("page");
        } else {
          url.searchParams.set("page", pNum);
        }
        window.history.replaceState({}, "", url.toString());

        setTimeout(() => {
          const elCheck = document.getElementById(`page-section-${pNum}`);
          if (elCheck) {
            const topCheck = elCheck.getBoundingClientRect().top;
            if (Math.abs(topCheck - 130) > 60) {
              const newScroll = getAppScrollTop();
              const adjustedY = Math.max(0, Math.round(topCheck + newScroll - 130));
              scrollAppTo(adjustedY, "smooth");
            }
          }
        }, 500);

        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 1200);
        return true;
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 100);
        return false;
      }
      return false;
    };

    const foundImmediate = document.getElementById(`page-section-${pNum}`);
    if (foundImmediate) {
      return tryScroll();
    } else if (retry) {
      tryScroll();
      return false;
    }
    return false;
  }, []);

  const goToPage = useCallback(async (pNum, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (scrollToPageSection(pNum, false)) {
      return;
    }

    if (isNavigatingPageRef.current) return;
    isNavigatingPageRef.current = true;
    setLoadingMore(true);

    try {
      const minNeeded = (pNum - 1) * PAGE_SIZE + 1;
      let currentProducts = [...allProducts];
      let currentCursor = nextCursor;
      let currentHasMore = hasMore;

      while (currentProducts.length < minNeeded && currentHasMore && currentCursor) {
        const queryStr = buildQueryParams(currentCursor);
        const { data } = await axios.get(`${PRODUCT_ALL_API}?${queryStr}`, { withCredentials: true });
        const newProds = Array.isArray(data.products) ? data.products : [];
        const pg = data.pagination || {};

        if (newProds.length === 0) break;

        currentProducts = [...currentProducts, ...newProds];
        currentHasMore = pg.hasMore || false;
        currentCursor = pg.nextCursor || null;

        setAllProducts(currentProducts);
        setHasMore(currentHasMore);
        setNextCursor(currentCursor);
      }

      scrollToPageSection(pNum, true);
    } catch (err) {
      console.error("Failed to load products for page:", pNum, err);
      showToastMsg(`Failed to load page ${pNum}`, "error");
    } finally {
      setLoadingMore(false);
      isNavigatingPageRef.current = false;
    }
  }, [scrollToPageSection, allProducts, nextCursor, hasMore, buildQueryParams]);

  const fetchProducts = async (cursor = null, reset = false, clearProducts = false) => {
    try {
      const requestedPage = reset ? (parseInt(searchParams.get("page"), 10) || 1) : 1;
      const customLimit = (reset && requestedPage > 1) ? requestedPage * PAGE_SIZE : null;

      if (reset) {
        setLoading(true);
        if (clearProducts) {
          setAllProducts([]);
        }
        setNextCursor(null);
        setHasMore(true);
        setActivePage(requestedPage);
      } else {
        setLoadingMore(true);
      }

      const { data } = await axios.get(
        `${PRODUCT_ALL_API}?${buildQueryParams(cursor, customLimit)}`,
        { withCredentials: true },
      );

      if (brandSlug) {
        const normBrand = (brandSlug || "").toLowerCase().trim();
        let brandValid = false;
        if (data.brand && (
          (data.brand.slug || "").toLowerCase().trim() === normBrand ||
          (data.brand._id || "").toLowerCase().trim() === normBrand ||
          (data.brand.name || "").toLowerCase().trim().replace(/\s+/g, "-") === normBrand
        )) {
          brandValid = true;
        }
        if (!brandValid) {
          const brandsList = data.filters?.brands || data.brands || [];
          brandValid = brandsList.some(b => {
            if (!b) return false;
            const bSlug = (b.slug || b._id || b.name || "").toLowerCase().trim().replace(/\s+/g, "-");
            return bSlug === normBrand || b.slug === brandSlug || b._id === brandSlug;
          });
        }

        if (!brandValid && (data.filters?.brands || data.brands || data.brand !== undefined)) {
          setPageNotFound(true);
          setLoading(false);
          setLoadingMore(false);
          return;
        }
      }
      setPageNotFound(false);

      if (data.titleMessage) setPageTitle(data.titleMessage);
      else if (data.brand?.name) setPageTitle(data.brand.name);
      else if (data.category?.name) setPageTitle(data.category.name);

      if (clearProducts) {
        let banners = [];

        if (data.bannerImage) {
          if (Array.isArray(data.bannerImage)) {
            if (Array.isArray(data.bannerImage[0])) {
              banners = data.bannerImage[0];
            } else {
              banners = data.bannerImage;
            }
          } else if (typeof data.bannerImage === "string") {
            banners = [{ url: data.bannerImage }];
          } else if (data.bannerImage.url) {
            banners = [data.bannerImage];
          }
        } else if (data.brand?.banner) {
          banners = [{ url: data.brand.banner }];
        } else if (data.category?.bannerImage) {
          banners = Array.isArray(data.category.bannerImage)
            ? data.category.bannerImage
            : [{ url: data.category.bannerImage }];
        }

        setBannerImages(banners);

        if (data.trendingCategories && Array.isArray(data.trendingCategories)) {
          setTrendingCategories(data.trendingCategories);
        } else {
          setTrendingCategories([]);
        }

        if (reset && data.filters) {
          setFilterData(data.filters);
        }
      }

      const prods = Array.isArray(data.products) ? data.products : [];
      const pg = data.pagination || {};

      if (reset) setAllProducts(prods);
      else setAllProducts((prev) => [...prev, ...prods]);

      let detectedTotal = null;
      if (data.totalProducts != null && !isNaN(Number(data.totalProducts))) {
        detectedTotal = Number(data.totalProducts);
      } else if (pg.totalProducts != null && !isNaN(Number(pg.totalProducts))) {
        detectedTotal = Number(pg.totalProducts);
      } else if (data.titleMessage) {
        const match = data.titleMessage.match(/\d+/);
        if (match) {
          detectedTotal = parseInt(match[0], 10);
        }
      }

      if (detectedTotal !== null && detectedTotal >= 0) {
        setTotalCount(detectedTotal);
      } else {
        setTotalCount((prev) => (reset ? prods.length : prev + prods.length));
      }

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);

      if (reset && requestedPage > 1) {
        scrollToPageSection(requestedPage, true);
      }
    } catch (e) {
      console.error("Fetch products error:", e);
      showToastMsg("Failed to fetch products", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (brandSlug) {
      const isBrandChanged = lastBrandSlugRef.current !== brandSlug;
      lastBrandSlugRef.current = brandSlug;
      fetchProducts(null, true, isBrandChanged);
    }
  }, [brandSlug, filters]);

  /* ── category pill logic ────────────────────────────────────────────────── */
  const handleClearCategory = useCallback(() => {
    setFilters((prev) => ({ ...prev, categoryIds: [] }));
  }, []);

  // Force scroll to top when navigating to this page (unless requestedPage > 1)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (!pageParam || Number(pageParam) <= 1) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [brandSlug]);

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

    // Preserve crawlable page parameter
    const pageP = searchParams.get("page");
    if (pageP && Number(pageP) > 1) newParams.set("page", pageP);

    const newQuery = newParams.toString();
    if (newQuery !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [filters, setSearchParams, searchParams]);

  // Dynamic Page Section Detection on Scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = getAppScrollTop();

          if (currentScroll < 150) {
            setActivePage((prev) => {
              if (prev !== 1) {
                const url = new URL(window.location.href);
                url.searchParams.delete("page");
                window.history.replaceState({}, "", url.toString());
                return 1;
              }
              return prev;
            });
            ticking = false;
            return;
          }

          const sections = document.querySelectorAll("[data-page-section]");
          if (sections && sections.length > 0) {
            let current = 1;
            const triggerOffset = 260;
            sections.forEach((sec) => {
              const rect = sec.getBoundingClientRect();
              if (rect.top <= triggerOffset) {
                const p = parseInt(sec.getAttribute("data-page-section"), 10);
                if (p) current = p;
              }
            });

            setActivePage((prev) => {
              if (prev !== current) {
                const url = new URL(window.location.href);
                if (current === 1) {
                  url.searchParams.delete("page");
                } else {
                  url.searchParams.set("page", current);
                }
                window.history.replaceState({}, "", url.toString());
                return current;
              }
              return prev;
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    if (document.body) {
      document.body.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      document.removeEventListener("scroll", handleScroll, { capture: true });
      if (document.body) {
        document.body.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
      await syncCartFromBackend();
      openCart();
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
  const renderProductCard = (prod, index = 0) => {
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

    const pageNum = Math.floor(index / PAGE_SIZE) + 1;

    return (
      <div
        key={prod._id ? `brand-prod-${prod._id}` : `brand-prod-idx-${index}`}
        data-page-num={pageNum}
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
                            ₹{price}
                          </span>
                          {disc && !showOutOfStock && (
                            <>
                              <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                ₹{orig}
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
                <ProductCardCartButton
                  item={prod}
                  displayVariant={displayVariant}
                  showOutOfStock={showOutOfStock}
                  isCurrentVariantOutOfStock={isCurrentVariantOutOfStock}
                  showSelectVariantButton={showSelectVariantButton}
                  isAdding={isAdding}
                  handleAddToCart={handleAddToCart}
                  handleOutOfStockClick={handleOutOfStockClick}
                  openVariantOverlay={openVariantOverlay}
                />
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
    onCategoryPillClick: handleCategoryCheckboxToggle,
    isSubCategoryView: !!activeCategorySlug,
  };

  if (pageNotFound) {
    return <PageNotFound />;
  }

  /* ── render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <SEOMeta type="brand" slug={brandSlug} />
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
                    className="position-relative w-100 h-100 hero-slider-image-responsive mt-lg-0 mt-md-0"
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
          <h2 className="text-center" style={{ marginBottom: "30px", textAlign: "center" }}>Top Categories</h2>
          <div
            className="d-flex overflow-auto py-2 align-items-center cat-wrap"
            style={{
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
            }}
          >
            {trendingCategories.map((cat) => {
              const isActive = (filters.categoryIds || []).includes(cat._id) ||
                (filters.categoryIds || []).includes(cat.slug) ||
                ((filters.categoryIds || []).length === 0 && activeCategorySlug === cat.slug);

              return (
                <button
                  key={cat.slug}
                  onClick={() => handleTopCategoryClick(cat)}
                  className={`btn page-title-main-name flex-shrink-0 ${isActive ? "btn-dark custom-pill" : "custom-pill"}`}
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
        {/* <h2 className="mb-4 d-none d-lg-block page-title-main-name">
          {pageTitle}
        </h2> */}

        <div className="row">
          {/* Desktop Sidebar – exact same filter as ProductPage */}
          <div className="d-none d-lg-block col-lg-3">
            <BrandFilter {...brandFilterProps} />
          </div>

          {/* Mobile Filter + Sort */}
          <div className="d-lg-none mb-3">
            {/* <h2 className="mb-4 text-center">{pageTitle}</h2> */}
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
                      { value: "recent", label: "Newest First" },
                      { value: "priceLowToHigh", label: "Price: Low to High" },
                      { value: "priceHighToLow", label: "Price: High to Low" },
                      { value: "rating", label: "Top Rated" },
                      { value: "discountHighToLow", label: "Discount: High to Low" },
                      { value: "discountLowToHigh", label: "Discount: Low to High" }
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
            {/* Anchor for Page 1 */}
            <div id="page-section-1" data-page-section="1" style={{ position: "relative", top: "-10px", height: 0, width: "100%", padding: 0, margin: 0 }} />
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <span className="text-muted page-title-main-name">
                {(loading || !filterData) && totalCount === 0
                  ? "Loading products..."
                  : totalCount > 0
                  ? `Showing ${totalCount} products`
                  : "No products found"}
              </span>
              <div className="d-flex align-items-center gap-3">
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

            <div className="row g-4 position-relative responsive-product-grid">
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
              {sortedProducts.length > 0 ? (
                sortedProducts.map((prod, idx) => {
                  const pageNum = Math.floor(idx / PAGE_SIZE) + 1;
                  const isNewPageBoundary = idx > 0 && idx % PAGE_SIZE === 0;

                  return (
                    <React.Fragment key={prod._id ? `brand-prod-${prod._id}` : `brand-prod-idx-${idx}`}>
                      {isNewPageBoundary && (
                        <div
                          id={`page-section-${pageNum}`}
                          data-page-section={pageNum}
                          className="col-12 page-section-divider"
                        >
                          <div className="page-section-divider-inner">
                            <span className="page-section-divider-line"></span>
                            <span className="page-section-badge">Page {pageNum}</span>
                            <span className="page-section-divider-line"></span>
                          </div>
                        </div>
                      )}
                      {renderProductCard(prod, idx)}
                    </React.Fragment>
                  );
                })
              ) : (loading || loadingMore || !filterData) ? (
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

            <div ref={loaderRef} style={{ minHeight: "20px", margin: "15px 0" }}>
              {loadingMore && (
                <div className="col-12 text-center py-3">
                  <DotLottieReact
                    src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
                    loop
                    autoplay
                    style={{ width: "120px", height: "120px", margin: "0 auto" }}
                  />
                  <p className="text-muted" style={{ fontSize: "14px" }}>Loading more products...</p>
                </div>
              )}
            </div>

            {!hasMore && allProducts.length > 0 && (
              <div className="text-center mt-4 py-4 border-top">
                <p className="text-muted">
                  🎉 You've reached the end! No more products to show.
                </p>
              </div>
            )}

            {/* Crawlable Pagination links for search engines & smooth in-page navigation */}
            {totalPages > 1 && (
              <nav className="crawlable-pagination-bar" aria-label="Brand catalog pagination">
                {activePage > 1 && (
                  <a
                    href={activePage === 2 ? location.pathname : `${location.pathname}?page=${activePage - 1}`}
                    className="crawlable-page-nav-btn crawlable-page-prev"
                    aria-label="Previous Page"
                    onClick={(e) => goToPage(activePage - 1, e)}
                  >
                    &larr; Prev
                  </a>
                )}
                {getPaginationNumbers(activePage, totalPages).map((pItem, idx) => {
                  if (pItem === "...") {
                    return <span key={`ellipsis-${idx}`} className="crawlable-page-ellipsis">…</span>;
                  }
                  const pNum = Number(pItem);
                  const pageHref = pNum === 1 ? location.pathname : `${location.pathname}?page=${pNum}`;
                  const isActive = activePage === pNum;
                  return (
                    <a
                      key={pNum}
                      href={pageHref}
                      className={`crawlable-page-link ${isActive ? "active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(e) => goToPage(pNum, e)}
                    >
                      {pNum}
                    </a>
                  );
                })}
                {activePage < totalPages && (
                  <a
                    href={`${location.pathname}?page=${activePage + 1}`}
                    className="crawlable-page-nav-btn crawlable-page-next"
                    aria-label="Next Page"
                    onClick={(e) => goToPage(activePage + 1, e)}
                  >
                    Next &rarr;
                  </a>
                )}
              </nav>
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
                            style={{ backgroundColor: v.hex || "#ccc", position: "relative" }}
                          >
                            {isSelected && (
                              <FaCheck className="mobile-sheet-check-icon" />
                            )}
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
