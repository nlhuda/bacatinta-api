export function success(
  message: string,
  requestId?: string,
  data?: unknown
) {
  return {
    success: true,
    requestId,
    message,
    timestamp: new Date().toISOString(),
    data,
  };
}

export function failure(
  message: string,
  requestId?: string,
  code?: string,
  data?: unknown
) {
  return {
    success: false,
    requestId,
    code,
    message,
    timestamp: new Date().toISOString(),
    data,
  };
}