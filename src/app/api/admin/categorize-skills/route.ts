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
  const technologies = Array.isArray(body?.technologies) ? body.technologies : [];
  const existingCategories = Array.isArray(body?.existingCategories) ? body.existingCategories : [];

  if (!technologies.length) return fail("Aucune technologie à analyser.", 422);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("Groq categorization unavailable", { missing: ["GROQ_API_KEY"] });
    return fail("L'analyse IA est indisponible (Clé manquante).", 503);
  }

  const systemPrompt = `You are an expert IT technical recruiter and developer. 
You will receive a list of missing technical skills and a list of existing categories.
For each skill, you must determine the best category and the most appropriate proficiency level (beginner, intermediate, advanced) for a modern developer portfolio.

Rules:
1. If the skill perfectly fits an existing category, use that category exactly as provided.
2. If it does not fit, suggest a NEW short generic category name IN FRENCH (e.g., "Développement web", "Bases de données", "Outils de design", "DevOps").
3. You must respond in strict JSON format.

Output JSON Format:
{
  "skills": [
    {
      "name": "Exact name of the technology from input",
      "category": "The chosen existing category OR the suggested new category in French",
      "isNewCategory": true if you invented the category, false if it matches an existing one exactly,
      "level": "beginner" | "intermediate" | "advanced"
    }
  ]
}
`;

  const userPrompt = `Technologies to categorize: ${JSON.stringify(technologies)}
Existing Categories: ${JSON.stringify(existingCategories)}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) throw new Error(`Groq status ${response.status}`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
    const resultText = payload.choices?.[0]?.message?.content?.trim();
    if (!resultText) throw new Error("Invalid Groq response");

    const resultJSON = JSON.parse(resultText);
    return NextResponse.json(resultJSON, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Groq categorization failed", { error: error instanceof Error ? error.message : String(error) });
    return fail("L'analyse automatique a échoué. Veuillez catégoriser manuellement.", 502);
  }
}
