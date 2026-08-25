// src/api/wishlistApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getWishlist = (config = {}) => axiosInstance.get(endpoints.wishlist.base, config);
export const addToWishlist = (productId, data = {}) => axiosInstance.post(endpoints.wishlist.item(productId), data);
export const removeFromWishlist = (productId, data = {}) =>
  axiosInstance.delete(endpoints.wishlist.item(productId), Object.keys(data).length > 0 ? { data } : undefined);
export const moveToCart = (productId, data = {}) => axiosInstance.post(endpoints.wishlist.moveToCart(productId), data);
export const moveToWishlist = (productId, data = {}) => axiosInstance.post(endpoints.cart.moveToWishlist(productId), data);
