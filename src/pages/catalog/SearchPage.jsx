import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaRegSadTear, FaChevronDown } from "react-icons/fa";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getCategoryTree } from "../../api/categoryApi";
import { getAllBrands } from "../../api/brandApi";
import { getAllProducts } from "../../api/productApi";
import { getErrorMessage } from "../../utils/errorHandler";
import { UserContext } from "../../context/UserContext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/SearchPage.css";
import "../../styles/BestSellers.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Loader from "../../components/common/Loader";
import BrandFilter from "../../components/common/BrandFilter";
import ProductCard from "../../components/common/ProductCard";
import useWishlist from "../../hooks/useWishlist";
import {
  getSku,
  isValidHexColor,
  getVariantDisplayText,
  groupVariantsByType,
  getBrandName,
  getCategoryName,
  getProductDisplayData,
  formatPrice,
} from "../../utils/productHelpers";

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
  const [error, setError] = useState(null);

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

  const [selectedVariants, setSelectedVariants] = useState({});

  // ── Wishlist (shared hook) ────────────────────────────────────────────────
  const { wishlistData, wishlistLoading, toggleWishlist } = useWishlist(user);

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
          const response = await getAllProducts(queryString);

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
        const response = await getAllProducts(queryString);

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
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategoryTree().catch(err => {
            console.error("Error fetching categories tree:", err);
            return { data: [] };
          }),
          getAllBrands().catch(err => {
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
      const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
      return displayVariant?.displayPrice || displayVariant?.discountedPrice || prod.price || 0;
    };
    const getProductDiscount = (prod) => {
      const vars = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      const displayVariant = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => v.stock > 0) || vars[0]) : null);
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
        return scoreB - scoreA;
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
  }, [allProducts, searchTerm, filters.sort, selectedVariants]);

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
    if (!prod) return null;
    const displayData = getProductDisplayData(prod, selectedVariants);
    if (!displayData) return null;
    return (
      <div key={prod._id} className="col-6 col-sm-4 col-lg-4 position-relative">
        <ProductCard
          item={displayData}
          wishlistData={wishlistData}
          wishlistLoading={wishlistLoading}
          toggleWishlist={toggleWishlist}
        />
      </div>
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="search-page-container">
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
              Finding the best matches for you...
            </p>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="search-hero-section">
        <div className="container">
          <div className="search-box-wrapper mx-auto">
            <div className="search-input-group position-relative">
              <FaSearch className="search-icon position-absolute" />
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search by product, brand, category, or benefit..."
                value={searchTerm}
                onChange={handleInputChange}
                autoFocus
              />
              {searchTerm && (
                <button
                  className="clear-search-btn position-absolute"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="search-meta-text mt-2 text-center text-muted small">
                Showing results for: <span className="fw-bold text-dark">"{searchTerm}"</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container my-4">
        <div className="row">
          {/* Mobile Filter & Sort Buttons */}
          <div className="col-12 d-lg-none mb-3">
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 py-2 page-title-main-name filter-button-mobile"
                onClick={() => setShowFilterOffcanvas(true)}
              >
                <img src={filtering} alt="Filter" style={{ width: '16px', height: '16px' }} />
                <span>Filters</span>
                {isAnyFilterActive && (
                  <span className="badge bg-danger rounded-pill ms-1">Active</span>
                )}
              </button>
              <button
                className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 py-2 page-title-main-name filter-button-mobile"
                onClick={() => setShowSortOffcanvas(true)}
              >
                <img src={updownarrow} alt="Sort" style={{ width: '16px', height: '16px' }} />
                <span>
                  {
                    filters.sort === 'priceHighToLow' ? 'Price: High to Low' :
                      filters.sort === 'priceLowToHigh' ? 'Price: Low to High' :
                        filters.sort === 'rating' ? 'Top Rated' :
                          filters.sort === 'discountHighToLow' ? 'Discount: High to Low' :
                            filters.sort === 'discountLowToHigh' ? 'Discount: Low to High' :
                              'Newest First'
                  }
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="filter-sidebar p-3 border rounded">
              <BrandFilter {...brandFilterProps} />
            </div>
          </div>

          {/* Mobile Filter Offcanvas */}
          {showFilterOffcanvas && (
            <>
              <div
                className="modal-backdrop fade show"
                style={{ opacity: 0.5, zIndex: 1040 }}
                onClick={() => setShowFilterOffcanvas(false)}
              />
              <div
                className="offcanvas offcanvas-start show"
                tabIndex="-1"
                style={{
                  zIndex: 1050,
                  visibility: "visible",
                  width: "85%",
                  maxWidth: 360,
                }}
              >
                <div className="offcanvas-header border-bottom">
                  <h5 className="offcanvas-title fw-bold page-title-main-name">Filters</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFilterOffcanvas(false)}
                  />
                </div>
                <div className="offcanvas-body">
                  <BrandFilter
                    {...brandFilterProps}
                    onClose={() => setShowFilterOffcanvas(false)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Mobile Sort Bottom Drawer */}
          {showSortOffcanvas && (
            <>
              <div
                className="modal-backdrop fade show"
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
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="text-muted page-title-main-name mt-lg-3">
                {totalCount > 0 ? `Showing ${totalCount} products` : "No products found"}
              </span>
              <div className="d-flex align-items-center gap-3">
                {/* Desktop Sort Dropdown */}
                <div className="d-none d-lg-flex align-items-center position-relative mt-lg-3" style={{ gap: '6px' }}>
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

            <div className="row g-4 position-relative">
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
                <>
                  <div className="row g-4">
                    {filteredProducts.map(renderProductCard)}
                  </div>

                  {/* Infinite Scroll Loader */}
                  {isFetchingMore && (
                    <Loader text="Loading more products..." height={100} />
                  )}

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

      <Footer />
    </div>
  );
};

export default SearchPage;
