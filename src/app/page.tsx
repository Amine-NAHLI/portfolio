/**
 * Main page — Server component that fetches GitHub data dynamically
 * and passes it to client components via props.
 */

import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import { getProjects } from "@/data/projects";
import { fetchGitHubProfile } from "@/lib/github";

// Revalidate every hour for ISR
export const revalidate = 3600;

export default async function Home() {
  // Fetch GitHub data server-side
  const [projects, profile] = await Promise.all([
    getProjects(),
    fetchGitHubProfile(),
  ]);

  const repoCount = projects.length;

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero repoCount={repoCount} />
      <About repoCount={repoCount} />
      <Projects projects={projects} />
      <Stack />
      <Timeline />
      <Contact />
      <Footer />
    </main>
  );
}