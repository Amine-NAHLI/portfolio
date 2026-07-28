import assert from "node:assert/strict";
import test from "node:test";
import { createContactNotificationHtml } from "../src/features/contact/email-template.ts";

test("contact notification email escapes visitor content and includes contact metadata", () => {
  const html = createContactNotificationHtml({
    id: "contact-123",
    createdAt: "2026-07-22T10:30:00.000Z",
    name: "Amina <script>",
    email: "amina@example.com",
    subject: "Hello & welcome",
    message: "Line one\n<img src=x onerror=alert(1)>",
    locale: "fr",
  });

  assert.match(html, /Amina &lt;script&gt;/);
  assert.match(html, /Hello &amp; welcome/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /amina@example.com/);
  assert.match(html, /Français/);
  assert.match(html, /contact-123/);
});
