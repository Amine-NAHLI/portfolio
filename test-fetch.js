import { fetchPortfolioData } from './src/lib/github.js';

async function test() {
  try {
    const data = await fetchPortfolioData();
    console.log("Profile:", data.profile?.login);
    console.log("Personal:", data.personal);
    console.log("Skills count:", data.skills.length);
    console.log("Timeline count:", data.timeline.length);
    console.log("First project:", data.projects[0]?.title);
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

test();
