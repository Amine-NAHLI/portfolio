"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lock } from "lucide-react";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const categoryColors: Record<string, string> = {
  Security: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
  "Full-Stack": "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20",
  "AI/Vision": "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  Experiments: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const ProjectCard = ({ project }: { project: Project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mx = useSpring(x, { stiffness: 300, damping: 30 });
  const my = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(my, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mx, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isPrivate = project.status === "private";

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative p-6 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-sm group transition-colors duration-300 hover:border-accent-cyan/40"
    >
      {/* Private overlay */}
      {isPrivate && (
        <div className="absolute inset-0 rounded-2xl bg-bg/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
          <div className="flex items-center gap-2 text-text-muted">
            <Lock size={16} />
            <span className="text-xs font-mono uppercase tracking-wider">Private</span>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="flex justify-between items-start mb-5">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            categoryColors[project.category] || categoryColors.Experiments
          )}
        >
          {project.category}
        </span>
        <span className="text-xs font-mono text-text-muted">{project.year}</span>
      </div>

      {/* Content */}
      <div className="mb-5">
        <h3 className="text-lg font-bold mb-2 group-hover:text-accent-cyan transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Stats row */}
      {(project.stars > 0 || project.forks > 0) && (
        <div className="flex items-center gap-4 mb-4 text-xs font-mono text-text-muted">
          {project.stars > 0 && <span>★ {project.stars}</span>}
          {project.forks > 0 && <span>⑂ {project.forks}</span>}
        </div>
      )}

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-text-muted font-mono"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* GitHub Link */}
      {project.githubUrl && !isPrivate && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-300"
          aria-label={`View ${project.title} on GitHub`}
        >
          <GithubIcon size={16} />
        </a>
      )}
    </motion.div>
  );
};

export default ProjectCard;
