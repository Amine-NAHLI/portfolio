import { NextResponse, type NextRequest } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";
import { requestChatbotCompletion } from "@/lib/ai/chatbot-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  if (!await getAdminContext()) return fail("Non autorisé.", 401);
  const body = await readJsonObject(request);
  const source = typeof body?.text === "string" ? body.text.trim() : "";
  if (!source || source.length > 5_000) return fail("Texte à traduire invalide.", 422);
  const targetLang = body?.targetLang === "fr" ? "fr" : "en";

  const systemContent =
    targetLang === "fr"
      ? "Translate English portfolio content into natural, professional French. Return only the translation. Preserve facts, URLs, names, code and line breaks. Do not add information."
      : "Translate French portfolio content into natural, professional English. Return only the translation. Preserve facts, URLs, names, code and line breaks. Do not add information.";

  try {
    const result = await requestChatbotCompletion({
      temperature: 0,
      timeoutMs: 25_000,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: source },
      ],
    });
    const translation = result.content.trim();
    if (!translation || translation.length > 6_000) throw new Error("Invalid AI response");
    return NextResponse.json({ translation, provider: result.provider }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("AI translation failed", { error: error instanceof Error ? error.message : String(error) });
    return fail("La traduction automatique a échoué. Vous pouvez saisir la traduction manuellement.", 502);
  }
}
