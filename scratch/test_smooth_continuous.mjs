import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Smooth Continuous Fluidity Test</title>
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
      animation: smooth-old-fade 750ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    ::view-transition-new(root) {
      z-index: 9999;
    }

    @keyframes smooth-old-fade {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0.92; transform: scale(0.995); }
    }

    /* Style 1: The Cosmic Liquid Veil (Smooth 1.35:1 Widescreen Wave with Ease-In-Out) */
    html[data-style="liquid-veil"]::view-transition-new(root) {
      animation: anim-liquid-veil 750ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes anim-liquid-veil {
      0% {
        clip-path: ellipse(0px 0px at var(--theme-x, 90vw) var(--theme-y, 30px));
        opacity: 0.95;
      }
      100% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.05) calc(var(--theme-r, 100vmax) * 1.05) at var(--theme-x, 90vw) var(--theme-y, 30px));
        opacity: 1;
      }
    }

    /* Style 2: The Diagonal Aurora Wave (An angled organic fluid curtain) */
    html[data-style="aurora-curtain"]::view-transition-new(root) {
      animation: anim-aurora-curtain 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes anim-aurora-curtain {
      0% {
        clip-path: polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%);
      }
      100% {
        clip-path: polygon(100% 0%, -80% 0%, -80% 180%, 100% 180%);
      }
    }

    /* Style 3: Organic Diamond Iris (Angular Cyber Aperture with Smooth Ease-In-Out) */
    html[data-style="cyber-diamond"]::view-transition-new(root) {
      animation: anim-cyber-diamond 750ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes anim-cyber-diamond {
      0% {
        clip-path: polygon(var(--theme-x, 90vw) var(--theme-y, 30px), var(--theme-x, 90vw) var(--theme-y, 30px), var(--theme-x, 90vw) var(--theme-y, 30px), var(--theme-x, 90vw) var(--theme-y, 30px));
      }
      100% {
        clip-path: polygon(
          calc(var(--theme-x, 90vw) - var(--theme-r, 100vmax) * 1.45) var(--theme-y, 30px),
          var(--theme-x, 90vw) calc(var(--theme-y, 30px) - var(--theme-r, 100vmax) * 1.45),
          calc(var(--theme-x, 90vw) + var(--theme-r, 100vmax) * 1.45) var(--theme-y, 30px),
          var(--theme-x, 90vw) calc(var(--theme-y, 30px) + var(--theme-r, 100vmax) * 1.45)
        );
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
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem; font-family:monospace;">SMOOTH_CONTINUOUS_EVALUATION</div>
    <h1>Silky Ease-In-Out Calibration</h1>
    <p>Testing cubic-bezier(0.4, 0, 0.2, 1) to ensure the transition is visible and fluid across all frames.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');

    window.testTheme = function(style) {
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
      document.documentElement.dataset.style = style;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = nextTheme;
      });

      vt.finished.finally(() => {
        delete document.documentElement.dataset.style;
      });
    };
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3950, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3950");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test 1: aurora-curtain at 200ms (25%), 400ms (50%), 600ms (75%)
  console.log("Testing Aurora Curtain...");
  await page.evaluate(() => window.testTheme('aurora-curtain'));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "aurora_200ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "aurora_400ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "aurora_600ms.png") });
  await page.waitForTimeout(400);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 2: cyber-diamond at 200ms, 400ms, 600ms
  console.log("Testing Cyber Diamond...");
  await page.evaluate(() => window.testTheme('cyber-diamond'));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "diamond_200ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "diamond_400ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "diamond_600ms.png") });

  await browser.close();
  server.close();
  console.log("Done all smooth evaluations!");
});
