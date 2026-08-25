// src/components/common/SectionError.jsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import "../../styles/SectionError.css";

const SectionError = ({
  message = "Failed to load content. Please try again.",
  onRetry,
  className = "",
  style = {},
  title = "Something went wrong",
}) => {
  return (
    <div className={`section-error-container ${className}`} style={style}>
      <div className="section-error-icon-wrapper">
        <FaExclamationTriangle className="section-error-icon" />
      </div>
      <h4 className="section-error-title">{title}</h4>
      <p className="section-error-message">{message}</p>
      {typeof onRetry === "function" && (
        <button
          type="button"
          className="section-error-retry-btn"
          onClick={onRetry}
        >
          <IoReload />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default SectionError;
