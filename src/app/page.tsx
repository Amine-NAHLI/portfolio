/**
 * Main page — Server component.
 * ALL data is fetched dynamically from GitHub API.
 * When you create a new repo on GitHub, it appears here automatically
 * (within 1 hour thanks to ISR revalidation).
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

// Revalidate every hour — new repos appear within 1h
export const revalidate = 3600;

export default async function Home() {
  const data = await fetchPortfolioData();

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero
        profile={data.profile}
        stats={data.stats}
      />
      <About
        profile={data.profile}
        stats={data.stats}
      />
      <Projects projects={data.projects} stats={data.stats} />
      <Stack />
      <Timeline />
      <Contact profile={data.profile} />
      <Footer />
    </main>
  );
}