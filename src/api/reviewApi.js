// src/api/reviewApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/reviews/add
 * @param {FormData} formData – review data + images
 */
export const addReview = async (formData) =>
  axiosInstance.post(endpoints.reviews.add, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * GET /api/reviews/product/:productId
 */
export const getProductReviews = async (productId, params = {}) =>
  axiosInstance.get(endpoints.reviews.byProduct(productId), { params });

/**
 * GET /api/reviews/product/:productId/top
 */
export const getTopReviews = async (productId) =>
  axiosInstance.get(endpoints.reviews.topByProduct(productId));

/**
 * POST /api/reviews/:reviewId/vote-helpful
 */
export const voteReviewHelpful = async (reviewId) =>
  axiosInstance.post(endpoints.reviews.voteHelpful(reviewId));

/**
 * POST /api/reviews/:reviewId/react
 */
export const reactToReview = async (reviewId, payload) =>
  axiosInstance.post(endpoints.reviews.react(reviewId), payload);

/**
 * POST /api/reviews/:reviewId/report
 */
export const reportReview = async (reviewId, payload) =>
  axiosInstance.post(endpoints.reviews.report(reviewId), payload);
