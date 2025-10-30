

import axios from "axios";

// 🌍 Base URL setup (falls back to localhost for dev)
// const baseURL = process.env.NEXT_PUBLIC_API_BASE ?? "/hrm/api";
const baseURL = process.env.NEXT_PUBLIC_API_BASE ;

export const api = axios.create({
  baseURL,
  withCredentials: false, // ✅ since we're using JWT in headers
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

/**
 * ✅ Request Interceptor
 * Automatically attaches JWT from localStorage (or fallback to cookies)
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // 🧠 Look for token under both possible keys (for backward compatibility)
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") || // fallback for older setups
        document.cookie
          ?.split("; ")
          ?.find((r) => r.startsWith("authToken="))
          ?.split("=")[1] ||
        null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

        if (process.env.NODE_ENV === "development") {
          console.log(`🔑 [API] Token attached → ${config.url}`);
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn(`⚠️ [API] No token found for ${config.url}`);
        }
      }
    }

    return config;
  },
  (error) => {
    console.error("❌ [API] Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

/**
 * ✅ Response Interceptor
 * Handles 401 Unauthorized globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      console.warn("🔒 [API] 401 Unauthorized — clearing token");

      // 🧹 Remove invalid session data
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to login (small delay to show console message)
      setTimeout(() => {
        window.location.href = "/login";
      }, 300);
    }

    if (process.env.NODE_ENV === "development") {
      console.error("❗ [API] Response Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * 🚀 Startup Log
 */
if (process.env.NODE_ENV === "development") {
  console.log(`[API] Connected to backend → ${baseURL}`);
}
