import { chromium } from "playwright";
import http from "http";
import path from "path";

const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <style>
    :root { --bg: #0B0B0C; --text: #fff; --card: #121316; --accent: #C8F122; }
    [data-theme="light"] { --bg: #F4F6F8; --text: #0D1520; --card: #FFFFFF; --accent: #0066FF; }
    body { background: var(--bg); color: var(--text); height: 100vh; margin:0; display:flex; align-items:center; justify-content:center; }
    ::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
    ::view-transition-old(root) { z-index: 1; }
    ::view-transition-new(root) { z-index: 9999; }
    .card { background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2.5rem; width: 620px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    h1 { margin-bottom: 0.5rem; font-size: 2rem; }
    p { opacity: 0.8; line-height: 1.6; }
    .tag { color: var(--accent); font-weight: bold; font-family: monospace; letter-spacing: 0.1em; margin-bottom: 0.75rem; display: inline-block; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">CYBERNETIC_APERTURE_V3</div>
    <h1>Adaptive Security Matrix</h1>
    <p>Testing the 2-phase anamorphic laser diamond: horizontal slit expansion into high-precision diagonal aperture sweep.</p>
  </div>
  <button id="btn" style="position:fixed; top:24px; right:32px; padding:8px 18px; border-radius:9999px; background:rgba(255,255,255,0.06); color:var(--text); border:1px solid rgba(255,255,255,0.15); font-weight:600;">Theme Toggle</button>
  <script>
    window.testCyberAperture = function() {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const next = isDark ? 'light' : 'dark';
      const x = window.innerWidth - 65;
      const y = 35;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const dMax = endRadius * 1.5;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = next;
      });

      vt.ready.then(() => {
        document.documentElement.animate(
          [
            {
              clipPath: 'polygon(' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px, ' + x + 'px ' + y + 'px)',
              filter: next === 'light' ? 'brightness(1.2) contrast(1.05)' : 'brightness(0.9) contrast(1.08)',
              offset: 0
            },
            {
              clipPath: 'polygon(' + (x - 450) + 'px ' + y + 'px, ' + x + 'px ' + (y - 12) + 'px, ' + (x + 200) + 'px ' + y + 'px, ' + x + 'px ' + (y + 12) + 'px)',
              filter: next === 'light' ? 'brightness(1.12)' : 'brightness(0.95)',
              offset: 0.22
            },
            {
              clipPath: 'polygon(' + (x - dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y - dMax) + 'px, ' + (x + dMax) + 'px ' + y + 'px, ' + x + 'px ' + (y + dMax) + 'px)',
              filter: 'brightness(1) contrast(1)',
              offset: 1
            }
          ],
          {
            duration: 640,
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

server.listen(3928, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3928");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  console.log("Triggering Cyber Aperture...");
  await page.evaluate(() => window.testCyberAperture());

  // Capture at 70ms (slit phase)
  await page.waitForTimeout(70);
  await page.screenshot({ path: path.join(outDir, "cyber_aperture_phase1_slit.png") });

  // Capture at 180ms (diagonal expansion)
  await page.waitForTimeout(110);
  await page.screenshot({ path: path.join(outDir, "cyber_aperture_phase2_diagonal.png") });

  // Capture at 360ms (wide sweep)
  await page.waitForTimeout(180);
  await page.screenshot({ path: path.join(outDir, "cyber_aperture_phase3_sweep.png") });

  // Settled
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "cyber_aperture_settled.png") });

  await browser.close();
  server.close();
  console.log("Done cyber aperture test!");
});
