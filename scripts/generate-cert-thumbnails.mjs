import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const outputDir = path.resolve('public/images/certifications');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const { data: certs, error } = await supabase
    .from('certifications')
    .select('id, name_fr, issuer, document_media_id');

  if (error || !certs) {
    console.error("Failed to query certifications:", error);
    process.exit(1);
  }

  console.log(`Found ${certs.length} certifications.`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";</script>
    <style>body { margin: 0; background: transparent; display: flex; justify-content: center; align-items: center; }</style>
  </head>
  <body>
    <canvas id="pdf-canvas"></canvas>
    <script>
      async function renderPdf(b64, isLinkedIn) {
        const raw = atob(b64);
        const uint8 = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) uint8[i] = raw.charCodeAt(i);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.getElementById('pdf-canvas');
        
        if (isLinkedIn) {
          // Clean 4:3 crop to remove the 218px blank bleed margin produced by openhtmltopdf
          canvas.width = 1800;
          canvas.height = 1350;
        } else {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
        }
        
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        return { width: canvas.width, height: canvas.height };
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
      .select('bucket_id, storage_path, mime_type')
      .eq('id', cert.document_media_id)
      .maybeSingle();

    if (!media || !media.storage_path) continue;

    console.log(`Downloading document for ${cert.name_fr} (${cert.issuer})...`);
    const { data: blob, error: downloadError } = await supabase.storage
      .from(media.bucket_id)
      .download(media.storage_path);

    if (downloadError || !blob) continue;

    const base64Pdf = Buffer.from(await blob.arrayBuffer()).toString('base64');
    const isLinkedIn = cert.issuer?.toLowerCase().includes('linkedin');

    try {
      const dims = await page.evaluate(({ b64, isLinkedIn }) => window.renderPdf(b64, isLinkedIn), { b64: base64Pdf, isLinkedIn });
      console.log(`Rendered ${cert.name_fr} on canvas:`, dims);

      const canvasEl = await page.$('#pdf-canvas');
      const outputPath = path.join(outputDir, `${cert.id}.png`);
      await canvasEl.screenshot({ path: outputPath });
      console.log(`Saved thumbnail: ${outputPath}`);
    } catch (renderError) {
      console.error(`Failed to render PDF for ${cert.name_fr}:`, renderError);
    }
  }

  await browser.close();
  console.log("All certification thumbnails generated successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
