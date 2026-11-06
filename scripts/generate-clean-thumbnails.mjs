import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function generatePerfectThumbnails() {
  const outputDir = path.resolve('public/images/certifications');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const { data: certs } = await supabase
    .from('certifications')
    .select('id, name_fr, issuer, document_media_id');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";</script>
    <style>body { margin: 0; background: transparent; }</style>
  </head>
  <body>
    <canvas id="pdf-canvas"></canvas>
    <canvas id="crop-canvas"></canvas>
    <script>
      async function renderAndCrop(b64) {
        const raw = atob(b64);
        const uint8 = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) uint8[i] = raw.charCodeAt(i);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
        const p = await pdf.getPage(1);
        const viewport = p.getViewport({ scale: 2.5 }); // High resolution (2.5x)
        
        const srcCanvas = document.getElementById('pdf-canvas');
        srcCanvas.width = viewport.width;
        srcCanvas.height = viewport.height;
        const ctx = srcCanvas.getContext('2d');
        await p.render({ canvasContext: ctx, viewport }).promise;

        const w = srcCanvas.width;
        const h = srcCanvas.height;
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Auto-detect the true certificate content bounds by scanning from all 4 sides
        let minX = w, maxX = 0, minY = h, maxY = 0;

        // Scan columns from right to left to detect where the content actually ends (skipping blank white margin)
        let foundRight = false;
        for (let x = w - 1; x >= 0; x--) {
          for (let y = 0; y < h; y++) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
            // If pixel is colored or non-pure-white (background of openhtmltopdf blank space is #FFFFFF)
            if (a > 10 && (r < 248 || g < 248 || b < 248)) {
              maxX = x;
              foundRight = true;
              break;
            }
          }
          if (foundRight) break;
        }

        // Scan columns from left to right
        let foundLeft = false;
        for (let x = 0; x < w; x++) {
          for (let y = 0; y < h; y++) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
            if (a > 10 && (r < 248 || g < 248 || b < 248)) {
              minX = x;
              foundLeft = true;
              break;
            }
          }
          if (foundLeft) break;
        }

        // Scan rows from bottom to top
        let foundBottom = false;
        for (let y = h - 1; y >= 0; y--) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
            if (a > 10 && (r < 248 || g < 248 || b < 248)) {
              maxY = y;
              foundBottom = true;
              break;
            }
          }
          if (foundBottom) break;
        }

        // Scan rows from top to bottom
        let foundTop = false;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
            if (a > 10 && (r < 248 || g < 248 || b < 248)) {
              minY = y;
              foundTop = true;
              break;
            }
          }
          if (foundTop) break;
        }

        // If scanning found valid bounds
        if (minX < maxX && minY < maxY) {
          // If minX is 0, give it a tiny border, otherwise use detected
          // Ensure we don't cut off border strokes: add a small padding if near edge
          const cropX = Math.max(0, minX);
          const cropY = Math.max(0, minY);
          // If the right edge is near maxX, clamp to maxX
          const cropW = Math.min(w - cropX, (maxX - cropX) + 1);
          const cropH = Math.min(h - cropY, (maxY - cropY) + 1);

          const cropCanvas = document.getElementById('crop-canvas');
          cropCanvas.width = cropW;
          cropCanvas.height = cropH;
          const cropCtx = cropCanvas.getContext('2d');
          cropCtx.drawImage(srcCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

          return {
            original: { w, h },
            crop: { x: cropX, y: cropY, w: cropW, h: cropH },
            usedCropped: true
          };
        }

        return { original: { w, h }, usedCropped: false };
      }
    </script>
  </body>
  </html>
  `;

  await page.setContent(html);

  for (const cert of certs) {
    if (!cert.document_media_id) continue;

    const { data: media } = await supabase
      .from('media_assets')
      .select('bucket_id, storage_path')
      .eq('id', cert.document_media_id)
      .single();

    if (!media || !media.storage_path) continue;

    console.log(`Processing ${cert.name_fr} (${cert.issuer})...`);
    const { data: blob } = await supabase.storage.from(media.bucket_id).download(media.storage_path);
    const b64 = Buffer.from(await blob.arrayBuffer()).toString('base64');

    const result = await page.evaluate((b) => window.renderAndCrop(b), b64);
    console.log('Result for', cert.name_fr, ':', result);

    const canvasSelector = result.usedCropped ? '#crop-canvas' : '#pdf-canvas';
    const canvasEl = await page.$(canvasSelector);
    const outputPath = path.join(outputDir, `${cert.id}.png`);
    await canvasEl.screenshot({ path: outputPath });
    console.log(`Saved clean cropped image to ${outputPath}`);
  }

  await browser.close();
  console.log("All thumbnails regenerated with clean cropping!");
}

generatePerfectThumbnails().catch(console.error);

