// ✅ axiosInstance.js (fixed for guest + logged-in flow)
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://beauty.joyory.com", // backend URL
  baseURL: "https://beauty.joyory.com", // backend URL
  withCredentials: true, // send cookies automatically
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

export default axiosInstance;









//============================This-Two-code-want-To-Final-Code-If-any-prmble-want-to-Commented-code-want-to-un-Commented-and-check========================================
