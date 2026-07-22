import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminContext } from "@/lib/auth/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";

type RouteContext = { params: Promise<{ kind: string }> };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const relationKinds = {
  "project-skills": { table: "project_skills", left: "project_id", right: "skill_id" },
  "blog-tags": { table: "blog_post_tags", left: "blog_post_id", right: "tag_id" },
} as const;

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

async function prepare(request: NextRequest, routeContext: RouteContext) {
  if (!acceptsSameOriginMutation(request)) return { error: fail("Requête refusée.", 403) } as const;
  const context = await getAdminContext();
  if (!context) return { error: fail("Non autorisé.", 401) } as const;
  const { kind } = await routeContext.params;
  if (!(kind in relationKinds)) return { error: fail("Relation inconnue.", 404) } as const;
  const body = await readJsonObject(request);
  if (!body || typeof body.leftId !== "string" || typeof body.rightId !== "string" || !uuidPattern.test(body.leftId) || !uuidPattern.test(body.rightId)) return { error: fail("Identifiants invalides.", 422) } as const;
  return { context, config: relationKinds[kind as keyof typeof relationKinds], leftId: body.leftId, rightId: body.rightId } as const;
}

export async function POST(request: NextRequest, routeContext: RouteContext) {
  const prepared = await prepare(request, routeContext);
  if ("error" in prepared) return prepared.error;
  const { context, config, leftId, rightId } = prepared;
  const payload = config.table === "project_skills" ? { project_id: leftId, skill_id: rightId } : { blog_post_id: leftId, tag_id: rightId };
  const { error } = config.table === "project_skills"
    ? await context.supabase.from("project_skills").insert(payload as { project_id: string; skill_id: string })
    : await context.supabase.from("blog_post_tags").insert(payload as { blog_post_id: string; tag_id: string });
  if (error) return fail(error.code === "23505" ? "Cette association existe déjà." : "Association impossible.", error.code === "23505" ? 409 : 500);
  await context.supabase.from("audit_logs").insert({ actor_id: context.userId, action: "create", entity_type: config.table, entity_id: `${leftId}:${rightId}`, details: { fields: [config.left, config.right] } });
  if (config.table === "blog_post_tags") revalidateTag("blog");
  if (config.table === "project_skills") revalidateTag("projects");
  return NextResponse.json({ success: true }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}

export async function DELETE(request: NextRequest, routeContext: RouteContext) {
  const prepared = await prepare(request, routeContext);
  if ("error" in prepared) return prepared.error;
  const { context, config, leftId, rightId } = prepared;
  const result = config.table === "project_skills"
    ? await context.supabase.from("project_skills").delete().eq("project_id", leftId).eq("skill_id", rightId)
    : await context.supabase.from("blog_post_tags").delete().eq("blog_post_id", leftId).eq("tag_id", rightId);
  if (result.error) return fail("Suppression impossible.", 500);
  await context.supabase.from("audit_logs").insert({ actor_id: context.userId, action: "delete", entity_type: config.table, entity_id: `${leftId}:${rightId}`, details: { fields: [] } });
  if (config.table === "blog_post_tags") revalidateTag("blog");
  if (config.table === "project_skills") revalidateTag("projects");
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "private, no-store" } });
}
