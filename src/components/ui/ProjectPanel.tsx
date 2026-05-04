"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Star, GitFork, Calendar } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { Project } from "@/lib/github";
import { cn } from "@/lib/utils";

const LANG_COLORS: Record<string, string> = {
  Python:     "#3572A5", TypeScript: "#3178c6", JavaScript: "#f7df1e",
  Go:         "#00ADD8", Rust:       "#dea584", Java:       "#b07219",
  "C++":      "#f34b7d", C:          "#555555", PHP:        "#4F5D95",
  Ruby:       "#701516", Swift:      "#F05138", Kotlin:     "#A97BFF",
  Shell:      "#89e051", HTML:       "#e34c26", CSS:        "#563d7c",
  Dockerfile: "#384d54", Makefile:   "#427819",
};

interface ProjectPanelProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectPanel = ({ project, onClose }: ProjectPanelProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (project) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  const langColor = project?.language ? (LANG_COLORS[project.language] ?? "#64748b") : null;

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            className="fixed top-0 right-0 bottom-0 z-[100] w-full md:w-1/2 lg:w-[45%] bg-bg-secondary border-l border-white/8 overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-bg-secondary/95 backdrop-blur-md border-b border-white/6">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryPill category={project.category} />
                  <span className="text-[11px] font-mono text-text-faint">{project.year}</span>
                </div>
                <h2 className="text-xl font-semibold text-text-primary leading-tight">{project.title}</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="p-2 rounded-full text-text-faint hover:text-text-primary hover:bg-white/5 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-8 flex-1">
              {/* Description */}
              <div>
                <h3 className="text-[11px] font-mono uppercase tracking-[0.18em] text-text-faint mb-3">About</h3>
                <p className="text-text-secondary leading-relaxed text-[15px]">{project.description}</p>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-5">
                {project.stars > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <Star size={14} className="text-amber-400" aria-hidden="true" />
                    <span>{project.stars} stars</span>
                  </div>
                )}
                {project.forks > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <GitFork size={14} className="text-accent-indigo" aria-hidden="true" />
                    <span>{project.forks} forks</span>
                  </div>
                )}
                {project.updatedAt && (
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <Calendar size={14} className="text-text-faint" aria-hidden="true" />
                    <span>{new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>
                )}
              </div>

              {/* Language */}
              {project.language && langColor && (
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.18em] text-text-faint mb-3">Primary Language</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: langColor }} aria-hidden="true" />
                    <span className="text-sm font-mono text-text-secondary">{project.language}</span>
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.18em] text-text-faint mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-[12px] font-mono text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer links */}
            <div className="sticky bottom-0 p-6 bg-bg-secondary/95 backdrop-blur-md border-t border-white/6 flex gap-3">
              {project.githubUrl && project.status !== "private" && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:border-accent-cyan/40 hover:text-accent-cyan transition-all duration-[250ms] text-sm font-medium"
                >
                  <GithubIcon size={15} />
                  Source
                </a>
              )}
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-cyan text-bg hover:shadow-[0_0_24px_rgba(6,182,212,0.35)] transition-all duration-[250ms] text-sm font-semibold"
                >
                  <ExternalLink size={15} aria-hidden="true" />
                  Live
                </a>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const CATEGORY_STYLES: Record<string, string> = {
  Security:     "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
  "Full-Stack": "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20",
  "AI/Vision":  "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  Experiments:  "bg-amber-400/10 text-amber-400 border-amber-400/20",
};

const CategoryPill = ({ category }: { category: string }) => (
  <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono uppercase tracking-wider border", CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Experiments)}>
    {category}
  </span>
);

export { CategoryPill };
export default ProjectPanel;
