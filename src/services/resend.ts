import { Resend } from "resend";

import type { ContactForm } from "../types/contact";
import type { WorkerEnv } from "../types/env";

import { config } from "../config";

import { adminEmailTemplate } from "../templates/admin-email";
import { confirmationEmailTemplate } from "../templates/confirmation-email";

export async function sendContactEmail(
  data: ContactForm,
  env: WorkerEnv
) {
  const resend = new Resend(env.RESEND_API_KEY);

  const [adminResult, userResult] = await Promise.all([

    // Email to you
    resend.emails.send({
      from: `${config.email.senderName} <${config.email.senderEmail}>`,
      to: [config.email.adminEmail],
      replyTo: data.email,
      subject: `New Inquiry from ${data.name}`,
      html: adminEmailTemplate(data),
    }),

    // Confirmation email to the user
    resend.emails.send({
      from: `${config.email.senderName} <${config.email.senderEmail}>`,
      to: [data.email],
      replyTo: config.email.adminEmail,
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