import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Aperture Showcase</title>
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
    .accent-tag {
      color: var(--accent);
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }
    h1 { font-size: 2.2rem; margin-bottom: 1rem; }
    p { color: var(--text); opacity: 0.8; line-height: 1.6; }

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
    <div>AMINE NAHLI // PORTFOLIO</div>
    <button class="btn" id="theme-btn" style="position: absolute; right: 2rem; top: 14px;">Toggle</button>
  </div>
  <div class="card">
    <div class="accent-tag">Cybersecurity & AI Engineering</div>
    <h1>Special Transition Evaluation</h1>
    <p>Testing aperture polygon geometries and easing curves.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');

    window.runTest = function(mode, duration = 800) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';

      const updateDom = () => {
        document.documentElement.dataset.theme = nextTheme;
      };

      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const maxDim = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));

      const vt = document.startViewTransition(updateDom);

      vt.ready.then(() => {
        if (mode === 'diamond') {
          // Rotated 45-degree diamond aperture
          // From (x,y) expanding with dMax
          const dMax = maxDim * 2.8;
          window.activeAnimation = document.documentElement.animate(
            [
              {
                clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
                offset: 0
              },
              {
                clipPath: 'polygon(' + (x - dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y - dMax) + 'px, ' + (x + dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y + dMax) + 'px)',
                offset: 1
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (mode === 'cyber_blade') {
          // Asymmetric diagonal blade sweep:
          // Cuts from top-right to bottom-left with an angled sleek cybernetic edge
          const d = maxDim * 3.2;
          window.activeAnimation = document.documentElement.animate(
            [
              {
                clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
                offset: 0
              },
              {
                clipPath: 'polygon(' + (x - d*1.2) + 'px ' + (y - d*0.3) + 'px, ' + (x + d*0.4) + 'px ' + (y - d*0.8) + 'px, ' + (x + d*0.8) + 'px ' + (y + d*0.4) + 'px, ' + (x - d*0.3) + 'px ' + (y + d*1.2) + 'px)',
                offset: 1
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (mode === 'hexagon') {
          // Hexagonal Cybernetic Iris (6 vertices)
          const rMax = maxDim * 2.2;
          const angles = [0, 60, 120, 180, 240, 300].map(a => a * Math.PI / 180);
          const pStart = angles.map(() => x + 'px ' + y + 'px').join(', ');
          const pEnd = angles.map(a => {
            const px = Math.round(x + Math.cos(a) * rMax);
            const py = Math.round(y + Math.sin(a) * rMax);
            return px + 'px ' + py + 'px';
          }).join(', ');

          window.activeAnimation = document.documentElement.animate(
            [
              { clipPath: 'polygon(' + pStart + ')', offset: 0 },
              { clipPath: 'polygon(' + pEnd + ')', offset: 1 }
            ],
            {
              duration: duration,
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

server.listen(3923, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3923");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test Hexagon: pause animation at 25% and 50% to inspect geometric precision
  console.log("Capturing Hexagon iris at 30%...");
  await page.evaluate(() => {
    window.runTest('hexagon', 2000);
  });
  // Pause at 400ms (20%)
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "theme_hexagon_20pct.png") });

  await page.waitForTimeout(400); // 40%
  await page.screenshot({ path: path.join(outDir, "theme_hexagon_40pct.png") });

  await page.waitForTimeout(1400); // Done

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test Diamond aperture
  console.log("Capturing Diamond aperture at 25% and 50%...");
  await page.evaluate(() => {
    window.runTest('diamond', 2000);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "theme_diamond_20pct.png") });

  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "theme_diamond_40pct.png") });

  await browser.close();
  server.close();
  console.log("All frame captures complete!");
});
