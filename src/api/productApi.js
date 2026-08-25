// src/api/productApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getAllProducts = (paramsOrQuery = {}, config = {}) => {
  if (typeof paramsOrQuery === "string") {
    const url = paramsOrQuery ? `${endpoints.products.all}?${paramsOrQuery}` : endpoints.products.all;
    return axiosInstance.get(url, config);
  }
  return axiosInstance.get(endpoints.products.all, { params: paramsOrQuery, ...config });
};

export const getProductDetails = (idOrSlug, params = {}, config = {}) =>
  axiosInstance.get(endpoints.products.details(idOrSlug), { params, ...config });

export const getProductById = getProductDetails;
export const getProductBySlug = getProductDetails;

export const getTopSellers = (params = {}) =>
  axiosInstance.get(endpoints.products.topSellers, { params });

export const getTopCategories = () =>
  axiosInstance.get(endpoints.products.topCategories);

export const getFilters = (params = {}) =>
  axiosInstance.get(endpoints.products.filters, { params });

export const getSkinTypes = () =>
  axiosInstance.get(endpoints.products.skinTypes);

export const getCategoryProducts = (slug, params = {}) =>
  axiosInstance.get(endpoints.products.categoryProducts(slug), { params });
