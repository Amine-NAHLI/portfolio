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
    <div class="tag">ANAMORPHIC_HORIZON_SHUTTER</div>
    <h1>Quantum Architecture Portfolio</h1>
    <p>Calibrating the exact millisecond frames of the Anamorphic Horizon Laser & Wavefront.</p>
  </div>
  <button id="btn" style="position:fixed; top:24px; right:32px; padding:8px 18px; border-radius:9999px; background:rgba(255,255,255,0.06); color:var(--text); border:1px solid rgba(255,255,255,0.15); font-weight:600;">Theme Toggle</button>
  <script>
    window.testAnamorphicShutter = function() {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const next = isDark ? 'light' : 'dark';
      const x = window.innerWidth - 65;
      const y = 35;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const horizontalSpan = Math.max(window.innerWidth, window.innerHeight) * 1.45;

      const vt = document.startViewTransition(() => {
        document.documentElement.dataset.theme = next;
      });

      vt.ready.then(() => {
        document.documentElement.animate(
          [
            {
              clipPath: 'ellipse(0px 0px at ' + x + 'px ' + y + 'px)',
              filter: next === 'light' ? 'brightness(1.18) contrast(1.04)' : 'brightness(0.92) contrast(1.08)',
              offset: 0
            },
            {
              clipPath: 'ellipse(' + horizontalSpan + 'px 3px at ' + x + 'px ' + y + 'px)',
              filter: next === 'light' ? 'brightness(1.12) contrast(1.02)' : 'brightness(0.96) contrast(1.04)',
              offset: 0.26
            },
            {
              clipPath: 'ellipse(' + horizontalSpan + 'px ' + (endRadius * 1.1) + 'px at ' + x + 'px ' + y + 'px)',
              filter: 'brightness(1) contrast(1)',
              offset: 1
            }
          ],
          {
            duration: 620,
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

server.listen(3929, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3929");

  const outDir = "C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db";

  console.log("Triggering Anamorphic Horizon Shutter...");
  await page.evaluate(() => window.testAnamorphicShutter());

  // Frame 1: Laser slit
  await page.waitForTimeout(65);
  await page.screenshot({ path: path.join(outDir, "anamorphic_precise_f1_slit.png") });

  // Frame 2: Opening
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(outDir, "anamorphic_precise_f2_opening.png") });

  // Frame 3: Sweeping
  await page.waitForTimeout(160);
  await page.screenshot({ path: path.join(outDir, "anamorphic_precise_f3_sweep.png") });

  // Frame 4: Settling
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "anamorphic_precise_f4_settled.png") });

  await browser.close();
  server.close();
  console.log("Recorded precise frames!");
});
