import axios from "axios";
import { useAuthStore } from "@stores/authStore";

// TODO: Sprint 2 — EXPO_PUBLIC_API_URL 환경변수로 교체 (Android 에뮬레이터: 10.0.2.2, 실기기: LAN IP, 배포: 실 서버 URL)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
