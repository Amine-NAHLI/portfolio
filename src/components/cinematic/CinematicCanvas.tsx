"use client";

import HeroScene from "@/components/cinematic/HeroScene";
import ManifestoScene from "@/components/cinematic/ManifestoScene";
import UniverseScene from "@/components/cinematic/UniverseScene";
import SelectedWorkScene from "@/components/cinematic/SelectedWorkScene";
import AboutScene from "@/components/cinematic/AboutScene";
import JourneyScene from "@/components/cinematic/JourneyScene";
import CertificationsScene from "@/components/cinematic/CertificationsScene";
import ContactScene from "@/components/cinematic/ContactScene";
import type { Locale } from "@/i18n/config";
import type { PortfolioProject } from "@/types/content";
import type { PublicJourneyEntry, PublicCertification } from "@/features/portfolio/data";

interface CinematicCanvasProps {
  locale: Locale;
  siteName: string;
  introduction: string;
  projects: PortfolioProject[];
  journey?: PublicJourneyEntry[];
  certifications?: PublicCertification[];
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
  introduction,
  projects,
  journey,
  certifications,
  contactLinks,
}: CinematicCanvasProps) {
  return (
    <div className="relative w-full bg-[#101015] text-[#f3f1f7] selection:bg-[#9A71FF]/30 selection:text-white">
      {/* Scene 01: Hero / First Impression */}
      <HeroScene
        locale={locale}
        siteName={siteName}
        introduction={introduction}
        contactLinks={contactLinks}
      />

      {/* Scene 02: Manifesto (Pinned Scroll Kinetics) */}
      <ManifestoScene locale={locale} />

      {/* Scene 03: My Universe (Cybersecurity, Software, AI) */}
      <UniverseScene locale={locale} />

      {/* Scene 04: Selected Work (Card Deck Stacking as in Reference Video) */}
      <SelectedWorkScene locale={locale} projects={projects} />

      {/* Scene 05: About Me (Beyond the Code) */}
      <AboutScene locale={locale} />

      {/* Scene 06: Experience & Journey Timeline (Innovative HUD Console) */}
      <JourneyScene locale={locale} journey={journey} />

      {/* Scene 07: Verified Credentials & Certifications (Interactive Document Viewer) */}
      <CertificationsScene locale={locale} certifications={certifications} />

      {/* Scene 08: Final Contact & Minimal Footer */}
      <ContactScene locale={locale} contactLinks={contactLinks} />
    </div>
  );
}

