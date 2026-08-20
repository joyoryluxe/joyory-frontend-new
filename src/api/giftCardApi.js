// src/api/giftCardApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/user/giftcards/create-order
 */
export const createGiftCardOrder = async (payload) => {
  return await axiosInstance.post(endpoints.giftCards.createOrder, payload);
};

/**
 * POST /api/user/giftcards/verify-payment
 */
export const verifyGiftCardPayment = async (payload) => {
  return await axiosInstance.post(endpoints.giftCards.verifyPayment, payload);
};

/**
 * POST /api/user/giftcards/redeem
 */
export const redeemGiftCard = async (payload) => {
  return await axiosInstance.post(endpoints.giftCards.redeem, payload);
};

/**
 * GET /api/user/giftcards/balance/:code/:pin
 */
export const checkGiftCardBalance = async (code, pin) => {
  return await axiosInstance.get(endpoints.giftCards.balance(code, pin));
};

/**
 * GET /api/user/giftcards/list
 */
export const getMyGiftCards = async () => {
  return await axiosInstance.get(endpoints.giftCards.list);
};

/**
 * GET /api/user/giftcards/details/:id
 */
export const getGiftCardDetails = async (id) => {
  return await axiosInstance.get(endpoints.giftCards.details(id));
};

/**
 * GET /api/user/giftcards/templates
 */
export const getGiftCardTemplates = async () => {
  return await axiosInstance.get(endpoints.giftCards.templates);
};
