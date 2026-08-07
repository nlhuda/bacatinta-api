import { handleContact } from "../controllers/contact.controller";
import type { WorkerEnv } from "../types/env";

export async function contactHandler(
    request: Request,
    env: WorkerEnv
    ) {
      
    return handleContact(request, env);
  }
