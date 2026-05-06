"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

/* ─── Constants ────────────────────────────────────────────────── */

const CATEGORY_STYLES: Record<string, string> = {
  "Languages": "#58a6ff",
  "Frontend": "#3fb950",
  "Backend": "#f78166",
  "AI / ML": "#bc8cff",
  "Database": "#e3b341",
  "DevOps": "#39c5cf",
  "Security": "#FF5252",
  "General": "#8b949e"
};

interface SupabaseSkill {
  id: string;
  name: string;
  category: string;
}

/* ─── Components ─────────────────────────────────────────────── */

const SkillCard = ({ cat, index }: { cat: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.06, 
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      className={`group relative bg-white/[0.02] rounded-xl p-7 border-t border-transparent transition-all duration-300 hover:bg-white/[0.05] ${cat.gridClass}`}
      style={{ 
        borderTopColor: `${cat.color}66`, // 40% opacity
      }}
    >
      {/* Hover Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-xl blur-2xl"
        style={{ backgroundColor: cat.color }}
      />

      <div className="relative z-10">
        <h3 
          className="text-[11px] font-black uppercase tracking-[0.15em] mb-6 opacity-60 transition-opacity group-hover:opacity-100"
          style={{ color: cat.color }}
        >
          {cat.label}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {cat.skills.map((skill: string, sIdx: number) => (
            <React.Fragment key={skill}>
              <span className="text-sm text-[#e8e8e8] font-medium tracking-tight">
                {skill}
              </span>
              {sIdx < cat.skills.length - 1 && (
                <span className="text-[10px] opacity-30 select-none" style={{ color: cat.color }}>/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        div:hover {
          border-top-color: ${cat.color} !important;
          box-shadow: 0 4px 30px ${cat.color}10;
        }
      `}</style>
    </motion.div>
  );
};

export default function SkillsSection({ skills }: { skills: SupabaseSkill[] }) {
  const groupedSkills = useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    skills.forEach(skill => {
      let cat = (skill.category || "General").trim();
      
      // Normalization
      const lowerCat = cat.toLowerCase();
      if (lowerCat.includes("lang") || lowerCat.includes("code")) cat = "Languages";
      else if (lowerCat.includes("front") || lowerCat.includes("ui") || lowerCat.includes("web")) cat = "Frontend";
      else if (lowerCat.includes("back") || lowerCat.includes("server") || lowerCat.includes("api")) cat = "Backend";
      else if (lowerCat.includes("ai") || lowerCat.includes("ml") || lowerCat.includes("intelligence") || lowerCat.includes("vision")) cat = "AI / ML";
      else if (lowerCat.includes("db") || lowerCat.includes("data") || lowerCat.includes("sql") || lowerCat.includes("mongo")) cat = "Database";
      else if (lowerCat.includes("dev") || lowerCat.includes("cloud") || lowerCat.includes("infra") || lowerCat.includes("git")) cat = "DevOps";
      else if (lowerCat.includes("sec") || lowerCat.includes("cyber")) cat = "Security";
      
      const normCat = cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

      if (!groups[normCat]) groups[normCat] = [];
      if (!groups[normCat].includes(skill.name)) groups[normCat].push(skill.name);
    });

    const categories = [
      { id: "Languages", gridClass: "md:col-span-2" },
      { id: "AI / ML", gridClass: "md:col-span-1" },
      { id: "DevOps", gridClass: "md:col-span-1" },
      { id: "Frontend", gridClass: "md:col-span-2" },
      { id: "Database", gridClass: "md:col-span-1" },
      { id: "Backend", gridClass: "md:col-span-1 md:row-span-2" },
    ];

    return categories.map(config => {
      const label = config.id;
      return {
        ...config,
        label,
        color: CATEGORY_STYLES[label] || CATEGORY_STYLES["General"],
        skills: (groups[label] || []).sort()
      };
    });
  }, [skills]);

  return (
    <section id="stack" className="py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
          {groupedSkills.map((cat, idx) => (
            <SkillCard key={cat.id} cat={cat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
