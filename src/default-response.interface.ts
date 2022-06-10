export interface DefaultResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  error?: string;
  data?: any;
}
