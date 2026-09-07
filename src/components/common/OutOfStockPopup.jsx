/**
 * OutOfStockPopup.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable "Out of Stock" notification modal popup.
 * Supports standard embedded rendering as well as document.body
 * Portal rendering via the `usePortal` prop.
 * ─────────────────────────────────────────────────────────────
 * Props:
 *   isOpen      {boolean}  — visibility control
 *   onClose     {function} — dismiss callback
 *   productName {string}   — name of the out of stock item
 *   usePortal   {boolean}  — whether to render using createPortal
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

const OutOfStockPopup = ({
  isOpen,
  onClose,
  productName = "This product",
  usePortal = false,
}) => {
  if (!isOpen) return null;

  const content = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px 40px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          position: "relative",
          animation: "popupSlideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close out of stock popup"
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          <FaTimes />
        </button>

        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#fee2e2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 15px",
          }}
        >
          <FaTimes
            style={{
              color: "#dc3545",
              fontSize: "30px",
            }}
          />
        </div>

        <h5
          className="page-title-main-name"
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Out of Stock
        </h5>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "20px",
          }}
        >
          &quot;Oops! {productName} is out of stock right now. Check back soon or discover similar items.&quot;
        </p>

        <button
          onClick={onClose}
          className="btn btn-dark w-100"
          style={{
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          Got it
        </button>
      </div>

      <style>{`
        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );

  if (usePortal && typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
};

export default OutOfStockPopup;
