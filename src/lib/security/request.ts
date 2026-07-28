import type { NextRequest } from "next/server";

const MAX_JSON_BODY_BYTES = 128 * 1024;

export function acceptsSameOriginMutation(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (!origin || !isTrustedOrigin(origin, request)) return false;
  if (fetchSite && fetchSite !== "same-origin") return false;
  return true;
}

function isTrustedOrigin(origin: string, request: NextRequest): boolean {
  let candidate: URL;
  try {
    candidate = new URL(origin);
  } catch {
    return false;
  }

  if (candidate.origin === request.nextUrl.origin) return true;

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl) {
    try {
      if (candidate.origin === new URL(configuredSiteUrl).origin) return true;
    } catch {
      // Invalid deployment configuration must not broaden the allowlist.
    }
  }

  if (process.env.NODE_ENV === "production") return false;
  const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
  return candidate.protocol === request.nextUrl.protocol
    && localHosts.has(candidate.hostname)
    && localHosts.has(request.nextUrl.hostname);
}

export function acceptsJsonBody(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") return false;

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader === null) return true;
  if (!/^\d+$/.test(contentLengthHeader)) return false;

  const contentLength = Number(contentLengthHeader);
  return Number.isSafeInteger(contentLength) && contentLength <= MAX_JSON_BODY_BYTES;
}

export async function readJsonObject(request: NextRequest): Promise<Record<string, unknown> | null> {
  if (!acceptsJsonBody(request)) return null;

  try {
    const reader = request.body?.getReader();
    if (!reader) return null;

    const decoder = new TextDecoder();
    let bytesRead = 0;
    let json = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > MAX_JSON_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      json += decoder.decode(value, { stream: true });
    }
    json += decoder.decode();

    const value: unknown = JSON.parse(json);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    return value as Record<string, unknown>;
  } catch {
    return null;
  }
}
