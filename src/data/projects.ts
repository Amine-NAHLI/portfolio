/**
 * Projects data — supports both dynamic GitHub fetching and static fallback.
 * The dynamic fetch runs server-side with ISR (revalidate every hour).
 */

import {
  fetchGitHubRepos,
  inferCategory,
  extractYear,
  buildTags,
  type GitHubRepo,
} from "@/lib/github";

export interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: "Security" | "Full-Stack" | "AI/Vision" | "Experiments";
  tags: string[];
  githubUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  status: "public" | "private";
}

/**
 * Convert a GitHub API repo into our Project interface.
 */
function repoToProject(repo: GitHubRepo): Project {
  return {
    id: repo.id.toString(),
    title: repo.name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    description: repo.description || "No description available.",
    year: extractYear(repo.created_at),
    category: inferCategory(repo),
    tags: buildTags(repo),
    githubUrl: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    status: repo.visibility === "public" ? "public" : "private",
  };
}

/**
 * Fetch projects dynamically from GitHub API.
 * Called server-side via the page component.
 */
export async function getProjects(): Promise<Project[]> {
  const repos = await fetchGitHubRepos();

  if (repos.length > 0) {
    return repos
      .map(repoToProject)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }

  // Fallback to static data if API fails
  return fallbackProjects;
}

/**
 * Static fallback projects — used when GitHub API is unavailable.
 */
export const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "Shadow Mapper",
    description:
      "Automated network reconnaissance and vulnerability scanning tool with AI-based service identification.",
    year: "2025",
    category: "Security",
    tags: ["Python", "Nmap", "Machine Learning", "Scapy"],
    githubUrl: "https://github.com/Amine-NAHLI/shadow-mapper",
    stars: 0,
    forks: 0,
    language: "Python",
    status: "public",
  },
  {
    id: "2",
    title: "Hospital Management",
    description:
      "Full-stack hospital management system with patient tracking, appointments, and admin dashboard.",
    year: "2024",
    category: "Full-Stack",
    tags: ["Laravel", "PHP", "MySQL", "Tailwind CSS"],
    githubUrl: "https://github.com/Amine-NAHLI/hospital-management",
    stars: 0,
    forks: 0,
    language: "PHP",
    status: "public",
  },
  {
    id: "3",
    title: "Restaurant App",
    description:
      "Mobile restaurant application with real-time menu browsing, ordering and delivery tracking.",
    year: "2024",
    category: "Full-Stack",
    tags: ["React Native", "Expo", "Firebase"],
    githubUrl: "https://github.com/Amine-NAHLI/restaurant-app",
    stars: 0,
    forks: 0,
    language: "JavaScript",
    status: "public",
  },
  {
    id: "4",
    title: "Smart Network Mapper",
    description:
      "Network scanner with ML-powered vulnerability detection combining security and AI.",
    year: "2025",
    category: "Security",
    tags: ["Python", "Nmap", "AI", "Network"],
    githubUrl: "https://github.com/Amine-NAHLI/smart-network-mapper",
    stars: 0,
    forks: 0,
    language: "Python",
    status: "public",
  },
  {
    id: "5",
    title: "Portfolio",
    description:
      "Personal portfolio website built with Next.js, Three.js, and Framer Motion.",
    year: "2025",
    category: "Full-Stack",
    tags: ["Next.js", "TypeScript", "Three.js", "Tailwind"],
    githubUrl: "https://github.com/Amine-NAHLI/portfolio",
    stars: 0,
    forks: 0,
    language: "TypeScript",
    status: "public",
  },
  {
    id: "6",
    title: "Stock Management",
    description:
      "Inventory and stock management system with real-time tracking and analytics.",
    year: "2024",
    category: "Full-Stack",
    tags: ["Spring Boot", "Java", "MySQL"],
    githubUrl: "https://github.com/Amine-NAHLI/stock-management",
    stars: 0,
    forks: 0,
    language: "Java",
    status: "public",
  },
];
