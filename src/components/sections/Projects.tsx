"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";

const categories = [
  "All",
  "Security",
  "Full-Stack",
  "AI/Vision",
  "Experiments",
] as const;
type Category = (typeof categories)[number];

const Projects = ({ projects }: { projects: Project[] }) => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        activeCategory === "All" ? true : project.category === activeCategory
      ),
    [projects, activeCategory]
  );

  // Compute dynamic counts
  const categoryCount = useMemo(() => {
    const uniqueCategories = new Set(projects.map((p) => p.category));
    return uniqueCategories.size;
  }, [projects]);

  return (
    <section id="projects" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="section-label">// 03 ─ PROJECT VAULT</span>
            <div className="h-[1px] flex-1 max-w-20 bg-accent-cyan/20" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted font-mono text-sm"
          >
            {projects.length} repositories · {categoryCount} mission types
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="relative py-2 px-1 text-sm font-mono uppercase tracking-wider transition-colors duration-300"
              style={{
                color:
                  activeCategory === category ? "#06b6d4" : "#64748b",
              }}
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  layoutId="activeProjectTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-cyan rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-text-muted font-mono text-sm">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
