// src/api/seoBlogApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getSeoMeta = (params = {}, config = {}) =>
  axiosInstance.get(endpoints.seo.base, { params, ...config });

export const getSeoMetadata = getSeoMeta;

export const getBlogs = (params = {}) =>
  axiosInstance.get(endpoints.blogs.list, { params });

export const getBlogLanding = (params = {}) =>
  axiosInstance.get(endpoints.blogs.landing, { params });

export const getBlogDetails = (idOrSlug) =>
  axiosInstance.get(endpoints.blogs.byIdOrSlug(idOrSlug));

export const getBlogBySlug = (slug) =>
  axiosInstance.get(endpoints.blogs.bySlug(slug));

export const getMedia = () =>
  axiosInstance.get(endpoints.media.base);
