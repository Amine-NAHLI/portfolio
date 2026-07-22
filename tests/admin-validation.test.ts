import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validatePrimaryKey, validateResourcePayload } from "../src/features/admin/validation.ts";
import type { AdminResourceConfig } from "../src/features/admin/resources.ts";

const config: AdminResourceConfig = {
  key: "test", table: "projects", primaryKey: "id", label: "Tests", singular: "test", description: "",
  titleField: "slug", searchFields: ["slug"], listFields: ["slug"], canCreate: true, canUpdate: true, canDelete: true,
  fields: [
    { name: "slug", label: "Slug", type: "text", required: true, maxLength: 100 },
    { name: "github_url", label: "GitHub", type: "url", nullable: true, maxLength: 500 },
    { name: "status", label: "Statut", type: "select", required: true, options: [{ value: "draft", label: "Brouillon" }] },
    { name: "metadata", label: "Métadonnées", type: "json", required: true },
    { name: "private_field", label: "Privé", type: "text", readOnly: true },
  ],
};

describe("validateResourcePayload", () => {
  it("accepts only allowlisted editable fields", () => {
    const result = validateResourcePayload(config, { slug: "valid-project", status: "draft", metadata: [], ignored: "secret", private_field: "override" }, "create");
    assert.equal(result.success, true);
    if (result.success) assert.deepEqual(result.data, { slug: "valid-project", status: "draft", metadata: [] });
  });

  it("rejects missing required fields on creation", () => {
    const result = validateResourcePayload(config, { slug: "valid-project" }, "create");
    assert.equal(result.success, false);
  });

  it("rejects invalid slugs, select values and GitHub hosts", () => {
    assert.equal(validateResourcePayload(config, { slug: "Invalid Slug", status: "draft", metadata: [] }, "create").success, false);
    assert.equal(validateResourcePayload(config, { slug: "valid", status: "published", metadata: [] }, "create").success, false);
    assert.equal(validateResourcePayload(config, { slug: "valid", status: "draft", metadata: [], github_url: "https://evil.example/repo" }, "create").success, false);
  });

  it("rejects invalid JSON shapes", () => {
    assert.equal(validateResourcePayload(config, { slug: "valid", status: "draft", metadata: "null" }, "create").success, false);
  });
});

describe("validatePrimaryKey", () => {
  it("accepts UUID primary keys and rejects arbitrary strings", () => {
    assert.equal(validatePrimaryKey(config, "123e4567-e89b-42d3-a456-426614174000"), true);
    assert.equal(validatePrimaryKey(config, "1 OR 1=1"), false);
  });
});
