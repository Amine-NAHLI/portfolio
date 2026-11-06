"use client";

import { useRef, useEffect } from "react";
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

export default function GitHubContributionsScene({
  locale,
  stats,
  githubUrl = "https://github.com/Amine-NAHLI",
}: GitHubContributionsSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const matrixScrollRef = useRef<HTMLDivElement>(null);

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
    if (count <= 3) return "bg-emerald-900/60";
    if (count <= 7) return "bg-emerald-600/70";
    if (count <= 14) return "bg-emerald-500/90";
    return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]";
  };

  const topLanguages = stats.languages.slice(0, 5);
  const realWeeks = stats.calendarWeeks && stats.calendarWeeks.length > 0 ? stats.calendarWeeks : null;

  return (
    <section
      ref={containerRef}
      id="github"
      className="relative w-full bg-[#000000] py-28 px-4 sm:px-8 lg:px-14 border-t border-white/[0.08] overflow-hidden scroll-mt-24"
    >
      {/* Ambient Depth Spotlights: Emerald & Cool Slate (#0E161A) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-8%] top-1/3 h-[600px] w-[600px] rounded-full bg-emerald-950/20 blur-[180px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-1/2 h-[650px] w-[650px] rounded-full bg-[#0B0510] opacity-80 blur-[190px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#9A71FF]/5 blur-[160px]"
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Clean, Non-AI Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#9A71FF] block mb-3">
              {locale === "fr" ? "// ACTIVITÉ GITHUB & CODE OUVERT" : "// GITHUB TELEMETRY & OPEN SOURCE"}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#f3f1f7] leading-tight">
              {locale === "fr" ? "Code en Continu. Contributions Publiques." : "Continuous Code. Public Activity."}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#797681] leading-relaxed max-w-2xl">
              {locale === "fr"
                ? "Le partage de code et la transparence technique sont au cœur de ma pratique d'ingénieur. Retrouvez ici mes commits et mes dépôts en temps réel."
                : "Code sharing and technical transparency are fundamental to my engineering workflow. Explore real-time commit telemetry and public repositories."}
            </p>
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 self-start md:self-end rounded-full border border-white/10 bg-[#0B0510] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#f3f1f7] backdrop-blur-md transition-all duration-300 hover:border-[#9A71FF] hover:bg-[#9A71FF] hover:text-[#000000] hover:shadow-[0_0_25px_rgba(154,113,255,0.25)]"
          >
            <span>GitHub / Amine-NAHLI</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 3 Clean Architectural Metric Cards (No artificial icon pills) */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          
          {/* Card 1: Real Total Contributions */}
          <div className="github-anim-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] p-6 sm:p-7 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#797681] mb-5">
              {locale === "fr" ? "Volume Annuel" : "Annual Volume"}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-black text-[#f3f1f7] tracking-tight">
                {stats.totalContributions}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {locale === "fr" ? "Contributions" : "Contributions"}
              </span>
            </div>

            <p className="mt-3 text-xs text-[#797681] leading-relaxed">
              {locale === "fr"
                ? "Commits validés, revues de code et pull requests documentées sur l'année écoulée."
                : "Verified commits, pull requests, and code reviews over the past 365 days."}
            </p>
          </div>

          {/* Card 2: Real Public Repositories */}
          <div className="github-anim-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] p-6 sm:p-7 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#797681] mb-5">
              {locale === "fr" ? "Dépôts Publics" : "Public Repositories"}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-black text-[#f3f1f7] tracking-tight">
                {stats.totalRepositories}
              </span>
              <span className="text-xs font-mono text-[#9A71FF] font-bold uppercase tracking-wider">
                {locale === "fr" ? "Projets Ouverts" : "Open Repos"}
              </span>
            </div>

            <p className="mt-3 text-xs text-[#797681] leading-relaxed">
              {locale === "fr"
                ? "Systèmes logiciels, modules d'IA et outils d'ingénierie disponibles publiquement."
                : "Software architectures, machine learning pipelines, and public engineering tools."}
            </p>
          </div>

          {/* Card 3: Real Dominant Stack Distribution */}
          <div className="github-anim-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#797681] mb-4">
              <span>{locale === "fr" ? "Stack Dominante" : "Core Tech Stack"}</span>
              <span className="text-[#f3f1f7] font-semibold">{stats.topLanguage?.name || "Python"}</span>
            </div>

            {/* Language distribution bar */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] mb-4">
              {topLanguages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color || "#9A71FF",
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#f3f1f7]/80"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: lang.color || "#9A71FF" }}
                  />
                  <span>{lang.name}</span>
                  <span className="text-[#797681] font-mono">{lang.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 100% Real GitHub Contribution Heatmap Matrix (Only shown when real GitHub data exists) */}
        {realWeeks && (
          <div className="github-anim-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0510] p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#f3f1f7]">
                  {locale === "fr" ? "Matrice de Contributions Réelle (GitHub API)" : "Live GitHub Contribution Matrix"}
                </h3>
                <p className="text-xs text-[#797681]">
                  {locale === "fr"
                    ? `Activité enregistrée jour par jour sur les ${realWeeks.length} dernières semaines (@Amine-NAHLI).`
                    : `Verified daily commit history over the past ${realWeeks.length} weeks (@Amine-NAHLI).`}
                </p>
              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#797681] self-start sm:self-auto">
                <span>{locale === "fr" ? "Moins" : "Less"}</span>
                <div className="flex items-center gap-1">
                  <span className="size-2.5 rounded-[2px] bg-white/[0.04]" />
                  <span className="size-2.5 rounded-[2px] bg-emerald-900/60" />
                  <span className="size-2.5 rounded-[2px] bg-emerald-600/70" />
                  <span className="size-2.5 rounded-[2px] bg-emerald-500/90" />
                  <span className="size-2.5 rounded-[2px] bg-emerald-400" />
                </div>
                <span>{locale === "fr" ? "Plus" : "More"}</span>
              </div>
            </div>

            {/* Real Matrix Grid Container (Scrollable on mobile with focus on recent weeks) */}
            <div
              ref={matrixScrollRef}
              className="overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x overscroll-x-contain scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-white/[0.03]"
            >
              <div className="min-w-[760px] flex gap-[3.5px] py-1">
                {realWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3.5px]">
                    {week.contributionDays.map((day) => (
                      <div
                        key={day.date}
                        className={`size-[11.5px] rounded-[2.5px] transition-all duration-200 hover:scale-125 cursor-pointer ${getDayColor(
                          day.contributionCount
                        )}`}
                        title={
                          locale === "fr"
                            ? `${day.contributionCount} contribution${day.contributionCount > 1 ? "s" : ""} le ${day.date}`
                            : `${day.contributionCount} contribution${day.contributionCount > 1 ? "s" : ""} on ${day.date}`
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Touch Helper */}
            <div className="flex sm:hidden items-center justify-between text-[11px] font-mono text-[#797681] mt-2 pt-2 border-t border-white/[0.05]">
              <span>← Semaines passées</span>
              <span className="text-emerald-400 font-medium">Glisser pour explorer (53 sem.)</span>
              <span>Récentes →</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
