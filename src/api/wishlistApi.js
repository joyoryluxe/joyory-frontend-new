// src/api/wishlistApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/wishlist
 */
export const getWishlist = async () => {
  return await axiosInstance.get(endpoints.wishlist.get);
};

/**
 * POST /api/user/wishlist/:productId
 */
export const addToWishlist = async (productId, payload = {}) => {
  return await axiosInstance.post(endpoints.wishlist.add(productId), payload);
};

/**
 * DELETE /api/user/wishlist/:productId
 */
export const removeFromWishlist = async (productId, payload = {}) => {
  return await axiosInstance.delete(endpoints.wishlist.remove(productId), { data: payload });
};

/**
 * POST /api/user/wishlist/:productId/move-to-cart
 */
export const moveToCart = async (productId, payload = {}) => {
  return await axiosInstance.post(endpoints.wishlist.moveToCart(productId), payload);
};

/**
 * POST /api/user/cart/:productId/move-to-wishlist
 */
export const moveToWishlist = async (productId, payload = {}) => {
  return await axiosInstance.post(endpoints.wishlist.moveToWishlist(productId), payload);
};
