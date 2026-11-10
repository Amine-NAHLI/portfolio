import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { getCvDownloadProps } from "../src/lib/utils.ts";

test("CV PDFs are publicly available and validated", async () => {
  for (const filename of ["Amine_Nahli_CV.pdf", "Amine_Nahli_CV_EN.pdf"]) {
    const pdfPath = resolve("public", filename);
    const fileStat = await stat(pdfPath);
    assert.ok(fileStat.size > 1000, `${filename} exists and has content`);
  }
});

test("getCvDownloadProps sets locale-specific href and attachment filename", () => {
  assert.deepEqual(getCvDownloadProps("/cv", "fr"), {
    href: "/cv",
    download: "Amine_Nahli_CV.pdf",
  });
  assert.deepEqual(getCvDownloadProps("/cv", "en"), {
    href: "/cv?locale=en",
    download: "Amine_Nahli_CV_EN.pdf",
  });
  assert.deepEqual(getCvDownloadProps("https://cdn.example.com/custom.pdf", "fr"), {
    href: "https://cdn.example.com/custom.pdf",
    download: "Amine_Nahli_CV.pdf",
  });
});
