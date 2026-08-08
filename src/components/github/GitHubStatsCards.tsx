"use client";

import { motion } from "framer-motion";
import { GitCommit, FolderGit2, Code2 } from "lucide-react";
import TechCard from "@/components/ui/TechCard";
import type { GitHubStats } from "@/lib/github";
import { Locale } from "@/i18n/config";

type GitHubStatsCardsProps = {
  stats: GitHubStats;
  locale: Locale;
};

export default function GitHubStatsCards({ stats, locale }: GitHubStatsCardsProps) {
  const t = {
    contributions: locale === "fr" ? "Contributions (1 an)" : "Contributions (1 yr)",
    repositories: locale === "fr" ? "Dépôts Publics" : "Public Repositories",
    topLanguage: locale === "fr" ? "Langage Principal" : "Top Language",
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <div className="relative">
      {/* Horizontal Glowing Data-Bus Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2 hidden sm:block pointer-events-none" />

      <div className="grid gap-5 sm:grid-cols-3">
        {/* Contributions */}
        <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={cardVariants} className="relative">
          {/* Node on timeline */}
          <div className="absolute top-1/2 -left-2.5 size-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] hidden sm:block -translate-y-1/2 z-10" />
          
          <TechCard className="h-full">
            <span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[.62rem] text-text-muted/70 group-hover:text-accent transition-colors">01</span>
            <div className="mb-4 font-mono text-xs font-semibold uppercase tracking-[.12em] text-accent">{t.contributions}</div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative size-12 shrink-0 flex items-center justify-center rounded-full bg-accent/5 border border-accent/20 transition-all group-hover:bg-accent/10 group-hover:border-accent/40 group-hover:shadow-[0_0_15px_rgba(0,218,243,0.2)]"
              >
                <GitCommit className="size-5 text-accent" />
              </motion.div>
              <div>
                <p className="text-3xl font-semibold text-text-primary">
                  {stats.totalContributions}
                </p>
                <p className="text-sm text-text-muted mt-1">{locale === "fr" ? "commits & PRs" : "commits & PRs"}</p>
              </div>
            </div>
          </TechCard>
        </motion.div>

        {/* Repositories */}
        <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={cardVariants} className="relative">
          <div className="absolute top-1/2 -left-2.5 size-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] hidden sm:block -translate-y-1/2 z-10" />
          
          <TechCard className="h-full">
            <span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[.62rem] text-text-muted/70 group-hover:text-accent transition-colors">02</span>
            <div className="mb-4 font-mono text-xs font-semibold uppercase tracking-[.12em] text-accent">{t.repositories}</div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="relative size-12 shrink-0 flex items-center justify-center rounded-full bg-accent/5 border border-accent/20 transition-all group-hover:bg-accent/10 group-hover:border-accent/40 group-hover:shadow-[0_0_15px_rgba(0,218,243,0.2)]"
              >
                <FolderGit2 className="size-5 text-accent" />
              </motion.div>
              <div>
                <p className="text-3xl font-semibold text-text-primary">
                  {stats.totalRepositories}
                </p>
                <p className="text-sm text-text-muted mt-1">{locale === "fr" ? "projets partagés" : "shared projects"}</p>
              </div>
            </div>
          </TechCard>
        </motion.div>

        {/* Top Language */}
        <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={cardVariants} className="relative">
          <div className="absolute top-1/2 -left-2.5 size-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] hidden sm:block -translate-y-1/2 z-10" />
          
          <TechCard className="h-full">
            <span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[.62rem] text-text-muted/70 group-hover:text-accent transition-colors">03</span>
            <div className="mb-4 font-mono text-xs font-semibold uppercase tracking-[.12em] text-accent">{t.topLanguage}</div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative size-12 shrink-0 flex items-center justify-center rounded-full"
              >
                {stats.topLanguage && (
                  <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-accent/10 transition-colors group-hover:text-accent/20"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    {/* Progress Circle */}
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={stats.topLanguage.color}
                      strokeWidth="2.5"
                      strokeDasharray={`${stats.topLanguage.percentage}, 100`}
                      initial={{ strokeDasharray: "0, 100" }}
                      whileInView={{ strokeDasharray: `${stats.topLanguage.percentage}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ filter: `drop-shadow(0 0 4px ${stats.topLanguage.color})` }}
                    />
                  </svg>
                )}
                {/* Center icon */}
                <Code2 className="size-4 text-text-primary z-10" />
              </motion.div>
              <div>
                <p className="text-2xl font-semibold text-text-primary">
                  {stats.topLanguage?.name || "N/A"}
                </p>
                {stats.topLanguage && (
                  <p className="text-sm text-text-muted mt-1">
                    {stats.topLanguage.percentage.toFixed(1)}% {locale === "fr" ? "du code" : "of code"}
                  </p>
                )}
              </div>
            </div>
          </TechCard>
        </motion.div>
      </div>
    </div>
  );
}
