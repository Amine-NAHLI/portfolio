export type ValidContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: "fr" | "en";
};

const emailPattern = /^[^\s@]{1,64}@[^\s@]{1,253}$/;

export function validateContactMessage(value: unknown): ValidContactMessage | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const name = cleanText(input.name, 2, 100);
  const email = cleanText(input.email, 5, 254)?.toLowerCase() ?? null;
  const subject = cleanText(input.subject, 3, 160);
  const message = cleanText(input.message, 20, 5_000);
  const locale = input.locale === "fr" || input.locale === "en" ? input.locale : null;
  if (!name || !email || !emailPattern.test(email) || !subject || !message || !locale) return null;
  return { name, email, subject, message, locale };
}

export function cleanText(value: unknown, minLength: number, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  return cleaned.length >= minLength && cleaned.length <= maxLength ? cleaned : null;
}
