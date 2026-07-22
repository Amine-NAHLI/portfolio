import { createHmac } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";
import { validateContactMessage } from "@/features/contact/validation";

export const runtime = "nodejs";

const messages = {
  fr: {
    refused: "Requête refusée.", unavailable: "Le formulaire est temporairement indisponible. Utilisez l’adresse e-mail affichée sur cette page.",
    invalidForm: "Formulaire invalide.", received: "Message reçu.", reload: "Veuillez recharger le formulaire puis réessayer.",
    invalidFields: "Vérifiez les champs du formulaire.", limited: "Trop de messages ont été envoyés récemment. Réessayez plus tard ou utilisez l’e-mail direct.",
    storageError: "Le message n’a pas pu être enregistré. Utilisez l’adresse e-mail affichée sur cette page.", saved: "Votre message a bien été enregistré.",
  },
  en: {
    refused: "Request refused.", unavailable: "The form is temporarily unavailable. Please use the email address shown on this page.",
    invalidForm: "Invalid form.", received: "Message received.", reload: "Please reload the form and try again.",
    invalidFields: "Check the form fields.", limited: "Too many messages were sent recently. Try again later or use the direct email address.",
    storageError: "The message could not be saved. Please use the email address shown on this page.", saved: "Your message has been saved.",
  },
} as const;

type MessageKey = keyof typeof messages.fr;

function respond(key: MessageKey, status: number, locale: "fr" | "en" = "fr") {
  const message = messages[locale][key];
  return NextResponse.json(status < 400 ? { message } : { error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return respond("refused", 403);
  const body = await readJsonObject(request);
  if (!body) return respond("invalidForm", 400);
  const responseLocale = body.locale === "en" ? "en" : "fr";
  const secret = process.env.CONTACT_FINGERPRINT_SECRET;
  if (!secret || secret.length < 32) return respond("unavailable", 503, responseLocale);
  if (typeof body.website === "string" && body.website) return respond("received", 201, responseLocale);

  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(elapsed) || elapsed < 3_000 || elapsed > 2 * 60 * 60_000) return respond("reload", 422, responseLocale);

  const contact = validateContactMessage(body);
  if (!contact) return respond("invalidFields", 422, responseLocale);
  const { name, email, subject, message, locale } = contact;

  const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
  const fingerprint = createHmac("sha256", secret).update(`contact:${address}`).digest("hex");
  const supabase = createAdminClient();
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60_000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  const [recentResult, dailyResult] = await Promise.all([
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("fingerprint_hash", fingerprint).gte("created_at", fifteenMinutesAgo),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("fingerprint_hash", fingerprint).gte("created_at", oneDayAgo),
  ]);
  if ((recentResult.count ?? 0) >= 3 || (dailyResult.count ?? 0) >= 10) return respond("limited", 429, responseLocale);

  const { error } = await supabase.from("contact_messages").insert({
    sender_name: name,
    sender_email: email,
    subject,
    message,
    locale,
    status: "new",
    fingerprint_hash: fingerprint,
    user_agent_summary: null,
  });
  if (error) return respond("storageError", 500, responseLocale);
  return respond("saved", 201, locale);
}
