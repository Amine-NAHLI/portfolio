"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Star, GitFork, Calendar, BookOpen, Layout } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { Project } from "@/lib/github";
import { cn } from "@/lib/utils";

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5", TypeScript: "#3178c6", JavaScript: "#f7df1e",
  Go: "#00ADD8", Rust: "#dea584", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", PHP: "#4F5D95",
  Ruby: "#701516", Swift: "#F05138", Kotlin: "#A97BFF",
};

export default function ProjectPanel({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      // Mock fetch README or fetch from GitHub if needed
      // For now, let's just show a nice placeholder that looks like a fetch
      setLoading(true);
      setTimeout(() => {
        setReadme(`### ${project.title}\n\n${project.description}\n\nThis is a full README preview generated for ${project.title}. In a production environment, this would be fetched directly from GitHub's raw content API.`);
        setLoading(false);
      }, 800);
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-0/80 backdrop-blur-md z-[200]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] bg-bg-1 border-l border-white/10 z-[201] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="font-mono text-[10px] text-cyan uppercase tracking-widest px-2 py-1 bg-cyan/10 border border-cyan/20 rounded">
                     {project.category}
                   </span>
                   <span className="font-mono text-[10px] text-text-4 uppercase tracking-widest">{project.year}</span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-1">{project.title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-text-4 hover:text-text-1 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Star size={16} className="text-amber-500 mb-2" />
                  <p className="text-xl font-bold text-text-1">{project.stars}</p>
                  <p className="text-[10px] font-mono uppercase text-text-4 tracking-widest">Stars</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <GitFork size={16} className="text-indigo mb-2" />
                  <p className="text-xl font-bold text-text-1">{project.forks || 0}</p>
                  <p className="text-[10px] font-mono uppercase text-text-4 tracking-widest">Forks</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Calendar size={16} className="text-cyan mb-2" />
                  <p className="text-xl font-bold text-text-1">{new Date(project.updatedAt).getFullYear()}</p>
                  <p className="text-[10px] font-mono uppercase text-text-4 tracking-widest">Updated</p>
                </div>
              </div>

              {/* Language Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layout size={16} className="text-text-4" />
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-4">Language Ecosystem</h3>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full" 
                    style={{ 
                      width: "70%", 
                      background: LANG_COLORS[project.language || ""] || "var(--cyan)" 
                    }} 
                  />
                  <div className="h-full w-[20%] bg-indigo/40" />
                  <div className="h-full w-[10%] bg-purple/40" />
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[project.language || ""] || "var(--cyan)" }} />
                     <span className="text-xs font-mono text-text-2">{project.language} 70%</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-indigo/40" />
                     <span className="text-xs font-mono text-text-2">Other 30%</span>
                   </div>
                </div>
              </div>

              {/* README Preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-text-4" />
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-4">README_PREVIEW.MD</h3>
                </div>
                <div className="relative p-6 rounded-2xl bg-bg-0 border border-white/5 font-mono text-sm leading-relaxed text-text-3 overflow-hidden">
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 w-3/4 bg-white/5 rounded" />
                      <div className="h-4 w-1/2 bg-white/5 rounded" />
                      <div className="h-24 w-full bg-white/5 rounded" />
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">{readme}</pre>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-0 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-bg-2 border border-white/5 text-xs font-mono text-text-3">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-8 border-t border-white/10 grid grid-cols-2 gap-4">
              <a 
                href={project.githubUrl} 
                target="_blank" 
                className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-text-1 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                <GithubIcon size={18} />
                Source Code
              </a>
              <a 
                href={project.homepage || project.githubUrl} 
                target="_blank" 
                className="flex items-center justify-center gap-3 py-4 rounded-xl bg-cyan text-bg-0 font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
              >
                <ExternalLink size={18} />
                Live Demo
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
