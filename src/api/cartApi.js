// src/api/cartApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getCart = () => axiosInstance.get(endpoints.cart.base);
export const addToCart = (data) => axiosInstance.post(endpoints.cart.add, data);
export const updateCart = (data) => axiosInstance.put(endpoints.cart.update, data);
export const removeFromCart = (productId, params = {}) =>
  axiosInstance.delete(endpoints.cart.remove(productId), { params });
export const getCartSummary = (params = {}) => axiosInstance.get(endpoints.cart.summary, { params });
export const applyCoupon = (data) => axiosInstance.post(endpoints.cart.applyCoupon, data);
export const removeCoupon = () => axiosInstance.post(endpoints.cart.removeCoupon);
export const getOrders = (params = {}) => axiosInstance.get(endpoints.cart.orders, { params });
export const initiateOrder = (data) => axiosInstance.post(endpoints.cart.orderInitiate, data);
export const getTracking = (orderId) => axiosInstance.get(endpoints.cart.tracking(orderId));
export const cancelOrder = (orderId, data = {}) => axiosInstance.put(endpoints.cart.cancelOrder(orderId), data);
export const getShipment = (shipmentId) => axiosInstance.get(endpoints.cart.shipment(shipmentId));
export const cancelShipment = (shipmentId, data = {}) => axiosInstance.put(endpoints.cart.cancelShipment(shipmentId), data);
export const getInvoice = (invoiceId, config = { responseType: "blob" }) => axiosInstance.get(endpoints.cart.invoice(invoiceId), config);
export const getDiscountProducts = (discountId, paramsOrQuery = {}) => {
  const base = endpoints.cart.discount(discountId);
  if (typeof paramsOrQuery === "string") {
    const url = paramsOrQuery ? `${base}?${paramsOrQuery}` : base;
    return axiosInstance.get(url);
  }
  return axiosInstance.get(base, { params: paramsOrQuery });
};
export const moveToWishlist = (productId, data = {}) => axiosInstance.post(endpoints.cart.moveToWishlist(productId), data);
