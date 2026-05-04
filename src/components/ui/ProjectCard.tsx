"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lock, Star, GitFork } from "lucide-react";
import type { Project } from "@/lib/github";
import { cn } from "@/lib/utils";
import { CategoryPill } from "@/components/ui/ProjectPanel";
import dynamic from "next/dynamic";

const ProjectPanel = dynamic(() => import("@/components/ui/ProjectPanel"), { ssr: false });

const LANG_COLORS: Record<string, string> = {
  Python:     "#3572A5", TypeScript: "#3178c6", JavaScript: "#f7df1e",
  Go:         "#00ADD8", Rust:       "#dea584", Java:       "#b07219",
  "C++":      "#f34b7d", C:          "#555555", PHP:        "#4F5D95",
  Ruby:       "#701516", Swift:      "#F05138", Kotlin:     "#A97BFF",
  Shell:      "#89e051", HTML:       "#e34c26", CSS:        "#563d7c",
};

const ProjectCard = ({ project }: { project: Project }) => {
  const [panelOpen, setPanelOpen] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 30 });
  const y = useSpring(rawY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => { rawX.set(0); rawY.set(0); };

  const isPrivate = project.status === "private";
  const langColor = project.language ? (LANG_COLORS[project.language] ?? "#64748b") : null;
  const extraTags = project.tags.length - 3;

  return (
    <>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => setPanelOpen(true)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
        className={cn(
          "relative flex flex-col rounded-2xl bg-bg-secondary/50 border border-white/8 backdrop-blur-sm cursor-pointer",
          "transition-[border-color,box-shadow] duration-[250ms]",
          "hover:border-accent-cyan/40 hover:shadow-[0_0_32px_rgba(6,182,212,0.08),inset_0_0_32px_rgba(6,182,212,0.03)]"
        )}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${project.title}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPanelOpen(true); } }}
      >
        {/* Private overlay */}
        {isPrivate && (
          <div className="absolute inset-0 rounded-2xl bg-bg/50 backdrop-blur-[2px] z-20 flex items-center justify-center" aria-hidden="true">
            <div className="flex items-center gap-1.5 text-text-faint">
              <Lock size={13} />
              <span className="text-[11px] font-mono uppercase tracking-wider">Private</span>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div className="flex items-start justify-between p-5 pb-0">
          <CategoryPill category={project.category} />
          <span className="text-[11px] font-mono text-text-faint">{project.year}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-accent-cyan transition-colors duration-[250ms] line-clamp-1">
            {project.title}
          </h3>
          <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Bottom meta row */}
        <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-text-faint whitespace-nowrap">
                {tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="text-[10px] font-mono text-text-faint">+{extraTags}</span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {langColor && project.language && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: langColor }} aria-hidden="true" />
                <span className="text-[10px] font-mono text-text-faint">{project.language}</span>
              </div>
            )}
            {project.stars > 0 && (
              <div className="flex items-center gap-0.5 text-[11px] font-mono text-text-faint">
                <Star size={10} className="text-amber-400/70" aria-hidden="true" />
                {project.stars}
              </div>
            )}
            {project.forks > 0 && (
              <div className="flex items-center gap-0.5 text-[11px] font-mono text-text-faint">
                <GitFork size={10} className="text-accent-indigo/70" aria-hidden="true" />
                {project.forks}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <ProjectPanel project={panelOpen ? project : null} onClose={() => setPanelOpen(false)} />
    </>
  );
};

export default ProjectCard;
