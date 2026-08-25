// src/api/returnsApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const requestReturn = (shipmentId, formData) =>
  axiosInstance.post(endpoints.returns.request(shipmentId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyReturns = () =>
  axiosInstance.get(endpoints.returns.my);

export const getReturnDetails = (shipmentId, returnId) =>
  axiosInstance.get(endpoints.returns.details(shipmentId, returnId));

export const cancelReturn = (shipmentId, returnId) =>
  axiosInstance.post(endpoints.returns.cancel(shipmentId, returnId));
