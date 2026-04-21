import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";
import { AxiosError } from "axios";

export interface SignUpRequest {
  username: string;
  password: string;
  passwordConfirmation: string;
  email: string;
}

export const signUp = async (body: SignUpRequest): Promise<void> => {
  try {
    const res = await apiClient.post<ApiResponse<null>>("/v1/users", body);
    if (res.data.result === "ERROR") {
      throw new Error(res.data.error?.message ?? "회원가입에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const serverMessage = error.response?.data?.error?.message || error.message;
      throw new Error(serverMessage || "회원가입에 실패했습니다.");
    }
    throw error;
  }
};

export const checkUsername = async (username: string): Promise<void> => {
  try {
    const res = await apiClient.get<ApiResponse<null>>("/v1/users/check-username", {
      params: { username },
    });
    if (res.data.result === "ERROR") {
      throw new Error(res.data.error?.message ?? "이미 사용 중인 아이디입니다.");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const serverMessage = error.response?.data?.error?.message || error.message;
      throw new Error(serverMessage || "이미 사용 중인 아이디입니다.");
    }
    throw error;
  }
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  try {
    const res = await apiClient.post<ApiResponse<LoginResponse>>("/v1/users/login", body);
    if (res.data.result === "ERROR") {
      throw new Error(res.data.error?.message ?? "로그인에 실패했습니다.");
    }
    return res.data.data!;
  } catch (error) {
    if (error instanceof AxiosError) {
      const serverMessage = error.response?.data?.error?.message || error.message;
      throw new Error(serverMessage || "로그인에 실패했습니다.");
    }
    throw error;
  }
};