"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Skill } from "@/lib/github";
import { cn } from "@/lib/utils";

const accentBgColors: Record<string, string> = {
  Security: "bg-accent-cyan",
  "Full-Stack": "bg-accent-indigo",
  AI: "bg-accent-purple",
  Experiments: "bg-amber-500",
};

const textAccentColors: Record<string, string> = {
  Security: "text-accent-cyan",
  "Full-Stack": "text-accent-indigo",
  AI: "text-accent-purple",
  Experiments: "text-amber-500",
};

const stripeColors: Record<string, string> = {
  Security: "from-accent-cyan/30 to-accent-cyan/0",
  "Full-Stack": "from-accent-indigo/30 to-accent-indigo/0",
  AI: "from-accent-purple/30 to-accent-purple/0",
  Experiments: "from-amber-500/30 to-amber-500/0",
};

const SkillBar = ({
  name,
  level,
  accentColor,
  delay,
}: {
  name: string;
  level: number;
  accentColor: string;
  delay: number;
}) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-sm font-medium text-text-secondary">{name}</span>
      <span className="text-xs font-mono text-text-muted">{level}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: "easeOut", delay: delay * 0.1 }}
        className={cn("h-full rounded-full", accentBgColors[accentColor] || "bg-accent-cyan")}
      />
    </div>
  </div>
);

const CategoryCard = ({
  skill,
  index,
}: {
  skill: Skill;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    className="relative p-8 rounded-2xl bg-bg-secondary/50 border border-white/10 backdrop-blur-sm overflow-hidden group hover:border-white/15 transition-all duration-300"
  >
    <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", stripeColors[skill.category] || "from-accent-cyan/30 to-transparent")} />

    <div className="flex items-center gap-3 mb-8">
      <div className={cn("w-2 h-2 rounded-full", accentBgColors[skill.category] || "bg-accent-cyan")} />
      <h3 className={cn("text-lg font-bold uppercase tracking-wider", textAccentColors[skill.category] || "text-accent-cyan")}>
        {skill.name}
      </h3>
    </div>

    <div className="mb-6">
       <p className="text-sm text-text-secondary italic mb-4">{skill.description}</p>
       <SkillBar name="Proficiency" level={skill.level} accentColor={skill.category} delay={0} />
    </div>

    <div className="flex flex-wrap gap-2">
      {skill.techs.map((tech) => (
        <span key={tech} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-text-muted font-mono uppercase">
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
);

const Stack = ({ skills }: { skills: Skill[] }) => {
  return (
    <section id="stack" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
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
            Parsed dynamically from my GitHub profile. Updated in real-time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <CategoryCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;
