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

  // Calculate 100 dots proportionally
  let dots: typeof displayLanguages = [];
  displayLanguages.forEach((lang) => {
    const count = Math.round(lang.percentage);
    for (let i = 0; i < count; i++) {
      dots.push(lang);
    }
  });

  // Ensure exactly 100 dots
  if (dots.length > 100) {
    dots = dots.slice(0, 100);
  }
  while (dots.length < 100) {
    // pad with top language if rounding fell short
    dots.push(displayLanguages[0]);
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full p-2">
      {/* 10x10 Dot Matrix */}
      <div className="shrink-0 p-5 rounded-[1.5rem] bg-bg-page/40 border border-border/50 shadow-inner">
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
          {dots.map((lang, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.4, 
                delay: i * 0.005, 
                ease: "easeOut" 
              }}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full hover:scale-150 transition-transform cursor-pointer"
              style={{ 
                backgroundColor: lang.color,
                boxShadow: `0 0 6px ${lang.color}60`
              }}
              title={lang.name}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-widest">
          <span>{displayLanguages.length} {locale === "fr" ? "Langages" : "Languages"}</span>
          <span>1 Dot = 1%</span>
        </div>
      </div>

      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-2 gap-x-4 gap-y-3 w-full"
      >
        {displayLanguages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-2 overflow-hidden">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform" 
                style={{ backgroundColor: lang.color, boxShadow: `0 0 8px ${lang.color}80` }} 
              />
              <span className="font-mono text-xs font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                {lang.name}
              </span>
            </div>
            <span className="text-xs font-mono text-text-muted ml-2">
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
