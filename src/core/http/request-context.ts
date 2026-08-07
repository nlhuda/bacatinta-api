import { getRequestId } from "../../middleware/request-id";
import { createLogger } from "../../utils/request-logger";

export interface RequestContext {
  requestId: string;
  origin: string | null;
  startedAt: number;
  logger: ReturnType<typeof createLogger>;
}

export function createRequestContext(
  request: Request,
  route: string
): RequestContext {
  const requestId = getRequestId(request);

  return {
    requestId,
    origin: request.headers.get("Origin"),
    startedAt: Date.now(),
    logger: createLogger(requestId, route),
  };
}