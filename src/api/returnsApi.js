// src/api/returnsApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/returns/request/:shipmentId
 * @param {string} shipmentId
 * @param {FormData} formData – images keyed as images_<productId>
 */
export const requestReturn = async (shipmentId, formData) =>
  axiosInstance.post(endpoints.returns.request(shipmentId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** GET /api/returns/my */
export const getMyReturns = async () =>
  axiosInstance.get(endpoints.returns.myReturns);

/** GET /api/returns/details/:shipmentId/:returnId */
export const getReturnDetails = async (shipmentId, returnId) =>
  axiosInstance.get(endpoints.returns.details(shipmentId, returnId));

/** PUT /api/returns/cancel/:shipmentId/:returnId */
export const cancelReturn = async (shipmentId, returnId) =>
  axiosInstance.put(endpoints.returns.cancel(shipmentId, returnId));
