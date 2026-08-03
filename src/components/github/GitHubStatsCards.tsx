"use client";

import { motion } from "framer-motion";
import { GitCommit, FolderGit2, Code2 } from "lucide-react";
import TechnicalFrame from "@/components/ui/TechnicalFrame";
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
    <div className="grid gap-5 sm:grid-cols-3">
      {/* Contributions */}
      <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={cardVariants}>
        <TechnicalFrame index="01" label={t.contributions} className="h-full p-6 group">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_rgba(0,218,243,0.3)]"
            >
              <GitCommit className="size-6" />
            </motion.div>
            <div>
              <p className="text-3xl font-semibold text-text-primary">
                {stats.totalContributions}
              </p>
              <p className="text-sm text-text-muted mt-1">{locale === "fr" ? "commits & PRs" : "commits & PRs"}</p>
            </div>
          </div>
        </TechnicalFrame>
      </motion.div>

      {/* Repositories */}
      <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={cardVariants}>
        <TechnicalFrame index="02" label={t.repositories} className="h-full p-6 group">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_rgba(0,218,243,0.3)]"
            >
              <FolderGit2 className="size-6" />
            </motion.div>
            <div>
              <p className="text-3xl font-semibold text-text-primary">
                {stats.totalRepositories}
              </p>
              <p className="text-sm text-text-muted mt-1">{locale === "fr" ? "projets partagés" : "shared projects"}</p>
            </div>
          </div>
        </TechnicalFrame>
      </motion.div>

      {/* Top Language */}
      <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={cardVariants}>
        <TechnicalFrame index="03" label={t.topLanguage} className="h-full p-6 group">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_rgba(0,218,243,0.3)]"
            >
              <Code2 className="size-6" />
            </motion.div>
            <div>
              <p className="text-3xl font-semibold text-text-primary">
                {stats.topLanguage?.name || "N/A"}
              </p>
              {stats.topLanguage && (
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="size-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                    style={{ backgroundColor: stats.topLanguage.color, boxShadow: `0 0 8px ${stats.topLanguage.color}` }}
                  />
                  <p className="text-sm text-text-muted">
                    {stats.topLanguage.percentage.toFixed(1)}% {locale === "fr" ? "du code" : "of code"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TechnicalFrame>
      </motion.div>
    </div>
  );
}
