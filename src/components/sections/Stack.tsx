"use client";

import React from "react";
import { motion } from "framer-motion";
import { techStack, StackCategory, Tech } from "@/data/stack";
import { cn } from "@/lib/utils";

const accentColors: Record<string, string> = {
  cyan: "bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]",
  indigo: "bg-accent-indigo shadow-[0_0_10px_rgba(99,102,241,0.5)]",
  purple: "bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]",
  pink: "bg-[#ec4899] shadow-[0_0_10px_rgba(236,72,153,0.5)]",
  green: "bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]",
  amber: "bg-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.5)]",
};

const textAccentColors: Record<string, string> = {
  cyan: "text-accent-cyan",
  indigo: "text-accent-indigo",
  purple: "text-accent-purple",
  pink: "text-[#ec4899]",
  green: "text-[#10b981]",
  amber: "text-[#f59e0b]",
};

const SkillBar = ({ tech, accentColor }: { tech: Tech; accentColor: string }) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary">{tech.name}</span>
        <span className="text-xs font-mono text-text-muted">{tech.level}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${tech.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={cn("h-full rounded-full", accentColors[accentColor])}
        />
      </div>
    </div>
  );
};

const CategoryCard = ({ category, index }: { category: StackCategory; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="p-8 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className={cn("w-2 h-2 rounded-full", accentColors[category.accentColor])} />
        <h3 className={cn("text-lg font-bold uppercase tracking-wider", textAccentColors[category.accentColor])}>
          {category.title}
        </h3>
      </div>
      
      <div className="space-y-6">
        {category.techs.map((tech) => (
          <SkillBar key={tech.name} tech={tech} accentColor={category.accentColor} />
        ))}
      </div>
    </motion.div>
  );
};

const Stack = () => {
  return (
    <section id="stack" className="py-24 bg-bg overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="text-accent-cyan font-mono font-bold">// 04</span>
            <div className="h-[1px] w-12 bg-accent-cyan/30" />
            <h2 className="text-2xl font-bold tracking-widest uppercase">Tech Arsenal</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted font-mono text-sm"
          >
            A diverse toolkit built across security and product domains.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techStack.map((category, i) => (
            <CategoryCard key={category.title} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
