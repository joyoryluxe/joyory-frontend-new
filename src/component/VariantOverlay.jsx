import React, { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import "../css/VariantOverlay.css"; // Create this CSS file

const VariantOverlay = ({
  isOpen,
  onClose,
  product,
  currentVariant,
  onVariantSelect,
  getVariantDisplayText,
  getVariantType,
  isValidHexColor,
  formatPrice,
  selectedVariantType = "all"
}) => {
  const [activeTab, setActiveTab] = useState(selectedVariantType);

  if (!isOpen || !product) return null;

  // Group variants by type
  const variantGroups = useMemo(() => {
    const variants = product.variants || [];
    const groups = {
      all: variants,
      color: [],
      text: []
    };

    variants.forEach(variant => {
      if (!variant) return;

      const variantType = getVariantType(variant);
      if (variantType === 'color' || (variant.hex && isValidHexColor(variant.hex))) {
        groups.color.push(variant);
      } else {
        groups.text.push(variant);
      }
    });

    return groups;
  }, [product.variants, getVariantType, isValidHexColor]);

  const handleVariantClick = (variant, e) => {
    e.stopPropagation();
    if (variant.stock > 0) {
      onVariantSelect(
        product._id,
        variant.shadeName,
        variant.hex,
        variant.sku,
        true,
        variant.displayPrice,
        variant.images?.[0] || product.images?.[0],
        variant.stock
      );
    }
  };

  const isOutOfStock = (variant) => variant.stock <= 0;
  const isSelected = (variant) => currentVariant?.sku === variant.sku;

  return (
    <div className="variant-overlay" onClick={onClose}>
      <div className="variant-overlay-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {/* <div className="overlay-header">
          <h5 className="overlay-title">Select Variant</h5>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div> */}

        <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="m-0 page-title-main-name">Select Variant</h5>
          <button onClick={() => setShowVariantOverlay(false)} style={{ background: 'none', border: 'none', fontSize: '40px' }}>×</button>
        </div>

        {/* Variants Grid */}
        <div className="variants-grid p-3 overflow-auto">
          {/* Colors Group */}
          {variantGroups.color.length > 0 && (
            <div className="variant-grid color-grid d-flex flex-wrap gap-3 justify-content-start align-items-center mb-3">
              {variantGroups.color.map((variant, idx) => (
                <div
                  key={idx}
                  className={`variant-item color-variant ${isSelected(variant) ? 'selected' : ''} ${isOutOfStock(variant) ? 'out-of-stock' : ''}`}
                  onClick={(e) => handleVariantClick(variant, e)}
                  title={variant.shadeName}
                  style={{ position: 'relative', cursor: isOutOfStock(variant) ? 'not-allowed' : 'pointer' }}
                >
                  <div
                    className="color-circle"
                    style={{
                      width: 32, height: 32, borderRadius: "20%",
                      backgroundColor: variant.hex || '#ccc',
                      border: isSelected(variant) ? "3px solid #000" : "1px solid #ddd",
                      opacity: isOutOfStock(variant) ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >
                    {isSelected(variant) && <span className="check-mark" style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>✓</span>}
                  </div>
                  {isOutOfStock(variant) && <span style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "red", fontWeight: "bold", fontSize: 16, pointerEvents: "none"
                  }}>✕</span>}
                </div>
              ))}
            </div>
          )}

          {/* Sizes Group */}
          {variantGroups.text.length > 0 && (
            <div className="variant-grid text-grid d-flex flex-wrap gap-2 justify-content-start align-items-center">
              {variantGroups.text.map((variant, idx) => (
                <div
                  key={idx}
                  className={`variant-item text-variant ${isSelected(variant) ? 'selected' : ''} ${isOutOfStock(variant) ? 'out-of-stock' : ''}`}
                  onClick={(e) => !isOutOfStock(variant) && handleVariantClick(variant, e)}
                  style={{ cursor: isOutOfStock(variant) ? 'not-allowed' : 'pointer' }}
                >
                  <span
                    className="variant-text"
                    style={{
                      padding: "8px 16px", borderRadius: 8,
                      border: isSelected(variant) ? "2px solid #000" : "1px solid #ddd",
                      background: isSelected(variant) ? "#f8f9fa" : "#fff",
                      opacity: isOutOfStock(variant) ? 0.4 : 1, textDecoration: isOutOfStock(variant) ? "line-through" : "none"
                    }}
                  >
                    {getVariantDisplayText(variant, getVariantType(variant))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with View Details button */}
        <div className="overlay-footer p-3 border-top bg-light d-flex flex-column gap-2 align-items-center">
          {currentVariant && (
            <div className="small text-muted fw-semibold mb-1">
              Selected: <span className="text-dark fw-bold">{getVariantDisplayText(currentVariant, getVariantType(currentVariant))}</span>
            </div>
          )}
          <div className="d-flex gap-2 w-100">
            <button
              className="btn btn-outline-secondary flex-grow-1"
              onClick={() => {
                window.location.href = `/product/${product.slugs?.[0] || product._id}`;
              }}
            >
              View Details
            </button>
            <button
              className="btn btn-primary flex-grow-1"
              onClick={onClose}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantOverlay;