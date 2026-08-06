import { json } from "../utils/cors";
import { validateContact } from "../utils/validation";
import type { ContactForm } from "../types/contact";
import { sendContactEmail } from "../services/resend";
import type { WorkerEnv } from "../types/env";
import { success, failure } from "../utils/response";
import { verifyTurnstile } from "../services/turnstile";
import { getRequestId } from "../middleware/request-id";
import { createLogger } from "../utils/request-logger";


export async function contactHandler(
    request: Request,
    env: WorkerEnv
    ) {

  const requestId = getRequestId(request); 
  const logger = createLogger(
  requestId,
  "/v1/contact"
  );

  logger.info("Incoming request");

  const origin = request.headers.get("Origin");
  const body = await request.json() as ContactForm;

  if (!body.turnstileToken) {
  return json(
    failure("Missing Turnstile token.",
    requestId),
    400,
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
      turnstile["error-codes"]?.join(", ") ??
      "Turnstile verification failed.",
    requestId
    ),
    403,
    origin
  );
}

logger.info("Turnstile verified");

  const error = validateContact(body);

  if (error) {
    return json(
    failure("Validation failed.",
    requestId),
    400,
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
      200,
      origin
    );

    } catch (error) {
    
      logger.error(
        "Failed to send email",
        error
      );

    return json(
    failure("Validation failed.",
    requestId),
    500, 
    origin
);
  }
}