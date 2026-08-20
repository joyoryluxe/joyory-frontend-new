import React from 'react';

export default function RecommendationsHeader({
    hasRecommendations,
    hasSuggestions,
    shade,
    undertoneKey,
    family,
    formulation,
}) {
    return (
        <div className="text-center mb-5">
            <h1 className="recommendations-title mb-3" style={{ fontSize: '28px', fontWeight: '400' }}>
                {hasRecommendations
                    ? "Your Recommended Products"
                    : hasSuggestions
                        ? "No Exact Match Found – Showing Related Products"
                        : "No Products Found"}
            </h1>

            {/* User Selections Summary */}
            {(shade || undertoneKey || family || formulation) && (
                <div className="selection-summary selection-summary-content">
                    {shade?.name && (
                        <div className="selection-item" style={{ textAlign: 'center' }}>
                            <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Shade</span>
                            <span className="selection-value" style={{ fontWeight: '500' }}>- {shade.name}</span>
                        </div>
                    )}
                    {undertoneKey && (
                        <div className="selection-item" style={{ textAlign: 'center' }}>
                            <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Undertone</span>
                            <span className="selection-value" style={{ fontWeight: '500' }}>- {undertoneKey}</span>
                        </div>
                    )}
                    {family?.name && (
                        <div className="selection-item" style={{ textAlign: 'center' }}>
                            <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Family</span>
                            <span className="selection-value" style={{ fontWeight: '500' }}>- {family.name}</span>
                        </div>
                    )}
                    {formulation?.name && (
                        <div className="selection-item" style={{ textAlign: 'center' }}>
                            <span className="selection-label" style={{ display: 'block', fontSize: '12px', color: '#666' }}>Formulation</span>
                            <span className="selection-value" style={{ fontWeight: '500' }}>- {formulation.name}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
