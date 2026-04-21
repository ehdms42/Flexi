import { apiClient } from "./client";
import { ApiResponse } from "@types/api";

export interface SignUpRequest {
  username: string;
  password: string;
  passwordConfirmation: string;
  email: string;
}

export const signUp = async (body: SignUpRequest): Promise<void> => {
  const res = await apiClient.post<ApiResponse<null>>("/v1/users", body);
  if (res.data.result === "ERROR") {
    throw new Error(res.data.error?.message ?? "회원가입에 실패했습니다.");
  }
};
