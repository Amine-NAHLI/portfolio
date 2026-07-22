import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  const context = await getAdminContext();
  if (!context) return fail("Non autorisé.", 401);
  const body = await readJsonObject(request);
  if (!body || typeof body.jobId !== "string" || !uuidPattern.test(body.jobId)) return fail("Analyse invalide.", 422);

  const { data: job } = await context.supabase.from("ai_jobs").select("*").eq("id", body.jobId).eq("job_type", "repository_analysis").maybeSingle();
  if (!job?.source_reference || !isObject(job.input) || !isObject(job.input.snapshot)) return fail("Analyse enregistrée introuvable.", 404);
  const snapshot = job.input.snapshot;
  const githubUrl = safeGitHubUrl(snapshot.htmlUrl, job.source_reference);
  if (!githubUrl) return fail("La source enregistrée est invalide.", 422);
  const { data: project } = await context.supabase.from("projects").select("id").eq("repository_full_name", job.source_reference).limit(1).maybeSingle();
  if (!project) return fail("Aucun projet existant n’est lié à ce dépôt.", 404);

  const { error } = await context.supabase.from("projects").update({
    github_url: githubUrl,
    demo_url: safeHttpsUrl(snapshot.homepage),
    primary_language: typeof snapshot.primaryLanguage === "string" ? snapshot.primaryLanguage.slice(0, 100) : null,
    updated_by: context.userId,
  }).eq("id", project.id);
  if (error) return fail("Synchronisation impossible.", 500);
  await context.supabase.from("ai_jobs").update({ status: "draft_ready" }).eq("id", job.id);
  await context.supabase.from("audit_logs").insert({ actor_id: context.userId, action: "update", entity_type: "projects", entity_id: project.id, details: { fields: ["github_url", "demo_url", "primary_language"] } });
  revalidatePath("/admin/projects");
  return NextResponse.json({ projectId: project.id }, { headers: { "Cache-Control": "private, no-store" } });
}

function isObject(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function safeHttpsUrl(value: unknown): string | null { if (typeof value !== "string") return null; try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : null; } catch { return null; } }
function safeGitHubUrl(value: unknown, fullName: string): string | null { const url = safeHttpsUrl(value); return url === `https://github.com/${fullName}` ? url : null; }
