// ✅ axiosInstance.js (fixed for guest + logged-in flow)
import axios from "axios";

export const getBackendUrl = () => {
  // 🚀 In Production build: ALWAYS target live production backend
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_BACKEND_URL && !import.meta.env.VITE_BACKEND_URL.includes("localhost")
      ? import.meta.env.VITE_BACKEND_URL
      : "https://beauty.joyory.com";
  }

  // 💻 In Local Development: target local machine or mobile LAN IP
  const envUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
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

// Interceptor – no forced redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: handled locally (guest mode fallback).");
    }
    return Promise.reject(error);
  }
);

// If custom/local backend configured in development, route hardcoded production URLs to it
axiosInstance.interceptors.request.use((config) => {
  const targetBackend = getBackendUrl();
  if (targetBackend !== "https://beauty.joyory.com" && config.url && config.url.includes("https://beauty.joyory.com")) {
    config.url = config.url.replace("https://beauty.joyory.com", targetBackend);
  }
  return config;
});

export default axiosInstance;
