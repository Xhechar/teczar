import axios from "axios";
import { BackendRoute } from "../shared/url";

export const api = axios.create({
  baseURL: "http://localhost:3001/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
