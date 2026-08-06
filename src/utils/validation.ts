import type { ContactForm } from "../types/contact";

export function validateContact(
  data: Partial<ContactForm>
): string | null {
  
  if (!data.name?.trim()) {
    return "Name is required.";
  }

  if (!data.email?.trim()) {
    return "Email is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.email)) {
    return "Invalid email address.";
  }

  if (!data.message?.trim()) {
    return "Message is required.";
  }

  return null;
}