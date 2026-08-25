// src/api/vtoApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getVtoEnabled = () =>
  axiosInstance.get(endpoints.vto.enabled);

export const getVtoWorkflow = (params = {}) =>
  axiosInstance.get(endpoints.vto.workflow, { params });
