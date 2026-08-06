import { AppError } from "./app-error";
import { HTTP } from "../http/status";

export class ValidationError extends AppError {

  constructor(message: string) {

    super(
      message,
      "VALIDATION_ERROR",
      HTTP.BAD_REQUEST
    );

  }

}