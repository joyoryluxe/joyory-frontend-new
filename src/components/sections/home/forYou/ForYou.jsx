/**
 * ForYou.jsx
 * ─────────────────────────────────────────────────────────────
 * Modular Finds For You section component.
 * Composes useForYou custom hook with ForYouHeader,
 * ForYouSlider, ForYouEmptyState, and HomeVariantOverlay.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import "../../../../styles/ForYou.css";
import "../../../../styles/BestSellers.css";
import Loader from "../../../common/Loader";
import SectionError from "../../../common/SectionError";
import OutOfStockPopup from "../../../common/OutOfStockPopup";
import HomeVariantOverlay from "../common/HomeVariantOverlay";
import ForYouHeader from "./ForYouHeader";
import ForYouSlider from "./ForYouSlider";
import ForYouEmptyState from "./ForYouEmptyState";
import { useForYou } from "./useForYou";

const Foryou = ({ title = "Recommended For You" }) => {
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
  } = useForYou();

  const activeOverlayProduct = products.find(
    (p) => p._id === showVariantOverlay
  );

  return (
    <div className="container-fluid my-4 position-relative margin-left-rights">
      {/* Out of Stock Popup */}
      <OutOfStockPopup
        isOpen={showOutOfStockPopup}
        onClose={closeOutOfStockPopup}
        productName={outOfStockProductName}
      />

      {/* Header */}
      <ForYouHeader title={title} />

      {/* Loading State */}
      {loading && (
        <div className="text-center">
          <Loader text="Loading recommendations..." height={120} />
        </div>
      )}

      {/* Error State */}
      {error && <SectionError message={error} onRetry={fetchProducts} />}

      {/* Product Slider */}
      {!loading && !error && products.length > 0 && (
        <ForYouSlider
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
        <ForYouEmptyState onRefresh={fetchProducts} />
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

export default Foryou;
export { useForYou, ForYouHeader, ForYouSlider, ForYouEmptyState };
