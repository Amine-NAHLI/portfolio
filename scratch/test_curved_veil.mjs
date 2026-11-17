import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <style>
    :root { --bg: #0B0B0C; --text: #fff; --card: #121316; }
    [data-theme="light"] { --bg: #F4F6F8; --text: #0D1520; --card: #FFFFFF; }
    body { background: var(--bg); color: var(--text); height: 100vh; margin:0; display:flex; align-items:center; justify-content:center; }
    ::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
    ::view-transition-old(root) { z-index: 1; }
    ::view-transition-new(root) {
      z-index: 9999;
      animation: anim-curved-veil 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes anim-curved-veil {
      0% {
        clip-path: ellipse(0px 0px at var(--theme-x, 90vw) var(--theme-y, 30px));
        opacity: 0.95;
      }
      100% {
        clip-path: ellipse(calc(var(--theme-r, 100vmax) * 1.05) calc(var(--theme-r, 100vmax) * 1.05) at var(--theme-x, 90vw) var(--theme-y, 30px));
        opacity: 1;
      }
    }
    .card { background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2.5rem; width: 620px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Testing Smooth Continuous Curved Wave</h2>
  </div>
  <button id="btn" style="position:fixed; top:24px; right:32px; padding:8px 18px;">Toggle</button>
  <script>
    const btn = document.getElementById('btn');
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const x = window.innerWidth - 60;
      const y = 35;
      const r = Math.hypot(x, window.innerHeight - y);
      document.documentElement.style.setProperty('--theme-x', x + 'px');
      document.documentElement.style.setProperty('--theme-y', y + 'px');
      document.documentElement.style.setProperty('--theme-r', r + 'px');
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

server.listen(3951, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3951");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  await page.click('#btn');
  await page.waitForTimeout(180);
  await page.screenshot({ path: path.join(outDir, "curved_veil_180ms.png") });
  await page.waitForTimeout(180);
  await page.screenshot({ path: path.join(outDir, "curved_veil_360ms.png") });

  await browser.close();
  server.close();
});
