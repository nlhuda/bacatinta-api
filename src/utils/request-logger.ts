import { log } from "./logger";

export function createLogger(
  requestId: string,
  route: string
) {
  return {
    info(message: string, data?: unknown) {
      log({
        requestId,
        route,
        level: "info",
        message,
        data,
      });
    },

    warn(message: string, data?: unknown) {
      log({
        requestId,
        route,
        level: "warn",
        message,
        data,
      });
    },

    error(message: string, data?: unknown) {
      log({
        requestId,
        route,
        level: "error",
        message,
        data,
      });
    },
  };
}