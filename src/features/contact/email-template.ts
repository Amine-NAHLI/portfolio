export type ContactNotification = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: "fr" | "en";
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export function createContactNotificationHtml(contact: ContactNotification): string {
  const submittedAt = new Intl.DateTimeFormat(contact.locale === "fr" ? "fr-FR" : "en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Africa/Casablanca" }).format(new Date(contact.createdAt));
  return `<!doctype html><html lang="${contact.locale}"><body style="margin:0;background:#f5f7fb;color:#172033;font-family:Arial,sans-serif"><main style="max-width:680px;margin:32px auto;background:#ffffff;border:1px solid #dbe2ee;border-radius:16px;overflow:hidden"><header style="padding:28px 32px;background:#101827;color:#ffffff"><p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9cc4ff">Portfolio Amine Nahli</p><h1 style="margin:0;font-size:24px">Nouveau message de contact</h1></header><section style="padding:32px"><table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.55"><tr><td style="padding:8px 16px 8px 0;color:#526078;font-weight:700;width:130px">Nom</td><td style="padding:8px 0">${escapeHtml(contact.name)}</td></tr><tr><td style="padding:8px 16px 8px 0;color:#526078;font-weight:700">E-mail</td><td style="padding:8px 0"><a style="color:#2563eb" href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></td></tr><tr><td style="padding:8px 16px 8px 0;color:#526078;font-weight:700">Sujet</td><td style="padding:8px 0">${escapeHtml(contact.subject)}</td></tr><tr><td style="padding:8px 16px 8px 0;color:#526078;font-weight:700">Date</td><td style="padding:8px 0">${escapeHtml(submittedAt)}</td></tr><tr><td style="padding:8px 16px 8px 0;color:#526078;font-weight:700">Langue</td><td style="padding:8px 0">${contact.locale === "fr" ? "Français" : "English"}</td></tr></table><hr style="border:0;border-top:1px solid #dbe2ee;margin:24px 0"><h2 style="margin:0 0 12px;font-size:17px">Message</h2><div style="white-space:pre-wrap;padding:18px;border-radius:10px;background:#f5f7fb;line-height:1.65">${escapeHtml(contact.message)}</div></section><footer style="padding:18px 32px;background:#f5f7fb;color:#526078;font-size:12px">Référence du message : ${escapeHtml(contact.id)}</footer></main></body></html>`;
}
