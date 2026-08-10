import { AppError } from "./app-error";
import { HTTP } from "../http/status";
import { ERROR } from "./codes";

export class PayloadTooLargeError extends AppError {
  constructor() {
    super(
      "Request payload is too large.",
      HTTP.PAYLOAD_TOO_LARGE,
      ERROR.PAYLOAD_TOO_LARGE
    );

    this.name = "PayloadTooLargeError";
  }
}