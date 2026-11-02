import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import bagIcon from "../../assets/bag.svg";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import "../../styles/ProductCardCartButton.css";

const ProductCardCartButton = ({
  item,
  displayVariant,
  showOutOfStock = false,
  isCurrentVariantOutOfStock = false,
  showSelectVariantButton = undefined,
  isAdding = false,
  handleAddToCart,
  handleOutOfStockClick,
  openVariantOverlay,
  wrapperClassName = "cart-section",
  buttonClassName = "btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2",
}) => {
  const { cartItems, updateItemQuantity, removeItemFromCart } = useContext(CartContext) || {};
  const [isUpdating, setIsUpdating] = useState(false);

  if (!item) return null;

  const currentProdId = String(item._id || item.id || "");
  const allVariants = Array.isArray(item.variants) ? item.variants : [];
  const singleSku = allVariants.length === 1 ? allVariants[0]?.sku : (displayVariant?.sku || null);

  // If product has multiple variants, variant selection is required unless caller explicitly says otherwise.
  // Requirement: "remember some items we have button of select varient they should not be affected"
  const isVariantSelectionRequired =
    showSelectVariantButton !== undefined
      ? Boolean(showSelectVariantButton)
      : allVariants.length > 1;

  // 1. If variant selection is required, ALWAYS show "Select Variant" button
  if (isVariantSelectionRequired) {
    return (
      <div className={wrapperClassName}>
        <div className="d-flex align-items-center justify-content-between">
          <button
            type="button"
            className={`${buttonClassName} btn-outline-dark`}
            onClick={(e) => {
              e.stopPropagation();
              if (openVariantOverlay) {
                openVariantOverlay(item._id, "all", e);
              }
            }}
            style={{
              transition: "background-color 0.3s ease, color 0.3s ease",
              cursor: "pointer",
            }}
          >
            Select Variant
          </button>
        </div>
      </div>
    );
  }

  // 2. If completely or currently out of stock
  const isOutOfStock = showOutOfStock || isCurrentVariantOutOfStock;
  if (isOutOfStock) {
    return (
      <div className={wrapperClassName}>
        <div className="d-flex align-items-center justify-content-between">
          <button
            type="button"
            className={`${buttonClassName} btn-secondary`}
            onClick={(e) => {
              e.stopPropagation();
              if (handleOutOfStockClick) {
                handleOutOfStockClick(item.name);
              }
            }}
            style={{
              transition: "background-color 0.3s ease, color 0.3s ease",
              opacity: 0.8,
              cursor: "pointer",
            }}
          >
            <FaTimes style={{ fontSize: "14px" }} />
            Out of Stock
          </button>
        </div>
      </div>
    );
  }

  // 3. Find if this product (or its single variant) is already in the cart
  const cartItem = cartItems?.find((ci) => {
    const ciProdId = String(ci.productId?._id || ci.productId || ci.product?._id || ci.product || "");
    if (ciProdId !== currentProdId) return false;
    if (singleSku) {
      const ciSku = ci.selectedVariant?.sku || ci.variantSku;
      if (ciSku) {
        return String(ciSku).trim().toLowerCase() === String(singleSku).trim().toLowerCase();
      }
    }
    return true;
  });

  // 4. If product is in cart -> Render "- 1 +" quantity manipulation box!
  if (cartItem && (Number(cartItem.quantity) || 0) > 0) {
    const currentQty = Number(cartItem.quantity) || 1;
    const maxStock = displayVariant?.stock ?? item.stock ?? 6;
    const isMaxReached = currentQty >= Math.min(6, maxStock);

    const handleDecrement = async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isUpdating) return;
      setIsUpdating(true);
      try {
        const sku = cartItem.selectedVariant?.sku || cartItem.variantSku || singleSku || null;
        if (currentQty <= 1) {
          if (removeItemFromCart) {
            await removeItemFromCart(cartItem.cartItemId, currentProdId, sku);
          } else if (updateItemQuantity) {
            await updateItemQuantity(cartItem.cartItemId, currentProdId, sku, 0);
          }
        } else {
          if (updateItemQuantity) {
            await updateItemQuantity(cartItem.cartItemId, currentProdId, sku, currentQty - 1);
          }
        }
      } catch (err) {
        console.error("Failed to decrement cart quantity:", err);
      } finally {
        setIsUpdating(false);
      }
    };

    const handleIncrement = async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isUpdating || isMaxReached) return;
      setIsUpdating(true);
      try {
        const sku = cartItem.selectedVariant?.sku || cartItem.variantSku || singleSku || null;
        if (updateItemQuantity) {
          await updateItemQuantity(cartItem.cartItemId, currentProdId, sku, currentQty + 1);
        }
      } catch (err) {
        console.error("Failed to increment cart quantity:", err);
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <div className={wrapperClassName}>
        <div className="d-flex align-items-center justify-content-between">
          <div
            className="card-qty-stepper page-title-main-name d-flex align-items-center justify-content-between w-100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <button
              type="button"
              className="card-qty-btn card-qty-btn-minus"
              onClick={handleDecrement}
              disabled={isUpdating}
              aria-label="Decrease quantity"
              title={currentQty === 1 ? "Remove from bag" : "Decrease quantity"}
            >
              <FaMinus style={{ fontSize: "11px" }} />
            </button>
            <span className="card-qty-val">
              {currentQty}
            </span>
            <button
              type="button"
              className="card-qty-btn card-qty-btn-plus"
              onClick={handleIncrement}
              disabled={isUpdating || isMaxReached}
              aria-label="Increase quantity"
              title={isMaxReached ? "Maximum quantity reached" : "Increase quantity"}
            >
              <FaPlus style={{ fontSize: "11px" }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Default: Render "Add to Bag" button
  return (
    <div className={wrapperClassName}>
      <div className="d-flex align-items-center justify-content-between">
        <button
          type="button"
          className={`${buttonClassName} ${isAdding ? "" : "btn-outline-dark"}`}
          onClick={(e) => {
            e.stopPropagation();
            if (handleAddToCart) {
              handleAddToCart(item);
            }
          }}
          disabled={isAdding}
          style={{
            transition: "background-color 0.3s ease, color 0.3s ease",
            cursor: isAdding ? "not-allowed" : "pointer",
          }}
        >
          {isAdding ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Adding...
            </>
          ) : (
            <>
              Add to Bag
              <img
                src={bagIcon}
                className="img-fluid ms-1"
                style={{ marginTop: "-3px", height: "20px" }}
                alt="Bag-icon"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCardCartButton;
