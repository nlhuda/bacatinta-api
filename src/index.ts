import { contactHandler } from "./routes/contact";
import { getCorsHeaders, json } from "./utils/cors";
import type { WorkerEnv } from "./types/env";

export default {
  async fetch(
	request: Request, 
	env: WorkerEnv
	): Promise<Response> {
    
		const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: getCorsHeaders(origin),
      });
    }

    if (url.pathname === "/contact" && request.method === "POST") {
      return contactHandler(request, env);
    }

    return json(
      {
        error: "Not Found",
      },
      404,
      origin
    );
  },
} satisfies ExportedHandler<WorkerEnv>;