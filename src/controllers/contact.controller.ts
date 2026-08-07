import { json } from "../utils/cors";
import { validateContactForm } from "../core/validation/contact";
import type { ContactForm } from "../types/contact";
import type { WorkerEnv } from "../types/env";
import { success } from "../core/http/response";
import { verifyTurnstile } from "../services/turnstile";
import { ValidationError } from "../core/errors/validation-error";
import { TurnstileError } from "../core/errors/turnstile-error";
import { processContact } from "../services/contact.service";
import { asyncHandler } from "../middleware/async-handler";
import { createRequestContext } from "../core/http/request-context";

export const handleContact = asyncHandler(async (
  request: Request,
  env: WorkerEnv
) => {
  
    const ctx = createRequestContext(
    request,
    "/v1/contact"
    );
  
    ctx.logger.info("Incoming request");
  
    const body: ContactForm = await request.json();
  
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
      turnstile);
    
      throw new TurnstileError();
    }
  
  ctx.logger.info("Turnstile verified");
  
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
    
    await processContact(body, env);
  
    ctx.logger.info("Email sent", {
      duration: Date.now() - ctx.startedAt,
    });
  
    return json(
      success(
        "Message received successfully.",
        ctx.requestId
      ),
        200,
        ctx.origin
      );  
    }
)