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
  <h1>TEST VIEW TRANSITIONS</h1>
  <button id="btn" style="position:fixed; top:20px; right:20px; padding:10px 20px;">Toggle</button>
  <script>
    window.testShape = function(shapeType) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const next = isDark ? 'light' : 'dark';
      const x = window.innerWidth - 60;
      const y = 35;
      const endRadius = Math.hypot(x, window.innerHeight - y);

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = next;
      });

      vt.ready.then(() => {
        let keyframes;
        if (shapeType === 'dual_wave') {
          // Curved Dual-Wavefront: Anamorphic oval slit with dynamic angle
          keyframes = [
            { clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)', offset: 0 },
            { clipPath: 'ellipse(' + (endRadius * 1.5) + 'px 4px at ' + x + 'px ' + y + 'px)', offset: 0.28 },
            { clipPath: 'ellipse(' + (endRadius * 1.5) + 'px ' + (endRadius * 1.4) + 'px at ' + x + 'px ' + y + 'px)', offset: 1 }
          ];
        } else if (shapeType === 'diamond') {
          const dMax = endRadius * 2.2;
          keyframes = [
            { clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)', offset: 0 },
            { clipPath: 'polygon(' + (x - dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y - dMax) + 'px, ' + (x + dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y + dMax) + 'px)', offset: 1 }
          ];
        } else if (shapeType === 'cyber_blade') {
          const w = window.innerWidth * 2;
          const h = window.innerHeight * 2;
          keyframes = [
            { clipPath: 'polygon(' + x + 'px 0, ' + x + 'px 0, ' + x + 'px 0, ' + x + 'px 0)', offset: 0 },
            { clipPath: 'polygon(' + (x - w) + 'px 0, ' + (x + 200) + 'px 0, ' + (x + 200) + 'px ' + h + 'px, ' + (x - w - 400) + 'px ' + h + 'px)', offset: 1 }
          ];
        }

        const anim = document.documentElement.animate(keyframes, {
          duration: 3000, // 3s for testing frame capture
          easing: 'linear',
          pseudoElement: '::view-transition-new(root)'
        });
        window._activeAnim = anim;
      });
    };
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3924, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3924");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test diamond at 30% linear
  console.log("Testing Diamond...");
  await page.evaluate(() => window.testShape('diamond'));
  await page.waitForTimeout(600); // 20%
  await page.screenshot({ path: path.join(outDir, "linear_diamond_20pct.png") });
  await page.waitForTimeout(600); // 40%
  await page.screenshot({ path: path.join(outDir, "linear_diamond_40pct.png") });

  await page.waitForTimeout(2000);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test dual_wave at 20% and 50%
  console.log("Testing Dual-Wave...");
  await page.evaluate(() => window.testShape('dual_wave'));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "linear_dualwave_20pct.png") });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, "linear_dualwave_50pct.png") });

  await browser.close();
  server.close();
  console.log("Done linear checks!");
});
