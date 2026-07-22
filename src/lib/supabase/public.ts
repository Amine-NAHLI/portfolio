import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/env/supabase";
import type { Database } from "@/types/database";

export function createPublicClient() {
  const { url, publishableKey } = getSupabasePublicConfig();
  return createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
