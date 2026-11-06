import { chromium } from '@playwright/test';
import fs from 'fs';

async function generateReviewHtml() {
  const files = [
    { id: '29b7fc77-9a20-4444-af1e-44999a17eb1a', name: 'DataCamp - AI Engineer' },
    { id: 'ed8656b3-819c-4b93-94cd-45a3d969b950', name: 'TryHackMe - Pre-Security' },
    { id: '50e20238-2d46-4dc4-8960-71529158dd5e', name: 'LinkedIn - n8n' },
    { id: 'a1de30b1-31d6-4780-8f6a-aaaf38312d6d', name: 'Cisco - Python Essentials' },
    { id: '1719b1e1-37ad-4022-89c5-54a5f88471fb', name: 'LinkedIn - Cyber Fondements' },
    { id: '1c967ebf-d5db-488f-8fef-9e6252d140a1', name: 'LinkedIn - Cyber Organisations' }
  ];

  let cardsHtml = '';
  for (const f of files) {
    const b64 = fs.readFileSync('public/images/certifications/' + f.id + '.png').toString('base64');
    cardsHtml += `
      <div style="background: #17161e; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 16px; margin: 16px; width: 450px;">
        <h3 style="color: #fff; font-family: sans-serif; font-size: 14px; margin-top: 0;">${f.name}</h3>
        <div style="width: 100%; height: 260px; background: #060605; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); padding: 8px;">
          <img src="data:image/png;base64,${b64}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;" />
        </div>
      </div>
    `;
  }

  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #0b0510; display: flex; flex-wrap: wrap; justify-content: center; padding: 20px; }</style></head>
    <body>${cardsHtml}</body>
    </html>
  `;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
  await page.setContent(fullHtml);
  await page.screenshot({ path: 'C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db/all_certs_review.png' });
  await browser.close();
  console.log('Saved all_certs_review.png to artifacts!');
}
generateReviewHtml().catch(console.error);
