"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import type { Project } from "@/lib/github";

const CATEGORIES = ["All", "Security", "Full-Stack", "AI/Vision", "Experiments"] as const;
type Category = (typeof CATEGORIES)[number];
export default function Projects({ projects, stats }: { projects: Project[]; stats: any }) {
  const [cat, setCat] = useState<Category>("All");

  const filtered = useMemo(() => {
    return projects.filter((p) => cat === "All" || p.category === cat);
  }, [projects, cat]);

  return (
    <section id="projects" className="relative py-24 bg-bg-2 dark:bg-transparent transition-colors duration-500">
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
            <div className="flex p-1 rounded-full bg-bg-1 dark:bg-transparent border border-bg-3 dark:border-[#1e293b] overflow-x-auto no-scrollbar max-w-full">
              <div className="flex min-w-max">
                <LayoutGroup id="project-filter">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`relative px-5 py-1.5 rounded-full text-[9px] font-mono tracking-widest uppercase transition-colors whitespace-nowrap border border-transparent ${
                        cat === c 
                          ? "text-bg-0 dark:text-accent-cyan dark:border-accent-cyan" 
                          : "text-text-2 dark:text-[#64748b] hover:text-text-1"
                      }`}
                    >
                      {cat === c && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-text-1 dark:bg-[#1e3a5f] rounded-full"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 font-bold">{c}</span>
                    </button>
                  ))}
                </LayoutGroup>
              </div>
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
