"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Project } from "@/lib/github";
import ProjectCard from "@/components/ui/ProjectCard";

const CATEGORIES = ["All", "Security", "Full-Stack", "AI/Vision", "Experiments"] as const;
type Category = (typeof CATEGORIES)[number];

interface ProjectsProps {
  projects: Project[];
  stats: { totalRepos: number; categories: string[] };
}

const Projects = ({ projects, stats }: ProjectsProps) => {
  const [active, setActive] = useState<Category>("All");

  const filtered = useMemo(
    () => projects.filter((p) => active === "All" || p.category === active),
    [projects, active]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [projects]);

  return (
    <section id="projects" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          number="02"
          label="Projects"
          heading={<>What I&apos;ve <span className="gradient-text">built.</span></>}
          subheading={`${stats.totalRepos} repositories across ${stats.categories.length} domains — fetched live from GitHub.`}
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10" role="tablist" aria-label="Filter projects by category">
          {CATEGORIES.map((cat) => {
            const count = counts[cat] || 0;
            if (cat !== "All" && count === 0) return null;
            const isActive = active === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat)}
                className="relative px-4 py-1.5 rounded-full text-[13px] font-mono tracking-wider transition-all duration-[250ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan focus-visible:outline-offset-2"
                style={{
                  color: isActive ? "#030712" : "#64748b",
                  background: isActive ? "#06b6d4" : "transparent",
                  border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {cat}
                <span className="ml-1.5 opacity-60 text-[11px]">{count}</span>
              </button>
            );
          })}
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
                transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 space-y-4"
            >
              <p className="font-mono text-text-faint text-sm">
                <span className="text-accent-cyan/50">// </span>
                no projects matched these filters
              </p>
              <button
                onClick={() => setActive("All")}
                className="text-xs font-mono text-accent-cyan/70 hover:text-accent-cyan underline underline-offset-4 transition-colors"
              >
                clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
