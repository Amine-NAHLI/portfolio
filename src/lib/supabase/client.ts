import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/env/supabase";
import type { Database } from "@/types/database";

export function createClient() {
  const { url, publishableKey } = getSupabasePublicConfig();
  return createBrowserClient<Database>(url, publishableKey, {
    cookieOptions: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  });
}

