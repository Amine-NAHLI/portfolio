"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
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

const categoryColors = {
  Security: "bg-red-500/10 text-red-500 border-red-500/20",
  "Full-Stack": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "AI/Vision": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Experiments: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const ProjectCard = ({ project }: { project: Project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="relative p-6 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-md group transition-colors duration-300 hover:border-accent-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
    >
      {/* Category Badge */}
      <div className="flex justify-between items-start mb-6" style={{ transform: "translateZ(20px)" }}>
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          categoryColors[project.category]
        )}>
          {project.category}
        </span>
        <span className="text-xs font-mono text-text-muted">{project.year}</span>
      </div>

      {/* Content */}
      <div style={{ transform: "translateZ(30px)" }}>
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-2 mb-4" style={{ transform: "translateZ(20px)" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* GitHub Link Reveal */}
      <motion.a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ scale: 1.1 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          transition: { delay: 0.1 }
        }}
        className="absolute bottom-6 right-6 p-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan opacity-0 group-hover:opacity-100 transition-all duration-300 translate-z-[40px]"
        style={{ transform: "translateZ(40px)" }}
      >
        <GithubIcon size={18} />
      </motion.a>
    </motion.div>
  );
};

export default ProjectCard;
