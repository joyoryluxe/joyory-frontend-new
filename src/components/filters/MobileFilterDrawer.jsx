// src/components/filters/MobileFilterDrawer.jsx
// Shared mobile bottom-sheet offcanvas for filters and sort.
// Replaces the near-identical mobile filter/sort drawer JSX in
// ProductPage, BrandPage, SearchPage, VtoProducts.
//
// Usage:
//   <MobileFilterDrawer
//     showFilter={showFilterOffcanvas}
//     showSort={showSortOffcanvas}
//     onCloseFilter={() => setShowFilterOffcanvas(false)}
//     onCloseSort={() => setShowSortOffcanvas(false)}
//     currentSort={filters.sort}
//     onSortChange={(val) => { setFilters(p => ({...p, sort: val})); setShowSortOffcanvas(false); }}
//   >
//     <BrandFilter {...brandFilterProps} onClose={() => setShowFilterOffcanvas(false)} />
//   </MobileFilterDrawer>

import React from 'react';
import { SORT_OPTIONS } from '../../hooks/useProductFilters';

/**
 * MobileFilterDrawer — bottom-sheet offcanvas for filter panel + sort list.
 *
 * @param {object}          props
 * @param {boolean}         props.showFilter        - Show filter offcanvas
 * @param {boolean}         props.showSort           - Show sort offcanvas
 * @param {Function}        props.onCloseFilter      - Close filter callback
 * @param {Function}        props.onCloseSort        - Close sort callback
 * @param {string}          props.currentSort        - Currently selected sort value
 * @param {Function}        props.onSortChange       - (value: string) => void
 * @param {React.ReactNode} [props.children]          - Filter panel content (e.g., <BrandFilter />)
 * @param {Array}           [props.sortOptions]       - Override sort options
 */
const MobileFilterDrawer = ({
  showFilter = false,
  showSort = false,
  onCloseFilter,
  onCloseSort,
  currentSort = 'recent',
  onSortChange,
  children,
  sortOptions,
}) => {
  const options = sortOptions || SORT_OPTIONS;

  const drawerBaseStyle = {
    zIndex: 1050,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    boxShadow: '0 -4px 20px rgba(0,0,0,.2)',
  };

  return (
    <>
      {/* ── Filter Offcanvas ─────────────────────────────────────── */}
      {showFilter && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, zIndex: 1040 }}
            onClick={onCloseFilter}
          />
          <div
            className="position-fixed start-0 bottom-0 w-100 bg-white"
            style={{ ...drawerBaseStyle, maxHeight: '85vh' }}
          >
            <div className="text-center py-3 position-relative">
              <h5 className="mb-0 fw-bold">Filters</h5>
              <button
                className="btn-close position-absolute end-0 me-3"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                onClick={onCloseFilter}
              />
              <div
                className="mx-auto mt-2 bg-secondary"
                style={{ height: 5, width: 50, borderRadius: 3 }}
              />
            </div>
            <div className="px-3 pb-4 overflow-auto" style={{ maxHeight: '70vh' }}>
              {children}
            </div>
          </div>
        </>
      )}

      {/* ── Sort Offcanvas ───────────────────────────────────────── */}
      {showSort && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, zIndex: 1040 }}
            onClick={onCloseSort}
          />
          <div
            className="position-fixed start-0 bottom-0 w-100 bg-white"
            style={{ ...drawerBaseStyle, maxHeight: '60vh' }}
          >
            <div className="text-center py-3 position-relative">
              <h5 className="mb-0 fw-bold page-title-main-name">Sort by</h5>
              <button
                className="btn-close position-absolute end-0 me-3"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                onClick={onCloseSort}
              />
              <div
                className="mx-auto mt-2 bg-secondary"
                style={{ height: 5, width: 50, borderRadius: 3 }}
              />
            </div>
            <div className="px-4 pb-4">
              <div className="list-group">
                {options.map(({ value, label }) => (
                  <label key={value} className="list-group-item py-3 d-flex align-items-center">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      name="mobile-sort"
                      checked={currentSort === value}
                      onChange={() => {
                        if (onSortChange) onSortChange(value);
                        if (onCloseSort) onCloseSort();
                      }}
                    />
                    <span className="page-title-main-name">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileFilterDrawer;
