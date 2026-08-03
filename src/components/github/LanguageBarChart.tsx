"use client";

import { motion } from "framer-motion";
import { Locale } from "@/i18n/config";

type LanguageBarChartProps = {
  languages: { name: string; percentage: number; color: string }[];
  locale: Locale;
};

export default function LanguageBarChart({ languages, locale }: LanguageBarChartProps) {
  // Only take the top 8 languages to avoid clutter
  const topLanguages = languages.slice(0, 8);
  const othersPercentage = languages.slice(8).reduce((acc, lang) => acc + lang.percentage, 0);

  const displayLanguages = [...topLanguages];
  if (othersPercentage > 0) {
    displayLanguages.push({
      name: locale === "fr" ? "Autres" : "Others",
      percentage: othersPercentage,
      color: "#8b949e", // GitHub grey
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const barVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: (percentage: number) => ({
      width: `${percentage}%`,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" as const },
    }),
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid gap-6"
    >
      {displayLanguages.map((lang) => (
        <div key={lang.name} className="relative">
          <div className="flex justify-between items-end mb-2 font-mono text-sm">
            <span className="font-semibold text-text-primary flex items-center gap-2">
              <span 
                className="size-3 rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                style={{ backgroundColor: lang.color }} 
              />
              {lang.name}
            </span>
            <span className="text-text-muted">{lang.percentage.toFixed(1)}%</span>
          </div>
          
          <div className="h-3 w-full bg-surface-raised rounded-full overflow-hidden">
            <motion.div
              custom={lang.percentage}
              variants={barVariants}
              className="h-full rounded-full relative"
              style={{ backgroundColor: lang.color }}
            >
              {/* Subtle glow effect on the bar itself */}
              <div className="absolute inset-0 bg-white/20" />
            </motion.div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
