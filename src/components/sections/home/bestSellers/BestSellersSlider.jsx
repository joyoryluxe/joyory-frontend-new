/**
 * BestSellersSlider.jsx
 * ─────────────────────────────────────────────────────────────
 * Swiper slider component rendering product cards for Best Sellers.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import HomeProductCard from "../common/HomeProductCard";
import { getSku } from "../../../../utils/variantHelpers";

const BestSellersSlider = ({
  products = [],
  tempSelectedVariants = {},
  selectedVariants = {},
  wishlistLoading = {},
  addingToCart = {},
  isInWishlist,
  onProductClick,
  onOutOfStockClick,
  onToggleWishlist,
  onAddToCart,
  onOpenVariantOverlay,
}) => {
  return (
    <div className="mobile-responsive-code position-relative">
      <Swiper
        modules={[Autoplay, Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          300: { slidesPerView: 2, spaceBetween: 10 },
          576: { slidesPerView: 2.5, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 15 },
          992: { slidesPerView: 4, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 25 },
        }}
        className="foryou-swiper pb-0 mb-0"
      >
        {products.map((item) => {
          if (!item) return null;
          const displayVariant =
            tempSelectedVariants[item._id] ||
            selectedVariants[item._id] ||
            item.variant ||
            {};
          const selectedSku = getSku(displayVariant);
          const isProductInWishlist = isInWishlist(item._id, selectedSku);

          return (
            <SwiperSlide key={item.uniqueId}>
              <HomeProductCard
                item={item}
                displayVariant={displayVariant}
                isProductInWishlist={isProductInWishlist}
                isWishlistLoading={wishlistLoading[item._id]}
                isAddingToCart={addingToCart[item._id]}
                onProductClick={onProductClick}
                onOutOfStockClick={onOutOfStockClick}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onOpenVariantOverlay={onOpenVariantOverlay}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BestSellersSlider;
