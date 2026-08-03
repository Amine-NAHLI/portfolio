export type GitHubStats = {
  totalContributions: number;
  totalRepositories: number;
  topLanguage: {
    name: string;
    percentage: number;
    color: string;
  } | null;
  languages: { name: string; percentage: number; color: string }[];
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

export async function fetchGitHubData(): Promise<{ stats: GitHubStats; activity: GitHubActivity } | null> {
  const token = process.env.GITHUB_ACCESS_TOKEN;

  if (!token) {
    console.warn("GITHUB_ACCESS_TOKEN is missing. GitHub data will not be fetched.");
    return null;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
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
      throw new Error(`GitHub GraphQL error: ${errors.map((e: any) => e.message).join(", ")}`);
    }

    const user = data.user;
    if (!user) return null;

    // --- Process Statistics ---
    const totalContributions = user.contributionsCollection.contributionCalendar.totalContributions;
    const totalRepositories = user.repositories.totalCount;

    // Calculate language percentages
    const languageStats: Record<string, { size: number; color: string }> = {};
    let totalSize = 0;

    user.repositories.nodes.forEach((repo: any) => {
      repo.languages.edges.forEach((edge: any) => {
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
    const recentRepositories = user.repositories.nodes.slice(0, 6).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      pushedAt: repo.pushedAt,
      primaryLanguage: repo.primaryLanguage,
      stargazerCount: repo.stargazerCount,
    }));

    return {
      stats: {
        totalContributions,
        totalRepositories,
        topLanguage,
        languages,
      },
      activity: {
        recentRepositories,
      },
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return null;
  }
}
