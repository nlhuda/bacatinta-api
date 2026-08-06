import { AppError } from "./app-error";
import { HTTP } from "../http/status";

export class TurnstileError extends AppError {

  constructor(message: string) {

    super(
      message,
      "TURNSTILE_FAILED",
      HTTP.FORBIDDEN
    );

  }

}