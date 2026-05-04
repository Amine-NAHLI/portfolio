"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { useTilt } from "@/hooks/useTilt";
import type { Project } from "@/lib/github";
import dynamic from "next/dynamic";

const ProjectPanel = dynamic(() => import("@/components/ui/ProjectPanel"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectCard({ project }: { project: Project }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(4); // Reduced tilt intensity

  return (
    <>
      <motion.div
        layout
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => setPanelOpen(true)}
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="group relative h-[520px] rounded-[2.5rem] overflow-hidden bg-bg-1 border border-white/5 hover:border-white/10 transition-all duration-500 cursor-pointer shadow-2xl"
      >
        {/* Card Header (Category & Year) */}
        <div className="absolute top-10 left-10 z-20 flex items-center gap-4">
          <span className="px-4 py-1.5 rounded-full glass border border-white/10 font-mono text-[9px] text-cyan uppercase tracking-[0.2em]">
            {project.category}
          </span>
          <span className="font-mono text-[9px] text-text-4 uppercase tracking-[0.2em]">{project.year}</span>
        </div>

        {/* Visual Background (Gradient + Monogram) */}
        <div className="absolute inset-0 z-0 h-1/2 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 grid-bg opacity-[0.1]" />
          <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-700 opacity-40 group-hover:opacity-70 ${
            project.category === "Security" ? "from-cyan/20 to-transparent" :
            project.category === "Full-Stack" ? "from-indigo/20 to-transparent" :
            "from-purple/20 to-transparent"
          }`} />
          
          {/* Large Monogram */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
             <span className="text-[120px] font-black text-white/[0.03] uppercase tracking-tighter">
               {project.title.slice(0, 2)}
             </span>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 p-12 flex flex-col justify-end">
          <div className="space-y-4">
            <h3 className="text-4xl font-black tracking-tighter text-text-1 group-hover:text-cyan transition-colors leading-tight">
              {project.title}
            </h3>
            
            <p className="text-text-3 text-lg line-clamp-2 max-w-sm group-hover:text-text-2 transition-colors duration-500">
              {project.description}
            </p>

            {/* Meta & Action */}
            <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-8">
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-text-4">
                   <Star size={14} className="group-hover:text-amber-500/50 transition-colors" />
                   <span className="font-mono text-xs">{project.stars}</span>
                 </div>
                 <div className="flex items-center gap-2 text-text-4">
                   <GithubIcon size={14} className="group-hover:text-cyan/50 transition-colors" />
                   <span className="font-mono text-[10px] uppercase tracking-widest">{project.language}</span>
                 </div>
               </div>
               
               <div className="flex items-center gap-2 text-text-1 font-mono text-[9px] uppercase tracking-[0.3em] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                 Details <ArrowRight size={14} />
               </div>
            </div>
          </div>
        </div>
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
