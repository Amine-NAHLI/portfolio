import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";

async function waitPort(port, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}`);
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Port ${port} did not respond within ${timeoutMs}ms`);
}

async function main() {
  const port = 3199;
  console.log(`Starting next start on port ${port}...`);
  const proc = spawn("cmd.exe", ["/c", `npx next start -p ${port}`], {
    cwd: "d:\\NAHLI-AMINE\\portfolio",
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  try {
    await waitPort(port);
    console.log("Production server running on 3199!");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.goto(`http://127.0.0.1:${port}`);
    await page.waitForTimeout(2000);

    const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

    // 1. Capture initial Dark Mode
    await page.screenshot({ path: path.join(outDir, "prod_atmospheric_dark.png") });
    console.log("Saved prod_atmospheric_dark.png");

    // 2. Click Theme Toggle to switch to Light Mode
    const toggleBtn = await page.locator('button[aria-label*="thème"], button[aria-label*="theme"]').first();
    await toggleBtn.click();

    // Capture mid-dissolve
    await page.waitForTimeout(160);
    await page.screenshot({ path: path.join(outDir, "prod_atmospheric_mid_transition.png") });
    console.log("Saved prod_atmospheric_mid_transition.png");

    // Settled Light Mode
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "prod_atmospheric_light.png") });
    console.log("Saved prod_atmospheric_light.png");

    // 3. Switch back to Dark Mode
    await toggleBtn.click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: path.join(outDir, "prod_atmospheric_back_mid.png") });

    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "prod_atmospheric_dark_settled.png") });
    console.log("Saved prod_atmospheric_dark_settled.png");

    // 4. Test Mobile Viewport (iPhone 14 / 390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, "prod_mobile_dark.png") });

    const mobileToggle = await page.locator('button[aria-label*="thème"], button[aria-label*="theme"]').first();
    await mobileToggle.click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: path.join(outDir, "prod_mobile_mid_dissolve.png") });

    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "prod_mobile_light.png") });
    console.log("Saved mobile screenshots!");

    await browser.close();
    console.log("All production screenshots captured successfully!");
  } finally {
    console.log("Stopping Next server...");
    proc.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error("Execution error:", e);
  process.exit(1);
});
