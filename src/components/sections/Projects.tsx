"use client";

import React, { useState, useMemo } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectFilters from "@/components/ui/ProjectFilters";
import ProjectModal from "@/components/ui/ProjectModal";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  language: string;
  visible: boolean;
}

export default function Projects({ projects, stats }: { projects: Project[]; stats?: any }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.visible && (activeCategory === "all" || p.category === activeCategory));
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-cyan/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ... (Header) ... */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="relative">
            {/* Background Ghost Text */}
            <span className="absolute -top-12 -left-4 text-[6rem] md:text-[10rem] font-black text-text-1 opacity-[0.02] select-none pointer-events-none -z-10 uppercase tracking-tighter leading-none">
              Vault
            </span>
            
            <div className="flex items-center gap-4 mb-6">
               <div className="w-8 h-1 bg-accent-cyan rounded-full" />
               <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent-cyan font-black">Archive_Node_01</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
              Project <br /> 
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>Archive.</span>
            </h2>
          </div>
          
          <div className="max-w-md border-l-2 border-accent-cyan pl-8 py-2">
            <p className="text-text-3 text-[11px] uppercase tracking-[0.2em] font-mono leading-relaxed">
              Accessing encrypted repository: Displaying categorized intelligence from production environments and experimental labs.
            </p>
          </div>
        </div>

        {/* ─── MAIN LAYOUT ────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-16">
          
          <ProjectFilters 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />

          <div className="flex-1">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setSelectedProject(project)}
                    className="cursor-pointer"
                  >
                    <ProjectCard 
                      project={project} 
                      isLarge={index === 0 && activeCategory === "all"} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01] backdrop-blur-sm"
              >
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                 </div>
                 <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-4">No_Assets_Detected</span>
                 <p className="text-text-3 text-sm mt-2 font-mono">Filter calibration required.</p>
              </motion.div>
            )}
          </div>
        </div>

      </div>

      <ProjectModal 
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
