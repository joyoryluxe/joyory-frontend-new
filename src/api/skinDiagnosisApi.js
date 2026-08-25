// src/api/skinDiagnosisApi.js
import axiosInstance from "../utils/axiosInstance";
import { endpoints } from "../utils/endpoints";

/**
 * POST /api/user/skin-diagnosis/analyze
 * Accepts FormData with 'selfie' / 'image' / 'photo' / 'file' field.
 * Can be called by guests or logged-in users.
 * Response includes: analysis (with skinMetrics), recommendedProducts (with stepLabel, timeOfDay, allergenAlert)
 */
export const analyzeSkin = (formData) => {
  return axiosInstance.post(endpoints.skinDiagnosis.analyze, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * POST /api/user/skin-diagnosis/export-routine
 * Requires authentication.
 * Builds and saves a BeautyRoutine from a completed skin diagnosis entirely server-side.
 * Send: { diagnosisId }
 */
export const exportDiagnosisToRoutine = (diagnosisId) => {
  return axiosInstance.post(endpoints.skinDiagnosis.exportRoutine, { diagnosisId });
};

// Alias matching prompt specification
export const exportRoutine = exportDiagnosisToRoutine;

/**
 * GET /api/user/skin-diagnosis/history
 * Requires authenticated user. Returns past 10 diagnoses.
 */
export const getDiagnosisHistory = () => {
  return axiosInstance.get(endpoints.skinDiagnosis.history);
};

/**
 * GET /api/user/skin-diagnosis/:id
 * Returns single diagnosis by ID.
 */
export const getSingleDiagnosis = (id) => {
  return axiosInstance.get(endpoints.skinDiagnosis.byId(id));
};

// Alias matching prompt specification
export const getDiagnosisById = getSingleDiagnosis;
