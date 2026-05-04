"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import type { Project } from "@/lib/github";

const CATEGORIES = ["All", "Security", "Full-Stack", "AI/Vision", "Experiments"] as const;
type Category = (typeof CATEGORIES)[number];
type SortKey = "latest" | "stars" | "az";

const SORT_LABELS: Record<SortKey, string> = {
  latest: "Latest Deploy",
  stars: "Star Power",
  az: "Alphabetical",
};

export default function Projects({ projects, stats }: { projects: Project[]; stats: any }) {
  const [cat, setCat] = useState<Category>("All");
  const [sort, setSort] = useState<SortKey>("latest");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => cat === "All" || p.category === cat);
    if (sort === "stars") list = [...list].sort((a, b) => b.stars - a.stars);
    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [projects, cat, sort]);

  return (
    <section id="projects" className="relative py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Elegant Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-3">
            <span className="font-mono text-accent-cyan text-[10px] uppercase tracking-[0.4em]">Work.index()</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Selected <span className="text-text-4">Works.</span>
            </h2>
          </div>
          
          {/* Advanced Filter UI */}
          <div className="flex flex-col md:flex-row gap-3 overflow-hidden">
            <div className="flex p-1 rounded-full glass border border-white/5 overflow-x-auto no-scrollbar max-w-full">
              <div className="flex min-w-max">
                <LayoutGroup id="project-filter">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`relative px-5 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap ${cat === c ? "text-bg-0" : "text-text-4 hover:text-text-2"}`}
                    >
                      {cat === c && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-text-1 rounded-full"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{c}</span>
                    </button>
                  ))}
                </LayoutGroup>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="h-full flex items-center gap-2.5 px-6 py-2 rounded-full glass border border-white/5 text-[9px] font-mono text-text-2 hover:border-cyan/30 transition-all uppercase tracking-widest"
              >
                <span>{SORT_LABELS[sort]}</span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-4 z-50 py-3 rounded-2xl bg-bg-1 border border-white/10 shadow-3xl min-w-[220px]"
                  >
                    {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => { setSort(k); setSortOpen(false); }}
                        className={`w-full px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest transition-colors ${sort === k ? "text-cyan bg-cyan/5" : "text-text-2 hover:bg-white/5"}`}
                      >
                        {SORT_LABELS[k]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Projects Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px] grid-flow-dense">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More / Explore More */}
        <div className="mt-24 flex justify-center">
           <a 
             href={stats.githubUrl} 
             target="_blank"
             className="flex flex-col items-center gap-4 group"
           >
             <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-text-4 group-hover:text-text-2 transition-colors">Explore Archive</span>
             <div className="w-px h-16 bg-text-1/[0.1] group-hover:h-24 transition-all duration-700" />
           </a>
        </div>
      </div>
    </section>
  );
}
