// src/hooks/useWishlist.js
// Centralized wishlist hook — replaces the ~150-line wishlist block duplicated in 7+ files.
// Uses the existing shared wishlistApi (axiosInstance-based) instead of raw axios calls.

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistApi';
import { getErrorMessage } from '../utils/errorHandler';
import { getSku, getBrandName } from '../utils/productHelpers';

const GUEST_WISHLIST_KEY = 'guestWishlist';

/**
 * useWishlist — custom hook for wishlist state + toggle logic.
 *
 * @param {object|null} user  - Current user from UserContext (null / guest / logged-in)
 * @returns {{
 *   wishlistData: Array,
 *   wishlistLoading: object,
 *   fetchWishlistData: Function,
 *   toggleWishlist: Function,
 *   isInWishlist: Function,
 * }}
 */
const useWishlist = (user) => {
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  // ─── Helpers ─────────────────────────────────────────────────────────────

  /**
   * Check if a specific product variant is in the wishlist.
   */
  const isInWishlist = useCallback(
    (productId, sku) => {
      if (!productId || !sku) return false;
      return wishlistData.some(
        (item) =>
          (item.productId === productId || item._id === productId) && item.sku === sku
      );
    },
    [wishlistData]
  );

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        // Logged-in user: fetch from API
        const response = await getWishlist();
        if (response.data?.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        // Guest: read from localStorage
        const localWishlist = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY)) || [];
        const formattedWishlist = localWishlist.map((item) => ({
          productId: item._id,
          _id: item._id,
          sku: item.sku,
          name: item.name,
          variant: item.variantName,
          image: item.image,
          displayPrice: item.displayPrice,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          status: item.status,
          avgRating: item.avgRating,
          totalRatings: item.totalRatings,
        }));
        setWishlistData(formattedWishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist data:', err);
      setWishlistData([]);
    }
  }, [user]);

  // Fetch on mount and whenever user changes
  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  // ─── Toggle ───────────────────────────────────────────────────────────────

  /**
   * Add or remove a product+variant from the wishlist.
   * Handles both logged-in and guest flows.
   *
   * @param {object} prod     - Normalized product object (must have _id, name, brand, etc.)
   * @param {object} variant  - Selected variant object (must have sku, stock, etc.)
   */
  const toggleWishlist = useCallback(
    async (prod, variant) => {
      if (!user || user.guest) {
        toast.error('Please login to use wishlist');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      if (!prod || !variant) {
        toast.error('Please select a variant first');
        return;
      }

      const productId = prod._id;
      const sku = getSku(variant);

      setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

      try {
        const currentlyInWishlist = wishlistData.some(
          (item) =>
            (item.productId === productId || item._id === productId) && item.sku === sku
        );

        if (currentlyInWishlist) {
          await removeFromWishlist(productId, { sku });
          toast.success('Removed from wishlist!');
        } else {
          await addToWishlist(productId, { sku });
          toast.success('Added to wishlist!');
        }

        await fetchWishlistData();
      } catch (err) {
        console.error('Wishlist toggle error:', err);
        if (err.response?.status === 401) {
          toast.error('Please login to use wishlist');
          navigate('/login', { state: { from: location.pathname } });
        } else {
          toast.error(getErrorMessage(err) || 'Failed to update wishlist');
        }
      } finally {
        setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
      }
    },
    [user, wishlistData, navigate, location.pathname, fetchWishlistData]
  );

  return {
    wishlistData,
    wishlistLoading,
    fetchWishlistData,
    toggleWishlist,
    isInWishlist,
  };
};

export { useWishlist };
export default useWishlist;
