import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NextRequest } from "next/server.js";
import { acceptsJsonBody, acceptsSameOriginMutation, readJsonObject } from "../src/lib/security/request.ts";

function jsonRequest(body: string, headers: Record<string, string> = {}) {
  return new NextRequest("https://portfolio.test/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      origin: "https://portfolio.test",
      "sec-fetch-site": "same-origin",
      ...headers,
    },
    body,
  });
}

describe("request mutation guards", () => {
  it("accepts a same-origin JSON object without relying on Content-Length", async () => {
    const request = jsonRequest('{"name":"Amine"}');
    assert.equal(acceptsSameOriginMutation(request), true);
    assert.equal(acceptsJsonBody(request), true);
    assert.deepEqual(await readJsonObject(request), { name: "Amine" });
  });

  it("rejects foreign and missing origins", () => {
    assert.equal(acceptsSameOriginMutation(jsonRequest("{}", { origin: "https://attacker.test" })), false);
    assert.equal(acceptsSameOriginMutation(jsonRequest("{}", { origin: "" })), false);
  });

  it("rejects non-JSON and invalid declared lengths", () => {
    assert.equal(acceptsJsonBody(jsonRequest("{}", { "content-type": "text/plain" })), false);
    assert.equal(acceptsJsonBody(jsonRequest("{}", { "content-length": "not-a-number" })), false);
    assert.equal(acceptsJsonBody(jsonRequest("{}", { "content-length": "999999" })), false);
  });

  it("rejects malformed, scalar and oversized streamed JSON", async () => {
    assert.equal(await readJsonObject(jsonRequest("{")), null);
    assert.equal(await readJsonObject(jsonRequest('"text"')), null);
    assert.equal(await readJsonObject(jsonRequest(JSON.stringify({ value: "x".repeat(129 * 1024) }))), null);
  });
});
