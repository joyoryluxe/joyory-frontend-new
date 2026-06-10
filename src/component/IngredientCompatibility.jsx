// src/component/IngredientCompatibility.jsx
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  checkCompatibility,
  listIngredients,
  listAllProducts,
  scanIngredientText
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
import "../css/IngredientCompatibility.css";

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

  // --- TAB 3: OCR RAW TEXT STATE ---
  const [ocrText, setOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

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

  // Fetch catalog products when Tab 2 is active
  useEffect(() => {
    if (activeTab === "products" && catalogProducts.length === 0) {
      const fetchProducts = async () => {
        setProductsLoading(true);
        try {
          const res = await listAllProducts({ limit: 50 });
          let products = [];
          if (res.data && Array.isArray(res.data.products)) {
            products = res.data.products;
          } else if (Array.isArray(res.data)) {
            products = res.data;
          }
          setCatalogProducts(products);
        } catch (err) {
          console.error("Error loading products list:", err);
        } finally {
          setProductsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [activeTab, catalogProducts.length]);

  // Tab 1: Autocomplete filtering
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }
    const val = searchInput.toLowerCase();
    const filtered = dbIngredients.filter(ing =>
      (ing.name.toLowerCase().includes(val) ||
        ing.aliases?.some(a => a.toLowerCase().includes(val))) &&
      !selectedIngredients.some(sel => sel.toLowerCase() === ing.name.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
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

  // --- ACTIONS: TAB 2 PRODUCTS ---
  const handleCheckProducts = async () => {
    if (!selectedProductA || !selectedProductB) return;
    setProductLoading(true);
    try {
      const rawA = selectedProductA.ingredients || [];
      const rawB = selectedProductB.ingredients || [];

      if (!rawA.length || !rawB.length) {
        setProductResult({
          compatible: true,
          verdict: "✅ Both products are compatible (no ingredient lists to compare)",
          conflicts: [],
          synergies: []
        });
        return;
      }

      const cleanIngredientName = (name) => {
        if (typeof name !== "string") return "";
        let clean = name.replace(/\([^)]*\)/g, ""); // Remove text inside parentheses
        clean = clean.replace(/[+*?^${}[\]\\]/g, ""); // Remove regex special characters
        return clean.trim();
      };

      const cleanToRawMap = {};
      const cleanA = [];
      const cleanB = [];

      rawA.forEach(ing => {
        const cleaned = cleanIngredientName(ing);
        if (cleaned) {
          cleanA.push(cleaned);
          cleanToRawMap[cleaned.toLowerCase()] = ing;
        }
      });

      rawB.forEach(ing => {
        const cleaned = cleanIngredientName(ing);
        if (cleaned) {
          cleanB.push(cleaned);
          cleanToRawMap[cleaned.toLowerCase()] = ing;
        }
      });

      // Escape ingredients to prevent RegExp syntax crash on backend
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const allCleanIngredients = [...new Set([...cleanA, ...cleanB])].map(escapeRegex);

      if (allCleanIngredients.length < 2) {
        setProductResult({
          compatible: true,
          verdict: "✅ Both products are compatible (insufficient active ingredients to compare)",
          conflicts: [],
          synergies: []
        });
        return;
      }

      const res = await checkCompatibility(allCleanIngredients);

      if (res.data.success) {
        const rawConflicts = res.data.conflicts || [];
        const conflicts = [];

        rawConflicts.forEach(c => {
          const name1 = c.ingredient1.toLowerCase();
          const name2 = c.ingredient2.toLowerCase();

          // Check if one ingredient is in A and the other in B
          const is1InA = cleanA.some(ing => ing.toLowerCase() === name1);
          const is2InB = cleanB.some(ing => ing.toLowerCase() === name2);
          const is2InA = cleanA.some(ing => ing.toLowerCase() === name2);
          const is1InB = cleanB.some(ing => ing.toLowerCase() === name1);

          if ((is1InA && is2InB) || (is2InA && is1InB)) {
            const matchedIngA = is1InA 
              ? (cleanToRawMap[name1] || c.ingredient1)
              : (cleanToRawMap[name2] || c.ingredient2);
            const matchedIngB = is2InB 
              ? (cleanToRawMap[name2] || c.ingredient2)
              : (cleanToRawMap[name1] || c.ingredient1);

            conflicts.push({
              pair: c.pair,
              ingredientA: matchedIngA,
              ingredientB: matchedIngB,
              reason: c.reason,
              severity: c.severity,
              advice: c.severity === "high"
                ? "❌ Do not use together in the same routine layer"
                : c.severity === "medium"
                  ? "⚠️ Use at different times of day (e.g. AM and PM)"
                  : "ℹ️ Use with caution if your skin is sensitive"
            });
          }
        });

        const synergies = [];
        const STANDARD_SYNERGIES = [
          { pair: ["vitamin c", "sunscreen_filter"], benefit: "Vitamin C boosts UV protection from sunscreen filters by neutralizing free radicals." },
          { pair: ["hyaluronic", "ceramide"], benefit: "Hyaluronic Acid hydrates while Ceramides lock in moisture to strengthen skin barrier." },
          { pair: ["niacinamide", "salicylic"], benefit: "Salicylic Acid purifies pores while Niacinamide calms redness and irritation." },
          { pair: ["retinol", "hyaluronic"], benefit: "Hyaluronic Acid offsets potential dryness and peeling caused by Retinol." }
        ];

        const matchTerm = (list, term) => {
          const sunscreenFilters = ["sunscreen", "zinc oxide", "titanium dioxide", "avobenzone", "octocrylene", "homosalate", "octisalate", "octinoxate", "mexoryl", "tinosorb"];
          if (term === "sunscreen_filter") {
            return list.some(ing => sunscreenFilters.some(filter => ing.toLowerCase().includes(filter)));
          }
          return list.some(ing => ing.toLowerCase().includes(term));
        };

        STANDARD_SYNERGIES.forEach(syn => {
          const t1 = syn.pair[0].toLowerCase();
          const t2 = syn.pair[1].toLowerCase();

          const hasT1InA = matchTerm(cleanA, t1);
          const hasT2InB = matchTerm(cleanB, t2);
          const hasT2InA = matchTerm(cleanA, t2);
          const hasT1InB = matchTerm(cleanB, t1);

          if ((hasT1InA && hasT2InB) || (hasT2InA && hasT1InB)) {
            synergies.push({
              pair: syn.pair.join(" + "),
              benefit: syn.benefit
            });
          }
        });

        const highConflicts = conflicts.filter(c => c.severity === "high");
        const compatible = highConflicts.length === 0;

        let verdict = "✅ Both products are fully compatible!";
        if (highConflicts.length > 0) {
          verdict = `❌ Conflict Warning: ${highConflicts.length} active conflict(s) detected. Avoid layering them together.`;
        } else if (conflicts.length > 0) {
          verdict = `⚠️ Warning: ${conflicts.length} caution compatibility warning(s) found. Try alternating days.`;
        }

        setProductResult({
          compatible,
          verdict,
          conflicts,
          synergies
        });
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
  const handleScanText = async () => {
    if (!ocrText.trim()) return;
    setOcrLoading(true);
    try {
      const res = await scanIngredientText(ocrText);
      if (res.data.success) {
        setOcrResult(res.data);
      }
    } catch (err) {
      console.error("Error scanning raw labels:", err);
      alert("Failed to analyze raw ingredient text.");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleResetOCR = () => {
    setOcrText("");
    setOcrResult(null);
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

  return (
    <>
      <Header />

      <div className="ic-container page-title-main-name">
        <div className="ic-card">
          <div className="text-center mb-4">
            <span className="ic-icon-header">🧪</span>
            <h2 className="fw-bold mt-2 text-dark">Ingredient Intelligence Labs</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "540px", fontSize: "14px" }}>
              Evaluate safety profiles, layering incompatibilities, and synergistic benefits using our clinical skincare intelligence engine.
            </p>
          </div>

          {/* Navigation Tabs (Modern Segmented Control) */}
          <div className="d-flex justify-content-center mb-4 bg-light p-1" style={{ borderRadius: "12px", border: "1px solid #fae5e9" }}>
            <button
              type="button"
              className={`btn flex-grow-1 py-2 fw-semibold border-0 d-flex align-items-center justify-content-center gap-1 ${activeTab === "ingredients" ? "bg-white text-dark shadow-sm" : "text-muted bg-transparent"}`}
              onClick={() => setActiveTab("ingredients")}
              style={{ fontSize: "13px", borderRadius: "10px", transition: "all 0.2s", color: activeTab === "ingredients" ? "#000" : "#6c757d" }}
            >
              <FaFlask /> Ingredient Layering
            </button>
            <button
              type="button"
              className={`btn flex-grow-1 py-2 fw-semibold border-0 d-flex align-items-center justify-content-center gap-1 ${activeTab === "products" ? "bg-white text-dark shadow-sm" : "text-muted bg-transparent"}`}
              onClick={() => setActiveTab("products")}
              style={{ fontSize: "13px", borderRadius: "10px", transition: "all 0.2s", color: activeTab === "products" ? "#000" : "#6c757d" }}
            >
              <FaBox /> Product Layering
            </button>
            <button
              type="button"
              className={`btn flex-grow-1 py-2 fw-semibold border-0 d-flex align-items-center justify-content-center gap-1 ${activeTab === "ocr" ? "bg-white text-dark shadow-sm" : "text-muted bg-transparent"}`}
              onClick={() => setActiveTab("ocr")}
              style={{ fontSize: "13px", borderRadius: "10px", transition: "all 0.2s", color: activeTab === "ocr" ? "#000" : "#6c757d" }}
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
                    className="btn btn-dark px-3"
                    onClick={() => addIngredient(searchInput)}
                    disabled={!searchInput.trim()}
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
              <div className="d-flex gap-2 mb-4">
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
                  {result.conflicts?.length === 0 ? (
                    <div className="p-3 rounded mb-3 bg-success bg-opacity-10 text-success border border-success border-opacity-25 d-flex gap-3 align-items-start">
                      <FaCheckCircle size={28} className="flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">Perfect Harmony!</h5>
                        <p className="mb-0 text-muted small">
                          All selected ingredients are fully compatible and can be safely layered or combined in your AM/PM routine. Remember to apply from thinnest texture to thickest texture!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded mb-3 bg-warning bg-opacity-10 text-warning-dark border border-warning border-opacity-25 d-flex gap-3 align-items-start" style={{ color: "#854d0e" }}>
                      <FaExclamationTriangle size={28} className="flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">Layering Caution Needed</h5>
                        <p className="mb-0 text-muted small">
                          We identified {result.conflicts.length} conflict(s). Review the pairing details below to adjust your application times.
                        </p>
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
                                {conflict.ingredient1} + {conflict.ingredient2}
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
                              <strong>💡 Layers Tip:</strong> {conflict.advice}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safe Ingredients Details */}
                  {result.safe?.length > 0 && (
                    <div className="mt-4">
                      <h5 className="fw-bold fs-6 mb-3 text-success d-flex align-items-center gap-2">
                        <FaCheckCircle className="text-success" size={16} />
                        <span>Safe Ingredients (No Conflicts):</span>
                      </h5>
                      <div className="d-flex flex-wrap gap-2">
                        {Array.from(new Set(result.safe)).map((ing, idx) => (
                          <span key={idx} className="ic-safe-badge">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredients not found in DB */}
                  {result.notFound?.length > 0 && (
                    <div className="mt-3 text-muted small">
                      Note: The following ingredients were not found in our intelligence library and could not be analyzed: <em>{Array.from(new Set(result.notFound)).join(", ")}</em>
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
                <label className="fw-bold text-dark mb-1 small d-flex align-items-center gap-2">
                  <span>💡 Quick Select Popular Products</span>
                </label>
                <p className="text-muted small mb-3" style={{ fontSize: "12px" }}>
                  Tap a bestseller to assign it to Product A or Product B slot instantly without searching.
                </p>

                {productsLoading && catalogProducts.length === 0 ? (
                  <div className="text-center py-3">
                    <span className="spinner-border spinner-border-sm text-dark me-2"></span>
                    <span className="small text-muted">Loading bestsellers...</span>
                  </div>
                ) : (
                  <div className="popular-products-scroll-wrapper">
                    <div className="d-flex gap-3 overflow-auto pb-2 scrollbar-thin" style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
                      {catalogProducts.map((p) => {
                        const imgUrl = p.variants?.[0]?.images?.[0] || p.image || "/placeholder.png";
                        return (
                          <div
                            key={p._id || p.id}
                            className="popular-product-mini-card"
                          >
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
                            <div className="d-flex gap-1 justify-content-center">
                              <button
                                type="button"
                                className="ic-mini-slot-btn"
                                onClick={() => {
                                  setSelectedProductA(p);
                                  setProductResult(null);
                                }}
                                disabled={selectedProductB?._id === p._id}
                              >
                                + Slot A
                              </button>
                              <button
                                type="button"
                                className="ic-mini-slot-btn"
                                onClick={() => {
                                  setSelectedProductB(p);
                                  setProductResult(null);
                                }}
                                disabled={selectedProductA?._id === p._id}
                              >
                                + Slot B
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                            <div className="p-3 text-center text-danger small fw-semibold">
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
                            <div className="p-3 text-center text-danger small fw-semibold">
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
              <div className="d-flex gap-2 mb-4">
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
                  {productResult.compatible ? (
                    <div className="p-3 rounded mb-4 bg-success bg-opacity-10 text-success border border-success border-opacity-25 d-flex gap-3 align-items-start">
                      <FaCheckCircle size={28} className="flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="fw-bold mb-1">Layering Approved</h5>
                        <p className="mb-0 text-muted small">{productResult.verdict}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded mb-4 bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 d-flex gap-3 align-items-start">
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
                      <h5 className="fw-bold fs-6 mb-2 text-success">Formulation Synergies Detected:</h5>
                      <div className="d-flex flex-column gap-2">
                        {productResult.synergies.map((syn, idx) => (
                          <div key={idx} className="p-2 border rounded  bg-opacity-5" style={{ fontSize: "12.5px" }}>
                            <strong className="text-success uppercase d-block mb-1">{syn.pair.toUpperCase()}</strong>
                            <span className="text-muted">{syn.benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conflicts Listing */}
                  {productResult.conflicts?.length > 0 ? (
                    <div className="mt-3">
                      <h5 className="fw-bold fs-6 mb-2 text-danger">Formulation Conflicts:</h5>
                      <div className="d-flex flex-column gap-3">
                        {productResult.conflicts.map((conflict, idx) => (
                          <div key={idx} className="p-3 border rounded bg-white shadow-sm">
                            <div className="ic-conflict-header">
                              <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14px" }}>
                                {conflict.ingredientA} vs {conflict.ingredientB}
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
              <div className="d-flex gap-2 mb-4">
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

              {/* Results */}
              {ocrResult && (
                <div className="mt-4 border-top pt-4 text-start">
                  {/* Summary Metric Banners */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="p-2 border rounded text-center bg-light">
                        <span className="d-block text-muted small" style={{ fontSize: "11px" }}>Total Parsed</span>
                        <strong className="fs-5 text-dark">{ocrResult.totalIngredients}</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 border rounded text-center bg-light">
                        <span className="d-block text-muted small" style={{ fontSize: "11px" }}>Decoded Library</span>
                        <strong className="fs-5 text-dark">{ocrResult.decodedCount}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Allergen Warning Banner */}
                  {(ocrResult.allergenWarnings?.length > 0 || ocrResult.sensitiveWarnings?.length > 0) && (
                    <div className="alert alert-danger p-3 rounded mb-4 text-start border-0" style={{ backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "12px" }}>
                      <h5 className="fw-bold fs-6 mb-1 d-flex align-items-center gap-2" style={{ color: "#991b1b" }}>
                        <FaExclamationTriangle /> Warning: Allergen Match
                      </h5>
                      <ul className="ps-3 mb-0 small" style={{ color: "#991b1b" }}>
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
                  )}

                  {/* Interactive Ingredients Badges */}
                  <div>
                    <h5 className="fw-bold fs-6 mb-2">Decoded Ingredients Details:</h5>
                    <p className="text-muted small mb-2">Click on any decoded ingredient badge to view benefits, category description, and usage tips.</p>
                    <div className="d-flex flex-wrap gap-2">
                      {ocrResult.ingredients?.map((ing, idx) => {
                        let badgeClass = "ic-decoded-badge";
                        if (ing.isAllergen) badgeClass += " ic-decoded-allergen";
                        else if (ing.isSensitive) badgeClass += " ic-decoded-sensitive";
                        else badgeClass += " ic-decoded-safe";

                        return (
                          <span
                            key={idx}
                            className={badgeClass}
                            style={{
                              cursor: ing.decoded ? "pointer" : "default"
                            }}
                            onClick={() => ing.decoded && handleIngredientClick(ing)}
                            title={ing.decoded ? "Click to inspect details" : "Unknown ingredient"}
                          >
                            {ing.name} {ing.isAllergen && "⚠️"} {ing.isSensitive && "⚠️"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <IngredientDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ingredient={selectedIngredient}
      />

      <Footer />
    </>
  );
}
