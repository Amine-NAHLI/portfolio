"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon, ExternalLinkIcon } from "@/components/ui/Icons";
import { formatProjectTitle } from "@/lib/utils";
import { Code2, Shield, Zap, Terminal } from "lucide-react";

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
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function ProjectCard({ project, isLarge }: { project: Project; isLarge?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const year = new Date().getFullYear();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-[2.5rem] bg-bg-1 border border-bg-3 dark:border-white/5 overflow-hidden [perspective:2000px] ${
        isLarge ? "md:col-span-2 md:row-span-2 h-[600px]" : "h-[400px]"
      }`}
    >
      {/* ─── BACKGROUND LAYER (Deepest) ───────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <span className={`absolute -bottom-10 -right-10 leading-none font-black text-text-1 opacity-[0.03] select-none pointer-events-none transition-transform duration-1000 ${
          isHovered ? "scale-110 -translate-x-10 -translate-y-10" : "scale-100"
        } ${isLarge ? 'text-[20rem]' : 'text-[12rem]'}`}>
          {project.title.charAt(0)}
        </span>
      </div>

      {/* ─── CONTENT CONTAINER (Exploded Layers) ──────── */}
      <motion.div 
        animate={{ 
          rotateX: isHovered ? 5 : 0, 
          rotateY: isHovered ? -5 : 0,
          z: isHovered ? 50 : 0 
        }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        className="relative z-10 w-full h-full p-8 md:p-12 flex flex-col justify-between [transform-style:preserve-3d]"
      >
        
        {/* TOP LAYER: Metadata & Links */}
        <div className="flex justify-between items-start [transform:translateZ(100px)]">
          <div className="flex gap-2">
            <a 
              href={project.github_url} 
              target="_blank" 
              className="w-12 h-12 rounded-2xl bg-bg-2 border border-bg-3 dark:bg-white/5 flex items-center justify-center text-text-1 hover:bg-accent-cyan hover:text-bg-0 transition-all duration-500 shadow-xl"
            >
              <GithubIcon size={22} />
            </a>
          </div>
          
          <div className="flex flex-col items-end gap-2 text-right">
             <span className="font-mono text-[9px] text-text-3 uppercase tracking-[0.4em]">{year}</span>
             <div className="flex flex-wrap justify-end gap-1.5 max-w-[240px]">
               {project.language?.split(',').map((lang, i) => (
                 <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-2 border border-bg-3 dark:bg-white/5 shadow-sm">
                   <div className="w-1 h-1 rounded-full bg-accent-cyan" />
                   <span className="font-mono text-[8px] text-text-2 uppercase">{lang.trim()}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* MIDDLE LAYER: Title & Branding */}
        <div className="[transform:translateZ(150px)]">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 text-[9px] font-mono text-accent-cyan uppercase tracking-widest">
               {project.category}
             </span>
             <div className="flex-1 h-px bg-white/5" />
          </div>
          <h3 className={`font-black tracking-tighter text-text-1 leading-[1.1] group-hover:text-accent-cyan transition-colors duration-500 ${isLarge ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
            {formatProjectTitle(project.title)}
          </h3>
        </div>

        {/* BOTTOM LAYER: Description & Stats */}
        <div className="space-y-6 [transform:translateZ(80px)]">
          <p className="text-text-3 text-sm md:text-base leading-relaxed max-w-xl line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <Shield size={14} className="text-accent-cyan" />
                <span className="text-[10px] font-mono text-text-4 uppercase tracking-widest">Secure_Build</span>
             </div>
             <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent-cyan" />
                <span className="text-[10px] font-mono text-text-4 uppercase tracking-widest">CLI_Ready</span>
             </div>
          </div>
        </div>

      </motion.div>

      {/* OVERLAY SCANLINE (Tactical Feel) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </motion.div>
  );
}
