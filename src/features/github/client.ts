import "server-only";

import type { GitHubRepositoryReference, GitHubRepositorySnapshot } from "@/features/github/types";
import { parseGitHubRepositoryUrl } from "@/features/github/reference";
const MAX_RESPONSE_CHARACTERS = 1_500_000;

export class GitHubRequestError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export { parseGitHubRepositoryUrl };

async function githubJson(reference: GitHubRepositoryReference, path: string): Promise<{ status: number; data: unknown }> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(reference.owner)}/${encodeURIComponent(reference.repository)}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "amine-nahli-portfolio",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(8_000),
    next: { revalidate: 3600, tags: [`github:${reference.fullName.toLowerCase()}`] },
  });
  if (response.status === 404) return { status: 404, data: null };
  if (response.status === 403 || response.status === 429) throw new GitHubRequestError(429, "Limite de l’API GitHub atteinte. Réessayez plus tard.");
  if (!response.ok) throw new GitHubRequestError(502, "GitHub n’a pas renvoyé de réponse exploitable.");
  const declaredSize = Number(response.headers.get("content-length") ?? "0");
  if (declaredSize > MAX_RESPONSE_CHARACTERS) throw new GitHubRequestError(413, "Réponse GitHub trop volumineuse.");
  const text = await response.text();
  if (text.length > MAX_RESPONSE_CHARACTERS) throw new GitHubRequestError(413, "Réponse GitHub trop volumineuse.");
  try { return { status: response.status, data: JSON.parse(text) as unknown }; }
  catch { throw new GitHubRequestError(502, "Réponse GitHub invalide."); }
}

export async function fetchGitHubRepository(reference: GitHubRepositoryReference): Promise<GitHubRepositorySnapshot> {
  const repositoryResult = await githubJson(reference, "");
  if (repositoryResult.status === 404 || !isObject(repositoryResult.data)) throw new GitHubRequestError(404, "Dépôt GitHub public introuvable.");
  const repository = repositoryResult.data;
  const [languagesResult, readmeResult, contentsResult, releasesResult, commitsResult, licenseResult] = await Promise.all([
    githubJson(reference, "/languages"), githubJson(reference, "/readme"), githubJson(reference, "/contents"),
    githubJson(reference, "/releases?per_page=5"), githubJson(reference, "/commits?per_page=5"), githubJson(reference, "/license"),
  ]);

  const fullName = stringValue(repository.full_name) ?? reference.fullName;
  if (fullName.toLowerCase() !== reference.fullName.toLowerCase()) throw new GitHubRequestError(422, "Le dépôt résolu ne correspond pas à l’URL demandée.");
  const name = stringValue(repository.name);
  const defaultBranch = stringValue(repository.default_branch);
  const createdAt = dateValue(repository.created_at);
  const updatedAt = dateValue(repository.updated_at);
  if (!name || !defaultBranch || !createdAt || !updatedAt) throw new GitHubRequestError(502, "GitHub a renvoyé des métadonnées incomplètes.");
  const readmeObject = isObject(readmeResult.data) ? readmeResult.data : null;
  const encodedReadme = readmeObject ? stringValue(readmeObject.content) : null;
  const decodedReadme = encodedReadme && stringValue(readmeObject?.encoding) === "base64"
    ? Buffer.from(encodedReadme.replaceAll("\n", ""), "base64").toString("utf8").slice(0, 200_000)
    : null;

  return {
    ...reference,
    name,
    description: nullableString(repository.description),
    defaultBranch,
    primaryLanguage: nullableString(repository.language),
    languages: numericRecord(languagesResult.data),
    topics: stringArray(repository.topics).slice(0, 30),
    homepage: safeHttpsUrl(repository.homepage),
    createdAt,
    updatedAt,
    pushedAt: dateValue(repository.pushed_at),
    archived: repository.archived === true,
    fork: repository.fork === true,
    stars: optionalNonNegativeInteger(repository.stargazers_count),
    forks: optionalNonNegativeInteger(repository.forks_count),
    openIssues: optionalNonNegativeInteger(repository.open_issues_count),
    license: isObject(licenseResult.data) && isObject(licenseResult.data.license) ? nullableString(licenseResult.data.license.spdx_id) : null,
    readme: decodedReadme,
    rootFiles: Array.isArray(contentsResult.data) ? contentsResult.data.flatMap((item) => isObject(item) && typeof item.name === "string" ? [item.name.slice(0, 255)] : []).slice(0, 200) : [],
    recentReleases: Array.isArray(releasesResult.data) ? releasesResult.data.flatMap((item) => isObject(item) && typeof item.tag_name === "string" ? [{ tag: item.tag_name.slice(0, 100), publishedAt: dateValue(item.published_at) }] : []).slice(0, 5) : [],
    recentCommits: Array.isArray(commitsResult.data) ? commitsResult.data.flatMap((item) => {
      if (!isObject(item) || typeof item.sha !== "string") return [];
      const commit = isObject(item.commit) ? item.commit : null;
      const author = commit && isObject(commit.author) ? commit.author : null;
      return [{ sha: item.sha.slice(0, 40), date: dateValue(author?.date) }];
    }).slice(0, 5) : [],
    fetchedAt: new Date().toISOString(),
  };
}

function isObject(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function stringValue(value: unknown): string | null { return typeof value === "string" && value.trim() ? value.trim() : null; }
function nullableString(value: unknown): string | null { return stringValue(value)?.slice(0, 500) ?? null; }
function dateValue(value: unknown): string | null { const text = stringValue(value); return text && !Number.isNaN(Date.parse(text)) ? new Date(text).toISOString() : null; }
function optionalNonNegativeInteger(value: unknown): number | null { return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null; }
function stringArray(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.slice(0, 100)) : []; }
function numericRecord(value: unknown): Record<string, number> { return isObject(value) ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, number] => typeof entry[1] === "number" && Number.isFinite(entry[1]))) : {}; }
function safeHttpsUrl(value: unknown): string | null { const text = stringValue(value); if (!text) return null; try { const url = new URL(text); return url.protocol === "https:" ? url.toString() : null; } catch { return null; } }
