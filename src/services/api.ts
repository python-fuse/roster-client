import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      console.log("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);
