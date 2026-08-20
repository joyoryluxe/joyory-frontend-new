// src/hooks/useProductFilters.js
// Centralized filter parsing hook — replaces parseFiltersFromSearchParams
// that was copy-pasted across ProductPage, ShopProduct, VtoProducts, BrandPage.
//
// Usage:
//   const { filters, setFilters, parseFilters } = useProductFilters(searchParams);

import { useState, useCallback } from 'react';

/**
 * Valid sort options accepted by the backend.
 */
const VALID_SORT_OPTIONS = [
  'recent',
  'priceHighToLow',
  'priceLowToHigh',
  'rating',
  'discountHighToLow',
  'discountLowToHigh',
];

/**
 * Human-readable labels for each sort value.
 */
export const SORT_LABELS = {
  recent: 'Newest First',
  priceLowToHigh: 'Price: Low to High',
  priceHighToLow: 'Price: High to Low',
  rating: 'Top Rated',
  discountHighToLow: 'Discount: High to Low',
  discountLowToHigh: 'Discount: Low to High',
};

/**
 * All sortable options as an array for rendering dropdowns.
 */
export const SORT_OPTIONS = VALID_SORT_OPTIONS.map((value) => ({
  value,
  label: SORT_LABELS[value],
}));

/**
 * The default (empty) filter state.
 */
export const DEFAULT_FILTERS = {
  brandIds: [],
  categoryIds: [],
  skinTypes: [],
  formulations: [],
  finishes: [],
  ingredients: [],
  priceRange: null,
  discountMin: null,
  minRating: '',
  sort: 'recent',
};

/**
 * Parse URLSearchParams into a structured filters object.
 * Handles both repeated params (?a=1&a=2) and comma-separated values (?a=1,2).
 *
 * @param {URLSearchParams} searchParams
 * @returns {object} filters
 */
export const parseFiltersFromSearchParams = (searchParams) => {
  const filters = { ...DEFAULT_FILTERS };

  const getMultiParam = (key) => {
    let values = searchParams.getAll(key);
    if (values.length === 0) {
      const commaValue = searchParams.get(key);
      if (commaValue) values = commaValue.split(',').map((s) => s.trim()).filter(Boolean);
    }
    // skinTypes use + instead of space in URL
    if (key === 'skinTypes') {
      return values.map((v) => v.replace(/\s+/g, '+'));
    }
    return values;
  };

  ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach((key) => {
    filters[key] = getMultiParam(key);
  });

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice !== null || maxPrice !== null) {
    filters.priceRange = {
      min: minPrice ? parseFloat(minPrice) : 0,
      max: maxPrice ? parseFloat(maxPrice) : null,
    };
  }

  const discountMin = searchParams.get('discountMin');
  if (discountMin !== null) filters.discountMin = parseFloat(discountMin);

  const minRating = searchParams.get('minRating');
  if (minRating !== null) filters.minRating = minRating;

  const sortParam = searchParams.get('sort');
  if (sortParam !== null && VALID_SORT_OPTIONS.includes(sortParam)) {
    filters.sort = sortParam;
  }

  return filters;
};

/**
 * Serialize a filters object back to URLSearchParams.
 * Used to keep the URL in sync when filters change.
 *
 * @param {object} filters
 * @returns {URLSearchParams}
 */
export const filtersToSearchParams = (filters) => {
  const params = new URLSearchParams();

  ['ingredients', 'skinTypes', 'brandIds', 'categoryIds', 'formulations', 'finishes'].forEach((key) => {
    (filters[key] || []).forEach((v) => params.append(key, v));
  });

  if (filters.priceRange) {
    if (filters.priceRange.min != null) params.set('minPrice', filters.priceRange.min);
    if (filters.priceRange.max != null) params.set('maxPrice', filters.priceRange.max);
  }

  if (filters.discountMin != null) params.set('discountMin', filters.discountMin);
  if (filters.minRating) params.set('minRating', filters.minRating);
  if (filters.sort && filters.sort !== 'recent') params.set('sort', filters.sort);

  return params;
};

/**
 * useProductFilters — custom hook for managing filter + sort state with URL sync.
 *
 * @param {URLSearchParams} searchParams - From useSearchParams()
 * @param {object} [overrides] - Additional default filter overrides (e.g., { brandIds: [brandSlug] })
 * @returns {{ filters, setFilters, parseFilters }}
 */
const useProductFilters = (searchParams, overrides = {}) => {
  const [filters, setFilters] = useState(() => ({
    ...parseFiltersFromSearchParams(searchParams),
    ...overrides,
  }));

  const parseFilters = useCallback(() => {
    return parseFiltersFromSearchParams(searchParams);
  }, [searchParams]);

  return { filters, setFilters, parseFilters };
};

export { useProductFilters };
export default useProductFilters;
