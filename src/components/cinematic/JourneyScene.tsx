"use client";

import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import HackathonsWarRoom from "@/components/ui/HackathonsWarRoom";
import type { Locale } from "@/i18n/config";
import type { PublicJourneyEntry } from "@/features/portfolio/data";
import { DEFAULT_HACKATHONS, type JourneyTimelineItem } from "@/types/journey";

interface JourneySceneProps {
  locale: Locale;
  journey?: PublicJourneyEntry[];
  timelineItems?: JourneyTimelineItem[];
}

export default function JourneyScene({
  locale,
  timelineItems,
}: JourneySceneProps) {
  const items = timelineItems && timelineItems.length > 0 ? timelineItems : DEFAULT_HACKATHONS;

  return (
    <section
      id="journey"
      className="relative w-full bg-transparent py-24 sm:py-28 px-4 sm:px-8 lg:px-14 border-t border-border overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-accent uppercase tracking-wider mb-3">
              <Trophy className="size-3.5 text-accent" />
              <span>{locale === "fr" ? "// HACKATHONS & COMPÉTITIONS D'ÉLITE" : "// HACKATHONS & COMPETITIVE SPRINTS"}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              {locale === "fr"
                ? "L'Arène des Hackathons : Concevoir & Gagner sous Pression."
                : "The Competitive Arena: Engineering Under Pressure."}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl">
              {locale === "fr"
                ? "Sprints 48H intensifs, modèles d'IA livrés en production, prototypes robotiques autonomes et victoires validées par des jurys d'experts."
                : "Intensive 48H sprints, production machine learning models, autonomous robotics hardware, and victories awarded by expert juries."}
            </p>
          </div>

          <Link
            href={`/${locale}/journey`}
            className="group inline-flex items-center gap-2 self-start md:self-end rounded-full border border-border-strong bg-surface/85 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-primary backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-text-on-accent shadow-sm"
          >
            <span>{locale === "fr" ? "Tous les Hackathons" : "All Hackathons"}</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Hackathon Cards Showcase */}
        <div className="relative mx-auto w-full">
          <HackathonsWarRoom locale={locale} items={items} />
        </div>

      </div>
    </section>
  );
}
