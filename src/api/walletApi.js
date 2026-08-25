// src/api/walletApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getWallet = () =>
  axiosInstance.get(endpoints.wallet.base);

export const createWalletOrder = (data) =>
  axiosInstance.post(endpoints.wallet.createOrder, data);

export const verifyWalletPayment = (data) =>
  axiosInstance.post(endpoints.wallet.verifyPayment, data);

export const redeemWallet = (data) =>
  axiosInstance.post(endpoints.wallet.redeem, data);

export const refundWallet = (data) =>
  axiosInstance.post(endpoints.wallet.refund, data);

export const addReward = (data) =>
  axiosInstance.post(endpoints.wallet.addReward, data);
