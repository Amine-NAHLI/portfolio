"use client";

import HeroScene from "@/components/cinematic/HeroScene";
import ManifestoScene from "@/components/cinematic/ManifestoScene";
import SelectedWorkScene from "@/components/cinematic/SelectedWorkScene";
import AboutScene from "@/components/cinematic/AboutScene";
import JourneyScene from "@/components/cinematic/JourneyScene";
import GitHubContributionsScene from "@/components/cinematic/GitHubContributionsScene";
import CertificationsScene from "@/components/cinematic/CertificationsScene";
import ContactScene from "@/components/cinematic/ContactScene";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/types/content";
import type { PublicJourneyEntry, PublicCertification } from "@/features/portfolio/data";
import type { HomeDynamicCopy } from "@/content/dynamic-copy";
import type { GitHubStats, GitHubActivity } from "@/lib/github";
import type { JourneyTimelineItem } from "@/types/journey";

interface CinematicCanvasProps {
  locale: Locale;
  siteName: string;
  dynamicCopy?: HomeDynamicCopy;
  introduction?: string;
  projects: PortfolioProject[];
  journey?: PublicJourneyEntry[];
  timelineItems?: JourneyTimelineItem[];
  certifications?: PublicCertification[];
  showGitHub?: boolean;
  githubData?: { stats: GitHubStats; activity: GitHubActivity };
  contactLinks: {
    github?: string;
    linkedin?: string;
    resume: string;
    email?: string;
  };
}

export default function CinematicCanvas({
  locale,
  siteName,
  dynamicCopy,
  projects,
  journey,
  timelineItems,
  certifications,
  showGitHub,
  githubData,
  contactLinks,
}: CinematicCanvasProps) {
  return (
    <div className="relative w-full bg-bg-page text-text-primary selection:bg-accent/25 selection:text-text-primary">
      {/* Background Mixed Atmospheric Lighting adapting to active theme with subtle, refined falloff */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-15%] top-[10%] h-[900px] w-[900px] rounded-full opacity-40 -z-10"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--surface-raised) 40%, transparent) 0%, color-mix(in srgb, var(--surface-raised) 15%, transparent) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[-15%] top-[45%] h-[950px] w-[950px] rounded-full opacity-35 -z-10"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--surface) 40%, transparent) 0%, color-mix(in srgb, var(--surface) 15%, transparent) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[10%] bottom-[5%] h-[800px] w-[800px] rounded-full opacity-30 -z-10"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--surface-subtle) 35%, transparent) 0%, color-mix(in srgb, var(--surface-subtle) 10%, transparent) 50%, transparent 100%)",
        }}
      />

      {/* Scene 01: Hero / First Impression (Centered Monumental Typography) */}
      <HeroScene
        locale={locale}
        siteName={siteName}
        headline={dynamicCopy?.headline}
        contactLinks={contactLinks}
        heroButtons={dynamicCopy?.heroButtons}
      />

      {/* Scene 02: Manifesto (Pinned Scroll Kinetics: I BUILD. I SECURE. I INNOVATE.) */}
      <ManifestoScene locale={locale} />

      {/* Scene 03: About Me & Portrait Frame (Engineer Profile, UPF, IntelTrust) */}
      <AboutScene
        locale={locale}
        aboutTitle={dynamicCopy?.aboutTitle}
        aboutBio={dynamicCopy?.aboutBio}
        proofItems={dynamicCopy?.proofItems}
      />

      {/* Scene 04: Selected Work (Card Deck Stacking as in Reference Video) */}
      <SelectedWorkScene locale={locale} projects={projects} />

      {/* Scene 05: Experience & Journey Timeline (Alternating Glowing Central Line) */}
      <JourneyScene locale={locale} journey={journey} timelineItems={timelineItems} />

      {/* Scene 06: GitHub & Open Source Activity (Real-time Code & Live Contributions) */}
      {showGitHub !== false && githubData && (
        <GitHubContributionsScene
          locale={locale}
          stats={githubData.stats}
          githubUrl={contactLinks.github}
        />
      )}

      {/* Scene 07: Verified Credentials & Certifications (Interactive Document Viewer) */}
      <CertificationsScene locale={locale} certifications={certifications} />

      {/* Scene 08: Final Contact & Minimal Footer */}
      <ContactScene locale={locale} contactLinks={contactLinks} />
    </div>
  );
}

