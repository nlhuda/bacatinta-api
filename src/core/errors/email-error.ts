import { AppError } from "./app-error";
import { HTTP } from "../http/status";

export class EmailError extends AppError {

  constructor(message: string) {

    super(
      message,
      "EMAIL_ERROR",
      HTTP.INTERNAL_SERVER_ERROR
    );

  }

}