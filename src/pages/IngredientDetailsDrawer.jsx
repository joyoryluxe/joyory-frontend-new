// src/component/IngredientDetailsDrawer.jsx
import React, { useEffect } from "react";
import { FaTimes, FaCheck, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function IngredientDetailsDrawer({ isOpen, onClose, ingredient }) {
  const navigate = useNavigate();

  // Prevent scroll behind the drawer when active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !ingredient) return null;

  const handleSearchProducts = () => {
    onClose();
    navigate(`/products/ingredients/${encodeURIComponent(ingredient.name.toLowerCase())}`);
  };

  const handleViewDetail = () => {
    onClose();
    navigate(`/ingredient/${encodeURIComponent(ingredient.name)}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
        style={{ zIndex: 10050, transition: "opacity 0.3s ease" }}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
        style={{
          width: "420px",
          maxWidth: "100%",
          zIndex: 10051,
          animation: "bc-slide-in 0.3s ease-out forwards",
          fontFamily: "Inter, sans-serif"
        }}
      >
        {/* Header */}
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
          <div>
            <span className="badge bg-secondary mb-1 text-uppercase small" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
              {typeof ingredient.category === "string" ? ingredient.category : (ingredient.category?.name || "Ingredient")}
            </span>
            <h4 className="fw-bold text-dark mb-0 page-title-main-name">{ingredient.name}</h4>
            {ingredient.aliases?.length > 0 && (
              <small className="text-muted">Also known as: {ingredient.aliases.join(", ")}</small>
            )}
          </div>
          <button 
            onClick={onClose}
            className="btn btn-link text-muted p-2 border-0"
            style={{ fontSize: "20px", textDecoration: "none" }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 flex-grow-1 overflow-auto" style={{ fontSize: "14px", lineHeight: "1.6" }}>
          
          {/* Allergen Status */}
          {(ingredient.isAllergen || ingredient.isSensitive) && (
            <div className={`p-3 rounded mb-4 d-flex gap-2 align-items-center ${ingredient.isAllergen ? "bg-danger bg-opacity-10 text-danger" : "bg-warning bg-opacity-10 text-warning"}`} style={{ border: `1px solid ${ingredient.isAllergen ? "#f5c2c7" : "#ffecb5"}` }}>
              <FaExclamationTriangle size={18} className="flex-shrink-0" />
              <div>
                <strong className="d-block" style={{ fontSize: "13px" }}>
                  {ingredient.isAllergen ? "⚠️ Allergen Alert!" : "⚠️ Sensitive Alert!"}
                </strong>
                <span className="small text-dark text-opacity-75">
                  {ingredient.isAllergen 
                    ? "Matches your high-risk allergen profile." 
                    : "You marked this as sensitive/irritating."}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-1" style={{ fontSize: "14px" }}>What it is</h5>
            <p className="text-muted small">
              {ingredient.description || "A cosmetic ingredient used in high-quality skincare and cosmetic formulations to improve product quality or provide targeted skin benefits."}
            </p>
          </div>

          {/* Benefits */}
          {ingredient.benefits?.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-1" style={{ fontSize: "14px" }}>Key Benefits</h5>
              <ul className="ps-3 text-muted small">
                {ingredient.benefits.map((b, idx) => (
                  <li key={idx} className="mb-1">{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skin Type Suitability */}
          <div className="mb-4 row">
            <div className="col-6">
              <h5 className="fw-bold text-dark border-bottom pb-1" style={{ fontSize: "14px" }}>Good For</h5>
              {ingredient.goodForSkinTypes?.length > 0 ? (
                <div className="d-flex flex-wrap gap-1">
                  {ingredient.goodForSkinTypes.map((type, idx) => (
                    <span key={idx} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-1 px-2 text-capitalize" style={{ fontSize: "11px" }}>
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted small">All skin types</span>
              )}
            </div>
            <div className="col-6">
              <h5 className="fw-bold text-dark border-bottom pb-1" style={{ fontSize: "14px" }}>Avoid For</h5>
              {ingredient.avoidForSkinTypes?.length > 0 ? (
                <div className="d-flex flex-wrap gap-1">
                  {ingredient.avoidForSkinTypes.map((type, idx) => (
                    <span key={idx} className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 py-1 px-2 text-capitalize" style={{ fontSize: "11px" }}>
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted small">None documented</span>
              )}
            </div>
          </div>

          {/* Conflicts / Incompatibilities */}
          {ingredient.incompatibleWith?.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-1" style={{ fontSize: "14px" }}>Avoid Mixing With</h5>
              <div className="d-flex flex-column gap-2 mt-2">
                {ingredient.incompatibleWith.map((conflict, idx) => (
                  <div key={idx} className="p-2 border rounded bg-light" style={{ fontSize: "12.5px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-danger">+{conflict.ingredient}</strong>
                      <span className={`badge ${conflict.severity === "high" ? "bg-danger" : conflict.severity === "medium" ? "bg-warning text-dark" : "bg-info text-dark"}`} style={{ fontSize: "9px" }}>
                        {conflict.severity?.toUpperCase()} risk
                      </span>
                    </div>
                    <span className="text-muted d-block" style={{ lineHeight: "1.35" }}>
                      {conflict.reason || "Can cause excessive irritation or neutralize effectiveness when layered directly."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usage Tips */}
          {ingredient.usageTips?.length > 0 && (
            <div className="mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-1" style={{ fontSize: "14px" }}>Usage & Tips</h5>
              <ul className="ps-3 text-muted small">
                {ingredient.usageTips.map((tip, idx) => (
                  <li key={idx} className="mb-1">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-top bg-light d-flex gap-2">
          <button 
            className="btn btn-outline-dark flex-grow-1 d-flex align-items-center justify-content-center gap-2"
            onClick={handleSearchProducts}
            style={{ fontSize: "13px", padding: "10px 0" }}
          >
            <FaSearch size={12} /> Find Catalog Products
          </button>
          <button 
            className="btn btn-dark flex-grow-1"
            onClick={handleViewDetail}
            style={{ fontSize: "13px", padding: "10px 0" }}
          >
            Learn More details →
          </button>
        </div>
      </div>

      {/* Drawer Keyframes Style */}
      <style>{`
        @keyframes bc-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
