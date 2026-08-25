// src/api/reviewApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const addReview = (formData) =>
  axiosInstance.post(endpoints.reviews.add, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getProductReviews = (productId, params = {}) =>
  axiosInstance.get(endpoints.reviews.byProduct(productId), { params });

export const getTopReviews = (productId, params = {}) =>
  axiosInstance.get(endpoints.reviews.topByProduct(productId), { params });

export const voteHelpful = (reviewId) =>
  axiosInstance.post(endpoints.reviews.voteHelpful(reviewId));

export const reactToReview = (reviewId, data) =>
  axiosInstance.post(endpoints.reviews.react(reviewId), data);

export const reportReview = (reviewId, data) =>
  axiosInstance.post(endpoints.reviews.report(reviewId), data);
