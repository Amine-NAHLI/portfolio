import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { acceptsSameOriginMutation, readJsonObject } from "@/lib/security/request";

const eventNames = new Set(["page_view", "project_view", "article_view", "github_click", "demo_click", "cv_open", "contact_submit", "language_change"]);

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return new NextResponse(null, { status: 204 });
  if (!acceptsSameOriginMutation(request)) return new NextResponse(null, { status: 403 });
  const body = await readJsonObject(request);
  const eventName = typeof body?.event === "string" && eventNames.has(body.event) ? body.event : null;
  const path = normalizePath(body?.path);
  const locale = body?.locale === "fr" || body?.locale === "en" ? body.locale : null;
  if (!eventName || !path || !locale) return new NextResponse(null, { status: 422 });
  const { error } = await createAdminClient().rpc("increment_analytics_daily", { event_name_value: eventName, path_value: path, locale_value: locale });
  return new NextResponse(null, { status: error ? 500 : 204, headers: { "Cache-Control": "private, no-store" } });
}

function normalizePath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 240 || !value.startsWith("/") || value.startsWith("//")) return null;
  try { const url = new URL(value, "https://portfolio.local"); return url.origin === "https://portfolio.local" ? url.pathname : null; }
  catch { return null; }
}
