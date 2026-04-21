import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";

export type TaskPriority = "HOLD" | "NORMAL" | "HIGH" | "HIGHEST";

export interface CreateTaskRequest {
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
}

export interface TaskResponse {
  id: number;
  scheduleId: number;
  title: string;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
}

export interface ScheduleResponse {
  id: number;
  date: string;
  tasks: Omit<TaskResponse, "scheduleId">[];
}

export const createTask = async (body: CreateTaskRequest): Promise<TaskResponse> => {
  const res = await apiClient.post<ApiResponse<TaskResponse>>("/v1/schedules/tasks", body);
  if (res.data.result === "ERROR") {
    throw new Error(res.data.error?.message ?? "일정 생성에 실패했습니다.");
  }
  return res.data.data!;
};

export const getSchedule = async (date: string): Promise<ScheduleResponse | null> => {
  const res = await apiClient.get<ApiResponse<ScheduleResponse | null>>("/v1/schedules", {
    params: { date },
  });
  if (res.data.result === "ERROR") {
    throw new Error(res.data.error?.message ?? "일정 조회에 실패했습니다.");
  }
  return res.data.data;
};
