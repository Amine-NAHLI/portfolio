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
      {/* Global Architectural Atmospheric Background covering the entire Home page permanently */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      >
        {/* Top-Left Ambient Orb with continuous fluid drift */}
        <div
          className="absolute left-[-20%] sm:left-[-15%] top-[-5%] sm:top-[5%] h-[850px] w-[850px] sm:h-[1100px] sm:w-[1100px] rounded-full opacity-60 animate-ambient-1"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--surface-raised) 50%, transparent) 0%, color-mix(in srgb, var(--surface-raised) 20%, transparent) 50%, transparent 100%)",
          }}
        />
        {/* Right-Center Ambient Orb with continuous fluid counter-drift */}
        <div
          className="absolute right-[-20%] sm:right-[-15%] top-[30%] h-[950px] w-[950px] sm:h-[1200px] sm:w-[1200px] rounded-full opacity-55 animate-ambient-2"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--surface) 50%, transparent) 0%, color-mix(in srgb, var(--surface) 20%, transparent) 50%, transparent 100%)",
          }}
        />
        {/* Bottom-Left Ambient Orb with continuous gentle sway */}
        <div
          className="absolute left-[5%] bottom-[-5%] h-[850px] w-[850px] sm:h-[1000px] sm:w-[1000px] rounded-full opacity-50 animate-ambient-3"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--surface-subtle) 45%, transparent) 0%, color-mix(in srgb, var(--surface-subtle) 18%, transparent) 50%, transparent 100%)",
          }}
        />
        {/* Subtle Accent Glow floating & breathing permanently across the entire canvas */}
        <div
          className="absolute inset-0 animate-ambient-glow"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 35%, color-mix(in srgb, var(--accent) 9%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>

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

