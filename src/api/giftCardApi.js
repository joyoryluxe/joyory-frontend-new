// src/api/giftCardApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const createGiftCardOrder = (data) =>
  axiosInstance.post(endpoints.giftCards.createOrder, data);

export const verifyGiftCardPayment = (data) =>
  axiosInstance.post(endpoints.giftCards.verifyPayment, data);

export const redeemGiftCard = (data) =>
  axiosInstance.post(endpoints.giftCards.redeem, data);

export const getGiftCardBalance = (code, pin) =>
  axiosInstance.get(endpoints.giftCards.balance(code, pin));

export const listGiftCards = () =>
  axiosInstance.get(endpoints.giftCards.list);

export const getGiftCardDetails = (id) =>
  axiosInstance.get(endpoints.giftCards.details(id));

export const getGiftCardTemplates = () =>
  axiosInstance.get(endpoints.giftCards.templates);
