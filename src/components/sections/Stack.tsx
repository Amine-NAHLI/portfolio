"use client";

import React from "react";
import { motion } from "framer-motion";
import { techStack, StackCategory, Tech } from "@/data/stack";
import { cn } from "@/lib/utils";

const accentBgColors: Record<string, string> = {
  cyan: "bg-accent-cyan",
  indigo: "bg-accent-indigo",
  purple: "bg-accent-purple",
  pink: "bg-pink-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
};

const textAccentColors: Record<string, string> = {
  cyan: "text-accent-cyan",
  indigo: "text-accent-indigo",
  purple: "text-accent-purple",
  pink: "text-pink-500",
  green: "text-emerald-500",
  amber: "text-amber-500",
};

const stripeColors: Record<string, string> = {
  cyan: "from-accent-cyan/30 to-accent-cyan/0",
  indigo: "from-accent-indigo/30 to-accent-indigo/0",
  purple: "from-accent-purple/30 to-accent-purple/0",
  pink: "from-pink-500/30 to-pink-500/0",
  green: "from-emerald-500/30 to-emerald-500/0",
  amber: "from-amber-500/30 to-amber-500/0",
};

/**
 * Individual skill bar with animated width.
 */
const SkillBar = ({
  tech,
  accentColor,
  delay,
}: {
  tech: Tech;
  accentColor: string;
  delay: number;
}) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-sm font-medium text-text-secondary">
        {tech.name}
      </span>
      <span className="text-xs font-mono text-text-muted">{tech.level}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${tech.level}%` }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: "easeOut", delay: delay * 0.1 }}
        className={cn("h-full rounded-full", accentBgColors[accentColor])}
      />
    </div>
  </div>
);

/**
 * Category card containing skill bars.
 */
const CategoryCard = ({
  category,
  index,
}: {
  category: StackCategory;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    className="relative p-8 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-sm overflow-hidden group hover:border-white/15 transition-all duration-300"
  >
    {/* Top accent stripe */}
    <div
      className={cn(
        "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r",
        stripeColors[category.accentColor]
      )}
    />

    {/* Category title */}
    <div className="flex items-center gap-3 mb-8">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          accentBgColors[category.accentColor]
        )}
      />
      <h3
        className={cn(
          "text-lg font-bold uppercase tracking-wider",
          textAccentColors[category.accentColor]
        )}
      >
        {category.title}
      </h3>
    </div>

    {/* Skill bars */}
    <div className="space-y-5">
      {category.techs.map((tech, i) => (
        <SkillBar
          key={tech.name}
          tech={tech}
          accentColor={category.accentColor}
          delay={i}
        />
      ))}
    </div>
  </motion.div>
);

const Stack = () => {
  return (
    <section id="stack" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="section-label">// 04 ─ TECH ARSENAL</span>
            <div className="h-[1px] flex-1 max-w-20 bg-accent-cyan/20" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techStack.map((category, i) => (
            <CategoryCard
              key={category.title}
              category={category}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
