import React from 'react';
import {
    FaSearch, FaTrash, FaExclamationTriangle,
} from 'react-icons/fa';

export default function RoutineStepEditor({
    step,
    idx,
    displayIndex,
    allProducts = [],
    searchQueries = {},
    showDropdown = {},
    onSearchChange,
    onStepProductSelect,
    onStepVariantChange,
    onStepTextChange,
    onOpenAlternatives,
    onRemoveStep,
    onMoveStep,
    onAddToCart,
    totalSteps,
    getFilteredProducts,
}) {
    return (
        <div
            className={`rb-step-card ${step.allergenAlert ? "allergen-warning-border" : ""}`}
            style={{
                border: "1px solid #374151",
                borderRadius: "10px",
                padding: "18px",
                background: "#ffffff",
                marginBottom: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            {/* Top Row: Step Index & Title + Trash Icon */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    <span
                        style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            border: "1px solid #d1d5db",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.78rem",
                            fontWeight: "600",
                            color: "#374151",
                            background: "#ffffff"
                        }}
                    >
                        {displayIndex !== undefined ? displayIndex : idx + 1}
                    </span>
                    <span className="fw-semibold" style={{ fontSize: "0.9rem", color: "#111827" }}>
                        Select Product *
                    </span>
                </div>
                <button
                    type="button"
                    className="btn btn-link text-muted p-0"
                    style={{ fontSize: "0.9rem", color: "#6b7280" }}
                    title="Remove Step"
                    onClick={() => onRemoveStep(idx)}
                >
                    <FaTrash />
                </button>
            </div>

            {/* Product Selected Card OR Search Box */}
            {step.product ? (
                <div
                    className="p-3 text-center"
                    style={{
                        background: "#fafafa",
                        border: "1px solid #f3f4f6",
                        borderRadius: "8px"
                    }}
                >
                    {step.productImage && (
                        <img
                            src={step.productImage}
                            alt={step.productName}
                            style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "contain",
                                margin: "0 auto 8px auto",
                                display: "block"
                            }}
                        />
                    )}
                    <div
                        className="fw-bold text-dark"
                        style={{ fontSize: "0.9rem", lineHeight: "1.3", marginBottom: "4px" }}
                    >
                        {step.productName}
                    </div>

                    {step.timeOfDay === "both" && (
                        <div className="my-1">
                            <span
                                style={{
                                    background: "#ecfdf5",
                                    color: "#059669",
                                    border: "1px solid #a7f3d0",
                                    borderRadius: "12px",
                                    padding: "2px 10px",
                                    fontSize: "0.72rem",
                                    fontWeight: "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                }}
                            >
                                ✨ Shared AM/PM Product
                            </span>
                        </div>
                    )}

                    {step.variants && step.variants.length > 1 ? (
                        <div className="mt-2 d-flex align-items-center justify-content-center gap-2">
                            <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Variant:</span>
                            <select
                                value={step.selectedSku || ""}
                                onChange={(e) => onStepVariantChange(idx, e.target.value)}
                                className="form-select form-select-sm"
                                style={{ width: "auto", fontSize: "0.78rem", padding: "2px 8px", borderRadius: "4px" }}
                            >
                                {step.variants.map((v) => (
                                    <option key={v.sku} value={v.sku}>
                                        {v.shadeName || v.name || v.sku}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : step.selectedSku ? (
                        <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "2px" }}>
                            SKU: {step.selectedSku}
                        </div>
                    ) : null}

                    <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id={`chk-own-${idx}-${displayIndex || 0}`}
                            checked={step.isOwned || false}
                            onChange={(e) => onStepTextChange(idx, "isOwned", e.target.checked)}
                            style={{ cursor: "pointer", width: "15px", height: "15px" }}
                        />
                        <label
                            htmlFor={`chk-own-${idx}-${displayIndex || 0}`}
                            style={{
                                margin: 0,
                                fontSize: "0.82rem",
                                cursor: "pointer",
                                color: "#4b5563"
                            }}
                        >
                            I already own this product
                        </label>
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            style={{
                                fontSize: "0.78rem",
                                padding: "2px 12px",
                                borderRadius: "4px",
                                background: "#ffffff"
                            }}
                            onClick={() => onOpenAlternatives(step.product, idx)}
                        >
                            Alternatives
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                            style={{ fontSize: "0.78rem", fontWeight: "600" }}
                            onClick={() => onStepProductSelect(idx, { _id: "", name: "", variants: [] })}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="d-flex align-items-center bg-white border rounded px-3" style={{ position: "relative" }}>
                        <FaSearch className="text-muted me-2" />
                        <input
                            type="text"
                            placeholder="Search product from catalog..."
                            value={searchQueries[idx] || ""}
                            onChange={(e) => onSearchChange(idx, e.target.value)}
                            className="form-control border-0 shadow-none ps-1"
                            style={{ fontSize: "0.88rem" }}
                        />
                    </div>
                    {showDropdown[idx] && searchQueries[idx]?.trim() && (
                        <div className="rb-search-results-dropdown">
                            {getFilteredProducts(searchQueries[idx]).length === 0 ? (
                                <div className="p-3 text-muted text-center" style={{ fontSize: "0.85rem" }}>
                                    No matching products found.
                                </div>
                            ) : (
                                getFilteredProducts(searchQueries[idx]).map((prod) => (
                                    <div
                                        key={prod._id}
                                        className="rb-search-item"
                                        onClick={() => onStepProductSelect(idx, prod)}
                                    >
                                        <img
                                            src={prod.variants?.[0]?.images?.[0] || prod.image || "/placeholder.png"}
                                            alt={prod.name}
                                            className="rb-search-item-img"
                                        />
                                        <div className="rb-search-item-info">
                                            <div className="rb-search-item-name">{prod.name}</div>
                                            <div className="rb-search-item-brand">
                                                {typeof prod.brand === "string" ? prod.brand : prod.brand?.name}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Inputs: Apply Slot */}
            <div className="mt-3">
                <label className="form-label mb-1" style={{ fontSize: "0.82rem", fontWeight: "600", color: "#374151" }}>
                    Apply Slot
                </label>
                <select
                    value={step.timeOfDay || "both"}
                    onChange={(e) => onStepTextChange(idx, "timeOfDay", e.target.value)}
                    className="form-select form-select-sm"
                    style={{ borderRadius: "6px", padding: "7px 10px", fontSize: "0.85rem" }}
                >
                    <option value="both">AM + PM Both</option>
                    <option value="AM">AM Only</option>
                    <option value="PM">PM Only</option>
                </select>
            </div>

            {/* Inputs: Personal Note */}
            <div className="mt-2">
                <label className="form-label mb-1" style={{ fontSize: "0.82rem", fontWeight: "600", color: "#374151" }}>
                    Personal Note
                </label>
                <input
                    type="text"
                    placeholder="e.g. Remove overnight oils"
                    value={step.note || ""}
                    onChange={(e) => onStepTextChange(idx, "note", e.target.value)}
                    className="form-control form-control-sm"
                    style={{ borderRadius: "6px", padding: "7px 10px", fontSize: "0.85rem" }}
                />
            </div>

            {/* Inputs: Application Tip */}
            <div className="mt-2">
                <label className="form-label mb-1" style={{ fontSize: "0.82rem", fontWeight: "600", color: "#374151" }}>
                    Application Tip
                </label>
                <input
                    type="text"
                    placeholder="e.g. Use lukewarm water. Cleanse for 60 seconds"
                    value={step.applicationTip || ""}
                    onChange={(e) => onStepTextChange(idx, "applicationTip", e.target.value)}
                    className="form-control form-control-sm"
                    style={{ borderRadius: "6px", padding: "7px 10px", fontSize: "0.85rem" }}
                />
            </div>

            {/* Product Ownership Panel */}
            {step.product && (
                <div
                    className="mt-3 p-3"
                    style={{
                        background: "#fafafa",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px"
                    }}
                >
                    <div className="mb-2">
                        <label className="form-label mb-1" style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>
                            Step Importance
                        </label>
                        <select
                            value={step.isRequired !== false ? "true" : "false"}
                            onChange={(e) => onStepTextChange(idx, "isRequired", e.target.value === "true")}
                            className="form-select form-select-sm"
                            style={{ borderRadius: "6px", padding: "7px 10px", fontSize: "0.82rem" }}
                        >
                            <option value="true">Required Step (Crucial)</option>
                            <option value="false">Optional Step (Flexible)</option>
                        </select>
                    </div>

                    <div>
                        <label className="form-label mb-1" style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>
                            Do you already own this product?
                        </label>
                        <select
                            value={step.isOwned ? "true" : "false"}
                            onChange={(e) => onStepTextChange(idx, "isOwned", e.target.value === "true")}
                            className="form-select form-select-sm"
                            style={{ borderRadius: "6px", padding: "7px 10px", fontSize: "0.82rem" }}
                        >
                            <option value="false">No (Need to Buy)</option>
                            <option value="true">Yes (Already Owned)</option>
                        </select>
                    </div>

                    {step.isOwned && (
                        <div className="mt-2 pt-2 border-top">
                            <div className="mb-2">
                                <label className="form-label mb-1" style={{ fontSize: "0.78rem", fontWeight: "600", color: "#374151" }}>
                                    Where did you buy it?
                                </label>
                                <select
                                    value={step.ownershipType || "purchased_from_us"}
                                    onChange={(e) => onStepTextChange(idx, "ownershipType", e.target.value || null)}
                                    className="form-select form-select-sm"
                                    style={{ borderRadius: "6px", fontSize: "0.8rem" }}
                                >
                                    <option value="purchased_from_us">Joyory Store</option>
                                    <option value="purchased_elsewhere">Elsewhere / Other Brand</option>
                                    <option value="">Received as Gift / Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label mb-1" style={{ fontSize: "0.78rem", fontWeight: "600", color: "#374151" }}>
                                    Purchase Source
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Website, Store, Gifted"
                                    value={step.purchaseSource || ""}
                                    onChange={(e) => onStepTextChange(idx, "purchaseSource", e.target.value)}
                                    className="form-control form-control-sm"
                                    style={{ borderRadius: "6px", fontSize: "0.8rem" }}
                                />
                            </div>
                        </div>
                    )}

                    {!step.isOwned && (
                        <div
                            className="mt-3 p-3"
                            style={{
                                border: "1px dashed #4b5563",
                                borderRadius: "6px",
                                background: "#ffffff"
                            }}
                        >
                            <div style={{ fontSize: "0.8rem", color: "#1f2937", lineHeight: "1.45" }}>
                                <strong>Not Owned:</strong> Buy from Joyory to unlock our 99% Satisfaction Guarantee, custom AI Coach tips, and daily progress analytics!
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-dark mt-2"
                                style={{
                                    borderRadius: "20px",
                                    padding: "5px 16px",
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                    background: "#000000",
                                    color: "#ffffff"
                                }}
                                onClick={() => onAddToCart(step)}
                            >
                                Buy Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Allergen Alert */}
            {step.allergenAlert && (
                <div className="rb-allergen-alert-box mt-2">
                    <FaExclamationTriangle />
                    <span>{step.allergenAlertMessage || "Warning: Matches user allergy profile ingredients!"}</span>
                </div>
            )}
        </div>
    );
}
