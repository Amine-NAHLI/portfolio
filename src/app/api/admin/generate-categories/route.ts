import { NextResponse, type NextRequest } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";
import { normalizeProjectCategories } from "@/lib/project-categories";
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
  if (!source || source.length > 5_000) return fail("Données du projet invalides.", 422);

  try {
    const result = await requestChatbotCompletion({
      temperature: 0,
      timeoutMs: 25_000,
      messages: [
        { role: "system", content: "You are an expert technical categorizer. Analyze the project and categorize it using only the following standardized domains: 'ai', 'cybersecurity', 'software', 'dev-web', 'dev-mobile', 'dev-desktop', 'embedded', 'data-science', 'e-commerce'. Return ONLY a comma-separated list of matching domain IDs from this list. Do not invent other tags or add explanations." },
        { role: "user", content: source },
      ],
    });
    const rawCategories = result.content.trim();
    if (!rawCategories || rawCategories.length > 500) throw new Error("Invalid AI response");
    const normalized = normalizeProjectCategories(rawCategories.split(",")).join(", ");
    return NextResponse.json({ categories: normalized || "software", provider: result.provider }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("AI category generation failed", { error: error instanceof Error ? error.message : String(error) });
    return fail("La génération automatique a échoué. Vous pouvez saisir les catégories manuellement.", 502);
  }
}
