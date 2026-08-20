// src/components/filters/SortDropdown.jsx
// Shared sort dropdown — replaces the duplicate "Sort by" desktop dropdown
// that was copy-pasted across ProductPage, BrandPage, SearchPage, VtoProducts, DiscountProductsPage.
//
// Usage:
//   <SortDropdown currentSort={filters.sort} onSortChange={(val) => setFilters(p => ({...p, sort: val}))} />

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { SORT_OPTIONS, SORT_LABELS } from '../../hooks/useProductFilters';

/**
 * SortDropdown — desktop "Sort by" button + floating dropdown list.
 *
 * @param {object}   props
 * @param {string}   props.currentSort     - Active sort value (e.g., 'recent')
 * @param {Function} props.onSortChange    - Called with new sort value string
 * @param {Array}    [props.options]        - Override sort options: [{ value, label }]
 * @param {string}   [props.className]     - Additional class on the wrapper
 */
const SortDropdown = ({ currentSort = 'recent', onSortChange, options, className = '' }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const sortOptions = options || SORT_OPTIONS;
  const currentLabel = SORT_LABELS[currentSort] || 'Newest First';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`d-none d-lg-flex align-items-center position-relative ${className}`}
      style={{ gap: '6px' }}
    >
      <span className="text-muted page-title-main-name" style={{ fontSize: '14px' }}>
        Sort by:
      </span>
      <div className="position-relative">
        <button
          type="button"
          className="btn btn-link text-decoration-none p-0 page-title-main-name fw-semibold text-dark d-inline-flex align-items-center gap-1"
          onClick={() => setOpen((prev) => !prev)}
          style={{ border: 'none', background: 'none', boxShadow: 'none', fontSize: '14px' }}
        >
          {currentLabel}
          <FaChevronDown
            style={{
              fontSize: '10px',
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'none',
            }}
          />
        </button>

        {open && (
          <>
            {/* Backdrop to close */}
            <div
              className="position-fixed top-0 start-0 w-100 h-100"
              style={{ zIndex: 998 }}
              onClick={() => setOpen(false)}
            />
            <ul
              className="dropdown-menu show dropdown-menu-end shadow-sm"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 999,
                border: '1px solid #eee',
                borderRadius: '8px',
                minWidth: '170px',
                display: 'block',
                marginTop: '5px',
                background: '#fff',
                padding: '5px 0',
              }}
            >
              {sortOptions.map(({ value, label }) => (
                <li key={value}>
                  <button
                    type="button"
                    className={`dropdown-item page-title-main-name py-2 custom-sort-item ${
                      currentSort === value ? 'active' : ''
                    }`}
                    onClick={() => {
                      onSortChange(value);
                      setOpen(false);
                    }}
                    style={{
                      fontSize: '13px',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: '8px 16px',
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;
