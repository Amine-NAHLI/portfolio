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
    ::view-transition-old(root) { z-index: 1; }
    ::view-transition-new(root) { z-index: 9999; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-weight:700;">AMINE NAHLI // PORTFOLIO</div>
    <button class="btn" id="theme-btn" style="position: absolute; right: 2rem; top: 14px;">Toggle Theme</button>
  </div>
  <div class="card">
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem; font-family:monospace;">PERFECT_CALIBRATION_TEST</div>
    <h1 style="margin-bottom:1rem; font-size:2rem;">Cinematic Anamorphic Wavefront</h1>
    <p>Testing calibrated easing curve for smooth, steady expansion across the entire viewport.</p>
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

      // Anamorphic horizontal span: spans viewport width with wide ratio
      const rx = endRadius * 2.3;
      const ry = endRadius * 1.15;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = nextTheme;
      });

      vt.ready.then(() => {
        document.documentElement.animate(
          [
            {
              clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
              filter: nextTheme === 'light' ? 'brightness(1.15) contrast(1.04)' : 'brightness(0.92) contrast(1.08)',
            },
            {
              clipPath: 'ellipse(' + rx + 'px ' + ry + 'px at ' + x + 'px ' + y + 'px)',
              filter: 'brightness(1) contrast(1)',
            }
          ],
          {
            duration: 520,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    });
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3932, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3932");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  console.log("Triggering button click...");
  await page.click("#theme-btn");

  // Record progressive frames: 80ms, 180ms, 300ms, 550ms
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(outDir, "calibrated_wave_f1_80ms.png") });

  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outDir, "calibrated_wave_f2_180ms.png") });

  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "calibrated_wave_f3_300ms.png") });

  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, "calibrated_wave_f4_settled.png") });

  await browser.close();
  server.close();
  console.log("Captured calibrated wave frames!");
});
