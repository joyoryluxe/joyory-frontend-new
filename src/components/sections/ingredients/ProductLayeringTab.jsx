import React from 'react';
import {
    FaSearch,
    FaUndo,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
} from 'react-icons/fa';

export default function ProductLayeringTab({
    catalogProducts = [],
    productsLoading = false,
    selectedProductA,
    setSelectedProductA,
    selectedProductB,
    setSelectedProductB,
    productASearch = "",
    setProductASearch,
    productBSearch = "",
    setProductBSearch,
    productASuggestions = [],
    setProductASuggestions,
    productBSuggestions = [],
    setProductBSuggestions,
    productASearchLoading = false,
    productBSearchLoading = false,
    productResult,
    setProductResult,
    productLoading = false,
    onCheckProducts,
    onResetProducts,
    onIngredientNameClick,
}) {
    return (
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
                        <div className="d-flex gap-3 overflow-auto pb-2 pt-2 scrollbar-thin" style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
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
                                        <div className="ic-mini-slot-tray">
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

            {/* Action Check Products */}
            <div className="d-flex gap-2 mb-4 w-50 m-auto Compatibility-btn">
                <button
                    className="ic-action-btn-primary"
                    onClick={onCheckProducts}
                    disabled={!selectedProductA || !selectedProductB || productLoading}
                >
                    {productLoading ? "Analyzing Layering Pairing..." : "Check Layering"}
                </button>
                <button
                    className="ic-action-btn-reset"
                    onClick={onResetProducts}
                    title="Reset Products"
                >
                    <FaUndo />
                </button>
            </div>

            {/* Product Layering Analysis Results */}
            {productResult && (
                <div className="mt-4 border-top pt-4 text-start">
                    {productResult.compatible ? (
                        <div className="ic-alert ic-alert-success mb-3">
                            <FaCheckCircle size={28} className="flex-shrink-0 mt-1" />
                            <div>
                                <h5 className="fw-bold mb-1">Products Compatible!</h5>
                                <p className="mb-0 text-muted small">{productResult.verdict}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="ic-alert ic-alert-danger mb-3">
                            <FaExclamationTriangle size={28} className="flex-shrink-0 mt-1" />
                            <div>
                                <h5 className="fw-bold mb-1">Layering Conflicts Found</h5>
                                <p className="mb-0 text-muted small">{productResult.verdict}</p>
                            </div>
                        </div>
                    )}

                    {/* Active Conflicts List */}
                    {productResult.conflicts?.length > 0 && (
                        <div className="mt-3">
                            <h5 className="fw-bold fs-6 mb-2">Cross-Product Incompatibilities:</h5>
                            <div className="d-flex flex-column gap-3">
                                {productResult.conflicts.map((c, idx) => (
                                    <div key={idx} className="p-3 border rounded bg-white shadow-sm">
                                        <div className="ic-conflict-header">
                                            <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14px" }}>
                                                <span
                                                    className="ic-clickable-ingredient"
                                                    onClick={() => onIngredientNameClick(c.ingredientA)}
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                >
                                                    {c.ingredientA} (In Product A)
                                                </span>
                                                {" + "}
                                                <span
                                                    className="ic-clickable-ingredient"
                                                    onClick={() => onIngredientNameClick(c.ingredientB)}
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                >
                                                    {c.ingredientB} (In Product B)
                                                </span>
                                            </h6>
                                            <span className={`ic-severity-badge ic-severity-${c.severity || 'low'}`}>
                                                {c.severity?.toUpperCase()} SEVERITY
                                            </span>
                                        </div>
                                        <div className="d-flex gap-2 align-items-start text-muted mb-2 mt-2" style={{ fontSize: "12.5px" }}>
                                            <FaInfoCircle className="flex-shrink-0 mt-1" />
                                            <span><strong>Concern:</strong> {c.reason}</span>
                                        </div>
                                        <div className="bg-light p-2 rounded small fw-medium" style={{ fontSize: "12.5px" }}>
                                            <strong>Dermatologist Advice:</strong> {c.advice}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Synergies List */}
                    {productResult.synergies?.length > 0 && (
                        <div className="mt-4">
                            <h5 className="fw-bold fs-6 mb-2 ic-text-green d-flex align-items-center gap-2">
                                <FaCheckCircle size={16} /> Synergistic Benefits:
                            </h5>
                            <div className="d-flex flex-column gap-2">
                                {productResult.synergies.map((s, idx) => (
                                    <div key={idx} className="p-3 border rounded ic-bg-green-soft">
                                        <strong className="text-dark d-block mb-1">{s.pair}</strong>
                                        <span className="text-muted small">{s.benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
