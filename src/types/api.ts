export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  timestamp: string;
  data?: T;
}