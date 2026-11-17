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
      animation: anim-hex-pointy 700ms cubic-bezier(0.35, 0.1, 0.25, 1) forwards;
    }
    @keyframes anim-hex-pointy {
      0% {
        clip-path: polygon(
          var(--theme-x) var(--theme-y),
          var(--theme-x) var(--theme-y),
          var(--theme-x) var(--theme-y),
          var(--theme-x) var(--theme-y),
          var(--theme-x) var(--theme-y),
          var(--theme-x) var(--theme-y)
        );
      }
      100% {
        /* Pointy-topped hexagon (30 deg rotated) */
        clip-path: polygon(
          calc(var(--theme-x) + var(--theme-r) * 1.15 * 0.866) calc(var(--theme-y) + var(--theme-r) * 1.15 * 0.5),
          var(--theme-x) calc(var(--theme-y) + var(--theme-r) * 1.15),
          calc(var(--theme-x) - var(--theme-r) * 1.15 * 0.866) calc(var(--theme-y) + var(--theme-r) * 1.15 * 0.5),
          calc(var(--theme-x) - var(--theme-r) * 1.15 * 0.866) calc(var(--theme-y) - var(--theme-r) * 1.15 * 0.5),
          var(--theme-x) calc(var(--theme-y) - var(--theme-r) * 1.15),
          calc(var(--theme-x) + var(--theme-r) * 1.15 * 0.866) calc(var(--theme-y) - var(--theme-r) * 1.15 * 0.5)
        );
      }
    }
    .card { background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2.5rem; width: 620px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Testing Pointy-Topped Hexagon Aperture</h2>
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

server.listen(3953, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3953");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  await page.click('#btn');
  await page.waitForTimeout(220);
  await page.screenshot({ path: path.join(outDir, "pointy_hex_220ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "pointy_hex_420ms.png") });

  await browser.close();
  server.close();
});
