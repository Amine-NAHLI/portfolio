import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import { fetchPortfolioData } from "@/lib/github";
import Loading from "./loading";

const GeometricBackground = dynamic(() => import("@/components/ui/GeometricBackground"), {
  ssr: false,
});

export const revalidate = 3600;

async function PortfolioContent() {
  const data = await fetchPortfolioData();
  const latestProject = data.projects[0] ?? null;

  return (
    <>
      <Hero profile={data.profile} stats={data.stats} />
      <About
        profile={data.profile}
        stats={data.stats}
        personal={data.personal}
        latestProject={latestProject}
      />
      <Projects projects={data.projects} stats={data.stats} />
      <Stack orbit={data.techOrbit} />
      <Contact profile={data.profile} />
      <Footer latestProject={latestProject} />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <GeometricBackground />
      <Suspense fallback={<Loading />}>
        <PortfolioContent />
      </Suspense>
    </main>
  );
}
