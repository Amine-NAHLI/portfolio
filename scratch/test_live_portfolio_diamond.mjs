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
  const port = 3195;
  console.log(`Starting Next dev on port ${port}...`);
  const nextProc = spawn("cmd.exe", ["/c", `npx next dev -p ${port}`], {
    cwd: "d:\\NAHLI-AMINE\\portfolio",
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  try {
    await waitPort(port);
    console.log("Portfolio dev server running on port 3195!");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Opening portfolio...");
    await page.goto(`http://127.0.0.1:${port}`);
    await page.waitForTimeout(2500);

    const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

    // Screenshot initial dark mode
    await page.screenshot({ path: path.join(outDir, "real_portfolio_dark.png") });
    console.log("Saved real_portfolio_dark.png");

    // Locate theme toggle
    const toggleBtn = await page.locator('button[aria-label*="thème"], button[aria-label*="theme"]').first();
    console.log("Clicking theme toggle to switch to Light mode...");

    // Click and capture progressive transition stages
    await toggleBtn.click();
    await page.waitForTimeout(160);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_diamond_mid1.png") });

    await page.waitForTimeout(180);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_diamond_mid2.png") });

    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_light_settled.png") });
    console.log("Saved real_portfolio_light_settled.png");

    // Click back to Dark Mode and capture mid-flight
    console.log("Clicking theme toggle to switch back to Dark mode...");
    await toggleBtn.click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_dark_mid.png") });

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, "real_portfolio_dark_final.png") });
    console.log("Saved real_portfolio_dark_final.png");

    await browser.close();
    console.log("All real portfolio captures completed!");
  } finally {
    console.log("Stopping Next server...");
    nextProc.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error("Execution error:", e);
  process.exit(1);
});
