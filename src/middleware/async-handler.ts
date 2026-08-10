import { json } from "../utils/cors";
import { failure } from "../core/http/response";
import { HTTP } from "../core/http/status";
import { AppError } from "../core/errors/app-error";
import { getRequestId } from "./request-id";
import { createLogger } from "../utils/request-logger";

type AsyncHandler<TEnv> = (
  request: Request,
  env: TEnv
) => Promise<Response>;

export function asyncHandler<TEnv>(
  handler: AsyncHandler<TEnv>
): AsyncHandler<TEnv> {
  return async (request, env) => {
    const origin = request.headers.get("Origin");
    const requestId = getRequestId(request);
    const logger = createLogger(requestId, request.url);

    try {
      return await handler(request, env);
    } catch (error) {
      logger.error("Unhandled exception", error);

       console.log("ERROR TYPE:", error?.constructor?.name);
        console.log("IS APP ERROR:", error instanceof AppError);
        console.log("ERROR:", error);


      if (error instanceof AppError) {
        return json(
          failure(
            error.message,
            requestId,
            error.code
          ),
          error.status,
          origin
        );
      }

      return json(
        failure(
          "Internal server error.",
          requestId
        ),
        HTTP.INTERNAL_SERVER_ERROR,
        origin
      );
    }
  };
}