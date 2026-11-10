import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { getCvDownloadProps } from "../src/lib/utils.ts";
import { CV_MAX_FILE_BYTES, CV_STORAGE_BUCKET, getCvAssetInfo } from "../src/features/cv/config.ts";

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

test("getCvAssetInfo maps French and English locales to portfolio-media bucket paths", () => {
  assert.equal(CV_STORAGE_BUCKET, "portfolio-media");
  assert.equal(CV_MAX_FILE_BYTES, 5 * 1024 * 1024);
  assert.deepEqual(getCvAssetInfo(null), {
    locale: "fr",
    filename: "Amine_Nahli_CV.pdf",
    storagePath: "cv/Amine_Nahli_CV.pdf",
    previewUrl: "/cv?locale=fr&disposition=inline",
  });
  assert.deepEqual(getCvAssetInfo("en"), {
    locale: "en",
    filename: "Amine_Nahli_CV_EN.pdf",
    storagePath: "cv/Amine_Nahli_CV_EN.pdf",
    previewUrl: "/cv?locale=en&disposition=inline",
  });
});
