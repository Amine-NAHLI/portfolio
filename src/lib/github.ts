export type GitHubStats = {
  totalContributions: number;
  totalRepositories: number;
  topLanguage: {
    name: string;
    percentage: number;
    color: string;
  } | null;
  languages: { name: string; percentage: number; color: string }[];
  calendarWeeks?: {
    contributionDays: {
      contributionCount: number;
      date: string;
    }[];
  }[];
};

export type GitHubActivity = {
  recentRepositories: {
    name: string;
    description: string | null;
    url: string;
    pushedAt: string;
    primaryLanguage: { name: string; color: string } | null;
    stargazerCount: number;
  }[];
};

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Amine-NAHLI";

export const fallbackGitHubData: { stats: GitHubStats; activity: GitHubActivity } = {
  stats: {
    totalContributions: 486,
    totalRepositories: 24,
    topLanguage: {
      name: "TypeScript",
      percentage: 42.5,
      color: "#3178c6",
    },
    languages: [
      { name: "TypeScript", percentage: 42.5, color: "#3178c6" },
      { name: "Python", percentage: 28.3, color: "#3572A5" },
      { name: "JavaScript", percentage: 15.2, color: "#f1e05a" },
      { name: "C++", percentage: 8.6, color: "#f34b7d" },
      { name: "Shell & Autres", percentage: 5.4, color: "#89e051" },
    ],
  },
  activity: {
    recentRepositories: [
      {
        name: "7yatk",
        description: "Application mobile de téléassistance et détection d'urgence avec IA embarquée et réseau mesh hors-ligne.",
        url: "https://github.com/Amine-NAHLI/7yatk",
        pushedAt: new Date().toISOString(),
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        stargazerCount: 5,
      },
      {
        name: "transport-yolo-robot",
        description: "Pipeline de vision par ordinateur YOLOv8 pour la détection temps réel d'obstacles robotiques.",
        url: "https://github.com/Amine-NAHLI/transport-yolo-robot",
        pushedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        primaryLanguage: { name: "Python", color: "#3572A5" },
        stargazerCount: 3,
      },
      {
        name: "portfolio",
        description: "Portfolio technique bilingue d'ingénierie logicielle développé avec Next.js 15 et Tailwind CSS.",
        url: "https://github.com/Amine-NAHLI/portfolio",
        pushedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        stargazerCount: 4,
      },
      {
        name: "smart-network-mapper",
        description: "Plateforme d'audit et cartographie réseau avec détection passive d'anomalies de sécurité.",
        url: "https://github.com/Amine-NAHLI/smart-network-mapper",
        pushedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        primaryLanguage: { name: "Python", color: "#3572A5" },
        stargazerCount: 2,
      },
    ],
  },
};

export async function fetchGitHubData(): Promise<{ stats: GitHubStats; activity: GitHubActivity }> {
  const token = process.env.GITHUB_ACCESS_TOKEN;

  if (!token) {
    return fallbackGitHubData;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            url
            pushedAt
            stargazerCount
            primaryLanguage {
              name
              color
            }
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
      // Cache data for 1 hour to prevent rate limiting
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(`GitHub GraphQL error: ${errors.map((e: { message: string }) => e.message).join(", ")}`);
    }

    const user = data.user;
    if (!user) return fallbackGitHubData;

    // --- Process Statistics ---
    const totalContributions = user.contributionsCollection.contributionCalendar.totalContributions;
    const totalRepositories = user.repositories.totalCount;

    // Calculate language percentages
    const languageStats: Record<string, { size: number; color: string }> = {};
    let totalSize = 0;

    user.repositories.nodes.forEach((repo: { languages: { edges: { size: number; node: { name: string; color: string } }[] } }) => {
      repo.languages.edges.forEach((edge: { size: number; node: { name: string; color: string } }) => {
        const { size, node: { name, color } } = edge;
        if (!languageStats[name]) {
          languageStats[name] = { size: 0, color };
        }
        languageStats[name].size += size;
        totalSize += size;
      });
    });

    const languages = Object.entries(languageStats)
      .map(([name, data]) => ({
        name,
        color: data.color,
        percentage: totalSize > 0 ? (data.size / totalSize) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const topLanguage = languages.length > 0 ? languages[0] : null;

    // --- Process Activity ---
    const recentRepositories = user.repositories.nodes.slice(0, 6).map((repo: { name: string; description: string | null; url: string; pushedAt: string; primaryLanguage: { name: string; color: string } | null; stargazerCount: number }) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      pushedAt: repo.pushedAt,
      primaryLanguage: repo.primaryLanguage,
      stargazerCount: repo.stargazerCount,
    }));

    const calendarWeeks = (user.contributionsCollection?.contributionCalendar?.weeks || []) as {
      contributionDays: {
        contributionCount: number;
        date: string;
      }[];
    }[];

    return {
      stats: {
        totalContributions,
        totalRepositories,
        topLanguage,
        languages,
        calendarWeeks,
      },
      activity: {
        recentRepositories,
      },
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return fallbackGitHubData;
  }
}
