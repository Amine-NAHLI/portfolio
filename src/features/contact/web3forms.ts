import "server-only";

import { sendContactNotification as sendViaMailer, type ContactNotification } from "@/features/contact/mailer";

export { createContactNotificationHtml, type ContactNotification } from "@/features/contact/email-template";

/**
 * Legacy Web3Forms dispatch wrapper for backward compatibility.
 * Delegates to the universal contact mailer.
 */
export async function sendContactNotification(contact: ContactNotification): Promise<void> {
  const result = await sendViaMailer(contact);
  if (!result.success) {
    throw new Error(result.error || "Failed to send email notification");
  }
}
