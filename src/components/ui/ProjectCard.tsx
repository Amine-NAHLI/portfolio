"use client";

import React from "react";
import { motion } from "framer-motion";
import { GithubIcon } from "@/components/ui/Icons";
import { formatProjectTitle } from "@/lib/utils";
import { Shield, Terminal } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
  visible: boolean;
  image_url?: string;
  metrics?: string;
}

const getCategoryStyle = (category: string) => {
  const cat = (category || "").toUpperCase();
  if (cat.includes("CYBER") || cat.includes("SECURITY")) {
    return {
      borderTop: "border-t-2 border-t-red-500",
      badge: "bg-red-500/10 text-red-400 border border-red-500/20",
      dot: "bg-red-400",
      label: "CYBER_SEC",
    };
  }
  if (cat.includes("AI") || cat.includes("MACHINE") || cat.includes("NEURAL")) {
    return {
      borderTop: "border-t-2 border-t-purple-500",
      badge: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      dot: "bg-purple-400",
      label: "NEURAL_NET",
    };
  }
  if (cat.includes("FULL") || cat.includes("STACK")) {
    return {
      borderTop: "border-t-2 border-t-cyan-500",
      badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      dot: "bg-cyan-400",
      label: "FULL_STACK",
    };
  }
  if (cat.includes("MOBILE")) {
    return {
      borderTop: "border-t-2 border-t-green-500",
      badge: "bg-green-500/10 text-green-400 border border-green-500/20",
      dot: "bg-green-400",
      label: "MOBILE",
    };
  }
  return {
    borderTop: "border-t-2 border-t-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    dot: "bg-yellow-400",
    label: "EXP_LAB",
  };
};

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
  isLarge?: boolean;
}) {
  const styles = getCategoryStyle(project.category);
  const num = String(index + 1).padStart(2, "0");
  const tags = project.tags || [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative rounded-2xl bg-[#0d0d0f] border border-white/5 overflow-hidden ${styles.borderTop} hover:shadow-[0_0_30px_rgba(0,180,216,0.08)] transition-shadow duration-300`}
    >
      <div className="p-6 flex flex-col gap-4">

        {/* Top row: ghost number behind badge + tech dots */}
        <div className="flex items-start justify-between relative">
          <span className="absolute -top-3 -left-1 text-[5rem] leading-none font-black text-white/[0.035] select-none pointer-events-none">
            {num}
          </span>
          <span className={`relative z-10 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-widest ${styles.badge}`}>
            {styles.label}
          </span>
          <div className="flex gap-1.5 flex-wrap justify-end max-w-[120px]">
            {tags.slice(0, 6).map((tag, i) => (
              <div
                key={i}
                title={tag}
                className={`w-2 h-2 rounded-full ${styles.dot} opacity-70`}
              />
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-white/5" />

        {/* Title */}
        <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-[#00B4D8] transition-colors duration-300">
          {formatProjectTitle(project.title)}
        </h3>

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Bottom: status badges + github link */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Shield size={11} className="text-[#00B4D8]" />
              <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">
                Secure_Build
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal size={11} className="text-[#00B4D8]" />
              <span className="text-[8px] font-mono text-white/25 uppercase tracking-widest">
                CLI_Ready
              </span>
            </div>
          </div>

          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-[#00B4D8] hover:text-black transition-all duration-300"
          >
            <GithubIcon size={16} />
          </a>
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </motion.div>
  );
}
