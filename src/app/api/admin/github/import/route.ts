import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";
import type { Json } from "@/types/database";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  if (!acceptsSameOriginMutation(request)) return fail("Requête refusée.", 403);
  const context = await getAdminContext();
  if (!context) return fail("Non autorisé.", 401);
  const body = await readJsonObject(request);
  if (!body || typeof body.jobId !== "string" || !uuidPattern.test(body.jobId)) return fail("Analyse invalide.", 422);
  const draft = validateDraft(body.draft);
  if (!draft) return fail("Le slug, les titres et les deux résumés relus sont obligatoires.", 422);

  const { data: job, error: jobError } = await context.supabase.from("ai_jobs").select("*").eq("id", body.jobId).eq("job_type", "repository_analysis").maybeSingle();
  if (jobError || !job || !job.source_reference || !isObject(job.input) || !isObject(job.input.snapshot)) return fail("Analyse enregistrée introuvable.", 404);
  const snapshot = job.input.snapshot;
  const githubUrl = safeGitHubUrl(snapshot.htmlUrl, job.source_reference);
  if (!githubUrl) return fail("La source GitHub enregistrée est invalide.", 422);

  const [{ data: existingRepository }, { data: existingSlug }] = await Promise.all([
    context.supabase.from("projects").select("id").eq("repository_full_name", job.source_reference).limit(1).maybeSingle(),
    context.supabase.from("projects").select("id").eq("slug", draft.slug).limit(1).maybeSingle(),
  ]);
  if (existingRepository || existingSlug) return fail("Ce dépôt ou ce slug est déjà associé à un projet. Aucun contenu existant n’a été écrasé.", 409);

  const { data: project, error: projectError } = await context.supabase.from("projects").insert({
    slug: draft.slug,
    source_kind: "personal",
    publication_status: "draft",
    featured: false,
    sort_order: 0,
    github_url: githubUrl,
    demo_url: safeHttpsUrl(snapshot.homepage),
    repository_full_name: job.source_reference,
    primary_language: typeof snapshot.primaryLanguage === "string" ? snapshot.primaryLanguage.slice(0, 100) : null,
    created_by: context.userId,
    updated_by: context.userId,
  }).select("id").single();
  if (projectError || !project) return fail(projectError?.code === "23505" ? "Le slug existe déjà." : "Le brouillon de projet n’a pas pu être créé.", projectError?.code === "23505" ? 409 : 500);

  const translations = [
    { locale: "fr" as const, title: draft.titleFr, summary: draft.summaryFr },
    { locale: "en" as const, title: draft.titleEn, summary: draft.summaryEn },
  ].map((translation) => ({
    project_id: project.id,
    ...translation,
    subtitle: null,
    solution: null,
    architecture: [] as Json,
    results: [] as Json,
    seo_title: null,
    seo_description: null,
    review_status: "draft" as const,
  }));
  const { error: translationsError } = await context.supabase.from("project_translations").insert(translations);
  if (translationsError) {
    await context.supabase.from("projects").delete().eq("id", project.id);
    return fail("Les traductions privées n’ont pas pu être créées ; le brouillon partiel a été annulé.", 500);
  }

  await context.supabase.from("ai_jobs").update({ status: "draft_ready", draft: toJson(draft) }).eq("id", job.id);
  await context.supabase.from("audit_logs").insert({ actor_id: context.userId, action: "create", entity_type: "projects", entity_id: project.id, details: { fields: ["github_url", "repository_full_name", "translations"] } });
  revalidatePath("/admin/projects");
  revalidatePath("/admin/project-translations");
  revalidatePath("/admin/ai-jobs");
  return NextResponse.json({ projectId: project.id }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}

function validateDraft(value: unknown): { slug: string; titleFr: string; titleEn: string; summaryFr: string; summaryEn: string } | null {
  if (!isObject(value)) return null;
  const slug = cleanString(value.slug, 100);
  const titleFr = cleanString(value.titleFr, 180);
  const titleEn = cleanString(value.titleEn, 180);
  const summaryFr = cleanString(value.summaryFr, 1200);
  const summaryEn = cleanString(value.summaryEn, 1200);
  if (!slug || !slugPattern.test(slug) || !titleFr || !titleEn || !summaryFr || !summaryEn) return null;
  return { slug, titleFr, titleEn, summaryFr, summaryEn };
}

function isObject(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function cleanString(value: unknown, max: number): string | null { return typeof value === "string" && value.trim() && value.trim().length <= max ? value.trim() : null; }
function safeHttpsUrl(value: unknown): string | null { if (typeof value !== "string") return null; try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : null; } catch { return null; } }
function safeGitHubUrl(value: unknown, fullName: string): string | null { const url = safeHttpsUrl(value); return url === `https://github.com/${fullName}` ? url : null; }
function toJson(value: unknown): Json { return JSON.parse(JSON.stringify(value)) as Json; }
