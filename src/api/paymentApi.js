// src/api/paymentApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getPaymentMethods = () =>
  axiosInstance.get(endpoints.payment.methods);

export const setPaymentMethod = (data) =>
  axiosInstance.post(endpoints.payment.setPaymentMethod, data);

export const processCOD = (data) =>
  axiosInstance.post(endpoints.payment.cod, data);

export const confirmCOD = (data) =>
  axiosInstance.post(endpoints.payment.codConfirm, data);

export const createRazorpayOrder = (data) =>
  axiosInstance.post(endpoints.payment.razorpayOrder, data);

export const verifyRazorpayPayment = (data) =>
  axiosInstance.post(endpoints.payment.razorpayVerify, data);

export const processWalletPayment = (data) =>
  axiosInstance.post(endpoints.payment.wallet, data);

export const processGiftCardPayment = (data) =>
  axiosInstance.post(endpoints.payment.giftcard, data);

export const getRefundMethods = () =>
  axiosInstance.get(endpoints.payment.refundMethods);

export const setRefundMethod = (data) =>
  axiosInstance.post(endpoints.payment.refundMethod, data);

export const cancelPayment = (data) =>
  axiosInstance.post(endpoints.payment.cancel, data);
