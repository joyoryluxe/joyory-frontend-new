// src/api/paymentApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/payment/methods
 */
export const getPaymentMethods = async () => {
  return await axiosInstance.get(endpoints.payment.methods);
};

/**
 * POST /api/payment/set-payment-method
 */
export const setPaymentMethod = async (payload) => {
  return await axiosInstance.post(endpoints.payment.setPaymentMethod, payload);
};

/**
 * POST /api/payment/cod
 */
export const processCodPayment = async (payload) => {
  return await axiosInstance.post(endpoints.payment.cod, payload);
};

/**
 * POST /api/payment/cod/confirm
 */
export const confirmCodPayment = async (payload) => {
  return await axiosInstance.post(endpoints.payment.codConfirm, payload);
};

/**
 * POST /api/payment/razorpay/order
 */
export const createRazorpayOrder = async (payloadOrOrderId, paymentMethodKey, cartItems, shippingAddress, upiId = null) => {
  let payload;
  if (typeof payloadOrOrderId === "object" && payloadOrOrderId !== null) {
    payload = payloadOrOrderId;
  } else {
    payload = {
      orderId: payloadOrOrderId,
      paymentMethodKey,
      cart: cartItems,
      shippingAddress,
      upiId,
    };
  }
  return await axiosInstance.post(endpoints.payment.razorpayOrder, payload);
};

/**
 * POST /api/payment/razorpay/verify
 */
export const verifyRazorpayPayment = async (payloadOrOrderId, paymentResponse, cartItems, shippingAddress, upiId = null) => {
  let payload;
  if (typeof payloadOrOrderId === "object" && payloadOrOrderId !== null) {
    payload = payloadOrOrderId;
  } else {
    payload = {
      orderId: payloadOrOrderId,
      razorpay_order_id: paymentResponse?.razorpay_order_id,
      razorpay_payment_id: paymentResponse?.razorpay_payment_id,
      razorpay_signature: paymentResponse?.razorpay_signature,
      cart: cartItems,
      shippingAddress,
      upiId,
    };
  }
  return await axiosInstance.post(endpoints.payment.razorpayVerify, payload);
};

/**
 * POST /api/payment/wallet
 */
export const processWalletPayment = async (payload) => {
  return await axiosInstance.post(endpoints.payment.wallet, payload);
};

/**
 * POST /api/payment/giftcard
 */
export const processGiftCardPayment = async (payload) => {
  return await axiosInstance.post(endpoints.payment.giftcard, payload);
};

/**
 * GET /api/payment/refund-methods
 */
export const getRefundMethods = async () => {
  return await axiosInstance.get(endpoints.payment.refundMethods);
};

/**
 * POST /api/payment/refund-method
 */
export const setRefundMethod = async (payload) => {
  return await axiosInstance.post(endpoints.payment.setRefundMethod, payload);
};
