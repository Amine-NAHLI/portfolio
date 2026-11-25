"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/config";
import type { GitHubStats } from "@/lib/github";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { DotPattern } from "@/components/magicui/dot-pattern";

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
  formattedDate: string;
  countText: string;
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
    if (count === 0) return "bg-text-primary/[0.07] dark:bg-white/[0.04]";
    if (count <= 3) return "bg-[#748D92]/45 dark:bg-[#C8F122]/20";
    if (count <= 7) return "bg-accent/45";
    if (count <= 14) return "bg-accent/75";
    return "bg-accent shadow-[0_0_8px_color-mix(in_srgb,var(--accent)_45%,transparent)]";
  };

  const topLanguages = stats.languages.slice(0, 5);
  const realWeeks = useMemo(
    () => (stats.calendarWeeks && stats.calendarWeeks.length > 0 ? stats.calendarWeeks : null),
    [stats.calendarWeeks]
  );

  const { monthLabels, activeDaysCount, peakDay, enrichedWeeks } = useMemo(() => {
    if (!realWeeks) {
      return {
        monthLabels: [] as { weekIdx: number; label: string }[],
        activeDaysCount: 0,
        peakDay: null as { date: string; count: number } | null,
        enrichedWeeks: [] as {
          contributionDays: {
            date: string;
            count: number;
            dayIdx: number;
            labelText: string;
            formattedDate: string;
            countText: string;
            colorClass: string;
          }[];
        }[],
      };
    }

    const monthFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      timeZone: "UTC",
    });

    const dayFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

    const labels: { weekIdx: number; label: string }[] = [];
    let lastMonth = -1;
    let lastLabelWeek = -99;
    let activeDays = 0;
    let maxDay: { date: string; count: number } | null = null;

    const enriched = realWeeks.map((week, wIdx) => {
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

      const days = week.contributionDays.map((day) => {
        const parsed = new Date(`${day.date}T12:00:00Z`);
        const dayIdx = parsed.getUTCDay();
        if (day.contributionCount > 0) {
          activeDays += 1;
          if (!maxDay || day.contributionCount > maxDay.count) {
            maxDay = { date: day.date, count: day.contributionCount };
          }
        }
        const formattedDate = dayFmt.format(parsed);
        const countText =
          day.contributionCount === 0
            ? (locale === "fr" ? "Aucune contribution" : "No contributions")
            : `${day.contributionCount} contribution${day.contributionCount > 1 ? "s" : ""}`;

        return {
          date: day.date,
          count: day.contributionCount,
          dayIdx,
          labelText: `${countText} · ${formattedDate}`,
          formattedDate,
          countText,
          colorClass: getDayColor(day.contributionCount),
        };
      });

      return { contributionDays: days };
    });

    return {
      monthLabels: labels,
      activeDaysCount: activeDays,
      peakDay: maxDay,
      enrichedWeeks: enriched,
    };
  }, [realWeeks, locale]);

  const weekdayLabels = locale === "fr"
    ? ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <section
      ref={containerRef}
      id="github"
      className="relative w-full bg-transparent py-28 px-4 sm:px-8 lg:px-14 border-t border-border/30 overflow-hidden scroll-mt-24"
    >
      {/* Architectural Dot Pattern (Magic UI) */}
      <DotPattern
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className="fill-white/[0.04] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_50%,transparent_100%)] -z-10"
      />

      {/* Ambient Depth Spotlights (subtle depth without washing out darks) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-8%] top-1/3 h-[500px] w-[500px] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-1/2 h-[550px] w-[550px] rounded-full opacity-35"
        style={{
          background: "radial-gradient(circle, var(--surface) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-35"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 6%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Clean Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-accent block mb-3 font-semibold">
              {locale === "fr" ? "// ACTIVITÉ GITHUB & CODE OUVERT" : "// GITHUB TELEMETRY & OPEN SOURCE"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              {locale === "fr" ? "Code en Continu. Contributions Publiques." : "Continuous Code. Public Activity."}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl">
              {locale === "fr"
                ? "Le partage de code et la transparence technique sont au cœur de ma pratique d'ingénieur. Retrouvez ici mes commits et mes dépôts en temps réel."
                : "Code sharing and technical transparency are fundamental to my engineering workflow. Explore real-time commit telemetry and public repositories."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <Link
              href={`/${locale}/contributions`}
              className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-text-primary backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-text-on-accent hover:shadow-[0_0_25px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
            >
              <span>{locale === "fr" ? "Dossier Complet Contributions" : "Full Contributions Dossier"}</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-subtle/50 px-5 py-3 font-mono text-xs font-medium text-text-muted transition-colors hover:text-text-primary hover:border-border-strong"
            >
              <span>GitHub / Amine-NAHLI</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Clean Architectural Metric Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          
          {/* Card 1: Real Total Contributions */}
          <div className="github-anim-card group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-7 shadow-xl hover:border-accent/40 transition-colors duration-300">
            <div className="text-xs font-mono uppercase tracking-wider text-text-muted mb-5">
              {locale === "fr" ? "Volume Annuel" : "Annual Volume"}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
                <NumberTicker value={stats.totalContributions} />
              </span>
              <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
                {locale === "fr" ? "Contributions" : "Contributions"}
              </span>
            </div>

            <p className="mt-3 text-xs text-text-secondary leading-relaxed">
              {locale === "fr"
                ? "Commits validés, revues de code et pull requests documentées sur l'année écoulée."
                : "Verified commits, pull requests, and code reviews over the past 365 days."}
            </p>
          </div>

          {/* Card 2: Real Public Repositories */}
          <div className="github-anim-card group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-7 shadow-xl hover:border-accent/40 transition-colors duration-300">
            <div className="text-xs font-mono uppercase tracking-wider text-text-muted mb-5">
              {locale === "fr" ? "Dépôts Publics" : "Public Repositories"}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
                <NumberTicker value={stats.totalRepositories} />
              </span>
              <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
                {locale === "fr" ? "Projets Ouverts" : "Open Repos"}
              </span>
            </div>

            <p className="mt-3 text-xs text-text-secondary leading-relaxed">
              {locale === "fr"
                ? "Systèmes logiciels, modules d'IA et outils d'ingénierie disponibles publiquement."
                : "Software architectures, machine learning pipelines, and public engineering tools."}
            </p>
          </div>

          {/* Card 3: Real Dominant Stack Distribution */}
          <div className="github-anim-card group relative overflow-hidden rounded-3xl border border-border-strong bg-surface p-6 sm:p-7 shadow-xl hover:border-accent/40 transition-colors duration-300">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
              <span>{locale === "fr" ? "Stack Dominante" : "Core Tech Stack"}</span>
              <span className="text-text-primary font-semibold">{stats.topLanguage?.name || "Python"}</span>
            </div>

            {/* Language distribution bar */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-text-primary/[0.08] mb-4">
              {topLanguages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color || "var(--accent)",
                  }}
                  className="h-full transition-all duration-500"
                  title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                />
              ))}
            </div>

            {/* Language breakdown in pure typography */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
              {topLanguages.map((lang, idx) => (
                <div
                  key={lang.name}
                  className="inline-flex items-center gap-1.5"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: lang.color || "var(--accent)" }}
                  />
                  <span className="font-semibold italic text-text-primary">{lang.name}</span>
                  <span className="text-text-muted not-italic">{lang.percentage.toFixed(0)}%</span>
                  {idx < topLanguages.length - 1 && (
                    <span className="opacity-30 ml-2 not-italic text-text-muted">·</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 100% Real GitHub Contribution Heatmap Matrix */}
        {realWeeks && (
          <div className="github-anim-card relative rounded-3xl border border-border-strong bg-surface p-5 sm:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary">
                  {locale === "fr" ? "Matrice de Contributions Réelle (GitHub API)" : "Live GitHub Contribution Matrix"}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
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
                      ? "border-accent/45 bg-accent/10 text-text-primary"
                      : "border-border bg-surface-subtle text-text-secondary"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      hoveredDay
                        ? hoveredDay.count > 0
                          ? "bg-accent shadow-[0_0_8px_var(--accent)]"
                          : "bg-text-muted/50"
                        : "bg-accent/65"
                    }`}
                  />
                  {hoveredDay ? (
                    <span>
                      <strong className="text-accent">{hoveredDay.countText}</strong>
                      <span className="text-text-muted"> · </span>
                      <span>{hoveredDay.formattedDate}</span>
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
                <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                  <span>{locale === "fr" ? "Moins" : "Less"}</span>
                  <div className="flex items-center gap-1">
                    <span className="size-2.5 rounded-[2px] bg-text-primary/[0.07] dark:bg-white/[0.04]" />
                    <span className="size-2.5 rounded-[2px] bg-[#748D92]/45 dark:bg-[#C8F122]/20" />
                    <span className="size-2.5 rounded-[2px] bg-accent/45" />
                    <span className="size-2.5 rounded-[2px] bg-accent/75" />
                    <span className="size-2.5 rounded-[2px] bg-accent" />
                  </div>
                  <span>{locale === "fr" ? "Plus" : "More"}</span>
                </div>
              </div>
            </div>

            {/* Real Full-Width Matrix Grid Container */}
            <div
              ref={matrixScrollRef}
              onMouseLeave={() => setHoveredDay(null)}
              className="relative overflow-x-auto sm:overflow-visible pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 touch-pan-x overscroll-x-contain"
            >
              <div className="min-w-[700px] sm:min-w-0 w-full flex gap-2.5 items-stretch">
                {/* Weekday Axis Labels (Mon, Wed, Fri) */}
                <div className="hidden sm:grid grid-rows-7 gap-[3px] lg:gap-1 pt-5 pb-0.5 text-[10px] font-mono text-text-muted select-none shrink-0 pr-1">
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
                    className="grid gap-[3px] lg:gap-1 mb-1.5 h-4 text-[10px] font-mono text-text-muted select-none"
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
                        className="pointer-events-none absolute z-30 whitespace-nowrap rounded-xl border border-accent/55 bg-surface-raised/95 px-3 py-1.5 shadow-xl backdrop-blur-md"
                      >
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="font-bold text-accent">
                            {hoveredDay.countText}
                          </span>
                          <span className="text-text-muted">·</span>
                          <span className="text-text-primary">{hoveredDay.formattedDate}</span>
                        </div>
                      </div>
                    )}

                    <div
                      className="grid gap-[3px] lg:gap-1"
                      style={{ gridTemplateColumns: `repeat(${realWeeks.length}, minmax(0, 1fr))` }}
                    >
                      {enrichedWeeks.map((week, wIdx) => (
                        <div key={wIdx} className="grid grid-rows-7 gap-[3px] lg:gap-1">
                          {week.contributionDays.map((day) => {
                            const isHovered = hoveredDay?.date === day.date;

                            return (
                              <button
                                key={day.date}
                                type="button"
                                style={{ gridRowStart: day.dayIdx + 1 }}
                                onMouseEnter={() =>
                                  setHoveredDay({
                                    date: day.date,
                                    count: day.count,
                                    weekIdx: wIdx,
                                    dayIdx: day.dayIdx,
                                    formattedDate: day.formattedDate,
                                    countText: day.countText,
                                  })
                                }
                                onFocus={() =>
                                  setHoveredDay({
                                    date: day.date,
                                    count: day.count,
                                    weekIdx: wIdx,
                                    dayIdx: day.dayIdx,
                                    formattedDate: day.formattedDate,
                                    countText: day.countText,
                                  })
                                }
                                onBlur={() => setHoveredDay(null)}
                                aria-label={day.labelText}
                                title={day.labelText}
                                className={`w-full aspect-square rounded-[2.5px] sm:rounded-[3px] transition-transform duration-150 cursor-pointer focus-visible:outline-none ${day.colorClass} ${
                                  isHovered
                                    ? "relative z-20 scale-125 ring-2 ring-text-primary"
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
            <div className="flex sm:hidden items-center justify-between text-[11px] font-mono text-text-muted mt-2 pt-2 border-t border-border">
              <span>← {locale === "fr" ? "Semaines passées" : "Past weeks"}</span>
              <span className="text-accent font-medium">
                {locale === "fr" ? `Glisser (${realWeeks.length} sem.)` : `Swipe (${realWeeks.length} wks)`}
              </span>
              <span>{locale === "fr" ? "Récentes →" : "Recent →"}</span>
            </div>
          </div>
        )}

        {/* Bottom Explorer Link */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border pt-6">
          <Link
            href={`/${locale}/contributions`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-text-primary transition-colors font-mono"
          >
            <span>
              {locale === "fr"
                ? "Explorer la page dédiée aux contributions & dépôts publics"
                : "Explore dedicated contributions & open-source repositories"}
            </span>
            <ArrowUpRight className="size-4" />
          </Link>
          <span className="text-xs text-text-muted font-medium font-mono">
            {locale === "fr" ? "Synchronisé via l'API GraphQL GitHub" : "Synchronized via GitHub GraphQL API"}
          </span>
        </div>

      </div>
    </section>
  );
}
