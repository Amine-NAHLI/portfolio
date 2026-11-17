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
      padding: 8px 16px;
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
      animation: theme-anamorphic-shutter 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes theme-anamorphic-shutter {
      0% {
        clip-path: ellipse(0px 0px at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1.2) contrast(1.04);
      }
      28% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.5) 3.5px at var(--theme-x, 90vw) var(--theme-y, 30px));
        filter: brightness(1.12) contrast(1.02);
      }
      100% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.5) calc(var(--theme-r, 100vmax) * 1.15) at var(--theme-x, 90vw) var(--theme-y, 30px));
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
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem;">CYBERSECURITY & AI ARCHITECTURE</div>
    <h1 style="margin-bottom:1rem;">CSS Hardware Keyframe Test</h1>
    <p>Testing declarative CSS View Transition keyframes with zero JS promise lag.</p>
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

server.listen(3931, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3931");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  console.log("Triggering button click...");
  await page.click("#theme-btn");

  // Capture frame at 50ms (laser slit)
  await page.waitForTimeout(50);
  await page.screenshot({ path: path.join(outDir, "css_keyframe_f1_slit.png") });

  // Capture frame at 150ms (opening)
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outDir, "css_keyframe_f2_opening.png") });

  // Capture frame at 320ms (wave sweep)
  await page.waitForTimeout(170);
  await page.screenshot({ path: path.join(outDir, "css_keyframe_f3_sweep.png") });

  // Settled
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outDir, "css_keyframe_f4_settled.png") });

  await browser.close();
  server.close();
  console.log("Done CSS keyframe tests!");
});
