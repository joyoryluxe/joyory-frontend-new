// ✅ axiosInstance.js (fixed for guest + logged-in flow)
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:5000" : "https://beauty.joyory.com",
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

// Automatically route hardcoded production URLs to local backend in development
axiosInstance.interceptors.request.use((config) => {
  if (import.meta.env.DEV && config.url && config.url.includes("https://beauty.joyory.com")) {
    config.url = config.url.replace("https://beauty.joyory.com", "http://localhost:5000");
  }
  return config;
});

export default axiosInstance;









//============================This-Two-code-want-To-Final-Code-If-any-prmble-want-to-Commented-code-want-to-un-Commented-and-check========================================
