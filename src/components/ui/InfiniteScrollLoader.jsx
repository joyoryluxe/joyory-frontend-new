// src/components/ui/InfiniteScrollLoader.jsx
// Sentinel div used as the IntersectionObserver target for infinite scroll pagination.
// Pair this with the useInfiniteScroll hook.
//
// Usage:
//   const { loaderRef } = useInfiniteScroll({ hasMore, loading, onLoadMore });
//   ...
//   <InfiniteScrollLoader ref={loaderRef} loading={loadingMore} hasMore={hasMore} />

import React, { forwardRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * InfiniteScrollLoader — sentinel element + optional loading spinner.
 * Must be placed at the bottom of the scrollable list.
 *
 * @param {object}  props
 * @param {boolean} props.loading  - Show spinner when true
 * @param {boolean} props.hasMore  - Hide element when no more pages
 */
const InfiniteScrollLoader = forwardRef(function InfiniteScrollLoader(
  { loading = false, hasMore = true },
  ref
) {
  if (!hasMore && !loading) return null;

  return (
    <div
      ref={ref}
      className="w-100 d-flex justify-content-center align-items-center py-4"
      style={{ minHeight: '80px' }}
    >
      {loading && (
        <DotLottieReact
          src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
          loop
          autoplay
          style={{ width: 80, height: 80 }}
        />
      )}
    </div>
  );
});

export default InfiniteScrollLoader;
