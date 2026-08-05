import type { ContactForm } from "../types/contact";

export function confirmationEmailTemplate(data: ContactForm) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">

      <h2>Hi ${data.name}, 👋</h2>

      <p>
        Thank you for contacting Bacatinta.
      </p>

      <p>
        I've received your message and will reply as soon as I can.
      </p>

      <hr>

      <p>
        Meanwhile, thank you for taking the time to reach out.
      </p>

      <p>
        — Nurul
      </p>

    </div>
  `;
}