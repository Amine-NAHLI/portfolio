import assert from "node:assert/strict";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";

await waitForServer();

for (const path of ["/", "/fr", "/en", "/fr/projects", "/en/projects", "/fr/search", "/en/contact", "/fr/blog", "/robots.txt", "/sitemap.xml", "/cv"]) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  if (path === "/") {
    if ([301, 302, 307, 308].includes(response.status)) assert.match(response.headers.get("location") ?? "", /\/fr$/);
    else {
      assert.equal(response.status, 200);
      assert.match(await response.text(), /(?:NEXT_REDIRECT|refresh)[\s\S]*?\/fr/);
    }
  }
  else assert.equal(response.status, 200, `${path} should respond with 200`);
}

const frenchResponse = await fetch(`${baseUrl}/fr`);
assert.match(frenchResponse.headers.get("content-security-policy") ?? "", /default-src 'self'/);
assert.equal(frenchResponse.headers.get("x-content-type-options"), "nosniff");
assert.equal(frenchResponse.headers.get("x-frame-options"), "DENY");

const rememberedLocale = await fetch(`${baseUrl}/`, { headers: { Cookie: "portfolio-locale=en" }, redirect: "manual" });
assert.match(rememberedLocale.headers.get("location") ?? "", /\/en$/);

const englishHtml = await (await fetch(`${baseUrl}/en`)).text();
assert.match(englishHtml, /lang="en"/);
assert.match(englishHtml, /href="\/fr"/);

const adminResponse = await fetch(`${baseUrl}/admin/dashboard`, { redirect: "manual" });
if ([301, 302, 303, 307, 308].includes(adminResponse.status)) assert.match(adminResponse.headers.get("location") ?? "", /\/admin\/login$/);
else {
  assert.equal(adminResponse.status, 200);
  assert.match(await adminResponse.text(), /NEXT_REDIRECT[\s\S]*?\/admin\/login/);
}

const crossOriginContact = await fetch(`${baseUrl}/api/contact`, {
  method: "POST",
  headers: { Origin: "https://attacker.example", "Content-Type": "application/json" },
  body: "{}",
});
assert.equal(crossOriginContact.status, 403, "cross-origin contact mutation should be refused");

const cvResponse = await fetch(`${baseUrl}/cv`);
assert.match(cvResponse.headers.get("content-type") ?? "", /^text\/html/);
assert.match(cvResponse.headers.get("content-security-policy") ?? "", /script-src 'none'/);

process.stdout.write("Smoke tests passed: public routes, i18n, security headers, admin guard, CSRF and CV.\n");

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) return;
    } catch {
      // The production server may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server did not become ready at ${baseUrl}`);
}
