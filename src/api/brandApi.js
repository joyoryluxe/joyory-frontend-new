// src/api/brandApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getBrands = (params = {}) =>
  axiosInstance.get(endpoints.brands.list, { params });

export const getBrandBySlug = (slug) =>
  axiosInstance.get(endpoints.brands.bySlug(slug));

export const getBrandCategoryProducts = (brandSlug, categorySlug, params = {}) =>
  axiosInstance.get(endpoints.brands.brandCategoryProducts(brandSlug, categorySlug), { params });
