import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>True Fluid Calibration</title>
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
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem; font-family:monospace;">PRECISION_FLUID_CALIBRATION</div>
    <h1>True Continuous Fluidity</h1>
    <p>Testing mathematically calibrated curves where expansion is evenly distributed across the entire duration.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');

    window.runCalibrated = function(style, duration = 650) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';

      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Calculate exact distance to farthest corner
      const maxCornerDist = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = nextTheme;
      });

      vt.ready.then(() => {
        if (style === 'cinematic_wave') {
          // Cinematic Asymmetric Wavefront:
          // Smooth 1.4:1 widescreen ratio, starts at 0, smoothly fills screen exactly at 100%
          const rx = maxCornerDist * 1.35;
          const ry = maxCornerDist * 1.02;

          document.documentElement.animate(
            [
              {
                clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
                filter: nextTheme === 'light' ? 'brightness(1.08)' : 'brightness(0.96)',
              },
              {
                clipPath: 'ellipse(' + rx + 'px ' + ry + 'px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1)',
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.32, 0.72, 0, 1)', // Apple/iOS silky deceleration curve
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (style === 'diagonal_sweep') {
          // Continuous Diagonal Visor Sweep (High-Tech & Unique)
          // Sweeps smoothly diagonally from the button corner across the screen
          const dMax = maxCornerDist * 1.42;
          document.documentElement.animate(
            [
              {
                clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
                filter: nextTheme === 'light' ? 'brightness(1.08)' : 'brightness(0.96)',
              },
              {
                clipPath: 'polygon(' + (x - dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y - dMax) + 'px, ' + (x + dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y + dMax) + 'px)',
                filter: 'brightness(1)',
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (style === 'hex_iris') {
          // Cybernetic Hexagonal Aperture:
          const rMax = maxCornerDist * 1.15;
          const angles = [0, 60, 120, 180, 240, 300].map(a => a * Math.PI / 180);
          const pStart = angles.map(() => x + 'px ' + y + 'px').join(', ');
          const pEnd = angles.map(a => {
            const px = Math.round(x + Math.cos(a) * rMax);
            const py = Math.round(y + Math.sin(a) * rMax);
            return px + 'px ' + py + 'px';
          }).join(', ');

          document.documentElement.animate(
            [
              { clipPath: 'polygon(' + pStart + ')', filter: nextTheme === 'light' ? 'brightness(1.08)' : 'brightness(0.96)' },
              { clipPath: 'polygon(' + pEnd + ')', filter: 'brightness(1)' }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
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

server.listen(3941, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3941");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test 1: cinematic_wave with duration 1200ms for slow-motion frame capture
  console.log("Capturing Cinematic Wave frames...");
  await page.evaluate(() => window.runCalibrated('cinematic_wave', 1200));
  await page.waitForTimeout(300); // 25% of journey
  await page.screenshot({ path: path.join(outDir, "eval_wave_25pct.png") });
  await page.waitForTimeout(350); // ~55% of journey
  await page.screenshot({ path: path.join(outDir, "eval_wave_55pct.png") });
  await page.waitForTimeout(700);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 2: diagonal_sweep with duration 1200ms
  console.log("Capturing Diagonal Sweep frames...");
  await page.evaluate(() => window.runCalibrated('diagonal_sweep', 1200));
  await page.waitForTimeout(300); // 25%
  await page.screenshot({ path: path.join(outDir, "eval_diagonal_25pct.png") });
  await page.waitForTimeout(350); // 55%
  await page.screenshot({ path: path.join(outDir, "eval_diagonal_55pct.png") });
  await page.waitForTimeout(700);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 3: hex_iris with duration 1200ms
  console.log("Capturing Hex Iris frames...");
  await page.evaluate(() => window.runCalibrated('hex_iris', 1200));
  await page.waitForTimeout(300); // 25%
  await page.screenshot({ path: path.join(outDir, "eval_hex_25pct.png") });
  await page.waitForTimeout(350); // 55%
  await page.screenshot({ path: path.join(outDir, "eval_hex_55pct.png") });

  await browser.close();
  server.close();
  console.log("All calibrated evaluations done!");
});
