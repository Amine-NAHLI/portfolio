"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ExternalLink, ArrowRight, Github } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { useTilt } from "@/hooks/useTilt";
import type { Project } from "@/lib/github";
import dynamic from "next/dynamic";

const ProjectPanel = dynamic(() => import("@/components/ui/ProjectPanel"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectCard({ project }: { project: Project }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  return (
    <>
      <motion.div
        layout
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => setPanelOpen(true)}
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="group relative h-[540px] rounded-[2.5rem] overflow-hidden bg-bg-1 border border-white/5 hover:border-white/10 transition-colors cursor-pointer shadow-2xl"
      >
        {/* Card Header (Category & Year) */}
        <div className="absolute top-10 left-10 z-20 flex items-center gap-4">
          <span className="px-4 py-1.5 rounded-full glass border border-white/10 font-mono text-[10px] text-cyan uppercase tracking-[0.2em]">
            {project.category}
          </span>
          <span className="font-mono text-[10px] text-text-4 uppercase tracking-[0.2em]">{project.year}</span>
        </div>

        {/* Visual Background (Pattern + Glow) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 grid-bg opacity-[0.15]" />
          <div className="absolute inset-0 bg-gradient-to-br from-bg-1 via-transparent to-bg-1" />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{ 
              background: `radial-gradient(circle at center, ${project.category === "Security" ? "#06b6d420" : project.category === "Full-Stack" ? "#6366f120" : "#a855f720"} 0%, transparent 70%)` 
            }}
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 p-12 flex flex-col justify-end">
          <motion.div 
            initial={false}
            animate={{ y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-text-1 group-hover:text-cyan transition-colors leading-none">
              {project.title.split(" ").map((word, i) => (
                <span key={i}>{word} </span>
              ))}
            </h3>
            
            <p className="text-text-3 text-lg line-clamp-2 max-w-sm group-hover:text-text-2 transition-colors">
              {project.description}
            </p>

            {/* Meta & Action */}
            <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-auto">
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-text-4 group-hover:text-amber-500/80 transition-colors">
                   <Star size={16} />
                   <span className="font-mono text-sm">{project.stars}</span>
                 </div>
                 <div className="flex items-center gap-2 text-text-4 group-hover:text-cyan/80 transition-colors">
                   <GithubIcon size={16} />
                   <span className="font-mono text-sm uppercase tracking-widest text-[10px]">{project.language}</span>
                 </div>
               </div>
               
               <div className="flex items-center gap-2 text-text-1 font-mono text-[10px] uppercase tracking-[0.3em] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                 Explore <ArrowRight size={14} />
               </div>
            </div>
          </motion.div>
        </div>

        {/* Noise overlay for texture */}
        <div className="absolute inset-0 noise-bg z-[1]" />
      </motion.div>

      <AnimatePresence>
        {panelOpen && (
          <ProjectPanel 
            project={project} 
            onClose={() => setPanelOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
