import React, { useContext, useEffect } from "react";
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
      {/* Backdrop overlay */}
      <div
        className={`cart-drawer-backdrop ${isCartOpen ? "open" : ""}`}
        onClick={closeCart}
        aria-hidden={!isCartOpen}
      />

      {/* Sliding Side Panel */}
      <aside
        className={`cart-drawer-panel ${isCartOpen ? "open" : ""}`}
        aria-label="Shopping Cart Drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* ── HEADER ── */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <div className="cart-drawer-icon-bubble">
              <ShoppingBag size={20} className="cart-drawer-bag-icon" />
            </div>
            <div>
              <div className="cart-drawer-title-row">
                <h2 className="cart-drawer-title">Shopping Bag</h2>
                <span className="cart-drawer-count-badge">{cartCount}</span>
              </div>
              <span className="cart-drawer-subtitle">
                {cartCount === 1 ? "1 item selected" : `${cartCount} items selected`}
              </span>
            </div>
          </div>
          <button
            className="cart-drawer-close-btn"
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── FREE SHIPPING PROGRESS BAR ── */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-shipping-banner">
            <div className="cart-drawer-shipping-text">
              {remainingForFreeShipping === 0 ? (
                <>
                  <span className="shipping-text-unlocked">
                    <Sparkles size={14} className="sparkle-icon" /> Yay! You unlocked <strong>FREE Shipping</strong>
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Add <strong>₹{remainingForFreeShipping}</strong> more for <strong>FREE Shipping</strong>
                  </span>
                </>
              )}
              <span className="cart-drawer-shipping-percent">
                {progressPercent}%
              </span>
            </div>
            <div className="cart-drawer-progress-track">
              <div
                className={`cart-drawer-progress-fill ${
                  remainingForFreeShipping === 0 ? "completed" : ""
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
                <ShoppingBag size={46} strokeWidth={1.5} />
              </div>
              <h3 className="cart-drawer-empty-heading">Your bag is empty</h3>
              <p className="cart-drawer-empty-desc">
                Discover our curated collections of luxury makeup and clean skincare.
              </p>
              <button
                className="cart-drawer-shop-btn"
                onClick={handleStartShopping}
              >
                Start Shopping <ArrowRight size={16} />
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
                      <div className="cart-drawer-item-header">
                        <span className="cart-drawer-item-brand">
                          {item.brand || "JOYORY"}
                        </span>
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
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h4 className="cart-drawer-item-name">{item.name}</h4>

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

                      <div className="cart-drawer-item-price-row">
                        <span className="cart-drawer-item-price">
                          ₹{item.price}
                        </span>
                        {isDiscounted && (
                          <span className="cart-drawer-item-original">
                            ₹{originalPrice}
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="cart-drawer-item-discount-badge">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Stepper + Subtotal Row */}
                      <div className="cart-drawer-item-footer-row">
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
                            <Minus size={13} />
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
                            <Plus size={13} />
                          </button>
                        </div>

                        <span className="cart-drawer-item-subtotal">
                          Total: ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── STICKY FOOTER ── */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total-row">
              <div>
                <span className="cart-drawer-total-label">Total Amount</span>
                <span className="cart-drawer-total-amount">
                  ₹{cartSummary?.payable || 0}
                </span>
              </div>
              {Number(cartSummary?.totalSavings || 0) > 0 && (
                <span className="cart-drawer-savings-badge">
                  Saved ₹{cartSummary.totalSavings}
                </span>
              )}
            </div>

            <div className="cart-drawer-cta-group">
              <button
                className="cart-drawer-btn cart-drawer-btn-secondary"
                onClick={handleNavigateToCart}
              >
                Go to Cart
              </button>
              <button
                className="cart-drawer-btn cart-drawer-btn-primary"
                onClick={handleNavigateToCheckout}
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="cart-drawer-trust-badges">
              <span>
                <ShieldCheck size={13} className="trust-icon" /> 100% Genuine
              </span>
              <span>•</span>
              <span>
                <RotateCcw size={13} className="trust-icon" /> Easy 7-Day Returns
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
