import type { GitHubRepositoryReference } from "./types.ts";

const ownerPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const repositoryPattern = /^[a-zA-Z0-9._-]{1,100}$/;

export function parseGitHubRepositoryUrl(value: unknown): GitHubRepositoryReference | null {
  if (typeof value !== "string" || value.length > 300) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com" || url.username || url.password || url.port || url.search || url.hash) return null;
    const parts = url.pathname.replace(/\.git\/?$/i, "").split("/").filter(Boolean);
    if (parts.length !== 2 || !ownerPattern.test(parts[0]) || !repositoryPattern.test(parts[1])) return null;
    const [owner, repository] = parts;
    return { owner, repository, fullName: `${owner}/${repository}`, htmlUrl: `https://github.com/${owner}/${repository}` };
  } catch { return null; }
}
