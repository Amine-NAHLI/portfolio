import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("CV PDF is publicly available and validated", async () => {
  const pdfPath = resolve("public", "Amine_Nahli_CV.pdf");
  const fileStat = await stat(pdfPath);
  assert.ok(fileStat.size > 1000, "Amine_Nahli_CV.pdf exists and has content");
});
