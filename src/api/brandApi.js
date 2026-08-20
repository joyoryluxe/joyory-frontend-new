// src/api/brandApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/brands
 */
export const getAllBrands = async () => {
  return await axiosInstance.get(endpoints.brands.list);
};

/**
 * GET /api/user/brands/:slug
 */
export const getBrandBySlug = async (slug) => {
  return await axiosInstance.get(endpoints.brands.bySlug(slug));
};

/**
 * GET /api/user/brands/:brandSlug/:categorySlug
 */
export const getBrandCategoryProducts = async (brandSlug, categorySlug, params = {}) => {
  return await axiosInstance.get(endpoints.brands.categoryProducts(brandSlug, categorySlug), { params });
};
