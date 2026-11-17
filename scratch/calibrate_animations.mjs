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
    <h2 style="margin-bottom:1rem;">Cyber Aperture Calibration</h2>
    <p>Calibrating Anamorphic Horizon Wave & Precision Cyber Shutter</p>
  </div>
  <button id="btn" style="position:fixed; top:24px; right:32px; padding:8px 16px; border-radius:9999px;">Toggle</button>
  <script>
    window.testAperture = function(type) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const next = isDark ? 'light' : 'dark';
      const x = window.innerWidth - 65;
      const y = 35;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = next;
      });

      vt.ready.then(() => {
        if (type === 'anamorphic_laser') {
          // Anamorphic Laser Horizon:
          // 1. Slit cuts across horizontally
          // 2. Blossoms downward into full screen
          const screenW = Math.max(window.innerWidth, window.innerHeight) * 1.25;
          document.documentElement.animate(
            [
              {
                clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
                filter: next === 'light' ? 'brightness(1.18)' : 'brightness(0.92)',
                offset: 0
              },
              {
                clipPath: 'ellipse(' + screenW + 'px 2.5px at ' + x + 'px ' + y + 'px)',
                filter: next === 'light' ? 'brightness(1.12)' : 'brightness(0.96)',
                offset: 0.25
              },
              {
                clipPath: 'ellipse(' + screenW + 'px ' + (endRadius * 1.08) + 'px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1)',
                offset: 1
              }
            ],
            {
              duration: 620,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (type === 'cyber_diamond') {
          // Cyber Diamond:
          // 4-point diamond expanding gracefully with dMax = endRadius * 1.45 (so corners fully clear)
          const dMax = endRadius * 1.45;
          document.documentElement.animate(
            [
              {
                clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
                filter: next === 'light' ? 'brightness(1.15)' : 'brightness(0.92)',
                offset: 0
              },
              {
                clipPath: 'polygon(' + (x - dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y - dMax) + 'px, ' + (x + dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y + dMax) + 'px)',
                filter: 'brightness(1)',
                offset: 1
              }
            ],
            {
              duration: 620,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        }
      });
    };
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3927, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3927");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test anamorphic laser: 120ms (slit), 260ms (opening), 450ms (nearly settled)
  console.log("Testing anamorphic laser...");
  await page.evaluate(() => window.testAperture('anamorphic_laser'));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outDir, "calib_laser_100ms.png") });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(outDir, "calib_laser_250ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "calib_laser_450ms.png") });

  await page.waitForTimeout(500);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test cyber diamond: 100ms, 250ms, 450ms
  console.log("Testing cyber diamond...");
  await page.evaluate(() => window.testAperture('cyber_diamond'));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outDir, "calib_diamond_100ms.png") });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(outDir, "calib_diamond_250ms.png") });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "calib_diamond_450ms.png") });

  await browser.close();
  server.close();
  console.log("All calibrations recorded!");
});
