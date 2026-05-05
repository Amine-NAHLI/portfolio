"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Shield, Layout, Sparkles, FolderCode } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import type { Project } from "@/lib/github";
import { useTilt } from "@/hooks/useTilt";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  // Smart Bento Logic
  const isLarge = index % 7 === 0; 
  const isTall = index % 7 === 3;
  const isWide = index % 7 === 5;

  const Icon = project.category === "Security" ? Shield : 
               project.category === "Full-Stack" ? Layout : 
               project.category === "AI/Vision" ? Sparkles : FolderCode;

  const accentColor = project.category === "Security" ? "var(--accent-cyan)" : 
                      project.category === "Full-Stack" ? "var(--accent-indigo)" : 
                      project.category === "AI/Vision" ? "var(--accent-purple)" : "var(--accent-green)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: EASE }}
      className={`relative ${isLarge ? 'md:col-span-2 md:row-span-2' : ''} ${isWide ? 'md:col-span-2' : ''} ${isTall ? 'md:row-span-2' : ''}`}
    >
      <motion.a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ 
          rotateX, rotateY,
          transformStyle: "preserve-3d" 
        }}
        animate={{ 
          y: 0,
        }}
        whileHover={{ y: -10 }}
        transition={{
          duration: 0.5,
          ease: EASE
        }}
        className="group relative h-full w-full rounded-[2.5rem] bg-bg-1 border border-bg-3 dark:border-[#1e293b] overflow-hidden flex flex-col p-10 transition-all duration-700 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-2xl hover:border-accent-cyan/40"
      >
        {/* BACKGROUND ELEMENTS */}
        <div 
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        
        <div className="absolute top-10 right-10 flex flex-col items-end opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 select-none pointer-events-none">
           <span className="text-[12rem] font-black leading-none uppercase tracking-tighter text-text-1">
             {project.title?.charAt(0) || "P"}
           </span>
        </div>

        {/* HEADER */}
        <div className="relative z-10 flex items-start justify-between mb-auto">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-text-3 dark:text-text-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm"
            style={{ backgroundColor: 'var(--bg-2)' }}
          >
            <Icon size={24} />
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="font-mono text-[10px] text-text-4 uppercase tracking-[0.3em]">{project.year}</span>
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-bg-2 border border-bg-3 dark:bg-text-1/[0.03] dark:border-text-1/[0.05]">
               <Star size={10} className="text-amber-500" />
               <span className="font-mono text-[10px] text-text-2">{project.stars}</span>
             </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 mt-12">
          <h3 className={`font-black tracking-tighter text-text-1 leading-[0.9] mb-6 group-hover:text-accent-cyan transition-colors ${isLarge ? 'text-6xl' : 'text-3xl'}`}>
            {project.title}
          </h3>
          
          <p className={`text-text-3 font-medium transition-all duration-500 mb-8 ${isLarge ? 'text-lg line-clamp-4' : 'text-sm line-clamp-2'}`}>
            {project.description || "Experimental engineering project focused on modular architecture and performance optimization."}
          </p>

          {/* TECHNOLOGY TAGS */}
          <div className="flex flex-wrap gap-2 mb-10">
             {project.tags.slice(0, isLarge ? 6 : 3).map((tag, idx) => (
               <span key={`${tag}-${idx}`} className="px-3 py-1 rounded-lg bg-[#eff6ff] text-[#3b82f6] border border-[#3b82f6]/10 dark:bg-text-1/[0.03] dark:text-text-4 dark:border-text-1/[0.05] font-mono text-[9px] uppercase tracking-widest group-hover:scale-105 transition-all">
                 {tag}
               </span>
             ))}
             {project.tags.length > (isLarge ? 6 : 3) && (
               <span className="px-2 py-1 font-mono text-[9px] text-text-4 opacity-50">
                 +{project.tags.length - (isLarge ? 6 : 3)}
               </span>
             )}
          </div>

          {/* ACTION BAR */}
          <div className="pt-8 border-t border-text-1/[0.05] flex items-center justify-between">
            <div className="flex flex-col">
               <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-text-4 mb-1">Source</span>
                 <span className="text-text-2 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                   <GithubIcon size={14} className="text-text-4" />
                   View Repository
                 </span>
            </div>
            
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-1 opacity-0 group-hover:opacity-100 transition-opacity">GitHub</span>
              <div className="w-10 h-10 rounded-full bg-text-1 text-bg-0 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-500">
                 <ArrowRight size={16} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* DECORATIVE ORBIT */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
           <div 
             className="absolute top-0 right-0 w-[500px] h-[500px] border border-text-1/[0.02] rounded-full -translate-y-1/3 translate-x-1/3 animate-spin-slow"
             style={{ borderColor: `${accentColor}10` }}
           />
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-bg-0/50 to-transparent" />
        </div>
      </motion.a>
    </motion.div>
  );
}
