import { json } from "../utils/cors";
import { validateContactForm } from "../core/validation/contact";
import type { ContactForm } from "../types/contact";
import type { WorkerEnv } from "../types/env";
import { success } from "../core/http/response";
import { verifyTurnstile } from "../services/turnstile";
import { ValidationError } from "../core/errors/validation-error";
import { TurnstileError } from "../core/errors/turnstile-error";
import { PayloadTooLargeError } from "../core/errors/payload-too-large-error";
import { processContact } from "../services/contact.service";
import { asyncHandler } from "../middleware/async-handler";
import { createRequestContext } from "../core/http/request-context";

const MAX_REQUEST_SIZE = 100_000;

export const handleContact = asyncHandler(async (
  request: Request,
  env: WorkerEnv
) => {

  const ctx = createRequestContext(
    request,
    "/v1/contact"
  );

  ctx.logger.info("Incoming request");

  // --------------------------------------------------
  // 1. Reject oversized requests BEFORE reading body
  // --------------------------------------------------

  const MAX_PAYLOAD_SIZE = 100_000;

const contentLength = request.headers.get("Content-Length");

if (contentLength && Number(contentLength) > MAX_PAYLOAD_SIZE) {
  throw new PayloadTooLargeError();
}

const rawBody = await request.clone().arrayBuffer();

if (rawBody.byteLength > MAX_PAYLOAD_SIZE) {
  throw new PayloadTooLargeError();
}

  // --------------------------------------------------
  // 2. Parse body
  // --------------------------------------------------

  const body: ContactForm = await request.json();

  // --------------------------------------------------
  // 3. Turnstile
  // --------------------------------------------------

  if (!body.turnstileToken) {
    throw new ValidationError(
      "Missing Turnstile token."
    );
  }

  const turnstile = await verifyTurnstile(
    body.turnstileToken,
    env
  );

  if (!turnstile.success) {
    ctx.logger.warn(
      "Turnstile failed",
      turnstile
    );

    throw new TurnstileError();
  }

  ctx.logger.info("Turnstile verified");

  // --------------------------------------------------
  // 4. Validation
  // --------------------------------------------------

  const validation = validateContactForm(body);

  if (!validation.valid) {
    ctx.logger.warn(
      "Validation failed",
      validation
    );

    throw new ValidationError(
      validation.message ?? "Validation failed"
    );
  }

  ctx.logger.info("Validation passed");

  // --------------------------------------------------
  // 5. Process contact
  // --------------------------------------------------

  await processContact(body, env);

  ctx.logger.info("Email sent", {
    duration: Date.now() - ctx.startedAt,
  });

  // --------------------------------------------------
  // 6. Success
  // --------------------------------------------------

  return json(
    success(
      "Message received successfully.",
      ctx.requestId
    ),
    200,
    ctx.origin
  );
});