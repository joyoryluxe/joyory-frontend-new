// src/api/orderApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getMyOrders = (params = {}) =>
  axiosInstance.get(endpoints.cart.orders, { params });

export const initiateOrder = (payload) =>
  axiosInstance.post(endpoints.cart.orderInitiate, payload);

export const getOrderTracking = (orderId) =>
  axiosInstance.get(endpoints.cart.tracking(orderId));

export const cancelOrder = (orderId, data = {}) =>
  axiosInstance.put(endpoints.cart.cancelOrder(orderId), data);

export const getShipmentDetails = (shipmentId) =>
  axiosInstance.get(endpoints.cart.shipment(shipmentId));

export const cancelShipment = (shipmentId, data = {}) =>
  axiosInstance.put(endpoints.cart.cancelShipment(shipmentId), data);

export const getInvoice = (invoiceId) =>
  axiosInstance.get(endpoints.cart.invoice(invoiceId));

export const getOrderById = (orderId) =>
  axiosInstance.get(endpoints.orders.byId(orderId));

export const getPaymentSuccess = (orderId) =>
  axiosInstance.get(endpoints.orders.paymentSuccess(orderId));
