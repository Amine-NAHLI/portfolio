/**
 * GitHub API — 100% dynamic data fetching.
 */

const GITHUB_USERNAME = "Amine-NAHLI";
const GITHUB_API = "https://api.github.com";
const RAW_GITHUB = "https://raw.githubusercontent.com";

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
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
  public_repos: number;
  followers: number;
  created_at: string;
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

export interface PortfolioData {
  profile: GitHubProfile | null;
  projects: Project[];
  skills: Skill[];
  techOrbit: {
    core: string[];
    frameworks: string[];
    tools: string[];
  };
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
  const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
    next: { revalidate: 3600 },
  });
  return res.ok ? res.json() : null;
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`, {
    headers: { Accept: "application/vnd.github.v3+json" },
    next: { revalidate: 3600 },
  });
  return res.ok ? res.json() : [];
}

async function fetchReadme(): Promise<string> {
  const res = await fetch(`${RAW_GITHUB}/${GITHUB_USERNAME}/${GITHUB_USERNAME}/main/README.md`, {
    next: { revalidate: 3600 },
  });
  return res.ok ? res.text() : "";
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

function extractTechOrbit(repos: GitHubRepo[]): PortfolioData["techOrbit"] {
  const coreSet = new Set<string>();
  const frameworkSet = new Set<string>();
  const toolSet = new Set<string>();

  const frameworkKeywords = ["react", "next", "laravel", "spring", "angular", "vue", "opencv", "yolo", "flask", "django", "express", "expo", "android"];
  const toolKeywords = ["kali", "nmap", "wireshark", "bash", "linux", "docker", "git", "firebase", "mongodb", "mysql", "postgresql", "metasploit", "burp"];

  repos.forEach(repo => {
    if (repo.language) coreSet.add(repo.language);
    repo.topics.forEach(topic => {
      const t = topic.toLowerCase();
      if (frameworkKeywords.some(k => t.includes(k))) frameworkSet.add(topic);
      else if (toolKeywords.some(k => t.includes(k))) toolSet.add(topic);
      else if (t.length < 15) toolSet.add(topic);
    });
  });

  return {
    core: Array.from(coreSet).map(s => s.toUpperCase()),
    frameworks: Array.from(frameworkSet).map(s => s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")),
    tools: Array.from(toolSet).map(s => s.toUpperCase()).slice(0, 20)
  };
}

const EXCLUDED_REPOS = new Set(["Amine-NAHLI", "portfolio"]);

function inferCategory(repo: GitHubRepo): Project["category"] {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const topics = repo.topics.map(t => t.toLowerCase());
  if (["security", "pentest", "vulnerability", "nmap", "port-scanner", "cve"].some(k => name.includes(k) || desc.includes(k) || topics.includes(k))) return "Security";
  if (["ai", "ml", "vision", "opencv", "yolo", "detection", "robot"].some(k => name.includes(k) || desc.includes(k) || topics.includes(k))) return "AI/Vision";
  if (["laravel", "spring", "node", "react", "next", "angular", "php", "web", "app", "gestion"].some(k => name.includes(k) || desc.includes(k) || topics.includes(k))) return "Full-Stack";
  return "Experiments";
}

function formatTitle(name: string): string {
  return name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function repoToProject(repo: GitHubRepo): Project {
  return {
    id: repo.id.toString(),
    title: formatTitle(repo.name),
    description: repo.description || `A ${repo.language || "code"} project.`,
    year: new Date(repo.created_at).getFullYear().toString(),
    category: inferCategory(repo),
    tags: repo.topics.slice(0, 5),
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

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const [profile, rawRepos, readme] = await Promise.all([fetchProfile(), fetchRepos(), fetchReadme()]);
  const filteredRepos = rawRepos.filter(r => !r.fork && !r.archived && !EXCLUDED_REPOS.has(r.name));
  const projects = filteredRepos.map(repoToProject).sort((a, b) => parseInt(b.year) - parseInt(a.year));
  const totalStars = filteredRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = filteredRepos.reduce((sum, r) => sum + r.forks_count, 0);

  return {
    profile,
    projects,
    skills: parseSkills(readme),
    techOrbit: extractTechOrbit(filteredRepos),
    personal: parsePersonal(readme),
    stats: {
      totalRepos: projects.length,
      totalStars,
      totalForks,
      languages: [...new Set(filteredRepos.map(r => r.language).filter(Boolean))] as string[],
      categories: [...new Set(projects.map(p => p.category))],
      memberSince: profile?.created_at ? new Date(profile.created_at).getFullYear().toString() : "2024",
    },
  };
}
