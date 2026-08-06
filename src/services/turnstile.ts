import type { WorkerEnv } from "../types/env";

export interface TurnstileResult {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstile(
  token: string,
  env: WorkerEnv
): Promise<TurnstileResult> {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const result = (await response.json()) as TurnstileResult;

  console.log("Turnstile verification:", result);

  return result;
}