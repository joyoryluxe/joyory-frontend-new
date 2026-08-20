// src/components/ui/EmptyState.jsx
// Reusable empty state display — used when a product list, search result,
// or data section is empty. Replaces inline "no results" JSX in 8+ pages.
//
// Usage:
//   <EmptyState icon={<FaRegSadTear />} title="No products found" message="Try adjusting your filters." />

import React from 'react';

/**
 * EmptyState — a centered, reusable no-data illustration block.
 *
 * @param {object}  props
 * @param {React.ReactNode} [props.icon]      - Icon or emoji to display (optional)
 * @param {string}  [props.title]             - Bold heading
 * @param {string}  [props.message]           - Supporting subtext
 * @param {React.ReactNode} [props.action]    - Optional CTA button/link
 * @param {string}  [props.className]         - Additional wrapper class
 * @param {object}  [props.style]             - Additional inline styles on wrapper
 */
const EmptyState = ({
  icon = null,
  title = 'Nothing here yet',
  message = '',
  action = null,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center text-center py-5 ${className}`}
      style={{ minHeight: '200px', ...style }}
    >
      {icon && (
        <div className="mb-3" style={{ fontSize: '2.5rem', opacity: 0.45 }}>
          {icon}
        </div>
      )}
      {title && (
        <h5 className="page-title-main-name fw-semibold mb-1" style={{ color: '#555' }}>
          {title}
        </h5>
      )}
      {message && (
        <p className="text-muted page-title-main-name mb-3" style={{ fontSize: '14px', maxWidth: '320px' }}>
          {message}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
