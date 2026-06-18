import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaChevronRight, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/BrandFilter.css";

// Default empty filter shape used as fallback
const EMPTY_FILTERS = {
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
};

const BrandFilter = ({
    filters,
    setFilters,
    onClose,
    filterData = null,
    onClearCategory,
    onCategoryPillClick,
    activeCategorySlug,
    activeCategoryName = "",
    trendingCategories = [],
    // 👇 New prop – the filter state to reset to
    defaultFilters,
}) => {
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [chipsExpanded, setChipsExpanded] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Merge the passed defaultFilters with the empty shape
    const mergedDefault = useMemo(() => {
        if (!defaultFilters) return EMPTY_FILTERS;
        return { ...EMPTY_FILTERS, ...defaultFilters };
    }, [defaultFilters]);

    const {
        brands: rawBrands = [],
        categories: rawCategories = [],
        skinTypes: rawSkinTypes = [],
        formulations: rawFormulations = [],
        finishes: rawFinishes = [],
        ingredients: rawIngredients = [],
        priceRanges = [],
        discountRanges = [],
    } = filterData || {};

    const deduplicate = (arr) => {
        if (!Array.isArray(arr)) return [];
        const seen = new Set();
        return arr.filter((item) => {
            if (!item) return false;
            const k = item.slug || item._id || item.id || item.name || "";
            if (!k || seen.has(k)) return false;
            seen.add(k);
            return true;
        });
    };

    const brands = useMemo(() => deduplicate(rawBrands), [rawBrands]);
    const categories = useMemo(() => deduplicate(rawCategories), [rawCategories]);
    const skinTypes = useMemo(() => deduplicate(rawSkinTypes), [rawSkinTypes]);
    const formulations = useMemo(() => deduplicate(rawFormulations), [rawFormulations]);
    const finishes = useMemo(() => deduplicate(rawFinishes), [rawFinishes]);
    const ingredients = useMemo(() => deduplicate(rawIngredients), [rawIngredients]);

    /* ─── CORE TOGGLE LOGIC ────────────────────────────────────── */
    const handleToggleFilter = (key, value) => {
        if (!value) return;
        setFilters((prev) => {
            const currentList = [...(prev[key] || [])];
            const index = currentList.indexOf(value);
            let newList;
            if (index > -1) {
                newList = currentList.filter((item) => item !== value);
            } else {
                newList = [...currentList, value];
            }
            return { ...prev, [key]: newList };
        });
    };

    const handlePriceSelection = (range) => {
        setFilters((prev) => ({
            ...prev,
            priceRange: range ? { min: range.min, max: range.max } : null,
        }));
    };

    const handleDiscountSelection = (minVal) => {
        setFilters((prev) => ({
            ...prev,
            discountMin: prev.discountMin === minVal ? null : minVal,
        }));
    };

    // Reset to the default state (instead of empty)
    const clearAll = () => {
        setFilters(mergedDefault);
        setExpandedIds(new Set());
    };

    /* ─── CATEGORY HELPERS (HIERARCHICAL) ─────────────────────── */
    const childrenMap = useMemo(() => {
        const map = {};
        categories.forEach((cat) => {
            const parentId = cat.parent || null;
            if (!map[parentId]) map[parentId] = [];
            map[parentId].push(cat);
        });
        return map;
    }, [categories]);

    const rootCategories = useMemo(() => {
        return categories.filter(
            (cat) => !cat.parent || !categories.some((c) => c._id === cat.parent)
        );
    }, [categories]);

    const toggleExpand = (catId) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(catId) ? next.delete(catId) : next.add(catId);
            return next;
        });
    };

    /* ─── ACTIVE CHIPS ────────────────────────────────────────── */
    const activeChips = useMemo(() => {
        const chips = [];
        const sections = [
            { key: "brandIds", list: brands, field: "slug" },
            { key: "categoryIds", list: categories, field: "slug" },
            { key: "skinTypes", list: skinTypes, field: "slug" },
            { key: "formulations", list: formulations, field: "name" },
            { key: "finishes", list: finishes, field: "slug" },
            { key: "ingredients", list: ingredients, field: "slug" },
        ];

        sections.forEach((sec) => {
            (filters[sec.key] || []).forEach((v) => {
                const item = sec.list.find((i) => i[sec.field] === v || i._id === v || (i.slug && i.slug === v));
                if (item) {
                    chips.push({ group: sec.key, val: v, label: item.name || v });
                }
            });
        });

        if (filters.discountMin != null) {
            const d = discountRanges.find((dr) => dr.min === filters.discountMin);
            chips.push({ group: "discountMin", val: filters.discountMin, label: d?.label || `${filters.discountMin}% Off` });
        }
        if (filters.priceRange) {
            const p = priceRanges.find((pr) =>
                pr.min === filters.priceRange.min && pr.max === filters.priceRange.max
            );
            chips.push({ group: "priceRange", val: null, label: p?.label || "Price Filter" });
        }

        // Category pill from navigation
        if (activeCategorySlug) {
            const catName = activeCategoryName ||
                trendingCategories.find(c => c.slug === activeCategorySlug)?.name ||
                activeCategorySlug;
            chips.push({
                group: "categoryPill",
                val: activeCategorySlug,
                label: catName,
                isPill: true,
            });
        }

        return chips;
    }, [filters, filterData, activeCategorySlug, activeCategoryName, trendingCategories]);

    // 👇 True when current filters exactly match the default state
    const isDefault = useMemo(() => {
        // Shallow compare the relevant keys (ignore dynamic keys we never use)
        const compareKeys = [
            "brandIds",
            "categoryIds",
            "skinTypes",
            "formulations",
            "finishes",
            "ingredients",
            "priceRange",
            "discountMin",
        ];
        for (let key of compareKeys) {
            const a = filters[key];
            const b = mergedDefault[key];
            if (key === "priceRange") {
                if (a && b) {
                    if (a.min !== b.min || a.max !== b.max) return false;
                } else if (a !== b) return false;
            } else if (key === "discountMin") {
                if (a !== b) return false;
            } else {
                if ((a || []).length !== (b || []).length) return false;
                if (a && b && !a.every(v => b.includes(v))) return false;
            }
        }
        return true;
    }, [filters, mergedDefault]);

    /* ─── CATEGORY RENDER (HIERARCHICAL) ───────────────────────── */
    const renderCategoryNode = (cat, depth = 0) => {
        const children = childrenMap[cat._id] || [];
        const hasChildren = children.length > 0;
        const isExpanded = expandedIds.has(cat._id);
        const isChecked = (filters.categoryIds || []).includes(cat._id) ||
            (filters.categoryIds || []).includes(cat.slug) ||
            ((filters.categoryIds || []).length === 0 && activeCategorySlug === cat.slug);

        return (
            <div key={cat._id} className="mb-1">
                <div className="d-flex align-items-center" style={{ marginLeft: `${depth * 16}px` }}>
                    <span
                        onClick={() => hasChildren && toggleExpand(cat._id)}
                        style={{ width: 24, cursor: hasChildren ? "pointer" : "default", color: "#666" }}
                    >
                        {hasChildren && (isExpanded ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />)}
                    </span>

                    <div className="form-check mb-0 flex-grow-1">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`cat-${cat.slug || cat._id}`}
                            checked={isChecked}
                            onChange={() => {
                                if (onCategoryPillClick) {
                                    onCategoryPillClick(cat);
                                } else {
                                    handleToggleFilter("categoryIds", cat.slug || cat._id);
                                }
                            }}
                        />
                        <label
                            className={`form-check-label d-flex justify-content-between ${isChecked ? "fw-bold text-primary" : ""}`}
                            htmlFor={`cat-${cat.slug || cat._id}`}
                            style={{ cursor: "pointer", fontSize: "14px", fontWeight: depth === 0 ? "600" : "400" }}
                            onClick={(e) => {
                                if (onCategoryPillClick) {
                                    e.preventDefault();
                                    onCategoryPillClick(cat);
                                }
                            }}
                        >
                            <span>{cat.name}</span>
                            {cat.count > 0 && <small className="text-muted">({cat.count})</small>}
                        </label>
                    </div>
                </div>

                {isExpanded && children.map((child) => renderCategoryNode(child, depth + 1))}
            </div>
        );
    };

    if (!filterData) {
        return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;
    }

    return (
        <div className={`filter-sidebar page-title-main-name ${isMobile ? "" : "border bg-white shadow-sm"}`}
            style={isMobile ? {
                position: "static",
                borderRadius: "0",
                overflowY: "visible",
                maxHeight: "none"
            } : {
                position: "sticky",
                top: "140px",
                borderRadius: "12px",
                overflowY: "auto",
                maxHeight: "calc(100vh - 170px)"
            }}>

            {/* Header */}
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                <h6 className="mb-0 fw-semibold">Filters</h6>
                {/* 👇 Button visible when chips exist, DISABLED if already at default state */}
                {activeChips.length > 0 && (
                    <button
                        className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0"
                        onClick={clearAll}
                        disabled={isDefault}
                        style={{ opacity: isDefault ? 0.5 : 1, cursor: isDefault ? "not-allowed" : "pointer" }}
                    >
                        Reset All
                    </button>
                )}
            </div>

            {/* Active Chips */}
            {activeChips.length > 0 && (
                <>
                    <div className="height-selcted-section p-2">
                        {(chipsExpanded ? activeChips : activeChips.slice(0, 3)).map((chip, idx) => (
                            <span key={idx} className="height-selcted-section-sub" style={{ fontSize: "11px" }}>
                                {chip.isPill && <span style={{ opacity: 0.75 }}>Category: </span>}
                                {chip.label}
                                <FaTimes
                                    style={{ cursor: "pointer", marginLeft: 6 }}
                                    onClick={() => {
                                        if (chip.group === "categoryPill") {
                                            if (onClearCategory) onClearCategory();
                                        } else if (chip.group === "priceRange") {
                                            handlePriceSelection(null);
                                        } else if (chip.group === "discountMin") {
                                            handleDiscountSelection(null);
                                        } else {
                                            handleToggleFilter(chip.group, chip.val);
                                        }
                                    }}
                                />
                            </span>
                        ))}
                    </div>
                    {activeChips.length > 3 && (
                        <div className="px-3 pb-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold text-dark d-flex align-items-center gap-1"
                                onClick={() => setChipsExpanded(!chipsExpanded)}
                                style={{ fontSize: "13px", border: "none", background: "none" }}
                            >
                                {chipsExpanded ? (
                                    <>
                                        View less <FaChevronUp size={11} />
                                    </>
                                ) : (
                                    <>
                                        View more <FaChevronDown size={11} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}

            <div className="accordion accordion-flush" id="mainFilterAccordion">
                {/* ==================== CATEGORIES (HIERARCHICAL) ==================== */}
                <div className="accordion-item">
                    <h2 className="accordion-header pb-0 mb-0">
                        <button className="accordion-button text-black fw-normal" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCats">
                            Categories
                            {activeCategoryName && (
                                <span className="ms-2 text-muted" style={{ fontSize: 12 }}>
                                    › {activeCategoryName}
                                </span>
                            )}
                        </button>
                    </h2>
                    <div id="collapseCats" className="accordion-collapse collapse show">
                        <div className="accordion-body p-3" style={{ maxHeight: "320px", overflowY: "auto" }}>
                            {rootCategories.length > 0 ? (
                                rootCategories.map((cat) => renderCategoryNode(cat))
                            ) : (
                                <div className="text-muted small text-center py-3">No categories available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBrands">
                                Brands
                            </button>
                        </h2>
                        <div id="collapseBrands" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
                                {brands.map((b) => (
                                    <div key={b.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`brand-${b.slug}`}
                                            checked={(filters.brandIds || []).includes(b.slug)}
                                            onChange={() => handleToggleFilter("brandIds", b.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.brandIds || []).includes(b.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`brand-${b.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{b.name}</span>
                                            <small className="text-muted">({b.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Skin Type */}
                {skinTypes.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSkin">
                                Skin Type
                            </button>
                        </h2>
                        <div id="collapseSkin" className="accordion-collapse collapse">
                            <div className="accordion-body p-3">
                                {skinTypes.map((st) => (
                                    <div key={st.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`st-${st.slug}`}
                                            checked={(filters.skinTypes || []).includes(st.slug)}
                                            onChange={() => handleToggleFilter("skinTypes", st.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.skinTypes || []).includes(st.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`st-${st.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{st.name}</span>
                                            <small className="text-muted">({st.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Formulation */}
                {formulations.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm">
                                Formulation
                            </button>
                        </h2>
                        <div id="collapseForm" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {formulations.map((item) => {
                                    const valueToUse = item.slug || item.name;
                                    const isChecked = (filters.formulations || []).includes(valueToUse);
                                    return (
                                        <div key={item._id || item.name} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`form-${item._id}`}
                                                checked={isChecked}
                                                onChange={() => handleToggleFilter("formulations", valueToUse)}
                                            />
                                            <label className={`form-check-label d-flex justify-content-between w-100 ${isChecked ? "fw-bold text-primary" : ""}`} htmlFor={`form-${item._id}`} style={{ cursor: "pointer" }}>
                                                <span>{item.name}</span>
                                                <small className="text-muted">({item.count || 0})</small>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Finish */}
                {finishes.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFinish">
                                Finish
                            </button>
                        </h2>
                        <div id="collapseFinish" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {finishes.map((item) => (
                                    <div key={item.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`fin-${item.slug}`}
                                            checked={(filters.finishes || []).includes(item.slug)}
                                            onChange={() => handleToggleFilter("finishes", item.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.finishes || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`fin-${item.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{item.name}</span>
                                            <small className="text-muted">({item.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Ingredients */}
                {ingredients.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIng">
                                Ingredients
                            </button>
                        </h2>
                        <div id="collapseIng" className="accordion-collapse collapse">
                            <div className="accordion-body p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {ingredients.map((item) => (
                                    <div key={item.slug} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`ing-${item.slug}`}
                                            checked={(filters.ingredients || []).includes(item.slug)}
                                            onChange={() => handleToggleFilter("ingredients", item.slug)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${(filters.ingredients || []).includes(item.slug) ? "fw-bold text-primary" : ""}`} htmlFor={`ing-${item.slug}`} style={{ cursor: "pointer" }}>
                                            <span>{item.name}</span>
                                            <small className="text-muted">({item.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Discount */}
                {discountRanges.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDiscount">
                                Discount
                            </button>
                        </h2>
                        <div id="collapseDiscount" className="accordion-collapse collapse">
                            <div className="accordion-body p-3">
                                {discountRanges.map((d, i) => (
                                    <div key={i} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`disc-${i}`}
                                            checked={filters.discountMin === d.min}
                                            onChange={() => handleDiscountSelection(d.min)}
                                        />
                                        <label className={`form-check-label d-flex justify-content-between w-100 ${filters.discountMin === d.min ? "fw-bold text-primary" : ""}`} htmlFor={`disc-${i}`} style={{ cursor: "pointer" }}>
                                            <span>{d.label}</span>
                                            <small className="text-muted">({d.count})</small>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Price Range */}
                {priceRanges.length > 0 && (
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button fw-normal collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrice">
                                Price Range
                            </button>
                        </h2>
                        <div id="collapsePrice" className="accordion-collapse collapse">
                            <div className="accordion-body p-3">
                                {priceRanges.map((p, i) => {
                                    const isSelected =
                                        filters.priceRange?.min === p.min &&
                                        filters.priceRange?.max === p.max;
                                    return (
                                        <div key={i} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="priceRangeRadio"
                                                id={`price-${i}`}
                                                checked={isSelected}
                                                onChange={() => handlePriceSelection(p)}
                                            />
                                            <label className={`form-check-label ${isSelected ? "fw-bold text-primary" : ""}`} htmlFor={`price-${i}`} style={{ cursor: "pointer" }}>
                                                {p.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {onClose && (
                <div className="p-3 d-lg-none bg-light border-top">
                    <button className="btn btn-dark w-100 fw-bold" onClick={onClose}>
                        Show Results
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrandFilter;





//=========================================================================Done-Code(End)================================================================================












