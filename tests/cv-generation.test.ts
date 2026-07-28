import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CV PDF generation is sourced from CV/cv.html and runs before builds", async () => {
  const [packageJson, generator, route] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/generate-cv-pdf.mjs", import.meta.url), "utf8"),
    readFile(new URL("../src/app/cv/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"prebuild": "npm run generate:cv"/);
  assert.match(generator, /CV", "cv\.html/);
  assert.match(generator, /Amine_Nahli_CV\.pdf/);
  assert.match(route, /Content-Disposition": "attachment; filename=Amine_Nahli_CV\.pdf/);
});
