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
  if (!source || source.length > 5_000) return fail("Données du projet invalides.", 422);
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Groq generation unavailable", { missing: ["GROQ_API_KEY"] });
    return fail("La génération automatique est temporairement indisponible.", 503);
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: [
          { role: "system", content: "You are an expert technical categorizer. Given the following project details, provide an appropriate comma-separated list of general, high-level technical categories that best describe it. Use broad categories such as 'ai', 'cyber', 'dev mobile', 'dev web', 'software', 'embedded', etc. Do NOT include specific frameworks (like React, Node), languages, databases, or overly detailed sub-categories. Return ONLY the comma-separated list, and nothing else. No explanation, no quotes." },
          { role: "user", content: source },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Groq status ${response.status}`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
    const categories = payload.choices?.[0]?.message?.content?.trim();
    if (!categories || categories.length > 500) throw new Error("Invalid Groq response");
    return NextResponse.json({ categories }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Groq generation failed", { error: error instanceof Error ? error.message : String(error) });
    return fail("La génération automatique a échoué. Vous pouvez saisir les catégories manuellement.", 502);
  }
}
