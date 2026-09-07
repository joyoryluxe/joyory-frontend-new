/**
 * TrustBadgeItem.jsx
 * ─────────────────────────────────────────────────────────────
 * Individual trust badge item with centered icon, title, and subtitle.
 * Matches joyory.com production design exactly.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

const TrustBadgeItem = ({ icon, title, subtitle }) => {
  return (
    <div className="col-lg-3 col-6 mt-lg-3 mt-4">
      <div className="item p-0 ms-lg-0">
        <div className="icon">
          <img src={icon} width={"40px"} alt={title || "Badge"} />
        </div>
        <div className="title mt-lg-3 mt-3 title-main text-center fs-6">
          {title}
        </div>
        <div className="mt-2 subtitle-Certificate text-center">
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default TrustBadgeItem;
