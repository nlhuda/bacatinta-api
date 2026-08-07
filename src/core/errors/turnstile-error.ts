import { AppError } from "./app-error";
import { HTTP } from "../http/status";
import { ERROR } from "./codes";

export class TurnstileError extends AppError {
  constructor(message = "Turnstile verification failed.") {
    super(
      message,
      HTTP.FORBIDDEN,
      ERROR.TURNSTILE
    );
  }
}