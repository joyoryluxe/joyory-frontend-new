// src/components/common/SectionError.jsx
import React from "react";
import "../../styles/SectionError.css";

/**
 * SectionError — reusable error fallback card for page sections.
 */
const SectionError = ({
  message = "Failed to load this section.",
  onRetry,
  className = "",
  style = {}
}) => {
  return (
    <div className={`section-error-container ${className}`} style={style}>
      <div className="section-error-icon">⚠️</div>
      <p className="section-error-text">{message}</p>
      {onRetry && (
        <button className="section-error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default SectionError;
