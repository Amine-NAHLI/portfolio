import { mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const sourcePath = resolve("CV", "cv.html");
const outputPath = resolve("public", "Amine_Nahli_CV.pdf");

async function launchBrowser() {
  const candidates = process.env.CV_PDF_CHROMIUM_CHANNEL ? [{ channel: process.env.CV_PDF_CHROMIUM_CHANNEL }] : [{ channel: "chrome" }, {}];
  let lastError;
  for (const options of candidates) {
    try {
      return await chromium.launch({ headless: true, ...options });
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Unable to launch Chromium for CV PDF generation. Install a Playwright browser with \`npx playwright install chromium\`. ${lastError instanceof Error ? lastError.message : ""}`);
}

await stat(sourcePath);
await mkdir(resolve("public"), { recursive: true });

const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: "load" });
  await page.emulateMedia({ media: "screen" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await page.close();
} finally {
  await browser.close();
}

const { size } = await stat(outputPath);
if (size < 1_000) throw new Error("Generated CV PDF is unexpectedly small.");
console.log(`Generated ${outputPath} (${size} bytes) from ${sourcePath}.`);
