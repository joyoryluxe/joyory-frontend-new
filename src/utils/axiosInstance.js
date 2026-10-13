// ✅ axiosInstance.js (fixed for guest + logged-in flow)
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://beauty.joyory.com";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor — no forced redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ⚠️ Log the warning, but DO NOT redirect
      console.warn("Unauthorized: handled locally (guest mode fallback).");
    }
    return Promise.reject(error);
  }
);

// If custom backend configured, route hardcoded production URLs to it
axiosInstance.interceptors.request.use((config) => {
  if (BACKEND_URL !== "https://beauty.joyory.com" && config.url && config.url.includes("https://beauty.joyory.com")) {
    config.url = config.url.replace("https://beauty.joyory.com", BACKEND_URL);
  }
  return config;
});

export default axiosInstance;









//============================This-Two-code-want-To-Final-Code-If-any-prmble-want-to-Commented-code-want-to-un-Commented-and-check========================================
