import { json } from "../utils/cors";
import { validateContactForm } from "../core/validation/contact";
import type { ContactForm } from "../types/contact";
import { sendContactEmail } from "../services/resend";
import type { WorkerEnv } from "../types/env";
import { success, failure } from "../core/http/response";
import { verifyTurnstile } from "../services/turnstile";
import { getRequestId } from "../middleware/request-id";
import { createLogger } from "../utils/request-logger";
import { HTTP } from "../core/http/status";
import { ERROR } from "../core/errors/codes";


export async function contactHandler(
    request: Request,
    env: WorkerEnv
    ) {
    
  const startedAt = Date.now();
  const requestId = getRequestId(request); 
  const logger = createLogger(
  requestId,
  "/v1/contact"
  );

  logger.info("Incoming request");

  const origin = request.headers.get("Origin");
  const body: ContactForm = await request.json();

  if (!body.turnstileToken) {
  return json(
    failure("Missing Turnstile token.",
    requestId),
    HTTP.BAD_REQUEST,
    origin
  );
}
  const turnstile = await verifyTurnstile(
  body.turnstileToken,
  env
);

if (!turnstile.success) {
  console.error("Turnstile failed:", turnstile);

  return json(
    failure(
    turnstile["error-codes"]?.join(", ")
      ?? "Turnstile verification failed.",
    requestId,
    ERROR.TURNSTILE
  ),
    HTTP.FORBIDDEN,
    origin
  );
}

logger.info("Turnstile verified");

  const validation = validateContactForm(body);

if (!validation.valid) {
  logger.warn("Validation failed", validation);

  return json(
    failure(
      validation.message ?? "Validation failed.",
      requestId,
      ERROR.VALIDATION
    ),
    HTTP.BAD_REQUEST,
    origin
  );
}

   logger.info("Validation passed");

  try {
    await sendContactEmail(body, env);

   logger.info("Email sent");

    return json(
    success(
      "Message received successfully.",
      requestId),
      HTTP.OK,
      origin
    );

    } catch (error) {
    
      logger.error(
        "Failed to send email",
        {
        error,
        duration: Date.now() - startedAt,
        }
      );

    return json(
  failure(
      "Failed to send email.",
      requestId,
      ERROR.EMAIL
      ),
      HTTP.INTERNAL_SERVER_ERROR,
      origin
    );
  }
}
