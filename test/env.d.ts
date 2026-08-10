import type { WorkerEnv } from "../src/types/env";

declare module "cloudflare:test" {
  interface ProvidedEnv extends WorkerEnv {}
}