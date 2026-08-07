import { AppError } from "./app-error";
import { HTTP } from "../http/status";
import { ERROR } from "./codes";

export class EmailError extends AppError {
  constructor(message = "Failed to send email.") {
    super(
      message,
      HTTP.INTERNAL_SERVER_ERROR,
      ERROR.EMAIL
    );
  }
}