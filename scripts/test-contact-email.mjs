import { readFileSync, existsSync } from 'node:fs';

// Parse .env.local manually if running without --env-file
if (existsSync('.env.local')) {
  const content = readFileSync('.env.local', 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const targetEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'nahli-ami@upf.ac.ma';
console.log('Testing contact mailer pipeline...');
console.log('Target recipient:', targetEmail);
console.log('RESEND_API_KEY present:', Boolean(process.env.RESEND_API_KEY));
console.log('BREVO_API_KEY present:', Boolean(process.env.BREVO_API_KEY));
console.log('WEB3FORMS_ACCESS_KEY present:', Boolean(process.env.WEB3FORMS_ACCESS_KEY));
console.log('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY present:', Boolean(process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY));

async function run() {
  if (process.env.RESEND_API_KEY) {
    console.log('\n--- Testing Resend ---');
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || 'Portfolio Amine Nahli <onboarding@resend.dev>',
          to: [targetEmail],
          subject: '[Portfolio Test] Diagnostic Notification',
          html: '<p>Ceci est un test de notification du portfolio d\'Amine Nahli.</p>',
        }),
      });
      const data = await res.json().catch(() => null);
      console.log('Resend HTTP Status:', res.status);
      console.log('Resend Response:', data);
    } catch (err) {
      console.error('Resend Network Error:', err.message);
    }
  }

  const web3Key = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (web3Key) {
    console.log('\n--- Testing Web3Forms ---');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3Key,
          subject: '[Portfolio Test] Diagnostic Web3Forms',
          name: 'Amine Nahli Test',
          email: targetEmail,
          message: 'Ceci est un test diagnostic Web3Forms.',
        }),
      });
      const data = await res.json().catch(() => null);
      console.log('Web3Forms HTTP Status:', res.status);
      console.log('Web3Forms Response:', data);
    } catch (err) {
      console.error('Web3Forms Network Error:', err.message);
    }
  }
}

run();
