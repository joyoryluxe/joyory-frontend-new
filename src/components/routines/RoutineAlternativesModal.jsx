import React from 'react';

export default function RoutineAlternativesModal({
    show,
    alternativesProduct,
    alternativesLoading,
    alternativesData,
    onClose,
    onSwapProduct,
}) {
    if (!show || !alternativesProduct) return null;

    return (
        <div className="rb-modal-overlay">
            <div className="rb-modal-content" style={{ maxWidth: "750px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h3 className="font-weight-bold mb-0">Alternative Suggestions</h3>
                        <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                            Swapping alternative products for: <strong>{alternativesProduct.productName}</strong>
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}
                    >
                        ✕
                    </button>
                </div>

                <div className="rb-modal-steps-scroll" style={{ overflowY: "auto", flex: 1, paddingRight: "5px" }}>
                    {alternativesLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-2 text-muted">Searching catalog for suitable swaps...</p>
                        </div>
                    ) : alternativesData ? (
                        <div className="rb-alternatives-row mt-4">
                            {/* Budget Option */}
                            {alternativesData.budgetMatch ? (
                                <div className="rb-alternative-card select-swap">
                                    <div className="rb-alt-label text-white" style={{ background: "#555555" }}>Budget Swap</div>
                                    <img src={alternativesData.budgetMatch.variants?.[0]?.images?.[0] || alternativesData.budgetMatch.image || ""} alt={alternativesData.budgetMatch.name} />
                                    <div className="rb-alt-name">{alternativesData.budgetMatch.name}</div>
                                    <div className="rb-alt-price">₹{alternativesData.budgetMatch.price}</div>
                                    <div className="rb-alt-rating">★ {alternativesData.budgetMatch.avgRating || 5}</div>
                                    <button
                                        type="button"
                                        className="rb-create-btn justify-content-center w-100 mt-2"
                                        style={{ padding: "8px", fontSize: "0.8rem" }}
                                        onClick={() => onSwapProduct(alternativesData.budgetMatch)}
                                    >
                                        Swap Product
                                    </button>
                                </div>
                            ) : (
                                <div className="rb-alternative-card disabled select-swap">
                                    <p className="text-muted m-0 p-3">No budget match alternative available in this category.</p>
                                </div>
                            )}

                            {/* Premium Option */}
                            {alternativesData.premiumMatch ? (
                                <div className="rb-alternative-card select-swap">
                                    <div className="rb-alt-label text-white" style={{ background: "#222222" }}>Premium Swap</div>
                                    <img src={alternativesData.premiumMatch.variants?.[0]?.images?.[0] || alternativesData.premiumMatch.image || ""} alt={alternativesData.premiumMatch.name} />
                                    <div className="rb-alt-name">{alternativesData.premiumMatch.name}</div>
                                    <div className="rb-alt-price">₹{alternativesData.premiumMatch.price}</div>
                                    <div className="rb-alt-rating">★ {alternativesData.premiumMatch.avgRating || 5}</div>
                                    <button
                                        type="button"
                                        className="rb-create-btn justify-content-center w-100 mt-2"
                                        style={{ padding: "8px", fontSize: "0.8rem" }}
                                        onClick={() => onSwapProduct(alternativesData.premiumMatch)}
                                    >
                                        Swap Product
                                    </button>
                                </div>
                            ) : (
                                <div className="rb-alternative-card disabled select-swap">
                                    <p className="text-muted m-0 p-3">No premium match alternative available in this category.</p>
                                </div>
                            )}

                            {/* Sensitive Skin friendly Option */}
                            {alternativesData.sensitiveMatch ? (
                                <div className="rb-alternative-card select-swap">
                                    <div className="rb-alt-label text-white" style={{ background: "#888888" }}>Gentle Swap</div>
                                    <img src={alternativesData.sensitiveMatch.variants?.[0]?.images?.[0] || alternativesData.sensitiveMatch.image || ""} alt={alternativesData.sensitiveMatch.name} />
                                    <div className="rb-alt-name">{alternativesData.sensitiveMatch.name}</div>
                                    <div className="rb-alt-price">₹{alternativesData.sensitiveMatch.price}</div>
                                    <div className="rb-alt-rating">★ {alternativesData.sensitiveMatch.avgRating || 5}</div>
                                    <button
                                        type="button"
                                        className="rb-create-btn justify-content-center w-100 mt-2"
                                        style={{ padding: "8px", fontSize: "0.8rem" }}
                                        onClick={() => onSwapProduct(alternativesData.sensitiveMatch)}
                                    >
                                        Swap Product
                                    </button>
                                </div>
                            ) : (
                                <div className="rb-alternative-card disabled select-swap">
                                    <p className="text-muted m-0 p-3">No gentle match alternative available in this category.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No alternative products found in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
