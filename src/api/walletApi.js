// src/api/walletApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/** GET /api/user/wallet */
export const getWallet = async () =>
  axiosInstance.get(endpoints.wallet.get);

/** POST /api/user/wallet/create-order */
export const createWalletOrder = async (payload) =>
  axiosInstance.post(endpoints.wallet.createOrder, payload);

/** POST /api/user/wallet/verify-payment */
export const verifyWalletPayment = async (payload) =>
  axiosInstance.post(endpoints.wallet.verifyPayment, payload);

/** POST /api/user/wallet/redeem */
export const redeemWalletPoints = async (payload) =>
  axiosInstance.post(endpoints.wallet.redeem, payload);
