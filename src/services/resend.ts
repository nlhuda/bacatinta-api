import type { ContactForm } from "../types/contact";
import type { WorkerEnv } from "../types/env";
import { adminEmailTemplate } from "../templates/admin-email";
import { confirmationEmailTemplate } from "../templates/confirmation-email";
import { EMAIL } from "../config/email";
import { createResendClient }
from "../core/services/resend";

export async function sendContactEmail(
  data: ContactForm,
  env: WorkerEnv
) {
  const resend =
    createResendClient(env);

  const [adminResult, userResult] = await Promise.all([

    // Email to you
    resend.emails.send({
      from: `${EMAIL.senderName} <${EMAIL.senderEmail}>`,
      to: [EMAIL.adminEmail],
      replyTo: data.email,
      subject: `New Inquiry from ${data.name}`,
      html: adminEmailTemplate(data),
    }),

    // Confirmation email to the user
    resend.emails.send({
      from: `${EMAIL.senderName} <${EMAIL.senderEmail}>`,
      to: [data.email],
      replyTo: EMAIL.adminEmail,
      subject: "Thank you for contacting Bacatinta",
      html: confirmationEmailTemplate(data),
    }),

  ]);

  if (adminResult.error || userResult.error) {
    throw new Error(
      adminResult.error?.message ??
      userResult.error?.message ??
      "Unknown Resend error"
    );
  }

  return {
    admin: adminResult,
    user: userResult,
  };
}