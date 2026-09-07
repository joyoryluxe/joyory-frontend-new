/**
 * ForYouHeader.jsx
 * ─────────────────────────────────────────────────────────────
 * Section heading component for For You section.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

const ForYouHeader = ({ title = "Recommended For You" }) => {
  return (
    <h2 className="text-start foryou-heading ms-lg-3 ps-lg-4 ms-1 mt-3 mb-2 mb-lg-4 spacing fw-normal">
      {title}
    </h2>
  );
};

export default ForYouHeader;
