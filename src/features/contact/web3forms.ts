import "server-only";

import { createContactNotificationHtml, type ContactNotification } from "@/features/contact/email-template";

export { createContactNotificationHtml, type ContactNotification } from "@/features/contact/email-template";

export async function sendContactNotification(contact: ContactNotification): Promise<void> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) throw new Error("WEB3FORMS_ACCESS_KEY is not configured.");

  const html = createContactNotificationHtml(contact);

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `[Portfolio] ${contact.subject}`,
      from_name: contact.name,
      replyto: contact.email,
      message: html,
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to send email via Web3Forms");
  }
}
