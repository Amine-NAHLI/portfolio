"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ProjectCard from "@/components/ui/ProjectCard";

const CATEGORIES = ["All", "Security", "Full-Stack", "AI", "Experiments"] as const;
type Category = (typeof CATEGORIES)[number];

interface SupabaseProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
  created_at: string;
  visible: boolean;
}

export default function Projects({ projects, stats }: { projects: SupabaseProject[]; stats: any }) {
  const [cat, setCat] = useState<string>("All");
  const [isOpen, setIsOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ["All", ...Array.from(cats)].filter(Boolean);
  }, [projects]);

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
          
          {/* Advanced Filter UI - Dropdown Style */}
          <div className="relative z-40">
            <div className="flex flex-col items-end gap-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Filter by Domain</span>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-4 px-6 py-3 rounded-2xl bg-bg-1 dark:bg-[#1e293b]/50 border border-bg-3 dark:border-white/5 hover:border-accent-cyan/50 transition-all min-w-[200px] justify-between"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-text-1">{cat}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-2 w-full bg-bg-1 dark:bg-[#1e293b] border border-bg-3 dark:border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl overflow-hidden"
                  >
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCat(c);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                          cat === c 
                            ? "bg-accent-cyan text-bg-0" 
                            : "text-text-2 hover:bg-white/5 hover:text-text-1"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Projects Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-dense">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <p className="font-mono text-sm text-text-4 uppercase tracking-[0.3em]">No projects in this category yet.</p>
          </div>
        )}

        {/* Explore Archive */}
        <div className="mt-24 flex justify-center">
           <a 
             href={stats.githubUrl || `https://github.com/Amine-NAHLI`} 
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
