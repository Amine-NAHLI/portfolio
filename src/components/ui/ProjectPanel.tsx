"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Star, GitFork, Calendar, BookOpen, Layout } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { Project } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5", TypeScript: "#3178c6", JavaScript: "#f7df1e",
  Go: "#00ADD8", Rust: "#dea584", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", PHP: "#4F5D95",
  Ruby: "#701516", Swift: "#F05138", Kotlin: "#A97BFF",
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectPanel({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setLoading(true);
      setTimeout(() => {
        setReadme(`### ${project.title}\n\n${project.description}\n\nThis is a full README preview generated for ${project.title}. In a production environment, this would be fetched directly from GitHub's raw content API.`);
        setLoading(false);
      }, 800);
    }
    return () => { 
      document.body.style.overflow = ""; 
      document.documentElement.style.overflow = "";
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-0/90 backdrop-blur-xl"
          />
          
          {/* Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] bg-bg-1 border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-white/5 flex items-start justify-between bg-bg-1/50 backdrop-blur-md sticky top-0 z-20">
              <div>
                <div className="flex items-center gap-3 mb-3">
                   <span className="font-mono text-[10px] text-accent-cyan uppercase tracking-widest px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg">
                     {project.category}
                   </span>
                   <span className="font-mono text-[10px] text-text-4 uppercase tracking-[0.4em]">{project.year}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-text-1 uppercase">{project.title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-text-4 hover:text-text-1 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Star, val: project.stars, label: "Stars", color: "text-amber-500" },
                  { icon: GitFork, val: project.forks || 0, label: "Forks", color: "text-accent-indigo" },
                  { icon: Calendar, val: new Date(project.updatedAt).getFullYear(), label: "Updated", color: "text-accent-cyan" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <stat.icon size={20} className={stat.color + " mb-4"} />
                    <p className="text-3xl font-black text-text-1 tracking-tighter">{stat.val}</p>
                    <p className="text-[10px] font-mono uppercase text-text-4 tracking-[0.3em]">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Language Breakdown */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Layout size={18} className="text-accent-cyan" />
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-3">Language Ecosystem</h3>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full" 
                    style={{ 
                      width: "70%", 
                      background: LANG_COLORS[project.language || ""] || "var(--accent-cyan)" 
                    }} 
                  />
                  <div className="h-full w-[20%] bg-accent-indigo/40" />
                  <div className="h-full w-[10%] bg-accent-purple/40" />
                </div>
                <div className="flex flex-wrap gap-6">
                   <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[project.language || ""] || "var(--accent-cyan)" }} />
                     <span className="text-[11px] font-mono text-text-2 uppercase tracking-widest">{project.language} 70%</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-accent-indigo/40" />
                     <span className="text-[11px] font-mono text-text-2 uppercase tracking-widest">Other 30%</span>
                   </div>
                </div>
              </div>

              {/* README Preview */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-accent-cyan" />
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-3">README_PREVIEW.MD</h3>
                </div>
                <div className="relative p-8 rounded-[2rem] bg-bg-0/50 border border-white/5 font-mono text-sm leading-relaxed text-text-3 overflow-hidden min-h-[200px]">
                  {loading ? (
                    <div className="space-y-6 animate-pulse">
                      <div className="h-4 w-3/4 bg-white/5 rounded" />
                      <div className="h-4 w-1/2 bg-white/5 rounded" />
                      <div className="h-32 w-full bg-white/5 rounded" />
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">{readme}</pre>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-1 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {project.tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono text-text-4 uppercase tracking-widest hover:border-accent-cyan/30 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 md:p-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg-1/50 backdrop-blur-md">
              <a 
                href={project.githubUrl} 
                target="_blank" 
                className="flex items-center justify-center gap-4 py-5 rounded-2xl bg-white/5 border border-white/10 text-text-1 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all"
              >
                <GithubIcon size={20} />
                Source Code
              </a>
              <a 
                href={project.homepage || project.githubUrl} 
                target="_blank" 
                className="flex items-center justify-center gap-4 py-5 rounded-2xl bg-text-1 text-bg-0 font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all"
              >
                <ExternalLink size={20} />
                Live Demo
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
