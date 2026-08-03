"use client";

import { motion } from "framer-motion";
import { Locale } from "@/i18n/config";

type LanguageGraphProps = {
  languages: { name: string; percentage: number; color: string }[];
  locale: Locale;
};

export default function LanguageGraph({ languages, locale }: LanguageGraphProps) {
  const topLanguages = languages.slice(0, 8);
  const othersPercentage = languages.slice(8).reduce((acc, lang) => acc + lang.percentage, 0);

  const displayLanguages = [...topLanguages];
  if (othersPercentage > 0) {
    displayLanguages.push({
      name: locale === "fr" ? "Autres" : "Others",
      percentage: othersPercentage,
      color: "#8b949e",
    });
  }

  // Calculate SVG arc data
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const arcs = displayLanguages.map((lang) => {
    const dashArray = (lang.percentage / 100) * circumference;
    const dashOffset = (cumulativePercent / 100) * circumference;
    cumulativePercent += lang.percentage;

    return {
      ...lang,
      dashArray,
      dashOffset: -dashOffset,
    };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 p-8">
      {/* SVG Donut Chart */}
      <div className="relative w-72 h-72 shrink-0">
        <svg width="100%" height="100%" viewBox="0 0 300 300" className="-rotate-90 drop-shadow-2xl">
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="32"
            className="text-surface-raised"
          />
          
          {/* Language arcs */}
          {arcs.map((lang, i) => (
            <motion.circle
              key={lang.name}
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke={lang.color}
              strokeWidth="32"
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${circumference}`, strokeDashoffset: lang.dashOffset }}
              whileInView={{ strokeDasharray: `${lang.dashArray} ${circumference}` }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
              className="hover:stroke-[36px] transition-all cursor-pointer"
            />
          ))}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-3xl font-display font-bold text-text-primary">
            {displayLanguages.length}
          </span>
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest mt-1">
            {locale === "fr" ? "Langages" : "Languages"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
      >
        {displayLanguages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span 
                className="w-4 h-4 rounded-full shadow-lg group-hover:scale-125 transition-transform" 
                style={{ backgroundColor: lang.color, boxShadow: `0 0 10px ${lang.color}40` }} 
              />
              <span className="font-mono text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                {lang.name}
              </span>
            </div>
            <span className="text-sm font-mono text-text-muted">
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
