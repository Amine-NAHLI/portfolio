import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";

async function waitPort(port, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}`);
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Port ${port} did not respond within ${timeoutMs}ms`);
}

async function main() {
  const port = 3198;
  console.log(`Starting Next dev on port ${port}...`);
  const nextProc = spawn("cmd.exe", ["/c", `npx next dev -p ${port}`], {
    cwd: "d:\\NAHLI-AMINE\\portfolio",
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  try {
    await waitPort(port);
    console.log("Dev server running on 3198!");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.goto(`http://127.0.0.1:${port}`);
    await page.waitForTimeout(2500);

    const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

    // 1. Capture Dark Mode
    await page.screenshot({ path: path.join(outDir, "real_portfolio_dark_initial.png") });
    console.log("Captured real_portfolio_dark_initial.png");

    // 2. Click Theme Toggle to switch to Light Mode
    const toggleBtn = await page.locator('button[aria-label*="thème"], button[aria-label*="theme"]').first();
    console.log("Triggering theme switch...");
    await toggleBtn.click();

    // Capture mid-dissolve (at 180ms)
    await page.waitForTimeout(180);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_mid_dissolve.png") });
    console.log("Captured real_portfolio_mid_dissolve.png");

    // Settled Light Mode
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_light_settled.png") });
    console.log("Captured real_portfolio_light_settled.png");

    // 3. Switch back to Dark Mode
    await toggleBtn.click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_mid_dissolve_dark.png") });

    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_dark_settled.png") });
    console.log("Captured real_portfolio_dark_settled.png");

    // 4. Test Mobile Viewport (iPhone 14 / 390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_mobile_dark.png") });

    const mobileToggle = await page.locator('button[aria-label*="thème"], button[aria-label*="theme"]').first();
    await mobileToggle.click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_mobile_mid_dissolve.png") });

    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_mobile_light.png") });
    console.log("Captured mobile screenshots!");

    await browser.close();
    console.log("All verifications complete!");
  } finally {
    console.log("Cleaning up Next process...");
    nextProc.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error("Error in verification:", e);
  process.exit(1);
});
