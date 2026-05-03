/**
 * Main page — Server component.
 * ALL data is fetched dynamically from GitHub API and profile README.
 * When you create a new repo or update your profile README, it appears here automatically.
 */

import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import { fetchPortfolioData } from "@/lib/github";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const data = await fetchPortfolioData();

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero
        profile={data.profile}
        stats={data.stats}
        personal={data.personal}
      />
      <About
        profile={data.profile}
        stats={data.stats}
        personal={data.personal}
      />
      <Projects projects={data.projects} stats={data.stats} />
      <Stack skills={data.skills} />
      <Timeline events={data.timeline} />
      <Contact profile={data.profile} />
      <Footer />
    </main>
  );
}