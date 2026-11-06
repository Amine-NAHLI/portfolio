"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Award, Briefcase, GraduationCap, MapPin, Trophy } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";
import type { PublicJourneyEntry } from "@/features/portfolio/data";
import { DEFAULT_JOURNEY_TIMELINE, type JourneyTimelineItem, type JourneyTag } from "@/types/journey";

interface JourneySceneProps {
  locale: Locale;
  journey?: PublicJourneyEntry[];
  timelineItems?: JourneyTimelineItem[];
}

function renderJourneyTag(tag: JourneyTag | string, key: string | number, isSmall = false) {
  const name = typeof tag === "string" ? tag : tag.name;
  const color = typeof tag === "string" ? "standard" : tag.color;
  const isCustom = color && color !== "standard" && color.startsWith("#");

  if (isCustom) {
    return (
      <span
        key={key}
        style={{
          color: color,
          borderColor: `${color}45`,
          backgroundColor: `${color}14`,
        }}
        className={`inline-flex items-center rounded-md border font-mono font-medium shadow-[0_0_12px_rgba(0,0,0,0.5)] transition-all hover:scale-105 ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
        }`}
      >
        {name}
      </span>
    );
  }

  return (
    <span
      key={key}
      className={`rounded-md border border-white/[0.08] bg-[#0E161A]/80 font-mono text-[#f3f1f7]/75 transition-colors hover:border-white/20 ${
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      {name}
    </span>
  );
}

function renderAwardBadge(award?: string, awardColor?: string, isSmall = false) {
  if (!award) return null;
  const isCustom = awardColor && awardColor.startsWith("#");
  return (
    <span
      style={
        isCustom
          ? {
              color: awardColor,
              borderColor: `${awardColor}40`,
              backgroundColor: `${awardColor}15`,
            }
          : undefined
      }
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 font-semibold text-amber-300 w-max shadow-sm ${
        isSmall ? "px-2.5 py-0.5 text-[10px] mb-2" : "px-3 py-0.5 text-[11px]"
      }`}
    >
      <Award className="size-3" />
      <span>{award}</span>
    </span>
  );
}

export default function JourneyScene({
  locale,
  timelineItems,
}: JourneySceneProps) {
  const items = timelineItems && timelineItems.length > 0 ? timelineItems : DEFAULT_JOURNEY_TIMELINE;
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Animate line progress as user scrolls through the timeline
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          }
        );
      }

      // Animate timeline nodes
      const items = containerRef.current.querySelectorAll(".timeline-row");
      if (items.length > 0) {
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0.25, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="journey"
      className="relative w-full bg-[#000000] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/[0.08] overflow-hidden scroll-mt-24"
    >
      {/* Exact ambient dual lighting requested by user: Black Pearl (#0E161A) on left, Black Magic (#0B0510) on right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] top-1/4 h-[700px] w-[650px] rounded-full bg-[#0E161A] opacity-80 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-2/3 h-[700px] w-[650px] rounded-full bg-[#0B0510] opacity-90 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#9A71FF]/5 blur-[160px]"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Section Header: Title + Subtitle on Left, "TOUT LE PARCOURS →" Button on Right */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#f3f1f7] leading-tight">
              {locale === "fr"
                ? "Une trajectoire d'ingénierie rigoureuse."
                : "A deliberate engineering trajectory."}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#797681] leading-relaxed max-w-xl">
              {locale === "fr"
                ? "Voici un aperçu de mon profil. Cliquez sur le bouton pour tout explorer."
                : "A preview of key milestones. Click the button to explore the full timeline."}
            </p>
          </div>

          <Link
            href={`/${locale}/journey`}
            className="group inline-flex items-center gap-2 self-start md:self-end rounded-full border border-white/10 bg-[#0B0510]/80 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#f3f1f7] backdrop-blur-md transition-all duration-300 hover:border-[#9A71FF] hover:bg-[#9A71FF] hover:text-[#000000] hover:shadow-[0_0_25px_rgba(154,113,255,0.25)]"
          >
            <span>{locale === "fr" ? "TOUT LE PARCOURS" : "VIEW EXPANDED PATH"}</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Central Alternating Timeline */}
        <div className="relative mx-auto max-w-5xl py-6">
          
          {/* Central Vertical Line (Desktop: centered at 50%, Mobile: left-8) */}
          <div className="absolute top-2 bottom-6 left-8 md:left-1/2 md:-ml-[0.5px] w-[1px] bg-white/10">
            <div
              ref={lineRef}
              className="size-full origin-top bg-gradient-to-b from-[#9A71FF] via-[#9A71FF]/80 to-white/10 shadow-[0_0_12px_rgba(154,113,255,0.5)]"
            />
          </div>

          {/* Timeline Nodes List */}
          <div className="space-y-16 sm:space-y-24">
            {items.map((item, index) => {
              const isEven = index % 2 === 0;
              const isEducation = item.type === "education";
              const title = locale === "fr" ? item.title : (item.titleEn || item.title);
              const categoryLabel = locale === "fr" ? item.categoryLabel : (item.categoryLabelEn || item.categoryLabel);
              const award = locale === "fr" ? item.award : (item.awardEn || item.award);
              const displayYear =
                item.status === "completed" && item.year.toUpperCase().includes("EN COURS")
                  ? locale === "fr"
                    ? item.year.replace(/EN COURS/i, "Terminé")
                    : item.year.replace(/EN COURS/i, "Completed")
                  : item.year;
              const Icon = item.award ? Trophy : isEducation ? GraduationCap : Briefcase;

              return (
                <div
                  key={item.id}
                  className="timeline-row group relative flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  {/* Central Iconic Glowing Node */}
                  <div className="absolute left-8 md:left-1/2 top-4 md:top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#9A71FF]/40 bg-[#0B0510] text-[#9A71FF] shadow-[0_0_20px_rgba(154,113,255,0.3)] transition-all duration-300 group-hover:scale-125 group-hover:border-[#9A71FF] group-hover:shadow-[0_0_30px_rgba(154,113,255,0.6)] z-20">
                    <Icon className="size-5 transition-transform group-hover:rotate-6" />
                  </div>

                  {/* Mobile Layout: everything to the right of left-8 line */}
                  <div className="ml-18 flex flex-col md:hidden pl-3">
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#9A71FF] mb-1">
                      {displayYear}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#f3f1f7] leading-snug group-hover:text-[#9A71FF] transition-colors mb-1.5">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#797681]">
                        {categoryLabel}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs text-[#797681]">
                        {item.organization}
                      </span>
                    </div>
                    {renderAwardBadge(award, item.awardColor, true)}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, tIdx) => renderJourneyTag(tag, tIdx, true))}
                    </div>
                  </div>

                  {/* Desktop Layout: Alternating Sides */}
                  {/* Left Side Container */}
                  <div
                    className={`hidden w-[calc(50%-3.5rem)] md:flex md:flex-col transition-all duration-300 ${
                      isEven ? "text-right items-end pr-2" : "text-right items-end pr-2"
                    }`}
                  >
                    {isEven ? (
                      /* Left has Content (when index is even: 0, 2, 4) */
                      <div className="space-y-2">
                        <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-[#f3f1f7] group-hover:text-[#9A71FF] transition-colors leading-snug">
                          {title}
                        </h3>

                        <div className="flex items-center justify-end gap-2 text-xs">
                          <span className="text-[#797681]">{item.organization}</span>
                          <span className="text-white/20">·</span>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#797681]">
                            {categoryLabel}
                          </span>
                        </div>

                        {award && (
                          <div className="flex justify-end">
                            {renderAwardBadge(award, item.awardColor, false)}
                          </div>
                        )}

                        <div className="flex flex-wrap justify-end gap-1.5 pt-1">
                          {item.tags.map((tag, tIdx) => renderJourneyTag(tag, tIdx, false))}
                        </div>
                      </div>
                    ) : (
                      /* Left has Date (when index is odd: 1, 3) */
                      <div className="py-2">
                        <span className="font-mono text-base lg:text-lg font-bold tracking-wider text-[#9A71FF]">
                          {displayYear}
                        </span>
                        <div className="text-xs text-[#797681] flex items-center justify-end gap-1 mt-1">
                          <MapPin className="size-3 text-[#797681]" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side Container */}
                  <div
                    className={`hidden w-[calc(50%-3.5rem)] md:flex md:flex-col transition-all duration-300 ${
                      !isEven ? "text-left items-start pl-2" : "text-left items-start pl-2"
                    }`}
                  >
                    {!isEven ? (
                      /* Right has Content (when index is odd: 1, 3) */
                      <div className="space-y-2">
                        <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-[#f3f1f7] group-hover:text-[#9A71FF] transition-colors leading-snug">
                          {title}
                        </h3>

                        <div className="flex items-center justify-start gap-2 text-xs">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#797681]">
                            {categoryLabel}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="text-[#797681]">{item.organization}</span>
                        </div>

                        {award && (
                          <div className="flex justify-start">
                            {renderAwardBadge(award, item.awardColor, false)}
                          </div>
                        )}

                        <div className="flex flex-wrap justify-start gap-1.5 pt-1">
                          {item.tags.map((tag, tIdx) => renderJourneyTag(tag, tIdx, false))}
                        </div>
                      </div>
                    ) : (
                      /* Right has Date (when index is even: 0, 2, 4) */
                      <div className="py-2">
                        <span className="font-mono text-base lg:text-lg font-bold tracking-wider text-[#9A71FF]">
                          {displayYear}
                        </span>
                        <div className="text-xs text-[#797681] flex items-center justify-start gap-1 mt-1">
                          <MapPin className="size-3 text-[#797681]" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
