/**
 * BestSellersEmptyState.jsx
 * ─────────────────────────────────────────────────────────────
 * Empty state fallback UI for Best Sellers section.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

const BestSellersEmptyState = ({ onRefresh }) => {
  return (
    <div className="text-center py-5">
      <i className="bi bi-box-seam display-4 text-muted"></i>
      <p className="text-muted mt-3">
        No products available at the moment.
      </p>
      {onRefresh && (
        <button className="btn btn-primary mt-2" onClick={onRefresh}>
          Refresh
        </button>
      )}
    </div>
  );
};

export default BestSellersEmptyState;
