import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Fluid Transitions Evaluation</title>
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
    .tag { color: var(--accent); font-weight: bold; font-family: monospace; letter-spacing: 0.1em; margin-bottom: 0.5rem; display: inline-block; }

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
    <div class="tag">FLUID_CINEMATIC_EVALUATION</div>
    <h1>Silky Fluid Transitions</h1>
    <p>Evaluating continuous, calm, and unique transition choreographies without abrupt slits or artificial cuts.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');

    window.triggerFluid = function(mode, duration = 700) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';

      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const endRadius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = nextTheme;
      });

      vt.ready.then(() => {
        if (mode === 'drift_wave') {
          // Concept 1: Drifting Organic Wavefront
          // Origin drifts smoothly from (x, y) towards center while expanding as a wide elliptical wave
          // Perfectly continuous, no stops, pure fluid motion
          const targetX = x - w * 0.25;
          const targetY = y + h * 0.25;
          const rx = endRadius * 1.8;
          const ry = endRadius * 1.4;

          document.documentElement.animate(
            [
              {
                clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
                opacity: 0.92,
              },
              {
                clipPath: 'ellipse(' + rx + 'px ' + ry + 'px at ' + targetX + 'px ' + targetY + 'px)',
                opacity: 1,
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.25, 1, 0.4, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (mode === 'diagonal_curtain') {
          // Concept 2: Silky Diagonal Fluid Curtain Sweep
          // An angled sweeping wavefront (diagonal 45° wave) that cascades across the screen
          // completely smooth and continuous from top-right corner to bottom-left
          const span = Math.max(w, h) * 2.6;
          // Polygon 4 points: expands smoothly from corner
          document.documentElement.animate(
            [
              {
                clipPath: 'polygon(' + w + 'px 0, ' + w + 'px 0, ' + w + 'px 0, ' + w + 'px 0)',
                opacity: 0.85,
              },
              {
                clipPath: 'polygon(' + (w - span) + 'px 0, ' + (w + span*0.4) + 'px 0, ' + (w + span*0.4) + 'px ' + (span*1.4) + 'px, ' + (w - span*0.3) + 'px ' + (span*1.4) + 'px)',
                opacity: 1,
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (mode === 'atmospheric_ripple') {
          // Concept 3: Atmospheric Dual-Phase Organic Wavefront (Silky & Calm)
          // Starts with a soft organic pill/oval at (x, y), gently swells across the navbar, then sweeps down gracefully
          // Continuous curvature, no 0px abrupt slit
          const rMax = endRadius * 1.35;
          document.documentElement.animate(
            [
              {
                clipPath: 'ellipse(20px 14px at ' + x + 'px ' + y + 'px)',
                opacity: 0.8,
              },
              {
                clipPath: 'ellipse(' + (w * 0.8) + 'px ' + (h * 0.35) + 'px at ' + (x - w*0.1) + 'px ' + (y + h*0.1) + 'px)',
                opacity: 0.96,
                offset: 0.45
              },
              {
                clipPath: 'ellipse(' + (rMax * 1.5) + 'px ' + (rMax * 1.5) + 'px at ' + (w / 2) + 'px ' + (h / 2) + 'px)',
                opacity: 1,
                offset: 1
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.25, 1, 0.35, 1)',
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

server.listen(3940, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3940");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test 1: Drift Wave at 30% and 60%
  console.log("Testing Drift Wave...");
  await page.evaluate(() => window.triggerFluid('drift_wave', 800));
  await page.waitForTimeout(200); // 25%
  await page.screenshot({ path: path.join(outDir, "fluid_drift_25pct.png") });
  await page.waitForTimeout(250); // 55%
  await page.screenshot({ path: path.join(outDir, "fluid_drift_55pct.png") });
  await page.waitForTimeout(600);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 2: Diagonal Curtain at 25% and 55%
  console.log("Testing Diagonal Curtain...");
  await page.evaluate(() => window.triggerFluid('diagonal_curtain', 800));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "fluid_diagonal_25pct.png") });
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, "fluid_diagonal_55pct.png") });
  await page.waitForTimeout(600);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 3: Atmospheric Ripple at 25% and 55%
  console.log("Testing Atmospheric Ripple...");
  await page.evaluate(() => window.triggerFluid('atmospheric_ripple', 800));
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "fluid_ripple_25pct.png") });
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, "fluid_ripple_55pct.png") });

  await browser.close();
  server.close();
  console.log("All fluid tests completed!");
});
