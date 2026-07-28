type Environment = Record<string, string | undefined>;

export function getMissingContactStorageConfiguration(environment: Environment): string[] {
  const missing: string[] = [];
  if (!environment.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !environment.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (!environment.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!environment.CONTACT_FINGERPRINT_SECRET || environment.CONTACT_FINGERPRINT_SECRET.length < 32) {
    missing.push("CONTACT_FINGERPRINT_SECRET");
  }
  return missing;
}

export function getMissingContactNotificationConfiguration(environment: Environment): string[] {
  return environment.WEB3FORMS_ACCESS_KEY ? [] : ["WEB3FORMS_ACCESS_KEY"];
}
