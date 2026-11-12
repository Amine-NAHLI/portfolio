"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";
import type { GitHubStats } from "@/lib/github";

interface GitHubContributionsSceneProps {
  locale: Locale;
  stats: GitHubStats;
  githubUrl?: string;
}

type HoveredDay = {
  date: string;
  count: number;
  weekIdx: number;
  dayIdx: number;
};

export default function GitHubContributionsScene({
  locale,
  stats,
  githubUrl = "https://github.com/Amine-NAHLI",
}: GitHubContributionsSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const matrixScrollRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<HoveredDay | null>(null);

  useEffect(() => {
    // Automatically position to the latest commits on load/mobile
    if (matrixScrollRef.current) {
      matrixScrollRef.current.scrollLeft = matrixScrollRef.current.scrollWidth;
    }
  }, [stats.calendarWeeks]);

  useGSAP(
    () => {
      if (typeof window === "undefined" || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const cards = containerRef.current.querySelectorAll(".github-anim-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0.2, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  const getDayColor = (count: number) => {
    if (count === 0) return "bg-white/[0.04]";
    if (count <= 3) return "bg-[#C8F122]/20";
    if (count <= 7) return "bg-[#C8F122]/45";
    if (count <= 14) return "bg-[#C8F122]/75";
    return "bg-[#C8F122] shadow-[0_0_8px_rgba(200,241,34,0.45)]";
  };

  const topLanguages = stats.languages.slice(0, 5);
  const realWeeks = useMemo(
    () => (stats.calendarWeeks && stats.calendarWeeks.length > 0 ? stats.calendarWeeks : null),
    [stats.calendarWeeks]
  );

  const { monthLabels, activeDaysCount, peakDay } = useMemo(() => {
    if (!realWeeks) {
      return { monthLabels: [] as { weekIdx: number; label: string }[], activeDaysCount: 0, peakDay: null as { date: string; count: number } | null };
    }

    const monthFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      timeZone: "UTC",
    });

    const labels: { weekIdx: number; label: string }[] = [];
    let lastMonth = -1;
    let lastLabelWeek = -99;
    let activeDays = 0;
    let maxDay: { date: string; count: number } | null = null;

    realWeeks.forEach((week, wIdx) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const d = new Date(`${firstDay.date}T12:00:00Z`);
        const month = d.getUTCMonth();
        if (month !== lastMonth) {
          lastMonth = month;
          if (wIdx - lastLabelWeek >= 3) {
            const raw = monthFmt.format(d);
            labels.push({
              weekIdx: wIdx,
              label: raw.charAt(0).toUpperCase() + raw.slice(1).replace(/\.$/, ""),
            });
            lastLabelWeek = wIdx;
          }
        }
      }

      for (const day of week.contributionDays) {
        if (day.contributionCount > 0) {
          activeDays += 1;
          if (!maxDay || day.contributionCount > maxDay.count) {
            maxDay = { date: day.date, count: day.contributionCount };
          }
        }
      }
    });

    return { monthLabels: labels, activeDaysCount: activeDays, peakDay: maxDay };
  }, [realWeeks, locale]);

  const formatDayLabel = (dateStr: string) => {
    const parsed = new Date(`${dateStr}T12:00:00Z`);
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(parsed);
  };

  const formatContributionCount = (count: number) => {
    if (count === 0) {
      return locale === "fr" ? "Aucune contribution" : "No contributions";
    }
    return `${count} contribution${count > 1 ? "s" : ""}`;
  };

  const weekdayLabels = locale === "fr"
    ? ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <section
      ref={containerRef}
      id="github"
      className="relative w-full bg-[#0B0B0C] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/[0.08] overflow-hidden scroll-mt-24"
    >
      {/* Ambient Depth Spotlights: Olive-Lime & Midnight Black (#17191E) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-8%] top-1/3 h-[600px] w-[600px] rounded-full bg-[#C8F122]/[0.04] blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-1/2 h-[650px] w-[650px] rounded-full bg-[#121316] opacity-80 blur-[190px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#C8F122]/5 blur-[160px]"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Clean, Non-AI Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#C8F122] block mb-3">
              {locale === "fr" ? "// ACTIVITÉ GITHUB & CODE OUVERT" : "// GITHUB TELEMETRY & OPEN SOURCE"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-tight">
              {locale === "fr" ? "Code en Continu. Contributions Publiques." : "Continuous Code. Public Activity."}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl">
              {locale === "fr"
                ? "Le partage de code et la transparence technique sont au cœur de ma pratique d'ingénieur. Retrouvez ici mes commits et mes dépôts en temps réel."
                : "Code sharing and technical transparency are fundamental to my engineering workflow. Explore real-time commit telemetry and public repositories."}
            </p>
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 self-start md:self-end rounded-full border border-white/10 bg-[#121316] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] backdrop-blur-md transition-all duration-300 hover:border-[#C8F122] hover:bg-[#C8F122] hover:text-[#0B0B0C] hover:shadow-[0_0_25px_rgba(200,241,34,0.25)]"
          >
            <span>GitHub / Amine-NAHLI</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 3 Clean Architectural Metric Cards (No artificial icon pills) */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          
          {/* Card 1: Real Total Contributions */}
          <div className="github-anim-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#121316] p-6 sm:p-7 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-5">
              {locale === "fr" ? "Volume Annuel" : "Annual Volume"}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight">
                {stats.totalContributions}
              </span>
              <span className="text-xs font-mono text-[#C8F122] font-bold uppercase tracking-wider">
                {locale === "fr" ? "Contributions" : "Contributions"}
              </span>
            </div>

            <p className="mt-3 text-xs text-[#A1A1AA] leading-relaxed">
              {locale === "fr"
                ? "Commits validés, revues de code et pull requests documentées sur l'année écoulée."
                : "Verified commits, pull requests, and code reviews over the past 365 days."}
            </p>
          </div>

          {/* Card 2: Real Public Repositories */}
          <div className="github-anim-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#121316] p-6 sm:p-7 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-5">
              {locale === "fr" ? "Dépôts Publics" : "Public Repositories"}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight">
                {stats.totalRepositories}
              </span>
              <span className="text-xs font-mono text-[#C8F122] font-bold uppercase tracking-wider">
                {locale === "fr" ? "Projets Ouverts" : "Open Repos"}
              </span>
            </div>

            <p className="mt-3 text-xs text-[#A1A1AA] leading-relaxed">
              {locale === "fr"
                ? "Systèmes logiciels, modules d'IA et outils d'ingénierie disponibles publiquement."
                : "Software architectures, machine learning pipelines, and public engineering tools."}
            </p>
          </div>

          {/* Card 3: Real Dominant Stack Distribution */}
          <div className="github-anim-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#121316] p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-4">
              <span>{locale === "fr" ? "Stack Dominante" : "Core Tech Stack"}</span>
              <span className="text-[#FFFFFF] font-semibold">{stats.topLanguage?.name || "Python"}</span>
            </div>

            {/* Language distribution bar */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] mb-4">
              {topLanguages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color || "#C8F122",
                  }}
                  className="h-full transition-all duration-500"
                  title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                />
              ))}
            </div>

            {/* Language breakdown pills */}
            <div className="flex flex-wrap gap-2">
              {topLanguages.map((lang) => (
                <div
                  key={lang.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#FFFFFF]/80"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: lang.color || "#C8F122" }}
                  />
                  <span>{lang.name}</span>
                  <span className="text-[#A1A1AA] font-mono">{lang.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 100% Real GitHub Contribution Heatmap Matrix (Only shown when real GitHub data exists) */}
        {realWeeks && (
          <div className="github-anim-card relative rounded-3xl border border-white/10 bg-[#121316] p-5 sm:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF]">
                  {locale === "fr" ? "Matrice de Contributions Réelle (GitHub API)" : "Live GitHub Contribution Matrix"}
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  {locale === "fr"
                    ? `Activité vérifiée jour par jour sur ${realWeeks.length} semaines (@Amine-NAHLI) · ${activeDaysCount} jours actifs${peakDay ? ` · Pic : ${peakDay.count}/jour` : ""}.`
                    : `Verified daily commit history across ${realWeeks.length} weeks (@Amine-NAHLI) · ${activeDaysCount} active days${peakDay ? ` · Peak: ${peakDay.count}/day` : ""}.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4">
                {/* Interactive Live Hovered-Day Telemetry Pill */}
                <div
                  aria-live="polite"
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                    hoveredDay
                      ? "border-[#C8F122]/45 bg-[#C8F122]/10 text-[#FFFFFF]"
                      : "border-white/10 bg-[#0B0B0C]/60 text-[#A1A1AA]"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      hoveredDay
                        ? hoveredDay.count > 0
                          ? "bg-[#C8F122] shadow-[0_0_8px_#C8F122]"
                          : "bg-white/40"
                        : "bg-[#C8F122]/60"
                    }`}
                  />
                  {hoveredDay ? (
                    <span>
                      <strong className="text-[#C8F122]">{formatContributionCount(hoveredDay.count)}</strong>
                      <span className="text-[#A1A1AA]"> · </span>
                      <span>{formatDayLabel(hoveredDay.date)}</span>
                    </span>
                  ) : (
                    <span>
                      {locale === "fr"
                        ? "Survolez un carré pour voir le détail du jour"
                        : "Hover any day square for daily commits"}
                    </span>
                  )}
                </div>

                {/* Heatmap Legend */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA]">
                  <span>{locale === "fr" ? "Moins" : "Less"}</span>
                  <div className="flex items-center gap-1">
                    <span className="size-2.5 rounded-[2px] bg-white/[0.04]" />
                    <span className="size-2.5 rounded-[2px] bg-[#C8F122]/20" />
                    <span className="size-2.5 rounded-[2px] bg-[#C8F122]/45" />
                    <span className="size-2.5 rounded-[2px] bg-[#C8F122]/75" />
                    <span className="size-2.5 rounded-[2px] bg-[#C8F122]" />
                  </div>
                  <span>{locale === "fr" ? "Plus" : "More"}</span>
                </div>
              </div>
            </div>

            {/* Real Full-Width Matrix Grid Container (Horizontal scroll only on small viewports) */}
            <div
              ref={matrixScrollRef}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              onMouseLeave={() => setHoveredDay(null)}
              className="relative overflow-x-auto sm:overflow-visible pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 touch-pan-x overscroll-x-contain scrollbar-thin scrollbar-thumb-[#C8F122]/30 scrollbar-track-white/[0.03]"
            >
              <div className="min-w-[700px] sm:min-w-0 w-full flex gap-2.5 items-stretch">
                {/* Weekday Axis Labels (Mon, Wed, Fri) */}
                <div className="hidden sm:grid grid-rows-7 gap-[3px] lg:gap-1 pt-5 pb-0.5 text-[10px] font-mono text-[#A1A1AA] select-none shrink-0 pr-1">
                  {weekdayLabels.map((label, idx) => (
                    <span key={label} className="flex items-center leading-none">
                      {idx === 1 || idx === 3 || idx === 5 ? label : ""}
                    </span>
                  ))}
                </div>

                {/* 53-Week Proportional Matrix + Month Labels */}
                <div className="relative flex-1 min-w-0">
                  {/* Month Labels Strip */}
                  <div
                    className="grid gap-[3px] lg:gap-1 mb-1.5 h-4 text-[10px] font-mono text-[#A1A1AA] select-none"
                    style={{ gridTemplateColumns: `repeat(${realWeeks.length}, minmax(0, 1fr))` }}
                  >
                    {realWeeks.map((_, wIdx) => {
                      const marker = monthLabels.find((m) => m.weekIdx === wIdx);
                      return (
                        <div key={wIdx} className="relative overflow-visible whitespace-nowrap">
                          {marker ? (
                            <span className="absolute left-0 top-0">{marker.label}</span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Contribution Squares Grid + Instant Floating Hover Tooltip */}
                  <div className="relative">
                    {hoveredDay && (
                      <div
                        role="tooltip"
                        style={{
                          left: `${((hoveredDay.weekIdx + 0.5) / realWeeks.length) * 100}%`,
                          top:
                            hoveredDay.dayIdx < 2
                              ? `${((hoveredDay.dayIdx + 1) / 7) * 100}%`
                              : `${(hoveredDay.dayIdx / 7) * 100}%`,
                          transform: `translate(${
                            hoveredDay.weekIdx < 6
                              ? "0%"
                              : hoveredDay.weekIdx > realWeeks.length - 7
                                ? "-100%"
                                : "-50%"
                          }, ${hoveredDay.dayIdx < 2 ? "8px" : "calc(-100% - 8px)"})`,
                        }}
                        className="pointer-events-none absolute z-30 whitespace-nowrap rounded-xl border border-[#C8F122]/50 bg-[#0B0B0C]/95 px-3 py-1.5 shadow-2xl shadow-black/80 backdrop-blur-md"
                      >
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="font-bold text-[#C8F122]">
                            {formatContributionCount(hoveredDay.count)}
                          </span>
                          <span className="text-[#A1A1AA]">·</span>
                          <span className="text-[#FFFFFF]">{formatDayLabel(hoveredDay.date)}</span>
                        </div>
                      </div>
                    )}

                    <div
                      className="grid gap-[3px] lg:gap-1"
                      style={{ gridTemplateColumns: `repeat(${realWeeks.length}, minmax(0, 1fr))` }}
                    >
                      {realWeeks.map((week, wIdx) => (
                        <div key={wIdx} className="grid grid-rows-7 gap-[3px] lg:gap-1">
                          {week.contributionDays.map((day) => {
                            const dayIdx = new Date(`${day.date}T12:00:00Z`).getUTCDay();
                            const isHovered = hoveredDay?.date === day.date;
                            const labelText = `${formatContributionCount(day.contributionCount)} · ${formatDayLabel(day.date)}`;

                            return (
                              <button
                                key={day.date}
                                type="button"
                                style={{ gridRowStart: dayIdx + 1 }}
                                onMouseEnter={() =>
                                  setHoveredDay({
                                    date: day.date,
                                    count: day.contributionCount,
                                    weekIdx: wIdx,
                                    dayIdx,
                                  })
                                }
                                onFocus={() =>
                                  setHoveredDay({
                                    date: day.date,
                                    count: day.contributionCount,
                                    weekIdx: wIdx,
                                    dayIdx,
                                  })
                                }
                                onBlur={() => setHoveredDay(null)}
                                aria-label={labelText}
                                title={labelText}
                                className={`w-full aspect-square rounded-[2.5px] sm:rounded-[3px] transition-transform duration-150 cursor-pointer focus-visible:outline-none ${getDayColor(
                                  day.contributionCount
                                )} ${
                                  isHovered
                                    ? "relative z-20 scale-125 ring-2 ring-[#FFFFFF]"
                                    : "hover:scale-125 hover:z-20"
                                }`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Touch Helper */}
            <div className="flex sm:hidden items-center justify-between text-[11px] font-mono text-[#A1A1AA] mt-2 pt-2 border-t border-white/[0.05]">
              <span>← {locale === "fr" ? "Semaines passées" : "Past weeks"}</span>
              <span className="text-[#C8F122] font-medium">
                {locale === "fr" ? `Glisser (${realWeeks.length} sem.)` : `Swipe (${realWeeks.length} wks)`}
              </span>
              <span>{locale === "fr" ? "Récentes →" : "Recent →"}</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
