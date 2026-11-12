"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Award, Briefcase, GraduationCap, MapPin, Trophy } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WindingRoadOverlay from "@/components/ui/WindingRoad";
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
  const roadWrapperRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const rowNodes = containerRef.current.querySelectorAll(".timeline-row");
      if (rowNodes.length > 0) {
        rowNodes.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0.2 },
            {
              opacity: 1,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 86%",
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
      {/* Ambient dual lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] top-1/4 h-[700px] w-[650px] rounded-full bg-[#0E161A] opacity-80 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-2/3 h-[700px] w-[650px] rounded-full bg-[#070A09] opacity-90 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#8FB3A2]/5 blur-[160px]"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 sm:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
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
            className="group inline-flex items-center gap-2 self-start md:self-end rounded-full border border-white/10 bg-[#070A09]/80 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#f3f1f7] backdrop-blur-md transition-all duration-300 hover:border-[#8FB3A2] hover:bg-[#8FB3A2] hover:text-[#000000] hover:shadow-[0_0_25px_rgba(143, 179, 162,0.25)]"
          >
            <span>{locale === "fr" ? "TOUT LE PARCOURS" : "VIEW EXPANDED PATH"}</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Winding Map Route Timeline */}
        <div ref={roadWrapperRef} className="relative mx-auto max-w-5xl py-10 sm:py-14">

          <WindingRoadOverlay
            wrapperRef={roadWrapperRef}
            pinRefs={pinRefs}
            itemCount={items.length}
          />

          {/* Timeline Waypoint Rows */}
          <div className="relative z-10 space-y-20 sm:space-y-28">
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
                  {/* Map Waypoint Pin positioned directly on the winding road apex */}
                  <div
                    ref={(el) => {
                      pinRefs.current[index] = el;
                    }}
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-10 md:size-12 items-center justify-center rounded-full border border-[#8FB3A2]/45 bg-[#080B0A] text-[#8FB3A2] shadow-[0_0_14px_rgba(143, 179, 162,0.16)] transition-[transform,border-color,box-shadow] duration-300 group-hover:scale-110 group-hover:border-[#8FB3A2]/80 group-hover:shadow-[0_0_20px_rgba(143, 179, 162,0.3)] ${
                      isEven ? "left-[88%] md:left-[62%]" : "left-[12%] md:left-[38%]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1.5 rounded-full border border-[#8FB3A2]/15"
                    />
                    <Icon className="size-4 md:size-5 transition-transform group-hover:rotate-6" />
                  </div>

                  {/* Mobile Layout: alternating left/right frameless milestones */}
                  <div
                    className={`flex flex-col md:hidden w-[72%] py-1 ${
                      isEven ? "mr-auto text-left" : "ml-auto text-left"
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#8FB3A2] mb-1">
                      {displayYear}
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-bold text-[#f3f1f7] leading-snug group-hover:text-[#8FB3A2] transition-colors mb-1.5">
                      {title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
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

                  {/* Desktop Left Side */}
                  <div
                    className={`hidden md:flex md:flex-col transition-all duration-300 ${
                      isEven
                        ? "w-[50%] text-right items-end pr-4 lg:pr-6"
                        : "w-[30%] text-right items-end pr-4 lg:pr-6"
                    }`}
                  >
                    {isEven ? (
                      <div className="space-y-2 py-1">
                        <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-[#f3f1f7] group-hover:text-[#8FB3A2] transition-colors leading-snug">
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
                      <div className="py-2">
                        <span className="font-mono text-base lg:text-lg font-bold tracking-wider text-[#8FB3A2]">
                          {displayYear}
                        </span>
                        <div className="text-xs text-[#797681] flex items-center justify-end gap-1 mt-1">
                          <MapPin className="size-3 text-[#797681]" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop Right Side */}
                  <div
                    className={`hidden md:flex md:flex-col transition-all duration-300 ${
                      !isEven
                        ? "w-[50%] text-left items-start pl-4 lg:pl-6"
                        : "w-[30%] text-left items-start pl-4 lg:pl-6"
                    }`}
                  >
                    {!isEven ? (
                      <div className="space-y-2 py-1">
                        <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-[#f3f1f7] group-hover:text-[#8FB3A2] transition-colors leading-snug">
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
                      <div className="py-2">
                        <span className="font-mono text-base lg:text-lg font-bold tracking-wider text-[#8FB3A2]">
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
