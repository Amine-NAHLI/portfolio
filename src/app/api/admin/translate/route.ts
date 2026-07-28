import { NextResponse, type NextRequest } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";

export const runtime = "nodejs";

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  if (!await getAdminContext()) return fail("Non autorisé.", 401);
  const body = await readJsonObject(request);
  const source = typeof body?.text === "string" ? body.text.trim() : "";
  if (!source || source.length > 5_000) return fail("Texte à traduire invalide.", 422);
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Groq translation unavailable", { missing: ["GROQ_API_KEY"] });
    return fail("La traduction automatique est temporairement indisponible.", 503);
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: [
          { role: "system", content: "Translate French portfolio content into natural professional English. Return only the translation. Preserve facts, URLs, names, code and line breaks. Do not add information." },
          { role: "user", content: source },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Groq status ${response.status}`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
    const translation = payload.choices?.[0]?.message?.content?.trim();
    if (!translation || translation.length > 6_000) throw new Error("Invalid Groq response");
    return NextResponse.json({ translation }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Groq translation failed", { error: error instanceof Error ? error.message : String(error) });
    return fail("La traduction automatique a échoué. Vous pouvez saisir la traduction manuellement.", 502);
  }
}
