import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Atmospheric Ambiance Dissolve</title>
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

    /* Seamless Atmospheric Ambiance Dissolve: NO circles, NO squares, NO cuts */
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 480ms;
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      mix-blend-mode: normal;
    }

    ::view-transition-old(root) {
      animation-name: atmospheric-dissolve-old;
      z-index: 1;
    }

    ::view-transition-new(root) {
      animation-name: atmospheric-dissolve-new;
      z-index: 2;
    }

    @keyframes atmospheric-dissolve-old {
      0% {
        opacity: 1;
      }
      40% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes atmospheric-dissolve-new {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
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
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem; font-family:monospace;">ATMOSPHERIC_AMBIANCE_DISSOLVE</div>
    <h1>Velvety Atmospheric Ambiance</h1>
    <p>Seamless lighting shift: no geometric shapes, no circles, no squares. Pure, imperceptible, silky-smooth transition.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      document.startViewTransition(() => {
        document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
      });
    });
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3960, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3960");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Capture dark baseline
  await page.screenshot({ path: path.join(outDir, "dissolve_dark_before.png") });

  // Click toggle
  await page.click('#theme-btn');

  // Capture mid-dissolve (at 220ms)
  await page.waitForTimeout(220);
  await page.screenshot({ path: path.join(outDir, "dissolve_mid_transition.png") });

  // Settled light
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outDir, "dissolve_light_settled.png") });

  await browser.close();
  server.close();
  console.log("Recorded atmospheric dissolve!");
});
