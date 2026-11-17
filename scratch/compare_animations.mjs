import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Theme Transition Showcase</title>
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
      overflow-x: hidden;
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
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 650px;
      width: 100%;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
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
    <div style="font-weight: 700; letter-spacing: 0.05em;">AMINE NAHLI // PORTFOLIO</div>
    <button class="btn" id="theme-btn" style="position: absolute; right: 2rem; top: 14px;">
      <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:var(--accent);"></span>
      <span id="theme-label">Switch Theme</span>
    </button>
  </div>

  <div class="card">
    <div class="accent-tag">Cybersecurity & AI Architecture</div>
    <h1>Adaptive Defense Matrix</h1>
    <p>Exploring high-precision geometric theme transitions: Angular Cyber-Visor, Octagonal Shutter, and Multi-Phase Wavefront.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');
    const label = document.getElementById('theme-label');

    window.triggerTransition = function(mode) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';

      const updateDom = () => {
        document.documentElement.dataset.theme = nextTheme;
        label.textContent = nextTheme === 'light' ? 'Mode: Light' : 'Mode: Dark';
      };

      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const maxDim = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const vt = document.startViewTransition(updateDom);

      vt.ready.then(() => {
        if (mode === 'cyber_blade') {
          // Dynamic angular visor cut: sweeps with a sleek high-tech bevel
          // 4 vertices starting collapsed at (x, y)
          // Spreads with asymmetric velocity: fast diagonal sweep then expands full frame
          const d = maxDim * 2.2;
          document.documentElement.animate(
            [
              {
                clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1.15)',
                offset: 0
              },
              {
                clipPath: 'polygon(' + (x - 220) + 'px ' + (y - 30) + 'px, ' + (x + 80) + 'px ' + (y - 120) + 'px, ' + (x + 220) + 'px ' + (y + 160) + 'px, ' + (x - 80) + 'px ' + (y + 80) + 'px)',
                filter: 'brightness(1.08)',
                offset: 0.25
              },
              {
                clipPath: 'polygon(' + (x - d) + 'px ' + (y - d*0.5) + 'px, ' + (x + d*0.5) + 'px ' + (y - d) + 'px, ' + (x + d) + 'px ' + (y + d*0.5) + 'px, ' + (x - d*0.5) + 'px ' + (y + d) + 'px)',
                filter: 'brightness(1)',
                offset: 1
              }
            ],
            {
              duration: 520,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (mode === 'octagonal_iris') {
          // 8-vertex cyber aperture / iris:
          // Keyframe 0: collapsed at (x, y)
          // Keyframe 25%: High-speed diamond/octagon aperture opening
          // Keyframe 100%: Expands smoothly beyond all viewport boundaries
          const r1 = 120;
          const r2 = maxDim * 1.5;
          const k0 = 'polygon(' +
            x + 'px ' + y + 'px, ' +
            x + 'px ' + y + 'px, ' +
            x + 'px ' + y + 'px, ' +
            x + 'px ' + y + 'px, ' +
            x + 'px ' + y + 'px, ' +
            x + 'px ' + y + 'px, ' +
            x + 'px ' + y + 'px, ' +
            x + 'px ' + y + 'px)';

          const k1 = 'polygon(' +
            (x - r1*1.4) + 'px ' + (y - r1*0.2) + 'px, ' +
            (x - r1*0.6) + 'px ' + (y - r1*0.9) + 'px, ' +
            (x + r1*0.6) + 'px ' + (y - r1*0.9) + 'px, ' +
            (x + r1*1.4) + 'px ' + (y - r1*0.2) + 'px, ' +
            (x + r1*1.4) + 'px ' + (y + r1*0.2) + 'px, ' +
            (x + r1*0.6) + 'px ' + (y + r1*0.9) + 'px, ' +
            (x - r1*0.6) + 'px ' + (y + r1*0.9) + 'px, ' +
            (x - r1*1.4) + 'px ' + (y + r1*0.2) + 'px)';

          const k2 = 'polygon(' +
            (x - r2*1.3) + 'px ' + (y - r2*0.5) + 'px, ' +
            (x - r2*0.5) + 'px ' + (y - r2*1.3) + 'px, ' +
            (x + r2*0.5) + 'px ' + (y - r2*1.3) + 'px, ' +
            (x + r2*1.3) + 'px ' + (y - r2*0.5) + 'px, ' +
            (x + r2*1.3) + 'px ' + (y + r2*0.5) + 'px, ' +
            (x + r2*0.5) + 'px ' + (y + r2*1.3) + 'px, ' +
            (x - r2*0.5) + 'px ' + (y + r2*1.3) + 'px, ' +
            (x - r2*1.3) + 'px ' + (y + r2*0.5) + 'px)';

          document.documentElement.animate(
            [
              { clipPath: k0, filter: 'brightness(1.2)', offset: 0 },
              { clipPath: k1, filter: 'brightness(1.1)', offset: 0.28 },
              { clipPath: k2, filter: 'brightness(1)', offset: 1 }
            ],
            {
              duration: 540,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (mode === 'anamorphic_wave') {
          // High-tech Anamorphic Horizon Wave:
          // A sweeping horizontal beam that fans out with an organic, calm easing curve
          const w = Math.max(window.innerWidth, window.innerHeight) * 1.5;
          document.documentElement.animate(
            [
              {
                clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1.22)',
                offset: 0
              },
              {
                clipPath: 'ellipse(' + w + 'px 4px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1.12)',
                offset: 0.26
              },
              {
                clipPath: 'ellipse(' + w + 'px ' + maxDim * 1.15 + 'px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1)',
                offset: 1
              }
            ],
            {
              duration: 540,
              easing: 'cubic-bezier(0.2, 0.9, 0.25, 1)',
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

server.listen(3922, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3922");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Test 1: Octagonal Iris
  console.log("Evaluating Octagonal Iris...");
  await page.evaluate(() => window.triggerTransition('octagonal_iris'));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outDir, "theme_octagonal_mid.png") });
  await page.waitForTimeout(500);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 2: Anamorphic Horizon Wave
  console.log("Evaluating Anamorphic Horizon Wave...");
  await page.evaluate(() => window.triggerTransition('anamorphic_wave'));
  await page.waitForTimeout(90);
  await page.screenshot({ path: path.join(outDir, "theme_anamorphic_laser_beam.png") });
  await page.waitForTimeout(90);
  await page.screenshot({ path: path.join(outDir, "theme_anamorphic_blossom.png") });
  await page.waitForTimeout(400);

  // Reset to dark
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(100);

  // Test 3: Cyber Blade
  console.log("Evaluating Cyber Blade...");
  await page.evaluate(() => window.triggerTransition('cyber_blade'));
  await page.waitForTimeout(110);
  await page.screenshot({ path: path.join(outDir, "theme_cyberblade_mid.png") });

  await browser.close();
  server.close();
  console.log("Done evaluations!");
});
