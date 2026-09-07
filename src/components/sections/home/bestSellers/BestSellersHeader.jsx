/**
 * BestSellersHeader.jsx
 * ─────────────────────────────────────────────────────────────
 * Section heading component for Best Sellers.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

const BestSellersHeader = ({ title = "Best Sellers" }) => {
  return (
    <h2 className="mb-3 text-left ms-lg-3 ps-lg-4 mb-2 mb-lg-4 best-seller-headings spacing fw-normal">
      {title}
    </h2>
  );
};

export default BestSellersHeader;
