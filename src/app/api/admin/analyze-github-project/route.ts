import { NextResponse, type NextRequest } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";
import { extractAndGenerateProjectFromGitHub } from "@/lib/github-project-extractor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  if (!await getAdminContext()) return fail("Non autorisé.", 401);

  const body = await readJsonObject(request);
  const githubUrl = typeof body?.githubUrl === "string" ? body.githubUrl.trim() : "";
  if (!githubUrl || githubUrl.length > 500) {
    return fail("Veuillez fournir une URL GitHub valide.", 422);
  }

  try {
    const result = await extractAndGenerateProjectFromGitHub(githubUrl);
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extraction GitHub & génération IA impossible.";
    console.error("GitHub project analysis failed:", message);
    const status = /introuvable|invalide|autorisés|saisir/i.test(message) ? 422 : 502;
    return fail(message, status);
  }
}

