// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://beauty.joyory.com", // your backend URL
//   withCredentials: true, // ✅ send cookies automatically
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Optional: intercept responses for auto handling 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       alert("Session expired. Please log in again.");
//       window.location.href = "/login"; // redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;










//============================This-Two-code-want-To-Final-Code-If-any-prmble-want-to-Commented-code-want-to-un-Commented-and-check========================================



// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://beauty.joyory.com", // backend URL
//   withCredentials: true, // ✅ send cookies automatically with requests
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Optional: handle 401 errors globally
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized. Redirecting to login...");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;










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
