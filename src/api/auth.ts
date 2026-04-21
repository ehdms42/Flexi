import { apiClient } from "./client";
import { ApiResponse } from "@types/api";

export interface GoogleLoginResponse {
  accessToken: string;
  username: string;
  isNewUser: boolean;
}

export const googleLogin = async (idToken: string): Promise<GoogleLoginResponse> => {
  const res = await apiClient.post<ApiResponse<GoogleLoginResponse>>("/v1/auth/google", {
    idToken,
  });
  if (res.data.result === "ERROR") {
    throw new Error(res.data.error?.message ?? "Google 로그인에 실패했습니다.");
  }
  return res.data.data!;
};
