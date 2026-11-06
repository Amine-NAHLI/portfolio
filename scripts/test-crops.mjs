import { chromium } from '@playwright/test';
import fs from 'fs';

async function testCrops() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  const b64 = fs.readFileSync('public/images/certifications/50e20238-2d46-4dc4-8960-71529158dd5e.png').toString('base64');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #0b0510; color: #fff; font-family: sans-serif; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 30px; }
        .row { display: flex; gap: 20px; justify-content: center; }
        .box { background: #17161e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px; width: 450px; }
        .preview { width: 100%; height: 280px; background: #0e0d14; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 12px; }
      </style>
    </head>
    <body>
      <h2>Comparaison des solutions de cadrage</h2>
      <div class="row">
        <!-- Option 1: Clean White Diploma Card with Framed Shadow -->
        <div class="box">
          <h3>Option 1 : Diplôme Blanc Épuré avec Ombre Réaliste</h3>
          <div class="preview" style="background: radial-gradient(circle at center, #1e162a 0%, #0d0a14 100%);">
            <div style="background: #ffffff; border-radius: 10px; padding: 4px; box-shadow: 0 12px 30px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); max-height: 90%; max-width: 90%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
              <img id="img1" src="data:image/png;base64,${b64}" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 6px;" />
            </div>
          </div>
        </div>

        <!-- Option 2: Symmetrical Framed Diploma -->
        <div class="box">
          <h3>Option 2 : Cadre Certificat avec Passe-partout</h3>
          <div class="preview" style="background: #120e1e;">
            <div style="background: #17161e; border: 2px solid rgba(154,113,255,0.3); border-radius: 12px; padding: 10px; box-shadow: 0 15px 35px rgba(0,0,0,0.7); max-height: 92%; max-width: 92%; display: flex; align-items: center; justify-content: center;">
              <img id="img2" src="data:image/png;base64,${b64}" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);" />
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: 'C:/Users/nahli/.gemini/antigravity/brain/67182755-f717-4daf-b450-2d03ecacd8db/crop_options_comparison.png' });
  await browser.close();
  console.log('Saved crop_options_comparison.png!');
}
testCrops();
