/**
 * BestSellers.jsx
 * ─────────────────────────────────────────────────────────────
 * Modular Best Sellers section component.
 * Composes sub-components: BestSellersHeader, BestSellersSlider,
 * BestSellersEmptyState, useBestSellers, and HomeVariantOverlay.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import "../../../../styles/BestSellers.css";
import "../../../../App.css";
import Loader from "../../../common/Loader";
import SectionError from "../../../common/SectionError";
import OutOfStockPopup from "../../../common/OutOfStockPopup";
import HomeVariantOverlay from "../common/HomeVariantOverlay";
import BestSellersHeader from "./BestSellersHeader";
import BestSellersSlider from "./BestSellersSlider";
import BestSellersEmptyState from "./BestSellersEmptyState";
import { useBestSellers } from "./useBestSellers";

const BestSellers = ({ title = "Best Sellers" }) => {
  const {
    products,
    selectedVariants,
    tempSelectedVariants,
    setTempSelectedVariants,
    addingToCart,
    wishlistLoading,
    showOutOfStockPopup,
    outOfStockProductName,
    showVariantOverlay,
    loading,
    error,
    isInWishlist,
    handleOutOfStockClick,
    closeOutOfStockPopup,
    toggleWishlist,
    handleVariantSelect,
    openVariantOverlay,
    closeVariantOverlay,
    handleAddToCart,
    handleProductClick,
    fetchProducts,
  } = useBestSellers();

  const activeOverlayProduct = products.find(
    (p) => p._id === showVariantOverlay
  );

  return (
    <div className="container-fluid my-4 position-relative margin-left-rights pb-0 mb-0">
      {/* Out of Stock Popup */}
      <OutOfStockPopup
        isOpen={showOutOfStockPopup}
        onClose={closeOutOfStockPopup}
        productName={outOfStockProductName}
      />

      {/* Header */}
      <BestSellersHeader title={title} />

      {/* Loading State */}
      {loading && (
        <div className="text-center">
          <Loader text="Loading best sellers..." height={120} />
        </div>
      )}

      {/* Error State */}
      {error && <SectionError message={error} onRetry={fetchProducts} />}

      {/* Product Slider */}
      {!loading && !error && products.length > 0 && (
        <BestSellersSlider
          products={products}
          tempSelectedVariants={tempSelectedVariants}
          selectedVariants={selectedVariants}
          wishlistLoading={wishlistLoading}
          addingToCart={addingToCart}
          isInWishlist={isInWishlist}
          onProductClick={handleProductClick}
          onOutOfStockClick={handleOutOfStockClick}
          onToggleWishlist={toggleWishlist}
          onAddToCart={handleAddToCart}
          onOpenVariantOverlay={openVariantOverlay}
        />
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <BestSellersEmptyState onRefresh={fetchProducts} />
      )}

      {/* Reusable Variant Overlay & Mobile Bottom-Sheet Drawer */}
      {activeOverlayProduct && (
        <HomeVariantOverlay
          isOpen={!!showVariantOverlay}
          product={activeOverlayProduct}
          allVariants={activeOverlayProduct.allVariants || []}
          displayVariant={
            tempSelectedVariants[activeOverlayProduct._id] ||
            selectedVariants[activeOverlayProduct._id] ||
            activeOverlayProduct.variant ||
            {}
          }
          tempSelectedVariant={tempSelectedVariants[activeOverlayProduct._id]}
          isAdding={addingToCart[activeOverlayProduct._id]}
          onVariantSelect={handleVariantSelect}
          onTempVariantSelect={(id, v) =>
            setTempSelectedVariants((prev) => ({ ...prev, [id]: v }))
          }
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          onClose={closeVariantOverlay}
        />
      )}
    </div>
  );
};

export default BestSellers;
export { BestSellersHeader, BestSellersSlider, BestSellersEmptyState, useBestSellers };
