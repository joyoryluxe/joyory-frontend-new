// src/hooks/useCart.js
// Centralized add-to-cart hook — replaces the repeated handleAddToCart logic
// duplicated in IngredientDetail, PromotionProductsPage, MainVirtualTryOn, ShopProduct, etc.
//
// Usage:
//   const { addingToCart, handleAddToCart } = useCart({ user, navigateOnSuccess });

import { useState, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart as apiAddToCart } from '../api/cartApi';
import { CartContext } from '../context/CartContext';
import { getSku } from '../utils/productHelpers';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * useCart — custom hook for adding products to cart with variant support.
 *
 * @param {object} [options]
 * @param {object|null} [options.user]              - Current user from UserContext
 * @param {boolean} [options.navigateToCart]        - Navigate to /cartpage after add? (default: false)
 * @param {string} [options.redirectOnSuccess]      - Override cart redirect path
 * @returns {{
 *   addingToCart: object,       // Map of productId → boolean (loading state per product)
 *   handleAddToCart: Function,  // (prod, selectedVariants, forceVariant?) => Promise
 * }}
 */
const useCart = ({ user, navigateToCart = false, redirectOnSuccess = '/cartpage' } = {}) => {
  const [addingToCart, setAddingToCart] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Access CartContext for syncing cart badge count
  let syncCartFromBackend;
  try {
    const ctx = useContext(CartContext);
    syncCartFromBackend = ctx?.syncCartFromBackend;
  } catch (_) {
    // CartContext may not be available in all trees
  }

  /**
   * Add a product (with variant) to the cart.
   *
   * @param {object} prod                  - Raw or normalized product object
   * @param {object} [selectedVariants]    - Map of productId → selected variant
   * @param {object|null} [forceVariant]   - Force use this variant instead of selectedVariants
   */
  const handleAddToCart = useCallback(
    async (prod, selectedVariants = {}, forceVariant = null) => {
      if (!prod) return;
      const productId = prod._id || prod.id;

      // Redirect to login if guest
      if (!user || user.guest) {
        toast.error('Please login to add to cart');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      setAddingToCart((prev) => ({ ...prev, [productId]: true }));

      try {
        const variants = Array.isArray(prod.variants) ? prod.variants : [];
        const hasVariants = variants.length > 0;

        const displayVariant =
          forceVariant ||
          selectedVariants[productId] ||
          (hasVariants
            ? variants.find((v) => parseInt(v.stock || 0) > 0) || variants[0]
            : null);

        // Stock validation
        if (hasVariants) {
          if (!displayVariant || parseInt(displayVariant.stock || 0) <= 0) {
            toast.error('Please select an in-stock variant.');
            return;
          }
        } else {
          if (parseInt(prod.stock || 0) <= 0) {
            toast.error('This product is out of stock.');
            return;
          }
        }

        let payload;
        if (hasVariants && displayVariant) {
          payload = {
            productId,
            variants: [{ variantSku: getSku(displayVariant), quantity: 1 }],
          };
          // Cache variant selection for cart page display
          try {
            const cache = JSON.parse(localStorage.getItem('cartVariantCache') || '{}');
            cache[productId] = displayVariant;
            localStorage.setItem('cartVariantCache', JSON.stringify(cache));
          } catch (_) {}
        } else {
          payload = { productId, quantity: 1 };
        }

        const { data } = await apiAddToCart(payload);
        if (!data?.success) throw new Error(data?.message || 'Cart add failed');

        toast.success('Added to cart!');

        // Sync cart context badge if available
        if (typeof syncCartFromBackend === 'function') {
          syncCartFromBackend();
        }

        if (navigateToCart) {
          navigate(redirectOnSuccess);
        }
      } catch (err) {
        console.error('Add to Cart error:', err);
        const msg = getErrorMessage(err) || err?.response?.data?.message || 'Failed to add to cart';
        toast.error(msg);
        if (err?.response?.status === 401) {
          navigate('/login', { state: { from: location.pathname } });
        }
      } finally {
        setAddingToCart((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [user, navigate, location.pathname, syncCartFromBackend, navigateToCart, redirectOnSuccess]
  );

  return { addingToCart, handleAddToCart };
};

export { useCart };
export default useCart;
