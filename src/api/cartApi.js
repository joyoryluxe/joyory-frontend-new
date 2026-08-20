// src/api/cartApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/cart
 */
export const getCart = async () => {
  return await axiosInstance.get(endpoints.cart.get);
};

/**
 * POST /api/user/cart/add
 */
export const addToCart = async (payload) => {
  return await axiosInstance.post(endpoints.cart.add, payload);
};

/**
 * PUT /api/user/cart/update
 */
export const updateCartQuantity = async (payload) => {
  return await axiosInstance.put(endpoints.cart.update, payload);
};

/**
 * DELETE /api/user/cart/remove/:productId
 */
export const removeFromCart = async (productId, params = {}) => {
  return await axiosInstance.delete(endpoints.cart.remove(productId), { params });
};

/**
 * GET /api/user/cart/summary
 */
export const getCartSummary = async (params = {}) => {
  return await axiosInstance.get(endpoints.cart.summary, { params });
};

/**
 * POST /api/user/cart/apply-coupon
 */
export const applyCoupon = async (code) => {
  return await axiosInstance.post(endpoints.cart.applyCoupon, { code });
};

/**
 * POST /api/user/cart/remove-coupon
 */
export const removeCoupon = async () => {
  return await axiosInstance.post(endpoints.cart.removeCoupon);
};

/**
 * POST /api/user/cart/:productId/move-to-wishlist
 */
export const moveCartItemToWishlist = async (productId, payload = {}) => {
  return await axiosInstance.post(endpoints.wishlist.moveToWishlist(productId), payload);
};

/**
 * POST /api/user/cart/order/initiate
 */
export const initiateOrder = async (payload) => {
  return await axiosInstance.post(endpoints.orders.initiateFromCart, payload);
};

/**
 * GET /api/user/recommendations/cart
 */
export const getCartRecommendations = async () => {
  return await axiosInstance.get(endpoints.recommendations.cart);
};
