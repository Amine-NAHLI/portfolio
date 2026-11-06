import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  const { data: certs } = await supabase.from('certifications').select('id, name_fr, issuer, document_media_id');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";</script>
  </head>
  <body>
    <script>
      async function getInfo(b64) {
        const raw = atob(b64);
        const uint8 = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) uint8[i] = raw.charCodeAt(i);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
        const p = await pdf.getPage(1);
        const view = p.view;
        const viewport = p.getViewport({ scale: 1 });
        return {
          view,
          viewport: { width: viewport.width, height: viewport.height },
          rotation: p.rotate
        };
      }
    </script>
  </body>
  </html>
  `;
  await page.setContent(html);
  
  for (const c of certs) {
    if (!c.document_media_id) continue;
    const { data: m } = await supabase.from('media_assets').select('bucket_id, storage_path').eq('id', c.document_media_id).single();
    const { data: blob } = await supabase.storage.from(m.bucket_id).download(m.storage_path);
    const b64 = Buffer.from(await blob.arrayBuffer()).toString('base64');
    const info = await page.evaluate((b) => window.getInfo(b), b64);
    console.log(`${c.name_fr} (${c.issuer}):`, JSON.stringify(info));
  }
  await browser.close();
}
inspect();

