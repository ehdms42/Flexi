export interface ApiResponse<T = null> {
  result: "SUCCESS" | "ERROR";
  data: T;
  error: { status: number; message: string } | null;
}
