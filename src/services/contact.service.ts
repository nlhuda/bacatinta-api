import type { ContactForm } from "../types/contact";
import type { WorkerEnv } from "../types/env";
import { sendContactEmail } from "./resend";

export async function processContact(
  body: ContactForm,
  env: WorkerEnv
) {
  
    await sendContactEmail(body, env);
  
}