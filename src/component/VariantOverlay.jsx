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
      onClose();
    }
  };

  const isOutOfStock = (variant) => variant.stock <= 0;
  const isSelected = (variant) => currentVariant?.sku === variant.sku;

  return (
    <div className="variant-overlay" onClick={onClose}>
      <div className="variant-overlay-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="overlay-header">
          <h5 className="overlay-title">
            Select A Shade ({variantGroups.all.length})
          </h5>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="variant-tabs">
          <button
            className={`variant-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({variantGroups.all.length})
          </button>
          {variantGroups.color.length > 0 && (
            <button
              className={`variant-tab ${activeTab === 'color' ? 'active' : ''}`}
              onClick={() => setActiveTab('color')}
            >
              Colors ({variantGroups.color.length})
            </button>
          )}
          {variantGroups.text.length > 0 && (
            <button
              className={`variant-tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Sizes ({variantGroups.text.length})
            </button>
          )}
        </div>

        {/* Variants Grid */}
        <div className="variants-grid">
          {activeTab === 'all' && (
            <>
              {variantGroups.color.length > 0 && (
                <div className="variant-section">
                  <h6 className="section-title">Colors</h6>
                  <div className="variant-grid color-grid">
                    {variantGroups.color.map((variant, idx) => (
                      <div
                        key={idx}
                        className={`variant-item color-variant ${isSelected(variant) ? 'selected' : ''} ${isOutOfStock(variant) ? 'out-of-stock' : ''}`}
                        onClick={(e) => handleVariantClick(variant, e)}
                      >
                        <div
                          className="color-circle"
                          style={{ backgroundColor: variant.hex || '#ccc' }}
                        >
                          {isSelected(variant) && <span className="check-mark">✓</span>}
                        </div>
                        <span className="variant-name">{variant.shadeName}</span>
                        {isOutOfStock(variant) && <span className="stock-badge">Out of Stock</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {variantGroups.text.length > 0 && (
                <div className="variant-section">
                  <h6 className="section-title">Sizes</h6>
                  <div className="variant-grid text-grid">
                    {variantGroups.text.map((variant, idx) => (
                      <div
                        key={idx}
                        className={`variant-item text-variant ${isSelected(variant) ? 'selected' : ''} ${isOutOfStock(variant) ? 'out-of-stock' : ''}`}
                        onClick={(e) => handleVariantClick(variant, e)}
                      >
                        <span className="variant-text">
                          {getVariantDisplayText(variant, getVariantType(variant))}
                        </span>
                        {isOutOfStock(variant) && <span className="stock-badge">Out of Stock</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'color' && (
            <div className="variant-grid color-grid">
              {variantGroups.color.map((variant, idx) => (
                <div
                  key={idx}
                  className={`variant-item color-variant ${isSelected(variant) ? 'selected' : ''} ${isOutOfStock(variant) ? 'out-of-stock' : ''}`}
                  onClick={(e) => handleVariantClick(variant, e)}
                >
                  <div
                    className="color-circle"
                    style={{ backgroundColor: variant.hex || '#ccc' }}
                  >
                    {isSelected(variant) && <span className="check-mark">✓</span>}
                  </div>
                  <span className="variant-name">{variant.shadeName}</span>
                  {isOutOfStock(variant) && <span className="stock-badge">Out of Stock</span>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="variant-grid text-grid">
              {variantGroups.text.map((variant, idx) => (
                <div
                  key={idx}
                  className={`variant-item text-variant ${isSelected(variant) ? 'selected' : ''} ${isOutOfStock(variant) ? 'out-of-stock' : ''}`}
                  onClick={(e) => handleVariantClick(variant, e)}
                >
                  <span className="variant-text">
                    {getVariantDisplayText(variant, getVariantType(variant))}
                  </span>
                  {isOutOfStock(variant) && <span className="stock-badge">Out of Stock</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with View Details button */}
        <div className="overlay-footer">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              // Navigate to product page
              window.location.href = `/product/${product.slugs?.[0] || product._id}`;
            }}
          >
            View Details
          </button>
          <button
            className="btn btn-primary"
            onClick={onClose}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantOverlay;