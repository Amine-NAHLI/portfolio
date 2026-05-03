/**
 * GitHub API — 100% dynamic data fetching.
 * All portfolio data comes from the GitHub API in real-time.
 * Parses the profile README for skills, status, and personal info.
 */

const GITHUB_USERNAME = "Amine-NAHLI";
const GITHUB_API = "https://api.github.com";
const RAW_GITHUB = "https://raw.githubusercontent.com";

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

export interface Skill {
  name: string;
  level: number;
  category: string;
  description: string;
  techs: string[];
}

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

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "education" | "project" | "skill" | "milestone";
  highlight?: boolean;
}

export interface PortfolioData {
  profile: GitHubProfile | null;
  projects: Project[];
  skills: Skill[];
  timeline: TimelineEvent[];
  personal: {
    status: string;
    location: string;
    education: string;
    languages: string;
  };
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

async function fetchProfile(): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

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

async function fetchReadme(): Promise<string> {
  try {
    const res = await fetch(`${RAW_GITHUB}/${GITHUB_USERNAME}/${GITHUB_USERNAME}/main/README.md`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return "";
    return res.text();
  } catch {
    return "";
  }
}

// ─── Parsers & Logic ──────────────────────────────────────────────

function parsePersonal(readme: string): PortfolioData["personal"] {
  const status = readme.match(/<kbd>🟢\s*([^<]+)<\/kbd>/)?.[1] || "Available 2026";
  const location = readme.match(/<kbd>📍\s*([^<]+)<\/kbd>/)?.[1] || "Fès, Morocco";
  const education = readme.match(/<kbd>🎓\s*([^<]+)<\/kbd>/)?.[1] || "UPF · 3rd Year Eng.";
  const languages = readme.match(/<kbd>🌐\s*([^<]+)<\/kbd>/)?.[1] || "AR · FR · EN";

  return { status, location, education, languages };
}

function parseSkills(readme: string): Skill[] {
  const skills: Skill[] = [];
  const sections = [
    { id: "00", name: "Offensive Security", category: "Security" },
    { id: "01", name: "Full-Stack Eng.", category: "Full-Stack" },
    { id: "02", name: "AI · Vision", category: "AI" },
  ];

  for (const s of sections) {
    const levelMatch = readme.match(new RegExp(`#### \`${s.id}\`(.+?)skill_level-(\\d+)%`, "s"));
    const descMatch = readme.match(new RegExp(`#### \`${s.id}\`(.+?)<sub>(.+?)</sub>`, "s"));
    
    const sectionStart = readme.indexOf(`#### \`${s.id}\``);
    const sectionEnd = readme.indexOf(`#### \`0${parseInt(s.id) + 1}\``);
    const sectionText = readme.substring(sectionStart, sectionEnd > 0 ? sectionEnd : undefined);
    const techs = [...sectionText.matchAll(/`([^`]+)`/g)].map(m => m[1]).filter(t => !t.match(/^\d+$/));

    skills.push({
      name: s.name,
      level: levelMatch ? parseInt(levelMatch[2]) : 80,
      category: s.category,
      description: descMatch ? descMatch[2].replace(/<br\s*\/?>/g, " ") : "",
      techs: techs.slice(0, 10),
    });
  }
  return skills;
}

function buildTimeline(repos: GitHubRepo[]): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      year: "2024",
      title: "Started Engineering at UPF Fès",
      description: "Began my engineering degree with a focus on computer systems.",
      type: "education",
      highlight: true,
    }
  ];

  const sortedRepos = [...repos].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const years = new Set<string>();
  for (const repo of sortedRepos) {
    const year = new Date(repo.created_at).getFullYear().toString();
    if (!years.has(year)) {
      events.push({
        year,
        title: `Dynamic Growth: ${year}`,
        description: `Started working on major projects like ${formatTitle(repo.name)}.`,
        type: "project",
        highlight: repo.stargazers_count > 0,
      });
      years.add(year);
    }
  }

  events.push({
    year: "2026",
    title: "Mission Objective",
    description: "Open to internship/junior roles in Security & Full-Stack engineering.",
    type: "milestone",
    highlight: true,
  });

  return events.sort((a, b) => parseInt(a.year) - parseInt(b.year));
}

const EXCLUDED_REPOS = new Set(["Amine-NAHLI", "portfolio"]);

function inferCategory(repo: GitHubRepo): Project["category"] {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const topics = repo.topics.map((t) => t.toLowerCase());
  const lang = (repo.language || "").toLowerCase();

  if (["security", "pentest", "vulnerability", "nmap", "port-scanner", "cve"].some(k => name.includes(k) || desc.includes(k) || topics.includes(k))) return "Security";
  if (["ai", "ml", "vision", "opencv", "yolo", "detection", "robot"].some(k => name.includes(k) || desc.includes(k) || topics.includes(k))) return "AI/Vision";
  if (["laravel", "spring", "node", "react", "next", "angular", "php", "web", "app", "gestion"].some(k => name.includes(k) || desc.includes(k) || topics.includes(k)) || ["php", "javascript", "typescript", "java"].includes(lang)) return "Full-Stack";
  return "Experiments";
}

function formatTitle(name: string): string {
  return name.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function buildTags(repo: GitHubRepo): string[] {
  const tags: string[] = [];
  if (repo.language) tags.push(repo.language === "Blade" ? "Laravel" : repo.language);
  for (const topic of repo.topics) {
    if (tags.length >= 5) break;
    const formatted = topic.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (!tags.includes(formatted)) tags.push(formatted);
  }
  return tags.slice(0, 5);
}

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

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const [profile, rawRepos, readme] = await Promise.all([fetchProfile(), fetchRepos(), fetchReadme()]);

  const filteredRepos = rawRepos.filter((r) => !r.fork && !r.archived && !EXCLUDED_REPOS.has(r.name));
  const projects = filteredRepos.map(repoToProject).sort((a, b) => parseInt(b.year) - parseInt(a.year));
  
  const personal = parsePersonal(readme);
  const skills = parseSkills(readme);
  const timeline = buildTimeline(filteredRepos);

  const languages = [...new Set(filteredRepos.map((r) => r.language).filter(Boolean))] as string[];
  const categories = [...new Set(projects.map((p) => p.category))];
  const totalStars = filteredRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = filteredRepos.reduce((sum, r) => sum + r.forks_count, 0);

  return {
    profile,
    projects,
    skills,
    timeline,
    personal,
    stats: {
      totalRepos: projects.length,
      totalStars,
      totalForks,
      languages,
      categories,
      memberSince: profile?.created_at ? new Date(profile.created_at).getFullYear().toString() : "2024",
    },
  };
}
