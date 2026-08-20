// src/component/IngredientCompatibility.jsx - Modularized with subcomponents
import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import {
  checkCompatibility,
  listIngredients,
  listAllProducts,
  scanIngredientText,
  getIngredientByName
} from "../../api/ingredientApi";
import IngredientDetailsDrawer from "./IngredientDetailsDrawer";
import {
  FaFlask,
  FaBox,
  FaBarcode
} from "react-icons/fa";
import "../../styles/IngredientCompatibility.css";

import IngredientSearchTab from "../../components/sections/ingredients/IngredientSearchTab";
import ProductLayeringTab from "../../components/sections/ingredients/ProductLayeringTab";
import RawLabelScannerTab from "../../components/sections/ingredients/RawLabelScannerTab";

const PRESETS = [
  { label: "Retinol + Vitamin C", ingredients: ["Retinol", "Vitamin C"] },
  { label: "Niacinamide + Vitamin C", ingredients: ["Niacinamide", "Vitamin C"] },
  { label: "Salicylic Acid + Retinol", ingredients: ["Salicylic Acid", "Retinol"] },
  { label: "Hyaluronic Acid + Retinol", ingredients: ["Hyaluronic Acid", "Retinol"] }
];

export default function IngredientCompatibility() {
  const [activeTab, setActiveTab] = useState("ingredients");

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

  // Fetch standard ingredients on mount
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

  // Tab 2: Autocomplete Product A filtering
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

  // Tab 2: Autocomplete Product B filtering
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
        let clean = name.replace(/\([^)]*\)/g, "");
        clean = clean.replace(/[+*?^${}[\]\\]/g, "");
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
      let found = dbIngredients.find(
        ing => ing.name.toLowerCase() === name.toLowerCase() ||
               ing.aliases?.some(a => a.toLowerCase() === name.toLowerCase())
      );

      if (found) {
        handleIngredientClick(found);
      } else {
        const res = await getIngredientByName(name);
        if (res.data.success && res.data.ingredient) {
          handleIngredientClick(res.data.ingredient);
        } else {
          handleIngredientClick({
            name: name,
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
      handleIngredientClick({
        name: name,
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
            <h2 className="fw-bold mt-2 text-dark">Ingredient Intelligence Labs</h2>
            <p className="text-muted mx-auto mb-5" style={{ maxWidth: "540px", fontSize: "14px" }}>
              Evaluate safety profiles, layering incompatibilities, and synergistic benefits using our clinical skincare intelligence engine.
            </p>
          </div>

          {/* Navigation Tabs */}
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

          {/* Tab 1: Ingredient Layering */}
          {activeTab === "ingredients" && (
            <IngredientSearchTab
              presets={PRESETS}
              selectedIngredients={selectedIngredients}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              suggestions={suggestions}
              result={result}
              loading={loading}
              onAddIngredient={addIngredient}
              onRemoveIngredient={removeIngredient}
              onCheckIngredients={handleCheckIngredients}
              onLoadPreset={loadPreset}
              onResetIngredients={handleResetIngredients}
              onIngredientNameClick={handleIngredientNameClick}
            />
          )}

          {/* Tab 2: Product Layering */}
          {activeTab === "products" && (
            <ProductLayeringTab
              catalogProducts={catalogProducts}
              productsLoading={productsLoading}
              selectedProductA={selectedProductA}
              setSelectedProductA={setSelectedProductA}
              selectedProductB={selectedProductB}
              setSelectedProductB={setSelectedProductB}
              productASearch={productASearch}
              setProductASearch={setProductASearch}
              productBSearch={productBSearch}
              setProductBSearch={setProductBSearch}
              productASuggestions={productASuggestions}
              setProductASuggestions={setProductASuggestions}
              productBSuggestions={productBSuggestions}
              setProductBSuggestions={setProductBSuggestions}
              productASearchLoading={productASearchLoading}
              productBSearchLoading={productBSearchLoading}
              productResult={productResult}
              setProductResult={setProductResult}
              productLoading={productLoading}
              onCheckProducts={handleCheckProducts}
              onResetProducts={handleResetProducts}
              onIngredientNameClick={handleIngredientNameClick}
            />
          )}

          {/* Tab 3: Raw Label Scanner */}
          {activeTab === "ocr" && (
            <RawLabelScannerTab
              ocrText={ocrText}
              setOcrText={setOcrText}
              ocrLoading={ocrLoading}
              ocrResult={ocrResult}
              onScanText={handleScanText}
              onResetOCR={handleResetOCR}
              onIngredientClick={handleIngredientClick}
            />
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
