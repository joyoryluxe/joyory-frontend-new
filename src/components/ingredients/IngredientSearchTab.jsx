import React from 'react';
import {
    FaPlus,
    FaTrash,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaUndo,
} from 'react-icons/fa';

export default function IngredientSearchTab({
    presets = [],
    selectedIngredients = [],
    searchInput = "",
    setSearchInput,
    suggestions = [],
    result,
    loading,
    onAddIngredient,
    onRemoveIngredient,
    onCheckIngredients,
    onLoadPreset,
    onResetIngredients,
    onIngredientNameClick,
}) {
    return (
        <div>
            {/* Quick Presets */}
            <div className="mb-4">
                <span className="text-muted small fw-semibold d-block mb-2 text-start">Popular Combinations:</span>
                <div className="d-flex flex-wrap gap-2 justify-content-start">
                    {presets.map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="ic-preset-btn"
                            onClick={() => onLoadPreset(preset.ingredients)}
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
                                    onAddIngredient(suggestions[0].name);
                                } else {
                                    onAddIngredient(searchInput);
                                }
                            }
                        }}
                    />
                    <button
                        className="btn btn-dark px-3 ingredient-add"
                        onClick={() => onAddIngredient(searchInput)}
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
                                onClick={() => onAddIngredient(ing.name)}
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
                                    onClick={() => onRemoveIngredient(idx)}
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
                    onClick={onCheckIngredients}
                    disabled={selectedIngredients.length < 2 || loading}
                >
                    {loading ? "Analyzing Layerings..." : "Check Compatibility"}
                </button>
                <button
                    className="ic-action-btn-reset"
                    onClick={onResetIngredients}
                    title="Reset"
                >
                    <FaUndo />
                </button>
            </div>

            {/* Verdict and Results */}
            {result && (
                <div className="mt-4 border-top pt-4 text-start">
                    {result.conflicts?.length === 0 ? (
                        <div className="ic-alert ic-alert-success mb-3">
                            <FaCheckCircle size={28} className="flex-shrink-0 mt-1" />
                            <div>
                                <h5 className="fw-bold mb-1">Perfect Harmony!</h5>
                                <p className="mb-0 text-muted small">
                                    All selected ingredients are fully compatible and can be safely layered or combined in your AM/PM routine. Remember to apply from thinnest texture to thickest texture!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="ic-alert ic-alert-warning mb-3">
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
                                                <span
                                                    className="ic-clickable-ingredient"
                                                    onClick={() => onIngredientNameClick(conflict.ingredient1)}
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                    title={`Inspect ${conflict.ingredient1}`}
                                                >
                                                    {conflict.ingredient1}
                                                </span>
                                                {" + "}
                                                <span
                                                    className="ic-clickable-ingredient"
                                                    onClick={() => onIngredientNameClick(conflict.ingredient2)}
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                    title={`Inspect ${conflict.ingredient2}`}
                                                >
                                                    {conflict.ingredient2}
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
                                        onClick={() => onIngredientNameClick(ing)}
                                        title="Click to inspect details"
                                    >
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
    );
}
