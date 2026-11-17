import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <style>
    :root { --bg: #0B0B0C; --text: #fff; }
    [data-theme="light"] { --bg: #FFFFFF; --text: #000; }
    body { background: var(--bg); color: var(--text); height: 100vh; margin:0; display:flex; align-items:center; justify-content:center; }
    ::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
    ::view-transition-old(root) { z-index: 1; }
    ::view-transition-new(root) { z-index: 9999; }
  </style>
</head>
<body>
  <h1>TEST DROP-SHADOW ON VIEW TRANSITION</h1>
  <button id="btn" style="position:fixed; top:20px; right:20px; padding:10px 20px;">Toggle</button>
  <script>
    window.testGlow = function() {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const next = isDark ? 'light' : 'dark';
      const x = window.innerWidth - 60;
      const y = 35;
      const endRadius = Math.hypot(x, window.innerHeight - y);
      const horizontalSpan = Math.max(window.innerWidth, window.innerHeight) * 1.5;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = next;
      });

      vt.ready.then(() => {
        document.documentElement.animate(
          [
            {
              clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
              filter: 'drop-shadow(0 0 12px #0066FF) brightness(1.2)',
              offset: 0
            },
            {
              clipPath: 'ellipse(' + horizontalSpan + 'px 4px at ' + x + 'px ' + y + 'px)',
              filter: 'drop-shadow(0 0 16px #0066FF) brightness(1.15)',
              offset: 0.28
            },
            {
              clipPath: 'ellipse(' + horizontalSpan + 'px ' + (endRadius * 1.4) + 'px at ' + x + 'px ' + y + 'px)',
              filter: 'drop-shadow(0 0 0px transparent) brightness(1)',
              offset: 1
            }
          ],
          {
            duration: 1000,
            easing: 'linear',
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

server.listen(3925, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3925");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  await page.evaluate(() => window.testGlow());
  await page.waitForTimeout(280); // in the horizontal laser slit phase
  await page.screenshot({ path: path.join(outDir, "test_glow_slit.png") });

  await page.waitForTimeout(300); // blossoming phase
  await page.screenshot({ path: path.join(outDir, "test_glow_blossom.png") });

  await browser.close();
  server.close();
  console.log("Done glow test!");
});
