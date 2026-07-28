import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/env/supabase";
import { getSupabaseServiceRoleKey } from "@/lib/env/supabase-server";
import type { Database } from "@/types/database";

export function createAdminClient() {
  const { url } = getSupabasePublicConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
