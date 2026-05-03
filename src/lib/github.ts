/**
 * GitHub API — 100% dynamic data fetching.
 * All portfolio data comes from the GitHub API in real-time.
 * No static data — when you create a new repo, it appears automatically.
 */

const GITHUB_USERNAME = "Amine-NAHLI";
const GITHUB_API = "https://api.github.com";

// ─── Types ────────────────────────────────────────────────────────

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
  size: number;
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

/** Processed project for the UI */
export interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: "Security" | "Full-Stack" | "AI/Vision" | "Experiments";
  tags: string[];
  githubUrl: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  status: "public" | "private";
  size: number;
  updatedAt: string;
}

/** All data the portfolio needs, fetched in one call */
export interface PortfolioData {
  profile: GitHubProfile | null;
  projects: Project[];
  stats: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    languages: string[];
    categories: string[];
    memberSince: string;
  };
}

// ─── API Fetchers ─────────────────────────────────────────────────

/**
 * Fetch GitHub profile.
 */
async function fetchProfile(): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch all public repos (handles pagination).
 */
async function fetchRepos(): Promise<GitHubRepo[]> {
  try {
    const allRepos: GitHubRepo[] = [];
    let page = 1;

    while (true) {
      const res = await fetch(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=pushed&type=owner`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 3600 },
        }
      );
      if (!res.ok) break;

      const data: GitHubRepo[] = await res.json();
      allRepos.push(...data);

      if (data.length < 100) break;
      page++;
    }

    return allRepos;
  } catch {
    return [];
  }
}

// ─── Processing Logic ─────────────────────────────────────────────

/** Repos to exclude (profile README, this portfolio itself) */
const EXCLUDED_REPOS = new Set(["Amine-NAHLI"]);

/**
 * Infer category from repo metadata.
 */
function inferCategory(repo: GitHubRepo): Project["category"] {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const topics = repo.topics.map((t) => t.toLowerCase());
  const lang = (repo.language || "").toLowerCase();

  // Security
  const securityKeywords = [
    "security", "pentest", "exploit", "vulnerability", "scanner",
    "nmap", "network-mapper", "hack", "cyber", "firewall", "malware",
    "forensic", "intrusion", "brute", "port-scanner", "cve", "shadow",
  ];
  if (securityKeywords.some((k) => name.includes(k) || desc.includes(k) || topics.includes(k))) {
    return "Security";
  }

  // AI / Vision / Robotics
  const aiKeywords = [
    "ai", "ml", "machine-learning", "deep-learning", "vision",
    "opencv", "yolo", "detection", "recognition", "neural", "pytorch",
    "tensorflow", "mediapipe", "robot", "transport-yolo",
  ];
  if (aiKeywords.some((k) => name.includes(k) || desc.includes(k) || topics.includes(k))) {
    return "AI/Vision";
  }

  // Full-Stack
  const fullstackKeywords = [
    "laravel", "django", "flask", "express", "next", "react", "vue",
    "angular", "spring", "api", "crud", "web", "app", "platform",
    "dashboard", "cms", "ecommerce", "hopital", "hospital", "gestion",
    "management", "recette", "look-me", "geoalert",
  ];
  const fullstackLangs = ["php", "blade", "typescript", "javascript", "java", "ejs"];
  if (
    fullstackKeywords.some((k) => name.includes(k) || desc.includes(k) || topics.includes(k)) ||
    fullstackLangs.includes(lang)
  ) {
    return "Full-Stack";
  }

  return "Experiments";
}

/**
 * Format repo name into a readable title.
 * "smart-network-mapper" → "Smart Network Mapper"
 */
function formatTitle(name: string): string {
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build tech tags from language + topics.
 */
function buildTags(repo: GitHubRepo): string[] {
  const tags: string[] = [];

  // Primary language
  if (repo.language && repo.language !== "Blade") {
    tags.push(repo.language);
  } else if (repo.language === "Blade") {
    tags.push("Laravel");
  }

  // Topics
  const skip = new Set(["hacktoberfest", "good-first-issue", "help-wanted"]);
  for (const topic of repo.topics) {
    if (skip.has(topic)) continue;
    const formatted = topic
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    if (!tags.includes(formatted)) tags.push(formatted);
    if (tags.length >= 5) break;
  }

  // Infer extra tags from repo name/description
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();

  const techInference: [string, string][] = [
    ["spring", "Spring Boot"], ["angular", "Angular"],
    ["expo", "Expo"], ["mobile", "Mobile"],
    ["laravel", "Laravel"], ["node", "Node.js"],
    ["express", "Express"], ["mongodb", "MongoDB"],
    ["leaflet", "Leaflet"], ["yolo", "YOLOv8"],
    ["opencv", "OpenCV"], ["mediapipe", "MediaPipe"],
    ["nmap", "Nmap"], ["mysql", "MySQL"],
    ["react", "React"], ["next", "Next.js"],
  ];

  for (const [keyword, tag] of techInference) {
    if ((name.includes(keyword) || desc.includes(keyword)) && !tags.includes(tag)) {
      tags.push(tag);
      if (tags.length >= 5) break;
    }
  }

  return tags.slice(0, 5);
}

/**
 * Convert raw GitHub repo to our Project interface.
 */
function repoToProject(repo: GitHubRepo): Project {
  return {
    id: repo.id.toString(),
    title: formatTitle(repo.name),
    description: repo.description || `A ${repo.language || "code"} project.`,
    year: new Date(repo.created_at).getFullYear().toString(),
    category: inferCategory(repo),
    tags: buildTags(repo),
    githubUrl: repo.html_url,
    homepage: repo.homepage,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    status: repo.visibility === "public" ? "public" : "private",
    size: repo.size,
    updatedAt: repo.updated_at,
  };
}

// ─── Main Export ───────────────────────────────────────────────────

/**
 * Fetch ALL portfolio data from GitHub in one call.
 * This is the single source of truth for the entire site.
 * Called server-side by page.tsx with ISR (revalidates every hour).
 */
export async function fetchPortfolioData(): Promise<PortfolioData> {
  const [profile, rawRepos] = await Promise.all([fetchProfile(), fetchRepos()]);

  // Filter: no forks, no archived, no excluded repos
  const filteredRepos = rawRepos.filter(
    (r) => !r.fork && !r.archived && !EXCLUDED_REPOS.has(r.name)
  );

  // Convert to projects
  const projects = filteredRepos
    .map(repoToProject)
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));

  // Compute stats dynamically
  const languages = [...new Set(filteredRepos.map((r) => r.language).filter(Boolean))] as string[];
  const categories = [...new Set(projects.map((p) => p.category))];
  const totalStars = filteredRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = filteredRepos.reduce((sum, r) => sum + r.forks_count, 0);

  return {
    profile,
    projects,
    stats: {
      totalRepos: projects.length,
      totalStars,
      totalForks,
      languages,
      categories,
      memberSince: profile?.created_at
        ? new Date(profile.created_at).getFullYear().toString()
        : "2024",
    },
  };
}
