import type { ContactForm } from "../../types/contact";
import type { ValidationResult } from "./types";

export function validateContactForm(
  data: ContactForm
): ValidationResult {

  if (!data.name.trim()) {
    return {
      valid: false,
      field: "name",
      message: "Name is required.",
    };
  }

  if (!data.email.trim()) {
    return {
      valid: false,
      field: "email",
      message: "Email is required.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.email)) {

    return {
      valid: false,
      field: "email",
      message: "Invalid email address.",
    }
  }

  if (!data.message.trim()) {
    return {
      valid: false,
      field: "message",
      message: "Message is required.",
    };
  }

  return {
    valid: true,
  };
}