import { resolve } from "path";

// Load environment variables from .env.local
try {
  process.loadEnvFile(resolve(process.cwd(), ".env.local"));
} catch (error) {
  // Fallback if file doesn't exist
}

async function testGitHubAPI() {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const username = process.env.GITHUB_USERNAME || "Amine-NAHLI";

  if (!token) {
    console.error("❌ Error: GITHUB_ACCESS_TOKEN is missing in .env.local");
    console.error("Please add it and run the script again.");
    process.exit(1);
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
        repositories(first: 10, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
          totalCount
          nodes {
            name
            pushedAt
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  `;

  console.log(`Fetching GitHub data for ${username}...`);

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(`GraphQL error: ${errors.map((e) => e.message).join(", ")}`);
    }

    const user = data.user;
    if (!user) {
      console.error("User not found!");
      return;
    }

    console.log("\n✅ Successfully fetched data!");
    console.log("-----------------------------------");
    console.log(`Total Contributions (this year): ${user.contributionsCollection.contributionCalendar.totalContributions}`);
    console.log(`Total Public Repositories: ${user.repositories.totalCount}`);
    
    console.log("\nRecent Repositories:");
    user.repositories.nodes.slice(0, 3).forEach((repo) => {
      console.log(`- ${repo.name} (${repo.primaryLanguage?.name || "Unknown"}): Last pushed ${new Date(repo.pushedAt).toLocaleDateString()}`);
    });

  } catch (error) {
    console.error("\n❌ Error fetching GitHub data:", error.message);
  }
}

testGitHubAPI();
