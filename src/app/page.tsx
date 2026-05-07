import { Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import ContentReadySignal from "@/components/ui/ContentReadySignal";
import { createClient } from "@supabase/supabase-js";
import Loading from "./loading";

export const revalidate = 60; // Revalidate every 60 seconds (fast updates after admin changes)

const GITHUB_API = "https://api.github.com";
const GITHUB_USERNAME = "Amine-NAHLI";
const RAW_GITHUB = "https://raw.githubusercontent.com";

// Lightweight profile fetch (only 1 API call, very fast)
async function fetchProfile() {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 },
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

// Lightweight README parse for personal info
async function fetchPersonal() {
  try {
    const res = await fetch(`${RAW_GITHUB}/${GITHUB_USERNAME}/${GITHUB_USERNAME}/main/README.md`, {
      next: { revalidate: 3600 },
    });
    const readme = res.ok ? await res.text() : "";
    return {
      status: readme.match(/<kbd>🟢\s*([^<]+)<\/kbd>/)?.[1] || "Available 2026",
      location: readme.match(/<kbd>📍\s*([^<]+)<\/kbd>/)?.[1] || "Fès, Morocco",
      education: readme.match(/<kbd>🎓\s*([^<]+)<\/kbd>/)?.[1] || "UPF · 3rd Year Eng.",
      languages: readme.match(/<kbd>🌐\s*([^<]+)<\/kbd>/)?.[1] || "AR · FR · EN",
    };
  } catch {
    return { status: "Available 2026", location: "Fès, Morocco", education: "UPF · 3rd Year Eng.", languages: "AR · FR · EN" };
  }
}

// Fetch projects & skills from Supabase (the single source of truth)
async function fetchFromSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [projectsRes, skillsRes] = await Promise.all([
    supabase.from("projects").select("*").eq("visible", true).order("created_at", { ascending: false }),
    supabase.from("skills").select("*").order("name"),
  ]);

  return {
    projects: projectsRes.data || [],
    skills: skillsRes.data || [],
  };
}

async function PortfolioContent() {
  const [profile, personal, { projects, skills }] = await Promise.all([
    fetchProfile(),
    fetchPersonal(),
    fetchFromSupabase(),
  ]);

  const latestProject = projects[0] ?? null;

  const stats = {
    totalRepos: projects.length,
    totalStars: 0,
    totalForks: 0,
    totalCommits: 0,
    languages: [...new Set(projects.map((p: any) => p.language).filter(Boolean))],
    categories: [...new Set(projects.map((p: any) => p.category))],
    memberSince: profile?.created_at ? new Date(profile.created_at).getFullYear().toString() : "2024",
    githubUrl: profile?.html_url || `https://github.com/${GITHUB_USERNAME}`,
    counts: {
      security: projects.filter((p: any) => p.category?.toLowerCase().includes('security')).length,
      web: projects.filter((p: any) => p.category?.toLowerCase().includes('web') || p.category?.toLowerCase().includes('full')).length,
      ai: projects.filter((p: any) => p.category?.toLowerCase().includes('ai')).length,
      mobile: projects.filter((p: any) => p.category?.toLowerCase().includes('mobile')).length,
    }
  };

  return (
    <>
      <Hero profile={profile} stats={stats} />
      <About profile={profile} stats={stats} personal={personal} latestProject={latestProject} />
      <Projects projects={projects} stats={stats} />
      <Stack skills={skills} />
      <Testimonials />
      <Contact profile={profile} />
      <Footer latestProject={latestProject} />
      {/* Fires portfolio:content-ready once all sections are hydrated */}
      <ContentReadySignal />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <PortfolioContent />
      </Suspense>
    </main>
  );
}
