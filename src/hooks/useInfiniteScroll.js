// src/hooks/useInfiniteScroll.js
// Centralized infinite scroll hook using IntersectionObserver + cursor pagination.
// Replaces the repeated "loaderRef + IntersectionObserver" block in
// ProductPage, BrandPage, SearchPage, VtoProducts, DiscountProductsPage, BestSellers, etc.
//
// Usage:
//   const { loaderRef } = useInfiniteScroll({ hasMore, loading, onLoadMore });

import { useEffect, useRef } from 'react';

/**
 * useInfiniteScroll — attaches an IntersectionObserver to a sentinel element.
 * When the sentinel enters the viewport and conditions are met, calls `onLoadMore`.
 *
 * @param {object} options
 * @param {boolean} options.hasMore    - Whether more items can be loaded
 * @param {boolean} options.loading    - Whether a fetch is in progress (prevents duplicate calls)
 * @param {Function} options.onLoadMore - Callback to load the next page
 * @param {string} [options.rootMargin] - IntersectionObserver rootMargin (default '100px')
 * @param {number} [options.threshold]  - IntersectionObserver threshold (default 0.1)
 * @returns {{ loaderRef: React.RefObject }} — attach as ref to sentinel div
 */
const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  rootMargin = '100px',
  threshold = 0.1,
}) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const sentinel = loaderRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [hasMore, loading, onLoadMore, rootMargin, threshold]);

  return { loaderRef };
};

export { useInfiniteScroll };
export default useInfiniteScroll;
