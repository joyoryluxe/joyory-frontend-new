// src/api/seoBlogApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/seo
 * @param {Object} params – query params e.g. { type, slug, page }
 */
export const getSeoMeta = async (params = {}) => {
  return await axiosInstance.get(endpoints.seo.meta, { params });
};

/**
 * GET /api/blogs
 */
export const getBlogsList = async (params = {}) => {
  return await axiosInstance.get(endpoints.blogs.list, { params });
};

/**
 * GET /api/blogs/landing
 */
export const getBlogLanding = async (params = {}) => {
  return await axiosInstance.get(endpoints.blogs.landing, { params });
};

/**
 * GET /api/blogs/:idOrSlug
 */
export const getBlogDetails = async (idOrSlug) => {
  return await axiosInstance.get(endpoints.blogs.details(idOrSlug));
};

/**
 * GET /api/blogs/slug/:slug
 */
export const getBlogBySlug = async (slug) => {
  return await axiosInstance.get(endpoints.blogs.bySlug(slug));
};
