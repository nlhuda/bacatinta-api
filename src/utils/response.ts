export function success(
  message: string,
  requestId: string,
  data?: unknown
) {
  return {
    success: true,
    message,
    requestId,
    timestamp: new Date().toISOString(),
    data,
  };
}

export function failure(
  message: string,
  requestId: string,
  data?: unknown
) {
  return {
    success: false,
    message,
    requestId,
    timestamp: new Date().toISOString(),
    data,
  };
}