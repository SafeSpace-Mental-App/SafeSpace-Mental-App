// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from  .env file
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
