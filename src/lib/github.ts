/**
 * GitHub API utility — dynamically fetches repository data for Amine-NAHLI
 * Uses the public GitHub REST API (no auth needed for public repos).
 * Falls back to static data if the API is unavailable or rate-limited.
 */

const GITHUB_USERNAME = "Amine-NAHLI";
const GITHUB_API = "https://api.github.com";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  visibility: string;
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

/**
 * Fetch all public repositories for Amine-NAHLI.
 * Handles pagination (up to 100 repos per page).
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const repos: GitHubRepo[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated&type=owner`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
          next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
        }
      );

      if (!res.ok) {
        console.warn(`GitHub API returned ${res.status}`);
        break;
      }

      const data: GitHubRepo[] = await res.json();
      repos.push(...data);

      if (data.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Filter out forks and archived repos
    return repos.filter((r) => !r.fork && !r.archived);
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
}

/**
 * Fetch the GitHub profile for Amine-NAHLI.
 */
export async function fetchGitHubProfile(): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error);
    return null;
  }
}

/**
 * Fetch languages used across all repos (aggregate).
 */
export async function fetchRepoLanguages(repoName: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

/**
 * Infer a category from repo topics, name, and language.
 */
export function inferCategory(
  repo: GitHubRepo
): "Security" | "Full-Stack" | "AI/Vision" | "Experiments" {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const topics = repo.topics.map((t) => t.toLowerCase());
  const lang = (repo.language || "").toLowerCase();

  // Security keywords
  const securityKeywords = [
    "security", "pentest", "exploit", "vulnerability", "scanner",
    "nmap", "network", "mapper", "hack", "cyber", "firewall",
    "malware", "forensic", "intrusion", "brute", "ddos", "shadow",
  ];
  if (
    securityKeywords.some(
      (k) => name.includes(k) || desc.includes(k) || topics.includes(k)
    )
  ) {
    return "Security";
  }

  // AI / Vision keywords
  const aiKeywords = [
    "ai", "ml", "machine-learning", "deep-learning", "vision",
    "opencv", "yolo", "detection", "recognition", "neural",
    "pytorch", "tensorflow", "mediapipe", "cv", "robot",
  ];
  if (
    aiKeywords.some(
      (k) => name.includes(k) || desc.includes(k) || topics.includes(k)
    )
  ) {
    return "AI/Vision";
  }

  // Full-Stack keywords
  const fullstackKeywords = [
    "laravel", "django", "flask", "express", "next", "react",
    "vue", "angular", "spring", "api", "crud", "web", "app",
    "platform", "dashboard", "cms", "ecommerce", "hospital",
    "management", "php", "node", "fullstack", "full-stack",
  ];
  if (
    fullstackKeywords.some(
      (k) => name.includes(k) || desc.includes(k) || topics.includes(k)
    ) ||
    ["php", "typescript", "javascript"].includes(lang)
  ) {
    return "Full-Stack";
  }

  return "Experiments";
}

/**
 * Extract year from repo creation date.
 */
export function extractYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

/**
 * Build tech tags from repo language + topics.
 */
export function buildTags(repo: GitHubRepo): string[] {
  const tags: string[] = [];

  if (repo.language) tags.push(repo.language);

  // Add relevant topics (filter out generic ones)
  const genericTopics = new Set([
    "hacktoberfest", "good-first-issue", "help-wanted", "documentation",
  ]);
  repo.topics
    .filter((t) => !genericTopics.has(t))
    .slice(0, 4)
    .forEach((t) => {
      const formatted = t
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      if (!tags.includes(formatted) && !tags.includes(repo.language || ""))
        tags.push(formatted);
    });

  return tags.slice(0, 5);
}
