import assert from "node:assert/strict";

const baseUrl = new URL(process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000");
const pending = ["/fr", "/en"];
const visited = new Set();
const ignoredPrefixes = ["/_next/", "/api/", "/admin/"];

while (pending.length > 0) {
  const path = pending.shift();
  if (!path || visited.has(path)) continue;
  visited.add(path);
  assert.ok(visited.size <= 150, "Internal link crawl exceeded its safety budget");

  const response = await fetch(new URL(path, baseUrl), { redirect: "follow" });
  assert.ok(response.ok, `${path} returned ${response.status}`);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) continue;
  const html = await response.text();

  for (const match of html.matchAll(/href=(?:"([^"]+)"|'([^']+)')/g)) {
    const href = match[1] ?? match[2];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;

    let url;
    try {
      url = new URL(href, baseUrl);
    } catch {
      throw new Error(`Invalid link ${href} found on ${path}`);
    }

    if (url.origin !== baseUrl.origin) continue;
    const normalized = `${url.pathname}${url.search}`;
    if (ignoredPrefixes.some((prefix) => url.pathname.startsWith(prefix))) continue;
    if (!visited.has(normalized) && !pending.includes(normalized)) pending.push(normalized);
  }
}

process.stdout.write(`Internal link check passed (${visited.size} URLs).\n`);
