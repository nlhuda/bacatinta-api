export function getRequestId(request: Request): string {
  // If Cloudflare already provides one, use it
  const incoming =
    request.headers.get("CF-Ray") ??
    request.headers.get("x-request-id");

  if (incoming) {
    return incoming;
  }

  // Otherwise generate our own
  return crypto.randomUUID();
}