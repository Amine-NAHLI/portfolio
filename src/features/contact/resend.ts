import "server-only";

import { Resend } from "resend";
import { createContactNotificationHtml, type ContactNotification } from "@/features/contact/email-template";

export { createContactNotificationHtml, type ContactNotification } from "@/features/contact/email-template";

const recipient = "nahli-ami@upf.ac.ma";
const sender = "onboarding@resend.dev";

export async function sendContactNotification(contact: ContactNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: sender,
    to: recipient,
    replyTo: contact.email,
    subject: `[Portfolio] ${contact.subject}`,
    html: createContactNotificationHtml(contact),
  });
  if (error) throw new Error(error.message);
}
