// src/api/orderApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/cart/orders
 */
export const getMyOrders = async () => {
  return await axiosInstance.get(endpoints.orders.myOrders);
};

/**
 * POST /api/user/cart/order/initiate
 */
export const initiateOrderFromCart = async (payload) => {
  return await axiosInstance.post(endpoints.orders.initiateFromCart, payload);
};

/**
 * GET /api/user/cart/tracking/:orderId
 */
export const getOrderTracking = async (orderId) => {
  return await axiosInstance.get(endpoints.orders.tracking(orderId));
};

/**
 * PUT or GET /api/user/cart/cancel/:orderId
 */
export const cancelOrder = async (orderIdOrPayload, payload = {}) => {
  if (typeof orderIdOrPayload === "object" && orderIdOrPayload !== null) {
    const { orderId, ...rest } = orderIdOrPayload;
    return await axiosInstance.put(endpoints.orders.cancel(orderId), rest);
  }
  return await axiosInstance.put(endpoints.orders.cancel(orderIdOrPayload), payload);
};

/**
 * GET /api/user/cart/shipment/:shipmentId
 */
export const getShipmentDetails = async (shipmentId) => {
  return await axiosInstance.get(endpoints.orders.shipment(shipmentId));
};

/**
 * PUT /api/user/cart/shipment/cancel/:shipmentId
 */
export const cancelShipment = async (shipmentId, payload = {}) => {
  return await axiosInstance.put(endpoints.orders.cancelShipment(shipmentId), payload);
};

/**
 * GET /api/user/cart/invoice/:invoiceId
 */
export const getInvoice = async (invoiceId, config = {}) => {
  return await axiosInstance.get(endpoints.orders.invoice(invoiceId), config);
};

/**
 * GET /api/user/cart/discount/:discountId
 */
export const getDiscountProducts = async (discountId) => {
  return await axiosInstance.get(endpoints.orders.discount(discountId));
};

/**
 * GET /api/user/orders/:orderId
 */
export const getOrderById = async (orderId) => {
  return await axiosInstance.get(endpoints.orders.byId(orderId));
};

/**
 * GET /api/payment/success/:orderId
 */
export const getPaymentSuccessOrder = async (orderId) => {
  return await axiosInstance.get(endpoints.orders.paymentSuccess(orderId));
};
