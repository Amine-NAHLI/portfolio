import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

// A self-contained test server to evaluate different clip-path and transition animations
const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Theme Transition Test</title>
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
      gap: 2rem;
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
      background: transparent;
      color: var(--text);
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn:hover {
      border-color: var(--accent);
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 600px;
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
      <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:var(--accent);"></span>
      <span id="theme-label">Switch Theme</span>
    </button>
  </div>

  <div class="card">
    <div class="accent-tag">Cybersecurity & AI Engineering</div>
    <h1>High-Performance Security Architecture</h1>
    <p>Testing the custom theme switch transition: evaluating laser scanlines, anamorphic aperture opening, and dynamic multi-phase polygon wavefront.</p>
  </div>

  <script>
    const btn = document.getElementById('theme-btn');
    const label = document.getElementById('theme-label');

    // Test transition function
    window.runTransition = function(type) {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';

      const updateDom = () => {
        document.documentElement.dataset.theme = nextTheme;
        label.textContent = nextTheme === 'light' ? 'Mode: Light' : 'Mode: Dark';
      };

      if (!document.startViewTransition) {
        updateDom();
        return;
      }

      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const vt = document.startViewTransition(updateDom);

      vt.ready.then(() => {
        if (type === 'circle') {
          // Classic standard circle
          document.documentElement.animate(
            {
              clipPath: [
                'circle(0px at ' + x + 'px ' + y + 'px)',
                'circle(' + endRadius + 'px at ' + x + 'px ' + y + 'px)'
              ]
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (type === 'anamorphic') {
          // 2-Phase Anamorphic Laser Horizon:
          // Keyframe 0: Pinpoint at (x, y)
          // Keyframe 32%: Razor-sharp laser slit cuts horizontally across entire screen width
          // Keyframe 100%: Slit smoothly expands vertically like a wide anamorphic film aperture
          const maxDim = Math.max(window.innerWidth, window.innerHeight) * 1.35;
          document.documentElement.animate(
            [
              {
                clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1.2) contrast(1.08)',
                offset: 0
              },
              {
                clipPath: 'ellipse(' + maxDim + 'px 2.5px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1.15) contrast(1.05)',
                offset: 0.30
              },
              {
                clipPath: 'ellipse(' + maxDim + 'px ' + endRadius * 1.05 + 'px at ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1) contrast(1)',
                offset: 1
              }
            ],
            {
              duration: 580,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        } else if (type === 'diamond_iris') {
          // Cyber Diamond Aperture:
          // Expands as a rotated 4-vertex diamond/rhombus then blooms to cover all corners
          const dMax = endRadius * 1.5;
          document.documentElement.animate(
            [
              {
                clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
                filter: 'brightness(1.25)',
                offset: 0
              },
              {
                clipPath: 'polygon(' + (x - 180) + 'px ' + y + 'px, ' + x + 'px ' + (y - 35) + 'px, ' + (x + 180) + 'px ' + y + 'px, ' + x + 'px ' + (y + 35) + 'px)',
                filter: 'brightness(1.15)',
                offset: 0.28
              },
              {
                clipPath: 'polygon(' + (x - dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y - dMax) + 'px, ' + (x + dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y + dMax) + 'px)',
                filter: 'brightness(1)',
                offset: 1
              }
            ],
            {
              duration: 580,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        }
      });
    };

    btn.addEventListener('click', () => {
      window.runTransition('anamorphic');
    });
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3921, async () => {
  console.log("Server listening on 3921");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto("http://localhost:3921");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  // Capture Anamorphic stages
  console.log("Testing Anamorphic Shutter...");
  // Trigger anamorphic and take screenshots at different delays
  await page.evaluate(() => window.runTransition('anamorphic'));
  await page.waitForTimeout(60); // In the laser slit phase
  await page.screenshot({ path: path.join(outDir, "theme_anamorphic_stage1_slit.png") });

  await page.waitForTimeout(140); // Expanding vertically
  await page.screenshot({ path: path.join(outDir, "theme_anamorphic_stage2_expansion.png") });

  await page.waitForTimeout(400); // Fully settled
  await page.screenshot({ path: path.join(outDir, "theme_anamorphic_stage3_settled.png") });

  // Reset to dark
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
  });
  await page.waitForTimeout(100);

  // Testing Diamond Iris
  console.log("Testing Diamond Iris...");
  await page.evaluate(() => window.runTransition('diamond_iris'));
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(outDir, "theme_diamond_stage1.png") });

  await page.waitForTimeout(140);
  await page.screenshot({ path: path.join(outDir, "theme_diamond_stage2.png") });

  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "theme_diamond_settled.png") });

  await browser.close();
  server.close();
  console.log("Screenshots captured successfully!");
});
