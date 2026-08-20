// src/api/routineApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * GET /api/user/routines/my
 */
export const getMyRoutines = async () => {
  return await axiosInstance.get(endpoints.routines.myRoutines);
};

/**
 * POST /api/user/routines/create
 */
export const createRoutine = async (payload) => {
  return await axiosInstance.post(endpoints.routines.create, payload);
};

/**
 * GET /api/user/routines/:routineId
 */
export const getRoutineById = async (routineId) => {
  return await axiosInstance.get(endpoints.routines.getById(routineId));
};

/**
 * PUT /api/user/routines/:routineId
 */
export const updateRoutine = async (routineId, payload) => {
  return await axiosInstance.put(endpoints.routines.update(routineId), payload);
};

/**
 * DELETE /api/user/routines/:routineId
 */
export const deleteRoutine = async (routineId) => {
  return await axiosInstance.delete(endpoints.routines.delete(routineId));
};

/**
 * GET /api/user/routines/public/:shareToken
 */
export const getPublicRoutine = async (shareToken) => {
  return await axiosInstance.get(endpoints.routines.publicRoutine(shareToken));
};

/**
 * POST /api/user/routines/:routineId/share
 */
export const shareRoutine = async (routineId) => {
  return await axiosInstance.post(endpoints.routines.share(routineId));
};

/**
 * GET /api/user/routines/reminders/active
 */
export const getActiveReminders = async () => {
  return await axiosInstance.get(endpoints.routines.reminders);
};

/**
 * GET /api/user/routines/templates
 */
export const getRoutineTemplates = async () => {
  return await axiosInstance.get(endpoints.routines.templates);
};

/**
 * POST /api/user/routines/ai-build
 */
export const aiBuildRoutine = async (query) => {
  return await axiosInstance.post(endpoints.routines.aiBuild, { query });
};

/**
 * POST /api/user/routines/check-conflicts
 */
export const checkRoutineConflicts = async (productIds) => {
  return await axiosInstance.post(endpoints.routines.checkConflicts, { productIds });
};

/**
 * POST /api/user/routines/validate-order
 */
export const validateRoutineOrder = async (steps) => {
  return await axiosInstance.post(endpoints.routines.validateOrder, { steps });
};

/**
 * GET /api/user/routines/:routineId/audit
 */
export const getRoutineAudit = async (routineId) => {
  return await axiosInstance.get(endpoints.routines.audit(routineId));
};

/**
 * GET /api/user/routines/:routineId/coach
 */
export const getRoutineCoach = async (routineId) => {
  return await axiosInstance.get(endpoints.routines.coach(routineId));
};

/**
 * GET /api/user/routines/:routineId/logs
 */
export const getRoutineLogs = async (routineId) => {
  return await axiosInstance.get(endpoints.routines.logs(routineId));
};

/**
 * POST /api/user/routines/:routineId/log
 */
export const logRoutineStep = async (routineId, payload) => {
  return await axiosInstance.post(endpoints.routines.log(routineId), payload);
};

/**
 * GET /api/user/routines/:routineId/calendar
 */
export const getRoutineCalendar = async (routineId) => {
  return await axiosInstance.get(endpoints.routines.calendar(routineId));
};

/**
 * POST /api/user/routines/upload-progress-photo
 * @param {FormData} formData – includes photo file + metadata
 */
export const uploadProgressPhoto = async (formData) => {
  return await axiosInstance.post(endpoints.routines.uploadProgressPhoto, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * GET /api/user/routines/products/:productId/alternatives
 */
export const getProductAlternatives = async (productId) => {
  return await axiosInstance.get(endpoints.routines.alternatives(productId));
};

/**
 * POST /api/user/routines/clone/:shareToken
 */
export const cloneRoutine = async (shareToken) => {
  return await axiosInstance.post(endpoints.routines.clone(shareToken));
};

/**
 * GET /api/user/routines/suggest
 */
export const getRoutineSuggestions = async () => {
  return await axiosInstance.get(endpoints.routines.suggest);
};

/**
 * POST /api/user/routines/:routineId/add-to-cart
 */
export const addRoutineToCart = async (routineId) => {
  return await axiosInstance.post(endpoints.routines.addToCart(routineId));
};
