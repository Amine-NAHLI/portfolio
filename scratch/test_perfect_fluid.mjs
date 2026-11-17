import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Pure CSS Fluid Transitions</title>
  <style>
    :root {
      --bg: #0B0B0C;
      --text: #FFFFFF;
      --accent: #C8F122;
      --card-bg: #121316;
      --border: rgba(255,255,255,0.1);
    }
    [data-theme="light"] {
      --bg: #F4F6F8;
      --text: #0D1520;
      --accent: #0066FF;
      --card-bg: #FFFFFF;
      --border: rgba(13,21,32,0.12);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .header {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      border-bottom: 1px solid var(--border);
      background: var(--card-bg);
    }
    .btn {
      padding: 8px 18px;
      border-radius: 9999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.05);
      color: var(--text);
      cursor: pointer;
      font-weight: 600;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 650px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    h1 { font-size: 2.2rem; margin-bottom: 1rem; }
    p { opacity: 0.8; line-height: 1.6; }

    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-old(root) {
      z-index: 1;
    }
    ::view-transition-new(root) {
      z-index: 9999;
    }

    /* Style A: Silky Celestial Wavefront (Continuous gentle widescreen curve, perfectly smooth deceleration) */
    html[data-transition="celestial-wave"]::view-transition-new(root) {
      animation: celestial-wave-anim 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes celestial-wave-anim {
      0% {
        clip-path: ellipse(0px 0px at var(--theme-x, 90vw) var(--theme-y, 30px));
        opacity: 0.88;
      }
      100% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.35) calc(var(--theme-r, 100vmax) * 1.08) at var(--theme-x, 90vw) var(--theme-y, 30px));
        opacity: 1;
      }
    }

    /* Style B: Silky Diagonal Aurora Veil (A smooth, angled diagonal sheet flowing across the screen) */
    html[data-transition="diagonal-aurora"]::view-transition-new(root) {
      animation: diagonal-aurora-anim 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes diagonal-aurora-anim {
      0% {
        clip-path: polygon(100% -10%, 100% -10%, 110% 0%, 110% 0%);
        opacity: 0.9;
      }
      100% {
        clip-path: polygon(100% -20%, -60% -20%, -60% 160%, 120% 160%);
        opacity: 1;
      }
    }

    /* Style C: Organic Dual-Axis Wave (Fluid expanding wave with subtle photon bloom) */
    html[data-transition="organic-veil"]::view-transition-new(root) {
      animation: organic-veil-anim 680ms cubic-bezier(0.25, 1, 0.35, 1) forwards;
    }
    @keyframes organic-veil-anim {
      0% {
        clip-path: ellipse(0px 0px at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1.12);
      }
      100% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.4) calc(var(--theme-r, 100vmax) * 1.1) at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1);
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-weight:700;">AMINE NAHLI // PORTFOLIO</div>
    <button class="btn" id="theme-btn" style="position: absolute; right: 2rem; top: 14px;">Toggle Theme</button>
  </div>
  <div class="card">
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem; font-family:monospace;">PURE_CSS_FLUIDITY</div>
    <h1>Velvety Continuous Motion</h1>
    <p>Comparing pure CSS hardware transitions: Celestial Wave, Diagonal Aurora Veil, and Organic Dual-Axis Wave.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');

    window.triggerStyle = function(styleName) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';

      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.style.setProperty('--theme-x', x + 'px');
      document.documentElement.style.setProperty('--theme-y', y + 'px');
      document.documentElement.style.setProperty('--theme-r', endRadius + 'px');
      document.documentElement.dataset.transition = styleName;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = nextTheme;
      });

      vt.finished.finally(() => {
        delete document.documentElement.dataset.transition;
      });
    };
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3946, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3946");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test 1: celestial-wave
  console.log("Testing Celestial Wave...");
  await page.evaluate(() => window.triggerStyle('celestial-wave'));
  await page.waitForTimeout(140);
  await page.screenshot({ path: path.join(outDir, "pure_celestial_140ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "pure_celestial_340ms.png") });
  await page.waitForTimeout(450);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 2: diagonal-aurora
  console.log("Testing Diagonal Aurora Veil...");
  await page.evaluate(() => window.triggerStyle('diagonal-aurora'));
  await page.waitForTimeout(140);
  await page.screenshot({ path: path.join(outDir, "pure_aurora_140ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "pure_aurora_340ms.png") });
  await page.waitForTimeout(450);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 3: organic-veil
  console.log("Testing Organic Veil...");
  await page.evaluate(() => window.triggerStyle('organic-veil'));
  await page.waitForTimeout(140);
  await page.screenshot({ path: path.join(outDir, "pure_organic_140ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "pure_organic_340ms.png") });

  await browser.close();
  server.close();
  console.log("All pure CSS tests complete!");
});
