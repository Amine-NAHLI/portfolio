"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Constants ────────────────────────────────────────────────── */

interface SupabaseSkill {
  id: string;
  name: string;
  category: string;
}

/* ─── Components ─────────────────────────────────────────────── */

const ACCENT_COLOR = "var(--accent-cyan)";

const SkillCard = ({ cat, index }: { cat: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl p-8 border-t-2 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-none dark:hover:bg-white/[0.05] ${cat.gridClass} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ 
        borderTopColor: ACCENT_COLOR,
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Subtle Glow - Refined for both modes */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none rounded-xl blur-3xl"
        style={{ backgroundColor: ACCENT_COLOR }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <h3 
          className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 opacity-70 group-hover:opacity-100 transition-opacity"
          style={{ color: ACCENT_COLOR }}
        >
          {cat.label}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {cat.skills.map((skill: string, sIdx: number) => (
            <React.Fragment key={skill}>
              <span className="text-sm text-text-1 font-semibold tracking-tight">
                {skill}
              </span>
              {sIdx < cat.skills.length - 1 && (
                <span className="text-xs opacity-30 select-none font-light" style={{ color: ACCENT_COLOR }}>/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        div:hover {
          border-top-color: ${ACCENT_COLOR} !important;
          box-shadow: 0 10px 40px -10px ${ACCENT_COLOR}15;
        }
      `}</style>
    </div>
  );
};

export default function SkillsSection({ skills }: { skills: SupabaseSkill[] }) {
  const groupedSkills = useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    skills.forEach(skill => {
      let cat = (skill.category || "General").trim();
      const lowerCat = cat.toLowerCase();
      if (lowerCat.includes("lang") || lowerCat.includes("code")) cat = "Languages";
      else if (lowerCat.includes("front") || lowerCat.includes("ui") || lowerCat.includes("web")) cat = "Frontend";
      else if (lowerCat.includes("back") || lowerCat.includes("server") || lowerCat.includes("api")) cat = "Backend";
      else if (lowerCat.includes("ai") || lowerCat.includes("ml") || lowerCat.includes("intelligence") || lowerCat.includes("vision")) cat = "AI / ML";
      else if (lowerCat.includes("db") || lowerCat.includes("data") || lowerCat.includes("sql") || lowerCat.includes("mongo")) cat = "Database";
      else if (lowerCat.includes("dev") || lowerCat.includes("cloud") || lowerCat.includes("infra") || lowerCat.includes("git")) cat = "DevOps";
      
      const normCat = cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      if (!groups[normCat]) groups[normCat] = [];
      if (!groups[normCat].includes(skill.name)) groups[normCat].push(skill.name);
    });

    const fixedLayout: Record<string, string> = {
      "Languages": "md:col-span-2 md:row-span-1",
      "AI / ML": "md:col-span-1 md:row-span-1",
      "DevOps": "md:col-span-1 md:row-span-1",
      "Frontend": "md:col-span-2 md:row-span-1",
      "Database": "md:col-span-1 md:row-span-1",
      "Backend": "md:col-span-1 md:row-span-2",
    };

    // Get all unique categories from groups
    const allLabels = Object.keys(groups);
    
    return allLabels.map(label => {
      return {
        id: label.toLowerCase().replace(/\s+/g, '-'),
        label,
        gridClass: fixedLayout[label] || "md:col-span-1 md:row-span-1",
        skills: (groups[label] || []).sort()
      };
    }).sort((a, b) => {
      // Prioritize fixed layout items for better aesthetics
      const aFixed = !!fixedLayout[a.label];
      const bFixed = !!fixedLayout[b.label];
      if (aFixed && !bFixed) return -1;
      if (!aFixed && bFixed) return 1;
      return a.label.localeCompare(b.label);
    });
  }, [skills]);

  return (
    <section id="stack" className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-3">Skillset_Matrix_v4.2</span>
           </div>
           <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
              Technical <br /> <span className="text-text-3">Arsenal.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
          {groupedSkills.map((cat, idx) => (
            <SkillCard key={cat.id} cat={cat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
