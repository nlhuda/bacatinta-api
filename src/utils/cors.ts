const allowedOrigins = [
  "http://localhost:4321",
  "https://nurulhuda.me",
  "https://bacatinta.com",
  "https://www.bacatinta.com",
  "https://huda.bacatinta.com"
];

export function getCorsHeaders(origin?: string | null) {
  const allowOrigin =
    origin && allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export function json(
  data: unknown,
  status = 200,
  origin?: string | null
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: getCorsHeaders(origin),
  });
}