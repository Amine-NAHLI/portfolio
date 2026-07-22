import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminContext } from "@/lib/auth/admin";
import type { AdminResourceConfig } from "@/features/admin/resources";

export type AdminRecord = Record<string, unknown>;

function getGenericClient(context: AdminContext): SupabaseClient {
  // Runtime field/table validation happens before this boundary. The untyped
  // query builder is isolated here because the CMS table is selected from a
  // trusted server-side resource registry at runtime.
  return context.supabase as unknown as SupabaseClient;
}

function getOrderField(config: AdminResourceConfig): string {
  if (config.listFields.includes("updated_at")) return "updated_at";
  if (config.listFields.includes("created_at")) return "created_at";
  if (config.listFields.includes("sort_order")) return "sort_order";
  return config.primaryKey;
}

export async function listAdminRecords(context: AdminContext, config: AdminResourceConfig): Promise<{
  records: AdminRecord[];
  error: boolean;
}> {
  const client = getGenericClient(context);
  const { data, error } = await client
    .from(config.table)
    .select("*")
    .order(getOrderField(config), { ascending: config.listFields.includes("sort_order") })
    .limit(200);

  return {
    records: error || !Array.isArray(data) ? [] : data as AdminRecord[],
    error: Boolean(error),
  };
}

export async function createAdminRecord(
  context: AdminContext,
  config: AdminResourceConfig,
  payload: AdminRecord,
): Promise<{ record: AdminRecord | null; errorCode: string | null }> {
  const client = getGenericClient(context);
  const { data, error } = await client.from(config.table).insert(payload).select("*").single();
  return { record: error ? null : data as AdminRecord, errorCode: error?.code ?? null };
}

export async function updateAdminRecord(
  context: AdminContext,
  config: AdminResourceConfig,
  id: string | number,
  payload: AdminRecord,
): Promise<{ record: AdminRecord | null; errorCode: string | null }> {
  const client = getGenericClient(context);
  const { data, error } = await client
    .from(config.table)
    .update(payload)
    .eq(config.primaryKey, id)
    .select("*")
    .single();
  return { record: error ? null : data as AdminRecord, errorCode: error?.code ?? null };
}

export async function deleteAdminRecord(
  context: AdminContext,
  config: AdminResourceConfig,
  id: string | number,
): Promise<{ success: boolean; errorCode: string | null }> {
  const client = getGenericClient(context);
  const { error } = await client.from(config.table).delete().eq(config.primaryKey, id);
  return { success: !error, errorCode: error?.code ?? null };
}

export async function getAdminRecord(
  context: AdminContext,
  config: AdminResourceConfig,
  id: string | number,
): Promise<AdminRecord | null> {
  const client = getGenericClient(context);
  const { data, error } = await client.from(config.table).select("*").eq(config.primaryKey, id).maybeSingle();
  return error || !data ? null : data as AdminRecord;
}

export async function writeAuditLog(
  context: AdminContext,
  action: "create" | "update" | "delete",
  config: AdminResourceConfig,
  entityId: string | number | null,
  fields: string[],
) {
  await context.supabase.from("audit_logs").insert({
    actor_id: context.userId,
    action,
    entity_type: config.table,
    entity_id: entityId === null ? null : String(entityId),
    details: { fields },
  });
}
