// src/components/HeaderSearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaMicrophone, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import search from "../../assets/search.svg";


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

const HeaderSearchBar = ({ isMobile, isTablet, showMobileSearch, setShowMobileSearch }) => {
  const navigate = useNavigate();

  // Search States
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState(["Lipstick", "Foundation", "Mascara", "Skincare"]);
  const [listening, setListening] = useState(false);
  const [categories, setCategories] = useState([]);

  // Refs
  const searchTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchInputRef = useRef(null);
  const headerSearchRef = useRef(null);
  const hasFetchedProducts = useRef(false);

  /* -------------------------------------------------------------------------- */
  /* 1. INITIAL SETUP */
  /* -------------------------------------------------------------------------- */
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerSearchRef.current &&
        !headerSearchRef.current.contains(event.target) &&
        showSearchResults
      ) {
        setShowSearchResults(false);
        searchInputRef.current?.blur();
      }
    };

    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  /* -------------------------------------------------------------------------- */
  /* 2. DATA FETCHING */
  /* -------------------------------------------------------------------------- */
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
          name: p.name || "Unnamed Product",
          slug: p.slugs?.[0] || p.slug || p._id,
          brand: getBrandName(p),
          category: getCategoryName(p),
          originalCategory: p.category,
          price: p.selectedVariant?.displayPrice || p.price || 0,
          originalPrice: p.selectedVariant?.originalPrice || p.originalPrice || p.mrp || 0,
          image: p.selectedVariant?.images?.[0] || p.images?.[0] || "/placeholder.png",
          discountPercent: p.selectedVariant?.discountPercent || 0,
          variants: p.variants || []
        }));

        setAllProducts(processed);

        const index = processed.map(p => ({
          product: p,
          searchString: getSearchableString(p)
        }));
        setSearchIndex(index);

        // Popular searches (top brands)
        const brands = [...new Set(processed.map(p => p.brand).filter(Boolean))].slice(0, 5);
        setPopularSearches(brands);

        hasFetchedProducts.current = true;
      } catch (err) {
        console.error("Error fetching products for search:", err);
      } finally {
        setIsSearchLoading(false);
      }
    };

    fetchData();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 3. SEARCH LOGIC */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);
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
  }, [debouncedSearchText, searchIndex, categories]);

  /* -------------------------------------------------------------------------- */
  /* 4. HANDLERS */
  /* -------------------------------------------------------------------------- */
  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;
    const updated = [
      query.trim(),
      ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchText("");
    setDebouncedSearchText("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchText.trim()) return;
    saveToRecentSearches(searchText);
    setShowSearchResults(false);
    if (isMobile || isTablet) setShowMobileSearch(false);
    navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
  };

  const handleResultClick = (product) => {
    saveToRecentSearches(product.name);
    setSearchText("");
    setShowSearchResults(false);
    if (isMobile || isTablet) setShowMobileSearch(false);
    navigate(`/product/${product.slug}`);
  };

  const handleRecentSearchClick = (term) => {
    setSearchText(term);
    saveToRecentSearches(term);
    handleSearchSubmit();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const getDiscount = (p) => {
    if (p.originalPrice > p.price) {
      return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    }
    return 0;
  };

  /* -------------------------------------------------------------------------- */
  /* 5. VOICE SEARCH */
  /* -------------------------------------------------------------------------- */
  const startListening = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert("Voice search not supported in this browser");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      saveToRecentSearches(transcript);
      setListening(false);
      setTimeout(() => handleSearchSubmit(), 500);
    };
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => setListening(false);

    recognitionRef.current.start();
  };

  /* -------------------------------------------------------------------------- */
  /* 6. RENDER */
  /* -------------------------------------------------------------------------- */
  // Mobile / Tablet Version (Full Overlay - Exact from your detailed top code)
  if (isMobile || isTablet) {
    if (showMobileSearch) {
      return (
        <div className="mobile-search-overlay">
          <div className="mobile-search-header">
            <FaArrowLeft className="mobile-search-back" onClick={() => setShowMobileSearch(false)} />
            <form onSubmit={handleSearchSubmit} className="mobile-search-input-container">
              <FaSearch className="mobile-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchText}
                onChange={handleInputChange}
                autoFocus
                className="w-100 border-0 bg-transparent page-title-main-name"
              />
              {searchText && <FaTimes className="mobile-search-clear" onClick={clearSearch} />}
              <FaMicrophone className={`mobile-search-voice ${listening ? "listening" : ""}`} onClick={startListening} />
            </form>
            {/* <button className="mobile-search-go page-title-main-name" onClick={handleSearchSubmit} disabled={!searchText.trim()}>
              Go
            </button> */}
          </div>

          <div className="mobile-search-results page-title-main-name">
            {!searchText.trim() ? (
              <div className="mobile-search-suggestions">
                {recentSearches.length > 0 && (
                  <div className="mobile-search-section">
                    <div className="mobile-search-section-header">
                      <span>Recent Searches</span>
                      <button onClick={clearRecentSearches} className="mobile-search-clear-btn page-title-main-name">Clear</button>
                    </div>
                    <div className="mobile-search-tags">
                      {recentSearches.map((search, i) => (
                        <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag">
                          {search}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {popularSearches.length > 0 && (
                  <div className="mobile-search-section">
                    <div className="mobile-search-section-header">
                      <span>Popular Searches</span>
                    </div>
                    <div className="mobile-search-tags">
                      {popularSearches.map((search, i) => (
                        <div key={i} onClick={() => handleRecentSearchClick(search)} className="mobile-search-tag popular">
                          {search}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="mobile-search-products">
                {searchResults.map((item) => {
                  const discount = getDiscount(item);
                  return (
                    <div key={item._id} onClick={() => handleResultClick(item)} className="mobile-search-product">
                      <div className="mobile-search-product-image">
                        <img src={item.image} alt={item.name} loading="lazy" />
                        {discount > 0 && <div className="mobile-search-product-discount">-{discount}%</div>}
                      </div>
                      <div className="mobile-search-product-info">
                        <div className="mobile-search-product-brand">{item.brand}</div>
                        <div className="mobile-search-product-name">{item.name}</div>
                        <div className="mobile-search-product-price-row">
                          <span className="mobile-search-product-price">₹{item.price}</span>
                          {discount > 0 && <span className="mobile-search-product-original">₹{item.originalPrice}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mobile-search-view-all" onClick={handleSearchSubmit}>
                  View all results for "{searchText}" →
                </div>
              </div>
            ) : (
              <div className="mobile-search-empty">
                <div>No products found for "{searchText}"</div>
                <small>Try different keywords</small>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Mobile search trigger icon
      return (
        <div className="mobile-search-icon-wrapper" onClick={() => setShowMobileSearch(true)}>
          <img src={search} alt="Search" />
        </div>
      );
    }
  }

  // Desktop Version (Full dropdown matching your detailed code)
  return (
    <div className="search-box d-flex page-title-main-name" ref={headerSearchRef} style={{ position: "relative", zIndex: 999 }}>
      <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", alignItems: "center" }}>
        <FaSearch className="icon" style={{ cursor: "pointer" }} onClick={handleSearchSubmit} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search products, brands, categories..."
          value={searchText}
          onChange={handleInputChange}
          onFocus={() => setShowSearchResults(true)}
          onClick={() => setShowSearchResults(true)}
          style={{ border: "none", outline: "none", background: "transparent", flex: 1, margin: "0 10px" }}
        />
        {searchText && <FaTimes style={{ cursor: "pointer", marginRight: "10px" }} onClick={clearSearch} />}
        <FaMicrophone className={`icon ${listening ? "listening" : ""}`} onClick={startListening} />
      </form>

      {showSearchResults && (
        <div className="search-results-dropdown" style={{
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
          zIndex: 1000
        }}>
          {!searchText.trim() ? (
            <div style={{ padding: "15px" }}>
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span>Recent Searches</span>
                    <button onClick={clearRecentSearches} style={{ background: "none", border: "none", color: "#0077b6", cursor: "pointer", fontSize: "11px" }}>Clear</button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {recentSearches.map((s, i) => (
                      <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#f0f0f0", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "8px" }}>Popular</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {popularSearches.map((s, i) => (
                  <span key={i} onClick={() => handleRecentSearchClick(s)} style={{ padding: "4px 12px", background: "#000", color: "#fff", borderRadius: "15px", fontSize: "12px", cursor: "pointer" }}>
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
                  <div key={item._id} onClick={() => handleResultClick(item)} style={{
                    display: "flex",
                    padding: "10px",
                    borderBottom: "1px solid #f5f5f5",
                    cursor: "pointer"
                  }}>
                    <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
                      <div style={{ fontSize: "11px", color: "#666" }}>{item.brand}</div>
                      <div style={{ fontSize: "13px", color: "#0077b6", fontWeight: "600" }}>
                        ₹{item.price}
                        {discount > 0 && <span style={{ textDecoration: "line-through", color: "#999", marginLeft: "8px", fontSize: "11px" }}>₹{item.originalPrice}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div onClick={handleSearchSubmit} style={{ padding: "12px", textAlign: "center", background: "#f8f9fa", cursor: "pointer", color: "#0077b6", fontWeight: "600", fontSize: "13px" }}>
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
  );
};

export default HeaderSearchBar;