// src/components/common/OutOfStockPopup.jsx
// Centralized Out-of-Stock popup — previously duplicated inline in 7+ files.

import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * OutOfStockPopup
 *
 * Props:
 *  - show {boolean}           — whether the popup is visible
 *  - productName {string}     — name of the out-of-stock product
 *  - onClose {Function}       — callback to close the popup
 */
const OutOfStockPopup = ({ show, productName, onClose }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px 40px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          animation: 'popupSlideIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
          }}
          aria-label="Close out of stock popup"
        >
          <FaTimes />
        </button>

        {/* Icon circle */}
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
          }}
        >
          <FaTimes style={{ color: '#dc3545', fontSize: '30px' }} />
        </div>

        {/* Heading */}
        <h5
          className="page-title-main-name"
          style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', color: '#333' }}
        >
          Out of Stock
        </h5>

        {/* Message */}
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Oops! {productName || 'This product'} is out of stock right now. Check back soon or
          discover similar items.
        </p>

        {/* CTA */}
        <button
          onClick={onClose}
          className="btn btn-dark w-100"
          style={{ borderRadius: '8px', padding: '10px' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default OutOfStockPopup;
