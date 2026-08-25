// src/api/categoryApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getCategoryTree = () =>
  axiosInstance.get(endpoints.categories.tree);

export const getCategoryLanding = (slug) =>
  axiosInstance.get(endpoints.categories.landing(slug));

export const getCategoryProducts = (slug, params = {}) =>
  axiosInstance.get(endpoints.categories.products(slug), { params });
