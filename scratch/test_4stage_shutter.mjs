import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
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
      max-width: 600px;
      width: 100%;
    }

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
      animation: theme-cyber-shutter 600ms cubic-bezier(0.2, 0.9, 0.25, 1) forwards;
    }

    @keyframes theme-cyber-shutter {
      0% {
        clip-path: ellipse(0px 0px at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1.2) contrast(1.04);
      }
      18% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.6) 4px at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1.15) contrast(1.02);
      }
      55% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.6) calc(var(--theme-r, 100vmax) * 0.45) at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1.06);
      }
      100% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.6) calc(var(--theme-r, 100vmax) * 1.25) at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1) contrast(1);
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>AMINE NAHLI // PORTFOLIO</div>
    <button class="btn" id="theme-btn" style="position: absolute; right: 2rem; top: 14px;">Switch Theme</button>
  </div>
  <div class="card">
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem; font-family:monospace;">PRECISION_SHUTTER</div>
    <h1 style="margin-bottom:1rem;">Cyber Anamorphic Aperture</h1>
    <p>Calibrating 4-stage progression: Point &rarr; Horizontal Laser Slice &rarr; Half Wavefront &rarr; Full Atmosphere.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');
    btn.addEventListener('click', () => {
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

      document.startViewTransition(() => {
        document.documentElement.dataset.theme = nextTheme;
      });
    });
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3933, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3933");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  console.log("Triggering button click...");
  await page.click("#theme-btn");

  // Capture frame 1: ~70ms (Laser Horizon Slit)
  await page.waitForTimeout(70);
  await page.screenshot({ path: path.join(outDir, "shutter_4stage_f1_slit.png") });

  // Capture frame 2: ~200ms (Half Wavefront)
  await page.waitForTimeout(130);
  await page.screenshot({ path: path.join(outDir, "shutter_4stage_f2_halfwave.png") });

  // Capture frame 3: ~380ms (Almost full)
  await page.waitForTimeout(180);
  await page.screenshot({ path: path.join(outDir, "shutter_4stage_f3_wide.png") });

  // Settled
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, "shutter_4stage_f4_settled.png") });

  await browser.close();
  server.close();
  console.log("Recorded 4-stage progression!");
});
