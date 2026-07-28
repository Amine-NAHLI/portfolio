import assert from "node:assert/strict";
import test from "node:test";
import { getMissingContactNotificationConfiguration, getMissingContactStorageConfiguration } from "../src/features/contact/config.ts";

const complete = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key",
  SUPABASE_SERVICE_ROLE_KEY: "server-only-key",
  CONTACT_FINGERPRINT_SECRET: "a".repeat(32),
  RESEND_API_KEY: "resend-key",
};

test("contact storage configuration names missing variables without exposing values", () => {
  assert.deepEqual(getMissingContactStorageConfiguration({}), ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "CONTACT_FINGERPRINT_SECRET"]);
  assert.deepEqual(getMissingContactStorageConfiguration(complete), []);
  assert.deepEqual(getMissingContactStorageConfiguration({ ...complete, CONTACT_FINGERPRINT_SECRET: "short" }), ["CONTACT_FINGERPRINT_SECRET"]);
});

test("Resend is optional for contact persistence and reported by name", () => {
  assert.deepEqual(getMissingContactNotificationConfiguration({ ...complete, RESEND_API_KEY: undefined }), ["RESEND_API_KEY"]);
  assert.deepEqual(getMissingContactNotificationConfiguration(complete), []);
});
