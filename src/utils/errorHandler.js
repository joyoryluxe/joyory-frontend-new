// src/utils/errorHandler.js
// Centralized API error message extraction utility

export function getErrorMessage(error, defaultMessage = "An unexpected error occurred.") {
  if (!error) return defaultMessage;
  if (typeof error === "string") return error;
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) {
      if (typeof data.error === "string") return data.error;
      if (data.error.message) return data.error.message;
    }
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e) => e.msg || e.message || e).join(", ");
    }
  }
  if (error.message) return error.message;
  return defaultMessage;
}

export function handleApiError(error, defaultMessage = "An unexpected error occurred.") {
  return getErrorMessage(error, defaultMessage);
}

export default getErrorMessage;
