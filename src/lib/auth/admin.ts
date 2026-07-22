import "server-only";

import { redirect } from "next/navigation";
import { hasSupabasePublicConfig } from "@/lib/env/supabase";
import { createClient } from "@/lib/supabase/server";

export type AdminContext = {
  userId: string;
  email: string | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  if (!hasSupabasePublicConfig()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: allowlistEntry, error: allowlistError } = await supabase
    .from("admin_users")
    .select("user_id, active")
    .eq("user_id", data.user.id)
    .eq("active", true)
    .maybeSingle();

  if (allowlistError || !allowlistEntry) return null;

  return {
    userId: data.user.id,
    email: data.user.email ?? null,
    supabase,
  };
}

export async function requireAdminPage(): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) redirect("/admin/login");
  return context;
}

