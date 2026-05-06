"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Layout, Sparkles, FolderCode, Brain, Server, Smartphone, Database } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { useTilt } from "@/hooks/useTilt";

import { formatProjectTitle } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectProps {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
  created_at: string;
}

export default function ProjectCard({ project, index }: { project: ProjectProps; index: number }) {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  // Smart Bento Logic - Only Width Asymmetry to prevent empty vertical space
  const isLarge = index % 6 === 0; 
  const isWide = index % 6 === 3;

  const getCategoryTheme = (cat: string) => {
    const c = cat.toLowerCase();
    
    // Security / Cyber
    if (c.includes("security") || c.includes("cyber")) 
      return { Icon: Shield, color: "var(--accent-cyan)" };
    
    // AI / ML
    if (c.includes("ai") || c.includes("machine") || c.includes("vision") || c.includes("intelligence") || c.includes("brain")) 
      return { Icon: Brain, color: "var(--accent-purple)" };
    
    // Frontend / Web
    if (c.includes("front") || c.includes("web") || c.includes("layout") || c.includes("ui")) 
      return { Icon: Layout, color: "var(--accent-indigo)" };
    
    // DevOps / Infra
    if (c.includes("devops") || c.includes("infra") || c.includes("cloud") || c.includes("server") || c.includes("docker")) 
      return { Icon: Server, color: "var(--accent-green)" };
    
    // Mobile
    if (c.includes("mobile") || c.includes("app") || c.includes("phone")) 
      return { Icon: Smartphone, color: "var(--accent-cyan)" };

    // Default
    return { Icon: Database, color: "var(--accent-cyan)" };
  };

  const { Icon, color: accentColor } = getCategoryTheme(project.category);

  const year = project.created_at ? new Date(project.created_at).getFullYear().toString() : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: EASE }}
      className={`relative ${(isLarge || isWide) ? 'md:col-span-2' : ''}`}
    >
      <motion.a
        href={project.github_url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ 
          rotateX, rotateY,
          transformStyle: "preserve-3d" 
        }}
        animate={{ y: 0 }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`group relative h-fit w-full rounded-[2.5rem] bg-bg-1 border border-bg-3 dark:border-[#1e293b] overflow-hidden flex flex-col transition-all duration-700 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-2xl hover:border-accent-cyan/40 ${isLarge ? 'p-10' : 'p-8'}`}
      >
        {/* BACKGROUND ELEMENTS */}
        <div 
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        
        <div className="absolute top-10 right-10 flex flex-col items-end opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 select-none pointer-events-none">
           <span className={`${isLarge ? 'text-[12rem]' : 'text-[8rem]'} font-black leading-none uppercase tracking-tighter text-text-1`}>
             {project.title?.charAt(0) || "P"}
           </span>
        </div>
 
        {/* HEADER */}
        <div className="relative z-20 flex items-start justify-between mb-6">
          <div 
            className={`${isLarge ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl flex items-center justify-center text-text-3 dark:text-text-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm`}
            style={{ backgroundColor: 'var(--bg-2)' }}
          >
            <Icon size={isLarge ? 24 : 20} />
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="font-mono text-[9px] text-text-3 uppercase tracking-[0.3em]">{year}</span>
             {project.language && (
               <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-2 border border-bg-3 dark:bg-text-1/[0.03] dark:border-text-1/[0.05] max-w-[120px] md:max-w-none">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />
                 <span className="font-mono text-[8px] md:text-[9px] text-text-2 truncate">{project.language}</span>
               </div>
             )}
          </div>
        </div>
 
        {/* MAIN CONTENT */}
        <div className="relative z-10 flex-none flex flex-col">
          <h3 className={`font-black tracking-tighter text-text-1 leading-[0.95] mb-4 group-hover:text-accent-cyan transition-colors ${isLarge ? 'text-5xl md:text-6xl' : 'text-2xl md:text-3xl'}`}>
            {formatProjectTitle(project.title)}
          </h3>
          
          <p className={`text-text-3 font-medium transition-all duration-500 mb-6 flex-1 ${isLarge ? 'text-lg' : 'text-xs'}`}>
            {project.description}
          </p>
 
          {/* TECHNOLOGY TAGS */}
          <div className="flex flex-wrap gap-1.5 mb-8">
             {(project.tags || []).map((tag, idx) => (
               <span key={`${tag}-${idx}`} className="px-2.5 py-1 rounded-lg bg-bg-2 text-text-2 border border-bg-3 dark:bg-text-1/[0.03] dark:text-text-3 dark:border-text-1/[0.05] font-mono text-[8px] uppercase tracking-widest transition-all hover:text-accent-cyan">
                 {tag}
               </span>
             ))}
          </div>
 
          {/* ACTION BAR */}
          <div className="pt-6 border-t border-text-1/[0.05] flex items-center justify-between opacity-100">
            <div className="flex flex-col">
               <span className="font-mono text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-text-3 mb-1">Source</span>
                 <span className="text-text-2 font-bold text-[9px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                   <GithubIcon size={isLarge ? 14 : 12} className="text-text-3" />
                   {isLarge ? 'View Repository' : 'Source'}
                 </span>
            </div>
            
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-text-1 opacity-0 group-hover:opacity-100 transition-opacity">GitHub</span>
              <div className={`${isLarge ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-text-1 text-bg-0 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-500`}>
                 <GithubIcon size={isLarge ? 18 : 14} />
              </div>
            </motion.div>
          </div>
        </div>
 
      </motion.a>
    </motion.div>
  );
}
