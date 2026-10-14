import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import "../../styles/CartDrawer.css";

const FREE_SHIPPING_THRESHOLD = 499;

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartCount,
    cartSummary,
    updateItemQuantity,
    removeItemFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // ── Swipe Right to Close Gesture ──────────────────────────────────
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (!isCartOpen) {
      setDragOffset(0);
      isHorizontalSwipe.current = false;
    }
  }, [isCartOpen]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only engage if movement is clearly horizontal to the right
    if (!isHorizontalSwipe.current) {
      if (diffX > 8 && Math.abs(diffX) > Math.abs(diffY)) {
        isHorizontalSwipe.current = true;
      }
    }

    if (isHorizontalSwipe.current && diffX > 0) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current) {
      if (dragOffset > 50) {
        closeCart();
      }
      setDragOffset(0);
      isHorizontalSwipe.current = false;
    }
  };

  // Calculate free shipping progress
  const currentPayable = Number(cartSummary?.payable || 0);
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - currentPayable
  );
  const progressPercent = Math.min(
    100,
    Math.round((currentPayable / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleNavigateToCart = () => {
    closeCart();
    navigate("/cartpage");
  };

  const handleNavigateToCheckout = () => {
    closeCart();
    navigate("/AddressSelection");
  };

  const handleStartShopping = () => {
    closeCart();
    navigate("/products");
  };

  return (
    <>
      {/* ── BACKDROP ── */}
      <div
        className={`cart-drawer-backdrop ${isCartOpen ? "open" : ""}`}
        onClick={closeCart}
        aria-hidden={!isCartOpen}
      />

      {/* ── DRAWER PANEL (Compact height, 90-95% mobile width, swipe-to-close) ── */}
      <aside
        className={`cart-drawer-panel ${isCartOpen ? "open" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={
          dragOffset > 0
            ? {
                transform: `translateX(${dragOffset}px)`,
                transition: "none",
              }
            : undefined
        }
      >
        {/* ── HEADER (Compact) ── */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <h3 className="cart-drawer-title">Your Cart</h3>
            <span className="cart-drawer-item-count">
              ({cartCount} {cartCount === 1 ? "Item" : "Items"})
            </span>
          </div>
          <button
            className="cart-drawer-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* ── FREE SHIPPING PROGRESS BANNER (Compact) ── */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-shipping-banner">
            <div className="cart-drawer-shipping-text">
              {remainingForFreeShipping === 0 ? (
                <span className="shipping-text-unlocked">
                  <Sparkles size={12} className="sparkle-icon" />
                  Yay! You unlocked <strong>FREE Shipping</strong>
                </span>
              ) : (
                <span>
                  Add <strong>₹{remainingForFreeShipping}</strong> more for{" "}
                  <strong>FREE Shipping</strong>
                </span>
              )}
              <span className="cart-drawer-shipping-percent">
                {progressPercent}%
              </span>
            </div>
            <div className="cart-drawer-progress-track">
              <div
                className={`cart-drawer-progress-fill ${
                  progressPercent >= 100 ? "completed" : ""
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* ── CART ITEMS BODY (Scrollable) ── */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty-state">
              <div className="cart-drawer-empty-icon-box">
                <ShoppingBag size={38} strokeWidth={1.5} />
              </div>
              <h3 className="cart-drawer-empty-heading">Your cart is empty</h3>
              <p className="cart-drawer-empty-desc">
                Discover our curated collections of luxury makeup and clean skincare.
              </p>
              <button
                className="cart-drawer-shop-btn"
                onClick={handleStartShopping}
              >
                Start Shopping <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="cart-drawer-items-list">
              {cartItems.map((item, idx) => {
                const variant = item.selectedVariant || {};
                const variantLabel =
                  variant.shadeName && variant.shadeName !== "Default"
                    ? variant.shadeName
                    : variant.size || variant.title || "";
                const originalPrice =
                  Number(item.originalPrice) || Number(item.price);
                const isDiscounted = originalPrice > item.price;
                const discountPercent =
                  item.discountPercent ||
                  (isDiscounted
                    ? Math.round(
                        ((originalPrice - item.price) / originalPrice) * 100
                      )
                    : 0);

                return (
                  <div
                    key={item.cartItemId || `${item.productId}-${idx}`}
                    className="cart-drawer-item-card"
                  >
                    <div className="cart-drawer-item-img-wrapper">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="cart-drawer-item-img"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </div>

                    <div className="cart-drawer-item-details">
                      {/* Top Row: Title on Left, Price on Right */}
                      <div className="cart-drawer-item-top-row">
                        <div className="cart-drawer-item-title-box">
                          <h4 className="cart-drawer-item-name" title={item.name}>
                            {item.name}
                          </h4>
                          {variantLabel && (
                            <div className="cart-drawer-item-variant">
                              {variant.hex && (
                                <span
                                  className="cart-drawer-shade-dot"
                                  style={{ backgroundColor: variant.hex }}
                                />
                              )}
                              <span>{variantLabel}</span>
                            </div>
                          )}
                        </div>

                        <div className="cart-drawer-item-price-box">
                          <span className="cart-drawer-item-price">
                            ₹{item.price}
                          </span>
                          {isDiscounted && (
                            <div className="cart-drawer-item-original-wrap">
                              <span className="cart-drawer-item-original">
                                ₹{originalPrice}
                              </span>
                              {discountPercent > 0 && (
                                <span className="cart-drawer-item-discount-badge">
                                  {discountPercent}% OFF
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row: Stepper Pill on Left, Trash Button on Right */}
                      <div className="cart-drawer-item-bottom-row">
                        <div className="cart-drawer-stepper">
                          <button
                            className="cart-drawer-stepper-btn"
                            onClick={() =>
                              updateItemQuantity(
                                item.cartItemId,
                                item.productId,
                                variant.sku,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} strokeWidth={2.2} />
                          </button>
                          <span className="cart-drawer-stepper-qty">
                            {item.quantity}
                          </span>
                          <button
                            className="cart-drawer-stepper-btn"
                            onClick={() =>
                              updateItemQuantity(
                                item.cartItemId,
                                item.productId,
                                variant.sku,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= 6}
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} strokeWidth={2.2} />
                          </button>
                        </div>

                        <button
                          className="cart-drawer-item-remove-btn"
                          onClick={() =>
                            removeItemFromCart(
                              item.cartItemId,
                              item.productId,
                              variant.sku
                            )
                          }
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 size={14} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── STICKY FOOTER (Ultra-Compact Sleek Height) ── */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total-row">
              <div className="cart-drawer-total-left">
                <span className="cart-drawer-total-label">SUBTOTAL</span>
                {Number(cartSummary?.totalSavings || 0) > 0 ? (
                  <span className="cart-drawer-savings-text">
                    Saved ₹{cartSummary.totalSavings}
                  </span>
                ) : (
                  <span className="cart-drawer-sub-note">
                    Shipping at checkout
                  </span>
                )}
              </div>
              <div className="cart-drawer-total-right">
                <span className="cart-drawer-total-amount">
                  ₹{cartSummary?.payable || 0}
                </span>
              </div>
            </div>

            {/* CTAs: Sleek side-by-side single row (Drastically reduced height!) */}
            <div className="cart-drawer-cta-group">
              <button
                className="cart-drawer-btn cart-drawer-btn-secondary"
                onClick={handleNavigateToCart}
              >
                View Cart
              </button>
              <button
                className="cart-drawer-btn cart-drawer-btn-primary"
                onClick={handleNavigateToCheckout}
              >
                Checkout <ArrowRight size={14} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="cart-drawer-trust-badges">
              <span>
                <ShieldCheck size={11} className="trust-icon" /> 100% Genuine
              </span>
              <span>•</span>
              <span>
                <RotateCcw size={11} className="trust-icon" /> Easy Returns
              </span>
              <span>•</span>
              <span>Secure Payments</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
