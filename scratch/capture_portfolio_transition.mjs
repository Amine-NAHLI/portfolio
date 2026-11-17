import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";

async function waitPort(port, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}`);
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Port ${port} did not respond within ${timeoutMs}ms`);
}

async function main() {
  const port = 3185;
  console.log(`Starting next dev on port ${port}...`);
  const nextProc = spawn("cmd.exe", ["/c", `npx next dev -p ${port}`], {
    cwd: "d:\\NAHLI-AMINE\\portfolio",
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  nextProc.stdout.on("data", (d) => console.log(`[Next] ${d.toString().trim()}`));
  nextProc.stderr.on("data", (d) => console.error(`[Next ERR] ${d.toString().trim()}`));

  try {
    await waitPort(port);
    console.log("Next server is ready!");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Navigating to portfolio...");
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

    // 1. Capture Dark baseline
    await page.screenshot({ path: path.join(outDir, "real_portfolio_dark_initial.png") });
    console.log("Captured dark baseline");

    // 2. Click Theme Toggle and capture beam / mid-transition / final
    const themeBtn = await page.locator('button[aria-label*="thème"], button[aria-label*="theme"]').first();
    const box = await themeBtn.boundingBox();
    console.log("Theme button located at:", box);

    // Trigger click and quickly capture frames
    await themeBtn.click();
    await page.waitForTimeout(80);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_transition_frame1.png") });

    await page.waitForTimeout(160);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_transition_frame2.png") });

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_light_settled.png") });

    console.log("Captured transition to Light Mode!");

    // Switch back to Dark mode and capture
    await themeBtn.click();
    await page.waitForTimeout(120);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_transition_frame3_back.png") });

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_dark_settled.png") });

    await browser.close();
  } finally {
    console.log("Killing Next dev server...");
    nextProc.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("Error in script:", err);
  process.exit(1);
});
