"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectFilters from "@/components/ui/ProjectFilters";
import ProjectModal from "@/components/ui/ProjectModal";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
  visible: boolean;
  metrics?: string;
}

const INITIAL_COUNT = 3;
const EASE = [0.16, 1, 0.3, 1] as const;

function matchesFilter(category: string, filterId: string): boolean {
  const cat = (category || "").toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
  if (filterId === "cybersecurity engineering")
    return cat.includes("cyber") || cat.includes("security") || cat.includes("penetration");
  if (filterId === "ai & machine learning")
    return cat === "ai" || cat.startsWith("ai ") || cat.endsWith(" ai") || cat.includes(" ai ") ||
      cat.includes("machine learn") || cat.includes("deep learn") || cat.includes("neural");
  if (filterId === "full stack development")
    return cat.includes("full") || cat.includes("full stack");
  return cat === filterId;
}
const KNOWN_FILTER_IDS = ["cybersecurity engineering", "ai & machine learning", "full stack development"];

export default function Projects({ projects, stats }: { projects: Project[]; stats?: any }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (!p.visible) return false;
      if (activeCategory === "all") return true;
      if (activeCategory === "exp_lab") return !KNOWN_FILTER_IDS.some(id => matchesFilter(p.category, id));
      return matchesFilter(p.category, activeCategory);
    });
  }, [projects, activeCategory]);

  useEffect(() => {
    setExpanded(false);
  }, [activeCategory]);

  const initialProjects = filteredProjects.slice(0, INITIAL_COUNT);
  const extraProjects = filteredProjects.slice(INITIAL_COUNT);
  const hasMore = extraProjects.length > 0;

  return (
    <section id="projects" className="py-32 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ─── HEADER ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="relative">
            {/* Ghost decorative text — adapts via CSS vars */}
            <span className="ghost-text absolute -top-12 -left-4 text-[6rem] md:text-[10rem] font-black select-none pointer-events-none -z-10 uppercase tracking-tighter leading-none">
              Vault
            </span>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-accent-cyan rounded-full" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent-cyan font-black">
                Archive_Node_01
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
              Project <br />
              {/* Ghost outline text — stroke adapts to theme */}
              <span className="ghost-stroke">
                Archive.
              </span>
            </h2>
          </div>

          <div className="max-w-md border-l-2 border-accent-cyan pl-8 py-2">
            <p className="text-text-3 text-[11px] uppercase tracking-[0.2em] font-mono leading-relaxed">
              Accessing encrypted repository: Displaying categorized intelligence
              from production environments and experimental labs.
            </p>
          </div>
        </div>

        {/* ─── MAIN LAYOUT ────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-16">

          <ProjectFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <div className="flex-1">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 md:auto-rows-fr">

              <AnimatePresence mode="popLayout">
                {initialProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.55, ease: EASE, delay: index * 0.1 }}
                    onClick={() => setSelectedProject(project)}
                    className={`cursor-pointer ${index === 0 ? "md:row-span-2" : ""}`}
                  >
                    <ProjectCard project={project} index={index} isLarge={false} />
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {expanded &&
                  extraProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, ease: EASE, delay: index * 0.1 }}
                      onClick={() => setSelectedProject(project)}
                      className="cursor-pointer"
                    >
                      <ProjectCard project={project} isLarge={false} index={INITIAL_COUNT + index} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 border border-dashed border-[var(--border)] rounded-[3rem] bg-text-1/[0.01] backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-full bg-text-1/5 flex items-center justify-center mb-6">
                  <div className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">
                  No_Assets_Detected
                </span>
                <p className="text-text-3 text-sm mt-2 font-mono">
                  Filter calibration required.
                </p>
              </motion.div>
            )}

            {hasMore && (
              <motion.div layout className="flex justify-center mt-16">
                <button
                  onClick={() => {
                    if (expanded) {
                      const section = document.getElementById("projects");
                      if (section) section.scrollIntoView({ behavior: "smooth" });
                    }
                    setExpanded(prev => !prev);
                  }}
                  className="group flex items-center gap-3 px-8 py-3 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 hover:bg-accent-cyan/10 hover:border-accent-cyan/60 transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan"
                >
                  <span>{expanded ? "Show Less" : "Discover More"}</span>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
