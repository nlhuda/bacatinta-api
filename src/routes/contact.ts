import { json } from "../utils/cors";
import { validateContact } from "../utils/validation";
import type { ContactForm } from "../types/contact";
import { sendContactEmail } from "../services/resend";
import type { WorkerEnv } from "../types/env";


export async function contactHandler(
    request: Request,
    env: WorkerEnv
    ) {

  const body = await request.json() as ContactForm;
  const origin = request.headers.get("Origin");

  const error = validateContact(body);

  if (error) {
    return json(
      {
        success: false,
        message: error,
        timestamp: new Date().toISOString()
      },
      400,
      origin
    );
  }

  try {
    await sendContactEmail(body, env);
    /*console.log("Secret exists:", !!env.RESEND_API_KEY);
    console.log("Secret length:", env.RESEND_API_KEY?.length);*/

    return json({
        success: true,
        message: "Message received successfully.",
        timestamp: new Date().toISOString()
    });

    } catch (error) {
    
    console.error({
    route: "/contact",
    error,
    timestamp: new Date().toISOString(),
});

    return json(
        {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
        },
        500,
    origin
    );
  }
}