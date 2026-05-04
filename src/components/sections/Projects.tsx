"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import { stackFilter } from "@/lib/stackFilter";
import type { Project } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORIES = ["All", "Security", "Full-Stack", "AI/Vision", "Experiments"] as const;
type Category = (typeof CATEGORIES)[number];
type SortKey  = "latest" | "stars" | "az";

const SORT_LABELS: Record<SortKey, string> = {
  latest: "Latest",
  stars:  "Most Stars",
  az:     "A → Z",
};

interface ProjectsProps {
  projects: Project[];
  stats: { totalRepos: number; categories: string[] };
}

export default function Projects({ projects, stats }: ProjectsProps) {
  const [cat, setCat]         = useState<Category>("All");
  const [sort, setSort]       = useState<SortKey>("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [techFilter, setTechFilter] = useState<string | null>(null);

  /* Listen for constellation filter */
  useEffect(() => {
    const unsub = stackFilter.subscribe(setTechFilter);
    return unsub;
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => cat === "All" || p.category === cat);
    if (techFilter) list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === techFilter.toLowerCase()));
    if (sort === "stars")  list = [...list].sort((a, b) => b.stars - a.stars);
    if (sort === "az")     list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [projects, cat, sort, techFilter]);

  return (
    <section id="projects" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          number="02"
          label="Projects"
          heading={<>What I&apos;ve <span className="gradient-text">built.</span></>}
          subheading={`${stats.totalRepos} repositories across ${stats.categories.length} domains — live from GitHub.`}
        />

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {/* Category tabs */}
          <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((c) => {
              const n = counts[c] || 0;
              if (c !== "All" && n === 0) return null;
              const isActive = cat === c;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setCat(c)}
                  className="relative px-4 py-1.5 rounded-full text-[12px] font-mono tracking-wider transition-all duration-[250ms]"
                  style={{
                    background: isActive ? "#06b6d4" : "transparent",
                    color:      isActive ? "#030712" : "#64748b",
                    border:     isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {c}
                  <span className="ml-1.5 text-[10px] opacity-55">{n}</span>
                </button>
              );
            })}
          </div>

          {/* Tech filter badge */}
          {techFilter && (
            <button
              onClick={() => { setTechFilter(null); stackFilter.emit(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono bg-accent-indigo/10 border border-accent-indigo/30 text-accent-indigo hover:bg-accent-indigo/20 transition-colors"
            >
              tech: {techFilter} ✕
            </button>
          )}

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-mono text-text-muted border border-white/8 hover:border-white/16 transition-colors"
            >
              {SORT_LABELS[sort]}
              <ChevronDown size={12} aria-hidden="true" className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="absolute right-0 top-full mt-2 z-20 rounded-[10px] bg-bg-highest border border-white/10 py-1 shadow-2xl min-w-[130px]"
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => { setSort(k); setSortOpen(false); }}
                      className="w-full px-4 py-2 text-left text-[12px] font-mono text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                      style={{ color: sort === k ? "#06b6d4" : undefined }}
                    >
                      {SORT_LABELS[k]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: i * 0.035, ease: EASE }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-24 space-y-4"
            >
              <p className="font-mono text-text-faint text-sm">
                <span className="text-accent-cyan/40">// </span>no projects matched these filters
              </p>
              <button
                onClick={() => { setCat("All"); setTechFilter(null); stackFilter.emit(null); }}
                className="text-[12px] font-mono text-accent-cyan/60 hover:text-accent-cyan underline underline-offset-4 transition-colors"
              >
                clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
