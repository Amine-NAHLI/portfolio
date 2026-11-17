import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Organic Wave Showcase</title>
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
    <div style="color:var(--accent); font-weight:bold; margin-bottom:0.5rem; font-family:monospace;">ORGANIC_WAVE_EVALUATION</div>
    <h1>Velvety Wavefront Dynamics</h1>
    <p>Testing balanced, screen-wide organic wipe and diagonal silk curtain transitions.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');

    window.runWipe = function(type, duration = 800) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      const w = window.innerWidth;
      const h = window.innerHeight;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = nextTheme;
      });

      vt.ready.then(() => {
        if (type === 'organic_curtain') {
          // Curved organic wave flowing smoothly from top to bottom
          // 6-point polygon forming a soft downward bow
          document.documentElement.animate(
            [
              {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 50% 0%, 0% 0%)',
                opacity: 0.95
              },
              {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 120%, 50% 145%, 0% 120%)',
                opacity: 1
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.25, 1, 0.35, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (type === 'diagonal_silk') {
          // Soft diagonal silk wave sweeping from top-right to bottom-left with a gentle curved profile
          // Origin starts along the top and right edges, flows diagonally across the viewport
          document.documentElement.animate(
            [
              {
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)',
                opacity: 0.95
              },
              {
                clipPath: 'polygon(100% 0%, -30% 0%, -50% 50%, 0% 150%, 100% 150%)',
                opacity: 1
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.25, 1, 0.35, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (type === 'dual_focus_ellipse') {
          // Dual-Focus Atmospheric Wave:
          // Starts from button (x, y) with a wide cinematic oval (width = 1.8 * height),
          // with a gentle ease-in-out that stays visible across the whole page
          const rect = btn.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          const maxDist = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));

          document.documentElement.animate(
            [
              {
                clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
                filter: nextTheme === 'light' ? 'brightness(1.08)' : 'brightness(0.95)'
              },
              {
                clipPath: 'ellipse(' + (maxDist * 1.6) + 'px ' + (maxDist * 1.1) + 'px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1)'
              }
            ],
            {
              duration: duration,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // standard smooth ease-in-out (no rushed start!)
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

server.listen(3945, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3945");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test 1: organic_curtain
  console.log("Testing Organic Curtain...");
  await page.evaluate(() => window.runWipe('organic_curtain', 900));
  await page.waitForTimeout(300); // 33%
  await page.screenshot({ path: path.join(outDir, "wipe_organic_33pct.png") });
  await page.waitForTimeout(300); // 66%
  await page.screenshot({ path: path.join(outDir, "wipe_organic_66pct.png") });
  await page.waitForTimeout(500);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 2: diagonal_silk
  console.log("Testing Diagonal Silk...");
  await page.evaluate(() => window.runWipe('diagonal_silk', 900));
  await page.waitForTimeout(300); // 33%
  await page.screenshot({ path: path.join(outDir, "wipe_silk_33pct.png") });
  await page.waitForTimeout(300); // 66%
  await page.screenshot({ path: path.join(outDir, "wipe_silk_66pct.png") });
  await page.waitForTimeout(500);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 3: dual_focus_ellipse with standard ease-in-out (0.4, 0, 0.2, 1)
  console.log("Testing Dual Focus Ellipse with Ease-In-Out...");
  await page.evaluate(() => window.runWipe('dual_focus_ellipse', 900));
  await page.waitForTimeout(300); // 33%
  await page.screenshot({ path: path.join(outDir, "wipe_ellipse_33pct.png") });
  await page.waitForTimeout(300); // 66%
  await page.screenshot({ path: path.join(outDir, "wipe_ellipse_66pct.png") });

  await browser.close();
  server.close();
  console.log("All wipe tests done!");
});
