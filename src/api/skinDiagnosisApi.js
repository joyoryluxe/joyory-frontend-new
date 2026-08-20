// src/api/skinDiagnosisApi.js
import axiosInstance from "../utils/axiosInstance";

/**
 * POST /api/user/skin-diagnosis/analyze
 * Accepts FormData with 'selfie' / 'image' / 'photo' / 'file' field.
 * Can be called by guests or logged-in users.
 * Response includes: analysis (with skinMetrics), recommendedProducts (with stepLabel, timeOfDay, allergenAlert)
 */
export const analyzeSkin = async (formData) => {
  return await axiosInstance.post("/api/user/skin-diagnosis/analyze", formData, {
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
export const exportDiagnosisToRoutine = async (diagnosisId) => {
  return await axiosInstance.post("/api/user/skin-diagnosis/export-routine", { diagnosisId });
};

/**
 * GET /api/user/skin-diagnosis/history
 * Requires authenticated user. Returns past 10 diagnoses.
 */
export const getDiagnosisHistory = async () => {
  return await axiosInstance.get("/api/user/skin-diagnosis/history");
};

/**
 * GET /api/user/skin-diagnosis/:id
 * Returns single diagnosis by ID.
 */
export const getSingleDiagnosis = async (id) => {
  return await axiosInstance.get(`/api/user/skin-diagnosis/${id}`);
};
