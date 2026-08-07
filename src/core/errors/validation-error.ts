import { AppError } from "./app-error";
import { HTTP } from "../http/status";
import { ERROR } from "./codes";

export class ValidationError extends AppError {
  constructor(message: string) {
    super(
      message,
      HTTP.BAD_REQUEST,
      ERROR.VALIDATION
    );
  }
}