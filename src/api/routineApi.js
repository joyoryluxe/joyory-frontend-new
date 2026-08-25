// src/api/routineApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

export const getMyRoutines = () =>
  axiosInstance.get(endpoints.routines.my);

export const createRoutine = (data) =>
  axiosInstance.post(endpoints.routines.create, data);

export const getRoutineById = (routineId) =>
  axiosInstance.get(endpoints.routines.byId(routineId));

export const updateRoutine = (routineId, data) =>
  axiosInstance.put(endpoints.routines.byId(routineId), data);

export const deleteRoutine = (routineId) =>
  axiosInstance.delete(endpoints.routines.byId(routineId));

export const getPublicRoutine = (shareToken) =>
  axiosInstance.get(endpoints.routines.publicByToken(shareToken));

export const shareRoutine = (routineId, data = {}) =>
  axiosInstance.post(endpoints.routines.share(routineId), data);

export const getActiveReminders = () =>
  axiosInstance.get(endpoints.routines.activeReminders);

export const getTemplates = () =>
  axiosInstance.get(endpoints.routines.templates);

export const aiBuild = (data) =>
  axiosInstance.post(endpoints.routines.aiBuild, data);

export const checkConflicts = (data) =>
  axiosInstance.post(endpoints.routines.checkConflicts, data);

export const validateOrder = (data) =>
  axiosInstance.post(endpoints.routines.validateOrder, data);

export const getAudit = (routineId) =>
  axiosInstance.get(endpoints.routines.audit(routineId));

export const getCoach = (routineId) =>
  axiosInstance.get(endpoints.routines.coach(routineId));

export const getRoutineLogs = (routineId) =>
  axiosInstance.get(endpoints.routines.logs(routineId));

export const logRoutine = (routineId, data) =>
  axiosInstance.post(endpoints.routines.log(routineId), data);

export const getCalendar = (routineId) =>
  axiosInstance.get(endpoints.routines.calendar(routineId));

export const uploadProgressPhoto = (formData) =>
  axiosInstance.post(endpoints.routines.uploadProgressPhoto, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAlternatives = (productId) =>
  axiosInstance.get(endpoints.routines.alternatives(productId));

export const cloneRoutine = (shareToken) =>
  axiosInstance.post(endpoints.routines.clone(shareToken));

export const suggestProducts = (data) =>
  axiosInstance.post(endpoints.routines.suggest, data);

export const getSuggest = (params = {}) =>
  axiosInstance.get(endpoints.routines.suggest, { params });

export const addRoutineToCart = (routineId) =>
  axiosInstance.post(endpoints.routines.addToCart(routineId));
