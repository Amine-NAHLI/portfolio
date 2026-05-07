"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Shield, Code, Cpu, Activity } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { formatProjectTitle } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
}

interface ModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-0/90 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl h-full max-h-[85vh] bg-bg-1 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Column: Visuals & Scanning */}
            <div className="w-full md:w-2/5 bg-bg-2 border-r border-white/5 p-8 flex flex-col justify-between relative overflow-hidden">
               {/* Scanning Overlay */}
               <div className="absolute top-0 left-0 w-full h-1 bg-accent-cyan/40 blur-sm animate-[scan_4s_linear_infinite]" />
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
                        <Activity size={20} className="text-accent-cyan" />
                     </div>
                     <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-4">Project_Analysis</span>
                        <h4 className="text-sm font-black text-text-1">REPORT_ID: {project.id.slice(0, 8)}</h4>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] font-mono text-text-4 uppercase tracking-widest block mb-4">Core_Architecture</span>
                        <div className="flex items-center gap-4 text-text-1">
                           <Code size={24} className="text-accent-cyan" />
                           <span className="text-xl font-bold">{project.language}</span>
                        </div>
                     </div>
                     <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] font-mono text-text-4 uppercase tracking-widest block mb-4">Security_Audit</span>
                        <div className="flex items-center gap-4 text-green-500">
                           <Shield size={24} />
                           <span className="text-xl font-bold">VERIFIED_SECURE</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="relative z-10 pt-8 border-t border-white/5">
                  <span className="text-[9px] font-mono text-text-4 uppercase tracking-[0.4em] block mb-4">Access_Channels</span>
                  <div className="flex gap-4">
                     <a href={project.github_url} target="_blank" className="flex-1 flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-accent-cyan hover:text-bg-0 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest">
                        <GithubIcon size={16} /> Source
                     </a>
                  </div>
               </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
               <button 
                  onClick={onClose}
                  className="absolute top-8 right-8 p-3 rounded-full bg-white/5 text-text-4 hover:text-text-1 hover:bg-white/10 transition-all"
               >
                  <X size={20} />
               </button>

               <div className="max-w-2xl">
                  <span className="px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-6 inline-block">
                     {project.category}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-text-1 mb-8 leading-tight">
                     {formatProjectTitle(project.title)}
                  </h2>
                  <div className="h-px w-24 bg-accent-cyan mb-10" />
                  
                  <div className="space-y-12">
                     <section>
                        <h5 className="text-[10px] font-mono text-text-4 uppercase tracking-[0.4em] mb-4">Description</h5>
                        <p className="text-text-2 text-lg leading-relaxed">
                           {project.description}
                        </p>
                     </section>

                     <section>
                        <h5 className="text-[10px] font-mono text-text-4 uppercase tracking-[0.4em] mb-4">Tech_Stack</h5>
                        <div className="flex flex-wrap gap-3">
                           {project.tags.map(tag => (
                              <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-text-3 text-xs font-mono">
                                 {tag}
                              </span>
                           ))}
                        </div>
                     </section>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
