// api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://safe-place-sigma.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// ADD TOKEN ONLY IF USER IS LOGGED IN
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// SMART 401 HANDLER — DO NOT REDIRECT GUESTS ON PUBLIC FEED
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      const isPublicFeedRequest = error.config.url?.includes("/api/feeds");

      // ONLY REDIRECT IF:
      // 1. User HAD a token (was logged in, now expired)
      // 2. AND it's NOT the public feed endpoint
      if (token && token !== "null" && !isPublicFeedRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        window.location.href = "/signin";
      }
      // Guests on /api/feeds → 401 is normal → DO NOTHING
      // Let FeedPage handle it with dummy posts + guest banner
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
