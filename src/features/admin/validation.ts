import type { AdminField, AdminResourceConfig } from "@/features/admin/resources";

type ValidationResult =
  | { success: true; data: Record<string, unknown> }
  | { success: false; error: string };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseField(field: AdminField, rawValue: unknown): { ok: true; value: unknown } | { ok: false; error: string } {
  if (field.readOnly) return { ok: false, error: "READ_ONLY" };

  if (field.type === "checkbox") return { ok: true, value: rawValue === true };

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    if (field.required && !field.nullable) return { ok: false, error: `${field.label} est obligatoire.` };
    return { ok: true, value: null };
  }

  if (field.type === "number") {
    const value = typeof rawValue === "number" ? rawValue : Number(rawValue);
    if (!Number.isSafeInteger(value) || Math.abs(value) > 1_000_000) return { ok: false, error: `${field.label} est invalide.` };
    return { ok: true, value };
  }

  if (field.type === "json") {
    try {
      const value = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
      if (value === null || typeof value !== "object") return { ok: false, error: `${field.label} doit contenir un objet ou tableau JSON.` };
      return { ok: true, value };
    } catch {
      return { ok: false, error: `${field.label} contient un JSON invalide.` };
    }
  }

  if (typeof rawValue !== "string") return { ok: false, error: `${field.label} est invalide.` };
  const value = rawValue.trim();

  if (field.maxLength && value.length > field.maxLength) return { ok: false, error: `${field.label} est trop long.` };
  if (field.options && !field.options.some((option) => option.value === value)) return { ok: false, error: `${field.label} contient une valeur non autorisée.` };
  if (field.name === "slug" && !slugPattern.test(value)) return { ok: false, error: "Le slug doit utiliser uniquement des minuscules, chiffres et tirets." };
  if (field.name.endsWith("_id") && value && !uuidPattern.test(value)) return { ok: false, error: `${field.label} doit être un UUID valide.` };

  if (field.type === "url") {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") return { ok: false, error: `${field.label} doit utiliser HTTPS.` };
      if (field.name === "github_url" && url.hostname !== "github.com") return { ok: false, error: "L'URL GitHub doit pointer vers github.com." };
    } catch {
      return { ok: false, error: `${field.label} est invalide.` };
    }
  }

  if ((field.type === "date" || field.type === "datetime") && Number.isNaN(Date.parse(value))) {
    return { ok: false, error: `${field.label} contient une date invalide.` };
  }

  return { ok: true, value };
}

export function validateResourcePayload(
  config: AdminResourceConfig,
  rawValues: unknown,
  mode: "create" | "update",
): ValidationResult {
  if (!rawValues || typeof rawValues !== "object" || Array.isArray(rawValues)) {
    return { success: false, error: "Corps de requête invalide." };
  }

  const values = rawValues as Record<string, unknown>;
  const parsed: Record<string, unknown> = {};

  for (const field of config.fields) {
    if (field.readOnly || !(field.name in values)) continue;
    const result = parseField(field, values[field.name]);
    if (!result.ok) {
      if (result.error === "READ_ONLY") continue;
      return { success: false, error: result.error };
    }
    parsed[field.name] = result.value;
  }

  if (mode === "create") {
    for (const field of config.fields) {
      if (!field.readOnly && field.required && !(field.name in parsed) && !field.nullable) {
        return { success: false, error: `${field.label} est obligatoire.` };
      }
    }
  }

  if (Object.keys(parsed).length === 0) return { success: false, error: "Aucun champ modifiable fourni." };
  return { success: true, data: parsed };
}

export function validatePrimaryKey(config: AdminResourceConfig, value: unknown): value is string | number {
  if (config.primaryKey === "id") {
    if (config.key === "audit-logs") return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
    return typeof value === "string" && uuidPattern.test(value);
  }
  return typeof value === "string" && /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(value);
}

