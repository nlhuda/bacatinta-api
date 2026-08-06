export interface LogEntry {
  requestId: string;
  route: string;
  level?: "info" | "warn" | "error";
  message: string;
  data?: unknown;
}

export function log(entry: LogEntry) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: entry.level ?? "info",
      requestId: entry.requestId,
      route: entry.route,
      message: entry.message,
      data: entry.data,
    })
  );
}