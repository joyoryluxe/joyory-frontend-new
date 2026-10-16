// src/component/IngredientCompatibility.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import {
  checkCompatibility,
  listIngredients,
  listAllProducts,
  scanIngredientText,
  getIngredientByName
} from "../api/ingredientApi";
import IngredientDetailsDrawer from "./IngredientDetailsDrawer";
import {
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUndo,
  FaSearch,
  FaFlask,
  FaBox,
  FaBarcode
} from "react-icons/fa";
import "../styles/IngredientCompatibility.css";


// ─── Layering Carousel & Compatibility Cache ──────────────────────────────────
const CAROUSEL_CACHE_KEY = "joyory_layering_carousel_skin_v2";
const CAROUSEL_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const COMPAT_CACHE_KEY = "joyory_product_compat_cache_v1";

const readCarouselCache = () => {
  try {
    const raw = sessionStorage.getItem(CAROUSEL_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
};

const writeCarouselCache = (data) => {
  try {
    sessionStorage.setItem(CAROUSEL_CACHE_KEY, JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  } catch (_) {
    try {
      sessionStorage.removeItem(CAROUSEL_CACHE_KEY);
      sessionStorage.setItem(CAROUSEL_CACHE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
    } catch (_) {}
  }
};

const readCompatCache = (key) => {
  try {
    const raw = sessionStorage.getItem(COMPAT_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[key] || null;
  } catch (_) {
    return null;
  }
};

const writeCompatCache = (key, data) => {
  try {
    let map = {};
    const raw = sessionStorage.getItem(COMPAT_CACHE_KEY);
    if (raw) map = JSON.parse(raw);
    map[key] = data;
    sessionStorage.setItem(COMPAT_CACHE_KEY, JSON.stringify(map));
  } catch (_) {}
};

const PRESETS = [
  { label: "Retinol + Vitamin C", ingredients: ["Retinol", "Vitamin C"] },
  { label: "Niacinamide + Vitamin C", ingredients: ["Niacinamide", "Vitamin C"] },
  { label: "Salicylic Acid + Retinol", ingredients: ["Salicylic Acid", "Retinol"] },
  { label: "Hyaluronic Acid + Retinol", ingredients: ["Hyaluronic Acid", "Retinol"] }
];

export default function IngredientCompatibility() {
  const [activeTab, setActiveTab] = useState("ingredients"); // "ingredients", "products", "ocr"

  // --- TAB 1: INGREDIENTS STATE ---
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbIngredients, setDbIngredients] = useState([]);

  // --- TAB 2: PRODUCTS STATE ---
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  
  const [carouselCursor, setCarouselCursor] = useState(null);
  const [carouselHasMore, setCarouselHasMore] = useState(false);
  const [carouselLoadingMore, setCarouselLoadingMore] = useState(false);
  const [productASearch, setProductASearch] = useState("");
  const [productBSearch, setProductBSearch] = useState("");
  const [productASuggestions, setProductASuggestions] = useState([]);
  const [productBSuggestions, setProductBSuggestions] = useState([]);
  const [selectedProductA, setSelectedProductA] = useState(null);
  const [selectedProductB, setSelectedProductB] = useState(null);
  const [productResult, setProductResult] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productASearchLoading, setProductASearchLoading] = useState(false);
  const [productBSearchLoading, setProductBSearchLoading] = useState(false);

  // --- SMART AUTO-SLOT ASSIGNMENT & CONFLICT HANDLING ---
  const [slotNotification, setSlotNotification] = useState(null);
  const [slotConflictProduct, setSlotConflictProduct] = useState(null);

  const showSlotNotification = (message, type = "info") => {
    setSlotNotification({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (slotNotification) {
      const timer = setTimeout(() => {
        setSlotNotification(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [slotNotification]);

  // --- TAB 3: OCR RAW TEXT STATE ---
  const [ocrText, setOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrError, setOcrError] = useState(null);

  // --- GENERAL DRAWER STATE ---
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch standard ingredients on mount (for Tab 1 autocomplete bank)
  useEffect(() => {
    const fetchIngs = async () => {
      try {
        const res = await listIngredients({ limit: 100 });
        if (res.data.success) {
          setDbIngredients(res.data.ingredients || []);
        }
      } catch (err) {
        console.error("Error loading ingredient suggestion bank:", err);
      }
    };
    fetchIngs();
  }, []);

  // Fetch popular skincare products when Tab 2 is active (Threshold: 12, Category: skin, sorted by rating)
  const fetchCarouselProducts = async (cursor = null) => {
    if (cursor) {
      setCarouselLoadingMore(true);
    } else {
      setProductsLoading(true);
    }
    try {
      const params = {
        categoryIds: "skin",
        sort: "recent",
        limit: 12
      };
      if (cursor) params.cursor = cursor;

      const res = await listAllProducts(params);
      let products = [];
      let pagination = {};
      if (res.data && Array.isArray(res.data.products)) {
        products = res.data.products;
        pagination = res.data.pagination || {};
      } else if (Array.isArray(res.data)) {
        products = res.data;
      }

      // Filter products that have active ingredient lists
      const skincareWithIngredients = products.filter(p => Array.isArray(p.ingredients) && p.ingredients.length > 0);
      const itemsToUse = skincareWithIngredients.length > 0 ? skincareWithIngredients : products;
      const nextCursor = pagination.nextCursor || null;
      const nextHasMore = pagination.hasMore || false;

      if (cursor) {
        setCatalogProducts(prev => {
          const map = new Map();
          prev.forEach(p => map.set(p._id || p.id, p));
          itemsToUse.forEach(p => map.set(p._id || p.id, p));
          const updated = Array.from(map.values());
          writeCarouselCache({
            products: updated,
            cursor: nextCursor,
            hasMore: nextHasMore
          });
          return updated;
        });
      } else {
        setCatalogProducts(itemsToUse);
        writeCarouselCache({
          products: itemsToUse,
          cursor: nextCursor,
          hasMore: nextHasMore
        });
      }

      setCarouselCursor(nextCursor);
      setCarouselHasMore(nextHasMore);
    } catch (err) {
      console.error("Error loading skincare products for carousel:", err);
    } finally {
      setProductsLoading(false);
      setCarouselLoadingMore(false);
    }
  };

  // Progressive loading and caching for Tab 2 carousel
  useEffect(() => {
    if (activeTab === "products" && catalogProducts.length === 0) {
      const cached = readCarouselCache();
      if (cached && Array.isArray(cached.products) && cached.products.length > 0) {
        setCatalogProducts(cached.products);
        setCarouselCursor(cached.cursor || null);
        setCarouselHasMore(cached.hasMore || false);

        // Stale-while-revalidate: if older than 10 mins, refresh in background
        const age = Date.now() - (cached.timestamp || 0);
        if (age >= CAROUSEL_CACHE_TTL) {
          fetchCarouselProducts(null);
        }
      } else {
        fetchCarouselProducts(null);
      }
    }
  }, [activeTab, catalogProducts.length]);

  // Handle tap / click on popular product card to automatically assign to available slot
  const handleProductCardClick = (product) => {
    // 1. If product is already in Slot A -> toggle off / remove
    if (selectedProductA?._id === product._id) {
      setSelectedProductA(null);
      setProductResult(null);
      showSlotNotification(`Removed "${product.name}" from Slot A.`, "info");
      return;
    }

    // 2. If product is already in Slot B -> toggle off / remove
    if (selectedProductB?._id === product._id) {
      setSelectedProductB(null);
      setProductResult(null);
      showSlotNotification(`Removed "${product.name}" from Slot B.`, "info");
      return;
    }

    // 3. Both slots are available -> assign to Slot A
    if (!selectedProductA && !selectedProductB) {
      setSelectedProductA(product);
      setProductResult(null);
      showSlotNotification(`Added "${product.name}" to Slot A. Select a second product for Slot B!`, "success");
      return;
    }

    // 4. Slot A is occupied, Slot B is available -> assign to Slot B
    if (selectedProductA && !selectedProductB) {
      setSelectedProductB(product);
      setProductResult(null);
      showSlotNotification(`Added "${product.name}" to Slot B. Ready to analyze!`, "success");
      return;
    }

    // 5. Slot B is occupied, Slot A is available -> assign to Slot A
    if (!selectedProductA && selectedProductB) {
      setSelectedProductA(product);
      setProductResult(null);
      showSlotNotification(`Added "${product.name}" to Slot A. Ready to analyze!`, "success");
      return;
    }

    // 6. Both slots are full -> open replacement dialog for graceful handling
    setSlotConflictProduct(product);
  };

  // Horizontal scroll threshold trigger for infinite carousel
  const handleCarouselScroll = (e) => {
    const el = e.currentTarget;
    if (!el || carouselLoadingMore || !carouselHasMore || !carouselCursor) return;
    const isNearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 160;
    if (isNearEnd) {
      fetchCarouselProducts(carouselCursor);
    }
  };

  // Tab 1: Autocomplete ingredient filtering (Dynamic backend search with debounce + local cache fallback)
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }
    const query = searchInput.trim();
    const val = query.toLowerCase();
    const localFiltered = dbIngredients.filter(ing =>
      (ing.name.toLowerCase().includes(val) ||
        ing.aliases?.some(a => a.toLowerCase().includes(val))) &&
      !selectedIngredients.some(sel => sel.toLowerCase() === ing.name.toLowerCase())
    );
    if (localFiltered.length > 0) {
      setSuggestions(localFiltered.slice(0, 8));
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await listIngredients({ search: query, limit: 12 });
        if (res.data?.success && Array.isArray(res.data.ingredients)) {
          const remoteFiltered = res.data.ingredients.filter(ing =>
            !selectedIngredients.some(sel => sel.toLowerCase() === ing.name.toLowerCase())
          );
          setSuggestions(remoteFiltered.slice(0, 8));
        }
      } catch (err) {
        console.error("Error searching ingredients:", err);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, dbIngredients, selectedIngredients]);

  // Tab 2: Autocomplete Product A filtering (Dynamic Backend Search with Debounce)
  useEffect(() => {
    if (!productASearch.trim()) {
      setProductASuggestions([]);
      setProductASearchLoading(false);
      return;
    }
    setProductASearchLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await listAllProducts({ q: productASearch, search: productASearch, limit: 15 });
        let products = [];
        if (res.data && Array.isArray(res.data.products)) {
          products = res.data.products;
        } else if (Array.isArray(res.data)) {
          products = res.data;
        }
        setProductASuggestions(products);
      } catch (err) {
        console.error("Error searching Product A:", err);
      } finally {
        setProductASearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [productASearch]);

  // Tab 2: Autocomplete Product B filtering (Dynamic Backend Search with Debounce)
  useEffect(() => {
    if (!productBSearch.trim()) {
      setProductBSuggestions([]);
      setProductBSearchLoading(false);
      return;
    }
    setProductBSearchLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await listAllProducts({ q: productBSearch, search: productBSearch, limit: 15 });
        let products = [];
        if (res.data && Array.isArray(res.data.products)) {
          products = res.data.products;
        } else if (Array.isArray(res.data)) {
          products = res.data;
        }
        setProductBSuggestions(products);
      } catch (err) {
        console.error("Error searching Product B:", err);
      } finally {
        setProductBSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [productBSearch]);

  // --- ACTIONS: TAB 1 INGREDIENTS ---
  const addIngredient = (name) => {
    if (!name.trim()) return;
    const cleanName = name.trim();
    if (!selectedIngredients.some(s => s.toLowerCase() === cleanName.toLowerCase())) {
      setSelectedIngredients(prev => [...prev, cleanName]);
    }
    setSearchInput("");
    setSuggestions([]);
    setResult(null);
  };

  const removeIngredient = (idx) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  const handleCheckIngredients = async () => {
    if (selectedIngredients.length < 2) return;
    setLoading(true);
    try {
      const res = await checkCompatibility(selectedIngredients);
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      console.error("Error checking ingredients:", err);
      alert("Failed to check compatibility.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (presetIngs) => {
    setSelectedIngredients(presetIngs);
    setResult(null);
  };

  const handleResetIngredients = () => {
    setSelectedIngredients([]);
    setResult(null);
    setSearchInput("");
  };

// Skincare Routine Step Order Definitions
const ROUTINE_STEPS = [
  {
    step: 1,
    name: "Cleanser / Face Wash",
    type: "Cleanse",
    keywords: ["face wash", "cleanser", "cleansing balm", "cleansing oil", "cleansing foam", "micellar", "facial wash", "face cleanser", "facial foam", "body wash", "wash"]
  },
  {
    step: 2,
    name: "Exfoliant / Mask",
    type: "Exfoliate & Mask",
    keywords: ["peeling solution", "peel", "clay mask", "face mask", "scrub", "exfoliating", "sheet mask", "mud mask"]
  },
  {
    step: 3,
    name: "Toner / Mist / Essence",
    type: "Tone & Prep",
    keywords: ["toner", "facial mist", "mist", "essence", "prep water", "toning water", "astringent", "lotion toner"]
  },
  {
    step: 4,
    name: "Serum / Ampoule / Treatment",
    type: "Treat",
    keywords: ["serum", "ampoule", "concentrate", "drops", "booster", "treatment serum", "acne spot", "spot gel"]
  },
  {
    step: 5,
    name: "Eye Care",
    type: "Target",
    keywords: ["eye cream", "under eye", "eye gel", "eye serum", "eye balm"]
  },
  {
    step: 6,
    name: "Moisturizer / Cream / Lotion",
    type: "Moisturize & Hydrate",
    keywords: ["moisturizer", "moisturiser", "face cream", "cream", "lotion", "gel cream", "day cream", "night cream", "sleeping mask", "body lotion", "hydra gel", "gel moisturizer"]
  },
  {
    step: 7,
    name: "Facial Oil",
    type: "Nourish",
    keywords: ["facial oil", "face oil", "beauty oil", "rosehip oil", "squalane oil", "argan oil"]
  },
  {
    step: 8,
    name: "Sunscreen / SPF",
    type: "Protect (AM)",
    keywords: ["sunscreen", "sun screen", "spf", "sunblock", "sun gel", "uv filter", "uv shield"]
  }
];

const detectProductStep = (product) => {
  if (!product) return null;
  const name = (product.name || "").toLowerCase();
  for (const s of ROUTINE_STEPS) {
    if (s.keywords.some((kw) => name.includes(kw))) {
      return s;
    }
  }
  return null;
};

  // --- ACTIONS: TAB 2 PRODUCTS ---
  const handleCheckProducts = async () => {
    if (!selectedProductA || !selectedProductB) return;
    setProductLoading(true);
    try {
      const rawA = selectedProductA.ingredients || [];
      const rawB = selectedProductB.ingredients || [];

      // Determine Routine Application Sequence (Suggestion only, not a warning)
      const stepA = detectProductStep(selectedProductA);
      const stepB = detectProductStep(selectedProductB);
      let routineSuggestion = null;

      if (stepA && stepB && stepA.step !== stepB.step) {
        if (stepB.step < stepA.step) {
          routineSuggestion = {
            isReverse: true,
            stepA,
            stepB,
            title: "Application Sequence Suggestion",
            message: `In a standard skincare routine, ${stepB.name} is used before ${stepA.name}. We suggest applying "${selectedProductB.name}" first in Step ${stepB.step}, followed by "${selectedProductA.name}" in Step ${stepA.step} for maximum absorption.`
          };
        } else {
          routineSuggestion = {
            isReverse: false,
            stepA,
            stepB,
            title: "Optimal Routine Sequence",
            message: `Optimal application sequence: ${stepA.name} in Step ${stepA.step} is applied before ${stepB.name} in Step ${stepB.step}.`
          };
        }
      }

      if (!rawA.length || !rawB.length) {
        setProductResult({
          compatible: true,
          verdict: "Both products are compatible (no detailed ingredient lists available to cross-analyze).",
          conflicts: [],
          synergies: [],
          routineSuggestion
        });
        return;
      }

      // Robust extraction of base ingredients & composite terms
      const extractIngredients = (rawList) => {
        const extracted = [];
        rawList.forEach((raw) => {
          if (typeof raw !== "string") return;
          // Clean parens and extra spaces
          let baseClean = raw.replace(/\([^)]*\)/g, " ").replace(/[+*?^$\{}[\]\\]/g, " ").replace(/\s+/g, " ").trim();
          if (baseClean.length >= 2) extracted.push(baseClean);

          // Split composite terms on +, &, and, commas, slashes
          const parts = raw.replace(/\([^)]*\)/g, " ").split(/[\+&,]|\s+and\s+|\//i);
          parts.forEach((part) => {
            let stripped = part.replace(/^\s*\d+(?:\.\d+)?%\s*/, "").replace(/[+*?^$\{}[\]\\]/g, " ").replace(/\s+/g, " ").trim();
            if (stripped.length >= 2 && !extracted.includes(stripped)) {
              extracted.push(stripped);
            }
          });
        });
        return [...new Set(extracted)];
      };

      const cleanA = extractIngredients(rawA);
      const cleanB = extractIngredients(rawB);

      // Escape ingredients to prevent RegExp syntax crash on backend
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const allCleanIngredients = [...new Set([...cleanA, ...cleanB])].map(escapeRegex);

      if (allCleanIngredients.length < 2) {
        setProductResult({
          compatible: true,
          verdict: "Both products are compatible (insufficient active ingredients to compare).",
          conflicts: [],
          synergies: [],
          routineSuggestion
        });
        return;
      }

      const res = await checkCompatibility(allCleanIngredients);

      if (res.data.success) {
        const rawConflicts = res.data.conflicts || [];
        const rawSynergies = res.data.synergies || [];

        const isIngredientInList = (ingName, list) => {
          if (!ingName) return false;
          const target = ingName.toLowerCase().replace(/\s+/g, " ").trim();
          return list.some((item) => {
            const it = (item || "").toLowerCase().replace(/\s+/g, " ").trim();
            if (!it) return false;
            return it === target || it.includes(target) || target.includes(it);
          });
        };

        const conflicts = [];
        const seenPairs = new Set();

        rawConflicts.forEach((c) => {
          const is1InA = isIngredientInList(c.ingredient1, cleanA);
          const is2InB = isIngredientInList(c.ingredient2, cleanB);
          const is2InA = isIngredientInList(c.ingredient2, cleanA);
          const is1InB = isIngredientInList(c.ingredient1, cleanB);

          if ((is1InA && is2InB) || (is2InA && is1InB)) {
            const ingA = is1InA ? c.ingredient1 : c.ingredient2;
            const ingB = is2InB ? c.ingredient2 : c.ingredient1;
            const pairKey = [ingA.toLowerCase(), ingB.toLowerCase()].sort().join("|");

            if (!seenPairs.has(pairKey)) {
              seenPairs.add(pairKey);
              conflicts.push({
                pair: c.pair || `${ingA} + ${ingB}`,
                ingredientA: ingA,
                ingredientB: ingB,
                reason: c.reason,
                severity: c.severity || "medium",
                advice: c.advice || (c.severity === "high"
                  ? "❌ Do not use together in the same routine layer"
                  : "⚠️ Use on alternate days or split into AM and PM routines")
              });
            }
          }
        });

        // Determine synergies between A and B
        const synergies = [];
        const seenSynPairs = new Set();

        rawSynergies.forEach((s) => {
          const is1InA = isIngredientInList(s.ingredient1, cleanA);
          const is2InB = isIngredientInList(s.ingredient2, cleanB);
          const is2InA = isIngredientInList(s.ingredient2, cleanA);
          const is1InB = isIngredientInList(s.ingredient1, cleanB);

          if ((is1InA && is2InB) || (is2InA && is1InB)) {
            const ingA = is1InA ? s.ingredient1 : s.ingredient2;
            const ingB = is2InB ? s.ingredient2 : s.ingredient1;
            const pairKey = [ingA.toLowerCase(), ingB.toLowerCase()].sort().join("|");

            if (!seenSynPairs.has(pairKey)) {
              seenSynPairs.add(pairKey);
              synergies.push({
                pair: s.pair || `${ingA} + ${ingB}`,
                ingredientA: ingA,
                ingredientB: ingB,
                benefit: s.benefit
              });
            }
          }
        });

        const isCompatible = conflicts.length === 0;

        setProductResult({
          compatible: isCompatible,
          verdict: isCompatible
            ? "Both products are fully compatible! No active chemical conflicts detected between these formulations."
            : `⚠️ Layering Incompatibility: Detected ${conflicts.length} active chemical conflict${conflicts.length > 1 ? 's' : ''} that can trigger irritation or deactivate key actives.`,
          conflicts,
          synergies,
          routineSuggestion
        });
      } else {
        alert("Failed to analyze product compatibility: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error checking product layering compatibility:", err);
      alert("Failed to run layering checker.");
    } finally {
      setProductLoading(false);
    }
  };

    const handleResetProducts = () => {
    setSelectedProductA(null);
    setSelectedProductB(null);
    setProductASearch("");
    setProductBSearch("");
    setProductResult(null);
  };

  // --- ACTIONS: TAB 3 OCR TEXT ---
  // --- ACTIONS: TAB 3 OCR TEXT ---
  const handleScanText = async () => {
    if (!ocrText.trim()) return;
    setOcrLoading(true);
    setOcrError(null);
    try {
      const res = await scanIngredientText(ocrText);
      if (res.data?.success) {
        setOcrResult(res.data);
      } else {
        setOcrError(res.data?.message || "Failed to analyze raw ingredient text.");
      }
    } catch (err) {
      console.error("Error scanning raw labels:", err);
      const msg = err.response?.data?.message || err.message || "Failed to analyze raw ingredient text. Please check your network and try again.";
      setOcrError(msg);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleResetOCR = () => {
    setOcrText("");
    setOcrResult(null);
    setOcrError(null);
  };

  // --- GENERAL DRAWER CLICK ---
  const handleIngredientClick = (ing) => {
    // Drawer expectations: name, benefits, description, goodForSkinTypes, usageTips
    setSelectedIngredient({
      name: ing.name,
      category: typeof ing.category === "string" ? ing.category : (ing.category?.name || "Active"),
      description: ing.description || "Decoded active ingredient.",
      benefits: ing.benefits || [],
      goodForSkinTypes: ing.goodForSkinTypes || [],
      usageTips: ing.usageTips || []
    });
    setIsDrawerOpen(true);
  };

  const handleIngredientNameClick = async (name) => {
    if (!name) return;
    try {
      const cleanName = name.replace(/\b\d+(\.\d+)?%\s*/gi, "").trim() || name;

      // 1. Try to find in dbIngredients which is already loaded on mount
      let found = dbIngredients.find(
        ing => ing.name.toLowerCase() === name.toLowerCase() ||
               ing.name.toLowerCase() === cleanName.toLowerCase() ||
               ing.aliases?.some(a => a.toLowerCase() === name.toLowerCase() || a.toLowerCase() === cleanName.toLowerCase())
      );

      if (found) {
        handleIngredientClick(found);
      } else {
        // 2. Fetch from backend by cleanName
        const res = await getIngredientByName(cleanName);
        if (res.data?.success && res.data.ingredient) {
          handleIngredientClick(res.data.ingredient);
        } else {
          // Construct minimal object so drawer still opens
          handleIngredientClick({
            name: cleanName,
            category: "Active",
            description: "No description available in the database for this ingredient.",
            benefits: [],
            goodForSkinTypes: [],
            usageTips: []
          });
        }
      }
    } catch (err) {
      console.error("Error loading ingredient details:", err);
      const cleanName = name.replace(/\b\d+(\.\d+)?%\s*/gi, "").trim() || name;
      // Fallback
      handleIngredientClick({
        name: cleanName,
        category: "Active",
        description: "No description available in the database for this ingredient.",
        benefits: [],
        goodForSkinTypes: [],
        usageTips: []
      });
    }
  };


  return (
    <>
      <Header />

      <div className="ic-container page-title-main-name">
        <div className="ic-card">
          <div className="text-center mb-4">
            {/* <span className="ic-icon-header">🧪</span> */}
            <h2 className="fw-bold mt-2 text-dark">Ingredient Intelligence Labs</h2>
            <p className="text-muted mx-auto mb-5" style={{ maxWidth: "540px", fontSize: "14px" }}>
              Evaluate safety profiles, layering incompatibilities, and synergistic benefits using our clinical skincare intelligence engine.
            </p>
          </div>

          {/* Navigation Tabs (Modern Segmented Control) */}
          <div className="ic-tabs-nav">
            <button
              type="button"
              className={`ic-tab-btn ${activeTab === "ingredients" ? "active" : ""}`}
              onClick={() => setActiveTab("ingredients")}
            >
              <FaFlask /> Ingredient Layering
            </button>
            <button
              type="button"
              className={`ic-tab-btn ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <FaBox /> Product Layering
            </button>
            <button
              type="button"
              className={`ic-tab-btn ${activeTab === "ocr" ? "active" : ""}`}
              onClick={() => setActiveTab("ocr")}
            >
              <FaBarcode /> Raw Label Scanner
            </button>
          </div>

          {/* =========================================================================
              TAB 1: INGREDIENT LAYERING
              ========================================================================= */}
          {activeTab === "ingredients" && (
            <div>
              {/* Quick Presets */}
              <div className="mb-4">
                <span className="text-muted small fw-semibold d-block mb-2 text-start">Popular Combinations:</span>
                <div className="d-flex flex-wrap gap-2 justify-content-start">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="ic-preset-btn"
                      onClick={() => loadPreset(preset.ingredients)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input & Search */}
              <div className="mb-4 text-start position-relative">
                <label className="fw-bold text-dark mb-2 small">Search & Add Ingredients</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder="Search active ingredients (e.g., Retinol, Niacinamide)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (suggestions.length > 0) {
                          addIngredient(suggestions[0].name);
                        } else {
                          addIngredient(searchInput);
                        }
                      }
                    }}
                  />
                  <button
                    className="btn btn-dark px-3 ingredient-add"
                    onClick={() => addIngredient(searchInput)}
                  // disabled={!searchInput.trim()}
                  >
                    <FaPlus /> Add
                  </button>
                </div>

                {/* Suggestions Overlay */}
                {suggestions.length > 0 && (
                  <div
                    className="position-absolute w-100 bg-white border rounded shadow mt-1 z-3 ic-suggestions-box"
                    style={{ top: "100%" }}
                  >
                    {suggestions.map((ing) => (
                      <div
                        key={ing._id}
                        className="ic-suggestion-row text-start"
                        onClick={() => addIngredient(ing.name)}
                      >
                        <strong>{ing.name}</strong>
                        <span className="ic-suggestion-category">
                          {typeof ing.category === "string" ? ing.category : (ing.category?.name || "Active")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Ingredients List */}
              <div className="mb-4 text-start">
                <label className="fw-bold text-dark mb-2 small">Selected Active Ingredients:</label>
                <div className="ic-selected-list-box">
                  {selectedIngredients.length === 0 ? (
                    <span className="text-muted small my-auto">No ingredients selected. Search and add some above.</span>
                  ) : (
                    selectedIngredients.map((item, idx) => (
                      <span key={idx} className="ic-selected-badge">
                        {item}
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="ic-selected-badge-remove-btn"
                        >
                          <FaTrash size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mb-4 w-50 m-auto Compatibility-btn">
                <button
                  className="ic-action-btn-primary"
                  onClick={handleCheckIngredients}
                  disabled={selectedIngredients.length < 2 || loading}
                >
                  {loading ? "Analyzing Layerings..." : "Check Compatibility"}
                </button>
                <button
                  className="ic-action-btn-reset"
                  onClick={handleResetIngredients}
                  title="Reset"
                >
                  <FaUndo />
                </button>
              </div>

              {/* Verdict and Results */}
              {result && (
                <div className="mt-4 border-top pt-4 text-start">
                  {result.conflicts?.length > 0 ? (
                    <div className="ic-alert ic-alert-warning mb-3">
                      <FaExclamationTriangle size={28} className="flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">Layering Caution Needed</h5>
                        <p className="mb-0 text-muted small">
                          We identified {result.conflicts.length} conflict(s). Review the pairing details below to adjust your application times.
                        </p>
                      </div>
                    </div>
                  ) : result.notFound?.length > 0 ? (
                    <div className="ic-alert ic-alert-warning mb-3" style={{ background: "#fff9e6", borderColor: "#ffe082" }}>
                      <FaExclamationTriangle size={28} className="flex-shrink-0 mt-1 text-warning" />
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">Incomplete Evaluation</h5>
                        <p className="mb-0 text-muted small">
                          {result.notFound.join(", ")} {result.notFound.length === 1 ? "was" : "were"} not recognized in our verified clinical database. We cannot guarantee layering compatibility for unverified terms.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="ic-alert ic-alert-success mb-3">
                      <FaCheckCircle size={28} className="flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">Perfect Harmony!</h5>
                        <p className="mb-0 text-muted small">
                          All selected ingredients are verified and fully compatible. They can be safely layered or combined in your AM/PM routine!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Synergy Benefits (Positive Pairing Combinations) */}
                  {result.synergies?.length > 0 && (
                    <div className="mb-4">
                      <h5 className="fw-bold fs-6 mb-2 ic-text-blue">Synergistic Power Pairings Detected:</h5>
                      <div className="d-flex flex-column gap-2">
                        {result.synergies.map((syn, idx) => (
                          <div key={idx} className="p-2 border rounded bg-opacity-5" style={{ fontSize: "12.5px" }}>
                            <strong className="ic-text-blue uppercase d-block mb-1">{syn.pair.toUpperCase()}</strong>
                            <span className="text-muted">{syn.benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incompatible Pairs Details */}
                  {result.conflicts?.length > 0 && (
                    <div className="mt-3">
                      <h5 className="fw-bold fs-6 mb-2">Layering Incompatibilities:</h5>
                      <div className="d-flex flex-column gap-3">
                        {result.conflicts.map((conflict, idx) => (
                          <div key={idx} className="p-3 border rounded bg-white shadow-sm">
                            <div className="ic-conflict-header">
                              <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14px" }}>
                                <span
                                  className="ic-clickable-ingredient"
                                  onClick={() => handleIngredientNameClick(conflict.ingredient1)}
                                  style={{ cursor: "pointer", textDecoration: "underline" }}
                                  title={`Inspect ${conflict.ingredient1}`}
                                >
                                  {conflict.ingredient1}
                                </span>
                                {" + "}
                                <span
                                  className="ic-clickable-ingredient"
                                  onClick={() => handleIngredientNameClick(conflict.ingredient2)}
                                  style={{ cursor: "pointer", textDecoration: "underline" }}
                                  title={`Inspect ${conflict.ingredient2}`}
                                >
                                  {conflict.ingredient2}
                                </span>
                              </h6>
                              <span className={`ic-severity-badge ic-severity-${conflict.severity || 'low'}`}>
                                {conflict.severity?.toUpperCase()} SEVERITY
                              </span>
                              {conflict.source === "ai" && (
                                <span className="badge bg-light text-dark border ms-2" style={{ fontSize: "11px", fontWeight: "600", padding: "4px 8px" }}>
                                  ✨ AI Decoded
                                </span>
                              )}
                            </div>
                            <div className="d-flex gap-2 align-items-start text-muted mb-2" style={{ fontSize: "12.5px" }}>
                              <FaInfoCircle className="flex-shrink-0 mt-1" />
                              <span><strong>Concern:</strong> {conflict.reason}</span>
                            </div>
                            <div className="bg-light p-2 rounded small fw-medium" style={{ fontSize: "12.5px" }}>
                              <strong>Layers Tip:</strong> {conflict.advice}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safe Ingredients Details */}
                  {result.safe?.length > 0 && (
                    <div className="mt-4">
                      <h5 className="fw-bold fs-6 mb-3 ic-text-blue d-flex align-items-center gap-2">
                        <FaCheckCircle className="ic-text-blue" size={16} />
                        <span>Safe Ingredients (No Conflicts):</span>
                      </h5>
                      <div className="d-flex flex-wrap gap-2">
                        {Array.from(new Set(result.safe)).map((ing, idx) => (
                          <span
                            key={idx}
                            className="ic-safe-badge"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleIngredientNameClick(ing)}
                            title="Click to inspect details"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Decoded Ingredients & Phototoxicity / Clinical Notes */}
                  {result.analyzed?.some(a => a.source === "ai_analysis" || (a.cautions && a.cautions.length > 0)) && (
                    <div className="mt-4 p-3 rounded border bg-light text-start shadow-sm" style={{ fontSize: "12.5px" }}>
                      <div className="fw-bold mb-2 text-dark d-flex align-items-center gap-1">
                        <span>✨ Ingredients Decoded via AI Intelligence:</span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {result.analyzed.filter(a => a.source === "ai_analysis" || (a.cautions && a.cautions.length > 0)).map((ing, i) => (
                          <div key={i} className="p-2 bg-white rounded border">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <strong className="text-dark" style={{ fontSize: "13px" }}>{ing.name}</strong>
                              <span className="badge bg-secondary-subtle text-dark border small">{ing.family || 'Active'}</span>
                            </div>
                            {ing.cautions && ing.cautions.length > 0 ? (
                              <div className="text-danger small mt-1">
                                <strong>⚠️ Clinical Caution:</strong> {ing.cautions.join("; ")}
                              </div>
                            ) : (
                              <div className="text-muted small mt-1">
                                Analyzed on-the-fly and cataloged into intelligence library.
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredients not found in DB */}
                  {result.notFound?.length > 0 && (
                    <div className="mt-3 p-3 bg-light border rounded text-dark small">
                      <strong>⚠️ Unverified Ingredients:</strong> The following ingredient(s) could not be matched against our clinical formulation library: <strong className="text-danger">{Array.from(new Set(result.notFound)).join(", ")}</strong>. Because these ingredients are unverified, please patch test or consult a dermatologist.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: PRODUCT LAYERING COMPATIBILITY
              ========================================================================= */}
          {activeTab === "products" && (
            <div>
              {/* Popular Products Scroll Tray */}
              <div className="mb-4 text-start">
                <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
                  <label className="fw-bold text-dark small d-flex align-items-center gap-2 m-0">
                    <span>💡 Quick Select Popular Products</span>
                  </label>
                  {carouselLoadingMore ? (
                    <span className="ic-carousel-badge ic-carousel-badge-loading">
                      <span className="ic-pulse-dot"></span>
                      Loading more formulas...
                    </span>
                  ) : carouselHasMore ? (
                    <span className="ic-carousel-badge ic-carousel-badge-hint">
                      Scroll for more →
                    </span>
                  ) : catalogProducts.length > 0 ? (
                    <span className="ic-carousel-badge ic-carousel-badge-complete">
                      ✓ All formulas loaded ({catalogProducts.length})
                    </span>
                  ) : null}
                </div>
                <p className="text-muted small mb-3" style={{ fontSize: "12px" }}>
                  Tap any product to automatically assign it to available Slot A or Slot B. If both are full, select which slot to replace.
                </p>

                {productsLoading && catalogProducts.length === 0 ? (
                  <div className="popular-products-scroll-wrapper">
                    <div className="d-flex gap-3 overflow-hidden pb-2 pt-2">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="popular-product-mini-card ic-skeleton-card">
                          <div className="ic-mini-card-image-box ic-skeleton-box">
                            <div className="ic-skeleton-shimmer"></div>
                          </div>
                          <div className="ic-skeleton-line ic-skeleton-title-line">
                            <div className="ic-skeleton-shimmer"></div>
                          </div>
                          <div className="ic-skeleton-line ic-skeleton-brand-line">
                            <div className="ic-skeleton-shimmer"></div>
                          </div>
                          <div className="ic-mini-slot-tray mt-auto">
                            <div className="ic-skeleton-btn">
                              <div className="ic-skeleton-shimmer"></div>
                            </div>
                            <div className="ic-skeleton-btn">
                              <div className="ic-skeleton-shimmer"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="popular-products-scroll-wrapper">
                    <div
                      className="d-flex gap-3 overflow-auto pb-2 pt-2 scrollbar-thin"
                      style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
                      onScroll={handleCarouselScroll}
                    >
                      {catalogProducts.map((p) => {
                        const imgUrl = p.variants?.[0]?.images?.[0] || p.image || "/placeholder.png";
                        const isSelectedA = selectedProductA?._id === p._id;
                        const isSelectedB = selectedProductB?._id === p._id;
                        const isSelected = isSelectedA || isSelectedB;

                        return (
                          <div
                            key={p._id || p.id}
                            className={`popular-product-mini-card ${isSelectedA ? "ic-card-selected-a" : ""} ${isSelectedB ? "ic-card-selected-b" : ""}`}
                            onClick={() => handleProductCardClick(p)}
                            role="button"
                            tabIndex={0}
                            title={
                              isSelectedA
                                ? `Slot A: ${p.name} (Click to remove)`
                                : isSelectedB
                                ? `Slot B: ${p.name} (Click to remove)`
                                : `Click to add ${p.name} to comparison`
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleProductCardClick(p);
                              }
                            }}
                          >
                            {/* Selected Slot Badge indicator */}
                            {isSelectedA && (
                              <span className="ic-card-slot-badge ic-badge-slot-a">
                                Slot A ✓
                              </span>
                            )}
                            {isSelectedB && (
                              <span className="ic-card-slot-badge ic-badge-slot-b">
                                Slot B ✓
                              </span>
                            )}

                            <div className="ic-mini-card-image-box">
                              <img
                                src={imgUrl}
                                alt={p.name}
                                onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                              />
                            </div>
                            <div className="ic-mini-card-title" title={p.name}>
                              {p.name}
                            </div>
                            <div className="ic-mini-card-brand">
                              {typeof p.brand === "string" ? p.brand : (p.brand?.name || "Joyory")}
                            </div>
                            <div className="ic-mini-card-action-hint">
                              {isSelected ? "Tap to remove" : "+ Tap to compare"}
                            </div>
                          </div>
                        );
                      })}

                      {/* Loading More State: Shimmer Skeleton Card + Animated Loader Card */}
                      {carouselLoadingMore && (
                        <>
                          <div className="popular-product-mini-card ic-skeleton-card">
                            <div className="ic-mini-card-image-box ic-skeleton-box">
                              <div className="ic-skeleton-shimmer"></div>
                            </div>
                            <div className="ic-skeleton-line ic-skeleton-title-line">
                              <div className="ic-skeleton-shimmer"></div>
                            </div>
                            <div className="ic-skeleton-line ic-skeleton-brand-line">
                              <div className="ic-skeleton-shimmer"></div>
                            </div>
                            <div className="ic-mini-slot-tray mt-auto">
                              <div className="ic-skeleton-btn">
                                <div className="ic-skeleton-shimmer"></div>
                              </div>
                              <div className="ic-skeleton-btn">
                                <div className="ic-skeleton-shimmer"></div>
                              </div>
                            </div>
                          </div>

                          <div className="popular-product-mini-card ic-carousel-loading-card">
                            <div className="ic-carousel-loader-halo">
                              <div className="ic-carousel-loader-spinner"></div>
                            </div>
                            <div className="ic-carousel-loading-title">Loading...</div>
                            <div className="ic-carousel-loading-subtitle">Fetching formulas</div>
                          </div>
                        </>
                      )}

                      {/* Interactive Load More Card (When not loading but more items exist) */}
                      {!carouselLoadingMore && carouselHasMore && (
                        <div
                          className="popular-product-mini-card ic-carousel-load-more-card"
                          onClick={() => {
                            if (!carouselLoadingMore && carouselHasMore && carouselCursor) {
                              fetchCarouselProducts(carouselCursor);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          title="Click to load more skincare formulas"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              if (!carouselLoadingMore && carouselHasMore && carouselCursor) {
                                fetchCarouselProducts(carouselCursor);
                              }
                            }
                          }}
                        >
                          <div className="ic-load-more-icon-circle">
                            <FaPlus className="ic-load-more-icon" />
                          </div>
                          <div className="ic-load-more-title">Load More</div>
                          <div className="ic-load-more-subtitle">Tap or scroll</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="ic-comparison-dashboard mb-4">
                {/* Slot A Container */}
                <div className="ic-comparison-slot">
                  <span className="ic-slot-label">Product A</span>
                  {selectedProductA ? (
                    <div className="ic-product-compare-card">
                      <div className="ic-product-compare-image-container">
                        <img
                          src={selectedProductA.variants?.[0]?.images?.[0] || selectedProductA.image || "/placeholder.png"}
                          alt={selectedProductA.name}
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                        />
                      </div>
                      <div className="ic-product-compare-details">
                        <div className="ic-product-compare-name" title={selectedProductA.name}>{selectedProductA.name}</div>
                        <div className="ic-product-compare-brand">{typeof selectedProductA.brand === "string" ? selectedProductA.brand : (selectedProductA.brand?.name || "Joyory")}</div>
                      </div>
                      <button
                        type="button"
                        className="ic-product-compare-remove-btn"
                        onClick={() => {
                          setSelectedProductA(null);
                          setProductResult(null);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <div className="ic-product-compare-empty">
                      <FaSearch className="ic-empty-icon" />
                      <input
                        type="text"
                        className="form-control ic-compare-input"
                        placeholder="Search product A..."
                        value={productASearch}
                        onChange={(e) => setProductASearch(e.target.value)}
                      />
                      {(productASearchLoading || productASuggestions.length > 0 || (productASearch.trim() !== "" && !productASearchLoading && productASuggestions.length === 0)) && (
                        <div className="ic-suggestions-dropdown">
                          {productASearchLoading ? (
                            <div className="p-3 text-center text-muted small">
                              <span className="spinner-border spinner-border-sm text-secondary me-2" role="status"></span>
                              Searching library...
                            </div>
                          ) : productASuggestions.length > 0 ? (
                            productASuggestions.map((p) => (
                              <div
                                key={p._id || p.id}
                                className="ic-suggestion-item"
                                onClick={() => {
                                  setSelectedProductA(p);
                                  setProductASearch("");
                                  setProductASuggestions([]);
                                  setProductResult(null);
                                }}
                              >
                                <img
                                  src={p.variants?.[0]?.images?.[0] || p.image || "/placeholder.png"}
                                  alt={p.name}
                                  onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                                />
                                <div>
                                  <strong className="d-block text-truncate" style={{ maxWidth: "200px" }}>{p.name}</strong>
                                  <span className="text-muted small">{typeof p.brand === "string" ? p.brand : (p.brand?.name || "Joyory")}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center ic-text-black small fw-semibold">
                              ⚠️ No matching products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* VS Divider */}
                <div className="ic-vs-divider">
                  <span>VS</span>
                </div>

                {/* Slot B Container */}
                <div className="ic-comparison-slot">
                  <span className="ic-slot-label">Product B</span>
                  {selectedProductB ? (
                    <div className="ic-product-compare-card">
                      <div className="ic-product-compare-image-container">
                        <img
                          src={selectedProductB.variants?.[0]?.images?.[0] || selectedProductB.image || "/placeholder.png"}
                          alt={selectedProductB.name}
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                        />
                      </div>
                      <div className="ic-product-compare-details">
                        <div className="ic-product-compare-name" title={selectedProductB.name}>{selectedProductB.name}</div>
                        <div className="ic-product-compare-brand">{typeof selectedProductB.brand === "string" ? selectedProductB.brand : (selectedProductB.brand?.name || "Joyory")}</div>
                      </div>
                      <button
                        type="button"
                        className="ic-product-compare-remove-btn"
                        onClick={() => {
                          setSelectedProductB(null);
                          setProductResult(null);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <div className="ic-product-compare-empty">
                      <FaSearch className="ic-empty-icon" />
                      <input
                        type="text"
                        className="form-control ic-compare-input"
                        placeholder="Search product B..."
                        value={productBSearch}
                        onChange={(e) => setProductBSearch(e.target.value)}
                      />
                      {(productBSearchLoading || productBSuggestions.length > 0 || (productBSearch.trim() !== "" && !productBSearchLoading && productBSuggestions.length === 0)) && (
                        <div className="ic-suggestions-dropdown">
                          {productBSearchLoading ? (
                            <div className="p-3 text-center text-muted small">
                              <span className="spinner-border spinner-border-sm text-secondary me-2" role="status"></span>
                              Searching library...
                            </div>
                          ) : productBSuggestions.length > 0 ? (
                            productBSuggestions.map((p) => (
                              <div
                                key={p._id || p.id}
                                className="ic-suggestion-item"
                                onClick={() => {
                                  setSelectedProductB(p);
                                  setProductBSearch("");
                                  setProductBSuggestions([]);
                                  setProductResult(null);
                                }}
                              >
                                <img
                                  src={p.variants?.[0]?.images?.[0] || p.image || "/placeholder.png"}
                                  alt={p.name}
                                  onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                                />
                                <div>
                                  <strong className="d-block text-truncate" style={{ maxWidth: "200px" }}>{p.name}</strong>
                                  <span className="text-muted small">{typeof p.brand === "string" ? p.brand : (p.brand?.name || "Joyory")}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center ic-text-black small fw-semibold">
                              ⚠️ No matching products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 mb-4 w-50 m-auto Compatibility-btn">
                <button
                  className="ic-action-btn-primary"
                  onClick={handleCheckProducts}
                  disabled={!selectedProductA || !selectedProductB || productLoading}
                >
                  {productLoading ? "Scanning Formulation Layerings..." : "Analyze Layering Safety"}
                </button>
                <button
                  className="ic-action-btn-reset"
                  onClick={handleResetProducts}
                  title="Reset"
                >
                  <FaUndo />
                </button>
              </div>

              {/* Product Compatibility Results */}
              {productResult && (
                <div className="mt-4 border-top pt-4 text-start">
                  {/* Side-by-Side Cards */}
                  <div className="ic-result-compare-grid">
                    <div className="ic-result-compare-card">
                      <div className="ic-result-compare-image-box">
                        <img
                          src={selectedProductA?.variants?.[0]?.images?.[0] || selectedProductA?.image || "/placeholder.png"}
                          alt={selectedProductA?.name}
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                        />
                      </div>
                      <div className="ic-result-compare-info">
                        <div className="ic-result-compare-name">{selectedProductA?.name}</div>
                        <div className="text-muted" style={{ fontSize: "11px", fontWeight: "500" }}>{typeof selectedProductA?.brand === "string" ? selectedProductA.brand : (selectedProductA?.brand?.name || "Joyory")}</div>
                        <span className="ic-product-slot-badge">Product A</span>
                      </div>
                    </div>
                    <div className="ic-result-compare-card">
                      <div className="ic-result-compare-image-box">
                        <img
                          src={selectedProductB?.variants?.[0]?.images?.[0] || selectedProductB?.image || "/placeholder.png"}
                          alt={selectedProductB?.name}
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                        />
                      </div>
                      <div className="ic-result-compare-info">
                        <div className="ic-result-compare-name">{selectedProductB?.name}</div>
                        <div className="text-muted" style={{ fontSize: "11px", fontWeight: "500" }}>{typeof selectedProductB?.brand === "string" ? selectedProductB.brand : (selectedProductB?.brand?.name || "Joyory")}</div>
                        <span className="ic-product-slot-badge">Product B</span>
                      </div>
                    </div>
                  </div>

                  {/* Verdict Panel */}
                  {/* Routine Application Sequence Suggestion (Senior's Feature) */}
                  {productResult.routineSuggestion && (
                    <div
                      className={`ic-routine-order-box mb-4 ${
                        productResult.routineSuggestion.isReverse
                          ? "ic-routine-order-suggest"
                          : "ic-routine-order-optimal"
                      }`}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div className="ic-routine-order-icon-badge">
                          {productResult.routineSuggestion.isReverse ? "💡" : "✓"}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                            <strong className="ic-routine-order-title">
                              {productResult.routineSuggestion.title}
                            </strong>
                            <span className="ic-routine-order-tag">
                              {productResult.routineSuggestion.isReverse
                                ? `Suggested: ${productResult.routineSuggestion.stepB.name} → ${productResult.routineSuggestion.stepA.name}`
                                : `Optimal: ${productResult.routineSuggestion.stepA.name} → ${productResult.routineSuggestion.stepB.name}`}
                            </span>
                          </div>
                          <p className="ic-routine-order-text mb-2">
                            {productResult.routineSuggestion.message}
                          </p>
                          {productResult.routineSuggestion.isReverse && (
                            <button
                              type="button"
                              className="ic-routine-swap-action-btn"
                              onClick={() => {
                                const temp = selectedProductA;
                                setSelectedProductA(selectedProductB);
                                setSelectedProductB(temp);
                                setProductResult(null);
                                showSlotNotification(
                                  `Swapped slots! "${selectedProductB.name}" is now in Slot A.`,
                                  "info"
                                );
                              }}
                            >
                              ⇄ Swap Slots (Put ${productResult.routineSuggestion.stepB.name} in Slot A)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {productResult.compatible ? (
                    <div className="ic-alert ic-alert-success mb-4">
                      <FaCheckCircle size={28} className="flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">Layering Approved</h5>
                        <p className="mb-0 text-muted small">{productResult.verdict}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="ic-alert ic-alert-danger mb-4">
                      <FaExclamationTriangle size={28} className="flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">Conflict Warning</h5>
                        <p className="mb-0 text-muted small">{productResult.verdict}</p>
                      </div>
                    </div>
                  )}

                  {/* Synergy Benefits */}
                  {productResult.synergies?.length > 0 && (
                    <div className="mb-4">
                      <h5 className="fw-bold fs-6 mb-2 ic-text-blue">Formulation Synergies Detected:</h5>
                      <div className="d-flex flex-column gap-2">
                        {productResult.synergies.map((syn, idx) => (
                          <div key={idx} className="p-2 border rounded  bg-opacity-5" style={{ fontSize: "12.5px" }}>
                            <strong className="ic-text-blue uppercase d-block mb-1">{syn.pair.toUpperCase()}</strong>
                            <span className="text-muted">{syn.benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conflicts Listing */}
                  {productResult.conflicts?.length > 0 ? (
                    <div className="mt-3">
                      <h5 className="fw-bold fs-6 mb-2 ic-text-black">Formulation Conflicts:</h5>
                      <div className="d-flex flex-column gap-3">
                        {productResult.conflicts.map((conflict, idx) => (
                          <div key={idx} className="p-3 border rounded bg-white shadow-sm">
                            <div className="ic-conflict-header">
                              <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14px" }}>
                                <span
                                  className="ic-clickable-ingredient"
                                  onClick={() => handleIngredientNameClick(conflict.ingredientA)}
                                  style={{ cursor: "pointer", textDecoration: "underline" }}
                                  title={`Inspect ${conflict.ingredientA}`}
                                >
                                  {conflict.ingredientA}
                                </span>
                                {" vs "}
                                <span
                                  className="ic-clickable-ingredient"
                                  onClick={() => handleIngredientNameClick(conflict.ingredientB)}
                                  style={{ cursor: "pointer", textDecoration: "underline" }}
                                  title={`Inspect ${conflict.ingredientB}`}
                                >
                                  {conflict.ingredientB}
                                </span>
                              </h6>
                              <span className={`ic-severity-badge ic-severity-${conflict.severity || 'low'}`}>
                                {conflict.severity?.toUpperCase()} SEVERITY
                              </span>
                            </div>
                            <div className="d-flex gap-2 align-items-start text-muted mb-2" style={{ fontSize: "12.5px" }}>
                              <FaInfoCircle className="flex-shrink-0 mt-1" />
                              <span><strong>Concern:</strong> {conflict.reason}</span>
                            </div>
                            <div className="bg-light p-2 rounded small fw-medium" style={{ fontSize: "12.5px" }}>
                              <strong>💡 Application Advice:</strong> {conflict.advice}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    productResult.conflicts?.length === 0 && (
                      <div className="text-muted small">No active chemical conflicts detected between these formulations.</div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: RAW LABEL INGREDIENT TEXT SCANNER (OCR SIMULATOR)
              ========================================================================= */}
          {activeTab === "ocr" && (
            <div>
              <div className="mb-4 text-start">
                <label className="fw-bold text-dark mb-2 small">Paste Ingredient List Text</label>
                <p className="text-muted small mb-2">
                  Copy and paste the raw ingredient text list from any packaging or third-party label (comma-separated).
                </p>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Water, Glycerin, Retinol, Fragrance, Parabens, Niacinamide..."
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  style={{ borderRadius: "12px", resize: "none" }}
                />
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 mb-4 w-50 m-auto Compatibility-btn">
                <button
                  className="ic-action-btn-primary"
                  onClick={handleScanText}
                  disabled={!ocrText.trim() || ocrLoading}
                >
                  {ocrLoading ? "Analyzing Label Formulations..." : "Scan & Analyze Ingredients"}
                </button>
                <button
                  className="ic-action-btn-reset"
                  onClick={handleResetOCR}
                  title="Clear"
                >
                  <FaUndo />
                </button>
              </div>

              {/* Explicit Error Display */}
              {ocrError && (
                <div className="alert alert-danger mt-3 d-flex align-items-center gap-2 text-start" role="alert">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  <div>
                    <strong>Scan Notice:</strong> {ocrError}
                  </div>
                </div>
              )}

              {/* Results */}
              {ocrResult && (() => {
                const decodedIngredients = ocrResult.ingredients?.filter(ing => ing.status === "decoded" || (ing.status === undefined && ing.decoded)) || [];
                const unverifiedAiIngredients = ocrResult.ingredients?.filter(ing => ing.status === "unverified_ai") || [];
                const unrecognisedIngredients = ocrResult.ingredients?.filter(ing => ing.status === "unknown" || (!ing.decoded && ing.status !== "unverified_ai")) || [];

                return (
                  <div className="mt-4 border-top pt-4 text-start">
                    {/* Summary Metric Banners */}
                    <div className="row g-2 mb-3">
                      <div className="col-4">
                        <div className="p-2 border rounded text-center bg-light">
                          <span className="d-block text-muted small" style={{ fontSize: "11px" }}>Total Parsed</span>
                          <strong className="fs-5 text-dark">{ocrResult.totalIngredients}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 border rounded text-center bg-light">
                          <span className="d-block text-muted small" style={{ fontSize: "11px" }}>Decoded Library</span>
                          <strong className="fs-5 text-success">{ocrResult.decodedCount}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 border rounded text-center bg-light">
                          <span className="d-block text-muted small" style={{ fontSize: "11px" }}>Unrecognised</span>
                          <strong className="fs-5 text-muted">{unrecognisedIngredients.length + unverifiedAiIngredients.length}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Allergen Warning Banner */}
                    {(ocrResult.allergenWarnings?.length > 0 || ocrResult.sensitiveWarnings?.length > 0) && (
                      <div className="ic-alert ic-alert-danger mb-4">
                        <FaExclamationTriangle size={28} className="flex-shrink-0 mt-1" />
                        <div>
                          <h5 className="fw-bold fs-6 mb-1 d-flex align-items-center gap-2">
                            Warning: Allergen Match
                          </h5>
                          <ul className="ps-3 mb-0 small" style={{ color: "inherit" }}>
                            {ocrResult.allergenWarnings.map((w, idx) => (
                              <li key={idx} className="fw-semibold">
                                {w.ingredient} matches your profile allergen list!
                              </li>
                            ))} 
                            {ocrResult.sensitiveWarnings.map((w, idx) => (
                              <li key={idx}>
                                {w.ingredient} is marked as skin sensitive.
                              </li>
                            ))} 
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Interactive Decoded Ingredients Badges */}
                    {decodedIngredients.length > 0 ? (
                      <div className="mb-4">
                        <h5 className="fw-bold fs-6 mb-1 text-dark">Decoded Ingredients Details:</h5>
                        <p className="text-muted small mb-2">Click on any decoded ingredient badge to view benefits, category description, and usage tips.</p>
                        <div className="d-flex flex-wrap gap-2">
                          {decodedIngredients.map((ing, idx) => {
                            let badgeClass = "ic-decoded-badge";
                            if (ing.isAllergen) badgeClass += " ic-decoded-allergen";
                            else if (ing.isSensitive) badgeClass += " ic-decoded-sensitive";
                            else badgeClass += " ic-decoded-safe";

                            return (
                              <button
                                key={idx}
                                type="button"
                                className={badgeClass}
                                onClick={() => handleIngredientClick(ing)}
                                aria-label={`View clinical details for ${ing.name}`}
                                title={`Click to inspect details for ${ing.name}`}
                              >
                                {ing.name} {ing.isAllergen && "⚠️"} {ing.isSensitive && "ℹ️"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-light border p-3 rounded mb-4 text-muted small">
                        ℹ️ None of the submitted ingredients could be matched to verified active records in our library.
                      </div>
                    )}

                    {/* Separate Not Recognised / Unverified Group */}
                    {(unrecognisedIngredients.length > 0 || unverifiedAiIngredients.length > 0) && (
                      <div className="mt-4 pt-3 border-top">
                        <h5 className="fw-bold fs-6 mb-1 text-muted">Not Recognised / Unverified Items:</h5>
                        <p className="text-muted small mb-3">
                          These terms were not recognized in our curated clinical database or are pending verification. Unverified items do not carry verified safety badges.
                        </p>

                        {/* Unverified AI items */}
                        {unverifiedAiIngredients.length > 0 && (
                          <div className="mb-3">
                            <span className="badge bg-warning text-dark mb-2 px-2 py-1" style={{ fontSize: "11px" }}>
                              AI Suggestions (Pending Clinical Verification)
                            </span>
                            <div className="d-flex flex-wrap gap-2">
                              {unverifiedAiIngredients.map((ing, idx) => (
                                <span
                                  key={`ai-${idx}`}
                                  className="badge border bg-light text-secondary py-2 px-3 fw-normal"
                                  style={{ cursor: "default", fontSize: "12.5px" }}
                                  title="AI suggestion, not verified by a human cosmetic chemist"
                                >
                                  {ing.name} <small className="text-muted ms-1">(AI suggestion, not verified)</small>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Completely Unrecognised items */}
                        {unrecognisedIngredients.length > 0 && (
                          <div>
                            <div className="d-flex flex-wrap gap-2">
                              {unrecognisedIngredients.map((ing, idx) => (
                                <span
                                  key={`unrec-${idx}`}
                                  className="badge border bg-light text-muted py-2 px-3 fw-normal"
                                  style={{ cursor: "default", opacity: 0.75, fontSize: "12.5px" }}
                                  title="Not recognized in clinical library"
                                >
                                  {ing.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Both Slots Occupied: Graceful Resolution Modal */}
      {slotConflictProduct && (
        <div className="ic-slot-modal-backdrop" onClick={() => setSlotConflictProduct(null)}>
          <div
            className="ic-slot-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ic-slot-modal-title"
          >
            <div className="ic-slot-modal-header">
              <span className="ic-slot-modal-badge">Comparison Slots Full</span>
              <button
                type="button"
                className="ic-slot-modal-close"
                onClick={() => setSlotConflictProduct(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="ic-slot-modal-body">
              <h4 id="ic-slot-modal-title" className="ic-slot-modal-title">
                Both Slots are Currently Occupied
              </h4>
              <p className="ic-slot-modal-description">
                You selected <strong>"{slotConflictProduct.name}"</strong>, but both Slot A and Slot B already have products assigned. Which slot would you like to replace?
              </p>

              <div className="ic-slot-replace-options">
                {/* Option: Replace Slot A */}
                <div
                  className="ic-slot-replace-card"
                  onClick={() => {
                    setSelectedProductA(slotConflictProduct);
                    setProductResult(null);
                    setSlotConflictProduct(null);
                    showSlotNotification(`Replaced Slot A with "${slotConflictProduct.name}".`, "success");
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedProductA(slotConflictProduct);
                      setProductResult(null);
                      setSlotConflictProduct(null);
                      showSlotNotification(`Replaced Slot A with "${slotConflictProduct.name}".`, "success");
                    }
                  }}
                >
                  <span className="ic-slot-pill ic-slot-pill-a">Slot A</span>
                  <div className="ic-slot-replace-info">
                    <span className="ic-slot-current-label">Currently in slot:</span>
                    <strong className="ic-slot-current-name">{selectedProductA?.name}</strong>
                  </div>
                  <button type="button" className="ic-slot-action-btn">
                    Replace Slot A →
                  </button>
                </div>

                {/* Option: Replace Slot B */}
                <div
                  className="ic-slot-replace-card"
                  onClick={() => {
                    setSelectedProductB(slotConflictProduct);
                    setProductResult(null);
                    setSlotConflictProduct(null);
                    showSlotNotification(`Replaced Slot B with "${slotConflictProduct.name}".`, "success");
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedProductB(slotConflictProduct);
                      setProductResult(null);
                      setSlotConflictProduct(null);
                      showSlotNotification(`Replaced Slot B with "${slotConflictProduct.name}".`, "success");
                    }
                  }}
                >
                  <span className="ic-slot-pill ic-slot-pill-b">Slot B</span>
                  <div className="ic-slot-replace-info">
                    <span className="ic-slot-current-label">Currently in slot:</span>
                    <strong className="ic-slot-current-name">{selectedProductB?.name}</strong>
                  </div>
                  <button type="button" className="ic-slot-action-btn">
                    Replace Slot B →
                  </button>
                </div>
              </div>
            </div>

            <div className="ic-slot-modal-footer">
              <button
                type="button"
                className="ic-slot-cancel-btn"
                onClick={() => setSlotConflictProduct(null)}
              >
                Keep Current Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {slotNotification && (
        <div className={`ic-floating-toast ic-toast-${slotNotification.type}`}>
          <span className="ic-toast-icon">
            {slotNotification.type === "success" && "✓"}
            {slotNotification.type === "info" && "ℹ"}
            {slotNotification.type === "warning" && "⚠️"}
          </span>
          <span className="ic-toast-text">{slotNotification.message}</span>
          <button
            type="button"
            className="ic-toast-close"
            onClick={() => setSlotNotification(null)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      <IngredientDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ingredient={selectedIngredient}
      />

      <Footer />
    </>
  );
}
