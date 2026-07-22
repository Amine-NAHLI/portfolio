import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";
import { fetchGitHubRepository, GitHubRequestError, parseGitHubRepositoryUrl } from "@/features/github/client";
import { manualRepositoryProvider } from "@/features/github/analysis";
import type { Json } from "@/types/database";

export const runtime = "nodejs";

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  const context = await getAdminContext();
  if (!context) return fail("Non autorisé.", 401);
  const body = await readJsonObject(request);
  const reference = parseGitHubRepositoryUrl(body?.url);
  if (!reference) return fail("Utilisez une URL HTTPS complète vers un dépôt github.com public.", 422);

  const tenMinutesAgo = new Date(Date.now() - 10 * 60_000).toISOString();
  const { count } = await context.supabase.from("ai_jobs").select("id", { count: "exact", head: true }).eq("created_by", context.userId).gte("created_at", tenMinutesAgo);
  if ((count ?? 0) >= 10) return fail("Trop d’analyses récentes. Réessayez dans quelques minutes.", 429);

  try {
    const snapshot = await fetchGitHubRepository(reference);
    const analysis = await manualRepositoryProvider.analyze(snapshot);
    const { data: existingProject } = await context.supabase.from("projects").select("id").eq("repository_full_name", snapshot.fullName).limit(1).maybeSingle();
    const { data: job, error } = await context.supabase.from("ai_jobs").insert({
      job_type: "repository_analysis",
      provider: manualRepositoryProvider.id,
      status: "review_required",
      source_reference: snapshot.fullName,
      input: toJson({ snapshot }),
      draft: toJson(analysis.draft),
      facts: toJson(analysis.facts),
      inferences: toJson(analysis.inferences),
      missing_information: toJson(analysis.missingInformation),
      created_by: context.userId,
    }).select("id").single();
    if (error || !job) return fail("L’analyse n’a pas pu être enregistrée.", 500);
    await context.supabase.from("audit_logs").insert({ actor_id: context.userId, action: "create", entity_type: "ai_jobs", entity_id: job.id, details: { fields: ["source_reference", "facts", "inferences", "missing_information", "draft"] } });
    revalidatePath("/admin/ai-jobs");
    return NextResponse.json({ jobId: job.id, analysis, existingProjectId: existingProject?.id ?? null }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof GitHubRequestError) return fail(error.message, error.status);
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) return fail("GitHub n’a pas répondu dans le délai autorisé.", 504);
    return fail("Analyse GitHub indisponible.", 502);
  }
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}
