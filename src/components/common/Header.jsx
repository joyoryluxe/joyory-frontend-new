import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/Header.css";
import "../../App.css";
import logo from "../../assets/logo.png";
import Cart from "../../assets/Cart.svg";
import favourite from "../../assets/favourite.svg";
import users from "../../assets/user.svg";
import mic from "../../assets/mic.svg";
import search from "../../assets/search.svg";
import axiosInstance from "../../utils/axiosInstance.js";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import HeaderCategories from "./HeaderCategories";
import MobileHeader from "./MobileHeaderView";

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

  return [
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
};

const Header = ({ hideCategories = false }) => {
  const navigate = useNavigate();
  const _location = useLocation();
  const { user, logoutUser } = useContext(UserContext);

  // ---------- responsive ----------
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [menuOpen, setMenuOpen] = useState(false);


  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ---------- search bar animation state ----------
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // ---------- cart & wishlist ----------
  const { cartCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);

  // ---------- search ----------
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [_allProducts, setAllProducts] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [_isSearchLoading, setIsSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState(["Makeup", "Skin", "Eyes", "Minimalist", "Mars", "DOT & KEY"]);
  const [categories, setCategories] = useState([]);
  const [listening, setListening] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const searchTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchInputRef = useRef(null);
  const headerSearchRef = useRef(null);
  const hasFetchedProducts = useRef(false);
  const mobileSearchInputRef = useRef(null);



  const confirmLogout = () => {
    logoutUser();
    setShowLogoutModal(false);
    navigate("/login");
  };


  // ---------- responsive resize ----------
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // setIsMobile(width <= 800);
      setIsMobile(width <= 991);
      if (width > 800) {
        setMenuOpen(false);
        setShowMobileSearch(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus mobile search input when shown
  useEffect(() => {
    if (showMobileSearch && mobileSearchInputRef.current) {
      setTimeout(() => mobileSearchInputRef.current.focus(), 300);
    }
  }, [showMobileSearch]);

  // ---------- CLICK OUTSIDE HANDLER FOR SEARCH DROPDOWN ----------
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search results if clicking outside the search area
      if (
        headerSearchRef.current &&
        !headerSearchRef.current.contains(event.target) &&
        showSearchResults
      ) {
        setShowSearchResults(false);
        searchInputRef.current?.blur();
      }
    };

    // Add event listener when search results are shown
    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  // ---------- load recent searches ----------
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // ---------- fetch products & categories ----------
  useEffect(() => {
    if (hasFetchedProducts.current) return;

    const fetchData = async () => {
      try {
        setIsSearchLoading(true);
        const catRes = await axiosInstance.get("/api/user/categories/tree");
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);

        let allFetchedProducts = [];
        let currentCursor = null;
        let hasMore = true;

        while (hasMore) {
          const res = await axiosInstance.get("/api/user/products/all", {
            params: { cursor: currentCursor, limit: 500 },
            withCredentials: true
          });

          let products = [];
          let pagination = {};

          if (res.data && Array.isArray(res.data.products)) {
            products = res.data.products;
            pagination = res.data.pagination || {};
          } else if (Array.isArray(res.data)) {
            products = res.data;
          }

          if (products.length > 0) {
            allFetchedProducts.push(...products);
          }

          if (pagination.hasMore === false || products.length === 0) {
            hasMore = false;
          } else if (pagination.nextCursor) {
            currentCursor = pagination.nextCursor;
          } else {
            hasMore = false;
          }
        }

        // Deduplicate products by _id to avoid any duplicate listings
        const productMap = new Map();
        allFetchedProducts.forEach(p => {
          const id = p._id || p.id;
          if (id) productMap.set(id, p);
        });
        const products = Array.from(productMap.values());

        const processed = products.map(p => ({
          _id: p._id || p.id,
          name: p.name || p.title || "Unnamed Product",
          slug: p.slugs?.[0] || p.slug || p._id,
          brand: getBrandName(p),
          category: getCategoryName(p),
          originalCategory: p.category,
          price: p.selectedVariant?.displayPrice || p.price || 0,
          originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || 0,
          discountPercent: p.selectedVariant?.discountPercent || 0,
          image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
          inStock: p.inStock !== false && p.status !== "outOfStock",
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          description: p.description || "",
          variants: p.variants || []
        }));

        setAllProducts(processed);
        const index = processed.map(p => ({
          product: p,
          searchString: getSearchableString(p)
        }));
        setSearchIndex(index);
        hasFetchedProducts.current = true;
        extractPopularSearches(processed);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsSearchLoading(false);
      }
    };
    fetchData();
  }, []);



  // ---------- search logic ----------
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedSearchText(searchText), 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchText]);

  useEffect(() => {
    if (!debouncedSearchText.trim()) {
      setSearchResults([]);
      return;
    }
    const term = debouncedSearchText.toLowerCase().trim();

    // Check if the search term exactly matches any category in the tree hierarchically
    const specs = getCategoryAndDescendantSpecs(categories, term);

    let results;
    if (specs.ids.size > 0) {
      results = searchIndex
        .filter(({ product }) => matchesCategory(product, specs))
        .map(({ product }) => product);
    } else {
      const words = term.split(/\s+/);
      results = searchIndex
        .filter(({ searchString }) => words.every(word => searchString.includes(word)))
        .map(({ product }) => product);
    }

    setSearchResults(results.slice(0, 10));
    setShowSearchResults(true);
  }, [debouncedSearchText, searchIndex, categories]);

  const extractPopularSearches = (products) => {
    const catCounts = {}, brandCounts = {};
    products.forEach(p => {
      if (p.category) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
      if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    setPopularSearches([...topCats, ...topBrands]);
  };

  // ---------- shared search handlers ----------
  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;
    const updated = [query.trim(), ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchText.trim()) return;
    saveToRecentSearches(searchText);
    setShowSearchResults(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
    navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
  };

  const handleResultClick = (product) => {
    saveToRecentSearches(product.name);
    setSearchText("");
    setShowSearchResults(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
    navigate(`/product/${product.slug}`);
  };

  const handleRecentSearchClick = (term) => {
    setSearchText(term);
    saveToRecentSearches(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setShowSearchResults(false);
    setMenuOpen(false);
    setShowMobileSearch(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const clearSearch = () => {
    setSearchText("");
    setDebouncedSearchText("");
    searchInputRef.current?.focus();
    mobileSearchInputRef.current?.focus();
  };

  // ---------- voice search ----------
  const startListening = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      alert("Voice search not supported in this browser");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearchText(transcript);
      saveToRecentSearches(transcript);
      setListening(false);
      setTimeout(() => handleSearchSubmit(), 500);
    };
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.start();
  };

  // ---------- close mobile drawer ----------
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setShowSearchResults(false);
  }, []);

  const getDiscount = (p) => p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  // ---------- RENDER ----------
  // Mobile view (≤800px) – use MobileHeader component with animated search
  if (isMobile) {
    return (
      <>
        {/* Animated Mobile Search Bar Overlay */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "white",
            zIndex: 9999,
            transform: showMobileSearch ? "translateY(0)" : "translateY(-100%)",
            opacity: showMobileSearch ? 1 : 0,
            transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
            boxShadow: showMobileSearch ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                background: "#f5f5f5",
                borderRadius: "25px",
                padding: "0 16px",
                height: "44px",
              }}
            >
              <img
                src={search}
                alt="search"
                style={{ width: "18px", height: "18px", marginRight: "10px", opacity: 0.6 }}
              />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search products, brands..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flex: 1,
                  fontSize: "15px",
                  color: "#333",
                }}
              />
              {searchText && (
                <FaTimes
                  style={{
                    cursor: "pointer",
                    color: "#777",
                    fontSize: "16px",
                    marginRight: "10px",
                  }}
                  onClick={clearSearch}
                />
              )}
              <img
                src={mic}
                className={`icon ${listening ? "listening" : ""}`}
                onClick={startListening}
                alt="mic"
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </form>
            <button
              onClick={() => {
                setShowMobileSearch(false);
                setShowSearchResults(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#0077b6",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Cancel
            </button>
          </div>

          {/* Mobile Search Results Dropdown */}
          {showSearchResults && showMobileSearch && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                maxHeight: "calc(100vh - 70px)",
                overflowY: "auto",
                borderBottom: "1px solid #eee",
              }}
            >
              {!searchText.trim() ? (
                <div style={{ padding: "16px" }}>
                  {recentSearches.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#666",
                          marginBottom: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Recent Searches</span>
                        <button
                          onClick={clearRecentSearches}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0077b6",
                            cursor: "pointer",
                            fontSize: "11px",
                          }}
                        >
                          Clear
                        </button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {recentSearches.map((s, i) => (
                          <span
                            key={i}
                            onClick={() => handleRecentSearchClick(s)}
                            style={{
                              padding: "6px 12px",
                              background: "#f0f0f0",
                              borderRadius: "16px",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#666",
                      marginBottom: "10px",
                    }}
                  >
                    Popular
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {popularSearches.map((s, i) => (
                      <span
                        key={i}
                        onClick={() => handleRecentSearchClick(s)}
                        style={{
                          padding: "6px 12px",
                          background: "#000",
                          color: "#fff",
                          borderRadius: "16px",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((item) => {
                    const discount = getDiscount(item);
                    return (
                      <div
                        key={item._id}
                        onClick={() => handleResultClick(item)}
                        style={{
                          display: "flex",
                          padding: "12px 16px",
                          borderBottom: "1px solid #f5f5f5",
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            marginRight: "12px",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600", fontSize: "14px" }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {item.brand}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#0077b6",
                              fontWeight: "600",
                              marginTop: "2px",
                            }}
                          >
                            ₹{item.price}
                            {discount > 0 && (
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "#999",
                                  marginLeft: "8px",
                                  fontSize: "12px",
                                }}
                              >
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    onClick={handleSearchSubmit}
                    style={{
                      padding: "14px",
                      textAlign: "center",
                      background: "#f8f9fa",
                      cursor: "pointer",
                      color: "#0077b6",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    View all results →
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  No results for "{searchText}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Backdrop when search is open */}
        {showMobileSearch && (
          <div
            onClick={() => {
              setShowMobileSearch(false);
              setShowSearchResults(false);
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9998,
              opacity: showMobileSearch ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        <MobileHeader
          isMobile={isMobile}
          isTablet={false}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          closeMenu={closeMenu}
          user={user}
          logoutUser={logoutUser}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          categories={categories}
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearchSubmit={handleSearchSubmit}
          startListening={startListening}
          listening={listening}
          searchResults={searchResults}
          recentSearches={recentSearches}
          popularSearches={popularSearches}
          handleResultClick={handleResultClick}
          handleRecentSearchClick={handleRecentSearchClick}
          clearRecentSearches={clearRecentSearches}
          clearSearch={clearSearch}
          searchInputRef={searchInputRef}
          onSearchClick={() => setShowMobileSearch(true)}
        />
      </>
    );
  }

  // ---------- DESKTOP VIEW (>800px) ----------
  return (
    <>
      <header className="header d-block header-container ">
        <div className="d-flex justify-content-between margin-padding-header align-items-center">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src={logo} className="ps-sm-0 ps-4 ms-sm-0" alt="JOYORY Logo" />
          </Link>

          {/* Desktop Search with Click-Outside Close */}
          <div
            className="search-box-expandable d-flex align-items-center page-title-main-name ms-auto me-3"
            ref={headerSearchRef}
          >
            <form onSubmit={handleSearchSubmit} className="d-flex align-items-center w-100" style={{ margin: 0, padding: "0 10px" }}>
              <img src={search} alt="search" onClick={handleSearchSubmit} style={{ cursor: "pointer", width: 20, height: 20 }} />
              <input className="placeholder-colorchnage"
                ref={searchInputRef}
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onClick={() => setShowSearchResults(true)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  margin: "0 8px",
                  fontSize: "16px",
                }}
              />
              {searchText && (
                <FaTimes
                  style={{ cursor: "pointer", marginRight: "8px", width: 16, height: 16 }}
                  onClick={clearSearch}
                />
              )}
              <img
                src={mic}
                className={`icon ${listening ? "listening" : ""}`}
                onClick={startListening}
                alt="mic"
                style={{ cursor: "pointer", width: 20, height: 20 }}
              />
            </form>

            {/* Search results dropdown – full content restored */}
            {showSearchResults && (
              <div
                className="search-results-dropdown"
                style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  maxHeight: "500px",
                  overflowY: "auto",
                  zIndex: 1000,
                }}
              >
                {!searchText.trim() ? (
                  <div style={{ padding: "15px" }}>
                    {recentSearches.length > 0 && (
                      <div style={{ marginBottom: "15px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#666",
                            marginBottom: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>Recent Searches</span>
                          <button
                            onClick={clearRecentSearches}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#0077b6",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            Clear
                          </button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {recentSearches.map((s, i) => (
                            <span
                              key={i}
                              onClick={() => handleRecentSearchClick(s)}
                              style={{
                                padding: "4px 12px",
                                background: "#f0f0f0",
                                borderRadius: "15px",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>
                      Popular
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {popularSearches.map((s, i) => (
                        <span
                          key={i}
                          onClick={() => handleRecentSearchClick(s)}

                          onMouseEnter={(e) => {
                            e.target.style.background = "#000";
                            e.target.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#fff";
                            e.target.style.color = "#000";
                          }}

                          style={{
                            padding: "4px 12px",
                            background: "#fff",
                            color: "#000",
                            borderRadius: "15px",
                            fontSize: "12px",
                            cursor: "pointer",
                            border: "1px solid #000",

                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((item) => {
                      const discount = getDiscount(item);
                      return (
                        <div
                          key={item._id}
                          onClick={() => handleResultClick(item)}
                          style={{
                            display: "flex",
                            padding: "10px",
                            borderBottom: "1px solid #f5f5f5",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              marginRight: "10px",
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
                            <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
                            <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
                              ₹{item.price}
                              {discount > 0 && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginLeft: "8px",
                                    fontSize: "11px",
                                  }}
                                >
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div
                      onClick={handleSearchSubmit}
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        background: "#f8f9fa",
                        cursor: "pointer",
                        color: "#0077b6",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      View all {searchResults.length} results →
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                    No results for "{searchText}"
                  </div>
                )}
              </div>
            )}
          </div>




          {/* Desktop Icons */}
          <div className="nav-icons user-dropdown gap-3 d-none d-lg-flex page-title-main-name" style={{ alignItems: "center" }}>
            <Link to="/cartpage" style={{ position: "relative" }}>
              <img src={Cart} alt="cart" />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#000",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" style={{ position: "relative" }}>
              <img src={favourite} alt="wishlist" />
              {wishlistCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#c34242",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => {
                if (user && !user.guest) {
                  setUserDropdown(!userDropdown);
                } else {
                  navigate("/login");
                }
              }}
            >
              <img src={users} className="icon" alt="user" />
              {userDropdown && (
                <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "180px", marginTop: "20px" }}>
                  {user && !user.guest ? (
                    <>
                      <div onClick={() => { navigate("/useraccount"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Account</div>
                      <div onClick={() => { navigate("/Myorders"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>My Orders</div>
                      <div
                        onClick={() => {
                          setUserDropdown(false);
                          setShowLogoutModal(true);
                        }}
                        style={{ padding: "10px 15px", cursor: "pointer" }}
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <div onClick={() => { navigate("/login"); setUserDropdown(false); }} style={{ padding: "10px 15px", borderBottom: "1px solid #eee", cursor: "pointer" }}>Login</div>
                      <div onClick={() => { navigate("/Signup"); setUserDropdown(false); }} style={{ padding: "10px 15px", cursor: "pointer" }}>Register</div>
                    </>
                  )}
                </div>
              )}


              {showLogoutModal && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      padding: "25px",
                      borderRadius: "10px",
                      width: "320px",
                      textAlign: "center",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    }}
                  >
                    <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
                      Confirm Logout
                    </h3>

                    <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                      Are you sure you want to logout?
                    </p>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                          background: "#f5f5f5",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={confirmLogout}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#e63946",
                          color: "#fff",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Categories */}
        {!hideCategories && <HeaderCategories />}
      </header>
    </>
  );
};

export default Header;

//==============================================================Done-Code(End)=====================================================================================









