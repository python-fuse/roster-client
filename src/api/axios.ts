import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    // console.log("📤 Making request:", {
    //   method: config.method?.toUpperCase(),
    //   url: config.url,
    //   baseURL: config.baseURL,
    //   withCredentials: config.withCredentials,
    //   headers: config.headers,
    // });
    return config;
  },
  (error) => {
    // console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    // console.log("📥 Response received:", {
    //   status: response.status,
    //   url: response.config.url,
    //   headers: response.headers,
    //   cookies: document.cookie, // Log current cookies
    // });
    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      cookies: document.cookie,
    });

    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized! Current cookies:", document.cookie);
    }

    return Promise.reject(error);
  }
);

export default api;
