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
    ::view-transition-new(root) { z-index: 9999; }
    .card { background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; width: 500px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin-bottom:1rem;">Cyber Aperture Showcase</h2>
    <p>Testing Anamorphic Diamond & Cybernetic Octagon transitions</p>
  </div>
  <button id="btn" style="position:fixed; top:24px; right:32px; padding:8px 16px; border-radius:9999px;">Toggle</button>
  <script>
    window.testDiamond = function() {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const next = isDark ? 'light' : 'dark';
      const x = window.innerWidth - 70;
      const y = 36;
      const endRadius = Math.hypot(x, window.innerHeight - y);
      const dMax = endRadius * 2.8;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = next;
      });

      vt.ready.then(() => {
        document.documentElement.animate(
          [
            {
              clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
              filter: next === 'light' ? 'brightness(1.15) contrast(1.04)' : 'brightness(0.92) contrast(1.08)',
              offset: 0
            },
            {
              clipPath: 'polygon(' + (x - 280) + 'px ' + y + 'px, ' + x + 'px ' + (y - 70) + 'px, ' + (x + 280) + 'px ' + y + 'px, ' + x + 'px ' + (y + 110) + 'px)',
              filter: next === 'light' ? 'brightness(1.10)' : 'brightness(0.95)',
              offset: 0.25
            },
            {
              clipPath: 'polygon(' + (x - dMax * 1.6) + 'px ' + y + 'px, ' + x + 'px ' + (y - dMax * 0.8) + 'px, ' + (x + dMax * 1.6) + 'px ' + y + 'px, ' + x + 'px ' + (y + dMax * 1.1) + 'px)',
              filter: 'brightness(1) contrast(1)',
              offset: 1
            }
          ],
          {
            duration: 650,
            easing: 'cubic-bezier(0.2, 0.9, 0.25, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    };
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3926, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3926");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  await page.evaluate(() => window.testDiamond());
  await page.waitForTimeout(140);
  await page.screenshot({ path: path.join(outDir, "anamorphic_diamond_frame1.png") });

  await page.waitForTimeout(160);
  await page.screenshot({ path: path.join(outDir, "anamorphic_diamond_frame2.png") });

  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "anamorphic_diamond_settled.png") });

  await browser.close();
  server.close();
  console.log("Done diamond test!");
});
