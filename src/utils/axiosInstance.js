// ✅ axiosInstance.js (fixed for guest + logged-in flow)
import axios from "axios";

const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (!envUrl) return "https://beauty.joyory.com";
  if (typeof window !== "undefined" && window.location?.hostname && window.location.hostname !== "localhost") {
    return envUrl.replace("localhost", window.location.hostname).replace("127.0.0.1", window.location.hostname);
  }
  return envUrl;
};

const BACKEND_URL = getBackendUrl();

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
    config.url = config.url.replace("https://beauty.joyory.com", getBackendUrl());
  }
  return config;
});

export default axiosInstance;









//============================This-Two-code-want-To-Final-Code-If-any-prmble-want-to-Commented-code-want-to-un-Commented-and-check========================================
