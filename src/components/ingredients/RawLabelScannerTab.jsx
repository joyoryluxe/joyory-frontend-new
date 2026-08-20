import React from 'react';
import {
    FaUndo,
    FaExclamationTriangle,
} from 'react-icons/fa';

export default function RawLabelScannerTab({
    ocrText = "",
    setOcrText,
    ocrLoading = false,
    ocrResult,
    onScanText,
    onResetOCR,
    onIngredientClick,
}) {
    return (
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
                    onClick={onScanText}
                    disabled={!ocrText.trim() || ocrLoading}
                >
                    {ocrLoading ? "Analyzing Label Formulations..." : "Scan & Analyze Ingredients"}
                </button>
                <button
                    className="ic-action-btn-reset"
                    onClick={onResetOCR}
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
                                        onClick={() => ing.decoded && onIngredientClick(ing)}
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
    );
}
