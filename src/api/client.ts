import axios from "axios";
import { useAuthStore } from "@stores/authStore";

// TODO: Sprint 2 — EXPO_PUBLIC_API_URL 환경변수로 교체 (Android 에뮬레이터: 10.0.2.2, 실기기: LAN IP, 배포: 실 서버 URL)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

let tokenLoadPromise: Promise<void> | null = null;

const ensureTokenLoaded = async () => {
  if (!tokenLoadPromise) {
    tokenLoadPromise = useAuthStore.getState().loadToken();
  }
  await tokenLoadPromise;
};

apiClient.interceptors.request.use(async (config) => {
  await ensureTokenLoaded();
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().loadToken();
        const token = useAuthStore.getState().token;

        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (e) {
        // Token refresh failed, user needs to re-authenticate
        await useAuthStore.getState().clearToken();
      }
    }

    return Promise.reject(error);
  }
);