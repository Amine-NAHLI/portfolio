import "server-only";

import { createContactNotificationHtml, type ContactNotification } from "@/features/contact/email-template";

export { createContactNotificationHtml, type ContactNotification } from "@/features/contact/email-template";

export type MailerResult = {
  success: boolean;
  provider: "resend" | "brevo" | "web3forms" | "none";
  error?: string;
  details?: unknown;
};

/**
 * Universal Server-Side Contact Notification Mailer.
 * 
 * Securely dispatches emails directly from the server, avoiding:
 * 1. Adblocker / Brave Shields blocks on the client browser.
 * 2. Cloudflare Bot Challenges on server-to-server form aggregators.
 * 3. Client-side API key leakage.
 * 
 * Provider Priority:
 * 1. Resend (Primary recommendation: 3,000 free emails/month, 0 Cloudflare challenges, official Vercel/Next.js partner)
 * 2. Brevo / Sendinblue (Alternative REST API: 300 free emails/day)
 * 3. Web3Forms (Fallback if access key provided)
 */
export async function sendContactNotification(contact: ContactNotification): Promise<MailerResult> {
  const targetEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "nahli-ami@upf.ac.ma";
  const html = createContactNotificationHtml(contact);
  const subject = `[Portfolio] ${contact.subject} — ${contact.name}`;

  // 1. Primary: Resend REST API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Amine Nahli <onboarding@resend.dev>";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [targetEmail],
          reply_to: contact.email,
          subject,
          html,
        }),
      });

      const data = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
      if (response.ok && data?.id) {
        return { success: true, provider: "resend", details: data };
      }
      console.warn("Resend email delivery failure:", data?.message || response.statusText);
    } catch (error) {
      console.warn("Resend network error:", error);
    }
  }

  // 2. Alternative: Brevo REST API
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "nahli-ami@upf.ac.ma";
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Portfolio Amine Nahli", email: fromEmail },
          to: [{ email: targetEmail, name: "Amine Nahli" }],
          replyTo: { email: contact.email, name: contact.name },
          subject,
          htmlContent: html,
        }),
      });

      const data = (await response.json().catch(() => null)) as { messageId?: string; id?: string; message?: string } | null;
      if (response.ok && (data?.messageId || data?.id)) {
        return { success: true, provider: "brevo", details: data };
      }
      console.warn("Brevo email delivery failure:", data?.message || response.statusText);
    } catch (error) {
      console.warn("Brevo network error:", error);
    }
  }

  // 3. Fallback: Web3Forms (supports both server & legacy public keys)
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (web3Key) {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3Key,
          subject,
          name: contact.name,
          email: contact.email,
          message: html,
        }),
      });

      const data = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (response.ok && data?.success) {
        return { success: true, provider: "web3forms", details: data };
      }
      console.warn("Web3Forms delivery attempt status " + response.status + ":", data?.message || "Cloudflare challenge or rejection");
    } catch (error) {
      console.warn("Web3Forms network error:", error);
    }
  }

  return {
    success: false,
    provider: "none",
    error: "No active email provider configured (set RESEND_API_KEY in .env.local).",
  };
}

