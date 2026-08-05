import type { ContactForm } from "../types/contact";

export function adminEmailTemplate(data: ContactForm) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>📬 New Inquiry</h2>

      <p><strong>Name:</strong> ${data.name}</p>

      <p><strong>Email:</strong> ${data.email}</p>

      <hr>

      <p>${data.message}</p>
    </div>
  `;
}