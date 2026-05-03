"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";

const categories = ["All", "Security", "Full-Stack", "AI/Vision", "Experiments"] as const;
type Category = typeof categories[number];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredProjects = projects.filter((project) => 
    activeCategory === "All" ? true : project.category === activeCategory
  );

  return (
    <section id="projects" className="py-24 bg-bg overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="text-accent-cyan font-mono font-bold">// 03</span>
            <div className="h-[1px] w-12 bg-accent-cyan/30" />
            <h2 className="text-2xl font-bold tracking-widest uppercase">Project Vault</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted font-mono text-sm"
          >
            16 repositories · 4 mission types
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="relative py-2 text-sm font-mono uppercase tracking-wider transition-colors duration-300"
              style={{ color: activeCategory === category ? "#06b6d4" : "#64748b" }}
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-cyan"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
