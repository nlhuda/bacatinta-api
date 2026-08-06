import { contactHandler } from "./routes/contact";
import { json, getCorsHeaders } from "./utils/cors";
import type { WorkerEnv } from "./types/env";
import { healthHandler } from "./routes/health";
import { Routes } from "./constants/routes";

export async function router(
  request: Request,
  env: WorkerEnv
) {

  const url = new URL(request.url);

  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: getCorsHeaders(origin),
    });
  }
  if (
  url.pathname === Routes.health &&
  request.method === "GET"
) {
  return healthHandler(request);
}

  if (
    url.pathname === Routes.contact &&
    request.method === "POST"
  ) {
    return contactHandler(request, env);
  }

  return json(
    {
      success: false,
      message: "Endpoint not found.",
      timestamp: new Date().toISOString(),
    },
    404,
    origin
  );
}